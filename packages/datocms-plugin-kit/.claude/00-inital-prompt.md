We are trying to build a small library to make writing plugins for datocms a little easier and manageable.

Dato's interface renders plugins via a remote webapp that runs in an iframe. The CMS communicates with the webapp via an interface initialized by the sdk's `connect` function, on the webapp.
The plugin SDK exposes a `connect` function. It takes a configuration object that describe each "hooks" the consumer can use to interact with the cms interface.

The goal is to build a library that helps organize the code needed to "build" this configuration, so users do not have to manually write a giant object with everything all logic of the plugin in one place.

The API of the library we are building should look something like this:
(this is a general concept, not a final API, we will brainstorm the final API)

-> file: ~/connect.ts

```
import { config } from "@oddcommon/dato-plugin-connect";

// create and export a set of functions that allows to add hooks
export config({
    render: ...
});
```

-> file: some-outlet.tsx

```
// import the created function to add hooks, here for a formOutlet
import { addFormOutlet } from '~/connect';

// this adds conditions in the `itemFormOutlets` and `renderItemFormOutlet` hooks
addFormOutlet(({
    id: 'my-outlet-id',
    component: MyFormOutlet,
    initialHeight: 0, // Start hidden, will auto-resize if we render content
    shouldApply: (model, ctx) => {
      const allFields = Object.entries(ctx.fields).map(([_, shell]) => shell?.attributes.api_key);
      return allFields.includes('event_id') && allFields.includes('event_data');
    },
})
```

-> file ~/pages/somepage.tsx

```
import { addMainNavigationTab, addPage } from '~/connect';

const pageId = 'MyPageId';

addPage((ctx) => ({
    pageId,
    component: MyPageComponent,
}))

addMainNavigationTab((ctx) => ({
    label: 'My Page',
    icon: 'ticket',
    placement: ['before', 'media'],
    pointsTo: { pageId },
}))
```

-> file ~/main.ts

```
// we import the connect function
import { connect } from '~/connect';

// if will build the config object and pass it to dato's sdk `connect` function.
connect();
```

Rendering components needs to be configurable (this is why the api needs to start with a function that creates the others, so they are aware of the user configurations).
This library will work with react only, the consumer should be able to provider their own render function.
Render should be the only configurable thing at first, we will define if other configuration are needed during the brainstorm.
render should have a default:

```
let defaultRender: null | (component: React.ReactNode) => void = null;
function getDefaultRender() {
    if(defaultRender === null) {
        const container = document.getElementById('root');
        const root = createRoot(container!);

        defaultRender = (component: React.ReactNode): void {
            root.render(<StrictMode>{component}</StrictMode>);
        }
    }
    return defaultRender;
}
```

What I need you to do before we start brainstorming:

- Explore the (installed) 'datocms-plugin-sdk' npm package to lookup the type definitions for the configuration that is passed to `connect`. It will give you the actual full set of hooks available.
- Read the official plugin sdk documentation provided by DatoCMS. I downloaded it and created a local mirror, in markdown format, in the @packages/datocms-sdk-connect/.docs/plugin-sdk-docs folder for you to read. The top page is @packages/datocms-sdk-connect/.docs/plugin-sdk-docs/index.md`
  But for now, I need you to only focus on the following pages:

- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/what-hooks-are.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/config-screen.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/custom-pages.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/sidebar-panels.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/form-outlets.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/field-extensions.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/manual-field-extensions.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/dropdown-actions.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/structured-text-customizations.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/asset-sources.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/modals.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/event-hooks.md
- packages/datocms-sdk-connect/.docs/plugin-sdk-docs/customize-presentation.md

Once you did these two things, We will brainstorm and defined a plan together.

Few additional notes:

- this library is a package part of a turborepo monorepo
- it should be located in @packages/datocms-sdk-connect, it will be our working directory
