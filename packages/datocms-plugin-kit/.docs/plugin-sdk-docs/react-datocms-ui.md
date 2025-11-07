# React UI Components

If you're using React to build your plugin, you can take advantage of the `datocms-react-ui` package to get a library of ready-to-use components that are consistent with the UI of the main DatoCMS application. Using this library, you can create a custom interface for your plugin in a very short time.

### Wrap everything in Canvas!

When using the package it is required to wrap the content of your components in a `Canvas` component to apply the styling, and import the `styles.css` stylesheet:

```jsx
import { Canvas } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css';

const MyComponent = ({ ctx }) => {
  return (
    <Canvas ctx={ctx}>
      Place your content here!
    </Canvas>
  );
}
```

The `Canvas` component needs the `ctx` object that is passed as an argument to all the hooks.

If you have a number of nested components below `MyComponent`, you don't need to pass the `ctx` around via props, as any component below `<Canvas>` can use the `useCtx` hook to retrieve it:

```jsx
import { Canvas, useCtx } from 'datocms-react-ui';

const MyComponent = ({ ctx }) => {
  return (
    <Canvas ctx={ctx}>
      <Inner />
    </Canvas>
  );
}

const Inner = () => {
  const ctx = useCtx();

  return (
    <div>Hi!</div>
  );
}
```

# Color palette CSS variables

Within the `Canvas` component, a color palette is made available as a set of CSS variables, allowing you to conform to the theme of the current environment:

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <Section title="Text colors">
    <table>
      <tbody>
        <tr>
          <td>
            <code>--base-body-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--base-body-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--light-body-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--light-body-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--placeholder-body-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--placeholder-body-color)',
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
  <Section title="UI colors">
    <table>
      <tbody>
        <tr>
          <td>
            <code>--light-bg-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--light-bg-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--lighter-bg-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--lighter-bg-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--disabled-bg-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--disabled-bg-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--border-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--border-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--darker-border-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--darker-border-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--alert-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--alert-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--warning-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--warning-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--notice-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--notice-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--warning-bg-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--warning-bg-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--add-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--add-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--remove-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--remove-color)',
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
  <Section title="Project-specific colors">
    <table>
      <tbody>
        <tr>
          <td>
            <code>--accent-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--accent-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--primary-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--primary-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--light-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--light-color)',
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>--dark-color</code>
          </td>
          <td width="30%">
            <div
              style={{
                width: '30px',
                height: '30px',
                background: 'var(--dark-color)',
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</Canvas>
```

# Typography CSS variables

Typography is a foundational element in UI design. Good typography establishes a strong, cohesive visual hierarchy and presents content clearly and efficiently to users. Within the `Canvas` component, a set of CSS variables is available allowing your plugin to conform to the overall look&feel of DatoCMS:

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <table>
    <tbody>
      <tr>
        <td>
          <code>--font-size-xxs</code>
        </td>
        <td>
          <div style={{ fontSize: 'var(--font-size-xxs)' }}>
            Size XXS
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-xs</code>
        </td>
        <td>
          <div style={{ fontSize: 'var(--font-size-xs)' }}>Size XS</div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-s</code>
        </td>
        <td>
          <div style={{ fontSize: 'var(--font-size-s)' }}>Size S</div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-m</code>
        </td>
        <td>
          <div style={{ fontSize: 'var(--font-size-m)' }}>Size M</div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-l</code>
        </td>
        <td>
          <div
            style={{
              fontSize: 'var(--font-size-l)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Size L
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-xl</code>
        </td>
        <td>
          <div
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Size XL
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-xxl</code>
        </td>
        <td>
          <div
            style={{
              fontSize: 'var(--font-size-xxl)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Size XXL
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <code>--font-size-xxxl</code>
        </td>
        <td>
          <div
            style={{
              fontSize: 'var(--font-size-xxxl)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Size XXXL
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</Canvas>
```

# Spacing CSS variables

The following CSS variables are available as well, to mimick the spacing between elements used by the main DatoCMS application. Negative spacing variables are available too (`--negative-spacing-<SIZE>`).

###### Preview

###### Code

```js
<Canvas ctx={ctx}>
  <table>
    <tbody>
      <tr>
        <td>
          <code>--spacing-s</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-s)',
              height: 'var(--spacing-s)',
            }}
          />
        </td>
      </tr>
      <tr>
        <td>
          <code>--spacing-m</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-m)',
              height: 'var(--spacing-m)',
            }}
          />
        </td>
      </tr>
      <tr>
        <td>
          <code>--spacing-l</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-l)',
              height: 'var(--spacing-l)',
            }}
          />
        </td>
      </tr>
      <tr>
        <td>
          <code>--spacing-xl</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-xl)',
              height: 'var(--spacing-xl)',
            }}
          />
        </td>
      </tr>
      <tr>
        <td>
          <code>--spacing-xxl</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-xxl)',
              height: 'var(--spacing-xxl)',
            }}
          />
        </td>
      </tr>
      <tr>
        <td>
          <code>--spacing-xxxl</code>
        </td>
        <td>
          <div
            style={{
              background: 'var(--accent-color)',
              width: 'var(--spacing-xxxl)',
              height: 'var(--spacing-xxxl)',
            }}
          />
        </td>
      </tr>
    </tbody>
  </table>
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