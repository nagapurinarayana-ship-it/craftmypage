import React, { useEffect, useReducer, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import InvoiceForm from '../components/invoice/InvoiceForm'
import InvoicePreview from '../components/invoice/InvoicePreview'
import type { Invoice, LineItem } from '../lib/invoice'
import { createEmptyInvoice, generateId } from '../lib/invoice'
import { calculateInvoice } from '../lib/invoice-calculator'
import { saveInvoice, getInvoice, getAllInvoices, deleteInvoice, exportInvoiceJSON, importInvoiceJSON } from '../lib/invoice-storage'
import { generateInvoicePDF, sanitizeFileName } from '../lib/invoice-pdf'
import { downloadBlob } from '../lib/export'
import { SITE_URL } from '../config/site'

type InvoiceAction =
  | { type: 'SET_INVOICE'; invoice: Invoice }
  | { type: 'UPDATE_INVOICE'; updates: Partial<Invoice> }
  | { type: 'ADD_LINE_ITEM' }
  | { type: 'REMOVE_LINE_ITEM'; itemId: string }
  | { type: 'DUPLICATE_LINE_ITEM'; itemId: string }

function invoiceReducer(state: Invoice, action: InvoiceAction): Invoice {
  switch (action.type) {
    case 'SET_INVOICE':
      return action.invoice

    case 'UPDATE_INVOICE':
      return {
        ...state,
        ...action.updates,
      }

    case 'ADD_LINE_ITEM': {
      const newItem: LineItem = {
        id: generateId(),
        description: '',
        itemCode: '',
        quantity: 1,
        unit: 'pcs',
        unitPrice: 0,
        discount: 0,
        discountType: 'fixed',
        taxRate: 0,
      }
      return {
        ...state,
        lineItems: [...state.lineItems, newItem],
      }
    }

    case 'REMOVE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== action.itemId),
      }

    case 'DUPLICATE_LINE_ITEM': {
      const itemToDuplicate = state.lineItems.find((item) => item.id === action.itemId)
      if (!itemToDuplicate) return state

      const newItem: LineItem = {
        ...itemToDuplicate,
        id: generateId(),
      }
      return {
        ...state,
        lineItems: [...state.lineItems, newItem],
      }
    }

    default:
      return state
  }
}

