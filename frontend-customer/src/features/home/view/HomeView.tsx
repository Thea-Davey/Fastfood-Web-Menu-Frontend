// View Layer: HomeView.tsx
// Pure view component. Renders the carousel and food item sections.

import React from 'react';
import { useHomeViewModel } from '../viewmodel/useHomeViewModel';
import { MenuItemCard } from '../../../shared-components/MenuItemCard/MenuItemCard';

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
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
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
    </div>
  );
};

export default HomeView;
