// import { createScope, ref } from "../../../index";
import { createScope, ref } from "dom-reactive";

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
