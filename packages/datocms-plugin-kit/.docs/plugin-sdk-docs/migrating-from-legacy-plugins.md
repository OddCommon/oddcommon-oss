# Migrating from legacy plugins

A completely revamped plugin SDK was released in November 2021. Plugins leveraging the legacy SDK will continue to work indefinitely, but are much more limited in their possibilities, as they can only manage what in the new SKD are called [manual field extensions](manual-field-extensions.md). All the other extension points are not available.

> [!WARNING] Legacy SDK docs
> If you're looking for the Legacy SDK documentation, it is still available [here](https://www.datocms.com/docs/legacy-plugins.md).

If you are interested in migrating to the new SDK, please note the following points:

## Global configuration parameters

Global parameters no longer need to be declared in the `package.json`, but are configurable through the [config-screen hooks](config-screen.md).

The data storage format is now also completely custom, as well as the interface that is shown to end users.

## Manual extensions

The old options:

-   "Type of plugin" (field editor, field add-on or sidebar widget), and
    
-   "Types of field" (specifying where it's possible to use the legacy plugin)
    

do not have to be declared in the `package.json` anymore, but are configurable through the [`manualFieldExtensions` hook](manual-field-extensions.md). The old "sidebar widget" plugin type is nothing but an additional `asSidebarPanel` option you can pass to the new `ManualFieldExtension` type:

```typescript
import { connect, Field, InitCtx } from 'datocms-plugins-sdk';

connect({
  manualFieldExtensions(ctx: InitCtx) {
    return [
      {
        id: 'sidebarWidget',
        name: 'My sidebar widget',
        type: 'editor',
        fieldTypes: ['integer'],
        asSidebarPanel: true,
      },
    ];
  },
  renderFieldExtension(id, ctx) {
    // ...
  },
});
```

## Instance configuration options

Instance parameters no longer need to be declared in the `package.json`, but are now completely arbitrary, as well as the interface that is shown to end users. Take a look at this part of the [documentation](manual-field-extensions.md#add-per-field-configuration-options-to-manual-field-extensions).

## `plugin.xxx` methods and properties

All methods and information previously available through `plugin.xxx` calls is now available through the `ctx` argument of the [`renderFieldExtension` hook](field-extensions.md#rendering-the-field-extension).

## Migrating appearance on associated fields

Since new plugins can expose multiple manual field extensions, you need to implement an [`onBoot` hook](event-hooks.md) to properly set the `fieldExtensionId` attribute on each field that was previously hooked with the plugin.

##### Example to migrate old field editors or sidebar widgets

```tsx
connect({
  // plugin exposes a `myExtension` manual field extension
  manualFieldExtensions(ctx: InitCtx) {
    return [
      {
        id: 'myExtension',
        name: 'Foo bar',
        type: 'editor',
        fieldTypes: ['integer'],
      },
    ];
  },
  async onBoot(ctx: OnBootCtx) {
    // if we already performed the migration, skip
    if (ctx.plugin.attributes.parameters.migratedFromLegacyPlugin) {
      return;
    }

    // if the current user cannot edit fields' settings, skip
    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }

    // get all the fields currently associated to the plugin...
    const fields = await ctx.loadFieldsUsingPlugin();

    // ... and for each of them...
    await Promise.all(
      fields.map(async (field) => {
        // set the fieldExtensionId to be the new one
        await ctx.updateFieldAppearance(field.id, [{
          operation: 'updateEditor',
          newFieldExtensionId: 'myExtension',
        }]);
      }),
    );

    // save in configuration the fact that we already performed the migration
    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });
  },
});
```

##### Example to migrate old field addons

```tsx
connect({
  // plugin exposes a `myExtension` manual field extension
  manualFieldExtensions(ctx: InitCtx) {
    return [
      {
        id: 'myExtension',
        name: 'Foo bar',
        type: 'addon',
        fieldTypes: ['integer'],
      },
    ];
  },
  async onBoot(ctx: OnBootCtx) {
    // if we already performed the migration, skip
    if (ctx.plugin.attributes.parameters.migratedFromLegacyPlugin) {
      return;
    }

    // if the current user cannot edit fields' settings, skip
    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }

    // get all the fields currently associated to the plugin...
    const fields = await ctx.loadFieldsUsingPlugin();

    // ... and for each of them...
    await Promise.all(
      fields.map(async (field) => {
        const { appearance } = field.attributes;
        const changes: FieldAppearanceChange[] = [];

        // find where our plugin is used...
        appearance.addons.forEach((addon, index) => {
          // set the fieldExtensionId to be the new one
          changes.push({
            operation: 'updateAddon',
            index,
            newFieldExtensionId: 'myExtension',
          });
        });

        await ctx.updateFieldAppearance(field.id, changes);
      }),
    );

    // save in configuration the fact that we already performed the migration
    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });
  },
});
```

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