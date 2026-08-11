import React from 'react'
import type { Invoice } from '../lib/invoice'
import { formatCurrency } from '../lib/invoice'
import { calculateInvoice } from '../lib/invoice-calculator'

interface InvoicePreviewProps {
  invoice: Invoice
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const calc = calculateInvoice(invoice)
  const currencyConfig = formatCurrency(0, invoice.invoiceDetails.currency)

  const renderProfessionalTemplate = () => (
    <div className="bg-white p-12 min-h-screen" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {invoice.business.logo && (
            <img
              src={invoice.business.logo}
              alt="Logo"
              className="h-20 mb-4 object-contain"
            />
          )}
          <h1 className="text-4xl font-bold" style={{ color: invoice.accentColor }}>
            {invoice.business.name}
          </h1>
          {invoice.business.contactPerson && (
            <p className="text-gray-600 text-sm">{invoice.business.contactPerson}</p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {invoice.invoiceDetails.title}
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Invoice #</strong> {invoice.invoiceDetails.invoiceNumber}
          </p>
        </div>
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <p className="font-bold text-gray-800 mb-2">From:</p>
          <p>{invoice.business.name}</p>
          {invoice.business.address && <p>{invoice.business.address}</p>}
          {invoice.business.city && (
            <p>
              {invoice.business.city}
              {invoice.business.state ? `, ${invoice.business.state}` : ''}
            </p>
          )}
          {invoice.business.postalCode && <p>{invoice.business.postalCode}</p>}
          {invoice.business.phone && <p>Phone: {invoice.business.phone}</p>}
          {invoice.business.email && <p>Email: {invoice.business.email}</p>}
          {invoice.business.taxId && <p>Tax ID: {invoice.business.taxId}</p>}
        </div>

        <div>
          <p className="font-bold text-gray-800 mb-2">Bill To:</p>
          <p>{invoice.customer.name}</p>
          {invoice.customer.billingAddress && <p>{invoice.customer.billingAddress}</p>}
          {invoice.customer.billingCity && (
            <p>
              {invoice.customer.billingCity}
              {invoice.customer.billingState ? `, ${invoice.customer.billingState}` : ''}
            </p>
          )}
          {invoice.customer.billingPostalCode && <p>{invoice.customer.billingPostalCode}</p>}
        </div>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-4 gap-4 mb-8 text-sm bg-gray-50 p-4 rounded">
        <div>
          <p className="text-gray-600 text-xs">Issue Date</p>
          <p className="font-bold">{invoice.invoiceDetails.issueDate}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">Due Date</p>
          <p className="font-bold">{invoice.invoiceDetails.dueDate}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">Currency</p>
          <p className="font-bold">{invoice.invoiceDetails.currency}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">Payment Terms</p>
          <p className="font-bold">{invoice.invoiceDetails.paymentTerms}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-8 text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: invoice.accentColor, color: 'white' }}>
            <th className="p-3 text-left font-bold">Description</th>
            <th className="p-3 text-center font-bold">Quantity</th>
            <th className="p-3 text-right font-bold">Unit Price</th>
            <th className="p-3 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, index) => {
            const itemAmount = item.quantity * item.unitPrice - Math.min(item.discount, item.quantity * item.unitPrice)
            return (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 border-b">{item.description}</td>
                <td className="p-3 text-center border-b">{item.quantity}</td>
                <td className="p-3 text-right border-b">{formatCurrency(item.unitPrice, invoice.invoiceDetails.currency)}</td>
                <td className="p-3 text-right border-b">
                  {formatCurrency(Math.max(0, itemAmount), invoice.invoiceDetails.currency)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="text-right text-gray-600">Subtotal:</div>
            <div className="text-right font-bold">
              {formatCurrency(calc.subtotal, invoice.invoiceDetails.currency)}
            </div>

            {calc.discountAmount > 0 && (
              <>
                <div className="text-right text-gray-600">Discount:</div>
                <div className="text-right font-bold">
                  -{formatCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}
                </div>
              </>
            )}

            {calc.taxAmount > 0 && (
              <>
                <div className="text-right text-gray-600">Tax:</div>
                <div className="text-right font-bold">
                  {formatCurrency(calc.taxAmount, invoice.invoiceDetails.currency)}
                </div>
              </>
            )}
          </div>

          <div
            className="border-t-2 pt-2"
            style={{ borderColor: invoice.accentColor }}
          >
            <div className="grid grid-cols-2 gap-2 text-lg">
              <div className="text-right font-bold">Total:</div>
              <div className="text-right font-bold" style={{ color: invoice.accentColor }}>
                {formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Payment Info */}
      {invoice.paymentInfo.notes && (
        <div className="mb-6 text-sm">
          <p className="font-bold text-gray-800 mb-2">Notes:</p>
          <p className="text-gray-600">{invoice.paymentInfo.notes}</p>
        </div>
      )}

      {invoice.paymentInfo.instructions && (
        <div className="mb-6 text-sm">
          <p className="font-bold text-gray-800 mb-2">Payment Instructions:</p>
          <p className="text-gray-600">{invoice.paymentInfo.instructions}</p>
        </div>
      )}

      {invoice.paymentInfo.thankYouMessage && (
        <div className="text-center text-sm text-gray-600 italic mb-6">
          {invoice.paymentInfo.thankYouMessage}
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-gray-500 text-center">
        <p>This invoice was created with CraftMyPage — Free invoice maker, no account needed</p>
      </div>
    </div>
  )

  const renderMinimalTemplate = () => (
    <div className="bg-white p-8 min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline">
          <div>
            {invoice.business.logo && (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="h-16 mb-3 object-contain"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{invoice.business.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {invoice.invoiceDetails.title}
            </p>
            <p className="text-sm text-gray-600">{invoice.invoiceDetails.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900 mb-2">From</p>
          <p>{invoice.business.name}</p>
          {invoice.business.address && <p>{invoice.business.address}</p>}
          {invoice.business.city && (
            <p>
              {invoice.business.city}
              {invoice.business.state ? `, ${invoice.business.state}` : ''}
              {invoice.business.postalCode ? ` ${invoice.business.postalCode}` : ''}
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold text-gray-900 mb-2">To</p>
          <p>{invoice.customer.name}</p>
          {invoice.customer.billingAddress && <p>{invoice.customer.billingAddress}</p>}
          {invoice.customer.billingCity && (
            <p>
              {invoice.customer.billingCity}
              {invoice.customer.billingState ? `, ${invoice.customer.billingState}` : ''}
              {invoice.customer.billingPostalCode ? ` ${invoice.customer.billingPostalCode}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm text-gray-700 pb-8 border-b">
        <div>
          <p className="text-gray-600 text-xs">Issued</p>
          <p className="font-semibold">{invoice.invoiceDetails.issueDate}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs">Due</p>
          <p className="font-semibold">{invoice.invoiceDetails.dueDate}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        {invoice.lineItems.map((item) => {
          const itemAmount = item.quantity * item.unitPrice - Math.min(item.discount, item.quantity * item.unitPrice)
          return (
            <div key={item.id} className="flex justify-between items-start mb-4 pb-4 border-b text-sm">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.description}</p>
                <p className="text-gray-600 text-xs">
                  {item.quantity} × {formatCurrency(item.unitPrice, invoice.invoiceDetails.currency)}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatCurrency(Math.max(0, itemAmount), invoice.invoiceDetails.currency)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-48">
          {calc.discountAmount > 0 && (
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Discount:</span>
              <span>
                -{formatCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}
              </span>
            </div>
          )}

          {calc.taxAmount > 0 && (
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Tax:</span>
              <span>{formatCurrency(calc.taxAmount, invoice.invoiceDetails.currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center">
        <p>Created with CraftMyPage</p>
      </div>
    </div>
  )

  const renderModernTemplate = () => (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero Section */}
      <div className="p-8" style={{ backgroundColor: invoice.accentColor, color: 'white' }}>
        <div className="flex justify-between items-start">
          <div>
            {invoice.business.logo && (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="h-14 mb-4 object-contain"
              />
            )}
            <h1 className="text-3xl font-bold">{invoice.business.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{invoice.invoiceDetails.title}</p>
            <p className="text-sm opacity-90"># {invoice.invoiceDetails.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Contact */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-3">From</p>
            <div className="text-gray-600">
              <p className="font-semibold text-gray-900">{invoice.business.name}</p>
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
              {invoice.business.address && <p>{invoice.business.address}</p>}
            </div>
          </div>

          <div>
            <p className="font-bold text-gray-900 mb-3">Bill To</p>
            <div className="text-gray-600">
              <p className="font-semibold text-gray-900">{invoice.customer.name}</p>
              {invoice.customer.email && <p>{invoice.customer.email}</p>}
              {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
              {invoice.customer.billingAddress && <p>{invoice.customer.billingAddress}</p>}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-4 gap-4 mb-8 text-xs">
          <div>
            <p className="text-gray-500 font-semibold">Issue Date</p>
            <p className="text-gray-900 font-bold">{invoice.invoiceDetails.issueDate}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Due Date</p>
            <p className="text-gray-900 font-bold">{invoice.invoiceDetails.dueDate}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Currency</p>
            <p className="text-gray-900 font-bold">{invoice.invoiceDetails.currency}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Terms</p>
            <p className="text-gray-900 font-bold">{invoice.invoiceDetails.paymentTerms}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
              <th className="text-left py-3 font-bold text-gray-900">Description</th>
              <th className="text-center py-3 font-bold text-gray-900">Qty</th>
              <th className="text-right py-3 font-bold text-gray-900">Rate</th>
              <th className="text-right py-3 font-bold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => {
              const itemAmount = item.quantity * item.unitPrice - Math.min(item.discount, item.quantity * item.unitPrice)
              return (
                <tr key={item.id} className="border-b text-gray-700">
                  <td className="py-3">{item.description}</td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">
                    {formatCurrency(item.unitPrice, invoice.invoiceDetails.currency)}
                  </td>
                  <td className="text-right py-3 font-semibold text-gray-900">
                    {formatCurrency(Math.max(0, itemAmount), invoice.invoiceDetails.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="space-y-2 text-sm mb-4">
              {calc.discountAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}</span>
                </div>
              )}
              {calc.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>{formatCurrency(calc.taxAmount, invoice.invoiceDetails.currency)}</span>
                </div>
              )}
            </div>
            <div
              className="flex justify-between text-xl font-bold p-4 text-white"
              style={{ backgroundColor: invoice.accentColor }}
            >
              <span>Total</span>
              <span>{formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-8 text-center text-sm text-white"
        style={{ backgroundColor: invoice.accentColor }}
      >
        <p>Thank you for your business!</p>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {invoice.template === 'professional' && renderProfessionalTemplate()}
        {invoice.template === 'minimal' && renderMinimalTemplate()}
        {invoice.template === 'modern' && renderModernTemplate()}
      </div>
    </div>
  )
}
