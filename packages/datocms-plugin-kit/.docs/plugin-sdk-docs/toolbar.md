# Toolbar

# Basic example

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Toolbar>
    <ToolbarStack stackSize="l">
      <ToolbarTitle>Media Area</ToolbarTitle>
    </ToolbarStack>
  </Toolbar>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--light-bg-color)',
      height: '150px',
    }}
  >
    Main content
  </div>
</Canvas>
```

# Buttons and actions

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Toolbar>
    <ToolbarButton>
      <BackIcon />
    </ToolbarButton>
    <ToolbarStack stackSize="l">
      <ToolbarTitle>Media Area</ToolbarTitle>
      <div style={{ flex: '1' }} />
      <Button buttonType="primary">Action</Button>
    </ToolbarStack>
    <ToolbarButton>
      <SidebarLeftArrowIcon />
    </ToolbarButton>
  </Toolbar>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--light-bg-color)',
      height: '150px',
    }}
  >
    Main content
  </div>
</Canvas>
```

# With button group

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Toolbar>
    <ToolbarStack stackSize="l">
      <ToolbarTitle>Media Area</ToolbarTitle>
      <div style={{ flex: '1' }} />
      <ButtonGroup>
        <ButtonGroupButton>First</ButtonGroupButton>
        <ButtonGroupButton selected>Second</ButtonGroupButton>
        <ButtonGroupButton>Third</ButtonGroupButton>
      </ButtonGroup>
    </ToolbarStack>
  </Toolbar>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--light-bg-color)',
      height: '150px',
    }}
  >
    Main content
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