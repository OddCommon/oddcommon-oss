# DatoCMS Plugin Organization Library - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a factory-function-based library that lets developers organize DatoCMS plugin hooks across multiple files instead of one giant config object.

**Architecture:** Factory function returns registration helpers that build up a shared config object. When `connect()` is called, the complete config is passed to the SDK's `connect()`. Hybrid approach allows combined (component + declaration) or separate registration.

**Tech Stack:** TypeScript, React 19, Vitest, datocms-plugin-sdk v2

---

## Task 1: Core Types and Interfaces

**Files:**

- Create: `src/types.ts`
- Create: `src/types.test.ts`

**Step 1: Write type definitions test**

Create `src/types.test.ts`:

```typescript
import { describe, expectTypeOf, it } from 'vitest';

import type { FormOutletConfig, PageConfig, PluginOptions } from './types';

describe('Types', () => {
  it('should define PluginOptions with optional render', () => {
    expectTypeOf<PluginOptions>().toMatchTypeOf<{
      render?: (component: React.ReactNode) => void;
    }>();
  });

  it('should define FormOutletConfig with required fields', () => {
    expectTypeOf<FormOutletConfig>().toHaveProperty('id');
    expectTypeOf<FormOutletConfig>().toHaveProperty('component');
  });

  it('should define PageConfig with pageId and component', () => {
    expectTypeOf<PageConfig>().toHaveProperty('pageId');
    expectTypeOf<PageConfig>().toHaveProperty('component');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/types.test.ts`
Expected: FAIL with "Cannot find module './types'"

**Step 3: Write type definitions**

Create `src/types.ts`:

```typescript
import type {
  ContentAreaSidebarItemsCtx,
  ExecuteFieldDropdownActionCtx,
  ExecuteItemFormDropdownActionCtx,
  ExecuteItemsDropdownActionCtx,
  ExecuteUploadsDropdownActionCtx,
  Field,
  FieldIntentCtx,
  ItemFormOutletsCtx,
  ItemFormSidebarPanelsCtx,
  ItemType,
  MainNavigationTabsCtx,
  OnBootCtx,
  RenderConfigScreenCtx,
  RenderFieldExtensionCtx,
  RenderItemFormOutletCtx,
  RenderItemFormSidebarCtx,
  RenderItemFormSidebarPanelCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  RenderModalCtx,
  RenderPageCtx,
  SettingsAreaSidebarItemGroupsCtx,
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
  component: React.ComponentType<{ ctx: any }>; // TODO: Add proper type from SDK
  initialHeight?: number;
  shouldApply?: (model: ItemType, ctx: any) => boolean;
}

// Page
export interface PageConfig {
  pageId: string;
  component: React.ComponentType<{ ctx: RenderPageCtx }>;
}

// Navigation Tab
export interface MainNavigationTabConfig {
  label: string;
  icon: string | { type: 'svg'; viewBox: string; content: string };
  pointsTo: { pageId: string };
  placement?: [string, string];
}

// Sidebar Panel
export interface SidebarPanelConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemFormSidebarPanelCtx }>;
  label: string;
  startOpen?: boolean;
  placement?: [string, string];
  rank?: number;
}

// Sidebar (full)
export interface SidebarConfig {
  id: string;
  component: React.ComponentType<{ ctx: RenderItemFormSidebarCtx }>;
  label: string;
  preferredWidth?: number;
  shouldApply?: (model: ItemType, ctx: any) => boolean;
}

// Field Extension
export interface FieldExtensionConfig {
  id: string;
  name: string;
  type: 'editor' | 'addon';
  fieldTypes: string[];
  component: React.ComponentType<{ ctx: RenderFieldExtensionCtx }>;
  configurable?: boolean;
  configComponent?: React.ComponentType<{ ctx: RenderManualFieldExtensionConfigScreenCtx }>;
  validateConfig?: (params: Record<string, unknown>) => Record<string, string>;
}

// Field Extension Override
export interface FieldExtensionOverrideConfig {
  shouldApply: (field: Field, ctx: FieldIntentCtx) => boolean;
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
  icon?: string;
  execute: (
    ctx:
      | ExecuteFieldDropdownActionCtx
      | ExecuteItemFormDropdownActionCtx
      | ExecuteItemsDropdownActionCtx
      | ExecuteUploadsDropdownActionCtx,
  ) => Promise<void>;
  shouldApply?: (...args: any[]) => boolean;
}

// Event Hooks
export type OnBootHandler = (ctx: OnBootCtx) => void | Promise<void>;
export type OnBeforeItemUpsertHandler = (item: any, ctx: any) => boolean | Promise<boolean>;
export type OnBeforeItemsDestroyHandler = (items: any[], ctx: any) => boolean | Promise<boolean>;
export type OnBeforeItemsPublishHandler = (items: any[], ctx: any) => boolean | Promise<boolean>;
export type OnBeforeItemsUnpublishHandler = (items: any[], ctx: any) => boolean | Promise<boolean>;
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/types.test.ts`
Expected: PASS

