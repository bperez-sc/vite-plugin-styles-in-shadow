# @mercurio-sc/vite-plugin-styles-in-shadow

## What it does

This plugin allows you to inject css styles into the shadow root of your web
components.

## How to install

Just run a simple

```sh
npm i -D @mercurio-sc/vite-plugin-styles-in-shadow
# or
yarn add -D @mercurio-sc/vite-plugin-styles-in-shadow
```

## How to use it

Install `@mercurio-sc/web-component-app` to create a entry point as a Web Component
and implement it like this:

```tsx
webComponentApp<Props>("web-component-name", App);
```

At this point, you'll probably get errors regarding `SHADOW_STYLE` not being
defined. To obviate this, you can create a `globals.d.ts` file in your project's
root folder and add the following to it:

```ts
declare const SHADOW_STYLE: string;
```

Now, all you'll need to do is load the plugin in your vite configuration, as the
last item in the `plugins` array:

```ts
import { shadowStyle } from "./lib/vite-plugin-shadow-styles/src";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    shadowStyle({
      host: "http://localhost:5500/assets/" // required!
    })
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});
```

## Options

### assetsUrl: string

This is the URL of the host where the CSS file will be hosted.
