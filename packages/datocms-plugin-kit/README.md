# @oddcommon/datocms-plugin-kit

A toolkit for building organized, modular DatoCMS plugins.

## Problem

The DatoCMS plugin SDK requires a large configuration object with 45+ hooks. Managing all these hooks in a single file quickly becomes unwieldy and difficult to maintain. This library provides a factory-function-based approach that lets you split your plugin configuration across multiple files for better organization and modularity.

## Installation

```bash
pnpm add @oddcommon/datocms-plugin-kit
```

### Requirements

- **React 19.x** - This library requires React 19 or later as a peer dependency
- **Node.js 22+** - For development and building

## Usage

### 1. Create Plugin Configuration

```typescript
// ~/plugin.ts
import { createPluginConfig } from '@oddcommon/datocms-plugin-kit';

export const {
  addFormOutlet,
  addPage,
  addMainNavigationTab,
  addSidebarPanel,
  customBlockStylesForStructuredTextField,
  customMarksForStructuredTextField,
  connect,
} = createPluginConfig({
  // Optional: custom render function
  // If omitted, uses React 19's createRoot with StrictMode
  render: (component) => {
    // your custom render
  },
});
```

### 2. Register Hooks from Any File

```typescript
// ~/outlets/demo.tsx
import { addFormOutlet } from '~/plugin';

addFormOutlet({
  id: 'demo-sync',
  component: DemoOutlet,
  initialHeight: 0,
  shouldApply: (model, ctx) => {
    const fields = Object.values(ctx.fields).map(f => f?.attributes.api_key);
    return fields.includes('demo_event_id');
  },
});

function DemoOutlet({ ctx }) {
  return <div>Your outlet UI</div>;
}
```

```typescript
// ~/pages/analytics.tsx
import { addPage, addMainNavigationTab } from '~/plugin';

const pageId = 'analytics';

addMainNavigationTab({
  label: 'Analytics',
  icon: 'chart-line',
  pointsTo: { pageId },
});

addPage({
  pageId,
  component: AnalyticsPage,
});

function AnalyticsPage({ ctx }) {
  return <div>Analytics page</div>;
}
```

### 3. Connect in Main Entry

```typescript
// ~/main.ts
import '~/outlets/demo';
import '~/pages/analytics';
// ... other imports

import { connect } from '~/plugin';

connect();
```

## API Reference

### Core

#### `createPluginConfig(options?)`

Creates a plugin toolkit with all registration functions.

**Options:**

- `render?: (component: React.ReactNode) => void` - Custom render function. Defaults to React 19's `createRoot` with `StrictMode`.

**Returns:** Object with all registration functions and `connect()`.

### Pages

#### `addPage(config)`

Register a page component.

**Config:**

- `pageId: string` - Unique identifier for the page
- `component: React.ComponentType<{ ctx: RenderPageCtx }>` - Page component

```typescript
addPage({
  pageId: 'my-page',
  component: MyPageComponent,
});
```

#### `addMainNavigationTab(config)`

Add a tab to the top navigation bar.

**Config:**

- `label: string` - Tab label
- `icon: Icon` - Icon (string or SVG object)
- `pointsTo: { pageId: string }` - Target page ID
- `placement?: [string, string]` - Optional placement
- `rank?: number` - Optional ordering

```typescript
addMainNavigationTab({
  label: 'Analytics',
  icon: 'chart-line',
  pointsTo: { pageId: 'analytics-page' },
});
```

#### `addContentAreaSidebarItem(config)`

Add an item to the content area sidebar.

**Config:**

- `label: string` - Item label
- `icon: Icon` - Icon
- `pointsTo: { pageId: string }` - Target page ID
- `placement?: [string, string]` - Optional placement
- `rank?: number` - Optional ordering

#### `addSettingsAreaSidebarItem(config)`

Add an item to the settings area sidebar. Same config as `addContentAreaSidebarItem`.

### Form Outlets

#### `addFormOutlet(config)`

Add an outlet to item forms.

**Config:**

- `id: string` - Unique outlet ID
- `component: React.ComponentType<{ ctx: RenderItemFormOutletCtx }>` - Outlet component
- `initialHeight?: number` - Initial height in pixels (default: 0)
- `shouldApply?: (model: ItemType, ctx: ItemFormOutletsCtx) => boolean` - Conditional display

```typescript
addFormOutlet({
  id: 'custom-outlet',
  component: CustomOutletComponent,
  initialHeight: 200,
  shouldApply: (model, ctx) => {
    return model.attributes.api_key === 'article';
  },
});
```

#### `addCollectionOutlet(config)`

Add an outlet to collection views. (Note: Not yet fully implemented in Tier 1)

### Sidebars

#### `addSidebarPanel(config)`

Add a collapsible panel to the item form sidebar.

**Config:**

