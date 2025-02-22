function g(a) {
  return { all: a = a || /* @__PURE__ */ new Map(), on: function(t, s) {
    var e = a.get(t);
    e ? e.push(s) : a.set(t, [s]);
  }, off: function(t, s) {
    var e = a.get(t);
    e && (s ? e.splice(e.indexOf(s) >>> 0, 1) : a.set(t, []));
  }, emit: function(t, s) {
    var e = a.get(t);
    e && e.slice().map(function(n) {
      n(s);
    }), (e = a.get("*")) && e.slice().map(function(n) {
      n(t, s);
    });
  } };
}
const p = g();
let m = /* @__PURE__ */ new Map();
function S(a, t) {
  const s = document.getElementById(a);
  if (s) {
    const e = t();
    A(s, e), window[a] = e;
  } else
    throw Error("Нет wrapper: #" + a);
}
function h(a) {
  const t = `state_${crypto.randomUUID()}`, s = new Proxy(
    { value: a },
    {
      set(e, n, o) {
        return n === "value" ? (e[n] = o, p.emit(t, e), !0) : !1;
      }
    }
  );
  return m.set(s, t), p.emit(t, s), s;
}
function A(a, t) {
  a.querySelectorAll(
    "[data-class]"
  ).forEach((n) => {
    if (n.dataset.class) {
      let o = n.dataset.class;
      n.removeAttribute("data-class");
      const r = JSON.parse(o);
      if (Array.isArray(r))
        for (let i in r) {
          let c = r[i];
          const f = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, l = c.match(f);
          let u = l[1];
          const y = l[2], v = l[3];
          e(n, [y, v], u);
        }
      else if (L(r))
        for (let i in r) {
          let c = r[i];
          e(n, i, c);
        }
    }
  });
  function e(n, o, r) {
    let i = !1;
    r[0] === "!" && (i = !0, r = r.slice(1));
    let c = r.replace(/^\w+\./, "");
    const f = t[c];
    d(f, o, n, i);
    let l = m.get(f);
    p.on(l, (u) => {
      d(u, o, n, i);
    });
  }
}
function d(a, t, s, e = !1) {
  a.value && !e ? Array.isArray(t) ? (s.classList.remove(t[1]), s.classList.add(t[0])) : s.classList.add(t) : Array.isArray(t) ? (s.classList.remove(t[0]), s.classList.add(t[1])) : s.classList.remove(t);
}
function L(a) {
  return a !== null && typeof a == "object";
}
export {
  S as createScope,
  h as ref
};
//# sourceMappingURL=index.mjs.map
