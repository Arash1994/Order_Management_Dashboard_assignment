'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface OrderItem {
  name: string
  qty: number
  price: number
}

interface Order {
  id: number
  customer: string
  status: 'Pending' | 'Completed'
  total: number
  items: OrderItem[]
  created_at: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/orders/${id}`)
        if (!res.ok) throw new Error(res.status === 404 ? 'Order not found' : `API error ${res.status}`)
        const json = await res.json()
        setOrder(json.data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handleToggleStatus = async () => {
    if (!order) return
    setUpdating(true)
    try {
      const newStatus = order.status === 'Pending' ? 'Completed' : 'Pending'
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update order')
      const json = await res.json()
      setOrder(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (iso: string) => {
    if (!mounted) return 'Loading date…'
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    } catch { return iso }
  }


  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ width: '220px', height: '32px', margin: '24px 0 8px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '160px', height: '18px', borderRadius: '6px' }} />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="page-header">
          <Link href="/" className="back-link">← Back to Orders</Link>
          <div className="error-banner">⚠ {error || 'Order not found'}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="container">
      <div className="page-header">
        <Link href="/" className="back-link" id="back-to-orders">
          ← Back to Orders
        </Link>
        <div className="header-actions" style={{ marginTop: '8px' }}>
          <div>
            <h1 className="page-title">
              Order <span style={{ color: 'var(--accent)' }}>#{String(order.id).padStart(4, '0')}</span>
            </h1>
            <p className="page-subtitle" suppressHydrationWarning>Created on {formatDate(order.created_at)}</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleToggleStatus}
            disabled={updating}
            id="toggle-status-btn"
          >
            {updating
              ? 'Updating…'
              : order.status === 'Pending'
              ? '✓ Mark as Completed'
              : '↩ Mark as Pending'}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      <div className="detail-grid">
        {/* Left: Order Info */}
        <div>
          <div className="detail-card" style={{ marginBottom: '20px' }}>
            <div className="detail-card-title">Order Information</div>

            <div className="detail-field">
              <span className="detail-field-label">Order ID</span>
              <span className="detail-field-value mono">#{String(order.id).padStart(4, '0')}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Customer</span>
              <span className="detail-field-value">{order.customer}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Status</span>
              <span>
                <span className={`badge ${order.status.toLowerCase()}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                  {order.status}
                </span>
              </span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Order Date</span>
              <span className="detail-field-value" style={{ fontSize: '14px' }} suppressHydrationWarning>{formatDate(order.created_at)}</span>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-title">Order Items</div>
              <ul className="items-list">
                {order.items.map((item, i) => (
                  <li key={i} className="item-row">
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-qty">Qty: {item.qty}</div>
                    </div>
                    <div className="item-price">${(item.price * item.qty).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div>
          <div className="detail-card">
            <div className="detail-card-title">Order Summary</div>

            {order.items && order.items.length > 0 && (
              <>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                    <span>{item.name} ×{item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />
              </>
            )}

            <div className="detail-field">
              <span className="detail-field-label">Total</span>
              <span className="detail-field-value price-lg">${Number(order.total).toFixed(2)}</span>
            </div>

            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Payment Status
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: order.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>
                {order.status === 'Completed' ? '✓ Paid' : '⏳ Awaiting Payment'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
