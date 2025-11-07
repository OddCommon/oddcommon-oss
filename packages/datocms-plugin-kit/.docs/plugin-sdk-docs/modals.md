# Opening modals

Within all the `renderXXX` hooks — that is, those that have the task of presenting a custom interface part to the user — it is possible to open custom modal dialogs to "get out" of the reduced space that the `iframe` provides, and get more room to build more complex interfaces.

Suppose our plugin implements a [custom page](custom-pages.md) accessible from the top navigation bar:

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, MainNavigationTabsCtx, RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

function render(component: React.ReactNode) {
  ReactDOM.render(
    <React.StrictMode>{component}</React.StrictMode>,
    document.getElementById('root'),
  );
}

connect({
  mainNavigationTabs(ctx: MainNavigationTabsCtx) {
    return [
      {
        label: 'Welcome',
        icon: 'igloo',
        pointsTo: {
          pageId: 'welcome',
        },
      },
    ];
  },
  renderPage(pageId, ctx: RenderPageCtx) {
    switch (pageId) {
      case 'welcome':
        return render(<WelcomePage ctx={ctx} />);
    }
  },
});

type PropTypes = {
  ctx: RenderPageCtx;
};

function WelcomePage({ ctx }: PropTypes) {
  return <Canvas ctx={ctx}>Hi!</Canvas>;
}
```

Within the `ctx` argument you can find the function `openModal()`, which triggers the opening of a modal:

```typescript
import { Canvas, Button } from 'datocms-react-ui';

function WelcomePage({ ctx }: PropTypes) {
  const handleOpenModal = async () => {
    const result = await ctx.openModal({
      id: 'customModal',
      title: 'Custom title!',
      width: 'l',
      parameters: { name: 'Mark' },
    });
    ctx.notice(result);
  };

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={handleOpenModal}>
        Open modal!
      </Button>
    </Canvas>
  );
}
```

The `openModal()` function offers various rendering options, for example you can set its size and title. Interestingly, the function returns a promise, which will be resolved when the modal is closed by the user.

You can specify what to render inside the modal by implementing a new hook called [`renderModal`](modals.md#renderModal) which, similarly to what we did with custom pages, initializes React with a custom component:

```typescript
connect({
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case 'customModal':
        return render(<CustomModal ctx={ctx} />);
    }
  },
});
```

You are free to fill the modal with the information you want, and you can access the parameters specified when opening the modal through `ctx.parameters`:

```typescript
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderModalCtx;
};

function CustomModal({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <div style={{ fontSize: 'var(--font-size-xxxl)', fontWeight: '500' }}>
        Hello {ctx.parameters.name}!
      </div>
    </Canvas>
  );
}
```

As with any other hook, it is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

### Closing the modal

If the modal will be closed through the close button provided by the interface, the promise `openModal()` will be resolved with value `null`.

You can also decide not to show a "close" button:

```typescript
const result = await sdk.openModal({
  id: 'customModal',
  // ...
  closeDisabled: true,
});
```

In this case the user will only be able to close the modal via an interaction of your choice (custom buttons, for example):

```typescript
import { Canvas, Button } from 'datocms-react-ui';

function CustomModal({ ctx }: PropTypes) {
  const handleClose = (returnValue: string) => {
    ctx.resolve(returnValue);
  };

  return (
    <Canvas ctx={ctx}>
      Hello {ctx.parameters.name}!
      <Button type="button" onClick={handleClose.bind(null, 'a')}>Close A</Button>
      <Button type="button" onClick={handleClose.bind(null, 'b')}>Close B</Button>
    </Canvas>;
}
```

The `ctx.resolve()` function will close the modal, and resolve the original `openModal()` promise with the value you passed.

#### `renderModal(modalId: string, ctx)`

This function will be called when the plugin requested to open a modal (see the `openModal` hook).

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.modalId: string</summary>

The ID of the modal that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderModal.ts#L17)

</details>

<details>
<summary>ctx.parameters: Record<string, unknown></summary>

The arbitrary `parameters` of the modal declared in the `openModal` function.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderModal.ts#L22)

</details>

<details>
<summary>ctx.resolve(returnValue: unknown) => Promise<void></summary>

A function to be called by the plugin to close the modal. The `openModal` call will be resolved with the passed return value.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderModal.ts#L40)

```ts
const returnValue = prompt(
  'Please specify the value to return to the caller:',
  'success',
);

await ctx.resolve(returnValue);
```

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