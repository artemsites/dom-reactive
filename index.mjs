function j(t) {
  return { all: t = t || /* @__PURE__ */ new Map(), on: function(e, n) {
    var s = t.get(e);
    s ? s.push(n) : t.set(e, [n]);
  }, off: function(e, n) {
    var s = t.get(e);
    s && (n ? s.splice(s.indexOf(n) >>> 0, 1) : t.set(e, []));
  }, emit: function(e, n) {
    var s = t.get(e);
    s && s.slice().map(function(u) {
      u(n);
    }), (s = t.get("*")) && s.slice().map(function(u) {
      u(e, n);
    });
  } };
}
const x = j();
let y = /* @__PURE__ */ new Map();
function H(t, e) {
  const n = document.getElementById(t);
  if (n) {
    const s = e();
    L(n, s), window[t] = s;
  } else
    throw Error("Нет wrapper: #" + t);
}
function q(t) {
  const e = `state_${crypto.randomUUID()}`;
  let n = { value: t };
  const s = new Proxy(n, {
    set(u, m, a) {
      return m === "value" ? (u.value = a, x.emit(e, u), !0) : !1;
    }
  });
  return y.set(s, e), x.emit(e, s), s;
}
function L(t, e) {
  t.querySelectorAll(
    "[data-class]"
  ).forEach((a) => {
    if (a.dataset.class) {
      let o = a.dataset.class;
      a.removeAttribute("data-class");
      const r = JSON.parse(o);
      if (Array.isArray(r))
        for (let c in r) {
          let i = r[c];
          const d = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, l = i.match(d);
          let f = l[1];
          const p = l[2], g = l[3];
          s(a, [p, g], f);
        }
      else if (S(r))
        for (let c in r) {
          let i = r[c];
          s(a, c, i);
        }
    }
  });
  function s(a, o, r) {
    let c = !1;
    r[0] === "!" && (c = !0, r = r.slice(1));
    let i = b(r);
    const d = i.includes("!="), l = i.includes("==");
    if (d || l)
      d ? u(
        i,
        /!=/,
        "!=",
        o,
        a,
        c
      ) : l && u(
        i,
        /==/,
        "==",
        o,
        a,
        c
      );
    else {
      const f = e[i];
      m(f.value, o, a, c);
      const p = y.get(f);
      x.on(p, (g) => {
        m(g.value, o, a, c);
      });
    }
  }
  function u(a, o, r, c, i, d) {
    const l = C(a, o);
    if (l && l.length === 2) {
      const [f, p] = l, g = e[f], E = h(g.value, p, r);
      m(E, c, i, d);
      const A = y.get(g);
      x.on(A, (v) => {
        const w = h(v.value, p, r);
        m(w, c, i, d);
      });
    }
  }
  function m(a, o, r, c = !1) {
    try {
      a && !c ? Array.isArray(o) ? (r.classList.remove(o[1]), r.classList.add(o[0])) : r.classList.add(o) : Array.isArray(o) ? (r.classList.remove(o[0]), r.classList.add(o[1])) : r.classList.remove(o);
    } catch (i) {
      console.error(i);
    }
  }
}
function S(t) {
  return t !== null && typeof t == "object";
}
function b(t) {
  return t.replace(/^\w+\./, "");
}
function C(t, e) {
  const n = t.split(e);
  return n.length === 2 ? [n[0].trim(), n[1].trim()] : null;
}
function h(t, e, n) {
  switch (n) {
    case "!=":
      return t != e;
    case "==":
      return t == e;
    case "<":
      return t < e;
    case ">":
      return t > e;
    case "<=":
      return t <= e;
    case ">=":
      return t >= e;
    default:
      throw new Error("Invalid operator");
  }
}
export {
  H as createScope,
  q as ref
};
//# sourceMappingURL=index.mjs.map
