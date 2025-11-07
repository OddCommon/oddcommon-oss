# Customize record presentation

When viewing a collection of items, the records will normally show their title and possibly an image preview (as defined in the model's presentation settings). In this example, the record previews come from the record's `Name` field:

[(Image content)](https://www.datocms-assets.com/205/1739917684-screenshot-001058.png?auto=format&fit=max&w=2000)

But sometimes you may want more advanced control over the presentation of your collections. For example, you might want to make the title dynamically change based on another field in the record or an external API query.

### Basic Example: Data from another field

Maybe you want to show an emoji next to the product name based on its product type:

[(Image content)](https://www.datocms-assets.com/205/1739919444-valencia-product-collection-content-builditeminfo-datocms-2025-02-18-02-57-06-pm.png?auto=format&fit=max&w=2000)

This change is purely cosmetic & superficial, affecting only what your editors see in the collection. It does NOT change the actual data in the record, only its *presentation* inside the DatoCMS UI.

How does it work? We used the [`buildItemPresentationInfo`](customize-presentation.md#buildItemPresentationInfo) hook:

```typescript
import {type BuildItemPresentationInfoCtx, connect, Item} from "datocms-plugin-sdk";

// A schema for our basic example
type ProductRecord = Item & {
  attributes: {
    name: 'string'
    product_type?: 'apple' | 'orange'
  }
}

// This checks to make sure an item is a product based on its API key, and if it is, assert that it is a ProductRecord
function isProductRecord(item: Item, ctx: BuildItemPresentationInfoCtx): item is ProductRecord {
  return ctx.itemTypes[item.relationships.item_type.data.id]?.attributes.api_key === 'product';
}

connect({
  async buildItemPresentationInfo(item: Item, ctx: BuildItemPresentationInfoCtx) {

    // We only want to override records in the `product` model
    if (!isProductRecord(item, ctx)) {
      return undefined; // Return undefined to let the record use its default values
    }

    // Get the record fields
    const {attributes: {product_type, name}} = item

    const fruitEmoji = {
      'apple': '🍎',
      'orange': '🍊',
      'unknown': '❓'
    }

    return {
      title: `${product_type ? fruitEmoji[product_type] : fruitEmoji['unknown']} ${name}`,
    }
  },
});
```

This level of flexibility empowers you to create a unique and tailored user experience that aligns with your goals.

The `buildItemPresentationInfo` hook can be used in numerous ways. For example, you can:

-   Combine multiple fields to present a record
    
-   Generate a preview image on the fly
    
-   Perform asynchronous API requests to third parties to compose the presentation
    

These are just a few examples of what you can do with the `buildItemPresentationInfo` hook. The possibilities are limitless, and you can use this hook to create the exact presentation you need.

The `buildItemPresentationInfo` hook is called every time a record needs to be presented, and it can return an object with `title` and/or `imageUrl` attributes, or `undefined`, if the plugin does not want to interfere with the default presentation at all.

> [!NOTE] imageUrl can also be a Data URL
> While the `imageUrl` attribute normally is a normal URL starting with `https://`, you can also pass a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs). Data URLs can be useful to generate an image on-the-fly in JavaScript (for example, [using canvases](https://davidwalsh.name/convert-image-data-uri-javascript)).

### Advanced Example: Data from an async fetch

Suppose that one of the models in a DatoCMS project is used to represent products in a ecommerce frontend, and that each product record in DatoCMS is linked to a particular Shopify product via its handle.

Shopify holds information like inventory availability, prices and variant images. We don't want to replicate the same information in DatoCMS, but it would be nice to show them inside the DatoCMS interface.

Since the `buildItemPresentationInfo` hook can be an async function, we can make a `fetch` call to the [Shopify Storefront API](https://shopify.dev/docs/api/storefront) (or any other API) and use its response in our collection display.

We'll modify our previous example to show use the result of this fetch instead, based on a new field `shopify_product_handle` (which holds an external ID) and a fake function `fetchShopifyProduct()` (simulating an external fetch):

(Image content)

```typescript
// Updated schema
type ProductRecord = Item & {
  attributes: {
    name: 'string'
    shopify_product_handle: string // A new required field
    // product_type?: 'apple' | 'orange' // No longer needed in the modified example
  }
}

// Updated hook
connect({
  async buildItemPresentationInfo(item: Item, ctx: BuildItemPresentationInfoCtx) {

    // Same function as before
    if (!isProductRecord(item, ctx)) {
      return undefined;
    }

    // Get the new field
    const {attributes: {name, shopify_product_handle}} = item

    // Just an example. In a real use case this would be an awaited fetch.
    const shopifyData = await fetchShopifyProduct(shopify_product_handle);

    const { imageUrl, availableForSale } = shopifyData;

    return {
      title: `${name} (${availableForSale ? '🛍️' : '🚫'})`,
      imageUrl,
    }
  },
})
```

The above is a simplified example using a fake fetch function. In a real project, to perform the actual API call to Shopify, we would need to implement a real fetch function using a real API token and the Shopify store domain. Both can be specified by the final user by [adding some settings to the plugin](config-screen.md).

A more realistic `fetchShopifyProduct` function might be something like this:

```typescript
import { Plugin } from "datocms-plugin-sdk";

type PluginParameters = {
  shopifyDomain: string;
  shopifyAccessToken: string;
}

async function fetchShopifyProduct(handle: string, plugin: Plugin) {
  const parameters = plugin.attributes.parameters as PluginParameters;

  const res = await fetch(
    `https://${parameters.shopifyDomain}.myshopify.com/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': `${parameters.shopifyAccessToken}`,
      },
      body: JSON.stringify({
        query: `query getProduct($handle: String!) {
          product: productByHandle(handle: $handle) {
            title
            availableForSale
            images(first: 1) {
              edges {
                node {
                  src: transformedSrc(crop: CENTER, maxWidth: 200, maxHeight: 200)
                }
              }
            }
          }
        }`,
        variables: { handle },
      }),
    },
  );

  const body = await res.json();

  return {
    title: body.data.product.title,
    availableForSale: body.data.product.availableForSale,
    imageUrl: body.data.product.images.edges[0].node.src,
  };
}
```

#### `buildItemPresentationInfo(item: Item, ctx)`

Use this function to customize the presentation of a record in records collections and "Single link" or "Multiple links" field.

##### Return value

The function must return: `MaybePromise<ItemPresentationInfo | undefined>`.

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