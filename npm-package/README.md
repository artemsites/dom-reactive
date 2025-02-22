# Dom Library - a brief summary
1. The library works with a real DOM tree.
> Unlike Vue and React, which work with a virtual DOM and then render the results to the real DOM!
2. A valid HTML API is used, as a result, the library does not create validation errors https://validator.w3.org /
> Unlike Vue, which, when used in the HTML markup of a classic website, creates HTML validation errors!



## Initializing the application in js
```js
import { createScope, ref } from "dom-reactive";

createScope(() => {
  let isActive = ref(false);

  function open() {
    isActive.value = true;
  }

  function close() {
    isActive.value = false;
  }

  return {
    isActive,
    open,
    close,
  };
}, "header");

```



## Using the application in html
Important: each application is an object called the id for which the application is created, for example, "header":
```html
  <header id="header">

    <button onclick="header.open()">
      open
    </button>

    <button onclick="header.close()">
      close
    </button>

    <div class="target" data-class='{"active": "header.isActive", "active-not": "!header.isActive"}'>
      test data-class Object JSON
    </div>

    <div class="target" data-class='["header.isActive ? active : active-not", "!header.isActive ? test-not : test"]'>
      test data-class Array JSON
    </div>

  </header>
```



## API
* `createScope' - creating an area in the DOM for working with the library
* `ref` - reactive state
* `data-class` is an attribute of an HTML element for dynamic class management



## TODO:
Get rid of switches in src/dom.ts

```ts
// @note for browser js module
import mitt from "../node_modules/mitt/dist/mitt.mjs";

// @note for vite compile
import mitt from "mitt";
```
* In other words, make a library build along with dependencies? (together at MITT)   
* Or make the right path to dependencies? (import mitt from "../node_modules/mitt/dist/mitt.mjs")   