**Step 5: Commit**

Suggestion: Commit with message "feat: add core type definitions"

---

## Task 2: Default Render Function

**Files:**

- Create: `src/render.ts`
- Create: `src/render.test.ts`

**Step 1: Write the failing test**

Create `src/render.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDefaultRender } from './render';
import { StrictMode } from 'react';

// Mock react-dom/client
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

describe('createDefaultRender', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it('should create a render function', () => {
    const render = createDefaultRender();
    expect(render).toBeTypeOf('function');
  });

  it('should lazily create root on first render', async () => {
    const { createRoot } = await import('react-dom/client');
    const render = createDefaultRender();

    render(<div>Test</div>);

    expect(createRoot).toHaveBeenCalledOnce();
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
  });

  it('should reuse root on subsequent renders', async () => {
    const { createRoot } = await import('react-dom/client');
    const render = createDefaultRender();

    render(<div>Test 1</div>);
    render(<div>Test 2</div>);

    expect(createRoot).toHaveBeenCalledOnce();
  });

  it('should wrap component in StrictMode', async () => {
    const mockRender = vi.fn();
    const { createRoot } = await import('react-dom/client');
    vi.mocked(createRoot).mockReturnValue({ render: mockRender } as any);

    const render = createDefaultRender();
    const testComponent = <div>Test</div>;

    render(testComponent);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StrictMode,
      })
    );
  });

  it('should throw error if root element not found', () => {
    document.body.innerHTML = '';
    const render = createDefaultRender();

    expect(() => render(<div>Test</div>)).toThrow('Root element with id "root" not found');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/render.test.ts`
Expected: FAIL with "Cannot find module './render'"

**Step 3: Write minimal implementation**

Create `src/render.ts`:

```typescript
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export function createDefaultRender() {
  let root: Root | null = null;

  return (component: React.ReactNode): void => {
    if (root === null) {
      const container = document.getElementById('root');
      if (!container) {
        throw new Error('Root element with id "root" not found');
      }
      root = createRoot(container);
    }

    root.render(<StrictMode>{component}</StrictMode>);
  };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/render.test.ts`
Expected: PASS

**Step 5: Commit**

Suggestion: Commit with message "feat: add default render function with React 19 createRoot"

---

## Task 3: Validation Utilities

**Files:**

- Create: `src/utils/validation.ts`
- Create: `src/utils/validation.test.ts`

**Step 1: Write the failing test**

Create `src/utils/validation.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';

import { validateRequired, validateUniqueId } from './validation';

describe('Validation utilities', () => {
  describe('validateUniqueId', () => {
    it('should not throw for unique ID', () => {
      expect(() => {
        validateUniqueId('new-id', ['existing-1', 'existing-2'], 'outlet');
      }).not.toThrow();
    });

    it('should throw for duplicate ID', () => {
      expect(() => {
        validateUniqueId('existing-1', ['existing-1', 'existing-2'], 'outlet');
      }).toThrow('outlet with id "existing-1" is already registered');
    });
  });

  describe('validateRequired', () => {
    it('should not throw when all required fields present', () => {
      expect(() => {
        validateRequired({ id: 'test', name: 'Test' }, ['id', 'name'], 'config');
      }).not.toThrow();
    });

    it('should throw when required field missing', () => {
      expect(() => {
        validateRequired({ id: 'test' }, ['id', 'name'], 'config');
      }).toThrow('config requires field "name"');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/utils/validation.test.ts`
Expected: FAIL with "Cannot find module './validation'"

**Step 3: Write minimal implementation**

Create `src/utils/validation.ts`:

```typescript
export function validateUniqueId(id: string, existingIds: string[], type: string): void {
  if (existingIds.includes(id)) {
    throw new Error(`${type} with id "${id}" is already registered`);
  }
}

export function validateRequired(
  obj: Record<string, unknown>,
  requiredFields: string[],
  type: string,
): void {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined) {
      throw new Error(`${type} requires field "${field}"`);
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/utils/validation.test.ts`
Expected: PASS

