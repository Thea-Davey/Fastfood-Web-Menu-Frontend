// SessionContext.tsx
// Manages the customer's table session and participant identity.
// Reads ?table= from URL, creates/fetches a session from the backend,
// and registers a participant so cart + checkout work correctly.

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
        // Read table number from URL: e.g. https://yourapp.com/?table=3
        const params = new URLSearchParams(window.location.search);
        const table = params.get('table') || localStorage.getItem('table_number') || '1';
        setTableNumber(table);
        localStorage.setItem('table_number', table);

        const apiUrl = import.meta.env.VITE_API_URL;
        const deviceId = getDeviceId();

        // Step 1: Get or create a table session from the backend
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          const sessionRes = await fetch(`${apiUrl}/api/tables/${table}/session`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!sessionRes.ok) throw new Error('Could not create table session');
          const sessionJson = await sessionRes.json();
          currentSessionId = sessionJson.data?.session?.id ?? sessionJson.data?.session_id ?? sessionJson.data?.id ?? sessionJson.session_id;

          if (!currentSessionId || currentSessionId === 'undefined') {
            throw new Error('No session_id returned from backend');
          }
          localStorage.setItem('session_id', currentSessionId);
          setSessionId(currentSessionId);
        } else if (currentSessionId === 'undefined') {
          localStorage.removeItem('session_id');
          setSessionId(null);
          throw new Error('Invalid session state. Please refresh.');
        }

        // Step 2: Register participant in Supabase (if not already done)
        let currentParticipantId = participantId;
        if (!currentParticipantId) {
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
        }

        setIsReady(true);
      } catch (err: any) {
        console.error('Session init error:', err);
        setError(err.message || 'Failed to initialize session');
        setIsReady(true); // Still mark ready so app doesn't hang
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
