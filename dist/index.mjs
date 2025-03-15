function L(t) {
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
const A = L();
let v = /* @__PURE__ */ new Map();
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
      b(n) && (S(e, n), I(e, n), R(e, n), N(
        e,
        n
      ), j(e, n));
    } else
      throw Error("Нет wrapper: ." + t);
}
function D(t) {
  const s = `state_${crypto.randomUUID()}`;
  let o = { value: t };
  const e = new Proxy(o, {
    set(n, m, u) {
      return m === "value" ? (n.value !== u && (n.value = u, A.emit(s, n)), !0) : !1;
    }
  });
  return v.set(e, s), A.emit(s, e), e;
}
function S(t, s) {
  x("data-ref", t).forEach((e) => {
    const n = e.getAttribute("data-ref");
    n ? s[n].value = e : console.warn("The data-ref name was not found in: ", e);
  });
}
function N(t, s) {
  x("data-value", t).forEach((e) => {
    if (e instanceof HTMLInputElement) {
      const n = e.dataset.value || null;
      if (n) {
        let u = C(n);
        const g = s[u];
        e.value = g.value;
        const r = v.get(g);
        A.on(r, (c) => {
          e.value = c.value;
        });
      }
    }
  });
}
function I(t, s) {
  const o = x("data-click", t);
  o.length && o.forEach((e) => {
    let n = e.dataset.click;
    if (n) {
      const m = C(n), u = s[m];
      e.addEventListener("click", function(g) {
        u();
      });
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        e
      );
  });
}
function j(t, s) {
  const o = x("data-change", t);
  o.length && o.forEach((e) => {
    if (e) {
      let n = e.dataset.change;
      if (n) {
        const m = C(n), u = s[m];
        u && e.addEventListener("change", function(g) {
          u();
        });
      }
    } else
      console.warn(
        "The name of the data-click method was not found in: ",
        e
      );
  });
}
function R(t, s) {
  x("data-class", t).forEach((r) => {
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
          const d = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(d);
          let h = f[1];
          const p = f[2], E = f[3];
          n(
            r,
            [p, E],
            h
          );
        }
      else if (b(a))
        for (let i in a) {
          let l = a[i];
          n(
            r,
            i,
            l
          );
        }
    } else
      console.warn("The data-class JSON string was not found in: ", r);
  }
  function n(r, c, a) {
    let i = !1;
    a[0] === "!" && (i = !0, a = a.slice(1));
    let l = C(a);
    const d = l.includes("!="), f = l.includes("==");
    d || f ? d ? m(
      l,
      /!=/,
      "!=",
      i,
      c,
      r
    ) : f && m(
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
  function m(r, c, a, i, l, d) {
    const f = k(r, c);
    if (f && f.length === 2) {
      const [h, p] = f;
      u(
        h,
        p,
        a,
        i,
        l,
        d
      );
    }
  }
  function u(r, c, a, i, l, d) {
    const f = s[r];
    if (!f)
      T(t, r);
    else {
      const h = w(f.value, c, a);
      g(h, l, d, i);
      const p = v.get(f);
      A.on(p, (E) => {
        const y = w(E.value, c, a);
        g(y, l, d, i);
      });
    }
  }
  function g(r, c, a, i = !1) {
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
function T(t, s) {
  const o = "#" + t.getAttribute("id") || "." + t.getAttribute("class");
  console.warn(
    `Ref ${s} is not exists at ${o}. Perhaps the component is located in another component.`
  );
}
function b(t) {
  return t !== null && typeof t == "object";
}
function C(t) {
  return t.replace(/^\w+\./, "");
}
function k(t, s) {
  const o = t.split(s);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function w(t, s, o) {
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
  const o = s.querySelectorAll(`[${t}]`), e = [...Array.from(o)];
  return s.dataset && s.getAttribute(t) && e.push(s), e;
}
export {
  P as createComponent,
  O as createScope,
  D as ref
};
//# sourceMappingURL=index.mjs.map