**Step 5: Commit**

Suggestion: Commit with message "feat: add validation utilities"

---

## Task 4: Factory Function Core

**Files:**

- Create: `src/factory.ts`
- Create: `src/factory.test.ts`

**Step 1: Write the failing test**

Create `src/factory.test.ts`:

```typescript
import { describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from './factory';

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn(),
}));

describe('createPluginConfig', () => {
  it('should return an object with registration functions', () => {
    const plugin = createPluginConfig();

    expect(plugin).toHaveProperty('addFormOutlet');
    expect(plugin).toHaveProperty('addPage');
    expect(plugin).toHaveProperty('addMainNavigationTab');
    expect(plugin).toHaveProperty('connect');
  });

  it('should use custom render function when provided', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });

    expect(plugin).toBeDefined();
    // Render function will be tested via registration functions
  });

  it('should call SDK connect when connect is called', async () => {
    const { connect: sdkConnect } = await import('datocms-plugin-sdk');
    const plugin = createPluginConfig();

    plugin.connect();

    expect(sdkConnect).toHaveBeenCalledOnce();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/factory.test.ts`
Expected: FAIL with "Cannot find module './factory'"

**Step 3: Write minimal implementation**

Create `src/factory.ts`:

```typescript
import { connect as sdkConnect } from 'datocms-plugin-sdk';
import type { FullConnectParameters } from 'datocms-plugin-sdk';

import { createDefaultRender } from './render';
import type { PluginOptions } from './types';

export function createPluginConfig(options?: PluginOptions) {
  const config: Partial<FullConnectParameters> = {};
  const render = options?.render ?? createDefaultRender();

  // Placeholder registration functions (will be implemented in subsequent tasks)
  const addFormOutlet = () => {
    throw new Error('Not implemented');
  };

  const addPage = () => {
    throw new Error('Not implemented');
  };

  const addMainNavigationTab = () => {
    throw new Error('Not implemented');
  };

  const connect = () => {
    return sdkConnect(config);
  };

  return {
    addFormOutlet,
    addPage,
    addMainNavigationTab,
    connect,
    // More functions will be added in subsequent tasks
  };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/factory.test.ts`
Expected: PASS

**Step 5: Commit**

Suggestion: Commit with message "feat: add factory function skeleton"

---

## Task 5: Form Outlet Registration

**Files:**

- Modify: `src/factory.ts`
- Create: `src/registration/outlets.ts`
- Create: `src/registration/outlets.test.ts`

**Step 1: Write the failing test**

Create `src/registration/outlets.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Form Outlet Registration', () => {
  it('should register a form outlet with combined approach', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
        initialHeight: 100,
        shouldApply: () => true,
      });
    }).not.toThrow();
  });

  it('should throw on duplicate form outlet ID', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    plugin.addFormOutlet({
      id: 'test-outlet',
      component: TestComponent,
    });

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
      });
    }).toThrow('Form outlet with id "test-outlet" is already registered');
  });

  it('should register multiple form outlets with different IDs', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({ id: 'outlet-1', component: TestComponent });
      plugin.addFormOutlet({ id: 'outlet-2', component: TestComponent });
    }).not.toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/registration/outlets.test.ts`
Expected: FAIL with "Cannot find module '../registration/outlets'"

**Step 3: Write implementation**

Create `src/registration/outlets.ts`:

```typescript
import type { FullConnectParameters } from 'datocms-plugin-sdk';
import { validateUniqueId, validateRequired } from '../utils/validation';
import type { FormOutletConfig, CollectionOutletConfig } from '../types';

export function createOutletRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const outletRenderers = new Map<string, React.ComponentType<any>>();

  function addFormOutlet(outletConfig: FormOutletConfig) {
    validateRequired(outletConfig, ['id', 'component'], 'Form outlet');

    const existingIds = config.itemFormOutlets?.map((o) => o.id) || [];
    validateUniqueId(outletConfig.id, existingIds, 'Form outlet');

    // Register declaration hook
    if (!config.itemFormOutlets) {
      config.itemFormOutlets = [];
    }

    config.itemFormOutlets.push((model, ctx) => {
      const { id, initialHeight = 0, shouldApply } = outletConfig;

      if (shouldApply && !shouldApply(model, ctx)) {
        return [];
      }

      return [{ id, initialHeight }];
    });

    // Store component for rendering
    outletRenderers.set(outletConfig.id, outletConfig.component);

    // Register render hook
    if (!config.renderItemFormOutlet) {
      config.renderItemFormOutlet = (outletId, ctx) => {
        const Component = outletRenderers.get(outletId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addCollectionOutlet(outletConfig: CollectionOutletConfig) {
    validateRequired(outletConfig, ['id', 'component'], 'Collection outlet');

    const existingIds = config.itemCollectionOutlets?.map((o: any) => o.id) || [];
    validateUniqueId(outletConfig.id, existingIds, 'Collection outlet');

    // Similar implementation to addFormOutlet
    // TODO: Implement in a future task
    throw new Error('Collection outlets not yet implemented');
  }

  return {
    addFormOutlet,
    addCollectionOutlet,
  };
}
```

