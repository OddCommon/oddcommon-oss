# Sidebars and sidebar panels

Through plugins it is possible to customize the standard sidebars that DatoCMS offers when editing a record or an asset in the Media Area.

#### Sidebars vs Sidebar Panels

The SDK offers two ways to customize the sidebar interface. You can either add new collapsible panels to the default sidebar:

(Image content)

Or offer complete alternative sidebars, as in the example below:

(Image content)

Depending on the size of the content you need to display, you can choose one or the other. Or even offer both. You can take a look at a real-world example of both sidebars and sidebar panels in the [Web Previews](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews.md) plugin.

Inside sidebars and sidebar panels, the plugin developer can render what they prefer, while also having the possibility to:

-   access a series of information relating to the record that's being edited, the project in which the plugin is installed or the logged-in user;
    
-   make calls to DatoCMS to produce various effects and interact with the main application (changing form values, navigating to other pages, triggering notifications, opening modals, etc.);
    

### Implementing a Sidebar Panel

Let's say we want to create a sidebar panel that will show a link pointing to the website page related to the record we're editing.

The first step is to implement the [`itemFormSidebarPanels`](sidebar-panels.md#itemFormSidebarPanels) hook, to declare our intent to add the panel to the sidebar:

```typescript
import { connect, ItemFormSidebarPanelsCtx } from 'datocms-plugin-sdk';

connect({
  itemFormSidebarPanels(model: ItemType, ctx: ItemFormSidebarPanelsCtx) {
    return [
      {
        id: 'firstPanel',
        label: 'First panel',
        startOpen: true,
        placement: ['before', 'info'], // Where to place it relative to our default panels
        rank: 1 // Tiebreaker if two panels have the same `placement` value. Must be >= 1. Lower values are visually higher up.
      },
      {
        id: 'secondPanel',
        label: 'Second Panel',
        startOpen: true,
        placement: ['before', 'info'],
        rank: 2
      },
    ];
  },
});
```

The code above will add a panel to every record in our project... but maybe not every record in DatoCMS has a specific page in the final website, right?

It might be better to [add some settings to our plugin](config-screen.md) to let the final user declare the set of models that have permalinks, and the relative URL structure enforced on the frontend:

```typescript
itemFormSidebarPanels(model: ItemType, ctx: ItemFormSidebarPanelsCtx) {
  const { permalinksByModel } = ctx.plugin.attributes.parameters;

  // Assuming we're saving user preferences in this format:
  // {
  //   'blog_post': '/blog/:slug',
  //   'author': '/author/:slug',
  //   ...
  // }
  }

  if (!permalinksByModel[model.attributes.api_key]) {
    // Don't add the panel!
    return [];
  }

  // Add the panel!
}
```

#### Rendering the panel

The final step is to actually render the panel itself by implementing the [`renderItemFormSidebarPanel`](sidebar-panels.md#renderItemFormSidebarPanel) hook.

Inside of this hook we initialize React and render a custom component called `GoToWebsiteItemFormSidebarPanel`, passing down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';

connect({
  renderItemFormSidebarPanel(
    sidebarPanelId,
    ctx: RenderItemFormSidebarPanelCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <GoToWebsiteItemFormSidebarPanel ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

A plugin might render different panels, so we can use the `sidebarPanelId` argument to know which one we are requested to render, and write a specific React component for each of them.

```tsx
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

function GoToWebsiteItemFormSidebarPanel({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Hello from the sidebar!
    </Canvas>
  );
}
```

> [!WARNING] Always use the canvas!
> It is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

All we need to do now is to actually render the link to the website, reading from `ctx.formValues` the slug value and generating the final frontend URL:

```tsx
import { ButtonLink } from 'datocms-react-ui';

function GoToWebsiteItemFormSidebarPanel({ ctx }: PropTypes) {
  if (ctx.itemStatus === 'new') {
    // we're in a record that still has not been persisted
    return <div>Please save the record first!</div>;
  }

  const { permalinksByModel } = ctx.plugin.attributes.parameters;
  const permalinkStructure = permalinksByModel[ctx.itemType.attributes.api_key];
  const url = permalinkStructure.replace(':slug', ctx.formValues.slug);

  return (
    <Canvas ctx={ctx}>
      <ButtonLink href={url} fullWidth>
        View it on the website!
      </ButtonLink>
    </Canvas>
  );
}
```

#### Controlling Sidebar Panel positioning

To control the positioning of one or more sidebar panels, you can use the `placement` and `rank` parameters of the `itemFormSidebarPanels()` hook:

-   **The** `**placement**` **parameter** controls where your panel appears relative to the default DatoCMS panels. It accepts a two-element array like `['before', 'info']` or `['after', 'links']`:
    
    -   This is an optional parameter. If not defined, your custom panel will appear **below** all the default DatoCMS panels. This is the default behavior, and is equivalent to `placement: ['after', 'history']`.
        
    -   To place at your panel at the **top** of the sidebar, above anything else, specify `placement: ['before', 'info']`.
        
    -   If defined, the first array element must be `'before'` or `'after'`. The second array element must be the ID of one of the default existing panels: `'info'`, `'publishedVersion'`, `'schedule'`, `'links'`, or `'history'`. These correspond to the default sidebar panels of any DatoCMS record.
        
-   **The** `**rank**` **parameter** is a tie-breaker that controls what happens when multiple custom panels have the same `placement`:
    
    -   This is also is an optional parameter. When not defined, an implicit `rank: 9999` is assumed (which would normally place the panel towards the bottom).
        
    -   If defined, it must be an integer, and lower numbers are higher up visually. `0` and negative integers are OK, and will be even higher up than `rank: 1`.
        
    -   Panels with an explicit rank `>= 10000` will appear *below* panels without any explicit rank (because unranked panels are assumed to have a rank of `9999`).
        
    -   In case of a tie, panels declared earlier in the `itemFormSidebarPanels()` return array will be higher up visually.
        

**Example:**

```typescript
import { connect, ItemFormSidebarPanelsCtx } from 'datocms-plugin-sdk';

connect({
  itemFormSidebarPanels(model: ItemType, ctx: ItemFormSidebarPanelsCtx) {
    return [
      {
        id: 'firstPanel',
        label: 'First panel',
        startOpen: true,
        placement: ['before', 'info'], // Where to place it relative to our default panels
        rank: 1 // Tiebreaker if two panels have the same `placement` value. Lower values are visually higher up.
      },
      {
        id: 'secondPanel',
        label: 'Second Panel',
        startOpen: false,
        placement: ['before', 'info'],
        rank: 2
      },

      // The following two panels have no explicit rank, so they'll be auto-positioned.
      {
        id: 'otherPanel1',
        label: 'otherPanel1',
        startOpen: false,
        placement: ['before', 'info'],
      },
      {
        id: 'otherPanel2',
        label: 'otherPanel2',
        startOpen: false,
        placement: ['before', 'info'],
      },

      // This will show up after `secondPanel` but before the rankless `otherPanels`
      {
        id: 'rankConflict',
        label: 'Another panel with Rank 2',
        startOpen: false,
        placement: ['before', 'info'],
        rank: 2 // Rank conflict with another panel; we'll auto-position it
      },
    ];
  },
});
```

Becomes this sidebar:

(Image content)

Sidebar placement & rank example

### Implementing a custom Sidebar

Suppose that instead of presenting a link to a webpage, we want to embed the actual web page alongside the record. To do that we need more space than what a sidebar panel can offer, so creating a completely separate sidebar is more appropriate.

Managing sidebars is very similar to what we just did with sidebar panels. The main difference is in the way you define them. To declare our intent to add the sidebar, implement the [`itemFormSidebars`](sidebar-panels.md#itemFormSidebars) hook:

```typescript
import { connect, ItemFormSidebarsCtx } from 'datocms-plugin-sdk';

connect({
  itemFormSidebars(model: ItemType, ctx: ItemFormSidebarsCtx) {
    return [
      {
        id: "sideBySidePreview",
        label: "Side-by-side preview",
        preferredWidth: 900,
      },
    ];
  },
});
```

With the `preferredWidth`, you can control the ideal width for the sidebar when it opens. Users will then be able to resize it if they want. There is one constraint though: the sidebar width cannot exceed 60% of the screen, taking up too much screen real estate. If the `preferredWidth` is bigger than this value, it will be capped.

#### Rendering the sidebar

Now, to render the sidebar itself, we can implement the [`renderItemFormSidebar`](sidebar-panels.md#renderItemFormSidebar) hook.

Just like we did with the sidebar panel, we initialize React and render a custom component, passing down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderItemFormSidebarCtx } from 'datocms-plugin-sdk';

connect({
  renderItemFormSidebar(
    sidebarId,
    ctx: RenderItemFormSidebarCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <SideBySidePreviewSidebar ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

A plugin might render different sidebars, so we can use the `sidebarId` argument to know which one we are requested to render, and write a specific React component for each of them.

In our `<SideBySidePreviewSidebar>` component, we can simply render an iframe pointing to the webpage, copying most of the logic from our previous sidebar panel:

```tsx
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderItemFormSidebarCtx;
};

function SideBySidePreviewSidebar({ ctx }: PropTypes) {
  const { permalinksByModel } = ctx.plugin.attributes.parameters;
  const permalinkStructure = permalinksByModel[ctx.itemType.attributes.api_key];
  const url = permalinkStructure.replace(':slug', ctx.formValues.slug);

  return (
    <Canvas ctx={ctx}>
      <iframe src={url} />
    </Canvas>
  );
}
```

## Asset Sidebars and Sidebar Panels

> [!WARNING] Requires Plugin SDK v2+
> The asset sidebars and sidebar panels in the following examples requires v2.x.x or higher of the [DatoCMS Plugins SDK](https://github.com/datocms/plugins-sdk). If you're still on v1, please upgrade before proceeding.

In addition to being able to customize the sidebars of a record, it is also possible to do the same in the detail view of an asset in the Media Area:

[(Image content)](https://www.datocms-assets.com/205/1728552382-screenshot-2024-10-10-at-11-24-40.png?auto=format&fit=max&w=2000)

[(Image content)](https://www.datocms-assets.com/205/1728552395-screenshot-2024-10-10-at-11-25-00.png?auto=format&fit=max&w=2000)

The implementation is absolutely similar to the one just seen. The only thing that changes is the hooks to be used:

-   For sidebars: [`upload​Sidebars`](sidebar-panels.md#upload%E2%80%8BSidebars) and [`render​Upload​Sidebar`](sidebar-panels.md#render%E2%80%8BUpload%E2%80%8BSidebar)
    
-   For sidebar panels: [`upload​Sidebar​Panels`](sidebar-panels.md#upload%E2%80%8BSidebar%E2%80%8BPanels) and [`render​Upload​SidebarPanel`](sidebar-panels.md#render%E2%80%8BUpload%E2%80%8BSidebarPanel)
    

Here's an example:

```typescript
import {
  connect,
  UploadSidebarPanelsCtx,
  RenderUploadSidebarPanelCtx,
  UploadSidebarsCtx,
  RenderUploadSidebarCtx
} from 'datocms-plugin-sdk';

connect({
  uploadSidebars(ctx: UploadSidebarsCtx) {
    return [
      {
        id: "customSidebar",
        label: "My Custom Sidebar",
        preferredWidth: 900,
      },
    ];
  },
  renderUploadSidebar(sidebarId: string, ctx: RenderUploadSidebarCtx) {
    render(<CustomSidebar ctx={ctx} />);
  },

  uploadSidebarPanels(ctx: UploadSidebarPanelsCtx) {
    return [
      {
        id: 'customSidebarPanel',
        label: 'Custom Sidebar Panel',
        startOpen: true,
      },
    ];
  },
  renderUploadSidebarPanel(sidebarPanelId: string, ctx: RenderUploadSidebarPanelCtx) {
    render(<CustomSidebarPanel ctx={ctx} />);
  },
});
```

#### `itemFormSidebars(itemType: ItemType, ctx)`

Use this function to declare new sidebar to be shown when the user edits records of a particular model.

##### Return value

The function must return: `ItemFormSidebar[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderItemFormSidebar(sidebarId: string, ctx)`

This function will be called when the plugin needs to render a sidebar (see the `itemFormSidebars` hook).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>Item form additional methods</summary>

These methods can be used to interact with the form that's being shown to the end-user to edit a record.

<details>
<summary>ctx.toggleField(path: string, show: boolean) => Promise<void></summary>

Hides/shows a specific field in the form. Please be aware that when a field is hidden, the field editor for that field will be removed from the DOM itself, including any associated plugins. When it is shown again, its plugins will be reinitialized.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L68)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.toggleField(fieldPath, true);
```

</details>
<details>
<summary>ctx.disableField(path: string, disable: boolean) => Promise<void></summary>

Disables/re-enables a specific field in the form.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L83)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.disableField(fieldPath, true);
```

</details>
<details>
<summary>ctx.scrollToField(path: string, locale?: string) => Promise<void></summary>

Smoothly navigates to a specific field in the form. If the field is localized it will switch language tab and then navigate to the chosen field.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L100)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.scrollToField(fieldPath);
```

</details>
<details>
<summary>ctx.setFieldValue(path: string, value: unknown) => Promise<void></summary>

Changes a specific path of the `formValues` object.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L115)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.setFieldValue(fieldPath, 'new value');
```

</details>
<details>
<summary>ctx.formValuesToItem(...)</summary>

Takes the internal form state, and transforms it into an Item entity compatible with DatoCMS API.

When `skipUnchangedFields`, only the fields that changed value will be serialized.

If the required nested blocks are still not loaded, this method will return `undefined`.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L132)

```ts
await ctx.formValuesToItem(ctx.formValues, false);
```

</details>
<details>
<summary>ctx.itemToFormValues(...)</summary>

Takes an Item entity, and converts it into the internal form state.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L145)

```ts
await ctx.itemToFormValues(ctx.item);
```

</details>
<details>
<summary>ctx.saveCurrentItem(showToast?: boolean) => Promise<void></summary>

Triggers a submit form for current record.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L157)

```ts
await ctx.saveCurrentItem();
```

</details>

</details>

<details>
<summary>Item form additional properties</summary>

These information describe the current state of the form that's being shown to the end-user to edit a record.

<details>
<summary>ctx.locale: string</summary>

The currently active locale for the record.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L12)

</details>

<details>
<summary>ctx.item: Item | null</summary>

If an already persisted record is being edited, returns the full record entity.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L17)

</details>

<details>
<summary>ctx.itemType: ItemType</summary>

The model for the record being edited.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L19)

</details>

<details>
<summary>ctx.formValues: Record<string, unknown></summary>

The complete internal form state.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L21)

</details>

<details>
<summary>ctx.itemStatus: 'new' | 'draft' | 'updated' | 'published'</summary>

The current status of the record being edited.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L23)

</details>

<details>
<summary>ctx.isSubmitting: boolean</summary>

Whether the form is currently submitting itself or not.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L25)

</details>

<details>
<summary>ctx.isFormDirty: boolean</summary>

Whether the form has some non-persisted changes or not.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L27)

</details>

<details>
<summary>ctx.blocksAnalysis: BlocksAnalysis</summary>

Provides information on how many blocks are currently present in the form.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L29)

</details>

</details>

<details>
<summary>Properties and methods</summary>

<details>
<summary>ctx.sidebarId: string</summary>

The ID of the sidebar that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemFormSidebar.ts#L25)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the declared in the `itemFormSidebars` function.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemFormSidebar.ts#L30)

</details>

</details>

</details>

#### `itemFormSidebarPanels(itemType: ItemType, ctx)`

Use this function to declare new sidebar panels to be shown when the user edits records of a particular model.

##### Return value

The function must return: `ItemFormSidebarPanel[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderItemFormSidebarPanel(sidebarPaneId: string, ctx)`

This function will be called when the plugin needs to render a sidebar panel (see the `itemFormSidebarPanels` hook).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>Item form additional methods</summary>

These methods can be used to interact with the form that's being shown to the end-user to edit a record.

<details>
<summary>ctx.toggleField(path: string, show: boolean) => Promise<void></summary>

Hides/shows a specific field in the form. Please be aware that when a field is hidden, the field editor for that field will be removed from the DOM itself, including any associated plugins. When it is shown again, its plugins will be reinitialized.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L68)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.toggleField(fieldPath, true);
```

</details>
<details>
<summary>ctx.disableField(path: string, disable: boolean) => Promise<void></summary>

Disables/re-enables a specific field in the form.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L83)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.disableField(fieldPath, true);
```

