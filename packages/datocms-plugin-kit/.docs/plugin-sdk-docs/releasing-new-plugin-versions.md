# Releasing new plugin versions

If you already have published a plugin on the DatoCMS Marketplace, here is what you need to do in order to release a new version.

## Developing a new version of a published plugin

To test a new local version of a plugin that has already been published, make sure to [create a new sandbox environment](https://www.datocms.com/docs/scripting-migrations/introduction.md#creating-a-new-sandbox-environment), then enter the "Developer zone" settings, and specify a local entry point URL for the plugin.

(Video content)

This way, all the settings you already entered for the plugin and all the fields where you installed its manual field extensions will remain untouched, but you'll be able to test new code.

## Releasing a canary version

[Following the usual NPM convention](https://docs.npmjs.com/cli/v8/commands/npm-dist-tag#purpose), other users will see the upgrade notification for your plugin **only when a new package version is tagged as** **`latest`**. This means that you can release a canary version of your plugin that only you can test by publishing it to any other NPM `dist-tag`.

In this example, we'll use the `next` tag:

Terminal window

```bash
npm publish --tag next
```

Once the new version is published, open the "Developer zone" section and click on "Upgrade to canary release". A prompt will appear asking the exact canary version you want to install.

## Releasing an official new version

Once you made sure the canary release works as expected, you can publish a new version on the `latest` NPM tag:

Terminal window

```bash
npm publish
```

Once published, all the projects where the plugin is installed will receive a notification asking them to upgrade to the latest version:

[(Image content)](https://www.datocms-assets.com/205/1637622931-screenshot-2021-11-23-at-00-15-17.png?auto=format&fit=max&w=2000)

## Migrating old global plugin settings

The new version might need to store different settings than the previous ones. This can happen both for [global settings](config-screen.md), or the settings associated to a particular use of a [manual extension](manual-field-extensions.md) inside a field.

If the end-user decides to upgrade to the latest version of the plugin, DatoCMS keeps the old settings saved. This means that **plugins have to somehow manage configuration objects in older formats** too.

Let's concentrate on global plugin settings first, `ctx.plugin.attributes.parameters`. We can easily build some Typescript types and [type guard functions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) to properly describe all the possibile formats in which settings might be stored:

```typescript
// ctx.plugin.attributes.parameters can be in one of these formats:
type Config = EmptyConfig | V1Config | V2Config;

// As soon as the plugin is installed, config is an empty object:
type EmptyConfig = {};

// Plugin v1 version saves config in this format:
type V1Config = {
  someOption: 'yes' | 'no';
}

// Current version changes the format for `someOption`, and adds `newOption`:
type V2Config = {
  someOption: boolean;
  newOption: string;
}

const isEmptyConfig = (parameters: Config): parameters is EmptyConfig => {
  return Object.keys(parameters).length === 0;
}

const isV1Config = (parameters: Config): parameters is V1Config => {
  return 'someOption' in parameters;
}

const isV2Config = (parameters: Config): parameters is V1Config => {
  return 'newOption' in parameters;
}
```

In this example, new and old config formats are somewhat compatible, so we can use the [`onBoot`](event-hooks.md) hook — which gets called as soon as the DatoCMS application loads, or the plugin is installed for the first time — to silently update the plugin configuration to the new format or, if it's the first installation for the plugin, to provide some default configuration:

```typescript
function normalizeConfig(parameters: Config): V2Config {
  if (isEmptyConfig(parameters)) {
    return { someOption: true, newOption: 'foobar' };
  }

  if (isV1Config(parameters)) {
    return { someOption: parameters.someOption === 'yes', newOption: 'foobar' };
  }

  return parameters;
}

connect({
  onBoot(ctx: OnBootCtx) {
    if (isV2Config(ctx.plugin.attributes.parameters as Config)) {
      return;
    }

    if (ctx.currentRole.meta.final_permissions.can_edit_schema) {
      ctx.updatePluginParameters(
        normalizeConfig(ctx.plugin.attributes.parameters as Config),
      );
    }
  },
  renderPage(pageId, ctx) {
    const parameters = normalizeConfig(ctx.plugin.attributes.parameters as Config);
    // ...use the normalized config from now on
  },
});
```

#### What if new config format is not compatible with older ones?

Unfortunately, it can also happen to introduce changes in a newer version that are not backward compatible. In this case, our approach will slighly change, as we need one of the project admins to manually change the settings in the config screen:

```typescript
connect({
  async onBoot(ctx: OnBootCtx) {
    if (isConfigValid(ctx.plugin.attributes.parameters as Config)) {
      return;
    }

    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      ctx.customToast({
        type: 'warning',
        message:
          'Invalid settings. Please ask your administrators to fix the issue!',
      });

      return;
    }

    const result = await ctx.customToast({
      type: 'warning',
      message:
        'Invalid settings. Please fix them to make the plugin work again!',
      cta: {
        label: 'Go to plugin settings',
        value: 'settings',
      },
    });

    if (result === 'settings') {
      ctx.navigateTo(`/admin/plugins/${ctx.plugin.id}/edit`);
    }
  },
  renderPage(pageId, ctx) {
    // fast return
    if (!isConfigValid(ctx.plugin.attributes.parameters as Config)) {
      return <div>Functionality disabled until settings are fixed!</div>;
    }
  },
});
```

Let's review what this code is doing:

-   every hook that needs to read the configuration object (`renderPage` in this example) can use the `isConfigValid()` function to test if it can execute normally, or it needs to fast return to avoid errors due to incompatible settings;
    
-   the `onBoot` hook shows a notification to the end user telling that the configuration needs to be manually fixed, or the plugin won't work.
    

## Migrating old manual Field Extension settings

A very similar approach can also be used to handle changes in manual field extension settings between versions.

If the new configuration is compatible with the old one:

-   the `renderFieldExtension` hook uses a `normalizeParameters()` function to convert older configuration objects into the latest format;
    
-   the `onBoot` hook first needs to determine if it needs to do the migration: to do that, it can look into `ctx.plugin.attributes.parameters` and see if ie. global settings have already some flag. Then it fetches all the fields that are hooked to our plugin using `ctx.loadFieldsUsingPlugin()`, and for each of them it uses the `ctx.updateFieldAppearance()` function to silently update the field extension to the new format.
    

```typescript
connect({
  async onBoot(ctx: OnBootCtx) {
    if (
      ctx.plugin.attributes.parameters.version !== '2' ||
      !ctx.currentRole.meta.final_permissions.can_edit_schema
    ) {
      return;
    }

    const fields = await ctx.loadFieldsUsingPlugin();

    await Promise.all(
      fields.map(async (field) => {
        const { appearance } = field.attributes;
        const changes: FieldAppearanceChange[] = [];

        if (
          appearance.editor === ctx.plugin.id &&
          appearance.field_extension === 'oldFieldEditorName'
        ) {
          changes.push({
            operation: 'updateEditor',
            newFieldExtensionId: 'newFieldEditorName',
            newFieldExtensionParameters: normalizeConfig(appearance.parameters),
          });
        }

        if (changes.length > 0) {
          await ctx.updateFieldAppearance(field.id, changes);
        }
      }),
    );
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    const parameters = normalizeConfig(ctx.parameters);
    // ...use the normalized config from now on
  },
});
```

If old versions and new versions are incompatible, just like with the global settings before, all we can do is warning the user that manual field extensions need to be manually reconfigured. The Config screen can then offer some kind of UI to help users migrate manual field extensions in batch by providing some options:

```typescript
connect({
  async onBoot(ctx: OnBootCtx) {
    if (ctx.plugin.attributes.parameters.version === '2') {
      return;
    }

    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      ctx.customToast({
        type: 'warning',
        message:
          'Invalid settings. Please ask your administrators to fix the issue!',
      });

      return;
    }

    const result = await ctx.customToast({
      type: 'warning',
      message:
        'Invalid settings. Please fix them to make the plugin work again!',
      cta: {
        label: 'Go to plugin settings',
        value: 'settings',
      },
    });

    if (result === 'settings') {
      ctx.navigateTo(`/admin/plugins/${ctx.plugin.id}/edit`);
    }
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    if (ctx.plugin.attributes.parameters.version !== '2') {
      return <div>Functionality disabled until settings are fixed!</div>;
    }

    // ...
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