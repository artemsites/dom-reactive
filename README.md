# Dom Library - a brief summary
A library for working with DOM with syntax similar to Vue.

1. The library works with a real DOM tree.
> Unlike Vue, which work with a virtual DOM and then render the results to the real DOM!
2. A valid HTML API is used, as a result, the library does not create validation errors https://validator.w3.org
> Unlike Vue, which, when used in the HTML markup of a classic website, creates HTML validation errors!



## Install:
**npm:**
```
npm i dom-reactive
```

**pnpm:**
```
pnpm i dom-reactive
```

**yarn:**
```
yarn add dom-reactive
```



## Import dom-reactive in js
**js module WITHOUT builder**
```ts
import { createScope, ref } from "./node_modules/dom-reactive/index.mjs";
```

**js module WITH builder**
```ts
import { createScope, ref } from "dom-reactive";
```



## Initializing the application in js
```ts
createScope("header", () => {
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
});

```



## Using the application in html
Important: each application is an object called the id for which the application is created, for example, "header":
```html
<head>
  <script type="module" src="./index.js" defer></script>
</head>

<body>
  <header id="header">

    <button onclick="header.open()">
      open
    </button>

    <button onclick="header.close()">
      close
    </button>

    <div class="target" data-class='{"active": "header.isActive", "active-not": "!header.isActive"}'>
      test data-class Object JSON - JS check True - False
    </div>

    <div class="target" data-class='["header.isActive ? active : active-not", "!header.isActive ? test-not : test"]'>
      test data-class Array JSON - JS check True - False
    </div>

    <div class="target" data-class='{"test1": "header.isIdActive == 1", "test2": "header.isIdActive != 1"}'>
      test data-class Object JSON - JS Comparsion
    </div>

    <div class="target" data-class='["header.isIdActive == 1 ? test1 : test2","header.isIdActive != 1 ? test3 : test4"]'>
      test data-class Array JSON - JS Comparsion
    </div>

  </header>
</body>
```



## API
* `createScope` - creating an area in the DOM for working with the library
* `ref` - reactive state
* `data-class` is an attribute of an HTML element for dynamic class management



## Functional history:
### 1.1.3
* Added comparison in data-class:  

```html
data-class='{"test1": "header.isIdActive == 1", "test2": "header.isIdActive != 1"}'
```

```html
data-class='["header.isIdActive == 1 ? test1 : test2","header.isIdActive != 1 ? test3 : test4"]'
```
