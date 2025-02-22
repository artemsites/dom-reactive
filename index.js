import { useDom, ref } from "./dist/dom.js";

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
