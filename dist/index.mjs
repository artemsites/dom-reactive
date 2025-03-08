function k(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(s, o) {
    var t = e.get(s);
    t ? t.push(o) : e.set(s, [o]);
  }, off: function(s, o) {
    var t = e.get(s);
    t && (o ? t.splice(t.indexOf(o) >>> 0, 1) : e.set(s, []));
  }, emit: function(s, o) {
    var t = e.get(s);
    t && t.slice().map(function(r) {
      r(o);
    }), (t = e.get("*")) && t.slice().map(function(r) {
      r(s, o);
    });
  } };
}
const x = k();
let C = /* @__PURE__ */ new Map();
function I(e, s, o = "") {
  const t = document.getElementById(e);
  if (t) {
    const r = s();
    A(t, r), S(t, r), o !== "" ? window[o] = r : window[e] = r;
  } else
    throw Error("Нет wrapper: #" + e);
}
function L(e, s) {
  const o = document.getElementsByClassName(
    e
  );
  for (let t of o)
    if (t) {
      const r = s();
      N(r) && (t.querySelectorAll(
        "[data-ref]"
      ).forEach((d) => {
        const g = d.getAttribute("data-ref");
        g ? r[g].value = d : console.warn("The data-ref name was not found in: ", d);
      }), A(t, r), S(t, r));
    } else
      throw Error("Нет wrapper: ." + e);
}
function T(e) {
  const s = `state_${crypto.randomUUID()}`;
  let o = { value: e };
  const t = new Proxy(o, {
    set(r, m, d) {
      return m === "value" ? (r.value !== d && (r.value = d, x.emit(s, r)), !0) : !1;
    }
  });
  return C.set(t, s), x.emit(s, t), t;
}
function A(e, s) {
  e.querySelectorAll(
    "[data-click]"
  ).forEach((t) => {
    t.addEventListener("click", function(r) {
      let m = t.dataset.click;
      if (m) {
        const d = j(m), g = s[d];
        g();
      } else
        console.warn(
          "The name of the data-click method was not found in: ",
          t
        );
    });
  });
}
function S(e, s) {
  e.dataset && e.dataset.class && t(e), e.querySelectorAll(
    "[data-class]"
  ).forEach((i) => {
    t(i);
  });
  function t(i) {
    let l = i.dataset.class;
    if (l) {
      i.removeAttribute("data-class");
      let n;
      try {
        n = JSON.parse(l);
      } catch (a) {
        console.error("Error at JSON string: " + l), console.error(a);
      }
      if (Array.isArray(n))
        for (let a in n) {
          let c = n[a];
          const u = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = c.match(u);
          let p = f[1];
          const h = f[2], y = f[3];
          r(i, [h, y], p);
        }
      else if (N(n))
        for (let a in n) {
          let c = n[a];
          r(i, a, c);
        }
    } else
      console.warn("The data-class JSON string was not found in: ", i);
  }
  function r(i, l, n) {
    let a = !1;
    n[0] === "!" && (a = !0, n = n.slice(1));
    let c = j(n);
    const u = c.includes("!="), f = c.includes("==");
    u || f ? u ? m(
      c,
      /!=/,
      "!=",
      a,
      l,
      i
    ) : f && m(
      c,
      /==/,
      "==",
      a,
      l,
      i
    ) : d(
      c,
      !0,
      "==",
      a,
      l,
      i
    );
  }
  function m(i, l, n, a, c, u) {
    const f = v(i, l);
    if (f && f.length === 2) {
      const [p, h] = f;
      d(
        p,
        h,
        n,
        a,
        c,
        u
      );
    }
  }
  function d(i, l, n, a, c, u) {
    const f = s[i], p = w(f.value, l, n);
    g(p, c, u, a);
    const h = C.get(f);
    x.on(h, (y) => {
      const E = w(y.value, l, n);
      g(E, c, u, a);
    });
  }
  function g(i, l, n, a = !1) {
    try {
      const c = i && !a || !i && a;
      if (typeof l == "string")
        c ? n.classList.add(l) : n.classList.remove(l);
      else if (Array.isArray(l)) {
        const [u, f] = l;
        c ? (n.classList.remove(f), n.classList.add(u)) : (n.classList.remove(u), n.classList.add(f));
      }
    } catch (c) {
      console.error(c);
    }
  }
}
function N(e) {
  return e !== null && typeof e == "object";
}
function j(e) {
  return e.replace(/^\w+\./, "");
}
function v(e, s) {
  const o = e.split(s);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function w(e, s, o) {
  switch (o) {
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
  I as createScope,
  T as ref
};
//# sourceMappingURL=index.mjs.map
