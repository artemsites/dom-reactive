import { createApp, useState } from "./useDom.js";

createApp(() => {
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
