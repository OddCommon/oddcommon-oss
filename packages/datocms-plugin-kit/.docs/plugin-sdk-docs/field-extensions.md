# Field extensions

By creating what we call 'field extensions', plugins can change the way in which the fields of a record are presented to the final editor, going beyond the appearance configurations that DatoCMS offers by default.

There are different types of field extensions that can be created, depending on requirements:

#### "Field editor" extensions

They operate on top of a particular field, replacing the default field editor that DatoCMS provides with custom code:

(Image content)

The use cases are varied, and many examples are already on our marketplace, ready to be installed on your project:

-   The Shopify product plugin can be hooked into string fields and completely changes the interface to allow you to browse the products in your Shopify store, then save the ID of the selected product in the string field itself;
    
-   The Hidden field plugin simply hides a specific field from the editor's eyes, while the Conditional fields plugin shows/hides a number of fields when you toggle a particular checkbox field.
    

###### Field editors as sidebar panels

It is also possible to move editor extensions to the right-hand sidebar, giving it the appearance of a collapsible panel. The difference between this mode and a [sidebar panel](sidebar-panels.md) is that this controls a specific field of the record and can use it as a "storage unit" to save internal information, while a sidebar panel is not associated with any particular field.

As an example, the Sidebar notes plugin uses this mode to turn a JSON field into a kind of notepad where you can add virtual post-it notes.

#### "Field addon" field extensions

As the name suggests, addons do not change the way a field is edited, but they add functionality, or provide additional information, directly below the field editor. While only one editor can be set up for each field, it is possible to have several addons per field, each providing its own different functionality:

(Image content)

As examples of use, Yandex Translate adds a button below your localisable text/string fields to automatically translate its content from one locale to another, while Sanitize HTML allows you to clean up the HTML code present in a text field according to various preferences.

> [!POSITIVE] Two sides of the same coin
> Editors and addons are both field extensions, so they have access to exactly the same methods and information. The difference between the two is simply semantics: editors are for editing the field, while addons offer extra functionality.

### How to hook field extensions to a field

The SDK provides an [`overrideFieldExtensions`](field-extensions.md#overrideFieldExtensions) hook that can be implemented to declare the intention to take part in the rendering of any field within the form, either by setting its editor, or by adding some addons, or both.

In this example, we are forcing the use of a custom `starRating` editor for all integer fields that have an ID of `rating`:

```typescript
import { connect, Field, FieldIntentCtx } from 'datocms-plugin-sdk';

connect({
  overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
    if (
      field.attributes.field_type === 'integer' &&
      field.attributes.api_key === 'rating'
    ) {
      return {
        editor: { id: 'starRating' },
      };
    }
  },
});
```

Similarly, we can also add an addon extension called `loremIpsumGenerator` below all the text fields:

```typescript
overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
  if (field.attributes.field_type === 'text') {
    return {
      addons: [
        { id: 'loremIpsumGenerator' },
      ],
    };
  }
}
```

### Rendering the field extension

At this point, we need to actually render the field extensions by implementing the [`renderFieldExtension`](field-extensions.md#renderFieldExtension) hook.

Inside of this hook we can implement a simple "router" that will present a different React component depending on the field extension that we've requested to render inside the `iframe`.

We also make sure to pass down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderFieldExtensionCtx } from 'datocms-plugin-sdk';

function render(component: React.ReactNode) {
  ReactDOM.render(
    <React.StrictMode>{component}</React.StrictMode>,
    document.getElementById('root'),
  );
}

connect({
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'starRating':
        return render(<StarRatingEditor ctx={ctx} />);
      case 'loremIpsumGenerator':
        return render(<LoremIpsumGenerator ctx={ctx} />);
    }
  },
});
```

The implementation of the Lorem Ipsum component is pretty straightforward: we simply use the `ctx.setFieldValue` function to change the value of the field into a randomly generated string:

```tsx
import { Canvas, Button } from 'datocms-react-ui';
import { loremIpsum } from 'lorem-ipsum';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

function LoremIpsumGenerator({ ctx }: PropTypes) {
  const insertLoremIpsum = () => {
    ctx.setFieldValue(ctx.fieldPath, loremIpsum({ format: 'plain' }));
  };

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={insertLoremIpsum} buttonSize="xxs">
        Add lorem ipsum
      </Button>
    </Canvas>
  );
}
```

It is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

The Star Rating component is quite similar. We get the current field value from `ctx.formValues` and the disabled state from `ctx.disabled`. When the user interacts with the component and changes its value, we call `ctx.setFieldValue` to propagate the change to the main DatoCMS application:

```tsx
import ReactStars from 'react-rating-stars-component';
import get from 'lodash/get';
import { Canvas } from 'datocms-react-ui';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

