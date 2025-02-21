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
