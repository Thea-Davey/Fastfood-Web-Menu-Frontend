import { useState } from 'react';
import logoSrc from '../../../assets/blaine-logo.png';
import { STAFF_LAYOUT_DEFAULT_STATE } from '../model/staffLayout.model';

export function useStaffLayoutViewModel() {
  const [activeOrderCount, setActiveOrderCount] = useState(
    STAFF_LAYOUT_DEFAULT_STATE.activeOrderCount,
  );
  const [pageTitle, setPageTitle] = useState(STAFF_LAYOUT_DEFAULT_STATE.pageTitle);

  return {
    logoSrc,
    brandTitle: STAFF_LAYOUT_DEFAULT_STATE.brandTitle,
    brandSubtitle: STAFF_LAYOUT_DEFAULT_STATE.brandSubtitle,
    pageTitle,
    activeOrderCount,
    outletContext: {
      setPageTitle,
      setActiveOrderCount,
    },
  };
}