function StarRatingEditor({ ctx }: PropTypes) {
  const currentValue = get(ctx.formValues, ctx.fieldPath);
  const handleChange = (newValue: number) => {
    ctx.setFieldValue(ctx.fieldPath, newValue);
  };
  return (
    <Canvas ctx={ctx}>
      <ReactStars
        size={32}
        isHalf={false}
        edit={!ctx.disabled}
        value={currentValue || 0}
        onChange={handleChange}
      />
    </Canvas>
  );
}
```

Here's the final result:

(Video content)

### Adding user-defined settings into the mix

You might have noticed that our plugin is currently hardcoding some choices, namely:

-   the rules that decide when to apply both our "star rating" and "lorem ipsum" extensions;
    
-   the maximum number of stars to show;
    
-   the length of the "lorem ipsum" text we're generating;
    

If we want, we could make these settings configurable by the user, either by implementing some [global plugin settings](config-screen.md), or by transforming our field extensions into ["manual" extensions](manual-field-extensions.md%20%22/docs/plugin-sdk/sdk/manual-field-extensions%22.md).

When to use one strategy or the other is completely up to you, and each has its own advantages/disadvanges.

-   Manual field extensions are, well, manually hooked by the end-user on each field, and for each installation different configuration options can be specified. Given that our star rating extension will most likely be used in a few specific places rather than in all integer fields of the project, manual fields might be the best choice.
    
-   On the other hand, our Lorem Ipsum generator may be convenient in all text fields, so requiring the end user to manually install it everywhere would be unnecessarily tedious. In this case, the choice to force the addon on all fields with the [`overrideFieldExtensions`](field-extensions.md#overrideFieldExtensions) hook is probably the right one.
    

In the [next section](manual-field-extensions.md) we're going to take a much more detailed look at manual field extensions, and we're going to convert our star rating editor into a manual extension.

### Reference Table: Field Types & Internal Names

This table lists the internal names of different DatoCMS field types. It is useful for limiting your field extensions only to specific field types. If you're using TypeScript, you can also get this from the type `FieldAttributes['field_type']` [exported from our CMA client](https://github.com/datocms/js-rest-api-clients/blob/v3.4.1/packages/cma-client/src/generated/SimpleSchemaTypes.ts#L6280-L6308).

For more details on the different DatoCMS field types, please see the [CMA documentation on Fields](https://www.datocms.com/docs/content-management-api/resources/field.md#available-field-types).

| Field Type | Internal Name (for `attributes.field_type`) |
| --- | --- |

| Single-line string | `string` |
| Multi-line text | `text` |
| Boolean | `boolean` |
| Integer | `integer` |
| Float | `float` |
| Date | `date` |
| Date & Time | `date_time` |
| Color | `color` |
| JSON | `json` |
| Location | `lat_lon` |
| SEO and Social | `seo` |
| Slug | `slug` |
| External Video | `video` |
| Single Asset | `file` |
| Asset Gallery | `gallery` |
| Single Link (to another record) | `link` |
| Multiple Links (to other records) | `links` |
| Modular Content | `rich_text` |
| Single Block | `single_block` |
| Structured Text | `structured_text` |

### Side note: `ctx` updates and React useEffect

**This section is only relevant if your plugin has** `**useEffects**` **triggered by context changes.**

Because plugins live inside an iframe, record updates may sometimes cause the `ctx` (context) object to be recreated and passed through the iframe again, triggering a React `useEffect` unexpectedly even if the values appear the same. This is because `useEffect` compares objects by reference, not value equality. A re-created `ctx` object with the same values will still cause React to believe it's changed.

For example, if you update some field values in the CMS (outside your plugin), `ctx.formValues` will update as expected, because those values are different. However, React will also think `ctx.fields` has changed, even though its values remain the same.

Generally this shouldn't be a problem, but if you specifically need to make sure a `useEffect` only runs on actual value changes, we recommend a [custom hook like useDeepCompareEffect()](https://github.com/kentcdodds/use-deep-compare-effect).

#### `overrideFieldExtensions(field: Field, ctx)`

Use this function to automatically force one or more field extensions to a particular field.

##### Return value

The function must return: `FieldExtensionOverride | undefined`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.itemType: ItemType</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/overrideFieldExtensions.ts#L31)

</details>

</details>

#### `renderFieldExtension(fieldExtensionId: string, ctx)`

This function will be called when the plugin needs to render a field extension (see the `manualFieldExtensions` and `overrideFieldExtensions` functions).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>Field additional properties</summary>

These information describe the current state of the field where this plugin is applied to.

<details>
<summary>ctx.disabled: boolean</summary>

Whether the field is currently disabled or not.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/field.ts#L12)

</details>

<details>
<summary>ctx.fieldPath: string</summary>

The path in the `formValues` object where to find the current value for the field.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/field.ts#L17)

</details>

<details>
<summary>ctx.field: Field</summary>

The field where the field extension is installed to.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/field.ts#L19)

</details>

<details>
<summary>ctx.parentField: Field | undefined</summary>

If the field extension is installed in a field of a block, returns the top level Modular Content/Structured Text field containing the block itself.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/field.ts#L24)

</details>

<details>
<summary>ctx.block</summary>

If the field extension is installed in a field of a block, returns the ID of the block — or `undefined` if the block is still not persisted — and the block model.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/ctx/commonExtras/field.ts#L30)

</details>

</details>

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
<summary>ctx.fieldExtensionId: string</summary>

The ID of the field extension that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderFieldExtension.ts#L29)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the field extension.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderFieldExtension.ts#L31)

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