function T(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(n, o) {
    var t = e.get(n);
    t ? t.push(o) : e.set(n, [o]);
  }, off: function(n, o) {
    var t = e.get(n);
    t && (o ? t.splice(t.indexOf(o) >>> 0, 1) : e.set(n, []));
  }, emit: function(n, o) {
    var t = e.get(n);
    t && t.slice().map(function(s) {
      s(o);
    }), (t = e.get("*")) && t.slice().map(function(s) {
      s(n, o);
    });
  } };
}
const v = T();
let w = /* @__PURE__ */ new Map();
function O(e, n, o = "") {
  const t = document.getElementById(e);
  if (t) {
    const s = n();
    b(t, s), R(t, s), N(t, s), I(t, s), j(t, s), o !== "" ? window[o] = s : window[e] = s;
  } else
    console.warn("Not found wrapper: #" + e);
}
function W(e, n) {
  const o = document.getElementsByClassName(
    e
  );
  for (let t of o)
    if (t) {
      const s = n();
      L(s) && (k(t, s), b(t, s), R(t, s), N(
        t,
        s
      ), I(t, s), j(t, s));
    } else
      console.warn("Not found wrapper: ." + e);
}
function D(e) {
  const n = `state_${crypto.randomUUID()}`;
  let o = { value: e };
  const t = new Proxy(o, {
    set(s, h, u) {
      return h === "value" ? (s.value !== u && (s.value = u, v.emit(n, s)), !0) : !1;
    }
  });
  return w.set(t, n), v.emit(n, t), t;
}
function k(e, n) {
  x("data-ref", e).forEach((t) => {
    const s = t.getAttribute("data-ref");
    s ? n[s].value = t : console.warn("The data-ref name was not found in: ", t);
  });
}
function N(e, n) {
  x("data-value", e).forEach((t) => {
    if (t instanceof HTMLInputElement) {
      const s = t.getAttribute("data-value") || null;
      if (s) {
        let u = A(s);
        const m = n[u];
        t.value = m.value;
        const r = w.get(m);
        v.on(r, (c) => {
          t.value = c.value;
        });
      }
    }
  });
}
function b(e, n) {
  const o = x("data-click", e);
  o.length && o.forEach((t) => {
    let s = t.getAttribute("data-click");
    if (s) {
      const h = A(s), u = n[h];
      t.addEventListener("click", function(m) {
        u(m);
      });
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function I(e, n) {
  const o = x("data-change", e);
  o.length && o.forEach((t) => {
    if (t) {
      let s = t.getAttribute("data-change");
      if (s) {
        const h = A(s), u = n[h];
        u && t.addEventListener("change", function(m) {
          u(m);
        });
      }
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function j(e, n) {
  const o = x("data-input", e);
  o.length && o.forEach((t) => {
    if (t) {
      let s = t.getAttribute("data-input");
      if (s) {
        const h = A(s), u = n[h];
        u && t.addEventListener("input", function(m) {
          u(m);
        });
      }
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function R(e, n) {
  x("data-class", e).forEach((r) => {
    t(r);
  });
  function t(r) {
    let c = r.getAttribute("data-class");
    if (c) {
      r.removeAttribute("data-class");
      let a;
      try {
        a = JSON.parse(c);
      } catch (i) {
        console.error("Error at JSON string: " + c), console.error(i);
      }
      if (Array.isArray(a))
        for (let i in a) {
          let l = a[i];
          const d = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(d);
          let p = f[1];
          const g = f[2], E = f[3];
          s(
            r,
            [g, E],
            p
          );
        }
      else if (L(a))
        for (let i in a) {
          let l = a[i];
          s(
            r,
            i,
            l
          );
        }
    } else
      console.warn("The data-class JSON string was not found in: ", r);
  }
  function s(r, c, a) {
    let i = !1;
    a[0] === "!" && (i = !0, a = a.slice(1));
    let l = A(a);
    const d = l.includes("!="), f = l.includes("==");
    d || f ? d ? h(
      l,
      /!=/,
      "!=",
      i,
      c,
      r
    ) : f && h(
      l,
      /==/,
      "==",
      i,
      c,
      r
    ) : u(
      l,
      !0,
      "==",
      i,
      c,
      r
    );
  }
  function h(r, c, a, i, l, d) {
    const f = P(r, c);
    if (f && f.length === 2) {
      const [p, g] = f;
      u(
        p,
        g,
        a,
        i,
        l,
        d
      );
    }
  }
  function u(r, c, a, i, l, d) {
    const f = n[r];
    if (!f)
      S(e, r);
    else {
      const p = y(f.value, c, a);
      m(p, l, d, i);
      const g = w.get(f);
      v.on(g, (E) => {
        const C = y(E.value, c, a);
        m(C, l, d, i);
      });
    }
  }
  function m(r, c, a, i = !1) {
    try {
      const l = r && !i || !r && i;
      if (typeof c == "string")
        l ? a.classList.add(c) : a.classList.remove(c);
      else if (Array.isArray(c)) {
        const [d, f] = c;
        l ? (a.classList.remove(f), a.classList.add(d)) : (a.classList.remove(d), a.classList.add(f));
      }
    } catch (l) {
      console.error(l);
    }
  }
}
function S(e, n) {
  const o = "#" + e.getAttribute("id") || "." + e.getAttribute("class");
  console.warn(
    `Ref ${n} is not exists at ${o}. Perhaps the component is located in another component.`
  );
}
function L(e) {
  return e !== null && typeof e == "object";
}
function A(e) {
  return e.replace(/^\w+\./, "");
}
function P(e, n) {
  const o = e.split(n);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function y(e, n, o) {
  switch (o) {
    case "!=":
      return e != n;
    case "==":
      return e == n;
    case "<":
      return e < n;
    case ">":
      return e > n;
    case "<=":
      return e <= n;
    case ">=":
      return e >= n;
    default:
      throw new Error("Invalid operator");
  }
}
function x(e, n) {
  const o = n.querySelectorAll(`[${e}]`), t = [...Array.from(o)];
  return n.dataset && n.getAttribute(e) && t.push(n), t;
}
export {
  W as createComponent,
  O as createScope,
  D as ref
};
//# sourceMappingURL=index.mjs.map
