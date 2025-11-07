# DatoCMS Plugin Organization Library - Design Document

**Date:** 2025-11-07
**Status:** Approved
**Package:** `@oddcommon/datocms-plugin-kit`

## Problem Statement

The DatoCMS plugin SDK requires a large configuration object passed to `connect()` with up to 45+ different hooks. Currently, developers must write everything in one giant configuration file, making it difficult to:

- Organize related functionality together
- Co-locate hook definitions with their React components
- Maintain and navigate the codebase as plugins grow in complexity
- Reuse patterns across different parts of the plugin

## Solution Overview

A lightweight library that provides a factory function (`createPluginConfig`) which returns a toolkit of registration functions. These functions allow developers to register hooks from any file in a modular way, building up the final configuration object internally before calling the SDK's `connect()` function.

## Architecture

### Factory Function Pattern

The core architecture uses a factory function that creates an isolated instance with shared state:

```typescript
export function createPluginConfig(options?: PluginOptions) {
  const config: Partial<FullConnectParameters> = {};
  const defaultRender = createDefaultRender();
  const render = options?.render ?? defaultRender;

  return {
    // Registration functions
    addFormOutlet,
    addCollectionOutlet,
    addPage,
    addMainNavigationTab,
    addContentAreaSidebarItem,
    addSettingsAreaSidebarItem,
    addSidebarPanel,
    addSidebar,
    addFieldExtension,
    overrideFieldExtension,
    addModal,
    configureConfigScreen,
    addDropdownAction,
    onBoot,
    onBeforeItemUpsert,
    onBeforeItemsDestroy,
    onBeforeItemsPublish,
    onBeforeItemsUnpublish,

    // Final connect
    connect: () => sdkConnect(config),
  };
}
```

**Key Design Decisions:**

1. **Factory over Singleton**: Factory pattern allows multiple isolated instances for testing and avoids global state issues
2. **Closure-based State**: The `config` object is captured in closures, providing clean encapsulation
3. **Single Export Point**: Users create one instance in `~/plugin.ts` and destructure the needed functions

### Hybrid Hook Registration

The library supports two registration patterns:

**Combined Registration (Primary):**

```typescript
addFormOutlet({
  id: 'demo-sync',
  component: DemoOutlet,
  initialHeight: 0,
  shouldApply: (model, ctx) => {
    const fields = Object.values(ctx.fields).map((f) => f?.attributes.api_key);
    return fields.includes('demo_event_id');
  },
});
```

This single call internally registers both:

- The declaration hook (`itemFormOutlets`)
- The render hook (`renderItemFormOutlet`)

**Separate Registration (Advanced):**

```typescript
// For complex declaration logic
registerItemFormOutlet({
  id: 'complex-outlet',
  initialHeight: 0,
  shouldApply: async (model, ctx) => {
    // Complex async logic
  }
});

// Renderer registered separately
registerItemFormOutletRenderer('complex-outlet', (ctx) => {
  render(<ComplexOutlet ctx={ctx} />);
});
```

Separation is useful when:

- Declaration logic is very complex or async
- Conditional registration is needed
- Multiple outlets share the same renderer

## Hook Coverage

### Tier 1: Essential (MVP)

**Custom Pages:**

- `addPage` - Register page components
- `addMainNavigationTab` - Top bar navigation
- `addContentAreaSidebarItem` - Content area sidebar items
- `addSettingsAreaSidebarItem` - Settings area sidebar items

**Form Outlets:**

- `addFormOutlet` - Record form outlets
- `addCollectionOutlet` - Collection page outlets

**Sidebars:**

- `addSidebarPanel` - Collapsible sidebar panels (item forms)
- `addSidebar` - Full custom sidebars (item forms)

**Field Extensions:**

- `addFieldExtension` - Manual field extensions
- `overrideFieldExtension` - Automatic field extensions

**UI Components:**

- `addModal` - Modal rendering
- `configureConfigScreen` - Plugin settings screen

