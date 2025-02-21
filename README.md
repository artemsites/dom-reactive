Инициализация приложения в js
```js
import { useDom, useState } from "./dom.js";

useDom(() => {
  let [isNavMobileActive, setIsNavMobileActive] = useState(false);

  function openNavMobile() {
    setIsNavMobileActive(true);
  }

  function closeNavMobile() {
    setIsNavMobileActive(false);
  }

  return {
    isNavMobileActive,
    openNavMobile,
    closeNavMobile,
  };
}, "header");
```

Использование приложения в html
> Важно: каждое приложение является объектом под названием id на которое создаётся приложение, например "header":
```html
<header id="header">

  <button onclick="header.openNavMobile()">
    open
  </button>

  <button onclick="header.closeNavMobile()">
    close
  </button>

  <!-- Установка классов с помощью имитации объекта - в data-class пишется валидный JSON -->
  <div class="target" data-class='{"active": "header.isNavMobileActive", "active-not": "!header.isNavMobileActive"}'>
  test data-class Object JSON
  </div>

  <!-- Установка классов с помощью имитации тернарников в массиве - в data-class пишется валидный JSON -->
  <div class="target"
    data-class='["header.isNavMobileActive ? active : active-not", "!header.isNavMobileActive ? test-not : test"]'>
  test data-class Array JSON
  </div>

</header>
```