Избавиться от переключений в src/dom.ts
  // @note for vite compile
  import mitt from "mitt";

  // @note for browser js module
  // import mitt from "../node_modules/mitt/dist/mitt.mjs";

  // @note for tsc compile
  // import mitt from "../node_modules/mitt/index";

  То есть сделать билд библиотеки вместе с зависимостями? (вместе в mitt)
  Или сделать правильный путь к зависимостям? (import mitt from "../node_modules/mitt/dist/mitt.mjs")