**Dropdown Actions:**

- `addDropdownAction` - All dropdown action types:
  - Field-level actions
  - Item form actions
  - Batch item actions
  - Upload/asset actions

**Event Hooks:**

- `onBoot` - Plugin initialization
- `onBeforeItemUpsert` - Pre-save validation
- `onBeforeItemsDestroy` - Pre-delete confirmation
- `onBeforeItemsPublish` - Pre-publish validation
- `onBeforeItemsUnpublish` - Pre-unpublish validation

### Tier 2: Advanced (Future)

- `addAssetSource` - Custom asset sources
- `addUploadSidebarPanel` / `addUploadSidebar` - Asset sidebars
- `customizeStructuredText` - Structured text customizations
- `buildItemPresentationInfo` - Custom record presentation
- `guards` - Type guard utility helpers

## Default Render Implementation

The library provides a smart default render function using React 18's `createRoot` API:

```typescript
function createDefaultRender() {
  let root: Root | null = null;

  return (component: React.ReactNode): void => {
    if (root === null) {
      const container = document.getElementById('root');
      if (!container) {
        throw new Error('Root element not found');
      }
      root = createRoot(container);
    }

    root.render(<StrictMode>{component}</StrictMode>);
  };
}
```

**Features:**

- Lazy initialization (creates root on first render)
- Root reuse for subsequent renders
- StrictMode enabled by default
- Users can provide custom render function via options

## Type Safety

**Transparent Pass-Through Approach:**

- `datocms-plugin-sdk` marked as peer dependency
- All SDK types imported directly by library users
- No wrapper types or re-exports needed
- TypeScript naturally infers types from SDK

This keeps the library maintainable and always up-to-date with SDK changes.

## Error Handling

**ID Collision Detection:**

```typescript
function addFormOutlet(config: FormOutletConfig) {
  const existingIds = (config.itemFormOutlets || []).map((o) => o.id);
  if (existingIds.includes(config.id)) {
    throw new Error(`Form outlet with id "${config.id}" already registered`);
  }
  // ... register
}
```

**Missing Renderer Warning:**

```typescript
function connect() {
  const declaredOutlets = config.itemFormOutlets?.map((o) => o.id) || [];
  const registeredRenderers = Object.keys(outletRenderers);

  const missing = declaredOutlets.filter((id) => !registeredRenderers.includes(id));
  if (missing.length > 0) {
    console.warn(`Missing renderers for outlets: ${missing.join(', ')}`);
  }

  return sdkConnect(config);
}
```

**Configuration Validation:**

```typescript
function addPage(config: PageConfig) {
  if (!config.pageId || !config.component) {
    throw new Error('Page requires both pageId and component');
  }
  // ... register
}
```

## Package Structure

