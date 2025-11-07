# Manual field extensions

> [!WARNING]
> In the [previous chapter](field-extensions.md):
> 
> -   we saw the different types of field extensions we can create ([editors](field-extensions.md#field-editor-extensions) and [addons](field-extensions.md#field-addon-field-extensions));
>     
> -   we've seen how we can programmatically associate a particular extension to one (or multiple) fields;
>     
> -   we used the [`renderFieldExtension`](field-extensions.md#rendering-the-field-extension) hook to actually render our extensions.
>     
> 
> If you haven't read the chapter, we encourage you to do it, as we're going to build up on the same examples!

### Manual field extensions vs `overrideFieldExtensions`

So far, we have used the [`overrideFieldExtensions`](field-extensions.md#how-to-hook-field-extensions-to-a-field) hook to programmatically apply our extensions to fields. There is an alternative way of working with field extensions that passes through a second hook that you can implement, namely [`manualFieldExtensions`](manual-field-extensions.md#manualFieldExtensions):

```typescript
import { connect, Field, ManualFieldExtensionsCtx, OverrideFieldExtensionsCtx } from 'datocms-plugin-sdk';

connect({
  manualFieldExtensions(ctx: ManualFieldExtensionsCtx) {
    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
      },
    ];
  },
  overrideFieldExtensions(field: Field, ctx: OverrideFieldExtensionsCtx) {
    if (field.attributes.field_type === 'text') {
      return {
        addons: [{ id: 'loremIpsumGenerator' }],
      };
    }
  },
});
```

With this setup, we are still automatically applying our "Lorem ipsum" generator to every text field in our project, but the "Star rating" is becoming a manual extension. That is, **it's the end-user that will have to manually apply** it on one or more fields of type "integer" through the "Presentation" tab in the field settings:

(Video content)

### When to use one strategy or the other?

At this point a question may arise... when does it make sense to force an extension with `overrideFieldExtensions` and when to let the user install it manually? Well, it all depends on the type of extension you're developing, and what you imagine to be the most comfortable and natural way to offer its functionality!

Let's try to think about the extensions we have developed so far, and see what would be the best strategy for them:

-   Given that the "Star rating" extension will most likely be used in a few specific spots, rather than in all integer fields of the project, letting the user manually apply it when needed feels like the best choice.
    
-   On the other hand, our "Lorem Ipsum generator" is probably convenient in all text fields: requiring the end user to manually install it everywhere could be unnecessarily tedious, so the choice to programmatically force the addon on all text fields is probably the right one.
    

If we feel that a carpet-bombing strategy for the "Lorem ipsum" extension might bee too much, and we wanted to make the installation more granular but still automatic, we could add some [global settings](config-screen.md) to the plugin to allow the user to configure some application rules (ie. "only add the addon if the API key of the text field ends with `_main_content`"):

```typescript
overrideFieldExtensions(field: Field, ctx: OverrideFieldExtensionsCtx) {
  // get the suffix from plugin configuration settings
  const { loremIpsumApiKeySuffix } = ctx.plugin.attributes.parameters;

  if (
    field.attributes.field_type === 'text' &&
    field.attributes.api_key.endsWith(loremIpsumApiKeySuffix)
  ) {
    return {
      addons: [
        { id: 'loremIpsumGenerator' },
      ],
    };
  }
}
```

If you can't make up your mind on the best strategy for your field extension, there's always a third option: let the end user be in charge of the decision! Plugin settings are always available in every hook, so you can read the user preference and act accordingly:

```typescript
import { connect, Field, ManualFieldExtensionsCtx, OverrideFieldExtensionsCtx } from 'datocms-plugin-sdk';

connect({
  manualFieldExtensions(ctx: ManualFieldExtensionsCtx) {
    const { autoApply } = ctx.plugin.attributes.parameters;

    if (autoApply) {
      return [];
    }

    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
      },
      {
        id: 'loremIpsumGenerator',
        name: 'Lorem Ipsum generator',
        type: 'addon',
        fieldTypes: ['text'],
      },
    ];
  },
  overrideFieldExtensions(field: Field, ctx: OverrideFieldExtensionsCtx) {
    const { autoApply } = ctx.plugin.attributes.parameters;

    if (!autoApply) {
      return;
    }

    if (field.attributes.field_type === 'text') {
      return {
        addons: [{ id: 'loremIpsumGenerator' }],
      };
    }

    if (
      field.attributes.field_type === 'integer' &&
      field.attributes.api_key === 'rating'
    ) {
      return {
        editor: { id: 'starRating' },
      };
    }
  },
});
```

### Add per-field config screens to manual field extensions

(Image content)

In the `manualFieldExtensions()` hook, we can pass the `configurable: true` option to declare that we want to present a config screen to the user when they're installing the extension on a field:

```typescript
import { connect, Field, ManualFieldExtensionsCtx } from 'datocms-plugin-sdk';

connect({
  manualFieldExtensions(ctx: ManualFieldExtensionsCtx) {
    return [
      {
        id: 'starRating',
        name: 'Star rating',
        type: 'editor',
        fieldTypes: ['integer'],
        configurable: true,
      },
    ];
  },
});
```

To continue our example, let's take our "Star rating" editor and say we want to offer end-users the ability, on a per-field basis, to specify the maximum number of stars that can be selected and the color of the stars.

Just like global plugin settings, these per-field configuration parameters are **completely arbitrary**, so it is up to the plugin itself to show the user a form through which they can be changed.

> [!WARNING] Don't use form management libraries!
> Unlike the global config screen, where we manage the form ourselves, here **we are "guests" inside the field edit form**. That is, the submit button in the modal triggers the saving not only of our settings, but also of all the other field configurations, which we do not control.
> 
> The SDK, in this location, provides a set of very simple primitives to integrate with the form managed by the DatoCMS application, including validations. The use of React form management libraries is not suitable in this hook, as most of them are designed to "control" the form.

The hook provided to render the config screen is [`renderManualFieldExtensionConfigScreen`](manual-field-extensions.md#renderManualFieldExtensionConfigScreen), and it will be called by DatoCMS when the user adds the extension on a particular field.

Inside the hook we simply initialize React and a custom component called `StarRatingConfigScreen`. The argument `ctx` provides a series of information and methods for interacting with the main application, and for now all we just pass the whole object to the component, in the form of a React prop:

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
  RenderManualFieldExtensionConfigScreenCtx,
} from 'datocms-plugin-sdk';

connect({
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <StarRatingConfigScreen ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
});
```

This is how our full component looks like:

```typescript
import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Form, TextField } from 'datocms-react-ui';
import { CSSProperties, useCallback, useState } from 'react';

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

// this is how we want to save our settings
type Parameters = {
  maxRating: number;
  starsColor: NonNullable<CSSProperties['color']>;
};

function StarRatingConfigScreen({ ctx }: PropTypes) {
  const [formValues, setFormValues] = useState<Partial<Parameters>>(
    ctx.parameters,
  );

  const update = useCallback((field, value) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
  }, [formValues, setFormValues, ctx.setParameters]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        <TextField
          id="maxRating"
          name="maxRating"
          label="Maximum rating"
          required
          value={formValues.maxRating}
          onChange={update.bind(null, 'maxRating')}
        />
        <TextField
          id="starsColor"
          name="starsColor"
          label="Stars color"
          required
          value={formValues.starsColor}
          onChange={update.bind(null, 'starsColor')}
        />
      </Form>
    </Canvas>
  );
}
```

Here's how it works:

-   we use `ctx.parameters` as the initial value for our internal state `formValues`;
    
-   as the user changes values for the inputs, we're use `ctx.setParameters()` to propagate the change to the main DatoCMS application (as well as updating our internal state).
    

> [!WARNING] Always use the canvas!
> It is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

### Enforcing validations on configuration options

Users might insert invalid values for the options we present. We can implement another hook called [`validateManualFieldExtensionParameters`](manual-field-extensions.md#validateManualFieldExtensionParameters) to enforce some validations on them:

```typescript
const isValidCSSColor = (strColor: string) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
};

connect({
  validateManualFieldExtensionParameters(
    fieldExtensionId: string,
    parameters: Record<string, any>,
  ) {
    const errors: Record<string, string> = {};

    if (
      isNaN(parseInt(parameters.maxRating)) ||
      parameters.maxRating < 2 ||
      parameters.maxRating > 10
    ) {
      errors.maxRating = 'Rating must be between 2 and 10!';
    }

    if (!parameters.starsColor || !isValidCSSColor(parameters.starsColor)) {
      errors.starsColor = 'Invalid CSS color!';
    }

    return errors;
  },
});
```

Inside our component, we can access those errors and present them below the input fields:

```typescript
function StarRatingParametersForm({ ctx }: PropTypes) {
  const errors = ctx.errors as Partial<Record<string, string>>;

  // ...

  return (
    <Canvas ctx={ctx}>
      <TextField
          id="maxRating"
          /* ... */
          error={errors.maxRating}
        />
        <TextField
          id="starsColor"
          /* ... */
          error={errors.starsColor}
        />
    </Canvas>
  );
}
```

This is the final result:

(Video content)

Now that we have some settings, we can access them in the `renderFieldExtension` hook through the `ctx.parameters` object, and use them to configure the star rating component:

```typescript
import ReactStars from 'react-rating-stars-component';

function StarRatingEditor({ ctx }: PropTypes) {
  // ...

  return (
    <ReactStars
      /* ... */
      count={ctx.parameters.maxRating}
      activeColor={ctx.parameters.starsColor}
    />
  );
}
```

#### `manualFieldExtensions(ctx)`

Use this function to declare new field extensions that users will be able to install manually in some field.

##### Return value

The function must return: `ManualFieldExtension[]`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `validateManualFieldExtensionParameters(fieldExtensionId: string, parameters: Record<string, unknown>)`

This function will be called each time the configuration object changes. It must return an object containing possible validation errors.

##### Return value

The function must return: `Record<string, unknown> | Promise<Record<string, unknown>>`.

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