function k(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(s, o) {
    var t = e.get(s);
    t ? t.push(o) : e.set(s, [o]);
  }, off: function(s, o) {
    var t = e.get(s);
    t && (o ? t.splice(t.indexOf(o) >>> 0, 1) : e.set(s, []));
  }, emit: function(s, o) {
    var t = e.get(s);
    t && t.slice().map(function(n) {
      n(o);
    }), (t = e.get("*")) && t.slice().map(function(n) {
      n(s, o);
    });
  } };
}
const E = k();
let y = /* @__PURE__ */ new Map();
function L(e, s, o = "") {
  const t = document.getElementById(e);
  if (t) {
    const n = s();
    j(t, n), S(t, n), A(t, n), o !== "" ? window[o] = n : window[e] = n;
  } else
    throw Error("Нет wrapper: #" + e);
}
function T(e, s) {
  const o = document.getElementsByClassName(
    e
  );
  for (let t of o)
    if (t) {
      const n = s();
      N(n) && (t.querySelectorAll(
        "[data-ref]"
      ).forEach((u) => {
        const m = u.getAttribute("data-ref");
        m ? n[m].value = u : console.warn(
          "The data-ref name was not found in: ",
          u
        );
      }), j(
        t,
        n
      ), S(
        t,
        n
      ), A(t, n));
    } else
      throw Error("Нет wrapper: ." + e);
}
function b(e) {
  const s = `state_${crypto.randomUUID()}`;
  let o = { value: e };
  const t = new Proxy(o, {
    set(n, p, u) {
      return p === "value" ? (n.value !== u && (n.value = u, E.emit(s, n)), !0) : !1;
    }
  });
  return y.set(t, s), E.emit(s, t), t;
}
function A(e, s) {
  e.querySelectorAll(
    "[data-value]"
  ).forEach((t) => {
    const n = t.dataset.value || null;
    if (n) {
      let u = v(n);
      const m = s[u];
      t.value = m.value;
      const a = y.get(m);
      E.on(a, (c) => {
        t.value = c.value;
      });
    }
  });
}
function j(e, s) {
  e.querySelectorAll(
    "[data-click]"
  ).forEach((t) => {
    t.addEventListener("click", function(n) {
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
function S(e, s) {
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
          const x = f[2], g = f[3];
          n(
            a,
            [x, g],
            h
          );
        }
      else if (N(r))
        for (let i in r) {
          let l = r[i];
          n(
            a,
            i,
            l
          );
        }
    } else
      console.warn("The data-class JSON string was not found in: ", a);
  }
  function n(a, c, r) {
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
    const f = I(a, c);
    if (f && f.length === 2) {
      const [h, x] = f;
      u(
        h,
        x,
        r,
        i,
        l,
        d
      );
    }
  }
  function u(a, c, r, i, l, d) {
    const f = s[a], h = C(f.value, c, r);
    m(h, l, d, i);
    const x = y.get(f);
    E.on(x, (g) => {
      const w = C(g.value, c, r);
      m(w, l, d, i);
    });
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
function N(e) {
  return e !== null && typeof e == "object";
}
function v(e) {
  return e.replace(/^\w+\./, "");
}
function I(e, s) {
  const o = e.split(s);
  return o.length === 2 ? [o[0].trim(), o[1].trim()] : null;
}
function C(e, s, o) {
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
  T as createComponent,
  L as createScope,
  b as ref
};
//# sourceMappingURL=index.mjs.map
