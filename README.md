# Библиотека "Dom" - краткая суть
 1. Библиотека работает с настоящим DOM деревом.
  > В отличи от Vue и React которые работают  с виртуальным DOM и затем рендарят результаты в настоящий DOM!
 2. Используется валидное HTML API, в следствии этого библиотека не создаёт ошибок валидации https://validator.w3.org/
  > В отличи от Vue который если применять в HTML разметке классического сайта - создаёт ошибки валидации HTML!



## Инициализация приложения в js
```js
import { useDom, ref } from "./dom.js";

useDom(() => {
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



## Использование приложения в html
> Важно: каждое приложение является объектом под названием id на которое создаётся приложение, например "header":
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



## TODO:
Избавиться от переключений в src/dom.ts
```
  // @note for vite compile
  import mitt from "mitt";

  // @note for browser js module
  // import mitt from "../node_modules/mitt/dist/mitt.mjs";

  // @note for tsc compile
  // import mitt from "../node_modules/mitt/index";
```
* То есть сделать билд библиотеки вместе с зависимостями? (вместе в mitt)   
* Или сделать правильный путь к зависимостям? (import mitt from "../node_modules/mitt/dist/mitt.mjs")   