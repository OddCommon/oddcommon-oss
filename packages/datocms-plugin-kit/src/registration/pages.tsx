import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type {
  ContentAreaSidebarItemConfig,
  MainNavigationTabConfig,
  PageConfig,
  PluginInternalConfig,
} from '../types';
import { validateUniqueId } from '../utils/validation';

export function createPageRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  const pages = new Map<string, PageConfig>();
  const mainNavTabs: MainNavigationTabConfig[] = [];
  const contentAreaItems: ContentAreaSidebarItemConfig[] = [];

  function addPage(pageConfig: PageConfig) {
    const existingIds = Array.from(pages.keys());
    validateUniqueId(pageConfig.pageId, existingIds, 'Page', internalConfig.duplicateIdHandling);

    // In warn/ignore mode, the Map.set() below will naturally replace the old entry
    // In throw mode, validateUniqueId already threw an error

    // Store the config
    pages.set(pageConfig.pageId, pageConfig);

    // Register render hook
    if (!config.renderPage) {
      config.renderPage = (pageId, ctx) => {
        const page = pages.get(pageId);
        if (page) {
          const Component = page.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addMainNavigationTab(tabConfig: MainNavigationTabConfig) {
    mainNavTabs.push(tabConfig);

    // Register/update the function that returns all tabs
    config.mainNavigationTabs = (_ctx) => {
      return mainNavTabs;
    };
  }

  function addContentAreaSidebarItem(itemConfig: ContentAreaSidebarItemConfig) {
    contentAreaItems.push(itemConfig);

    // Register/update the function that returns all items
    config.contentAreaSidebarItems = (_ctx) => {
      return contentAreaItems;
    };
  }

  function addSettingsAreaSidebarItem(_itemConfig: unknown) {
    // Similar to addContentAreaSidebarItem
    // TODO: Complete implementation
    throw new Error('Settings area sidebar items not yet implemented');
  }

  return {
    addPage,
    addMainNavigationTab,
    addContentAreaSidebarItem,
    addSettingsAreaSidebarItem,
  };
}
