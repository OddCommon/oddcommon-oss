# Button

Buttons communicate the action that will occur when the user clicks them. They communicate calls to action to the user and allow users to interact with pages in a variety of ways. They contain a text label to describe the action, and an icon if appropriate.

Available variations:

-   **Primary**: used for the most important actions in any scenario. Don’t use more than one primary button in a section or screen to avoid overwhelming users
    
-   **Muted**: used for a secondary actions, the most commonly used button type
    
-   **Negative**: for destructive actions - when something can't be undone. For example, deleting entities
    

# Button types

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <div style={{ marginBottom: 'var(--spacing-m)' }}>
    <Button buttonType="muted">Submit</Button>{' '}
    <Button buttonType="primary">Submit</Button>{' '}
    <Button buttonType="negative">Submit</Button>
  </div>
  <div>
    <Button buttonType="muted" disabled>
      Submit
    </Button>{' '}
    <Button buttonType="primary" disabled>
      Submit
    </Button>{' '}
    <Button buttonType="negative" disabled>
      Submit
    </Button>
  </div>
</Canvas>
```

# Full-width

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Button fullWidth>Submit</Button>
</Canvas>
```

# Sizing

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Button buttonSize="xxs">Submit</Button>{' '}
  <Button buttonSize="xs">Submit</Button>{' '}
  <Button buttonSize="s">Submit</Button>{' '}
  <Button buttonSize="m">Submit</Button>{' '}
  <Button buttonSize="l">Submit</Button>{' '}
  <Button buttonSize="xl">Submit</Button>{' '}
</Canvas>
```

# Icons

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <div style={{ marginBottom: 'var(--spacing-m)' }}>
    <Button leftIcon={<PlusIcon />}>Submit</Button>
  </div>
  <div style={{ marginBottom: 'var(--spacing-m)' }}>
    <Button rightIcon={<ChevronDownIcon />}>Options</Button>
  </div>
  <div>
    <Button leftIcon={<PlusIcon />} />
  </div>
</Canvas>
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