- `id: string` - Unique panel ID
- `component: React.ComponentType<{ ctx: RenderItemFormSidebarPanelCtx }>` - Panel component
- `label: string` - Panel label
- `startOpen?: boolean` - Whether panel starts expanded
- `placement?: [string, string]` - Optional placement
- `rank?: number` - Optional ordering

```typescript
addSidebarPanel({
  id: 'metadata-panel',
  component: MetadataPanel,
  label: 'Metadata',
  startOpen: true,
});
```

#### `addSidebar(config)`

Add a full custom sidebar to item forms.

**Config:**

- `id: string` - Unique sidebar ID
- `component: React.ComponentType<{ ctx: RenderItemFormSidebarCtx }>` - Sidebar component
- `label: string` - Sidebar label
- `preferredWidth?: number` - Preferred width in pixels
- `shouldApply?: (model: ItemType, ctx: any) => boolean` - Conditional display

### Field Extensions

#### `addFieldExtension(config)`

Register a manual field extension (editor or addon).

**Config:**

- `id: string` - Unique extension ID
- `name: string` - Extension name
- `type: 'editor' | 'addon'` - Extension type
- `fieldTypes: string[]` - Compatible field types
- `component: React.ComponentType<{ ctx: RenderFieldExtensionCtx }>` - Extension component
- `configurable?: boolean` - Whether extension is configurable
- `configComponent?: React.ComponentType` - Config screen component (if configurable)
- `validateConfig?: (params: Record<string, unknown>) => Record<string, string>` - Config validator

```typescript
addFieldExtension({
  id: 'color-picker',
  name: 'Color Picker',
  type: 'editor',
  fieldTypes: ['string'],
  component: ColorPickerEditor,
  configurable: true,
  configComponent: ColorPickerConfig,
});
```

#### `overrideFieldExtension(config)`

Automatically override field extensions based on conditions.

**Config:**

- `shouldApply: (field: Field, ctx: OverrideFieldExtensionsCtx) => boolean` - Condition function
- `editor?: { id: string; parameters?: Record<string, unknown> }` - Editor override
- `addons?: Array<{ id: string; parameters?: Record<string, unknown> }>` - Addon overrides

```typescript
overrideFieldExtension({
  shouldApply: (field, ctx) => field.attributes.api_key === 'color',
  editor: { id: 'color-picker' },
});
```

#### `addHiddenField(predicate)`

Conditionally hide fields from the DatoCMS UI based on custom logic.

**Predicate:**

- `(field: Field, ctx: OverrideFieldExtensionsCtx) => boolean` - Function that returns `true` if the field should be hidden

**Behavior:**

- Multiple predicates can be registered by calling `addHiddenField` multiple times
- Hidden field predicates are checked **before** user-defined field extension overrides
- When a predicate returns `true`, the field is automatically hidden from the UI
- The field editor is replaced with a built-in hidden field extension that renders nothing

**Example - Hide specific fields in a block:**

```typescript
import { addHiddenField, getFieldItemType } from '~/plugin';

addHiddenField((field, ctx) => {
  const hiddenFields = ['managed_id', 'managed_data'];
  const blockApiKey = 'external_content_block';

  const parent = getFieldItemType(field, ctx);
  return (
    parent &&
    parent.attributes.api_key === blockApiKey &&
    hiddenFields.includes(field.attributes.api_key)
  );
});
```

**Example - Hide fields based on field type:**

```typescript
addHiddenField((field, ctx) => {
  // Hide all JSON fields with a specific prefix
  return (
    field.attributes.field_type === 'json' &&
    field.attributes.api_key.startsWith('internal_')
  );
});
```

**Use cases:**

- Hide managed/internal fields that should not be edited manually
- Conditionally hide fields based on parent model or block type
- Hide fields used for automation or integration purposes
- Dynamically hide fields based on complex business logic

### UI Components

#### `addModal(config)`

Register a modal component.

**Config:**

- `id: string` - Unique modal ID
- `component: React.ComponentType<{ ctx: RenderModalCtx }>` - Modal component

```typescript
addModal({
  id: 'confirmation-modal',
  component: ConfirmationModal,
});
```

#### `configureConfigScreen(config)`

Set the plugin settings screen.

**Config:**

- `component: React.ComponentType<{ ctx: RenderConfigScreenCtx }>` - Settings screen component

```typescript
configureConfigScreen({
  component: PluginSettingsScreen,
});
```

### Actions

#### `addDropdownAction(config)`

Add dropdown actions to various contexts.

**Config:**

- `type: 'field' | 'itemForm' | 'items' | 'uploads'` - Action context
- `id: string` - Unique action ID
- `label: string` - Action label
- `icon?: Icon` - Optional icon
- `execute: (ctx: ExecuteCtx) => Promise<void>` - Action handler
- `shouldApply?: (...args: any[]) => boolean` - Conditional display

```typescript
addDropdownAction({
  type: 'items',
  id: 'bulk-export',
  label: 'Export to CSV',
  icon: 'download',
  execute: async (ctx) => {
    // Export logic
  },
});
```

