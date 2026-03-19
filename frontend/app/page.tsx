'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

type OrderStatus = 'Pending' | 'Completed'
type FilterStatus = 'All' | OrderStatus

interface Order {
  id: number
  customer: string
  status: OrderStatus
  total: number
  created_at: string
}

interface NewOrderForm {
  customer: string
  status: OrderStatus
  total: string
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      {status}
    </span>
  )
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <tr key={i} className="skeleton-row">
          <td><div className="skeleton" style={{ width: '70px' }} /></td>
          <td><div className="skeleton" style={{ width: '140px' }} /></td>
          <td><div className="skeleton" style={{ width: '90px' }} /></td>
          <td><div className="skeleton" style={{ width: '80px' }} /></td>
          <td><div className="skeleton" style={{ width: '100px' }} /></td>
          <td><div className="skeleton" style={{ width: '70px' }} /></td>
        </tr>
      ))}
    </>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<FilterStatus>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<NewOrderForm>({
    customer: '',
    status: 'Pending',
    total: '',
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  const fetchOrders = useCallback(async (statusFilter: FilterStatus) => {
    try {
      setLoading(true)
      setError(null)
      const url = statusFilter === 'All'
        ? `${API_URL}/orders`
        : `${API_URL}/orders?status=${statusFilter}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const json = await res.json()
      setOrders(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders(filter)
  }, [filter, fetchOrders])

  const handleFilterChange = (f: FilterStatus) => setFilter(f)

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer || !form.total) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form.customer,
          status: form.status,
          total: parseFloat(form.total),
        }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      setShowModal(false)
      setForm({ customer: '', status: 'Pending', total: '' })
      fetchOrders(filter)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    if (!mounted) return 'Loading date…'
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    } catch { return iso }
  }


  const totalOrders = orders.length
  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const completedCount = orders.filter(o => o.status === 'Completed').length
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0)

  return (
    <div className="container">
      <div className="page-header">
        <div className="header-actions">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">Track and manage all customer orders</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ＋ New Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value accent">{totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value warning">{pendingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value success">{completedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        {(['All', 'Pending', 'Completed'] as FilterStatus[]).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => handleFilterChange(f)}
            id={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠ {error}</div>}

      {/* Table */}
      <div className="table-card">
        <div className="table-scrollable">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <div className="empty-title">No orders found</div>
                      <div className="empty-desc">
                        {filter !== 'All'
                          ? `No ${filter} orders at the moment.`
                          : 'Create your first order to get started.'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">#{String(order.id).padStart(4, '0')}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-initial">
                          {order.customer.charAt(0).toUpperCase()}
                        </span>
                        <span className="customer-name">{order.customer}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={order.status} /></td>
                    <td><span className="price">${Number(order.total).toFixed(2)}</span></td>
                    <td><span className="date-cell" suppressHydrationWarning>{formatDate(order.created_at)}</span></td>
                    <td>
                      <Link
                        href={`/orders/${order.id}`}
                        className="btn btn-ghost"
                        id={`view-order-${order.id}`}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Order</h2>
            <form onSubmit={handleCreateOrder}>
              <div className="form-group">
                <label className="form-label" htmlFor="customer">Customer Name</label>
                <input
                  id="customer"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={form.customer}
                  onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select
                  id="status"
                  className="form-select"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="total">Total Price ($)</label>
                <input
                  id="total"
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 99.99"
                  value={form.total}
                  onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating…' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