</details>
<details>
<summary>ctx.scrollToField(path: string, locale?: string) => Promise<void></summary>

Smoothly navigates to a specific field in the form. If the field is localized it will switch language tab and then navigate to the chosen field.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L100)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.scrollToField(fieldPath);
```

</details>
<details>
<summary>ctx.setFieldValue(path: string, value: unknown) => Promise<void></summary>

Changes a specific path of the `formValues` object.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L115)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.setFieldValue(fieldPath, 'new value');
```

</details>
<details>
<summary>ctx.formValuesToItem(...)</summary>

Takes the internal form state, and transforms it into an Item entity compatible with DatoCMS API.

When `skipUnchangedFields`, only the fields that changed value will be serialized.

If the required nested blocks are still not loaded, this method will return `undefined`.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L132)

```ts
await ctx.formValuesToItem(ctx.formValues, false);
```

</details>
<details>
<summary>ctx.itemToFormValues(...)</summary>

Takes an Item entity, and converts it into the internal form state.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L145)

```ts
await ctx.itemToFormValues(ctx.item);
```

</details>
<details>
<summary>ctx.saveCurrentItem(showToast?: boolean) => Promise<void></summary>

Triggers a submit form for current record.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L157)

```ts
await ctx.saveCurrentItem();
```

</details>

