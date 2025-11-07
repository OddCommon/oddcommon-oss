# Publishing to Marketplace

If you've created a new plugin, we strongly encourage you to share it with the community as an [NPM](https://www.npmjs.com/) package, so that it will become available in our [Marketplace](https://www.datocms.com/marketplace/plugins.md) and installable on every DatoCMS project in one click!

### Tweaking the `package.json`

To release a plugin, you need to make sure to fill the `package.json` with these information:

```json
{
  "name": "datocms-plugin-foobar",
  "version": "0.0.1",
  "homepage": "https://github.com/mark/foobar#readme",
  "description": "Add a small description for the plugin here",
  "keywords": ["datocms-plugin"],
  "datoCmsPlugin": {
    "title": "Plugin title",
    "coverImage": "docs/cover.png",
    "previewImage": "docs/preview.mp4",
    "entryPoint": "build/index.html",
    "permissions": [],
  },
  "devDependencies": { ... },
  "dependencies": { ... }
}
```

The following table describes the properties that can be set on the file:

-   `name` (required): NPM package name
    
-   `version` (required): Plugin version
    
-   `description` (required): Short description of what the plugin does
    
-   `keywords` (required): Plugin keywords, useful to help users find your plugin
    
-   `homepage`: URL of the plugin homepage, will be shown in the Marketplace
    
-   `datoCmsPlugin.title` (required): Plugin title
    
-   `datoCmsPlugin.entryPoint` (required): Relative path to the plugin entry point
    
-   `datoCmsPlugin.previewImage`: Relative path to a video/image showing the plugin in action (better if it's a MP4 video)
    
-   `datoCmsPlugin.coverImage`: Relative path to a cover image that will be used in the [Marketplace](https://www.datocms.com/marketplace/plugins.md)
    
-   `datoCmsPlugin.permissions` (required): [Additional permissions](additional-permissions.md) your plugin needs to work
    

Make sure to strictly follow these rules, otherwise the plugin won't be visible in the Marketplace:

-   `name` MUST start with `datocms-plugin-`;
    
-   `entryPoint`, `previewImage` and `coverImage` MUST be files contained in the package, and need to be defined as paths relative to the package root (ie. `docs/image.png`);
    
-   `keywords` MUST contain the `datocms-plugin` keyword;
    

### Publishing the plugin

It is now time to publish your plugin as an NPM package. Inside your project, run the following command:

Terminal window

```bash
npm publish
```

Once published, the plugin will automatically be added in the Marketplace within one hour. The same applies also to new version releases.

> [!WARNING] Not showing up in the Marketplace?
> If you plugin is not showing up after 3 hours then please triple check that you've followed all the rules above in your `package.json`, then contact support.

### Plugin upgrades

To release a new version of your plugin, follow the [specific guide](releasing-new-plugin-versions.md). Once you publish a new version, projects who have installed it will receive a notification asking them to upgrade:

[(Image content)](https://www.datocms-assets.com/205/1637622931-screenshot-2021-11-23-at-00-15-17.png?auto=format&fit=max&w=2000)

Make sure in the new versions to [handle legacy configuration options properly](event-hooks.md)!

### A word about external JS/CSS files required by the iframe

If your plugin is called `datocms-plugin-foobar` and the entry point specified in the `package.json` is `build/index.html`, the URL that will be loaded as an iframe will be:

```plaintext
https://plugins-cdn.datocms.com/datocms-plugin-tag-editor@0.1.2/build/index.html
```

This means that if the page requires a JS file with an absolute path like `/js/bundle.js` then it won't work, as the final URL will be `https://plugins-cdn.datocms.com/js/bundle.js`, which will be non-existent.

In general, make sure that any external resource you require is expressed as a relative path to the HTML page!

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