// SessionContext.tsx
// Manages the customer's table session and participant identity.
// Reads ?table= and ?token= from URL, validates the QR token against the backend,
// creates/fetches a session, and registers a participant so cart + checkout work correctly.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SessionContextValue {
  sessionId: string | null;
  participantId: string | null;
  tableNumber: string | null;
  isReady: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextValue>({
  sessionId: null,
  participantId: null,
  tableNumber: null,
  isReady: false,
  error: null,
});

/** Generate or reuse a stable device ID stored in localStorage */
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(
    () => localStorage.getItem('session_id')
  );
  const [participantId, setParticipantId] = useState<string | null>(
    () => localStorage.getItem('participant_id')
  );
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        
        // Parse table number from path if URL format is /menu/:tableNumber
        const pathParts = window.location.pathname.split('/');
        const pathTable = (pathParts[1] === 'menu' && pathParts[2]) ? pathParts[2] : null;

        const table = params.get('table') || pathTable || localStorage.getItem('table_number') || 'Table 1';
        const token = params.get('token') || localStorage.getItem('table_token');

        // Check if we are in local development
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (!table || (!token && !isLocalDev)) {
          throw new Error('This QR code is not valid, please ask staff for help.');
        }

        console.log('[SessionInit] Table:', table, 'Token:', token);

        const previousTable = localStorage.getItem('table_number');
        const previousToken = localStorage.getItem('table_token');
        const isSameQr = sessionId && previousTable === table && previousToken === token;

        setTableNumber(table);
        if (!isSameQr) {
          localStorage.removeItem('session_id');
          localStorage.removeItem('participant_id');
          setSessionId(null);
          setParticipantId(null);
        }

        localStorage.setItem('table_number', table);
        if (token) {
          localStorage.setItem('table_token', token);
        }

        const apiUrl = import.meta.env.VITE_API_URL;
        const deviceId = getDeviceId();

        // Step 1: Get or create a table session from the backend.
        let currentSessionId = isSameQr ? sessionId : null;

        if (!currentSessionId) {
          // Build the session URL — always include token if present.
          const sessionUrl = token
            ? `${apiUrl}/api/tables/${encodeURIComponent(table)}/session?token=${encodeURIComponent(token)}`
            : `${apiUrl}/api/tables/${encodeURIComponent(table)}/session`;

          let sessionJson: any = null;
          try {
            const sessionRes = await fetch(sessionUrl, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            if (sessionRes.ok) {
              sessionJson = await sessionRes.json();
            } else if (token) {
              throw new Error('This QR code is not valid, please ask staff for help.');
            }
          } catch (fetchErr) {
            console.warn('Session API unavailable, using local dev session:', fetchErr);
          }

          if (sessionJson) {
            currentSessionId =
              sessionJson.data?.session?.id ??
              sessionJson.data?.session_id ??
              sessionJson.data?.id ??
              sessionJson.session_id;
          }

          // If we couldn't get a real session ID from the backend, use a local fallback.
          if (!currentSessionId || currentSessionId === 'undefined') {
            if (!isLocalDev) {
              throw new Error('No session_id returned from backend');
            }
            currentSessionId = `local-dev-session-${table}`;
            console.warn('Using local dev session ID. Real orders will not be placed.');
          }

          localStorage.setItem('session_id', currentSessionId);
          setSessionId(currentSessionId);
        } else if (currentSessionId === 'undefined') {
          localStorage.removeItem('session_id');
          setSessionId(null);
          throw new Error('Invalid session state. Please refresh.');
        }

        // Step 2: Register participant in Supabase (if not already done).
        let currentParticipantId = isSameQr ? participantId : null;

        if (!currentParticipantId) {
          if (!currentSessionId.startsWith('local-dev-session')) {
            // Always check if we have a valid participant for the CURRENT real session.
            const { data: existing } = await supabase
              .from('session_participants')
              .select('id')
              .eq('session_id', currentSessionId)
              .eq('device_id', deviceId)
              .maybeSingle();

            if (existing?.id) {
              currentParticipantId = existing.id;
            } else {
              const { data: inserted, error: insertError } = await supabase
                .from('session_participants')
                .insert({ session_id: currentSessionId, device_id: deviceId, name: 'Guest' })
                .select('id')
                .single();

              if (insertError) throw insertError;
              currentParticipantId = inserted.id;
            }

            localStorage.setItem('participant_id', currentParticipantId!);
            setParticipantId(currentParticipantId);
          } else {
            // Local dev fallback participant ID
            currentParticipantId = `local-dev-participant-${deviceId}`;
            localStorage.setItem('participant_id', currentParticipantId);
            setParticipantId(currentParticipantId);
          }
        }

        setIsReady(true);
      } catch (err: any) {
        console.error('Session init error:', err);
        setError(err.message || 'Failed to initialize session');
        setIsReady(true);
      }
    };

    init();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId, participantId, tableNumber, isReady, error }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextValue => {
  return useContext(SessionContext);
};
