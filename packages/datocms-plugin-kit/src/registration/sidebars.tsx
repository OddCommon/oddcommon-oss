import type {
  FullConnectParameters,
  ItemFormSidebar,
  ItemFormSidebarPanel,
} from 'datocms-plugin-sdk';

import type { PluginInternalConfig, SidebarConfig, SidebarPanelConfig } from '../types';
import { validateUniqueId } from '../utils/validation';

export function createSidebarRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  const panels = new Map<string, SidebarPanelConfig>();
  const sidebars = new Map<string, SidebarConfig>();

  function addSidebarPanel(panelConfig: SidebarPanelConfig) {
    const existingIds = Array.from(panels.keys());
    validateUniqueId(
      panelConfig.id,
      existingIds,
      'Sidebar panel',
      internalConfig.duplicateIdHandling,
    );

    // Store the config (Map.set naturally replaces if duplicate)
    panels.set(panelConfig.id, panelConfig);

    // Register declaration hook (single function that returns all panels)
    config.itemFormSidebarPanels = (_model, _ctx) => {
      return Array.from(panels.values()).map((panel) => {
        const result: ItemFormSidebarPanel = {
          id: panel.id,
          label: panel.label,
        };
        if (panel.startOpen !== undefined) result.startOpen = panel.startOpen;
        if (panel.placement !== undefined) result.placement = panel.placement;
        if (panel.rank !== undefined) result.rank = panel.rank;
        return result;
      });
    };

    // Register render hook
    if (!config.renderItemFormSidebarPanel) {
      config.renderItemFormSidebarPanel = (panelId, ctx) => {
        const panel = panels.get(panelId);
        if (panel) {
          const Component = panel.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addSidebar(sidebarConfig: SidebarConfig) {
    const existingIds = Array.from(sidebars.keys());
    validateUniqueId(sidebarConfig.id, existingIds, 'Sidebar', internalConfig.duplicateIdHandling);

    // Store the config (Map.set naturally replaces if duplicate)
    sidebars.set(sidebarConfig.id, sidebarConfig);

    // Register declaration hook (single function that returns all sidebars)
    config.itemFormSidebars = (model, ctx) => {
      return Array.from(sidebars.values())
        .filter((sidebar) => !sidebar.shouldApply || sidebar.shouldApply(model, ctx))
        .map((sidebar) => {
          const result: ItemFormSidebar = {
            id: sidebar.id,
            label: sidebar.label,
          };
          if (sidebar.preferredWidth !== undefined) result.preferredWidth = sidebar.preferredWidth;
          return result;
        });
    };

    // Register render hook
    if (!config.renderItemFormSidebar) {
      config.renderItemFormSidebar = (sidebarId, ctx) => {
        const sidebar = sidebars.get(sidebarId);
        if (sidebar) {
          const Component = sidebar.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }
  }

  return {
    addSidebarPanel,
    addSidebar,
  };
}
