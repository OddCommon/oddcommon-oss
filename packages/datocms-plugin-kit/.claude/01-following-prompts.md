# Follow up Promts

## Follow up 1

> There are a lot of `any` or `unknown` that we could actually be strongly typed.
> try to always use a real type instead of `any` or `unknown`

### context

I saw in the output it was changing `any` types to `unknown` to fix tslint errors.

### result

It replaced all 56 tslint errors with new types and some existing ones.

## Follow up 2

>  I am trying to build a quick vite app as a demo for the package
> I'm getting an error importing the package in @apps/dato-plugins-demo/src/plugin.ts
> can you have a look ?

### context

I manually created a ts/react vite project to assert the code was working, importing the library caused an error I suspected was a configuration problem.

### result

It fixed a typo in the package.json I created before we started

## Follow up 2

> Following the implementation model of 'test-outlet' and 'test-page', can you create a demo overriden form field that would turn any fields with the api_key `demo_text_field` into select with 2 options "DEMO 01" and "DEMO 02" ?

### context

After setting up the path, I wanted the model to keep writing more demo hooks

### result

It create a new field extension as expected
