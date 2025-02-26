function j(t) {
  return { all: t = t || /* @__PURE__ */ new Map(), on: function(s, n) {
    var r = t.get(s);
    r ? r.push(n) : t.set(s, [n]);
  }, off: function(s, n) {
    var r = t.get(s);
    r && (n ? r.splice(r.indexOf(n) >>> 0, 1) : t.set(s, []));
  }, emit: function(s, n) {
    var r = t.get(s);
    r && r.slice().map(function(f) {
      f(n);
    }), (r = t.get("*")) && r.slice().map(function(f) {
      f(s, n);
    });
  } };
}
const y = j();
let h = /* @__PURE__ */ new Map();
function b(t, s) {
  const n = document.getElementById(t);
  if (n) {
    const r = s();
    w(n, r), window[t] = r;
  } else
    throw Error("Нет wrapper: #" + t);
}
function R(t) {
  const s = `state_${crypto.randomUUID()}`;
  let n = { value: t };
  const r = new Proxy(n, {
    set(f, m, g) {
      return m === "value" ? (f.value = g, y.emit(s, f), !0) : !1;
    }
  });
  return h.set(r, s), y.emit(s, r), r;
}
function w(t, s) {
  t.querySelectorAll(
    "[data-class]"
  ).forEach((i) => {
    if (i.dataset.class) {
      let o = i.dataset.class;
      i.removeAttribute("data-class");
      const e = JSON.parse(o);
      if (Array.isArray(e))
        for (let c in e) {
          let a = e[c];
          const u = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, l = a.match(u);
          let p = l[1];
          const d = l[2], x = l[3];
          r(i, [d, x], p);
        }
      else if (C(e))
        for (let c in e) {
          let a = e[c];
          r(i, c, a);
        }
    }
  });
  function r(i, o, e) {
    let c = !1;
    e[0] === "!" && (c = !0, e = e.slice(1));
    let a = L(e);
    const u = a.includes("!="), l = a.includes("==");
    u || l ? u ? f(
      a,
      /!=/,
      "!=",
      o,
      c,
      i
    ) : l && f(
      a,
      /==/,
      "==",
      o,
      c,
      i
    ) : m(
      a,
      !0,
      "==",
      c,
      o,
      i
    );
  }
  function f(i, o, e, c, a, u) {
    const l = S(i, o);
    if (l && l.length === 2) {
      const [p, d] = l;
      m(
        p,
        d,
        e,
        a,
        c,
        u
      );
    }
  }
  function m(i, o, e, c, a, u) {
    const l = s[i], p = A(l.value, o, e);
    g(p, a, u, c);
    const d = h.get(l);
    y.on(d, (x) => {
      const E = A(x.value, o, e);
      g(E, a, u, c);
    });
  }
  function g(i, o, e, c = !1) {
    try {
      i && !c ? Array.isArray(o) ? (e.classList.remove(o[1]), e.classList.add(o[0])) : e.classList.add(o) : Array.isArray(o) ? (e.classList.remove(o[0]), e.classList.add(o[1])) : e.classList.remove(o);
    } catch (a) {
      console.error(a);
    }
  }
}
function C(t) {
  return t !== null && typeof t == "object";
}
function L(t) {
  return t.replace(/^\w+\./, "");
}
function S(t, s) {
  const n = t.split(s);
  return n.length === 2 ? [n[0].trim(), n[1].trim()] : null;
}
function A(t, s, n) {
  switch (n) {
    case "!==":
      return t !== s;
    case "!=":
      return t != s;
    case "===":
      return t === s;
    case "==":
      return t == s;
    case "<":
      return t < s;
    case ">":
      return t > s;
    case "<=":
      return t <= s;
    case ">=":
      return t >= s;
    default:
      throw new Error("Invalid operator");
  }
}
export {
  b as createScope,
  R as ref
};
//# sourceMappingURL=index.mjs.map