export default function InvoiceMakerPage() {
  const [invoice, dispatch] = useReducer(invoiceReducer, null, () => createEmptyInvoice(generateId()))

  const invoiceWithCalcs = React.useMemo(() => {
    return {
      ...invoice,
      calculations: calculateInvoice(invoice),
    }
  }, [invoice])

  const [drafts, setDrafts] = useState<Invoice[]>([])
  const [showDraftsList, setShowDraftsList] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [draftName, setDraftName] = useState(invoiceWithCalcs.draftName)

  useEffect(() => {
    getAllInvoices().then(setDrafts).catch(() => setDrafts([]))
  }, [])

  useEffect(() => {
    dispatch({
      type: 'UPDATE_INVOICE',
      updates: { draftName },
    })
  }, [draftName])

  const handleInvoiceChange = useCallback((updatedInvoice: Invoice) => {
    dispatch({ type: 'SET_INVOICE', invoice: updatedInvoice })
  }, [])

  const handleAddLineItem = useCallback(() => {
    dispatch({ type: 'ADD_LINE_ITEM' })
  }, [])

  const handleRemoveLineItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_LINE_ITEM', itemId })
  }, [])

  const handleDuplicateLineItem = useCallback((itemId: string) => {
    dispatch({ type: 'DUPLICATE_LINE_ITEM', itemId })
  }, [])

  const handleSaveDraft = useCallback(async () => {
    if (!draftName.trim()) {
      alert('Please enter a draft name')
      return
    }

    try {
      const draftToSave = {
        ...invoiceWithCalcs,
        draftName: draftName.trim(),
      }
      await saveInvoice(draftToSave)
      setDrafts(await getAllInvoices())
      alert(`Draft "${draftName}" saved successfully!`)
    } catch (error) {
      alert(`Failed to save draft: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [invoiceWithCalcs, draftName])

  const handleLoadDraft = useCallback(async (draftId: string) => {
    try {
      const loaded = await getInvoice(draftId)
      if (loaded) {
        dispatch({ type: 'SET_INVOICE', invoice: loaded })
        setDraftName(loaded.draftName)
        setShowDraftsList(false)
        alert(`Draft "${loaded.draftName}" loaded`)
      }
    } catch (error) {
      alert(`Failed to load draft: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const handleDeleteDraft = useCallback(async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return

    try {
      await deleteInvoice(draftId)
      setDrafts(await getAllInvoices())
      alert('Draft deleted')
    } catch (error) {
      alert(`Failed to delete draft: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const handleExportJSON = useCallback(async () => {
    try {
      const json = await exportInvoiceJSON(invoiceWithCalcs)
      const blob = new Blob([json], { type: 'application/json' })
      downloadBlob(blob, `invoice-${invoiceWithCalcs.invoiceDetails.invoiceNumber}.json`)
      alert('Invoice data exported as JSON')
    } catch (error) {
      alert(`Failed to export: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [invoiceWithCalcs])

  const handleImportJSON = useCallback(async () => {
    if (!importJson.trim()) {
      alert('Please paste JSON data')
      return
    }

    try {
      const imported = await importInvoiceJSON(importJson)
      dispatch({ type: 'SET_INVOICE', invoice: imported })
      setDraftName(imported.draftName)
      setImportJson('')
      setShowImportExport(false)
      alert('Invoice imported successfully!')
    } catch (error) {
      alert(`Failed to import: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [importJson])

  const handleDownloadPDF = useCallback(async () => {
    try {
      const pdfBlob = await generateInvoicePDF(invoiceWithCalcs)
      const filename = `invoice-${sanitizeFileName(invoiceWithCalcs.invoiceDetails.invoiceNumber)}.pdf`
      downloadBlob(pdfBlob, filename)
    } catch (error) {
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [invoiceWithCalcs])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleReset = useCallback(() => {
    if (!confirm('Are you sure you want to reset the invoice? This will clear all data.')) return
    dispatch({ type: 'SET_INVOICE', invoice: createEmptyInvoice(generateId()) })
    setDraftName('Untitled Invoice')
  }, [])

  const handleDuplicate = useCallback(() => {
    const newInvoice = {
      ...invoiceWithCalcs,
      id: generateId(),
      invoiceDetails: {
        ...invoiceWithCalcs.invoiceDetails,
        invoiceNumber: generateId().substring(0, 8).toUpperCase(),
      },
      draftName: `${invoiceWithCalcs.draftName} (Copy)`,
    }
    dispatch({ type: 'SET_INVOICE', invoice: newInvoice })
    setDraftName(newInvoice.draftName)
  }, [invoiceWithCalcs])

  return (
    <>
      <Helmet>
        <title>Free Invoice Maker — Create & Download PDF Invoices</title>
        <meta
          name="description"
          content="Create professional PDF invoices for free. Add items, taxes, discounts and your logo, then download privately with no account, watermark or uploads."
        />
        <link rel="canonical" href={`${SITE_URL}/tools/invoice-maker`} />
      </Helmet>

      <div className="print:hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Free Invoice Maker</h1>
            <p className="text-gray-600 mt-1">
              Create professional invoices and download them as PDF. No account, no watermark and no uploads.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Invoice name..."
              className="flex-1 min-w-48 px-3 py-2 border rounded-md text-sm"
            />
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              💾 Save Draft
            </button>
            <button
              type="button"
              onClick={() => setShowDraftsList(!showDraftsList)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              📂 Load Draft
            </button>
          </div>

          {showDraftsList && drafts.length > 0 && (
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="font-semibold text-sm mb-3">Recent Drafts:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-white border rounded-md p-3 text-sm">
                    <p className="font-medium text-gray-900">{draft.draftName}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {draft.invoiceDetails.invoiceNumber} • {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadDraft(draft.id)}
                        className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200 hover:bg-blue-100"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              📥 Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
            >
              🖨️ Print
            </button>
            <button
              type="button"
              onClick={handleDuplicate}
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
            >
              📋 Duplicate
            </button>
            <button
              type="button"
              onClick={() => setShowImportExport(!showImportExport)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700"
            >
              ⤴️ Import/Export
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500"
            >
              🔄 Reset
            </button>
          </div>

          {showImportExport && (
            <div className="border rounded-md p-4 bg-gray-50 space-y-3">
              <div>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full px-3 py-2 bg-cyan-100 text-cyan-700 border border-cyan-300 rounded-md text-sm font-medium hover:bg-cyan-200"
                >
                  📤 Export as JSON
                </button>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Import JSON:</p>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste exported invoice JSON here..."
                  className="w-full px-3 py-2 border rounded-md text-sm font-mono text-xs"
                  rows={6}
                />
                <button
                  type="button"
                  onClick={handleImportJSON}
                  className="mt-2 w-full px-3 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700"
                >
                  Import Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="print:hidden grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="p-6">
            <InvoiceForm
              invoice={invoiceWithCalcs}
              onInvoiceChange={handleInvoiceChange}
              onAddLineItem={handleAddLineItem}
              onRemoveLineItem={handleRemoveLineItem}
              onDuplicateLineItem={handleDuplicateLineItem}
            />
          </div>
        </div>

        <div
          className="bg-gray-100 rounded-lg overflow-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <InvoicePreview invoice={invoiceWithCalcs} />
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
