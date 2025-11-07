# Structured Text customizations

[Structured Text](https://www.datocms.com/docs/structured-text/dast.md) is a consciously simple format, with a very small number of possible nodes — only the ones that are really helpful to capture the semantics of a standard piece of content, and with zero possibility to introduce styling and break the decoupling of content from presentation.

This is generally a very good thing, as it makes working on the frontend extremely simple and predictable: unlike HTML or Markdown, you don't have to be defensive and worry about some complex nesting of tags that you'd never think it could be possible, or unwanted styles coming from the editors.

There are, however, situations where it is critical to be able to **add a small, controlled set of styles to your content, to represent nuances of different semantics** within a piece of content.

### Adding custom styles to nodes

Let's take this article as an example:

[(Image content)](https://www.datocms-assets.com/205/1643205815-screenshot-2022-01-26-at-15-03-25.png?auto=format&fit=max&w=2000)

The third paragraph is conceptually similar to the others, but it's obviously more important, and we want the reader to pay more attention to what it says.

In these cases, we can use plugins to specify alternative styles for paragraph and heading nodes using the `customBlockStylesForStructuredTextField` hook:

```tsx
import { connect, Field, FieldIntentCtx } from 'datocms-plugin-sdk';

connect({
  customBlockStylesForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
    return [
      {
        id: 'emphasized',
        node: 'paragraph',
        label: 'Emphasized',
        appliedStyle: {
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: '1.4em',
          lineHeight: '1.2',
        }
      }
    ];
  },
});
```

The code above will add a custom `"emphasized"` style for `paragraph` nodes to every Structured Text field in the project. The `appliedStyle` property lets you customize how the style will be rendered inside of DatoCMS, when the user selects it:

(Video content)

You can also use the first argument of the hook (`field`) to only allow custom styles in some specific Structured Text fields. If that's the case, you'll probably want to [add some settings to the plugin](config-screen.md) to let the final user decide which they are:

```tsx
customBlockStylesForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
  const { fieldsInWhichAllowCustomStyles } = ctx.plugin.attributes.parameters;

  if (!fieldsInWhichAllowCustomStyles.includes[field.attributes.api_key)) {
    // No custom styles!
    return [];
  }

  return [
    {
      id: 'emphasized',
      node: 'paragraph',
      // ...
    },
  ];
}
```

The final Structured Text value will have the custom style applied in the `style` property:

```json
{
  "type": "root",
  "children": [
    {
      "type": "paragraph",
      "style": "emphasized",
      "children": [
        {
          "type": "span",
          "value": "Hello!"
        }
      ]
    }
  ]
}
```

### Adding custom marks

The default Structured Text editor already supports a number of [different marks](https://www.datocms.com/docs/structured-text/dast.md#span) (`strong`, `code`, `underline`, `highlight`, etc.), but you might want to annotate parts of the text using custom marks.

An example would be adding a "spoiler" mark, to signal a portion of text that we don't want to show the visitor unless they explicitly accept a spoiler alert.

The `customMarksForStructuredTextField` hook lets you do exactly that:

```tsx
import { connect, Field, FieldIntentCtx } from 'datocms-plugin-sdk';

connect({
  customMarksForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
    return [
      {
        id: 'spoiler',
        label: 'Spoiler',
        icon: 'bomb',
        keyboardShortcut: 'mod+shift+l',
        appliedStyle: {
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },
      },
    ];
  },
});
```

The code above will add a custom `"spoiler"` mark to every Structured Text field in the project. The `appliedStyle` property lets you customize how the style will be rendered inside of DatoCMS, when the user selects it:

(Video content)

The final result on the Structured Text value will be the following:

```json
{
  "type": "root",
  "children": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "span",
          "value": "In the "
        },
        {
          "type": "span",
          "marks": ["spoiler"],
          "value": "final killing scene"
        },
        {
          "type": "span",
          "value": ", the director really outdid himself."
        }
      ]
    }
  ]
}
```

> [!WARNING] You're in charge of the frontend!
> All of our Structured Text management libraries (React, Vue, etc.) allow you to specify custom rendering rules. When working with custom styles and marks, it's up to your frontend to decide how to render them!

#### `customBlockStylesForStructuredTextField(field: Field, ctx)`

Use this function to define a number of custom block styles for a specific Structured Text field.

##### Return value

The function must return: `StructuredTextCustomBlockStyle[] | undefined`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.itemType: ItemType</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/customBlockStylesForStructuredTextField.ts#L29)

</details>

</details>

#### `customMarksForStructuredTextField(field: Field, ctx)`

Use this function to define a number of custom marks for a specific Structured Text field.

##### Return value

The function must return: `StructuredTextCustomMark[] | undefined`.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.itemType: ItemType</summary>

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/customMarksForStructuredTextField.ts#L30)

</details>

</details>

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