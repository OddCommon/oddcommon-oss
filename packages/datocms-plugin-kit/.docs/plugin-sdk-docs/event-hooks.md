# Event hooks

In addition to all the `render<LOCATION>` hooks, the SDK also exposes a number of hooks that can be useful to intercept specific events happening on the interface, and execute custom code, or change the way the regular interface behaves.

All these event hooks follow the same `on<EVENT>` naming convention.

### Execute custom code when the plugin loads up

There are situations where a plugin needs to execute code as soon as the DatoCMS interface is loaded. For example, a plugin may need to contact third party systems to verify some information, or maybe notify the user in some way.

In these scenarios you can use the [`onBoot`](event-hooks.md#onBoot) hook, and have the guarantee that it will be called as soon as the main DatoCMS application is loaded:

```tsx
import { connect } from 'datocms-plugin-sdk';

connect({
  async onBoot(ctx) {
    ctx.notice('Hi there!');
  }
});
```

Inside this hook there is no point in rendering anything, because it won't be displayed anywhere. For a concrete use case of this hook, please have a look at the chapter [Releasing new plugin versions](releasing-new-plugin-versions.md).

### Intercept actions on records

Another useful group of event hooks can be used to intercept when the user wants to perform a specific action on one (or multiple) records:

-   [`onBeforeItemUpsert`](event-hooks.md#onBeforeItemUpsert): called when the user wants to save a record (both creation or update);
    
-   [`onBeforeItemsDestroy`](event-hooks.md#onBeforeItemsDestroy): called when the user wants to delete one (or more) records;
    
-   [`onBeforeItemsPublish`](event-hooks.md#onBeforeItemsPublish): called when the user wants to publish one (or more) records;
    
-   [`onBeforeItemsUnpublish`](event-hooks.md#onBeforeItemsUnpublish): called when the user wants to unpublish one (or more) records;
    

All these hooks can return the value `false` to stop the relative action from happening.

In the following example we're using the `onBeforeItemUpsert` hook to check if the user is saving articles with the "highlighted" flag turned on, and if that's the case we show them an additional confirmation, to make sure they know what they're doing:

```tsx
import { connect } from 'datocms-plugin-sdk';

connect({
  async onBeforeItemUpsert(createOrUpdateItemPayload, ctx) {
    const item = createOrUpdateItemPayload.data;

    // get the ID of the Article model
    const articleItemTypeId = Object.values(ctx.itemTypes).find(itemType => itemType.attributes.api_key === 'article').id;

    // fast return for any record that's not an Article
    if (item.relationships.item_type.data.id !== articleItemTypeId) {
      return;
    }

    // fast return if the article is not highlighted
    if (!item.attributes.highlighted) {
      return;
    }

    const confirmation = await ctx.openConfirm({
      title: 'Mark Article as highlighted?',
      content: 'Highlighted articles are displayed on the homepage of the site!',
      cancel: { label: 'Cancel', value: false },
      choices: [
        { label: 'Yes, save as highlighted', value: true, intent: 'negative' },
      ],
    });

    if (!confirmation) {
      ctx.notice('The article has not been saved, you can unflag the "highlighted" field.');
      // returning false blocks the action
      return false;
    }
  }
});
```

We can also do something similar to confirm if the user really wants to publish a record. The `onBeforeItemsPublish` hook is also called when the user is selecting multiple records from the collection page, and applying a batch publish operation:

```tsx
import { connect } from 'datocms-plugin-sdk';

connect({
  async onBeforeItemsPublish(items, ctx) {
    return await ctx.openConfirm({
      title: `Publish ${items.length} records?`,
      content: `This action will make the records visibile on the public website!`,
      cancel: { label: 'Cancel', value: false },
      choices: [{ label: 'Yes, publish', value: true }],
    });
  }
});
```

#### `onBoot(ctx)`

This function will be called once at boot time and can be used to perform ie. some initial integrity checks on the configuration.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `onBeforeItemsDestroy(items: Item[], ctx)`

This function will be called before destroying records. You can stop the action by returning `false`.

##### Return value

The function must return: `MaybePromise<boolean>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `onBeforeItemsPublish(items: Item[], ctx)`

This function will be called before publishing records. You can stop the action by returning `false`.

##### Return value

The function must return: `MaybePromise<boolean>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `onBeforeItemsUnpublish(items: Item[], ctx)`

This function will be called before unpublishing records. You can stop the action by returning `false`.

##### Return value

The function must return: `MaybePromise<boolean>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `onBeforeItemUpsert(createOrUpdateItemPayload: ItemUpdateSchema | ItemCreateSchema, ctx)`

This hook is called when the user attempts to save a record. You can use it to block record saving.

If you return `false`, the record will NOT be saved. A small on-page error will say "A plugin blocked the action". However, for better UX, consider also using `ctx.alert()` to better explain to the user why their save was blocked.

If you return `true`, the save will proceed as normal.

This hook runs BEFORE serverside validation. You can use it to do your own additional validation before returning. Clientside validations are not affected by this hook, since those occur on individual fields' `onBlur()` events.

##### Return value

The function must return: `MaybePromise<boolean>`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.scrollToField(path: string, locale?: string) => Promise<void></summary>

Smoothly navigates to a specific field in the form. If the field is localized it will switch language tab and then navigate to the chosen field.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/onBeforeItemUpsert.ts#L47)

```ts
const fieldPath = prompt(
  'Please insert the path of a field in the form',
  ctx.fieldPath,
);

await ctx.scrollToField(fieldPath);
```

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