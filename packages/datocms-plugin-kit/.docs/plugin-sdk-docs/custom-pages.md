# Custom pages

Through plugins it is possible to enrich the functionalities of DatoCMS by adding new pages and sections to the standard interface. These pages are almost full-screen, **100% customisable**, and the end-user can reach them through links/menu items that can be added to the different DatoCMS navigation menus.

For example, the [Custom Page](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-custom-page.md) plugin lets you embed any external URL inside DatoCMS, while the [Content Calendar](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-content-calendar.md) plugin uses a custom page to explore your records inside a calendar:

(Video content)

A page is nothing more than an iframe, inside of which the plugin developer can render what they prefer, while also having the possibility to:

-   access a series of information related to the project in which the plugin is installed or the logged-in user;
    
-   make calls to DatoCMS to produce various effects and interacting with the main application (ie. navigate to other pages, trigger notifications, opening modals, etc.);
    

### Adding a link to the custom page

The SDK provides a number of hooks for adding links to custom pages within the navigation menus of DatoCMS.

#### Top-bar navigation items

(Image content)

To add one or more tabs to the top bar of the interface, you can use the [`mainNavigationTabs`](custom-pages.md#mainNavigationTabs) hook:

```typescript
import { connect, MainNavigationTabsCtx } from 'datocms-plugin-sdk';

connect({
  mainNavigationTabs(ctx: MainNavigationTabsCtx) {
    return [
      {
        label: 'Analytics',
        icon: 'analytics',
        pointsTo: {
          pageId: 'analytics',
        },
      },
    ];
  },
});
```

The `pageId` property is crucial here, as it specifies which custom page you want to display when you click the tab. If you wish, you can also customize the insertion point of the menu item via the `placement` property:

```typescript
{
  // ...other properties
  placement: ['before', 'content'],
}
```

In this case, we are asking to show the tab before the default "Content" tab.

As for the `icon`, you can either use one of the [Awesome 5 Pro solid icons](https://fontawesome.com/v5/search?o=r&s=solid) by their name, or explicitly pass a custom SVG:

```javascript
icon: {
  type: 'svg',
  viewBox: '0 0 448 512',
  content:
    '<path fill="currentColor" d="M448,230.17V480H0V230.17H141.13V355.09H306.87V230.17ZM306.87,32H141.13V156.91H306.87Z" class=""></path>',
}
```

#### Menu item in the Content navigation sidebar

(Image content)

Similarly, we can use the [`contentAreaSidebarItems`](custom-pages.md#contentAreaSidebarItems) hook to add menu items to the sidebar that is displayed when we are inside the "Content" area:

```typescript
import { connect, ContentAreaSidebarItemsCtx } from 'datocms-plugin-sdk';

connect({
  contentAreaSidebarItems(ctx: ContentAreaSidebarItemsCtx) {
    return [
      {
        label: 'Welcome!',
        icon: 'igloo',
        placement: ['before', 'menuItems'],
        pointsTo: {
          pageId: 'welcome',
        },
      },
    ];
  },
});
```

This code will add a menu item above the default menu items present in the sidebar.

#### Custom section in the Settings area

It is also possible to add new sections in the sidebar present in the "Settings" area with the [`settingsAreaSidebarItemGroups`](custom-pages.md#settingsAreaSidebarItemGroups) hook:

```typescript
import { connect, SettingsAreaSidebarItemGroupsCtx } from 'datocms-plugin-sdk';

const labels: Record<string, string> = {
  "en": 'Settings',
  "it": 'Impostazioni',
  "es": 'Configuración',
};

connect({
  settingsAreaSidebarItemGroups(ctx: SettingsAreaSidebarItemGroupsCtx) {
    if (!ctx.currentRole.attributes.can_edit_schema) {
      return [];
    }

    return [
      {
        label: 'My plugin',
        items: [
          {
            label: labels[ctx.ui.locale],
            icon: 'cogs',
            pointsTo: {
              pageId: 'settings',
            },
          },
        ],
      },
    ];
  },
});
```

In this example, it can be seen that it is possible to show (or not) menu items depending on the logged-in user's permissions, or to show labels translated into the user's preferred interface language.

### Step 2: Rendering the page

Once you enter the page through one of the links, you can render the content of the custom pages by implementing the [`renderPage`](custom-pages.md#renderPage) hook:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderPageCtx } from 'datocms-plugin-sdk';

function render(component: React.ReactNode) {
  ReactDOM.render(
    <React.StrictMode>{component}</React.StrictMode>,
    document.getElementById('root'),
  );
}

connect({
  renderPage(pageId, ctx: RenderPageCtx) {
    switch (pageId) {
      case 'welcome':
        return render(<WelcomePage ctx={ctx} />);
      case 'settings':
        return render(<SettingsPage ctx={ctx} />);
      case 'analytics':
        return render(<AnalyticsPage ctx={ctx} />);
    }
  },
});
```

The strategy to adopt here is is to implement a switch that, depending on the `pageId`, will render a different, specialized React component.

The hook, in its second `ctx` argument, provides a series of information and methods for interacting with the main application. It is a good idea to pass it to the page component, in the form of a React prop.

Here's an example page component. It is important to wrap the content inside the `Canvas` component to give our app the look and feel of the DatoCMS web app:

```tsx
import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderPageCtx,
};

function WelcomePage({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Hi there!
    </Canvas>
  );
}
```

#### `mainNavigationTabs(ctx)`

Use this function to declare new tabs you want to add in the top-bar of the UI.

##### Return value

The function must return: `MainNavigationTab[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderPage(pageId: string, ctx)`

This function will be called when the plugin needs to render a specific page (see the `mainNavigationTabs`, `settingsAreaSidebarItemGroups` and `contentAreaSidebarItems` functions).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.pageId: string</summary>

The ID of the page that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderPage.ts#L19)

</details>

<details>
<summary>ctx.location</summary>

Current page location.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderPage.ts#L22)

</details>

</details>

#### `settingsAreaSidebarItemGroups(ctx)`

Use this function to declare new navigation sections in the Settings Area sidebar.

##### Return value

The function must return: `SettingsAreaSidebarItemGroup[]`.

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