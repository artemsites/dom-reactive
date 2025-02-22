import { createScope, ref } from "./node_modules/dom-reactive/dist/index.mjs";

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
