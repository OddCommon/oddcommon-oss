# Introduction to the DatoCMS Plugin SDK

Although DatoCMS offers a wide range of features and configurations by default, with **plugins** it is possible to take a further leap forward. You can integrate third-party services with our platform or build custom integrations tailored specifically to your business and user needs.

### What is a DatoCMS Plugin?

Technically speaking, DatoCMS plugins are small web apps that run in a sandboxed `<iframe>` inside our UI and interact with the main DatoCMS app through the Plugin SDK. They can be implemented with basic HTML and JavaScript, or using more advanced client-side frameworks such as React, Angular or Vue.

> [!POSITIVE] Pro tip
> If you're using React, you can take advantage of the [`datocms-react-ui` package](react-datocms-ui.md) that provides a set of ready-to-use components that are consistent with the UI of the main DatoCMS application.

### What can plugins do?

> [!PROTIP] Pro tip: Example plugins built by the community
> Before you build your own plugin, you might want to see if similar functionality is already available in our Community Plugins Marketplace: [https://www.datocms.com/marketplace/plugins](https://www.datocms.com/marketplace/plugins.md)

A huge variety of enhancements to the DatoCMS web app are possible. From small field editor improvements to deeply-integrated full-page applications, plugins make customizing the DatoCMS interface effortless.

Some common use cases are:

-   adding custom field editors to improve the editor experience;
    
-   managing content versions for running A/B tests on structured content using personalization tools;
    
-   tailoring the default entry editor to suit your specific needs;
    
-   seamlessly integrating DatoCMS with third-party software and services.
    

For some real-world examples, you can take a look at our [Marketplace](https://www.datocms.com/marketplace/plugins.md), which already offers 100+ open-source plugins.

### How plugins work

The way in which plugins modify the default DatoCMS interface is through the concept of **hooks**.

The SDK provides a set of locations where plugins can intervene by adding functionality (ie. custom pages, sidebar panels, etc.), and for each of these locations a set of hooks are provided.

Hooks serve three main purposes:

-   **Declare the plugin intentions** (e.g., "I want to add a tab in the top navigation bar of DatoCMS that points to a custom page X").
    
-   **Render the content for the** `**iframe**` associated with the declared custom locations (e.g., "when the user enters custom page X, let me render my stuff")
    
-   **Intercept specific events** happening on the interface, and execute custom code, or change the way the regular interface behaves.
    

You can read in detail about all the hooks and locations provided in the following sections of the guide.

### Distribution: private vs public plugins

As we'll learn in the following sections, plugins can either be private, or publicly released into the Marketplace.

A private plugin is built by you for your specific organization's needs to optimize your organization's editorial experience. It is fully under your control and not accessible by other organizations.

If you think a plugin you've made would be useful to other community members, then we strongly encourage its release in our public [Marketplace](https://www.datocms.com/marketplace/plugins.md). Everyone can contribute new plugins to the marketplace by releasing them as NPM packages.

#### Learn more about plugins

Check out this tutorial on how to make the most out of the plugins in our Marketplace, or how to build your own:

[

(Image content)

Intro to the Plugin Ecosystem

Play video »

](https://www.datocms.com/user-guides/the-basics/intro-to-the-plugin-ecosystem.md)

[

(Image content)

How to start developing plugins for DatoCMS

Play video »

](https://youtu.be/sc8sm34tyWw)

[

(Image content)

Exploring DatoCMS Plugins that help authors

Play video »

](https://youtu.be/PDLCgSFjrac)

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