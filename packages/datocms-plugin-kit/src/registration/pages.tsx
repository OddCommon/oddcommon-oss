import type { FullConnectParameters, RenderPageCtx } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { ContentAreaSidebarItemConfig, MainNavigationTabConfig, PageConfig } from '../types';

export function createPageRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const pageRenderers = new Map<string, React.ComponentType<{ ctx: RenderPageCtx }>>();
  const mainNavTabs: MainNavigationTabConfig[] = [];
  const contentAreaItems: ContentAreaSidebarItemConfig[] = [];

  function addPage(pageConfig: PageConfig) {
    validateRequired(pageConfig as unknown as Record<string, unknown>, ['pageId', 'component'], 'Page');

    const existingIds = Array.from(pageRenderers.keys());
    validateUniqueId(pageConfig.pageId, existingIds, 'Page');

    // Store component for rendering
    pageRenderers.set(pageConfig.pageId, pageConfig.component);

    // Register render hook
    if (!config.renderPage) {
      config.renderPage = (pageId, ctx) => {
        const Component = pageRenderers.get(pageId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addMainNavigationTab(tabConfig: MainNavigationTabConfig) {
    validateRequired(tabConfig as unknown as Record<string, unknown>, ['label', 'icon', 'pointsTo'], 'Main navigation tab');

    mainNavTabs.push(tabConfig);

    // Register/update the function that returns all tabs
    config.mainNavigationTabs = (_ctx) => {
      return mainNavTabs;
    };
  }

  function addContentAreaSidebarItem(itemConfig: ContentAreaSidebarItemConfig) {
    validateRequired(itemConfig as unknown as Record<string, unknown>, ['label', 'icon', 'pointsTo'], 'Content area sidebar item');

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
