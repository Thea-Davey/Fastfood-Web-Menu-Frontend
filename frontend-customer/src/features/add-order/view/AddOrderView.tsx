// View Layer: AddOrderView.tsx
// Functional component. Dumb UI. Only JSX. Calls ViewModel hook. No local state or API logic.

import React from 'react';
import { useAddOrderViewModel } from '../viewmodel/useAddOrderViewModel';
import { ToggleButton } from '../../../shared-components/ToggleButton/ToggleButton';
import { menuData } from '../../../data/menuData';
import bgTexture from '../../../images/bg.jpg';

export const AddOrderView: React.FC = () => {
  const {
    state,
    globalOptions,
    toggleFlavor,
    toggleDip,
    selectBeverage,
    selectRice,
    selectFriesFlavor,
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

  // Determine whether the required selections have been made
  const needsFlavors = config.flavors && config.flavors.max > 0;
  const needsDips = config.dips && (config.dips.max ?? 1) > 0;
  const needsRice = config.rice && !config.rice.optional;
  const needsFries = config.fries && !config.fries.optional;
  const needsBeverages = config.beverages && !config.beverages.optional;

  const flavorsOk = !needsFlavors || state.selectedFlavors.length > 0;
  const dipsOk = !needsDips || state.selectedDips.length > 0;
  const riceOk = !needsRice || !!state.selectedRice;
  const friesOk = !needsFries || !!state.selectedFriesFlavor;
  const beveragesOk = !needsBeverages || !!state.selectedBeverage;

  const canAddToOrder = flavorsOk && dipsOk && riceOk && friesOk && beveragesOk;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F1F5F9', maxWidth: '640px', margin: '0 auto', width: '100%', position: 'relative' }}>
      {/* Scrollable Content Layer */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: '0px', backgroundColor: '#F1F5F9' }}>
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
        <div style={{ width: '100%', height: '240px', backgroundColor: 'var(--bg-image)', marginBottom: '0px' }}>
          {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>        {/* 1. Food Item Details Card */}
        <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>{item.name}</h1>
          <p style={{ fontSize: '15px', color: 'var(--price-color)', fontWeight: 600, margin: 0 }}>from ₱{item.basePrice.toFixed(2)}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
        </div>
        {config.flavors && config.flavors.max > 0 && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '6px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Flavors</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select up to {config.flavors.max} flavors</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {globalOptions.wingFlavors.map(flavor => {
                const isSelected = state.selectedFlavors.includes(flavor);
                const maxReached = state.selectedFlavors.length >= config.flavors!.max;

                // Parse portion size from item name (e.g. 6 from '6pcs Wings')
                const portionMatch = (item.name || '').match(/(\d+)\s*pcs?/i);
                const totalPieces = portionMatch ? parseInt(portionMatch[1], 10) : 0;

                let subLabel: string | undefined = undefined;
                if (isSelected && totalPieces > 0 && state.selectedFlavors.length > 0) {
                  const piecesPerFlavor = Math.floor(totalPieces / state.selectedFlavors.length);
                  subLabel = `${piecesPerFlavor} pcs`;
                }

                return (
                  <ToggleButton
                    key={flavor}
                    label={flavor}
                    selected={isSelected}
                    disabled={maxReached}
                    subLabel={subLabel}
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

        {/* 3. Dips Section Card */}
        {config.dips && config.dips.max > 0 && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '6px' }}>
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

        {/* 4. Rice Options Card */}
        {config.rice && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Rice Options</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select one</p>
              </div>
              {config.rice.optional && (
                <span style={{ fontSize: '12px', background: 'var(--bg-image)', padding: '6px 12px', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Optional</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {globalOptions.rice.map(riceOption => {
                const isSelected = state.selectedRice === riceOption;
                return (
                  <label key={riceOption} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{riceOption}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '7px solid var(--text-main)' : '2px solid #94A3B8', boxSizing: 'border-box', transition: 'border 0.2s ease' }} />
                    </div>
                    <input type="checkbox" checked={isSelected} onChange={() => selectRice(riceOption)} style={{ display: 'none' }} />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Fries Flavors Card */}
        {config.fries && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Fries Flavors</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select one</p>
              </div>
              {config.fries.optional && (
                <span style={{ fontSize: '12px', background: 'var(--bg-image)', padding: '6px 12px', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Optional</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {globalOptions.friesFlavors.map(flavor => {
                const isSelected = state.selectedFriesFlavor === flavor;
                return (
                  <label key={flavor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{flavor}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '7px solid var(--text-main)' : '2px solid #94A3B8', boxSizing: 'border-box', transition: 'border 0.2s ease' }} />
                    </div>
                    <input type="checkbox" checked={isSelected} onChange={() => selectFriesFlavor(flavor)} style={{ display: 'none' }} />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Beverages Card */}
        {config.beverages && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>Beverage</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Select one</p>
              </div>
              {config.beverages.optional && (
                <span style={{ fontSize: '12px', background: 'var(--bg-image)', padding: '6px 12px', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Optional</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {(config.beverages.allowed || globalOptions.beverages).map(bev => {
                const isSelected = state.selectedBeverage === bev;
                const bevPrice = menuData.menu.find(c => c.category === 'Drinks')?.items.find(i => i.name === bev)?.basePrice || 0;
                return (
                  <label key={bev} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{bev}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--price-color)', fontWeight: 600 }}>+ ₱ {bevPrice.toFixed(2)}</span>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '7px solid var(--text-main)' : '2px solid #94A3B8', boxSizing: 'border-box', transition: 'border 0.2s ease' }} />
                    </div>
                    <input type="checkbox" checked={isSelected} onChange={() => selectBeverage(bev)} style={{ display: 'none' }} />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Special Instructions Card */}
        {config.specialInstructions && (
          <div style={{ backgroundColor: '#FFFFFF', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(${bgTexture})`, backgroundSize: 'cover', padding: '32px 20px', width: '100%', boxSizing: 'border-box', marginBottom: '0px' }}>
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
                border: '1.5px solid #94A3B8', fontFamily: 'var(--font-family)',
                fontSize: '14px', resize: 'none', boxSizing: 'border-box', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)'
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              {state.specialInstructions.length}/500
            </div>
          </div>
        )}
        {/* Bottom white spacer to prevent grey gap */}
        <div style={{ height: '140px', backgroundColor: '#FFFFFF', width: '100%' }} />
      </div>

      {/* Fixed Bottom Footer Layer */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--white)',
        width: '100%', maxWidth: '640px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.09)', zIndex: 100, boxSizing: 'border-box'
      }}>

        {/* Quantity Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={decrementQuantity}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #94A3B8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: 'var(--text-muted)' }}
          >
            -
          </button>
          <span style={{ fontSize: '18px', fontWeight: 700, width: '20px', textAlign: 'center' }}>{state.quantity}</span>
          <button
            onClick={incrementQuantity}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #94A3B8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: 'var(--text-main)' }}
          >
            +
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={canAddToOrder ? handleAddToCart : undefined}
          disabled={!canAddToOrder}
          style={{
            flex: 1,
            backgroundColor: canAddToOrder ? 'var(--primary-color)' : '#CBD5E1',
            color: canAddToOrder ? 'var(--white)' : '#94A3B8',
            border: `1px solid ${canAddToOrder ? 'var(--primary-color)' : '#CBD5E1'}`,
            borderRadius: '16px', padding: '18px',
            fontSize: '16px', fontWeight: 700,
            cursor: canAddToOrder ? 'pointer' : 'not-allowed',
            display: 'flex', justifyContent: 'center',
            transition: 'opacity 0.2s ease, background-color 0.2s ease',
            opacity: canAddToOrder ? 1 : 0.6,
          }}
          onMouseEnter={(e) => { if (canAddToOrder) e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
          onMouseLeave={(e) => { if (canAddToOrder) e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
          onMouseDown={(e) => { if (canAddToOrder) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { if (canAddToOrder) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {canAddToOrder
            ? `Add to order - ₱${grandTotal.toFixed(2)}`
            : `Add to order`
            // : `Select ${!flavorsOk && !dipsOk ? 'flavors & dips' : !flavorsOk ? 'flavors' : 'dips'} to continue`
          }
        </button>
      </div>
    </div>
  );
};

export default AddOrderView;
