function A(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(t, s) {
    var r = e.get(t);
    r ? r.push(s) : e.set(t, [s]);
  }, off: function(t, s) {
    var r = e.get(t);
    r && (s ? r.splice(r.indexOf(s) >>> 0, 1) : e.set(t, []));
  }, emit: function(t, s) {
    var r = e.get(t);
    r && r.slice().map(function(n) {
      n(s);
    }), (r = e.get("*")) && r.slice().map(function(n) {
      n(t, s);
    });
  } };
}
const v = A();
let h = /* @__PURE__ */ new Map();
function T(e, t) {
  const s = document.getElementById(e);
  if (s) {
    const r = t();
    E(s, r), window[e] = r;
  } else
    throw Error("Нет wrapper: #" + e);
}
function S(e) {
  const t = `state_${crypto.randomUUID()}`;
  let s = { value: e };
  const r = new Proxy(s, {
    set(n, o, a) {
      return o === "value" ? (n.value = a, v.emit(t, n), !0) : !1;
    }
  });
  return h.set(r, t), v.emit(t, r), r;
}
function E(e, t) {
  e.querySelectorAll(
    "[data-class]"
  ).forEach((n) => {
    if (n.dataset.class) {
      let o = n.dataset.class;
      n.removeAttribute("data-class");
      const a = JSON.parse(o);
      if (Array.isArray(a))
        for (let i in a) {
          let c = a[i];
          const l = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/, u = c.match(l);
          let f = u[1];
          const d = u[2], m = u[3];
          r(n, [d, m], f);
        }
      else if (L(a))
        for (let i in a) {
          let c = a[i];
          r(n, i, c);
        }
    }
  });
  function r(n, o, a) {
    let i = !1;
    a[0] === "!" && (i = !0, a = a.slice(1));
    let c = H(a);
    if (c.includes("==")) {
      let l = x(c, /==/);
      if (l && l.length === 2) {
        const [u, f] = l;
        let d = t[u], m = d.value == f;
        p(m, o, n, i);
        let g = h.get(d);
        v.on(g, (y) => {
          if (y) {
            let j = y.value == f;
            p(j, o, n, i);
          }
        });
      }
    } else if (c.includes("!=")) {
      let l = x(c, /!=/);
      if (l && l.length === 2) {
        const [u, f] = l;
        let d = t[u], m = d.value != f;
        p(m, o, n, i);
        let g = h.get(d);
        v.on(g, (y) => {
          let j = y.value != f;
          p(j, o, n, i);
        });
      }
    } else {
      let l = t[c];
      p(l.value, o, n, i);
      let u = h.get(l);
      v.on(u, (f) => {
        p(f.value, o, n, i);
      });
    }
  }
}
function p(e, t, s, r = !1) {
  try {
    e && !r ? Array.isArray(t) ? (s.classList.remove(t[1]), s.classList.add(t[0])) : s.classList.add(t) : Array.isArray(t) ? (s.classList.remove(t[0]), s.classList.add(t[1])) : s.classList.remove(t);
  } catch (n) {
    console.error(n);
  }
}
function L(e) {
  return e !== null && typeof e == "object";
}
function H(e) {
  return e.replace(/^\w+\./, "");
}
function x(e, t) {
  const s = e.split(t);
  return s.length === 2 ? [s[0].trim(), s[1].trim()] : null;
}
export {
  T as createScope,
  S as ref
};
//# sourceMappingURL=index.mjs.map