</details>

<details>
<summary>Item form additional properties</summary>

These information describe the current state of the form that's being shown to the end-user to edit a record.

<details>
<summary>ctx.locale: string</summary>

The currently active locale for the record.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L12)

</details>

<details>
<summary>ctx.item: Item | null</summary>

If an already persisted record is being edited, returns the full record entity.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L17)

</details>

<details>
<summary>ctx.itemType: ItemType</summary>

The model for the record being edited.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L19)

</details>

<details>
<summary>ctx.formValues: Record<string, unknown></summary>

The complete internal form state.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L21)

</details>

<details>
<summary>ctx.itemStatus: 'new' | 'draft' | 'updated' | 'published'</summary>

The current status of the record being edited.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L23)

</details>

<details>
<summary>ctx.isSubmitting: boolean</summary>

Whether the form is currently submitting itself or not.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L25)

</details>

<details>
<summary>ctx.isFormDirty: boolean</summary>

Whether the form has some non-persisted changes or not.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L27)

</details>

<details>
<summary>ctx.blocksAnalysis: BlocksAnalysis</summary>

Provides information on how many blocks are currently present in the form.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/itemForm.ts#L29)

</details>

</details>

<details>
<summary>Properties and methods</summary>

<details>
<summary>ctx.sidebarPaneId: string</summary>