### Structured Text Customizations

#### `customBlockStylesForStructuredTextField(handler)`

Add custom block styles to structured text fields (e.g., emphasized paragraphs, special headings).

**Handler:** `(field: Field, ctx: CustomBlockStylesForStructuredTextFieldCtx) => StructuredTextCustomBlockStyle[] | undefined`

```typescript
customBlockStylesForStructuredTextField((field, ctx) => {
  // Only apply to specific fields
  if (field.attributes.api_key !== 'article_content') {
    return [];
  }

  return [
    {
      id: 'emphasized',
      node: 'paragraph',
      label: 'Emphasized',
      appliedStyle: {
        fontFamily: 'Georgia',
        fontStyle: 'italic',
        fontSize: '1.4em',
        lineHeight: '1.2',
      },
    },
    {
      id: 'callout',
      node: 'heading',
      label: 'Callout Heading',
      appliedStyle: {
        backgroundColor: '#f0f0f0',
        padding: '0.5em',
      },
    },
  ];
});
```

#### `customMarksForStructuredTextField(handler)`

Add custom marks to structured text fields (e.g., spoiler text, custom highlights).

**Handler:** `(field: Field, ctx: CustomMarksForStructuredTextFieldCtx) => StructuredTextCustomMark[] | undefined`

```typescript
customMarksForStructuredTextField((field, ctx) => {
  return [
    {
      id: 'spoiler',
      label: 'Spoiler',
      icon: 'bomb',
      keyboardShortcut: 'mod+shift+s',
      appliedStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'rgba(0, 0, 0, 0.8)',
      },
    },
    {
      id: 'keyboard',
      label: 'Keyboard',
      icon: 'keyboard',
      appliedStyle: {
        fontFamily: 'monospace',
        backgroundColor: '#f0f0f0',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
      },
    },
  ];
});
```

**Note:** You're responsible for rendering these custom styles and marks on the frontend using DatoCMS's Structured Text libraries (React, Vue, etc.).

### Events

#### `onBoot(handler)`

Register a plugin initialization handler.

**Handler:** `(ctx: OnBootCtx) => void | Promise<void>`

```typescript
onBoot(async (ctx) => {
  console.log('Plugin initialized');
});
```

#### `onBeforeItemUpsert(handler)`

Register a pre-save hook.

**Handler:** `(item: any, ctx: any) => boolean | Promise<boolean>`

Returns `true` to allow save, `false` to prevent.

```typescript
onBeforeItemUpsert(async (item, ctx) => {
  if (!item.title) {
    ctx.alert('Title is required');
    return false;
  }
  return true;
});
```

#### `onBeforeItemsDestroy(handler)`

Register a pre-delete hook.

**Handler:** `(items: any[], ctx: any) => boolean | Promise<boolean>`

```typescript
onBeforeItemsDestroy(async (items, ctx) => {
  const confirmed = await ctx.openConfirm({
    title: 'Delete items?',
    content: `Delete ${items.length} items?`,
  });
  return confirmed;
});
```

#### `onBeforeItemsPublish(handler)`

Register a pre-publish hook.

**Handler:** `(items: any[], ctx: any) => boolean | Promise<boolean>`

#### `onBeforeItemsUnpublish(handler)`

Register a pre-unpublish hook.

**Handler:** `(items: any[], ctx: any) => boolean | Promise<boolean>`

### Connect

#### `connect()`

Build the complete configuration and connect to the DatoCMS plugin SDK. This must be called after all registrations are complete.

```typescript
import { connect } from '~/plugin';

connect();
```

## TypeScript

All types from `datocms-plugin-sdk` pass through transparently. Import types directly from the SDK:

```typescript
import type { Field, ItemType, RenderPageCtx } from 'datocms-plugin-sdk';
```

You can also import configuration types from this library:

```typescript
import type {
  DropdownActionConfig,
  FieldExtensionConfig,
  FormOutletConfig,
  PageConfig,
} from '@oddcommon/datocms-plugin-kit';
```

## Architecture

This library uses a factory function pattern that returns registration helpers. These helpers build up a shared configuration object internally. When you call `connect()`, the complete configuration is passed to the DatoCMS SDK's `connect()` function.

The hybrid approach allows you to:

- Register both component and declaration in a single call (combined approach)
- Split components and declarations across files
- Organize your plugin code by feature rather than hook type

## License

MIT

## Author

Alban Creton - OddCommon

> ### Disclaimer
>
> The very first version of the library was almost entirely generated by Anthropic's LLM models `Claude Sonnet 4.5` and `Claude Opus 4.1` using [Claude Code](https://www.claude.com/product/claude-code).
>
> All the prompts used to generate that first version have been preserved in [`.claude`](./.claude).
> The design and plan files were generated using [@obra](https://github.com/obra)'s [superpowers skills](https://github.com/obra/superpowers).
> The untouched generated code can be found in the very first commit made for this package.
