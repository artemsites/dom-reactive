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



## API
* `createScope` - creating an area in the DOM for working with the library
* `createComponent` - defining multiple components of the same type with their own scope
* `ref` - reactive state OR HTMLElement in DOM

* `data-class` - is an attribute of an HTML element for dynamic class management
* `data-click` - defines the method that will occur when clicked
* `data-ref` - defines the name of the variable to which this HTMLElement will be bound in the DOM


## createScope
### Initializing the createScope in js
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

### Using the createScope in html
Important: each application is an object called the id for which the application is created, for example, "header":
```html
<header id="header">
  <!-- [onclick] -->
  <button onclick="header.open()">
    open
  </button>

  <button onclick="header.close()">
    close
  </button>

  <!-- Or [data-click] -->
  <button data-click="header.open">
    open
  </button>

  <button data-click="header.close">
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

<footer id="footer">
  <!-- @note You can use functions from another scope: -->
  <button onclick="header.close()">
    close
  </button>
  <!-- Or [data-click] -->
  <button data-click="header.close">
    close
  </button>
</footer>
```


## createComponent
### Initializing the createComponent in js
```js
createComponent('video__wrapper', () => {
    const $video = ref(null)
    let isPlaying = ref(false)

    function toggleVideo() {
        if (!isPlaying.value) {
            $video.value.play()
            isPlaying.value = true
        } else {
            $video.value.pause()
            isPlaying.value = false
        }
    }

    return {
        toggleVideo,
        $video,
        isPlaying
    }
})
```

### Using the createComponent in html
```html
<div class="video__wrapper" data-class='{"video__wrapper--playing": "isPlaying"}'>
    <button data-click="toggleVideo"></button>

    <video
        data-ref="$video"
        class="video"
        playsInline
        loop
    >
        <source src="video.mp4" type="video/mp4" />
    </video>
</div>
```



## Functional history:
### 1.1.3 Added comparison in data-class:
```html
data-class='{"test1": "header.isIdActive == 1", "test2": "header.isIdActive != 1"}'
```

```html
data-class='["header.isIdActive == 1 ? test1 : test2","header.isIdActive != 1 ? test3 : test4"]'
```

### 1.2.0 Fixed a bug of switching classes while using:
```
<div data-class='{"--active": "!header.isActive"}'>not-active</div>
<div data-class='{"--active": "header.isActive"}'>active</div>
```

### 1.2.1 Added data-class check at root element.

### 1.2.2 Emit ref only when the value is changed.

### 1.3.0 Added the ability to define many components of the same type with their own scope.
```js
createComponent('video__wrapper', () => {
    const $video = ref(null)
    let isPlaying = ref(false)

    function toggleVideo() {
        if (!isPlaying.value) {
            $video.value.play()
            isPlaying.value = true
        } else {
            $video.value.pause()
            isPlaying.value = false
        }
    }

    return {
        toggleVideo,
        $video,
        isPlaying
    }
})
```
```html
<div class="video__wrapper" data-class='{"video__wrapper--playing": "isPlaying"}'>
    <button data-click="toggleVideo"></button>

    <video
        data-ref="$video"
        class="video"
        playsInline
        loop
    >
        <source src="video.mp4" type="video/mp4" />
    </video>
</div>
```

### 1.3.1 Added processing `data-click` for createScope as an alternative `onClick`