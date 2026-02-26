import { useEffect } from 'react';
import { TAB_CLOAK_OPTIONS } from './useSettings';
import type { TabCloak } from './useSettings';

export function useTabCloak(tabCloak: TabCloak) {
  useEffect(() => {
    const option = TAB_CLOAK_OPTIONS.find((o) => o.id === tabCloak);
    if (!option) return;

    // Update title
    document.title = option.title;

    // Update favicon
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = option.favicon;
  }, [tabCloak]);
}
