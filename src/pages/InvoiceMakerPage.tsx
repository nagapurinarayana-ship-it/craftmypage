import React, { useEffect, useReducer, useCallback, useState } from 'react'
import InvoiceForm from '../components/invoice/InvoiceForm'
import InvoicePreview from '../components/invoice/InvoicePreview'
import type { Invoice, LineItem } from '../lib/invoice'
import { createEmptyInvoice, generateId } from '../lib/invoice'
import { calculateInvoice } from '../lib/invoice-calculator'
import { saveInvoice, getInvoice, getAllInvoices, deleteInvoice, exportInvoiceJSON, importInvoiceJSON } from '../lib/invoice-storage'
import { generateInvoicePDF, sanitizeFileName } from '../lib/invoice-pdf'
import { downloadBlob } from '../lib/export'

type InvoiceAction =
  | { type: 'SET_INVOICE'; invoice: Invoice }
  | { type: 'UPDATE_INVOICE'; updates: Partial<Invoice> }
  | { type: 'ADD_LINE_ITEM' }
  | { type: 'REMOVE_LINE_ITEM'; itemId: string }
  | { type: 'DUPLICATE_LINE_ITEM'; itemId: string }

function invoiceReducer(state: Invoice, action: InvoiceAction): Invoice {
  switch (action.type) {
    case 'SET_INVOICE': return action.invoice
    case 'UPDATE_INVOICE': return { ...state, ...action.updates }
    case 'ADD_LINE_ITEM': {
      const newItem: LineItem = { id: generateId(), description: '', itemCode: '', quantity: 1, unit: 'pcs', unitPrice: 0, discount: 0, discountType: 'fixed', taxRate: 0 }
      return { ...state, lineItems: [...state.lineItems, newItem] }
    }
    case 'REMOVE_LINE_ITEM': return { ...state, lineItems: state.lineItems.filter((item) => item.id !== action.itemId) }
    case 'DUPLICATE_LINE_ITEM': {
      const item = state.lineItems.find((line) => line.id === action.itemId)
      return item ? { ...state, lineItems: [...state.lineItems, { ...item, id: generateId() }] } : state
    }
    default: return state
  }
}

