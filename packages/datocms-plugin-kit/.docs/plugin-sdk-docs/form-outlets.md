# Outlets

Through plugins, it's possible to customize various areas of the DatoCMS interface. We call these customizable areas "outlets".

Outlets are essentially iframes where plugin developers can render custom content, providing enhanced functionality and user experiences within the DatoCMS ecosystem.

Outlets offer the ability to:

-   Access information related to records, projects, or logged-in users
    
-   Make calls to DatoCMS to produce various effects and interact with the main application (e.g., changing values, navigating, triggering notifications, opening modals)
    
-   Customize the user interface to fit specific workflow needs
    

If you prefer, a form outlet can also be completely hidden from the interface (setting his height to zero), and work under the cover to tweak the default behaviour of DatoCMS.

##### Types of Outlets

DatoCMS allows you to configure outlets in various areas of the interface.

# Record Form Outlets

Record form outlets allow you to add custom areas above the record editing form:

[(Image content)](https://www.datocms-assets.com/205/1717085446-outlet-edited.png?auto=format&fit=max&w=2000)

#### Implementing a Record Form Outlet

The first step is to implement the [`itemFormOutlets`](form-outlets.md#itemFormOutlets) hook, to declare our intent to add the outlet to the form:

```typescript
import { connect, ItemFormOutletsCtx } from 'datocms-plugin-sdk';

connect({
  itemFormOutlets(model, ctx: ItemFormOutletsCtx) {
    return [
      {
        id: 'myOutlet',
        initialHeight: 100,
      },
    ];
  },
});
```

The `initialHeight` property sets the initial height of the frame, while the plugin itself is loading. It can also be useful to completely hide the outlet, by passing the value zero to it.

The code above will add the outlet to the form of every record in our project, but you can also [add some settings to the plugin](config-screen.md) to ie. let the final user pick only some specific models:

```typescript
itemFormOutlets(model, ctx: ItemFormOutletsCtx) {
  const { modelApiKeys } = ctx.plugin.attributes.parameters;

  if (!modelApiKeys.includes(model.attributes.api_key)) {
    // Don't add the outlet!
    return [];
  }

  // Add the outlet!
}
```

The final step is to actually render the outlet itself by implementing the [`renderItemFormOutlet`](form-outlets.md#renderItemFormOutlet) hook.

Inside of this hook we can initialize React and render a custom component, passing down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderItemFormOutletCtx, ItemFormOutletsCtx } from 'datocms-plugin-sdk';

connect({
  itemFormOutlets(model, ctx: ItemFormOutletsCtx) { ... },
  renderItemFormOutlet(
    outletId,
    ctx: RenderItemFormOutletCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <MyCustomOutlet ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

A plugin might render different types of form outlets, so we can use the `outletId` argument to know which one we are requested to render, and write a specific React component for each of them.

```tsx
import { Canvas } from 'datocms-react-ui';

function MyCustomOutlet({ ctx }) {
  return (
    <Canvas ctx={ctx}>
      Hello from the record form outlet!
    </Canvas>
  );
}
```

> [!WARNING] Always use the canvas!
> If you want to render something inside the outlet, it is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.
> 
> If you want the outlet to be hidden from the interface, just return `null` and set an `initialHeight: 0` in the `itemFormOutlets` hook.

# Record Collection Outlets

Record collection outlets allow you to add custom areas to the page that displays a collection of records for a specific model.

[(Image content)](https://www.datocms-assets.com/205/1728551253-screenshot-2024-10-10-at-11-04-52.png?auto=format&fit=max&w=2000)

[(Image content)](https://www.datocms-assets.com/205/1728551308-screenshot-2024-10-10-at-11-05-25.png?auto=format&fit=max&w=2000)

The implementation is exactly the same as the one we just saw for the Record Form Outlets. The only thing that changes is the hooks to be used:

-   To declare the intention to offer Record Collection Outlets, use [`itemCollectionOutlets`](form-outlets.md#itemCollectionOutlets);
    
-   To actually render the outlets, use [`renderItemCollectionOutlet`](form-outlets.md#renderItemCollectionOutlet).
    

Here's a full example:

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, ItemCollectionOutletsCtx, RenderItemCollectionOutletCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';

connect({
  itemCollectionOutlets(model, ctx: ItemCollectionOutletsCtx) {
    // Optional: Add conditions to show the outlet only for specific models
    const { modelApiKeys } = ctx.plugin.attributes.parameters;
    if (!modelApiKeys.includes(model.attributes.api_key)) {
      return [];
    }

    return [
      {
        id: 'myCollectionOutlet',
        initialHeight: 100,
      },
    ];
  },
  renderItemCollectionOutlet(outletId, ctx: RenderItemCollectionOutletCtx) {
    render(<MyCustomCollectionOutlet ctx={ctx} />);
  },
});

function MyCustomCollectionOutlet({ ctx }) {
  return (
    <Canvas ctx={ctx}>
      <h3>Custom Collection Outlet</h3>
      <p>This outlet appears above the record listing for {ctx.itemType.attributes.name}.</p>
    </Canvas>
  );
}
```

#### `itemCollectionOutlets(itemType: ItemType, ctx)`

Use this function to declare custom outlets to be shown at the top of a collection of records of a particular model.

##### Return value

The function must return: `ItemCollectionOutlet[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderItemCollectionOutlet(itemCollectionOutletId: string, ctx)`

This function will be called when the plugin needs to render an outlet defined by the `itemCollectionOutlets()` hook.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.itemCollectionOutletId: string</summary>

The ID of the outlet that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemCollectionOutlet.ts#L24)

</details>

<details>
<summary>ctx.itemType: ItemType</summary>

The model for which the outlet is being rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemCollectionOutlet.ts#L26)

</details>

</details>

#### `itemFormOutlets(itemType: ItemType, ctx)`

Use this function to declare custom outlets to be shown at the top of the record's editing page.

##### Return value

The function must return: `ItemFormOutlet[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderItemFormOutlet(itemFormOutletId: string, ctx)`

This function will be called when the plugin needs to render an outlet defined by the `itemFormOutlets()` hook.

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
<summary>ctx.itemFormOutletId: string</summary>

The ID of the outlet that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderItemFormOutlet.ts#L25)

</details>

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