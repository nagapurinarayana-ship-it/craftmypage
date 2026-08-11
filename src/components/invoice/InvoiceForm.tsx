import React, { useCallback } from 'react'
import type { Invoice, LineItem } from '../lib/invoice'
import { generateId } from '../lib/invoice'

interface InvoiceFormProps {
  invoice: Invoice
  onInvoiceChange: (invoice: Invoice) => void
  onAddLineItem: () => void
  onRemoveLineItem: (itemId: string) => void
  onDuplicateLineItem: (itemId: string) => void
}

export default function InvoiceForm({
  invoice,
  onInvoiceChange,
  onAddLineItem,
  onRemoveLineItem,
  onDuplicateLineItem,
}: InvoiceFormProps) {
  const updateBusiness = useCallback(
    (updates: Partial<typeof invoice.business>) => {
      onInvoiceChange({
        ...invoice,
        business: { ...invoice.business, ...updates },
      })
    },
    [invoice, onInvoiceChange]
  )

  const updateCustomer = useCallback(
    (updates: Partial<typeof invoice.customer>) => {
      onInvoiceChange({
        ...invoice,
        customer: { ...invoice.customer, ...updates },
      })
    },
    [invoice, onInvoiceChange]
  )

  const updateInvoiceDetails = useCallback(
    (updates: Partial<typeof invoice.invoiceDetails>) => {
      onInvoiceChange({
        ...invoice,
        invoiceDetails: { ...invoice.invoiceDetails, ...updates },
      })
    },
    [invoice, onInvoiceChange]
  )

  const updateLineItem = useCallback(
    (itemId: string, updates: Partial<LineItem>) => {
      onInvoiceChange({
        ...invoice,
        lineItems: invoice.lineItems.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      })
    },
    [invoice, onInvoiceChange]
  )

  const updateSettings = useCallback(
    (updates: Partial<typeof invoice.settings>) => {
      onInvoiceChange({
        ...invoice,
        settings: { ...invoice.settings, ...updates },
      })
    },
    [invoice, onInvoiceChange]
  )

  const updatePaymentInfo = useCallback(
    (updates: Partial<typeof invoice.paymentInfo>) => {
      onInvoiceChange({
        ...invoice,
        paymentInfo: { ...invoice.paymentInfo, ...updates },
      })
    },
    [invoice, onInvoiceChange]
  )

  const handleLogoUpload = useCallback(
    (file: File | null) => {
      if (!file) {
        updateBusiness({ logo: null })
        return
      }

      // Validate file type and size
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, or WebP image.')
        return
      }

      if (file.size > maxSize) {
        alert('Image size must be less than 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result
        if (typeof base64 === 'string') {
          updateBusiness({ logo: base64 })
        }
      }
      reader.readAsDataURL(file)
    },
    [updateBusiness]
  )

  return (
    <div className="space-y-8">
      {/* Business Details Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Business Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={invoice.business.name}
              onChange={(e) => updateBusiness({ name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={invoice.business.contactPerson}
              onChange={(e) => updateBusiness({ contactPerson: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Contact person"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={invoice.business.email}
              onChange={(e) => updateBusiness({ email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={invoice.business.phone}
              onChange={(e) => updateBusiness({ phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={invoice.business.address}
              onChange={(e) => updateBusiness({ address: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={invoice.business.city}
              onChange={(e) => updateBusiness({ city: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Region
            </label>
            <input
              type="text"
              value={invoice.business.state}
              onChange={(e) => updateBusiness({ state: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="State or region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={invoice.business.postalCode}
              onChange={(e) => updateBusiness({ postalCode: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Postal code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={invoice.business.country}
              onChange={(e) => updateBusiness({ country: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={invoice.business.website}
              onChange={(e) => updateBusiness({ website: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / GSTIN
            </label>
            <input
              type="text"
              value={invoice.business.taxId}
              onChange={(e) => updateBusiness({ taxId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Tax identification number"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Logo
          </label>
          <div className="flex items-center gap-4">
            {invoice.business.logo && (
              <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={invoice.business.logo}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                className="block text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, or WebP. Max 5MB. Processed locally, never uploaded.
              </p>
            </div>
            {invoice.business.logo && (
              <button
                onClick={() => updateBusiness({ logo: null })}
                className="px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Customer Details Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={invoice.customer.name}
              onChange={(e) => updateCustomer({ name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Customer or company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={invoice.customer.contactPerson}
              onChange={(e) => updateCustomer({ contactPerson: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Contact person"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={invoice.customer.email}
              onChange={(e) => updateCustomer({ email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={invoice.customer.phone}
              onChange={(e) => updateCustomer({ phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <input
              type="text"
              value={invoice.customer.billingAddress}
              onChange={(e) => updateCustomer({ billingAddress: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={invoice.customer.billingCity}
              onChange={(e) => updateCustomer({ billingCity: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Region
            </label>
            <input
              type="text"
              value={invoice.customer.billingState}
              onChange={(e) => updateCustomer({ billingState: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="State or region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={invoice.customer.billingPostalCode}
              onChange={(e) => updateCustomer({ billingPostalCode: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Postal code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={invoice.customer.billingCountry}
              onChange={(e) => updateCustomer({ billingCountry: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / GSTIN
            </label>
            <input
              type="text"
              value={invoice.customer.taxId}
              onChange={(e) => updateCustomer({ taxId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Customer tax ID"
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={invoice.customer.shippingAddressSame}
              onChange={(e) => updateCustomer({ shippingAddressSame: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Shipping address is the same as billing</span>
          </label>
        </div>

        {!invoice.customer.shippingAddressSame && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                value={invoice.customer.shippingAddress}
                onChange={(e) => updateCustomer({ shippingAddress: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={invoice.customer.shippingCity}
                onChange={(e) => updateCustomer({ shippingCity: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Region
              </label>
              <input
                type="text"
                value={invoice.customer.shippingState}
                onChange={(e) => updateCustomer({ shippingState: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="State or region"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={invoice.customer.shippingPostalCode}
                onChange={(e) => updateCustomer({ shippingPostalCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Postal code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={invoice.customer.shippingCountry}
                onChange={(e) => updateCustomer({ shippingCountry: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Country"
              />
            </div>
          </div>
        )}
      </section>

      {/* Invoice Details Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number *
            </label>
            <input
              type="text"
              value={invoice.invoiceDetails.invoiceNumber}
              onChange={(e) => updateInvoiceDetails({ invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="INV-2026-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <select
              value={invoice.invoiceDetails.currency}
              onChange={(e) =>
                updateInvoiceDetails({ currency: e.target.value as any })
              }
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date *
            </label>
            <input
              type="date"
              value={invoice.invoiceDetails.issueDate}
              onChange={(e) => updateInvoiceDetails({ issueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              value={invoice.invoiceDetails.dueDate}
              onChange={(e) => updateInvoiceDetails({ dueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms
            </label>
            <input
              type="text"
              value={invoice.invoiceDetails.paymentTerms}
              onChange={(e) => updateInvoiceDetails({ paymentTerms: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="e.g., Net 30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <input
              type="text"
              value={invoice.invoiceDetails.referenceNumber}
              onChange={(e) => updateInvoiceDetails({ referenceNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="PO number or reference"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Title
            </label>
            <input
              type="text"
              value={invoice.invoiceDetails.title}
              onChange={(e) => updateInvoiceDetails({ title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Invoice"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project/Service Period
            </label>
            <input
              type="text"
              value={invoice.invoiceDetails.projectPeriod}
              onChange={(e) => updateInvoiceDetails({ projectPeriod: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="e.g., Jan 1 - Jan 31, 2026"
            />
          </div>
        </div>
      </section>

      {/* Line Items Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Line Items</h2>

        <div className="space-y-4">
          {invoice.lineItems.map((item, index) => (
            <div key={item.id} className="border rounded-md p-4 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(item.id, { description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="Item or service description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Code (HSN/SAC)
                  </label>
                  <input
                    type="text"
                    value={item.itemCode}
                    onChange={(e) =>
                      updateLineItem(item.id, { itemCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="HSN/SAC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, {
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      updateLineItem(item.id, { unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="pcs, hrs, kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateLineItem(item.id, {
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        updateLineItem(item.id, {
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="0"
                    />
                    <select
                      value={item.discountType}
                      onChange={(e) =>
                        updateLineItem(item.id, {
                          discountType: e.target.value as 'fixed' | 'percentage',
                        })
                      }
                      className="px-2 py-2 border rounded-md text-sm"
                    >
                      <option value="fixed">₹</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.taxRate}
                    onChange={(e) =>
                      updateLineItem(item.id, {
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onDuplicateLineItem(item.id)}
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onRemoveLineItem(item.id)}
                  className="text-sm px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onAddLineItem}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          + Add Line Item
        </button>
      </section>

      {/* Tax Settings Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tax Settings</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tax Mode
          </label>
          <select
            value={invoice.settings.taxMode}
            onChange={(e) => updateSettings({ taxMode: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="none">No Tax</option>
            <option value="simple">Simple Sales Tax / VAT</option>
            <option value="india-gst">India GST</option>
          </select>
        </div>

        {invoice.settings.taxMode === 'simple' && invoice.settings.simpleTax && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Label
              </label>
              <input
                type="text"
                value={invoice.settings.simpleTax.taxLabel}
                onChange={(e) =>
                  updateSettings({
                    simpleTax: { ...invoice.settings.simpleTax!, taxLabel: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="VAT, Sales Tax, etc."
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={invoice.settings.simpleTax.inclusive}
                onChange={(e) =>
                  updateSettings({
                    simpleTax: { ...invoice.settings.simpleTax!, inclusive: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Tax is inclusive (included in prices)</span>
            </label>
          </div>
        )}

        {invoice.settings.taxMode === 'india-gst' && invoice.settings.gst && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier GSTIN
              </label>
              <input
                type="text"
                value={invoice.settings.gst.supplierGSTIN}
                onChange={(e) =>
                  updateSettings({
                    gst: { ...invoice.settings.gst!, supplierGSTIN: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="27AABCC1234F1Z0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer GSTIN
              </label>
              <input
                type="text"
                value={invoice.settings.gst.customerGSTIN}
                onChange={(e) =>
                  updateSettings({
                    gst: { ...invoice.settings.gst!, customerGSTIN: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="27XXYYZZ1234F1Z0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place of Supply
              </label>
              <input
                type="text"
                value={invoice.settings.gst.placeOfSupply}
                onChange={(e) =>
                  updateSettings({
                    gst: { ...invoice.settings.gst!, placeOfSupply: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="State name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={invoice.settings.gst.purpose === 'intra-state'}
                    onChange={() =>
                      updateSettings({
                        gst: { ...invoice.settings.gst!, purpose: 'intra-state' },
                      })
                    }
                  />
                  <span className="text-sm">Intra-state (CGST + SGST)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={invoice.settings.gst.purpose === 'inter-state'}
                    onChange={() =>
                      updateSettings({
                        gst: { ...invoice.settings.gst!, purpose: 'inter-state' },
                      })
                    }
                  />
                  <span className="text-sm">Inter-state (IGST)</span>
                </label>
              </div>
            </div>

            {invoice.settings.gst.purpose === 'intra-state' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CGST Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.settings.gst.cgstRate}
                    onChange={(e) =>
                      updateSettings({
                        gst: { ...invoice.settings.gst!, cgstRate: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SGST Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.settings.gst.sgstRate}
                    onChange={(e) =>
                      updateSettings({
                        gst: { ...invoice.settings.gst!, sgstRate: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="9"
                  />
                </div>
              </>
            )}

            {invoice.settings.gst.purpose === 'inter-state' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IGST Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={invoice.settings.gst.igstRate}
                  onChange={(e) =>
                    updateSettings({
                      gst: { ...invoice.settings.gst!, igstRate: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="18"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Payment Information Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Instructions
            </label>
            <textarea
              value={invoice.paymentInfo.instructions}
              onChange={(e) => updatePaymentInfo({ instructions: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="How and where to send payment"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.bankName}
              onChange={(e) => updatePaymentInfo({ bankName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Bank name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.accountNumber}
              onChange={(e) => updatePaymentInfo({ accountNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.ifscCode}
              onChange={(e) => updatePaymentInfo({ ifscCode: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="IFSC code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.upiId}
              onChange={(e) => updatePaymentInfo({ upiId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="yourname@upi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={invoice.paymentInfo.notes}
              onChange={(e) => updatePaymentInfo({ notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Any additional notes for the customer"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms and Conditions
            </label>
            <textarea
              value={invoice.paymentInfo.termsAndConditions}
              onChange={(e) => updatePaymentInfo({ termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Terms and conditions"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thank You Message
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.thankYouMessage}
              onChange={(e) => updatePaymentInfo({ thankYouMessage: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Thank you for your business!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Signature / Authorized Person Name
            </label>
            <input
              type="text"
              value={invoice.paymentInfo.signatureField}
              onChange={(e) => updatePaymentInfo({ signatureField: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Name or signature field text"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⚠️ Any payment information you enter here will appear in the downloaded invoice PDF.
          Do not include sensitive details unless necessary.
        </div>
      </section>

      {/* Template & Styling Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Template & Styling</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['professional', 'minimal', 'modern'] as const).map((template) => (
                <label key={template} className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50" style={{ borderColor: invoice.template === template ? '#2563eb' : undefined, backgroundColor: invoice.template === template ? '#eff6ff' : undefined }}>
                  <input
                    type="radio"
                    name="template"
                    value={template}
                    checked={invoice.template === template}
                    onChange={(e) => onInvoiceChange({ ...invoice, template: e.target.value as any })}
                  />
                  <span className="text-sm font-medium capitalize">{template}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={invoice.accentColor}
                onChange={(e) => onInvoiceChange({ ...invoice, accentColor: e.target.value })}
                className="h-10 w-16 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{invoice.accentColor}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