The ID of the sidebar panel that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemFormSidebarPanel.ts#L25)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the panel declared in the `itemFormSidebarPanels` function.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemFormSidebarPanel.ts#L31)

</details>

</details>

</details>

#### `uploadSidebars(ctx)`

Use this function to declare new sidebar to be shown when the user opens up an asset in the Media Area.

##### Return value

The function must return: `UploadSidebar[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderUploadSidebar(sidebarId: string, ctx)`

This function will be called when the plugin needs to render a sidebar (see the `uploadSidebars` hook).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.sidebarId: string</summary>

The ID of the sidebar that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebar.ts#L21)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the declared in the `uploadSidebars` function.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebar.ts#L27)

</details>

<details>
<summary>ctx.upload: Upload</summary>

The active asset.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebar.ts#L30)

</details>

</details>

#### `uploadSidebarPanels(ctx)`

Use this function to declare new sidebar panels to be shown when the user opens up an asset in the Media Area.

##### Return value

The function must return: `UploadSidebarPanel[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderUploadSidebarPanel(sidebarPaneId: string, ctx)`

This function will be called when the plugin needs to render a sidebar panel (see the `uploadSidebarPanels` hook).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.sidebarPaneId: string</summary>

The ID of the sidebar panel that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebarPanel.ts#L24)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the panel declared in the `uploadSidebarPanels` function.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebarPanel.ts#L30)

