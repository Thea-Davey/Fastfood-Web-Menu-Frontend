import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhysicalTable,
  fetchAllTables,
  createTable as apiCreateTable,
  regenerateToken as apiRegenerateToken,
  setTableActive as apiSetTableActive,
} from '../model/tables.model';

export const useTablesViewModel = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL as string;

  // ── State ──────────────────────────────────────────────────────────────────
  const [tables, setTables] = useState<PhysicalTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add-table form
  const [newTableNumber, setNewTableNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Confirmation modal for token regeneration
  const [confirmRegenId, setConfirmRegenId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadTables = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllTables(apiUrl);
      setTables(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }
      setError(err.message ?? 'Could not load tables.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, navigate]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // ── Add Table ──────────────────────────────────────────────────────────────
  const handleCreateTable = async () => {
    const trimmed = newTableNumber.trim();
    if (!trimmed) {
      setCreateError('Table number cannot be empty.');
      return;
    }
    setIsCreating(true);
    setCreateError(null);
    try {
      const created = await apiCreateTable(apiUrl, { table_number: trimmed });
      setTables((prev) => [...prev, created]);
      setNewTableNumber('');
    } catch (err: any) {
      setCreateError(err.message ?? 'Failed to create table.');
    } finally {
      setIsCreating(false);
    }
  };

  // ── Regenerate Token ───────────────────────────────────────────────────────
  const requestRegenToken = (tableId: string) => setConfirmRegenId(tableId);
  const cancelRegenToken = () => setConfirmRegenId(null);

  const confirmRegenToken = async () => {
    if (!confirmRegenId) return;
    setIsRegenerating(true);
    try {
      const updated = await apiRegenerateToken(apiUrl, confirmRegenId);
      setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setConfirmRegenId(null);
    } catch (err: any) {
      setError(err.message ?? 'Failed to regenerate token.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // ── Toggle Active ──────────────────────────────────────────────────────────
  const handleToggleActive = async (tableId: string, currentActive: boolean) => {
    try {
      const updated = await apiSetTableActive(apiUrl, tableId, !currentActive);
      setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      setError(err.message ?? 'Failed to update table.');
    }
  };

  // ── QR URL builder (used by view to pass into QRCode component) ────────────
  const buildQrValue = (table: PhysicalTable): string => {
    const customerUrl = import.meta.env.VITE_CUSTOMER_URL ?? 'http://localhost:5173';
    return `${customerUrl}/?table=${encodeURIComponent(table.table_number)}&token=${table.qr_token}`;
  };

  return {
    tables,
    isLoading,
    error,
    // Create form
    newTableNumber,
    setNewTableNumber,
    isCreating,
    createError,
    handleCreateTable,
    // Regen modal
    confirmRegenId,
    isRegenerating,
    requestRegenToken,
    cancelRegenToken,
    confirmRegenToken,
    // Toggle active
    handleToggleActive,
    // QR helper
    buildQrValue,
    // Manual refresh
    refreshTables: loadTables,
  };
};