export default function InvoiceMakerPage() {
  const [invoice, dispatch] = useReducer(invoiceReducer, null, () => createEmptyInvoice(generateId()))
  const invoiceWithCalcs = React.useMemo(() => ({ ...invoice, calculations: calculateInvoice(invoice) }), [invoice])
  const [drafts, setDrafts] = useState<Invoice[]>([])
  const [showDraftsList, setShowDraftsList] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [draftName, setDraftName] = useState(invoiceWithCalcs.draftName)

  useEffect(() => { getAllInvoices().then(setDrafts).catch(() => setDrafts([])) }, [])
  useEffect(() => { dispatch({ type: 'UPDATE_INVOICE', updates: { draftName } }) }, [draftName])

  const handleInvoiceChange = useCallback((updatedInvoice: Invoice) => dispatch({ type: 'SET_INVOICE', invoice: updatedInvoice }), [])
  const handleAddLineItem = useCallback(() => dispatch({ type: 'ADD_LINE_ITEM' }), [])
  const handleRemoveLineItem = useCallback((itemId: string) => dispatch({ type: 'REMOVE_LINE_ITEM', itemId }), [])
  const handleDuplicateLineItem = useCallback((itemId: string) => dispatch({ type: 'DUPLICATE_LINE_ITEM', itemId }), [])

  const handleSaveDraft = useCallback(async () => {
    if (!draftName.trim()) return alert('Please enter a draft name')
    try {
      await saveInvoice({ ...invoiceWithCalcs, draftName: draftName.trim() })
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
    } catch (error) {
      alert(`Failed to delete draft: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const handleExportJSON = useCallback(async () => {
    try {
      const json = await exportInvoiceJSON(invoiceWithCalcs)
      downloadBlob(new Blob([json], { type: 'application/json' }), `invoice-${invoiceWithCalcs.invoiceDetails.invoiceNumber}.json`)
    } catch (error) {
      alert(`Failed to export: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [invoiceWithCalcs])

  const handleImportJSON = useCallback(async () => {
    if (!importJson.trim()) return alert('Please paste JSON data')
    try {
      const imported = await importInvoiceJSON(importJson)
      dispatch({ type: 'SET_INVOICE', invoice: imported })
      setDraftName(imported.draftName)
      setImportJson('')
      setShowImportExport(false)
    } catch (error) {
      alert(`Failed to import: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [importJson])

  const handleDownloadPDF = useCallback(async () => {
    try {
      const pdfBlob = await generateInvoicePDF(invoiceWithCalcs)
      downloadBlob(pdfBlob, `invoice-${sanitizeFileName(invoiceWithCalcs.invoiceDetails.invoiceNumber)}.pdf`)
    } catch (error) {
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [invoiceWithCalcs])

  const handlePrint = useCallback(() => window.print(), [])

  const handleReset = useCallback(() => {
    if (!confirm('Are you sure you want to reset the invoice? This will clear all data.')) return
    dispatch({ type: 'SET_INVOICE', invoice: createEmptyInvoice(generateId()) })
    setDraftName('Untitled Invoice')
  }, [])

  const handleDuplicate = useCallback(() => {
    const newInvoice = {
      ...invoiceWithCalcs,
      id: generateId(),
      invoiceDetails: { ...invoiceWithCalcs.invoiceDetails, invoiceNumber: generateId().substring(0, 8).toUpperCase() },
      draftName: `${invoiceWithCalcs.draftName} (Copy)`,
    }
    dispatch({ type: 'SET_INVOICE', invoice: newInvoice })
    setDraftName(newInvoice.draftName)
  }, [invoiceWithCalcs])

  return (
    <>
      <div className="cmp-tool-shell">
        <div className="cmp-tool-header print:hidden sticky top-20 z-30">
          <div className="min-w-0">
            <span className="cmp-eyebrow">Invoice Maker</span>
            <h1 className="cmp-tool-title mt-3">Create a professional invoice in minutes.</h1>
            <p className="cmp-tool-subtitle">Add customers, items, taxes and payment details, then export the finished invoice as a PDF.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="cmp-badge">Local drafts</span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-600">PDF export</span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-600">No server upload</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <input type="text" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Invoice name..." className="min-w-48 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            <button type="button" onClick={handleSaveDraft} className="cmp-secondary-btn px-4 py-2">Save Draft</button>
            <button type="button" onClick={() => setShowDraftsList(!showDraftsList)} className="cmp-secondary-btn px-4 py-2">Load Draft</button>
            <button type="button" onClick={handleDownloadPDF} className="cmp-primary-btn px-4 py-2">Download PDF</button>
          </div>
        </div>

        {showDraftsList && (
          <div className="cmp-surface print:hidden mb-6 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Recent drafts</p>
                <p className="mt-1 text-xs text-slate-500">Saved locally in this browser.</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">{drafts.length}</span>
            </div>
            {drafts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No saved drafts yet.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {drafts.map((draft) => (
                  <div key={draft.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{draft.draftName}</p>
                    <p className="mt-1 text-xs text-slate-500">{draft.invoiceDetails.invoiceNumber} · {new Date(draft.updatedAt).toLocaleDateString()}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => handleLoadDraft(draft.id)} className="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">Load</button>
                      <button type="button" onClick={() => handleDeleteDraft(draft.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="print:hidden mb-5 flex flex-wrap gap-2">
          <button type="button" onClick={handlePrint} className="cmp-secondary-btn px-4 py-2">Print</button>
          <button type="button" onClick={handleDuplicate} className="cmp-secondary-btn px-4 py-2">Duplicate</button>
          <button type="button" onClick={() => setShowImportExport(!showImportExport)} className="cmp-secondary-btn px-4 py-2">Import / Export</button>
          <button type="button" onClick={handleReset} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Reset</button>
        </div>

        {showImportExport && (
          <div className="cmp-surface print:hidden mb-6 grid gap-5 p-5 lg:grid-cols-2">
            <div>
              <p className="font-semibold text-slate-900">Export invoice data</p>
              <p className="mt-1 text-xs text-slate-500">Keep a portable copy of the current invoice JSON.</p>
              <button type="button" onClick={handleExportJSON} className="cmp-secondary-btn mt-4 px-4 py-2">Export JSON</button>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Import invoice data</p>
              <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="Paste exported invoice JSON here..." className="mt-3 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" rows={6} />
              <button type="button" onClick={handleImportJSON} className="cmp-primary-btn mt-2 px-4 py-2">Import Invoice</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,.85fr)]">
          <div className="cmp-surface overflow-auto p-5 sm:p-6" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Invoice details</h2>
                <p className="mt-1 text-xs text-slate-500">Complete the form and the preview updates as you type.</p>
              </div>
            </div>
            <InvoiceForm invoice={invoiceWithCalcs} onInvoiceChange={handleInvoiceChange} onAddLineItem={handleAddLineItem} onRemoveLineItem={handleRemoveLineItem} onDuplicateLineItem={handleDuplicateLineItem} />
          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-semibold text-slate-800">Live preview</p>
                <p className="text-xs text-slate-500">This is how the exported invoice will look.</p>
              </div>
            </div>
            <InvoicePreview invoice={invoiceWithCalcs} />
          </div>
        </div>
      </div>

      <style>{`@media print { body { margin: 0; padding: 0; background: white; } .print\\:hidden { display: none !important; } }`}</style>
    </>
  )
}