```
packages/datocms-sdk-connect/
├── src/
│   ├── index.ts                    # Main export: createPluginConfig
│   ├── types.ts                    # Type definitions
│   ├── factory.ts                  # createPluginConfig implementation
│   ├── render.ts                   # Default render function
│   ├── registration/
│   │   ├── pages.ts                # addPage, addMainNavigationTab, etc.
│   │   ├── outlets.ts              # addFormOutlet, addCollectionOutlet
│   │   ├── sidebars.ts             # addSidebarPanel, addSidebar
│   │   ├── fields.ts               # addFieldExtension, overrideFieldExtension
│   │   ├── modals.ts               # addModal
│   │   ├── dropdowns.ts            # addDropdownAction (all types)
│   │   ├── events.ts               # onBoot, onBeforeItemUpsert, etc.
│   │   └── config.ts               # configureConfigScreen
│   └── utils/
│       └── validation.ts           # Error checking utilities
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

```json
{
  "name": "@oddcommon/datocms-plugin-kit",
  "peerDependencies": {
    "datocms-plugin-sdk": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Usage Example

**Plugin Entry Point (`~/plugin.ts`):**

```typescript
import { createPluginConfig } from '@oddcommon/datocms-plugin-kit';

export const {
  addPage,
  addMainNavigationTab,
  addFormOutlet,
  addSidebarPanel,
  addFieldExtension,
  addDropdownAction,
  onBoot,
  connect,
} = createPluginConfig({
  render: (component) => {
    // Optional custom render function
    // If omitted, uses default React 18 createRoot
  },
});
```

**Form Outlet (`~/outlets/demo.tsx`):**

```typescript
import { addFormOutlet } from '~/plugin';

addFormOutlet({
  id: 'demo-sync',
  component: DemoOutlet,
  initialHeight: 0,
  shouldApply: (model, ctx) => {
    const fields = Object.values(ctx.fields).map((f) => f?.attributes.api_key);
    return fields.includes('demo_event_id') && fields.includes('demo_event_data');
  },
});

function DemoOutlet({ ctx }: { ctx: RenderItemFormOutletCtx }) {
  // Component implementation
}
```

**Custom Page (`~/pages/analytics.tsx`):**

```typescript
import { addMainNavigationTab, addPage } from '~/plugin';

const pageId = 'analytics';

addMainNavigationTab({
  label: 'Analytics',
  icon: 'chart-line',
  pointsTo: { pageId },
  placement: ['before', 'media'],
});

addPage({
  pageId,
  component: AnalyticsPage,
});

function AnalyticsPage({ ctx }: { ctx: RenderPageCtx }) {
  // Page implementation
}
```

**Main Entry (`~/main.ts`):**

```typescript
// Import all files that register hooks
import '~/outlets/demo';
import '~/pages/analytics';
// ... more imports

import { connect } from '~/plugin';
import '~/sidebars/preview';

// Build final config and call SDK connect
connect();
```

## Testing Strategy

**Unit Tests:**

- Test registration functions in isolation
- Verify ID collision detection
- Validate configuration validation
- Test error messages

**Integration Tests:**

- Test with mocked DatoCMS SDK
- Verify final config structure
- Test component rendering flow

Example:

```typescript
describe('createPluginConfig', () => {
  it('should register form outlets', () => {
    const { addFormOutlet } = createPluginConfig();

    addFormOutlet({
      id: 'test-outlet',
      component: () => <div>Test</div>,
      shouldApply: () => true,
    });

    // Verify registration
  });

  it('should throw on duplicate IDs', () => {
    const { addFormOutlet } = createPluginConfig();

    addFormOutlet({ id: 'test', component: () => null });

    expect(() => {
      addFormOutlet({ id: 'test', component: () => null });
    }).toThrow('already registered');
  });
});
```

## Implementation Phases

**Phase 1: Core Infrastructure**

- Factory function and core types
- Default render implementation
- Basic registration pattern

**Phase 2: Essential Hooks (Tier 1)**

- Pages and navigation
- Form outlets
- Sidebars and panels
- Field extensions
- Modals and config screen
- Dropdown actions
- Event hooks

**Phase 3: Testing & Documentation**

- Unit test coverage
- Integration tests
- API documentation
- Usage examples

**Phase 4: Advanced Features (Tier 2)**

- Asset sources
- Upload sidebars
- Structured text customizations
- Record presentation
- Type guard utilities

## Success Criteria

1. **Code Organization**: Plugins can split hook definitions across multiple files
2. **Type Safety**: Full TypeScript support with SDK type inference
3. **DX**: Simpler API compared to raw SDK usage
4. **Zero Magic**: Clear, predictable behavior
5. **Minimal Overhead**: Thin wrapper with no performance impact
6. **Maintainability**: Easy to update when SDK changes

## Future Considerations

- **Hot Module Replacement**: Support for development workflow
- **Testing Utilities**: Mock builders for testing plugin code
- **CLI Tools**: Code generation for common patterns
- **Advanced Type Guards**: Tier 2 utility expansion
