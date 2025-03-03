function C(t) {
  return { all: t = t || /* @__PURE__ */ new Map(), on: function(s, n) {
    var r = t.get(s);
    r ? r.push(n) : t.set(s, [n]);
  }, off: function(s, n) {
    var r = t.get(s);
    r && (n ? r.splice(r.indexOf(n) >>> 0, 1) : t.set(s, []));
  }, emit: function(s, n) {
    var r = t.get(s);
    r && r.slice().map(function(u) {
      u(n);
    }), (r = t.get("*")) && r.slice().map(function(u) {
      u(s, n);
    });
  } };
}
const y = C();
let A = /* @__PURE__ */ new Map();
function N(t, s) {
  const n = document.getElementById(t);
  if (n) {
    const r = s();
    S(n, r), window[t] = r;
  } else
    throw Error("Нет wrapper: #" + t);
}
function w(t) {
  const s = `state_${crypto.randomUUID()}`;
  let n = { value: t };
  const r = new Proxy(n, {
    set(u, g, m) {
      return g === "value" ? (u.value !== m && (u.value = m, y.emit(s, u)), !0) : !1;
    }
  });
  return A.set(r, s), y.emit(s, r), r;
}
function S(t, s) {
  t.dataset.class && r(t), t.querySelectorAll(
    "[data-class]"
  ).forEach((c) => {
    r(c);
  });
  function r(c) {
    let i = c.dataset.class;
    c.removeAttribute("data-class");
    let e;
    try {
      e = JSON.parse(i);
    } catch (o) {
      console.error("Error at JSON string: " + i), console.error(o);
    }
    if (Array.isArray(e))
      for (let o in e) {
        let a = e[o];
        const f = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, l = a.match(f);
        let p = l[1];
        const d = l[2], x = l[3];
        u(
          c,
          [d, x],
          p
        );
      }
    else if (L(e))
      for (let o in e) {
        let a = e[o];
        u(
          c,
          o,
          a
        );
      }
  }
  function u(c, i, e) {
    let o = !1;
    e[0] === "!" && (o = !0, e = e.slice(1));
    let a = b(e);
    const f = a.includes("!="), l = a.includes("==");
    f || l ? f ? g(
      a,
      /!=/,
      "!=",
      o,
      i,
      c
    ) : l && g(
      a,
      /==/,
      "==",
      o,
      i,
      c
    ) : m(
      a,
      !0,
      "==",
      o,
      i,
      c
    );
  }
  function g(c, i, e, o, a, f) {
    const l = v(c, i);
    if (l && l.length === 2) {
      const [p, d] = l;
      m(
        p,
        d,
        e,
        o,
        a,
        f
      );
    }
  }
  function m(c, i, e, o, a, f) {
    const l = s[c], p = j(l.value, i, e);
    h(p, a, f, o);
    const d = A.get(l);
    y.on(d, (x) => {
      const E = j(x.value, i, e);
      h(E, a, f, o);
    });
  }
  function h(c, i, e, o = !1) {
    try {
      const a = c && !o || !c && o;
      if (typeof i == "string")
        a ? e.classList.add(i) : e.classList.remove(i);
      else if (Array.isArray(i)) {
        const [f, l] = i;
        a ? (e.classList.remove(l), e.classList.add(f)) : (e.classList.remove(f), e.classList.add(l));
      }
    } catch (a) {
      console.error(a);
    }
  }
}
function L(t) {
  return t !== null && typeof t == "object";
}
function b(t) {
  return t.replace(/^\w+\./, "");
}
function v(t, s) {
  const n = t.split(s);
  return n.length === 2 ? [n[0].trim(), n[1].trim()] : null;
}
function j(t, s, n) {
  switch (n) {
    case "!=":
      return t != s;
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
  N as createScope,
  w as ref
};
//# sourceMappingURL=index.mjs.map