</details>

<details>
<summary>ctx.upload: Upload</summary>

The active asset.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderUploadSidebarPanel.ts#L33)

</details>

</details>

## Related content in "Plugin SDK"

- [Introduction to the DatoCMS Plugin SDK](introduction.md)

- [Build your first DatoCMS plugin](build-your-first-plugin.md)
- [Real-world examples](real-world-examples.md)

- [What hooks are](what-hooks-are.md)
- [Config screen](config-screen.md)

- [Custom pages](custom-pages.md)
- [Sidebars and sidebar panels](sidebar-panels.md)

- [Outlets](form-outlets.md)
- [Field extensions](field-extensions.md)

- [Manual field extensions](manual-field-extensions.md)
- [Dropdown actions](dropdown-actions.md)

- [Structured Text customizations](structured-text-customizations.md)
- [Asset sources](asset-sources.md)

- [Opening modals](modals.md)
- [Event hooks](event-hooks.md)

- [Customize record presentation](customize-presentation.md)
- [React UI Components](react-datocms-ui.md)

- [Button](button.md)
- [Button group](button-group.md)

- [Dropdown](dropdown.md)
- [Form](form.md)

- [Section](section.md)
- [Sidebar panel](sidebar-panel.md)

- [Spinner](spinner.md)
- [Toolbar](toolbar.md)

- [Sidebars and split views](sidebars-and-split-views.md)
- [Additional permissions](additional-permissions.md)

- [Working with form values](working-with-form-values.md)
- [Publishing to Marketplace](publishing-to-marketplace.md)

- [Releasing new plugin versions](releasing-new-plugin-versions.md)
- [Migrating from legacy plugins](migrating-from-legacy-plugins.md)