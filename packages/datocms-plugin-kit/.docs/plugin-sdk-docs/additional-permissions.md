# Additional permissions

Some methods and properties available within the hooks require special permissions to be accessed, as they may cause security issues.

If a plugin wants to access these additional features, it must request specific permissions. When installing the plugin, the user must explicitly grant these permissions, otherwise the installation process will be aborted:

[(Image content)](https://www.datocms-assets.com/205/1637622525-screenshot-2021-11-23-at-00-08-26.png?auto=format&fit=max&w=2000)

# Available permissions

At the moment, only one special permit is available, but in the future more may be added.

### `currentUserAccessToken`

This permission makes the `ctx.currentUserAccessToken` property available. This token represents the currently logged in user, and you can use it to make API calls to the [Content Management API](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients.md) on behalf of that user.

```jsx
import { SiteClient } from 'datocms-client';
import { useMemo, useEffect } from 'react';

connect({
  renderPage(pageId, { ctx }) {
    const client = useMemo(() => {
      return new SiteClient(
        ctx.currentUserAccessToken,
        { environment: ctx.environment },
      );
    }, [ctx.currentUserAccessToken]);

    useEffect(async () => {
      const someRecords = await client.items.all();
    }, []);

    // ...
  },
});
```

## Specifying additional permissions

#### Private plugins

During the creation of a plugin, it is possible to specify the additional permissions the plugin requires:

(Video content)

#### Marketplace plugins

Public plugins must declare their additional permissions inside the `datocmsPlugin.permission` key in their `package.json` file:

```json
{
  "name": "datocms-plugin-foobar",
  "version": "0.1.0",
  "dependencies": {
    // ...
  },
  "datoCmsPlugin": {
    "title": "Foobar",
    // ...
    "permissions": ["currentUserAccessToken"]
  }
}
```

For more information regarding how to publish a plugin in the Marketplace, see [here](publishing-to-marketplace.md).

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