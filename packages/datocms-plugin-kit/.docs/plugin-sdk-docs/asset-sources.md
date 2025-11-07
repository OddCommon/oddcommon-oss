# Asset sources

By default, to add new assets to the Media Area through the interface, you can upload files from your computer. But plugins can define custom asset sources to allow contributors to upload assets from external providers.

For example, the Unsplash plugin in our Marketplace allows to upload royalty-free high-resolution images:

(Video content)

## Define custom asset sources

Within a plugin you can define the [`assetSources`](asset-sources.md#assetSources) hook to expose new asset sources. Every source must specify an internal ID, and a name and a representative icon that will be shown in the interface.

```typescript
import { connect } from 'datocms-plugin-sdk';

connect({
  assetSources() {
    return [
      {
        id: 'unsplash',
        name: 'Unsplash',
        icon: {
          type: 'svg',
          viewBox: '0 0 448 512',
          content:
            '<path fill="currentColor" d="M448,230.17V480H0V230.17H141.13V355.09H306.87V230.17ZM306.87,32H141.13V156.91H306.87Z" class=""></path>',
        },
        modal: {
          width: 'm',
        },
      },
    ];
  },
});
```

## Rendering the custom asset source

When the user selects the custom source, a modal will be opened with the size you specified, and the [`renderAssetSource`](asset-sources.md#renderAssetSource) hook will be called. Inside of this hook we initialize React and render a custom component called `AssetBrowser`, passing down as a prop the second `ctx` argument, which provides a series of information and methods for interacting with the main application:

```typescript
import { connect } from 'datocms-plugin-sdk';

connect({
  assetSources() {
    return [{...}];
  },
  renderAssetSource(sourceId: string, ctx: RenderAssetSourceCtx) {
    render(<AssetBrowser ctx={ctx} />);
  },
});
```

As we just saw, a plugin might offer different asset sources, so we can use the `sourceId` argument to know which one we are requested to render, and write a specific React component for each of them.

```typescript
import { Canvas, RenderAssetSourceCtx } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderAssetSourceCtx;
};

function AssetBrowser({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      Hello from the sidebar!
    </Canvas>
  );
}
```

> [!WARNING] Always use the canvas!
> It is important to wrap the content inside the `Canvas` component, so that the iframe will continuously auto-adjust its size based on the content we're rendering, and to give our app the look and feel of the DatoCMS web app.

We can use this component to render whatever we want. The important thing is to call the `ctx.select` method to communicate to the main DatoCMS app the selected asset URL:

```typescript
import { ButtonLink } from 'datocms-react-ui';

function AssetBrowser({ ctx }: PropTypes) {
  const handleSelect = () => {
    ctx.select({
      resource: {
        url: 'https://unsplash.com/photos/yf8qPXQFDJE',
        filename: `sky.jpg`,
      },
    });
  }

  return (
    <Canvas ctx={ctx}>
      <Button onClick={handleSelect}>Select</Button>
    </Canvas>
  );
}
```

If you're generating your asset on the fly (ie. by rendering on a canvas), instead of a regular URL you can also pass a base64-encoded data URI:

```typescript
ctx.select({
  resource: {
    base64: 'data:image/png;base64,PD94bWwgd..',
    filename: `generated-image.png`,
  },
});
```

You can also optionally specify some metadata to associate with the newly created upload:

```typescript
ctx.select({
  resource: {
    url:
      'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',
    filename: 'man-drinking-coffee.jpg',
  },
  copyright: 'Royalty free (Unsplash)',
  author: 'Jeff Sheldon',
  notes: 'A man drinking a coffee',
  tags: ['man', 'coffee'],
});
```

#### `assetSources(ctx)`

Use this function to declare additional sources to be shown when users want to upload new assets.

##### Return value

The function must return: `AssetSource[] | undefined`.

##### Context object

The following properties and methods are available in the `ctx` argument:

#### `renderAssetSource(assetSourceId: string, ctx)`

This function will be called when the user selects one of the plugin's asset sources to upload a new media file.

##### Context object

The following properties and methods are available in the `ctx` argument:

<details>
<summary>Hook-specific properties and methods</summary>

This hook exposes additional information and operations specific to the context in which it operates.

<details>
<summary>ctx.assetSourceId: string</summary>

The ID of the assetSource that needs to be rendered.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderAssetSource.ts#L18)

</details>

<details>
<summary>ctx.select(newUpload: NewUpload) => void</summary>

Function to be called when the user selects the asset: it will trigger the creation of a new `Upload` that will be added in the Media Area.

[View on Github](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/src/hooks/renderAssetSource.ts#L40)

```ts
await ctx.select({
  resource: {
    url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f',
    filename: 'man-drinking-coffee.jpg',
  },
  copyright: 'Royalty free (Unsplash)',
  author: 'Jeff Sheldon',
  notes: 'A man drinking a coffee',
  tags: ['man', 'coffee'],
});
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