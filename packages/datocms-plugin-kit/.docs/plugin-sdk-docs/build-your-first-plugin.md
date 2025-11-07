# Build your first DatoCMS plugin

The demo plugin we're about to build is called **Record Metrics**. It will enhance your editorial experience when creating for instance a blog post by providing useful metrics such as word count and a reading time indicator. The metrics will be shown in a sidebar panel for a given record.

# Prerequisites

In order to successfully complete this tutorial:

-   You'll need the latest LTS version of [Node.js](https://nodejs.org/en/) installed on your machine. If you don't have `Node.js` installed, you can download it [here](https://nodejs.org/en/download/).
    
-   You should be comfortable using your computer’s command line and text editor.
    
-   You’ll need to be able to read and write HTML, CSS, and JavaScript.
    
-   You should be familiar with installing software using [NPM](https://www.npmjs.com/).
    
-   You'll need a free DatoCMS account and a project. You can sign up [here](https://dashboard.datocms.com/signup).
    
-   You'll need either Firefox or Chrome. Safari currently does not work due to a limitation in how it handles insecure iframes pointing to `localhost`.
    

# Tools

We will use several tools and libraries throughout the tutorial. We chose these technologies because we think they provide the best possible developer experience.

###### React

We use [React](https://reactjs.org/) to render our views for the app and handle our logic. React is a JavaScript library for building user interfaces. However, using React is not mandatory to create apps.

###### Plugin SDK

The Plugin SDK provides the methods that are necessary to interact with the DatoCMS web app. We will only use a subset of the methods, but if you want to know the full scope of what is possible, take a look at the other sections of this guide.

###### DatoCMS React UI

To achieve the same look and feel of the DatoCMS web app we use `datocms-react-ui` which exposes a number of React components ready to be used.

###### TypeScript

The plugin is written in TypeScript. This allows us to have documentation, autocompletion in our editor, as well as the assurance that we are passing the right parameters to our libraries. However, you do not need any TypeScript knowledge in order to complete this tutorial. Plugins can also be written in JavaScript without losing any of the functionality.

# Set up your project

As a first step, you need to scaffold the project. We will use a tool called [`tmplr`](https://github.com/loreanvictor/tmplr) to prepare a Vite-powered plugin template:

Terminal window

```bash
npx tmplr datocms/datocms-plugin-template --dir my-first-plugin
```

Follow the prompts, then navigate to the newly created folder and start the app:

Terminal window

```bash
cd my-first-plugin
npm install && npm run dev
```

This hosts your plugin on `http://localhost:5173`. We'll later connect to this through the DatoCMS web app.

# Install your plugin in the DatoCMS web app

In order for you to see your app running in the DatoCMS web app, you need to create a private plugin in DatoCMS.

> [!POSITIVE] Plugins are private unless you choose to publish them
> DatoCMS plugins are private by default (only accessible in the project you installed it in) unless you [choose to publish it to the public plugin marketplace](publishing-to-marketplace.md), which would make it accessible to all DatoCMS customers.

#### Create your private Plugin

Enter your project, and go to **Configuration** **\>** **Plugins**. Click on "**Add a new private plugin**":

(Video content)

In the modal, provide details about your plugin:

-   Provide a name and (optionally) a description for your plugin. This can be whatever you want; we chose **Record Metrics** for this tutorial.
    
-   Enter the *Entry point URL*. This is the URL where our app is running. Since we are running our app locally during development, the URL is `http://localhost:5173`. (Later, once you [deploy](build-your-first-plugin.md#deployment) your plugin, you can change the entry point to another location.)
    
-   Specify any [special permission](additional-permissions.md) you want to grant to the plugin. For this tutorial, we don't need any of them.
    

Then submit the form to create the plugin. Congrats, your plugin is now installed in your current project and environment! 🎉

Once you're done with local development, you'll probably want to [deploy your plugin](build-your-first-plugin.md#deployment) so it can be accessed by your team members without needing to run your local development server.

(Video content)

# Configure your plugin

The [config screen](config-screen.md) of the plugin is rendered by the `ConfigScreen` React component.

Let's fire up our code editor of choice and open the `src/entrypoints/ConfigScreen.tsx` file in the project directory that was previously generated. Any changes you make here will be reflected in the DatoCMS web app. Let's change our welcome text from `Welcome to your plugin!` to `Welcome to Record Metrics!`

Save the file and watch the config screen update in real time:

(Video content)

> [!PROTIP] Pro tip: Use <ContextInspector />
> Inside the `src/entrypoints/ConfigScreen.tsx` file you'll notice the use of `<ContextInspector />` , which is a component made available by `datocms-react-ui` to get an instant overview of all the information/methods available within any SDK hook.
> 
> Remember to use it during development, it's very convenient to avoid going back and forth in the documentation!

# Add the sidebar panel

To add [sidebar panels](sidebar-panels.md) to the DatoCMS interface, we need to implement the `itemFormSidebarPanels` and `renderItemFormSidebarPanel` hooks.

Open the `src/index.tsx` file and add the following code:

```tsx
import SidebarMetrics from './entrypoints/SidebarMetrics';

connect({
  // ...
  itemFormSidebarPanels() {
    return [
      {
        id: 'metrics',
        label: 'Metrics',
      },
    ];
  },
  renderItemFormSidebarPanel(sidebarPaneId, ctx) {
    render(<SidebarMetrics ctx={ctx} />);
  },
});
```

We also need to add the new `SidebarMetrics` component in `src/entrypoints/SidebarMetrics.tsx`:

```tsx
import { RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function SidebarMetrics({ ctx }: PropTypes) {
  return <Canvas ctx={ctx}>Hello from the sidebar!</Canvas>;
}
```

Make sure to have a model with some text fields, and a record we can test the plugin on (if you are not familiar with the concept of models, you can read more about them [here](https://www.datocms.com/docs/general-concepts/data-modelling.md)).

Then go to your Content tab, and create a blog post record. You should see a "Metrics" sidebar panel now on the page:

(Video content)

All the changes you make here to the component will also be reflected directly in the web app.

## Calculate the metrics

It's time to calculate some metrics for the record. For calculating the word count and the reading time we will use a library called [`reading-time`](https://github.com/michael-lynch/reading-time). Navigate to your project folder and install the libraries and its dependencies with:

Terminal window

```bash
npm install reading-time
npm install stream util --save-dev
```

We can use the `ctx` object, which gets passed into every hook, to interact with DatoCMS:

-   The `ctx.fields` object holds all the currently loaded fields for the current project;
    
-   The `ctx.itemType` object holds the model for the current record;
    
-   The `ctx.formValues` object holds the current values present in the record form;
    

We can use this information to get the values of all the text fields present in the record, concatenate them in a single string and then call the `readingTime` function, which will calculate our desired metrics. It will do all the heavy lifting for us and return an object which holds the word count and the time to read.

The last thing we want to do is display the calculated metrics in our sidebar. For this we import the `Canvas` component from `datocms-react-ui` to give our app the look and feel of the DatoCMS web app.

The final code should look like this:

```tsx
import { RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import readingTime from 'reading-time';
import { Field } from 'datocms-plugin-sdk';

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function SidebarMetrics({ ctx }: PropTypes) {
  const modelFields = ctx.itemType.relationships.fields.data
    .map((link) => ctx.fields[link.id])
    .filter<Field>((x): x is Field => !!x);

  const textFields = modelFields.filter((field) =>
    ['text', 'string'].includes(field.attributes.field_type),
  );

  const allText = textFields
    .map((field) => ctx.formValues[field.attributes.api_key])
    .join(' ');

  const stats = readingTime(allText || '');

  return (
    <Canvas ctx={ctx}>
      <ul>
        <li>Word count: {stats.words}</li>
        <li>Reading time: {stats.text}</li>
      </ul>
    </Canvas>
  );
}
```

Type some content in your field and see how the app updates!

(Video content)

## Deployment

To deploy your plugin and make it available to everyone in your organization, you need to create a production build of your app and then host it somewhere on the internet. We strongly suggest using Netlify or Vercel, as they make the overall experience incredibly easy.

When configuring your hosting service, make sure to specify the following build command:

Terminal window

```bash
npm run build
```

Once deployed, go to "Project Settings > Plugins", and inside your plugin click the "Edit private plugin" button. In the modal, change the "Entry point URL" to the new Netlify/Vercel URL.

Congratulations, you just deployed your first plugin! 🥳

#### Build a Plugin Video tutorial

Learn to build a DatoCMS plugin from scratch with this video tutorial:

[

(Image content)

How to start developing plugins for DatoCMS

Play video »

](https://youtu.be/sc8sm34tyWw)

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