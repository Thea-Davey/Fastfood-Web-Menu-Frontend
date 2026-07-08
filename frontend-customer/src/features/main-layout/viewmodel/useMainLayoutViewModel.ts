// ViewModel Layer: useMainLayoutViewModel.ts
// Handles UI state, routing interaction, and business events logic.
// Strictly returns properties and methods consumed directly by the View.

import { useLocation, useNavigate } from 'react-router-dom';
import { MAIN_LAYOUT_TABS, TabItem } from '../model/mainLayout.model';

export const useMainLayoutViewModel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab ID based on the current location path
  const activeTabId = MAIN_LAYOUT_TABS.find(tab => location.pathname === tab.path)?.id || 'home';

  // Navigate to path mapping when a tab is selected
  const handleTabChange = (tab: TabItem) => {
    navigate(tab.path);
  };

  return {
    tabs: MAIN_LAYOUT_TABS,
    activeTabId,
    handleTabChange,
  };
};
