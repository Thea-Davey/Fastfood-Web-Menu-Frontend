import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTablesViewModel } from '../viewmodel/useTablesViewModel';
import { RefreshCw, PlusCircle, RotateCcw, Power, Download, AlertTriangle, X } from 'lucide-react';
import type { PhysicalTable } from '../model/tables.model';

// ─── Confirmation Modal ────────────────────────────────────────────────────────
const RegenConfirmModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ onConfirm, onCancel, isLoading }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '440px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'var(--danger-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--danger-color)', flexShrink: 0,
          }}>
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
            Regenerate QR Token?
          </h3>
        </div>
        <button onClick={onCancel} style={{ color: 'var(--text-muted)', padding: '4px' }}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
        <strong style={{ color: 'var(--danger-color)' }}>Warning:</strong> The physical QR sticker
        currently on this table will <strong>stop working immediately</strong>. Customers who scan
        the old sticker will get an error until the new sticker is printed and replaced.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={isLoading}
          style={{
            padding: '10px 20px', borderRadius: '8px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          style={{
            padding: '10px 20px', borderRadius: '8px',
            backgroundColor: 'var(--danger-color)',
            color: '#ffffff', fontWeight: '600', fontSize: '14px',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Regenerating…' : 'Yes, Regenerate'}
        </button>
      </div>
    </div>
  </div>
);

// ─── QR Download helper ────────────────────────────────────────────────────────
const downloadQR = (tableNumber: string, svgEl: SVGSVGElement | null) => {
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qr-table-${tableNumber}.svg`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Table Row ─────────────────────────────────────────────────────────────────
const TableRow: React.FC<{
  table: PhysicalTable;
  qrValue: string;
  onRegen: (id: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
}> = ({ table, qrValue, onRegen, onToggleActive }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <tr>
      {/* Table Number */}
      <td style={{ paddingLeft: '24px', fontWeight: '600', color: 'var(--text-main)' }}>
        {table.table_number}
      </td>

      {/* Status Badge */}
      <td>
        <span className={`badge ${table.is_active ? 'badge-completed' : 'badge-cancelled'}`}>
          {table.is_active ? 'Active' : 'Retired'}
        </span>
      </td>

      {/* QR Code */}
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={qrValue}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to open customer app for this table"
            style={{
              padding: '6px', backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)', borderRadius: '8px',
              display: 'inline-flex',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <QRCodeSVG
              ref={svgRef}
              value={qrValue}
              size={72}
              bgColor="#ffffff"
              fgColor="#1a100e"
              level="M"
            />
          </a>
          <button
            id={`btn-download-qr-${table.id}`}
            onClick={() => downloadQR(table.table_number, svgRef.current)}
            title="Download QR as SVG"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', fontWeight: '500', fontSize: '13px',
              transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-app)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </td>

      {/* Token (truncated) */}
      <td>
        <code style={{
          fontSize: '11px', color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-app)',
          padding: '3px 8px', borderRadius: '4px',
          fontFamily: 'monospace',
        }}>
          {table.qr_token.slice(0, 8)}…
        </code>
      </td>

      {/* Actions */}
      <td style={{ paddingRight: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            id={`btn-regen-${table.id}`}
            onClick={() => onRegen(table.id)}
            title="Regenerate QR token"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              border: '1px solid var(--warning-color)',
              color: 'var(--warning-color)', fontWeight: '500', fontSize: '13px',
              transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--warning-bg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <RotateCcw size={13} /> New Token
          </button>

          <button
            id={`btn-toggle-active-${table.id}`}
            onClick={() => onToggleActive(table.id, table.is_active)}
            title={table.is_active ? 'Retire table' : 'Re-activate table'}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              border: `1px solid ${table.is_active ? 'var(--danger-color)' : 'var(--success-color)'}`,
              color: table.is_active ? 'var(--danger-color)' : 'var(--success-color)',
              fontWeight: '500', fontSize: '13px',
              transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = table.is_active
                ? 'var(--danger-bg)' : 'var(--success-bg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Power size={13} /> {table.is_active ? 'Retire' : 'Re-activate'}
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Main View ─────────────────────────────────────────────────────────────────
export const TablesView: React.FC = () => {
  const {
    tables, isLoading, error,
    newTableNumber, setNewTableNumber,
    isCreating, createError, handleCreateTable,
    confirmRegenId, isRegenerating,
    requestRegenToken, cancelRegenToken, confirmRegenToken,
    handleToggleActive,
    buildQrValue,
    refreshTables,
  } = useTablesViewModel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a100e', fontFamily: 'system-ui', margin: 0 }}>
          Table Management
        </h2>
        <button
          id="btn-refresh-tables"
          onClick={refreshTables}
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fffdf5',
            border: '1px solid #f0e6ab',
            padding: '8px 16px', borderRadius: '20px',
            color: '#b28900', fontWeight: '600', fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fbf9eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fffdf5'}
        >
          <RefreshCw size={16} className={isLoading ? 'spin-animation' : ''} />
          <span>{isLoading ? 'Loading…' : 'Refresh'}</span>
        </button>
      </div>

      {/* ── Global Error ── */}
      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: '10px',
          backgroundColor: 'var(--danger-bg)',
          border: '1px solid var(--danger-color)',
          color: 'var(--danger-color)', fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* ── Add New Table Card ── */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
          Add New Table
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, maxWidth: '320px' }}>
            <input
              id="input-new-table-number"
              type="text"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateTable(); }}
              placeholder="e.g. Table 1, T-10, VIP-2"
              style={{
                padding: '10px 14px', borderRadius: '8px',
                border: `1px solid ${createError ? 'var(--danger-color)' : 'var(--border-color)'}`,
                fontSize: '14px', color: 'var(--text-main)',
                backgroundColor: '#ffffff', outline: 'none',
              }}
            />
            {createError && (
              <span style={{ fontSize: '12px', color: 'var(--danger-color)' }}>{createError}</span>
            )}
          </div>
          <button
            id="btn-add-table"
            onClick={handleCreateTable}
            disabled={isCreating}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff', fontWeight: '600', fontSize: '14px',
              opacity: isCreating ? 0.7 : 1,
              transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => { if (!isCreating) e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; }}
          >
            <PlusCircle size={16} />
            <span>{isCreating ? 'Adding…' : 'Add Table'}</span>
          </button>
        </div>
      </div>

      {/* ── Tables List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
          All Tables ({tables.length})
        </h3>

        <div className="admin-table-container">
          {isLoading && tables.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Loading tables…
            </div>
          ) : tables.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No tables yet. Add your first table above.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '24px' }}>Table Number</th>
                    <th>Status</th>
                    <th>QR Code</th>
                    <th>Token Preview</th>
                    <th style={{ paddingRight: '24px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <TableRow
                      key={table.id}
                      table={table}
                      qrValue={buildQrValue(table)}
                      onRegen={requestRegenToken}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Regen Confirmation Modal ── */}
      {confirmRegenId && (
        <RegenConfirmModal
          onConfirm={confirmRegenToken}
          onCancel={cancelRegenToken}
          isLoading={isRegenerating}
        />
      )}

      {/* CSS helpers (spin animation — same as HomeView) */}
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

export default TablesView;
