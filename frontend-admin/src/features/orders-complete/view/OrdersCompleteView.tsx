import React from 'react';
import { useOrdersCompleteViewModel } from '../viewmodel/useOrdersCompleteViewModel';
import { RefreshCw, Search } from 'lucide-react';

export const OrdersCompleteView: React.FC = () => {
  const {
    orders,
    totalOrders,
    totalPages,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    isLoading,
    refreshOrders,
  } = useOrdersCompleteViewModel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>Complete Orders</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>History of successfully fulfilled orders</p>
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
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed orders"
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
      </div>

      {/* Orders Table Container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Details</th>
              <th>Time</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No completed orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  {/* Order ID column */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{order.order_id_display}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.date}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.time}</span>
                      <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-main)' }}>{order.table_number}</span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td style={{ fontWeight: '500' }}>{order.customer_name}</td>

                  {/* Details */}
                  <td>
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

                  {/* Estimated Preparation Time */}
                  <td>{order.estimated_time}</td>

                  {/* Total Amount */}
                  <td style={{ fontWeight: '600' }}>₱{order.total.toFixed(2)}</td>

                  {/* Status Badge */}
                  <td>
                    <span className="badge badge-completed">completed</span>
                  </td>
                </tr>
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

export default OrdersCompleteView;
