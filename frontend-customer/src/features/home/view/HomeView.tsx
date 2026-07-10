import React, { useState } from 'react';
import { useHomeViewModel } from '../viewmodel/useHomeViewModel';
import { MenuItemCard } from '../../../shared-components/MenuItemCard/MenuItemCard';
import { useSession } from '../../../context/SessionContext';

const SHOW_MOCK_NOTICE = false; // Set to true to show notice, false to hide

export const HomeView: React.FC = () => {
  const {
    banners,
    popularItems,
    bestSellers,
    activeCarouselIndex,
    setActiveCarouselIndex,
    isLoading,
    error,
    cartItems,
    handleCardClick,
    handleIncrement,
    handleDecrement,
  } = useHomeViewModel();

  const { tableNumber } = useSession();
  const [showManual, setShowManual] = useState(false);
  const hasActiveOrder = !!localStorage.getItem('checkout_order_id');

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 120px)',
        color: 'var(--text-muted)',
        fontSize: '15px',
        fontWeight: 500
      }}>
        Loading your menu feed...
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      maxWidth: '640px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-app)',
      overflowX: 'hidden'
    }}>

      {SHOW_MOCK_NOTICE && error && (
        <div style={{
          margin: '0 20px',
          backgroundColor: 'var(--alert-bg)',
          border: '1px solid var(--alert-border)',
          padding: '12px 16px',
          borderRadius: '12px',
          color: 'var(--danger-hover)',
          fontSize: '13px'
        }}>
          Notice: {error}. Running in developer mock mode.
        </div>
      )}

      {/* 'What's New' Section with Centered Banner Carousel */}
      {banners.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ paddingLeft: '20px', fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Whats New?
          </h2>

          {/* Carousel container */}
          <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(calc(10% - ${activeCarouselIndex * 80}%))`,
              width: '100%',
            }}>
              {banners.map((banner, index) => {
                const isActive = index === activeCarouselIndex;
                return (
                  <div
                    key={banner.id}
                    onClick={() => setActiveCarouselIndex(index)}
                    style={{
                      flex: '0 0 80%',
                      width: '80%',
                      padding: '0 8px',
                      boxSizing: 'border-box',
                      transform: isActive ? 'scale(1)' : 'scale(0.92)',
                      opacity: isActive ? 1 : 0.6,
                      transition: 'transform 0.4s ease, opacity 0.4s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                       src={banner.imageUrl}
                       alt={banner.title}
                       style={{
                         width: '100%',
                         height: '220px',
                         objectFit: 'cover',
                         borderRadius: '24px',
                         boxShadow: '0 0 30px rgba(0,0,0,0.2)', // Increased centered drop shadow
                         backgroundColor: 'var(--bg-image)'
                       }}
                     />
                  </div>
                );
              })}
            </div>

            {/* Bottom dot pagination indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px'
            }}>
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCarouselIndex(index)}
                  style={{
                    width: index === activeCarouselIndex ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: index === activeCarouselIndex ? 'var(--brand-color)' : 'var(--border-color)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Welcome Greeting & Guide me Button */}
      <section style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: Greeting title + subtitle (left aligned) */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.027em' }}>
              Hello, {tableNumber || 'Table 1'}!
            </h1>
            <p style={{ fontSize: '14.5px', color: '#4b5563', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              Complete your day with a delicious and filling chicken wings.
            </p>
          </div>
          {/* Row 2: Guide me button (right aligned) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setShowManual(true)}
              style={{
                padding: '16px 32px', // Increased size
                backgroundColor: 'var(--primary-color)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '14px', // Adjusted border radius slightly
                fontWeight: 700,
                fontSize: '16.5px', // Increased font size
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.25)',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Guide me
            </button>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '2px solid #94a3b8', margin: '8px 0 0 0' }} />
      </section>

      {/* 'Popular' Section */}
      {popularItems.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Popular
          </h2>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {popularItems.map((item) => {
              const isDirectStepper = item.category === 'add_on' || item.category === 'drinks';
              const quantity = isDirectStepper
                ? cartItems
                    .filter(ci => ci.menuItemId === item.id)
                    .reduce((sum, ci) => sum + ci.quantity, 0)
                : 0;

              return (
                <div key={item.id} style={{ flex: '0 0 310px', width: '310px' }}>
                  <MenuItemCard
                    disabled={hasActiveOrder}
                    variant="stretched"
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    quantity={quantity}
                    onCardClick={() => handleCardClick(item)}
                    onIncrement={() => {
                      if (isDirectStepper) {
                        handleIncrement(item);
                      } else {
                        handleCardClick(item);
                      }
                    }}
                    onDecrement={() => handleDecrement(item)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 'Best Sellers' Section */}
      {bestSellers.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Best Sellers
          </h2>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {bestSellers.map((item) => {
              const isDirectStepper = item.category === 'add_on' || item.category === 'drinks';
              const quantity = isDirectStepper
                ? cartItems
                    .filter(ci => ci.menuItemId === item.id)
                    .reduce((sum, ci) => sum + ci.quantity, 0)
                : 0;

              return (
                <div key={item.id} style={{ flex: '0 0 310px', width: '310px' }}>
                  <MenuItemCard
                    disabled={hasActiveOrder}
                    variant="stretched"
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    quantity={quantity}
                    onCardClick={() => handleCardClick(item)}
                    onIncrement={() => {
                      if (isDirectStepper) {
                        handleIncrement(item);
                      } else {
                        handleCardClick(item);
                      }
                    }}
                    onDecrement={() => handleDecrement(item)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* User Manual Modal Overlay */}
      {showManual && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '24px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '85vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box'
          }}>
            <div>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>How to Order</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)' }}>Follow these simple steps to place your order.</p>
            </div>

            {/* Steps list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>1</div>
                <div style={stepTextStyle}>Browse our menu categories on the home page or Menu tab.</div>
              </div>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>2</div>
                <div style={stepTextStyle}>Select a food item to view options.</div>
              </div>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>3</div>
                <div style={stepTextStyle}>Customize your choice (flavors, dips, drinks) and click <strong>Add to order</strong>.</div>
              </div>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>4</div>
                <div style={stepTextStyle}>Review your selections inside the <strong>"My Order"</strong> tab.</div>
              </div>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>5</div>
                <div style={stepTextStyle}>Click the <strong>Checkout</strong> button to place your order.</div>
              </div>
              <div style={stepRowStyle}>
                <div style={stepNumStyle}>6</div>
                <div style={stepTextStyle}>Wait for our staff to deliver your delicious food straight to your table!</div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: 0 }} />

            {/* Customize Wing section */}
            <div style={{ backgroundColor: '#fff7ed', borderRadius: '16px', padding: '16px', border: '1px solid #ffedd5' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🍗 Chicken Wings Ordering
              </h3>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#9a3412', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                <li>
                  <strong>Select Flavor:</strong> You can select multiple flavors. For sharing portions, wing pieces are divided evenly per flavors selected.
                </li>
                <li>
                  <strong>Select Dip:</strong> Choose your favorite dipping sauce to complete the combination.
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowManual(false)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const stepRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
};

const stepNumStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#ffedd5',
  color: 'var(--primary-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 700,
  flexShrink: 0,
  marginTop: '2px',
};

const stepTextStyle: React.CSSProperties = {
  fontSize: '13.5px',
  color: 'var(--text-main)',
  lineHeight: 1.45,
};

export default HomeView;
