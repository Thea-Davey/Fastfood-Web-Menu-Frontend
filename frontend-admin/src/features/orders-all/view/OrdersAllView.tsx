import React from 'react';
import { useOrdersAllViewModel } from '../viewmodel/useOrdersAllViewModel';
import { RefreshCw, Search, Filter, ChevronDown } from 'lucide-react';

export const OrdersAllView: React.FC = () => {
  const {
    orders,
    totalOrders,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedPayment,
    setSelectedPayment,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    isLoading,
    refreshOrders,
  } = useOrdersAllViewModel();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">pending</span>;
      case 'preparing': return <span className="badge badge-preparing">preparing</span>;
      case 'completed': return <span className="badge badge-completed">complete</span>;
      case 'cancelled': return <span className="badge badge-cancelled">cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>All Orders</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage and track all transaction records</p>
        </div>
        
        <button 
          onClick={refreshOrders}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fffdf5',
            border: '1px solid #f0e6ab',
            padding: '10px 20px',
            borderRadius: '24px',
            color: '#b28900',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '220px' }}>
          <select 
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 36px 12px 16px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#fffdf5',
              color: 'var(--text-main)',
              fontWeight: '500',
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
            <option value="Card">Card</option>
            <option value="Maya">Maya</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ position: 'relative', width: '180px' }}>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 36px 12px 16px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#fffdf5',
              color: 'var(--text-main)',
              fontWeight: '500',
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order or customer"
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#fffdf5',
              outline: 'none'
            }}
          />
        </div>

        <button style={{
          backgroundColor: '#fffdf5',
          border: '1px solid var(--border-color)',
          padding: '12px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)'
        }}>
          <Filter size={18} />
        </button>
      </div>

      {/* Orders Table Container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Details</th>
              <th>Order Types</th>
              <th>Time</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  {/* Order Row */}
                  <tr>
                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <strong style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{order.order_id_display}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.date}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.time}</span>
                        <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-main)' }}>{order.table_number}</span>
                      </div>
                    </td>

                    <td style={{ fontWeight: '500', borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>{order.customer_name}</td>

                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.details.map((detail, idx) => (
                          <div key={idx} style={{ fontSize: '13px' }}>
                            <span style={{ fontWeight: '600' }}>{detail.quantity}x</span> {detail.name}
                            {detail.flavors.length > 0 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: '8px' }}>
                                Sauce: {detail.flavors.join(', ')}
                              </div>
                            )}
                            {detail.instructions && (
                              <div style={{ fontSize: '11px', color: 'var(--primary-color)', marginLeft: '8px' }}>
                                Note: {detail.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>
                      <span className="badge badge-order-type">{order.order_type}</span>
                    </td>

                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>{order.estimated_time}</td>

                    <td style={{ fontWeight: '600', borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>₱{order.total.toFixed(2)}</td>

                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>
                      <span className="badge badge-payment">{order.payment_method}</span>
                    </td>

                    <td style={{ borderBottom: order.status === 'cancelled' ? 'none' : '1px solid var(--border-color)' }}>{getStatusBadge(order.status)}</td>
                  </tr>

                  {/* Red cancellation banner under row if status is cancelled */}
                  {order.status === 'cancelled' && (
                    <tr>
                      <td colSpan={8} style={{ padding: '0 16px 16px 16px' }}>
                        <div style={{
                          backgroundColor: 'var(--danger-color)',
                          color: '#ffffff',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}>
                          Reason Details: {order.cancellation_reason || 'No cancellation details specified'}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Showing {totalOrders === 0 ? 0 : (page - 1) * 10 + 1} to {Math.min(page * 10, totalOrders)} of {totalOrders} orders
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: page <= 1 ? 'var(--text-muted)' : 'var(--text-main)',
              fontSize: '14px',
              cursor: page <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &lt;
          </button>
          
          <span style={{ fontSize: '14px', fontWeight: '500', margin: '0 8px', color: 'var(--text-main)' }}>
            Page {page} of {totalPages || 1}
          </span>
          
          <button 
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-main)',
              fontSize: '14px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersAllView;
