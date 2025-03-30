function k(e) {
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
const E = k();
let v = /* @__PURE__ */ new Map(), y = () => {
};
window && typeof window.crypto.randomUUID == "function" ? y = window.crypto.randomUUID.bind(window.crypto) : y = P;
function O(e, n, o = "") {
  const t = document.getElementById(e);
  if (t) {
    const s = n(t);
    N(t, s), j(t, s), S(t, s), b(t, s), R(t, s), L(t, s), o !== "" ? window[o] = s : window[e] = s;
  } else
    console.warn("Not found wrapper: #" + e);
}
function W(e, n) {
  const o = document.getElementsByClassName(
    e
  );
  for (let t of o)
    if (t) {
      const s = n(t);
      T(s) && (N(t, s), j(t, s), S(t, s), b(
        t,
        s
      ), R(t, s), L(t, s));
    } else
      console.warn("Not found wrapper: ." + e);
}
function F(e) {
  const n = `state_${y()}`;
  let o = { value: e };
  const t = new Proxy(o, {
    set(s, m, u) {
      return m === "value" ? (s.value !== u && (s.value = u, E.emit(n, s)), !0) : !1;
    }
  });
  return v.set(t, n), E.emit(n, t), t;
}
function N(e, n) {
  g("data-ref", e).forEach((t) => {
    const s = t.getAttribute("data-ref");
    s && n[s] ? n[s].value = t : console.warn("The data-ref name was not found in: ", t);
  });
}
function b(e, n) {
  g("data-value", e).forEach((t) => {
    if (t instanceof HTMLInputElement) {
      const s = t.getAttribute("data-value") || null;
      if (s) {
        let u = w(s);
        const d = n[u];
        if (d) {
          t.value = d.value;
          const r = v.get(d);
          E.on(r, (i) => {
            t.value = i.value;
          });
        }
      }
    }
  });
}
function j(e, n) {
  const o = g("data-click", e);
  o.length && o.forEach((t) => {
    let s = t.getAttribute("data-click");
    if (s) {
      const m = w(s), u = n[m];
      u && t.addEventListener("click", function(d) {
        u(d);
      });
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function R(e, n) {
  const o = g("data-change", e);
  o.length && o.forEach((t) => {
    if (t) {
      let s = t.getAttribute("data-change");
      if (s) {
        const m = w(s), u = n[m];
        u && t.addEventListener("change", function(d) {
          u(d);
        });
      }
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function L(e, n) {
  const o = g("data-input", e);
  o.length && o.forEach((t) => {
    if (t) {
      let s = t.getAttribute("data-input");
      if (s) {
        const m = w(s), u = n[m];
        u && t.addEventListener("input", function(d) {
          u(d);
        });
      }
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        t
      );
  });
}
function S(e, n) {
  g("data-class", e).forEach((r) => {
    t(r);
  });
  function t(r) {
    let i = r.getAttribute("data-class");
    if (i) {
      let a;
      try {
        a = JSON.parse(i);
      } catch (c) {
        console.error("Error at JSON string: " + i), console.error(c);
      }
      if (Array.isArray(a))
        for (let c in a) {
          let l = a[c];
          const h = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(h);
          let x = f[1];
          const p = f[2], A = f[3];
          s(
            r,
            [p, A],
            x
          );
        }
      else if (T(a))
        for (let c in a) {
          let l = a[c];
          s(
            r,
            c,
            l
          );
        }
    } else
      console.warn("The data-class JSON string was not found in: ", r);
  }
  function s(r, i, a) {
    let c = !1;
    a[0] === "!" && (c = !0, a = a.slice(1));
    let l = w(a);
    const h = l.includes("!="), f = l.includes("==");
    h || f ? h ? m(
      l,
      /!=/,
      "!=",
      c,
      i,
      r
    ) : f && m(
      l,
      /==/,
      "==",
      c,
      i,
      r
    ) : u(
      l,
      !0,
      "==",
      c,
      i,
      r
    );
  }
  function m(r, i, a, c, l, h) {
    const f = D(r, i);
    if (f && f.length === 2) {
      const [x, p] = f;
      u(
        x,
        p,
        a,
        c,
        l,
        h
      );
    }
  }
  function u(r, i, a, c, l, h) {
    const f = n[r];
    if (!f)
      U(e, r);
    else {
      const x = I(f.value, i, a);
      d(x, l, h, c);
      const p = v.get(f);
      E.on(p, (A) => {
        const C = I(A.value, i, a);
        d(C, l, h, c);
      });
    }
  }
  function d(r, i, a, c = !1) {
    try {
      const l = r && !c || !r && c;
      if (typeof i == "string")
        l ? a.classList.add(i) : a.classList.remove(i);
      else if (Array.isArray(i)) {
        const [h, f] = i;
        l ? (a.classList.remove(f), a.classList.add(h)) : (a.classList.remove(h), a.classList.add(f));
      }
    } catch (l) {
      console.error(l);
    }
  }
}
function U(e, n) {
  const o = "#" + e.getAttribute("id") || "." + e.getAttribute("class");
  console.warn(
    `Ref ${n} is not exists at ${o}. Perhaps the component is located in another component.`
  );
}
function T(e) {
  return e !== null && typeof e == "object";
}
function w(e) {
  return e.replace(/^\w+\./, "");
}
function D(e, n) {
  const o = e.split(n);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function I(e, n, o) {
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
function g(e, n) {
  const o = n.querySelectorAll(`[${e}]`), t = [...Array.from(o)];
  return n.dataset && n.getAttribute(e) && t.push(n), t;
}
function P() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
    const n = Math.random() * 16 | 0;
    return (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
export {
  W as createComponent,
  O as createScope,
  E as emitter,
  F as ref
};
//# sourceMappingURL=index.mjs.map
