import React from 'react';
import { useOrdersPendingViewModel } from '../viewmodel/useOrdersPendingViewModel';
import { RefreshCw, Search, Filter, Edit, ChevronDown, Check, X, Play, Clock } from 'lucide-react';

const OrderTimer: React.FC<{ createdAt?: string; status: string; originalTime: string }> = ({ createdAt, status, originalTime }) => {
  const [elapsed, setElapsed] = React.useState<string>('');
  const [isDelayed, setIsDelayed] = React.useState<boolean>(false);
  const [isVeryDelayed, setIsVeryDelayed] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!createdAt || (status !== 'pending' && status !== 'preparing')) {
      setElapsed('');
      return;
    }

    const updateTimer = () => {
      const createdTime = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const diffMs = now - createdTime;

      if (diffMs < 0) {
        setElapsed('0s');
        return;
      }

      const diffSecs = Math.floor(diffMs / 1000);
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;

      // Thresholds: yellow warnings at 10 mins, red warnings at 15 mins
      setIsDelayed(mins >= 10 && mins < 15);
      setIsVeryDelayed(mins >= 15);

      if (mins > 0) {
        setElapsed(`${mins}m ${secs}s`);
      } else {
        setElapsed(`${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt, status]);

  if (status !== 'pending' && status !== 'preparing') {
    return <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{originalTime}</span>;
  }

  let badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 'bold',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    width: 'fit-content',
    marginTop: '2px',
  };

  if (isVeryDelayed) {
    badgeStyle = {
      ...badgeStyle,
      backgroundColor: '#fee2e2',
      color: '#ef4444',
      border: '1px solid #fca5a5',
      animation: 'pulse-warn 1.5s infinite',
    };
  } else if (isDelayed) {
    badgeStyle = {
      ...badgeStyle,
      backgroundColor: '#fef3c7',
      color: '#d97706',
      border: '1px solid #fcd34d',
    };
  } else {
    badgeStyle = {
      ...badgeStyle,
      backgroundColor: '#f3f4f6',
      color: '#374151',
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{originalTime}</span>
      <span style={badgeStyle}>
        <Clock size={10} />
        {elapsed || '0s'}
      </span>
    </div>
  );
};

export const OrdersPendingView: React.FC = () => {
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
    updateOrderStatus,
    activeDropdownId,
    setActiveDropdownId,
  } = useOrdersPendingViewModel();

  const getStatusBadge = (status: string) => {
    if (status === 'preparing') {
      return <span className="badge badge-preparing">preparing</span>;
    }
    return <span className="badge badge-pending">pending</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* CSS Animation helper */}
      <style>{`
        @keyframes pulse-warn {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>Pending Orders</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage and update pending customer orders</p>
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
              <th>Tracker</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No pending orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  {/* Order ID column with metadata */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{order.order_id_display}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.date}</span>
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

                  {/* Tracker */}
                  <td>
                    <OrderTimer createdAt={order.createdAt} status={order.status} originalTime={order.time} />
                  </td>

                  {/* Total Amount */}
                  <td style={{ fontWeight: '600' }}>₱{order.total.toFixed(2)}</td>


                  {/* Status */}
                  <td>{getStatusBadge(order.status)}</td>

                  {/* Action Column with absolute Dropdown menu */}
                  <td style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setActiveDropdownId(activeDropdownId === order.id ? null : order.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                      }}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                      <ChevronDown size={12} />
                    </button>

                    {activeDropdownId === order.id && (
                      <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-color)',
                        zIndex: 200,
                        minWidth: '140px',
                        overflow: 'hidden'
                      }}>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              textAlign: 'left',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'var(--text-main)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f6f2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Play size={14} style={{ color: 'var(--warning-color)' }} />
                            <span>Prepare</span>
                          </button>
                        )}
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            textAlign: 'left',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-main)'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f6f2'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Check size={14} style={{ color: 'var(--success-color)' }} />
                          <span>Complete</span>
                        </button>
                        <button 
                          onClick={() => {
                            const reason = prompt('Enter cancellation reason:') || 'Customer cancelled';
                            updateOrderStatus(order.id, 'cancelled', reason);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            textAlign: 'left',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--danger-color)'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f6f2'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
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

export default OrdersPendingView;
