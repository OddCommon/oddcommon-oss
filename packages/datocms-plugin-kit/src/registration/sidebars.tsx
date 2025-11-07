import type { FullConnectParameters, ItemFormSidebar, ItemFormSidebarPanel, RenderItemFormSidebarCtx, RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { SidebarConfig, SidebarPanelConfig } from '../types';

export function createSidebarRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const sidebarPanelRenderers = new Map<string, React.ComponentType<{ ctx: RenderItemFormSidebarPanelCtx }>>();
  const sidebarRenderers = new Map<string, React.ComponentType<{ ctx: RenderItemFormSidebarCtx }>>();
  const registeredPanelIds = new Set<string>();
  const registeredSidebarIds = new Set<string>();
  const panelConfigs: SidebarPanelConfig[] = [];
  const sidebarConfigs: SidebarConfig[] = [];

  function addSidebarPanel(panelConfig: SidebarPanelConfig) {
    validateRequired(panelConfig as unknown as Record<string, unknown>, ['id', 'label', 'component'], 'Sidebar panel');

    const existingIds = Array.from(registeredPanelIds);
    validateUniqueId(panelConfig.id, existingIds, 'Sidebar panel');

    // Track the registered ID and config
    registeredPanelIds.add(panelConfig.id);
    panelConfigs.push(panelConfig);

    // Register declaration hook (single function that returns all panels)
    config.itemFormSidebarPanels = (_model, _ctx) => {
      const panels = panelConfigs.map(config => {
        const panel: ItemFormSidebarPanel = {
          id: config.id,
          label: config.label,
        };
        if (config.startOpen !== undefined) panel.startOpen = config.startOpen;
        if (config.placement !== undefined) panel.placement = config.placement;
        if (config.rank !== undefined) panel.rank = config.rank;
        return panel;
      });
      return panels;
    };

    // Store component for rendering
    sidebarPanelRenderers.set(panelConfig.id, panelConfig.component);

    // Register render hook
    if (!config.renderItemFormSidebarPanel) {
      config.renderItemFormSidebarPanel = (panelId, ctx) => {
        const Component = sidebarPanelRenderers.get(panelId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addSidebar(sidebarConfig: SidebarConfig) {
    validateRequired(sidebarConfig as unknown as Record<string, unknown>, ['id', 'label', 'component'], 'Sidebar');

    const existingIds = Array.from(registeredSidebarIds);
    validateUniqueId(sidebarConfig.id, existingIds, 'Sidebar');

    // Track the registered ID and config
    registeredSidebarIds.add(sidebarConfig.id);
    sidebarConfigs.push(sidebarConfig);

    // Register declaration hook (single function that returns all sidebars)
    config.itemFormSidebars = (model, ctx) => {
      const sidebars = sidebarConfigs
        .filter(config => !config.shouldApply || config.shouldApply(model, ctx))
        .map(config => {
          const sidebar: ItemFormSidebar = {
            id: config.id,
            label: config.label,
          };
          if (config.preferredWidth !== undefined) sidebar.preferredWidth = config.preferredWidth;
          return sidebar;
        });
      return sidebars;
    };

    // Store component for rendering
    sidebarRenderers.set(sidebarConfig.id, sidebarConfig.component);

    // Register render hook
    if (!config.renderItemFormSidebar) {
      config.renderItemFormSidebar = (sidebarId, ctx) => {
        const Component = sidebarRenderers.get(sidebarId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  return {
    addSidebarPanel,
    addSidebar,
  };
}
