# Config screen

Quite often, a plugin needs to offer a set of configuration options to the user who installs it.

DatoCMS offers every plugin a configuration screen and a **read-write object that can be used to store such settings**. It is a free-form object, with no restrictions in the format. Plugins can store what they want in it, and retrieve its value anytime they need in any hook.

As the configuration parameters are completely arbitrary, **it is up to the plugin itself to show the user a form** through which they can be changed.

The hook provided for this purpose is called [`renderConfigScreen`](config-screen.md#renderConfigScreen), and it will be called by DatoCMS when the user visits the details page of the installed plugin:

(Image content)

#### Implementing a simple configuration form

To give a very simple example, let's say our plugin wants to provide the end user with a simple boolean flag called `debugMode`. If this flag is enabled, then the plugin will display a series of debug messages in the console as it works.

The first step is to implement the [`renderConfigScreen`](config-screen.md#renderConfigScreen) hook, which will simply initialize React by rendering a custom component called `ConfigScreen`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, RenderConfigScreenCtx } from 'datocms-plugin-sdk';

connect({
  renderConfigScreen(ctx: RenderConfigScreenCtx) {
    ReactDOM.render(
      <React.StrictMode>
        <ConfigScreen ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

The hook, in its `ctx` argument, provides a series of information and methods for interacting with the main application, and for now we'll just pass the whole object to the component, in the form of a React prop:

```tsx
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

function ConfigScreen({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Hello from the config screen!
    </Canvas>
  );
}
```

> [!WARNING] Always use the canvas!
> It is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

It is now time to setup our form:

```tsx
import { Canvas, SwitchField } from 'datocms-react-ui';

// configuration object starts as an empty object
type FreshInstallationParameters = {};

// this is how we want to save our settings
type ValidParameters = { devMode: boolean };

// parameters can be either empty or filled in
type Parameters = FreshInstallationParameters | ValidParameters;

export default function ConfigScreen({ ctx }: PropTypes) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;

  return (
    <Canvas ctx={ctx}>
      <SwitchField
        id="01"
        name="development"
        label="Enable development mode?"
        hint="Log debug information in console"
        value={parameters.devMode}
        onChange={(newValue) => {
          ctx.updatePluginParameters({ devMode: newValue });
          ctx.notice('Settings updated successfully!');
        }}
      />
    </Canvas>
  );
}
```

The important things to notice are that:

-   we can access the currently saved configuration object through `ctx.plugin.attributes.parameters`
    
-   we can call `ctx.updatePluginParameters()` to save a new configuration object.
    

Once saved, settings are always available as `ctx.plugin.attributes.parameters` in any of the other hooks, so that your plugin can have different behaviours based on them.

### Using a form management library

If you have more complex settings, feel free to use one of the many form management libraries available for React to avoid code repetition.

We recommend [react-final-form](https://github.com/final-form/react-final-form), as it works well and is quite lightweight (~8kb). Here's a more complete example using it:

```tsx
import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import {
  Button,
  Canvas,
  SwitchField,
  TextField,
  Form,
  FieldGroup,
} from 'datocms-react-ui';
import { Form as FormHandler, Field } from 'react-final-form';

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

type FirstInstallationParameters = {};
type ValidParameters = { devMode: boolean; title: string };
type Parameters = FirstInstallationParameters | ValidParameters;

export default function ConfigScreen({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <FormHandler<Parameters>
        initialValues={ctx.plugin.attributes.parameters}
        validate={(values) => {
          const errors: Record<string, string> = {};

          if (!values.title) {
            errors.title = 'This field is required!';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          await ctx.updatePluginParameters(values);
          ctx.notice('Settings updated successfully!');
        }}
      >
        {({ handleSubmit, submitting, dirty }) => (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field name="title">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="title"
                    label="Title"
                    hint="Title to show"
                    placeholder="Your title"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
              <Field name="devMode">
                {({ input, meta: { error } }) => (
                  <SwitchField
                    id="devMode"
                    label="Enable development mode?"
                    hint="Log debug information in console"
                    error={error}
                    {...input}
                  />
                )}
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={submitting || !dirty}
            >
              Save settings
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}
```

This will be the final result:

[(Image content)](https://www.datocms-assets.com/205/1637611456-screenshot-2021-11-22-at-20-59-25.png?auto=format&fit=max&w=2000)

#### `renderConfigScreen(ctx)`

This function will be called when the plugin needs to render the plugin's configuration form.

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