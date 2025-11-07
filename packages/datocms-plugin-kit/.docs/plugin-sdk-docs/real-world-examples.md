# Real-world examples

To understand how all the pieces fit together, many developers find useful to read the complete source code of an already published plugin.

Luckily, most of the plugins published in the [Marketplace](https://www.datocms.com/marketplace/plugins.md) are 100% open source: you can easily open their GitHub repository and inspect their code from the “Visit homepage” button present in their details page:

(Image content)

> [!WARNING] Be careful what you read!
> Be careful, because some of the plugins in the Marketplace may have been built using a legacy version of the SDK, **so they might not be a good example to follow!**
> 
> Always check in the `package.json` that they're requiring the `datocms-plugin-sdk` NPM package, and not the legacy one (which is called `datocms-plugins-sdk`, with `plugins` in plural form).

## Always up-to-date official plugins

We personally take care of keeping a number of plugins in the Marketplace up to date, so you can always be sure they run on the most up-to-date version of the SDK. It might be a good idea to start studying with one of them!

They are all stored in a single GitHub monorepo:

💻 **Official plugins monorepo:** [https://github.com/datocms/plugins](https://github.com/datocms/plugins)

If you'd like to have more examples, don't be afraid to ask, we are here to help you!

[

(Image content)

Intro to the Plugin Ecosystem

Play video »

](https://www.datocms.com/user-guides/the-basics/intro-to-the-plugin-ecosystem.md)

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