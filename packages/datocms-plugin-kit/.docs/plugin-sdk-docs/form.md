# Form

The `Form` component should wrap `FieldGroup` components to apply consistent layouts. All the fields are controlled inputs, so you need to provide both `value` and `onChange` props to make it work.

The `onChange` prop of all field components always returns the new value as first parameter, so you don't need to inspect the `event` object to get it.

# Full example

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Form onSubmit={() => console.log('onSubmit')}>
    <FieldGroup>
      <TextField
        required
        name="name"
        id="name"
        label="Name"
        value="Mark Smith"
        placeholder="Enter full name"
        hint="Provide a full name"
        onChange={(newValue) => console.log(newValue)}
      />
      <TextField
        required
        name="email"
        id="email"
        label="Email"
        type="email"
        value=""
        placeholder="your@email.com"
        error="Please enter an email!"
        hint="Enter email address"
        onChange={(newValue) => console.log(newValue)}
      />
      <TextField
        required
        name="apiToken"
        id="apiToken"
        label="API Token"
        value="XXXYYY123"
        hint="Enter a valid API token"
        textInputProps={{ monospaced: true }}
        onChange={(newValue) => console.log(newValue)}
      />
      <TextareaField
        required
        name="longText"
        id="longText"
        label="Long text"
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit.."
        hint="Enter some text"
        onChange={(newValue) => console.log(newValue)}
      />
      <SelectField
        name="option"
        id="option"
        label="Option"
        hint="Select one of the options"
        value={{ label: 'Option 1', value: 'option1' }}
        selectInputProps={{
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ],
        }}
        onChange={(newValue) => console.log(newValue)}
      />
      <SelectField
        name="multipleOption"
        id="multipleOption"
        label="Multiple options"
        hint="Select one of the options"
        value={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        selectInputProps={{
          isMulti: true,
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ],
        }}
        onChange={(newValue) => console.log(newValue)}
      />
      <SwitchField
        name="debugMode"
        id="debugMode"
        label="Debug mode active?"
        hint="Logs messages to console"
        value={true}
        onChange={(newValue) => console.log(newValue)}
      />
    </FieldGroup>
    <FieldGroup>
      <Button fullWidth buttonType="primary">
        Submit
      </Button>
    </FieldGroup>
  </Form>
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