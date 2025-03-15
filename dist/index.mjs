function I(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(s, n) {
    var t = e.get(s);
    t ? t.push(n) : e.set(s, [n]);
  }, off: function(s, n) {
    var t = e.get(s);
    t && (n ? t.splice(t.indexOf(n) >>> 0, 1) : e.set(s, []));
  }, emit: function(s, n) {
    var t = e.get(s);
    t && t.slice().map(function(o) {
      o(n);
    }), (t = e.get("*")) && t.slice().map(function(o) {
      o(s, n);
    });
  } };
}
const E = I();
let y = /* @__PURE__ */ new Map();
function R(e, s, n = "") {
  const t = document.getElementById(e);
  if (t) {
    const o = s();
    S(t, o), j(t, o), C(t, o), n !== "" ? window[n] = o : window[e] = o;
  } else
    throw Error("Нет wrapper: #" + e);
}
function L(e, s) {
  const n = document.getElementsByClassName(
    e
  );
  for (let t of n)
    if (t) {
      const o = s();
      N(o) && (t.querySelectorAll(
        "[data-ref]"
      ).forEach((u) => {
        const m = u.getAttribute("data-ref");
        m ? o[m].value = u : console.warn(
          "The data-ref name was not found in: ",
          u
        );
      }), S(
        t,
        o
      ), j(
        t,
        o
      ), C(t, o));
    } else
      throw Error("Нет wrapper: ." + e);
}
function T(e) {
  const s = `state_${crypto.randomUUID()}`;
  let n = { value: e };
  const t = new Proxy(n, {
    set(o, p, u) {
      return p === "value" ? (o.value !== u && (o.value = u, E.emit(s, o)), !0) : !1;
    }
  });
  return y.set(t, s), E.emit(s, t), t;
}
function C(e, s) {
  e.querySelectorAll(
    "[data-value]"
  ).forEach((t) => {
    const o = t.dataset.value || null;
    if (o) {
      let u = v(o);
      const m = s[u];
      t.value = m.value;
      const a = y.get(m);
      E.on(a, (c) => {
        t.value = c.value;
      });
    }
  });
}
function S(e, s) {
  e.querySelectorAll(
    "[data-click]"
  ).forEach((t) => {
    t.addEventListener("click", function(o) {
      let p = t.dataset.click;
      if (p) {
        const u = v(p), m = s[u];
        m();
      } else
        console.warn(
          "The name of the data-click method was not found in: ",
          t
        );
    });
  });
}
function j(e, s) {
  e.dataset && e.dataset.class && t(e), e.querySelectorAll(
    "[data-class]"
  ).forEach((a) => {
    t(a);
  });
  function t(a) {
    let c = a.dataset.class;
    if (c) {
      a.removeAttribute("data-class");
      let r;
      try {
        r = JSON.parse(c);
      } catch (i) {
        console.error("Error at JSON string: " + c), console.error(i);
      }
      if (Array.isArray(r))
        for (let i in r) {
          let l = r[i];
          const d = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(d);
          let h = f[1];
          const g = f[2], x = f[3];
          o(
            a,
            [g, x],
            h
          );
        }
      else if (N(r))
        for (let i in r) {
          let l = r[i];
          o(
            a,
            i,
            l
          );
        }
    } else
      console.warn("The data-class JSON string was not found in: ", a);
  }
  function o(a, c, r) {
    let i = !1;
    r[0] === "!" && (i = !0, r = r.slice(1));
    let l = v(r);
    const d = l.includes("!="), f = l.includes("==");
    d || f ? d ? p(
      l,
      /!=/,
      "!=",
      i,
      c,
      a
    ) : f && p(
      l,
      /==/,
      "==",
      i,
      c,
      a
    ) : u(
      l,
      !0,
      "==",
      i,
      c,
      a
    );
  }
  function p(a, c, r, i, l, d) {
    const f = k(a, c);
    if (f && f.length === 2) {
      const [h, g] = f;
      u(
        h,
        g,
        r,
        i,
        l,
        d
      );
    }
  }
  function u(a, c, r, i, l, d) {
    const f = s[a];
    if (!f)
      b(e, a);
    else {
      const h = w(f.value, c, r);
      m(h, l, d, i);
      const g = y.get(f);
      E.on(g, (x) => {
        const A = w(x.value, c, r);
        m(A, l, d, i);
      });
    }
  }
  function m(a, c, r, i = !1) {
    try {
      const l = a && !i || !a && i;
      if (typeof c == "string")
        l ? r.classList.add(c) : r.classList.remove(c);
      else if (Array.isArray(c)) {
        const [d, f] = c;
        l ? (r.classList.remove(f), r.classList.add(d)) : (r.classList.remove(d), r.classList.add(f));
      }
    } catch (l) {
      console.error(l);
    }
  }
}
function b(e, s) {
  const n = "#" + e.getAttribute("id") || "." + e.getAttribute("class");
  console.warn(`Ref ${s} is not exists at ${n}. Perhaps the component is located in another component.`);
}
function N(e) {
  return e !== null && typeof e == "object";
}
function v(e) {
  return e.replace(/^\w+\./, "");
}
function k(e, s) {
  const n = e.split(s);
  return n.length === 2 ? [n[0].trim(), n[1].trim()] : null;
}
function w(e, s, n) {
  switch (n) {
    case "!=":
      return e != s;
    case "==":
      return e == s;
    case "<":
      return e < s;
    case ">":
      return e > s;
    case "<=":
      return e <= s;
    case ">=":
      return e >= s;
    default:
      throw new Error("Invalid operator");
  }
}
export {
  L as createComponent,
  R as createScope,
  T as ref
};
//# sourceMappingURL=index.mjs.map
