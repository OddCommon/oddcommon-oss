# Dropdown

# Basic example

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Dropdown
    renderTrigger={({ open, onClick }) => (
      <Button
        onClick={onClick}
        rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
      >
        Options
      </Button>
    )}
  >
    <DropdownMenu>
      <DropdownOption onClick={() => {}}>Edit</DropdownOption>
      <DropdownOption disabled onClick={() => {}}>
        Duplicate
      </DropdownOption>
      <DropdownSeparator />
      <DropdownOption red onClick={() => {}}>
        Delete
      </DropdownOption>
    </DropdownMenu>
  </Dropdown>
</Canvas>
```

# Option actions

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Dropdown
    renderTrigger={({ open, onClick }) => (
      <Button
        onClick={onClick}
        rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
      >
        Fields
      </Button>
    )}
  >
    <DropdownMenu>
      <DropdownOption>
        First option
        <DropdownOptionAction icon={<PlusIcon />} onClick={() => {}} />
        <DropdownOptionAction
          red
          icon={<TrashIcon />}
          onClick={() => {}}
        />
      </DropdownOption>
      <DropdownOption>
        Second option
        <DropdownOptionAction icon={<PlusIcon />} onClick={() => {}} />
        <DropdownOptionAction
          red
          icon={<TrashIcon />}
          onClick={() => {}}
        />
      </DropdownOption>
    </DropdownMenu>
  </Dropdown>
</Canvas>
```

# Option groups

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Dropdown
    renderTrigger={({ open, onClick }) => (
      <Button
        onClick={onClick}
        rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
      >
        Fields
      </Button>
    )}
  >
    <DropdownMenu>
      <DropdownGroup name="Group 1">
        <DropdownOption>Foo</DropdownOption>
        <DropdownOption>Bar</DropdownOption>
        <DropdownOption>Qux</DropdownOption>
      </DropdownGroup>
      <DropdownGroup name="Group 2">
        <DropdownOption>Foo</DropdownOption>
        <DropdownOption>Bar</DropdownOption>
        <DropdownOption>Qux</DropdownOption>
      </DropdownGroup>
      <DropdownGroup name="Group 3">
        <DropdownOption>Foo</DropdownOption>
        <DropdownOption>Bar</DropdownOption>
        <DropdownOption>Qux</DropdownOption>
      </DropdownGroup>
    </DropdownMenu>
  </Dropdown>
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