**Step 4: Update factory to use outlet registration**

Modify `src/factory.ts`:

```typescript
import { connect as sdkConnect } from 'datocms-plugin-sdk';
import type { FullConnectParameters } from 'datocms-plugin-sdk';

import { createOutletRegistration } from './registration/outlets';
import { createDefaultRender } from './render';
import type { PluginOptions } from './types';

export function createPluginConfig(options?: PluginOptions) {
  const config: Partial<FullConnectParameters> = {};
  const render = options?.render ?? createDefaultRender();

  const { addFormOutlet, addCollectionOutlet } = createOutletRegistration(config, render);

  // Placeholder registration functions
  const addPage = () => {
    throw new Error('Not implemented');
  };

  const addMainNavigationTab = () => {
    throw new Error('Not implemented');
  };

  const connect = () => {
    return sdkConnect(config);
  };

  return {
    addFormOutlet,
    addCollectionOutlet,
    addPage,
    addMainNavigationTab,
    connect,
  };
}
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/registration/outlets.test.ts`
Expected: PASS

**Step 6: Commit**

Suggestion: Commit with message "feat: implement form outlet registration"

---

## Task 6: Page and Navigation Registration

**Files:**

- Modify: `src/factory.ts`
- Create: `src/registration/pages.ts`
- Create: `src/registration/pages.test.ts`

**Step 1: Write the failing test**

Create `src/registration/pages.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Page and Navigation Registration', () => {
  describe('addPage', () => {
    it('should register a page', () => {
      const plugin = createPluginConfig();
      const TestPage = () => <div>Test Page</div>;

      expect(() => {
        plugin.addPage({
          pageId: 'test-page',
          component: TestPage,
        });
      }).not.toThrow();
    });

    it('should throw on duplicate page ID', () => {
      const plugin = createPluginConfig();
      const TestPage = () => <div>Test Page</div>;

      plugin.addPage({ pageId: 'test-page', component: TestPage });

      expect(() => {
        plugin.addPage({ pageId: 'test-page', component: TestPage });
      }).toThrow('Page with id "test-page" is already registered');
    });
  });

  describe('addMainNavigationTab', () => {
    it('should register a navigation tab', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.addMainNavigationTab({
          label: 'Test',
          icon: 'star',
          pointsTo: { pageId: 'test-page' },
        });
      }).not.toThrow();
    });
  });

  describe('addContentAreaSidebarItem', () => {
    it('should register a content area sidebar item', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.addContentAreaSidebarItem({
          label: 'Test',
          icon: 'star',
          pointsTo: { pageId: 'test-page' },
        });
      }).not.toThrow();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/registration/pages.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Create `src/registration/pages.ts`:

```typescript
import type { FullConnectParameters } from 'datocms-plugin-sdk';
import { validateUniqueId, validateRequired } from '../utils/validation';
import type { PageConfig, MainNavigationTabConfig } from '../types';

