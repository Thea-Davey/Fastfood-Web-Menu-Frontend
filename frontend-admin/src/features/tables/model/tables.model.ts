// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhysicalTable {
  id: string;
  table_number: string;
  qr_token: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateTablePayload {
  table_number: string;
}

// ─── API helpers (Model layer — zero React, zero JSX) ────────────────────────

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchAllTables = async (apiUrl: string): Promise<PhysicalTable[]> => {
  const res = await fetch(`${apiUrl}/api/tables`, { headers: getHeaders() });
  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('Failed to fetch tables.');
  }
  const json = await res.json();
  return json.data?.tables ?? [];
};

export const createTable = async (
  apiUrl: string,
  payload: CreateTablePayload
): Promise<PhysicalTable> => {
  const res = await fetch(`${apiUrl}/api/tables`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? 'Failed to create table.');
  }
  const json = await res.json();
  return json.data.table;
};

export const regenerateToken = async (
  apiUrl: string,
  tableId: string
): Promise<PhysicalTable> => {
  const res = await fetch(`${apiUrl}/api/tables/${tableId}/regenerate-token`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? 'Failed to regenerate token.');
  }
  const json = await res.json();
  return json.data.table;
};

export const setTableActive = async (
  apiUrl: string,
  tableId: string,
  isActive: boolean
): Promise<PhysicalTable> => {
  const res = await fetch(`${apiUrl}/api/tables/${tableId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? 'Failed to update table status.');
  }
  const json = await res.json();
  return json.data.table;
};
