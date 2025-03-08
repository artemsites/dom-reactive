function j(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(t, r) {
    var s = e.get(t);
    s ? s.push(r) : e.set(t, [r]);
  }, off: function(t, r) {
    var s = e.get(t);
    s && (r ? s.splice(s.indexOf(r) >>> 0, 1) : e.set(t, []));
  }, emit: function(t, r) {
    var s = e.get(t);
    s && s.slice().map(function(c) {
      c(r);
    }), (s = e.get("*")) && s.slice().map(function(c) {
      c(t, r);
    });
  } };
}
const E = j();
let A = /* @__PURE__ */ new Map();
function I(e, t, r = "") {
  const s = document.getElementById(e);
  if (s) {
    const c = t();
    C(s, c), r !== "" ? window[r] = c : window[e] = c;
  } else
    throw Error("Нет wrapper: #" + e);
}
function L(e, t) {
  const r = document.getElementsByClassName(
    e
  );
  for (let s of r)
    if (s) {
      const c = t();
      S(c) && (s.querySelectorAll(
        "[data-ref]"
      ).forEach((d) => {
        const o = d.getAttribute("data-ref");
        o ? c[o].value = d : console.warn("The data-ref name was not found in: ", d);
      }), s.querySelectorAll(
        "[data-click]"
      ).forEach((d) => {
        d.addEventListener("click", function(o) {
          let a = d.dataset.click;
          if (a) {
            const n = c[a];
            n();
          } else
            console.warn(
              "The name of the data-click method was not found in: ",
              d
            );
        });
      }), C(s, c));
    } else
      throw Error("Нет wrapper: ." + e);
}
function T(e) {
  const t = `state_${crypto.randomUUID()}`;
  let r = { value: e };
  const s = new Proxy(r, {
    set(c, g, h) {
      return g === "value" ? (c.value !== h && (c.value = h, E.emit(t, c)), !0) : !1;
    }
  });
  return A.set(s, t), E.emit(t, s), s;
}
function C(e, t) {
  e.dataset && e.dataset.class && s(e), e.querySelectorAll(
    "[data-class]"
  ).forEach((o) => {
    s(o);
  });
  function s(o) {
    let a = o.dataset.class;
    if (a) {
      o.removeAttribute("data-class");
      let n;
      try {
        n = JSON.parse(a);
      } catch (i) {
        console.error("Error at JSON string: " + a), console.error(i);
      }
      if (Array.isArray(n))
        for (let i in n) {
          let l = n[i];
          const u = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, f = l.match(u);
          let m = f[1];
          const p = f[2], y = f[3];
          c(o, [p, y], m);
        }
      else if (S(n))
        for (let i in n) {
          let l = n[i];
          c(o, i, l);
        }
    } else
      console.warn("The data-class JSON string was not found in: ", o);
  }
  function c(o, a, n) {
    let i = !1;
    n[0] === "!" && (i = !0, n = n.slice(1));
    let l = N(n);
    const u = l.includes("!="), f = l.includes("==");
    u || f ? u ? g(
      l,
      /!=/,
      "!=",
      i,
      a,
      o
    ) : f && g(
      l,
      /==/,
      "==",
      i,
      a,
      o
    ) : h(
      l,
      !0,
      "==",
      i,
      a,
      o
    );
  }
  function g(o, a, n, i, l, u) {
    const f = v(o, a);
    if (f && f.length === 2) {
      const [m, p] = f;
      h(
        m,
        p,
        n,
        i,
        l,
        u
      );
    }
  }
  function h(o, a, n, i, l, u) {
    const f = t[o], m = w(f.value, a, n);
    d(m, l, u, i);
    const p = A.get(f);
    E.on(p, (y) => {
      const x = w(y.value, a, n);
      d(x, l, u, i);
    });
  }
  function d(o, a, n, i = !1) {
    try {
      const l = o && !i || !o && i;
      if (typeof a == "string")
        l ? n.classList.add(a) : n.classList.remove(a);
      else if (Array.isArray(a)) {
        const [u, f] = a;
        l ? (n.classList.remove(f), n.classList.add(u)) : (n.classList.remove(u), n.classList.add(f));
      }
    } catch (l) {
      console.error(l);
    }
  }
}
function S(e) {
  return e !== null && typeof e == "object";
}
function N(e) {
  return e.replace(/^\w+\./, "");
}
function v(e, t) {
  const r = e.split(t);
  return r.length === 2 ? [r[0].trim(), r[1].trim()] : null;
}
function w(e, t, r) {
  switch (r) {
    case "!=":
      return e != t;
    case "==":
      return e == t;
    case "<":
      return e < t;
    case ">":
      return e > t;
    case "<=":
      return e <= t;
    case ">=":
      return e >= t;
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
