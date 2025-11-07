# Dropdown actions

Plugins can greatly improve DatoCMS's overall functionality by defining custom actions that will appear as dropdown menu items or context menus throughout the entire interface, enhancing a more personalized user experience.

Custom dropdown actions can be defined in various unique contexts:

## Record-Editing actions

Actions of this specific type will be prominently displayed next to the title of the record, enabling users to quickly access tools custom to streamline their editing process:

[(Image content)](https://www.datocms-assets.com/205/1728566991-screenshot-2024-10-10-at-15-28-32.png?auto=format&fit=max&w=2000)

The hooks required for their implementation are:

-   Present the actions using [`itemFormDropdownActions()`](dropdown-actions.md#itemFormDropdownActions)
    
-   Execute the action with [`executeItemFormDropdownAction()`](dropdown-actions.md#executeItemFormDropdownAction)
    

## Field-Specific Record Actions

Actions will be conveniently placed in a dropdown next to the field label, allowing users to easily interact with the data contained in a specific field of a record:

[(Image content)](https://www.datocms-assets.com/205/1728566378-screenshot-2024-10-10-at-15-17-27.png?auto=format&fit=max&w=2000)

The hooks required for their implementation are:

-   Present the actions using [`fieldDropdownActions()`](dropdown-actions.md#fieldDropdownActions)
    
-   Execute the action with [`executeFieldDropdownAction()`](dropdown-actions.md#executeFieldDropdownAction)
    

## Global Record Actions

Actions of this type will be presented in two areas of the interface: firstly, in the batch actions available within the record collection view:

[(Image content)](https://www.datocms-assets.com/205/1728567441-screenshot-2024-10-10-at-15-32-49.png?auto=format&fit=max&w=2000)

And secondly, in the detailed view of the record itself (together with any available Record-Editing actions), providing users with additional options for manipulation:

[(Image content)](https://www.datocms-assets.com/205/1728566991-screenshot-2024-10-10-at-15-28-32.png?auto=format&fit=max&w=2000)

The hooks required for their implementation are:

-   Present the actions using [`itemsDropdownActions()`](dropdown-actions.md#itemsDropdownActions)
    
-   Execute the action with [`executeItemsDropdownAction()`](dropdown-actions.md#executeItemsDropdownAction)
    

## Asset Management Actions

Actions of this type will be displayed in two sections of the interface: in batch actions within the Media Area:

[(Image content)](https://www.datocms-assets.com/205/1728567765-screenshot-2024-10-10-at-15-42-22.png?auto=format&fit=max&w=2000)

and in the detailed view of the asset itself:

[(Image content)](https://www.datocms-assets.com/205/1728567805-screenshot-2024-10-10-at-15-43-20.png?auto=format&fit=max&w=2000)

The hooks required for their implementation are:

-   Present the actions using [`uploadsDropdownActions()`](dropdown-actions.md#uploadsDropdownActions)
    
-   Execute the action with [`executeUploadsDropdownAction()`](dropdown-actions.md#executeUploadsDropdownAction)
    

## How to implement a dropdown action

This is a brief example of how you can implement your actions:

```typescript
import {
  connect,
  type FieldDropdownActionsCtx,
  type ExecuteFieldDropdownActionCtx,
} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";

connect({
  fieldDropdownActions(field, ctx: FieldDropdownActionsCtx) {
    if (
      ctx.itemType.attributes.api_key !== "blog_post" ||
      field.attributes.api_key !== "title"
    ) {
      // Don't add any action!
      return [];
    }

    return [
      // A single action
      {
        id: "actionA",
        label: "Custom action A",
        icon: "music",
      },
      // A group of actions
      {
        label: "Group of custom actions",
        icon: "mug-hot",
        actions: [
          // These actions will be shown in a submenu
          {
            id: "actionB",
            label: "Custom action B",
            icon: "rocket-launch",
          },
          {
            id: "actionC",
            label: "Custom action C",
            icon: "sparkles",
          },
        ],
      },
    ];
  },
  async executeFieldDropdownAction(
    actionId: string,
    ctx: ExecuteFieldDropdownActionCtx,
  ) {
    if (actionId === "actionA") {
      // Do something using ctx
      ctx.notice('Selected action A');
    } else if (actionId === "actionB") {
      // Do something else
      ctx.notice('Selected action B');
    } else if (actionId === "actionC") {
      // Do something else
      ctx.notice('Selected action C');
    }
  },
});
```

The types of operations you can perform within your execute hooks are dependent on the methods available in the `ctx` argument, which in turn is influenced by the specific type of action. As an example, Record-Editing and Field-Specific Record actions offer methods in `ctx` to change the state of the record form, while other actions do not. Consult the specific documentation for each hook listed below to understand the available options.

#### `executeFieldDropdownAction(actionId: string, ctx)`

Use this function to execute a particular dropdown action defined via the `fieldDropdownActions()` hook.

##### Return value

The function must return: `Promise<void>`.

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
<summary>ctx.parameters: Record<string, unknown> | undefined</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/executeFieldDropdownAction.ts#L25)

</details>

</details>

</details>

#### `executeItemFormDropdownAction(actionId: string, ctx)`

Use this function to execute a particular dropdown action defined via the `itemFormDropdownActions()` hook.

##### Return value

The function must return: `Promise<void>`.

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
<summary>ctx.parameters: Record<string, unknown> | undefined</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/executeItemFormDropdownAction.ts#L23)

</details>

</details>

</details>

#### `executeItemsDropdownAction(actionId: string, items: Item[], ctx)`

Use this function to execute a particular dropdown action defined via the `itemsDropdownActions()` hook.

##### Return value

The function must return: `Promise<void>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.parameters: Record<string, unknown> | undefined</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/executeItemsDropdownAction.ts#L23)

</details>

</details>

#### `executeSchemaItemTypeDropdownAction(actionId: string, itemType: ItemType, ctx)`

Use this function to execute a particular dropdown action defined via the `schemaItemTypeDropdownActions()` hook.

##### Return value

The function must return: `Promise<void>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.parameters: Record<string, unknown> | undefined</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/executeSchemaItemTypeDropdownAction.ts#L23)

</details>

</details>

#### `executeUploadsDropdownAction(actionId: string, uploads: Upload[], ctx)`

Use this function to execute a particular dropdown action defined via the `uploadsDropdownActions()` hook.

##### Return value

The function must return: `Promise<void>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.parameters: Record<string, unknown> | undefined</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/executeUploadsDropdownAction.ts#L23)

</details>

</details>

#### `fieldDropdownActions(field: Field, ctx)`

Use this function to define custom actions (or groups of actions) to be displayed at the individual field level in the record editing form.

The `executeFieldDropdownAction()` hook will be triggered once the user clicks on one of the defined actions.

##### Return value

The function must return: `Array<DropdownAction | DropdownActionGroup>`.

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

</details>

#### `itemFormDropdownActions(itemType: ItemType, ctx)`

Use this function to define custom actions (or groups of actions) to be displayed at when editing a particular record.

The `executeItemFormDropdownAction()` hook will be triggered once the user clicks on one of the defined actions.

##### Return value

The function must return: `Array<DropdownAction | DropdownActionGroup>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

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

#### `itemsDropdownActions(itemType: ItemType, ctx)`

This function lets you set up custom actions (or groups of actions) that show up when the user:

-   selects multiple records in the collection view for batch operations, or

-   starts editing a specific record.

The `executeItemsDropdownAction()` hook will be triggered once the user clicks on one of the defined actions.

##### Return value

The function must return: `Array<DropdownAction | DropdownActionGroup>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.itemType: ItemType</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/itemsDropdownActions.ts#L27)

</details>

</details>

#### `schemaItemTypeDropdownActions(itemType: ItemType, ctx)`

Use this function to define custom actions (or groups of actions) for a model/block model in the Schema section.

The `executeSchemaItemTypeDropdownAction()` hook will be triggered once the user clicks on one of the defined actions.

##### Return value

The function must return: `Array<DropdownAction | DropdownActionGroup>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `uploadsDropdownActions(ctx)`

This function lets you set up custom actions (or groups of actions) that show up when the user:

-   selects multiple assets in the Media Area for batch operations, or

-   opens up a specific asset from the Media Area.

The `executeUploadsDropdownAction()` hook will be triggered once the user clicks on one of the defined actions.

##### Return value

The function must return: `Array<DropdownAction | DropdownActionGroup>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

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
