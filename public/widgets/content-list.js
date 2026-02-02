const Bd = Object.create; const Ri = Object.defineProperty; const qd = Object.getOwnPropertyDescriptor; const Yd = Object.getOwnPropertyNames; const rd = Object.getPrototypeOf; const Gd = Object.prototype.hasOwnProperty; const $l = (l, t) => () => (t || l((t = { exports: {} }).exports, t), t.exports); const Xd = (l, t, u, a) => {
  if (t && typeof t == 'object' || typeof t == 'function') {
    for (const n of Yd(t)) {
      !Gd.call(l, n) && n !== u && Ri(l, n, { get: () => t[n], enumerable: !(a = qd(t, n)) || a.enumerable });
    }
  } return l;
}; const bu = (l, t, u) => (u = l != null ? Bd(rd(l)) : {}, Xd(t || !l || !l.__esModule ? Ri(u, 'default', { value: l, enumerable: !0 }) : u, l)); const Zi = $l((w) => {
  'use strict'; function $e(l, t) {
    let u = l.length; l.push(t); l:for (;u > 0;) {
      const a = u - 1 >>> 1; const n = l[a]; if (hn(n, t) > 0) {
        l[a] = t, l[u] = n, u = a;
      } else {
        break l;
      }
    }
  } function Fl(l) {
    return l.length === 0 ? null : l[0];
  } function gn(l) {
    if (l.length === 0) {
      return null;
    } const t = l[0]; const u = l.pop(); if (u !== t) {
      l[0] = u; l:for (let a = 0, n = l.length, e = n >>> 1; a < e;) {
        const f = 2 * (a + 1) - 1; const c = l[f]; const i = f + 1; const d = l[i]; if (hn(c, u) < 0) {
          i < n && hn(d, c) < 0 ? (l[a] = d, l[i] = u, a = i) : (l[a] = c, l[f] = u, a = f);
        } else if (i < n && hn(d, u) < 0) {
          l[a] = d, l[i] = u, a = i;
        } else {
          break l;
        }
      }
    } return t;
  } function hn(l, t) {
    const u = l.sortIndex - t.sortIndex; return u !== 0 ? u : l.id - t.id;
  }w.unstable_now = void 0; typeof performance == 'object' && typeof performance.now == 'function'
    ? (Bi = performance, w.unstable_now = function () {
        return Bi.now();
      })
    : (Je = Date, qi = Je.now(), w.unstable_now = function () {
        return Je.now() - qi;
      }); let Bi; let Je; let qi; const at = []; const Ot = []; let Qd = 1; let Yl = null; let hl = 3; let Fe = !1; let da = !1; let oa = !1; let ke = !1; const Gi = typeof setTimeout == 'function' ? setTimeout : null; const Xi = typeof clearTimeout == 'function' ? clearTimeout : null; const Yi = typeof setImmediate < 'u' ? setImmediate : null; function sn(l) {
    for (let t = Fl(Ot); t !== null;) {
      if (t.callback === null) {
        gn(Ot);
      } else if (t.startTime <= l) {
        gn(Ot), t.sortIndex = t.expirationTime, $e(at, t);
      } else {
        break;
      }t = Fl(Ot);
    }
  } function Ie(l) {
    if (oa = !1, sn(l), !da) {
      if (Fl(at) !== null) {
        da = !0, Tu || (Tu = !0, zu());
      } else {
        const t = Fl(Ot); t !== null && Pe(Ie, t.startTime - l);
      }
    }
  } var Tu = !1; let ma = -1; let Qi = 5; let xi = -1; function ji() {
    return ke ? !0 : !(w.unstable_now() - xi < Qi);
  } function we() {
    if (ke = !1, Tu) {
      let l = w.unstable_now(); xi = l; let t = !0; try {
        l: {
          da = !1, oa && (oa = !1, Xi(ma), ma = -1), Fe = !0; const u = hl; try {
            t: {
              for (sn(l), Yl = Fl(at); Yl !== null && !(Yl.expirationTime > l && ji());) {
                const a = Yl.callback; if (typeof a == 'function') {
                  Yl.callback = null, hl = Yl.priorityLevel; const n = a(Yl.expirationTime <= l); if (l = w.unstable_now(), typeof n == 'function') {
                    Yl.callback = n, sn(l), t = !0; break t;
                  }Yl === Fl(at) && gn(at), sn(l);
                } else {
                  gn(at);
                }Yl = Fl(at);
              } if (Yl !== null) {
                t = !0;
              } else {
                const e = Fl(Ot); e !== null && Pe(Ie, e.startTime - l), t = !1;
              }
            } break l;
          } finally {
            Yl = null, hl = u, Fe = !1;
          }t = void 0;
        }
      } finally {
        t ? zu() : Tu = !1;
      }
    }
  } let zu; typeof Yi == 'function'
    ? zu = function () {
      Yi(we);
    }
    : typeof MessageChannel < 'u'
      ? (We = new MessageChannel(), ri = We.port2, We.port1.onmessage = we, zu = function () {
          ri.postMessage(null);
        })
      : zu = function () {
        Gi(we, 0);
      }; let We, ri; function Pe(l, t) {
    ma = Gi(() => {
      l(w.unstable_now());
    }, t);
  }w.unstable_IdlePriority = 5; w.unstable_ImmediatePriority = 1; w.unstable_LowPriority = 4; w.unstable_NormalPriority = 3; w.unstable_Profiling = null; w.unstable_UserBlockingPriority = 2; w.unstable_cancelCallback = function (l) {
    l.callback = null;
  }; w.unstable_forceFrameRate = function (l) {
    l < 0 || l > 125 ? console.error('forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported') : Qi = l > 0 ? Math.floor(1e3 / l) : 5;
  }; w.unstable_getCurrentPriorityLevel = function () {
    return hl;
  }; w.unstable_next = function (l) {
    switch (hl) {
      case 1:case 2:case 3:var t = 3; break; default:t = hl;
    } const u = hl; hl = t; try {
      return l();
    } finally {
      hl = u;
    }
  }; w.unstable_requestPaint = function () {
    ke = !0;
  }; w.unstable_runWithPriority = function (l, t) {
    switch (l) {
      case 1:case 2:case 3:case 4:case 5:break; default:l = 3;
    } const u = hl; hl = l; try {
      return t();
    } finally {
      hl = u;
    }
  }; w.unstable_scheduleCallback = function (l, t, u) {
    const a = w.unstable_now(); switch (typeof u == 'object' && u !== null ? (u = u.delay, u = typeof u == 'number' && u > 0 ? a + u : a) : u = a, l) {
      case 1:var n = -1; break; case 2:n = 250; break; case 5:n = 1073741823; break; case 4:n = 1e4; break; default:n = 5e3;
    } return n = u + n, l = { id: Qd++, callback: t, priorityLevel: l, startTime: u, expirationTime: n, sortIndex: -1 }, u > a ? (l.sortIndex = u, $e(Ot, l), Fl(at) === null && l === Fl(Ot) && (oa ? (Xi(ma), ma = -1) : oa = !0, Pe(Ie, u - a))) : (l.sortIndex = n, $e(at, l), da || Fe || (da = !0, Tu || (Tu = !0, zu()))), l;
  }; w.unstable_shouldYield = ji; w.unstable_wrapCallback = function (l) {
    const t = hl; return function () {
      const u = hl; hl = t; try {
        return l.apply(this, arguments);
      } finally {
        hl = u;
      }
    };
  };
}); const Li = $l((Gh, Vi) => {
  'use strict'; Vi.exports = Zi();
}); const t0 = $l((M) => {
  'use strict'; const uf = Symbol.for('react.transitional.element'); const xd = Symbol.for('react.portal'); const jd = Symbol.for('react.fragment'); const Zd = Symbol.for('react.strict_mode'); const Vd = Symbol.for('react.profiler'); const Ld = Symbol.for('react.consumer'); const Kd = Symbol.for('react.context'); const Jd = Symbol.for('react.forward_ref'); const wd = Symbol.for('react.suspense'); const Wd = Symbol.for('react.memo'); const $i = Symbol.for('react.lazy'); const $d = Symbol.for('react.activity'); const Ki = Symbol.iterator; function Fd(l) {
    return l === null || typeof l != 'object' ? null : (l = Ki && l[Ki] || l['@@iterator'], typeof l == 'function' ? l : null);
  } const Fi = { isMounted() {
    return !1;
  }, enqueueForceUpdate() {}, enqueueReplaceState() {}, enqueueSetState() {} }; const ki = Object.assign; const Ii = {}; function Au(l, t, u) {
    this.props = l, this.context = t, this.refs = Ii, this.updater = u || Fi;
  }Au.prototype.isReactComponent = {}; Au.prototype.setState = function (l, t) {
    if (typeof l != 'object' && typeof l != 'function' && l != null) {
      throw new Error('takes an object of state variables to update or a function which returns an object of state variables.');
    } this.updater.enqueueSetState(this, l, t, 'setState');
  }; Au.prototype.forceUpdate = function (l) {
    this.updater.enqueueForceUpdate(this, l, 'forceUpdate');
  }; function Pi() {}Pi.prototype = Au.prototype; function af(l, t, u) {
    this.props = l, this.context = t, this.refs = Ii, this.updater = u || Fi;
  } const nf = af.prototype = new Pi(); nf.constructor = af; ki(nf, Au.prototype); nf.isPureReactComponent = !0; const Ji = Array.isArray; function tf() {} const V = { H: null, A: null, T: null, S: null }; const l0 = Object.prototype.hasOwnProperty; function ef(l, t, u) {
    const a = u.ref; return { $$typeof: uf, type: l, key: t, ref: a !== void 0 ? a : null, props: u };
  } function kd(l, t) {
    return ef(l.type, t, l.props);
  } function ff(l) {
    return typeof l == 'object' && l !== null && l.$$typeof === uf;
  } function Id(l) {
    const t = { '=': '=0', ':': '=2' }; return `$${l.replace(/[=:]/g, (u) => {
      return t[u];
    })}`;
  } const wi = /\/+/g; function lf(l, t) {
    return typeof l == 'object' && l !== null && l.key != null ? Id(`${l.key}`) : t.toString(36);
  } function Pd(l) {
    switch (l.status) {
      case 'fulfilled':return l.value; case 'rejected':throw l.reason; default:switch (typeof l.status == 'string'
        ? l.then(tf, tf)
        : (l.status = 'pending', l.then((t) => {
            l.status === 'pending' && (l.status = 'fulfilled', l.value = t);
          }, (t) => {
            l.status === 'pending' && (l.status = 'rejected', l.reason = t);
          })), l.status) {
        case 'fulfilled':return l.value; case 'rejected':throw l.reason;
      }
    } throw l;
  } function Eu(l, t, u, a, n) {
    let e = typeof l; (e === 'undefined' || e === 'boolean') && (l = null); let f = !1; if (l === null) {
      f = !0;
    } else {
      switch (e) {
        case 'bigint':case 'string':case 'number':f = !0; break; case 'object':switch (l.$$typeof) {
          case uf:case xd:f = !0; break; case $i:return f = l._init, Eu(f(l._payload), t, u, a, n);
        }
      }
    } if (f) {
      return n = n(l), f = a === '' ? `.${lf(l, 0)}` : a, Ji(n)
        ? (u = '', f != null && (u = `${f.replace(wi, '$&/')}/`), Eu(n, t, u, '', (d) => {
            return d;
          }))
        : n != null && (ff(n) && (n = kd(n, u + (n.key == null || l && l.key === n.key ? '' : `${(`${n.key}`).replace(wi, '$&/')}/`) + f)), t.push(n)), 1;
    } f = 0; const c = a === '' ? '.' : `${a}:`; if (Ji(l)) {
      for (var i = 0; i < l.length; i++) {
        a = l[i], e = c + lf(a, i), f += Eu(a, t, u, e, n);
      }
    } else if (i = Fd(l), typeof i == 'function') {
      for (l = i.call(l), i = 0; !(a = l.next()).done;) {
        a = a.value, e = c + lf(a, i++), f += Eu(a, t, u, e, n);
      }
    } else if (e === 'object') {
      if (typeof l.then == 'function') {
        return Eu(Pd(l), t, u, a, n);
      } throw t = String(l), new Error(`Objects are not valid as a React child (found: ${t === '[object Object]' ? `object with keys {${Object.keys(l).join(', ')}}` : t}). If you meant to render a collection of children, use an array instead.`);
    } return f;
  } function Sn(l, t, u) {
    if (l == null) {
      return l;
    } const a = []; let n = 0; return Eu(l, a, '', '', (e) => {
      return t.call(u, e, n++);
    }), a;
  } function lo(l) {
    if (l._status === -1) {
      let t = l._result; t = t(), t.then((u) => {
        (l._status === 0 || l._status === -1) && (l._status = 1, l._result = u);
      }, (u) => {
        (l._status === 0 || l._status === -1) && (l._status = 2, l._result = u);
      }), l._status === -1 && (l._status = 0, l._result = t);
    } if (l._status === 1) {
      return l._result.default;
    } throw l._result;
  } const Wi = typeof reportError == 'function'
    ? reportError
    : function (l) {
      if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
        const t = new window.ErrorEvent('error', { bubbles: !0, cancelable: !0, message: typeof l == 'object' && l !== null && typeof l.message == 'string' ? String(l.message) : String(l), error: l }); if (!window.dispatchEvent(t)) {
          return;
        }
      } else if (typeof process == 'object' && typeof process.emit == 'function') {
        process.emit('uncaughtException', l); return;
      }console.error(l);
    }; const to = { map: Sn, forEach(l, t, u) {
    Sn(l, function () {
      t.apply(this, arguments);
    }, u);
  }, count(l) {
    let t = 0; return Sn(l, () => {
      t++;
    }), t;
  }, toArray(l) {
    return Sn(l, (t) => {
      return t;
    }) || [];
  }, only(l) {
    if (!ff(l)) {
      throw new Error('React.Children.only expected to receive a single React element child.');
    } return l;
  } }; M.Activity = $d; M.Children = to; M.Component = Au; M.Fragment = jd; M.Profiler = Vd; M.PureComponent = af; M.StrictMode = Zd; M.Suspense = wd; M.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V; M.__COMPILER_RUNTIME = { __proto__: null, c(l) {
    return V.H.useMemoCache(l);
  } }; M.cache = function (l) {
    return function () {
      return l.apply(null, arguments);
    };
  }; M.cacheSignal = function () {
    return null;
  }; M.cloneElement = function (l, t, u) {
    if (l == null) {
      throw new Error(`The argument must be a React element, but you passed ${l}.`);
    } const a = ki({}, l.props); let n = l.key; if (t != null) {
      for (e in t.key !== void 0 && (n = `${t.key}`), t) {
        !l0.call(t, e) || e === 'key' || e === '__self' || e === '__source' || e === 'ref' && t.ref === void 0 || (a[e] = t[e]);
      }
    } var e = arguments.length - 2; if (e === 1) {
      a.children = u;
    } else if (e > 1) {
      for (var f = new Array(e), c = 0; c < e; c++) {
        f[c] = arguments[c + 2];
      }a.children = f;
    } return ef(l.type, n, a);
  }; M.createContext = function (l) {
    return l = { $$typeof: Kd, _currentValue: l, _currentValue2: l, _threadCount: 0, Provider: null, Consumer: null }, l.Provider = l, l.Consumer = { $$typeof: Ld, _context: l }, l;
  }; M.createElement = function (l, t, u) {
    let a; const n = {}; let e = null; if (t != null) {
      for (a in t.key !== void 0 && (e = `${t.key}`), t) {
        l0.call(t, a) && a !== 'key' && a !== '__self' && a !== '__source' && (n[a] = t[a]);
      }
    } let f = arguments.length - 2; if (f === 1) {
      n.children = u;
    } else if (f > 1) {
      for (var c = new Array(f), i = 0; i < f; i++) {
        c[i] = arguments[i + 2];
      }n.children = c;
    } if (l && l.defaultProps) {
      for (a in f = l.defaultProps, f) {
        n[a] === void 0 && (n[a] = f[a]);
      }
    } return ef(l, e, n);
  }; M.createRef = function () {
    return { current: null };
  }; M.forwardRef = function (l) {
    return { $$typeof: Jd, render: l };
  }; M.isValidElement = ff; M.lazy = function (l) {
    return { $$typeof: $i, _payload: { _status: -1, _result: l }, _init: lo };
  }; M.memo = function (l, t) {
    return { $$typeof: Wd, type: l, compare: t === void 0 ? null : t };
  }; M.startTransition = function (l) {
    const t = V.T; const u = {}; V.T = u; try {
      const a = l(); const n = V.S; n !== null && n(u, a), typeof a == 'object' && a !== null && typeof a.then == 'function' && a.then(tf, Wi);
    } catch (e) {
      Wi(e);
    } finally {
      t !== null && u.types !== null && (t.types = u.types), V.T = t;
    }
  }; M.unstable_useCacheRefresh = function () {
    return V.H.useCacheRefresh();
  }; M.use = function (l) {
    return V.H.use(l);
  }; M.useActionState = function (l, t, u) {
    return V.H.useActionState(l, t, u);
  }; M.useCallback = function (l, t) {
    return V.H.useCallback(l, t);
  }; M.useContext = function (l) {
    return V.H.use(l);
  }; M.useDebugValue = function () {}; M.useDeferredValue = function (l, t) {
    return V.H.useDeferredValue(l, t);
  }; M.useEffect = function (l, t) {
    return V.H.useEffect(l, t);
  }; M.useEffectEvent = function (l) {
    return V.H.useEffectEvent(l);
  }; M.useId = function () {
    return V.H.useId();
  }; M.useImperativeHandle = function (l, t, u) {
    return V.H.useImperativeHandle(l, t, u);
  }; M.useInsertionEffect = function (l, t) {
    return V.H.useInsertionEffect(l, t);
  }; M.useLayoutEffect = function (l, t) {
    return V.H.useLayoutEffect(l, t);
  }; M.useMemo = function (l, t) {
    return V.H.useMemo(l, t);
  }; M.useOptimistic = function (l, t) {
    return V.H.useOptimistic(l, t);
  }; M.useReducer = function (l, t, u) {
    return V.H.useReducer(l, t, u);
  }; M.useRef = function (l) {
    return V.H.useRef(l);
  }; M.useState = function (l) {
    return V.H.useState(l);
  }; M.useSyncExternalStore = function (l, t, u) {
    return V.H.useSyncExternalStore(l, t, u);
  }; M.useTransition = function () {
    return V.H.useTransition();
  }; M.version = '19.2.3';
}); const bn = $l((Qh, u0) => {
  'use strict'; u0.exports = t0();
}); const n0 = $l((gl) => {
  'use strict'; const uo = bn(); function a0(l) {
    let t = `https://react.dev/errors/${l}`; if (arguments.length > 1) {
      t += `?args[]=${encodeURIComponent(arguments[1])}`; for (let u = 2; u < arguments.length; u++) {
        t += `&args[]=${encodeURIComponent(arguments[u])}`;
      }
    } return `Minified React error #${l}; visit ${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`;
  } function Mt() {} const sl = { d: { f: Mt, r() {
    throw new Error(a0(522));
  }, D: Mt, C: Mt, L: Mt, m: Mt, X: Mt, S: Mt, M: Mt }, p: 0, findDOMNode: null }; const ao = Symbol.for('react.portal'); function no(l, t, u) {
    const a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null; return { $$typeof: ao, key: a == null ? null : `${a}`, children: l, containerInfo: t, implementation: u };
  } const ha = uo.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE; function zn(l, t) {
    if (l === 'font') {
      return '';
    } if (typeof t == 'string') {
      return t === 'use-credentials' ? t : '';
    }
  }gl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = sl; gl.createPortal = function (l, t) {
    const u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null; if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) {
      throw new Error(a0(299));
    } return no(l, t, null, u);
  }; gl.flushSync = function (l) {
    const t = ha.T; const u = sl.p; try {
      if (ha.T = null, sl.p = 2, l) {
        return l();
      }
    } finally {
      ha.T = t, sl.p = u, sl.d.f();
    }
  }; gl.preconnect = function (l, t) {
    typeof l == 'string' && (t ? (t = t.crossOrigin, t = typeof t == 'string' ? t === 'use-credentials' ? t : '' : void 0) : t = null, sl.d.C(l, t));
  }; gl.prefetchDNS = function (l) {
    typeof l == 'string' && sl.d.D(l);
  }; gl.preinit = function (l, t) {
    if (typeof l == 'string' && t && typeof t.as == 'string') {
      const u = t.as; const a = zn(u, t.crossOrigin); const n = typeof t.integrity == 'string' ? t.integrity : void 0; const e = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0; u === 'style' ? sl.d.S(l, typeof t.precedence == 'string' ? t.precedence : void 0, { crossOrigin: a, integrity: n, fetchPriority: e }) : u === 'script' && sl.d.X(l, { crossOrigin: a, integrity: n, fetchPriority: e, nonce: typeof t.nonce == 'string' ? t.nonce : void 0 });
    }
  }; gl.preinitModule = function (l, t) {
    if (typeof l == 'string') {
      if (typeof t == 'object' && t !== null) {
        if (t.as == null || t.as === 'script') {
          const u = zn(t.as, t.crossOrigin); sl.d.M(l, { crossOrigin: u, integrity: typeof t.integrity == 'string' ? t.integrity : void 0, nonce: typeof t.nonce == 'string' ? t.nonce : void 0 });
        }
      } else {
        t == null && sl.d.M(l);
      }
    }
  }; gl.preload = function (l, t) {
    if (typeof l == 'string' && typeof t == 'object' && t !== null && typeof t.as == 'string') {
      const u = t.as; const a = zn(u, t.crossOrigin); sl.d.L(l, u, { crossOrigin: a, integrity: typeof t.integrity == 'string' ? t.integrity : void 0, nonce: typeof t.nonce == 'string' ? t.nonce : void 0, type: typeof t.type == 'string' ? t.type : void 0, fetchPriority: typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0, referrerPolicy: typeof t.referrerPolicy == 'string' ? t.referrerPolicy : void 0, imageSrcSet: typeof t.imageSrcSet == 'string' ? t.imageSrcSet : void 0, imageSizes: typeof t.imageSizes == 'string' ? t.imageSizes : void 0, media: typeof t.media == 'string' ? t.media : void 0 });
    }
  }; gl.preloadModule = function (l, t) {
    if (typeof l == 'string') {
      if (t) {
        const u = zn(t.as, t.crossOrigin); sl.d.m(l, { as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0, crossOrigin: u, integrity: typeof t.integrity == 'string' ? t.integrity : void 0 });
      } else {
        sl.d.m(l);
      }
    }
  }; gl.requestFormReset = function (l) {
    sl.d.r(l);
  }; gl.unstable_batchedUpdates = function (l, t) {
    return l(t);
  }; gl.useFormState = function (l, t, u) {
    return ha.H.useFormState(l, t, u);
  }; gl.useFormStatus = function () {
    return ha.H.useHostTransitionStatus();
  }; gl.version = '19.2.3';
}); const c0 = $l((jh, f0) => {
  'use strict'; function e0() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function')) {
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e0);
      } catch (l) {
        console.error(l);
      }
    }
  }e0(), f0.exports = n0();
}); const zd = $l((Le) => {
  'use strict'; const el = Li(); const B1 = bn(); const eo = c0(); function b(l) {
    let t = `https://react.dev/errors/${l}`; if (arguments.length > 1) {
      t += `?args[]=${encodeURIComponent(arguments[1])}`; for (let u = 2; u < arguments.length; u++) {
        t += `&args[]=${encodeURIComponent(arguments[u])}`;
      }
    } return `Minified React error #${l}; visit ${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`;
  } function q1(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  } function ln(l) {
    let t = l; let u = l; if (l.alternate) {
      for (;t.return;) {
        t = t.return;
      }
    } else {
      l = t; do {
        t = l, (t.flags & 4098) !== 0 && (u = t.return), l = t.return;
      } while (l);
    } return t.tag === 3 ? u : null;
  } function Y1(l) {
    if (l.tag === 13) {
      let t = l.memoizedState; if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) {
        return t.dehydrated;
      }
    } return null;
  } function r1(l) {
    if (l.tag === 31) {
      let t = l.memoizedState; if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) {
        return t.dehydrated;
      }
    } return null;
  } function i0(l) {
    if (ln(l) !== l) {
      throw new Error(b(188));
    }
  } function fo(l) {
    let t = l.alternate; if (!t) {
      if (t = ln(l), t === null) {
        throw new Error(b(188));
      } return t !== l ? null : l;
    } for (var u = l, a = t; ;) {
      const n = u.return; if (n === null) {
        break;
      } let e = n.alternate; if (e === null) {
        if (a = n.return, a !== null) {
          u = a; continue;
        } break;
      } if (n.child === e.child) {
        for (e = n.child; e;) {
          if (e === u) {
            return i0(n), l;
          } if (e === a) {
            return i0(n), t;
          } e = e.sibling;
        } throw new Error(b(188));
      } if (u.return !== a.return) {
        u = n, a = e;
      } else {
        for (var f = !1, c = n.child; c;) {
          if (c === u) {
            f = !0, u = n, a = e; break;
          } if (c === a) {
            f = !0, a = n, u = e; break;
          }c = c.sibling;
        } if (!f) {
          for (c = e.child; c;) {
            if (c === u) {
              f = !0, u = e, a = n; break;
            } if (c === a) {
              f = !0, a = e, u = n; break;
            }c = c.sibling;
          } if (!f) {
            throw new Error(b(189));
          }
        }
      } if (u.alternate !== a) {
        throw new Error(b(190));
      }
    } if (u.tag !== 3) {
      throw new Error(b(188));
    } return u.stateNode.current === u ? l : t;
  } function G1(l) {
    let t = l.tag; if (t === 5 || t === 26 || t === 27 || t === 6) {
      return l;
    } for (l = l.child; l !== null;) {
      if (t = G1(l), t !== null) {
        return t;
      } l = l.sibling;
    } return null;
  } const J = Object.assign; const co = Symbol.for('react.element'); const Tn = Symbol.for('react.transitional.element'); const Aa = Symbol.for('react.portal'); const Uu = Symbol.for('react.fragment'); const X1 = Symbol.for('react.strict_mode'); const jf = Symbol.for('react.profiler'); const Q1 = Symbol.for('react.consumer'); const dt = Symbol.for('react.context'); const rc = Symbol.for('react.forward_ref'); const Zf = Symbol.for('react.suspense'); const Vf = Symbol.for('react.suspense_list'); const Gc = Symbol.for('react.memo'); const pt = Symbol.for('react.lazy'); Symbol.for('react.scope'); const Lf = Symbol.for('react.activity'); Symbol.for('react.legacy_hidden'); Symbol.for('react.tracing_marker'); const io = Symbol.for('react.memo_cache_sentinel'); Symbol.for('react.view_transition'); const y0 = Symbol.iterator; function sa(l) {
    return l === null || typeof l != 'object' ? null : (l = y0 && l[y0] || l['@@iterator'], typeof l == 'function' ? l : null);
  } const yo = Symbol.for('react.client.reference'); function Kf(l) {
    if (l == null) {
      return null;
    } if (typeof l == 'function') {
      return l.$$typeof === yo ? null : l.displayName || l.name || null;
    } if (typeof l == 'string') {
      return l;
    } switch (l) {
      case Uu:return 'Fragment'; case jf:return 'Profiler'; case X1:return 'StrictMode'; case Zf:return 'Suspense'; case Vf:return 'SuspenseList'; case Lf:return 'Activity';
    } if (typeof l == 'object') {
      switch (l.$$typeof) {
        case Aa:return 'Portal'; case dt:return l.displayName || 'Context'; case Q1:return `${l._context.displayName || 'Context'}.Consumer`; case rc:var t = l.render; return l = l.displayName, l || (l = t.displayName || t.name || '', l = l !== '' ? `ForwardRef(${l})` : 'ForwardRef'), l; case Gc:return t = l.displayName || null, t !== null ? t : Kf(l.type) || 'Memo'; case pt:t = l._payload, l = l._init; try {
          return Kf(l(t));
        } catch {}
      }
    } return null;
  } const _a = Array.isArray; const O = B1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE; const r = eo.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE; const au = { pending: !1, data: null, method: null, action: null }; const Jf = []; let Hu = -1; function tt(l) {
    return { current: l };
  } function il(l) {
    Hu < 0 || (l.current = Jf[Hu], Jf[Hu] = null, Hu--);
  } function Z(l, t) {
    Hu++, Jf[Hu] = l.current, l.current = t;
  } const lt = tt(null); const xa = tt(null); const Gt = tt(null); const Pn = tt(null); function le(l, t) {
    switch (Z(Gt, t), Z(xa, l), Z(lt, null), t.nodeType) {
      case 9:case 11:l = (l = t.documentElement) && (l = l.namespaceURI) ? g1(l) : 0; break; default:if (l = t.tagName, t = t.namespaceURI) {
        t = g1(t), l = ed(t, l);
      } else {
        switch (l) {
          case 'svg':l = 1; break; case 'math':l = 2; break; default:l = 0;
        }
      }
    }il(lt), Z(lt, l);
  } function wu() {
    il(lt), il(xa), il(Gt);
  } function wf(l) {
    l.memoizedState !== null && Z(Pn, l); const t = lt.current; const u = ed(t, l.type); t !== u && (Z(xa, l), Z(lt, u));
  } function te(l) {
    xa.current === l && (il(lt), il(xa)), Pn.current === l && (il(Pn), ka._currentValue = au);
  } let cf, v0; function Pt(l) {
    if (cf === void 0) {
      try {
        throw new Error();
      } catch (u) {
        const t = u.stack.trim().match(/\n( *(at )?)/); cf = t && t[1] || '', v0 = u.stack.includes(`
    at`)
          ? ' (<anonymous>)'
          : u.stack.includes('@') ? '@unknown:0:0' : '';
      }
    } return `
    ${cf}${l}${v0}`;
  } let yf = !1; function vf(l, t) {
    if (!l || yf) {
      return '';
    } yf = !0; let u = Error.prepareStackTrace; Error.prepareStackTrace = void 0; try {
      let a = { DetermineComponentFrameRoot() {
        try {
          if (t) {
            var g = function () {
              throw new Error();
            }; if (Object.defineProperty(g.prototype, 'props', { set() {
              throw new Error();
            } }), typeof Reflect == 'object' && Reflect.construct) {
              try {
                Reflect.construct(g, []);
              } catch (h) {
                var m = h;
              }Reflect.construct(l, [], g);
            } else {
              try {
                g.call();
              } catch (h) {
                m = h;
              }l.call(g.prototype);
            }
          } else {
            try {
              throw new Error();
            } catch (h) {
              m = h;
            }(g = l()) && typeof g.catch == 'function' && g.catch(() => {});
          }
        } catch (h) {
          if (h && m && typeof h.stack == 'string') {
            return [h.stack, m.stack];
          }
        } return [null, null];
      } }; a.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot'; let n = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, 'name'); n && n.configurable && Object.defineProperty(a.DetermineComponentFrameRoot, 'name', { value: 'DetermineComponentFrameRoot' }); const e = a.DetermineComponentFrameRoot(); const f = e[0]; const c = e[1]; if (f && c) {
        const i = f.split(`
`); const d = c.split(`
`); for (n = a = 0; a < i.length && !i[a].includes('DetermineComponentFrameRoot');) {
          a++;
        } for (;n < d.length && !d[n].includes('DetermineComponentFrameRoot');) {
          n++;
        } if (a === i.length || n === d.length) {
          for (a = i.length - 1, n = d.length - 1; a >= 1 && n >= 0 && i[a] !== d[n];) {
            n--;
          }
        } for (;a >= 1 && n >= 0; a--, n--) {
          if (i[a] !== d[n]) {
            if (a !== 1 || n !== 1) {
              do {
                if (a--, n--, n < 0 || i[a] !== d[n]) {
                  let s = `
   ${i[a].replace(' at new ', ' at ')}`; return l.displayName && s.includes('<anonymous>') && (s = s.replace('<anonymous>', l.displayName)), s;
                }
              } while (a >= 1 && n >= 0);
            } break;
          }
        }
      }
    } finally {
      yf = !1, Error.prepareStackTrace = u;
    } return (u = l ? l.displayName || l.name : '') ? Pt(u) : '';
  } function vo(l, t) {
    switch (l.tag) {
      case 26:case 27:case 5:return Pt(l.type); case 16:return Pt('Lazy'); case 13:return l.child !== t && t !== null ? Pt('Suspense Fallback') : Pt('Suspense'); case 19:return Pt('SuspenseList'); case 0:case 15:return vf(l.type, !1); case 11:return vf(l.type.render, !1); case 1:return vf(l.type, !0); case 31:return Pt('Activity'); default:return '';
    }
  } function d0(l) {
    try {
      let t = ''; let u = null; do {
        t += vo(l, u), u = l, l = l.return;
      } while (l); return t;
    } catch (a) {
      return `
  Error generating stack: ${a.message}
${a.stack}`;
    }
  } const Wf = Object.prototype.hasOwnProperty; const Xc = el.unstable_scheduleCallback; const df = el.unstable_cancelCallback; const oo = el.unstable_shouldYield; const mo = el.unstable_requestPaint; const Hl = el.unstable_now; const ho = el.unstable_getCurrentPriorityLevel; const x1 = el.unstable_ImmediatePriority; const j1 = el.unstable_UserBlockingPriority; const ue = el.unstable_NormalPriority; const so = el.unstable_LowPriority; const Z1 = el.unstable_IdlePriority; const go = el.log; const So = el.unstable_setDisableYieldValue; let tn = null; let Nl = null; function Rt(l) {
    if (typeof go == 'function' && So(l), Nl && typeof Nl.setStrictMode == 'function') {
      try {
        Nl.setStrictMode(tn, l);
      } catch {}
    }
  } const Cl = Math.clz32 ? Math.clz32 : To; const bo = Math.log; const zo = Math.LN2; function To(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (bo(l) / zo | 0) | 0;
  } let En = 256; let An = 262144; let _n = 4194304; function lu(l) {
    const t = l & 42; if (t !== 0) {
      return t;
    } switch (l & -l) {
      case 1:return 1; case 2:return 2; case 4:return 4; case 8:return 8; case 16:return 16; case 32:return 32; case 64:return 64; case 128:return 128; case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return l & 261888; case 262144:case 524288:case 1048576:case 2097152:return l & 3932160; case 4194304:case 8388608:case 16777216:case 33554432:return l & 62914560; case 67108864:return 67108864; case 134217728:return 134217728; case 268435456:return 268435456; case 536870912:return 536870912; case 1073741824:return 0; default:return l;
    }
  } function Ue(l, t, u) {
    let a = l.pendingLanes; if (a === 0) {
      return 0;
    } let n = 0; let e = l.suspendedLanes; let f = l.pingedLanes; l = l.warmLanes; let c = a & 134217727; return c !== 0 ? (a = c & ~e, a !== 0 ? n = lu(a) : (f &= c, f !== 0 ? n = lu(f) : u || (u = c & ~l, u !== 0 && (n = lu(u))))) : (c = a & ~e, c !== 0 ? n = lu(c) : f !== 0 ? n = lu(f) : u || (u = a & ~l, u !== 0 && (n = lu(u)))), n === 0 ? 0 : t !== 0 && t !== n && (t & e) === 0 && (e = n & -n, u = t & -t, e >= u || e === 32 && (u & 4194048) !== 0) ? t : n;
  } function un(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  } function Eo(l, t) {
    switch (l) {
      case 1:case 2:case 4:case 8:case 64:return t + 250; case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t + 5e3; case 4194304:case 8388608:case 16777216:case 33554432:return -1; case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return -1; default:return -1;
    }
  } function V1() {
    const l = _n; return _n <<= 1, (_n & 62914560) === 0 && (_n = 4194304), l;
  } function of(l) {
    for (var t = [], u = 0; u < 31; u++) {
      t.push(l);
    } return t;
  } function an(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  } function Ao(l, t, u, a, n, e) {
    const f = l.pendingLanes; l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0; const c = l.entanglements; const i = l.expirationTimes; const d = l.hiddenUpdates; for (u = f & ~u; u > 0;) {
      let s = 31 - Cl(u); const g = 1 << s; c[s] = 0, i[s] = -1; const m = d[s]; if (m !== null) {
        for (d[s] = null, s = 0; s < m.length; s++) {
          const h = m[s]; h !== null && (h.lane &= -536870913);
        }
      }u &= ~g;
    }a !== 0 && L1(l, a, 0), e !== 0 && n === 0 && l.tag !== 0 && (l.suspendedLanes |= e & ~(f & ~t));
  } function L1(l, t, u) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t; const a = 31 - Cl(t); l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | u & 261930;
  } function K1(l, t) {
    let u = l.entangledLanes |= t; for (l = l.entanglements; u;) {
      const a = 31 - Cl(u); const n = 1 << a; n & t | l[a] & t && (l[a] |= t), u &= ~n;
    }
  } function J1(l, t) {
    let u = t & -t; return u = (u & 42) !== 0 ? 1 : Qc(u), (u & (l.suspendedLanes | t)) !== 0 ? 0 : u;
  } function Qc(l) {
    switch (l) {
      case 2:l = 1; break; case 8:l = 4; break; case 32:l = 16; break; case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:l = 128; break; case 268435456:l = 134217728; break; default:l = 0;
    } return l;
  } function xc(l) {
    return l &= -l, l > 2 ? l > 8 ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  } function w1() {
    let l = r.p; return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : gd(l.type));
  } function o0(l, t) {
    const u = r.p; try {
      return r.p = l, t();
    } finally {
      r.p = u;
    }
  } const Ft = Math.random().toString(36).slice(2); const vl = `__reactFiber$${Ft}`; const _l = `__reactProps$${Ft}`; const na = `__reactContainer$${Ft}`; const $f = `__reactEvents$${Ft}`; const _o = `__reactListeners$${Ft}`; const Oo = `__reactHandles$${Ft}`; const m0 = `__reactResources$${Ft}`; const nn = `__reactMarker$${Ft}`; function jc(l) {
    delete l[vl], delete l[_l], delete l[$f], delete l[_o], delete l[Oo];
  } function Nu(l) {
    let t = l[vl]; if (t) {
      return t;
    } for (let u = l.parentNode; u;) {
      if (t = u[na] || u[vl]) {
        if (u = t.alternate, t.child !== null || u !== null && u.child !== null) {
          for (l = E1(l); l !== null;) {
            if (u = l[vl]) {
              return u;
            } l = E1(l);
          }
        } return t;
      }l = u, u = l.parentNode;
    } return null;
  } function ea(l) {
    if (l = l[vl] || l[na]) {
      const t = l.tag; if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) {
        return l;
      }
    } return null;
  } function Oa(l) {
    const t = l.tag; if (t === 5 || t === 26 || t === 27 || t === 6) {
      return l.stateNode;
    } throw new Error(b(33));
  } function xu(l) {
    let t = l[m0]; return t || (t = l[m0] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t;
  } function cl(l) {
    l[nn] = !0;
  } const W1 = new Set(); const $1 = {}; function mu(l, t) {
    Wu(l, t), Wu(`${l}Capture`, t);
  } function Wu(l, t) {
    for ($1[l] = t, l = 0; l < t.length; l++) {
      W1.add(t[l]);
    }
  } const Mo = new RegExp('^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:\\w\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\u00B7\\u0300-\\u036F\\u203F\\u2040]*$'); const h0 = {}; const s0 = {}; function po(l) {
    return Wf.call(s0, l) ? !0 : Wf.call(h0, l) ? !1 : Mo.test(l) ? s0[l] = !0 : (h0[l] = !0, !1);
  } function Xn(l, t, u) {
    if (po(t)) {
      if (u === null) {
        l.removeAttribute(t);
      } else {
        switch (typeof u) {
          case 'undefined':case 'function':case 'symbol':l.removeAttribute(t); return; case 'boolean':var a = t.toLowerCase().slice(0, 5); if (a !== 'data-' && a !== 'aria-') {
            l.removeAttribute(t); return;
          }
        }l.setAttribute(t, `${u}`);
      }
    }
  } function On(l, t, u) {
    if (u === null) {
      l.removeAttribute(t);
    } else {
      switch (typeof u) {
        case 'undefined':case 'function':case 'symbol':case 'boolean':l.removeAttribute(t); return;
      }l.setAttribute(t, `${u}`);
    }
  } function nt(l, t, u, a) {
    if (a === null) {
      l.removeAttribute(u);
    } else {
      switch (typeof a) {
        case 'undefined':case 'function':case 'symbol':case 'boolean':l.removeAttribute(u); return;
      }l.setAttributeNS(t, u, `${a}`);
    }
  } function Gl(l) {
    switch (typeof l) {
      case 'bigint':case 'boolean':case 'number':case 'string':case 'undefined':return l; case 'object':return l; default:return '';
    }
  } function F1(l) {
    const t = l.type; return (l = l.nodeName) && l.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  } function Do(l, t, u) {
    const a = Object.getOwnPropertyDescriptor(l.constructor.prototype, t); if (!l.hasOwnProperty(t) && typeof a < 'u' && typeof a.get == 'function' && typeof a.set == 'function') {
      const n = a.get; const e = a.set; return Object.defineProperty(l, t, { configurable: !0, get() {
        return n.call(this);
      }, set(f) {
        u = `${f}`, e.call(this, f);
      } }), Object.defineProperty(l, t, { enumerable: a.enumerable }), { getValue() {
        return u;
      }, setValue(f) {
        u = `${f}`;
      }, stopTracking() {
        l._valueTracker = null, delete l[t];
      } };
    }
  } function Ff(l) {
    if (!l._valueTracker) {
      const t = F1(l) ? 'checked' : 'value'; l._valueTracker = Do(l, t, `${l[t]}`);
    }
  } function k1(l) {
    if (!l) {
      return !1;
    } const t = l._valueTracker; if (!t) {
      return !0;
    } const u = t.getValue(); let a = ''; return l && (a = F1(l) ? l.checked ? 'true' : 'false' : l.value), l = a, l !== u ? (t.setValue(l), !0) : !1;
  } function ae(l) {
    if (l = l || (typeof document < 'u' ? document : void 0), typeof l > 'u') {
      return null;
    } try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  } const Uo = /[\n"\\]/g; function xl(l) {
    return l.replace(Uo, (t) => {
      return `\\${t.charCodeAt(0).toString(16)} `;
    });
  } function kf(l, t, u, a, n, e, f, c) {
    l.name = '', f != null && typeof f != 'function' && typeof f != 'symbol' && typeof f != 'boolean' ? l.type = f : l.removeAttribute('type'), t != null ? f === 'number' ? (t === 0 && l.value === '' || l.value != t) && (l.value = `${Gl(t)}`) : l.value !== `${Gl(t)}` && (l.value = `${Gl(t)}`) : f !== 'submit' && f !== 'reset' || l.removeAttribute('value'), t != null ? If(l, f, Gl(t)) : u != null ? If(l, f, Gl(u)) : a != null && l.removeAttribute('value'), n == null && e != null && (l.defaultChecked = !!e), n != null && (l.checked = n && typeof n != 'function' && typeof n != 'symbol'), c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean' ? l.name = `${Gl(c)}` : l.removeAttribute('name');
  } function I1(l, t, u, a, n, e, f, c) {
    if (e != null && typeof e != 'function' && typeof e != 'symbol' && typeof e != 'boolean' && (l.type = e), t != null || u != null) {
      if (!(e !== 'submit' && e !== 'reset' || t != null)) {
        Ff(l); return;
      }u = u != null ? `${Gl(u)}` : '', t = t != null ? `${Gl(t)}` : u, c || t === l.value || (l.value = t), l.defaultValue = t;
    }a = a ?? n, a = typeof a != 'function' && typeof a != 'symbol' && !!a, l.checked = c ? l.checked : !!a, l.defaultChecked = !!a, f != null && typeof f != 'function' && typeof f != 'symbol' && typeof f != 'boolean' && (l.name = f), Ff(l);
  } function If(l, t, u) {
    t === 'number' && ae(l.ownerDocument) === l || l.defaultValue === `${u}` || (l.defaultValue = `${u}`);
  } function ju(l, t, u, a) {
    if (l = l.options, t) {
      t = {}; for (var n = 0; n < u.length; n++) {
        t[`$${u[n]}`] = !0;
      } for (u = 0; u < l.length; u++) {
        n = t.hasOwnProperty(`$${l[u].value}`), l[u].selected !== n && (l[u].selected = n), n && a && (l[u].defaultSelected = !0);
      }
    } else {
      for (u = `${Gl(u)}`, t = null, n = 0; n < l.length; n++) {
        if (l[n].value === u) {
          l[n].selected = !0, a && (l[n].defaultSelected = !0); return;
        }t !== null || l[n].disabled || (t = l[n]);
      }t !== null && (t.selected = !0);
    }
  } function P1(l, t, u) {
    if (t != null && (t = `${Gl(t)}`, t !== l.value && (l.value = t), u == null)) {
      l.defaultValue !== t && (l.defaultValue = t); return;
    }l.defaultValue = u != null ? `${Gl(u)}` : '';
  } function ly(l, t, u, a) {
    if (t == null) {
      if (a != null) {
        if (u != null) {
          throw new Error(b(92));
        } if (_a(a)) {
          if (a.length > 1) {
            throw new Error(b(93));
          } a = a[0];
        }u = a;
      }u == null && (u = ''), t = u;
    }u = Gl(t), l.defaultValue = u, a = l.textContent, a === u && a !== '' && a !== null && (l.value = a), Ff(l);
  } function $u(l, t) {
    if (t) {
      const u = l.firstChild; if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = t; return;
      }
    }l.textContent = t;
  } const Ho = new Set('animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(' ')); function g0(l, t, u) {
    const a = t.indexOf('--') === 0; u == null || typeof u == 'boolean' || u === '' ? a ? l.setProperty(t, '') : t === 'float' ? l.cssFloat = '' : l[t] = '' : a ? l.setProperty(t, u) : typeof u != 'number' || u === 0 || Ho.has(t) ? t === 'float' ? l.cssFloat = u : l[t] = (`${u}`).trim() : l[t] = `${u}px`;
  } function ty(l, t, u) {
    if (t != null && typeof t != 'object') {
      throw new Error(b(62));
    } if (l = l.style, u != null) {
      for (var a in u) {
        !u.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf('--') === 0 ? l.setProperty(a, '') : a === 'float' ? l.cssFloat = '' : l[a] = '');
      } for (const n in t) {
        a = t[n], t.hasOwnProperty(n) && u[n] !== a && g0(l, n, a);
      }
    } else {
      for (const e in t) {
        t.hasOwnProperty(e) && g0(l, e, t[e]);
      }
    }
  } function Zc(l) {
    if (!l.includes('-')) {
      return !1;
    } switch (l) {
      case 'annotation-xml':case 'color-profile':case 'font-face':case 'font-face-src':case 'font-face-uri':case 'font-face-format':case 'font-face-name':case 'missing-glyph':return !1; default:return !0;
    }
  } const No = new Map([['acceptCharset', 'accept-charset'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv'], ['crossOrigin', 'crossorigin'], ['accentHeight', 'accent-height'], ['alignmentBaseline', 'alignment-baseline'], ['arabicForm', 'arabic-form'], ['baselineShift', 'baseline-shift'], ['capHeight', 'cap-height'], ['clipPath', 'clip-path'], ['clipRule', 'clip-rule'], ['colorInterpolation', 'color-interpolation'], ['colorInterpolationFilters', 'color-interpolation-filters'], ['colorProfile', 'color-profile'], ['colorRendering', 'color-rendering'], ['dominantBaseline', 'dominant-baseline'], ['enableBackground', 'enable-background'], ['fillOpacity', 'fill-opacity'], ['fillRule', 'fill-rule'], ['floodColor', 'flood-color'], ['floodOpacity', 'flood-opacity'], ['fontFamily', 'font-family'], ['fontSize', 'font-size'], ['fontSizeAdjust', 'font-size-adjust'], ['fontStretch', 'font-stretch'], ['fontStyle', 'font-style'], ['fontVariant', 'font-variant'], ['fontWeight', 'font-weight'], ['glyphName', 'glyph-name'], ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'], ['glyphOrientationVertical', 'glyph-orientation-vertical'], ['horizAdvX', 'horiz-adv-x'], ['horizOriginX', 'horiz-origin-x'], ['imageRendering', 'image-rendering'], ['letterSpacing', 'letter-spacing'], ['lightingColor', 'lighting-color'], ['markerEnd', 'marker-end'], ['markerMid', 'marker-mid'], ['markerStart', 'marker-start'], ['overlinePosition', 'overline-position'], ['overlineThickness', 'overline-thickness'], ['paintOrder', 'paint-order'], ['panose-1', 'panose-1'], ['pointerEvents', 'pointer-events'], ['renderingIntent', 'rendering-intent'], ['shapeRendering', 'shape-rendering'], ['stopColor', 'stop-color'], ['stopOpacity', 'stop-opacity'], ['strikethroughPosition', 'strikethrough-position'], ['strikethroughThickness', 'strikethrough-thickness'], ['strokeDasharray', 'stroke-dasharray'], ['strokeDashoffset', 'stroke-dashoffset'], ['strokeLinecap', 'stroke-linecap'], ['strokeLinejoin', 'stroke-linejoin'], ['strokeMiterlimit', 'stroke-miterlimit'], ['strokeOpacity', 'stroke-opacity'], ['strokeWidth', 'stroke-width'], ['textAnchor', 'text-anchor'], ['textDecoration', 'text-decoration'], ['textRendering', 'text-rendering'], ['transformOrigin', 'transform-origin'], ['underlinePosition', 'underline-position'], ['underlineThickness', 'underline-thickness'], ['unicodeBidi', 'unicode-bidi'], ['unicodeRange', 'unicode-range'], ['unitsPerEm', 'units-per-em'], ['vAlphabetic', 'v-alphabetic'], ['vHanging', 'v-hanging'], ['vIdeographic', 'v-ideographic'], ['vMathematical', 'v-mathematical'], ['vectorEffect', 'vector-effect'], ['vertAdvY', 'vert-adv-y'], ['vertOriginX', 'vert-origin-x'], ['vertOriginY', 'vert-origin-y'], ['wordSpacing', 'word-spacing'], ['writingMode', 'writing-mode'], ['xmlnsXlink', 'xmlns:xlink'], ['xHeight', 'x-height']]); const Co = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i; function Qn(l) {
    return Co.test(`${l}`) ? 'javascript:throw new Error(\'React has blocked a javascript: URL as a security precaution.\')' : l;
  } function ot() {} let Pf = null; function Vc(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  } let Cu = null; let Zu = null; function S0(l) {
    let t = ea(l); if (t && (l = t.stateNode)) {
      let u = l[_l] || null; l:switch (l = t.stateNode, t.type) {
        case 'input':if (kf(l, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name), t = u.name, u.type === 'radio' && t != null) {
          for (u = l; u.parentNode;) {
            u = u.parentNode;
          } for (u = u.querySelectorAll(`input[name="${xl(`${t}`)}"][type="radio"]`), t = 0; t < u.length; t++) {
            var a = u[t]; if (a !== l && a.form === l.form) {
              const n = a[_l] || null; if (!n) {
                throw new Error(b(90));
              } kf(a, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name);
            }
          } for (t = 0; t < u.length; t++) {
            a = u[t], a.form === l.form && k1(a);
          }
        } break l; case 'textarea':P1(l, u.value, u.defaultValue); break l; case 'select':t = u.value, t != null && ju(l, !!u.multiple, t, !1);
      }
    }
  } let mf = !1; function uy(l, t, u) {
    if (mf) {
      return l(t, u);
    } mf = !0; try {
      const a = l(t); return a;
    } finally {
      if (mf = !1, (Cu !== null || Zu !== null) && (xe(), Cu && (t = Cu, l = Zu, Zu = Cu = null, S0(t), l))) {
        for (t = 0; t < l.length; t++) {
          S0(l[t]);
        }
      }
    }
  } function ja(l, t) {
    let u = l.stateNode; if (u === null) {
      return null;
    } let a = u[_l] || null; if (a === null) {
      return null;
    } u = a[t]; l:switch (t) {
      case 'onClick':case 'onClickCapture':case 'onDoubleClick':case 'onDoubleClickCapture':case 'onMouseDown':case 'onMouseDownCapture':case 'onMouseMove':case 'onMouseMoveCapture':case 'onMouseUp':case 'onMouseUpCapture':case 'onMouseEnter':(a = !a.disabled) || (l = l.type, a = !(l === 'button' || l === 'input' || l === 'select' || l === 'textarea')), l = !a; break l; default:l = !1;
    } if (l) {
      return null;
    } if (u && typeof u != 'function') {
      throw new Error(b(231, t, typeof u));
    } return u;
  } const St = !(typeof window > 'u' || typeof window.document > 'u' || typeof window.document.createElement > 'u'); let lc = !1; if (St) {
    try {
      _u = {}, Object.defineProperty(_u, 'passive', { get() {
        lc = !0;
      } }), window.addEventListener('test', _u, _u), window.removeEventListener('test', _u, _u);
    } catch {
      lc = !1;
    }
  } let _u; let Bt = null; let Lc = null; let xn = null; function ay() {
    if (xn) {
      return xn;
    } let l; const t = Lc; const u = t.length; let a; const n = 'value' in Bt ? Bt.value : Bt.textContent; const e = n.length; for (l = 0; l < u && t[l] === n[l]; l++) {
      ;
    } const f = u - l; for (a = 1; a <= f && t[u - a] === n[e - a]; a++) {
      ;
    } return xn = n.slice(l, a > 1 ? 1 - a : void 0);
  } function jn(l) {
    const t = l.keyCode; return 'charCode' in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), l >= 32 || l === 13 ? l : 0;
  } function Mn() {
    return !0;
  } function b0() {
    return !1;
  } function Ol(l) {
    function t(u, a, n, e, f) {
      this._reactName = u, this._targetInst = n, this.type = a, this.nativeEvent = e, this.target = f, this.currentTarget = null; for (const c in l) {
        l.hasOwnProperty(c) && (u = l[c], this[c] = u ? u(e) : e[c]);
      } return this.isDefaultPrevented = (e.defaultPrevented != null ? e.defaultPrevented : e.returnValue === !1) ? Mn : b0, this.isPropagationStopped = b0, this;
    } return J(t.prototype, { preventDefault() {
      this.defaultPrevented = !0; const u = this.nativeEvent; u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != 'unknown' && (u.returnValue = !1), this.isDefaultPrevented = Mn);
    }, stopPropagation() {
      const u = this.nativeEvent; u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != 'unknown' && (u.cancelBubble = !0), this.isPropagationStopped = Mn);
    }, persist() {}, isPersistent: Mn }), t;
  } const hu = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp(l) {
    return l.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }; const He = Ol(hu); const en = J({}, hu, { view: 0, detail: 0 }); const Ro = Ol(en); let hf; let sf; let ga; const Ne = J({}, en, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Kc, button: 0, buttons: 0, relatedTarget(l) {
    return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
  }, movementX(l) {
    return 'movementX' in l ? l.movementX : (l !== ga && (ga && l.type === 'mousemove' ? (hf = l.screenX - ga.screenX, sf = l.screenY - ga.screenY) : sf = hf = 0, ga = l), hf);
  }, movementY(l) {
    return 'movementY' in l ? l.movementY : sf;
  } }); const z0 = Ol(Ne); const Bo = J({}, Ne, { dataTransfer: 0 }); const qo = Ol(Bo); const Yo = J({}, en, { relatedTarget: 0 }); const gf = Ol(Yo); const ro = J({}, hu, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }); const Go = Ol(ro); const Xo = J({}, hu, { clipboardData(l) {
    return 'clipboardData' in l ? l.clipboardData : window.clipboardData;
  } }); const Qo = Ol(Xo); const xo = J({}, hu, { data: 0 }); const T0 = Ol(xo); const jo = { Esc: 'Escape', Spacebar: ' ', Left: 'ArrowLeft', Up: 'ArrowUp', Right: 'ArrowRight', Down: 'ArrowDown', Del: 'Delete', Win: 'OS', Menu: 'ContextMenu', Apps: 'ContextMenu', Scroll: 'ScrollLock', MozPrintableKey: 'Unidentified' }; const Zo = { 8: 'Backspace', 9: 'Tab', 12: 'Clear', 13: 'Enter', 16: 'Shift', 17: 'Control', 18: 'Alt', 19: 'Pause', 20: 'CapsLock', 27: 'Escape', 32: ' ', 33: 'PageUp', 34: 'PageDown', 35: 'End', 36: 'Home', 37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown', 45: 'Insert', 46: 'Delete', 112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12', 144: 'NumLock', 145: 'ScrollLock', 224: 'Meta' }; const Vo = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' }; function Lo(l) {
    const t = this.nativeEvent; return t.getModifierState ? t.getModifierState(l) : (l = Vo[l]) ? !!t[l] : !1;
  } function Kc() {
    return Lo;
  } const Ko = J({}, en, { key(l) {
    if (l.key) {
      const t = jo[l.key] || l.key; if (t !== 'Unidentified') {
        return t;
      }
    } return l.type === 'keypress' ? (l = jn(l), l === 13 ? 'Enter' : String.fromCharCode(l)) : l.type === 'keydown' || l.type === 'keyup' ? Zo[l.keyCode] || 'Unidentified' : '';
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Kc, charCode(l) {
    return l.type === 'keypress' ? jn(l) : 0;
  }, keyCode(l) {
    return l.type === 'keydown' || l.type === 'keyup' ? l.keyCode : 0;
  }, which(l) {
    return l.type === 'keypress' ? jn(l) : l.type === 'keydown' || l.type === 'keyup' ? l.keyCode : 0;
  } }); const Jo = Ol(Ko); const wo = J({}, Ne, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }); const E0 = Ol(wo); const Wo = J({}, en, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Kc }); const $o = Ol(Wo); const Fo = J({}, hu, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }); const ko = Ol(Fo); const Io = J({}, Ne, { deltaX(l) {
    return 'deltaX' in l ? l.deltaX : 'wheelDeltaX' in l ? -l.wheelDeltaX : 0;
  }, deltaY(l) {
    return 'deltaY' in l ? l.deltaY : 'wheelDeltaY' in l ? -l.wheelDeltaY : 'wheelDelta' in l ? -l.wheelDelta : 0;
  }, deltaZ: 0, deltaMode: 0 }); const Po = Ol(Io); const lm = J({}, hu, { newState: 0, oldState: 0 }); const tm = Ol(lm); const um = [9, 13, 27, 32]; const Jc = St && 'CompositionEvent' in window; let Da = null; St && 'documentMode' in document && (Da = document.documentMode); const am = St && 'TextEvent' in window && !Da; const ny = St && (!Jc || Da && Da > 8 && Da <= 11); const A0 = ' '; let _0 = !1; function ey(l, t) {
    switch (l) {
      case 'keyup':return um.includes(t.keyCode); case 'keydown':return t.keyCode !== 229; case 'keypress':case 'mousedown':case 'focusout':return !0; default:return !1;
    }
  } function fy(l) {
    return l = l.detail, typeof l == 'object' && 'data' in l ? l.data : null;
  } let Ru = !1; function nm(l, t) {
    switch (l) {
      case 'compositionend':return fy(t); case 'keypress':return t.which !== 32 ? null : (_0 = !0, A0); case 'textInput':return l = t.data, l === A0 && _0 ? null : l; default:return null;
    }
  } function em(l, t) {
    if (Ru) {
      return l === 'compositionend' || !Jc && ey(l, t) ? (l = ay(), xn = Lc = Bt = null, Ru = !1, l) : null;
    } switch (l) {
      case 'paste':return null; case 'keypress':if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && t.char.length > 1) {
          return t.char;
        } if (t.which) {
          return String.fromCharCode(t.which);
        }
      } return null; case 'compositionend':return ny && t.locale !== 'ko' ? null : t.data; default:return null;
    }
  } const fm = { 'color': !0, 'date': !0, 'datetime': !0, 'datetime-local': !0, 'email': !0, 'month': !0, 'number': !0, 'password': !0, 'range': !0, 'search': !0, 'tel': !0, 'text': !0, 'time': !0, 'url': !0, 'week': !0 }; function O0(l) {
    const t = l && l.nodeName && l.nodeName.toLowerCase(); return t === 'input' ? !!fm[l.type] : t === 'textarea';
  } function cy(l, t, u, a) {
    Cu ? Zu ? Zu.push(a) : Zu = [a] : Cu = a, t = Ee(t, 'onChange'), t.length > 0 && (u = new He('onChange', 'change', null, u, a), l.push({ event: u, listeners: t }));
  } let Ua = null; let Za = null; function cm(l) {
    ud(l, 0);
  } function Ce(l) {
    const t = Oa(l); if (k1(t)) {
      return l;
    }
  } function M0(l, t) {
    if (l === 'change') {
      return t;
    }
  } let iy = !1; St && (St ? (Dn = 'oninput' in document, Dn || (Sf = document.createElement('div'), Sf.setAttribute('oninput', 'return;'), Dn = typeof Sf.oninput == 'function'), pn = Dn) : pn = !1, iy = pn && (!document.documentMode || document.documentMode > 9)); let pn, Dn, Sf; function p0() {
    Ua && (Ua.detachEvent('onpropertychange', yy), Za = Ua = null);
  } function yy(l) {
    if (l.propertyName === 'value' && Ce(Za)) {
      const t = []; cy(t, Za, l, Vc(l)), uy(cm, t);
    }
  } function im(l, t, u) {
    l === 'focusin' ? (p0(), Ua = t, Za = u, Ua.attachEvent('onpropertychange', yy)) : l === 'focusout' && p0();
  } function ym(l) {
    if (l === 'selectionchange' || l === 'keyup' || l === 'keydown') {
      return Ce(Za);
    }
  } function vm(l, t) {
    if (l === 'click') {
      return Ce(t);
    }
  } function dm(l, t) {
    if (l === 'input' || l === 'change') {
      return Ce(t);
    }
  } function om(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  } const Bl = typeof Object.is == 'function' ? Object.is : om; function Va(l, t) {
    if (Bl(l, t)) {
      return !0;
    } if (typeof l != 'object' || l === null || typeof t != 'object' || t === null) {
      return !1;
    } const u = Object.keys(l); let a = Object.keys(t); if (u.length !== a.length) {
      return !1;
    } for (a = 0; a < u.length; a++) {
      const n = u[a]; if (!Wf.call(t, n) || !Bl(l[n], t[n])) {
        return !1;
      }
    } return !0;
  } function D0(l) {
    for (;l && l.firstChild;) {
      l = l.firstChild;
    } return l;
  } function U0(l, t) {
    let u = D0(l); l = 0; for (var a; u;) {
      if (u.nodeType === 3) {
        if (a = l + u.textContent.length, l <= t && a >= t) {
          return { node: u, offset: t - l };
        } l = a;
      }l: {
        for (;u;) {
          if (u.nextSibling) {
            u = u.nextSibling; break l;
          }u = u.parentNode;
        }u = void 0;
      }u = D0(u);
    }
  } function vy(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? vy(l, t.parentNode) : 'contains' in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  } function dy(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window; for (var t = ae(l.document); t instanceof l.HTMLIFrameElement;) {
      try {
        var u = typeof t.contentWindow.location.href == 'string';
      } catch {
        u = !1;
      } if (u) {
        l = t.contentWindow;
      } else {
        break;
      }t = ae(l.document);
    } return t;
  } function wc(l) {
    const t = l && l.nodeName && l.nodeName.toLowerCase(); return t && (t === 'input' && (l.type === 'text' || l.type === 'search' || l.type === 'tel' || l.type === 'url' || l.type === 'password') || t === 'textarea' || l.contentEditable === 'true');
  } const mm = St && 'documentMode' in document && document.documentMode <= 11; let Bu = null; let tc = null; let Ha = null; let uc = !1; function H0(l, t, u) {
    let a = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument; uc || Bu == null || Bu !== ae(a) || (a = Bu, 'selectionStart' in a && wc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = { anchorNode: a.anchorNode, anchorOffset: a.anchorOffset, focusNode: a.focusNode, focusOffset: a.focusOffset }), Ha && Va(Ha, a) || (Ha = a, a = Ee(tc, 'onSelect'), a.length > 0 && (t = new He('onSelect', 'select', null, t, u), l.push({ event: t, listeners: a }), t.target = Bu)));
  } function It(l, t) {
    const u = {}; return u[l.toLowerCase()] = t.toLowerCase(), u[`Webkit${l}`] = `webkit${t}`, u[`Moz${l}`] = `moz${t}`, u;
  } const qu = { animationend: It('Animation', 'AnimationEnd'), animationiteration: It('Animation', 'AnimationIteration'), animationstart: It('Animation', 'AnimationStart'), transitionrun: It('Transition', 'TransitionRun'), transitionstart: It('Transition', 'TransitionStart'), transitioncancel: It('Transition', 'TransitionCancel'), transitionend: It('Transition', 'TransitionEnd') }; const bf = {}; let oy = {}; St && (oy = document.createElement('div').style, 'AnimationEvent' in window || (delete qu.animationend.animation, delete qu.animationiteration.animation, delete qu.animationstart.animation), 'TransitionEvent' in window || delete qu.transitionend.transition); function su(l) {
    if (bf[l]) {
      return bf[l];
    } if (!qu[l]) {
      return l;
    } const t = qu[l]; let u; for (u in t) {
      if (t.hasOwnProperty(u) && u in oy) {
        return bf[l] = t[u];
      }
    } return l;
  } const my = su('animationend'); const hy = su('animationiteration'); const sy = su('animationstart'); const hm = su('transitionrun'); const sm = su('transitionstart'); const gm = su('transitioncancel'); const gy = su('transitionend'); const Sy = new Map(); const ac = 'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(' '); ac.push('scrollEnd'); function Wl(l, t) {
    Sy.set(l, t), mu(t, [l]);
  } const ne = typeof reportError == 'function'
    ? reportError
    : function (l) {
      if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
        const t = new window.ErrorEvent('error', { bubbles: !0, cancelable: !0, message: typeof l == 'object' && l !== null && typeof l.message == 'string' ? String(l.message) : String(l), error: l }); if (!window.dispatchEvent(t)) {
          return;
        }
      } else if (typeof process == 'object' && typeof process.emit == 'function') {
        process.emit('uncaughtException', l); return;
      }console.error(l);
    }; const rl = []; let Yu = 0; let Wc = 0; function Re() {
    for (let l = Yu, t = Wc = Yu = 0; t < l;) {
      const u = rl[t]; rl[t++] = null; const a = rl[t]; rl[t++] = null; const n = rl[t]; rl[t++] = null; const e = rl[t]; if (rl[t++] = null, a !== null && n !== null) {
        const f = a.pending; f === null ? n.next = n : (n.next = f.next, f.next = n), a.pending = n;
      }e !== 0 && by(u, n, e);
    }
  } function Be(l, t, u, a) {
    rl[Yu++] = l, rl[Yu++] = t, rl[Yu++] = u, rl[Yu++] = a, Wc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  } function $c(l, t, u, a) {
    return Be(l, t, u, a), ee(l);
  } function gu(l, t) {
    return Be(l, null, null, t), ee(l);
  } function by(l, t, u) {
    l.lanes |= u; let a = l.alternate; a !== null && (a.lanes |= u); for (var n = !1, e = l.return; e !== null;) {
      e.childLanes |= u, a = e.alternate, a !== null && (a.childLanes |= u), e.tag === 22 && (l = e.stateNode, l === null || l._visibility & 1 || (n = !0)), l = e, e = e.return;
    } return l.tag === 3 ? (e = l.stateNode, n && t !== null && (n = 31 - Cl(u), l = e.hiddenUpdates, a = l[n], a === null ? l[n] = [t] : a.push(t), t.lane = u | 536870912), e) : null;
  } function ee(l) {
    if (Xa > 50) {
      throw Xa = 0, Oc = null, new Error(b(185));
    } for (let t = l.return; t !== null;) {
      l = t, t = l.return;
    } return l.tag === 3 ? l.stateNode : null;
  } const ru = {}; function Sm(l, t, u, a) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  } function Dl(l, t, u, a) {
    return new Sm(l, t, u, a);
  } function Fc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  } function ht(l, t) {
    let u = l.alternate; return u === null ? (u = Dl(l.tag, t, l.key, l.mode), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = t, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 65011712, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, t = l.dependencies, u.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  } function zy(l, t) {
    l.flags &= 65011714; const u = l.alternate; return u === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, t = u.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), l;
  } function Zn(l, t, u, a, n, e) {
    let f = 0; if (a = l, typeof l == 'function') {
      Fc(l) && (f = 1);
    } else if (typeof l == 'string') {
      f = Th(l, u, lt.current) ? 26 : l === 'html' || l === 'head' || l === 'body' ? 27 : 5;
    } else {
      l:switch (l) {
        case Lf:return l = Dl(31, u, t, n), l.elementType = Lf, l.lanes = e, l; case Uu:return nu(u.children, n, e, t); case X1:f = 8, n |= 24; break; case jf:return l = Dl(12, u, t, n | 2), l.elementType = jf, l.lanes = e, l; case Zf:return l = Dl(13, u, t, n), l.elementType = Zf, l.lanes = e, l; case Vf:return l = Dl(19, u, t, n), l.elementType = Vf, l.lanes = e, l; default:if (typeof l == 'object' && l !== null) {
          switch (l.$$typeof) {
            case dt:f = 10; break l; case Q1:f = 9; break l; case rc:f = 11; break l; case Gc:f = 14; break l; case pt:f = 16, a = null; break l;
          }
        }f = 29, u = new Error(b(130, l === null ? 'null' : typeof l, '')), a = null;
      }
    } return t = Dl(f, u, t, n), t.elementType = l, t.type = a, t.lanes = e, t;
  } function nu(l, t, u, a) {
    return l = Dl(7, l, a, t), l.lanes = u, l;
  } function zf(l, t, u) {
    return l = Dl(6, l, null, t), l.lanes = u, l;
  } function Ty(l) {
    const t = Dl(18, null, null, 0); return t.stateNode = l, t;
  } function Tf(l, t, u) {
    return t = Dl(4, l.children !== null ? l.children : [], l.key, t), t.lanes = u, t.stateNode = { containerInfo: l.containerInfo, pendingChildren: null, implementation: l.implementation }, t;
  } const N0 = new WeakMap(); function jl(l, t) {
    if (typeof l == 'object' && l !== null) {
      const u = N0.get(l); return u !== void 0 ? u : (t = { value: l, source: t, stack: d0(t) }, N0.set(l, t), t);
    } return { value: l, source: t, stack: d0(t) };
  } const Gu = []; let Xu = 0; let fe = null; let La = 0; const Xl = []; let Ql = 0; let Jt = null; let kl = 1; let Il = ''; function yt(l, t) {
    Gu[Xu++] = La, Gu[Xu++] = fe, fe = l, La = t;
  } function Ey(l, t, u) {
    Xl[Ql++] = kl, Xl[Ql++] = Il, Xl[Ql++] = Jt, Jt = l; let a = kl; l = Il; let n = 32 - Cl(a) - 1; a &= ~(1 << n), u += 1; let e = 32 - Cl(t) + n; if (e > 30) {
      const f = n - n % 5; e = (a & (1 << f) - 1).toString(32), a >>= f, n -= f, kl = 1 << 32 - Cl(t) + n | u << n | a, Il = e + l;
    } else {
      kl = 1 << e | u << n | a, Il = l;
    }
  } function kc(l) {
    l.return !== null && (yt(l, 1), Ey(l, 1, 0));
  } function Ic(l) {
    for (;l === fe;) {
      fe = Gu[--Xu], Gu[Xu] = null, La = Gu[--Xu], Gu[Xu] = null;
    } for (;l === Jt;) {
      Jt = Xl[--Ql], Xl[Ql] = null, Il = Xl[--Ql], Xl[Ql] = null, kl = Xl[--Ql], Xl[Ql] = null;
    }
  } function Ay(l, t) {
    Xl[Ql++] = kl, Xl[Ql++] = Il, Xl[Ql++] = Jt, kl = t.id, Il = t.overflow, Jt = l;
  } let dl = null; let K = null; let R = !1; let Xt = null; let Zl = !1; const nc = new Error(b(519)); function wt(l) {
    const t = new Error(b(418, arguments.length > 1 && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', '')); throw Ka(jl(t, l)), nc;
  } function C0(l) {
    let t = l.stateNode; let u = l.type; const a = l.memoizedProps; switch (t[vl] = l, t[_l] = a, u) {
      case 'dialog':U('cancel', t), U('close', t); break; case 'iframe':case 'object':case 'embed':U('load', t); break; case 'video':case 'audio':for (u = 0; u < $a.length; u++) {
        U($a[u], t);
      } break; case 'source':U('error', t); break; case 'img':case 'image':case 'link':U('error', t), U('load', t); break; case 'details':U('toggle', t); break; case 'input':U('invalid', t), I1(t, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0); break; case 'select':U('invalid', t); break; case 'textarea':U('invalid', t), ly(t, a.value, a.defaultValue, a.children);
    }u = a.children, typeof u != 'string' && typeof u != 'number' && typeof u != 'bigint' || t.textContent === `${u}` || a.suppressHydrationWarning === !0 || nd(t.textContent, u) ? (a.popover != null && (U('beforetoggle', t), U('toggle', t)), a.onScroll != null && U('scroll', t), a.onScrollEnd != null && U('scrollend', t), a.onClick != null && (t.onclick = ot), t = !0) : t = !1, t || wt(l, !0);
  } function R0(l) {
    for (dl = l.return; dl;) {
      switch (dl.tag) {
        case 5:case 31:case 13:Zl = !1; return; case 27:case 3:Zl = !0; return; default:dl = dl.return;
      }
    }
  } function Ou(l) {
    if (l !== dl) {
      return !1;
    } if (!R) {
      return R0(l), R = !0, !1;
    } let t = l.tag; let u; if ((u = t !== 3 && t !== 27) && ((u = t === 5) && (u = l.type, u = !(u !== 'form' && u !== 'button') || Hc(l.type, l.memoizedProps)), u = !u), u && K && wt(l), R0(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) {
        throw new Error(b(317));
      } K = T1(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) {
        throw new Error(b(317));
      } K = T1(l);
    } else {
      t === 27 ? (t = K, kt(l.type) ? (l = Bc, Bc = null, K = l) : K = t) : K = dl ? Ll(l.stateNode.nextSibling) : null;
    } return !0;
  } function iu() {
    K = dl = null, R = !1;
  } function Ef() {
    const l = Xt; return l !== null && (El === null ? El = l : El.push.apply(El, l), Xt = null), l;
  } function Ka(l) {
    Xt === null ? Xt = [l] : Xt.push(l);
  } const ec = tt(null); let Su = null; let mt = null; function Ut(l, t, u) {
    Z(ec, t._currentValue), t._currentValue = u;
  } function st(l) {
    l._currentValue = ec.current, il(ec);
  } function fc(l, t, u) {
    for (;l !== null;) {
      const a = l.alternate; if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === u) {
        break;
      } l = l.return;
    }
  } function cc(l, t, u, a) {
    let n = l.child; for (n !== null && (n.return = l); n !== null;) {
      let e = n.dependencies; if (e !== null) {
        var f = n.child; e = e.firstContext; l:for (;e !== null;) {
          let c = e; e = n; for (let i = 0; i < t.length; i++) {
            if (c.context === t[i]) {
              e.lanes |= u, c = e.alternate, c !== null && (c.lanes |= u), fc(e.return, u, l), a || (f = null); break l;
            }
          }e = c.next;
        }
      } else if (n.tag === 18) {
        if (f = n.return, f === null) {
          throw new Error(b(341));
        } f.lanes |= u, e = f.alternate, e !== null && (e.lanes |= u), fc(f, u, l), f = null;
      } else {
        f = n.child;
      } if (f !== null) {
        f.return = n;
      } else {
        for (f = n; f !== null;) {
          if (f === l) {
            f = null; break;
          } if (n = f.sibling, n !== null) {
            n.return = f.return, f = n; break;
          }f = f.return;
        }
      }n = f;
    }
  } function fa(l, t, u, a) {
    l = null; for (let n = t, e = !1; n !== null;) {
      if (!e) {
        if ((n.flags & 524288) !== 0) {
          e = !0;
        } else if ((n.flags & 262144) !== 0) {
          break;
        }
      } if (n.tag === 10) {
        var f = n.alternate; if (f === null) {
          throw new Error(b(387));
        } if (f = f.memoizedProps, f !== null) {
          const c = n.type; Bl(n.pendingProps.value, f.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (n === Pn.current) {
        if (f = n.alternate, f === null) {
          throw new Error(b(387));
        } f.memoizedState.memoizedState !== n.memoizedState.memoizedState && (l !== null ? l.push(ka) : l = [ka]);
      }n = n.return;
    }l !== null && cc(t, l, u, a), t.flags |= 262144;
  } function ce(l) {
    for (l = l.firstContext; l !== null;) {
      if (!Bl(l.context._currentValue, l.memoizedValue)) {
        return !0;
      } l = l.next;
    } return !1;
  } function yu(l) {
    Su = l, mt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  } function ol(l) {
    return _y(Su, l);
  } function Un(l, t) {
    return Su === null && yu(l), _y(l, t);
  } function _y(l, t) {
    const u = t._currentValue; if (t = { context: t, memoizedValue: u, next: null }, mt === null) {
      if (l === null) {
        throw new Error(b(308));
      } mt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else {
      mt = mt.next = t;
    } return u;
  } const bm = typeof AbortController < 'u'
    ? AbortController
    : function () {
      const l = []; const t = this.signal = { aborted: !1, addEventListener(u, a) {
        l.push(a);
      } }; this.abort = function () {
        t.aborted = !0, l.forEach((u) => {
          return u();
        });
      };
    }; const zm = el.unstable_scheduleCallback; const Tm = el.unstable_NormalPriority; const ul = { $$typeof: dt, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 }; function Pc() {
    return { controller: new bm(), data: new Map(), refCount: 0 };
  } function fn(l) {
    l.refCount--, l.refCount === 0 && zm(Tm, () => {
      l.controller.abort();
    });
  } let Na = null; let ic = 0; let Fu = 0; let Vu = null; function Em(l, t) {
    if (Na === null) {
      const u = Na = []; ic = 0, Fu = Oi(), Vu = { status: 'pending', value: void 0, then(a) {
        u.push(a);
      } };
    } return ic++, t.then(B0, B0), t;
  } function B0() {
    if (--ic === 0 && Na !== null) {
      Vu !== null && (Vu.status = 'fulfilled'); const l = Na; Na = null, Fu = 0, Vu = null; for (let t = 0; t < l.length; t++) {
        (0, l[t])();
      }
    }
  } function Am(l, t) {
    const u = []; const a = { status: 'pending', value: null, reason: null, then(n) {
      u.push(n);
    } }; return l.then(() => {
      a.status = 'fulfilled', a.value = t; for (let n = 0; n < u.length; n++) {
        (0, u[n])(t);
      }
    }, (n) => {
      for (a.status = 'rejected', a.reason = n, n = 0; n < u.length; n++) {
        (0, u[n])(void 0);
      }
    }), a;
  } const q0 = O.S; O.S = function (l, t) {
    Gv = Hl(), typeof t == 'object' && t !== null && typeof t.then == 'function' && Em(l, t), q0 !== null && q0(l, t);
  }; const eu = tt(null); function li() {
    const l = eu.current; return l !== null ? l : j.pooledCache;
  } function Vn(l, t) {
    t === null ? Z(eu, eu.current) : Z(eu, t.pool);
  } function Oy() {
    const l = li(); return l === null ? null : { parent: ul._currentValue, pool: l };
  } const ca = new Error(b(460)); const ti = new Error(b(474)); const qe = new Error(b(542)); const ie = { then() {} }; function Y0(l) {
    return l = l.status, l === 'fulfilled' || l === 'rejected';
  } function My(l, t, u) {
    switch (u = l[u], u === void 0 ? l.push(t) : u !== t && (t.then(ot, ot), t = u), t.status) {
      case 'fulfilled':return t.value; case 'rejected':throw l = t.reason, G0(l), l; default:if (typeof t.status == 'string') {
        t.then(ot, ot);
      } else {
        if (l = j, l !== null && l.shellSuspendCounter > 100) {
          throw new Error(b(482));
        } l = t, l.status = 'pending', l.then((a) => {
          if (t.status === 'pending') {
            const n = t; n.status = 'fulfilled', n.value = a;
          }
        }, (a) => {
          if (t.status === 'pending') {
            const n = t; n.status = 'rejected', n.reason = a;
          }
        });
      } switch (t.status) {
          case 'fulfilled':return t.value; case 'rejected':throw l = t.reason, G0(l), l;
        } throw fu = t, ca;
    }
  } function tu(l) {
    try {
      const t = l._init; return t(l._payload);
    } catch (u) {
      throw u !== null && typeof u == 'object' && typeof u.then == 'function' ? (fu = u, ca) : u;
    }
  } var fu = null; function r0() {
    if (fu === null) {
      throw new Error(b(459));
    } const l = fu; return fu = null, l;
  } function G0(l) {
    if (l === ca || l === qe) {
      throw new Error(b(483));
    }
  } let Lu = null; let Ja = 0; function Hn(l) {
    const t = Ja; return Ja += 1, Lu === null && (Lu = []), My(Lu, l, t);
  } function Sa(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  } function Nn(l, t) {
    throw t.$$typeof === co ? new Error(b(525)) : (l = Object.prototype.toString.call(t), new Error(b(31, l === '[object Object]' ? `object with keys {${Object.keys(t).join(', ')}}` : l)));
  } function py(l) {
    function t(v, y) {
      if (l) {
        const o = v.deletions; o === null ? (v.deletions = [y], v.flags |= 16) : o.push(y);
      }
    } function u(v, y) {
      if (!l) {
        return null;
      } for (;y !== null;) {
        t(v, y), y = y.sibling;
      } return null;
    } function a(v) {
      for (var y = new Map(); v !== null;) {
        v.key !== null ? y.set(v.key, v) : y.set(v.index, v), v = v.sibling;
      } return y;
    } function n(v, y) {
      return v = ht(v, y), v.index = 0, v.sibling = null, v;
    } function e(v, y, o) {
      return v.index = o, l ? (o = v.alternate, o !== null ? (o = o.index, o < y ? (v.flags |= 67108866, y) : o) : (v.flags |= 67108866, y)) : (v.flags |= 1048576, y);
    } function f(v) {
      return l && v.alternate === null && (v.flags |= 67108866), v;
    } function c(v, y, o, S) {
      return y === null || y.tag !== 6 ? (y = zf(o, v.mode, S), y.return = v, y) : (y = n(y, o), y.return = v, y);
    } function i(v, y, o, S) {
      const A = o.type; return A === Uu ? s(v, y, o.props.children, S, o.key) : y !== null && (y.elementType === A || typeof A == 'object' && A !== null && A.$$typeof === pt && tu(A) === y.type) ? (y = n(y, o.props), Sa(y, o), y.return = v, y) : (y = Zn(o.type, o.key, o.props, null, v.mode, S), Sa(y, o), y.return = v, y);
    } function d(v, y, o, S) {
      return y === null || y.tag !== 4 || y.stateNode.containerInfo !== o.containerInfo || y.stateNode.implementation !== o.implementation ? (y = Tf(o, v.mode, S), y.return = v, y) : (y = n(y, o.children || []), y.return = v, y);
    } function s(v, y, o, S, A) {
      return y === null || y.tag !== 7 ? (y = nu(o, v.mode, S, A), y.return = v, y) : (y = n(y, o), y.return = v, y);
    } function g(v, y, o) {
      if (typeof y == 'string' && y !== '' || typeof y == 'number' || typeof y == 'bigint') {
        return y = zf(`${y}`, v.mode, o), y.return = v, y;
      } if (typeof y == 'object' && y !== null) {
        switch (y.$$typeof) {
          case Tn:return o = Zn(y.type, y.key, y.props, null, v.mode, o), Sa(o, y), o.return = v, o; case Aa:return y = Tf(y, v.mode, o), y.return = v, y; case pt:return y = tu(y), g(v, y, o);
        } if (_a(y) || sa(y)) {
          return y = nu(y, v.mode, o, null), y.return = v, y;
        } if (typeof y.then == 'function') {
          return g(v, Hn(y), o);
        } if (y.$$typeof === dt) {
          return g(v, Un(v, y), o);
        } Nn(v, y);
      } return null;
    } function m(v, y, o, S) {
      const A = y !== null ? y.key : null; if (typeof o == 'string' && o !== '' || typeof o == 'number' || typeof o == 'bigint') {
        return A !== null ? null : c(v, y, `${o}`, S);
      } if (typeof o == 'object' && o !== null) {
        switch (o.$$typeof) {
          case Tn:return o.key === A ? i(v, y, o, S) : null; case Aa:return o.key === A ? d(v, y, o, S) : null; case pt:return o = tu(o), m(v, y, o, S);
        } if (_a(o) || sa(o)) {
          return A !== null ? null : s(v, y, o, S, null);
        } if (typeof o.then == 'function') {
          return m(v, y, Hn(o), S);
        } if (o.$$typeof === dt) {
          return m(v, y, Un(v, o), S);
        } Nn(v, o);
      } return null;
    } function h(v, y, o, S, A) {
      if (typeof S == 'string' && S !== '' || typeof S == 'number' || typeof S == 'bigint') {
        return v = v.get(o) || null, c(y, v, `${S}`, A);
      } if (typeof S == 'object' && S !== null) {
        switch (S.$$typeof) {
          case Tn:return v = v.get(S.key === null ? o : S.key) || null, i(y, v, S, A); case Aa:return v = v.get(S.key === null ? o : S.key) || null, d(y, v, S, A); case pt:return S = tu(S), h(v, y, o, S, A);
        } if (_a(S) || sa(S)) {
          return v = v.get(o) || null, s(y, v, S, A, null);
        } if (typeof S.then == 'function') {
          return h(v, y, o, Hn(S), A);
        } if (S.$$typeof === dt) {
          return h(v, y, o, Un(y, S), A);
        } Nn(y, S);
      } return null;
    } function z(v, y, o, S) {
      for (var A = null, B = null, E = y, D = y = 0, N = null; E !== null && D < o.length; D++) {
        E.index > D ? (N = E, E = null) : N = E.sibling; const q = m(v, E, o[D], S); if (q === null) {
          E === null && (E = N); break;
        }l && E && q.alternate === null && t(v, E), y = e(q, y, D), B === null ? A = q : B.sibling = q, B = q, E = N;
      } if (D === o.length) {
        return u(v, E), R && yt(v, D), A;
      } if (E === null) {
        for (;D < o.length; D++) {
          E = g(v, o[D], S), E !== null && (y = e(E, y, D), B === null ? A = E : B.sibling = E, B = E);
        } return R && yt(v, D), A;
      } for (E = a(E); D < o.length; D++) {
        N = h(E, v, D, o[D], S), N !== null && (l && N.alternate !== null && E.delete(N.key === null ? D : N.key), y = e(N, y, D), B === null ? A = N : B.sibling = N, B = N);
      } return l && E.forEach((_t) => {
        return t(v, _t);
      }), R && yt(v, D), A;
    } function T(v, y, o, S) {
      if (o == null) {
        throw new Error(b(151));
      } for (var A = null, B = null, E = y, D = y = 0, N = null, q = o.next(); E !== null && !q.done; D++, q = o.next()) {
        E.index > D ? (N = E, E = null) : N = E.sibling; const _t = m(v, E, q.value, S); if (_t === null) {
          E === null && (E = N); break;
        }l && E && _t.alternate === null && t(v, E), y = e(_t, y, D), B === null ? A = _t : B.sibling = _t, B = _t, E = N;
      } if (q.done) {
        return u(v, E), R && yt(v, D), A;
      } if (E === null) {
        for (;!q.done; D++, q = o.next()) {
          q = g(v, q.value, S), q !== null && (y = e(q, y, D), B === null ? A = q : B.sibling = q, B = q);
        } return R && yt(v, D), A;
      } for (E = a(E); !q.done; D++, q = o.next()) {
        q = h(E, v, D, q.value, S), q !== null && (l && q.alternate !== null && E.delete(q.key === null ? D : q.key), y = e(q, y, D), B === null ? A = q : B.sibling = q, B = q);
      } return l && E.forEach((Rd) => {
        return t(v, Rd);
      }), R && yt(v, D), A;
    } function _(v, y, o, S) {
      if (typeof o == 'object' && o !== null && o.type === Uu && o.key === null && (o = o.props.children), typeof o == 'object' && o !== null) {
        switch (o.$$typeof) {
          case Tn:l: {
            for (var A = o.key; y !== null;) {
              if (y.key === A) {
                if (A = o.type, A === Uu) {
                  if (y.tag === 7) {
                    u(v, y.sibling), S = n(y, o.props.children), S.return = v, v = S; break l;
                  }
                } else if (y.elementType === A || typeof A == 'object' && A !== null && A.$$typeof === pt && tu(A) === y.type) {
                  u(v, y.sibling), S = n(y, o.props), Sa(S, o), S.return = v, v = S; break l;
                }u(v, y); break;
              } else {
                t(v, y);
              }y = y.sibling;
            }o.type === Uu ? (S = nu(o.props.children, v.mode, S, o.key), S.return = v, v = S) : (S = Zn(o.type, o.key, o.props, null, v.mode, S), Sa(S, o), S.return = v, v = S);
          } return f(v); case Aa:l: {
            for (A = o.key; y !== null;) {
              if (y.key === A) {
                if (y.tag === 4 && y.stateNode.containerInfo === o.containerInfo && y.stateNode.implementation === o.implementation) {
                  u(v, y.sibling), S = n(y, o.children || []), S.return = v, v = S; break l;
                } else {
                  u(v, y); break;
                }
              } else {
                t(v, y);
              }y = y.sibling;
            }S = Tf(o, v.mode, S), S.return = v, v = S;
          } return f(v); case pt:return o = tu(o), _(v, y, o, S);
        } if (_a(o)) {
          return z(v, y, o, S);
        } if (sa(o)) {
          if (A = sa(o), typeof A != 'function') {
            throw new Error(b(150));
          } return o = A.call(o), T(v, y, o, S);
        } if (typeof o.then == 'function') {
          return _(v, y, Hn(o), S);
        } if (o.$$typeof === dt) {
          return _(v, y, Un(v, o), S);
        } Nn(v, o);
      } return typeof o == 'string' && o !== '' || typeof o == 'number' || typeof o == 'bigint' ? (o = `${o}`, y !== null && y.tag === 6 ? (u(v, y.sibling), S = n(y, o), S.return = v, v = S) : (u(v, y), S = zf(o, v.mode, S), S.return = v, v = S), f(v)) : u(v, y);
    } return function (v, y, o, S) {
      try {
        Ja = 0; const A = _(v, y, o, S); return Lu = null, A;
      } catch (E) {
        if (E === ca || E === qe) {
          throw E;
        } const B = Dl(29, E, null, v.mode); return B.lanes = S, B.return = v, B;
      } finally {}
    };
  } const vu = py(!0); const Dy = py(!1); let Dt = !1; function ui(l) {
    l.updateQueue = { baseState: l.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, lanes: 0, hiddenCallbacks: null }, callbacks: null };
  } function yc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = { baseState: l.baseState, firstBaseUpdate: l.firstBaseUpdate, lastBaseUpdate: l.lastBaseUpdate, shared: l.shared, callbacks: null });
  } function Qt(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  } function xt(l, t, u) {
    let a = l.updateQueue; if (a === null) {
      return null;
    } if (a = a.shared, (Y & 2) !== 0) {
      const n = a.pending; return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = ee(l), by(l, null, u), t;
    } return Be(l, a, t, u), ee(l);
  } function Ca(l, t, u) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (u & 4194048) !== 0)) {
      let a = t.lanes; a &= l.pendingLanes, u |= a, t.lanes = u, K1(l, u);
    }
  } function Af(l, t) {
    let u = l.updateQueue; let a = l.alternate; if (a !== null && (a = a.updateQueue, u === a)) {
      let n = null; let e = null; if (u = u.firstBaseUpdate, u !== null) {
        do {
          const f = { lane: u.lane, tag: u.tag, payload: u.payload, callback: null, next: null }; e === null ? n = e = f : e = e.next = f, u = u.next;
        } while (u !== null); e === null ? n = e = t : e = e.next = t;
      } else {
        n = e = t;
      }u = { baseState: a.baseState, firstBaseUpdate: n, lastBaseUpdate: e, shared: a.shared, callbacks: a.callbacks }, l.updateQueue = u; return;
    }l = u.lastBaseUpdate, l === null ? u.firstBaseUpdate = t : l.next = t, u.lastBaseUpdate = t;
  } let vc = !1; function Ra() {
    if (vc) {
      const l = Vu; if (l !== null) {
        throw l;
      }
    }
  } function Ba(l, t, u, a) {
    vc = !1; const n = l.updateQueue; Dt = !1; let e = n.firstBaseUpdate; let f = n.lastBaseUpdate; let c = n.shared.pending; if (c !== null) {
      n.shared.pending = null; var i = c; var d = i.next; i.next = null, f === null ? e = d : f.next = d, f = i; var s = l.alternate; s !== null && (s = s.updateQueue, c = s.lastBaseUpdate, c !== f && (c === null ? s.firstBaseUpdate = d : c.next = d, s.lastBaseUpdate = i));
    } if (e !== null) {
      let g = n.baseState; f = 0, s = d = i = null, c = e; do {
        let m = c.lane & -536870913; let h = m !== c.lane; if (h ? (C & m) === m : (a & m) === m) {
          m !== 0 && m === Fu && (vc = !0), s !== null && (s = s.next = { lane: 0, tag: c.tag, payload: c.payload, callback: null, next: null }); l: {
            let z = l; const T = c; m = t; const _ = u; switch (T.tag) {
              case 1:if (z = T.payload, typeof z == 'function') {
                g = z.call(_, g, m); break l;
              }g = z; break l; case 3:z.flags = z.flags & -65537 | 128; case 0:if (z = T.payload, m = typeof z == 'function' ? z.call(_, g, m) : z, m == null) {
                break l;
              } g = J({}, g, m); break l; case 2:Dt = !0;
            }
          }m = c.callback, m !== null && (l.flags |= 64, h && (l.flags |= 8192), h = n.callbacks, h === null ? n.callbacks = [m] : h.push(m));
        } else {
          h = { lane: m, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, s === null ? (d = s = h, i = g) : s = s.next = h, f |= m;
        } if (c = c.next, c === null) {
          if (c = n.shared.pending, c === null) {
            break;
          } h = c, c = h.next, h.next = null, n.lastBaseUpdate = h, n.shared.pending = null;
        }
      } while (!0); s === null && (i = g), n.baseState = i, n.firstBaseUpdate = d, n.lastBaseUpdate = s, e === null && (n.shared.lanes = 0), $t |= f, l.lanes = f, l.memoizedState = g;
    }
  } function Uy(l, t) {
    if (typeof l != 'function') {
      throw new TypeError(b(191, l));
    } l.call(t);
  } function Hy(l, t) {
    const u = l.callbacks; if (u !== null) {
      for (l.callbacks = null, l = 0; l < u.length; l++) {
        Uy(u[l], t);
      }
    }
  } const ku = tt(null); const ye = tt(0); function X0(l, t) {
    l = Et, Z(ye, l), Z(ku, t), Et = l | t.baseLanes;
  } function dc() {
    Z(ye, Et), Z(ku, ku.current);
  } function ai() {
    Et = ye.current, il(ku), il(ye);
  } const ql = tt(null); let Vl = null; function Ht(l) {
    const t = l.alternate; Z(I, I.current & 1), Z(ql, l), Vl === null && (t === null || ku.current !== null || t.memoizedState !== null) && (Vl = l);
  } function oc(l) {
    Z(I, I.current), Z(ql, l), Vl === null && (Vl = l);
  } function Ny(l) {
    l.tag === 22 ? (Z(I, I.current), Z(ql, l), Vl === null && (Vl = l)) : Nt(l);
  } function Nt() {
    Z(I, I.current), Z(ql, ql.current);
  } function pl(l) {
    il(ql), Vl === l && (Vl = null), il(I);
  } var I = tt(0); function ve(l) {
    for (let t = l; t !== null;) {
      if (t.tag === 13) {
        let u = t.memoizedState; if (u !== null && (u = u.dehydrated, u === null || Cc(u) || Rc(u))) {
          return t;
        }
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === 'forwards' || t.memoizedProps.revealOrder === 'backwards' || t.memoizedProps.revealOrder === 'unstable_legacy-backwards' || t.memoizedProps.revealOrder === 'together')) {
        if ((t.flags & 128) !== 0) {
          return t;
        }
      } else if (t.child !== null) {
        t.child.return = t, t = t.child; continue;
      } if (t === l) {
        break;
      } for (;t.sibling === null;) {
        if (t.return === null || t.return === l) {
          return null;
        } t = t.return;
      }t.sibling.return = t.return, t = t.sibling;
    } return null;
  } let bt = 0; let p = null; let x = null; let ll = null; let de = !1; let Ku = !1; let du = !1; let oe = 0; let wa = 0; let Ju = null; let _m = 0; function F() {
    throw new Error(b(321));
  } function ni(l, t) {
    if (t === null) {
      return !1;
    } for (let u = 0; u < t.length && u < l.length; u++) {
      if (!Bl(l[u], t[u])) {
        return !1;
      }
    } return !0;
  } function ei(l, t, u, a, n, e) {
    return bt = e, p = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, O.H = l === null || l.memoizedState === null ? cv : gi, du = !1, e = u(a, n), du = !1, Ku && (e = Ry(t, u, a, n)), Cy(l), e;
  } function Cy(l) {
    O.H = Wa; const t = x !== null && x.next !== null; if (bt = 0, ll = x = p = null, de = !1, wa = 0, Ju = null, t) {
      throw new Error(b(300));
    } l === null || al || (l = l.dependencies, l !== null && ce(l) && (al = !0));
  } function Ry(l, t, u, a) {
    p = l; let n = 0; do {
      if (Ku && (Ju = null), wa = 0, Ku = !1, n >= 25) {
        throw new Error(b(301));
      } if (n += 1, ll = x = null, l.updateQueue != null) {
        var e = l.updateQueue; e.lastEffect = null, e.events = null, e.stores = null, e.memoCache != null && (e.memoCache.index = 0);
      }O.H = iv, e = t(u, a);
    } while (Ku); return e;
  } function Om() {
    let l = O.H; let t = l.useState()[0]; return t = typeof t.then == 'function' ? cn(t) : t, l = l.useState()[0], (x !== null ? x.memoizedState : null) !== l && (p.flags |= 1024), t;
  } function fi() {
    const l = oe !== 0; return oe = 0, l;
  } function ci(l, t, u) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~u;
  } function ii(l) {
    if (de) {
      for (l = l.memoizedState; l !== null;) {
        const t = l.queue; t !== null && (t.pending = null), l = l.next;
      }de = !1;
    }bt = 0, ll = x = p = null, Ku = !1, wa = oe = 0, Ju = null;
  } function Sl() {
    const l = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }; return ll === null ? p.memoizedState = ll = l : ll = ll.next = l, ll;
  } function P() {
    if (x === null) {
      var l = p.alternate; l = l !== null ? l.memoizedState : null;
    } else {
      l = x.next;
    } const t = ll === null ? p.memoizedState : ll.next; if (t !== null) {
      ll = t, x = l;
    } else {
      if (l === null) {
        throw p.alternate === null ? new Error(b(467)) : new Error(b(310));
      } x = l, l = { memoizedState: x.memoizedState, baseState: x.baseState, baseQueue: x.baseQueue, queue: x.queue, next: null }, ll === null ? p.memoizedState = ll = l : ll = ll.next = l;
    } return ll;
  } function Ye() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  } function cn(l) {
    let t = wa; return wa += 1, Ju === null && (Ju = []), l = My(Ju, l, t), t = p, (ll === null ? t.memoizedState : ll.next) === null && (t = t.alternate, O.H = t === null || t.memoizedState === null ? cv : gi), l;
  } function re(l) {
    if (l !== null && typeof l == 'object') {
      if (typeof l.then == 'function') {
        return cn(l);
      } if (l.$$typeof === dt) {
        return ol(l);
      }
    } throw new Error(b(438, String(l)));
  } function yi(l) {
    let t = null; let u = p.updateQueue; if (u !== null && (t = u.memoCache), t == null) {
      var a = p.alternate; a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = { data: a.data.map((n) => {
        return n.slice();
      }), index: 0 })));
    } if (t == null && (t = { data: [], index: 0 }), u === null && (u = Ye(), p.updateQueue = u), u.memoCache = t, u = t.data[t.index], u === void 0) {
      for (u = t.data[t.index] = new Array(l), a = 0; a < l; a++) {
        u[a] = io;
      }
    } return t.index++, u;
  } function zt(l, t) {
    return typeof t == 'function' ? t(l) : t;
  } function Ln(l) {
    const t = P(); return vi(t, x, l);
  } function vi(l, t, u) {
    const a = l.queue; if (a === null) {
      throw new Error(b(311));
    } a.lastRenderedReducer = u; let n = l.baseQueue; let e = a.pending; if (e !== null) {
      if (n !== null) {
        var f = n.next; n.next = e.next, e.next = f;
      }t.baseQueue = n = e, a.pending = null;
    } if (e = l.baseState, n === null) {
      l.memoizedState = e;
    } else {
      t = n.next; let c = f = null; let i = null; let d = t; let s = !1; do {
        let g = d.lane & -536870913; if (g !== d.lane ? (C & g) === g : (bt & g) === g) {
          var m = d.revertLane; if (m === 0) {
            i !== null && (i = i.next = { lane: 0, revertLane: 0, gesture: null, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }), g === Fu && (s = !0);
          } else if ((bt & m) === m) {
            d = d.next, m === Fu && (s = !0); continue;
          } else {
            g = { lane: 0, revertLane: d.revertLane, gesture: null, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }, i === null ? (c = i = g, f = e) : i = i.next = g, p.lanes |= m, $t |= m;
          }g = d.action, du && u(e, g), e = d.hasEagerState ? d.eagerState : u(e, g);
        } else {
          m = { lane: g, revertLane: d.revertLane, gesture: d.gesture, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }, i === null ? (c = i = m, f = e) : i = i.next = m, p.lanes |= g, $t |= g;
        }d = d.next;
      } while (d !== null && d !== t); if (i === null ? f = e : i.next = c, !Bl(e, l.memoizedState) && (al = !0, s && (u = Vu, u !== null))) {
        throw u;
      } l.memoizedState = e, l.baseState = f, l.baseQueue = i, a.lastRenderedState = e;
    } return n === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  } function _f(l) {
    const t = P(); const u = t.queue; if (u === null) {
      throw new Error(b(311));
    } u.lastRenderedReducer = l; const a = u.dispatch; let n = u.pending; let e = t.memoizedState; if (n !== null) {
      u.pending = null; let f = n = n.next; do {
        e = l(e, f.action), f = f.next;
      } while (f !== n); Bl(e, t.memoizedState) || (al = !0), t.memoizedState = e, t.baseQueue === null && (t.baseState = e), u.lastRenderedState = e;
    } return [e, a];
  } function By(l, t, u) {
    const a = p; let n = P(); const e = R; if (e) {
      if (u === void 0) {
        throw new Error(b(407));
      } u = u();
    } else {
      u = t();
    } const f = !Bl((x || n).memoizedState, u); if (f && (n.memoizedState = u, al = !0), n = n.queue, di(ry.bind(null, a, n, l), [l]), n.getSnapshot !== t || f || ll !== null && ll.memoizedState.tag & 1) {
      if (a.flags |= 2048, Iu(9, { destroy: void 0 }, Yy.bind(null, a, n, u, t), null), j === null) {
        throw new Error(b(349));
      } e || (bt & 127) !== 0 || qy(a, t, u);
    } return u;
  } function qy(l, t, u) {
    l.flags |= 16384, l = { getSnapshot: t, value: u }, t = p.updateQueue, t === null ? (t = Ye(), p.updateQueue = t, t.stores = [l]) : (u = t.stores, u === null ? t.stores = [l] : u.push(l));
  } function Yy(l, t, u, a) {
    t.value = u, t.getSnapshot = a, Gy(t) && Xy(l);
  } function ry(l, t, u) {
    return u(() => {
      Gy(t) && Xy(l);
    });
  } function Gy(l) {
    const t = l.getSnapshot; l = l.value; try {
      const u = t(); return !Bl(l, u);
    } catch {
      return !0;
    }
  } function Xy(l) {
    const t = gu(l, 2); t !== null && Al(t, l, 2);
  } function mc(l) {
    const t = Sl(); if (typeof l == 'function') {
      const u = l; if (l = u(), du) {
        Rt(!0); try {
          u();
        } finally {
          Rt(!1);
        }
      }
    } return t.memoizedState = t.baseState = l, t.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: zt, lastRenderedState: l }, t;
  } function Qy(l, t, u, a) {
    return l.baseState = u, vi(l, x, typeof a == 'function' ? a : zt);
  } function Mm(l, t, u, a, n) {
    if (Xe(l)) {
      throw new Error(b(485));
    } if (l = t.action, l !== null) {
      var e = { payload: n, action: l, next: null, isTransition: !0, status: 'pending', value: null, reason: null, listeners: [], then(f) {
        e.listeners.push(f);
      } }; O.T !== null ? u(!0) : e.isTransition = !1, a(e), u = t.pending, u === null ? (e.next = t.pending = e, xy(t, e)) : (e.next = u.next, t.pending = u.next = e);
    }
  } function xy(l, t) {
    const u = t.action; const a = t.payload; const n = l.state; if (t.isTransition) {
      var e = O.T; const f = {}; O.T = f; try {
        const c = u(n, a); const i = O.S; i !== null && i(f, c), Q0(l, t, c);
      } catch (d) {
        hc(l, t, d);
      } finally {
        e !== null && f.types !== null && (e.types = f.types), O.T = e;
      }
    } else {
      try {
        e = u(n, a), Q0(l, t, e);
      } catch (d) {
        hc(l, t, d);
      }
    }
  } function Q0(l, t, u) {
    u !== null && typeof u == 'object' && typeof u.then == 'function'
      ? u.then((a) => {
          x0(l, t, a);
        }, (a) => {
          return hc(l, t, a);
        })
      : x0(l, t, u);
  } function x0(l, t, u) {
    t.status = 'fulfilled', t.value = u, jy(t), l.state = u, t = l.pending, t !== null && (u = t.next, u === t ? l.pending = null : (u = u.next, t.next = u, xy(l, u)));
  } function hc(l, t, u) {
    let a = l.pending; if (l.pending = null, a !== null) {
      a = a.next; do {
        t.status = 'rejected', t.reason = u, jy(t), t = t.next;
      } while (t !== a);
    }l.action = null;
  } function jy(l) {
    l = l.listeners; for (let t = 0; t < l.length; t++) {
      (0, l[t])();
    }
  } function Zy(l, t) {
    return t;
  } function j0(l, t) {
    if (R) {
      var u = j.formState; if (u !== null) {
        l: {
          var a = p; if (R) {
            if (K) {
              t: {
                for (var n = K, e = Zl; n.nodeType !== 8;) {
                  if (!e) {
                    n = null; break t;
                  } if (n = Ll(n.nextSibling), n === null) {
                    n = null; break t;
                  }
                }e = n.data, n = e === 'F!' || e === 'F' ? n : null;
              } if (n) {
                K = Ll(n.nextSibling), a = n.data === 'F!'; break l;
              }
            }wt(a);
          }a = !1;
        }a && (t = u[0]);
      }
    } return u = Sl(), u.memoizedState = u.baseState = t, a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Zy, lastRenderedState: t }, u.queue = a, u = nv.bind(null, p, a), a.dispatch = u, a = mc(!1), e = si.bind(null, p, !1, a.queue), a = Sl(), n = { state: t, dispatch: null, action: l, pending: null }, a.queue = n, u = Mm.bind(null, p, n, e, u), n.dispatch = u, a.memoizedState = l, [t, u, !1];
  } function Z0(l) {
    const t = P(); return Vy(t, x, l);
  } function Vy(l, t, u) {
    if (t = vi(l, t, Zy)[0], l = Ln(zt)[0], typeof t == 'object' && t !== null && typeof t.then == 'function') {
      try {
        var a = cn(t);
      } catch (f) {
        throw f === ca ? qe : f;
      }
    } else {
      a = t;
    }t = P(); const n = t.queue; const e = n.dispatch; return u !== t.memoizedState && (p.flags |= 2048, Iu(9, { destroy: void 0 }, pm.bind(null, n, u), null)), [a, e, l];
  } function pm(l, t) {
    l.action = t;
  } function V0(l) {
    let t = P(); let u = x; if (u !== null) {
      return Vy(t, u, l);
    } P(), t = t.memoizedState, u = P(); const a = u.queue.dispatch; return u.memoizedState = l, [t, a, !1];
  } function Iu(l, t, u, a) {
    return l = { tag: l, create: u, deps: a, inst: t, next: null }, t = p.updateQueue, t === null && (t = Ye(), p.updateQueue = t), u = t.lastEffect, u === null ? t.lastEffect = l.next = l : (a = u.next, u.next = l, l.next = a, t.lastEffect = l), l;
  } function Ly() {
    return P().memoizedState;
  } function Kn(l, t, u, a) {
    const n = Sl(); p.flags |= l, n.memoizedState = Iu(1 | t, { destroy: void 0 }, u, a === void 0 ? null : a);
  } function Ge(l, t, u, a) {
    const n = P(); a = a === void 0 ? null : a; const e = n.memoizedState.inst; x !== null && a !== null && ni(a, x.memoizedState.deps) ? n.memoizedState = Iu(t, e, u, a) : (p.flags |= l, n.memoizedState = Iu(1 | t, e, u, a));
  } function L0(l, t) {
    Kn(8390656, 8, l, t);
  } function di(l, t) {
    Ge(2048, 8, l, t);
  } function Dm(l) {
    p.flags |= 4; let t = p.updateQueue; if (t === null) {
      t = Ye(), p.updateQueue = t, t.events = [l];
    } else {
      const u = t.events; u === null ? t.events = [l] : u.push(l);
    }
  } function Ky(l) {
    const t = P().memoizedState; return Dm({ ref: t, nextImpl: l }), function () {
      if ((Y & 2) !== 0) {
        throw new Error(b(440));
      } return t.impl.apply(void 0, arguments);
    };
  } function Jy(l, t) {
    return Ge(4, 2, l, t);
  } function wy(l, t) {
    return Ge(4, 4, l, t);
  } function Wy(l, t) {
    if (typeof t == 'function') {
      l = l(); const u = t(l); return function () {
        typeof u == 'function' ? u() : t(null);
      };
    } if (t != null) {
      return l = l(), t.current = l, function () {
        t.current = null;
      };
    }
  } function $y(l, t, u) {
    u = u != null ? u.concat([l]) : null, Ge(4, 4, Wy.bind(null, t, l), u);
  } function oi() {} function Fy(l, t) {
    const u = P(); t = t === void 0 ? null : t; const a = u.memoizedState; return t !== null && ni(t, a[1]) ? a[0] : (u.memoizedState = [l, t], l);
  } function ky(l, t) {
    const u = P(); t = t === void 0 ? null : t; let a = u.memoizedState; if (t !== null && ni(t, a[1])) {
      return a[0];
    } if (a = l(), du) {
      Rt(!0); try {
        l();
      } finally {
        Rt(!1);
      }
    } return u.memoizedState = [a, t], a;
  } function mi(l, t, u) {
    return u === void 0 || (bt & 1073741824) !== 0 && (C & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = u, l = Qv(), p.lanes |= l, $t |= l, u);
  } function Iy(l, t, u, a) {
    return Bl(u, t) ? u : ku.current !== null ? (l = mi(l, u, a), Bl(l, t) || (al = !0), l) : (bt & 42) === 0 || (bt & 1073741824) !== 0 && (C & 261930) === 0 ? (al = !0, l.memoizedState = u) : (l = Qv(), p.lanes |= l, $t |= l, t);
  } function Py(l, t, u, a, n) {
    const e = r.p; r.p = e !== 0 && e < 8 ? e : 8; const f = O.T; const c = {}; O.T = c, si(l, !1, t, u); try {
      const i = n(); const d = O.S; if (d !== null && d(c, i), i !== null && typeof i == 'object' && typeof i.then == 'function') {
        const s = Am(i, a); qa(l, t, s, Rl(l));
      } else {
        qa(l, t, a, Rl(l));
      }
    } catch (g) {
      qa(l, t, { then() {}, status: 'rejected', reason: g }, Rl());
    } finally {
      r.p = e, f !== null && c.types !== null && (f.types = c.types), O.T = f;
    }
  } function Um() {} function sc(l, t, u, a) {
    if (l.tag !== 5) {
      throw new Error(b(476));
    } const n = lv(l).queue; Py(l, n, t, au, u === null
      ? Um
      : () => {
          return tv(l), u(a);
        });
  } function lv(l) {
    let t = l.memoizedState; if (t !== null) {
      return t;
    } t = { memoizedState: au, baseState: au, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: zt, lastRenderedState: au }, next: null }; const u = {}; return t.next = { memoizedState: u, baseState: u, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: zt, lastRenderedState: u }, next: null }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  } function tv(l) {
    let t = lv(l); t.next === null && (t = l.alternate.memoizedState), qa(l, t.next.queue, {}, Rl());
  } function hi() {
    return ol(ka);
  } function uv() {
    return P().memoizedState;
  } function av() {
    return P().memoizedState;
  } function Hm(l) {
    for (let t = l.return; t !== null;) {
      switch (t.tag) {
        case 24:case 3:var u = Rl(); l = Qt(u); var a = xt(t, l, u); a !== null && (Al(a, t, u), Ca(a, t, u)), t = { cache: Pc() }, l.payload = t; return;
      }t = t.return;
    }
  } function Nm(l, t, u) {
    const a = Rl(); u = { lane: a, revertLane: 0, gesture: null, action: u, hasEagerState: !1, eagerState: null, next: null }, Xe(l) ? ev(t, u) : (u = $c(l, t, u, a), u !== null && (Al(u, l, a), fv(u, t, a)));
  } function nv(l, t, u) {
    const a = Rl(); qa(l, t, u, a);
  } function qa(l, t, u, a) {
    const n = { lane: a, revertLane: 0, gesture: null, action: u, hasEagerState: !1, eagerState: null, next: null }; if (Xe(l)) {
      ev(t, n);
    } else {
      let e = l.alternate; if (l.lanes === 0 && (e === null || e.lanes === 0) && (e = t.lastRenderedReducer, e !== null)) {
        try {
          const f = t.lastRenderedState; const c = e(f, u); if (n.hasEagerState = !0, n.eagerState = c, Bl(c, f)) {
            return Be(l, t, n, 0), j === null && Re(), !1;
          }
        } catch {} finally {}
      } if (u = $c(l, t, n, a), u !== null) {
        return Al(u, l, a), fv(u, t, a), !0;
      }
    } return !1;
  } function si(l, t, u, a) {
    if (a = { lane: 2, revertLane: Oi(), gesture: null, action: a, hasEagerState: !1, eagerState: null, next: null }, Xe(l)) {
      if (t) {
        throw new Error(b(479));
      }
    } else {
      t = $c(l, u, a, 2), t !== null && Al(t, l, 2);
    }
  } function Xe(l) {
    const t = l.alternate; return l === p || t !== null && t === p;
  } function ev(l, t) {
    Ku = de = !0; const u = l.pending; u === null ? t.next = t : (t.next = u.next, u.next = t), l.pending = t;
  } function fv(l, t, u) {
    if ((u & 4194048) !== 0) {
      let a = t.lanes; a &= l.pendingLanes, u |= a, t.lanes = u, K1(l, u);
    }
  } var Wa = { readContext: ol, use: re, useCallback: F, useContext: F, useEffect: F, useImperativeHandle: F, useLayoutEffect: F, useInsertionEffect: F, useMemo: F, useReducer: F, useRef: F, useState: F, useDebugValue: F, useDeferredValue: F, useTransition: F, useSyncExternalStore: F, useId: F, useHostTransitionStatus: F, useFormState: F, useActionState: F, useOptimistic: F, useMemoCache: F, useCacheRefresh: F }; Wa.useEffectEvent = F; var cv = { readContext: ol, use: re, useCallback(l, t) {
    return Sl().memoizedState = [l, t === void 0 ? null : t], l;
  }, useContext: ol, useEffect: L0, useImperativeHandle(l, t, u) {
    u = u != null ? u.concat([l]) : null, Kn(4194308, 4, Wy.bind(null, t, l), u);
  }, useLayoutEffect(l, t) {
    return Kn(4194308, 4, l, t);
  }, useInsertionEffect(l, t) {
    Kn(4, 2, l, t);
  }, useMemo(l, t) {
    const u = Sl(); t = t === void 0 ? null : t; const a = l(); if (du) {
      Rt(!0); try {
        l();
      } finally {
        Rt(!1);
      }
    } return u.memoizedState = [a, t], a;
  }, useReducer(l, t, u) {
    const a = Sl(); if (u !== void 0) {
      var n = u(t); if (du) {
        Rt(!0); try {
          u(t);
        } finally {
          Rt(!1);
        }
      }
    } else {
      n = t;
    } return a.memoizedState = a.baseState = n, l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: l, lastRenderedState: n }, a.queue = l, l = l.dispatch = Nm.bind(null, p, l), [a.memoizedState, l];
  }, useRef(l) {
    const t = Sl(); return l = { current: l }, t.memoizedState = l;
  }, useState(l) {
    l = mc(l); const t = l.queue; const u = nv.bind(null, p, t); return t.dispatch = u, [l.memoizedState, u];
  }, useDebugValue: oi, useDeferredValue(l, t) {
    const u = Sl(); return mi(u, l, t);
  }, useTransition() {
    let l = mc(!1); return l = Py.bind(null, p, l.queue, !0, !1), Sl().memoizedState = l, [!1, l];
  }, useSyncExternalStore(l, t, u) {
    const a = p; const n = Sl(); if (R) {
      if (u === void 0) {
        throw new Error(b(407));
      } u = u();
    } else {
      if (u = t(), j === null) {
        throw new Error(b(349));
      } (C & 127) !== 0 || qy(a, t, u);
    }n.memoizedState = u; const e = { value: u, getSnapshot: t }; return n.queue = e, L0(ry.bind(null, a, e, l), [l]), a.flags |= 2048, Iu(9, { destroy: void 0 }, Yy.bind(null, a, e, u, t), null), u;
  }, useId() {
    const l = Sl(); let t = j.identifierPrefix; if (R) {
      var u = Il; const a = kl; u = (a & ~(1 << 32 - Cl(a) - 1)).toString(32) + u, t = `_${t}R_${u}`, u = oe++, u > 0 && (t += `H${u.toString(32)}`), t += '_';
    } else {
      u = _m++, t = `_${t}r_${u.toString(32)}_`;
    } return l.memoizedState = t;
  }, useHostTransitionStatus: hi, useFormState: j0, useActionState: j0, useOptimistic(l) {
    let t = Sl(); t.memoizedState = t.baseState = l; const u = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null }; return t.queue = u, t = si.bind(null, p, !0, u), u.dispatch = t, [l, t];
  }, useMemoCache: yi, useCacheRefresh() {
    return Sl().memoizedState = Hm.bind(null, p);
  }, useEffectEvent(l) {
    const t = Sl(); const u = { impl: l }; return t.memoizedState = u, function () {
      if ((Y & 2) !== 0) {
        throw new Error(b(440));
      } return u.impl.apply(void 0, arguments);
    };
  } }; var gi = { readContext: ol, use: re, useCallback: Fy, useContext: ol, useEffect: di, useImperativeHandle: $y, useInsertionEffect: Jy, useLayoutEffect: wy, useMemo: ky, useReducer: Ln, useRef: Ly, useState() {
    return Ln(zt);
  }, useDebugValue: oi, useDeferredValue(l, t) {
    const u = P(); return Iy(u, x.memoizedState, l, t);
  }, useTransition() {
    const l = Ln(zt)[0]; const t = P().memoizedState; return [typeof l == 'boolean' ? l : cn(l), t];
  }, useSyncExternalStore: By, useId: uv, useHostTransitionStatus: hi, useFormState: Z0, useActionState: Z0, useOptimistic(l, t) {
    const u = P(); return Qy(u, x, l, t);
  }, useMemoCache: yi, useCacheRefresh: av }; gi.useEffectEvent = Ky; var iv = { readContext: ol, use: re, useCallback: Fy, useContext: ol, useEffect: di, useImperativeHandle: $y, useInsertionEffect: Jy, useLayoutEffect: wy, useMemo: ky, useReducer: _f, useRef: Ly, useState() {
    return _f(zt);
  }, useDebugValue: oi, useDeferredValue(l, t) {
    const u = P(); return x === null ? mi(u, l, t) : Iy(u, x.memoizedState, l, t);
  }, useTransition() {
    const l = _f(zt)[0]; const t = P().memoizedState; return [typeof l == 'boolean' ? l : cn(l), t];
  }, useSyncExternalStore: By, useId: uv, useHostTransitionStatus: hi, useFormState: V0, useActionState: V0, useOptimistic(l, t) {
    const u = P(); return x !== null ? Qy(u, x, l, t) : (u.baseState = l, [l, u.queue.dispatch]);
  }, useMemoCache: yi, useCacheRefresh: av }; iv.useEffectEvent = Ky; function Of(l, t, u, a) {
    t = l.memoizedState, u = u(a, t), u = u == null ? t : J({}, t, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  } const gc = { enqueueSetState(l, t, u) {
    l = l._reactInternals; const a = Rl(); const n = Qt(a); n.payload = t, u != null && (n.callback = u), t = xt(l, n, a), t !== null && (Al(t, l, a), Ca(t, l, a));
  }, enqueueReplaceState(l, t, u) {
    l = l._reactInternals; const a = Rl(); const n = Qt(a); n.tag = 1, n.payload = t, u != null && (n.callback = u), t = xt(l, n, a), t !== null && (Al(t, l, a), Ca(t, l, a));
  }, enqueueForceUpdate(l, t) {
    l = l._reactInternals; const u = Rl(); const a = Qt(u); a.tag = 2, t != null && (a.callback = t), t = xt(l, a, u), t !== null && (Al(t, l, u), Ca(t, l, u));
  } }; function K0(l, t, u, a, n, e, f) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == 'function' ? l.shouldComponentUpdate(a, e, f) : t.prototype && t.prototype.isPureReactComponent ? !Va(u, a) || !Va(n, e) : !0;
  } function J0(l, t, u, a) {
    l = t.state, typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(u, a), typeof t.UNSAFE_componentWillReceiveProps == 'function' && t.UNSAFE_componentWillReceiveProps(u, a), t.state !== l && gc.enqueueReplaceState(t, t.state, null);
  } function ou(l, t) {
    let u = t; if ('ref' in t) {
      u = {}; for (const a in t) {
        a !== 'ref' && (u[a] = t[a]);
      }
    } if (l = l.defaultProps) {
      u === t && (u = J({}, u)); for (const n in l) {
        u[n] === void 0 && (u[n] = l[n]);
      }
    } return u;
  } function yv(l) {
    ne(l);
  } function vv(l) {
    console.error(l);
  } function dv(l) {
    ne(l);
  } function me(l, t) {
    try {
      const u = l.onUncaughtError; u(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(() => {
        throw a;
      });
    }
  } function w0(l, t, u) {
    try {
      const a = l.onCaughtError; a(u.value, { componentStack: u.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (n) {
      setTimeout(() => {
        throw n;
      });
    }
  } function Sc(l, t, u) {
    return u = Qt(u), u.tag = 3, u.payload = { element: null }, u.callback = function () {
      me(l, t);
    }, u;
  } function ov(l) {
    return l = Qt(l), l.tag = 3, l;
  } function mv(l, t, u, a) {
    const n = u.type.getDerivedStateFromError; if (typeof n == 'function') {
      const e = a.value; l.payload = function () {
        return n(e);
      }, l.callback = function () {
        w0(t, u, a);
      };
    } const f = u.stateNode; f !== null && typeof f.componentDidCatch == 'function' && (l.callback = function () {
      w0(t, u, a), typeof n != 'function' && (jt === null ? jt = new Set([this]) : jt.add(this)); const c = a.stack; this.componentDidCatch(a.value, { componentStack: c !== null ? c : '' });
    });
  } function Cm(l, t, u, a, n) {
    if (u.flags |= 32768, a !== null && typeof a == 'object' && typeof a.then == 'function') {
      if (t = u.alternate, t !== null && fa(t, u, n, !0), u = ql.current, u !== null) {
        switch (u.tag) {
          case 31:case 13:return Vl === null ? be() : u.alternate === null && k === 0 && (k = 3), u.flags &= -257, u.flags |= 65536, u.lanes = n, a === ie ? u.flags |= 16384 : (t = u.updateQueue, t === null ? u.updateQueue = new Set([a]) : t.add(a), Yf(l, a, n)), !1; case 22:return u.flags |= 65536, a === ie ? u.flags |= 16384 : (t = u.updateQueue, t === null ? (t = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }, u.updateQueue = t) : (u = t.retryQueue, u === null ? t.retryQueue = new Set([a]) : u.add(a)), Yf(l, a, n)), !1;
        } throw new Error(b(435, u.tag));
      } return Yf(l, a, n), be(), !1;
    } if (R) {
      return t = ql.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== nc && (l = new Error(b(422), { cause: a }), Ka(jl(l, u)))) : (a !== nc && (t = new Error(b(423), { cause: a }), Ka(jl(t, u))), l = l.current.alternate, l.flags |= 65536, n &= -n, l.lanes |= n, a = jl(a, u), n = Sc(l.stateNode, a, n), Af(l, n), k !== 4 && (k = 2)), !1;
    } let e = new Error(b(520), { cause: a }); if (e = jl(e, u), Ga === null ? Ga = [e] : Ga.push(e), k !== 4 && (k = 2), t === null) {
      return !0;
    } a = jl(a, u), u = t; do {
      switch (u.tag) {
        case 3:return u.flags |= 65536, l = n & -n, u.lanes |= l, l = Sc(u.stateNode, a, l), Af(u, l), !1; case 1:if (t = u.type, e = u.stateNode, (u.flags & 128) === 0 && (typeof t.getDerivedStateFromError == 'function' || e !== null && typeof e.componentDidCatch == 'function' && (jt === null || !jt.has(e)))) {
          return u.flags |= 65536, n &= -n, u.lanes |= n, n = ov(n), mv(n, l, u, a), Af(u, n), !1;
        }
      }u = u.return;
    } while (u !== null); return !1;
  } const Si = new Error(b(461)); var al = !1; function yl(l, t, u, a) {
    t.child = l === null ? Dy(t, null, u, a) : vu(t, l.child, u, a);
  } function W0(l, t, u, a, n) {
    u = u.render; const e = t.ref; if ('ref' in a) {
      var f = {}; for (var c in a) {
        c !== 'ref' && (f[c] = a[c]);
      }
    } else {
      f = a;
    } return yu(t), a = ei(l, t, u, f, e, n), c = fi(), l !== null && !al ? (ci(l, t, n), Tt(l, t, n)) : (R && c && kc(t), t.flags |= 1, yl(l, t, a, n), t.child);
  } function $0(l, t, u, a, n) {
    if (l === null) {
      var e = u.type; return typeof e == 'function' && !Fc(e) && e.defaultProps === void 0 && u.compare === null ? (t.tag = 15, t.type = e, hv(l, t, e, a, n)) : (l = Zn(u.type, null, a, t, t.mode, n), l.ref = t.ref, l.return = t, t.child = l);
    } if (e = l.child, !bi(l, n)) {
      const f = e.memoizedProps; if (u = u.compare, u = u !== null ? u : Va, u(f, a) && l.ref === t.ref) {
        return Tt(l, t, n);
      }
    } return t.flags |= 1, l = ht(e, a), l.ref = t.ref, l.return = t, t.child = l;
  } function hv(l, t, u, a, n) {
    if (l !== null) {
      const e = l.memoizedProps; if (Va(e, a) && l.ref === t.ref) {
        if (al = !1, t.pendingProps = a = e, bi(l, n)) {
          (l.flags & 131072) !== 0 && (al = !0);
        } else {
          return t.lanes = l.lanes, Tt(l, t, n);
        }
      }
    } return bc(l, t, u, a, n);
  } function sv(l, t, u, a) {
    let n = a.children; let e = l !== null ? l.memoizedState : null; if (l === null && t.stateNode === null && (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }), a.mode === 'hidden') {
      if ((t.flags & 128) !== 0) {
        if (e = e !== null ? e.baseLanes | u : u, l !== null) {
          for (a = t.child = l.child, n = 0; a !== null;) {
            n = n | a.lanes | a.childLanes, a = a.sibling;
          }a = n & ~e;
        } else {
          a = 0, t.child = null;
        } return F0(l, t, e, u, a);
      } if ((u & 536870912) !== 0) {
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Vn(t, e !== null ? e.cachePool : null), e !== null ? X0(t, e) : dc(), Ny(t);
      } else {
        return a = t.lanes = 536870912, F0(l, t, e !== null ? e.baseLanes | u : u, u, a);
      }
    } else {
      e !== null ? (Vn(t, e.cachePool), X0(t, e), Nt(t), t.memoizedState = null) : (l !== null && Vn(t, null), dc(), Nt(t));
    } return yl(l, t, n, u), t.child;
  } function Ma(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }), t.sibling;
  } function F0(l, t, u, a, n) {
    let e = li(); return e = e === null ? null : { parent: ul._currentValue, pool: e }, t.memoizedState = { baseLanes: u, cachePool: e }, l !== null && Vn(t, null), dc(), Ny(t), l !== null && fa(l, t, a, !0), t.childLanes = n, null;
  } function Jn(l, t) {
    return t = he({ mode: t.mode, children: t.children }, l.mode), t.ref = l.ref, l.child = t, t.return = l, t;
  } function k0(l, t, u) {
    return vu(t, l.child, null, u), l = Jn(t, t.pendingProps), l.flags |= 2, pl(t), t.memoizedState = null, l;
  } function Rm(l, t, u) {
    let a = t.pendingProps; let n = (t.flags & 128) !== 0; if (t.flags &= -129, l === null) {
      if (R) {
        if (a.mode === 'hidden') {
          return l = Jn(t, a), t.lanes = 536870912, Ma(null, l);
        } if (oc(t), (l = K) ? (l = cd(l, Zl), l = l !== null && l.data === '&' ? l : null, l !== null && (t.memoizedState = { dehydrated: l, treeContext: Jt !== null ? { id: kl, overflow: Il } : null, retryLane: 536870912, hydrationErrors: null }, u = Ty(l), u.return = t, t.child = u, dl = t, K = null)) : l = null, l === null) {
          throw wt(t);
        } return t.lanes = 536870912, null;
      } return Jn(t, a);
    } const e = l.memoizedState; if (e !== null) {
      let f = e.dehydrated; if (oc(t), n) {
        if (t.flags & 256) {
          t.flags &= -257, t = k0(l, t, u);
        } else if (t.memoizedState !== null) {
          t.child = l.child, t.flags |= 128, t = null;
        } else {
          throw new Error(b(558));
        }
      } else if (al || fa(l, t, u, !1), n = (u & l.childLanes) !== 0, al || n) {
        if (a = j, a !== null && (f = J1(a, u), f !== 0 && f !== e.retryLane)) {
          throw e.retryLane = f, gu(l, f), Al(a, l, f), Si;
        } be(), t = k0(l, t, u);
      } else {
        l = e.treeContext, K = Ll(f.nextSibling), dl = t, R = !0, Xt = null, Zl = !1, l !== null && Ay(t, l), t = Jn(t, a), t.flags |= 4096;
      } return t;
    } return l = ht(l.child, { mode: a.mode, children: a.children }), l.ref = t.ref, t.child = l, l.return = t, l;
  } function wn(l, t) {
    const u = t.ref; if (u === null) {
      l !== null && l.ref !== null && (t.flags |= 4194816);
    } else {
      if (typeof u != 'function' && typeof u != 'object') {
        throw new TypeError(b(284));
      } (l === null || l.ref !== u) && (t.flags |= 4194816);
    }
  } function bc(l, t, u, a, n) {
    return yu(t), u = ei(l, t, u, a, void 0, n), a = fi(), l !== null && !al ? (ci(l, t, n), Tt(l, t, n)) : (R && a && kc(t), t.flags |= 1, yl(l, t, u, n), t.child);
  } function I0(l, t, u, a, n, e) {
    return yu(t), t.updateQueue = null, u = Ry(t, a, u, n), Cy(l), a = fi(), l !== null && !al ? (ci(l, t, e), Tt(l, t, e)) : (R && a && kc(t), t.flags |= 1, yl(l, t, u, e), t.child);
  } function P0(l, t, u, a, n) {
    if (yu(t), t.stateNode === null) {
      var e = ru; var f = u.contextType; typeof f == 'object' && f !== null && (e = ol(f)), e = new u(a, e), t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null, e.updater = gc, t.stateNode = e, e._reactInternals = t, e = t.stateNode, e.props = a, e.state = t.memoizedState, e.refs = {}, ui(t), f = u.contextType, e.context = typeof f == 'object' && f !== null ? ol(f) : ru, e.state = t.memoizedState, f = u.getDerivedStateFromProps, typeof f == 'function' && (Of(t, u, f, a), e.state = t.memoizedState), typeof u.getDerivedStateFromProps == 'function' || typeof e.getSnapshotBeforeUpdate == 'function' || typeof e.UNSAFE_componentWillMount != 'function' && typeof e.componentWillMount != 'function' || (f = e.state, typeof e.componentWillMount == 'function' && e.componentWillMount(), typeof e.UNSAFE_componentWillMount == 'function' && e.UNSAFE_componentWillMount(), f !== e.state && gc.enqueueReplaceState(e, e.state, null), Ba(t, a, e, n), Ra(), e.state = t.memoizedState), typeof e.componentDidMount == 'function' && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      e = t.stateNode; var c = t.memoizedProps; var i = ou(u, c); e.props = i; var d = e.context; var s = u.contextType; f = ru, typeof s == 'object' && s !== null && (f = ol(s)); var g = u.getDerivedStateFromProps; s = typeof g == 'function' || typeof e.getSnapshotBeforeUpdate == 'function', c = t.pendingProps !== c, s || typeof e.UNSAFE_componentWillReceiveProps != 'function' && typeof e.componentWillReceiveProps != 'function' || (c || d !== f) && J0(t, e, a, f), Dt = !1; var m = t.memoizedState; e.state = m, Ba(t, a, e, n), Ra(), d = t.memoizedState, c || m !== d || Dt ? (typeof g == 'function' && (Of(t, u, g, a), d = t.memoizedState), (i = Dt || K0(t, u, i, a, m, d, f)) ? (s || typeof e.UNSAFE_componentWillMount != 'function' && typeof e.componentWillMount != 'function' || (typeof e.componentWillMount == 'function' && e.componentWillMount(), typeof e.UNSAFE_componentWillMount == 'function' && e.UNSAFE_componentWillMount()), typeof e.componentDidMount == 'function' && (t.flags |= 4194308)) : (typeof e.componentDidMount == 'function' && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = d), e.props = a, e.state = d, e.context = f, a = i) : (typeof e.componentDidMount == 'function' && (t.flags |= 4194308), a = !1);
    } else {
      e = t.stateNode, yc(l, t), f = t.memoizedProps, s = ou(u, f), e.props = s, g = t.pendingProps, m = e.context, d = u.contextType, i = ru, typeof d == 'object' && d !== null && (i = ol(d)), c = u.getDerivedStateFromProps, (d = typeof c == 'function' || typeof e.getSnapshotBeforeUpdate == 'function') || typeof e.UNSAFE_componentWillReceiveProps != 'function' && typeof e.componentWillReceiveProps != 'function' || (f !== g || m !== i) && J0(t, e, a, i), Dt = !1, m = t.memoizedState, e.state = m, Ba(t, a, e, n), Ra(); let h = t.memoizedState; f !== g || m !== h || Dt || l !== null && l.dependencies !== null && ce(l.dependencies) ? (typeof c == 'function' && (Of(t, u, c, a), h = t.memoizedState), (s = Dt || K0(t, u, s, a, m, h, i) || l !== null && l.dependencies !== null && ce(l.dependencies)) ? (d || typeof e.UNSAFE_componentWillUpdate != 'function' && typeof e.componentWillUpdate != 'function' || (typeof e.componentWillUpdate == 'function' && e.componentWillUpdate(a, h, i), typeof e.UNSAFE_componentWillUpdate == 'function' && e.UNSAFE_componentWillUpdate(a, h, i)), typeof e.componentDidUpdate == 'function' && (t.flags |= 4), typeof e.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024)) : (typeof e.componentDidUpdate != 'function' || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof e.getSnapshotBeforeUpdate != 'function' || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = h), e.props = a, e.state = h, e.context = i, a = s) : (typeof e.componentDidUpdate != 'function' || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 4), typeof e.getSnapshotBeforeUpdate != 'function' || f === l.memoizedProps && m === l.memoizedState || (t.flags |= 1024), a = !1);
    } return e = a, wn(l, t), a = (t.flags & 128) !== 0, e || a ? (e = t.stateNode, u = a && typeof u.getDerivedStateFromError != 'function' ? null : e.render(), t.flags |= 1, l !== null && a ? (t.child = vu(t, l.child, null, n), t.child = vu(t, null, u, n)) : yl(l, t, u, n), t.memoizedState = e.state, l = t.child) : l = Tt(l, t, n), l;
  } function l1(l, t, u, a) {
    return iu(), t.flags |= 256, yl(l, t, u, a), t.child;
  } const Mf = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null }; function pf(l) {
    return { baseLanes: l, cachePool: Oy() };
  } function Df(l, t, u) {
    return l = l !== null ? l.childLanes & ~u : 0, t && (l |= Ul), l;
  } function gv(l, t, u) {
    let a = t.pendingProps; let n = !1; const e = (t.flags & 128) !== 0; let f; if ((f = e) || (f = l !== null && l.memoizedState === null ? !1 : (I.current & 2) !== 0), f && (n = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (R) {
        if (n ? Ht(t) : Nt(t), (l = K) ? (l = cd(l, Zl), l = l !== null && l.data !== '&' ? l : null, l !== null && (t.memoizedState = { dehydrated: l, treeContext: Jt !== null ? { id: kl, overflow: Il } : null, retryLane: 536870912, hydrationErrors: null }, u = Ty(l), u.return = t, t.child = u, dl = t, K = null)) : l = null, l === null) {
          throw wt(t);
        } return Rc(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      } var c = a.children; return a = a.fallback, n ? (Nt(t), n = t.mode, c = he({ mode: 'hidden', children: c }, n), a = nu(a, n, u, null), c.return = t, a.return = t, c.sibling = a, t.child = c, a = t.child, a.memoizedState = pf(u), a.childLanes = Df(l, f, u), t.memoizedState = Mf, Ma(null, a)) : (Ht(t), zc(t, c));
    } let i = l.memoizedState; if (i !== null && (c = i.dehydrated, c !== null)) {
      if (e) {
        t.flags & 256 ? (Ht(t), t.flags &= -257, t = Uf(l, t, u)) : t.memoizedState !== null ? (Nt(t), t.child = l.child, t.flags |= 128, t = null) : (Nt(t), c = a.fallback, n = t.mode, a = he({ mode: 'visible', children: a.children }, n), c = nu(c, n, u, null), c.flags |= 2, a.return = t, c.return = t, a.sibling = c, t.child = a, vu(t, l.child, null, u), a = t.child, a.memoizedState = pf(u), a.childLanes = Df(l, f, u), t.memoizedState = Mf, t = Ma(null, a));
      } else if (Ht(t), Rc(c)) {
        if (f = c.nextSibling && c.nextSibling.dataset, f) {
          var d = f.dgst;
        } f = d, a = new Error(b(419)), a.stack = '', a.digest = f, Ka({ value: a, source: null, stack: null }), t = Uf(l, t, u);
      } else if (al || fa(l, t, u, !1), f = (u & l.childLanes) !== 0, al || f) {
        if (f = j, f !== null && (a = J1(f, u), a !== 0 && a !== i.retryLane)) {
          throw i.retryLane = a, gu(l, a), Al(f, l, a), Si;
        } Cc(c) || be(), t = Uf(l, t, u);
      } else {
        Cc(c) ? (t.flags |= 192, t.child = l.child, t = null) : (l = i.treeContext, K = Ll(c.nextSibling), dl = t, R = !0, Xt = null, Zl = !1, l !== null && Ay(t, l), t = zc(t, a.children), t.flags |= 4096);
      } return t;
    } return n ? (Nt(t), c = a.fallback, n = t.mode, i = l.child, d = i.sibling, a = ht(i, { mode: 'hidden', children: a.children }), a.subtreeFlags = i.subtreeFlags & 65011712, d !== null ? c = ht(d, c) : (c = nu(c, n, u, null), c.flags |= 2), c.return = t, a.return = t, a.sibling = c, t.child = a, Ma(null, a), a = t.child, c = l.child.memoizedState, c === null ? c = pf(u) : (n = c.cachePool, n !== null ? (i = ul._currentValue, n = n.parent !== i ? { parent: i, pool: i } : n) : n = Oy(), c = { baseLanes: c.baseLanes | u, cachePool: n }), a.memoizedState = c, a.childLanes = Df(l, f, u), t.memoizedState = Mf, Ma(l.child, a)) : (Ht(t), u = l.child, l = u.sibling, u = ht(u, { mode: 'visible', children: a.children }), u.return = t, u.sibling = null, l !== null && (f = t.deletions, f === null ? (t.deletions = [l], t.flags |= 16) : f.push(l)), t.child = u, t.memoizedState = null, u);
  } function zc(l, t) {
    return t = he({ mode: 'visible', children: t }, l.mode), t.return = l, l.child = t;
  } function he(l, t) {
    return l = Dl(22, l, null, t), l.lanes = 0, l;
  } function Uf(l, t, u) {
    return vu(t, l.child, null, u), l = zc(t, t.pendingProps.children), l.flags |= 2, t.memoizedState = null, l;
  } function t1(l, t, u) {
    l.lanes |= t; const a = l.alternate; a !== null && (a.lanes |= t), fc(l.return, t, u);
  } function Hf(l, t, u, a, n, e) {
    const f = l.memoizedState; f === null ? l.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: a, tail: u, tailMode: n, treeForkCount: e } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = a, f.tail = u, f.tailMode = n, f.treeForkCount = e);
  } function Sv(l, t, u) {
    let a = t.pendingProps; let n = a.revealOrder; const e = a.tail; a = a.children; let f = I.current; const c = (f & 2) !== 0; if (c ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, Z(I, f), yl(l, t, a, u), a = R ? La : 0, !c && l !== null && (l.flags & 128) !== 0) {
      l:for (l = t.child; l !== null;) {
        if (l.tag === 13) {
          l.memoizedState !== null && t1(l, u, t);
        } else if (l.tag === 19) {
          t1(l, u, t);
        } else if (l.child !== null) {
          l.child.return = l, l = l.child; continue;
        } if (l === t) {
          break l;
        } for (;l.sibling === null;) {
          if (l.return === null || l.return === t) {
            break l;
          } l = l.return;
        }l.sibling.return = l.return, l = l.sibling;
      }
    } switch (n) {
      case 'forwards':for (u = t.child, n = null; u !== null;) {
        l = u.alternate, l !== null && ve(l) === null && (n = u), u = u.sibling;
      }u = n, u === null ? (n = t.child, t.child = null) : (n = u.sibling, u.sibling = null), Hf(t, !1, n, u, e, a); break; case 'backwards':case 'unstable_legacy-backwards':for (u = null, n = t.child, t.child = null; n !== null;) {
        if (l = n.alternate, l !== null && ve(l) === null) {
          t.child = n; break;
        }l = n.sibling, n.sibling = u, u = n, n = l;
      }Hf(t, !0, u, null, e, a); break; case 'together':Hf(t, !1, null, null, void 0, a); break; default:t.memoizedState = null;
    } return t.child;
  } function Tt(l, t, u) {
    if (l !== null && (t.dependencies = l.dependencies), $t |= t.lanes, (u & t.childLanes) === 0) {
      if (l !== null) {
        if (fa(l, t, u, !1), (u & t.childLanes) === 0) {
          return null;
        }
      } else {
        return null;
      }
    } if (l !== null && t.child !== l.child) {
      throw new Error(b(153));
    } if (t.child !== null) {
      for (l = t.child, u = ht(l, l.pendingProps), t.child = u, u.return = t; l.sibling !== null;) {
        l = l.sibling, u = u.sibling = ht(l, l.pendingProps), u.return = t;
      }u.sibling = null;
    } return t.child;
  } function bi(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && ce(l)));
  } function Bm(l, t, u) {
    switch (t.tag) {
      case 3:le(t, t.stateNode.containerInfo), Ut(t, ul, l.memoizedState.cache), iu(); break; case 27:case 5:wf(t); break; case 4:le(t, t.stateNode.containerInfo); break; case 10:Ut(t, t.type, t.memoizedProps.value); break; case 31:if (t.memoizedState !== null) {
        return t.flags |= 128, oc(t), null;
      } break; case 13:var a = t.memoizedState; if (a !== null) {
        return a.dehydrated !== null ? (Ht(t), t.flags |= 128, null) : (u & t.child.childLanes) !== 0 ? gv(l, t, u) : (Ht(t), l = Tt(l, t, u), l !== null ? l.sibling : null);
      } Ht(t); break; case 19:var n = (l.flags & 128) !== 0; if (a = (u & t.childLanes) !== 0, a || (fa(l, t, u, !1), a = (u & t.childLanes) !== 0), n) {
        if (a) {
          return Sv(l, t, u);
        } t.flags |= 128;
      } if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Z(I, I.current), a) {
          break;
        } return null; case 22:return t.lanes = 0, sv(l, t, u, t.pendingProps); case 24:Ut(t, ul, l.memoizedState.cache);
    } return Tt(l, t, u);
  } function bv(l, t, u) {
    if (l !== null) {
      if (l.memoizedProps !== t.pendingProps) {
        al = !0;
      } else {
        if (!bi(l, u) && (t.flags & 128) === 0) {
          return al = !1, Bm(l, t, u);
        } al = (l.flags & 131072) !== 0;
      }
    } else {
      al = !1, R && (t.flags & 1048576) !== 0 && Ey(t, La, t.index);
    } switch (t.lanes = 0, t.tag) {
      case 16:l: {
        var a = t.pendingProps; if (l = tu(t.elementType), t.type = l, typeof l == 'function') {
          Fc(l) ? (a = ou(l, a), t.tag = 1, t = P0(null, t, l, a, u)) : (t.tag = 0, t = bc(null, t, l, a, u));
        } else {
          if (l != null) {
            var n = l.$$typeof; if (n === rc) {
              t.tag = 11, t = W0(null, t, l, a, u); break l;
            } else if (n === Gc) {
              t.tag = 14, t = $0(null, t, l, a, u); break l;
            }
          } throw t = Kf(l) || l, new Error(b(306, t, ''));
        }
      } return t; case 0:return bc(l, t, t.type, t.pendingProps, u); case 1:return a = t.type, n = ou(a, t.pendingProps), P0(l, t, a, n, u); case 3:l: {
        if (le(t, t.stateNode.containerInfo), l === null) {
          throw new Error(b(387));
        } a = t.pendingProps; var e = t.memoizedState; n = e.element, yc(l, t), Ba(t, a, null, u); var f = t.memoizedState; if (a = f.cache, Ut(t, ul, a), a !== e.cache && cc(t, [ul], u, !0), Ra(), a = f.element, e.isDehydrated) {
          if (e = { element: a, isDehydrated: !1, cache: f.cache }, t.updateQueue.baseState = e, t.memoizedState = e, t.flags & 256) {
            t = l1(l, t, a, u); break l;
          } else if (a !== n) {
            n = jl(new Error(b(424)), t), Ka(n), t = l1(l, t, a, u); break l;
          } else {
            switch (l = t.stateNode.containerInfo, l.nodeType) {
              case 9:l = l.body; break; default:l = l.nodeName === 'HTML' ? l.ownerDocument.body : l;
            } for (K = Ll(l.firstChild), dl = t, R = !0, Xt = null, Zl = !0, u = Dy(t, null, a, u), t.child = u; u;) {
              u.flags = u.flags & -3 | 4096, u = u.sibling;
            }
          }
        } else {
          if (iu(), a === n) {
            t = Tt(l, t, u); break l;
          }yl(l, t, a, u);
        }t = t.child;
      } return t; case 26:return wn(l, t), l === null ? (u = _1(t.type, null, t.pendingProps, null)) ? t.memoizedState = u : R || (u = t.type, l = t.pendingProps, a = Ae(Gt.current).createElement(u), a[vl] = t, a[_l] = l, ml(a, u, l), cl(a), t.stateNode = a) : t.memoizedState = _1(t.type, l.memoizedProps, t.pendingProps, l.memoizedState), null; case 27:return wf(t), l === null && R && (a = t.stateNode = id(t.type, t.pendingProps, Gt.current), dl = t, Zl = !0, n = K, kt(t.type) ? (Bc = n, K = Ll(a.firstChild)) : K = n), yl(l, t, t.pendingProps.children, u), wn(l, t), l === null && (t.flags |= 4194304), t.child; case 5:return l === null && R && ((n = a = K) && (a = ch(a, t.type, t.pendingProps, Zl), a !== null ? (t.stateNode = a, dl = t, K = Ll(a.firstChild), Zl = !1, n = !0) : n = !1), n || wt(t)), wf(t), n = t.type, e = t.pendingProps, f = l !== null ? l.memoizedProps : null, a = e.children, Hc(n, e) ? a = null : f !== null && Hc(n, f) && (t.flags |= 32), t.memoizedState !== null && (n = ei(l, t, Om, null, null, u), ka._currentValue = n), wn(l, t), yl(l, t, a, u), t.child; case 6:return l === null && R && ((l = u = K) && (u = ih(u, t.pendingProps, Zl), u !== null ? (t.stateNode = u, dl = t, K = null, l = !0) : l = !1), l || wt(t)), null; case 13:return gv(l, t, u); case 4:return le(t, t.stateNode.containerInfo), a = t.pendingProps, l === null ? t.child = vu(t, null, a, u) : yl(l, t, a, u), t.child; case 11:return W0(l, t, t.type, t.pendingProps, u); case 7:return yl(l, t, t.pendingProps, u), t.child; case 8:return yl(l, t, t.pendingProps.children, u), t.child; case 12:return yl(l, t, t.pendingProps.children, u), t.child; case 10:return a = t.pendingProps, Ut(t, t.type, a.value), yl(l, t, a.children, u), t.child; case 9:return n = t.type._context, a = t.pendingProps.children, yu(t), n = ol(n), a = a(n), t.flags |= 1, yl(l, t, a, u), t.child; case 14:return $0(l, t, t.type, t.pendingProps, u); case 15:return hv(l, t, t.type, t.pendingProps, u); case 19:return Sv(l, t, u); case 31:return Rm(l, t, u); case 22:return sv(l, t, u, t.pendingProps); case 24:return yu(t), a = ol(ul), l === null ? (n = li(), n === null && (n = j, e = Pc(), n.pooledCache = e, e.refCount++, e !== null && (n.pooledCacheLanes |= u), n = e), t.memoizedState = { parent: a, cache: n }, ui(t), Ut(t, ul, n)) : ((l.lanes & u) !== 0 && (yc(l, t), Ba(t, null, null, u), Ra()), n = l.memoizedState, e = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Ut(t, ul, a)) : (a = e.cache, Ut(t, ul, a), a !== n.cache && cc(t, [ul], u, !0))), yl(l, t, t.pendingProps.children, u), t.child; case 29:throw t.pendingProps;
    } throw new Error(b(156, t.tag));
  } function et(l) {
    l.flags |= 4;
  } function Nf(l, t, u, a, n) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (n & 335544128) === n) {
        if (l.stateNode.complete) {
          l.flags |= 8192;
        } else if (Zv()) {
          l.flags |= 8192;
        } else {
          throw fu = ie, ti;
        }
      }
    } else {
      l.flags &= -16777217;
    }
  } function u1(l, t) {
    if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) {
      l.flags &= -16777217;
    } else if (l.flags |= 16777216, !dd(t)) {
      if (Zv()) {
        l.flags |= 8192;
      } else {
        throw fu = ie, ti;
      }
    }
  } function Cn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? V1() : 536870912, l.lanes |= t, Pu |= t);
  } function ba(l, t) {
    if (!R) {
      switch (l.tailMode) {
        case 'hidden':t = l.tail; for (var u = null; t !== null;) {
          t.alternate !== null && (u = t), t = t.sibling;
        }u === null ? l.tail = null : u.sibling = null; break; case 'collapsed':u = l.tail; for (var a = null; u !== null;) {
          u.alternate !== null && (a = u), u = u.sibling;
        }a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
      }
    }
  } function L(l) {
    const t = l.alternate !== null && l.alternate.child === l.child; let u = 0; let a = 0; if (t) {
      for (var n = l.child; n !== null;) {
        u |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = l, n = n.sibling;
      }
    } else {
      for (n = l.child; n !== null;) {
        u |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = l, n = n.sibling;
      }
    } return l.subtreeFlags |= a, l.childLanes = u, t;
  } function qm(l, t, u) {
    let a = t.pendingProps; switch (Ic(t), t.tag) {
      case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return L(t), null; case 1:return L(t), null; case 3:return u = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), st(ul), wu(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (Ou(t) ? et(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ef())), L(t), null; case 26:var n = t.type; var e = t.memoizedState; return l === null ? (et(t), e !== null ? (L(t), u1(t, e)) : (L(t), Nf(t, n, null, a, u))) : e ? e !== l.memoizedState ? (et(t), L(t), u1(t, e)) : (L(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && et(t), L(t), Nf(t, n, l, a, u)), null; case 27:if (te(t), u = Gt.current, n = t.type, l !== null && t.stateNode != null) {
        l.memoizedProps !== a && et(t);
      } else {
        if (!a) {
          if (t.stateNode === null) {
            throw new Error(b(166));
          } return L(t), null;
        }l = lt.current, Ou(t) ? C0(t, l) : (l = id(n, a, u), t.stateNode = l, et(t));
      } return L(t), null; case 5:if (te(t), n = t.type, l !== null && t.stateNode != null) {
        l.memoizedProps !== a && et(t);
      } else {
        if (!a) {
          if (t.stateNode === null) {
            throw new Error(b(166));
          } return L(t), null;
        } if (e = lt.current, Ou(t)) {
          C0(t, e);
        } else {
          let f = Ae(Gt.current); switch (e) {
            case 1:e = f.createElementNS('http://www.w3.org/2000/svg', n); break; case 2:e = f.createElementNS('http://www.w3.org/1998/Math/MathML', n); break; default:switch (n) {
              case 'svg':e = f.createElementNS('http://www.w3.org/2000/svg', n); break; case 'math':e = f.createElementNS('http://www.w3.org/1998/Math/MathML', n); break; case 'script':e = f.createElement('div'), e.innerHTML = '<script><\/script>', e = e.removeChild(e.firstChild); break; case 'select':e = typeof a.is == 'string' ? f.createElement('select', { is: a.is }) : f.createElement('select'), a.multiple ? e.multiple = !0 : a.size && (e.size = a.size); break; default:e = typeof a.is == 'string' ? f.createElement(n, { is: a.is }) : f.createElement(n);
            }
          }e[vl] = t, e[_l] = a; l:for (f = t.child; f !== null;) {
            if (f.tag === 5 || f.tag === 6) {
              e.appendChild(f.stateNode);
            } else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
              f.child.return = f, f = f.child; continue;
            } if (f === t) {
              break l;
            } for (;f.sibling === null;) {
              if (f.return === null || f.return === t) {
                break l;
              } f = f.return;
            }f.sibling.return = f.return, f = f.sibling;
          }t.stateNode = e; l:switch (ml(e, n, a), n) {
            case 'button':case 'input':case 'select':case 'textarea':a = !!a.autoFocus; break l; case 'img':a = !0; break l; default:a = !1;
          }a && et(t);
        }
      } return L(t), Nf(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, u), null; case 6:if (l && t.stateNode != null) {
        l.memoizedProps !== a && et(t);
      } else {
        if (typeof a != 'string' && t.stateNode === null) {
          throw new Error(b(166));
        } if (l = Gt.current, Ou(t)) {
          if (l = t.stateNode, u = t.memoizedProps, a = null, n = dl, n !== null) {
            switch (n.tag) {
              case 27:case 5:a = n.memoizedProps;
            }
          }l[vl] = t, l = !!(l.nodeValue === u || a !== null && a.suppressHydrationWarning === !0 || nd(l.nodeValue, u)), l || wt(t, !0);
        } else {
          l = Ae(l).createTextNode(a), l[vl] = t, t.stateNode = l;
        }
      } return L(t), null; case 31:if (u = t.memoizedState, l === null || l.memoizedState !== null) {
        if (a = Ou(t), u !== null) {
          if (l === null) {
            if (!a) {
              throw new Error(b(318));
            } if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) {
              throw new Error(b(557));
            } l[vl] = t;
          } else {
            iu(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
          }L(t), l = !1;
        } else {
          u = Ef(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), l = !0;
        } if (!l) {
          return t.flags & 256 ? (pl(t), t) : (pl(t), null);
        } if ((t.flags & 128) !== 0) {
          throw new Error(b(558));
        }
      } return L(t), null; case 13:if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
        if (n = Ou(t), a !== null && a.dehydrated !== null) {
          if (l === null) {
            if (!n) {
              throw new Error(b(318));
            } if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) {
              throw new Error(b(317));
            } n[vl] = t;
          } else {
            iu(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
          }L(t), n = !1;
        } else {
          n = Ef(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = n), n = !0;
        } if (!n) {
          return t.flags & 256 ? (pl(t), t) : (pl(t), null);
        }
      } return pl(t), (t.flags & 128) !== 0 ? (t.lanes = u, t) : (u = a !== null, l = l !== null && l.memoizedState !== null, u && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), e = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (e = a.memoizedState.cachePool.pool), e !== n && (a.flags |= 2048)), u !== l && u && (t.child.flags |= 8192), Cn(t, t.updateQueue), L(t), null); case 4:return wu(), l === null && Mi(t.stateNode.containerInfo), L(t), null; case 10:return st(t.type), L(t), null; case 19:if (il(I), a = t.memoizedState, a === null) {
        return L(t), null;
      } if (n = (t.flags & 128) !== 0, e = a.rendering, e === null) {
          if (n) {
            ba(a, !1);
          } else {
            if (k !== 0 || l !== null && (l.flags & 128) !== 0) {
              for (l = t.child; l !== null;) {
                if (e = ve(l), e !== null) {
                  for (t.flags |= 128, ba(a, !1), l = e.updateQueue, t.updateQueue = l, Cn(t, l), t.subtreeFlags = 0, l = u, u = t.child; u !== null;) {
                    zy(u, l), u = u.sibling;
                  } return Z(I, I.current & 1 | 2), R && yt(t, a.treeForkCount), t.child;
                }l = l.sibling;
              }
            }a.tail !== null && Hl() > ge && (t.flags |= 128, n = !0, ba(a, !1), t.lanes = 4194304);
          }
        } else {
          if (!n) {
            if (l = ve(e), l !== null) {
              if (t.flags |= 128, n = !0, l = l.updateQueue, t.updateQueue = l, Cn(t, l), ba(a, !0), a.tail === null && a.tailMode === 'hidden' && !e.alternate && !R) {
                return L(t), null;
              }
            } else {
              2 * Hl() - a.renderingStartTime > ge && u !== 536870912 && (t.flags |= 128, n = !0, ba(a, !1), t.lanes = 4194304);
            }
          }a.isBackwards ? (e.sibling = t.child, t.child = e) : (l = a.last, l !== null ? l.sibling = e : t.child = e, a.last = e);
        } return a.tail !== null ? (l = a.tail, a.rendering = l, a.tail = l.sibling, a.renderingStartTime = Hl(), l.sibling = null, u = I.current, Z(I, n ? u & 1 | 2 : u & 1), R && yt(t, a.treeForkCount), l) : (L(t), null); case 22:case 23:return pl(t), ai(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (u & 536870912) !== 0 && (t.flags & 128) === 0 && (L(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : L(t), u = t.updateQueue, u !== null && Cn(t, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== u && (t.flags |= 2048), l !== null && il(eu), null; case 24:return u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), st(ul), L(t), null; case 25:return null; case 30:return null;
    } throw new Error(b(156, t.tag));
  } function Ym(l, t) {
    switch (Ic(t), t.tag) {
      case 1:return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null; case 3:return st(ul), wu(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null; case 26:case 27:case 5:return te(t), null; case 31:if (t.memoizedState !== null) {
        if (pl(t), t.alternate === null) {
          throw new Error(b(340));
        } iu();
      } return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null; case 13:if (pl(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
        if (t.alternate === null) {
          throw new Error(b(340));
        } iu();
      } return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null; case 19:return il(I), null; case 4:return wu(), null; case 10:return st(t.type), null; case 22:case 23:return pl(t), ai(), l !== null && il(eu), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null; case 24:return st(ul), null; case 25:return null; default:return null;
    }
  } function zv(l, t) {
    switch (Ic(t), t.tag) {
      case 3:st(ul), wu(); break; case 26:case 27:case 5:te(t); break; case 4:wu(); break; case 31:t.memoizedState !== null && pl(t); break; case 13:pl(t); break; case 19:il(I); break; case 10:st(t.type); break; case 22:case 23:pl(t), ai(), l !== null && il(eu); break; case 24:st(ul);
    }
  } function yn(l, t) {
    try {
      let u = t.updateQueue; let a = u !== null ? u.lastEffect : null; if (a !== null) {
        const n = a.next; u = n; do {
          if ((u.tag & l) === l) {
            a = void 0; const e = u.create; const f = u.inst; a = e(), f.destroy = a;
          }u = u.next;
        } while (u !== n);
      }
    } catch (c) {
      X(t, t.return, c);
    }
  } function Wt(l, t, u) {
    try {
      let a = t.updateQueue; let n = a !== null ? a.lastEffect : null; if (n !== null) {
        const e = n.next; a = e; do {
          if ((a.tag & l) === l) {
            const f = a.inst; const c = f.destroy; if (c !== void 0) {
              f.destroy = void 0, n = t; const i = u; const d = c; try {
                d();
              } catch (s) {
                X(n, i, s);
              }
            }
          }a = a.next;
        } while (a !== e);
      }
    } catch (s) {
      X(t, t.return, s);
    }
  } function Tv(l) {
    const t = l.updateQueue; if (t !== null) {
      const u = l.stateNode; try {
        Hy(t, u);
      } catch (a) {
        X(l, l.return, a);
      }
    }
  } function Ev(l, t, u) {
    u.props = ou(l.type, l.memoizedProps), u.state = l.memoizedState; try {
      u.componentWillUnmount();
    } catch (a) {
      X(l, t, a);
    }
  } function Ya(l, t) {
    try {
      const u = l.ref; if (u !== null) {
        switch (l.tag) {
          case 26:case 27:case 5:var a = l.stateNode; break; case 30:a = l.stateNode; break; default:a = l.stateNode;
        } typeof u == 'function' ? l.refCleanup = u(a) : u.current = a;
      }
    } catch (n) {
      X(l, t, n);
    }
  } function Pl(l, t) {
    const u = l.ref; const a = l.refCleanup; if (u !== null) {
      if (typeof a == 'function') {
        try {
          a();
        } catch (n) {
          X(l, t, n);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      } else if (typeof u == 'function') {
        try {
          u(null);
        } catch (n) {
          X(l, t, n);
        }
      } else {
        u.current = null;
      }
    }
  } function Av(l) {
    const t = l.type; const u = l.memoizedProps; const a = l.stateNode; try {
      l:switch (t) {
        case 'button':case 'input':case 'select':case 'textarea':u.autoFocus && a.focus(); break l; case 'img':u.src ? a.src = u.src : u.srcSet && (a.srcset = u.srcSet);
      }
    } catch (n) {
      X(l, l.return, n);
    }
  } function Cf(l, t, u) {
    try {
      const a = l.stateNode; th(a, l.type, u, t), a[_l] = t;
    } catch (n) {
      X(l, l.return, n);
    }
  } function _v(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && kt(l.type) || l.tag === 4;
  } function Rf(l) {
    l:for (;;) {
      for (;l.sibling === null;) {
        if (l.return === null || _v(l.return)) {
          return null;
        } l = l.return;
      } for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18;) {
        if (l.tag === 27 && kt(l.type) || l.flags & 2 || l.child === null || l.tag === 4) {
          continue l;
        } l.child.return = l, l = l.child;
      } if (!(l.flags & 2)) {
        return l.stateNode;
      }
    }
  } function Tc(l, t, u) {
    const a = l.tag; if (a === 5 || a === 6) {
      l = l.stateNode, t ? (u.nodeType === 9 ? u.body : u.nodeName === 'HTML' ? u.ownerDocument.body : u).insertBefore(l, t) : (t = u.nodeType === 9 ? u.body : u.nodeName === 'HTML' ? u.ownerDocument.body : u, t.appendChild(l), u = u._reactRootContainer, u != null || t.onclick !== null || (t.onclick = ot));
    } else if (a !== 4 && (a === 27 && kt(l.type) && (u = l.stateNode, t = null), l = l.child, l !== null)) {
      for (Tc(l, t, u), l = l.sibling; l !== null;) {
        Tc(l, t, u), l = l.sibling;
      }
    }
  } function se(l, t, u) {
    const a = l.tag; if (a === 5 || a === 6) {
      l = l.stateNode, t ? u.insertBefore(l, t) : u.appendChild(l);
    } else if (a !== 4 && (a === 27 && kt(l.type) && (u = l.stateNode), l = l.child, l !== null)) {
      for (se(l, t, u), l = l.sibling; l !== null;) {
        se(l, t, u), l = l.sibling;
      }
    }
  } function Ov(l) {
    const t = l.stateNode; const u = l.memoizedProps; try {
      for (var a = l.type, n = t.attributes; n.length;) {
        t.removeAttributeNode(n[0]);
      }ml(t, a, u), t[vl] = l, t[_l] = u;
    } catch (e) {
      X(l, l.return, e);
    }
  } let vt = !1; let tl = !1; let Bf = !1; const a1 = typeof WeakSet == 'function' ? WeakSet : Set; let fl = null; function rm(l, t) {
    if (l = l.containerInfo, Dc = pe, l = dy(l), wc(l)) {
      if ('selectionStart' in l) {
        var u = { start: l.selectionStart, end: l.selectionEnd };
      } else {
        l: {
          u = (u = l.ownerDocument) && u.defaultView || window; var a = u.getSelection && u.getSelection(); if (a && a.rangeCount !== 0) {
            u = a.anchorNode; var n = a.anchorOffset; var e = a.focusNode; a = a.focusOffset; try {
              u.nodeType, e.nodeType;
            } catch {
              u = null; break l;
            } let f = 0; let c = -1; let i = -1; let d = 0; let s = 0; let g = l; let m = null; t:for (;;) {
              for (var h; g !== u || n !== 0 && g.nodeType !== 3 || (c = f + n), g !== e || a !== 0 && g.nodeType !== 3 || (i = f + a), g.nodeType === 3 && (f += g.nodeValue.length), (h = g.firstChild) !== null;) {
                m = g, g = h;
              } for (;;) {
                if (g === l) {
                  break t;
                } if (m === u && ++d === n && (c = f), m === e && ++s === a && (i = f), (h = g.nextSibling) !== null) {
                  break;
                } g = m, m = g.parentNode;
              }g = h;
            }u = c === -1 || i === -1 ? null : { start: c, end: i };
          } else {
            u = null;
          }
        }
      }u = u || { start: 0, end: 0 };
    } else {
      u = null;
    } for (Uc = { focusedElem: l, selectionRange: u }, pe = !1, fl = t; fl !== null;) {
      if (t = fl, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null) {
        l.return = t, fl = l;
      } else {
        for (;fl !== null;) {
          switch (t = fl, e = t.alternate, l = t.flags, t.tag) {
            case 0:if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null)) {
              for (u = 0; u < l.length; u++) {
                n = l[u], n.ref.impl = n.nextImpl;
              }
            } break; case 11:case 15:break; case 1:if ((l & 1024) !== 0 && e !== null) {
              l = void 0, u = t, n = e.memoizedProps, e = e.memoizedState, a = u.stateNode; try {
                const z = ou(u.type, n); l = a.getSnapshotBeforeUpdate(z, e), a.__reactInternalSnapshotBeforeUpdate = l;
              } catch (T) {
                X(u, u.return, T);
              }
            } break; case 3:if ((l & 1024) !== 0) {
              if (l = t.stateNode.containerInfo, u = l.nodeType, u === 9) {
                Nc(l);
              } else if (u === 1) {
                switch (l.nodeName) {
                  case 'HEAD':case 'HTML':case 'BODY':Nc(l); break; default:l.textContent = '';
                }
              }
            } break; case 5:case 26:case 27:case 6:case 4:case 17:break; default:if ((l & 1024) !== 0) {
              throw new Error(b(163));
            }
          } if (l = t.sibling, l !== null) {
            l.return = t.return, fl = l; break;
          }fl = t.return;
        }
      }
    }
  } function Mv(l, t, u) {
    let a = u.flags; switch (u.tag) {
      case 0:case 11:case 15:ct(l, u), a & 4 && yn(5, u); break; case 1:if (ct(l, u), a & 4) {
        if (l = u.stateNode, t === null) {
          try {
            l.componentDidMount();
          } catch (f) {
            X(u, u.return, f);
          }
        } else {
          var n = ou(u.type, t.memoizedProps); t = t.memoizedState; try {
            l.componentDidUpdate(n, t, l.__reactInternalSnapshotBeforeUpdate);
          } catch (f) {
            X(u, u.return, f);
          }
        }
      }a & 64 && Tv(u), a & 512 && Ya(u, u.return); break; case 3:if (ct(l, u), a & 64 && (l = u.updateQueue, l !== null)) {
        if (t = null, u.child !== null) {
          switch (u.child.tag) {
            case 27:case 5:t = u.child.stateNode; break; case 1:t = u.child.stateNode;
          }
        } try {
          Hy(l, t);
        } catch (f) {
          X(u, u.return, f);
        }
      } break; case 27:t === null && a & 4 && Ov(u); case 26:case 5:ct(l, u), t === null && a & 4 && Av(u), a & 512 && Ya(u, u.return); break; case 12:ct(l, u); break; case 31:ct(l, u), a & 4 && Uv(l, u); break; case 13:ct(l, u), a & 4 && Hv(l, u), a & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = Km.bind(null, u), yh(l, u)))); break; case 22:if (a = u.memoizedState !== null || vt, !a) {
        t = t !== null && t.memoizedState !== null || tl, n = vt; const e = tl; vt = a, (tl = t) && !e ? it(l, u, (u.subtreeFlags & 8772) !== 0) : ct(l, u), vt = n, tl = e;
      } break; case 30:break; default:ct(l, u);
    }
  } function pv(l) {
    let t = l.alternate; t !== null && (l.alternate = null, pv(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && jc(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  } let W = null; let Tl = !1; function ft(l, t, u) {
    for (u = u.child; u !== null;) {
      Dv(l, t, u), u = u.sibling;
    }
  } function Dv(l, t, u) {
    if (Nl && typeof Nl.onCommitFiberUnmount == 'function') {
      try {
        Nl.onCommitFiberUnmount(tn, u);
      } catch {}
    } switch (u.tag) {
      case 26:tl || Pl(u, t), ft(l, t, u), u.memoizedState ? u.memoizedState.count-- : u.stateNode && (u = u.stateNode, u.parentNode.removeChild(u)); break; case 27:tl || Pl(u, t); var a = W; var n = Tl; kt(u.type) && (W = u.stateNode, Tl = !1), ft(l, t, u), Qa(u.stateNode), W = a, Tl = n; break; case 5:tl || Pl(u, t); case 6:if (a = W, n = Tl, W = null, ft(l, t, u), W = a, Tl = n, W !== null) {
        if (Tl) {
          try {
            (W.nodeType === 9 ? W.body : W.nodeName === 'HTML' ? W.ownerDocument.body : W).removeChild(u.stateNode);
          } catch (e) {
            X(u, t, e);
          }
        } else {
          try {
            W.removeChild(u.stateNode);
          } catch (e) {
            X(u, t, e);
          }
        }
      } break; case 18:W !== null && (Tl ? (l = W, b1(l.nodeType === 9 ? l.body : l.nodeName === 'HTML' ? l.ownerDocument.body : l, u.stateNode), aa(l)) : b1(W, u.stateNode)); break; case 4:a = W, n = Tl, W = u.stateNode.containerInfo, Tl = !0, ft(l, t, u), W = a, Tl = n; break; case 0:case 11:case 14:case 15:Wt(2, u, t), tl || Wt(4, u, t), ft(l, t, u); break; case 1:tl || (Pl(u, t), a = u.stateNode, typeof a.componentWillUnmount == 'function' && Ev(u, t, a)), ft(l, t, u); break; case 21:ft(l, t, u); break; case 22:tl = (a = tl) || u.memoizedState !== null, ft(l, t, u), tl = a; break; default:ft(l, t, u);
    }
  } function Uv(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated; try {
        aa(l);
      } catch (u) {
        X(t, t.return, u);
      }
    }
  } function Hv(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null)))) {
      try {
        aa(l);
      } catch (u) {
        X(t, t.return, u);
      }
    }
  } function Gm(l) {
    switch (l.tag) {
      case 31:case 13:case 19:var t = l.stateNode; return t === null && (t = l.stateNode = new a1()), t; case 22:return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new a1()), t; default:throw new Error(b(435, l.tag));
    }
  } function Rn(l, t) {
    const u = Gm(l); t.forEach((a) => {
      if (!u.has(a)) {
        u.add(a); const n = Jm.bind(null, l, a); a.then(n, n);
      }
    });
  } function bl(l, t) {
    const u = t.deletions; if (u !== null) {
      for (let a = 0; a < u.length; a++) {
        const n = u[a]; let e = l; const f = t; let c = f; l:for (;c !== null;) {
          switch (c.tag) {
            case 27:if (kt(c.type)) {
              W = c.stateNode, Tl = !1; break l;
            } break; case 5:W = c.stateNode, Tl = !1; break l; case 3:case 4:W = c.stateNode.containerInfo, Tl = !0; break l;
          }c = c.return;
        } if (W === null) {
          throw new Error(b(160));
        } Dv(e, f, n), W = null, Tl = !1, e = n.alternate, e !== null && (e.return = null), n.return = null;
      }
    } if (t.subtreeFlags & 13886) {
      for (t = t.child; t !== null;) {
        Nv(t, l), t = t.sibling;
      }
    }
  } let wl = null; function Nv(l, t) {
    let u = l.alternate; let a = l.flags; switch (l.tag) {
      case 0:case 11:case 14:case 15:bl(t, l), zl(l), a & 4 && (Wt(3, l, l.return), yn(3, l), Wt(5, l, l.return)); break; case 1:bl(t, l), zl(l), a & 512 && (tl || u === null || Pl(u, u.return)), a & 64 && vt && (l = l.updateQueue, l !== null && (a = l.callbacks, a !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? a : u.concat(a)))); break; case 26:var n = wl; if (bl(t, l), zl(l), a & 512 && (tl || u === null || Pl(u, u.return)), a & 4) {
        var e = u !== null ? u.memoizedState : null; if (a = l.memoizedState, u === null) {
          if (a === null) {
            if (l.stateNode === null) {
              l: {
                a = l.type, u = l.memoizedProps, n = n.ownerDocument || n; t:switch (a) {
                  case 'title':e = n.getElementsByTagName('title')[0], (!e || e[nn] || e[vl] || e.namespaceURI === 'http://www.w3.org/2000/svg' || e.hasAttribute('itemprop')) && (e = n.createElement(a), n.head.insertBefore(e, n.querySelector('head > title'))), ml(e, a, u), e[vl] = l, cl(e), a = e; break l; case 'link':var f = M1('link', 'href', n).get(a + (u.href || '')); if (f) {
                    for (var c = 0; c < f.length; c++) {
                      if (e = f[c], e.getAttribute('href') === (u.href == null || u.href === '' ? null : u.href) && e.getAttribute('rel') === (u.rel == null ? null : u.rel) && e.getAttribute('title') === (u.title == null ? null : u.title) && e.getAttribute('crossorigin') === (u.crossOrigin == null ? null : u.crossOrigin)) {
                        f.splice(c, 1); break t;
                      }
                    }
                  }e = n.createElement(a), ml(e, a, u), n.head.appendChild(e); break; case 'meta':if (f = M1('meta', 'content', n).get(a + (u.content || ''))) {
                    for (c = 0; c < f.length; c++) {
                      if (e = f[c], e.getAttribute('content') === (u.content == null ? null : `${u.content}`) && e.getAttribute('name') === (u.name == null ? null : u.name) && e.getAttribute('property') === (u.property == null ? null : u.property) && e.getAttribute('http-equiv') === (u.httpEquiv == null ? null : u.httpEquiv) && e.getAttribute('charset') === (u.charSet == null ? null : u.charSet)) {
                        f.splice(c, 1); break t;
                      }
                    }
                  }e = n.createElement(a), ml(e, a, u), n.head.appendChild(e); break; default:throw new Error(b(468, a));
                }e[vl] = l, cl(e), a = e;
              }l.stateNode = a;
            } else {
              p1(n, l.type, l.stateNode);
            }
          } else {
            l.stateNode = O1(n, a, l.memoizedProps);
          }
        } else {
          e !== a ? (e === null ? u.stateNode !== null && (u = u.stateNode, u.parentNode.removeChild(u)) : e.count--, a === null ? p1(n, l.type, l.stateNode) : O1(n, a, l.memoizedProps)) : a === null && l.stateNode !== null && Cf(l, l.memoizedProps, u.memoizedProps);
        }
      } break; case 27:bl(t, l), zl(l), a & 512 && (tl || u === null || Pl(u, u.return)), u !== null && a & 4 && Cf(l, l.memoizedProps, u.memoizedProps); break; case 5:if (bl(t, l), zl(l), a & 512 && (tl || u === null || Pl(u, u.return)), l.flags & 32) {
        n = l.stateNode; try {
          $u(n, '');
        } catch (z) {
          X(l, l.return, z);
        }
      }a & 4 && l.stateNode != null && (n = l.memoizedProps, Cf(l, n, u !== null ? u.memoizedProps : n)), a & 1024 && (Bf = !0); break; case 6:if (bl(t, l), zl(l), a & 4) {
        if (l.stateNode === null) {
          throw new Error(b(162));
        } a = l.memoizedProps, u = l.stateNode; try {
          u.nodeValue = a;
        } catch (z) {
          X(l, l.return, z);
        }
      } break; case 3:if (Fn = null, n = wl, wl = _e(t.containerInfo), bl(t, l), wl = n, zl(l), a & 4 && u !== null && u.memoizedState.isDehydrated) {
        try {
          aa(t.containerInfo);
        } catch (z) {
          X(l, l.return, z);
        }
      }Bf && (Bf = !1, Cv(l)); break; case 4:a = wl, wl = _e(l.stateNode.containerInfo), bl(t, l), zl(l), wl = a; break; case 12:bl(t, l), zl(l); break; case 31:bl(t, l), zl(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Rn(l, a))); break; case 13:bl(t, l), zl(l), l.child.flags & 8192 && l.memoizedState !== null != (u !== null && u.memoizedState !== null) && (Qe = Hl()), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Rn(l, a))); break; case 22:n = l.memoizedState !== null; var i = u !== null && u.memoizedState !== null; var d = vt; var s = tl; if (vt = d || n, tl = s || i, bl(t, l), tl = s, vt = d, zl(l), a & 8192) {
        l:for (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (u === null || i || vt || tl || uu(l)), u = null, t = l; ;) {
          if (t.tag === 5 || t.tag === 26) {
            if (u === null) {
              i = u = t; try {
                if (e = i.stateNode, n) {
                  f = e.style, typeof f.setProperty == 'function' ? f.setProperty('display', 'none', 'important') : f.display = 'none';
                } else {
                  c = i.stateNode; const g = i.memoizedProps.style; const m = g != null && g.hasOwnProperty('display') ? g.display : null; c.style.display = m == null || typeof m == 'boolean' ? '' : (`${m}`).trim();
                }
              } catch (z) {
                X(i, i.return, z);
              }
            }
          } else if (t.tag === 6) {
            if (u === null) {
              i = t; try {
                i.stateNode.nodeValue = n ? '' : i.memoizedProps;
              } catch (z) {
                X(i, i.return, z);
              }
            }
          } else if (t.tag === 18) {
            if (u === null) {
              i = t; try {
                const h = i.stateNode; n ? z1(h, !0) : z1(i.stateNode, !1);
              } catch (z) {
                X(i, i.return, z);
              }
            }
          } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
            t.child.return = t, t = t.child; continue;
          } if (t === l) {
            break l;
          } for (;t.sibling === null;) {
            if (t.return === null || t.return === l) {
              break l;
            } u === t && (u = null), t = t.return;
          }u === t && (u = null), t.sibling.return = t.return, t = t.sibling;
        }
      }a & 4 && (a = l.updateQueue, a !== null && (u = a.retryQueue, u !== null && (a.retryQueue = null, Rn(l, u)))); break; case 19:bl(t, l), zl(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, Rn(l, a))); break; case 30:break; case 21:break; default:bl(t, l), zl(l);
    }
  } function zl(l) {
    const t = l.flags; if (t & 2) {
      try {
        for (var u, a = l.return; a !== null;) {
          if (_v(a)) {
            u = a; break;
          }a = a.return;
        } if (u == null) {
          throw new Error(b(160));
        } switch (u.tag) {
          case 27:var n = u.stateNode; var e = Rf(l); se(l, e, n); break; case 5:var f = u.stateNode; u.flags & 32 && ($u(f, ''), u.flags &= -33); var c = Rf(l); se(l, c, f); break; case 3:case 4:var i = u.stateNode.containerInfo; var d = Rf(l); Tc(l, d, i); break; default:throw new Error(b(161));
        }
      } catch (s) {
        X(l, l.return, s);
      }l.flags &= -3;
    }t & 4096 && (l.flags &= -4097);
  } function Cv(l) {
    if (l.subtreeFlags & 1024) {
      for (l = l.child; l !== null;) {
        const t = l; Cv(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
    }
  } function ct(l, t) {
    if (t.subtreeFlags & 8772) {
      for (t = t.child; t !== null;) {
        Mv(l, t.alternate, t), t = t.sibling;
      }
    }
  } function uu(l) {
    for (l = l.child; l !== null;) {
      const t = l; switch (t.tag) {
        case 0:case 11:case 14:case 15:Wt(4, t, t.return), uu(t); break; case 1:Pl(t, t.return); var u = t.stateNode; typeof u.componentWillUnmount == 'function' && Ev(t, t.return, u), uu(t); break; case 27:Qa(t.stateNode); case 26:case 5:Pl(t, t.return), uu(t); break; case 22:t.memoizedState === null && uu(t); break; case 30:uu(t); break; default:uu(t);
      }l = l.sibling;
    }
  } function it(l, t, u) {
    for (u = u && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
      let a = t.alternate; let n = l; const e = t; const f = e.flags; switch (e.tag) {
        case 0:case 11:case 15:it(n, e, u), yn(4, e);

          break; case 1:if (it(n, e, u), a = e, n = a.stateNode, typeof n.componentDidMount == 'function') {
          try {
            n.componentDidMount();
          } catch (d) {
            X(a, a.return, d);
          }
        } if (a = e, n = a.updateQueue, n !== null) {
            const c = a.stateNode; try {
              const i = n.shared.hiddenCallbacks; if (i !== null) {
                for (n.shared.hiddenCallbacks = null, n = 0; n < i.length; n++) {
                  Uy(i[n], c);
                }
              }
            } catch (d) {
              X(a, a.return, d);
            }
          }u && f & 64 && Tv(e), Ya(e, e.return); break; case 27:Ov(e); case 26:case 5:it(n, e, u), u && a === null && f & 4 && Av(e), Ya(e, e.return);

          break; case 12:it(n, e, u);

          break; case 31:it(n, e, u), u && f & 4 && Uv(n, e);

          break; case 13:it(n, e, u), u && f & 4 && Hv(n, e);

          break; case 22:e.memoizedState === null && it(n, e, u), Ya(e, e.return); break; case 30:break; default:it(n, e, u);
      }t = t.sibling;
    }
  } function zi(l, t) {
    let u = null; l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && fn(u));
  } function Ti(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && fn(l));
  } function Jl(l, t, u, a) {
    if (t.subtreeFlags & 10256) {
      for (t = t.child; t !== null;) {
        Rv(l, t, u, a), t = t.sibling;
      }
    }
  } function Rv(l, t, u, a) {
    const n = t.flags; switch (t.tag) {
      case 0:case 11:case 15:Jl(l, t, u, a), n & 2048 && yn(9, t); break; case 1:Jl(l, t, u, a); break; case 3:Jl(l, t, u, a), n & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && fn(l))); break; case 12:if (n & 2048) {
        Jl(l, t, u, a), l = t.stateNode; try {
          var e = t.memoizedProps; var f = e.id; const c = e.onPostCommit; typeof c == 'function' && c(f, t.alternate === null ? 'mount' : 'update', l.passiveEffectDuration, -0);
        } catch (i) {
          X(t, t.return, i);
        }
      } else {
        Jl(l, t, u, a);
      } break; case 31:Jl(l, t, u, a); break; case 13:Jl(l, t, u, a); break; case 23:break; case 22:e = t.stateNode, f = t.alternate, t.memoizedState !== null ? e._visibility & 2 ? Jl(l, t, u, a) : ra(l, t) : e._visibility & 2 ? Jl(l, t, u, a) : (e._visibility |= 2, pu(l, t, u, a, (t.subtreeFlags & 10256) !== 0 || !1)), n & 2048 && zi(f, t); break; case 24:Jl(l, t, u, a), n & 2048 && Ti(t.alternate, t); break; default:Jl(l, t, u, a);
    }
  } function pu(l, t, u, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      const e = l; const f = t; const c = u; const i = a; const d = f.flags; switch (f.tag) {
        case 0:case 11:case 15:pu(e, f, c, i, n), yn(8, f); break; case 23:break; case 22:var s = f.stateNode; f.memoizedState !== null ? s._visibility & 2 ? pu(e, f, c, i, n) : ra(e, f) : (s._visibility |= 2, pu(e, f, c, i, n)), n && d & 2048 && zi(f.alternate, f); break; case 24:pu(e, f, c, i, n), n && d & 2048 && Ti(f.alternate, f); break; default:pu(e, f, c, i, n);
      }t = t.sibling;
    }
  } function ra(l, t) {
    if (t.subtreeFlags & 10256) {
      for (t = t.child; t !== null;) {
        const u = l; const a = t; const n = a.flags; switch (a.tag) {
          case 22:ra(u, a), n & 2048 && zi(a.alternate, a); break; case 24:ra(u, a), n & 2048 && Ti(a.alternate, a); break; default:ra(u, a);
        }t = t.sibling;
      }
    }
  } let pa = 8192; function Mu(l, t, u) {
    if (l.subtreeFlags & pa) {
      for (l = l.child; l !== null;) {
        Bv(l, t, u), l = l.sibling;
      }
    }
  } function Bv(l, t, u) {
    switch (l.tag) {
      case 26:Mu(l, t, u), l.flags & pa && l.memoizedState !== null && Eh(u, wl, l.memoizedState, l.memoizedProps); break; case 5:Mu(l, t, u); break; case 3:case 4:var a = wl; wl = _e(l.stateNode.containerInfo), Mu(l, t, u), wl = a; break; case 22:l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = pa, pa = 16777216, Mu(l, t, u), pa = a) : Mu(l, t, u)); break; default:Mu(l, t, u);
    }
  } function qv(l) {
    let t = l.alternate; if (t !== null && (l = t.child, l !== null)) {
      t.child = null; do {
        t = l.sibling, l.sibling = null, l = t;
      } while (l !== null);
    }
  } function za(l) {
    const t = l.deletions; if ((l.flags & 16) !== 0) {
      if (t !== null) {
        for (let u = 0; u < t.length; u++) {
          const a = t[u]; fl = a, rv(a, l);
        }
      }qv(l);
    } if (l.subtreeFlags & 10256) {
      for (l = l.child; l !== null;) {
        Yv(l), l = l.sibling;
      }
    }
  } function Yv(l) {
    switch (l.tag) {
      case 0:case 11:case 15:za(l), l.flags & 2048 && Wt(9, l, l.return); break; case 3:za(l); break; case 12:za(l); break; case 22:var t = l.stateNode; l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, Wn(l)) : za(l); break; default:za(l);
    }
  } function Wn(l) {
    let t = l.deletions; if ((l.flags & 16) !== 0) {
      if (t !== null) {
        for (var u = 0; u < t.length; u++) {
          const a = t[u]; fl = a, rv(a, l);
        }
      }qv(l);
    } for (l = l.child; l !== null;) {
      switch (t = l, t.tag) {
        case 0:case 11:case 15:Wt(8, t, t.return), Wn(t); break; case 22:u = t.stateNode, u._visibility & 2 && (u._visibility &= -3, Wn(t)); break; default:Wn(t);
      }l = l.sibling;
    }
  } function rv(l, t) {
    for (;fl !== null;) {
      let u = fl; switch (u.tag) {
        case 0:case 11:case 15:Wt(8, u, t); break; case 23:case 22:if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
          var a = u.memoizedState.cachePool.pool; a != null && a.refCount++;
        } break; case 24:fn(u.memoizedState.cache);
      } if (a = u.child, a !== null) {
        a.return = u, fl = a;
      } else {
        l:for (u = l; fl !== null;) {
          a = fl; const n = a.sibling; const e = a.return; if (pv(a), a === u) {
            fl = null; break l;
          } if (n !== null) {
            n.return = e, fl = n; break l;
          }fl = e;
        }
      }
    }
  } const Xm = { getCacheForType(l) {
    const t = ol(ul); let u = t.data.get(l); return u === void 0 && (u = l(), t.data.set(l, u)), u;
  }, cacheSignal() {
    return ol(ul).controller.signal;
  } }; const Qm = typeof WeakMap == 'function' ? WeakMap : Map; var Y = 0; var j = null; let H = null; var C = 0; let G = 0; let Ml = null; let qt = !1; let ia = !1; let Ei = !1; var Et = 0; var k = 0; var $t = 0; let cu = 0; let Ai = 0; var Ul = 0; var Pu = 0; var Ga = null; var El = null; let Ec = !1; var Qe = 0; var Gv = 0; var ge = 1 / 0; let Se = null; var jt = null; let nl = 0; let Zt = null; let la = null; let gt = 0; let Ac = 0; let _c = null; let Xv = null; var Xa = 0; var Oc = null; function Rl() {
    return (Y & 2) !== 0 && C !== 0 ? C & -C : O.T !== null ? Oi() : w1();
  } function Qv() {
    if (Ul === 0) {
      if ((C & 536870912) === 0 || R) {
        var l = An; An <<= 1, (An & 3932160) === 0 && (An = 262144), Ul = l;
      } else {
        Ul = 536870912;
      }
    } return l = ql.current, l !== null && (l.flags |= 32), Ul;
  } function Al(l, t, u) {
    (l === j && (G === 2 || G === 9) || l.cancelPendingCommit !== null) && (ta(l, 0), Yt(l, C, Ul, !1)), an(l, u), ((Y & 2) === 0 || l !== j) && (l === j && ((Y & 2) === 0 && (cu |= u), k === 4 && Yt(l, C, Ul, !1)), ut(l));
  } function xv(l, t, u) {
    if ((Y & 6) !== 0) {
      throw new Error(b(327));
    } let a = !u && (t & 127) === 0 && (t & l.expiredLanes) === 0 || un(l, t); let n = a ? Zm(l, t) : qf(l, t, !0); let e = a; do {
      if (n === 0) {
        ia && !a && Yt(l, t, 0, !1); break;
      } else {
        if (u = l.current.alternate, e && !xm(u)) {
          n = qf(l, t, !1), e = !1; continue;
        } if (n === 2) {
          if (e = t, l.errorRecoveryDisabledLanes & e) {
            var f = 0;
          } else {
            f = l.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          } if (f !== 0) {
            t = f; l: {
              const c = l; n = Ga; const i = c.current.memoizedState.isDehydrated; if (i && (ta(c, f).flags |= 256), f = qf(c, f, !1), f !== 2) {
                if (Ei && !i) {
                  c.errorRecoveryDisabledLanes |= e, cu |= e, n = 4; break l;
                }e = El, El = n, e !== null && (El === null ? El = e : El.push.apply(El, e));
              }n = f;
            } if (e = !1, n !== 2) {
              continue;
            }
          }
        } if (n === 1) {
          ta(l, 0), Yt(l, t, 0, !0); break;
        }l: {
          switch (a = l, e = n, e) {
            case 0:case 1:throw new Error(b(345)); case 4:if ((t & 4194048) !== t) {
              break;
            } case 6:Yt(a, t, Ul, !qt); break l; case 2:El = null; break; case 3:case 5:break; default:throw new Error(b(329));
          } if ((t & 62914560) === t && (n = Qe + 300 - Hl(), n > 10)) {
            if (Yt(a, t, Ul, !qt), Ue(a, 0, !0) !== 0) {
              break l;
            } gt = t, a.timeoutHandle = fd(n1.bind(null, a, u, El, Se, Ec, t, Ul, cu, Pu, qt, e, 'Throttled', -0, 0), n); break l;
          }n1(a, u, El, Se, Ec, t, Ul, cu, Pu, qt, e, null, -0, 0);
        }
      } break;
    } while (!0); ut(l);
  } function n1(l, t, u, a, n, e, f, c, i, d, s, g, m, h) {
    if (l.timeoutHandle = -1, g = t.subtreeFlags, g & 8192 || (g & 16785408) === 16785408) {
      g = { stylesheets: null, count: 0, imgCount: 0, imgBytes: 0, suspenseyImages: [], waitingForImages: !0, waitingForViewTransition: !1, unsuspend: ot }, Bv(t, e, g); let z = (e & 62914560) === e ? Qe - Hl() : (e & 4194048) === e ? Gv - Hl() : 0; if (z = Ah(g, z), z !== null) {
        gt = e, l.cancelPendingCommit = z(f1.bind(null, l, t, e, u, a, n, f, c, i, s, g, null, m, h)), Yt(l, e, f, !d); return;
      }
    }f1(l, t, e, u, a, n, f, c, i);
  } function xm(l) {
    for (let t = l; ;) {
      let u = t.tag; if ((u === 0 || u === 11 || u === 15) && t.flags & 16384 && (u = t.updateQueue, u !== null && (u = u.stores, u !== null))) {
        for (let a = 0; a < u.length; a++) {
          let n = u[a]; const e = n.getSnapshot; n = n.value; try {
            if (!Bl(e(), n)) {
              return !1;
            }
          } catch {
            return !1;
          }
        }
      } if (u = t.child, t.subtreeFlags & 16384 && u !== null) {
        u.return = t, t = u;
      } else {
        if (t === l) {
          break;
        } for (;t.sibling === null;) {
          if (t.return === null || t.return === l) {
            return !0;
          } t = t.return;
        }t.sibling.return = t.return, t = t.sibling;
      }
    } return !0;
  } function Yt(l, t, u, a) {
    t &= ~Ai, t &= ~cu, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes; for (let n = t; n > 0;) {
      const e = 31 - Cl(n); const f = 1 << e; a[e] = -1, n &= ~f;
    }u !== 0 && L1(l, u, t);
  } function xe() {
    return (Y & 6) === 0 ? (vn(0, !1), !1) : !0;
  } function _i() {
    if (H !== null) {
      if (G === 0) {
        var l = H.return;
      } else {
        l = H, mt = Su = null, ii(l), Lu = null, Ja = 0, l = H;
      } for (;l !== null;) {
        zv(l.alternate, l), l = l.return;
      }H = null;
    }
  } function ta(l, t) {
    let u = l.timeoutHandle; u !== -1 && (l.timeoutHandle = -1, nh(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), gt = 0, _i(), j = l, H = u = ht(l.current, null), C = t, G = 0, Ml = null, qt = !1, ia = un(l, t), Ei = !1, Pu = Ul = Ai = cu = $t = k = 0, El = Ga = null, Ec = !1, (t & 8) !== 0 && (t |= t & 32); let a = l.entangledLanes; if (a !== 0) {
      for (l = l.entanglements, a &= t; a > 0;) {
        const n = 31 - Cl(a); const e = 1 << n; t |= l[n], a &= ~e;
      }
    } return Et = t, Re(), u;
  } function jv(l, t) {
    p = null, O.H = Wa, t === ca || t === qe ? (t = r0(), G = 3) : t === ti ? (t = r0(), G = 4) : G = t === Si ? 8 : t !== null && typeof t == 'object' && typeof t.then == 'function' ? 6 : 1, Ml = t, H === null && (k = 1, me(l, jl(t, l.current)));
  } function Zv() {
    const l = ql.current; return l === null ? !0 : (C & 4194048) === C ? Vl === null : (C & 62914560) === C || (C & 536870912) !== 0 ? l === Vl : !1;
  } function Vv() {
    const l = O.H; return O.H = Wa, l === null ? Wa : l;
  } function Lv() {
    const l = O.A; return O.A = Xm, l;
  } function be() {
    k = 4, qt || (C & 4194048) !== C && ql.current !== null || (ia = !0), ($t & 134217727) === 0 && (cu & 134217727) === 0 || j === null || Yt(j, C, Ul, !1);
  } function qf(l, t, u) {
    const a = Y; Y |= 2; const n = Vv(); const e = Lv(); (j !== l || C !== t) && (Se = null, ta(l, t)), t = !1; let f = k; l:do {
      try {
        if (G !== 0 && H !== null) {
          const c = H; const i = Ml; switch (G) {
            case 8:_i(), f = 6; break l; case 3:case 2:case 9:case 6:ql.current === null && (t = !0); var d = G; if (G = 0, Ml = null, Qu(l, c, i, d), u && ia) {
              f = 0; break l;
            } break; default:d = G, G = 0, Ml = null, Qu(l, c, i, d);
          }
        }jm(), f = k; break;
      } catch (s) {
        jv(l, s);
      }
    } while (!0); return t && l.shellSuspendCounter++, mt = Su = null, Y = a, O.H = n, O.A = e, H === null && (j = null, C = 0, Re()), f;
  } function jm() {
    for (;H !== null;) {
      Kv(H);
    }
  } function Zm(l, t) {
    const u = Y; Y |= 2; const a = Vv(); const n = Lv(); j !== l || C !== t ? (Se = null, ge = Hl() + 500, ta(l, t)) : ia = un(l, t); l:do {
      try {
        if (G !== 0 && H !== null) {
          t = H; const e = Ml; t:switch (G) {
            case 1:G = 0, Ml = null, Qu(l, t, e, 1); break; case 2:case 9:if (Y0(e)) {
              G = 0, Ml = null, e1(t); break;
            }t = function () {
                G !== 2 && G !== 9 || j !== l || (G = 7), ut(l);
              }, e.then(t, t); break l; case 3:G = 7; break l; case 4:G = 5; break l; case 7:Y0(e) ? (G = 0, Ml = null, e1(t)) : (G = 0, Ml = null, Qu(l, t, e, 7)); break; case 5:var f = null; switch (H.tag) {
              case 26:f = H.memoizedState; case 5:case 27:var c = H; if (f ? dd(f) : c.stateNode.complete) {
                G = 0, Ml = null; const i = c.sibling; if (i !== null) {
                  H = i;
                } else {
                  const d = c.return; d !== null ? (H = d, je(d)) : H = null;
                } break t;
              }
            }G = 0, Ml = null, Qu(l, t, e, 5); break; case 6:G = 0, Ml = null, Qu(l, t, e, 6); break; case 8:_i(), k = 6; break l; default:throw new Error(b(462));
          }
        }Vm(); break;
      } catch (s) {
        jv(l, s);
      }
    } while (!0); return mt = Su = null, O.H = a, O.A = n, Y = u, H !== null ? 0 : (j = null, C = 0, Re(), k);
  } function Vm() {
    for (;H !== null && !oo();) {
      Kv(H);
    }
  } function Kv(l) {
    const t = bv(l.alternate, l, Et); l.memoizedProps = l.pendingProps, t === null ? je(l) : H = t;
  } function e1(l) {
    let t = l; const u = t.alternate; switch (t.tag) {
      case 15:case 0:t = I0(u, t, t.pendingProps, t.type, void 0, C); break; case 11:t = I0(u, t, t.pendingProps, t.type.render, t.ref, C); break; case 5:ii(t); default:zv(u, t), t = H = zy(t, Et), t = bv(u, t, Et);
    }l.memoizedProps = l.pendingProps, t === null ? je(l) : H = t;
  } function Qu(l, t, u, a) {
    mt = Su = null, ii(t), Lu = null, Ja = 0; const n = t.return; try {
      if (Cm(l, n, t, u, C)) {
        k = 1, me(l, jl(u, l.current)), H = null; return;
      }
    } catch (e) {
      if (n !== null) {
        throw H = n, e;
      } k = 1, me(l, jl(u, l.current)), H = null; return;
    }t.flags & 32768 ? (R || a === 1 ? l = !0 : ia || (C & 536870912) !== 0 ? l = !1 : (qt = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = ql.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Jv(t, l)) : je(t);
  } function je(l) {
    let t = l; do {
      if ((t.flags & 32768) !== 0) {
        Jv(t, qt); return;
      }l = t.return; const u = qm(t.alternate, t, Et); if (u !== null) {
        H = u; return;
      } if (t = t.sibling, t !== null) {
        H = t; return;
      }H = t = l;
    } while (t !== null); k === 0 && (k = 5);
  } function Jv(l, t) {
    do {
      let u = Ym(l.alternate, l); if (u !== null) {
        u.flags &= 32767, H = u; return;
      } if (u = l.return, u !== null && (u.flags |= 32768, u.subtreeFlags = 0, u.deletions = null), !t && (l = l.sibling, l !== null)) {
        H = l; return;
      }H = l = u;
    } while (l !== null); k = 6, H = null;
  } function f1(l, t, u, a, n, e, f, c, i) {
    l.cancelPendingCommit = null; do {
      Ze();
    } while (nl !== 0); if ((Y & 6) !== 0) {
      throw new Error(b(327));
    } if (t !== null) {
      if (t === l.current) {
        throw new Error(b(177));
      } if (e = t.lanes | t.childLanes, e |= Wc, Ao(l, u, e, f, c, i), l === j && (H = j = null, C = 0), la = t, Zt = l, gt = u, Ac = e, _c = n, Xv = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (l.callbackNode = null, l.callbackPriority = 0, wm(ue, () => {
            return kv(), null;
          }))
        : (l.callbackNode = null, l.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = O.T, O.T = null, n = r.p, r.p = 2, f = Y, Y |= 4; try {
          rm(l, t, u);
        } finally {
          Y = f, r.p = n, O.T = a;
        }
      }nl = 1, wv(), Wv(), $v();
    }
  } function wv() {
    if (nl === 1) {
      nl = 0; const l = Zt; const t = la; let u = (t.flags & 13878) !== 0; if ((t.subtreeFlags & 13878) !== 0 || u) {
        u = O.T, O.T = null; const a = r.p; r.p = 2; const n = Y; Y |= 4; try {
          Nv(t, l); const e = Uc; let f = dy(l.containerInfo); let c = e.focusedElem; const i = e.selectionRange; if (f !== c && c && c.ownerDocument && vy(c.ownerDocument.documentElement, c)) {
            if (i !== null && wc(c)) {
              const d = i.start; let s = i.end; if (s === void 0 && (s = d), 'selectionStart' in c) {
                c.selectionStart = d, c.selectionEnd = Math.min(s, c.value.length);
              } else {
                var g = c.ownerDocument || document; const m = g && g.defaultView || window; if (m.getSelection) {
                  var h = m.getSelection(); const z = c.textContent.length; let T = Math.min(i.start, z); let _ = i.end === void 0 ? T : Math.min(i.end, z); !h.extend && T > _ && (f = _, _ = T, T = f); const v = U0(c, T); const y = U0(c, _); if (v && y && (h.rangeCount !== 1 || h.anchorNode !== v.node || h.anchorOffset !== v.offset || h.focusNode !== y.node || h.focusOffset !== y.offset)) {
                    const o = g.createRange(); o.setStart(v.node, v.offset), h.removeAllRanges(), T > _ ? (h.addRange(o), h.extend(y.node, y.offset)) : (o.setEnd(y.node, y.offset), h.addRange(o));
                  }
                }
              }
            } for (g = [], h = c; h = h.parentNode;) {
              h.nodeType === 1 && g.push({ element: h, left: h.scrollLeft, top: h.scrollTop });
            } for (typeof c.focus == 'function' && c.focus(), c = 0; c < g.length; c++) {
              const S = g[c]; S.element.scrollLeft = S.left, S.element.scrollTop = S.top;
            }
          }pe = !!Dc, Uc = Dc = null;
        } finally {
          Y = n, r.p = a, O.T = u;
        }
      }l.current = t, nl = 2;
    }
  } function Wv() {
    if (nl === 2) {
      nl = 0; const l = Zt; const t = la; let u = (t.flags & 8772) !== 0; if ((t.subtreeFlags & 8772) !== 0 || u) {
        u = O.T, O.T = null; const a = r.p; r.p = 2; const n = Y; Y |= 4; try {
          Mv(l, t.alternate, t);
        } finally {
          Y = n, r.p = a, O.T = u;
        }
      }nl = 3;
    }
  } function $v() {
    if (nl === 4 || nl === 3) {
      nl = 0, mo(); const l = Zt; let t = la; const u = gt; const a = Xv; (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? nl = 5 : (nl = 0, la = Zt = null, Fv(l, l.pendingLanes)); let n = l.pendingLanes; if (n === 0 && (jt = null), xc(u), t = t.stateNode, Nl && typeof Nl.onCommitFiberRoot == 'function') {
        try {
          Nl.onCommitFiberRoot(tn, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      } if (a !== null) {
        t = O.T, n = r.p, r.p = 2, O.T = null; try {
          for (let e = l.onRecoverableError, f = 0; f < a.length; f++) {
            const c = a[f]; e(c.value, { componentStack: c.stack });
          }
        } finally {
          O.T = t, r.p = n;
        }
      }(gt & 3) !== 0 && Ze(), ut(l), n = l.pendingLanes, (u & 261930) !== 0 && (n & 42) !== 0 ? l === Oc ? Xa++ : (Xa = 0, Oc = l) : Xa = 0, vn(0, !1);
    }
  } function Fv(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, fn(t)));
  } function Ze() {
    return wv(), Wv(), $v(), kv();
  } function kv() {
    if (nl !== 5) {
      return !1;
    } const l = Zt; const t = Ac; Ac = 0; let u = xc(gt); const a = O.T; const n = r.p; try {
      r.p = u < 32 ? 32 : u, O.T = null, u = _c, _c = null; const e = Zt; const f = gt; if (nl = 0, la = Zt = null, gt = 0, (Y & 6) !== 0) {
        throw new Error(b(331));
      } const c = Y; if (Y |= 4, Yv(e.current), Rv(e, e.current, f, u), Y = c, vn(0, !1), Nl && typeof Nl.onPostCommitFiberRoot == 'function') {
        try {
          Nl.onPostCommitFiberRoot(tn, e);
        } catch {}
      } return !0;
    } finally {
      r.p = n, O.T = a, Fv(l, t);
    }
  } function c1(l, t, u) {
    t = jl(u, t), t = Sc(l.stateNode, t, 2), l = xt(l, t, 2), l !== null && (an(l, 2), ut(l));
  } function X(l, t, u) {
    if (l.tag === 3) {
      c1(l, l, u);
    } else {
      for (;t !== null;) {
        if (t.tag === 3) {
          c1(t, l, u); break;
        } else if (t.tag === 1) {
          let a = t.stateNode; if (typeof t.type.getDerivedStateFromError == 'function' || typeof a.componentDidCatch == 'function' && (jt === null || !jt.has(a))) {
            l = jl(u, l), u = ov(2), a = xt(t, u, 2), a !== null && (mv(u, a, t, l), an(a, 2), ut(a)); break;
          }
        }t = t.return;
      }
    }
  } function Yf(l, t, u) {
    let a = l.pingCache; if (a === null) {
      a = l.pingCache = new Qm(); var n = new Set(); a.set(t, n);
    } else {
      n = a.get(t), n === void 0 && (n = new Set(), a.set(t, n));
    }n.has(u) || (Ei = !0, n.add(u), l = Lm.bind(null, l, t, u), t.then(l, l));
  } function Lm(l, t, u) {
    const a = l.pingCache; a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, j === l && (C & u) === u && (k === 4 || k === 3 && (C & 62914560) === C && Hl() - Qe < 300 ? (Y & 2) === 0 && ta(l, 0) : Ai |= u, Pu === C && (Pu = 0)), ut(l);
  } function Iv(l, t) {
    t === 0 && (t = V1()), l = gu(l, t), l !== null && (an(l, t), ut(l));
  } function Km(l) {
    const t = l.memoizedState; let u = 0; t !== null && (u = t.retryLane), Iv(l, u);
  } function Jm(l, t) {
    let u = 0; switch (l.tag) {
      case 31:case 13:var a = l.stateNode; var n = l.memoizedState; n !== null && (u = n.retryLane); break; case 19:a = l.stateNode; break; case 22:a = l.stateNode._retryCache; break; default:throw new Error(b(314));
    }a !== null && a.delete(t), Iv(l, u);
  } function wm(l, t) {
    return Xc(l, t);
  } let ze = null; let Du = null; let Mc = !1; let Te = !1; let rf = !1; let rt = 0; function ut(l) {
    l !== Du && l.next === null && (Du === null ? ze = Du = l : Du = Du.next = l), Te = !0, Mc || (Mc = !0, $m());
  } function vn(l, t) {
    if (!rf && Te) {
      rf = !0; do {
        for (var u = !1, a = ze; a !== null;) {
          if (!t) {
            if (l !== 0) {
              const n = a.pendingLanes; if (n === 0) {
                var e = 0;
              } else {
                const f = a.suspendedLanes; const c = a.pingedLanes; e = (1 << 31 - Cl(42 | l) + 1) - 1, e &= n & ~(f & ~c), e = e & 201326741 ? e & 201326741 | 1 : e ? e | 2 : 0;
              }e !== 0 && (u = !0, i1(a, e));
            } else {
              e = C, e = Ue(a, a === j ? e : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1), (e & 3) === 0 || un(a, e) || (u = !0, i1(a, e));
            }
          }a = a.next;
        }
      } while (u); rf = !1;
    }
  } function Wm() {
    Pv();
  } function Pv() {
    Te = Mc = !1; let l = 0; rt !== 0 && ah() && (l = rt); for (let t = Hl(), u = null, a = ze; a !== null;) {
      const n = a.next; const e = ld(a, t); e === 0 ? (a.next = null, u === null ? ze = n : u.next = n, n === null && (Du = u)) : (u = a, (l !== 0 || (e & 3) !== 0) && (Te = !0)), a = n;
    }nl !== 0 && nl !== 5 || vn(l, !1), rt !== 0 && (rt = 0);
  } function ld(l, t) {
    for (var u = l.suspendedLanes, a = l.pingedLanes, n = l.expirationTimes, e = l.pendingLanes & -62914561; e > 0;) {
      const f = 31 - Cl(e); const c = 1 << f; const i = n[f]; i === -1 ? ((c & u) === 0 || (c & a) !== 0) && (n[f] = Eo(c, t)) : i <= t && (l.expiredLanes |= c), e &= ~c;
    } if (t = j, u = C, u = Ue(l, l === t ? u : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1), a = l.callbackNode, u === 0 || l === t && (G === 2 || G === 9) || l.cancelPendingCommit !== null) {
      return a !== null && a !== null && df(a), l.callbackNode = null, l.callbackPriority = 0;
    } if ((u & 3) === 0 || un(l, u)) {
      if (t = u & -u, t === l.callbackPriority) {
        return t;
      } switch (a !== null && df(a), xc(u)) {
        case 2:case 8:u = j1; break; case 32:u = ue; break; case 268435456:u = Z1; break; default:u = ue;
      } return a = td.bind(null, l), u = Xc(u, a), l.callbackPriority = t, l.callbackNode = u, t;
    } return a !== null && a !== null && df(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  } function td(l, t) {
    if (nl !== 0 && nl !== 5) {
      return l.callbackNode = null, l.callbackPriority = 0, null;
    } const u = l.callbackNode; if (Ze() && l.callbackNode !== u) {
      return null;
    } let a = C; return a = Ue(l, l === j ? a : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1), a === 0 ? null : (xv(l, a, t), ld(l, Hl()), l.callbackNode != null && l.callbackNode === u ? td.bind(null, l) : null);
  } function i1(l, t) {
    if (Ze()) {
      return null;
    } xv(l, t, !0);
  } function $m() {
    eh(() => {
      (Y & 6) !== 0 ? Xc(x1, Wm) : Pv();
    });
  } function Oi() {
    if (rt === 0) {
      let l = Fu; l === 0 && (l = En, En <<= 1, (En & 261888) === 0 && (En = 256)), rt = l;
    } return rt;
  } function y1(l) {
    return l == null || typeof l == 'symbol' || typeof l == 'boolean' ? null : typeof l == 'function' ? l : Qn(`${l}`);
  } function v1(l, t) {
    const u = t.ownerDocument.createElement('input'); return u.name = t.name, u.value = t.value, l.id && u.setAttribute('form', l.id), t.parentNode.insertBefore(u, t), l = new FormData(l), u.parentNode.removeChild(u), l;
  } function Fm(l, t, u, a, n) {
    if (t === 'submit' && u && u.stateNode === n) {
      let e = y1((n[_l] || null).action); let f = a.submitter; f && (t = (t = f[_l] || null) ? y1(t.formAction) : f.getAttribute('formAction'), t !== null && (e = t, f = null)); const c = new He('action', 'action', null, a, n); l.push({ event: c, listeners: [{ instance: null, listener() {
        if (a.defaultPrevented) {
          if (rt !== 0) {
            var i = f ? v1(n, f) : new FormData(n); sc(u, { pending: !0, data: i, method: n.method, action: e }, null, i);
          }
        } else {
          typeof e == 'function' && (c.preventDefault(), i = f ? v1(n, f) : new FormData(n), sc(u, { pending: !0, data: i, method: n.method, action: e }, e, i));
        }
      }, currentTarget: n }] });
    }
  } for (Bn = 0; Bn < ac.length; Bn++) {
    qn = ac[Bn], d1 = qn.toLowerCase(), o1 = qn[0].toUpperCase() + qn.slice(1), Wl(d1, `on${o1}`);
  } let qn, d1, o1, Bn; Wl(my, 'onAnimationEnd'); Wl(hy, 'onAnimationIteration'); Wl(sy, 'onAnimationStart'); Wl('dblclick', 'onDoubleClick'); Wl('focusin', 'onFocus'); Wl('focusout', 'onBlur'); Wl(hm, 'onTransitionRun'); Wl(sm, 'onTransitionStart'); Wl(gm, 'onTransitionCancel'); Wl(gy, 'onTransitionEnd'); Wu('onMouseEnter', ['mouseout', 'mouseover']); Wu('onMouseLeave', ['mouseout', 'mouseover']); Wu('onPointerEnter', ['pointerout', 'pointerover']); Wu('onPointerLeave', ['pointerout', 'pointerover']); mu('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')); mu('onSelect', 'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' ')); mu('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']); mu('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')); mu('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' ')); mu('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')); var $a = 'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(' '); const km = new Set('beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat($a)); function ud(l, t) {
    t = (t & 4) !== 0; for (let u = 0; u < l.length; u++) {
      let a = l[u]; const n = a.event; a = a.listeners; l: {
        let e = void 0; if (t) {
          for (var f = a.length - 1; f >= 0; f--) {
            var c = a[f]; var i = c.instance; var d = c.currentTarget; if (c = c.listener, i !== e && n.isPropagationStopped()) {
              break l;
            } e = c, n.currentTarget = d; try {
              e(n);
            } catch (s) {
              ne(s);
            }n.currentTarget = null, e = i;
          }
        } else {
          for (f = 0; f < a.length; f++) {
            if (c = a[f], i = c.instance, d = c.currentTarget, c = c.listener, i !== e && n.isPropagationStopped()) {
              break l;
            } e = c, n.currentTarget = d; try {
              e(n);
            } catch (s) {
              ne(s);
            }n.currentTarget = null, e = i;
          }
        }
      }
    }
  } function U(l, t) {
    let u = t[$f]; u === void 0 && (u = t[$f] = new Set()); const a = `${l}__bubble`; u.has(a) || (ad(t, l, 2, !1), u.add(a));
  } function Gf(l, t, u) {
    let a = 0; t && (a |= 4), ad(u, l, a, t);
  } const Yn = `_reactListening${Math.random().toString(36).slice(2)}`; function Mi(l) {
    if (!l[Yn]) {
      l[Yn] = !0, W1.forEach((u) => {
        u !== 'selectionchange' && (km.has(u) || Gf(u, !1, l), Gf(u, !0, l));
      }); const t = l.nodeType === 9 ? l : l.ownerDocument; t === null || t[Yn] || (t[Yn] = !0, Gf('selectionchange', !1, t));
    }
  } function ad(l, t, u, a) {
    switch (gd(t)) {
      case 2:var n = Mh; break; case 8:n = ph; break; default:n = Hi;
    }u = n.bind(null, t, u, l), n = void 0, !lc || t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel' || (n = !0), a ? n !== void 0 ? l.addEventListener(t, u, { capture: !0, passive: n }) : l.addEventListener(t, u, !0) : n !== void 0 ? l.addEventListener(t, u, { passive: n }) : l.addEventListener(t, u, !1);
  } function Xf(l, t, u, a, n) {
    let e = a; if ((t & 1) === 0 && (t & 2) === 0 && a !== null) {
      l:for (;;) {
        if (a === null) {
          return;
        } let f = a.tag; if (f === 3 || f === 4) {
          let c = a.stateNode.containerInfo; if (c === n) {
            break;
          } if (f === 4) {
            for (f = a.return; f !== null;) {
              var i = f.tag; if ((i === 3 || i === 4) && f.stateNode.containerInfo === n) {
                return;
              } f = f.return;
            }
          } for (;c !== null;) {
            if (f = Nu(c), f === null) {
              return;
            } if (i = f.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              a = e = f; continue l;
            }c = c.parentNode;
          }
        }a = a.return;
      }
    }uy(() => {
      const d = e; const s = Vc(u); const g = []; l: {
        var m = Sy.get(l); if (m !== void 0) {
          var h = He; var z = l; switch (l) {
            case 'keypress':if (jn(u) === 0) {
              break l;
            } case 'keydown':case 'keyup':h = Jo; break; case 'focusin':z = 'focus', h = gf; break; case 'focusout':z = 'blur', h = gf; break; case 'beforeblur':case 'afterblur':h = gf; break; case 'click':if (u.button === 2) {
              break l;
            } case 'auxclick':case 'dblclick':case 'mousedown':case 'mousemove':case 'mouseup':case 'mouseout':case 'mouseover':case 'contextmenu':h = z0; break; case 'drag':case 'dragend':case 'dragenter':case 'dragexit':case 'dragleave':case 'dragover':case 'dragstart':case 'drop':h = qo; break; case 'touchcancel':case 'touchend':case 'touchmove':case 'touchstart':h = $o; break; case my:case hy:case sy:h = Go; break; case gy:h = ko; break; case 'scroll':case 'scrollend':h = Ro; break; case 'wheel':h = Po; break; case 'copy':case 'cut':case 'paste':h = Qo; break; case 'gotpointercapture':case 'lostpointercapture':case 'pointercancel':case 'pointerdown':case 'pointermove':case 'pointerout':case 'pointerover':case 'pointerup':h = E0; break; case 'toggle':case 'beforetoggle':h = tm;
          } var T = (t & 4) !== 0; var _ = !T && (l === 'scroll' || l === 'scrollend'); var v = T ? m !== null ? `${m}Capture` : null : m; T = []; for (var y = d, o; y !== null;) {
            var S = y; if (o = S.stateNode, S = S.tag, S !== 5 && S !== 26 && S !== 27 || o === null || v === null || (S = ja(y, v), S != null && T.push(Fa(y, S, o))), _) {
              break;
            } y = y.return;
          }T.length > 0 && (m = new h(m, z, null, u, s), g.push({ event: m, listeners: T }));
        }
      } if ((t & 7) === 0) {
        l: {
          if (m = l === 'mouseover' || l === 'pointerover', h = l === 'mouseout' || l === 'pointerout', m && u !== Pf && (z = u.relatedTarget || u.fromElement) && (Nu(z) || z[na])) {
            break l;
          } if ((h || m) && (m = s.window === s ? s : (m = s.ownerDocument) ? m.defaultView || m.parentWindow : window, h ? (z = u.relatedTarget || u.toElement, h = d, z = z ? Nu(z) : null, z !== null && (_ = ln(z), T = z.tag, z !== _ || T !== 5 && T !== 27 && T !== 6) && (z = null)) : (h = null, z = d), h !== z)) {
            if (T = z0, S = 'onMouseLeave', v = 'onMouseEnter', y = 'mouse', (l === 'pointerout' || l === 'pointerover') && (T = E0, S = 'onPointerLeave', v = 'onPointerEnter', y = 'pointer'), _ = h == null ? m : Oa(h), o = z == null ? m : Oa(z), m = new T(S, `${y}leave`, h, u, s), m.target = _, m.relatedTarget = o, S = null, Nu(s) === d && (T = new T(v, `${y}enter`, z, u, s), T.target = o, T.relatedTarget = _, S = T), _ = S, h && z) {
              t: {
                for (T = Im, v = h, y = z, o = 0, S = v; S; S = T(S)) {
                  o++;
                }S = 0; for (let A = y; A; A = T(A)) {
                  S++;
                } for (;o - S > 0;) {
                  v = T(v), o--;
                } for (;S - o > 0;) {
                  y = T(y), S--;
                } for (;o--;) {
                  if (v === y || y !== null && v === y.alternate) {
                    T = v; break t;
                  }v = T(v), y = T(y);
                }T = null;
              }
            } else {
              T = null;
            }h !== null && m1(g, m, h, T, !1), z !== null && _ !== null && m1(g, _, z, T, !0);
          }
        }l: {
          if (m = d ? Oa(d) : window, h = m.nodeName && m.nodeName.toLowerCase(), h === 'select' || h === 'input' && m.type === 'file') {
            var B = M0;
          } else if (O0(m)) {
            if (iy) {
              B = dm;
            } else {
              B = ym; var E = im;
            }
          } else {
            h = m.nodeName, !h || h.toLowerCase() !== 'input' || m.type !== 'checkbox' && m.type !== 'radio' ? d && Zc(d.elementType) && (B = M0) : B = vm;
          } if (B && (B = B(l, d))) {
            cy(g, B, u, s); break l;
          }E && E(l, m, d), l === 'focusout' && d && m.type === 'number' && d.memoizedProps.value != null && If(m, 'number', m.value);
        } switch (E = d ? Oa(d) : window, l) {
          case 'focusin':(O0(E) || E.contentEditable === 'true') && (Bu = E, tc = d, Ha = null); break; case 'focusout':Ha = tc = Bu = null; break; case 'mousedown':uc = !0; break; case 'contextmenu':case 'mouseup':case 'dragend':uc = !1, H0(g, u, s); break; case 'selectionchange':if (mm) {
            break;
          } case 'keydown':case 'keyup':H0(g, u, s);
        } let D; if (Jc) {
          l: {
            switch (l) {
              case 'compositionstart':var N = 'onCompositionStart'; break l; case 'compositionend':N = 'onCompositionEnd'; break l; case 'compositionupdate':N = 'onCompositionUpdate'; break l;
            }N = void 0;
          }
        } else {
          Ru ? ey(l, u) && (N = 'onCompositionEnd') : l === 'keydown' && u.keyCode === 229 && (N = 'onCompositionStart');
        }N && (ny && u.locale !== 'ko' && (Ru || N !== 'onCompositionStart' ? N === 'onCompositionEnd' && Ru && (D = ay()) : (Bt = s, Lc = 'value' in Bt ? Bt.value : Bt.textContent, Ru = !0)), E = Ee(d, N), E.length > 0 && (N = new T0(N, l, null, u, s), g.push({ event: N, listeners: E }), D ? N.data = D : (D = fy(u), D !== null && (N.data = D)))), (D = am ? nm(l, u) : em(l, u)) && (N = Ee(d, 'onBeforeInput'), N.length > 0 && (E = new T0('onBeforeInput', 'beforeinput', null, u, s), g.push({ event: E, listeners: N }), E.data = D)), Fm(g, l, d, u, s);
      }ud(g, t);
    });
  } function Fa(l, t, u) {
    return { instance: l, listener: t, currentTarget: u };
  } function Ee(l, t) {
    for (let u = `${t}Capture`, a = []; l !== null;) {
      let n = l; const e = n.stateNode; if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || e === null || (n = ja(l, u), n != null && a.unshift(Fa(l, n, e)), n = ja(l, t), n != null && a.push(Fa(l, n, e))), l.tag === 3) {
        return a;
      } l = l.return;
    } return [];
  } function Im(l) {
    if (l === null) {
      return null;
    } do {
      l = l.return;
    } while (l && l.tag !== 5 && l.tag !== 27); return l || null;
  } function m1(l, t, u, a, n) {
    for (var e = t._reactName, f = []; u !== null && u !== a;) {
      let c = u; let i = c.alternate; let d = c.stateNode; if (c = c.tag, i !== null && i === a) {
        break;
      } c !== 5 && c !== 26 && c !== 27 || d === null || (i = d, n ? (d = ja(u, e), d != null && f.unshift(Fa(u, d, i))) : n || (d = ja(u, e), d != null && f.push(Fa(u, d, i)))), u = u.return;
    }f.length !== 0 && l.push({ event: t, listeners: f });
  } const Pm = /\r\n?/g; const lh = /\0|\uFFFD/g; function h1(l) {
    return (typeof l == 'string' ? l : `${l}`).replace(Pm, `
`).replace(lh, '');
  } function nd(l, t) {
    return t = h1(t), h1(l) === t;
  } function Q(l, t, u, a, n, e) {
    switch (u) {
      case 'children':typeof a == 'string' ? t === 'body' || t === 'textarea' && a === '' || $u(l, a) : (typeof a == 'number' || typeof a == 'bigint') && t !== 'body' && $u(l, `${a}`); break; case 'className':On(l, 'class', a); break; case 'tabIndex':On(l, 'tabindex', a); break; case 'dir':case 'role':case 'viewBox':case 'width':case 'height':On(l, u, a); break; case 'style':ty(l, a, e); break; case 'data':if (t !== 'object') {
        On(l, 'data', a); break;
      } case 'src':case 'href':if (a === '' && (t !== 'a' || u !== 'href')) {
        l.removeAttribute(u); break;
      } if (a == null || typeof a == 'function' || typeof a == 'symbol' || typeof a == 'boolean') {
          l.removeAttribute(u); break;
        }a = Qn(`${a}`), l.setAttribute(u, a); break; case 'action':case 'formAction':if (typeof a == 'function') {
        l.setAttribute(u, 'javascript:throw new Error(\'A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().\')'); break;
      } else {
        typeof e == 'function' && (u === 'formAction' ? (t !== 'input' && Q(l, t, 'name', n.name, n, null), Q(l, t, 'formEncType', n.formEncType, n, null), Q(l, t, 'formMethod', n.formMethod, n, null), Q(l, t, 'formTarget', n.formTarget, n, null)) : (Q(l, t, 'encType', n.encType, n, null), Q(l, t, 'method', n.method, n, null), Q(l, t, 'target', n.target, n, null)));
      } if (a == null || typeof a == 'symbol' || typeof a == 'boolean') {
          l.removeAttribute(u); break;
        }a = Qn(`${a}`), l.setAttribute(u, a); break; case 'onClick':a != null && (l.onclick = ot); break; case 'onScroll':a != null && U('scroll', l); break; case 'onScrollEnd':a != null && U('scrollend', l); break; case 'dangerouslySetInnerHTML':if (a != null) {
        if (typeof a != 'object' || !('__html' in a)) {
          throw new Error(b(61));
        } if (u = a.__html, u != null) {
          if (n.children != null) {
            throw new Error(b(60));
          } l.innerHTML = u;
        }
      } break; case 'multiple':l.multiple = a && typeof a != 'function' && typeof a != 'symbol'; break; case 'muted':l.muted = a && typeof a != 'function' && typeof a != 'symbol'; break; case 'suppressContentEditableWarning':case 'suppressHydrationWarning':case 'defaultValue':case 'defaultChecked':case 'innerHTML':case 'ref':break; case 'autoFocus':break; case 'xlinkHref':if (a == null || typeof a == 'function' || typeof a == 'boolean' || typeof a == 'symbol') {
        l.removeAttribute('xlink:href'); break;
      }u = Qn(`${a}`), l.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', u); break; case 'contentEditable':case 'spellCheck':case 'draggable':case 'value':case 'autoReverse':case 'externalResourcesRequired':case 'focusable':case 'preserveAlpha':a != null && typeof a != 'function' && typeof a != 'symbol' ? l.setAttribute(u, `${a}`) : l.removeAttribute(u); break; case 'inert':case 'allowFullScreen':case 'async':case 'autoPlay':case 'controls':case 'default':case 'defer':case 'disabled':case 'disablePictureInPicture':case 'disableRemotePlayback':case 'formNoValidate':case 'hidden':case 'loop':case 'noModule':case 'noValidate':case 'open':case 'playsInline':case 'readOnly':case 'required':case 'reversed':case 'scoped':case 'seamless':case 'itemScope':a && typeof a != 'function' && typeof a != 'symbol' ? l.setAttribute(u, '') : l.removeAttribute(u); break; case 'capture':case 'download':a === !0 ? l.setAttribute(u, '') : a !== !1 && a != null && typeof a != 'function' && typeof a != 'symbol' ? l.setAttribute(u, a) : l.removeAttribute(u); break; case 'cols':case 'rows':case 'size':case 'span':a != null && typeof a != 'function' && typeof a != 'symbol' && !isNaN(a) && a >= 1 ? l.setAttribute(u, a) : l.removeAttribute(u); break; case 'rowSpan':case 'start':a == null || typeof a == 'function' || typeof a == 'symbol' || isNaN(a) ? l.removeAttribute(u) : l.setAttribute(u, a); break; case 'popover':U('beforetoggle', l), U('toggle', l), Xn(l, 'popover', a); break; case 'xlinkActuate':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:actuate', a); break; case 'xlinkArcrole':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', a); break; case 'xlinkRole':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:role', a); break; case 'xlinkShow':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:show', a); break; case 'xlinkTitle':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:title', a); break; case 'xlinkType':nt(l, 'http://www.w3.org/1999/xlink', 'xlink:type', a); break; case 'xmlBase':nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:base', a); break; case 'xmlLang':nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', a); break; case 'xmlSpace':nt(l, 'http://www.w3.org/XML/1998/namespace', 'xml:space', a); break; case 'is':Xn(l, 'is', a); break; case 'innerText':case 'textContent':break; default:(!(u.length > 2) || u[0] !== 'o' && u[0] !== 'O' || u[1] !== 'n' && u[1] !== 'N') && (u = No.get(u) || u, Xn(l, u, a));
    }
  } function pc(l, t, u, a, n, e) {
    switch (u) {
      case 'style':ty(l, a, e); break; case 'dangerouslySetInnerHTML':if (a != null) {
        if (typeof a != 'object' || !('__html' in a)) {
          throw new Error(b(61));
        } if (u = a.__html, u != null) {
          if (n.children != null) {
            throw new Error(b(60));
          } l.innerHTML = u;
        }
      } break; case 'children':typeof a == 'string' ? $u(l, a) : (typeof a == 'number' || typeof a == 'bigint') && $u(l, `${a}`); break; case 'onScroll':a != null && U('scroll', l); break; case 'onScrollEnd':a != null && U('scrollend', l); break; case 'onClick':a != null && (l.onclick = ot); break; case 'suppressContentEditableWarning':case 'suppressHydrationWarning':case 'innerHTML':case 'ref':break; case 'innerText':case 'textContent':break; default:if (!$1.hasOwnProperty(u)) {
        l: {
          if (u[0] === 'o' && u[1] === 'n' && (n = u.endsWith('Capture'), t = u.slice(2, n ? u.length - 7 : void 0), e = l[_l] || null, e = e != null ? e[u] : null, typeof e == 'function' && l.removeEventListener(t, e, n), typeof a == 'function')) {
            typeof e != 'function' && e !== null && (u in l ? l[u] = null : l.hasAttribute(u) && l.removeAttribute(u)), l.addEventListener(t, a, n); break l;
          }u in l ? l[u] = a : a === !0 ? l.setAttribute(u, '') : Xn(l, u, a);
        }
      }
    }
  } function ml(l, t, u) {
    switch (t) {
      case 'div':case 'span':case 'svg':case 'path':case 'a':case 'g':case 'p':case 'li':break; case 'img':U('error', l), U('load', l); var a = !1; var n = !1; var e; for (e in u) {
        if (u.hasOwnProperty(e)) {
          var f = u[e]; if (f != null) {
            switch (e) {
              case 'src':a = !0; break; case 'srcSet':n = !0; break; case 'children':case 'dangerouslySetInnerHTML':throw new Error(b(137, t)); default:Q(l, t, e, f, u, null);
            }
          }
        }
      }n && Q(l, t, 'srcSet', u.srcSet, u, null), a && Q(l, t, 'src', u.src, u, null); return; case 'input':U('invalid', l); var c = e = f = n = null; var i = null; var d = null; for (a in u) {
        if (u.hasOwnProperty(a)) {
          var s = u[a]; if (s != null) {
            switch (a) {
              case 'name':n = s; break; case 'type':f = s; break; case 'checked':i = s; break; case 'defaultChecked':d = s; break; case 'value':e = s; break; case 'defaultValue':c = s; break; case 'children':case 'dangerouslySetInnerHTML':if (s != null) {
                throw new Error(b(137, t));
              } break; default:Q(l, t, a, s, u, null);
            }
          }
        }
      }I1(l, e, c, i, d, f, n, !1); return; case 'select':U('invalid', l), a = f = e = null; for (n in u) {
        if (u.hasOwnProperty(n) && (c = u[n], c != null)) {
          switch (n) {
            case 'value':e = c; break; case 'defaultValue':f = c; break; case 'multiple':a = c; default:Q(l, t, n, c, u, null);
          }
        }
      }t = e, u = f, l.multiple = !!a, t != null ? ju(l, !!a, t, !1) : u != null && ju(l, !!a, u, !0); return; case 'textarea':U('invalid', l), e = n = a = null; for (f in u) {
        if (u.hasOwnProperty(f) && (c = u[f], c != null)) {
          switch (f) {
            case 'value':a = c; break; case 'defaultValue':n = c; break; case 'children':e = c; break; case 'dangerouslySetInnerHTML':if (c != null) {
              throw new Error(b(91));
            } break; default:Q(l, t, f, c, u, null);
          }
        }
      }ly(l, a, n, e); return; case 'option':for (i in u) {
        if (u.hasOwnProperty(i) && (a = u[i], a != null)) {
          switch (i) {
            case 'selected':l.selected = a && typeof a != 'function' && typeof a != 'symbol'; break; default:Q(l, t, i, a, u, null);
          }
        }
      } return; case 'dialog':U('beforetoggle', l), U('toggle', l), U('cancel', l), U('close', l); break; case 'iframe':case 'object':U('load', l); break; case 'video':case 'audio':for (a = 0; a < $a.length; a++) {
        U($a[a], l);
      } break; case 'image':U('error', l), U('load', l); break; case 'details':U('toggle', l); break; case 'embed':case 'source':case 'link':U('error', l), U('load', l); case 'area':case 'base':case 'br':case 'col':case 'hr':case 'keygen':case 'meta':case 'param':case 'track':case 'wbr':case 'menuitem':for (d in u) {
        if (u.hasOwnProperty(d) && (a = u[d], a != null)) {
          switch (d) {
            case 'children':case 'dangerouslySetInnerHTML':throw new Error(b(137, t)); default:Q(l, t, d, a, u, null);
          }
        }
      } return; default:if (Zc(t)) {
        for (s in u) {
          u.hasOwnProperty(s) && (a = u[s], a !== void 0 && pc(l, t, s, a, u, void 0));
        } return;
      }
    } for (c in u) {
      u.hasOwnProperty(c) && (a = u[c], a != null && Q(l, t, c, a, u, null));
    }
  } function th(l, t, u, a) {
    switch (t) {
      case 'div':case 'span':case 'svg':case 'path':case 'a':case 'g':case 'p':case 'li':break; case 'input':var n = null; var e = null; var f = null; var c = null; var i = null; var d = null; var s = null; for (h in u) {
        var g = u[h]; if (u.hasOwnProperty(h) && g != null) {
          switch (h) {
            case 'checked':break; case 'value':break; case 'defaultValue':i = g; default:a.hasOwnProperty(h) || Q(l, t, h, null, a, g);
          }
        }
      } for (var m in a) {
          var h = a[m]; if (g = u[m], a.hasOwnProperty(m) && (h != null || g != null)) {
            switch (m) {
              case 'type':e = h; break; case 'name':n = h; break; case 'checked':d = h; break; case 'defaultChecked':s = h; break; case 'value':f = h; break; case 'defaultValue':c = h; break; case 'children':case 'dangerouslySetInnerHTML':if (h != null) {
                throw new Error(b(137, t));
              } break; default:h !== g && Q(l, t, m, h, a, g);
            }
          }
        }kf(l, f, c, i, d, s, e, n); return; case 'select':h = f = c = m = null; for (e in u) {
        if (i = u[e], u.hasOwnProperty(e) && i != null) {
          switch (e) {
            case 'value':break; case 'multiple':h = i; default:a.hasOwnProperty(e) || Q(l, t, e, null, a, i);
          }
        }
      } for (n in a) {
          if (e = a[n], i = u[n], a.hasOwnProperty(n) && (e != null || i != null)) {
            switch (n) {
              case 'value':m = e; break; case 'defaultValue':c = e; break; case 'multiple':f = e; default:e !== i && Q(l, t, n, e, a, i);
            }
          }
        }t = c, u = f, a = h, m != null ? ju(l, !!u, m, !1) : !!a != !!u && (t != null ? ju(l, !!u, t, !0) : ju(l, !!u, u ? [] : '', !1)); return; case 'textarea':h = m = null; for (c in u) {
        if (n = u[c], u.hasOwnProperty(c) && n != null && !a.hasOwnProperty(c)) {
          switch (c) {
            case 'value':break; case 'children':break; default:Q(l, t, c, null, a, n);
          }
        }
      } for (f in a) {
          if (n = a[f], e = u[f], a.hasOwnProperty(f) && (n != null || e != null)) {
            switch (f) {
              case 'value':m = n; break; case 'defaultValue':h = n; break; case 'children':break; case 'dangerouslySetInnerHTML':if (n != null) {
                throw new Error(b(91));
              } break; default:n !== e && Q(l, t, f, n, a, e);
            }
          }
        }P1(l, m, h); return; case 'option':for (const z in u) {
        if (m = u[z], u.hasOwnProperty(z) && m != null && !a.hasOwnProperty(z)) {
          switch (z) {
            case 'selected':l.selected = !1; break; default:Q(l, t, z, null, a, m);
          }
        }
      } for (i in a) {
          if (m = a[i], h = u[i], a.hasOwnProperty(i) && m !== h && (m != null || h != null)) {
            switch (i) {
              case 'selected':l.selected = m && typeof m != 'function' && typeof m != 'symbol'; break; default:Q(l, t, i, m, a, h);
            }
          }
        } return; case 'img':case 'link':case 'area':case 'base':case 'br':case 'col':case 'embed':case 'hr':case 'keygen':case 'meta':case 'param':case 'source':case 'track':case 'wbr':case 'menuitem':for (const T in u) {
        m = u[T], u.hasOwnProperty(T) && m != null && !a.hasOwnProperty(T) && Q(l, t, T, null, a, m);
      } for (d in a) {
          if (m = a[d], h = u[d], a.hasOwnProperty(d) && m !== h && (m != null || h != null)) {
            switch (d) {
              case 'children':case 'dangerouslySetInnerHTML':if (m != null) {
                throw new Error(b(137, t));
              } break; default:Q(l, t, d, m, a, h);
            }
          }
        } return; default:if (Zc(t)) {
        for (const _ in u) {
          m = u[_], u.hasOwnProperty(_) && m !== void 0 && !a.hasOwnProperty(_) && pc(l, t, _, void 0, a, m);
        } for (s in a) {
          m = a[s], h = u[s], !a.hasOwnProperty(s) || m === h || m === void 0 && h === void 0 || pc(l, t, s, m, a, h);
        } return;
      }
    } for (const v in u) {
      m = u[v], u.hasOwnProperty(v) && m != null && !a.hasOwnProperty(v) && Q(l, t, v, null, a, m);
    } for (g in a) {
      m = a[g], h = u[g], !a.hasOwnProperty(g) || m === h || m == null && h == null || Q(l, t, g, m, a, h);
    }
  } function s1(l) {
    switch (l) {
      case 'css':case 'script':case 'font':case 'img':case 'image':case 'input':case 'link':return !0; default:return !1;
    }
  } function uh() {
    if (typeof performance.getEntriesByType == 'function') {
      for (var l = 0, t = 0, u = performance.getEntriesByType('resource'), a = 0; a < u.length; a++) {
        const n = u[a]; const e = n.transferSize; let f = n.initiatorType; let c = n.duration; if (e && c && s1(f)) {
          for (f = 0, c = n.responseEnd, a += 1; a < u.length; a++) {
            let i = u[a]; const d = i.startTime; if (d > c) {
              break;
            } const s = i.transferSize; const g = i.initiatorType; s && s1(g) && (i = i.responseEnd, f += s * (i < c ? 1 : (c - d) / (i - d)));
          } if (--a, t += 8 * (e + f) / (n.duration / 1e3), l++, l > 10) {
            break;
          }
        }
      } if (l > 0) {
        return t / l / 1e6;
      }
    } return navigator.connection && (l = navigator.connection.downlink, typeof l == 'number') ? l : 5;
  } var Dc = null; var Uc = null; function Ae(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  } function g1(l) {
    switch (l) {
      case 'http://www.w3.org/2000/svg':return 1; case 'http://www.w3.org/1998/Math/MathML':return 2; default:return 0;
    }
  } function ed(l, t) {
    if (l === 0) {
      switch (t) {
        case 'svg':return 1; case 'math':return 2; default:return 0;
      }
    } return l === 1 && t === 'foreignObject' ? 0 : l;
  } function Hc(l, t) {
    return l === 'textarea' || l === 'noscript' || typeof t.children == 'string' || typeof t.children == 'number' || typeof t.children == 'bigint' || typeof t.dangerouslySetInnerHTML == 'object' && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  } let Qf = null; function ah() {
    const l = window.event; return l && l.type === 'popstate' ? l === Qf ? !1 : (Qf = l, !0) : (Qf = null, !1);
  } var fd = typeof setTimeout == 'function' ? setTimeout : void 0; var nh = typeof clearTimeout == 'function' ? clearTimeout : void 0; const S1 = typeof Promise == 'function' ? Promise : void 0; var eh = typeof queueMicrotask == 'function'
    ? queueMicrotask
    : typeof S1 < 'u'
      ? function (l) {
        return S1.resolve(null).then(l).catch(fh);
      }
      : fd; function fh(l) {
    setTimeout(() => {
      throw l;
    });
  } function kt(l) {
    return l === 'head';
  } function b1(l, t) {
    let u = t; let a = 0; do {
      const n = u.nextSibling; if (l.removeChild(u), n && n.nodeType === 8) {
        if (u = n.data, u === '/$' || u === '/&') {
          if (a === 0) {
            l.removeChild(n), aa(t); return;
          }a--;
        } else if (u === '$' || u === '$?' || u === '$~' || u === '$!' || u === '&') {
          a++;
        } else if (u === 'html') {
          Qa(l.ownerDocument.documentElement);
        } else if (u === 'head') {
          u = l.ownerDocument.head, Qa(u); for (let e = u.firstChild; e;) {
            const f = e.nextSibling; const c = e.nodeName; e[nn] || c === 'SCRIPT' || c === 'STYLE' || c === 'LINK' && e.rel.toLowerCase() === 'stylesheet' || u.removeChild(e), e = f;
          }
        } else {
          u === 'body' && Qa(l.ownerDocument.body);
        }
      }u = n;
    } while (u); aa(t);
  } function z1(l, t) {
    let u = l; l = 0; do {
      const a = u.nextSibling; if (u.nodeType === 1 ? t ? (u._stashedDisplay = u.style.display, u.style.display = 'none') : (u.style.display = u._stashedDisplay || '', u.getAttribute('style') === '' && u.removeAttribute('style')) : u.nodeType === 3 && (t ? (u._stashedText = u.nodeValue, u.nodeValue = '') : u.nodeValue = u._stashedText || ''), a && a.nodeType === 8) {
        if (u = a.data, u === '/$') {
          if (l === 0) {
            break;
          } l--;
        } else {
          u !== '$' && u !== '$?' && u !== '$~' && u !== '$!' || l++;
        }
      }u = a;
    } while (u);
  } function Nc(l) {
    let t = l.firstChild; for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      const u = t; switch (t = t.nextSibling, u.nodeName) {
        case 'HTML':case 'HEAD':case 'BODY':Nc(u), jc(u); continue; case 'SCRIPT':case 'STYLE':continue; case 'LINK':if (u.rel.toLowerCase() === 'stylesheet') {
          continue;
        }
      }l.removeChild(u);
    }
  } function ch(l, t, u, a) {
    for (;l.nodeType === 1;) {
      const n = u; if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== 'INPUT' || l.type !== 'hidden')) {
          break;
        }
      } else if (a) {
        if (!l[nn]) {
          switch (t) {
            case 'meta':if (!l.hasAttribute('itemprop')) {
              break;
            } return l; case 'link':if (e = l.getAttribute('rel'), e === 'stylesheet' && l.hasAttribute('data-precedence')) {
              break;
            } if (e !== n.rel || l.getAttribute('href') !== (n.href == null || n.href === '' ? null : n.href) || l.getAttribute('crossorigin') !== (n.crossOrigin == null ? null : n.crossOrigin) || l.getAttribute('title') !== (n.title == null ? null : n.title)) {
                break;
              } return l; case 'style':if (l.hasAttribute('data-precedence')) {
              break;
            } return l; case 'script':if (e = l.getAttribute('src'), (e !== (n.src == null ? null : n.src) || l.getAttribute('type') !== (n.type == null ? null : n.type) || l.getAttribute('crossorigin') !== (n.crossOrigin == null ? null : n.crossOrigin)) && e && l.hasAttribute('async') && !l.hasAttribute('itemprop')) {
              break;
            } return l; default:return l;
          }
        }
      } else if (t === 'input' && l.type === 'hidden') {
        var e = n.name == null ? null : `${n.name}`; if (n.type === 'hidden' && l.getAttribute('name') === e) {
          return l;
        }
      } else {
        return l;
      } if (l = Ll(l.nextSibling), l === null) {
        break;
      }
    } return null;
  } function ih(l, t, u) {
    if (t === '') {
      return null;
    } for (;l.nodeType !== 3;) {
      if ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') && !u || (l = Ll(l.nextSibling), l === null)) {
        return null;
      }
    } return l;
  } function cd(l, t) {
    for (;l.nodeType !== 8;) {
      if ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') && !t || (l = Ll(l.nextSibling), l === null)) {
        return null;
      }
    } return l;
  } function Cc(l) {
    return l.data === '$?' || l.data === '$~';
  } function Rc(l) {
    return l.data === '$!' || l.data === '$?' && l.ownerDocument.readyState !== 'loading';
  } function yh(l, t) {
    const u = l.ownerDocument; if (l.data === '$~') {
      l._reactRetry = t;
    } else if (l.data !== '$?' || u.readyState !== 'loading') {
      t();
    } else {
      const a = function () {
        t(), u.removeEventListener('DOMContentLoaded', a);
      }; u.addEventListener('DOMContentLoaded', a), l._reactRetry = a;
    }
  } function Ll(l) {
    for (;l != null; l = l.nextSibling) {
      let t = l.nodeType; if (t === 1 || t === 3) {
        break;
      } if (t === 8) {
        if (t = l.data, t === '$' || t === '$!' || t === '$?' || t === '$~' || t === '&' || t === 'F!' || t === 'F') {
          break;
        } if (t === '/$' || t === '/&') {
          return null;
        }
      }
    } return l;
  } var Bc = null; function T1(l) {
    l = l.nextSibling; for (let t = 0; l;) {
      if (l.nodeType === 8) {
        const u = l.data; if (u === '/$' || u === '/&') {
          if (t === 0) {
            return Ll(l.nextSibling);
          } t--;
        } else {
          u !== '$' && u !== '$!' && u !== '$?' && u !== '$~' && u !== '&' || t++;
        }
      }l = l.nextSibling;
    } return null;
  } function E1(l) {
    l = l.previousSibling; for (let t = 0; l;) {
      if (l.nodeType === 8) {
        const u = l.data; if (u === '$' || u === '$!' || u === '$?' || u === '$~' || u === '&') {
          if (t === 0) {
            return l;
          } t--;
        } else {
          u !== '/$' && u !== '/&' || t++;
        }
      }l = l.previousSibling;
    } return null;
  } function id(l, t, u) {
    switch (t = Ae(u), l) {
      case 'html':if (l = t.documentElement, !l) {
        throw new Error(b(452));
      } return l; case 'head':if (l = t.head, !l) {
        throw new Error(b(453));
      } return l; case 'body':if (l = t.body, !l) {
        throw new Error(b(454));
      } return l; default:throw new Error(b(451));
    }
  } function Qa(l) {
    for (let t = l.attributes; t.length;) {
      l.removeAttributeNode(t[0]);
    }jc(l);
  } const Kl = new Map(); const A1 = new Set(); function _e(l) {
    return typeof l.getRootNode == 'function' ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  } const At = r.d; r.d = { f: vh, r: dh, D: oh, C: mh, L: hh, m: sh, X: Sh, S: gh, M: bh }; function vh() {
    const l = At.f(); const t = xe(); return l || t;
  } function dh(l) {
    const t = ea(l); t !== null && t.tag === 5 && t.type === 'form' ? tv(t) : At.r(l);
  } const ya = typeof document > 'u' ? null : document; function yd(l, t, u) {
    const a = ya; if (a && typeof t == 'string' && t) {
      let n = xl(t); n = `link[rel="${l}"][href="${n}"]`, typeof u == 'string' && (n += `[crossorigin="${u}"]`), A1.has(n) || (A1.add(n), l = { rel: l, crossOrigin: u, href: t }, a.querySelector(n) === null && (t = a.createElement('link'), ml(t, 'link', l), cl(t), a.head.appendChild(t)));
    }
  } function oh(l) {
    At.D(l), yd('dns-prefetch', l, null);
  } function mh(l, t) {
    At.C(l, t), yd('preconnect', l, t);
  } function hh(l, t, u) {
    At.L(l, t, u); const a = ya; if (a && l && t) {
      let n = `link[rel="preload"][as="${xl(t)}"]`; t === 'image' && u && u.imageSrcSet ? (n += `[imagesrcset="${xl(u.imageSrcSet)}"]`, typeof u.imageSizes == 'string' && (n += `[imagesizes="${xl(u.imageSizes)}"]`)) : n += `[href="${xl(l)}"]`; let e = n; switch (t) {
        case 'style':e = ua(l); break; case 'script':e = va(l);
      }Kl.has(e) || (l = J({ rel: 'preload', href: t === 'image' && u && u.imageSrcSet ? void 0 : l, as: t }, u), Kl.set(e, l), a.querySelector(n) !== null || t === 'style' && a.querySelector(dn(e)) || t === 'script' && a.querySelector(on(e)) || (t = a.createElement('link'), ml(t, 'link', l), cl(t), a.head.appendChild(t)));
    }
  } function sh(l, t) {
    At.m(l, t); const u = ya; if (u && l) {
      let a = t && typeof t.as == 'string' ? t.as : 'script'; const n = `link[rel="modulepreload"][as="${xl(a)}"][href="${xl(l)}"]`; let e = n; switch (a) {
        case 'audioworklet':case 'paintworklet':case 'serviceworker':case 'sharedworker':case 'worker':case 'script':e = va(l);
      } if (!Kl.has(e) && (l = J({ rel: 'modulepreload', href: l }, t), Kl.set(e, l), u.querySelector(n) === null)) {
        switch (a) {
          case 'audioworklet':case 'paintworklet':case 'serviceworker':case 'sharedworker':case 'worker':case 'script':if (u.querySelector(on(e))) {
            return;
          }
        }a = u.createElement('link'), ml(a, 'link', l), cl(a), u.head.appendChild(a);
      }
    }
  } function gh(l, t, u) {
    At.S(l, t, u); const a = ya; if (a && l) {
      const n = xu(a).hoistableStyles; const e = ua(l); t = t || 'default'; let f = n.get(e); if (!f) {
        const c = { loading: 0, preload: null }; if (f = a.querySelector(dn(e))) {
          c.loading = 5;
        } else {
          l = J({ 'rel': 'stylesheet', 'href': l, 'data-precedence': t }, u), (u = Kl.get(e)) && pi(l, u); const i = f = a.createElement('link'); cl(i), ml(i, 'link', l), i._p = new Promise((d, s) => {
            i.onload = d, i.onerror = s;
          }), i.addEventListener('load', () => {
            c.loading |= 1;
          }), i.addEventListener('error', () => {
            c.loading |= 2;
          }), c.loading |= 4, $n(f, t, a);
        }f = { type: 'stylesheet', instance: f, count: 1, state: c }, n.set(e, f);
      }
    }
  } function Sh(l, t) {
    At.X(l, t); const u = ya; if (u && l) {
      const a = xu(u).hoistableScripts; const n = va(l); let e = a.get(n); e || (e = u.querySelector(on(n)), e || (l = J({ src: l, async: !0 }, t), (t = Kl.get(n)) && Di(l, t), e = u.createElement('script'), cl(e), ml(e, 'link', l), u.head.appendChild(e)), e = { type: 'script', instance: e, count: 1, state: null }, a.set(n, e));
    }
  } function bh(l, t) {
    At.M(l, t); const u = ya; if (u && l) {
      const a = xu(u).hoistableScripts; const n = va(l); let e = a.get(n); e || (e = u.querySelector(on(n)), e || (l = J({ src: l, async: !0, type: 'module' }, t), (t = Kl.get(n)) && Di(l, t), e = u.createElement('script'), cl(e), ml(e, 'link', l), u.head.appendChild(e)), e = { type: 'script', instance: e, count: 1, state: null }, a.set(n, e));
    }
  } function _1(l, t, u, a) {
    var n = (n = Gt.current) ? _e(n) : null; if (!n) {
      throw new Error(b(446));
    } switch (l) {
      case 'meta':case 'title':return null; case 'style':return typeof u.precedence == 'string' && typeof u.href == 'string' ? (t = ua(u.href), u = xu(n).hoistableStyles, a = u.get(t), a || (a = { type: 'style', instance: null, count: 0, state: null }, u.set(t, a)), a) : { type: 'void', instance: null, count: 0, state: null }; case 'link':if (u.rel === 'stylesheet' && typeof u.href == 'string' && typeof u.precedence == 'string') {
        l = ua(u.href); let e = xu(n).hoistableStyles; let f = e.get(l); if (f || (n = n.ownerDocument || n, f = { type: 'stylesheet', instance: null, count: 0, state: { loading: 0, preload: null } }, e.set(l, f), (e = n.querySelector(dn(l))) && !e._p && (f.instance = e, f.state.loading = 5), Kl.has(l) || (u = { rel: 'preload', as: 'style', href: u.href, crossOrigin: u.crossOrigin, integrity: u.integrity, media: u.media, hrefLang: u.hrefLang, referrerPolicy: u.referrerPolicy }, Kl.set(l, u), e || zh(n, l, u, f.state))), t && a === null) {
          throw new Error(b(528, ''));
        } return f;
      } if (t && a !== null) {
          throw new Error(b(529, ''));
        } return null; case 'script':return t = u.async, u = u.src, typeof u == 'string' && t && typeof t != 'function' && typeof t != 'symbol' ? (t = va(u), u = xu(n).hoistableScripts, a = u.get(t), a || (a = { type: 'script', instance: null, count: 0, state: null }, u.set(t, a)), a) : { type: 'void', instance: null, count: 0, state: null }; default:throw new Error(b(444, l));
    }
  } function ua(l) {
    return `href="${xl(l)}"`;
  } function dn(l) {
    return `link[rel="stylesheet"][${l}]`;
  } function vd(l) {
    return J({}, l, { 'data-precedence': l.precedence, 'precedence': null });
  } function zh(l, t, u, a) {
    l.querySelector(`link[rel="preload"][as="style"][${t}]`)
      ? a.loading = 1
      : (t = l.createElement('link'), a.preload = t, t.addEventListener('load', () => {
          return a.loading |= 1;
        }), t.addEventListener('error', () => {
          return a.loading |= 2;
        }), ml(t, 'link', u), cl(t), l.head.appendChild(t));
  } function va(l) {
    return `[src="${xl(l)}"]`;
  } function on(l) {
    return `script[async]${l}`;
  } function O1(l, t, u) {
    if (t.count++, t.instance === null) {
      switch (t.type) {
        case 'style':var a = l.querySelector(`style[data-href~="${xl(u.href)}"]`); if (a) {
          return t.instance = a, cl(a), a;
        } var n = J({}, u, { 'data-href': u.href, 'data-precedence': u.precedence, 'href': null, 'precedence': null }); return a = (l.ownerDocument || l).createElement('style'), cl(a), ml(a, 'style', n), $n(a, u.precedence, l), t.instance = a; case 'stylesheet':n = ua(u.href); var e = l.querySelector(dn(n)); if (e) {
          return t.state.loading |= 4, t.instance = e, cl(e), e;
        } a = vd(u), (n = Kl.get(n)) && pi(a, n), e = (l.ownerDocument || l).createElement('link'), cl(e); var f = e; return f._p = new Promise((c, i) => {
            f.onload = c, f.onerror = i;
          }), ml(e, 'link', a), t.state.loading |= 4, $n(e, u.precedence, l), t.instance = e; case 'script':return e = va(u.src), (n = l.querySelector(on(e))) ? (t.instance = n, cl(n), n) : (a = u, (n = Kl.get(e)) && (a = J({}, u), Di(a, n)), l = l.ownerDocument || l, n = l.createElement('script'), cl(n), ml(n, 'link', a), l.head.appendChild(n), t.instance = n); case 'void':return null; default:throw new Error(b(443, t.type));
      }
    } else {
      t.type === 'stylesheet' && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, $n(a, u.precedence, l));
    } return t.instance;
  } function $n(l, t, u) {
    for (var a = u.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), n = a.length ? a[a.length - 1] : null, e = n, f = 0; f < a.length; f++) {
      const c = a[f]; if (c.dataset.precedence === t) {
        e = c;
      } else if (e !== n) {
        break;
      }
    }e ? e.parentNode.insertBefore(l, e.nextSibling) : (t = u.nodeType === 9 ? u.head : u, t.insertBefore(l, t.firstChild));
  } function pi(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  } function Di(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  } var Fn = null; function M1(l, t, u) {
    if (Fn === null) {
      var a = new Map(); var n = Fn = new Map(); n.set(u, a);
    } else {
      n = Fn, a = n.get(u), a || (a = new Map(), n.set(u, a));
    } if (a.has(l)) {
      return a;
    } for (a.set(l, null), u = u.getElementsByTagName(l), n = 0; n < u.length; n++) {
      const e = u[n]; if (!(e[nn] || e[vl] || l === 'link' && e.getAttribute('rel') === 'stylesheet') && e.namespaceURI !== 'http://www.w3.org/2000/svg') {
        let f = e.getAttribute(t) || ''; f = l + f; const c = a.get(f); c ? c.push(e) : a.set(f, [e]);
      }
    } return a;
  } function p1(l, t, u) {
    l = l.ownerDocument || l, l.head.insertBefore(u, t === 'title' ? l.querySelector('head > title') : null);
  } function Th(l, t, u) {
    if (u === 1 || t.itemProp != null) {
      return !1;
    } switch (l) {
      case 'meta':case 'title':return !0; case 'style':if (typeof t.precedence != 'string' || typeof t.href != 'string' || t.href === '') {
        break;
      } return !0; case 'link':if (typeof t.rel != 'string' || typeof t.href != 'string' || t.href === '' || t.onLoad || t.onError) {
        break;
      } switch (t.rel) {
          case 'stylesheet':return l = t.disabled, typeof t.precedence == 'string' && l == null; default:return !0;
        } case 'script':if (t.async && typeof t.async != 'function' && typeof t.async != 'symbol' && !t.onLoad && !t.onError && t.src && typeof t.src == 'string') {
        return !0;
      }
    } return !1;
  } function dd(l) {
    return !(l.type === 'stylesheet' && (l.state.loading & 3) === 0);
  } function Eh(l, t, u, a) {
    if (u.type === 'stylesheet' && (typeof a.media != 'string' || matchMedia(a.media).matches !== !1) && (u.state.loading & 4) === 0) {
      if (u.instance === null) {
        let n = ua(a.href); let e = t.querySelector(dn(n)); if (e) {
          t = e._p, t !== null && typeof t == 'object' && typeof t.then == 'function' && (l.count++, l = Oe.bind(l), t.then(l, l)), u.state.loading |= 4, u.instance = e, cl(e); return;
        }e = t.ownerDocument || t, a = vd(a), (n = Kl.get(n)) && pi(a, n), e = e.createElement('link'), cl(e); const f = e; f._p = new Promise((c, i) => {
          f.onload = c, f.onerror = i;
        }), ml(e, 'link', a), u.instance = e;
      }l.stylesheets === null && (l.stylesheets = new Map()), l.stylesheets.set(u, t), (t = u.state.preload) && (u.state.loading & 3) === 0 && (l.count++, u = Oe.bind(l), t.addEventListener('load', u), t.addEventListener('error', u));
    }
  } let xf = 0; function Ah(l, t) {
    return l.stylesheets && l.count === 0 && kn(l, l.stylesheets), l.count > 0 || l.imgCount > 0
      ? function (u) {
        const a = setTimeout(() => {
          if (l.stylesheets && kn(l, l.stylesheets), l.unsuspend) {
            const e = l.unsuspend; l.unsuspend = null, e();
          }
        }, 6e4 + t); l.imgBytes > 0 && xf === 0 && (xf = 62500 * uh()); const n = setTimeout(() => {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && kn(l, l.stylesheets), l.unsuspend)) {
            const e = l.unsuspend; l.unsuspend = null, e();
          }
        }, (l.imgBytes > xf ? 50 : 800) + t); return l.unsuspend = u, function () {
          l.unsuspend = null, clearTimeout(a), clearTimeout(n);
        };
      }
      : null;
  } function Oe() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) {
        kn(this, this.stylesheets);
      } else if (this.unsuspend) {
        const l = this.unsuspend; this.unsuspend = null, l();
      }
    }
  } let Me = null; function kn(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Me = new Map(), t.forEach(_h, l), Me = null, Oe.call(l));
  } function _h(l, t) {
    if (!(t.state.loading & 4)) {
      let u = Me.get(l); if (u) {
        var a = u.get(null);
      } else {
        u = new Map(), Me.set(l, u); for (var n = l.querySelectorAll('link[data-precedence],style[data-precedence]'), e = 0; e < n.length; e++) {
          var f = n[e]; (f.nodeName === 'LINK' || f.getAttribute('media') !== 'not all') && (u.set(f.dataset.precedence, f), a = f);
        }a && u.set(null, a);
      }n = t.instance, f = n.getAttribute('data-precedence'), e = u.get(f) || a, e === a && u.set(null, n), u.set(f, n), this.count++, a = Oe.bind(this), n.addEventListener('load', a), n.addEventListener('error', a), e ? e.parentNode.insertBefore(n, e.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(n, l.firstChild)), t.state.loading |= 4;
    }
  } var ka = { $$typeof: dt, Provider: null, Consumer: null, _currentValue: au, _currentValue2: au, _threadCount: 0 }; function Oh(l, t, u, a, n, e, f, c, i) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = of(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = of(0), this.hiddenUpdates = of(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = e, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.incompleteTransitions = new Map();
  } function od(l, t, u, a, n, e, f, c, i, d, s, g) {
    return l = new Oh(l, t, u, f, i, d, s, g, c), t = 1, e === !0 && (t |= 24), e = Dl(3, null, null, t), l.current = e, e.stateNode = l, t = Pc(), t.refCount++, l.pooledCache = t, t.refCount++, e.memoizedState = { element: a, isDehydrated: u, cache: t }, ui(e), l;
  } function md(l) {
    return l ? (l = ru, l) : ru;
  } function hd(l, t, u, a, n, e) {
    n = md(n), a.context === null ? a.context = n : a.pendingContext = n, a = Qt(t), a.payload = { element: u }, e = e === void 0 ? null : e, e !== null && (a.callback = e), u = xt(l, a, t), u !== null && (Al(u, l, t), Ca(u, l, t));
  } function D1(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      const u = l.retryLane; l.retryLane = u !== 0 && u < t ? u : t;
    }
  } function Ui(l, t) {
    D1(l, t), (l = l.alternate) && D1(l, t);
  } function sd(l) {
    if (l.tag === 13 || l.tag === 31) {
      const t = gu(l, 67108864); t !== null && Al(t, l, 67108864), Ui(l, 67108864);
    }
  } function U1(l) {
    if (l.tag === 13 || l.tag === 31) {
      let t = Rl(); t = Qc(t); const u = gu(l, t); u !== null && Al(u, l, t), Ui(l, t);
    }
  } var pe = !0; function Mh(l, t, u, a) {
    const n = O.T; O.T = null; const e = r.p; try {
      r.p = 2, Hi(l, t, u, a);
    } finally {
      r.p = e, O.T = n;
    }
  } function ph(l, t, u, a) {
    const n = O.T; O.T = null; const e = r.p; try {
      r.p = 8, Hi(l, t, u, a);
    } finally {
      r.p = e, O.T = n;
    }
  } function Hi(l, t, u, a) {
    if (pe) {
      let n = qc(a); if (n === null) {
        Xf(l, t, a, De, u), H1(l, a);
      } else if (Uh(n, l, t, u, a)) {
        a.stopPropagation();
      } else if (H1(l, a), t & 4 && Dh.includes(l)) {
        for (;n !== null;) {
          let e = ea(n); if (e !== null) {
            switch (e.tag) {
              case 3:if (e = e.stateNode, e.current.memoizedState.isDehydrated) {
                let f = lu(e.pendingLanes); if (f !== 0) {
                  var c = e; for (c.pendingLanes |= 2, c.entangledLanes |= 2; f;) {
                    const i = 1 << 31 - Cl(f); c.entanglements[1] |= i, f &= ~i;
                  }ut(e), (Y & 6) === 0 && (ge = Hl() + 500, vn(0, !1));
                }
              } break; case 31:case 13:c = gu(e, 2), c !== null && Al(c, e, 2), xe(), Ui(e, 2);
            }
          } if (e = qc(a), e === null && Xf(l, t, a, De, u), e === n) {
            break;
          } n = e;
        }n !== null && a.stopPropagation();
      } else {
        Xf(l, t, a, null, u);
      }
    }
  } function qc(l) {
    return l = Vc(l), Ni(l);
  } var De = null; function Ni(l) {
    if (De = null, l = Nu(l), l !== null) {
      const t = ln(l); if (t === null) {
        l = null;
      } else {
        const u = t.tag; if (u === 13) {
          if (l = Y1(t), l !== null) {
            return l;
          } l = null;
        } else if (u === 31) {
          if (l = r1(t), l !== null) {
            return l;
          } l = null;
        } else if (u === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated) {
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          } l = null;
        } else {
          t !== l && (l = null);
        }
      }
    } return De = l, null;
  } function gd(l) {
    switch (l) {
      case 'beforetoggle':case 'cancel':case 'click':case 'close':case 'contextmenu':case 'copy':case 'cut':case 'auxclick':case 'dblclick':case 'dragend':case 'dragstart':case 'drop':case 'focusin':case 'focusout':case 'input':case 'invalid':case 'keydown':case 'keypress':case 'keyup':case 'mousedown':case 'mouseup':case 'paste':case 'pause':case 'play':case 'pointercancel':case 'pointerdown':case 'pointerup':case 'ratechange':case 'reset':case 'resize':case 'seeked':case 'submit':case 'toggle':case 'touchcancel':case 'touchend':case 'touchstart':case 'volumechange':case 'change':case 'selectionchange':case 'textInput':case 'compositionstart':case 'compositionend':case 'compositionupdate':case 'beforeblur':case 'afterblur':case 'beforeinput':case 'blur':case 'fullscreenchange':case 'focus':case 'hashchange':case 'popstate':case 'select':case 'selectstart':return 2; case 'drag':case 'dragenter':case 'dragexit':case 'dragleave':case 'dragover':case 'mousemove':case 'mouseout':case 'mouseover':case 'pointermove':case 'pointerout':case 'pointerover':case 'scroll':case 'touchmove':case 'wheel':case 'mouseenter':case 'mouseleave':case 'pointerenter':case 'pointerleave':return 8; case 'message':switch (ho()) {
        case x1:return 2; case j1:return 8; case ue:case so:return 32; case Z1:return 268435456; default:return 32;
      } default:return 32;
    }
  } let Yc = !1; let Vt = null; let Lt = null; let Kt = null; const Ia = new Map(); const Pa = new Map(); const Ct = []; var Dh = 'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(' '); function H1(l, t) {
    switch (l) {
      case 'focusin':case 'focusout':Vt = null; break; case 'dragenter':case 'dragleave':Lt = null; break; case 'mouseover':case 'mouseout':Kt = null; break; case 'pointerover':case 'pointerout':Ia.delete(t.pointerId); break; case 'gotpointercapture':case 'lostpointercapture':Pa.delete(t.pointerId);
    }
  } function Ta(l, t, u, a, n, e) {
    return l === null || l.nativeEvent !== e ? (l = { blockedOn: t, domEventName: u, eventSystemFlags: a, nativeEvent: e, targetContainers: [n] }, t !== null && (t = ea(t), t !== null && sd(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, n !== null && !t.includes(n) && t.push(n), l);
  } function Uh(l, t, u, a, n) {
    switch (t) {
      case 'focusin':return Vt = Ta(Vt, l, t, u, a, n), !0; case 'dragenter':return Lt = Ta(Lt, l, t, u, a, n), !0; case 'mouseover':return Kt = Ta(Kt, l, t, u, a, n), !0; case 'pointerover':var e = n.pointerId; return Ia.set(e, Ta(Ia.get(e) || null, l, t, u, a, n)), !0; case 'gotpointercapture':return e = n.pointerId, Pa.set(e, Ta(Pa.get(e) || null, l, t, u, a, n)), !0;
    } return !1;
  } function Sd(l) {
    let t = Nu(l.target); if (t !== null) {
      const u = ln(t); if (u !== null) {
        if (t = u.tag, t === 13) {
          if (t = Y1(u), t !== null) {
            l.blockedOn = t, o0(l.priority, () => {
              U1(u);
            }); return;
          }
        } else if (t === 31) {
          if (t = r1(u), t !== null) {
            l.blockedOn = t, o0(l.priority, () => {
              U1(u);
            }); return;
          }
        } else if (t === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null; return;
        }
      }
    }l.blockedOn = null;
  } function In(l) {
    if (l.blockedOn !== null) {
      return !1;
    } for (let t = l.targetContainers; t.length > 0;) {
      let u = qc(l.nativeEvent); if (u === null) {
        u = l.nativeEvent; const a = new u.constructor(u.type, u); Pf = a, u.target.dispatchEvent(a), Pf = null;
      } else {
        return t = ea(u), t !== null && sd(t), l.blockedOn = u, !1;
      }t.shift();
    } return !0;
  } function N1(l, t, u) {
    In(l) && u.delete(t);
  } function Hh() {
    Yc = !1, Vt !== null && In(Vt) && (Vt = null), Lt !== null && In(Lt) && (Lt = null), Kt !== null && In(Kt) && (Kt = null), Ia.forEach(N1), Pa.forEach(N1);
  } function rn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, Yc || (Yc = !0, el.unstable_scheduleCallback(el.unstable_NormalPriority, Hh)));
  } let Gn = null; function C1(l) {
    Gn !== l && (Gn = l, el.unstable_scheduleCallback(el.unstable_NormalPriority, () => {
      Gn === l && (Gn = null); for (let t = 0; t < l.length; t += 3) {
        const u = l[t]; const a = l[t + 1]; const n = l[t + 2]; if (typeof a != 'function') {
          if (Ni(a || u) === null) {
            continue;
          } break;
        } const e = ea(u); e !== null && (l.splice(t, 3), t -= 3, sc(e, { pending: !0, data: n, method: u.method, action: a }, a, n));
      }
    }));
  } function aa(l) {
    function t(i) {
      return rn(i, l);
    }Vt !== null && rn(Vt, l), Lt !== null && rn(Lt, l), Kt !== null && rn(Kt, l), Ia.forEach(t), Pa.forEach(t); for (var u = 0; u < Ct.length; u++) {
      var a = Ct[u]; a.blockedOn === l && (a.blockedOn = null);
    } for (;Ct.length > 0 && (u = Ct[0], u.blockedOn === null);) {
      Sd(u), u.blockedOn === null && Ct.shift();
    } if (u = (l.ownerDocument || l).$$reactFormReplay, u != null) {
      for (a = 0; a < u.length; a += 3) {
        let n = u[a]; const e = u[a + 1]; let f = n[_l] || null; if (typeof e == 'function') {
          f || C1(u);
        } else if (f) {
          let c = null; if (e && e.hasAttribute('formAction')) {
            if (n = e, f = e[_l] || null) {
              c = f.formAction;
            } else if (Ni(n) !== null) {
              continue;
            }
          } else {
            c = f.action;
          } typeof c == 'function' ? u[a + 1] = c : (u.splice(a, 3), a -= 3), C1(u);
        }
      }
    }
  } function bd() {
    function l(e) {
      e.canIntercept && e.info === 'react-transition' && e.intercept({ handler() {
        return new Promise((f) => {
          return n = f;
        });
      }, focusReset: 'manual', scroll: 'manual' });
    } function t() {
      n !== null && (n(), n = null), a || setTimeout(u, 20);
    } function u() {
      if (!a && !navigation.transition) {
        const e = navigation.currentEntry; e && e.url != null && navigation.navigate(e.url, { state: e.getState(), info: 'react-transition', history: 'replace' });
      }
    } if (typeof navigation == 'object') {
      var a = !1; var n = null; return navigation.addEventListener('navigate', l), navigation.addEventListener('navigatesuccess', t), navigation.addEventListener('navigateerror', t), setTimeout(u, 100), function () {
        a = !0, navigation.removeEventListener('navigate', l), navigation.removeEventListener('navigatesuccess', t), navigation.removeEventListener('navigateerror', t), n !== null && (n(), n = null);
      };
    }
  } function Ci(l) {
    this._internalRoot = l;
  }Ve.prototype.render = Ci.prototype.render = function (l) {
    const t = this._internalRoot; if (t === null) {
      throw new Error(b(409));
    } const u = t.current; const a = Rl(); hd(u, a, l, t, null, null);
  }; Ve.prototype.unmount = Ci.prototype.unmount = function () {
    const l = this._internalRoot; if (l !== null) {
      this._internalRoot = null; const t = l.containerInfo; hd(l.current, 2, null, l, null, null), xe(), t[na] = null;
    }
  }; function Ve(l) {
    this._internalRoot = l;
  }Ve.prototype.unstable_scheduleHydration = function (l) {
    if (l) {
      const t = w1(); l = { blockedOn: null, target: l, priority: t }; for (var u = 0; u < Ct.length && t !== 0 && t < Ct[u].priority; u++) {
        ;
      }Ct.splice(u, 0, l), u === 0 && Sd(l);
    }
  }; const R1 = B1.version; if (R1 !== '19.2.3') {
    throw new Error(b(527, R1, '19.2.3'));
  } r.findDOMNode = function (l) {
    const t = l._reactInternals; if (t === void 0) {
      throw typeof l.render == 'function' ? new Error(b(188)) : (l = Object.keys(l).join(','), new Error(b(268, l)));
    } return l = fo(t), l = l !== null ? G1(l) : null, l = l === null ? null : l.stateNode, l;
  }; const Nh = { bundleType: 0, version: '19.2.3', rendererPackageName: 'react-dom', currentDispatcherRef: O, reconcilerVersion: '19.2.3' }; if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u' && (Ea = __REACT_DEVTOOLS_GLOBAL_HOOK__, !Ea.isDisabled && Ea.supportsFiber)) {
    try {
      tn = Ea.inject(Nh), Nl = Ea;
    } catch {}
  } let Ea; Le.createRoot = function (l, t) {
    if (!q1(l)) {
      throw new Error(b(299));
    } let u = !1; let a = ''; let n = yv; let e = vv; let f = dv; return t != null && (t.unstable_strictMode === !0 && (u = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (e = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = od(l, 1, !1, null, null, u, a, null, n, e, f, bd), l[na] = t.current, Mi(l), new Ci(t);
  }; Le.hydrateRoot = function (l, t, u) {
    if (!q1(l)) {
      throw new Error(b(299));
    } let a = !1; let n = ''; let e = yv; let f = vv; let c = dv; let i = null; return u != null && (u.unstable_strictMode === !0 && (a = !0), u.identifierPrefix !== void 0 && (n = u.identifierPrefix), u.onUncaughtError !== void 0 && (e = u.onUncaughtError), u.onCaughtError !== void 0 && (f = u.onCaughtError), u.onRecoverableError !== void 0 && (c = u.onRecoverableError), u.formState !== void 0 && (i = u.formState)), t = od(l, 1, !0, t, u ?? null, a, n, i, e, f, c, bd), t.context = md(null), u = t.current, a = Rl(), a = Qc(a), n = Qt(a), n.callback = null, xt(u, n, a), u = a, t.current.lanes = u, an(t, u), ut(t), l[na] = t.current, Mi(l), new Ve(t);
  }; Le.version = '19.2.3';
}); const Ad = $l((Vh, Ed) => {
  'use strict'; function Td() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function')) {
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Td);
      } catch (l) {
        console.error(l);
      }
    }
  }Td(), Ed.exports = zd();
}); const Od = $l((Ke) => {
  'use strict'; const Ch = Symbol.for('react.transitional.element'); const Rh = Symbol.for('react.fragment'); function _d(l, t, u) {
    let a = null; if (u !== void 0 && (a = `${u}`), t.key !== void 0 && (a = `${t.key}`), 'key' in t) {
      u = {}; for (const n in t) {
        n !== 'key' && (u[n] = t[n]);
      }
    } else {
      u = t;
    } return t = u.ref, { $$typeof: Ch, type: l, key: a, ref: t !== void 0 ? t : null, props: u };
  }Ke.Fragment = Rh; Ke.jsx = _d; Ke.jsxs = _d;
}); const mn = $l((Kh, Md) => {
  'use strict'; Md.exports = Od();
}); const Nd = bu(Ad()); const Dd = bu(bn()); const $ = bu(mn()); function Bh() {
  const l = window.openai; return l ? { toolResult: l.toolResult, widgetState: l.widgetState || {}, theme: l.theme || 'dark', displayMode: l.displayMode || 'inline', setWidgetState: l.setWidgetState.bind(l), callTool: l.callTool.bind(l), sendFollowUpMessage: l.sendFollowUpMessage.bind(l) } : (console.warn('OpenAI SDK not available - using fallback'), { toolResult: { structuredContent: { items: [], count: 0, category: 'Latest' } }, widgetState: {}, theme: 'dark', displayMode: 'inline', setWidgetState: () => {}, callTool: async () => {}, sendFollowUpMessage: () => {} });
} const pd = [{ slug: 'all', label: 'All' }, { slug: 'ai', label: 'AI' }, { slug: 'business', label: 'Business' }, { slug: 'design', label: 'Design' }, { slug: 'technology', label: 'Technology' }, { slug: 'productivity', label: 'Productivity' }]; function Ud() {
  const { toolResult: l, widgetState: t, theme: u, setWidgetState: a, callTool: n, sendFollowUpMessage: e } = Bh(); const [f, c] = (0, Dd.useState)(!1); const i = l?.structuredContent?.items || []; const d = l?.structuredContent?.category || 'Latest'; const s = l?.structuredContent?.total_duration_minutes || 0; const g = t?.selectedCategory || 'all'; const m = async (_) => {
    if (_ !== g) {
      c(!0); try {
        a({ ...t, selectedCategory: _ }), await n({ name: 'list_content', arguments: { category_slug: _ === 'all' ? void 0 : _, limit: 10 } }); const v = pd.find(y => y.slug === _)?.label || 'All'; e({ content: `Showing ${v} content` });
      } catch (v) {
        console.error('Failed to filter content:', v);
      } finally {
        c(!1);
      }
    }
  }; const h = () => {
    const _ = d === 'Latest' ? 'https://www.speasy.app/latest?autoplay=true' : `https://www.speasy.app/category/${d.toLowerCase()}?autoplay=true`; window.open(_, '_blank');
  }; const z = (_) => {
    window.open(`https://www.speasy.app/content/${_.id}`, '_blank');
  }; const T = u === 'dark'; return (0, $.jsxs)('div', { style: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: T ? '#fff' : '#000', background: T ? '#1a1a1a' : '#fff', borderRadius: '12px', overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }, children: [(0, $.jsxs)('div', { style: { padding: '16px 20px', borderBottom: `1px solid ${T ? '#333' : '#e5e5e5'}` }, children: [(0, $.jsxs)('h3', { style: { margin: 0, fontSize: '18px', fontWeight: 600, marginBottom: '4px' }, children: [d, ' Content'] }), (0, $.jsxs)('p', { style: { margin: 0, fontSize: '14px', color: T ? '#999' : '#666' }, children: [i.length, ' stories \u2022 ', s, ' min total'] })] }), (0, $.jsx)('div', { style: { padding: '12px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: `1px solid ${T ? '#333' : '#e5e5e5'}` }, children: pd.map(_ => (0, $.jsx)('button', { onClick: () => m(_.slug), disabled: f, style: { padding: '6px 12px', borderRadius: '16px', border: 'none', fontSize: '13px', fontWeight: 500, cursor: f ? 'not-allowed' : 'pointer', background: g === _.slug ? T ? '#fff' : '#000' : T ? '#333' : '#f0f0f0', color: g === _.slug ? T ? '#000' : '#fff' : T ? '#fff' : '#000', opacity: f ? 0.6 : 1, transition: 'all 0.2s' }, children: _.label }, _.slug)) }), (0, $.jsx)('div', { style: { padding: '12px 20px', maxHeight: '400px', overflowY: 'auto' }, children: f ? (0, $.jsx)('div', { style: { padding: '20px', textAlign: 'center', color: '#999' }, children: 'Loading...' }) : i.length === 0 ? (0, $.jsx)('div', { style: { padding: '20px', textAlign: 'center', color: '#999' }, children: 'No content available' }) : (0, $.jsx)('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: i.map(_ => (0, $.jsx)(qh, { item: _, isDark: T, onClick: () => z(_) }, _.id)) }) }), i.length > 0 && (0, $.jsx)('div', { style: { padding: '16px 20px', borderTop: `1px solid ${T ? '#333' : '#e5e5e5'}` }, children: (0, $.jsxs)('button', { onClick: h, style: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', background: T ? '#fff' : '#000', color: T ? '#000' : '#fff', transition: 'opacity 0.2s' }, onMouseEnter: _ => _.currentTarget.style.opacity = '0.9', onMouseLeave: _ => _.currentTarget.style.opacity = '1', children: ['\u25B6 Play All (', i.length, ' stories)'] }) })] });
} function qh({ item: l, isDark: t, onClick: u }) {
  const a = l.audio_files?.[0]?.duration ? Math.round(l.audio_files[0].duration / 60) : null; return (0, $.jsxs)('button', { onClick: u, style: { display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', border: 'none', background: t ? '#252525' : '#f9f9f9', cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left', width: '100%' }, onMouseEnter: n => n.currentTarget.style.background = t ? '#2a2a2a' : '#f0f0f0', onMouseLeave: n => n.currentTarget.style.background = t ? '#252525' : '#f9f9f9', children: [l.image_url && (0, $.jsx)('img', { src: l.image_url, alt: l.title, style: { width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 } }), (0, $.jsxs)('div', { style: { flex: 1, minWidth: 0 }, children: [(0, $.jsxs)('div', { style: { display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }, children: [l.category?.name && (0, $.jsx)('span', { style: { padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: t ? '#444' : '#e0e0e0', color: t ? '#fff' : '#000' }, children: l.category.name }), a && (0, $.jsxs)('span', { style: { fontSize: '12px', color: t ? '#999' : '#666' }, children: ['\u23F1\uFE0F ', a, ' min'] })] }), (0, $.jsx)('h4', { style: { margin: 0, fontSize: '14px', fontWeight: 600, color: t ? '#fff' : '#000', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }, children: l.title }), (0, $.jsx)('p', { style: { margin: 0, fontSize: '12px', color: t ? '#999' : '#666' }, children: l.source_name })] })] });
} const Cd = bu(mn()); document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', Hd) : Hd(); function Hd() {
  const l = document.getElementById('speasy-root'); l ? (0, Nd.createRoot)(l).render((0, Cd.jsx)(Ud, {})) : console.error('Speasy: Root element #speasy-root not found');
}
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