export function createPageRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const pageRenderers = new Map<string, React.ComponentType<any>>();

  function addPage(pageConfig: PageConfig) {
    validateRequired(pageConfig, ['pageId', 'component'], 'Page');

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
    validateRequired(tabConfig, ['label', 'icon', 'pointsTo'], 'Main navigation tab');

    if (!config.mainNavigationTabs) {
      config.mainNavigationTabs = [];
    }

    config.mainNavigationTabs.push((ctx) => {
      return [tabConfig];
    });
  }

  function addContentAreaSidebarItem(itemConfig: MainNavigationTabConfig) {
    validateRequired(itemConfig, ['label', 'icon', 'pointsTo'], 'Content area sidebar item');

    if (!config.contentAreaSidebarItems) {
      config.contentAreaSidebarItems = [];
    }

    config.contentAreaSidebarItems.push((ctx) => {
      return [itemConfig];
    });
  }

  function addSettingsAreaSidebarItem(itemConfig: any) {
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
```

**Step 4: Update factory**

Modify `src/factory.ts` to integrate page registration.

**Step 5: Run test to verify it passes**

Run: `pnpm test src/registration/pages.test.ts`
Expected: PASS

**Step 6: Commit**

Suggestion: Commit with message "feat: implement page and navigation registration"

---

## Task 7: Sidebar Registration

**Files:**

- Create: `src/registration/sidebars.ts`
- Create: `src/registration/sidebars.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern as previous tasks:

1. Write failing test for `addSidebarPanel` and `addSidebar`
2. Run to see failure
3. Implement registration functions
4. Run to see pass
5. Commit with "feat: implement sidebar registration"

---

## Task 8: Field Extension Registration

**Files:**

- Create: `src/registration/fields.ts`
- Create: `src/registration/fields.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern:

1. Write failing test for `addFieldExtension` and `overrideFieldExtension`
2. Run to see failure
3. Implement with support for configurable extensions
4. Run to see pass
5. Commit with "feat: implement field extension registration"

---

## Task 9: Modal Registration

**Files:**

- Create: `src/registration/modals.ts`
- Create: `src/registration/modals.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern:

1. Write failing test for `addModal`
2. Run to see failure
3. Implement modal registration
4. Run to see pass
5. Commit with "feat: implement modal registration"

---

## Task 10: Config Screen Registration

**Files:**

- Create: `src/registration/config.ts`
- Create: `src/registration/config.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern:

1. Write failing test for `configureConfigScreen`
2. Run to see failure
3. Implement config screen registration
4. Run to see pass
5. Commit with "feat: implement config screen registration"

---

## Task 11: Dropdown Actions Registration

**Files:**

- Create: `src/registration/dropdowns.ts`
- Create: `src/registration/dropdowns.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern:

1. Write failing test for `addDropdownAction` with all types (field, itemForm, items, uploads)
2. Run to see failure
3. Implement dropdown action routing based on type
4. Run to see pass
5. Commit with "feat: implement dropdown action registration"

---

## Task 12: Event Hooks Registration

**Files:**

- Create: `src/registration/events.ts`
- Create: `src/registration/events.test.ts`
- Modify: `src/factory.ts`

Following same TDD pattern:

1. Write failing test for all event hooks (onBoot, onBeforeItemUpsert, etc.)
2. Run to see failure
3. Implement event hook registration
4. Run to see pass
5. Commit with "feat: implement event hooks registration"

---

## Task 13: Main Export and Integration

**Files:**

- Modify: `src/index.ts`
- Create: `src/index.test.ts`

**Step 1: Write integration test**

Create `src/index.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';

import { createPluginConfig } from './index';

describe('Package exports', () => {
  it('should export createPluginConfig', () => {
    expect(createPluginConfig).toBeDefined();
    expect(typeof createPluginConfig).toBe('function');
  });

  it('should create a complete plugin toolkit', () => {
    const plugin = createPluginConfig();

    // Check all Tier 1 functions exist
    expect(plugin.addFormOutlet).toBeDefined();
    expect(plugin.addPage).toBeDefined();
    expect(plugin.addMainNavigationTab).toBeDefined();
    expect(plugin.addSidebarPanel).toBeDefined();
    expect(plugin.addFieldExtension).toBeDefined();
    expect(plugin.addModal).toBeDefined();
    expect(plugin.configureConfigScreen).toBeDefined();
    expect(plugin.addDropdownAction).toBeDefined();
    expect(plugin.onBoot).toBeDefined();
    expect(plugin.onBeforeItemUpsert).toBeDefined();
    expect(plugin.connect).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/index.test.ts`
Expected: FAIL

**Step 3: Update main export**

Modify `src/index.ts`:

```typescript
export { createPluginConfig } from './factory';
export type {
  PluginOptions,
  FormOutletConfig,
  PageConfig,
  MainNavigationTabConfig,
  SidebarPanelConfig,
  SidebarConfig,
  FieldExtensionConfig,
  FieldExtensionOverrideConfig,
  ModalConfig,
  ConfigScreenConfig,
  DropdownActionConfig,
  DropdownActionType,
} from './types';
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/index.test.ts`
Expected: PASS

**Step 5: Run all tests**

Run: `pnpm test`
Expected: All tests PASS

**Step 6: Commit**

Suggestion: Commit with "feat: complete main exports and integration"

---

## Task 14: Build and Type Check

**Files:**

- None (build validation)

**Step 1: Run TypeScript type check**

Run: `pnpm check-types`
Expected: No errors

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds, creates `dist/` folder

**Step 3: Verify build outputs**

Run: `ls dist/`
Expected: See `index.js`, `index.cjs`, `index.d.ts` and other files

**Step 4: Commit**

Suggestion: Commit with "chore: verify build configuration"

---

## Task 15: README Documentation

**Files:**

- Create: `README.md`

**Step 1: Write comprehensive README**

Create `README.md`:

```markdown
# @oddcommon/datocms-plugin-kit

A lightweight library for organizing DatoCMS plugin code across multiple files.

## Problem

The DatoCMS plugin SDK requires a large configuration object with 45+ hooks. This library lets you split that configuration across multiple files for better organization.

## Installation

\`\`\`bash
pnpm add @oddcommon/datocms-plugin-kit
\`\`\`

## Usage

### 1. Create Plugin Configuration

\`\`\`typescript
// ~/plugin.ts
import { createPluginConfig } from '@oddcommon/datocms-plugin-kit';

export const {
addFormOutlet,
addPage,
addMainNavigationTab,
addSidebarPanel,
connect,
} = createPluginConfig({
// Optional: custom render function
// If omitted, uses React 19's createRoot with StrictMode
render: (component) => {
// your custom render
}
});
\`\`\`

### 2. Register Hooks from Any File

\`\`\`typescript
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
\`\`\`

\`\`\`typescript
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
\`\`\`

### 3. Connect in Main Entry

\`\`\`typescript
// ~/main.ts
import '~/outlets/demo';
import '~/pages/analytics';
// ... other imports

import { connect } from '~/plugin';

connect();
\`\`\`

## API Reference

### Core

- \`createPluginConfig(options?)\` - Create plugin toolkit

### Pages

- \`addPage(config)\` - Register page component
- \`addMainNavigationTab(config)\` - Add top navigation tab
- \`addContentAreaSidebarItem(config)\` - Add content sidebar item
- \`addSettingsAreaSidebarItem(config)\` - Add settings sidebar item

### Form Outlets

- \`addFormOutlet(config)\` - Add item form outlet
- \`addCollectionOutlet(config)\` - Add collection outlet

### Sidebars

- \`addSidebarPanel(config)\` - Add collapsible sidebar panel
- \`addSidebar(config)\` - Add full custom sidebar

### Field Extensions

- \`addFieldExtension(config)\` - Register manual field extension
- \`overrideFieldExtension(config)\` - Auto-apply field extension

### UI Components

- \`addModal(config)\` - Register modal
- \`configureConfigScreen(config)\` - Plugin settings screen

### Actions

- \`addDropdownAction(config)\` - Dropdown actions (field/item/uploads)

### Events

- \`onBoot(handler)\` - Plugin initialization
- \`onBeforeItemUpsert(handler)\` - Pre-save hook
- \`onBeforeItemsDestroy(handler)\` - Pre-delete hook
- \`onBeforeItemsPublish(handler)\` - Pre-publish hook
- \`onBeforeItemsUnpublish(handler)\` - Pre-unpublish hook

### Connect

- \`connect()\` - Build config and call SDK connect

## TypeScript

All types from \`datocms-plugin-sdk\` pass through transparently. Import types directly:

\`\`\`typescript
import type { RenderPageCtx, ItemType } from 'datocms-plugin-sdk';
\`\`\`

## License

MIT
\`\`\`

**Step 2: Commit**

Suggestion: Commit with "docs: add comprehensive README"

---

## Final Validation

**Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests PASS

**Step 2: Run linting**

Run: `pnpm lint`
Expected: No errors

**Step 3: Run type checking**

Run: `pnpm check-types`
Expected: No errors

**Step 4: Run build**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Final commit**

Suggestion: Commit with "chore: complete Tier 1 implementation"

---

## Notes for Future Work (Tier 2)

The following features are planned for Tier 2:

- Collection outlet implementation
- Upload sidebars (addUploadSidebarPanel, addUploadSidebar)
- Asset sources (addAssetSource)
- Structured text customizations
- Record presentation (buildItemPresentationInfo)
- Type guard utilities (guards object)

Each will follow the same TDD pattern established in this plan.
```
