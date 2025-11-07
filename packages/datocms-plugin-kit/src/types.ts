import type {
  ExecuteFieldDropdownActionCtx,
  ExecuteItemFormDropdownActionCtx,
  ExecuteItemsDropdownActionCtx,
  ExecuteUploadsDropdownActionCtx,
  Field,
  FieldType,
  Icon,
  Item,
  ItemCollectionOutletsCtx,
  ItemFormOutletsCtx,
  ItemFormSidebarPanelPlacement,
  ItemFormSidebarsCtx,
  ItemType,
  OnBeforeItemsDestroyCtx,
  OnBeforeItemsPublishCtx,
  OnBeforeItemsUnpublishCtx,
  OnBeforeItemUpsertCtx,
  OnBootCtx,
  OverrideFieldExtensionsCtx,
  RenderConfigScreenCtx,
  RenderFieldExtensionCtx,
  RenderItemCollectionOutletCtx,
  RenderItemFormOutletCtx,
  RenderItemFormSidebarCtx,
  RenderItemFormSidebarPanelCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  RenderModalCtx,
  RenderPageCtx,
} from 'datocms-plugin-sdk';

// Plugin configuration
export interface PluginOptions {
  render?: (component: React.ReactNode) => void;
}

// Form Outlet
export interface FormOutletConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemFormOutletCtx }>;
  initialHeight?: number;
  shouldApply?: (model: ItemType, ctx: ItemFormOutletsCtx) => boolean;
}

// Collection Outlet
export interface CollectionOutletConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemCollectionOutletCtx }>;
  initialHeight?: number;
  shouldApply?: (model: ItemType, ctx: ItemCollectionOutletsCtx) => boolean;
}

// Page
export interface PageConfig {
  pageId: string;
  component: React.ComponentType<{ ctx: RenderPageCtx }>;
}

// Navigation Tab
export interface MainNavigationTabConfig {
  label: string;
  icon: Icon;
  pointsTo: { pageId: string };
  placement?: [
    'before' | 'after',
    'content' | 'media' | 'schema' | 'configuration' | 'cdaPlayground'
  ];
  rank?: number;
}

// Content Area Sidebar Item
export interface ContentAreaSidebarItemConfig {
  label: string;
  icon: Icon;
  pointsTo: { pageId: string };
  placement?: ['before' | 'after', 'menuItems' | 'seoPreferences'];
  rank?: number;
}

// Sidebar Panel
export interface SidebarPanelConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemFormSidebarPanelCtx }>;
  label: string;
  startOpen?: boolean;
  placement?: ItemFormSidebarPanelPlacement;
  rank?: number;
}

// Sidebar (full)
export interface SidebarConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemFormSidebarCtx }>;
  label: string;
  preferredWidth?: number;
  shouldApply?: (model: ItemType, ctx: ItemFormSidebarsCtx) => boolean;
}

// Field Extension
export interface FieldExtensionConfig {
  id: string;
  name: string;
  type: 'editor' | 'addon';
  fieldTypes: FieldType[] | 'all';
  component: React.ComponentType<{ ctx: RenderFieldExtensionCtx }>;
  configurable?: boolean;
  configComponent?: React.ComponentType<{ ctx: RenderManualFieldExtensionConfigScreenCtx }>;
  validateConfig?: (params: Record<string, unknown>) => Record<string, string>;
}

// Field Extension Override
export interface FieldExtensionOverrideConfig {
  shouldApply: (field: Field, ctx: OverrideFieldExtensionsCtx) => boolean;
  editor?: { id: string; parameters?: Record<string, unknown> };
  addons?: Array<{ id: string; parameters?: Record<string, unknown> }>;
}

// Modal
export interface ModalConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderModalCtx }>;
}

// Config Screen
export interface ConfigScreenConfig {
  component: React.ComponentType<{ ctx: RenderConfigScreenCtx }>;
}

// Dropdown Action
export type DropdownActionType = 'field' | 'itemForm' | 'items' | 'uploads';

export interface DropdownActionConfig {
  type: DropdownActionType;
  id: string;
  label: string;
  icon?: Icon;
  execute: (
    ctx:
      | ExecuteFieldDropdownActionCtx
      | ExecuteItemFormDropdownActionCtx
      | ExecuteItemsDropdownActionCtx
      | ExecuteUploadsDropdownActionCtx
  ) => Promise<void>;
  shouldApply?: (...args: unknown[]) => boolean;
}

// Event Hooks
export type OnBootHandler = (ctx: OnBootCtx) => void | Promise<void>;
export type OnBeforeItemUpsertHandler = (
  createOrUpdateItemPayload: Record<string, unknown>,
  ctx: OnBeforeItemUpsertCtx
) => boolean | Promise<boolean>;
export type OnBeforeItemsDestroyHandler = (
  items: Item[],
  ctx: OnBeforeItemsDestroyCtx
) => boolean | Promise<boolean>;
export type OnBeforeItemsPublishHandler = (
  items: Item[],
  ctx: OnBeforeItemsPublishCtx
) => boolean | Promise<boolean>;
export type OnBeforeItemsUnpublishHandler = (
  items: Item[],
  ctx: OnBeforeItemsUnpublishCtx
) => boolean | Promise<boolean>;
