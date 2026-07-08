import React from 'react';
import { useHomeViewModel } from '../viewmodel/useHomeViewModel';
import { Calendar, RefreshCw, ChevronRight, Clipboard, CheckCircle, XCircle, DollarSign, Clock } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    summary,
    recentOrders,
    isLoading,
    selectedDate,
    setSelectedDate,
    refreshData,
    handleViewAllOrders,
  } = useHomeViewModel();

  // Helper to format date display e.g. "July 7, 2026"
  const formatDateDisplay = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return 'July 7, 2026';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'badge badge-pending';
      case 'preparing': return 'badge badge-preparing';
      case 'completed': return 'badge badge-completed';
      case 'cancelled': return 'badge badge-cancelled';
      default: return 'badge';
    }
  };

  const cardsData = [
    { title: 'Today Orders', value: summary.today_orders, icon: Clipboard, bg: '#fffdf5', borderColor: '#f0e6ab', iconColor: '#b28900' },
    { title: 'Pending Orders', value: summary.pending_orders, icon: Clock, bg: '#fffdf5', borderColor: '#f0e6ab', iconColor: '#b28900' },
    { title: 'Complete Orders', value: summary.completed_today, icon: CheckCircle, bg: '#fffdf5', borderColor: '#f0e6ab', iconColor: '#b28900' },
    { title: 'Cancel Orders', value: summary.cancelled_today, icon: XCircle, bg: '#fffdf5', borderColor: '#f0e6ab', iconColor: '#b28900' },
    { title: 'Total Sales', value: `₱${summary.revenue_today.toLocaleString()}`, icon: DollarSign, bg: '#fffdf5', borderColor: '#f0e6ab', iconColor: '#b28900' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a100e', fontFamily: 'system-ui' }}>Home Dashboard</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Date Selector Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fffdf5',
            border: '1px solid #f0e6ab',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#b28900',
            fontWeight: '600',
            fontSize: '14px',
            position: 'relative'
          }}>
            <Calendar size={16} />
            <span>{formatDateDisplay(selectedDate)}</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%'
              }}
            />
          </div>

          {/* Refresh Button */}
          <button 
            onClick={refreshData}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fffdf5',
              border: '1px solid #f0e6ab',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#b28900',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fbf9eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fffdf5'}
          >
            <RefreshCw size={16} className={isLoading ? 'spin-animation' : ''} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {cardsData.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.title}
              style={{
                backgroundColor: card.bg,
                border: `1px solid ${card.borderColor}`,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(178, 137, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.iconColor
              }}>
                <IconComponent size={20} />
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{card.title}</span>
              <strong style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{card.value}</strong>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Recent Orders</h3>
        
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Order ID</th>
                  <th>Customer</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th style={{ paddingRight: '24px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary-color)', paddingLeft: '24px' }}>{order.order_id_display}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.time}</td>
                    <td style={{ fontWeight: '500' }}>₱{order.total.toFixed(2)}</td>
                    <td style={{ paddingRight: '24px' }}>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All Orders Button */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <button 
              onClick={handleViewAllOrders}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 24px',
                borderRadius: '20px',
                border: '1px solid var(--primary-color)',
                color: 'var(--primary-color)',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all var(--transition-fast)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
            >
              <span>View All Orders</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* CSS Animation helper */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeView;
