function S(t) {
  return { all: t = t || /* @__PURE__ */ new Map(), on: function(s, o) {
    var e = t.get(s);
    e ? e.push(o) : t.set(s, [o]);
  }, off: function(s, o) {
    var e = t.get(s);
    e && (o ? e.splice(e.indexOf(o) >>> 0, 1) : t.set(s, []));
  }, emit: function(s, o) {
    var e = t.get(s);
    e && e.slice().map(function(n) {
      n(o);
    }), (e = t.get("*")) && e.slice().map(function(n) {
      n(s, o);
    });
  } };
}
const C = S();
let A = /* @__PURE__ */ new Map();
function O(t, s, o = "") {
  const e = document.getElementById(t);
  if (e) {
    const n = s();
    I(e, n), R(e, n), N(e, n), j(e, n), o !== "" ? window[o] = n : window[t] = n;
  } else
    throw Error("Нет wrapper: #" + t);
}
function P(t, s) {
  const o = document.getElementsByClassName(
    t
  );
  for (let e of o)
    if (e) {
      const n = s();
      L(n) && (T(e, n), I(e, n), R(e, n), N(e, n), j(e, n));
    } else
      throw Error("Нет wrapper: ." + t);
}
function D(t) {
  const s = `state_${crypto.randomUUID()}`;
  let o = { value: t };
  const e = new Proxy(o, {
    set(n, h, d) {
      return h === "value" ? (n.value !== d && (n.value = d, C.emit(s, n)), !0) : !1;
    }
  });
  return A.set(e, s), C.emit(s, e), e;
}
function T(t, s) {
  x("[data-ref]", t).forEach((e) => {
    const n = e.getAttribute("data-ref");
    n ? s[n].value = e : console.warn("The data-ref name was not found in: ", e);
  });
}
function N(t, s) {
  x("[data-value]", t).forEach((e) => {
    if (e instanceof HTMLInputElement) {
      const n = e.dataset.value || null;
      if (n) {
        let d = v(n);
        const g = s[d];
        e.value = g.value;
        const r = A.get(g);
        C.on(r, (c) => {
          e.value = c.value;
        });
      }
    }
  });
}
function I(t, s) {
  const o = x("[data-click]", t);
  o.length && o.forEach((e) => {
    let n = e.dataset.click;
    if (n) {
      const h = v(n), d = s[h];
      e.addEventListener("click", function(g) {
        d();
      });
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        e
      );
  });
}
function j(t, s) {
  const o = x("[data-change]", t);
  o.length && o.forEach((e) => {
    let n = e.dataset.change;
    if (n) {
      const h = v(n), d = s[h];
      e.addEventListener("change", function(g) {
        d();
      });
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        e
      );
  });
}
function R(t, s) {
  x("[data-class]", t).forEach((r) => {
    e(r);
  });
  function e(r) {
    let c = r.dataset.class;
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
          const u = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(u);
          let m = f[1];
          const p = f[2], E = f[3];
          n(r, [p, E], m);
        }
      else if (L(a))
        for (let i in a) {
          let l = a[i];
          n(r, i, l);
        }
    } else
      console.warn("The data-class JSON string was not found in: ", r);
  }
  function n(r, c, a) {
    let i = !1;
    a[0] === "!" && (i = !0, a = a.slice(1));
    let l = v(a);
    const u = l.includes("!="), f = l.includes("==");
    u || f ? u ? h(
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
    ) : d(
      l,
      !0,
      "==",
      i,
      c,
      r
    );
  }
  function h(r, c, a, i, l, u) {
    const f = k(r, c);
    if (f && f.length === 2) {
      const [m, p] = f;
      d(
        m,
        p,
        a,
        i,
        l,
        u
      );
    }
  }
  function d(r, c, a, i, l, u) {
    const f = s[r];
    if (!f)
      b(t, r);
    else {
      const m = y(f.value, c, a);
      g(m, l, u, i);
      const p = A.get(f);
      C.on(p, (E) => {
        const w = y(E.value, c, a);
        g(w, l, u, i);
      });
    }
  }
  function g(r, c, a, i = !1) {
    try {
      const l = r && !i || !r && i;
      if (typeof c == "string")
        l ? a.classList.add(c) : a.classList.remove(c);
      else if (Array.isArray(c)) {
        const [u, f] = c;
        l ? (a.classList.remove(f), a.classList.add(u)) : (a.classList.remove(u), a.classList.add(f));
      }
    } catch (l) {
      console.error(l);
    }
  }
}
function b(t, s) {
  const o = "#" + t.getAttribute("id") || "." + t.getAttribute("class");
  console.warn(
    `Ref ${s} is not exists at ${o}. Perhaps the component is located in another component.`
  );
}
function L(t) {
  return t !== null && typeof t == "object";
}
function v(t) {
  return t.replace(/^\w+\./, "");
}
function k(t, s) {
  const o = t.split(s);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function y(t, s, o) {
  switch (o) {
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
function x(t, s) {
  const o = s.querySelectorAll(t), e = [...Array.from(o)];
  return s.dataset && s.dataset.ref && e.push(s), e;
}
export {
  P as createComponent,
  O as createScope,
  D as ref
};
//# sourceMappingURL=index.mjs.map
