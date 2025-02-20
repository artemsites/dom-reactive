/**
 * useDom.js
 */
// import mitt from "mitt";
import mitt from "./node_modules/mitt/dist/mitt.mjs";
const emitter = mitt();

let stateNames = new Map();

export function createApp(app, id) {
  const wrapper = document.getElementById(id);

  if (wrapper) {
    const appInstance = app();

    const $classes = wrapper.querySelectorAll("[data-class]");
    $classes.forEach(($el) => {
      let data = $el.dataset.class;
      $el.removeAttribute("data-class");

      const jsonString = data.replace(/'/g, '"');
      const classList = JSON.parse(jsonString);

      for (let className in classList) {
        let propname = classList[className].split(".").pop();
        const state = appInstance[propname];
        toggleClass(state, className, $el);

        let stateName = stateNames.get(appInstance[propname]);
        emitter.on(stateName, (newState) => {
          toggleClass(newState, className, $el);
        });
      }
    });

    window[id] = appInstance;
  } else {
    throw Error("Нет wrapper: #" + id);
  }
}

export function useState(defaultVal) {
  let state = { val: defaultVal };

  let stateName = `state_${Math.random().toString(36).substr(2, 9)}`;
  stateNames.set(state, stateName);
  emitter.emit(stateName, state);

  function setState(newVal) {
    state.val = newVal;
    emitter.emit(stateName, state);
  }

  return [state, setState];
}

function toggleClass(state, className, where) {
  if (state.val) {
    where.classList.add(className);
  } else {
    where.classList.remove(className);
  }
}
