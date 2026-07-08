// View Layer: AddOrderView.tsx
// Functional component. Dumb UI. Only JSX. Calls ViewModel hook. No local state or API logic.

import React from 'react';
import { useAddOrderViewModel } from '../viewmodel/useAddOrderViewModel';
import { ToggleButton } from '../../../shared-components/ToggleButton/ToggleButton';
import { menuData } from '../../../data/menuData';

export const AddOrderView: React.FC = () => {
  const {
    state,
    globalOptions,
    toggleFlavor,
    toggleDip,
    selectBeverage,
    incrementQuantity,
    decrementQuantity,
    setSpecialInstructions,
    grandTotal,
    handleAddToCart,
    goBack
  } = useAddOrderViewModel();

  if (!state.item) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>
        Loading item...
      </div>
    );
  }

  const { item } = state;
  const config = item.configuration || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-card)', maxWidth: '640px', margin: '0 auto', width: '100%', position: 'relative' }}>
      {/* Scrollable Content Layer */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '140px' }}>

        {/* Back Button */}
        <button
          onClick={goBack}
          style={{
            position: 'absolute', top: '16px', left: '16px', zIndex: 10,
            background: 'var(--white)', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        {/* Hero Image */}
        <div style={{ width: '100%', height: '240px', backgroundColor: 'var(--bg-image)' }}>
          {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>

        <div style={{ padding: '24px 20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{item.name}</h1>
          <p style={{ fontSize: '15px', color: 'var(--price-color)', fontWeight: 600, margin: '0 0 8px 0' }}>from ₱{item.basePrice.toFixed(2)}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 32px 0', lineHeight: 1.5 }}>{item.description}</p>

          {/* Flavors Grid */}
          {config.flavors && config.flavors.max > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Flavors</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select up to {config.flavors.max} flavors</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {globalOptions.wingFlavors.map(flavor => {
                  const isSelected = state.selectedFlavors.includes(flavor);
                  const maxReached = state.selectedFlavors.length >= config.flavors!.max;
                  return (
                    <ToggleButton
                      key={flavor}
                      label={flavor}
                      selected={isSelected}
                      disabled={maxReached}
                      onClick={() => toggleFlavor(flavor)}
                    />
                  );
                })}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                {state.selectedFlavors.length}/{config.flavors.max} flavors selected
              </p>
            </div>
          )}

          {/* Dips Grid */}
          {config.dips && config.dips.max > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Dips</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select up to {config.dips.max} dips</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {globalOptions.dips.map(dip => {
                  const isSelected = state.selectedDips.includes(dip);
                  const maxReached = state.selectedDips.length >= config.dips!.max;
                  return (
                    <ToggleButton
                      key={dip}
                      label={dip}
                      selected={isSelected}
                      disabled={maxReached}
                      onClick={() => toggleDip(dip)}
                    />
                  );
                })}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                {state.selectedDips.length}/{config.dips.max} dips selected
              </p>
            </div>
          )}

          {/* Beverages Section */}
          {config.beverages && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Beverage</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select one</p>
                </div>
                {config.beverages.optional && (
                  <span style={{ fontSize: '12px', background: 'var(--bg-image)', padding: '6px 12px', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Optional</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(config.beverages.allowed || globalOptions.beverages).map(bev => {
                  const isSelected = state.selectedBeverage === bev;
                  const bevPrice = menuData.menu.find(c => c.category === 'Drinks')?.items.find(i => i.name === bev)?.basePrice || 0;
                  return (
                    <label key={bev} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{bev}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--price-color)', fontWeight: 600 }}>+ ₱ {bevPrice.toFixed(2)}</span>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '7px solid var(--text-main)' : '2px solid var(--border-color)', boxSizing: 'border-box', transition: 'border 0.2s ease' }} />
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => selectBeverage(bev)} style={{ display: 'none' }} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Textarea */}
          {config.specialInstructions && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Special Instructions</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Please let us know if you are allergic to anything or if we need to avoid anything</p>
              </div>
              <textarea
                value={state.specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g no mayo"
                maxLength={500}
                style={{
                  width: '100%', height: '100px', padding: '16px', borderRadius: '12px',
                  border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)',
                  fontSize: '14px', resize: 'none', boxSizing: 'border-box', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)'
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {state.specialInstructions.length}/500
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Footer Layer */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--white)',
        width: '100%', maxWidth: '640px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', zIndex: 100, boxSizing: 'border-box'
      }}>

        {/* Quantity Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={decrementQuantity}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: 'var(--text-muted)' }}
          >
            -
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, width: '20px', textAlign: 'center' }}>{state.quantity}</span>
          <button
            onClick={incrementQuantity}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: 'var(--text-main)' }}
          >
            +
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1, backgroundColor: 'var(--primary-color)', color: 'var(--white)',
            border: '1px solid var(--primary-color)', borderRadius: '16px', padding: '18px',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Add to order - ₱{grandTotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default AddOrderView;
