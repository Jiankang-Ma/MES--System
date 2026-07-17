Array.prototype.at || (Array.prototype.at = function(t) {
        let e = this.length;
        if ((t |= 0) < 0 && (t += e), !(t < 0 || t >= e)) return this[t]
    }),
    /*!Sea.js 2.2.3|https://github.com/seajs/seajs/blob/master/LICENSE.md*/
    (t => {
        if (!t.s) {
            let r = t.s = {};
            let i, l, o = 0,
                s = /[^?#]*\//,
                d = /\/\.\//g,
                a = /\/[^/]+\/\.\.\//,
                n = /([^:/])\/\//g,
                h = t => t.match(s)[0],
                f = t => {
                    for (t = t.replace(d, "/"); t.match(a);) t = t.replace(a, "/");
                    return t = t.replace(n, "$1/")
                },
                p = /^\/\/.|:\//,
                g = /^.*?\/\/.*?\//,
                c = (t, e) => {
                    let r, i = t[0];
                    if (p.test(t)) r = t;
                    else if ("." === i) r = f((e ? h(e) : y) + t);
                    else if ("/" === i) {
                        let e = y.match(g);
                        r = e ? e[0] + t.substring(1) : t
                    } else r = b + t;
                    return r
                },
                u = (t, e) => c(t + ".js", e),
                $ = document,
                y = h($.URL),
                m = $.scripts,
                x = t => t.hasAttribute ? t.src : t.getAttribute("src", 4),
                _ = m[m.length - 1],
                b = h(x(_) || y),
                w = $.head,
                k = w.getElementsByTagName("base")[0],
                v = (t, e) => {
                    let r = $.createElement("script");
                    j(r, e), r.async = !0, r.src = t, i = r, k ? w.insertBefore(r, k) : w.appendChild(r), i = null
                },
                j = (t, e) => {
                    let r = () => {
                        t.onload = t.onerror = null, w.removeChild(t), t = null, e()
                    };
                    t.onload = t.onerror = r
                },
                L = {},
                S = {},
                z = {},
                A = {},
                C = 1,
                I = 2,
                T = 3,
                M = 4,
                P = 5,
                H = 6;

            function e(t, e = []) {
                this.uri = t, this.fx = e, this.fy = null, this.fz = 0, this.fA = {}, this.fB = 0
            }
            Object.assign(e.prototype, {
                fC() {
                    let t = this,
                        e = t.fx,
                        r = [];
                    for (let i = e.length; i--;) r[i] = u(e[i], t.uri);
                    return r
                }, fG() {
                    let t = this;
                    if (t.fz < T) {
                        t.fz = T;
                        let r, i = t.fC(),
                            l = t.fB = i.length;
                        for (let o = 0; o < l; o++) r = e.fD(i[o]), r.fz < M ? r.fA[t.uri] = (r.fA[t.uri] || 0) + 1 : t.fB--;
                        if (0 == t.fB) t.fE();
                        else {
                            let t = {};
                            for (let e = 0; e < l; e++) r = L[i[e]], r.fz < C ? r.fF(t) : r.fz == I && r.fG();
                            for (let e in t) t.hasOwnProperty(e) && t[e]()
                        }
                    }
                }, fE() {
                    let t = this;
                    t.fz = M, t.fH && t.fH();
                    let e, r, i = t.fA;
                    for (e in i) i.hasOwnProperty(e) && (r = L[e], r.fB -= i[e], 0 === r.fB && r.fE());
                    delete t.fA, delete t.fB
                }, fF(t) {
                    let r = this,
                        i = r.uri;
                    if (r.fz = C, !i || z[i]) r.fG();
                    else if (S[i]) A[i].push(r);
                    else {
                        S[i] = 1, A[i] = [r];
                        let o = () => {
                                delete S[i], z[i] = 1, l && (e.fI(i, l), l = null);
                                let t, r = A[i];
                                for (delete A[i]; t = r.shift();) t.fG()
                            },
                            s = () => {
                                v(i, o)
                            };
                        t ? t[i] = s : s()
                    }
                }, fJ() {
                    let t = this;
                    if (t.fz < P) {
                        t.fz = P;
                        let r = t.uri,
                            i = t => e.fD(u(t, r)).fJ(),
                            l = t.fK(i);
                        delete t.fK, t.fy = l, t.fz = H
                    }
                    return t.fy
                }
            }), r.d = (t, r, i) => {
                i || (i = r, r = []);
                let o = {
                    id: t,
                    uri: u(t),
                    deps: r,
                    f: i
                };
                o.uri ? e.fI(o.uri, o) : l = o
            }, e.fI = (t, r) => {
                let i = e.fD(t);
                i.fz < I && (i.id = r.id || t, i.fx = r.deps, i.fK = r.f, i.fz = I)
            }, e.fD = (t, r) => L[t] || (L[t] = new e(t, r)), r.use = (r, i) => {
                let l = y + "__hB_" + o++,
                    s = e.fD(l, r);
                s.fH = () => {
                    let e = [],
                        r = s.fC();
                    for (let t = 0, i = r.length; t < i; t++) e[t] = L[r[t]].fJ();
                    null == i || i.apply(t, e), delete s.fH
                }, s.fG()
            }, r.r = t => {
                let r = e.fD(u(t));
                return r.fz < P && (r.fE(), r.fJ()), r.fy
            }, r.rp = f
        }
    })(window), s.d("3l", (() => {
        let t = 0,
            e = "",
            r = [],
            i = null,
            l = window,
            o = Promise,
            d = document,
            a = l.setTimeout,
            n = encodeURIComponent,
            h = "$";

        function f() {}
        let p, g, c = JSON.stringify,
            u = d.head,
            $ = l.performance,
            y = $.now.bind($),
            m = "",
            x = "_",
            _ = (e = "_") => e + t++,
            b = t => d.getElementById(t),
            w = (t, e) => t.innerHTML = e,
            k = t => t[0] == m,
            v = {},
            j = {
                rootId: _(),
                retard: f,
                request: f,
                error(t) {
                    throw t
                }
            },
            L = t => !t || "object" != typeof t,
            S = (t, e, r, i) => {
                if (t && e && !(i = !r && t == e)) try {
                    i = 16 == (16 & e.compareDocumentPosition(t))
                } catch {}
                return i
            },
            z = (t, e, r, i) => {
                e ? (i = t["fx"]) && (i[e] = 0) : t["fx"] = 0
            },
            {
                assign: A,
                keys: C,
                hasOwnProperty: I,
                prototype: T
            } = Object,
            M = T.toString,
            P = t => M.call(t).slice(8, -1),
            H = t => "Object" == P(t),
            F = Array.isArray,
            W = u.getAttribute,
            B = (t, e) => W.call(t, e),
            q = (t, e, r) => {
                e && !q[t] && (q[t] = 1, r = d.createElement("style"), w(r, e), u.appendChild(r))
            },
            V = (t, e, r, i) => {
                try {
                    i = F(e) ? t.apply(r, e) : t.call(r, e)
                } catch (t) {
                    j.error(t)
                }
                return i
            },
            O = (t, e) => t && I.call(t, e),
            R = (t, r) => {
                let i, l;
                if (L(r)) i = r + e, k(i) && (r = t.get(i));
                else
                    for (i in r) l = r[i], l = R(t, l), r[i] = l;
                return r
            },
            N = (t, e) => e.fx - t.fx;

        function Y(t = 50, e = 20, r) {
            (r = this).fx = [], r.fy = e, r.fz = r.fy + t
        }
        A(Y.prototype, {
            get(t) {
                let e = this.fx[m + t];
                return e && (e.fx++, e = e.fy), e
            }, set(t, e) {
                let r = this,
                    i = r.fx,
                    l = m + t,
                    o = i[l],
                    s = r.fy;
                if (!o) {
                    if (i.length > r.fz)
                        for (i.sort(N); s--;) o = i.pop(), o.fx && r.del(o.fz);
                    o = {
                        fz: t
                    }, i.push(o), i[l] = o
                }
                o.fy = e, o.fx = 1
            }, del(t) {
                t = m + t;
                let r = this.fx,
                    i = r[t];
                i && (i.fx = 0, i.fy = e, delete r[t])
            }, has(t) {
                return O(this.fx, m + t)
            }
        });
        let X, U, E, D, K, J, G, Q, Z = {
                bubbles: !0,
                cancelable: !0
            },
            tt = (t, ...e) => t.addEventListener(...e),
            et = (t, ...e) => t.removeEventListener(...e),
            rt = (t, e, r, i, l, o) => {
                let s = {
                    fx: l,
                    fy: r,
                    fz: e,
                    fA: t,
                    fB(t) {
                        l ? V(r, t, o) : r(t)
                    }
                };
                X || (X = s), U && (U.fC = s), U = s, tt(t, e, s.fB, i)
            },
            it = (t, e, r, i, l) => {
                let o, s = X;
                for (; s;) {
                    if (s.fz == e && s.fx == l && s.fA == t && s.fy == r) {
                        et(t, e, s.fB, i), o && (o.fC = s.fC), X == s && (X = s.fC), U == s && (U = o);
                        break
                    }
                    o = s, s = s.fC
                }
            },
            lt = new Y,
            ot = (t, e = 1, r) => (e && lt.has(t) ? r = lt.get(t) : (r = V(Function(`return ${t}`)), e && lt.set(t, r)), r),
            st = decodeURIComponent,
            dt = new Y,
            at = t => {
                let r, i, l, o, s, d, a = dt.get(t);
                if (!a) {
                    if (o = {}, s = t.indexOf("?"), -1 == s ? (r = t, d = e) : (r = t.substring(0, s), d = t.substring(s + 1)), d)
                        for (s of d.split("&")) s && ([i, l = e] = s.split("="), o[st(i)] = k(l) ? l : st(l));
                    dt.set(t, a = {
                        a: r,
                        b: o
                    })
                }
                return {
                    path: a.a,
                    params: A({}, a.b)
                }
            },
            nt = new Y,
            ht = navigator.scheduling,
            ft = () => {
                let t, e, r, l = y() + 9,
                    o = j.retard;
                for (;;) {
                    if (!D) {
                        G = E = i, 0 != Q && o(Q = 0);
                        break
                    }
                    if (J == D && (J = i), K = D, r = D.fx, t = D.fy, e = D.fz, e && V(e, t, r), D = D.fA, K = i, D && (y() > l || (null == ht ? void 0 : ht.isInputPending()))) {
                        1 != Q && o(Q = 1), a(ft);
                        break
                    }
                }
            },
            pt = (t, e, r, i, l) => {
                l = {
                    fz: t,
                    fx: r,
                    fy: e
                }, i ? (G ? G.fA = l : D = l, G = l) : ((i = J || K) ? (l.fA = i.fA, i.fA = l, G == i && (G = l)) : D ? (l.fA = D, D = l) : D = G = l, J = l), E || (E = 1, a(ft))
            },
            gt = (t, e, r) => {
                pt(t, e, r, 1)
            },
            ct = 0,
            ut = (...t) => new o((async e => {
                let r = [];
                try {
                    let i = j.request;
                    ct || i(1), ct++, s.use(t, ((...t) => {
                        for (let e of t) r.push(e);
                        ct--, ct || i(0), e(r)
                    }))
                } catch (t) {
                    j.error(t)
                }
            })),
            $t = (t, e, r, i) => (f.prototype = e.prototype, i = new f, A(i, r), i.constructor = t, t.prototype = i, t),
            yt = t => t;
        let mt, xt = {
                fire(t, e = {}) {
                    let r = this,
                        i = r[m + t];
                    for (e.type = t; i;) V(i.fx, e, r), i = i.fy;
                    return e
                }, on(t, e, r = 0) {
                    let i, l = this,
                        o = m + t,
                        s = {
                            fx: e,
                            fz: r
                        },
                        d = l[o];
                    if (d) {
                        for (; d;) {
                            if (d.fz < r) {
                                s.fy = d, i ? i.fy = s : l[o] = s;
                                break
                            }
                            i = d, d = d.fy
                        }
                        d || (i.fy = s)
                    } else l[o] = s
                }, off(t, e, r = 0) {
                    let l = m + t,
                        o = this;
                    if (e) {
                        let t, i = o[l];
                        for (; i;) {
                            if (i.fx == e && i.fz == r) {
                                t ? t.fy = i.fy : o[l] = i.fy;
                                break
                            }
                            t = i, i = i.fy
                        }
                    } else o[l] = i
                }
            },
            _t = {},
            bt = (t, e, r, i) => {
                e.includes(m) && (i = _t[t]) && (R(i._i9, r), r[""] && (A(r, r[""]), delete r[""]))
            },
            wt = (t, e, r) => {
                let l, o;
                var s, d, a;
                e = e ? t._j_[r ? e : e.fy] : t.id, l = _t[e], l && (o = l.pId, jt(l), (d = _t[s = e]) && (delete _t[s], (a = d.root).fx = 0, a.fy = 0, d.id = d.root = d.pId = d._j_ = i), l = _t[o], O(null == l ? void 0 : l._j_, e) && (delete l._j_[e], l._ja = 0))
            },
            kt = (t, e, r, i, l, o, s) => {
                for ([r, s, i] of(e = t._jb, l = t._jc, e)) r && pt(i, (o = l[r]) && V(o, s, l));
                e.length = 0
            },
            vt = (t, e, r) => {
                let i, l, o;
                for (i in t._j_) e ? (l = _t[i], o = l && S(l.root, e, r)) : o = 1, o && wt(t, i, o)
            },
            jt = t => {
                let {
                    _jc: e,
                    root: r,
                    pId: i
                } = t;
                e && (t._jc = 0, e._jd && (e._jd = 0, z(e), vt(t), e.fire("destroy"), me(e, 1), r && t._je && e._jf && w(r, t._jg))), t._jh++
            },
            Lt = async(t, e, r) => {
                let i, l, o, s, d, {
                    id: a,
                    root: n,
                    pId: h
                } = t;
                !t._je && n && (t._je = 1, t._jg = n.innerHTML), jt(t), n && e && (i = at(e), o = i.path, t.path = e, s = i.params, bt(h, e, s), t._ji = o, A(s, r), l = t._jh, [d] = await ut(o), l == t._jh && d && (ve(d), o = new d(a, n, t, s), t._jc = o, me(o), V(o.init, s, o), V(o._jn, [s, t._jg], o), o._jo(), o._jf || o._jp || ye(o)))
            },
            St = t => t.fy || (t.fy = _());

        function zt(t, e) {
            let r = this,
                i = St(t);
            var l, o;
            r.id = i, r.root = t, r._jh = 1, r._j_ = {}, r.pId = e, r._jb = [], r._i9 = new Map, o = r, O(_t, l = i) || (_t[l] = o, o.root.fx = 1)
        }
        A(zt, {
            root: () => mt,
            all: () => _t,
            byNode: t => _t[null == t ? void 0 : t.fy]
        }), A(zt.prototype, {
            mount(t, e, r) {
                let i, l = this,
                    o = l.id,
                    s = l._j_,
                    d = St(t);
                return i = _t[d], i || (O(s, d) || (l._ja = 0), s[d] = d, i = new zt(t, o)), Lt(i, e, r), i
            }, unmount(...t) {
                wt(this, ...t)
            }, parent(t = 1, e) {
                for (e = this; e && t--;) e = _t[e.pId];
                return e
            }, invoke(t, ...e) {
                let r, i, l = this,
                    s = l._jb;
                return new o((o => {
                    (r = l._jc) && r._jp ? o((i = r[t]) && V(i, e, r)) : s.push([t, e, o])
                }))
            }
        });
        let At = new Y,
            Ct = /^([\w\-]+)(\d+)?()?([^(]+)\(([\s\S]*?)\)$/,
            It = {},
            Tt = {},
            Mt = {},
            Pt = {},
            Ht = {
                capture: !0,
                passive: !1
            },
            Ft = {
                capture: !0,
                passive: !0
            },
            Wt = {
                capture: !1,
                passive: !1
            },
            Bt = {
                capture: !1,
                passive: !0
            },
            qt = (t, l) => {
                let o, s, d, a, n, h, f, g, c, u = [],
                    $ = t,
                    y = B(t, "_" + l);
                if (y && (n = At.get(y), n || (n = y.match(Ct) || r, n = {
                    v: n[1],
                    b: 0 | n[2],
                    t: n[3],
                    n: n[4],
                    i: n[5]
                }, At.set(y, n)), n = A({}, n)), n && !n.v || Tt[l]) {
                    if (g = $.fz, g == i) {
                        for (f = [$]; $ != p && ($ = $.parentNode);) {
                            if (_t[s = $.fy] || (s = $.fz)) {
                                g = s;
                                break
                            }
                            f.push($)
                        }
                        for (y of f) y.fz = g || e
                    }
                    if ($ = t.fy, _t[$] && (c = g = $), g)
                        do {
                            if (o = _t[g], h = null == o ? void 0 : o._jc) {
                                if (d = h._jq, a = d[l], a)
                                    for ($ = a.length; $--;) s = a[$], d = {
                                        r: s,
                                        v: g,
                                        n: s
                                    }, s ? !c && t.matches(s) && u.push(d) : c && u.push(d);
                                if (h._jf && !c) break
                            }
                            c = 0
                        } while (o && (g = o.pId))
                }
                return n && u.push(n), u
            },
            Vt = t => {
                var e, r, i;
                let l, o, s, d, a, n, h, f, {
                        target: g,
                        type: c
                    } = t,
                    u = [];
                for (; g && g != p && !t.cancelBubble && (!(o = g.fA) || !o[c]);) {
                    if (f = 1, g.nodeType == f) {
                        if (l = qt(g, c), l.length)
                            for (n of(u.length = 0, l)) {
                                let {
                                    v: e,
                                    n: r,
                                    i: i,
                                    t: l,
                                    b: o
                                } = n;
                                0, s = _t[e], d = null == s ? void 0 : s._jc, d && d._jp && d._jd && (a = r + m + c, n = d[a], n && (t.eventTarget = g, h = i ? ($ = i, y = s._i9, x = void 0, nt.has($) ? x = nt.get($) : (x = ot($, 0), $.includes(m) ? R(y, x) : nt.set($, x)), x) : v, t.params = h, V(n, t, d)), g == d.root || d._jq[c] || (l ? f = o || f : (g = d.root, f = 0)))
                            } else u.push(g);
                        f && (s = _t[g.fy], (null === (i = null === (r = null === (e = null == s ? void 0 : s._jc) || void 0 === e ? void 0 : e.view) || void 0 === r ? void 0 : r._jr) || void 0 === i ? void 0 : i[c]) && (u.length = 0))
                    }
                    for (; f--;) g = g.parentNode
                }
                var $, y, x;
                for (g of u) o = g.fA || (g.fA = {}), o[c] = 1
            },
            Ot = (t, e, r, i) => {
                let l = 0 | It[t],
                    o = Pt[t] || (Pt[t] = {}),
                    s = r ? -1 : 1,
                    d = r ? it : rt;
                4 & i && (o[4] = (0 | o[4]) + s), 8 & i && (o[8] = (0 | o[8]) + s), 1 & i && (o[1] = (0 | o[1]) + s), 2 & i && (o[2] = (0 | o[2]) + s);
                let a, n = Mt[t];
                a = o[2] ? o[4] ? Ht : Wt : o[4] ? Ft : Bt, l && r !== l ? a != n && (it(p, t, Vt, n), rt(p, t, Vt, a)) : d(p, t, Vt, r ? n : a), Mt[t] = a, It[t] = l + s, e && (Tt[t] = (0 | Tt[t]) + s)
            };
        let Rt = {
                "&": 38,
                "<": 60,
                ">": 62,
                '"': 34,
                "'": 39,
                "`": 96
            },
            Nt = /[&<>"'\`]/g,
            Yt = t => `&#${Rt[t]};`,
            Xt = t => (t + e).replace(Nt, Yt),
            Ut = {
                "!": 1,
                "'": 7,
                "(": 8,
                ")": 9,
                "*": "A"
            },
            Et = t => "%2" + Ut[t],
            Dt = /[!')(*]/g,
            Kt = t => n(t).replace(Dt, Et),
            Jt = /[\\'"]/g,
            Gt = t => (t + e).replace(Jt, "\\$&"),
            Qt = (t, e, r) => (t.has(e) ? r = t.get(e) : (r = m + (r || t.fx++), t.has(r) || (t.set(e, r), t.set(r, e))), r),
            Zt = (t, e) => {
                if (t._jd && (e = t._jf)) {
                    let i, l, {
                            _js: o,
                            id: s,
                            _jl: d,
                            root: a
                        } = t,
                        n = _t[s],
                        h = {
                            fx: [],
                            fy: [],
                            fz: 0
                        },
                        f = n._i9;
                    t._jt = 0, t._js = {}, f.fx = 0, f.clear(), l = e(d, te, s, Kt, f, Qt, Gt, F), i = () => {
                        if (t._jd) {
                            for (l of(t._ju = l, (e = h.fA || !t._jp) && pt(ye, t), h.fx)) pt(l._jo, r, l);
                            if (t._jv > 1) t._jv = 1, h.fy.length = 0, pt(Zt, t);
                            else {
                                for ([l, s, f] of(t._jv = 0, h.fy)) l[s] != f && (l[s] = f);
                                for (l of(o = t._jw, o)) l();
                                o.length = 0
                            }
                        }
                    }, pt(fe, [a, t._ju, l, h, n, o, t, i])
                }
            },
            te = (t, r, l, o) => {
                let s;
                if (t) {
                    r = r || v;
                    let d, a, n, f, p, g, c = e,
                        u = 1 == l,
                        $ = o,
                        y = o,
                        _ = 0,
                        b = `<${t}`,
                        w = e,
                        k = 0;
                    if (l && 1 != l)
                        for (n of l) {
                            if (n.fy) a = n.fy + (n.fz ? "/>" : `>${n.fA}</${n.fB}>`);
                            else if (a = n.fA, n.fB == ee) {
                                if (!a) continue;
                                a = Xt(a)
                            }
                            w += a, g && n.fB == ee && g.fB == ee ? g.fA += n.fA : (n.fC && (f || (f = {}), f[n.fC] = (f[n.fC] || 0) + 1, _++), $ = $ || n.fD, g = n, p || (p = []), p.push(n))
                        }
                    for (d in o = o || v, r) a = r[d], !1 !== a && a != i ? (!0 === a && (r[d] = a = o[d] ? a : e), "__" != d && "id" != d && d != h || c || (c = a, "id" == d) ? (d == x && a && (k = at(a).path, c || (c = t + m + k)), "value" == d && o._ ? w = a : "$$" == d ? ($ = a, delete r[d]) : b += ` ${d}="${a&&Xt(a)}"`) : delete r[d]) : o[d] || delete r[d];
                    s = {
                        fA: w,
                        fC: c,
                        fB: t,
                        fE: k,
                        fD: $,
                        fF: o,
                        fG: y,
                        fy: b,
                        fH: r,
                        fI: p,
                        fJ: f,
                        fK: _,
                        fz: u
                    }
                } else s = {
                    fB: l ? m : ee,
                    fA: r + e
                };
                return s
            };
        let ee = t;
        let re = "http://www.w3.org/",
            ie = {
                svg: `${re}2000/svg`,
                math: `${re}1998/Math/MathML`
            },
            le = (t, r, i, l) => {
                var o;
                let s, d, a, n, h, f = 0,
                    p = r.fF,
                    g = r.fH;
                if (l)
                    for (s in a = l.fF, n = l.fH, n) O(g, s) || (f = 1, (h = a[s]) ? i ? i.fy.push([t, h, e]) : t[h] = e : t.removeAttribute(s));
                for (s in g) d = null !== (o = g[s]) && void 0 !== o ? o : e, (h = p[s]) ? l && t[h] == d || (f = 1, i ? i.fy.push([t, h, d]) : t[h] = d) : l && n[s] == d || (f = 1, t.setAttribute(s, d));
                return f
            },
            oe = (t, e, r) => {
                let i, l = t.fB;
                return l == ee ? i = d.createTextNode(t.fA) : (i = d.createElementNS(ie[l] || e.namespaceURI, l), le(i, t, r), w(i, t.fA)), i
            },
            se = (t, e, r, i, l) => {
                let o, s, d, a = {};
                for (o = i; o >= r; o--, l--) s = t[o], d = s.fC, d && (s = a[d] || (a[d] = []), s.push(e[l]));
                return a
            },
            de = (t, e) => t.fC && e.fC == t.fC || !t.fC && !e.fC && t.fB == e.fB || t.fB == m || e.fB == m,
            ae = (t, e, r, i) => {
                r && ((i = _t[t.fy]) ? wt(i) : vt(e, t))
            },
            ne = (t, e, r, i, l, o) => {
                l._jd && (ae(t, r, 1 == t.nodeType), e.removeChild(t), --i.fz || pt(o))
            },
            he = (t, e, r, i, l, o, s, d) => {
                l._jd && (e.fB == m ? (vt(s, t), w(t, e.fA)) : t.insertBefore(oe(e, t, o), r[i]), --o.fz || pt(d))
            },
            fe = (t, l, o, s, d, a, n, h) => {
                if (n._jd)
                    if (l) {
                        if (l.fD || l.fA != o.fA) {
                            let f, p, g, c, u, $ = l.fI || r,
                                y = o.fI || r,
                                x = o.fJ || v,
                                _ = o.fK,
                                b = l.fK,
                                k = t.childNodes,
                                j = 0,
                                L = y.length,
                                S = $.length - 1,
                                z = 0,
                                A = L - 1,
                                C = (t, e) => {
                                    if (x[t.fC] && (x[t.fC]--, _--), p = u && u[t.fC], p)
                                        for (f = p.length; f--;)
                                            if (p[f] == e) {
                                                p[f] = i;
                                                break
                                            }
                                };
                            let I, T = $[j],
                                M = $[S],
                                P = y[z],
                                H = y[A],
                                F = j,
                                W = S;
                            for (; j <= S && z <= A;)
                                if (T)
                                    if (M)
                                        if (de(P, T)) p = k[F], P.fB == m || T.fB == m ? (s.fA = 1, vt(d, t), P.fB == m ? (W = 0, w(t, P.fA)) : (w(t, e), t.appendChild(oe(P, t, s)))) : (s.fz++, pt(pe, [p, t, T, P, s, d, a, n, h])), C(T, p), F++, T = $[++j], P = y[++z];
                                        else if (de(H, M)) p = k[W], s.fz++, pt(pe, [p, t, M, H, s, d, a, n, h]), C(M, p), W--, M = $[--S], H = y[--A];
                            else if (de(H, T)) p = k[F], t.insertBefore(p, k[W + 1]), s.fz++, pt(pe, [p, t, T, H, s, d, a, n, h]), C(T, p), W--, T = $[++j], H = y[--A];
                            else if (de(P, M)) p = k[W], t.insertBefore(p, k[F++]), s.fz++, pt(pe, [p, t, M, P, s, d, a, n, h]), C(M, p), M = $[--S], P = y[++z];
                            else {
                                for (!u && _ > 0 && b > 0 && (u = se($, k, j, S, W)), I = k[F], p = u && u[P.fC], c = i; p && p.length && !(c = p.pop()););
                                if (c) {
                                    if (g = T, c != I) {
                                        for (p = j + 1, f = F + 1; p <= S; p++) {
                                            if (g = $[p], g && k[f++] == c) {
                                                $[p] = i;
                                                break
                                            }
                                            0
                                        }
                                        j--, t.insertBefore(c, I)
                                    }
                                    x[g.fC] && x[g.fC]--, s.fz++, pt(pe, [c, t, g, P, s, d, a, n, h])
                                } else u && u[T.fC] && x[T.fC] || _t[I.fy] && !P.fE ? (s.fA = 1, t.insertBefore(oe(P, t, s), I), j--, W++) : (s.fz++, pt(pe, [I, t, T, P, s, d, a, n, h]));
                                ++F, T = $[++j], P = y[++z]
                            } else M = $[--S];
                            else T = $[++j];
                            for (f = z, p = 1; f <= A; f++, p++) g = y[f], s.fA = 1, s.fz++, pt(he, [t, g, k, W + p, n, s, d, h]);
                            for (!L && T && T.fB == m && (W = k.length - 1), f = W; f >= F; f--) s.fA = 1, s.fz++, pt(ne, [k[f], t, d, s, n, h])
                        }
                    } else s.fA = 1, w(t, o.fA);
                s.fz || pt(h)
            },
            pe = (t, e, r, i, l, o, s, d, a) => {
                if (d._jd) {
                    let n = r.fH,
                        h = i.fH;
                    if (r.fD || r.fy != i.fy || r.fA != i.fA)
                        if (r.fB == i.fB) {
                            if (r.fB == ee) l.fA = 1, t.nodeValue = i.fA;
                            else if (!n.$ || n.$ != h.$) {
                                let e, n, f, p, g, c, u, $ = h._,
                                    y = i.fA,
                                    m = r.fy != i.fy || i.fG,
                                    x = _t[t.fy],
                                    _ = $ && at($);
                                if (m && (m = le(t, i, l, r), m && (l.fA = 1)), $ && x && x._ji == _.path && (p = x._jc)) {
                                    if (c = y != r.fA, u = $ != x.path, f = i.fD, !c && !u && f)
                                        for (f of(g = f.split(","), g))
                                            if ("#" == f || O(s, f)) {
                                                u = 1;
                                                break
                                            }
                                    e = !p._jf, (u || c) && (f = p._jn, g = _.params, bt(h._5, $, g), x.path = $, x._jg = y, !1 !== V(f, [g, y], p) && l.fx.push(p))
                                } else e = 1, n = x;
                                n && (l.fA = 1, wt(x)), e && !i.fz && fe(t, r, i, l, o, s, d, a)
                            }
                        } else l.fA = 1, ae(t, o, 1), e.replaceChild(oe(i, e, l), t)
                }--l.fz || pt(a)
            },
            ge = {},
            ce = A({
                get: t => t ? ge[t] : ge,
                set(t) {
                    A(ge, t)
                }
            }, xt),
            ue = /^(\$?)([^<]*)<([^>]+)>(?:\s*&(.+))?$/,
            $e = (t, e, r) => (t.fx ? r = t : ((r = function(t, e) {
                for (e of r.fx) V(e, t, this)
            }).fx = [t], r.fy = 1), r.fx = r.fx.concat(e.fx || e), r),
            ye = t => {
                let e, r;
                t._jd && (r = t._jp, t._jp = 1, e = t.owner, ((t, e, r) => {
                    for (r of(e = e || t.root).querySelectorAll(`[_][_5=${t.id}]`)) r.fx || t.mount(r, B(r, x))
                })(e), r || pt(kt, e))
            },
            me = (t, e) => {
                let r, {
                    _jr: i,
                    _jq: l,
                    _jx: o,
                    id: s
                } = t;
                for (r in i) Ot(r, l[r], e, i[r]);
                for (r of(i = e ? it : rt, o)) i(r.fx, r.fy, r.fz, r.fA, s, t)
            },
            xe = {
                win: l,
                doc: d,
                root: e
            };

        function _e(...t) {
            return A(this, ...t), this
        }

        function be(...t) {
            let e = this,
                r = e.fx || (e.fx = []);
            return ((t, e, r) => {
                let i, l, o, s, d = {};
                for (l of t)
                    for (i in l) o = l[i], s = d[i], "ctor" != i ? (ue.test(i) && (s ? o = $e(s, o) : o.fy = 1), d[i] = o) : r.push(o);
                for (i in d) O(e, i) || (e[i] = d[i])
            })(t, e.prototype, r), e
        }
        let we = t => function(...e) {
                return this._jd && V(t, e, this)
            },
            ke = (t, e, r, i) => {
                if (t)
                    for (i of t) V(i, e, r)
            };
        let ve = t => {
            if (!t[""]) {
                t[""] = 1;
                let r, l, o, s, d, a, n, h, f, p, g, c = t.prototype,
                    u = {},
                    $ = [],
                    y = {};
                for (n in c)
                    if (r = c[n], l = n.match(ue), l)
                        for (h of([, a, o, s, g] = l, p = g ? ot(g) : Bt, s = s.split(","), s)) {
                            if (d = xe[o], f = 0, p.passive || p.passive == i ? f |= 1 : f |= 2, p.capture ? f |= 4 : f |= 8, a) {
                                if (d) {
                                    $.push({
                                        fz: r,
                                        fx: d,
                                        fy: h,
                                        fA: p
                                    });
                                    continue
                                }
                                d === e && (o = e), d = y[h], d || (d = y[h] = []), d[o] || (d[o] = 1, d.push(o))
                            }
                            u[h] |= f, h = o + m + h, d = c[h], d ? d.fy && (r.fy ? c[h] = $e(r, d) : O(c, n) && (c[h] = r)) : c[h] = r
                        }
                    c._jo != c.render && (c._jo = c.render = we(c.render)), c._jr = u, c._jx = $, c._jq = y, c._jn = c.assign, c._jf = c.tmpl
            }
        };

        function je(t, e, r, i, l) {
            (l = this).root = e, l.owner = r, l.id = t, l._jd = 1, l._jt = 1, l._jl = {}, l._js = {}, l._jv = 0, l._jw = [], ke(je.fx, i, l)
        }

        function Le() {
            this.id = _("b"), this.fx = {}
        }
        A(je, {
            merge: be,
            extend: function t(e = {}) {
                let r = this,
                    i = e.ctor;

                function l(t, e, o, s, d) {
                    r.call(d = this, t, e, o, s), i && V(i, s, d), ke(l.fx, s, d)
                }
                return l.merge = be, l.extend = t, l.static = _e, $t(l, r, e)
            }
        }), A(je.prototype, xt, {
            init: f,
            render: f,
            assign: f,
            get(t, e) {
                return e = this._jl, t && (e = e[t]), e
            },
            set(t) {
                let e, r, i, l, o = this,
                    s = o._jl,
                    d = o._js,
                    a = o._jt;
                for (i in t) e = t[i], r = s[i], l = !L(e) || r != e, l && (d[i] = 1, a = 1), s[i] = e;
                return o._jt = a, o
            },
            digest(t) {
                return t = this.set(t), new o((e => {
                    t._jt ? (t._jv++, t._jw.push(e), 1 == t._jv && pt(Zt, t)) : t._jv ? t._jw.push(e) : e()
                }))
            },
            finale() {
                let t = this;
                return new o((e => {
                    t._jv ? t._jw.push(e) : e()
                }))
            }
        }), A(Le.prototype, {
            get(t, r) {
                return ((t, r, i) => {
                    if (t) {
                        let r, l = F(t) ? t.slice() : (t + e).split(".");
                        for (;
                            (r = l.shift()) && i;) i = i[r];
                        r && (i = g)
                    }
                    let l;
                    return r !== g && (l = P(r)) != P(i) && (i = r), i
                })(t, r, this.fx)
            }, set(t) {
                A(this.fx, t)
            }
        });
        let Se = (t, e, r) => i => {
                if (r = t[e]) {
                    delete t[e];
                    for (let t of r) V(t, i, r.fx)
                }
            },
            ze = (t, e, r, l, o) => {
                if (t.fx) return t;
                if (t.fy) return t.enqueue(ze.bind(t, t, e, r, l, o));
                t.fy = 1, F(e) || (e = [e]);
                let s = t.constructor,
                    d = 0,
                    a = s.fz,
                    n = ((t, e, r, l, o, s) => {
                        let d = [],
                            a = i,
                            n = 0;
                        return (h, f, p) => {
                            let g;
                            n++;
                            let c, u = h.fy,
                                $ = u.fx;
                            if (d[f + 1] = h, p ? (a = p, g = 1) : s.has($) || ($ && s.set($, h), u.fy = y(), c = u.fz, c && V(c, h, h), g = 1), !r.fx) {
                                let e = n == l;
                                e && (r.fy = 0, 2 == o && (d[0] = a, V(t, d, r))), 1 == o && V(t, [p || i, h, e, f], r)
                            }
                            g && e.fire("end", {
                                bag: h,
                                error: p
                            })
                        }
                    })(r, s, t, e.length, l, s.fA);
                for (let t of e)
                    if (t) {
                        let e, [r, i] = s.get(t, o),
                            l = r.fy.fx,
                            h = n.bind(r, r, d++);
                        l && a[l] ? a[l].push(h) : i ? (l && (e = [h], e.fx = r, a[l] = e, h = Se(a, l)), s.fB(r, h)) : h()
                    }
                return t
            };

        function Ae() {
            this.id = _("s"), this.fC = []
        }
        A(Ae.prototype, {
            all(t, e) {
                return ze(this, t, e, 2)
            }, save(t, e) {
                return ze(this, t, e, 2, 1)
            }, one(t, e) {
                return ze(this, t, e, 1)
            }, enqueue(t) {
                let e = this;
                return e.fx || (e.fC.push(t), e.dequeue(e.fD)), e
            }, dequeue(...t) {
                let e, r = this;
                r.fy || r.fx || (r.fy = 1, a((() => {
                    r.fy = 0, r.fx || (e = r.fC.shift(), e && V(e, r.fD = t))
                })))
            }, destroy(t) {
                (t = this).fx = 1, t.fC = 0
            }
        });
        let Ce = (t, e) => [c(e), c(t)].join(m),
            Ie = A({
                add(t) {
                    let e, r = this.fE;
                    for (e of(F(t) || (t = [t]), t))
                        if (e) {
                            let {
                                name: t,
                                cache: i
                            } = e;
                            e.cache = 0 | i, r[t] = e
                        }
                }, create(t) {
                    let e = this.meta(t),
                        r = 0 | t.cache || e.cache,
                        i = new Le;
                    i.set(e), i.fy = {
                        fz: e.after,
                        fx: r && Ce(e, t)
                    }, H(t) && i.set(t);
                    let l = e.before;
                    return l && V(l, i, i), this.fire("begin", {
                        bag: i
                    }), i
                }, meta(t) {
                    return this.fE[t.name || t] || t
                }, get(t, e) {
                    let r, i, l = this;
                    return e || (r = l.cached(t)), r || (r = l.create(t), i = 1), [r, i]
                }, cached(t) {
                    let e, r, i = this,
                        l = i.fA,
                        o = i.meta(t),
                        s = 0 | t.cache || o.cache;
                    if (s && (r = Ce(o, t)), r) {
                        let t = i.fz[r];
                        t ? e = t.fx : (e = l.get(r), e && y() - e.fy.fy > s && (l.del(r), e = 0))
                    }
                    return e
                }
            }, xt);
        Ae.extend = (t, e, r) => {
            function i() {
                Ae.call(this)
            }
            return i.fB = t, i.fA = new Y(e, r), i.fz = {}, i.fE = {}, A(i, Ie), $t(i, Ae)
        };
        let Te = 0;
        return {
            version: "5.1.0",
            config(t, ...e) {
                let r = j;
                return t && (r = H(t) ? A(r, t, ...e) : r[t]), r
            },
            boot(t) {
                var e, r;
                Te || (Te = 1, A(j, t), Lt((mt || (p = d.body, e = j.rootId, (r = b(e)) || (r = p), mt = new zt(r)), mt), j.defaultView))
            },
            unboot() {
                Te && (Te = 0, mt && (wt(mt), mt = i))
            },
            HIGH: 1e3,
            LOW: -1e3,
            isObject: H,
            isArray: F,
            isFunction: t => "Function" == P(t),
            isString: t => "String" == P(t),
            isNumber: t => "Number" == P(t),
            isPrimitive: L,
            isNumeric: t => !isNaN(parseFloat(t)) && isFinite(t),
            attach: tt,
            detach: et,
            now: y,
            mix: A,
            toMap: (t, e) => {
                let r, i = {};
                if (t)
                    for (r of t) i[e && r ? r[e] : r] = e ? r : 1 + (0 | i[r]);
                return i
            },
            toTry: V,
            toUrl: (t, r, i) => {
                let l, o, s, d = [];
                for (o in r) l = r[o] + e, (l || O(i, o)) && (l = n(l), d.push(s = o + "=" + l));
                return s && (t += (t && (t.includes("?") ? "&" : "?")) + d.join("&")), t
            },
            parseUrl: at,
            guid: _,
            use: ut,
            dispatch: (t, e, r) => {
                let i = new Event(e, Z);
                return A(i, r), t.dispatchEvent(i), i
            },
            guard: yt,
            type: P,
            has: O,
            inside: S,
            applyStyle: q,
            Cache: Y,
            View: je,
            Vframe: zt,
            State: ce,
            Service: Ae,
            Event: xt,
            mark: (t, e, r, i, l) => (0 != t[l = "fx"] && (r = t[l] || (t[l] = {}), O(r, e) || (r[e] = y()), i = ++r[e]), r => (r = t[l]) && i === r[e]),
            keys: C,
            unmark: z,
            node: b,
            task: pt,
            lowTask: gt,
            taskFinale: () => new o(pt),
            lowTaskFinale: () => new o(gt),
            delay: t => new o((e => a(e, t)))
        }
    })),
    /*!report-desinger|https://github.com/xinglie|402*/
    (() => {
        let t = document.currentScript.src.replace(/\/[^\/]+$/, "/"),
            e = document.body,
            r = t => (r._rO || (r._rO = new Promise((e => {
                s.use(["3l", "41/3i", "42/43"], (({
                    applyStyle: r,
                    config: i,
                    View: l
                }, o, s) => {
                    r("rd-fy", "@font-face{font-family:rd-fx;src:url('//at.alicdn.com/t/a/font_890516_pw1tcgujid.woff2?t=1660288269389') format('woff2'),url('//at.alicdn.com/t/a/font_890516_pw1tcgujid.woff?t=1660288269389') format('woff'),url('//at.alicdn.com/t/a/font_890516_pw1tcgujid.ttf?t=1660288269389') format('truetype')}:root{--rd-fx:#fa742b;--rd-fy:#fcaf85;--rd-fz:#fdc6a8;--rd-fA:#f96412;--rd-fB:#ec5706;--rd-fC:#e25305;--rd-fD:rgba(250, 116, 43, 0.05);--rd-fE:rgba(250, 116, 43, 0.1);--rd-fF:rgba(250, 116, 43, 0.2);--rd-fG:rgba(250, 116, 43, 0.3);--rd-fH:rgba(250, 116, 43, 0.6);--rd-fI:#ffffff;--rd-fJ:rgba(255, 255, 255, 0.15);--rd-fK:rgba(255, 255, 255, 0.6);--rd-fL:#dddb}.rd-fx{font:400 normal normal 16px/1 rd-fx;display:inline-block;position:relative}.rd-fy{all:initial;display:block;box-sizing:border-box;font-size:14px;line-height:1.5;font-family:Arial,sans-serif;color:#333}.rd-fy *{box-sizing:inherit}.rd-fy :after,.rd-fy :before{box-sizing:inherit}.rd-fy ::-moz-placeholder{color:#999}.rd-fy ::placeholder{color:#999}.rd-fy ::-moz-selection{background:var(--rd-fF)}.rd-fy ::selection{background:var(--rd-fF)}.rd-fz *{cursor:inherit!important}.rd-fA{margin:0}.rd-fB,.rd-fC{font-size:100%;-webkit-appearance:none;-moz-appearance:none;appearance:none;caret-color:var(--rd-fx);display:inline-block;height:22px;padding:1px 4px;border-radius:2px;box-sizing:border-box;box-shadow:none;border:1px solid #e6e6e6;background:#fff;width:140px;max-width:100%;outline:0}.rd-fB:hover,.rd-fC:hover{border-color:#ccc}.rd-fB:focus,.rd-fC:focus,.rd-fD{outline:0;border-color:var(--rd-fx)}.rd-fC{height:auto;resize:none;padding:3px 4px;font-family:Arial,sans-serif;line-height:1.5}.rd-fE{outline:0}.rd-fB[disabled],.rd-fC[disabled]{background:#f5f5f5;cursor:not-allowed;color:#999}.rd-fB:-moz-placeholder,.rd-fC:-moz-placeholder{color:#a9a9a9;opacity:1}.rd-fB:-moz-focus-inner{border-style:none;padding:0}.rd-fB[disabled]:hover,.rd-fC[disabled]:hover{cursor:not-allowed;border-color:#e6e6e6}.rd-fD:hover{border-color:var(--rd-fx)}.rd-fF{display:inline-block;vertical-align:middle;background-image:none;background-color:#ccc;white-space:nowrap;padding:3px 14px;font-size:14px;line-height:1;border:1px solid #0000;border-radius:2px;-webkit-user-select:none;-moz-user-select:none;user-select:none}.rd-fG{font-weight:400}.rd-fF:focus,.rd-fF:hover{background:#bbb}.rd-fH{background:var(--rd-fx);color:var(--rd-fI)}.rd-fH:focus,.rd-fH:hover{background:var(--rd-fA);color:var(--rd-fI)}.rd-fF[disabled]{background:#f5f5f5;border-color:#e6e6e6;color:#999;cursor:not-allowed}.rd-fF[disabled]:hover{border-color:#e6e6e6;color:#999}.rd-fH[disabled]{background:var(--rd-fG);color:var(--rd-fI);border-color:#0000}.rd-fH[disabled]:hover{color:var(--rd-fI);border-color:#0000}.rd-fF:-moz-focus-inner{border-style:none;padding:0}.rd-fI{padding:8px 25px;border-bottom:1px solid rgba(230,230,230,.4);line-height:1.5}.rd-fJ{height:10px;margin-top:10px;top:28px;box-shadow:0 0 6px #ccc}.rd-fK{line-height:14px}.rd-fL{line-height:24px}.rd-fM{padding:18px 25px}.rd-fN{height:10px;bottom:28px;margin-bottom:10px;box-shadow:0 0 6px #ccc}.rd-fO{padding:8px 25px;border-top:1px solid rgba(230,230,230,.4);min-height:40px}.rd-fP{margin-bottom:-20px}.rd-fQ,.rd-fR:after,.rd-fR:before{content:'';width:14px;height:14px;background:#ccc;-webkit-animation:rd-fx 1s infinite ease-in-out both;animation:rd-fx 1s infinite ease-in-out both}.rd-fR:before{-webkit-animation-delay:-.32s;animation-delay:-.32s}.rd-fQ{-webkit-animation-delay:-.16s;animation-delay:-.16s}@-webkit-keyframes rd-fx{0%,100%,80%{transform:scale(0)}40%{transform:scale(1)}}@keyframes rd-fx{0%,100%,80%{transform:scale(0)}40%{transform:scale(1)}}.rd-fS{display:inline-block}.rd-fT{list-style-type:none;list-style-image:none}.rd-fU{color:var(--rd-fx);text-decoration:none}.rd-fU:focus,.rd-fU:hover{color:var(--rd-fC)}.rd-fU:active,.rd-fU:focus,.rd-fU:hover,.rd-fU:visited{outline:0}.rd-fV{border-style:none;height:auto;vertical-align:top}.rd-fW{margin-right:2px}.rd-fX{margin-left:5px}.rd-fY{transform:rotate(180deg)}.rd-fZ{transform:rotate(90deg)}.rd-f0{transform:rotate(270deg)}.rd-f1{margin-bottom:10px}.rd-f2{margin-left:10px}.rd-f3::after{content:' ';display:block;clear:both}.rd-f4{padding-left:4px}.rd-f5{padding-right:4px}.rd-f6{padding-left:10px}.rd-f7{margin:2px}.rd-f8{margin-right:5px}.rd-f9{margin-right:10px}.rd-g_{background:var(--rd-fx)}.rd-ga{background:var(--rd-fE)}.rd-gb{background:var(--rd-fF)}.rd-gc{background:var(--rd-fG)}.rd-gd{background:var(--rd-fH)}.rd-ge{color:var(--rd-fI)}.rd-gf{background:var(--rd-fI)}.rd-gg{color:var(--rd-fK)}.rd-gh{background:#fff}.rd-gi{background:var(--rd-fy)}.rd-gj{background:var(--rd-fz)}.rd-gk{background:#f5f5f5}.rd-gl{background:#e6e6e6}.rd-gm{background:#bbb}.rd-gn{width:100%}.rd-go{height:100%}.rd-gp{max-width:100%}.rd-gq{max-height:100%}.rd-gr{text-align:right}.rd-gs{text-align:center}.rd-gt{float:left}.rd-gu{float:right}.rd-gv{position:absolute}.rd-gw{position:relative}.rd-gx{position:fixed}.rd-gy{pointer-events:all}.rd-gz{pointer-events:none}.rd-gA{margin:30px 0}.rd-gB{display:block}.rd-gC{display:inline-block}.rd-gD{display:contents}.rd-gE{-webkit-user-select:none;-moz-user-select:none;user-select:none}.rd-gF{scrollbar-color:var(--rd-fx) #0000}.rd-gF::-webkit-scrollbar{height:4px;width:4px}.rd-gF::-webkit-scrollbar-corner{height:4px;width:4px}.rd-gF::-webkit-scrollbar-thumb{background:var(--rd-fx);border-radius:2px}.rd-gF::-webkit-scrollbar-thumb:hover{background:var(--rd-fB)}.rd-gG{scroll-behavior:smooth}.rd-gH{scrollbar-width:thin}.rd-gH::-webkit-scrollbar{height:2px;width:2px}.rd-gH::-webkit-scrollbar-corner{height:2px;width:2px}.rd-gI{white-space:nowrap;word-wrap:normal;overflow:hidden;text-overflow:ellipsis}.rd-gJ{height:1px;margin:5px 0;background:linear-gradient(to right,#0000,#7d768454 50%,#0000)}.rd-gK{flex:1}.rd-gL{display:flex}.rd-gM{display:grid}.rd-gN{flex-direction:column}.rd-gO{flex-shrink:0}.rd-gP{align-items:center}.rd-gQ{transform:scaleX(-1)}.rd-gR{transform:scaleY(-1)}.rd-gS{position:-webkit-sticky;position:sticky}.rd-gT{top:0}.rd-gU{margin-bottom:4px}.rd-gV{margin-top:4px}.rd-gW{margin-top:-20px}.rd-gX{margin:0 2px}.rd-gY{width:1px}.rd-gZ{width:4px}.rd-g0{width:50px}.rd-g1{width:60px}.rd-g2{width:80px}.rd-g3{width:140px}.rd-g4{width:222px}.rd-g5{height:1px}.rd-g6{height:4px}.rd-g7{height:26px}.rd-g8{height:100px}.rd-g9{justify-content:space-between}.rd-h_{justify-content:center}.rd-ha{justify-content:flex-end}.rd-hb{justify-items:center}.rd-hc{flex-wrap:wrap}.rd-hd{cursor:pointer}.rd-he{cursor:move}.rd-hf{cursor:default}.rd-hg{cursor:text}.rd-hh{cursor:ew-resize}.rd-hi{cursor:ns-resize}.rd-hj{word-break:break-all}.rd-hk{word-break:keep-all}.rd-hl{border-collapse:collapse}.rd-hm{border:1px solid #000}.rd-hn{box-shadow:inset 2px 2px 10px rgba(0,0,0,.2);outline:var(--rd-fx) 2px solid;background:var(--rd-fE)}.rd-ho{left:0;top:0;right:0;bottom:0}.rd-hp{align-items:flex-start}.rd-hq{align-self:flex-start}.rd-hr{visibility:hidden}.rd-hs{width:36px;height:18px;display:inline-block;border-radius:2px;background:#ccc}.rd-hs::before{content:'';width:calc(50% - 4px);height:calc(100% - 4px);position:absolute;left:0;margin:2px;border-radius:2px;background:var(--rd-fI);transition:all .25s}.rd-ht{border:solid 1px var(--rd-fI)}.rd-hu{transition:all .25s}.rd-hr:checked+.rd-hs{background:var(--rd-fx)}.rd-hr:checked+.rd-hs::before{left:100%;margin-left:calc(-50% + 2px)}.rd-ht{width:32px;height:16px}.rd-ht::before{width:calc(50% - 2px);height:calc(100% - 2px);margin:1px}.rd-hv:checked+.rd-ht{background:var(--rd-fy)}.rd-hv:checked+.rd-ht::before{left:100%;margin-left:calc(-50% + 1px)}.rd-hr:disabled+.rd-hs{background:#e6e6e6;cursor:not-allowed}.rd-hr:checked:disabled+.rd-hs{background:var(--rd-fG)}.rd-hw{width:21px;margin:0 1px;height:21px;line-height:21px;background:#e6e6e6;border-radius:2px}.rd-hw:hover{background:#ccc}.rd-hx,.rd-hx:hover{background:var(--rd-fx);color:var(--rd-fI)}.rd-hy{opacity:0}.rd-hz{opacity:.2}.rd-hA{opacity:.4}.rd-hB .rd-hw,.rd-hB .rd-hw:hover{background:#e6e6e6;color:#999}.rd-hB .rd-hx,.rd-hB .rd-hx:hover{background:var(--rd-fG);color:var(--rd-fI)}.rd-hC{cursor:not-allowed}.rd-hD{color:var(--rd-fx)}.rd-hE{color:#999}.rd-hF{color:#666}.rd-hG:hover{color:#666}.rd-hH{overflow:hidden}.rd-hI{overflow:visible}.rd-hJ{overflow:auto}.rd-hK{overflow-y:scroll}.rd-hL{overflow-x:hidden}.rd-hM{transform:scale(.8)}.rd-hN{font-size:12px}.rd-hO{font-size:14px}.rd-hP{font-size:16px}.rd-hQ{font-size:20px}.rd-hR{font-size:26px}.rd-hS{right:0}.rd-hT{top:2px}.rd-hU{bottom:0}.rd-hV{border:dashed 1px var(--rd-fx);display:none}.rd-hW{z-index:1}.rd-hX{z-index:2}.rd-hY{z-index:5}.rd-hZ{z-index:6}.rd-h0{z-index:7}.rd-h1{z-index:8}.rd-h2{z-index:9}.rd-h3::before{width:100%;height:100%;content:attr(data-tip);position:absolute;display:flex;justify-content:center;align-items:center}.rd-h4::before{position:absolute;left:-7px;right:-7px;top:-5px;content:'';border-style:solid;border-width:5px;border-color:#0000 var(--rd-fy);height:11px}.rd-h5::before{left:-5px;right:-5px;top:-3px;border-width:3px;height:7px}.rd-h4::after{position:absolute;border-bottom:dashed 1px var(--rd-fy);left:-5px;right:-5px;top:0;content:''}.rd-h6{min-height:80px}.rd-h7{min-height:500px}.rd-h8{border-style:dashed}.rd-h9{contain:paint}.rd-i_{padding:4px}.rd-ia{padding:0}.rd-ib{padding:2px}.rd-ic{padding:2px 4px}.rd-id{padding:2px 0}.rd-ie{left:2px}.rd-if{left:0}.rd-ig{border-radius:2px}.rd-ih{opacity:0}.rd-ih:focus{opacity:1}.rd-ih:focus+.rd-ii{opacity:0}.rd-ij{transform:translateY(-50%)}.rd-ik{transform:translateX(-50%)}.rd-il{transform:translate(-50%,-50%)}.rd-im{transform-origin:0}.rd-in{touch-action:none}.rd-io{scrollbar-gutter:stable}.rd-ip{overscroll-behavior:contain}.rd-iq{content-visibility:auto}.rd-ir{left:-500cm;top:-500cm}.rd-is{background:#f9f9f9;border:solid 1px #0000}.rd-is:hover,.rd-it{border-color:var(--rd-fx)}.rd-iu,.rd-iu:hover{background:#f5f5f5;border-color:#0000}.rd-iu.rd-it,.rd-iu.rd-it:hover{border-color:var(--rd-fG)}.rd-it::after{content:'';position:absolute;right:0;top:0;border-top:solid 8px var(--rd-fx);border-left:solid 8px #0000;width:0;height:0}.rd-iu::after{border-top-color:var(--rd-fG)}.rd-iv{border:solid 1px #e6e6e6}.rd-iv:hover{border-color:#ccc}.rd-iw:hover{border-color:#e6e6e6}.rd-ix{background:#fafafa}.rd-iy{flex-basis:22%}.rd-iz{display:none}");
                    let d = navigator.language.toLowerCase();
                    try {
                        let t = localStorage;
                        t && (d = t.getItem("rd.lang") || d)
                    } catch {}
                    i(t, {
                        lang: d
                    }), l.merge({
                        ctor() {
                            let {
                                max: t,
                                min: e
                            } = Math;
                            this.set({
                                enHTML: s.gl,
                                safeHTML: s.gm,
                                i18n: o,
                                am: s.go,
                                mmax: t,
                                mmin: e
                            })
                        }, _f9(t) {
                            t.preventDefault()
                        }, _i7(t) {
                            t.stopPropagation()
                        }, "_i8<change>" (t) {
                            this._i7(t)
                        }
                    }), e()
                }))
            }))), r._rO),
            i = async t => (await r(t), i._rO || (i._rO = new Promise((t => {
                s.use(["3l"], (({
                    View: r,
                    boot: i,
                    toUrl: l,
                    config: o
                }) => {
                    let d = o("rootId");
                    s.d("~/root", (() => r.extend())), e.id || (e.id = d), i({
                        defaultPath: "/rd",
                        defaultView: "~/root",
                        rootId: e.id,
                        error(t) {
                            {
                                let e = o("errorReportUrl");
                                e && (e = l(e, {
                                    error: t.message
                                }), navigator.sendBeacon(e))
                            }
                        }
                    }), t()
                }))
            }))), i._rO),
            l = "rd-fy";
        window.viewer = {
            resolve: e => s.rp(t + e),
            setup: (t = {}) => new Promise((async r => {
                await i(t), s.use(["3l", "41/3i"], (({
                    node: i,
                    config: o,
                    Vframe: s
                }, d) => {
                    let {
                        rootId: a = "app",
                        use: n = "7h/3i",
                        siteName: h = d("fY")
                    } = t, f = i(a);
                    "virtual" == n ? (n = "7h/7q", f = document.createElement("div"), f.className = "rd-gz rd-ir rd-gx rd-hy", e.append(f)) : document.title = h, f.classList.add(l);
                    let p = o("rootId"),
                        g = s.byNode(i(p));
                    r(g.mount(f, n))
                }))
            })),
            element(t, e) {
                (async(t, e, r) => {
                    await i();
                    let {
                        config: o,
                        node: d,
                        isString: a,
                        Vframe: n,
                        State: h
                    } = s.r("3l"), f = d(o("rootId"));
                    h.set({
                        fB: r.unit || "px"
                    });
                    let p = n.byNode(f),
                        g = t;
                    if (a(g) && (g = d(g.replace(/^#/, ""))), g) {
                        g.classList.contains(l) || g.classList.add(l);
                        let t = n.byNode(g);
                        (null == t ? void 0 : t.path) == e ? (await t.invoke("assign", r), await t.invoke("render")) : p.mount(g, e, r)
                    }
                })(t, `4e/${e.type}/3i`, e)
            },
            remove(t) {
                let e = t,
                    {
                        node: r,
                        Vframe: i,
                        isString: l
                    } = s.r("3l");
                if (l(e) && (e = r(e.replace(/^#/, ""))), e) {
                    let t = i.byNode(e);
                    if (t) return t.unmount(), !0
                }
                return !1
            },
            destroy() {
                s.use(["3l"], (({
                    unboot: t
                }) => {
                    i._rO = null, t()
                }))
            }
        }
    })(), s.d("41/3i", ["3l", "./73"], (t => {
        let e = t("3l"),
            r = t("./73"),
            i = {
                zh: r,
                "zh-cn": r
            },
            {
                has: l,
                config: o,
                Cache: s,
                isArray: d
            } = e,
            a = /\{(\d+)\}/g,
            n = new s(200, 60);
        return (t, ...e) => {
            let r = o("lang");
            l(i, r) || (r = "zh");
            let s, h = i[r],
                f = [r, t, ...e].join("\0");
            if (n.has(f)) return n.get(f);
            if (d(t)) {
                s = "";
                for (let e of t) s += l(h, e) ? h[e] : e
            } else s = l(h, t) ? h[t] : t, e.length && (s = s.replace(a, ((t, r, i) => (r |= 0, e.length > r ? (i = e[r], l(h, i) ? h[i] : i) : t))));
            return n.set(f, s), s
        }
    })), s.d("41/73", [], (() => ({
        gk: "下对齐",
        gi: "水平居中对齐",
        gg: "左对齐",
        gl: "垂直居中对齐",
        gh: "右对齐",
        gj: "上对齐",
        hx: "快捷键大全",
        gH: "关",
        gG: "开",
        gF: "自动保存{0}",
        hy: "元素间水平均分排列(按下Shift键则使用元素中心点进行均分)",
        hA: "元素在设计区内水平均分排列(按下Shift键则使用元素中心点进行均分或按下Ctrl键在设计区水平居中)",
        hB: "元素在设计区内垂直均分排列(按下Shift键则使用元素中心点进行均分或按下Ctrl键在设计区垂直居中)",
        hz: "元素间垂直均分排列(按下Shift键则使用元素中心点进行均分)",
        fz: "删除辅助线",
        fB: "点击隐藏所有辅助线",
        fA: "拖动可移动辅助线",
        fC: "点击显示所有辅助线",
        f1: "应用",
        f2: "取消",
        oK: "确定",
        on: "累计平均",
        om: "本页平均",
        ol: "本单平均",
        nW: "求平均",
        nX: "自定义",
        jp: "点击选中当前格子",
        nU: "静态文本",
        ok: "本页累计",
        oi: "本页求和",
        oj: "本单求和",
        nV: "求和",
        hs: "您确认清空编辑区内容吗？",
        oz: "点击选择图片",
        gN: "点击显示{0}",
        oL: "关闭窗口",
        nQ: "添加配色",
        nO: "随机一个颜色",
        nP: "移除当前配色",
        hr: "您确认新建编辑区内容吗？",
        oM: '请选中一个支持数据绑定的组件，如数据中的"列表格"、"单元格"或"柱状图"',
        oJ: "提示",
        mI: "下",
        mJ: "左",
        nH: "左下",
        nE: "左上",
        mH: "右",
        nG: "右下",
        nF: "右上",
        mG: "上",
        m_: "弧",
        h3: "请输入或绑定条形码内容",
        hQ: "条形码",
        h4: "批量条码",
        ib: "批量文本",
        me: "电池",
        mk: "贝塞尔2",
        ml: "贝塞尔3",
        ig: "日历",
        il: "柱状图",
        iq: "Chart.js",
        is: "漏斗图",
        iu: "折线图",
        ix: "仪表盘",
        iA: "饼图",
        iB: "雷达图",
        iC: "散点图",
        iD: "条件图片",
        iG: "圆形",
        iJ: "时钟",
        iN: "环形进度",
        jJ: "曲线",
        ia: "请绑定数据",
        iV: "单元格",
        i3: "列表格",
        jb: "数据表格",
        jr: "自由表格",
        jw: "横纵重复",
        i0: "删除绑定字段",
        mp: "椭圆",
        mq: "风扇",
        jD: "注释",
        jE: "卡片",
        jF: "连接线",
        jT: "数据",
        jU: "数据库",
        jV: "判定",
        jY: "展示",
        jZ: "文档",
        j0: "外部数据",
        j1: "内部存储",
        j2: "循环限值",
        j3: "人工输入",
        j4: "人工操作",
        j5: "跨页引用",
        j6: "并行模式",
        j7: "预备",
        j8: "过程",
        j9: "队列数据",
        k_: "页内引用",
        ka: "子流程",
        kb: "条带",
        kc: "开始结束",
        kd: "复选框",
        ko: "数据采集",
        kv: "下拉框",
        kz: "输入框",
        kD: "单选框",
        kE: "公式",
        kF: "函数",
        kU: "H-Flex",
        mt: "心形",
        kO: "热度",
        kZ: "HTML",
        k0: "iframe",
        oN: "使用图片尺寸",
        la: "请选择或绑定图片",
        k5: "图片",
        jH: "直线",
        ll: "正在载入第三方组件...",
        lc: "边框",
        ld: "预设图片",
        le: "地图",
        lm: "序号器",
        ln: "编辑区",
        lR: "页码器",
        mZ: "圆饼",
        mv: "液体管道",
        jI: "折线",
        kR: "页脚",
        kT: "页头",
        lS: "进度条",
        lV: "请输入或绑定二维码内容",
        h7: "二维码",
        lW: "评分",
        lZ: "矩形",
        l1: "请选择或绑定背景图片",
        l0: "背景图",
        jx: "富文本",
        l3: "标尺",
        iF: "请设置规则",
        m2: "信号",
        l8: "签名",
        m6: "扬声器",
        mC: "箭头",
        mm: "大括号",
        mE: "气泡",
        mn: "圆",
        mM: "拐角",
        mN: "十字",
        mO: "立方体",
        mS: "圆柱",
        mU: "双箭头",
        na: "五角星",
        mu: "线段",
        mY: "月牙",
        mV: "四边形",
        m0: "星星",
        kV: "表格",
        kW: "Tabs",
        nd: "标签云",
        if : "请输入或绑定内容",
        nh: "文本",
        nb: "三角形",
        kY: "V-Flex",
        no: "请输入视频地址",
        ni: "视频",
        nc: "WiFi",
        np: "Excel",
        fX: "正在导出...",
        fZ: "导出成功~",
        fG: "微软正黑体",
        fH: "楷体",
        fI: "隶书",
        fE: "黑体",
        fD: "宋体",
        fF: "微软雅黑",
        fJ: "幼圆",
        fy: "水平",
        fx: "垂直",
        gu: "帮助",
        gR: "添加<{0}>辅助线",
        gQ: "清除全部辅助线",
        gU: "清空编辑区",
        gS: "删除<{0}>辅助线",
        g4: "添加<{0}>",
        g2: "对齐元素",
        hl: "<{0}>添加动画",
        hn: "<{0}>修改动画",
        hm: "<{0}>删除动画",
        hi: "水平均分<多个元素>",
        hj: "垂直均分<多个元素>",
        hg: "剪切<{0}>",
        hh: "克隆<{0}>",
        g0: "选中<{0}>",
        g6: "组合元素",
        g8: "编辑锁定<{0}>",
        gZ: "取消选中<{0}>",
        hc: "<{0}>修改控制点",
        hd: "<{0}>修改调整点",
        hf: "<{0}>修改属性",
        he: "<{0}>修改尺寸",
        g1: "移动<{0}>",
        ha: "粘贴<{0}>",
        g5: "删除<{0}>",
        hb: "旋转<{0}>",
        g3: "同步元素尺寸",
        g7: "取消组合元素",
        g9: "取消编辑锁定<{0}>",
        h_: "<{0}>调整Z轴",
        hq: "显示自定义模板",
        ho: "显示模板<{0}>",
        hp: "显示id为{0}的模板",
        gP: "初始状态",
        gT: "移动<{0}>辅助线",
        gY: "新建编辑区",
        gV: "放大编辑区",
        gW: "缩小编辑区",
        gX: "还原编辑区",
        oO: "点击还原到{0}",
        hk: "同步<{0}>属性",
        oB: "图片库",
        oA: "获取图片尺寸失败，请重试～～",
        hK: "逆时针旋转增加{0}度(按下shift键吸附到{0}的倍数上)",
        gs: "清空格子",
        gc: "清空编辑区",
        hL: "顺时针旋转增加{0}度(按下shift键吸附到{0}的倍数上)",
        gm: "组合",
        gn: "取消组合",
        f4: "复制",
        f5: "剪切",
        gb: "删除",
        g_: "克隆",
        hH: "当前状态：通过属性面板修改坐标时，组合中的其它元素不随着修改",
        hG: "当前状态：通过属性面板修改坐标时，组合中的其它元素随着修改",
        hE: "组合选中元素",
        gM: "从本地文件导入",
        hI: "锁定编辑",
        f9: "下移一层",
        f8: "上移一层",
        gd: "新建编辑区",
        oP: "当前状态：不展示普通元素的轮廓线",
        oQ: "当前状态：展示普通元素的轮廓线",
        ga: "粘贴",
        ge: "反选",
        f3: "全选",
        gf: "全选(可移动)",
        gp: "高作为宽",
        gr: "同高",
        go: "宽作为高",
        gq: "同宽",
        f7: "移至底层",
        f6: "移至顶层",
        hF: "取消组合元素",
        hJ: "解锁编辑",
        gD: "多个元素",
        nA: "删除当前格子",
        nJ: "下方添加格子",
        ny: "左侧添加格子",
        nz: "右侧添加格子",
        nI: "上方添加格子",
        nK: "左侧添加列",
        nL: "右侧添加列",
        nx: "下方添加行",
        nw: "上方添加行",
        nN: "向下合并格子",
        nB: "向左合并格子",
        nC: "向右合并格子",
        nM: "向上合并格子",
        nD: "拆分格子",
        oH: "可以输入或粘贴十六进制的颜色值",
        oI: "点击使用吸管吸取颜色",
        op: "拖动数据源字段到这里",
        nv: "垂直居下",
        nr: "水平居中",
        nq: "水平居左",
        nu: "垂直居中",
        ns: "水平居右",
        nt: "垂直居上",
        ot: "加粗",
        ou: "斜体",
        ox: "上划线",
        ow: "删除线",
        ov: "下划线",
        or: "居中",
        oq: "居左",
        os: "居右",
        nR: "请先绑定数据",
        oF: "高度均分",
        oE: "宽度均分",
        oC: "点击隐藏{0}边框",
        oD: "点击显示{0}边框",
        ob: "删除当前列",
        oa: "删除当前行",
        n9: "左侧添加列",
        o_: "右侧添加列",
        n8: "下方添加行",
        n7: "上方添加行",
        oh: "向下合并单元格",
        oe: "向左合并单元格",
        of: "向右合并单元格",
        og: "向上合并单元格",
        oc: "水平拆分单元格",
        od: "垂直拆分单元格",
        oR: "一键同步下列属性",
        oS: "动画",
        gE: "基础属性",
        hO: "关闭所有面板(Shift+Z)",
        hM: "关闭{0}面板(数字键{1})",
        oT: "数据源",
        oU: "按下移动面板",
        oV: "元素",
        oW: "拖动改变面板宽度",
        oX: "展开{0}面板(Shift+数字键{1})",
        oY: "点击查看{0}的说明",
        oZ: "拖动改变面板高度",
        hP: "打开所有面板(Shift+Z)",
        hN: "打开{0}面板(数字键{1})",
        o0: "概览图",
        o1: "属性",
        o2: "只读元素不能选中和拖动排序",
        o3: "历史操作",
        o4: "折叠{0}面板(Shift+数字键{1})",
        o5: "结构树",
        ly: "请选择",
        o6: "不能放置",
        o7: "松开放在格子里",
        o8: "松开放在编辑区",
        i2: "拖动修改格子高度",
        i1: "拖动修改格子宽度",
        jW: "拖动修改控制点",
        ku: "拖动修改Excel顶部标题高度",
        kt: "拖动修改Excel左侧标题宽度",
        jA: "拖动修改元素高度",
        jX: "拖动与其它元素连线或松开连接到该点",
        jC: "拖动修改调整点",
        jy: "拖动旋转元素",
        jq: "拖动修改留白高度",
        jz: "拖动修改元素宽度",
        jB: "拖动修改元素宽度和高度",
        gt: "预览",
        o9: "浏览器打印",
        p_: "转换内容为",
        fR: "每页打印",
        fV: "偶数页打印",
        fS: "首页打印",
        fT: "尾页打印",
        pa: "请传递 id 参数且配置 getContentUrl 并确保接口有数据返回",
        fU: "奇数页打印",
        pb: "正在准备基础页面...",
        pc: "RDS打印",
        pd: "RDS设置",
        pe: "静默打印",
        pf: "独立使用",
        kX: "选中",
        k3: "策略",
        n3: "透明度",
        lB: "自适应",
        jv: "行高检测",
        nl: "自动播放",
        lG: "背景图片",
        lI: "平铺方式",
        io: "背景颜色",
        lT: "进度颜色",
        kP: "柱子个数",
        kQ: "柱子宽度",
        hT: "编码格式",
        pg: "批量<{0}>属性设置",
        mg: "充电中",
        mi: "电量颜色",
        mj: "闪电颜色",
        mh: "电池颜色",
        mf: "电量",
        hS: "绑定字段",
        iw: "X轴绑定",
        iv: "Y轴绑定",
        iH: "边框颜色",
        lU: "圆角",
        fM: "虚线",
        fL: "点线",
        fO: "双边框",
        fN: "隆起",
        fK: "实线",
        ph: "边框类型",
        iQ: "边框宽度",
        k2: "边框",
        jm: "平均分配",
        jn: "不分配",
        jl: "占比分配",
        jk: "宽度分配",
        n4: "格子背景",
        nT: "格子计算",
        nS: "格子内容",
        jj: "数据检测",
        iZ: "格子操作",
        iW: "格子均分",
        kS: "格子高",
        iX: "格子尺寸",
        im: "图表标题",
        iK: "表盘颜色",
        iL: "指针颜色",
        iM: "刻度颜色",
        pi: "闭合",
        it: "配色",
        ip: "颜色",
        jG: "连线类型",
        nY: "内容位置",
        kl: "自动",
        kn: "隐藏",
        km: "显示",
        kk: "内容溢出",
        nn: "显示控制",
        m1: "角",
        mT: "柱体颜色",
        js: "数据源",
        kA: "默认文本",
        kH: "禁用缩放",
        m5: "断网颜色",
        ke: "识别名称",
        kh: "垂直",
        kg: "水平",
        kf: "排列方式",
        lE: "拖动磁吸",
        md: "结束角度",
        jL: "结束箭头",
        l7: "结束边框",
        kq: "标题背景",
        ks: "左标题宽",
        kr: "顶标题高",
        kp: "Excel标题",
        kx: "扩展样式",
        kw: "扩展标记",
        iI: "填充颜色",
        hV: "填充方式",
        nf: "排列",
        iT: "字体",
        iS: "字号",
        h1: "文字样式",
        jd: "最后显尾",
        iU: "文字颜色",
        iP: "计算函数",
        ic: "显示格式",
        mQ: "前部颜色",
        lC: "拉伸铺满",
        mF: "缺口方向",
        mK: "缺口位置",
        mL: "缺口大小",
        h5: "水平间隔",
        jc: "初始显头",
        jO: "高",
        pj: "帮助",
        ji: "隐藏尾",
        je: "隐藏头",
        jf: "隐藏标题",
        ju: "隐藏表尾",
        jt: "隐藏表头",
        jh: "隐藏合计",
        iR: "高亮颜色",
        lO: "图片高",
        k8: "图片尺寸",
        lN: "图片宽",
        k7: "图片",
        ki: "选项间距",
        n6: "字间距",
        iz: "圆角化",
        hX: "线条颜色",
        pk: "虚线间隔",
        ne: "行高",
        pl: "斜角",
        pm: "尖角",
        pn: "圆角",
        po: "拐角",
        jM: "文字",
        lb: "线类型",
        hY: "线条宽",
        pp: "锁定编辑",
        l4: "长",
        nm: "循环播放",
        lk: "双击缩放",
        lj: "能否拖动",
        lh: "纬度",
        lg: "经度",
        li: "显示缩放",
        lf: "缩放级别",
        ky: "多选",
        kC: "多行模式",
        jo: "多栏打印",
        n_: "静音颜色",
        m7: "静音",
        lJ: "不平铺",
        pq: "官方网站",
        lP: "水平偏移",
        lQ: "垂直偏移",
        pr: "操作",
        ir: "配置",
        n1: "下边距",
        n2: "左边距",
        n0: "右边距",
        nZ: "上边距",
        kG: "网格",
        lx: "常用纸张",
        lA: "全屏显示",
        lF: "页面标题",
        lo: "单位",
        lw: "编辑区",
        l9: "签字颜色",
        mx: "管道颜色",
        mB: "流动",
        mz: "液体颜色",
        mA: "液体间隔",
        my: "液体宽",
        mw: "管道宽",
        kB: "占位文本",
        lH: "套打",
        iE: "预设值",
        lD: "打印份数",
        ps: "打印设置",
        h8: "暗色",
        h9: "亮色",
        i_: "纠错级别",
        mo: "半径",
        pt: "参考",
        pu: "PNG图片",
        pv: "SVG矢量图",
        hU: "输出格式",
        lK: "横向平铺",
        lL: "垂直平铺",
        lM: "双向平铺",
        ie: "富文本",
        k9: "垂直镜像",
        l_: "水平镜像",
        jP: "旋转角度",
        mW: "水平圆角",
        mX: "垂直圆角",
        ma: "水平半径",
        mb: "垂直半径",
        k4: "沙箱",
        lz: "分辨率",
        jg: "每页标题",
        iy: "显示进度",
        hW: "显示文字",
        mR: "侧部颜色",
        m4: "信号强度",
        m9: "音量颜色",
        ms: "速度",
        l2: "自动分页",
        lX: "星星个数",
        lY: "星星大小",
        mc: "开始角度",
        jK: "开始箭头",
        l6: "开始边框",
        mD: "燕尾",
        j_: "偶数行",
        ij: "内容字号",
        ja: "奇数行",
        i9: "内容行高",
        i7: "内容对齐",
        fP: "合并",
        pw: "边框行为",
        fQ: "分离",
        iY: "边框显示",
        i4: "列宽",
        i5: "留白",
        ih: "表头字号",
        ii: "表头背景",
        i8: "表头行高",
        i6: "快捷皮肤",
        h2: "文字对齐",
        id: "自动换行",
        hR: "内容",
        h0: "文字距离",
        jQ: "线上位置",
        hZ: "文字位置",
        l5: "文字角度",
        kj: "内容间距",
        n5: "文本",
        in : "标题对齐",
        px: "元素名称",
        mP: "顶部颜色",
        py: "类型",
        ng: "黑白",
        k1: "网址",
        h6: "垂直间隔",
        iO: "值",
        nk: "海报地址",
        nj: "视频地址",
        m8: "音量",
        k6: "网络图片",
        ik: "开始日期",
        jN: "宽",
        m3: "联网",
        mr: "旋转",
        kJ: "X轴范围",
        kI: "X轴标题",
        kM: "X提示线",
        jR: "水平偏移",
        pz: "X坐标",
        kL: "Y轴范围",
        kK: "Y轴标题",
        kN: "Y提示线",
        jS: "垂直偏移",
        pA: "Y坐标",
        pB: "H级别",
        pC: "L级别",
        pD: "M级别",
        pE: "Q级别",
        fW: "读取内容失败：",
        hD: "重做(Ctrl+Y,Ctrl+Shift+Z)",
        oo: "点击删除{0}",
        oG: "清除颜色",
        pF: "点击删除元素",
        pG: "点击删除历史记录",
        oy: "清除图片",
        pH: "清除关键字",
        f0: "编辑区数据",
        ht: "保存失败",
        gJ: "更多保存选项",
        hu: "保存成功~",
        gL: "导出到本地文件",
        gI: "保存",
        hv: "请选择数据源",
        gK: "快捷键：",
        hw: `行列&nbsp;&copy;&nbsp;2018-${(new Date).getFullYear()}&nbsp;&nbsp;`,
        fY: "通用设计器",
        pI: "系统正忙...",
        gC: "正在获取内容...",
        gv: "模板",
        gO: "主题",
        hC: "撤销(Ctrl+Z)",
        lq: "厘米(cm)",
        lt: "英寸(in)",
        lp: "毫米(mm)",
        lu: "派卡(pc)",
        ls: "磅(pt)",
        lr: "像素(px)",
        lv: "1/4毫米(q)",
        gx: "Ctrl+加号",
        gw: "放大",
        gz: "Ctrl+减号",
        gy: "缩小",
        gB: "Ctrl+数字0",
        gA: "还原"
    }))), s.d("3j/5f", ["3l"], (t => {
        let e = t("3l"),
            {
                Service: r,
                toUrl: i,
                config: l,
                guid: o,
                State: s
            } = e,
            d = (t, e) => {
                let r, i;
                return t.success ? i = t.data : r = t.message || `接口${e}错误`, {
                    _iq: r,
                    _ir: i
                }
            },
            a = r.extend(((t, e) => {
                s.fire("fX", {
                    _is: 1
                });
                let r = t.get("_it") || "GET",
                    o = t.get("_hy"),
                    a = t.get("_i_"),
                    n = t.get("url"),
                    h = {
                        Accept: "application/json",
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                    },
                    f = {
                        method: r,
                        credentials: "include"
                    };
                t.get("_iu") || (f.headers = h);
                let p = l("version");
                o || (o = {}), o.v = p, o && (n = i(n, o)), a && (f.body = a), ((t, e) => fetch(t, e).then((t => {
                    if (t.ok) return t.json();
                    throw Error(t.statusText || "Network error")
                })))(n, f).then((r => {
                    s.fire("fX");
                    let {
                        _iq: i,
                        _ir: l
                    } = d(r, n);
                    i ? e({
                        message: i
                    }) : (t.set({
                        data: l
                    }), e())
                })).catch((t => {
                    s.fire("fX"), e({
                        message: t.message
                    })
                }))
            }));
        return a.add([{
            name: "_iv",
            url: l("getImageUrl")
        }, {
            name: "_if",
            url: l("getFieldUrl")
        }, {
            name: "_hx",
            url: l("getTemplateUrl")
        }, {
            name: "_h8",
            url: l("saveContentUrl"),
            _it: "post"
        }, {
            name: "_ih",
            url: l("getContentUrl")
        }, {
            name: "_ii",
            url: l("presetUrl")
        }, {
            name: "_iw"
        }, {
            name: "_ix",
            _it: "post"
        }]), a._iy = d, a
    })), s.d("3j/3o", ["3l", "./3n"], (t => {
        let e = t("3l"),
            r = t("./3n"),
            {
                State: i,
                node: l,
                has: o
            } = e,
            {
                sqrt: s,
                pow: d,
                atan: a,
                PI: n,
                sin: h,
                cos: f,
                min: p,
                max: g,
                atan2: c,
                tan: u,
                abs: $
            } = Math,
            y = n / 180,
            m = {
                tl: 2,
                tm: 2,
                tr: 3,
                mr: 3,
                br: 0,
                bm: 0,
                bl: 1,
                ml: 1
            },
            x = () => l("_rd_sc").getBoundingClientRect();
        return {
            fx: x,
            fB({
                x: t,
                y: e
            }) {
                let r = x();
                return {
                    x: t = t - r.x - scrollX,
                    y: e = e - r.y - scrollY
                }
            },
            fD(t, {
                x: e,
                y: r,
                f: i
            }) {
                let l = t;
                if (i)
                    for (; l.parentNode && "hod" != l.dataset.as;) l = l.parentNode;
                let o = l.getBoundingClientRect();
                return {
                    x: e = e - o.x - scrollX,
                    y: r = r - o.y - scrollY
                }
            },
            fE({
                x: t,
                y: e
            }) {
                let r = x();
                return {
                    x: t = t + r.x + scrollX,
                    y: e = e + r.y + scrollY
                }
            },
            fA(t) {
                let e = t / i.get("fA");
                return r.fz(e)
            },
            fF: t => t * i.get("fA"),
            fy({
                x: t,
                y: e,
                width: r,
                height: i,
                rotate: l
            }) {
                l || (l = 0);
                let o = s(d(r, 2) + d(i, 2)) / 2,
                    c = r ? 180 * a(i / r) / n : 90,
                    u = 180 - l - c,
                    $ = c - l,
                    m = 90 - l,
                    x = r / 2,
                    _ = i / 2,
                    b = t + x,
                    w = e + _,
                    k = {
                        x: b + o * f(u * y),
                        y: w - o * h(u * y)
                    },
                    v = {
                        x: b + o * f($ * y),
                        y: w - o * h($ * y)
                    },
                    j = {
                        x: b - o * f(u * y),
                        y: w + o * h(u * y)
                    },
                    L = {
                        x: b - o * f($ * y),
                        y: w + o * h($ * y)
                    },
                    S = {
                        x: b + _ * f(m * y),
                        y: w - _ * h(m * y)
                    },
                    z = {
                        x: b + x * f(l * y),
                        y: w + x * h(l * y)
                    },
                    A = {
                        x: b - _ * h(l * y),
                        y: w + _ * f(l * y)
                    },
                    C = {
                        x: b - x * f(l * y),
                        y: w - x * h(l * y)
                    },
                    I = p(k.x, v.x, j.x, L.x),
                    T = g(k.x, v.x, j.x, L.x),
                    M = p(k.y, v.y, j.y, L.y),
                    P = g(k.y, v.y, j.y, L.y);
                return {
                    _gb: [k, v, j, L],
                    _iB: [S, z, A, C],
                    _fG: T - I,
                    _fH: P - M,
                    _gd: I,
                    _hG: T,
                    _ge: M,
                    _hH: P,
                    _gt: b,
                    _gu: w
                }
            },
            fG: (t, e) => (360 + 180 * c(t.y - e.y, t.x - e.x) / n) % 360,
            fH: t => m[t],
            fI(t, e, r) {
                let i = s(d(t.x - e.x, 2) + d(t.y - e.y, 2));
                return {
                    x: e.x + i * f(r * y),
                    y: e.y + i * h(r * y)
                }
            },
            fJ(t, e, r) {
                let i = u(r * y);
                return {
                    k: i,
                    b: e - t * i
                }
            },
            fK(t, e, r, i) {
                let l = (i - e) / (r - t);
                return {
                    k: l,
                    b: e - t * l
                }
            },
            fL: (t, e) => s(d(t.x - e.x, 2) + d(t.y - e.y, 2)),
            fC(t, e) {
                let [r, i] = t, [l, o] = e, s = ((i.x - r.x) * (l.y - r.y) - (i.y - r.y) * (l.x - r.x)) * ((i.x - r.x) * (o.y - r.y) - (i.y - r.y) * (o.x - r.x)), d = ((o.x - l.x) * (r.y - l.y) - (o.y - l.y) * (r.x - l.x)) * ((o.x - l.x) * (i.y - l.y) - (o.y - l.y) * (i.x - l.x));
                return s < 0 && d < 0
            },
            fz(t, e, r) {
                let i = t.width / 2,
                    l = t.height / 2,
                    o = e.width / 2,
                    s = e.height / 2,
                    d = t.x + i,
                    a = t.y + l,
                    n = e.x + o,
                    h = e.y + s,
                    f = r ? -1 : 1;
                return $(n - d) <= i + f * o && $(h - a) <= l + f * s
            },
            fM(t) {
                if (!t._iA) {
                    let e = [],
                        r = 1;
                    for (;;) {
                        let i = "ctrl" + r++;
                        if (!o(t, i + "X")) break;
                        e.push(i)
                    }
                    t._iA = e
                }
                return t._iA
            }
        }
    })), s.d("3j/3n", ["3l", "./47"], (t => {
        let e = t("3l"),
            r = t("./47"),
            {
                State: i
            } = e,
            {
                round: l,
                pow: o,
                abs: s
            } = Math,
            d = document.body,
            a = 1e-7,
            n = {
                px: 0,
                mm: 2,
                cm: 3,
                pt: 2,
                in : 3,
                pc: 3,
                q: 1
            },
            h = {
                px: {
                    fx: 1,
                    fy: 1
                }
            },
            f = t => {
                if (!h[t]) {
                    let e = document.createElement("div"),
                        r = 1e3;
                    e.style.cssText = `width:${r}${t};position:absolute;left:-${r}${t};top:-10px`, d.appendChild(e);
                    let i = e.offsetWidth;
                    d.removeChild(e);
                    let l = r / i,
                        o = i / r;
                    h[t] = {
                        fx: l,
                        fy: o
                    }
                }
            },
            p = (t, e) => (e = e || i.get("fB"), f(e), t * h[e].fy);
        return {
            fK: 50,
            fD: 900,
            fL: 1,
            fM: 1,
            fN: 1,
            fO: 1,
            fP: 1,
            fQ: 1,
            fJ: 1,
            fR: 1,
            fS: [80, 380, 220, 240],
            fT: 1,
            fU: 1,
            fV: 0,
            fW: 1,
            fX: 793,
            fY: 1122,
            fZ: 6e3,
            f0: 6e3,
            f1: 20,
            f2: 5,
            f3: 1,
            f4: r.fz,
            f5: r.fA | r.fB,
            fH: 0,
            f6: 200,
            fA: 20,
            fx: 1,
            f7: 4,
            f8: .5,
            f9: .5,
            g_: 1,
            ga: 1e3,
            gb: 0,
            fC: 1,
            fB: 10,
            gc: 1,
            gd: 5,
            ge: 8,
            gf: 45,
            gg: 4,
            gh: 1,
            gi: 1,
            fF: 10,
            gj: 3,
            gk: 200,
            gl: 0,
            gm: 1,
            gn: 12,
            go: 1,
            gp: [{
                value: "SimSun",
                text: "fD"
            }, {
                value: "SimHei",
                text: "fE"
            }, {
                value: "Microsoft YaHei",
                text: "fF"
            }, {
                value: "Microsoft JhengHei",
                text: "fG"
            }, {
                value: "KaiTi",
                text: "fH"
            }, {
                value: "LiSu",
                text: "fI"
            }, {
                value: "YouYuan",
                text: "fJ"
            }, {
                value: "Arial",
                text: "Arial"
            }, {
                value: "Times New Roman",
                text: "Times New Roman"
            }, {
                value: "Tahoma",
                text: "Tahoma"
            }, {
                value: "webdings",
                text: "Webdings"
            }, {
                value: "Arial Black",
                text: "Arial Black"
            }, {
                value: "Arial Narrow",
                text: "Arial Narrow"
            }, {
                value: "Arial Unicode MS",
                text: "Arial Unicode MS"
            }, {
                value: "monospace",
                text: "Monospace"
            }, {
                value: "fantasy",
                text: "Fantasy"
            }, {
                value: "cursive",
                text: "Cursive"
            }],
            gq: [{
                text: "fK",
                value: "solid"
            }, {
                text: "fL",
                value: "dotted"
            }, {
                text: "fM",
                value: "dashed"
            }, {
                text: "fN",
                value: "ridge"
            }, {
                text: "fO",
                value: "double"
            }],
            gr: [{
                text: "fP",
                value: "collapse"
            }, {
                text: "fQ",
                value: "separate"
            }],
            gs: [{
                text: "fR",
                value: "each"
            }, {
                text: "fS",
                value: "first"
            }, {
                text: "fT",
                value: "last"
            }, {
                text: "fU",
                value: "odd"
            }, {
                text: "fV",
                value: "even"
            }],
            gt: "mm",
            gu: 1,
            fG: t => (t = t || i.get("fB"), f(t), h[t].fx),
            gv: t => (t = t || i.get("fB"), n[t]),
            fz(t, e, r) {
                r = r || i.get("fB"), null == e && (e = n[r]);
                let s = o(10, e);
                return l(t *= s) / s
            },
            fy: (t, e) => (e = e || i.get("fB"), f(e), t *= h[e].fx),
            gw: a,
            gx: (t, e) => t < e ? s(t - e) < a : 1,
            fE: (t, e) => s(t - e) < a,
            fI: p,
            gy(t) {
                let e = p((t => (t = t || i.get("fB"), 1 / o(10, n[t])))(t));
                return e > .5 && (e = .5), e
            },
            gz(t, e, r) {
                r = r || i.get("fB"), f(r), f(e);
                let l = h[r],
                    o = h[e];
                return t * l.fy * o.fx
            }
        }
    })), s.d("3j/47", [], (() => ({
        fx: 1,
        fC: 2,
        fJ: 4,
        fB: 1,
        fK: 2,
        fA: 4,
        fE: 1,
        fz: 2,
        fL: 1,
        fH: 2,
        fG: 4,
        fI: 8,
        fM: 16,
        fN: 32,
        fO: 64,
        fD: 128,
        fP: 256,
        fF: 512,
        fQ: 1024,
        fR: 2048,
        fy: 4096,
        fS: 1,
        fT: 2,
        fU: 3,
        fV: 4,
        fW: 6,
        fX: 7,
        fY: 8,
        fZ: 9,
        f0: 10,
        f1: 11,
        f2: 12,
        f3: "4i/3i",
        f4: "3k/3i",
        f5: "4j/3k",
        f6: "4j/4k",
        f7: "4l/3i",
        f8: "4m/3i",
        f9: "4m/fx",
        g_: "49/4n",
        ga: "4o/4a",
        gb: "4o/4p",
        gc: "4o/4q",
        gd: "4o/4r",
        ge: "4o/4s",
        gf: "4t/4k",
        gg: "4t/4u",
        gh: "4t/4q",
        gi: "4t/4v",
        gj: "4t/50",
        gk: "4t/51",
        gl: "4t/52",
        gm: "4o/4k",
        gn: "53/3i",
        go: "54/55",
        gp: "56/4p",
        gq: "56/4a",
        gr: "57/4p",
        gs: "57/4a",
        gt: "58/4p",
        gu: "fx/3i",
        gv: "fx/59",
        gw: "svg/kp",
        gx: "svg/mod",
        gy: "tab/3i",
        gz: "tag/3i",
        gA: "5a/3i",
        gB: "5b/3i",
        gC: "5c/3i",
        gD: "5d/3i"
    }))), s.d("4e/batch-barcode/3i", ["3l", "../../3j/3n", "../../42/barcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/barcode"),
            l = {
                class: "rd-gL rd-go rd-gP rd-h_"
            },
            {
                View: o,
                mark: s,
                task: d,
                isArray: a
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, o, s, d = [],
                    {
                        error: a,
                        text: n,
                        props: h,
                        unit: f,
                        render: p
                    } = t;
                return (a || n) && (s = [], a ? (o = [e(0, a)], s.push(e("div", l, o))) : "svg" == p ? s.push(e("svg", {
                    id: `_rd_${r}_bar`,
                    class: "rd-gp rd-gn rd-go rd-gz"
                })) : (i = "rd-fV rd-gp rd-gq", "full" == h.fill && (i += " rd-gn rd-go"), s.push(e("img", {
                    id: `_rd_${r}_bar`,
                    class: i
                }, 1))), i = "rd-gv rd-hH rd-hW", "auto" == h.fill && (i += " rd-gL rd-gP rd-h_"), d.push(e("div", {
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`,
                    class: i
                }, s))), e(r, 0, d)
            }, assign(t) {
                this.set(t);
                let e, {
                        props: r
                    } = t,
                    {
                        bind: i
                    } = r;
                if (i.id) {
                    let t = i.fields[0];
                    if (i._tip) e = i._tip;
                    else if (i._data) {
                        let r = i._data;
                        a(r) && (r = r[0]), e = r[t.id]
                    } else e = `[bind:${t.id}]`
                }
                this.set({
                    text: e
                })
            }, async render() {
                let t = s(this, "_fx"),
                    {
                        linewidth: e,
                        height: l,
                        format: o,
                        showText: a,
                        styleBold: n,
                        styleItalic: h,
                        color: f,
                        textPosition: p,
                        textAlign: g,
                        font: c,
                        textMargin: u,
                        fontSize: $,
                        render: y
                    } = this.get("props");
                await this.digest({
                    error: null,
                    render: y
                });
                try {
                    if (await i._jF(), t()) {
                        let i = this.get("text");
                        i && (t = s(this, "_jG"), d((() => {
                            if (t()) {
                                let t = "";
                                n && (t = "bold"), h && (n && (t += " "), t += "italic"), $ = r.fI($), u = r.fI(u), e = r.fI(e), l = r.fI(l);
                                try {
                                    JsBarcode(`#_rd_${this.id}_bar`, i, {
                                        height: l,
                                        lineColor: f,
                                        width: e,
                                        textPosition: p,
                                        textAlign: g,
                                        format: o,
                                        fontOptions: t,
                                        fontSize: $,
                                        displayValue: a,
                                        font: c,
                                        textMargin: u
                                    })
                                } catch (t) {
                                    this.digest({
                                        error: t
                                    })
                                }
                            }
                        })))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }
        })
    })), s.d("4e/barcode/3i", ["3l", "../../3j/3n", "../../42/barcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/barcode"),
            l = {
                class: "rd-gL rd-go rd-gP rd-h_"
            },
            {
                View: o,
                mark: s,
                task: d,
                isArray: a
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, o, s, d = [],
                    {
                        error: a,
                        text: n,
                        props: h,
                        unit: f,
                        render: p
                    } = t;
                return (a || n) && (s = [], a ? (o = [e(0, a)], s.push(e("div", l, o))) : "svg" == p ? s.push(e("svg", {
                    id: `_rd_${r}_bar`,
                    class: "rd-gp rd-gn rd-go rd-gz"
                })) : (i = "rd-fV rd-gp rd-gq", "full" == h.fill && (i += " rd-gn rd-go"), s.push(e("img", {
                    id: `_rd_${r}_bar`,
                    class: i
                }, 1))), i = "rd-gv rd-hH rd-hW", "auto" == h.fill && (i += " rd-gL rd-gP rd-h_"), d.push(e("div", {
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`,
                    class: i
                }, s))), e(r, 0, d)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r,
                    text: i
                } = e;
                if (r.id) {
                    let t = r.fields[0];
                    if (r._tip) i = r._tip;
                    else if (r._data) {
                        let e = r._data;
                        a(e) && (e = e[0]), i = e[t.id]
                    } else i = `[bind:${t.id}]`
                }
                this.set({
                    text: i
                })
            }, async render() {
                let t = s(this, "_fx"),
                    {
                        linewidth: e,
                        height: l,
                        format: o,
                        showText: a,
                        styleBold: n,
                        styleItalic: h,
                        color: f,
                        textPosition: p,
                        textAlign: g,
                        font: c,
                        textMargin: u,
                        render: $,
                        fontSize: y
                    } = this.get("props");
                await this.digest({
                    error: null,
                    render: $
                });
                try {
                    if (await i._jF(), t()) {
                        let i = this.get("text");
                        i && (t = s(this, "_jG"), d((() => {
                            if (t()) {
                                let t = "";
                                n && (t = "bold"), h && (n && (t += " "), t += "italic"), y = r.fI(y), u = r.fI(u), e = r.fI(e), l = r.fI(l);
                                try {
                                    JsBarcode(`#_rd_${this.id}_bar`, i, {
                                        height: l,
                                        lineColor: f,
                                        width: e,
                                        textPosition: p,
                                        textAlign: g,
                                        format: o,
                                        fontSize: y,
                                        fontOptions: t,
                                        displayValue: a,
                                        font: c,
                                        textMargin: u
                                    })
                                } catch (t) {
                                    this.digest({
                                        error: t
                                    })
                                }
                            }
                        })))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }
        })
    })), s.d("4e/batch-qrcode/3i", ["3l", "../../42/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../42/qrcode"),
            i = "div",
            l = {
                class: "rd-gL rd-gP rd-h_ rd-go"
            },
            {
                View: o,
                mark: s,
                node: d,
                task: a,
                isArray: n
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let o, s, d = [],
                    {
                        error: a,
                        text: n,
                        props: h,
                        unit: f
                    } = t;
                return (a || n) && (s = [], a && (o = [e(0, a)], s.push(e(i, l, o))), s.push(e(i, {
                    id: `_rd_${r}_qr`
                })), d.push(e(i, {
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`
                }, s))), e(r, 0, d)
            }, assign(t) {
                this.set(t);
                let e, {
                        props: r
                    } = t,
                    {
                        bind: i
                    } = r;
                if (i.id) {
                    let t = i.fields[0];
                    if (i._tip) e = i._tip;
                    else if (i._data) {
                        let r = i._data;
                        n(r) && (r = r[0]), e = r[t.id]
                    } else e = `[绑定:${t.name}]`
                }
                this.set({
                    text: e
                })
            }, async render() {
                let t = s(this, "_fx");
                await this.digest({
                    error: null
                });
                try {
                    if (await r._jF(), t()) {
                        let e = this.get("text") + "",
                            r = this.get("props");
                        if (e && (e != this._jL || r.colorDark != this._jM || r.colorLight != this._jN || r.correctLevel != this._jO)) {
                            let i = this._jP;
                            if (!i) {
                                let t = d(`_rd_${this.id}_qr`);
                                i = new QRCode(t), this._jP = i
                            }
                            let l = s(this, "_jQ");
                            a((() => {
                                if (t() && l()) {
                                    i._htOption.colorDark = this._jM = r.colorDark, i._htOption.colorLight = this._jN = r.colorLight, i._htOption.correctLevel = this._jO = QRCode.CorrectLevel[r.correctLevel], i.makeCode(this._jL = e), this.root.querySelector("img").classList.add("rd-fV", "rd-gn", "rd-gp")
                                }
                            }))
                        }
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }
        })
    })), s.d("4e/batch-text/3i", ["3l", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../42/4m"),
            {
                View: i,
                isArray: l
            } = e,
            {
                min: o
            } = Math;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    bw: a,
                    safeHTML: n,
                    text: h,
                    enHTML: f
                } = t;
                return o = [e(0, s.richText ? n(h) : f(h), 1)], l = `left:${s.x}${d};top:${s.y}${d};color:${s.forecolor};`, s.background && (l += `background:${s.background};`), l += `font-size:${s.fontsize}${d};min-height:${s.height}${d};letter-spacing:${s.letterspacing}${d};opacity:${s.alpha};line-height:${s.lineheight};`, s.styleBold && (l += "font-weight:bold;"), s.styleItalic && (l += "font-style:italic;"), (s.styleUnderline || s.styleStrike || s.styleOverline) && (l += "text-decoration:", s.styleStrike ? l += "line-through" : s.styleOverline ? l += "overline" : l += "underline", l += ";"), l += `align-items:${s.vpos};justify-content:${s.hpos};width:${s.width}${d};transform:rotate(${s.rotate}deg);font-family:${s.fontfamily};`, a && (l += `border:${a}${d} ${s.bordertype} ${s.bordercolor};`), s.autoReturn ? l += "word-break:break-all" : l += `max-height:${s.height}px`, i = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-hH",
                    style: l
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let e, {
                        props: i
                    } = t,
                    {
                        bind: s,
                        format: d,
                        borderwidth: a,
                        width: n,
                        height: h
                    } = i;
                if (s.id) {
                    let t = s.fields[0];
                    if (s._tip) e = s._tip;
                    else if (s._data) {
                        let i = s._data;
                        l(i) && (i = i[0]), e = i[t.id], e = r._jT(d, e, i)
                    } else e = `[绑定:${t.name}]`
                }
                let f = o(n, h) / 2;
                a > f && (a = f), this.set({
                    bw: a,
                    text: e
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/calendar/3i", ["3l", "../../3s/40/3i"], (t => {
        let e = t("3l"),
            r = t("../../3s/40/3i"),
            i = {
                class: "rd-gn rd-go rd-gs rd-hl"
            },
            {
                View: l
            } = e,
            o = "日一二三四五六".split("");
        return l.extend({
            tmpl(t, e, r) {
                let l, o, s, d, a, n, h, {
                    props: f,
                    unit: p,
                    weekText: g,
                    weeks: c
                } = t;
                a = [], s = [];
                for (let t = null == g ? void 0 : g.length, r = 0; r < t; r += 1) {
                    o = [e(0, g[r])], s.push(e("td", {
                        style: `font-size:${f.theadFontsize}${p};background:` + f.theadRowBackground
                    }, o))
                }
                a.push(e("tr", 0, s));
                for (let t = null == c ? void 0 : c.length, r = 0; r < t; r += 1) {
                    let t = c[r];
                    s = [];
                    for (let r = null == t ? void 0 : t.length, i = 0; i < r; i += 1) {
                        let r = t[i],
                            l = `${r.year}-${r.month}-${r.day}`;
                        d = "", r.otherMonth || (d += ` ${r.day} `), o = [e(0, d)], s.push(e("td", {
                            style: "font-size:" + f.tbodyFontsize + p,
                            title: !r.otherMonth && l
                        }, o))
                    }
                    a.push(e("tr", 0, s))
                }
                return n = [e("tbody", 0, a)], h = [e("table", i, n)], l = [e("div", {
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${f.x}${p};top:${f.y}${p};height:${f.height}${p};opacity:${f.alpha};width:${f.width}${p};transform:rotate(${f.rotate}deg)`
                }, h)], e(r, 0, l)
            }, init() {
                let t = this.render.bind(this);
                r._fR(3e5, t), this.on("destroy", (() => {
                    r._fQ(t)
                }))
            }, assign(t) {
                this.set(t);
                let e = t.props.weekStart,
                    r = o.slice(e);
                e > 0 && (r = r.concat(o.slice(0, e))), this.set({
                    weekText: r,
                    weekStart: e
                })
            }, render() {
                let t = new Date,
                    e = t.getFullYear(),
                    r = t.getMonth() + 1,
                    i = t.getDate();
                t.setHours(0, 0, 0, 0);
                let l, o = (7 - this.get("weekStart") + new Date(e, r - 1, 1).getDay()) % 7,
                    s = [],
                    d = [],
                    a = ((t, e) => 32 - new Date(t, e - 1, 32).getDate())(e, r);
                for (l = 1; l <= o; l++) d.push({
                    otherMonth: !0
                });
                for (l = 1; l <= a; l++) d.push({
                    year: e,
                    day: l,
                    month: r
                }), (l + o) % 7 == 0 && (s.push(d), d = []);
                let n = d.length;
                if (n) {
                    let t = 7;
                    for (l = n; l < t && (d.push({
                        otherMonth: !0
                    }), (l + 1) % 7 != 0 || (s.push(d), d = [], 6 != s.length)); l++);
                }
                this.digest({
                    year: e,
                    month: r,
                    day: i,
                    weeks: s
                })
            }
        })
    })), s.d("4e/cimage/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r,
                isArray: i
            } = e,
            l = {
                "==": (t, e) => t == e,
                "!=": (t, e) => t != e,
                ">": (t, e) => t > e,
                ">=": (t, e) => t >= e,
                "<": (t, e) => t < e,
                "<=": (t, e) => t <= e
            };
        return r.extend({
            tmpl(t, e, r) {
                let i, l = [],
                    {
                        props: o,
                        text: s,
                        rmap: d,
                        value: a,
                        unit: n
                    } = t,
                    h = o.x,
                    f = o.y,
                    p = o.width,
                    g = o.height,
                    c = o.alpha,
                    u = o.rotate,
                    $ = o.rules;
                if (s) l.push(e(0, s));
                else
                    for (let t = null == $ ? void 0 : $.length, r = 0; r < t; r += 1) {
                        let t = $[r];
                        if (null == d ? void 0 : d[t.use](a, t.value)) {
                            i = `left:${h}${n};top:${f}${n};height:${g}${n};opacity:${c};width:${p}${n};transform:rotate(${u}deg)`, t.mx && (i += " rotateX(180deg)"), t.my && (i += " rotateY(180deg)"), l.push(e("img", {
                                class: "rd-fV rd-gv rd-hW",
                                src: t.image,
                                style: i
                            }, 1));
                            break
                        }
                    }
                return e(r, 0, l)
            }, init() {
                this.set({
                    rmap: l
                })
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r,
                    value: l
                } = e, o = "";
                if (r.id) {
                    let t = r.fields[0];
                    if (r._tip) o = r._tip;
                    else if (r._data) {
                        let e = r._data;
                        i(e) && (e = e[0]), l = e[t.id]
                    } else o = `[绑定:${t.name}]`
                }
                this.set({
                    text: o,
                    value: l
                })
            }, render() {
                this.digest()
            }
        }).static({
            rmap: l
        })
    })), s.d("4e/circle/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                min: r
            } = Math;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    bw: d,
                    am: a
                } = t;
                return l = `border-radius:50%;left:${o.x}${s};top:${o.y}${s};`, d && (l += `border:${d}${s} ${o.bordertype} ${o.bordercolor};`), o.fillcolor && (l += `background:${o.fillcolor};`), l += `height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);` + a(o.animations), i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: i,
                    width: l,
                    height: o
                } = e, s = r(l, o) / 2;
                i > s && (i = s), this.set(t), this.set({
                    bw: i
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/clock/3i", ["3l", "../../3s/40/3i"], (t => {
        let e, r = t("3l"),
            i = t("../../3s/40/3i"),
            l = "div",
            {
                View: o,
                applyStyle: s,
                mark: d,
                node: a,
                State: n
            } = r;
        return s("rd-g1", ".rd-jJ{border-radius:50%}.rd-jK{height:2px;border-radius:1px;width:calc(50% + 3px);top:calc(50% - 1px);left:calc(50% - 15px);transform-origin:15px center}.rd-jL{height:4px;border-radius:2px;width:calc(50% - 15px);top:calc(50% - 2px);left:calc(50% - 12px);transform-origin:12px center}.rd-jM{height:6px;border-radius:3px;width:calc(50% - 25px);top:calc(50% - 3px);left:calc(50% - 10px);transform-origin:10px center}.rd-jN{height:6px;background:#fff6;box-shadow:0 0 0 2px #0006;border-radius:50%;width:6px;top:calc(50% - 3px);left:calc(50% - 3px)}.rd-jO,.rd-jP,.rd-jQ,.rd-jR,.rd-jS,.rd-jT{left:4px;top:calc(50% - 2px);height:4px;width:calc(100% - 8px);border-left:4px solid;border-right:4px solid}.rd-jP{transform:rotate(30deg)}.rd-jQ{transform:rotate(60deg)}.rd-jR{transform:rotate(90deg)}.rd-jS{transform:rotate(120deg)}.rd-jT{transform:rotate(150deg)}"), o.extend({
            tmpl(t, r, i) {
                let o, s, d, {
                    props: a,
                    unit: n,
                    scale: h
                } = t;
                return d = [r(l, {
                    class: "rd-jO rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jP rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jQ rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jR rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jS rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jT rd-gv",
                    style: "border-color:" + a.markColor
                }), r(l, {
                    class: "rd-jM rd-gv",
                    id: "_rd_h_" + i,
                    style: "background-color:" + a.handleColor
                }), r(l, {
                    class: "rd-jL rd-gv",
                    id: "_rd_m_" + i,
                    style: "background-color:" + a.handleColor
                }), r(l, {
                    class: "rd-jK rd-gv",
                    id: "_rd_s_" + i,
                    style: "background-color:" + a.handleColor
                })], e ? d.push(e) : d.push(e = r(l, {
                    $: "d;",
                    class: "rd-jN rd-gv"
                })), s = `left:${a.x}${n};top:${a.y}${n};height:${a.height/h}${n};opacity:${a.alpha};width:${a.width/h}${n};background-color:${a.dialColor};`, 1 != h && (s += `transform:scale(${h});transform-origin:0 0;`), o = [r(l, {
                    class: "rd-gv rd-hW rd-jJ",
                    style: s
                }, d)], r(i, 0, o)
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = d(this, "_fx");
                if (await this.digest({
                    scale: n.get("fA") || 1
                }), t()) {
                    let t = a("_rd_s_" + this.id),
                        e = a("_rd_m_" + this.id),
                        r = a("_rd_h_" + this.id),
                        l = () => {
                            let i = new Date,
                                l = (1e3 * i.getSeconds() + i.getMilliseconds()) / 1e3,
                                o = (60 * i.getMinutes() + l) / 60,
                                s = (60 * i.getHours() + o) / 60;
                            t.style.transform = `rotate(${6*l-90}deg)`, e.style.transform = `rotate(${6*o-90}deg)`, r.style.transform = `rotate(${30*s-90}deg)`
                        };
                    i._fR(32, l), this.on("destroy", (() => {
                        i._fQ(l)
                    }))
                }
            }
        })
    })), s.d("4e/cprogress/3i", ["3l", "../../3j/3n", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/4m"),
            l = "50%",
            o = "none",
            s = "circle",
            {
                View: d,
                isArray: a
            } = e,
            {
                max: n,
                PI: h
            } = Math;
        return d.extend({
            tmpl(t, e, r) {
                let i, d, a, n, {
                    props: h,
                    unit: f,
                    radius: p,
                    border: g,
                    center: c,
                    d1: u,
                    d2: $,
                    text: y,
                    value: m
                } = t;
                return n = [], n.push(e(s, {
                    cx: l,
                    cy: l,
                    r: p,
                    fill: o,
                    stroke: h.background,
                    "stroke-width": g
                }, 1)), d = "", h.roundCap ? d += "round" : d += "butt", n.push(e(s, {
                    cx: l,
                    cy: l,
                    r: p,
                    fill: o,
                    stroke: h.fillcolor,
                    transform: `rotate(-90 ${c} ${c})`,
                    "stroke-width": g,
                    "stroke-dasharray": u + "," + $,
                    "stroke-linecap": d
                }, 1)), h.showText && (a = [e(0, y || m + "%")], n.push(e("text", {
                    x: l,
                    y: l,
                    style: "text-anchor:middle;dominant-baseline:middle",
                    "font-family": h.fontfamily,
                    "font-size": h.fontsize + f,
                    fill: h.forecolor
                }, a))), i = [e("svg", {
                    class: "rd-gv",
                    style: `width:${h.width}${f};height:${h.height}${f};opacity:${h.alpha};left:${h.x}${f};top:` + h.y + f
                }, n)], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: l,
                    value: o,
                    textFormat: s,
                    width: d,
                    border: f
                } = e;
                f = r.fI(f);
                let p = "";
                if (l.id) {
                    let t = l.fields[0];
                    if (l._tip) p = l._tip, o = 60;
                    else if (l._data) {
                        let r = l._data;
                        a(r) && (r = r[0]), o = r[t.id], o = i._jT(s, o, e), !isNaN(o) && isFinite(o) || (o = 0), o < 0 ? o = 0 : o > 100 && (o = 100)
                    } else p = `[绑定:${t.name}]`, o = 60
                }
                let g = r.fI(d),
                    c = n((g - f) / 2, 0),
                    u = 2 * h * c,
                    $ = u * (o / 100),
                    y = u - $;
                this.set({
                    border: f,
                    center: g / 2,
                    d1: $,
                    d2: y,
                    radius: c,
                    value: o,
                    text: p
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/data-celltable/3i", ["3l", "../../3j/3n", "../../42/4m", "../subs/barcode", "../subs/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/4m");
        t("../subs/barcode"), t("../subs/qrcode");
        let l = "div",
            o = "props",
            s = i._jT.bind(i);
        return e.View.extend({
            tmpl(t, e, r, i, s, d) {
                let a, n, h, f, p, g, c, u, $, {
                        props: y,
                        unit: m,
                        toUnit: x,
                        format: _,
                        safeHTML: b,
                        enHTML: w
                    } = t,
                    k = y.borderwidth,
                    v = y.bordertype,
                    j = y.bordercolor,
                    L = y.borderdeed,
                    S = y.rows,
                    z = y.bind,
                    A = ("collapse" == L ? 1 : 2) * k;
                c = [];
                for (let t = null == S ? void 0 : S.length, a = 0; a < t; a += 1) {
                    g = [];
                    for (let t = S[a].cols, c = null == t ? void 0 : t.length, u = 0; u < c; u += 1) {
                        let c = t[u];
                        if (p = [], z._tip) p.push(e(0, z._tip));
                        else {
                            let t, g = c.paddingTop,
                                $ = c.paddingBottom,
                                y = c.paddingLeft,
                                k = c.paddingRight,
                                v = c.width - A - x(1),
                                j = c.height - A - x(1);
                            g > j && (g = j), g + $ > j && ($ = j - g), y > v && (y = v), y + k > v && (k = v - y), f = [], "text" == c.type ? (c.bindKey ? (t = z._data && z._data[c.bindKey], t = _(c.textFormat, t, z._data)) : t = c.textContent, t && (h = [e(0, c.textRichText ? b(t) : w(t), 1)], f.push(e(l, {
                                class: !c.textAutoReturn && "rd-gI"
                            }, h)))) : "image" == c.type ? (t = c.bindKey ? z._data && z._data[c.bindKey] : c.imageContent, t && (n = "", (c.imageRotateX || c.imageRotateY) && (n += ";transform:", c.imageRotateX && (n += "rotateX(180deg)"), c.imageRotateY && (n += " rotateY(180deg)")), f.push(e("img", {
                                class: "rd-fV rd-gp rd-gq",
                                src: t,
                                style: n
                            }, 1)))) : "barcode" == c.type ? (t = c.bindKey ? z._data && z._data[c.bindKey] : c.barcodeContent, t && f.push(e(l, {
                                $$: o,
                                _5: r,
                                class: "rd-gL",
                                style: `height:${j-g-$}${m};align-items:` + c.vpos,
                                _: `4e/subs/barcode?props=${d(s,c,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    u
                                }.d - `)}&value=` + i(t)
                            }))) : "qrcode" == c.type ? (t = c.bindKey ? z._data && z._data[c.bindKey] : c.qrcodeContent, t && f.push(e(l, {
                                $$: o,
                                _5: r,
                                style: "height:" + (j - g - $) + m,
                                _: `4e/subs/qrcode?props=${d(s,c,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    u
                                }.d - `)}&value=` + i(t)
                            }))) : c.bindKey && f.push(e(0, "[未指定数据处理方式]" + (null == t ? "" : t))), n = `padding:${g}${m} ${k}${m} ${$}${m} ${y}${m};width:${v}${m};height:`, c.textAutoReturn ? n += "100%" : n += j + m, n += `;align-items:${c.vpos};justify-content:${c.hpos};opacity:${c.alpha};`, c.background && (n += `background:${c.background};`), "text" == c.type && (n += `color:${c.textForecolor};letter-spacing:${c.textLetterspacing}${m};`, c.textStyleBold && (n += "font-weight:bold;"), c.textStyleItalic && (n += "font-style:italic;"), (c.textStyleUnderline || c.textStyleStrike || c.textStyleOverline) && (n += "text-decoration:", c.textStyleStrike ? n += "line-through" : c.textStyleOverline ? n += "overline" : n += "underline", n += ";"), n += `font-family:${c.textFontfamily};font-size:${c.textFontsize}${m};`), p.push(e(l, {
                                class: "rd-hH rd-gL",
                                style: n
                            }, f))
                        }
                        n = `width:${c.width}${m};height:${c.height}${m};border-left:${k?v:"dotted"} ${k}${m} ${k&&c.bLeft?j:"#0000"};border-top:${k?v:"dotted"} ${k}${m} ${k&&c.bTop?j:"#0000"};border-right:${k?v:"dotted"} ${k}${m} ${k&&c.bRight?j:"#0000"};border-bottom:${k?v:"dotted"} ${k}${m} ` + (k && c.bBottom ? j : "#0000"), "text" != c.type && (n += ";vertical-align:", "flex-start" == c.vpos ? n += "top" : "center" == c.vpos ? n += "middle" : "flex-end" == c.vpos && (n += "bottom")), g.push(e("td", {
                            class: "rd-hm rd-ia rd-hj rd-gw",
                            colspan: 1 != c.colspan && c.colspan,
                            rowspan: 1 != c.rowspan && c.rowspan,
                            style: n
                        }, p))
                    }
                    c.push(e("tr", 0, g))
                }
                return u = [e("tbody", 0, c)], $ = [e("table", {
                    class: "rd-gn rd-hl",
                    style: "border-collapse:" + L
                }, u)], a = [e(l, {
                    class: "rd-gv rd-hW",
                    style: `left:${y.x}${m};top:${y.y}${m};opacity:${y.alpha};width:${y.width}${m};transform:rotate(${y.rotate}deg)`
                }, $)], e(r, 0, a)
            }, init() {
                this.set({
                    toUnit: r.fy,
                    format: s
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/data-coltable/6m", [], (() => ({
        _kg: 120,
        _kh: 200,
        _ki: 100
    }))), s.d("4e/data-coltable/3i", ["3l"], (t => {
        let e, r, i = t("3l"),
            l = "rd-hm rd-ia rd-gI",
            o = "tr",
            s = "thead",
            d = "td",
            a = "tbody";
        return i.View.extend({
            tmpl(t, i, n) {
                var h, f;
                let p, g, c, u, $, y, m, {
                    props: x,
                    unit: _
                } = t;
                if (y = [], null === (f = null === (h = x.bind) || void 0 === h ? void 0 : h.fields) || void 0 === f ? void 0 : f.length) {
                    u = [];
                    for (let t = x.bind.fields, e = null == t ? void 0 : t.length, r = 0; r < e; r += 1) {
                        let e = t[r];
                        c = [i(0, e.name)], g = `width:${x.columns[e.id]}${_};border-color:${x.bordercolor};text-align:${x.cellAlign};height:${x.theadRowHeight}${_};line-height:${x.theadRowHeight}${_};font-size:${x.theadFontsize}${_};color:${x.theadForecolor};`, x.theadRowBackground && (g += "background:" + x.theadRowBackground), u.push(i("th", {
                            class: l,
                            style: g
                        }, c))
                    }
                    if ($ = [i(o, 0, u)], y.push(i(s, 0, $)), $ = [], x.bind)
                        if (x.bind._tip) c = [i(0, x.bind._tip)], u = [i(d, {
                            class: "rd-hm rd-ia rd-hE rd-gs rd-hN rd-gI",
                            colspan: x.bind.fields.length,
                            style: `border-color:${x.bordercolor};height:${x.loadingHeight}${_};line-height:${x.loadingHeight}${_};font-size:` + x.theadFontsize + _
                        }, c)], $.push(i(o, 0, u));
                        else
                            for (let t = x.bind._data, e = null == t ? void 0 : t.length, r = 0; r < e; r += 1) {
                                let e = t[r];
                                u = [];
                                for (let t = x.bind.fields, o = null == t ? void 0 : t.length, s = 0; s < o; s += 1) {
                                    c = [i(0, e[t[s].id])], g = `text-align:${x.cellAlign};height:${x.tbodyRowHeight}${_};line-height:${x.tbodyRowHeight}${_};font-size:${x.tbodyFontsize}${_};color:${x.tbodyForecolor};border-color:${x.bordercolor};`, r % 2 && x.tbodyOddRowBackground ? g += "background:" + x.tbodyOddRowBackground : r % 2 == 0 && x.tbodyEvenRowBackground && (g += "background:" + x.tbodyEvenRowBackground), u.push(i(d, {
                                        class: l,
                                        style: g
                                    }, c))
                                }
                                $.push(i(o, 0, u))
                            }
                        y.push(i(a, 0, $))
                } else c = [e || (e = i(0, "绑定数据"))], g = `height:${x.theadRowHeight}${_};line-height:${x.theadRowHeight}${_};font-size:${x.theadFontsize}${_};color:${x.theadForecolor};text-align:${x.cellAlign};border-color:${x.bordercolor};`, x.theadRowBackground && (g += "background:" + x.theadRowBackground), u = [i("th", {
                    class: l,
                    style: g
                }, c)], $ = [i(o, 0, u)], y.push(i(s, 0, $)), c = [r || (r = i(0, "请先绑定数据"))], g = `height:${x.tbodyRowHeight}${_};line-height:${x.tbodyRowHeight}${_};font-size:${x.tbodyFontsize}${_};color:${x.tbodyForecolor};text-align:${x.cellAlign};border-color:${x.bordercolor};`, x.tbodyOddRowBackground && (g += "background:" + x.tbodyOddRowBackground), u = [i(d, {
                    class: l,
                    style: g
                }, c)], $ = [i(o, 0, u)], y.push(i(a, 0, $));
                return m = [i("table", {
                    class: "rd-gn rd-hl",
                    style: "table-layout:fixed;border-color:" + x.bordercolor
                }, y)], p = [i("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${x.x}${_};top:${x.y}${_};opacity:${x.alpha};width:` + x.width + _
                }, m)], i(n, 0, p)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/data-dtable/3i", ["3l", "../../3j/3n", "../../42/4m", "../subs/barcode", "../subs/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/4m");
        t("../subs/barcode"), t("../subs/qrcode");
        let l = "props",
            o = "div",
            s = "rd-hH rd-gL",
            d = "rd-gL",
            a = i._jT.bind(i),
            n = t => (t += "").length ? t[0].toUpperCase() + t.substring(1) : t;
        return e.View.extend({
            tmpl(t, e, r, i, a, n) {
                var h;
                let f, p, g, c, u, $, y, m, x, _, b, w, {
                        props: k,
                        unit: v,
                        toUnit: j,
                        mmax: L,
                        safeHTML: S,
                        enHTML: z,
                        ftu: A,
                        format: C
                    } = t,
                    I = k.x,
                    T = k.y,
                    M = k.width,
                    P = k.alpha,
                    H = k.hideLabel,
                    F = k.hideFoot,
                    W = k.hideTotal,
                    B = k.borderwidth,
                    q = k.bordertype,
                    V = k.bordercolor,
                    O = k.borderdeed,
                    R = k.rows,
                    N = k.bind,
                    Y = ("collapse" == O ? 1 : 2) * B;
                y = [];
                for (let t = null == R ? void 0 : R.length, f = 0; f < t; f += 1) {
                    let t = R[f];
                    if (t.label && N._data && N._data.length && !H || !t.data && !t.label && !_ && N._showHead || b && !F && N._showFoot || t.total && !W && N._showAcc) {
                        $ = [];
                        for (let y = t.cols, m = null == y ? void 0 : y.length, x = 0; x < m; x += 1) {
                            let m = y[x];
                            if (u = [], N._tip) u.push(e(0, N._tip));
                            else if (null === (h = m.elements) || void 0 === h ? void 0 : h.length)
                                for (let t = m.elements, s = null == t ? void 0 : t.length, d = 0; d < s; d += 1) {
                                    let s = t[d];
                                    u.push(e(o, {
                                        $$: l,
                                        _5: r,
                                        _: `4e/${s.type}/3i?props=${n(a,s.props,`
                                        d;.$ {
                                            f
                                        }.d: .$ {
                                            x
                                        }.d - .$ {
                                            d
                                        }.e_ `)}&unit=` + i(v)
                                    }))
                                } else {
                                    let i = m.paddingTop,
                                        h = m.paddingBottom,
                                        $ = m.paddingLeft,
                                        y = m.paddingRight,
                                        _ = m.width - Y - j(1),
                                        b = L(m.height - Y - j(1), 0);
                                    if (i > b && (i = b), i + h > b && (h = b - i), $ > _ && ($ = _), $ + y > _ && (y = _ - $), c = [], "text" == m.type) g = [e(0, m.textRichText ? S(m.textContent) : z(m.textContent), 1)], c.push(e(o, {
                                        class: !m.textAutoReturn && "rd-gI"
                                    }, g));
                                    else if ("image" == m.type) m.imageContent && (p = "", (m.imageRotateX || m.imageRotateY) && (p += ";transform:", m.imageRotateX && (p += "rotateX(180deg)"), m.imageRotateY && (p += " rotateY(180deg)")), c.push(e("img", {
                                        class: "rd-fV rd-gq rd-gp",
                                        src: m.imageContent,
                                        style: p
                                    }, 1)));
                                    else if ("barcode" == m.type) m.barcodeContent && c.push(e(o, {
                                        $$: l,
                                        _5: r,
                                        class: d,
                                        style: `height:${b-i-h}${v};align-items:` + m.vpos,
                                        _: "4e/subs/barcode?props=" + n(a, m, `d;.${f}.d:.${x}.ea`)
                                    }));
                                    else if ("qrcode" == m.type) m.qrcodeContent && c.push(e(o, {
                                        $$: l,
                                        _5: r,
                                        style: "height:" + (b - i - h) + v,
                                        _: "4e/subs/qrcode?props=" + n(a, m, `d;.${f}.d:.${x}.ea`)
                                    }));
                                    else if (t.total) {
                                        let t = w[x],
                                            r = A(m.type);
                                        "text" == m.type ? (g = [e(0, m.textContent)], c.push(e(o, {
                                            class: !m.textAutoReturn && "rd-gI"
                                        }, g))) : "custom" == m.type ? (g = [e(0, C(m.textFormat, m.totalData, N._data, N._all))], c.push(e(o, {
                                            class: !m.textAutoReturn && "rd-gI"
                                        }, g))) : null != m.totalData[t.bindKey + r] && (g = [e(0, C(m.textFormat, m.totalData[t.bindKey + r], m.totalData))], c.push(e(o, {
                                            class: !m.textAutoReturn && "rd-gI"
                                        }, g)))
                                    }
                                    p = `padding:${i}${v} ${y}${v} ${h}${v} ${$}${v};width:${_}${v};`, m.textAutoReturn && (p += "min-"), p += `height:${b}${v};align-items:${m.vpos};justify-content:${m.hpos};opacity:${m.alpha};`, null != m.textFontsize && (p += `color:${m.textForecolor};letter-spacing:${m.textLetterspacing}${v};`, m.textStyleBold && (p += "font-weight:bold;"), m.textStyleItalic && (p += "font-style:italic;"), (m.textStyleUnderline || m.textStyleStrike || m.textStyleOverline) && (p += "text-decoration:", m.textStyleStrike ? p += "line-through" : m.textStyleOverline ? p += "overline" : p += "underline", p += ";"), p += `font-family:${m.textFontfamily};font-size:${m.textFontsize}${v};`), u.push(e(o, {
                                        class: s,
                                        style: p
                                    }, c))
                                }
                            p = `width:${m.width}${v};height:${m.height}${v};border-left:${B?q:"dotted"} ${B}${v} ${B&&m.bLeft?V:"#0000"};border-top:${B?q:"dotted"} ${B}${v} ${B&&m.bTop?V:"#0000"};border-right:${B?q:"dotted"} ${B}${v} ${B&&m.bRight?V:"#0000"};border-bottom:${B?q:"dotted"} ${B}${v} ${B&&m.bBottom?V:"#0000"};`, m.background && (p += "background:" + m.background), $.push(e("td", {
                                class: "rd-hm rd-ia rd-hj rd-hH rd-gw",
                                colspan: 1 != m.colspan && m.colspan,
                                rowspan: 1 != m.rowspan && m.rowspan,
                                style: p
                            }, u))
                        }
                        y.push(e("tr", 0, $))
                    }
                    if (t.data) {
                        if (w = t.cols, N._data) {
                            let h = N._rHeights;
                            for (let m = N._data, x = null == m ? void 0 : m.length, _ = 0; _ < x; _ += 1) {
                                let x = m[_];
                                $ = [];
                                let b = h && h[_];
                                for (let h = t.cols, y = null == h ? void 0 : h.length, m = 0; m < y; m += 1) {
                                    let t = h[m];
                                    if (u = [], N._tip) u.push(e(0, N._tip));
                                    else {
                                        let h, $ = t.paddingTop,
                                            y = t.paddingBottom,
                                            _ = t.paddingLeft,
                                            w = t.paddingRight,
                                            k = t.width - Y,
                                            j = (b || t.height) - Y;
                                        $ > j && ($ = j), $ + y > j && (y = j - $), _ > k && (_ = k), _ + w > k && (w = k - _), c = [], "text" == t.type ? (t.bindKey && (h = x[t.bindKey], h = C(t.textFormat, h, x)), h && (g = [e(0, t.textRichText ? S(h) : z(h), 1)], c.push(e(o, {
                                            class: !t.textAutoReturn && "rd-gI"
                                        }, g)))) : "image" == t.type ? (t.bindKey && (h = x[t.bindKey]), h && (p = `height:${j-$-y}px;`, (t.imageRotateX || t.imageRotateY) && (p += ";transform:", t.imageRotateX && (p += "rotateX(180deg)"), t.imageRotateY && (p += " rotateY(180deg)")), c.push(e("img", {
                                            class: "rd-fV rd-gp rd-gq",
                                            src: h,
                                            style: p
                                        }, 1)))) : "barcode" == t.type ? (t.bindKey && (h = x[t.bindKey]), h && c.push(e(o, {
                                            $$: l,
                                            _5: r,
                                            class: d,
                                            style: `height:${j-$-y}${v};align-items:` + t.vpos,
                                            _: `4e/subs/barcode?props=${n(a,t,`
                                            d;.$ {
                                                f
                                            }.d: .$ {
                                                m
                                            }.ea `)}&value=` + i(h)
                                        }))) : "qrcode" == t.type ? (t.bindKey && (h = x[t.bindKey]), h && c.push(e(o, {
                                            $$: l,
                                            _5: r,
                                            style: "height:" + (j - $ - y) + v,
                                            _: `4e/subs/qrcode?props=${n(a,t,`
                                            d;.$ {
                                                f
                                            }.d: .$ {
                                                m
                                            }.ea `)}&value=` + i(h)
                                        }))) : t.bindKey && c.push(e(0, "[未指定数据处理方式]" + h)), p = `padding:${$}${v} ${w}${v} ${y}${v} ${_}${v};width:${k}${v};`, t.textAutoReturn && (p += "min-"), p += `height:${j}${v};align-items:${t.vpos};justify-content:${t.hpos};opacity:${t.alpha};`, "text" == t.type && (p += `color:${t.textForecolor};letter-spacing:${t.textLetterspacing}${v};`, t.textStyleBold && (p += "font-weight:bold;"), t.textStyleItalic && (p += "font-style:italic;"), (t.textStyleUnderline || t.textStyleStrike || t.textStyleOverline) && (p += "text-decoration:", t.textStyleStrike ? p += "line-through" : t.textStyleOverline ? p += "overline" : p += "underline", p += ";"), p += `font-family:${t.textFontfamily};font-size:${t.textFontsize}${v};`), u.push(e(o, {
                                            class: s,
                                            style: p
                                        }, c))
                                    }
                                    p = `width:${t.width}${v};border-left:${B?q:"dotted"} ${B}${v} ${B&&t.bLeft?V:"#0000"};border-top:${B?q:"dotted"} ${B}${v} ${B&&t.bTop?V:"#0000"};border-right:${B?q:"dotted"} ${B}${v} ${B&&t.bRight?V:"#0000"};border-bottom:${B?q:"dotted"} ${B}${v} ${B&&t.bBottom?V:"#0000"};`, t.background && (p += "background:" + t.background), $.push(e("td", {
                                        class: "rd-hm rd-ia rd-hj rd-gw",
                                        colspan: 1 != t.colspan && t.colspan,
                                        rowspan: 1 != t.rowspan && t.rowspan,
                                        style: p
                                    }, u))
                                }
                                y.push(e("tr", 0, $))
                            }
                        }
                    } else t.total ? b = 1 : t.label && (_ = 1)
                }
                return m = [e("tbody", 0, y)], x = [e("table", {
                    class: "rd-gn rd-hl",
                    style: "border-collapse:" + O
                }, m)], f = [e(o, {
                    class: "rd-gv rd-hW",
                    style: `left:${I}${v};top:${T}${v};opacity:${P};width:` + M + v
                }, x)], e(r, 0, f)
            }, init() {
                this.set({
                    format: a,
                    toPx: r.fI,
                    toUnit: r.fy,
                    ftu: n
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/data-ftable/3i", ["3l", "../../3j/3n", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/4m"),
            l = i._jT.bind(i),
            o = t => (t += "").length ? t[0].toUpperCase() + t.substring(1) : t;
        return e.View.extend({
            tmpl(t, e, r, i, l, o) {
                var s;
                let d, a, n, h, f, p, g, c, {
                        props: u,
                        unit: $
                    } = t,
                    y = u.borderwidth,
                    m = u.bordertype,
                    x = u.bordercolor,
                    _ = u.borderdeed,
                    b = u.rows,
                    w = u.bind;
                h = [];
                for (let t = null == b ? void 0 : b.length, d = 0; d < t; d += 1) {
                    let t = b[d];
                    if (!t.label && !g && w._showHead || t.label && !u.hideLabel || t.data || t.total && !u.hideTotal || c && w._showFoot) {
                        n = [];
                        for (let h = t.cols, f = null == h ? void 0 : h.length, p = 0; p < f; p += 1) {
                            let t = h[p];
                            if (a = [], w._tip) a.push(e(0, w._tip));
                            else if (null === (s = t.elements) || void 0 === s ? void 0 : s.length)
                                for (let s = t.elements, n = null == s ? void 0 : s.length, h = 0; h < n; h += 1) {
                                    let t = s[h];
                                    a.push(e("div", {
                                        $$: "props",
                                        _5: r,
                                        _: `4e/${t.type}/3i?props=${o(l,t.props,`
                                        d;.$ {
                                            d
                                        }.d: .$ {
                                            p
                                        }.d - .$ {
                                            h
                                        }.e_ `)}&unit=` + i($)
                                    }))
                                }
                            n.push(e("td", {
                                class: "rd-hm rd-ia rd-hj rd-hH rd-gw",
                                colspan: 1 != t.colspan && t.colspan,
                                rowspan: 1 != t.rowspan && t.rowspan,
                                style: `width:${t.width}${$};height:${t.height}${$};border-left:${y?m:"dotted"} ${y}${$} ${y&&t.bLeft?x:"#0000"};border-top:${y?m:"dotted"} ${y}${$} ${y&&t.bTop?x:"#0000"};border-right:${y?m:"dotted"} ${y}${$} ${y&&t.bRight?x:"#0000"};border-bottom:${y?m:"dotted"} ${y}${$} ` + (y && t.bBottom ? x : "#0000")
                            }, a))
                        }
                        h.push(e("tr", 0, n))
                    }
                    t.total ? c = 1 : t.label && (g = 1)
                }
                return f = [e("tbody", 0, h)], p = [e("table", {
                    class: "rd-gn rd-hl",
                    style: "border-collapse:" + _
                }, f)], d = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${u.x}${$};top:${u.y}${$};opacity:${u.alpha};width:` + u.width + $
                }, p)], e(r, 0, d)
            }, init() {
                this.set({
                    format: l,
                    toPx: r.fI,
                    toUnit: r.fy,
                    ftu: o
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/data-repeater/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, {
                    props: p,
                    unit: g
                } = t;
                f = [];
                for (let t = p.rows, o = null == t ? void 0 : t.length, a = 0; a < o; a += 1) {
                    let o = t[a];
                    h = [];
                    for (let t = o.cols, i = null == t ? void 0 : t.length, f = 0; f < i; f += 1) {
                        let i = t[f];
                        n = [];
                        for (let t = i.elements, o = null == t ? void 0 : t.length, h = 0; h < o; h += 1) {
                            let i = t[h];
                            n.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    f
                                }.d - .$ {
                                    h
                                }.e_ `)}&unit=` + d(s, g, "ea")
                            }))
                        }
                        h.push(e(r, {
                            class: "rd-gn rd-go rd-gw rd-hH",
                            style: `height:${o.height}${g};width:${i.width}${g};border-top:${i.borderTopStyle} ${i.borderTopWidth}${g} ${i.borderTopColor};border-right:${i.borderRightStyle} ${i.borderRightWidth}${g} ${i.borderRightColor};border-bottom:${i.borderBottomStyle} ${i.borderBottomWidth}${g} ${i.borderBottomColor};border-left:${i.borderLeftStyle} ${i.borderLeftWidth}${g} ${i.borderLeftColor};border-radius:` + i.borderRadius
                        }, n))
                    }
                    f.push(e(r, i, h))
                }
                return a = [e(r, {
                    class: "rd-gv rd-hW rd-gL rd-gN",
                    style: `left:${p.x}${g};top:${p.y}${g};opacity:${p.alpha};width:${p.width}${g};height:` + p.height + g
                }, f)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/form-checkbox/3i", ["3l"], (t => {
        let e = t("3l"),
            r = {
                checked: "checked"
            },
            {
                View: i,
                node: l,
                dispatch: o,
                isArray: s,
                isObject: d
            } = e;
        return i.extend({
            tmpl(t, e, i) {
                let l, o, s, d, a, n, {
                    props: h,
                    unit: f
                } = t;
                n = [];
                for (let t = h.items, i = null == t ? void 0 : t.length, l = 0; l < i; l += 1) {
                    let i = t[l],
                        o = 0 === l;
                    a = [e("input", {
                        name: h.inputName,
                        class: "rd-fA",
                        type: "checkbox",
                        checked: i.checked,
                        disabled: i.disabled,
                        value: i.value
                    }, 1, r)], d = [e(0, i.text)], a.push(e("span", {
                        style: `color:${h.forecolor};font-size:${h.fontsize}${f};letter-spacing:${h.letterspacing}${f};font-family:${h.fontfamily};margin-left:` + h.textSpace + f
                    }, d)), s = "", o || (s += "margin-", "row" == h.rank ? s += "left" : s += "top", s += ":" + h.itemSpace + f), n.push(e("label", {
                        class: "rd-gL rd-gP rd-gO",
                        style: s
                    }, a))
                }
                return o = "rd-gv rd-hW rd-gL", "hidden" == h.overflow ? o += " rd-hH" : "visible" == h.overflow ? o += " rd-hI" : o += " rd-gF rd-gH rd-hJ rd-gG", "column" == h.rank && (o += " rd-gN"), l = [e("div", {
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`,
                    class: o
                }, n)], e(i, 0, l)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    items: r,
                    bind: i
                } = e;
                if ((null == i ? void 0 : i.id) && i.fields.length) {
                    r.length = 0;
                    let t = i._data,
                        e = i.fields[0].id;
                    s(t) || (t = [t]);
                    for (let i of t) {
                        let t = i[e];
                        d(t) && r.push(t)
                    }
                }
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/form-collect/3i", ["3l", "../../3j/3n", "../../42/4m", "../../42/43", "../../42/4o", "../subs/barcode", "../subs/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/4m"),
            l = t("../../42/43"),
            o = t("../../42/4o");
        t("../subs/barcode"), t("../subs/qrcode");
        let s, d, a = "rd-hm rd-ia rd-hj",
            n = "td",
            h = "div",
            f = "props",
            p = "value",
            g = "rd-fx rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-gv rd-gy",
            c = {
                class: "rd-gL rd-go rd-gn rd-gP rd-h_ rd-g5"
            },
            u = {
                class: "rd-gI"
            },
            $ = {
                _: 1,
                value: p
            },
            y = {
                value: p
            },
            m = {
                selected: "selected"
            },
            {
                View: x,
                mark: _,
                dispatch: b,
                node: w,
                mix: k
            } = e,
            v = i._jT.bind(i),
            j = (t, e) => t.startsWith("_") ? void 0 : e,
            L = t => {
                let e = 0;
                for (let r of t)
                    for (let t of r) t._kH && (e += t._kI);
                return e
            },
            S = t => {
                let e = 0,
                    r = 0,
                    i = 0;
                for (let r of t)
                    for (let t of r) t._kH && (e += t._kI, i++);
                return i > 0 && (r = e / i), r
            };
        return x.extend({
            tmpl(t, e, r, i, l, o) {
                var p;
                let x, _, b, w, k, v, j, L, S, z, A, C, I, {
                        props: T,
                        unit: M,
                        readonly: P,
                        getMaxCol: H,
                        excelTitle: F,
                        toUnit: W,
                        safeHTML: B,
                        enHTML: q,
                        getSumByCell: V,
                        format: O,
                        calcSum: R,
                        calcAvg: N,
                        toPx: Y
                    } = t,
                    X = T.borderwidth,
                    U = T.bordertype,
                    E = T.bordercolor,
                    D = T.borderdeed,
                    K = T.rows,
                    J = T.readonly,
                    G = T.excel,
                    Q = T.excelLeft,
                    Z = T.excelTop,
                    tt = T.excelBackground,
                    et = T.excelForecolor,
                    rt = ("collapse" == D ? 1 : 2) * X,
                    it = 0,
                    lt = P || J;
                if (S = [], G) {
                    w = [], w.push(e(n, {
                        class: a,
                        style: `height:${Z}${M};background:${tt};border:${X?U:"dotted"} ${X}${M} ` + E
                    }));
                    let t = H(T);
                    for (let r = 0; t > r; r++) _ = [e(0, F(r))], b = [e(h, c, _)], w.push(e(n, {
                        class: a,
                        style: `height:${Z}${M};background:${tt};border:${X?U:"dotted"} ${X}${M} ${E};color:` + et
                    }, b));
                    S.push(e("tr", 0, w))
                }
                for (let t = null == K ? void 0 : K.length, x = 0; x < t; x += 1) {
                    let t = K[x];
                    if (t.label && (C = 1), t.total && !T.hideTotal || t.data || t.label && !T.hideLabel || !C && !T.hideHead || I && !T.hideFoot) {
                        w = [], G && (_ = [e(0, ++it)], b = [e(h, c, _)], w.push(e(n, {
                            class: a,
                            style: `width:${Q}${M};background:${tt};border:${X?U:"dotted"} ${X}${M} ${E};color:` + et
                        }, b)));
                        for (let a = t.cols, c = null == a ? void 0 : a.length, S = c - 1, z = 0; z < c; z += 1) {
                            let c = a[z],
                                A = 0 === z,
                                C = z === S;
                            if (b = [], null === (p = c.elements) || void 0 === p ? void 0 : p.length)
                                for (let t = c.elements, s = null == t ? void 0 : t.length, d = 0; d < s; d += 1) {
                                    let s = t[d];
                                    b.push(e(h, {
                                        $$: "props,readonly||eReadonly",
                                        _5: r,
                                        id: s.id,
                                        _: `4e/${s.type}/3i?props=${o(l,s.props,`
                                        d;.$ {
                                            x
                                        }.d: .$ {
                                            z
                                        }.d - .$ {
                                            d
                                        }.e_ `)}&unit=${i(M)}&readonly=` + o(l, lt), _elementinput: r + "_kR()"
                                    }))
                                } else {
                                    let i = c.paddingTop,
                                        a = c.paddingBottom,
                                        n = c.paddingLeft,
                                        p = c.paddingRight,
                                        w = c.width - rt - W(1),
                                        S = c.height - rt - W(1);
                                    if (i > S && (i = S), i + a > S && (a = S - i), n > w && (n = w), n + p > w && (p = w - n), _ = [], "text" == c.type) j = [e(0, c.textRichText ? B(c.textContent) : q(c.textContent), 1)], _.push(e(h, u, j));
                                    else if ("image" == c.type) c.imageContent && (v = "", (c.imageRotateX || c.imageRotateY) && (v += ";transform:", c.imageRotateX && (v += "rotateX(180deg)"), c.imageRotateY && (v += " rotateY(180deg)")), _.push(e("img", {
                                        class: "rd-fV rd-gq rd-gp",
                                        src: c.imageContent,
                                        style: v
                                    }, 1)));
                                    else if ("barcode" == c.type) c.barcodeContent && _.push(e(h, {
                                        $$: f,
                                        _5: r,
                                        class: "rd-gL",
                                        style: `height:${S-i-a}${M};align-items:` + c.vpos,
                                        _: "4e/subs/barcode?props=" + o(l, c, `d;.${x}.d:.${z}.ea`)
                                    }));
                                    else if ("qrcode" == c.type) c.qrcodeContent && _.push(e(h, {
                                        $$: f,
                                        _5: r,
                                        style: "height:" + (S - i - a) + M,
                                        _: "4e/subs/qrcode?props=" + o(l, c, `d;.${x}.d:.${z}.ea`)
                                    }));
                                    else if ("input" == c.type) c.inputMultiline ? (k = "rd-hJ rd-gn rd-go rd-fC", c.inputClassName && (k += " " + c.inputClassName), _.push(e("textarea", {
                                        id: `ipt_${r}_${x}_` + z,
                                        readonly: !0 === lt,
                                        style: `color:${c.inputForecolor};font-size:${c.inputFontsize}${M};letter-spacing:${c.inputLetterspacing}${M};font-family:${c.inputFontfamily};text-align:` + c.inputTextAlign,
                                        placeholder: c.inputplaceholder,
                                        _input: r + `_kQ({cell:'${o(l,c,`
                                        d;.$ {
                                            x
                                        }.d: .$ {
                                            z
                                        }.ea `)}'})`, value: c.inputUserValue || c.inputText, class: k
                                    }, 0, $))) : (k = "rd-fA rd-gn rd-go rd-fB", c.inputClassName && (k += " " + c.inputClassName), _.push(e("input", {
                                        id: `ipt_${r}_${x}_` + z,
                                        readonly: !0 === lt,
                                        style: `color:${c.inputForecolor};font-size:${c.inputFontsize}${M};letter-spacing:${c.inputLetterspacing}${M};font-family:${c.inputFontfamily};text-align:` + c.inputTextAlign,
                                        placeholder: c.inputPlaceholder,
                                        value: c.inputUserValue || c.inputText,
                                        _input: r + `_kQ({cell:'${o(l,c,`
                                        d;.$ {
                                            x
                                        }.d: .$ {
                                            z
                                        }.ea `)}'})`, class: k
                                    }, 1, y)));
                                    else if ("sum" == c.type || "custom" == c.type || "avg" == c.type) {
                                        let t = V(c);
                                        "sum" == c.type ? (j = [e(0, O(c.textFormat, R(t)), 1)], _.push(e(h, u, j))) : "avg" == c.type ? (j = [e(0, O(c.textFormat, N(t)), 1)], _.push(e(h, u, j))) : (j = [e(0, O(c.textFormat, t), 1)], _.push(e(h, u, j)))
                                    } else if ("dropdown" == c.type) {
                                        j = [];
                                        for (let t = c.dropdownItems, r = null == t ? void 0 : t.length, i = 0; i < r; i += 1) {
                                            let r = t[i];
                                            L = [e(0, r.text)], j.push(e("option", {
                                                disabled: r.disabled,
                                                selected: r.checked,
                                                value: r.value
                                            }, L, m))
                                        }
                                        k = "rd-gn rd-go", c.dropdownClassName && (k += " " + c.dropdownClassName), _.push(e("select", {
                                            multiple: c.dropdownMultipleSelect,
                                            readonly: !0 === lt,
                                            style: `color:${c.dropdownForecolor};font-size:${c.dropdownFontsize}${M};letter-spacing:${c.dropdownLetterspacing}${M};font-family:` + c.dropdownFontfamily,
                                            name: c.dropdownName,
                                            _change: r + `_kQ({cell:'${o(l,c,`
                                            d;.$ {
                                                x
                                            }.d: .$ {
                                                z
                                            }.ea `)}'})`, class: k
                                        }, j))
                                    } else _.push(e(0, c.type));
                                    lt || t.data && (A && (j = [s || (s = e(0, ""))], _.push(e("i", {
                                        style: `left:${-45-Y(X)-(G?Y(Q):0)}px;top:${(Y(S)-22)/2}px`,
                                        class: g,
                                        title: "点击复制添加当前行",
                                        _click: r + `_kS({ri:${x}})`
                                    }, j))), C && t.copy && (j = [d || (d = e(0, ""))], _.push(e("i", {
                                        style: `right:${-45-Y(X)}px;top:${(Y(S)-22)/2}px`,
                                        class: g,
                                        title: "点击删除当前行",
                                        _click: r + `_kT({ri:${x}})`
                                    }, j)))), v = `padding:${i}${M} ${p}${M} ${a}${M} ${n}${M};width:${w}${M};height:${S}${M};align-items:${c.vpos};justify-content:${c.hpos};opacity:${c.alpha};`, c.background && (v += `background:${c.background};`), null != c.textFontsize && (v += `color:${c.textForecolor};letter-spacing:${c.textLetterspacing}${M};`, c.textStyleBold && (v += "font-weight:bold;"), c.textStyleItalic && (v += "font-style:italic;"), (c.textStyleUnderline || c.textStyleStrike || c.textStyleOverline) && (v += "text-decoration:", c.textStyleStrike ? v += "line-through" : c.textStyleOverline ? v += "overline" : v += "underline", v += ";"), v += `font-family:${c.textFontfamily};font-size:${c.textFontsize}${M};`), b.push(e(h, {
                                        class: "rd-hH rd-gL",
                                        style: v
                                    }, _))
                                }
                            k = "rd-hm rd-ia rd-hj rd-gw", t.data || (k += " rd-hH"), w.push(e(n, {
                                colspan: 1 != c.colspan && c.colspan,
                                rowspan: 1 != c.rowspan && c.rowspan,
                                style: `width:${c.width}${M};height:${c.height}${M};border-left:${X?U:"dotted"} ${X}${M} ${X&&c.bLeft?E:"#0000"};border-top:${X?U:"dotted"} ${X}${M} ${X&&c.bTop?E:"#0000"};border-right:${X?U:"dotted"} ${X}${M} ${X&&c.bRight?E:"#0000"};border-bottom:${X?U:"dotted"} ${X}${M} ` + (X && c.bBottom ? E : "#0000"),
                                class: k
                            }, b))
                        }
                        S.push(e("tr", 0, w))
                    }
                    t.total && (I = 1)
                }
                return z = [e("tbody", 0, S)], A = [e("table", {
                    class: "rd-gn rd-hl",
                    style: "border-collapse:" + D
                }, z)], x = [e(h, {
                    class: "rd-gv rd-hW",
                    style: `left:${T.x}${M};top:${T.y}${M};opacity:${T.alpha};width:` + T.width + M
                }, A)], e(r, 0, x)
            }, init() {
                this.set({
                    format: v,
                    toPx: r.fI,
                    toUnit: r.fy,
                    excelTitle: l.gr,
                    getMaxCol: t => o.fx(t, 1)._j3,
                    getSumByCell: t => {
                        let {
                            rows: e
                        } = this.get("props"), r = {};
                        for (let i of e)
                            if (i.data)
                                for (let e of i.cols) {
                                    let i = e._kJ;
                                    if (i >= t._kJ && i <= t._kK) {
                                        r[i] || (r[i] = []);
                                        let t, l = e.inputUserValue || e.inputText,
                                            o = parseInt(l, 10);
                                        t = isNaN(o) ? {
                                            _kI: 0,
                                            _kH: 0
                                        } : {
                                            _kI: o,
                                            _kH: 1
                                        }, r[i].push(t)
                                    }
                                }
                            let i = [];
                        for (let t in r) i.push(r[t]);
                        return i
                    },
                    calcSum: L,
                    calcAvg: S
                })
            }, assign(t) {
                t.overrideProps && k(t.props, t.overrideProps), o.fx(t.props, 1), this.set(t)
            }, async render() {
                let t = _(this, "_kL");
                await this.digest();
                let e = await this.getValue();
                t() && !this._kM && (this._kM = 1, this._kN(e))
            }, _kN(t) {
                t || (t = this._kO()), t.elementProps != this._kP && (this._kP = t.elementProps, delete t.id, delete t.type, b(this.root, "elementinput", t))
            }, _kO() {
                var t;
                let e = this.get("props"),
                    r = JSON.stringify(e, j),
                    {
                        rows: i
                    } = e,
                    l = {
                        head: [],
                        label: [],
                        data: [],
                        total: [],
                        foot: []
                    },
                    o = [],
                    s = t => {
                        let e = [];
                        for (let r of t)
                            if ("form-input" == r.type) {
                                let {
                                    userValue: t,
                                    text: i,
                                    inputName: l
                                } = r.props;
                                null == t && (t = i), e.push({
                                    type: "form-input",
                                    value: t,
                                    name: l
                                });
                                let s = w(r.id);
                                s && o.push({
                                    node: s.querySelector("input"),
                                    type: "form-input",
                                    value: t,
                                    name: l
                                })
                            } else e.push(null);
                        return e
                    };
                for (let e = 0; e < i.length; e++) {
                    let r, d = i[e],
                        a = [];
                    for (let r = 0; r < d.cols.length; r++) {
                        let i = d.cols[r];
                        if (null === (t = i.elements) || void 0 === t ? void 0 : t.length) a.push(s(i.elements));
                        else if ("input" == i.type) {
                            let t;
                            t = null != i.inputUserValue ? i.inputUserValue : i.inputText, a.push({
                                value: t,
                                type: "form-collect-input",
                                name: i.inputName
                            }), o.push({
                                node: w(`ipt_${this.id}_${e}_${r}`),
                                type: "form-collect-input",
                                value: t,
                                name: i.inputName
                            })
                        } else if ("sum" == i.type || "custom" == i.type) {
                            let t, {
                                    getSumByCell: e,
                                    format: r,
                                    calcSum: l
                                } = this.get(),
                                o = e(i);
                            t = "sum" == i.type ? r(i.textFormat, l(o)) : r(i.textFormat, o), a.push({
                                type: "total-sum",
                                value: t
                            })
                        } else a.push(null)
                    }
                    d.head ? r = l.head : d.label ? r = l.label : d.data ? r = l.data : d.total ? r = l.total : d.foot && (r = l.foot), r.push(a)
                }
                let d = this.get("id");
                return {
                    id: d,
                    type: "form-collect",
                    props: e,
                    elementId: d,
                    elementType: "form-collect",
                    elementProps: r,
                    elementValue: l,
                    elementInputs: o
                }
            }, getValue() {
                return new Promise((t => {
                    let e = () => {
                        let r = this._kO(),
                            i = 1;
                        for (let t of r.elementInputs)
                            if (!t.node) {
                                i = 0;
                                break
                            }
                        i ? t(r) : setTimeout(e, 50)
                    };
                    setTimeout(e, 50)
                }))
            }, "_kQ<input>" (t) {
                let {
                    cell: e
                } = t.params, r = t.eventTarget;
                e.inputUserValue = r.value;
                let i = this.get("props");
                this.digest({
                    props: i
                }), this._kN()
            }, "_kQ<change>" (t) {}, "_kR<elementinput>" (t) {
                t.stopImmediatePropagation(), this._kN()
            }, "_kS<click>" (t) {
                let {
                    ri: e
                } = t.params, r = this.get("props"), {
                    rows: i
                } = r, l = i[e], s = 0;
                for (let t of i) {
                    if (t.total) break;
                    s++
                }
                o.fz(r, s, {}, 0);
                let d = i[s];
                d.data = !0, d.copy = !0;
                for (let t = l.cols.length; t--;) {
                    let e = l.cols[t],
                        r = d.cols[t],
                        i = JSON.parse(JSON.stringify(e));
                    k(r, i)
                }
                o.fx(r), this.set({
                    props: r
                }), this.render()
            }, "_kT<click>" (t) {
                let {
                    ri: e
                } = t.params, r = this.get("props");
                o.fA(r, e), o.fx(r), this.set({
                    props: r
                }), this.render()
            }
        })
    })), s.d("4e/form-dropdown/3i", ["3l"], (t => {
        let e = t("3l"),
            r = {
                selected: "selected"
            },
            {
                View: i,
                node: l,
                dispatch: o,
                isArray: s,
                isObject: d
            } = e;
        return i.extend({
            tmpl(t, e, i) {
                let l, o, s, d, a, {
                    props: n,
                    unit: h
                } = t;
                d = [];
                for (let t = n.items, i = null == t ? void 0 : t.length, l = 0; l < i; l += 1) {
                    let i = t[l];
                    s = [e(0, i.text)], d.push(e("option", {
                        disabled: i.disabled,
                        selected: i.checked,
                        value: i.value
                    }, s, r))
                }
                return o = "rd-gn rd-go", n.className && (o += " " + n.className), a = [e("select", {
                    multiple: n.multipleSelect,
                    style: `color:${n.forecolor};font-size:${n.fontsize}${h};letter-spacing:${n.letterspacing}${h};font-family:` + n.fontfamily,
                    name: n.inputName,
                    class: o
                }, d)], o = "rd-gv rd-hW rd-gL rd-gP ", "hidden" == n.overflow ? o += " rd-hH" : "visible" == n.overflow ? o += " rd-hI" : o += " rd-hJ", l = [e("div", {
                    style: `left:${n.x}${h};top:${n.y}${h};height:${n.height}${h};opacity:${n.alpha};width:${n.width}${h};transform:rotate(${n.rotate}deg)`,
                    class: o
                }, a)], e(i, 0, l)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    items: r,
                    bind: i,
                    multipleSelect: l
                } = e;
                if (i.id && i.fields.length) {
                    r.length = 0;
                    let t = i._data,
                        e = i.fields[0].id;
                    s(t) || (t = [t]);
                    for (let i of t) {
                        let t = i[e];
                        d(t) && r.push({...t
                        })
                    }
                }
                if (!l) {
                    let t;
                    for (let e = r.length; e--;) {
                        let i = r[e];
                        t ? i.checked && (i.checked = !1) : i.checked && (t = 1)
                    }
                }
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/form-input/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "value",
            i = {
                _: 1,
                value: r
            },
            l = {
                value: r
            },
            {
                View: o,
                node: s,
                dispatch: d,
                isArray: a
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let o, s, d, {
                    props: a,
                    unit: n,
                    readonly: h
                } = t;
                d = [];
                let f = h || a.readonly;
                return a.multiline ? (s = "rd-hJ rd-gn rd-go rd-fC", a.className && (s += " " + a.className), d.push(e("textarea", {
                    id: "ipt_" + r,
                    readonly: !0 === f,
                    style: `color:${a.forecolor};font-size:${a.fontsize}${n};letter-spacing:${a.letterspacing}${n};font-family:${a.fontfamily};text-align:` + a.textAlign,
                    name: a.inputName,
                    placeholder: a.placeholder,
                    _input: r + "_kQ()",
                    value: a.userValue || a.text,
                    class: s
                }, 0, i))) : (s = "rd-fA rd-gn rd-go rd-fB", a.className && (s += " " + a.className), d.push(e("input", {
                    name: a.inputName,
                    id: "ipt_" + r,
                    readonly: !0 === f,
                    style: `color:${a.forecolor};font-size:${a.fontsize}${n};letter-spacing:${a.letterspacing}${n};font-family:${a.fontfamily};text-align:` + a.textAlign,
                    placeholder: a.placeholder,
                    value: a.userValue || a.text,
                    _input: r + "_kQ()",
                    class: s
                }, 1, l))), o = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-gP rd-hH",
                    style: `left:${a.x}${n};top:${a.y}${n};height:${a.height}${n};opacity:${a.alpha};width:${a.width}${n};transform:rotate(${a.rotate}deg)`
                }, d)], e(r, 0, o)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    bind: r
                } = e;
                if (null == r ? void 0 : r.id) {
                    let t = r.fields[0];
                    if (r._tip) e.text = r._tip;
                    else if (r._data) {
                        let i = r._data;
                        a(i) && (i = i[0]);
                        let l = i[t.id];
                        l.value && (e.text = l.value), l.className && (e.className = l.className), l.placeholder && (e.placeholder = l.placeholder), l.markAs && (e.markAs = l.markAs), l.inputName && (e.inputName = l.inputName)
                    } else e.text = `[绑定:${t.name}]`
                }
                this.set(t)
            }, render() {
                this.digest()
            }, getValue() {
                let t = this.get("props"),
                    e = s(`ipt_${this.id}`),
                    r = this.get("id");
                return {
                    id: r,
                    type: "form-input",
                    props: t,
                    elementId: r,
                    elementType: "form-input",
                    elementProps: JSON.stringify(t),
                    elementValue: t.userValue,
                    elementName: t.inputName,
                    elementInput: e
                }
            }, "_kQ<input>" (t) {
                this._i7(t);
                let {
                    eventTarget: e
                } = t, r = e.value, i = this.get("props");
                i.userValue = r, d(this.root, "elementinput", {
                    elementId: this.get("id"),
                    elementType: "form-input",
                    elementProps: JSON.stringify(i),
                    elementValue: r,
                    elementName: i.inputName,
                    elementInput: e
                })
            }
        })
    })), s.d("4e/form-radio/3i", ["3l"], (t => {
        let e = t("3l"),
            r = {
                checked: "checked"
            },
            {
                View: i,
                isArray: l,
                isObject: o
            } = e;
        return i.extend({
            tmpl(t, e, i) {
                let l, o, s, d, a, n, {
                    props: h,
                    unit: f
                } = t;
                n = [];
                for (let t = h.items, i = null == t ? void 0 : t.length, l = 0; l < i; l += 1) {
                    let i = t[l],
                        o = 0 === l;
                    a = [e("input", {
                        name: h.inputName,
                        class: "rd-fA",
                        type: "radio",
                        checked: i.checked,
                        disabled: i.disabled,
                        value: i.value
                    }, 1, r)], d = [e(0, i.text)], a.push(e("span", {
                        style: `color:${h.forecolor};font-size:${h.fontsize}${f};letter-spacing:${h.letterspacing}${f};font-family:${h.fontfamily};margin-left:` + h.textSpace + f
                    }, d)), s = "", o || (s += "margin-", "row" == h.rank ? s += "left" : s += "top", s += ":" + h.itemSpace + f), n.push(e("label", {
                        class: "rd-gL rd-gP rd-gO",
                        style: s
                    }, a))
                }
                return o = "rd-gv rd-hW rd-gL", "hidden" == h.overflow ? o += " rd-hH" : "visible" == h.overflow ? o += " rd-hI" : o += " rd-gF rd-gH rd-hJ rd-gG", "column" == h.rank && (o += " rd-gN"), l = [e("div", {
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`,
                    class: o
                }, n)], e(i, 0, l)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    items: r,
                    bind: i
                } = e;
                if (i.id && i.fields.length) {
                    r.length = 0;
                    let t = i._data,
                        e = i.fields[0].id;
                    l(t) || (t = [t]);
                    for (let i of t) {
                        let t = i[e];
                        o(t) && r.push(t)
                    }
                }
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/formula/3i", ["3l", "../../42/mathjax"], (t => {
        let e = t("3l"),
            r = t("../../42/mathjax"),
            {
                View: i,
                mark: l
            } = e;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    html: d
                } = t;
                return l = [e(0, d, 1)], i = [e("div", {
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);padding:2px;color:${o.color};font-size:` + o.fontsize + s
                }, l)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = l(this, "_fx");
                try {
                    if (window.MathJax || await this.digest({
                        html: "loading..."
                    }), await r(), t()) {
                        let t = this.get("props").text,
                            e = this._kV;
                        t != this._kW && (this._kW = t, e = MathJax.tex2svg(t, {
                            em: 12,
                            ex: 6
                        }).innerHTML, this._kV = e), this.digest({
                            html: e
                        })
                    }
                } catch (e) {
                    t() && this.digest({
                        html: e
                    })
                }
            }
        })
    })), s.d("4e/fx/3i", ["3l", "../../3j/3n", "../../42/fx"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/fx"),
            l = "div",
            {
                View: o,
                mark: s,
                node: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, o, s, {
                    props: d,
                    unit: a,
                    html: n
                } = t;
                return o = [e(0, n)], s = [e(l, {
                    class: "rd-gv",
                    id: "ld_" + r
                }, o), e(l, {
                    id: "fx_" + r
                })], i = [e(l, {
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${d.x}${a};top:${d.y}${a};height:${d.height}${a};opacity:${d.alpha};width:${d.width}${a};transform:rotate(${d.rotate}deg)`
                }, s)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = s(this, "_fx");
                try {
                    if (window.functionPlot ? await this.digest() : await this.digest({
                        html: "loading..."
                    }), await i(), t()) {
                        let {
                            title: t,
                            width: e,
                            height: i,
                            xAxisRange: l,
                            xAxisTitle: o,
                            yAxisRange: s,
                            yAxisTitle: a,
                            grid: n,
                            zoom: h,
                            xLine: f,
                            yLine: p,
                            data: g,
                            annotations: c
                        } = this.get("props"), u = d(`fx_${this.id}`), $ = d(`ld_${this.id}`);
                        u.innerHTML = "", functionPlot({
                            target: u,
                            width: this._fG = r.fI(e),
                            height: this._fH = r.fI(i),
                            yAxis: {
                                domain: s,
                                label: this._k1 = a
                            },
                            xAxis: {
                                domain: l,
                                label: this._kZ = o
                            },
                            tip: {
                                xLine: f,
                                yLine: p
                            },
                            grid: n,
                            disableZoom: h,
                            title: this._kX = t,
                            data: g,
                            annotations: c
                        }), $.innerHTML = "&nbsp;"
                    }
                } catch (e) {
                    t() && this.digest({
                        html: e
                    })
                }
            }
        })
    })), s.d("4e/heat/3i", ["3l", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../42/4m"),
            i = "div",
            l = {
                class: "rd-go rd-gL rd-g9 rd-gP"
            },
            {
                View: o,
                isArray: s
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let o, s, d, a, {
                    props: n,
                    unit: h,
                    value: f,
                    step: p
                } = t;
                s = [];
                for (let t = 0; t < n.bars; t++) s.push(e(i, {
                    style: `height:80%;width:${n.barWidth}${h};background:${n.background};border-radius:` + n.barWidth / 2 + h
                }));
                a = [e(i, l, s)], d = [];
                for (let t = 0; t < n.bars; t++) d.push(e(i, {
                    style: `height:80%;opacity:${t*p*100}%;width:${n.barWidth}${h};background:${n.fillcolor};border-radius:` + n.barWidth / 2 + h
                }));
                return s = [e(i, {
                    class: "rd-gL rd-go rd-g9 rd-gP",
                    style: "width:" + n.width + h
                }, d)], a.push(e(i, {
                    class: "rd-gv rd-ho rd-hH",
                    style: `width:${f}%`
                }, s)), o = [e(i, {
                    class: "rd-gv",
                    style: `left:${n.x}${h};top:${n.y}${h};height:${n.height}${h};opacity:${n.alpha};width:${n.width}${h};transform:rotate(${n.rotate}deg);color:` + n.background
                }, a)], e(r, 0, o)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: i,
                    value: l,
                    textFormat: o,
                    bars: d
                } = e, a = "";
                if (i.id) {
                    let t = i.fields[0];
                    if (i._tip) a = i._tip, l = 60;
                    else if (i._data) {
                        let d = i._data;
                        s(d) && (d = d[0]), l = d[t.id], l = r._jT(o, l, e), !isNaN(l) && isFinite(l) || (l = 0), l < 0 ? l = 0 : l > 100 && (l = 100)
                    } else a = `[绑定:${t.name}]`, l = 60
                }
                this.set({
                    step: 1 / d,
                    value: l,
                    text: a
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/hod-footer/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, p, {
                    props: g,
                    unit: c,
                    stage: u
                } = t;
                p = [];
                for (let t = g.rows, o = null == t ? void 0 : t.length, a = 0; a < o; a += 1) {
                    let o = t[a];
                    f = [];
                    for (let t = o.cols, i = null == t ? void 0 : t.length, n = 0; n < i; n += 1) {
                        let i = t[n];
                        h = [];
                        for (let t = i.elements, o = null == t ? void 0 : t.length, f = 0; f < o; f += 1) {
                            let i = t[f];
                            h.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    n
                                }.d - .$ {
                                    f
                                }.e_ `)}&unit=` + d(s, c, "ea")
                            }))
                        }
                        f.push(e(r, {
                            class: "rd-gn rd-go rd-gw rd-hH",
                            style: `height:${o.height}${c};width:${i.width}${c};border-top:${i.borderTopStyle} ${i.borderTopWidth}${c} ${i.borderTopColor};border-right:${i.borderRightStyle} ${i.borderRightWidth}${c} ${i.borderRightColor};border-bottom:${i.borderBottomStyle} ${i.borderBottomWidth}${c} ${i.borderBottomColor};border-left:${i.borderLeftStyle} ${i.borderLeftWidth}${c} ${i.borderLeftColor};border-radius:` + i.borderRadius
                        }, h))
                    }
                    p.push(e(r, i, f))
                }
                return n = `left:${g.x}${c};`, n += u ? "bottom:0;" : `top:${g.y}${c};`, n += `opacity:${g.alpha};width:${g.width}${c};height:` + g.height + c, a = [e(r, {
                    class: "rd-gv rd-hW rd-gN rd-gL",
                    style: n
                }, p)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/hod-header/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, {
                    props: p,
                    unit: g
                } = t;
                f = [];
                for (let t = p.rows, o = null == t ? void 0 : t.length, a = 0; a < o; a += 1) {
                    let o = t[a];
                    h = [];
                    for (let t = o.cols, i = null == t ? void 0 : t.length, f = 0; f < i; f += 1) {
                        let i = t[f];
                        n = [];
                        for (let t = i.elements, o = null == t ? void 0 : t.length, h = 0; h < o; h += 1) {
                            let i = t[h];
                            n.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    f
                                }.d - .$ {
                                    h
                                }.e_ `)}&unit=` + d(s, g, "ea")
                            }))
                        }
                        h.push(e(r, {
                            class: "rd-gn rd-go rd-gw rd-hH",
                            style: `height:${o.height}${g};width:${i.width}${g};border-top:${i.borderTopStyle} ${i.borderTopWidth}${g} ${i.borderTopColor};border-right:${i.borderRightStyle} ${i.borderRightWidth}${g} ${i.borderRightColor};border-bottom:${i.borderBottomStyle} ${i.borderBottomWidth}${g} ${i.borderBottomColor};border-left:${i.borderLeftStyle} ${i.borderLeftWidth}${g} ${i.borderLeftColor};border-radius:` + i.borderRadius
                        }, n))
                    }
                    f.push(e(r, i, h))
                }
                return a = [e(r, {
                    class: "rd-gv rd-hW rd-gL rd-gN",
                    style: `left:${p.x}${g};top:${p.y}${g};opacity:${p.alpha};width:${p.width}${g};height:` + p.height + g
                }, f)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/hod-hflex/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, {
                    props: p,
                    unit: g
                } = t;
                f = [];
                for (let t = p.rows, o = null == t ? void 0 : t.length, a = 0; a < o; a += 1) {
                    let o = t[a];
                    h = [];
                    for (let t = o.cols, i = null == t ? void 0 : t.length, f = 0; f < i; f += 1) {
                        let i = t[f];
                        n = [];
                        for (let t = i.elements, o = null == t ? void 0 : t.length, h = 0; h < o; h += 1) {
                            let i = t[h];
                            n.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    f
                                }.d - .$ {
                                    h
                                }.e_ `)}&unit=` + d(s, g, "ea")
                            }))
                        }
                        h.push(e(r, {
                            class: "rd-gn rd-go rd-gw rd-hH",
                            style: `height:${o.height}${g};width:${i.width}${g};border-top:${i.borderTopStyle} ${i.borderTopWidth}${g} ${i.borderTopColor};border-right:${i.borderRightStyle} ${i.borderRightWidth}${g} ${i.borderRightColor};border-bottom:${i.borderBottomStyle} ${i.borderBottomWidth}${g} ${i.borderBottomColor};border-left:${i.borderLeftStyle} ${i.borderLeftWidth}${g} ${i.borderLeftColor};border-radius:` + i.borderRadius
                        }, n))
                    }
                    f.push(e(r, i, h))
                }
                return a = [e(r, {
                    class: "rd-gv rd-hW rd-gL rd-gN",
                    style: `left:${p.x}${g};top:${p.y}${g};opacity:${p.alpha};width:${p.width}${g};height:` + p.height + g
                }, f)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/hod-table/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gn rd-go rd-gw rd-hH"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, p, g, c, {
                        props: u,
                        unit: $
                    } = t,
                    y = u.borderwidth,
                    m = u.bordertype,
                    x = u.bordercolor,
                    _ = u.borderdeed,
                    b = u.rows;
                p = [];
                for (let t = null == b ? void 0 : b.length, o = 0; o < t; o += 1) {
                    f = [];
                    for (let t = b[o].cols, a = null == t ? void 0 : t.length, p = 0; p < a; p += 1) {
                        let a = t[p];
                        n = [];
                        for (let t = a.elements, i = null == t ? void 0 : t.length, h = 0; h < i; h += 1) {
                            let i = t[h];
                            n.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                id: i.id,
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    o
                                }.d: .$ {
                                    p
                                }.d - .$ {
                                    h
                                }.e_ `)}&unit=` + d(s, $, "ea")
                            }))
                        }
                        h = [e(r, i, n)], f.push(e("td", {
                            class: "rd-hm rd-ia rd-hj rd-gw",
                            colspan: 1 != a.colspan && a.colspan,
                            rowspan: 1 != a.rowspan && a.rowspan,
                            style: `width:${a.width}${$};height:${a.height}${$};border-left:${y?m:"dotted"} ${y}${$} ${y&&a.bLeft?x:"#0000"};border-top:${y?m:"dotted"} ${y}${$} ${y&&a.bTop?x:"#0000"};border-right:${y?m:"dotted"} ${y}${$} ${y&&a.bRight?x:"#0000"};border-bottom:${y?m:"dotted"} ${y}${$} ` + (y && a.bBottom ? x : "#0000")
                        }, h))
                    }
                    p.push(e("tr", 0, f))
                }
                return g = [e("tbody", 0, p)], c = [e("table", {
                    class: "rd-gn rd-hl",
                    style: "border-collapse:" + _
                }, g)], a = [e(r, {
                    class: "rd-gv rd-hW",
                    style: `left:${u.x}${$};top:${u.y}${$};opacity:${u.alpha};width:${u.width}${$};height:` + u.height + $
                }, c)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/hod-tabs/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL rd-kv rd-gv rd-hW rd-hk rd-hJ"
            },
            l = {
                class: "rd-gv rd-ho rd-ku"
            },
            {
                View: o,
                applyStyle: s
            } = e;
        return s("rd-iL", ".rd-ku{box-shadow:0 -1px #d7dde4}.rd-kv{transform:translate(10px,-100%);width:calc(100% - 20px)}.rd-kw{border-bottom:solid 2px var(--rd-fx)}"), o.extend({
            tmpl(t, e, o, s, d, a) {
                let n, h, f, p, g, {
                    props: c,
                    unit: u
                } = t;
                g = [], p = [];
                for (let t = c.rows, i = null == t ? void 0 : t.length, l = 0; l < i; l += 1) {
                    for (let i = t[l].cols, s = null == i ? void 0 : i.length, d = 0; d < s; d += 1) {
                        f = [e(0, i[d].text)], h = "rd-hF rd-ic rd-gy rd-hd", c.activeTab == d && (h += " rd-kw rd-hD"), p.push(e(r, {
                            _click: o + `_k6({to:${d}})`,
                            class: h
                        }, f))
                    }
                }
                g.push(e(r, i, p));
                for (let t = c.rows, i = null == t ? void 0 : t.length, s = 0; s < i; s += 1) {
                    let i = t[s];
                    p = [];
                    for (let t = i.cols, l = null == t ? void 0 : t.length, n = 0; n < l; n += 1) {
                        let l = t[n];
                        if (n == c.activeTab) {
                            f = [];
                            for (let t = l.elements, i = null == t ? void 0 : t.length, h = 0; h < i; h += 1) {
                                let i = t[h];
                                f.push(e(r, {
                                    $$: "props,unit",
                                    _5: o,
                                    class: "rd-gD",
                                    _: `4e/${i.type}/3i?props=${a(d,i.props,`
                                    d;.$ {
                                        s
                                    }.d: .$ {
                                        n
                                    }.d - .$ {
                                        h
                                    }.e_ `)}&unit=` + a(d, u, "ea")
                                }))
                            }
                            p.push(e(r, {
                                class: "rd-gw rd-hH",
                                style: `height:${i.height}${u};width:` + l.width + u
                            }, f))
                        }
                    }
                    g.push(e(r, l, p))
                }
                return n = [e(r, {
                    class: "rd-gv rd-hW rd-gL rd-gN",
                    style: `left:${c.x}${u};top:${c.y}${u};opacity:${c.alpha};width:${c.width}${u};height:` + c.height + u
                }, g)], e(o, 0, n)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }, "_k6<click>" (t) {
                let {
                    to: e
                } = t.params, r = this.get("props");
                e != r.activeTab && (r.activeTab = e, this.digest({
                    props: r
                }))
            }
        })
    })), s.d("4e/hod-vflex/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "div",
            i = {
                class: "rd-gL rd-gN"
            };
        return e.View.extend({
            tmpl(t, e, l, o, s, d) {
                let a, n, h, f, {
                    props: p,
                    unit: g
                } = t;
                f = [];
                for (let t = p.rows, o = null == t ? void 0 : t.length, a = 0; a < o; a += 1) {
                    let o = t[a];
                    h = [];
                    for (let t = o.cols, i = null == t ? void 0 : t.length, f = 0; f < i; f += 1) {
                        let i = t[f];
                        n = [];
                        for (let t = i.elements, o = null == t ? void 0 : t.length, h = 0; h < o; h += 1) {
                            let i = t[h];
                            n.push(e(r, {
                                $$: "props,unit",
                                _5: l,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${d(s,i.props,`
                                d;.$ {
                                    a
                                }.d: .$ {
                                    f
                                }.d - .$ {
                                    h
                                }.e_ `)}&unit=` + d(s, g, "ea")
                            }))
                        }
                        h.push(e(r, {
                            class: "rd-gn rd-go rd-gw rd-hH",
                            style: `width:${o.width}${g};height:${i.height}${g};border-top:${i.borderTopStyle} ${i.borderTopWidth}${g} ${i.borderTopColor};border-right:${i.borderRightStyle} ${i.borderRightWidth}${g} ${i.borderRightColor};border-bottom:${i.borderBottomStyle} ${i.borderBottomWidth}${g} ${i.borderBottomColor};border-left:${i.borderLeftStyle} ${i.borderLeftWidth}${g} ${i.borderLeftColor};border-radius:` + i.borderRadius
                        }, n))
                    }
                    f.push(e(r, i, h))
                }
                return a = [e(r, {
                    class: "rd-gL rd-gv rd-hW",
                    style: `left:${p.x}${g};top:${p.y}${g};opacity:${p.alpha};width:${p.width}${g};height:` + p.height + g
                }, f)], e(l, 0, a)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/html/3i", ["3l", "../../42/underscore", "../../42/43"], (t => {
        let e = t("3l"),
            r = t("../../42/underscore"),
            i = t("../../42/43"),
            {
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s
                } = t;
                return l = [e(0, o.value, 1)], i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${o.x}${s};top:${o.y}${s};min-height:${o.height}${s};opacity:${o.alpha};width:` + o.width + s
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e
                } = t;
                e.value = i.gm(e.value), this.set(t)
            }, async render() {
                await r();
                let t = this.get("props"),
                    {
                        bind: e
                    } = t;
                e.id && e._data && (t.value = _.template(t.value)({
                    data: e._data,
                    fields: e.fields
                })), this.digest()
            }
        })
    })), s.d("4e/iframe/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r
            } = e;
        return r.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s
                } = t;
                return l = [], o.src && l.push(e("iframe", {
                    src: o.src,
                    class: "rd-gn rd-go",
                    frameborder: o.border ? 1 : 0,
                    sandbox: "" != o.sandbox && o.sandbox,
                    allow: "" != o.allow && o.allow
                })), i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${o.x}${s};top:${o.y}${s};width:${o.width}${s};height:${o.height}${s};opacity:${o.alpha};transform:rotate(${o.rotate}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/image/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r,
                isArray: i
            } = e;
        return r.extend({
            tmpl(t, e, r) {
                let i, l = [],
                    {
                        image: o,
                        props: s,
                        unit: d,
                        text: a
                    } = t;
                return o ? (i = `left:${s.x}${d};top:${s.y}${d};height:${s.height}${d};opacity:${s.alpha};width:${s.width}${d};transform:rotate(${s.rotate}deg)`, s.rotateX && (i += " rotateX(180deg)"), s.rotateY && (i += " rotateY(180deg)"), l.push(e("img", {
                    class: "rd-fV rd-gv rd-hW",
                    src: o,
                    style: i
                }, 1))) : a && l.push(e(0, a)), e(r, 0, l)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r,
                    image: l,
                    webUrl: o
                } = e, s = "";
                if (!l && o && (l = o), r.id) {
                    let t = r.fields[0];
                    if (r._tip) s = r._tip;
                    else if (r._data) {
                        let e = r._data;
                        i(e) && (e = e[0]), l = e[t.id]
                    } else s = `[绑定:${t.name}]`
                }
                this.set({
                    image: l,
                    text: s
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/line/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, {
                props: l,
                unit: o,
                am: s
            } = t;
            return i = [e("div", {
                class: "rd-gv rd-hW",
                style: `left:${l.x}${o};top:${l.y}${o};border-top:${l.height}${o} ${l.bordertype} ${l.color};opacity:${l.alpha};width:${l.width}${o};transform:rotate(${l.rotate}deg);` + s(l.animations)
            })], e(r, 0, i)
        }, assign(t) {
            this.set(t)
        }, render() {
            this.digest()
        }
    }))), s.d("4e/map/3i", ["3l", "../../42/map"], (t => {
        let e = t("3l"),
            r = t("../../42/map"),
            {
                View: i,
                mark: l,
                node: o
            } = e;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, o, s, {
                    props: d,
                    unit: a,
                    error: n,
                    i18n: h
                } = t;
                return l = "", l += n ? ` ${n} ` : ` ${h("ll")} `, o = [e(0, l)], s = [e("div", {
                    id: "tip_" + r,
                    class: "rd-gL rd-go rd-gP rd-h_"
                }, o)], i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${d.x}${a};top:${d.y}${a};height:${d.height}${a};opacity:${d.alpha};width:` + d.width + a,
                    id: "map_" + r
                }, s)], e(r, 0, i)
            }, init() {
                this.on("destroy", (() => {
                    let t = this._l_;
                    t && t.remove()
                }))
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = l(this, "_fx"),
                    e = this.get("props");
                if (this._la) this.digest({
                    error: this._la
                });
                else {
                    if (await this.digest(), !this._l_) try {
                        if (await r(), t()) {
                            let t = o(`map_${this.id}`),
                                r = L.map(t, {
                                    zoom: e.zoom,
                                    center: [e.lat, e.lng],
                                    zoomControl: e.zoomCtrl,
                                    dragging: e.dragging,
                                    doubleClickZoom: e.doubleClickZoom
                                });
                            this._l_ = r, L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                            }).addTo(r), o(`tip_${this.id}`).remove()
                        }
                    } catch (t) {
                        this.digest({
                            error: this._la = t
                        })
                    }
                }
            }
        })
    })), s.d("4e/number/3i", ["3l"], (t => {
        let e = t("3l"),
            r = /\{#\}/g,
            {
                pow: i
            } = Math;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    bw: a,
                    text: n
                } = t;
                return o = [e(0, n)], l = `left:${s.x}${d};top:${s.y}${d};width:${s.width}${d};height:${s.height}${d};opacity:${s.alpha};transform:rotate(${s.rotate}deg);align-items:${s.vpos};justify-content:${s.hpos};color:${s.forecolor};`, s.background && (l += `background:${s.background};`), l += `font-size:${s.fontsize}${d};letter-spacing:${s.letterspacing}${d};line-height:${s.lineheight};`, s.styleBold && (l += "font-weight:bold;"), s.styleItalic && (l += "font-style:italic;"), (s.styleUnderline || s.styleStrike || s.styleOverline) && (l += "text-decoration:", s.styleStrike ? l += "line-through" : s.styleOverline ? l += "overline" : l += "underline", l += ";"), l += `font-family:${s.fontfamily};`, a && (l += `border:${a}${d} ${s.bordertype} ${s.bordercolor};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-hH",
                    style: l
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    text: l,
                    ext: o,
                    borderwidth: s,
                    width: d,
                    height: a
                } = e;
                if (o._fill) {
                    let t, e = 0;
                    if (o.pad) {
                        let t;
                        "AP" == o.fx ? t = o.start + (o._total - 1) * o.step : "GP" == o.fx && (t = o.start * i(o.step, o._total)), e = (t + "").length
                    }
                    let s = o._index;
                    o.reverse && (s = o._total - s - 1), "AP" == o.fx ? t = o.start + s * o.step : "GP" == o.fx && (t = o.start * i(o.step, s)), o.pad && (t = (t + "").padStart(e, "0")), l = l.replace(r, t)
                }
                let n = this.get("mmin")(d, a) / 2;
                s > n && (s = n), this.set({
                    text: l,
                    bw: s
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/pager/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                has: r,
                View: i
            } = e,
            l = /\$\{([a-zA-z0-9_]+)\}/g;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    bw: a,
                    enHTML: n,
                    text: h
                } = t;
                return o = [e(0, n(h), 1)], l = `left:${s.x}${d};top:${s.y}${d};color:${s.forecolor};`, s.background && (l += `background:${s.background};`), l += `font-size:${s.fontsize}${d};height:${s.height}${d};letter-spacing:${s.letterspacing}${d};opacity:${s.alpha};`, s.styleBold && (l += "font-weight:bold;"), s.styleItalic && (l += "font-style:italic;"), (s.styleUnderline || s.styleStrike || s.styleOverline) && (l += "text-decoration:", s.styleStrike ? l += "line-through" : s.styleOverline ? l += "overline" : l += "underline", l += ";"), l += `align-items:${s.vpos};justify-content:${s.hpos};width:${s.width}${d};transform:rotate(${s.rotate}deg);font-family:` + s.fontfamily, a && (l += `;border:${a}${d} ${s.bordertype} ` + s.bordercolor), i = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-hH",
                    style: l
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    text: i,
                    ext: o,
                    borderwidth: s,
                    width: d,
                    height: a
                } = e;
                null == o._totalPage && (o._totalPage = "Y"), null == o._currentPage && (o._currentPage = "X"), i = i.replace(l, ((t, e) => r(o, "_" + e) ? o["_" + e] : t));
                let n = this.get("mmin")(d, a) / 2;
                s > n && (s = n), this.set({
                    bw: s,
                    text: i
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/progressbar/3i", ["3l", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../42/4m"),
            i = "rd-gv",
            {
                View: l,
                isArray: o
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let l, o, s, d, {
                    props: a,
                    unit: n,
                    value: h,
                    text: f
                } = t;
                return s = [], (a.showText || f) && (o = [e(0, f || h + "%")], s.push(e("span", {
                    class: i,
                    style: `transform:translate(50%,-100%);right:0;color:${a.textColor};font-size:` + a.textFontsize + n
                }, o))), d = [e("div", {
                    style: `width:${h}%;background-color:${a.barcolor};border-radius:` + a.radius + n,
                    class: "rd-go rd-gw"
                }, s)], l = [e("div", {
                    class: i,
                    style: `left:${a.x}${n};top:${a.y}${n};height:${a.height}${n};opacity:${a.alpha};width:${a.width}${n};transform:rotate(${a.rotate}deg);background-color:${a.background};border-radius:` + a.radius + n
                }, d)], e(r, 0, l)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: i,
                    value: l,
                    textFormat: s
                } = e, d = "";
                if (i.id) {
                    let t = i.fields[0];
                    if (i._tip) d = i._tip, l = 60;
                    else if (i._data) {
                        let d = i._data;
                        o(d) && (d = d[0]), l = d[t.id], l = r._jT(s, l, e), !isNaN(l) && isFinite(l) || (l = 0), l < 0 ? l = 0 : l > 100 && (l = 100)
                    } else d = `[绑定:${t.name}]`, l = 60
                }
                this.set({
                    value: l,
                    text: d
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/qrcode/3i", ["3l", "../../42/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../42/qrcode"),
            i = "div",
            l = {
                class: "rd-gL rd-gP rd-h_ rd-go"
            },
            {
                View: o,
                mark: s,
                node: d,
                task: a,
                isArray: n
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let o, s, d = [],
                    {
                        error: a,
                        text: n,
                        props: h,
                        unit: f
                    } = t;
                return (a || n) && (s = [], a && (o = [e(0, a)], s.push(e(i, l, o))), s.push(e(i, {
                    id: `_rd_${r}_qr`
                })), d.push(e(i, {
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${h.x}${f};top:${h.y}${f};height:${h.height}${f};opacity:${h.alpha};width:${h.width}${f};transform:rotate(${h.rotate}deg)`
                }, s))), e(r, 0, d)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r,
                    text: i
                } = e;
                if (r.id) {
                    let t = r.fields[0];
                    if (r._tip) i = r._tip;
                    else if (r._data) {
                        let e = r._data;
                        n(e) && (e = e[0]), i = e[t.id]
                    } else i = `[绑定:${t.name}]`
                }
                this.set({
                    text: i
                })
            }, async render() {
                let t = s(this, "_fx");
                await this.digest({
                    error: null
                });
                try {
                    if (await r._jF(), t()) {
                        let e = this.get("text"),
                            r = this.get("props");
                        if (e && (e != this._jL || r.colorDark != this._jM || r.colorLight != this._jN || r.correctLevel != this._jO)) {
                            let i = this._jP;
                            if (!i) {
                                let t = d(`_rd_${this.id}_qr`);
                                i = new QRCode(t, {
                                    width: 512,
                                    height: 512
                                }), this._jP = i
                            }
                            let l = s(this, "_jQ");
                            a((() => {
                                if (t() && l()) {
                                    i._htOption.colorDark = this._jM = r.colorDark, i._htOption.colorLight = this._jN = r.colorLight, i._htOption.correctLevel = this._jO = QRCode.CorrectLevel[r.correctLevel], i.makeCode(this._jL = e), this.root.querySelector("img").classList.add("rd-fV", "rd-gn", "rd-gp")
                                }
                            }))
                        }
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }
        })
    })), s.d("4e/rate/3i", ["3l", "../../42/4m"], (t => {
        let e, r = t("3l"),
            i = t("../../42/4m"),
            l = "rd-fx",
            o = "div",
            s = {
                class: "rd-go rd-gL rd-g9 rd-gP"
            },
            {
                View: d,
                isArray: a
            } = r;
        return d.extend({
            tmpl(t, r, i) {
                let d, a, n, h, f, {
                    props: p,
                    unit: g,
                    value: c
                } = t;
                n = [];
                for (let t = 0; t < p.stars; t++) a = [e || (e = r(0, ""))], n.push(r("i", {
                    class: l,
                    style: "font-size:" + p.starSize + g
                }, a));
                f = [r(o, s, n)], a = [];
                for (let t = 0; t < p.stars; t++) h = [e || (e = r(0, ""))], a.push(r("i", {
                    class: l,
                    style: "font-size:" + p.starSize + g
                }, h));
                return n = [r(o, {
                    class: "rd-gL rd-go rd-g9 rd-gP",
                    style: "width:" + p.width + g
                }, a)], f.push(r(o, {
                    class: "rd-gv rd-ho rd-hH",
                    style: `width:${c}%;color:` + p.fillcolor
                }, n)), d = [r(o, {
                    class: "rd-gv",
                    style: `left:${p.x}${g};top:${p.y}${g};height:${p.height}${g};opacity:${p.alpha};width:${p.width}${g};transform:rotate(${p.rotate}deg);color:` + p.background
                }, f)], r(i, 0, d)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r,
                    value: l,
                    textFormat: o
                } = e, s = "";
                if (r.id) {
                    let t = r.fields[0];
                    if (r._tip) s = r._tip, l = 60;
                    else if (r._data) {
                        let s = r._data;
                        a(s) && (s = s[0]), l = s[t.id], l = i._jT(o, l, e), !isNaN(l) && isFinite(l) || (l = 0), l < 0 ? l = 0 : l > 100 && (l = 100)
                    } else s = `[绑定:${t.name}]`, l = 60
                }
                this.set({
                    value: l,
                    text: s
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/rect/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, l, {
                props: o,
                unit: s,
                btWidth: d,
                brWidth: a,
                bbWidth: n,
                blWidth: h,
                am: f
            } = t;
            return l = `left:${o.x}${s};top:${o.y}${s};border-top:${o.borderTopStyle} ${d}${s} ${o.borderTopColor};border-right:${o.borderRightStyle} ${a}${s} ${o.borderRightColor};border-bottom:${o.borderBottomStyle} ${n}${s} ${o.borderBottomColor};border-left:${o.borderLeftStyle} ${h}${s} ${o.borderLeftColor};`, o.fillcolor && (l += `background:${o.fillcolor};`), l += `height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);border-radius:${o.radius};` + f(o.animations), i = [e("div", {
                class: "rd-gv rd-hW",
                style: l
            })], e(r, 0, i)
        }, assign(t) {
            let {
                props: e
            } = t, {
                borderTopWidth: r,
                borderRightWidth: i,
                borderBottomWidth: l,
                borderLeftWidth: o,
                width: s,
                height: d
            } = e, a = r + l, n = i + o;
            a > d && (r = r / a * d, l = l / a * d), n > s && (i = i / n * s, o = o / n * s), this.set(t), this.set({
                btWidth: r,
                brWidth: i,
                bbWidth: l,
                blWidth: o
            })
        }, render() {
            this.digest()
        }
    }))), s.d("4e/repeat/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r,
                isArray: i
            } = e;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.radius && (l += `border-radius:${o.radius}${s};`), (o.image || o.webUrl) && (l += `background-image:url(${o.image||o.webUrl});`, "full" == o.repeat ? l += "background-size:100% 100%;" : o.imageWidth > 0 && o.imageHeight > 0 && (l += `background-size:${o.imageWidth}${s} ${o.imageHeight}${s};`), l += `background-repeat:${"full"==o.repeat?"no-repeat":o.repeat};background-position:${o.backgroundXOffset}${s} ` + o.backgroundYOffset + s), i = [e("div", {
                    class: "rd-gv rd-hW rd-hH",
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    bind: r
                } = e, l = "";
                if (r.id) {
                    let t = r.fields[0];
                    if (r._tip) l = r._tip;
                    else if (r._data) {
                        let l = r._data;
                        i(l) && (l = l[0]), e.image = l[t.id]
                    } else l = `[绑定:${t.name}]`
                }
                this.set({
                    text: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/richtext/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, l, o, s, {
                props: d,
                unit: a
            } = t;
            return s = [e(0, d.text, 1)], l = "rd-gv rd-hW", d.splitToPages || (l += " rd-hJ"), o = `left:${d.x}${a};top:${d.y}${a};opacity:${d.alpha};width:${d.width}${a};height:`, d.splitToPages ? o += "auto" : o += d.height + a, i = [e("div", {
                class: l,
                style: o
            }, s)], e(r, 0, i)
        }, assign(t) {
            this.set(t)
        }, render() {
            this.digest()
        }
    }))), s.d("4e/rod/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "span";
        return e.View.extend({
            tmpl(t, e, i) {
                let l, o, s, d, {
                        props: a,
                        unit: n
                    } = t,
                    h = a.bordertype,
                    f = a.color;
                return d = [e(r, {
                    style: `flex-grow:1;border-top:1px ${h} ` + f
                })], s = [e(0, a.text)], d.push(e(r, {
                    style: `padding:0 4px;transform:rotate(${a.textRotate}deg);color:` + f
                }, s), e(r, {
                    style: `flex-grow:1;border-top:1px ${h} ` + f
                })), o = `left:${a.x}${n};top:${a.y}${n};opacity:${a.alpha};width:${a.width}${n};height:${a.height}${n};transform:rotate(${a.rotate}deg);`, a.startBorder && (o += `border-left:1px ${h} ${f};`), a.endBorder && (o += `border-right:1px ${h} ${f};`), l = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-gP rd-h_",
                    style: o
                }, d)], e(i, 0, l)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/signature/3i", ["3l", "../../42/signature"], (t => {
        let e = t("3l"),
            r = t("../../42/signature"),
            {
                View: i,
                mark: l,
                node: o
            } = e,
            {
                min: s
            } = Math;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    bw: a
                } = t;
                return o = [e("canvas", {
                    class: "rd-gn rd-go",
                    id: r + "_c"
                })], l = `left:${s.x}${d};top:${s.y}${d};width:${s.width}${d};height:${s.height}${d};opacity:${s.alpha};`, a && (l += `border:${a}${d} ${s.bordertype} ${s.bordercolor};`), i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: l
                }, o)], e(r, 0, i)
            }, init() {
                this.on("destroy", (() => {
                    let t = this._lh;
                    t && t.off()
                }))
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: r,
                    width: i,
                    height: l
                } = e, o = s(i, l) / 2;
                r > o && (r = o), this.set(t), this.set({
                    bw: r
                })
            }, async render() {
                let t = l(this, "_fx");
                if (await r(), await this.digest(), t()) {
                    let t = this._lh,
                        e = this.get("props"),
                        r = o(`${this.id}_c`),
                        i = devicePixelRatio;
                    r.width = r.offsetWidth * i, r.height = r.offsetHeight * i, r.getContext("2d").scale(i, i), t || (t = new SignaturePad(r), this._lh = t), e.background && (t.backgroundColor = e.background), t.penColor = e.pencolor, t.clear()
                }
            }
        })
    })), s.d("4e/subs/barcode", ["3l", "../../3j/3n", "../../42/barcode"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/barcode"),
            {
                View: l,
                task: o,
                mark: s
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l = [],
                    {
                        msg: o,
                        render: s,
                        fill: d
                    } = t;
                return o ? l.push(e(0, o)) : "svg" == s ? l.push(e("svg", {
                    id: r + "_bar",
                    class: "rd-gp rd-gn rd-go rd-gz"
                })) : (i = "rd-fV rd-gp rd-gq", "full" == d && (i += " rd-gn rd-go"), l.push(e("img", {
                    id: r + "_bar",
                    class: i
                }, 1))), e(r, 0, l)
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = s(this, "_fx");
                await this.digest({});
                try {
                    if (await i._jF(), t()) {
                        let {
                            value: e,
                            props: i
                        } = this.get(), {
                            barcodeColor: l,
                            barcodeLineWidth: s,
                            barcodeShowText: d,
                            barcodeFormat: a,
                            barcodeContent: n,
                            barcodeRender: h,
                            barcodeFill: f,
                            barcodeStyleBold: p,
                            barcodeStyleItalic: g,
                            barcodeTextPosition: c,
                            barcodeTextAlign: u,
                            barcodeFont: $,
                            barcodeFontsize: y,
                            barcodeTextMargin: m
                        } = i;
                        await this.digest({
                            msg: null,
                            render: h,
                            fill: f
                        }), o((() => {
                            if (t()) {
                                e || (e = n);
                                let t = "",
                                    i = this.root.offsetHeight;
                                p && (t = "bold"), g && (p && (t += " "), t += "italic"), y = r.fI(y), m = r.fI(m), s = r.fI(s), JsBarcode(`#${this.id}_bar`, e, {
                                    height: i,
                                    lineColor: l,
                                    width: s,
                                    textPosition: c,
                                    textAlign: u,
                                    format: a,
                                    fontSize: y,
                                    fontOptions: t,
                                    displayValue: d,
                                    font: $,
                                    textMargin: m
                                })
                            }
                        }))
                    }
                } catch (e) {
                    t() && this.digest({
                        msg: e.message || e
                    })
                }
            }
        })
    })), s.d("4e/subs/qrcode", ["3l", "../../42/qrcode"], (t => {
        let e = t("3l"),
            r = t("../../42/qrcode"),
            {
                View: i,
                mark: l,
                node: o,
                task: s
            } = e;
        return i.extend({
            tmpl(t, e, r) {
                let i = [],
                    {
                        msg: l,
                        props: o
                    } = t;
                return l ? i.push(e(0, l)) : i.push(e("div", {
                    id: `_rd_${r}_qr`,
                    class: "rd-gL rd-go",
                    style: "align-items:" + o.vpos
                })), e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = l(this, "_fx");
                await this.digest({});
                try {
                    if (await r._jF(), t()) {
                        let {
                            value: e,
                            props: r
                        } = this.get();
                        s((() => {
                            if (t() && (e || (e = r.qrcodeContent), e && (e != this._jL || r.qrcodeColorDark != this._jM || r.qrcodeColorLight != this._jN || r.qrcodeCorrectLevel != this._jO))) {
                                let i = this._jP;
                                if (!i) {
                                    let t = o(`_rd_${this.id}_qr`);
                                    i = new QRCode(t, {
                                        width: 1024,
                                        height: 1024
                                    }), this._jP = i
                                }
                                let d = l(this, "_jQ");
                                s((() => {
                                    if (t() && d()) {
                                        i._htOption.colorDark = this._jM = r.qrcodeColorDark, i._htOption.colorLight = this._jN = r.qrcodeColorLight, i._htOption.correctLevel = this._jO = QRCode.CorrectLevel[r.qrcodeCorrectLevel], i.makeCode(this._jL = e), this.root.querySelector("img").classList.add("rd-fV", "rd-gq", "rd-gp")
                                    }
                                }))
                            }
                        }))
                    }
                } catch (e) {
                    t() && this.digest({
                        msg: e
                    })
                }
            }
        })
    })), s.d("4e/tag/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "rd-kC rd-hk",
            {
                View: i,
                applyStyle: l,
                isArray: o,
                isObject: s
            } = e;
        return l("rd-kI", ".rd-kC{padding:1px 4px;border-radius:2px;text-decoration:none;margin:4px;display:inline-block}"), i.extend({
            tmpl(t, e, i) {
                let l, o, s, d, {
                    props: a,
                    unit: n
                } = t;
                d = [];
                for (let t = a.words, i = null == t ? void 0 : t.length, l = 0; l < i; l += 1) {
                    let i = t[l];
                    i.text && (i.url ? (s = [e(0, i.text)], d.push(e("a", {
                        class: r,
                        style: `background:${i.background};color:` + i.forecolor,
                        href: i.url,
                        rel: "noopener noreferrer",
                        target: "_blank"
                    }, s))) : (s = [e(0, i.text)], d.push(e("span", {
                        class: r,
                        style: `background:${i.background};color:` + i.forecolor
                    }, s))))
                }
                return o = "rd-gv rd-hW", "hidden" == a.overflow ? o += " rd-hH" : "visible" == a.overflow ? o += " rd-hI" : o += " rd-gF rd-gH rd-hJ rd-gG", l = [e("div", {
                    style: `left:${a.x}${n};top:${a.y}${n};width:${a.width}${n};height:${a.height}${n};opacity:${a.alpha};transform:rotate(${a.rotate}deg)`,
                    class: o
                }, d)], e(i, 0, l)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    words: r,
                    bind: i
                } = e;
                if (i.id && i.fields.length) {
                    r.length = 0;
                    let t = i._data,
                        e = i.fields[0].id;
                    o(t) || (t = [t]);
                    for (let i of t) {
                        let t = i[e];
                        s(t) && r.push(t)
                    }
                }
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/text/3i", ["3l", "../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../42/4m"),
            {
                isArray: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    bw: a,
                    safeHTML: n,
                    text: h,
                    enHTML: f
                } = t;
                return o = [e(0, s.richText ? n(h) : f(h), 1)], l = `left:${s.x}${d};top:${s.y}${d};color:${s.forecolor};`, s.background && (l += `background:${s.background};`), l += `font-size:${s.fontsize}${d};min-height:${s.height}${d};letter-spacing:${s.letterspacing}${d};opacity:${s.alpha};line-height:${s.lineheight};`, s.styleBold && (l += "font-weight:bold;"), s.styleItalic && (l += "font-style:italic;"), (s.styleUnderline || s.styleStrike || s.styleOverline) && (l += "text-decoration:", s.styleStrike ? l += "line-through" : s.styleOverline ? l += "overline" : l += "underline", l += ";"), l += `align-items:${s.vpos};justify-content:${s.hpos};width:${s.width}${d};transform:rotate(${s.rotate}deg);font-family:${s.fontfamily};`, a && (l += `border:${a}${d} ${s.bordertype} ${s.bordercolor};`), s.autoReturn ? l += `word-break:break-all;transform-origin:${s.width/2}${d} ${s.height/2}${d};` : l += "max-height:" + s.height + d, i = [e("div", {
                    class: "rd-gv rd-hW rd-gL rd-hH",
                    style: l
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    text: l,
                    bind: o,
                    format: s,
                    borderwidth: d,
                    width: a,
                    height: n
                } = e;
                if (o.id) {
                    let t = o.fields[0];
                    if (o._tip) l = o._tip;
                    else if (o._data) {
                        let e = o._data;
                        i(e) && (e = e[0]), l = e[t.id], l = r._jT(s, l, e)
                    } else l = `[绑定:${t.name}]`
                }
                let h = this.get("mmin")(a, n) / 2;
                d > h && (d = h), this.set({
                    bw: d,
                    text: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/todo/3i", ["3l", "../../3j/3n", "../../3j/45"], (t => {
        let e, r, i = t("3l"),
            l = t("../../3j/3n"),
            o = t("../../3j/45"),
            s = "input",
            d = "div",
            a = {
                class: "rd-i_ rd-kG"
            },
            n = {
                class: "rd-kD rd-ig"
            },
            h = {
                class: "rd-kH rd-gL rd-gP rd-kG"
            },
            f = {
                checked: "checked"
            },
            {
                View: p,
                applyStyle: g,
                node: c,
                State: u
            } = i;
        g("rd-kQ", ".rd-kD{border:solid 1px #ccc9}.rd-kE{background:#eee9}.rd-kF{min-height:40px}.rd-kG{border-bottom:1px solid #ccc9}.rd-kH{height:24px;line-height:24px;padding:0 4px}.rd-kI{display:none}.rd-kH:hover{background:#eee3}.rd-kH:hover .rd-kI{display:block}.rd-kJ{text-decoration:line-through}");
        let $ = /scaleY\(([\d\.]+)\)/;
        return p.extend({
            tmpl(t, i, l) {
                let o, p, g, c, u, $, y, m, {
                    props: x,
                    unit: _,
                    scale: b
                } = t;
                if (g = [i(s, {
                    class: "rd-fA rd-fB rd-gn rd-g7",
                    placeholder: "准备做什么?回车添加待办事项",
                    _keydown: l + "_lA()"
                }, 1)], m = [i(d, a, g)], g = [], x.todos.length) {
                    y = [];
                    for (let t = x.todos, r = null == t ? void 0 : t.length; r--;) {
                        let o = t[r];
                        u = [i(s, {
                            type: "checkbox",
                            checked: o.complete,
                            _change: l + `_lz({index:${r}})`
                        }, 1, f), i(0, o.task)], c = "rd-gL rd-gP rd-gK rd-gI", o.complete && (c += " rd-hE rd-kJ"), $ = [i("label", {
                            class: c
                        }, u)], u = [e || (e = i(0, ""))], $.push(i("i", {
                            class: "rd-fx rd-hN rd-hd rd-hE rd-hG rd-kI",
                            _click: l + `_lB({index:${r}})`
                        }, u)), y.push(i(d, h, $))
                    }
                    g.push(i(d, n, y))
                } else g.push(r || (r = i(0, "暂无待办事项")));
                return c = "rd-i_ rd-kF rd-gh", x.todos.length || (c += " rd-hE"), m.push(i(d, {
                    class: c
                }, g)), p = `left:${x.x}${_};top:${x.y}${_};height:${x.height/b}${_};opacity:${x.alpha};width:${x.width/b}${_};`, 1 != b && (p += `transform:scale(${b});transform-origin:0 0`), o = [i(d, {
                    class: "rd-gv rd-hW rd-kE rd-kD rd-in",
                    _pointerdown: l + "_i8()",
                    _contextmenu: l + "_i8()",
                    id: "todo_" + l,
                    style: p
                }, m)], i(l, 0, o)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest({
                    scale: u.get("fA") || 1
                })
            }, _ly() {
                let t = c(`todo_${this.id}`);
                if (t) {
                    let e = t.childNodes,
                        r = 2 * (u.get("fA") || 1);
                    for (let t = e.length; t--;) {
                        let i = e[t];
                        if (1 == i.nodeType) {
                            r += i.getBoundingClientRect().height
                        }
                    }
                    let i = c("_rd_sc");
                    if (i) {
                        let t = i.parentNode.style.transform.match($);
                        t && (r /= parseFloat(t[1]))
                    }
                    let o = this.get("props");
                    o.height = l.fy(r), this.digest({
                        props: o
                    })
                }
            }, async "_lA<keydown>" ({
                code: t,
                eventTarget: e
            }) {
                if (t == o.fG) {
                    let t = e,
                        r = t.value;
                    if (r) {
                        t.value = "";
                        let e = this.get("props");
                        e.todos.push({
                            task: r,
                            complete: !1
                        }), await this.digest({
                            props: e
                        }), this._ly()
                    }
                }
            }, async "_lB<click>" (t) {
                let {
                    index: e
                } = t.params, r = this.get("props");
                r.todos.splice(e, 1), await this.digest({
                    props: r
                }), this._ly()
            }, "_lz<change>" (t) {
                let {
                    index: e
                } = t.params, r = this.get("props");
                r.todos[e].complete = t.eventTarget.checked, this.digest({
                    props: r
                })
            }, "_i8<pointerdown,contextmenu>" (t) {
                t._hS || (t._hS = 1)
            }
        })
    })), s.d("4e/video/3i", ["3l"], (t => {
        let e = t("3l");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    i18n: a
                } = t;
                return o = [], s.src ? o.push(e("video", {
                    src: s.src,
                    poster: s.poster,
                    controls: s.controls,
                    autoplay: s.autoplay,
                    loop: s.loop,
                    muted: s.muted,
                    style: `width:${s.width}${d};height:` + s.height + d
                })) : (l = [e(0, a("no"))], o.push(e("div", {
                    class: "rd-hH rd-gs",
                    style: `width:${s.width}${d};height:${s.height}${d};line-height:` + s.height + d
                }, l))), i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${s.x}${d};top:${s.y}${d};opacity:${s.alpha};transform:rotate(${s.rotate}deg)`
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/xsheet/3i", ["3l", "../../42/xsheet"], (t => {
        let e = t("3l"),
            r = t("../../42/xsheet"),
            {
                View: i,
                mark: l,
                node: o
            } = e;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, o, s, {
                    props: d,
                    unit: a,
                    error: n,
                    i18n: h
                } = t;
                return l = "", l += n ? ` ${n} ` : ` ${h("ll")} `, o = [e(0, l)], s = [e("div", {
                    id: "_rd_tip_" + r,
                    class: "rd-gL rd-go rd-gP rd-h_"
                }, o)], i = [e("div", {
                    class: "rd-gv rd-hW",
                    style: `left:${d.x}${a};top:${d.y}${a};height:${d.height}${a};opacity:${d.alpha};width:` + d.width + a,
                    id: "_rd_sheet_" + r
                }, s)], e(r, 0, i)
            }, init() {
                this.on("destroy", (() => {
                    this._lC && window.luckysheet && luckysheet.destroy({
                        container: "_rd_sheet_" + this.id
                    })
                }))
            }, assign(t) {
                this.set(t)
            }, async render() {
                let t = l(this, "_fx");
                if (this._la) this.digest({
                    error: this._la
                });
                else {
                    if (await this.digest(), !this._lC) try {
                        if (await r(), t()) {
                            let t = this.get("props");
                            luckysheet.create({
                                showtoolbar: !1,
                                showsheetbar: !1,
                                showinfobar: !1,
                                enableAddBackTop: !1,
                                enableAddRow: !1,
                                sheetFormulaBar: !1,
                                showstatisticBar: !1,
                                data: t.sheetData,
                                cellRightClickConfig: {
                                    copy: !0,
                                    copyAs: !0,
                                    paste: !0,
                                    insertRow: !0,
                                    insertColumn: !0,
                                    deleteRow: !0,
                                    deleteColumn: !0,
                                    deleteCell: !0,
                                    hideRow: !1,
                                    hideColumn: !1,
                                    rowHeight: !1,
                                    columnWidth: !1,
                                    clear: !1,
                                    matrix: !1,
                                    sort: !1,
                                    filter: !1,
                                    chart: !1,
                                    image: !1,
                                    link: !1,
                                    data: !1,
                                    cellFormat: !1
                                },
                                container: "_rd_sheet_" + this.id
                            }), this._lC = 1, o(`_rd_tip_${this.id}`).remove()
                        }
                    } catch (t) {
                        this.digest({
                            error: this._la = t
                        })
                    }
                }
            }
        })
    })), s.d("4e/chart/bar/3i", ["3l", "../../../42/6j", "../../../42/6k"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            {
                node: l,
                View: o,
                mark: s,
                isArray: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = l("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU.dispose()
                    }));
                    let e = ["请绑定数据"],
                        r = [100];
                    this._jU.setOption({
                        tooltip: {
                            trigger: "axis"
                        },
                        xAxis: {
                            data: e
                        },
                        yAxis: {
                            type: "value"
                        },
                        series: [{
                            data: r,
                            type: "bar"
                        }]
                    }, !0), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = s(this, "_fx");
                await this.digest();
                try {
                    if (await i(), t()) {
                        let t = this.get("props");
                        this._jV(), this._jU.setOption({
                            title: {
                                text: t.title,
                                x: t.titleAlign
                            },
                            color: t.color
                        });
                        let e = this._jW,
                            r = JSON.stringify(t.bind);
                        e != r && (this._jW = r, this._jX(t))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }, async _jX(t) {
                let {
                    bind: e
                } = t;
                if (e.id) {
                    let t = s(this, "_jX"),
                        {
                            _ir: i
                        } = await r._jY(e);
                    if (t()) {
                        d(i) || (i = [i]);
                        let t = i[0],
                            r = [],
                            l = [];
                        if (t) {
                            for (let i of e.fields) r.push(i.name), l.push(t[i.id]);
                            this._jU.setOption({
                                xAxis: {
                                    data: r
                                },
                                series: [{
                                    data: l,
                                    type: "bar"
                                }]
                            })
                        }
                    }
                }
            }
        })
    })), s.d("4e/chart/chartjs/3i", ["3l", "../../../42/6j", "../../../42/chart", "../../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/chart"),
            l = t("../../../42/4m"),
            {
                node: o,
                View: s,
                mark: d,
                isArray: a,
                mix: n
            } = e;
        return s.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                    props: s,
                    unit: d,
                    error: a
                } = t;
                return o = [e("canvas", {
                    id: "_rd_chart_c_" + r
                })], l = `left:${s.x}${d};top:${s.y}${d};height:${s.height}${d};opacity:${s.alpha};width:${s.width}${d};transform:rotate(${s.rotate}deg);`, s.background && (l += `background:${s.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3 rd-hH",
                    "data-tip": a || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                }, o)], e(r, 0, i)
            }, init() {
                this.on("destroy", (() => {
                    this._jU && this._jU.destroy()
                }))
            }, assign(t) {
                this.set(t)
            }, _jZ(t) {
                if (this._jU) {
                    let e = this._jU;
                    n(e.config, t), e.update()
                } else {
                    let e = o(`_rd_chart_${this.id}`),
                        r = o(`_rd_chart_c_${this.id}`),
                        i = new Chart(r, t);
                    this._jU = i, e.dataset.tip = ""
                }
            }, async render() {
                let t = d(this, "_fx");
                await this.digest();
                try {
                    await i();
                    let e, o = this.get("props"),
                        {
                            bind: s,
                            options: d
                        } = o;
                    if (s.id) {
                        let {
                            _ir: t
                        } = await r._jY(s);
                        e = t
                    }
                    if (t()) {
                        let t = l._jT(d, e, s.fields),
                            r = JSON.stringify(t);
                        this._j0 != r && (this._j0 = r, this._jZ(t))
                    }
                } catch (e) {
                    t() && (this._jU && (this._jU.destroy(), this._jU = null), this.digest({
                        error: e
                    }))
                }
            }
        })
    })), s.d("4e/chart/funnel/3i", ["3l", "../../../42/6j", "../../../42/6k"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            {
                node: l,
                View: o,
                mark: s,
                isArray: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = l("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU.dispose()
                    })), this._jU.setOption({
                        series: [{
                            type: "funnel",
                            min: 0,
                            max: 100,
                            minSize: "0%",
                            maxSize: "100%",
                            gap: 2,
                            label: {
                                show: !0,
                                position: "inside"
                            },
                            data: [{
                                value: 100,
                                name: "请绑定数据"
                            }]
                        }]
                    }, !0), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = s(this, "_fx");
                await this.digest();
                try {
                    if (await i(), t()) {
                        let t = this.get("props");
                        this._jV(), this._jU.setOption({
                            title: {
                                text: t.title,
                                x: t.titleAlign
                            },
                            color: t.colors
                        });
                        let e = this._jW,
                            r = JSON.stringify(t.bind);
                        e != r && (this._jW = r, this._jX(t))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }, async _jX(t) {
                let {
                    bind: e,
                    showProgress: i,
                    roundCap: l,
                    color: o
                } = t, a = this._jU, {
                    series: n
                } = this._jU.getOption();
                if (e.id) {
                    let t = s(this, "_jX"),
                        {
                            _ir: i
                        } = await r._jY(e);
                    if (t()) {
                        d(i) || (i = [i]);
                        let t = [],
                            r = i[0];
                        if (r) {
                            for (let i of e.fields) t.push({
                                value: r[i.id],
                                name: i.name
                            });
                            n[0].data = t, a.setOption({
                                series: n
                            })
                        }
                    }
                } else n[0].data = [{
                    value: 100,
                    name: "请绑定数据"
                }], a.setOption({
                    series: n
                })
            }
        })
    })), s.d("4e/chart/line/3i", ["3l", "../../../42/6j", "../../../42/6k"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            {
                node: l,
                View: o,
                mark: s,
                isArray: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = l("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU.dispose()
                    })), this._jU.setOption({
                        tooltip: {
                            trigger: "axis"
                        },
                        xAxis: {
                            data: ["请先绑定数据和X轴的数据"]
                        },
                        yAxis: {
                            type: "value"
                        }
                    }, !0), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = s(this, "_fx");
                await this.digest();
                try {
                    if (await i(), t()) {
                        let t = this.get("props");
                        this._jV(), this._jU.setOption({
                            title: {
                                text: t.title,
                                x: t.titleAlign
                            },
                            color: t.colors
                        });
                        let e = this._jW,
                            r = JSON.stringify(t.bind) + JSON.stringify(t.xBind);
                        e != r && (this._jW = r, this._jX(t))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }, async _jX(t) {
                let e = this._jU,
                    {
                        bind: i,
                        xBind: l
                    } = t;
                if (i.id && l.id) {
                    let t = s(this, "_jX"),
                        {
                            _ir: o
                        } = await r._jY(i);
                    if (t()) {
                        d(o) || (o = [o]);
                        let t = [],
                            r = [];
                        for (let e of o) {
                            for (let r of l.fields) t.push(e[r.id]);
                            let o = 0;
                            for (let t of i.fields) {
                                let i = r[o];
                                i || (r[o] = i = {
                                    data: [],
                                    type: "line"
                                }), i.data.push(e[t.id]), o++
                            }
                        }
                        e.setOption({
                            xAxis: {
                                data: t
                            },
                            series: r
                        })
                    }
                } else e.setOption({
                    xAxis: {
                        data: ["请先绑定数据和X轴的数据"]
                    },
                    series: [{
                        data: [],
                        type: "line"
                    }]
                })
            }
        })
    })), s.d("4e/chart/meter/3i", ["3l", "../../../42/6j", "../../../42/6k"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            {
                node: l,
                View: o,
                mark: s,
                isArray: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = l("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU.dispose()
                    })), this._jU.setOption({
                        series: [{
                            type: "gauge",
                            detail: {
                                formatter: "{value}%"
                            },
                            data: [{
                                value: 0,
                                name: "请绑定数据"
                            }],
                            itemStyle: {
                                color: this.get("props").color
                            }
                        }]
                    }, !0), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = s(this, "_fx");
                await this.digest();
                try {
                    if (await i(), t()) {
                        let t = this.get("props");
                        this._jV();
                        let {
                            series: e
                        } = this._jU.getOption();
                        e[0].progress = {
                            show: t.showProgress,
                            roundCap: t.roundCap
                        }, e[0].itemStyle = {
                            color: t.color
                        }, this._jU.setOption({
                            series: e,
                            title: {
                                text: t.title,
                                x: t.titleAlign
                            }
                        });
                        let r = this._jW,
                            i = JSON.stringify(t.bind);
                        r != i && (this._jW = i, this._jX(t))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }, async _jX(t) {
                let {
                    bind: e,
                    showProgress: i,
                    roundCap: l,
                    color: o
                } = t, a = this._jU, {
                    series: n
                } = this._jU.getOption();
                if (e.id) {
                    let t = s(this, "_jX"),
                        {
                            _ir: h
                        } = await r._jY(e);
                    if (t()) {
                        d(h) || (h = [h]);
                        let t = [],
                            r = h[0];
                        if (r) {
                            for (let i of e.fields) t.push({
                                value: r[i.id],
                                name: i.name
                            });
                            n[0].progress = {
                                show: i,
                                roundCap: l
                            }, n[0].itemStyle = {
                                color: o
                            }, n[0].data = t, a.setOption({
                                series: n
                            })
                        }
                    }
                } else n[0].data = [{
                    value: 0,
                    name: "请绑定数据"
                }], a.setOption({
                    series: n
                })
            }
        })
    })), s.d("4e/chart/radar/3i", ["3l", "../../../42/6j", "../../../42/6k", "../../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            l = t("../../../42/4m"),
            {
                node: o,
                View: s,
                mark: d,
                isArray: a
            } = e;
        return s.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = o("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU && this._jU.dispose()
                    })), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = d(this, "_fx");
                await this.digest();
                try {
                    await i();
                    let e, o = this.get("props"),
                        {
                            bind: s,
                            options: d
                        } = o;
                    if (s.id) {
                        let {
                            _ir: t
                        } = await r._jY(s);
                        e = t
                    }
                    if (t()) {
                        this._jV();
                        let t = l._jT(d, e, s.fields);
                        this._jU.setOption(t)
                    }
                } catch (e) {
                    t() && (this._jU && (this._jU.dispose(), this._jU = null), this.digest({
                        error: e
                    }))
                }
            }
        })
    })), s.d("4e/chart/scatter/3i", ["3l", "../../../42/6j", "../../../42/6k", "../../../42/4m"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            l = t("../../../42/4m"),
            {
                node: o,
                View: s,
                mark: d,
                isArray: a
            } = e;
        return s.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = o("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU && this._jU.dispose()
                    })), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = d(this, "_fx");
                await this.digest();
                try {
                    await i();
                    let e, o = this.get("props"),
                        {
                            bind: s,
                            options: d
                        } = o;
                    if (s.id) {
                        let {
                            _ir: t
                        } = await r._jY(s);
                        e = t
                    }
                    if (t()) {
                        this._jV();
                        let t = l._jT(d, e, s.fields);
                        this._jU.setOption(t)
                    }
                } catch (e) {
                    t() && (this._jU && (this._jU.dispose(), this._jU = null), this.digest({
                        error: e
                    }))
                }
            }
        })
    })), s.d("4e/chart/pie/3i", ["3l", "../../../42/6j", "../../../42/6k"], (t => {
        let e = t("3l"),
            r = t("../../../42/6j"),
            i = t("../../../42/6k"),
            {
                node: l,
                View: o,
                mark: s,
                isArray: d
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    error: d
                } = t;
                return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, o.background && (l += `background:${o.background};`), i = [e("div", {
                    class: "rd-gv rd-hW rd-h3",
                    "data-tip": d || "正在加载图表组件...",
                    id: "_rd_chart_" + r,
                    style: l
                })], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, _jV() {
                if (!this._jU) {
                    let t = l("_rd_chart_" + this.id);
                    this._jU = echarts.init(t), this.on("destroy", (() => {
                        this._jU.dispose()
                    })), this._jU.setOption({
                        series: [{
                            data: [{
                                value: 0,
                                name: "请绑定数据"
                            }],
                            type: "pie"
                        }]
                    }, !0), t.dataset.tip = ""
                }
                this._jU.resize()
            }, async render() {
                let t = s(this, "_fx");
                await this.digest();
                try {
                    if (await i(), t()) {
                        let t = this.get("props");
                        this._jV(), this._jU.setOption({
                            title: {
                                text: t.title,
                                x: t.titleAlign
                            },
                            color: t.colors
                        });
                        let e = this._jW,
                            r = JSON.stringify(t.bind);
                        e != r && (this._jW = r, this._jX(t))
                    }
                } catch (e) {
                    t() && this.digest({
                        error: e
                    })
                }
            }, async _jX(t) {
                let {
                    bind: e
                } = t;
                if (e.id) {
                    let t = s(this, "_jX"),
                        {
                            _ir: i
                        } = await r._jY(e);
                    if (t()) {
                        d(i) || (i = [i]);
                        let t = [],
                            r = i[0];
                        if (r) {
                            for (let i of e.fields) t.push({
                                value: r[i.id],
                                name: i.name
                            });
                            this._jU.setOption({
                                series: [{
                                    data: t,
                                    type: "pie"
                                }]
                            })
                        }
                    }
                }
            }
        })
    })), s.d("4e/flow/annotation/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(m);
                return d = [e("path", {
                    d: `M20 0L0 0L0 ${F}L20 ` + F,
                    style: `fill:none;stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), l = `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`, x && (l += ";background:" + x), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: l
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/connector/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = "0 0 8 6",
            l = "auto",
            o = "path",
            s = "marker",
            d = "M4 1L7 3L4 5L1 3z",
            a = "0 0 6 6",
            n = "circle",
            h = "0 0 6 8",
            {
                State: f,
                View: p
            } = e;
        return p.extend({
            tmpl(t, e, r) {
                let f, p, g, c, u, $, {
                        toUnit: y,
                        props: m,
                        unit: x,
                        mmax: _,
                        toNormalScale: b,
                        toPx: w,
                        ox: k,
                        oy: v,
                        enHTML: j
                    } = t,
                    L = y(1),
                    S = m.x,
                    z = m.y,
                    A = m.width,
                    C = m.height,
                    I = m.alpha,
                    T = m.lineType,
                    M = m.endArrow,
                    P = m.color,
                    H = m.startArrow,
                    F = m.startX,
                    W = m.startY,
                    B = m.endX,
                    q = m.endY,
                    V = m.ctrl1X,
                    O = m.ctrl1Y,
                    R = m.ctrl2X,
                    N = m.ctrl2Y,
                    Y = m.linewidth,
                    X = m.dash,
                    U = m.cap,
                    E = m.textRotate,
                    D = m.textPointX,
                    K = m.textOffsetX,
                    J = m.textPointY,
                    G = m.textOffsetY,
                    Q = m.textX,
                    Z = m.textY,
                    tt = m.textWidth,
                    et = m.textHeight,
                    rt = m.points,
                    it = m.textFontsize,
                    lt = m.textForecolor,
                    ot = m.textBackground,
                    st = m.textLetterspacing,
                    dt = m.textFontfamily,
                    at = m.text;
                if (g = [], 2 == M ? (p = [e(o, {
                    d: "M2 1L8 3L2 5z",
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 7,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 3 == M ? (p = [e(o, {
                    d: "M2 1L7 3L2 5z",
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 7,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 4 == M ? (p = [e(o, {
                    d: "M2 1L8 3L2 5",
                    style: "fill:none;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 7,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 5 == M ? (p = [e(o, {
                    d: d,
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 7,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 6 == M ? (p = [e(o, {
                    d: d,
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 7 == M ? (p = [e(n, {
                    cx: 3,
                    cy: 3,
                    r: 2,
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: a,
                    refX: 5,
                    refY: 3,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 6
                }, p))) : 8 == M ? (p = [e(n, {
                    cx: 3,
                    cy: 3,
                    r: 2,
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: a,
                    refX: 6,
                    refY: 3,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 6
                }, p))) : 9 == M && (p = [e(o, {
                    d: "M2 4L6 1M2 4L6 7",
                    style: "fill:none;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "a_" + r,
                    viewBox: h,
                    refX: 6,
                    refY: 4,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 8
                }, p))), 2 == H ? (p = [e(o, {
                    d: "M6 1L0 3L6 5z",
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 1,
                    refY: 3,
                    markerWidth: 8,
                    markerHeight: 6,
                    orient: l
                }, p))) : 3 == H ? (p = [e(o, {
                    d: "M6 1L1 3L6 5z",
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 1,
                    refY: 3,
                    markerWidth: 8,
                    markerHeight: 6,
                    orient: l
                }, p))) : 4 == H ? (p = [e(o, {
                    d: "M6 1L0 3L6 5",
                    style: "fill:none;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 1,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 5 == H ? (p = [e(o, {
                    d: d,
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 1,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 6 == H ? (p = [e(o, {
                    d: d,
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 0,
                    refY: 3,
                    orient: l,
                    markerWidth: 8,
                    markerHeight: 6
                }, p))) : 7 == H ? (p = [e(n, {
                    cx: 3,
                    cy: 3,
                    r: 2,
                    style: "fill:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: a,
                    refX: 1,
                    refY: 3,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 6
                }, p))) : 8 == H ? (p = [e(n, {
                    cx: 3,
                    cy: 3,
                    r: 2,
                    style: "fill:#fff;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: a,
                    refX: 0,
                    refY: 3,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 6
                }, p))) : 9 == H && (p = [e(o, {
                    d: "M4 4L0 1M4 4L0 7",
                    style: "fill:none;stroke:" + P
                }, 1)], g.push(e(s, {
                    id: "as_" + r,
                    viewBox: h,
                    refX: 0,
                    refY: 4,
                    orient: l,
                    markerWidth: 6,
                    markerHeight: 8
                }, p))), $ = [e("defs", 0, g)], c = `M${w(F-S+k)} ` + w(W - z + v), "line" == T) c += "L";
                else if ("bezier" == T) c += `C${w(V-S+k)} ${w(O-z+v)} ${w(R-S+k)} ${w(N-z+v)} `;
                else {
                    for (let t = 0, e = rt.length; t < e; t += 1) {
                        let e = rt[t];
                        c += `L${w(e.x-S+k)} ` + w(e.y - z + v)
                    }
                    c += "L"
                }
                return c += w(B - S + k) + " " + w(q - z + v), $.push(e(o, {
                    style: `fill:none;stroke:${P};stroke-width:` + Y + x,
                    "stroke-dasharray": X + x,
                    "stroke-linecap": U && "round",
                    "marker-start": 1 != H && `url(#as_${r})`,
                    "marker-end": 1 != M && `url(#a_${r})`,
                    d: c
                }, 1)), p = [e(0, j(at), 1)], u = `line-height:${et}${x};font-size:${it}${x};width:${tt}${x};height:${et}${x};color:${lt};`, ot && (u += `background:${ot};`), u += `letter-spacing:${st}${x};font-family:` + dt, g = [e("div", {
                    class: "rd-gs",
                    style: u
                }, p)], $.push(e("foreignObject", {
                    transform: `rotate(${E},${w(D-S+K+k)},${w(J-z+G+v)})`,
                    x: Q - S + K + k + x,
                    y: Z - z + G + v + x,
                    width: tt + x,
                    height: et + x
                }, g)), f = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${S}${x};top:${z}${x};width:${_(b(A),L)}${x};height:${_(b(C),L)}${x};opacity:` + I
                }, $)], e(r, 0, f)
            }, init() {
                this.set({
                    toUnit: r.fy,
                    toNormalScale: r.fz,
                    toPx: r.fI,
                    ox: f.get("fS") || 0,
                    oy: f.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/card/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 ${W/4}L0 ${W}L${F} ${W}L${F} 0L${F/4} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/data/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M40 0L0 ${W}L${F-40} ${W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/decision/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M${F/2} 0L0 ${W/2}L${F/2} ${W}L${F} ${W/2}z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/document/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0L0 ${W}C${F/4} ${1.5*W} ${.75*F} ${W/2} ${F} ${W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/database/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M${F/8} 0L${F/8*7} 0A${F/8} ${W/2} 0 0 1 ${F/8*7} ${W}L${F/8} ${W}A${F/8} ${W/2} 0 0 1 ${F/8} 0M${F/8*7} ${W}A${F/8} ${W/2} 0 0 1 ${F/8*7} 0`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/display/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M${F/8} 0L${F/8*7} 0A${F/8} ${W/2} 0 0 1 ${F/8*7} ${W}L${F/8} ${W}L0 ${W/2}z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/estore/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M${F/8} 0L${F} 0A${F/8} ${W/2} 0 0 0 ${F} ${W}L${F/8} ${W}A${F/8} ${W/2} 0 0 1 ${F/8} 0`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/istore/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = (h(y), h(m));
                return d = [e("path", {
                    d: `M0 0L0 ${F}L${F} ${F}L${F} 0ZM${.1*F} 0L${.1*F} ${F}M0 ${.1*F}L${F} ` + .1 * F,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/manual/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 ${W/4}L0 ${W}L${F} ${W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/moperation/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0L${.1*F} ${W}L${.9*F} ${W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/looplimit/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        mmin: f,
                        ox: p,
                        oy: g,
                        enHTML: c
                    } = t,
                    u = a.alpha,
                    $ = a.x,
                    y = a.y,
                    m = a.width,
                    x = a.height,
                    _ = a.fillColor,
                    b = a.cap,
                    w = a.rotate,
                    k = a.color,
                    v = a.linewidth,
                    j = a.dash,
                    L = a.textX,
                    S = a.textY,
                    z = a.textWidth,
                    A = a.textHeight,
                    C = a.padding,
                    I = a.textFontsize,
                    T = a.textForecolor,
                    M = a.textBackground,
                    P = a.textLetterspacing,
                    H = a.textFontfamily,
                    F = a.text,
                    W = h(m),
                    B = h(x),
                    q = f(W, B);
                return d = [e("path", {
                    d: `M${q/4} 0L0 ${q/4}L0 ${B}L${W} ${B}L${W} ${q/4}L${W-q/4} 0z`,
                    style: `fill:${_||"none"};stroke:${k};stroke-width:` + v + n,
                    "stroke-dasharray": j + n,
                    "stroke-linecap": b && "round"
                }, 1)], o = [e(0, c(F), 1)], l = `padding:${C}${n};font-size:${I}${n};width:${z}${n};color:${T};`, M && (l += `background:${M};`), l += `letter-spacing:${P}${n};font-family:` + H, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: L - $ + p + n,
                    y: S - y + g + n,
                    width: z + n,
                    height: A + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${u};left:${$}${n};top:${y}${n};width:${m}${n};height:${x}${n};transform:rotate(${w}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/pageref/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0L0 ${.75*W}L${F/2} ${W}L${F} ${.75*W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/prepare/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M${F/4} 0L0 ${W/2}L${F/4} ${W}L${F/4*3} ${W}L${F} ${W/2}L${F/4*3} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/parallel/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = (a.fillColor, a.cap),
                    _ = a.rotate,
                    b = a.color,
                    w = a.linewidth,
                    k = a.dash,
                    v = a.textX,
                    j = a.textY,
                    L = a.textWidth,
                    S = a.textHeight,
                    z = a.padding,
                    A = a.textFontsize,
                    C = a.textForecolor,
                    I = a.textBackground,
                    T = a.textLetterspacing,
                    M = a.textFontfamily,
                    P = a.text,
                    H = h(y),
                    F = h(m);
                return d = [e("path", {
                    d: `M0 0L${H} 0M${H} ${F}L0 ` + F,
                    style: `stroke:${b};stroke-width:` + w + n,
                    "stroke-dasharray": k + n,
                    "stroke-linecap": x && "round"
                }, 1)], o = [e(0, g(P), 1)], l = `padding:${z}${n};font-size:${A}${n};width:${L}${n};color:${C};`, I && (l += `background:${I};`), l += `letter-spacing:${T}${n};font-family:` + M, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: v - u + f + n,
                    y: j - $ + p + n,
                    width: L + n,
                    height: S + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${_}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/qdata/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("ellipse", {
                    cx: F / 2,
                    cy: W / 2,
                    rx: F / 2,
                    ry: W / 2,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1), e("path", {
                    d: `M${F/2} ${W}L${F} ` + W,
                    style: `fill:none;stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/ref/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("ellipse", {
                    cx: F / 2,
                    cy: W / 2,
                    rx: F / 2,
                    ry: W / 2,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/process/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0L0 ${W}L${F} ${W}L${F} 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/subprocess/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0L0 ${W}L${F} ${W}L${F} 0ZM${.1*F} 0L${.1*F} ${W}M${.9*F} 0L${.9*F} ` + W,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/terminator/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        ox: h,
                        oy: f,
                        enHTML: p
                    } = t,
                    g = a.alpha,
                    c = a.x,
                    u = a.y,
                    $ = a.width,
                    y = a.height,
                    m = a.fillColor,
                    x = a.cap,
                    _ = a.rotate,
                    b = a.color,
                    w = a.linewidth,
                    k = a.dash,
                    v = a.textX,
                    j = a.textY,
                    L = a.textWidth,
                    S = a.textHeight,
                    z = a.padding,
                    A = a.textFontsize,
                    C = a.textForecolor,
                    I = a.textBackground,
                    T = a.textLetterspacing,
                    M = a.textFontfamily,
                    P = a.text;
                return d = [e("rect", {
                    x: 0,
                    y: 0,
                    width: $ + n,
                    height: y + n,
                    style: `fill:${m||"none"};stroke:${b};stroke-width:` + w + n,
                    "stroke-dasharray": k + n,
                    rx: 20,
                    ry: y / 2 + n,
                    "stroke-linecap": x && "round"
                }, 1)], o = [e(0, p(P), 1)], l = `padding:${z}${n};font-size:${A}${n};width:${L}${n};color:${C};`, I && (l += `background:${I};`), l += `letter-spacing:${T}${n};font-family:` + M, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: v - c + h + n,
                    y: j - u + f + n,
                    width: L + n,
                    height: S + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${g};left:${c}${n};top:${u}${n};width:${$}${n};height:${y}${n};transform:rotate(${_}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/flow/tape/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, o, s, d, {
                        props: a,
                        unit: n,
                        toPx: h,
                        ox: f,
                        oy: p,
                        enHTML: g
                    } = t,
                    c = a.alpha,
                    u = a.x,
                    $ = a.y,
                    y = a.width,
                    m = a.height,
                    x = a.fillColor,
                    _ = a.cap,
                    b = a.rotate,
                    w = a.color,
                    k = a.linewidth,
                    v = a.dash,
                    j = a.textX,
                    L = a.textY,
                    S = a.textWidth,
                    z = a.textHeight,
                    A = a.padding,
                    C = a.textFontsize,
                    I = a.textForecolor,
                    T = a.textBackground,
                    M = a.textLetterspacing,
                    P = a.textFontfamily,
                    H = a.text,
                    F = h(y),
                    W = h(m);
                return d = [e("path", {
                    d: `M0 0C${F/4} ${.5*W} ${.75*F} ${-W/2} ${F} 0L${F} ${W}C${.75*F} ${.5*W} ${.25*F} ${1.5*W} 0 ${W}L0 0z`,
                    style: `fill:${x||"none"};stroke:${w};stroke-width:` + k + n,
                    "stroke-dasharray": v + n,
                    "stroke-linecap": _ && "round"
                }, 1)], o = [e(0, g(H), 1)], l = `padding:${A}${n};font-size:${C}${n};width:${S}${n};color:${I};`, T && (l += `background:${T};`), l += `letter-spacing:${M}${n};font-family:` + P, s = [e("div", {
                    class: "rd-gL rd-go rd-gP rd-h_ rd-hj",
                    style: l
                }, o)], d.push(e("foreignObject", {
                    x: j - u + f + n,
                    y: L - $ + p + n,
                    width: S + n,
                    height: z + n
                }, s)), i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `opacity:${c};left:${u}${n};top:${$}${n};width:${y}${n};height:${m}${n};transform:rotate(${b}deg)`
                }, d)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/lscreen/border-css2/3i", ["3l"], (t => {
        let e, r = t("3l"),
            {
                View: i,
                applyStyle: l
            } = r;
        return l("rd-i5", ".rd-kx{border-radius:10px;border:1px #0174f5 solid;padding:1px;background:#0208171a}.rd-ky{border:2px solid #016ae0;border-radius:10px}"), i.extend({
            tmpl(t, r, i) {
                let l, o, {
                    props: s,
                    unit: d
                } = t;
                return o = e ? [e] : [e = r("div", {
                    $: "d;",
                    class: "rd-gn rd-go rd-ky"
                })], l = [r("div", {
                    class: "rd-gv rd-hW rd-kx",
                    style: `left:${s.x}${d};top:${s.y}${d};height:${s.height}${d};opacity:${s.alpha};width:${s.width}${d};transform:rotate(${s.rotate}deg)`
                }, o)], r(i, 0, l)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/lscreen/border-bg/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, {
                props: l,
                unit: o
            } = t;
            return i = [e("div", {
                class: "rd-gv rd-hW",
                style: `left:${l.x}${o};top:${l.y}${o};height:${l.height}${o};opacity:${l.alpha};width:${l.width}${o};transform:rotate(${l.rotate}deg);background:url(./images/border_1.png);background-size:${l.width}${o} ` + l.height + o
            })], e(r, 0, i)
        }, assign(t) {
            this.set(t)
        }, render() {
            this.digest()
        }
    }))), s.d("4e/lscreen/border-css4/3i", ["3l"], (t => {
        let e, r, i = t("3l"),
            l = "div",
            {
                View: o,
                applyStyle: s
            } = i;
        return s("rd-i8", ".rd-kz{border:1px solid #19ba8b2b;background:#0001}.rd-kA::after,.rd-kA::before,.rd-kB::after,.rd-kB::before{position:absolute;content:'';width:10px;height:10px}.rd-kA::before{border-left:2px solid #02a6b5;left:0;border-top:2px solid #02a6b5}.rd-kA::after{border-right:2px solid #02a6b5;right:0;border-top:2px solid #02a6b5}.rd-kB::before{border-left:2px solid #02a6b5;left:0;bottom:0;border-bottom:2px solid #02a6b5}.rd-kB::after{border-right:2px solid #02a6b5;right:0;bottom:0;border-bottom:2px solid #02a6b5}"), o.extend({
            tmpl(t, i, o) {
                let s, d, {
                    props: a,
                    unit: n
                } = t;
                return d = e ? [e] : [e = i(l, {
                    $: "d;",
                    class: "rd-gv rd-hS rd-gn rd-kA"
                })], r ? d.push(r) : d.push(r = i(l, {
                    $: "d:",
                    class: "rd-gv rd-hS rd-hU rd-gn rd-kB"
                })), s = [i(l, {
                    class: "rd-gv rd-hW rd-kz",
                    style: `left:${a.x}${n};top:${a.y}${n};height:${a.height}${n};opacity:${a.alpha};width:${a.width}${n};transform:rotate(${a.rotate}deg)`
                }, d)], i(o, 0, s)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/lscreen/image/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, l, {
                    props: o,
                    unit: s
                } = t,
                d = o.rotateX,
                a = o.rotateY;
            return l = `left:${o.x}${s};top:${o.y}${s};height:${o.height}${s};opacity:${o.alpha};width:${o.width}${s};transform:rotate(${o.rotate}deg);`, (d || a) && (l += ";transform:", d && (l += "rotateX(180deg)"), a && (l += " rotateY(180deg)")), i = [e("img", {
                class: "rd-fV rd-gv rd-hW",
                src: o.image,
                style: l
            }, 1)], e(r, 0, i)
        }, assign(t) {
            this.set(t)
        }, render() {
            this.digest()
        }
    }))), s.d("4e/svg/arc/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                PI: i,
                cos: l,
                sin: o
            } = Math,
            {
                State: s,
                View: d
            } = e;
        return d.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        toPx: d,
                        startX: a,
                        ox: n,
                        startY: h,
                        oy: f,
                        big: p,
                        endX: g,
                        endY: c
                    } = t,
                    u = o.x,
                    $ = o.y,
                    y = o.width,
                    m = o.height,
                    x = o.rotate,
                    _ = o.rx,
                    b = o.ry,
                    w = o.fillcolor,
                    k = o.closed,
                    v = o.color,
                    j = o.cap,
                    L = o.alpha,
                    S = o.dash,
                    z = o.linewidth,
                    A = o.linejoin;
                return l = [e("path", {
                    d: `M${d(a-u+n)} ${d(h-$+f)}A${d(_)} ${d(b)} 0 ${p?1:0} 1 ${d(g-u+n)} ` + d(c - $ + f) + (k ? "z" : ""),
                    style: `fill:${w||"none"};stroke:${v};stroke-width:${z}${s};opacity:` + L,
                    "stroke-dasharray": S + s,
                    "stroke-linecap": j && "round",
                    "stroke-linejoin": A
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${u}${s};top:${$}${s};width:${y}${s};height:${m}${s};transform:rotate(${x}deg)`
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: s.get("fS") || 0,
                    oy: s.get("fT") || 0
                })
            }, assign(t) {
                this.set(t);
                let {
                    props: e
                } = t, {
                    startAngle: r,
                    endAngle: s,
                    rx: d,
                    ry: a,
                    centerX: n,
                    centerY: h
                } = e;
                r = parseFloat(r), s = parseFloat(s), s < r && ([s, r] = [r, s]);
                let f = s - r;
                f > 360 && (r += 360, f = s - r);
                let p = f >= 180,
                    g = i / 180,
                    c = n + d * l(r * g),
                    u = h + a * o(r * g),
                    $ = n + d * l(s * g),
                    y = h + a * o(s * g);
                this.set({
                    big: p,
                    startX: c,
                    startY: u,
                    endX: $,
                    endY: y
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/battery/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "path",
            {
                min: i
            } = Math;
        return e.View.extend({
            tmpl(t, e, i) {
                let l, o, {
                        props: s,
                        unit: d
                    } = t,
                    a = s.x,
                    n = s.y,
                    h = s.width,
                    f = s.height,
                    p = s.alpha,
                    g = s.rotate,
                    c = s.charging,
                    u = s.fill,
                    $ = s.lightning,
                    y = s.outline,
                    m = s.power,
                    x = 8.1 * (100 - m),
                    _ = 8.1 * m;
                return o = [], o.push(e(r, {
                    fill: u,
                    d: `M330 ${140+x}h350v${_}H330z`
                }, 1)), c && o.push(e(r, {
                    fill: $,
                    d: "M499.712 801.131l97.445-324.376-97.445 12.783V266.735l-93.415 314.798 93.415-29.927zm50.077-772.228h-94.704z",
                    stroke: u,
                    "stroke-width": "10px"
                }, 1)), o.push(e(r, {
                    fill: y,
                    d: "M440 0c-47.368 0-47.368 76.338-48.788 76.338h190.86S582.072 0 534.704 0z"
                }, 1), e(r, {
                    fill: y,
                    d: "M247.742 168.663V919.75c0 99.328 93.712 100.121 93.712 100.121h327.879s93.712 0 93.712-100.12V168.662c0-100.121-93.712-100.121-93.712-100.121H341.454s-93.712 0-93.712 100.12zm427.206-60.45s48.458-.065 48.458 51.234V928.9c0 51.3-48.458 51.3-48.458 51.3H335.84s-48.458 0-48.458-51.3V159.48c0-52.885 48.458-51.3 48.458-51.3h339.11z"
                }, 1)), l = [e("svg", {
                    viewBox: "0 0 1024 1024",
                    class: "rd-gv rd-hW",
                    style: `left:${a}${d};top:${n}${d};width:${h}${d};height:${f}${d};opacity:${p};transform:rotate(${g}deg)`
                }, o)], e(i, 0, l)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: r,
                    width: l,
                    height: o
                } = e, s = i(l, o) / 2;
                r > s && (r = s), this.set(t), this.set({
                    bw: r
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/brace/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        toPx: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate,
                    g = o.color,
                    c = o.linewidth,
                    u = o.alpha,
                    $ = o.dash,
                    y = o.cap,
                    m = d(h),
                    x = d(f);
                return l = [e("path", {
                    d: `M${m} 0C0 0 ${m} ${x/2} 0 ${x/2}M0 ${x/2}C${m} ${x/2} 0 ${x} ${m} ` + x,
                    style: `fill:none;stroke:${g};stroke-width:${c}${s};opacity:` + u,
                    "stroke-dasharray": $ + s,
                    "stroke-linecap": y && "round"
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/bezier3/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = "0 0 16 16",
            l = "auto",
            o = "path",
            s = "marker",
            {
                State: d,
                View: a
            } = e;
        return a.extend({
            tmpl(t, e, r) {
                let d, a, n, h, {
                        props: f,
                        unit: p,
                        toPx: g,
                        ox: c,
                        oy: u
                    } = t,
                    $ = f.x,
                    y = f.y,
                    m = f.width,
                    x = f.height,
                    _ = f.color,
                    b = f.fillcolor,
                    w = f.ctrl1X,
                    k = f.ctrl1Y,
                    v = f.ctrl2X,
                    j = f.ctrl2Y,
                    L = f.ctrl3X,
                    S = f.ctrl3Y,
                    z = f.ctrl4X,
                    A = f.ctrl4Y,
                    C = f.linewidth,
                    I = f.alpha,
                    T = f.startArrow,
                    M = f.endArrow,
                    P = f.cap,
                    H = f.dash,
                    F = f.closed;
                return a = [e(o, {
                    d: "M0 0 L16 8 L0 16z",
                    style: "fill:" + _
                }, 1)], n = [e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)], a = [e(o, {
                    d: "M16 0 L0 8 L16 16z",
                    style: "fill:" + _
                }, 1)], n.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)), h = [e("defs", 0, n), e(o, {
                    d: `M${g(w-$+c)} ${g(k-y+u)}C${g(v-$+c)} ${g(j-y+u)} ${g(L-$+c)} ${g(S-y+u)} ${g(z-$+c)} ` + g(A - y + u) + (F ? "z" : ""),
                    style: `fill:${b||"none"};stroke:${_};stroke-width:${C}${p};opacity:` + I,
                    "stroke-dasharray": H + p,
                    "marker-start": T && `url(#as_${r})`,
                    "marker-end": M && `url(#a_${r})`,
                    "stroke-linecap": P && "round"
                }, 1)], d = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${$}${p};top:${y}${p};width:${m}${p};height:` + x + p
                }, h)], e(r, 0, d)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: d.get("fS") || 0,
                    oy: d.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/bezier2/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = "0 0 16 16",
            l = "auto",
            o = "path",
            s = "marker",
            {
                State: d,
                View: a
            } = e;
        return a.extend({
            tmpl(t, e, r) {
                let d, a, n, h, {
                        props: f,
                        unit: p,
                        toPx: g,
                        ox: c,
                        oy: u
                    } = t,
                    $ = f.x,
                    y = f.y,
                    m = f.width,
                    x = f.height,
                    _ = f.color,
                    b = f.ctrl1X,
                    w = f.ctrl1Y,
                    k = f.ctrl2X,
                    v = f.ctrl2Y,
                    j = f.ctrl3X,
                    L = f.ctrl3Y,
                    S = f.fillcolor,
                    z = f.linewidth,
                    A = f.alpha,
                    C = f.startArrow,
                    I = f.endArrow,
                    T = f.cap,
                    M = f.dash,
                    P = f.closed;
                return a = [e(o, {
                    d: "M0 0 L16 8 L0 16z",
                    style: "fill:" + _
                }, 1)], n = [e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)], a = [e(o, {
                    d: "M16 0 L0 8 L16 16z",
                    style: "fill:" + _
                }, 1)], n.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)), h = [e("defs", 0, n), e(o, {
                    d: `M${g(b-$+c)} ${g(w-y+u)}Q${g(k-$+c)} ${g(v-y+u)} ${g(j-$+c)} ` + g(L - y + u) + (P ? "z" : ""),
                    style: `fill:${S||"none"};stroke:${_};stroke-width:${z}${p};opacity:` + A,
                    "stroke-dasharray": M + p,
                    "marker-start": C && `url(#as_${r})`,
                    "marker-end": I && `url(#a_${r})`,
                    "stroke-linecap": T && "round"
                }, 1)], d = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${$}${p};top:${y}${p};width:${m}${p};height:` + x + p
                }, h)], e(r, 0, d)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: d.get("fS") || 0,
                    oy: d.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/ellipse/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                State: r,
                View: i
            } = e;
        return i.extend({
            tmpl(t, e, r) {
                let i, l, {
                    props: o,
                    unit: s,
                    ox: d,
                    oy: a
                } = t;
                return l = [e("ellipse", {
                    cx: o.centerX - o.x + d + s,
                    cy: o.centerY - o.y + a + s,
                    rx: o.rx + s,
                    ry: o.ry + s,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${o.x}${s};top:${o.y}${s};width:${o.width}${s};height:${o.height}${s};transform:rotate(${o.rotate}deg)`
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    ox: r.get("fS") || 0,
                    oy: r.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/circle/3i", ["3l"], (t => t("3l").View.extend({
        tmpl(t, e, r) {
            let i, l, {
                    props: o,
                    unit: s
                } = t,
                d = o.x,
                a = o.y,
                n = o.width,
                h = o.height,
                f = o.r,
                p = o.fillcolor,
                g = o.linewidth,
                c = o.alpha,
                u = o.dash,
                $ = o.cap;
            return l = [e("circle", {
                r: f + s,
                cx: f + s,
                cy: f + s,
                style: `fill:${p||"none"};stroke:${o.color};stroke-width:${g}${s};opacity:` + c,
                "stroke-dasharray": u + s,
                "stroke-linecap": $ && "round"
            }, 1)], i = [e("svg", {
                class: "rd-hI rd-gv rd-hW",
                style: `left:${d}${s};top:${a}${s};width:${n}${s};height:` + h + s
            }, l)], e(r, 0, i)
        }, assign(t) {
            this.set(t)
        }, render() {
            this.digest()
        }
    }))), s.d("4e/svg/line/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = "0 0 16 16",
            l = "auto",
            o = "path",
            s = "marker",
            {
                State: d,
                View: a
            } = e;
        return a.extend({
            tmpl(t, e, r) {
                let d, a, n, h, {
                        props: f,
                        mmax: p,
                        unit: g,
                        toPx: c,
                        ox: u,
                        oy: $
                    } = t,
                    y = f.width,
                    m = f.height,
                    x = f.x,
                    _ = f.y,
                    b = f.color,
                    w = f.ctrl1X,
                    k = f.ctrl1Y,
                    v = f.ctrl2X,
                    j = f.ctrl2Y,
                    L = f.linewidth,
                    S = f.alpha,
                    z = f.dash,
                    A = f.startArrow,
                    C = f.endArrow,
                    I = f.cap;
                return a = [e(o, {
                    d: "M0 0 L16 8 L0 16z",
                    style: "fill:" + b
                }, 1)], n = [e(s, {
                    id: "a_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)], a = [e(o, {
                    d: "M16 0 L0 8 L16 16z",
                    style: "fill:" + b
                }, 1)], n.push(e(s, {
                    id: "as_" + r,
                    viewBox: i,
                    refX: 8,
                    refY: 8,
                    markerWidth: 8,
                    markerHeight: 8,
                    orient: l
                }, a)), h = [e("defs", 0, n), e(o, {
                    d: `M${c(w-x+u)} ${c(k-_+$)}L${c(v-x+u)} ` + c(j - _ + $),
                    style: `fill:none;stroke:${b};stroke-width:${L}${g};opacity:` + S,
                    "stroke-dasharray": z + g,
                    "marker-start": A && `url(#as_${r})`,
                    "marker-end": C && `url(#a_${r})`,
                    "stroke-linecap": I && "round"
                }, 1)], d = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `width:${p(y,1)}${g};height:${p(m,1)}${g};left:${x}${g};top:` + _ + g
                }, h)], e(r, 0, d)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: d.get("fS") || 0,
                    oy: d.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/fan/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r
            } = e;
        return r.extend({
            tmpl(t, e, r) {
                let i, l, o, {
                        props: s,
                        unit: d
                    } = t,
                    a = s.x,
                    n = s.y,
                    h = s.width,
                    f = s.height,
                    p = s.alpha,
                    g = s.fill,
                    c = s.working,
                    u = s.speed;
                return l = [], c && l.push(e("animateTransform", {
                    attributeName: "transform",
                    attributeType: "XML",
                    type: "rotate",
                    from: "0 500 510",
                    to: "360 500 510",
                    dur: u + "s",
                    repeatCount: "indefinite"
                }, 1)), o = [e("path", {
                    d: "M941.376 595.693c-15.633-99.283-108.77-158.96-225.173-146.083-48.627 5.366-134.595 45.824-145.204 20.339-18.51-86.894 90.139-112.135 169.397-116.183 103.305-5.291 137.717-64.237 87.554-153.447C774.318 104.928 639.771 47.324 552 82.173c-90.306 35.85-127.715 134.389-100.112 265.985 7.074 33.509 39.706 77.992-12.949 92.087-39.238 10.535-65.287-28.484-75.089-67.847-7.804-31.46-15.95-63.334-18.899-95.502-10.217-111.914-71.212-140.547-165.985-76.334-94.038 63.75-141.129 186.372-97.012 270.216 56.36 107.111 152.837 115.744 258.217 92.453 34.02-7.535 79.916-39.556 92.746 14.608 8.584 36.339-31.217 60.679-69.213 75.261-31.802 12.241-62.895 15.998-96.208 17.656-105.185 5.171-135.523 61.58-84.067 152.617 54.021 95.624 190.958 151.399 277.289 112.94 97.331-43.336 152.473-156.738 102.137-289.75-4.391-24.192-33.604-54.335-5.534-67.163 26.848-12.242 50.676 8.413 63.918 27.411 31.021 44.582 44.287 93.062 38.192 151.181-7.584 72.233 32.874 107.134 107.988 93.453 97.964-17.876 190.1-153.131 173.957-255.752z m-440.662-46.678c-21.122 0-38.24-17.121-38.24-38.239 0-21.12 17.118-38.24 38.24-38.24 21.122 0 38.24 17.12 38.24 38.24 0 21.118-17.118 38.239-38.24 38.239z",
                    fill: g
                }, l)], i = [e("svg", {
                    viewBox: "0 0 1024 1024",
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${a}${d};top:${n}${d};width:${h}${d};height:${f}${d};opacity:` + p
                }, o)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/heart/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                View: r
            } = e;
        return r.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        am: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate,
                    g = o.animations,
                    c = o.fill,
                    u = o.alpha;
                return l = [e("path", {
                    d: "M706.024 122C840.746 122 945 224.268 945 356.383c0 158.703-141.855 286.703-358.154 480.274L573.51 848.59 510.5 904l-63.011-55.41-32.988-29.529C209.304 635.221 76 510.228 76 356.383 76 224.268 180.254 122 314.975 122c76.038 0 147.704 34.089 195.525 89.497C558.32 156.09 629.988 122 706.024 122z",
                    fill: c
                }, 1)], i = [e("svg", {
                    viewBox: "0 0 1024 1024",
                    class: "rd-gv rd-hW rd-hH",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};opacity:${u};transform:rotate(${p}deg);` + d(g)
                }, l)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/polyline2/3i", ["3l", "../../../3j/3n", "../../../3j/3o"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = t("../../../3j/3o"),
            {
                State: l,
                View: o
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.fillcolor,
                    g = o.color,
                    c = o.linewidth,
                    u = o.alpha,
                    $ = o.dash,
                    y = o.cap,
                    m = o.linejoin;
                return l = [e("path", {
                    d: d + (o.closed ? "z" : ""),
                    style: `fill:${p||"none"};stroke:${g};stroke-width:${c}${s};opacity:` + u,
                    "stroke-dasharray": $ + s,
                    "stroke-linejoin": m,
                    "stroke-linecap": y && "round"
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:` + f + s
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: o
                } = t, {
                    x: s,
                    y: d
                } = e;
                s -= l.get("fS") || 0, d -= l.get("fT") || 0;
                let a, n = i.fM(e);
                for (let t of n) {
                    let i = e[t + "X"],
                        l = e[t + "Y"];
                    a ? a += "L" : a = "M", a += r.fI(i - s) + "," + r.fI(l - d)
                }
                this.set({
                    unit: o,
                    props: e,
                    path: a
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/pipe/3i", ["3l", "../../../3j/3n", "../../../3j/3o", "../../../3s/40/3i"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = t("../../../3j/3o"),
            l = t("../../../3s/40/3i"),
            o = "path",
            {
                State: s,
                View: d,
                node: a,
                now: n
            } = e;
        return d.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: s,
                        unit: d,
                        path: a
                    } = t,
                    n = s.x,
                    h = s.y,
                    f = s.width,
                    p = s.height,
                    g = s.pipeColor,
                    c = s.pipeWidth,
                    u = s.alpha,
                    $ = s.liquidWidth,
                    y = s.liquidColor,
                    m = s.liquidDash;
                return l = [e(o, {
                    d: a,
                    style: `fill:none;stroke:${g};stroke-width:${c}${d};stroke-linejoin:round`
                }, 1), e(o, {
                    d: a,
                    style: `fill:none;stroke:${y};stroke-width:${$}${d};stroke-dasharray:${m};stroke-linejoin:round`,
                    id: "_rd_" + r
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${n}${d};top:${h}${d};width:${f}${d};height:${p}${d};opacity:` + u
                }, l)], e(r, 0, i)
            }, init() {
                this.on("destroy", (() => {
                    l._fQ(this._lt)
                }))
            }, assign(t) {
                let {
                    props: e,
                    unit: l
                } = t, {
                    x: o,
                    y: d
                } = e;
                o -= s.get("fS") || 0, d -= s.get("fT") || 0;
                let a, n = i.fM(e);
                for (let t of n) {
                    let i = e[t + "X"],
                        l = e[t + "Y"];
                    a ? a += "L" : a = "M", a += r.fI(i - o) + "," + r.fI(l - d)
                }
                this.set({
                    unit: l,
                    props: e,
                    path: a
                })
            }, async render() {
                await this.digest(), this._lt || (this._lu = a(`_rd_${this.id}`), this._lt = () => {
                    let {
                        flowingTime: t,
                        liquidDash: e
                    } = this.get("props");
                    this._lv || (this._lv = n());
                    let r = -((n() - this._lv) / 1e3) % t / t * e * 2;
                    this._lu.setAttribute("stroke-dashoffset", r.toFixed(2))
                }), this.get("props").flowing ? this._lw || (this._lw = 1, l._fR(60, this._lt)) : this._lw && (l._fQ(this._lt), this._lw = 0)
            }
        })
    })), s.d("4e/svg/rbubble/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                min: i
            } = Math;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: l
                } = t, {
                    width: o,
                    height: s,
                    mod1X: d,
                    mod1Y: a,
                    radius: n,
                    gapPosition: h,
                    gapPRatio: f,
                    gapRatio: p
                } = e, g = i(o / 2, s / 2);
                n > g && (n = g);
                let c = [],
                    u = r.fI(n),
                    $ = r.fI(o),
                    y = r.fI(s),
                    m = r.fI(d),
                    x = r.fI(a),
                    _ = $ - 2 * u,
                    b = y - 2 * u,
                    w = "A" + u + "," + u + ",0,0,1," + u + ",0",
                    k = "A" + u + "," + u + ",0,0,1," + $ + "," + u,
                    v = "A" + u + "," + u + ",0,0,1," + ($ - u) + "," + y,
                    j = "A" + u + "," + u + ",0,0,1,0," + (y - u);
                if ("top" == h) {
                    let t = u + _ * f,
                        e = t + _ * p;
                    e > $ - u && (e = $ - u), c.push(u, ",0,L", t, ",0", "L", m, ",", -x, "L", e, ",0", "L", $ - u, ",0", k, "L", $, ",", y - u, v, "L", u, ",", y, ",", j, "L0,", u, w)
                } else if ("right" == h) {
                    let t = u + b * f,
                        e = t + b * p;
                    e > y - u && (e = y - u), c.push(u, ",0,L", $ - u, ",0", k, "L", $, ",", t, "L", $ + m, ",", x, "L", $, ",", e, "L", $, ",", y - u, v, "L", u, ",", y, j, "L0,", u, w)
                } else if ("bottom" == h) {
                    let t = u + _ * f,
                        e = t + _ * p;
                    e > $ - u && (e = $ - u), c.push(u, ",0,L", $ - u, ",0", k, "L", $, ",", y - u, v, "L", e, ",", y, "L", m, ",", y + x, "L", t, ",", y, "L", u, ",", y, j, "L0,", u, w)
                } else if ("left" == h) {
                    let t = u + b * f,
                        e = t + b * p;
                    e > y - u && (e = y - u), c.push(u, ",0,L", $ - u, ",0", k, "L", $, ",", y - u, v, "L", u, ",", y, j, "L0,", e, "L", -m, ",", x, "L0,", t, "L0,", u, w)
                }
                this.set({
                    unit: l,
                    props: e,
                    path: "M" + c.join("")
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rcard/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, l = "M", {
                    width: o,
                    height: s,
                    mod1X: d,
                    mod2Y: a
                } = e, n = r.fI(o), h = r.fI(s);
                l += n * d + " 0", l += "L" + n + " 0", l += "L" + n + " " + h, l += "L0 " + h, l += "L0 " + h * a + "z", this.set({
                    unit: i,
                    props: e,
                    path: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rcorner/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, l = "M", {
                    width: o,
                    height: s,
                    mod1Y: d,
                    mod2X: a,
                    mod2Y: n,
                    mod3X: h
                } = e, f = r.fI(o), p = r.fI(s), g = p / 2, c = f / 2;
                l += "0 0", l += "L0 " + p, l += "L" + a * c + " " + (p - d * g), l += "L" + a * c + " " + n * g, l += "L" + (f - h * c) + " " + n * g, l += "L" + f + " 0z", this.set({
                    unit: i,
                    props: e,
                    path: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rarrow/3i", ["3l", "../../../3j/3n", "../../../3j/3o"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = t("../../../3j/3o");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: l
                } = t, o = "M", {
                    width: s,
                    height: d,
                    mod1X: a,
                    mod1Y: n,
                    stail: h
                } = e, f = r.fI(s), p = r.fI(d), g = p / 2, c = 0, u = g * n;
                if (o += c + " " + u, c = f * a, o += "L" + c + " " + u, o += "L" + c + " 0", o += "L" + f + " " + g, o += "L" + c + " " + p, o += "L" + c + " " + (p - u), o += "L0 " + (p - u), h) {
                    let {
                        k: t
                    } = i.fK(c, 0, f, g);
                    o += `L${(g-u)/t} ${g}`
                }
                o += "z", this.set({
                    unit: l,
                    props: e,
                    path: o
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rcross/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate,
                    g = o.fillcolor,
                    c = o.color,
                    u = o.linewidth,
                    $ = o.alpha,
                    y = (o.dash, o.cap),
                    m = o.linejoin;
                return l = [e("path", {
                    d: d,
                    style: `fill:${g||"none"};stroke:${c};stroke-width:${u}${s};opacity:` + $,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": y && "round",
                    "stroke-linejoin": m
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, l = "M", {
                    width: o,
                    height: s,
                    mod1X: d,
                    mod1Y: a
                } = e;
                o = r.fI(o), s = r.fI(s);
                let n = o / 2 * d,
                    h = s / 2 * a;
                l += "0 " + h, l += "L" + n + " " + h, l += "L" + n + " 0", l += "L" + (o - n) + " 0", l += "L" + (o - n) + " " + h, l += "L" + o + " " + h, l += "L" + o + " " + (s - h), l += "L" + (o - n) + " " + (s - h), l += "L" + (o - n) + " " + s, l += "L" + n + " " + s, l += "L" + n + " " + (s - h), l += "L0 " + (s - h) + "z", this.set({
                    unit: i,
                    props: e,
                    path: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rcube/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = "path";
        return e.View.extend({
            tmpl(t, e, r) {
                let l, o, {
                        props: s,
                        unit: d,
                        alpha: a,
                        path4: n,
                        path1: h,
                        path2: f,
                        path3: p
                    } = t,
                    g = s.x,
                    c = s.y,
                    u = s.width,
                    $ = s.height,
                    y = s.rotate,
                    m = s.topcolor,
                    x = s.frontcolor,
                    _ = s.sidecolor,
                    b = s.color,
                    w = s.linewidth,
                    k = s.dash,
                    v = s.cap,
                    j = s.linejoin;
                return o = [], o.push(e(i, {
                    d: n,
                    style: `fill:none;stroke:${b};stroke-width:` + w + d,
                    "stroke-dasharray": k + d,
                    "stroke-linecap": v && "round",
                    "stroke-linejoin": j
                }, 1)), m && o.push(e(i, {
                    d: h,
                    style: "fill:" + m
                }, 1)), x && o.push(e(i, {
                    d: f,
                    style: "fill:" + x
                }, 1)), _ && o.push(e(i, {
                    d: p,
                    style: "fill:" + _
                }, 1)), l = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${g}${d};top:${c}${d};width:${u}${d};height:${$}${d};transform:rotate(${y}deg);opacity:` + a
                }, o)], e(r, 0, l)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, {
                    width: l,
                    height: o,
                    mod1Y: s
                } = e;
                l = r.fI(l), o = r.fI(o);
                let d = o * s;
                d > l && (d = l);
                let a = "M" + d + ",0";
                a += "L" + l + ",0", a += "L" + (l - d) + "," + d, a += "L0," + d + "z";
                let n = "M0," + d;
                n += "L0," + o, n += "L" + (l - d) + "," + o, n += "L" + (l - d) + "," + d + "z";
                let h = "M" + l + ",0";
                h += "L" + l + "," + (o - d), h += "L" + (l - d) + "," + o, h += "L" + (l - d) + "," + d + "z";
                let f = "M0," + d;
                f += "L0," + o, f += "L" + (l - d) + "," + o, f += "L" + l + "," + (o - d), f += "L" + l + ",0", f += "L" + d + ",0z", f += "M" + l + ",0", f += "L" + (l - d) + "," + d, f += "L" + (l - d) + "," + o, f += "M" + (l - d) + "," + d, f += "L0," + d, this.set({
                    unit: i,
                    props: e,
                    path1: a,
                    path2: n,
                    path3: h,
                    path4: f
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rcylinder/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d,
                        cx: a,
                        cy: n
                    } = t,
                    h = o.x,
                    f = o.y,
                    p = o.width,
                    g = o.height,
                    c = o.rotate,
                    u = o.bodycolor,
                    $ = o.color,
                    y = o.linewidth,
                    m = o.alpha,
                    x = o.dash,
                    _ = o.topcolor;
                o.cap;
                return l = [e("path", {
                    d: d,
                    style: `fill:${u||"none"};stroke:${$};stroke-width:${y}${s};opacity:` + m,
                    "stroke-dasharray": x + s
                }, 1), e("ellipse", {
                    cx: a,
                    cy: n,
                    rx: a,
                    ry: n,
                    style: `fill:${_||"none"};stroke:${$};stroke-width:${y}${s};opacity:` + m,
                    "stroke-dasharray": x + s
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${h}${s};top:${f}${s};width:${p}${s};height:${g}${s};transform:rotate(${c}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, {
                    width: l,
                    height: o,
                    mod1Y: s
                } = e;
                l = r.fI(l), o = r.fI(o);
                let d = l / 2,
                    a = o / 2 / 2 * s,
                    n = "M0," + a;
                n += "L0," + (o - a), n += "A" + d + "," + a + ",0 0 0," + l + "," + (o - a), n += "L" + l + "," + a, n += "A" + d + "," + a + ",0 0 1,0," + a, this.set({
                    unit: i,
                    props: e,
                    cx: d,
                    cy: a,
                    path: n
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rect/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        toPx: d,
                        ox: a,
                        oy: n
                    } = t,
                    h = o.x,
                    f = o.y,
                    p = o.width,
                    g = o.height,
                    c = o.fillcolor,
                    u = o.color,
                    $ = o.linewidth,
                    y = o.alpha,
                    m = o.dash,
                    x = o.cap,
                    _ = o.linejoin,
                    b = o.ctrl1X,
                    w = o.ctrl1Y,
                    k = o.ctrl2X,
                    v = o.ctrl2Y,
                    j = o.ctrl3X,
                    L = o.ctrl3Y,
                    S = o.ctrl4X,
                    z = o.ctrl4Y;
                return l = [e("path", {
                    d: `M${d(b-h+a)} ${d(w-f+n)}L${d(k-h+a)} ${d(v-f+n)}L${d(j-h+a)} ${d(L-f+n)}L${d(S-h+a)} ${d(z-f+n)}Z`,
                    style: `fill:${c||"none"};stroke:${u};stroke-width:${$}${s};opacity:` + y,
                    "stroke-dasharray": m + s,
                    "stroke-linecap": x && "round",
                    "stroke-linejoin": _
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${h}${s};top:${f}${s};width:${p}${s};height:` + g + s
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rdarrow/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, l = "M", {
                    width: o,
                    height: s,
                    mod1X: d,
                    mod1Y: a
                } = e;
                o = r.fI(o), s = r.fI(s);
                let n = s / 2,
                    h = n * a,
                    f = o / 2 * d;
                l += "0 " + n, l += "L" + f + " 0", l += "L" + f + " " + h, l += "L" + (o - f) + " " + h, l += "L" + (o - f) + " 0", l += "L" + o + " " + n, l += "L" + (o - f) + " " + s, l += "L" + (o - f) + " " + (s - h), l += "L" + f + " " + (s - h), l += "L" + f + " " + s + "z", this.set({
                    unit: i,
                    props: e,
                    path: l
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rect2/3i", ["3l"], (t => {
        let e = t("3l");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s
                    } = t,
                    d = o.x,
                    a = o.y,
                    n = o.width,
                    h = o.height,
                    f = o.rotate;
                return l = [e("rect", {
                    x: 0,
                    y: 0,
                    rx: o.roundX + s,
                    ry: o.roundY + s,
                    width: n + s,
                    height: h + s,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${d}${s};top:${a}${s};width:${n}${s};height:${h}${s};transform:rotate(${f}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rpie/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                PI: i,
                cos: l,
                sin: o
            } = Math;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        startX: d,
                        toPx: a,
                        startY: n,
                        big: h,
                        endX: f,
                        endY: p,
                        cx: g,
                        cy: c
                    } = t,
                    u = o.x,
                    $ = o.y,
                    y = o.width,
                    m = o.height,
                    x = o.rotate,
                    _ = o.rx,
                    b = o.ry,
                    w = o.linejoin,
                    k = o.fillcolor,
                    v = o.color,
                    j = o.linewidth,
                    L = o.alpha,
                    S = o.cap,
                    z = o.dash;
                return l = [e("path", {
                    d: `M${d-a(u)} ${n-a($)}A${a(_)} ${a(b)} 0 ${h?1:0} 1 ${f-a(u)} ${p-a($)}L${g} ${c}z`,
                    style: `fill:${k||"none"};stroke:${v};stroke-width:${j}${s};opacity:` + L,
                    "stroke-dasharray": z + s,
                    "stroke-linecap": S && "round",
                    "stroke-linejoin": w
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${u}${s};top:${$}${s};width:${y}${s};height:${m}${s};transform:rotate(${x}deg)`
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI
                })
            }, assign(t) {
                this.set(t);
                let {
                    props: e,
                    unit: s
                } = t, {
                    startAngle: d,
                    endAngle: a,
                    rx: n,
                    ry: h,
                    centerX: f,
                    centerY: p,
                    mod1X: g,
                    mod1Y: c
                } = e;
                n = r.fI(n), h = r.fI(h), f = r.fI(f), p = r.fI(p), a < d && ([a, d] = [d, a]);
                let u = a - d;
                u > 360 && (d += 360, u = a - d);
                let $ = u >= 180,
                    y = i / 180,
                    m = f + n * l(d * y),
                    x = p + h * o(d * y),
                    _ = f + n * l(a * y),
                    b = p + h * o(a * y),
                    w = 2 * n * g,
                    k = 2 * h * c;
                this.set({
                    unit: s,
                    big: $,
                    cx: w,
                    cy: k,
                    startX: m,
                    startY: x,
                    endX: _,
                    endY: b
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rmoon/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n");
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate,
                    g = o.alpha;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:` + o.linewidth + s,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg);opacity:` + g
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: i
                } = t, {
                    width: l,
                    height: o,
                    mod1X: s
                } = e;
                l = r.fI(l), o = r.fI(o);
                let d = o / 2,
                    a = "M0,0";
                a += "A" + l + "," + d + ",0 0 1 0," + o, a += "A" + s * l + "," + d + ",0 0 0 0 0z", this.set({
                    unit: i,
                    props: e,
                    path: a
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/signal/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "rd-hu",
            i = "path",
            {
                min: l
            } = Math;
        return e.View.extend({
            tmpl(t, e, l) {
                let o, s, d, {
                        props: a,
                        unit: n
                    } = t,
                    h = a.x,
                    f = a.y,
                    p = a.width,
                    g = a.height,
                    c = a.rotate,
                    u = a.alpha,
                    $ = a.connected,
                    y = a.strength,
                    m = a.fill,
                    x = a.background,
                    _ = a.disconnect;
                return d = [], s = "", s += !$ || 1 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M112.88 689.631h155.428v244.244h-155.428v-244.244z",
                    fill: s
                }, 1)), s = "", s += !$ || 2 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M334.921 556.409h155.428v377.467h-155.428v-377.467z",
                    fill: s
                }, 1)), s = "", s += !$ || 3 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M579.164 400.98h133.223v532.895h-133.223v-532.895z",
                    fill: s
                }, 1)), s = "", s += !$ || 4 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M801.202 245.553h155.428v688.323h-155.428v-688.323z",
                    fill: s
                }, 1)), s = "", s += !$ || 5 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M1023.242 90.125h155.427v843.75h-155.428v-843.75z",
                    fill: s
                }, 1)), $ || d.push(e(i, {
                    fill: _,
                    d: "M301.188 81.702l83.042 82.935-251.446 252.884-83.042-82.935z"
                }, 1), e(i, {
                    fill: _,
                    d: "M47.262 160.271l78.843-78.265L381.75 334.009l-78.842 78.264z"
                }, 1)), o = [e("svg", {
                    viewBox: "0 0 1294 1024",
                    class: "rd-gv rd-hW",
                    style: `left:${h}${n};top:${f}${n};width:${p}${n};height:${g}${n};opacity:${u};transform:rotate(${c}deg)`
                }, d)], e(l, 0, o)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: r,
                    width: i,
                    height: o
                } = e, s = l(i, o) / 2;
                r > s && (r = s), this.set(t), this.set({
                    bw: r
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/rstar/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                PI: i,
                sin: l,
                cos: o
            } = Math,
            {
                MAX_VALUE: s
            } = Number;
        return e.View.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linejoin": o.linejoin,
                    "stroke-linecap": o.cap && "round"
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: d
                } = t, a = i / 180, n = r.fI(e.width) / 2, h = n * (1 - e.mod1Y), f = e.corner, p = 360 / f, g = p / 2 - 90, c = [];
                for (let t = 0; t < f; t++) c.push(n + n * o((t * p - 90) * a), n + n * l((t * p - 90) * a), n + h * o((g + t * p) * a), n + h * l((g + t * p) * a));
                let {
                    h: u,
                    v: $
                } = (t => {
                    let e = -s,
                        r = e,
                        i = s,
                        l = i;
                    for (let o = 0; o < t.length; o += 2) {
                        let s = t[o],
                            d = t[o + 1];
                        s > e && (e = s), s < l && (l = s), d > r && (r = d), d < i && (i = d)
                    }
                    return {
                        h: l + (e - l) / 2,
                        v: i + (r - i) / 2
                    }
                })(c);
                u = n - u, $ = n - $;
                let y = "M";
                for (let t = 0; t < c.length; t += 2) {
                    "M" != y && (y += "L"), y += c[t] + u + " " + (c[t + 1] + $)
                }
                y += "Z", this.set({
                    unit: d,
                    props: e,
                    path: y
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/speaker/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "path",
            i = "rd-hu",
            {
                min: l
            } = Math;
        return e.View.extend({
            tmpl(t, e, l) {
                let o, s, d, {
                        props: a,
                        unit: n
                    } = t,
                    h = a.x,
                    f = a.y,
                    p = a.width,
                    g = a.height,
                    c = a.alpha,
                    u = a.rotate,
                    $ = a.fill,
                    y = a.muted,
                    m = a.volume,
                    x = a.background,
                    _ = a.vcolor,
                    b = a.mutedcolor;
                return d = [], d.push(e(r, {
                    fill: $,
                    d: "M213.34 341.34L426.68 128v768L213.34 682.66H128q-53.002 0-90.501-37.499T0 554.66v-83.661q0-53.002 37.499-91.34T128 341.318h85.34zm128 348.652V332.329l-92.672 94.33H128q-17.326 0-30.003 13.17t-12.677 31.17v83.66q0 17.675 12.492 30.168t30.168 12.493h120.668z"
                }, 1)), y ? d.push(e(r, {
                    fill: b,
                    d: "M537 609.9l248.8-248.8c15.7-15.7 41.3-15.7 57 0 15.7 15.7 15.7 41.3 0 57L594 666.9c-15.7 15.7-41.3 15.7-57 0-15.7-15.6-15.7-41.3 0-57z"
                }, 1), e(r, {
                    fill: b,
                    d: "M594 361.1l248.8 248.8c15.7 15.7 15.7 41.3 0 57-15.7 15.7-41.3 15.7-57 0L537 418.1c-15.7-15.7-15.7-41.3 0-57 15.7-15.7 41.3-15.7 57 0z"
                }, 1)) : (s = "", s += 1 > m ? x : _, d.push(e(r, {
                    class: i,
                    d: "M619.991 369.664q12.329 0 23.163 7.004t16.159 19.006q23.326 56.34 23.326 116.326 0 61.01-23.326 115.671-4.997 12.001-15.831 19.17t-23.491 7.167q-15.667 0-29.163-11.837t-13.497-30.843q0-7.66 3.338-16.67Q597.34 555.314 597.34 512q0-43.008-16.67-83.005-3.339-7.66-3.339-16.671 0-19.006 12.841-30.843t29.84-11.837z",
                    fill: s
                }, 1)), s = "", s += 2 > m ? x : _, d.push(e(r, {
                    class: i,
                    d: "M750.326 250.675q24.002 0 36.659 20.992 32.993 55.01 49.009 113.664Q853.32 448 853.32 512q0 63.672-17.326 126.996-16.343 59.331-49.009 113.664-12.329 20.665-36.66 20.665-16.67 0-29.675-12.001t-13.005-30.659q0-11.674 6.329-21.996 26.01-43.335 39.67-92.672Q767.98 566.006 767.98 512q0-53.658-14.336-103.67-13.66-49.336-39.67-93-6.329-9.666-6.329-21.667 0-18.002 13.17-30.495t29.49-12.493z",
                    fill: s
                }, 1)), s = "", s += 3 > m ? x : _, d.push(e(r, {
                    class: i,
                    d: "M877.998 133.673q23 0 35.328 18.657 54.334 79.667 82.494 171.336T1023.98 512t-28.16 188.334-82.494 171.336q-12.001 18.657-35.328 18.657-17.326 0-29.84-12.001t-12.492-30.659q0-13.332 7.332-24.002Q938.66 683.335 938.66 512q0-84.009-24.33-163.328t-71.332-148.337q-7.332-10.67-7.332-24.002 0-18.657 12.493-30.659t29.84-12.001z",
                    fill: s
                }, 1))), o = [e("svg", {
                    viewBox: "0 0 1024 1024",
                    class: "rd-gv rd-hW",
                    style: `left:${h}${n};top:${f}${n};width:${p}${n};height:${g}${n};opacity:${c};transform:rotate(${u}deg)`
                }, d)], e(l, 0, o)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: r,
                    width: i,
                    height: o
                } = e, s = l(i, o) / 2;
                r > s && (r = s), this.set(t), this.set({
                    bw: r
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/triangle/3i", ["3l", "../../../3j/3n"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            {
                State: i,
                View: l
            } = e;
        return l.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        toPx: d,
                        ox: a,
                        oy: n
                    } = t,
                    h = o.x,
                    f = o.y,
                    p = o.width,
                    g = o.height,
                    c = o.ctrl1X,
                    u = o.ctrl1Y,
                    $ = o.ctrl2X,
                    y = o.ctrl2Y,
                    m = o.ctrl3X,
                    x = o.ctrl3Y,
                    _ = o.linejoin,
                    b = o.fillcolor,
                    w = o.color,
                    k = o.linewidth,
                    v = o.alpha,
                    j = o.dash,
                    L = o.cap;
                return l = [e("path", {
                    d: `M${d(c-h+a)} ${d(u-f+n)}L${d($-h+a)} ${d(y-f+n)}L${d(m-h+a)} ${d(x-f+n)}Z`,
                    style: `fill:${b||"none"};stroke:${w};stroke-width:${k}${s};opacity:` + v,
                    "stroke-dasharray": j + s,
                    "stroke-linecap": L && "round",
                    "stroke-linejoin": _
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${h}${s};top:${f}${s};width:${p}${s};height:` + g + s
                }, l)], e(r, 0, i)
            }, init() {
                this.set({
                    toPx: r.fI,
                    ox: i.get("fS") || 0,
                    oy: i.get("fT") || 0
                })
            }, assign(t) {
                this.set(t)
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/star/3i", ["3l", "../../../3j/3n", "../../../3j/3o"], (t => {
        let e = t("3l"),
            r = t("../../../3j/3n"),
            i = t("../../../3j/3o"),
            {
                State: l,
                View: o
            } = e;
        return o.extend({
            tmpl(t, e, r) {
                let i, l, {
                        props: o,
                        unit: s,
                        path: d
                    } = t,
                    a = o.x,
                    n = o.y,
                    h = o.width,
                    f = o.height,
                    p = o.rotate;
                return l = [e("path", {
                    d: d,
                    style: `fill:${o.fillcolor||"none"};stroke:${o.color};stroke-width:${o.linewidth}${s};opacity:` + o.alpha,
                    "stroke-dasharray": o.dash + s,
                    "stroke-linecap": o.cap && "round",
                    "stroke-linejoin": o.linejoin
                }, 1)], i = [e("svg", {
                    class: "rd-hI rd-gv rd-hW",
                    style: `left:${a}${s};top:${n}${s};width:${h}${s};height:${f}${s};transform:rotate(${p}deg)`
                }, l)], e(r, 0, i)
            }, assign(t) {
                let {
                    props: e,
                    unit: o
                } = t, s = (t => {
                    let e = l.get("fS") || 0,
                        o = l.get("fT") || 0,
                        s = i.fM(t),
                        d = 0,
                        a = [];
                    for (let i of s) a.push(d ? "L" : "M"), d = 1, a.push(`${r.fI(t[i+"X"]-t.x+e)} ${r.fI(t[i+"Y"]-t.y+o)}`);
                    return a.push("z"), a.join("")
                })(e);
                this.set({
                    unit: o,
                    props: e,
                    path: s
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("4e/svg/wifi/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "rd-hu",
            i = "path",
            {
                min: l
            } = Math;
        return e.View.extend({
            tmpl(t, e, l) {
                let o, s, d, {
                        props: a,
                        unit: n
                    } = t,
                    h = a.x,
                    f = a.y,
                    p = a.width,
                    g = a.height,
                    c = a.alpha,
                    u = a.rotate,
                    $ = a.connected,
                    y = a.strength,
                    m = a.fill,
                    x = a.background,
                    _ = a.disconnect;
                return d = [], s = "", s += !$ || 3 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M512.2 192c-159.8 0-311.4 59.8-427.8 168.2l-20.4 19 19.8 19.6 64.6 64 18.6 18.4 19.2-17.6c89-81.8 204.6-127 325.6-127 121 0 236.8 45.2 325.6 127l19.2 17.6 18.6-18.4 64.6-64 19.8-19.6-20.4-19C823.2 251.8 671.4 192 512.2 192z",
                    fill: s
                }, 1)), s = "", s += !$ || 2 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M794.8 512.8C717.2 442.6 617 404 512.6 404h-17.8l-.2.4c-98.4 4-192 42.2-265.2 108.4l-21 19 20.2 20 65.4 64.8 18.2 18 19.2-16.8c50.6-44.4 114.8-69 180.6-69 66.2 0 130.4 24.6 181 69l19.2 16.8 18.2-18 65.4-64.8 20.2-20-21.2-19z",
                    fill: s
                }, 1)), s = "", s += !$ || 1 > y ? x : m, d.push(e(i, {
                    class: r,
                    d: "M512.4 832l19.2-19 105.6-104.4 21.2-21-23.2-19c-30.8-22.8-64.8-40-123-40-58 0-89.8 18.8-123 40l-23 19 21.2 21L493 813l19.4 19z",
                    fill: s
                }, 1)), $ || d.push(e(i, {
                    fill: _,
                    d: "M513.067 170.667c34.133 0 64 29.866 64 64v298.666c0 34.134-29.867 64-64 64s-64-29.866-64-64V234.667c0-34.134 29.866-64 64-64zM449.067 682.667a64 64 0 1 0 128 0 64 64 0 1 0-128 0z"
                }, 1)), o = [e("svg", {
                    viewBox: "0 0 1024 1024",
                    class: "rd-gv rd-hW",
                    style: `left:${h}${n};top:${f}${n};width:${p}${n};height:${g}${n};opacity:${c};transform:rotate(${u}deg)`
                }, d)], e(l, 0, o)
            }, assign(t) {
                let {
                    props: e
                } = t, {
                    borderwidth: r,
                    width: i,
                    height: o
                } = e, s = l(i, o) / 2;
                r > s && (r = s), this.set(t), this.set({
                    bw: r
                })
            }, render() {
                this.digest()
            }
        })
    })), s.d("42/barcode", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.barcode || "//unpkg.com/jsbarcode@3.11.5/dist/") + "JsBarcode.all.js"];
        return {
            _g4: [{
                value: "CODE128",
                text: "CODE128"
            }, {
                value: "CODE128A",
                text: "CODE128A"
            }, {
                value: "CODE128B",
                text: "CODE128B"
            }, {
                value: "CODE128C",
                text: "CODE128C"
            }, {
                value: "CODE39",
                text: "CODE39"
            }, {
                value: "EAN2",
                text: "EAN2"
            }, {
                value: "EAN5",
                text: "EAN5"
            }, {
                value: "EAN8",
                text: "EAN8"
            }, {
                value: "EAN13",
                text: "EAN13"
            }, {
                value: "ITF",
                text: "ITF"
            }, {
                value: "ITF14",
                text: "ITF14"
            }, {
                value: "MSI",
                text: "MSI"
            }, {
                value: "MSI10",
                text: "MSI10"
            }, {
                value: "MSI11",
                text: "MSI11"
            }, {
                value: "MSI1010",
                text: "MSI1010"
            }, {
                value: "MSI1110",
                text: "MSI1110"
            }, {
                value: "UPC",
                text: "UPC"
            }, {
                value: "UPCE",
                text: "UPCE"
            }, {
                value: "upce",
                text: "UPC-E"
            }, {
                value: "codabar",
                text: "codabar"
            }, {
                value: "pharmacode",
                text: "pharmacode"
            }, {
                value: "GenericBarcode",
                text: "GenericBarcode"
            }],
            _jz: [{
                text: "pu",
                value: "img"
            }, {
                text: "pv",
                value: "svg"
            }],
            _jA: [{
                text: "lC",
                value: "full"
            }, {
                text: "lB",
                value: "auto"
            }],
            _jB: [{
                text: "mG",
                value: "top"
            }, {
                text: "mI",
                value: "bottom"
            }],
            _jC: {
                bold: 1,
                italic: 1
            },
            _jF: () => r("JsBarcode", o)
        }
    })), s.d("42/chart", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.chartjs || "//unpkg.com/chart.js@3.9.1/dist/") + "chart.min.js"];
        return () => r("Chart", o)
    })), s.d("42/6q", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.ckeditor || "//ckeditor.com/assets/libs/ckeditor5/35.0.1/") + "ckeditor.js"];
        return () => r("CKEditor", o)
    })), s.d("42/6j", ["3l", "../3j/5f"], (t => {
        let e = t("3l"),
            r = t("../3j/5f"),
            i = {},
            l = {},
            {
                random: o
            } = Math,
            {
                type: s,
                isArray: d,
                config: a,
                isFunction: n,
                isObject: h,
                has: f
            } = e,
            p = {},
            g = t => {
                let e = t.url,
                    r = t.id + "~" + e,
                    i = a("rebuildBindUrl");
                return p[r] ? e = p[r] : n(i) ? (e = i(t), p[r] = e) : p[r] = e, e
            };
        return {
            _qp(t) {
                let e = g(t);
                return i[e]
            }, _qq(t) {
                let e = g(t);
                return l[e]
            }, _jY: (t, e) => new Promise((a => {
                let n, f = g(t),
                    p = i[f];
                if (p || (p = {}, n = {}, i[f] = p, l[f] = n), p._qr) a(p);
                else if (p._qs) p._qs.push(a);
                else {
                    p._qs = [a], (new r).all({
                        name: "_iw",
                        url: f
                    }, ((t, r) => {
                        let i = r.get("data");
                        if (o() < .1 && d(i)) {
                            let t = [];
                            for (let e of i)
                                if ("Object" == s(e)) {
                                    let r = {};
                                    for (let t in e) {
                                        let i = e[t];
                                        "Number" == s(i) ? r[t] = i + 10 * o() | 0 : "String" != s(i) || i.startsWith("//") || i.startsWith("http://") || i.startsWith("https://") ? r[t] = i : r[t] = i.substring(1)
                                    }
                                    t.push(r)
                                } else t.push(e);
                            i = t
                        }
                        n._ir = i, n._iq = null == t ? void 0 : t.message, e && (d(i) ? i = [] : h(i) && (i = {})), p._ir = i, p._qr = 1, p._iq = null == t ? void 0 : t.message;
                        for (let t of p._qs) t(p);
                        p._qs = null
                    }))
                }
            })), _qt(t, e, r = "") {
                let l = i[t];
                l || (l = {}, i[t] = l), l._ir = e, l._qr = 1, l._iq = r
            }, _fB() {
                for (let t in i) delete i[t], delete l[t]
            }, _qu: t => f(i, t), _qv: g
        }
    })), s.d("42/3j", ["3l", "../3j/3n", "../3j/47", "../3j/3o"], (t => {
        let e = t("3l"),
            r = t("../3j/3n"),
            i = t("../3j/47"),
            l = t("../3j/3o"),
            {
                Cache: o,
                config: s
            } = e,
            d = new o,
            a = {
                _gN: 1,
                fixed: r.gv,
                step: r.fG,
                read: l.fA,
                write: l.fF,
                type: i.fS,
                json: 1
            },
            n = {...a, tip: "pz", key: "x"
            },
            h = {...a, tip: "pA", key: "y"
            },
            f = (t, e) => {
                let r, l = `b${t}_${e}`;
                return d.has(l) ? r = d.get(l) : (r = {
                    tip: t,
                    key: e,
                    type: i.fU,
                    json: 1
                }, d.set(l, r)), r
            },
            p = (t, e, r = 0, l = 0) => {
                let o, s = `c${t}_${e}_${r}_${l}`;
                return d.has(s) ? o = d.get(s) : (o = {
                    tip: t,
                    key: e,
                    alpha: r,
                    clear: l,
                    type: i.fT,
                    json: 1
                }, d.set(s, o)), o
            },
            g = {
                tip: "n3",
                key: "alpha",
                type: i.fS,
                step: .01,
                fixed: 2,
                min: 0,
                max: 1,
                json: 1
            },
            c = {
                tip: "jP",
                type: i.fS,
                key: "rotate",
                min: -360,
                max: 360,
                json: 1
            },
            u = {
                type: i.f0
            },
            $ = {
                tip: "pw",
                key: "borderdeed",
                type: i.fW,
                items: r.gr,
                json: 1
            },
            y = {
                type: i.f0,
                _jy: ({
                    bind: t
                }) => !t.id
            },
            m = {
                type: i.f0,
                _jy: () => s("getFieldUrl")
            },
            x = {
                tip: "ps",
                type: i.fW,
                key: "print",
                items: r.gs,
                json: 1
            },
            _ = {
                tip: "pj",
                type: i.f1,
                key: "help"
            },
            b = {
                tip: "px",
                key: "ename",
                type: i.fY,
                json: 1
            },
            w = {
                tip: "pp",
                key: "locked",
                type: i.fU,
                free: !0,
                json: 1
            },
            k = {
                tip: "pq",
                key: "ow",
                type: i.f1
            },
            v = {
                tip: "jN",
                key: "width",
                read: l.fA,
                type: i.fZ,
                json: 1
            },
            j = {
                tip: "jO",
                key: "height",
                read: l.fA,
                type: i.fZ,
                json: 1
            },
            L = {
                key: "width",
                read: l.fA,
                json: 1
            },
            S = {
                key: "height",
                read: l.fA,
                json: 1
            },
            z = {...a, tip: "hY", key: "linewidth", min: () => 0, max: () => r.fy(20)
            },
            A = p("hX", "color"),
            C = {...a, tip: "pk", key: "dash", min: () => 0, max: () => r.fy(20)
            },
            I = f("iz", "cap"),
            T = p("iI", "fillcolor", 1, 1),
            M = f("pi", "closed"),
            P = {...a, tip: "iQ", key: "borderwidth", min: 0, max: () => r.fy(10)
            },
            H = {
                tip: "po",
                key: "linejoin",
                json: 1,
                type: i.fW,
                items: [{
                    text: "pm",
                    value: "meter"
                }, {
                    text: "pl",
                    value: "bevel"
                }, {
                    text: "pn",
                    value: "round"
                }]
            };
        return {
            fx: [{
                key: "x",
                use: "x"
            }, {
                key: "y",
                use: "y"
            }],
            fz: n,
            fA: h,
            fB: (t = 0, e = 0) => {
                let i, l = `w${t}_${e}`;
                return d.has(l) ? i = d.get(l) : (i = {...a, tip: "jN", key: "width", min: () => r.fy(t)
                }, e && (i.max = () => r.fy(e)), d.set(l, i)), i
            },
            fC: (t = 0, e = 0) => {
                let i, l = `h${t}_${e}`;
                return d.has(l) ? i = d.get(l) : (i = {...a, tip: "jO", key: "height", min: () => r.fy(t)
                }, e && (i.max = () => r.fy(e)), d.set(l, i)), i
            },
            fW: v,
            fX: j,
            fZ: L,
            f0: S,
            f6: z,
            f1: A,
            f5: C,
            f2: I,
            f4: T,
            f8: M,
            fM: a,
            fD: g,
            fE: c,
            fF: u,
            fH: y,
            fR: m,
            fG: x,
            fN: k,
            fO: _,
            fP: b,
            fQ: w,
            fV: {
                json: 1,
                key: "animations"
            },
            fS: (t = 1) => {
                let e, r = `b${t}`;
                return d.has(r) ? e = d.get(r) : (e = {
                    tip: "hS",
                    key: "bind",
                    type: i.f7,
                    json: 1,
                    max: t,
                    _jy: () => s("getFieldUrl")
                }, d.set(r, e)), e
            },
            fI: f,
            fJ: p,
            fK: (t = "fontfamily") => {
                let e, l = `ff${t}`;
                return d.has(l) ? e = d.get(l) : (e = {
                    tip: "iT",
                    key: t,
                    type: i.fW,
                    items: r.gp,
                    json: 1
                }, d.set(l, e)), e
            },
            f3: (t = "letterspacing") => {
                let e, r = `ls${t}`;
                return d.has(r) ? e = d.get(r) : (e = {...a, key: t, tip: "n6", min: 0
                }, d.set(r, e)), e
            },
            fL: (t = "fontSize", e = 0, i = 0) => {
                let l, o = `fs${t}_${e}_${i}`;
                return d.has(o) ? l = d.get(o) : (l = {...a, tip: "iS", key: t
                }, i && (l.max = () => r.fy(i)), d.set(o, l)), l
            },
            fy: {
                key: "tfs",
                _gN: 1
            },
            fU: (t = "ph") => {
                let e, l = `bt${t}`;
                return d.has(l) ? e = d.get(l) : (e = {
                    tip: t,
                    key: "bordertype",
                    type: i.fW,
                    items: r.gq,
                    json: 1
                }, d.set(l, e)), e
            },
            fY: $,
            fT: P,
            f7: H
        }
    })), s.d("42/6k", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.echarts || "//unpkg.com/echarts@5.3.3/dist/") + "echarts.min.js"];
        return () => r("echarts", o)
    })), s.d("42/7f", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.filesaver || "//unpkg.com/file-saver@2.0.5/dist/") + "FileSaver.min.js"];
        return () => r("saveAs", o)
    })), s.d("42/4m", ["3l"], (t => {
        let e = t("3l"),
            {
                floor: r
            } = Math,
            i = [{
                title: "无小数",
                format: ".",
                example: "0"
            }, {
                title: "一位小数",
                format: ".#",
                example: "0.1"
            }, {
                title: "两位小数",
                format: ".##",
                example: "0.01"
            }, {
                title: "三位小数",
                format: ".###",
                example: "0.001"
            }, {
                title: "四位小数",
                format: ".####",
                example: "0.0001"
            }],
            l = [{
                title: "数字",
                id: "number",
                groups: [{
                    title: "整数",
                    list: [{
                        title: "千分位",
                        format: "#,###",
                        example: "1,000"
                    }, {
                        title: "万分位",
                        format: "#,####",
                        example: "1,0000"
                    }, {
                        title: "万分位",
                        format: "#'####",
                        example: "1'0000"
                    }, {
                        title: "百分比",
                        format: "#%",
                        example: "100%"
                    }, {
                        title: "千分比",
                        format: "#‰",
                        example: "1000‰"
                    }]
                }, {
                    title: "小数",
                    list: i
                }]
            }, {
                title: "货币",
                id: "currency",
                groups: [{
                    title: "前缀",
                    list: [{
                        title: "¥人民币",
                        format: "^¥"
                    }, {
                        title: "$美元",
                        format: "^$"
                    }, {
                        title: "€欧元",
                        format: "^€"
                    }, {
                        title: "￡英磅",
                        format: "^￡"
                    }, {
                        title: "฿泰铢",
                        format: "^฿"
                    }]
                }, {
                    title: "整数",
                    list: [{
                        title: "千分位",
                        format: "#,###",
                        example: "1,000"
                    }, {
                        title: "万分位",
                        format: "#,####",
                        example: "1,0000"
                    }, {
                        title: "万分位",
                        format: "#'####",
                        example: "1'0000"
                    }]
                }, {
                    title: "小数",
                    list: i
                }, {
                    title: "后缀",
                    list: [{
                        title: "人民币¥",
                        format: "¥"
                    }, {
                        title: "美元$",
                        format: "$"
                    }, {
                        title: "欧元€",
                        format: "€"
                    }, {
                        title: "英磅￡",
                        format: "￡"
                    }, {
                        title: "泰铢฿",
                        format: "฿"
                    }]
                }]
            }, {
                title: "日期",
                id: "date",
                groups: [{
                    title: "日期",
                    list: [{
                        title: "年月日",
                        format: "yyyyMMdd",
                        example: "20200908"
                    }, {
                        title: "年月日",
                        format: "yyyyMd",
                        example: "202098"
                    }, {
                        title: "年-月-日",
                        format: "yyyy-MM-dd",
                        example: "2020-09-08"
                    }, {
                        title: "年-月-日",
                        format: "yyyy-M-d",
                        example: "2020-9-8"
                    }, {
                        title: "年/月/日",
                        format: "yyyy/MM/dd",
                        example: "2020/09/08"
                    }, {
                        title: "年/月/日",
                        format: "yyyy/M/d",
                        example: "2020/9/8"
                    }, {
                        title: "日-月-年",
                        format: "dd-MM-yyyy",
                        example: "08-09-2020"
                    }, {
                        title: "日-月-年",
                        format: "d-M-yyyy",
                        example: "8-9-2020"
                    }, {
                        title: "日/月/年",
                        format: "dd/MM/yyyy",
                        example: "08/09/2020"
                    }, {
                        title: "日/月/年",
                        format: "d/M/yyyy",
                        example: "8/9/2020"
                    }, {
                        title: "月日",
                        format: "MMdd",
                        example: "0908"
                    }, {
                        title: "月日",
                        format: "Md",
                        example: "98"
                    }, {
                        title: "月-日",
                        format: "MM-dd",
                        example: "09-08"
                    }, {
                        title: "月-日",
                        format: "M-d",
                        example: "9-8"
                    }, {
                        title: "月/日",
                        format: "MM/dd",
                        example: "09/08"
                    }, {
                        title: "月/日",
                        format: "M/d",
                        example: "9/8"
                    }]
                }, {
                    title: "时间",
                    list: [{
                        title: " 小时",
                        format: " h",
                        example: "9"
                    }, {
                        title: " 小时",
                        format: " hh",
                        example: "09"
                    }, {
                        title: " 小时:分钟",
                        format: " h:m",
                        example: "9:2"
                    }, {
                        title: " 小时:分钟",
                        format: " hh:mm",
                        example: "09:02"
                    }, {
                        title: " 小时:分钟:秒",
                        format: " h:m:s",
                        example: "9:2:8"
                    }, {
                        title: " 小时:分钟:秒",
                        format: " hh:mm:ss",
                        example: "09:02:08"
                    }]
                }]
            }, {
                title: "自定义",
                id: "custom",
                defaults: "/*\n    data是根据根据当前绑定的字段取到的数据\n    item是完整的单条数据对象\n    可以把下面的console前的注释去掉查看相应的数据\n*/\nfunction(data,item){\n    //console.log(data,item);\n    //return data+item.name;\n    return data;\n}"
            }],
            o = [{
                reg: /y+/gi,
                fn: (t, e) => (e.getFullYear() + "").slice(-t.length)
            }, {
                reg: /M+/g,
                fn: (t, e) => ("0" + (e.getMonth() + 1)).slice(-t.length)
            }, {
                reg: /d+/gi,
                fn: (t, e) => ("0" + e.getDate()).slice(-t.length)
            }, {
                reg: /h+/gi,
                fn: (t, e) => ("0" + e.getHours()).slice(-t.length)
            }, {
                reg: /m+/g,
                fn: (t, e) => ("0" + e.getMinutes()).slice(-t.length)
            }, {
                reg: /s+/g,
                fn: (t, e) => ("0" + e.getSeconds()).slice(-t.length)
            }],
            s = new e.Cache,
            d = /\bfunction\s*\(([\s\S]*?)\)\s*\{([\s\S]*?)\}\s*;?\s*$/i,
            a = /^(\^[\s\S]+?)?(?:#([,'%‰]))?(#{3,4})?(\.#{0,4})?([\s\S]*?)$/;
        return {
            _mE: () => l,
            _mz(t) {
                null == t && (t = "");
                let e = t.indexOf(":");
                if (e > -1) {
                    let r = t.substring(0, e),
                        i = t.substring(e + 1),
                        l = "currency" == r;
                    if ("number" == r || l) {
                        let t = [r];
                        return i.replace(a, ((e, r, i, o, s, d) => {
                            l && t.push(r || ""), "%" == i || "‰" == i ? t.push("#" + i) : i ? t.push("#" + i + o) : t.push(""), t.push(s || ""), l && t.push(d || "")
                        })), t
                    }
                    if ("date" == r) {
                        let t = i.indexOf(" ");
                        return t > -1 ? [r, i.substring(0, t), i.substring(t)] : [r, i, ""]
                    }
                    if ("custom" == r) return [r, i];
                    if ("convert" == r) {
                        let t = [r];
                        return i.startsWith("Aa") ? t.push("Aa", i.substring(2)) : i.startsWith("aA") ? t.push("aA", i.substring(2)) : t.push("", i), t
                    }
                }
                return []
            },
            _mD(t) {
                let e = this._mz(t),
                    r = "";
                for (let t of l)
                    if (t.id == e[0]) {
                        if (r = t.title + ":", "custom" == t.id) r += "函数";
                        else {
                            let i = 1;
                            for (let l of t.groups) {
                                for (let t of l.list)
                                    if (t.format == e[i]) {
                                        r += t.title;
                                        break
                                    }
                                i++
                            }
                        }
                        break
                    }
                return r
            },
            _jT(t, e, ...r) {
                t += "";
                let i = this._mz(t),
                    l = i.shift();
                if ("number" == l || "currency" == l) {
                    let t = Number(e);
                    if (isNaN(t)) return e;
                    let r, o, s, d = "",
                        a = "";
                    "number" == l ? [r, o] = i : ([d, r, o, a] = i, d && (d = d.substring(1))), "#%" == r ? (t *= 100, r = "", a = "%") : "#‰" == r && (t *= 1e3, r = "", a = "‰"), s = o ? t.toFixed(o.length - 1) : t + "";
                    let n = s.indexOf("."),
                        h = "";
                    if (n > 0 && (h = s.substring(n), s = s.substring(0, n)), r) {
                        let t, e = ",",
                            i = r.lastIndexOf(e);
                        if (-1 == i && (e = "'", i = r.lastIndexOf(e)), -1 != i) {
                            t = r.substring(i + 1).length, s = ((t, e, r) => {
                                let i = "";
                                for (; t.length > e;) i = r + t.slice(-e) + i, t = t.substring(0, t.length - e);
                                return t && (i = t + i), i
                            })(s, t, e)
                        }
                    }
                    return d + s + h + a
                }
                if ("date" == l) {
                    let t = (t => t instanceof Date || (t = new Date(Date.parse(String(t).replace(/-/g, "/")))) instanceof Date && "Invalid Date" != t.toString() ? t : null)(e);
                    if (!t) return e;
                    let r = i.join(" ").trim();
                    for (let e of o) r = r.replace(e.reg, (r => e.fn(r, t)));
                    return r
                }
                if ("convert" == l) return e;
                if ("custom" == l) {
                    let t, l;
                    if (i.join("").replace(d, ((e, r, i) => {
                        t = r, l = i
                    })), !t && !l) return e; {
                        let i = [t, "\0", l].join(""),
                            o = s.get(i);
                        o || (o = Function(t, l), s.set(i, o));
                        try {
                            return o(e, ...r)
                        } catch (t) {
                            return t.message
                        }
                    }
                }
                return e
            }
        }
    })), s.d("42/fs", ["../3s/4b/3i", "../41/3i", "./7f"], (t => {
        let e = t("../3s/4b/3i"),
            r = t("../41/3i"),
            i = t("./7f"),
            l = !0;
        try {
            top.location, l = !1
        } catch {}
        l || (l = !window.showOpenFilePicker && !window.showSaveFilePicker);
        let o = "Report Designer File",
            s = [".rd"];
        return {
            _hR: () => l,
            async _gH() {
                if (l && !window.saveAs) try {
                    e.show(r("ll")), await i()
                } catch (t) {
                    throw t
                } finally {
                    e.hide()
                }
            },
            async _gG(t, e = s) {
                if (l) {
                    let e = t.files[0];
                    return e ? (t.value = "", await(t => new Promise(((e, r) => {
                        let i = new FileReader;
                        i.onload = t => {
                            e(t.target.result)
                        }, i.onerror = t => {
                            r(t)
                        }, i.readAsText(t)
                    })))(e)) : ""
                }
                let [r] = await showOpenFilePicker({
                    id: "_rd_write",
                    excludeAcceptAllOption: !0,
                    types: [{
                        description: o,
                        accept: {
                            "text/plain": e
                        }
                    }]
                }), i = await r.getFile();
                return await i.text()
            },
            async _gI(t, e, r = s) {
                if (l) {
                    let r = new Blob([e]);
                    saveAs(r, t)
                } else {
                    let i = await showSaveFilePicker({
                            id: "_rd_read",
                            suggestedName: t,
                            startIn: "downloads",
                            types: [{
                                description: o,
                                accept: {
                                    "text/plain": r
                                }
                            }]
                        }),
                        l = await i.createWritable();
                    await l.write(e), await l.close()
                }
            }
        }
    })), s.d("42/fx", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.fx || "//unpkg.com/function-plot/dist/") + "function-plot.js"];
        return () => r("functionPlot", o)
    })), s.d("42/43", ["3l", "../3j/3o"], (t => {
        let e, r, i = t("3l"),
            l = t("../3j/3o"),
            {
                guid: o,
                mark: s,
                now: d,
                node: a,
                State: n,
                config: h,
                isArray: f,
                isObject: p
            } = i,
            g = /<(script|style)[^>]*>[\S\s]*<\/\1[^>]*>/gi,
            c = o("_rd_bar_"),
            u = /(?:\r\n|\r|\n)/g,
            $ = {
                "&": 38,
                "<": 60,
                ">": 62,
                '"': 34,
                "'": 39,
                "`": 96
            },
            y = /[&<>"'\`]/g,
            m = t => `&#${$[t]};`,
            x = /\s/g,
            _ = t => null == t ? "" : t + "",
            b = t => {
                if (t)
                    if (f(t)) {
                        let e = [];
                        for (let r of t) e.push(b(r));
                        t = e
                    } else if (p(t)) {
                    let e = {};
                    for (let r in t) e[r] = b(t[r]);
                    t = e
                }
                return t
            },
            w = (t, e) => {
                let r = e.getBoundingClientRect(),
                    i = t.getBoundingClientRect();
                if (!l.fz(r, i, !0)) {
                    let {
                        offsetHeight: t,
                        offsetWidth: l,
                        scrollLeft: o,
                        scrollTop: s,
                        scrollHeight: d,
                        scrollWidth: a
                    } = e, n = t / 3, h = l / 3, f = i.x + o - r.x - h, p = i.y + s - r.y - n, g = d - t, c = a - l;
                    return f < 0 ? f = 0 : f > c && (f = c), p < 0 ? p = 0 : p > g && (p = g), {
                        x: f,
                        y: p
                    }
                }
            },
            k = (t, e, r = 1) => {
                if (r < 5) {
                    let i = a(e ? t : "_rdm_" + t);
                    if (i) {
                        let t = e || a("_rd_stage"),
                            r = w(i, t);
                        r && t.scrollTo(r.x, r.y)
                    } else setTimeout(k, 20, t, e, r++)
                }
            },
            v = (t, e) => t.repeat != e.repeat ? "infinite" == t.repeat ? 1 : "infinite" == e.repeat ? -1 : t.repeat - e.repeat : 0;
        return {
            fB: b,
            gs: w,
            fM: k,
            gm: t => _(t).replace(g, ""),
            fx(t, e, r = null) {
                e = e || 150;
                let i, l = o("dm_"),
                    d = this;
                return (...o) => {
                    clearTimeout(i);
                    let a = s(d, l);
                    i = setTimeout((() => {
                        a() && t.apply(r, o)
                    }), e)
                }
            },
            gk(t, e = 50) {
                let r, i = 0;
                return (...l) => {
                    r = d(), r - i > e && (i = r, t(...l))
                }
            },
            gr(t, e = 65) {
                let r, i = "";
                for (t += 1; t;) r = (t - 1) % 26, i = String.fromCharCode(r + e) + i, t = (t - r - 1) / 26;
                return i
            },
            gl: t => (t = _(t)).replace(y, m).replace(u, "<br/>").replace(x, "&nbsp;"),
            gq: (t, e = 0) => (t = (t + e) % 180) <= 22.5 || t > 157.5 ? "ew" : t <= 67.5 ? "nwse" : t <= 112.5 ? "ns" : t <= 157.5 ? "nesw" : void 0,
            fJ: (t, e, r) => ((t += "").length < e && (t = r.repeat(e - t.length) + t), t),
            gp() {
                if (!e) {
                    let t = h("rootId"),
                        r = a(t);
                    e = getComputedStyle(r)
                }
                return e.getPropertyValue("--rd-fx")
            },
            fy() {
                let t = h("rootId"),
                    e = a(t);
                return {
                    _fG: e.offsetWidth,
                    _fH: e.offsetHeight
                }
            },
            gn(t) {
                if (!1 !== n.get("fY") && (null == t ? void 0 : t.length)) {
                    let e = n.get("fX"),
                        r = [],
                        i = [],
                        l = [],
                        o = [],
                        s = [],
                        d = [],
                        a = [];
                    for (let {
                            delay: n,
                            repeat: h,
                            fn: f,
                            use: p,
                            duration: g,
                            direction: c,
                            mode: u,
                            hidden: $
                        }
                        of t) {
                        if ($ || !p.trim() || e < n) continue;
                        let t = p.split(",");
                        for (let p of t) {
                            let t = e;
                            if ("infinite" != h) {
                                let r = n + g * h;
                                e > r && (t = r)
                            }
                            r.push(p), i.push(`-${t-n}s`), l.push(h), o.push(f), s.push(`${g}s`), d.push(u), a.push(c)
                        }
                    }
                    if (r.length) return `animation-name:${r};animation-delay:${i};animation-iteration-count:${l};animation-timing-function:${o};animation-play-state:paused;animation-duration:${s};animation-fill-mode:${d};animation-direction:${a};`
                }
                return ""
            },
            go(t) {
                if (null == t ? void 0 : t.length) {
                    let e = [],
                        r = [],
                        i = [],
                        l = [],
                        o = [],
                        s = [],
                        d = [];
                    t.sort(v);
                    for (let {
                            use: a,
                            delay: n,
                            repeat: h,
                            fn: f,
                            duration: p,
                            mode: g,
                            direction: c,
                            hidden: u
                        }
                        of t) {
                        if (u || !a.trim()) continue;
                        let t = a.split(",");
                        for (let a of t) e.push(a), r.push(`${n}s`), i.push(h), l.push(f), o.push(`${p}s`), s.push(g), d.push(c)
                    }
                    if (e.length) return `animation-name:${e};animation-delay:${r};animation-iteration-count:${i};animation-timing-function:${l};animation-duration:${o};animation-fill-mode:${s};animation-direction:${d};`
                }
                return ""
            },
            gt() {
                if (!r) {
                    let t = a(c);
                    t || (t = document.createElement("div"), t.className = "rd-fy rd-gx rd-ir rd-gz rd-g1 rd-g7 rd-gF rd-hJ rd-io rd-hy", t.innerHTML = '<div class="rd-g8 rd-g4"></div>', t.id = c, document.body.appendChild(t)), r = {
                        fy: t.offsetWidth - t.clientWidth,
                        fx: t.offsetHeight - t.clientHeight
                    }
                }
                return r
            }
        }
    })), s.d("42/html2canvas", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.html2canvas || "//unpkg.com/html2canvas@1.4.1/dist/") + "html2canvas.min.js"];
        return () => r("html2canvas", o)
    })), s.d("42/7g", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.jspdf || "//unpkg.com/jspdf@2.5.1/dist/") + "jspdf.umd.min.js"];
        return () => r("jspdf", o)
    })), s.d("42/7e", ["3l"], (t => {
        let e = t("3l"),
            {
                State: r
            } = e,
            i = {},
            l = {},
            o = "can not load: ",
            {
                head: s
            } = document,
            d = t => new Promise((e => {
                let i, l = t.endsWith(".css");
                if (r.fire("fX", {
                    _is: 1
                }), l) i = document.createElement("link"), i.onload = i.onerror = () => {
                    e(), r.fire("fX")
                }, i.href = t, i.rel = "stylesheet", s.appendChild(i);
                else {
                    let i = document.createElement("script");
                    i.onload = i.onerror = () => {
                        s.removeChild(i), e(), r.fire("fX")
                    }, i.src = t, s.appendChild(i)
                }
            }));
        return (t, e, r) => new Promise(((s, a) => {
            let n = i[t] || 1,
                h = l[t] || (l[t] = []);
            if (4 & n) window[t] ? s() : a(o + t);
            else if (2 & n) h.push([s, a]);
            else {
                i[t] = 2 | n, h.push([s, a]);
                let l = [];
                if (r)
                    for (let t of r) l.push(d(t));
                Promise.all(l).then((() => {
                    let t = [];
                    for (let r of e) t.push(d(r));
                    return Promise.all(t)
                })).then((() => {
                    i[t] = 4 | n;
                    for (let [e, r] of h) window[t] ? e() : r(o + t);
                    h.length = 0
                })).catch(a)
            }
        }))
    })), s.d("42/map", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = l && l.leaflet || "//unpkg.com/leaflet@1.8.0/dist/",
            s = [o + "leaflet.css", o + "leaflet.js"];
        return () => r("L", s)
    })), s.d("42/mathjax", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.mathjax || "//unpkg.com/mathjax@3.2.2/es5/") + "tex-svg.js"];
        return () => r("MathJax", o)
    })), s.d("42/qrcode", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.qrcode || "//unpkg.com/@keeex/qrcodejs-kx@1.0.2/") + "qrcode.min.js"];
        return {
            _jK: [{
                text: "pC",
                value: "L"
            }, {
                text: "pD",
                value: "M"
            }, {
                text: "pE",
                value: "Q"
            }, {
                text: "pB",
                value: "H"
            }],
            _jF: () => r("QRCode", o)
        }
    })), s.d("42/signature", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.signature || "//unpkg.com/signature_pad@4.0.7/dist/") + "signature_pad.umd.min.js"];
        return () => r("SignaturePad", o)
    })), s.d("42/75", ["3l", "../3j/3n", "../3j/4e", "../3j/43", "../3j/3o", "../3s/72/3i"], (t => {
        let e, r = t("3l"),
            i = t("../3j/3n"),
            l = t("../3j/4e"),
            o = t("../3j/43"),
            s = t("../3j/3o"),
            d = t("../3s/72/3i"),
            {
                node: a,
                config: n,
                guid: h,
                inside: f
            } = r,
            p = h("_rd_rp_"),
            {
                max: g
            } = Math,
            c = {
                _hY() {
                    a(p) || (e = a(n("rootId")), e.insertAdjacentHTML("beforeend", `<div class="rd-gv rd-hW rd-g_ rd-hA" id="${p}"></div>`))
                }, _f2(t, r) {
                    let l, o = a(p).style,
                        d = e.getBoundingClientRect(),
                        n = getComputedStyle(e),
                        h = parseInt(n.borderLeftWidth, 10) || 0,
                        f = parseInt(n.borderTopWidth, 10) || 0,
                        {
                            props: c
                        } = t,
                        u = i.fI(c.x),
                        $ = i.fI(c.y),
                        y = i.fI(c.width),
                        m = i.fI(c.height);
                    if (r) {
                        let t = a(r);
                        l = t ? t.getBoundingClientRect() : {
                            x: -1e5,
                            y: -1e5
                        }
                    } else l = s.fE({
                        x: u,
                        y: $
                    });
                    o.left = l.x - d.x - h - scrollX + "px", o.top = l.y - d.y - f - scrollY + "px", o.width = g(y, 1) + "px", o.height = g(m, 1) + "px";
                    let x = c.rotate || 0;
                    o.transform = `rotate(${x}deg)`
                }, _f3() {
                    let t = a(p).style;
                    t.left = "-10000px", t.top = "-10000px"
                }
            };
        return {
            _ng(t) {
                c._hY(), d._ng(), d._nw(t)
            }, _nh(t) {
                d._nh(), d._hN(t), this._f3()
            }, _f3() {
                c._f3()
            }, _nv(t) {
                return f(t, this.root)
            }, "_oy<pointerover>" (t) {
                if (!f(t.relatedTarget, t.eventTarget)) {
                    let {
                        element: e,
                        dest: r
                    } = t.params;
                    c._f2(e, r)
                }
            }, "_oz<pointerout>" (t) {
                f(t.relatedTarget, t.eventTarget) || c._f3()
            }, "_oA<click>" (t) {
                if (!t._hS) {
                    let {
                        params: e,
                        shiftKey: r,
                        ctrlKey: i,
                        metaKey: o
                    } = t, {
                        element: s,
                        dest: d
                    } = e;
                    l.fA(s, r || i || o), c._f2(s, d)
                }
            }, "_qn<click>" (t) {
                t._hS = 1;
                let {
                    element: e
                } = t.params;
                o.g_(e, "_qo"), c._f3()
            }
        }
    })), s.d("42/4o", ["3l"], (t => {
        let e = t("3l"),
            {
                isArray: r
            } = e,
            {
                abs: i,
                min: l,
                max: o
            } = Math,
            s = ["head", "label", "data", "total", "foot"],
            d = (t, e) => {
                for (let r of s) e[r] && (t[r] = !0);
                return t
            },
            a = (t, e, r) => {
                let i = r;
                for (let r of t)
                    for (let t of r.cols) {
                        let r = t._kJ + t.colspan - 1;
                        if (t._kJ <= e && r >= e) {
                            let t = r - e;
                            t < i && (i = t)
                        }
                    }
                return i
            },
            n = (t, e, r) => {
                let i = r;
                for (let r of t)
                    for (let t of r.cols) {
                        let r = t._m_ + t.rowspan - 1;
                        if (t._m_ <= e && r >= e) {
                            let t = r - e;
                            t < i && (i = t)
                        }
                    }
                return i
            };
        return {
            fx(t, e) {
                if (!e || null == t._j2 || null == t._j3) {
                    let e = 0,
                        r = 0,
                        i = {},
                        l = {},
                        {
                            rows: o
                        } = t,
                        s = 0,
                        d = 0,
                        a = 0;
                    for (let t of o) {
                        r = 0, a = 0;
                        for (let o of t.cols) {
                            for (; i[r] && l[r] && e < l[r];) r += i[r];
                            o._hb = a++, o._ha = e, o._m_ = e, o._kJ = r, o.rowspan ? (l[r] = o.rowspan + e, o._l9 = e + o.rowspan - 1) : o._l9 = e, o.colspan && (i[r] = o.colspan, r += o.colspan - 1), o._kK = r++, r > s && (s = r)
                        }
                        e++, e > d && (d = e)
                    }
                    t._j2 = d, t._j3 = s
                }
                return t
            }, fD(t, e) {
                let i, {
                        focusCol: l,
                        focusRow: o,
                        rows: s
                    } = t,
                    d = 0,
                    h = 0;
                if ("left" == e) i = [
                    [o, l - 1],
                    [o, l]
                ], h = 1;
                else if ("right" == e) i = [
                    [o, l],
                    [o, l + 1]
                ], h = 1;
                else {
                    d = 1;
                    let t = s[o].cols[l],
                        r = t._l9 + 1,
                        a = t._kK,
                        n = 0;
                    for (let d = 0; d <= r; d++) {
                        for (let r = 0; r <= a; r++) {
                            let a = s[d];
                            if (a) {
                                let s = a.cols[r];
                                if (s && s != t) {
                                    let r = s._hb;
                                    if (s._kJ == t._kJ && s._kK == t._kK)
                                        if (s._l9 + 1 == t._m_) {
                                            if ("top" == e) {
                                                i = [
                                                    [d, r],
                                                    [o, l]
                                                ], n = 1;
                                                break
                                            }
                                        } else if (t._l9 + 1 == s._m_ && "bottom" == e) {
                                        i = [
                                            [o, l],
                                            [d, r]
                                        ], n = 1;
                                        break
                                    }
                                }
                            }
                        }
                        if (n) break
                    }
                }
                let [f, p] = i;
                t.focusRow = f[0], t.focusCol = f[1];
                let g = 0,
                    c = 0,
                    u = -1,
                    $ = -1;
                for (let t of i) {
                    let e = s[t[0]].cols[t[1]],
                        r = e._l9;
                    r > u && (u = r);
                    let i = e._kK;
                    i > $ && ($ = i)
                }
                let y = s[f[0]].cols[f[1]],
                    m = s[p[0]].cols[p[1]];
                c = u - y._m_ + 1, g = $ - y._kJ + 1, h && (y.width += m.width), d && (y.height += m.height), r(y.elements) ? y.elements.push(...m.elements) : !y.bindKey && m.bindKey && (y.bindKey = m.bindKey, y.bindName = m.bindName, y.type = m.type), y.colspan = g, y.rowspan = c;
                for (let t = i.length - 1; t > 0; t--) {
                    let e = i[t];
                    s[e[0]].cols.splice(e[1], 1)
                }
                let x = t._j2;
                for (let t = x; t--;) {
                    s[t].cols.length || (s.splice(t, 1), x--)
                }
                for (let t = 0; t < x; t++) {
                    let e = n(s, t, x);
                    if (e > 0) {
                        for (let r = 0; r <= t; r++) {
                            let i = s[r];
                            for (let r of i.cols) {
                                let i = r._m_ + r.rowspan - 1;
                                r._m_ <= t && i >= t && (r.rowspan -= e)
                            }
                        }
                        break
                    }
                }
                let _ = t._j3;
                for (let t = 0; t < _; t++) {
                    let e = a(s, t, _);
                    if (e > 0) {
                        for (let r of s)
                            for (let i of r.cols) {
                                let r = i._kJ + i.colspan - 1;
                                i._kJ <= t && r >= t && (i.colspan -= e)
                            }
                        break
                    }
                }
                return t
            }, fE(t, e, r, i, l) {
                let {
                    focusRow: o,
                    focusCol: s,
                    rows: a
                } = t, n = a[o], h = n.cols[s], f = this.fy(t);
                if (e) {
                    let t, e;
                    if (h.colspan > 1) {
                        let r = h.colspan / 2 | 0,
                            i = h.colspan - r,
                            l = 0,
                            o = h._kK;
                        for (let t = o - r + 1; t <= o; t++) l += f._j4[t];
                        h.colspan = i, h.width -= l, t = r, e = l
                    } else {
                        let r = h.width,
                            l = r / 2;
                        l < i && (l = i), h.width = l, e = l, t = 1;
                        let o = 2 * l - r;
                        for (let t of a)
                            for (let e of t.cols) e != h && e._kJ <= h._kJ && e._kK >= h._kK && (e.colspan++, e.width += o)
                    }
                    let l = {...r, elements: [], colspan: t, rowspan: h.rowspan, width: e, height: h.height
                    };
                    n.cols.splice(s + 1, 0, l)
                } else {
                    let t, e;
                    if (h.rowspan > 1) {
                        let r = h.rowspan / 2 | 0,
                            i = h.rowspan - r,
                            l = 0,
                            o = h._l9;
                        for (let t = o - r + 1; t <= o; t++) l += f._j5[t];
                        h.rowspan = i, h.height -= l, t = r, e = l, n = a[h._m_ + i];
                        let d = 0;
                        for (let t of n.cols) {
                            if (t._kJ > h._kJ) {
                                s = d;
                                break
                            }
                            d++
                        }
                    } else {
                        let r = h.height,
                            i = r / 2;
                        i < l && (i = l), h.height = i, e = i, t = 1;
                        let o = 2 * i - r;
                        for (let t of a)
                            for (let e of t.cols) e != h && e._m_ <= h._m_ && e._l9 >= h._l9 && (e.rowspan++, e.height += o);
                        a.splice(h._l9 + 1, 0, n = d({
                            cols: []
                        }, n))
                    }
                    let i = {...r, elements: [], colspan: h.colspan, rowspan: t, width: h.width, height: e
                    };
                    n.cols.splice(s, 0, i)
                }
            }, fz(t, e, r, i) {
                let l = {},
                    {
                        rows: o,
                        focusRow: s,
                        _j3: a
                    } = t,
                    n = o[s],
                    h = this.fy(t);
                for (let t = 0; t < e; t++) {
                    let r = o[t];
                    for (let t of r.cols)
                        if (t._l9 >= e) {
                            t.rowspan++, t.height += i;
                            let e = t._kJ,
                                r = e + t.colspan;
                            for (let t = e; t < r; t++) l[t] = 1
                        }
                }
                let f = {
                    cols: []
                };
                n && d(f, n);
                for (let t = 0; t < a; t++)
                    if (!l[t]) {
                        let e = {...r, elements: [], width: h._j4[t], height: i, rowspan: 1, colspan: 1
                        };
                        f.cols.push(e)
                    }
                return o.splice(e, 0, f), t
            }, fB(t, e, r, i) {
                let {
                    rows: l
                } = t, o = [], s = 0, d = this.fy(t);
                for (let t of l) {
                    let l = t.cols.length,
                        a = l;
                    for (let r = 0; r < l; r++) {
                        let l = t.cols[r];
                        if (l.rowspan > 1 && o.push(l), l._kJ < e && l._kK >= e) {
                            l.colspan++, l.width += i, a = -1;
                            break
                        }
                        if (l._kJ >= e) {
                            a = r;
                            break
                        }
                    }
                    for (let t of o)
                        if (t._kJ < e && t._kK >= e && t._m_ < s && t._l9 >= s) {
                            a = -1;
                            break
                        }
                    if (-1 != a) {
                        let e = {...r, elements: [], height: d._j5[s], width: i, rowspan: 1, colspan: 1
                        };
                        t.cols.splice(a, 0, e)
                    }
                    s++
                }
                return t
            }, fA(t, e) {
                let r, {
                    rows: s,
                    focusRow: d,
                    focusCol: a
                } = t;
                if (null != e) r = [e, e];
                else {
                    let t = s[d].cols[a];
                    r = [t._m_, t._l9]
                }
                let n = {},
                    h = 0,
                    f = r[1] - r[0] + 1,
                    p = s[r[1] + 1],
                    g = f / 2;
                for (let t = r[1]; t >= 0; t--) {
                    let e = s[t],
                        d = 0;
                    for (let t = e.cols.length; t--;) {
                        let s = e.cols[t],
                            a = s._kJ,
                            p = s._l9,
                            c = s._m_,
                            u = p - c + 1;
                        if (1 == u && (d = s.height), u > 1) {
                            let $ = u / 2;
                            if (i(r[0] + g - c - $) < g + $) {
                                if (r[0] == s._m_ && s._l9 - s._m_ >= f && (n[a] = s, h = 1), !d)
                                    for (let r = t; r--;) {
                                        let t = e.cols[r];
                                        if (t._l9 == t._m_) {
                                            d = t.height;
                                            break
                                        }
                                    }
                                let i = l(p, r[1]) - o(r[0], c) + 1;
                                s.rowspan -= i, s.height -= d * i
                            }
                        }
                    }
                    t <= r[1] && t >= r[0] && s.splice(t, 1)
                }
                if (h) {
                    let e = t._j3;
                    if (p)
                        for (let t = e, r = p.cols.length; t--;) {
                            let e = n[t];
                            if (e) {
                                let i = 0;
                                for (let e = r; e--;) {
                                    if (p.cols[e]._kJ < t) {
                                        r = e, i = e + 1;
                                        break
                                    }
                                }
                                p.cols.splice(i, 0, e)
                            }
                        }
                }
                return t
            }, fC(t, e, r) {
                let s, {
                        focusRow: d,
                        focusCol: a,
                        rows: n
                    } = t,
                    h = 0;
                if (null != e) {
                    let t;
                    null == r && (r = e), s = [e, r];
                    for (let i of n) {
                        for (let l = i.cols.length; l--;) {
                            let o = i.cols[l];
                            if (o._kJ == e && o._kK == r) {
                                t = 1, h = o.width;
                                break
                            }
                        }
                        if (t) break
                    }
                } else {
                    let t = n[d].cols[a];
                    s = [t._kJ, t._kK], h = t.width
                }
                let f = (s[1] - s[0] + 1) / 2;
                for (let t of n)
                    for (let e = t.cols.length; e--;) {
                        let r = t.cols[e],
                            d = r._kJ,
                            a = r._kK;
                        if (d >= s[0] && a <= s[1]) t.cols.splice(e, 1);
                        else if (r.colspan > 1) {
                            let t = (a - d + 1) / 2;
                            if (i(s[0] + f - d - t) < f + t) {
                                let t = l(a, s[1]) - o(s[0], d) + 1;
                                r.colspan -= t, r.width -= h
                            }
                        }
                    }
                return t
            }, fy(t, e) {
                let r = [],
                    i = [],
                    {
                        rows: l
                    } = t,
                    s = !1,
                    d = !1;
                for (let t of l)
                    for (let l of t.cols) {
                        if (1 == l.colspan) {
                            let t = l._kJ;
                            (null == r[t] || !s && l.width > r[t] || e == l) && (s = s || e == l, r[t] = l.width)
                        }
                        if (1 == l.rowspan) {
                            let t = l._m_;
                            (null == i[t] || !d && l.height > i[t] || e == l) && (d = d || e == l, i[t] = l.height)
                        }
                    }
                for (let t of l)
                    for (let l of t.cols) {
                        if (l.colspan > 1) {
                            let t = 0,
                                i = 0,
                                s = l._kJ,
                                d = s + l.colspan;
                            for (let e = s; e < d; e++) null != r[e] && r[e] >= 0 && (t += r[e], i++);
                            if (i < l.colspan) {
                                let e = o(l.width - t, 0) / (l.colspan - i);
                                for (let t = s; t < d; t++)(null == r[t] || r[t] < 0) && (r[t] = e)
                            } else if (t < l.width && (!e || e == l) || t > l.width && e && e == l)
                                for (let e = s; e < d; e++) r[e] = t > 0 ? r[e] / t * l.width : l.width / l.colspan
                        }
                        if (l.rowspan > 1) {
                            let t = 0,
                                r = 0,
                                s = l._m_,
                                d = s + l.rowspan;
                            for (let e = s; e < d; e++) null != i[e] && i[e] >= 0 && (t += i[e], r++);
                            if (r < l.rowspan) {
                                let e = o(0, l.height - t) / (l.rowspan - r);
                                for (let t = s; t < d; t++)(null == i[t] || i[t] < 0) && (i[t] = e)
                            } else if (t < l.height && (!e || e == l) || t > l.height && e && l == e)
                                for (let e = s; e < d; e++) i[e] = t > 0 ? i[e] / t * l.height : l.height / l.rowspan
                        }
                    }
                return {
                    _j4: r,
                    _j5: i
                }
            }, fF(t, e) {
                let r = this.fy(t, e),
                    {
                        rows: i
                    } = t;
                for (let t of i)
                    for (let e of t.cols) {
                        let t = e.rowspan || 1,
                            i = e.colspan || 1,
                            l = e._kJ,
                            o = e._m_,
                            s = 0,
                            d = 0;
                        for (let t = l + i - 1; t >= l; t--) s += r._j4[t];
                        for (let e = o + t - 1; e >= o; e--) d += r._j5[e];
                        e.width = s, e.height = d
                    }
            }
        }
    })), s.d("42/underscore", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = [(l && l.underscore || "//unpkg.com/underscore@1.13.4/") + "underscore-umd-min.js"];
        return () => r("_", o)
    })), s.d("42/xsheet", ["3l", "./7e"], (t => {
        let e = t("3l"),
            r = t("./7e"),
            {
                config: i
            } = e,
            l = i("providers"),
            o = l && l.luckysheet || "//unpkg.com/luckysheet/dist/",
            s = [o + "plugins/css/pluginsCss.css", o + "plugins/plugins.css", o + "css/luckysheet.css", o + "assets/iconfont/iconfont.css", o + "plugins/js/plugin.js"],
            d = [o + "luckysheet.umd.js"];
        return () => r("luckysheet", d, s)
    })), s.d("3s/5k/alert", ["3l", "../../41/3i"], (t => {
        let e, r, i = t("3l"),
            l = t("../../41/3i"),
            o = "div",
            s = "button",
            d = {
                class: "rd-fI rd-fA rd-gS rd-gT rd-gh rd-gL rd-gP rd-gW rd-h1"
            },
            a = {
                class: "rd-ia rd-hO rd-fA"
            },
            n = {
                class: "rd-fM rd-hj"
            },
            h = {
                class: "rd-fO rd-gL rd-ha rd-gP rd-gS rd-hU rd-hZ rd-fP rd-gh"
            },
            {
                View: f,
                toTry: p,
                node: g
            } = i;
        return f.extend({
            tmpl(t, i, l) {
                let f, p, g, {
                    title: c,
                    body: u,
                    i18n: $
                } = t;
                return f = e ? [e] : [e = i(o, {
                    $: "d;",
                    class: "rd-fJ rd-gS rd-h0"
                })], p = [i(0, c)], g = [i("h5", a, p)], f.push(i(o, d, g)), g = [i(0, u)], f.push(i(o, n, g)), p = [i(0, $("oK"))], g = [i(s, {
                    _click: l + "_nI()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
                    type: s,
                    tabindex: 1,
                    id: "_mx_o_" + l
                }, p)], f.push(i(o, h, g)), r ? f.push(r) : f.push(r = i(o, {
                    $: "d:",
                    class: "rd-fN rd-gS rd-hY"
                })), i(l, 0, f)
            }, init(t) {
                let e = this;
                e._gC = t.dialog, e._nF = t.body, e._nG = t.title || l("oJ"), e._nH = t.enter
            }, async render() {
                let t = this;
                await t.digest({
                    body: t._nF,
                    title: t._nG
                });
                let e = g(`_mx_o_${this.id}`);
                e && e.focus()
            }, "_nI<click>" () {
                let t = this;
                t._gC.close(), t._nH && p(t._nH)
            }
        })
    })), s.d("3s/5k/confirm", ["3l", "../../41/3i"], (t => {
        let e, r, i = t("3l"),
            l = t("../../41/3i"),
            o = "div",
            s = "button",
            d = {
                class: "rd-fI rd-fA rd-gS rd-gT rd-gh rd-gL rd-gP rd-gW rd-h1"
            },
            a = {
                class: "rd-ia rd-hO rd-fA"
            },
            n = {
                class: "rd-fM rd-hj"
            },
            h = {
                class: "rd-fO rd-gL rd-ha rd-gP rd-gS rd-hU rd-hZ rd-fP rd-gh"
            },
            {
                View: f,
                toTry: p,
                node: g
            } = i;
        return f.extend({
            tmpl(t, i, l) {
                let f, p, g, {
                    title: c,
                    body: u,
                    i18n: $
                } = t;
                return f = e ? [e] : [e = i(o, {
                    $: "d;",
                    class: "rd-fJ rd-gS rd-h0"
                })], p = [i(0, c)], g = [i("h5", a, p)], f.push(i(o, d, g)), g = [i(0, u)], f.push(i(o, n, g)), p = [i(0, $("oK"))], g = [i(s, {
                    type: s,
                    _click: l + "_nI()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
                    tabindex: 1,
                    id: "_mx_o_" + l
                }, p)], p = [i(0, $("f2"))], g.push(i(s, {
                    type: s,
                    _click: l + "_gD()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-f2",
                    tabindex: 2
                }, p)), f.push(i(o, h, g)), r ? f.push(r) : f.push(r = i(o, {
                    $: "d:",
                    class: "rd-fN rd-gS rd-hY"
                })), i(l, 0, f)
            }, init(t) {
                let e = this;
                e._gC = t.dialog, e._nF = t.body, e._nG = t.title || l("oJ"), e._nH = t.enter, e._nJ = t.cancel
            }, async render() {
                let t = this;
                await t.digest({
                    body: t._nF,
                    title: t._nG
                });
                let e = g(`_mx_o_${this.id}`);
                e && e.focus()
            }, "_nI<click>" () {
                let t = this;
                t._gC.close(), t._nH && p(t._nH)
            }, "_gD<click>" () {
                let t = this;
                t._gC.close(), t._nJ && p(t._nJ)
            }
        })
    })), s.d("3s/5k/3i", ["3l"], (t => {
        let e, r, i = t("3l"),
            l = "div",
            {
                View: o,
                applyStyle: s,
                node: d,
                dispatch: a,
                has: n,
                guid: h,
                mix: f,
                attach: p,
                detach: g,
                delay: c
            } = i;
        s("rd-lN", ".rd-lI{border:1px solid #e6e6e6;margin:25px;min-height:120px}.rd-lJ{opacity:.2;top:11px;right:10px}.rd-lJ:focus,.rd-lJ:hover{opacity:.5}.rd-lK{margin:auto}.rd-lL{float:right;margin:36px 35px 0 -35px}.rd-lM{background-color:#0000}.rd-lN{-webkit-animation:rd-fz .2s;animation:rd-fz .2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes rd-fz{from{background-color:#0000}to{background-color:#0006}}@keyframes rd-fz{from{background-color:#0000}to{background-color:#0006}}.rd-lO{-webkit-animation:rd-fA .2s;animation:rd-fA .2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes rd-fA{from{background-color:#0006}to{background-color:#0000}}@keyframes rd-fA{from{background-color:#0006}to{background-color:#0000}}.rd-lP{-webkit-animation:rd-fB .2s;animation:rd-fB .2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes rd-fB{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes rd-fB{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.rd-lQ{-webkit-animation:rd-fC .2s;animation:rd-fC .2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@-webkit-keyframes rd-fC{from{transform:translateY(0);opacity:1}to{transform:translateY(-30px);opacity:0}}@keyframes rd-fC{from{transform:translateY(0);opacity:1}to{transform:translateY(-30px);opacity:0}}");
        let u, $ = 800;
        return o.extend({
            tmpl(t, i, o, s, d, a) {
                let n, h, f, p, g, {
                    zIndex: c,
                    width: u,
                    closable: $,
                    i18n: y,
                    view: m
                } = t;
                return n = [i(l, {
                    class: "rd-lM rd-gx rd-ho rd-lN",
                    style: "z-index:" + (c - 1),
                    id: "_mx_mask_" + o
                })], p = [], $ && (h = [e || (e = i(0, ""))], p.push(i("span", {
                    class: "rd-fx rd-lJ rd-lL rd-gS rd-hd rd-h2",
                    title: y("oL"),
                    _click: o + "_hC()"
                }, h))), r ? h = [r] : (f = [i(0, '<span class="rd-fQ"></span>', 1)], h = [r = i(l, {
                    $: "d;",
                    class: "rd-fR rd-gL rd-gP rd-h_ rd-go"
                }, f)]), p.push(i(l, {
                    $$: "#",
                    _5: o,
                    class: "rd-lI rd-gh rd-h9 rd-gM",
                    _: m + "?=" + a(d, t, "d;")
                }, h)), g = [i(l, {
                    class: "rd-lK rd-ig rd-gO",
                    id: "_mx_body_" + o,
                    style: `width:${u}px`
                }, p)], n.push(i(l, {
                    class: "rd-ip rd-gx rd-io rd-hJ rd-gn rd-go rd-gL rd-ho rd-fE rd-gH rd-lP rd-gG",
                    style: "z-index:" + c,
                    tabindex: 0,
                    id: "_mx_scroll_" + o
                }, g)), i(o, 0, n)
            }, init(t) {
                let {
                    root: e
                } = this;
                var r;
                this.on("destroy", (() => {
                    (t => {
                        let e, r = u;
                        for (; r;) {
                            if (r.fx == t) {
                                e ? e.fy = r.fy : u = r.fy;
                                break
                            }
                            e = r, r = r.fy
                        }
                    })(this), $ -= 2, a(e, "_nK"), e.remove()
                })), n(t, "closable") || (t.closable = !0), this.set(t), $ += 2, r = this, u = u ? {
                    fx: r,
                    fy: u
                } : {
                    fx: r
                }
            }, async render() {
                await this.digest({
                    zIndex: $
                });
                let t = d(`_mx_scroll_${this.id}`);
                t && t.focus()
            }, _nL() {
                let t, e = this.id;
                t = d("_mx_scroll_" + e), t.classList.add("rd-lQ"), t = d("_mx_mask_" + e), t.classList.add("rd-lO")
            }, "_hC<click>" () {
                a(this.root, "_nM")
            }, "$doc<keyup>" (t) {
                if ("Escape" == t.code) {
                    let t = null == u ? void 0 : u.fx;
                    t == this && t.get("closable") && a(this.root, "_nM")
                }
            }
        }).static({
            _nO(t, e) {
                let r = h("_mx_dlg_");
                document.body.insertAdjacentHTML("beforeend", '<div id="' + r + '" class="rd-fy"/>');
                let i = d(r),
                    l = t.owner.mount(i, "3s/5k/3i", e),
                    o = async() => {
                        i._nN || (i._nN = 1, l.invoke("_nL"), g(i, "_nM", o), await c(200), l.unmount())
                    };
                return p(i, "_nM", o), i
            }, alert(t, e, r) {
                this.confirm(t, e, null, r, "alert")
            }, confirm(t, e, r, i, l = "confirm") {
                this.mxDialog("3s/5k/" + l, {
                    body: t,
                    cancel: r,
                    enter: e,
                    title: i,
                    modal: !0,
                    width: 350
                })
            }, mxDialog(t, e) {
                let r = this,
                    i = "$dlg_" + t;
                if (!r[i]) {
                    let l, o;
                    r[i] = 1;
                    let s = f({
                        view: t
                    }, e);
                    s.width || (s.width = 550), s.dialog = {
                        close() {
                            l && a(l, "_nM")
                        }
                    }, l = r._nO(r, s);
                    let d = () => {
                        delete r[i], g(l, "_nK", d), o && o()
                    };
                    return p(l, "_nK", d), {
                        close() {
                            l && a(l, "_nM")
                        }, _hE(t) {
                            o = t
                        }
                    }
                }
            }
        })
    })), s.d("3s/4b/3i", ["3l"], (t => {
        let e = t("3l"),
            {
                applyStyle: r,
                guid: i,
                node: l,
                mark: o,
                delay: s
            } = e;
        r("rd-l5", ".rd-mn{z-index:2000}.rd-mo{background:#0002}.rd-mp{border-radius:5px;background:#0008;padding:6px;color:#fff;min-width:15%}");
        let d, a = i("_mx_toast_");
        return {
            async show(t, e, r) {
                d && (d.cancel(), d = null);
                let i = l(a);
                i || (i = document.createElement("div"), i.id = a, i.className = "rd-mn rd-fy rd-gx rd-ho rd-gL rd-gP rd-h_ rd-gE", i.innerHTML = `<div class="rd-mp rd-gs" id="${a}_c"></div>`, document.body.appendChild(i));
                let {
                    classList: n
                } = i;
                r ? (n.remove("rd-gz"), n.add("rd-mo")) : (n.add("rd-gz"), n.remove("rd-mo")), l(a + "_c").innerText = t;
                let h = o(this, "_f3");
                e && (await s(e), h() && this.hide())
            }, hide() {
                let t = l(a);
                t && (t.classList.add("rd-gz"), d = t.animate([{
                    opacity: 0
                }], {
                    duration: 150,
                    fill: "forwards"
                }))
            }
        }
    })), s.d("3s/6t/3i", ["3l", "../72/3i"], (t => {
        let e, r = t("3l"),
            i = t("../72/3i"),
            l = "span",
            o = "div",
            s = {
                class: "rd-fx rd-l3"
            },
            d = {
                class: "rd-lY rd-gV rd-gh rd-ig rd-gv rd-iz rd-hJ rd-gF rd-gH rd-gG rd-hX"
            },
            a = {
                class: "rd-fx rd-l3 rd-hN"
            },
            {
                View: n,
                applyStyle: h,
                toMap: f,
                inside: p,
                node: g,
                dispatch: c,
                isFunction: u
            } = r;
        return h("rd-lQ", ".rd-lR{min-width:50px;height:22px}.rd-lS:focus,.rd-lS:focus:hover{border-color:var(--rd-fx)}.rd-lT{padding:0 16px 0 3px}.rd-lU{background-color:#f5f5f5}.rd-lU .rd-lT{cursor:not-allowed;color:#999}.rd-lV{top:0;width:16px;color:#ccc}.rd-lV::after{left:0;top:0;right:0;bottom:0;width:0;height:0;position:absolute;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid #ccc;content:'';display:block;margin:auto}.rd-lW .rd-lV{transform:rotate(180deg)}.rd-lW,.rd-lW:hover{border-color:var(--rd-fx)}.rd-lX{height:20px;line-height:21px}.rd-lY{border:1px solid #ccc;left:-1px;top:100%;right:-1px;bottom:auto}.rd-lW .rd-lY{display:block}.rd-lZ{max-height:224px}.rd-l0{padding:0 2px;margin:2px 0}.rd-l1{padding:0 5px;height:20px;line-height:20px}.rd-l1:hover{background-color:#f0f0f0}.rd-l2,.rd-l2:active,.rd-l2:focus,.rd-l2:hover{color:#fff;background-color:var(--rd-fx)}.rd-l3{padding:0 4px}"), n.extend({
            tmpl(t, r, i, n, h, f) {
                let p, g, c, u, $, y, m, x, {
                    disabled: _,
                    i18n: b,
                    selectedText: w,
                    selected: k,
                    emptyText: v,
                    selectedIcon: j,
                    rList: L,
                    list: S,
                    textKey: z,
                    valueKey: A,
                    iconKey: C
                } = t;
                if (x = [], u = [], j && (c = [r(0, j, 1)], u.push(r("i", s, c))), u.push(r(0, b(w))), g = "rd-lX rd-gB rd-gI", "" !== k && k != v || (g += " rd-hE"), $ = [r(l, {
                    class: g
                }, u)], e ? $.push(e) : $.push(e = r(l, {
                    $: "d;",
                    class: "rd-lV rd-gv rd-go rd-hS rd-hu"
                })), x.push(r(o, {
                    class: "rd-lT rd-hd rd-gw rd-gn",
                    _click: i + "_fC()",
                    title: b(w)
                }, $)), L) {
                    u = [];
                    for (let t = null == S ? void 0 : S.length, e = 0; e < t; e += 1) {
                        let t, o = S[e],
                            s = o,
                            d = o;
                        z && A && (s = b(o[z]), d = o[A], t = o[C]);
                        let n = d + "" == k + "";
                        m = [], t && (y = [r(0, t, 1)], m.push(r("i", a, y))), m.push(r(0, s)), g = "rd-l1 rd-ig rd-gB rd-hF rd-gn rd-hd rd-gI", n && (g += " rd-l2"), c = [r(l, {
                            _click: i + `_nU({item:'${f(h,o,`
                            d;.$ {
                                e
                            }.d: `)}'})`, class: g
                        }, m)], u.push(r("li", {
                            title: s,
                            class: "rd-l0 rd-hJ"
                        }, c))
                    }
                    $ = [r("ul", {
                        class: "rd-fT rd-ia rd-fA rd-lZ rd-id",
                        id: "_mx_list_" + i
                    }, u)], x.push(r(o, d, $))
                }
                return g = "rd-lR rd-fE rd-iv rd-gh rd-ig rd-gn rd-gE rd-gw", g += _ ? " rd-lU rd-iw rd-hC" : " rd-lS", p = [r(o, {
                    id: "_mx_dd_" + i,
                    tabindex: !_ && 0,
                    class: g
                }, x)], r(i, 0, p)
            }, init() {
                i._ng(), this.on("destroy", (() => {
                    i._hN(this), i._nh()
                }))
            }, assign(t) {
                let {
                    selected: e,
                    textKey: r = "",
                    valueKey: i = "",
                    iconKey: l = "",
                    emptyText: o = "",
                    disabled: s,
                    list: d
                } = t;
                d = u(d) ? d(t.props) : d || [], d = d.slice();
                let a = f(d, i);
                if (o)
                    if (r && i) {
                        if (!a[""]) {
                            let t = {};
                            t[r] = o, t[i] = "", d.unshift(t), a[""] = t
                        }
                    } else a[o] || (d.unshift(o), a[o] = o);
                e || !o || r || i || (e = o), e && a[e] || (e = a[e] || d[0], r && i && (e = e[i]));
                let n = r && i ? a[e][r] : e,
                    h = l ? a[e][l] : "";
                this.set({
                    selected: e,
                    selectedText: n,
                    selectedIcon: h,
                    list: d,
                    iconKey: l,
                    textKey: r,
                    valueKey: i,
                    emptyText: o,
                    disabled: s
                })
            }, render() {
                this.digest()
            }, _nv(t) {
                return p(t, this.root)
            }, async _f2() {
                let t = this,
                    e = g("_mx_dd_" + t.id);
                if (!e.classList.contains("rd-lW")) {
                    e.classList.add("rd-lW"), t.get("rList") || await t.digest({
                        rList: !0
                    }), e = g("_mx_list_" + t.id);
                    let r = e.querySelector("li[active]");
                    (null == r ? void 0 : r.scrollIntoViewIfNeeded) && r.scrollIntoViewIfNeeded(), i._nw(t)
                }
            }, _f3() {
                let t = this,
                    e = g("_mx_dd_" + t.id),
                    {
                        classList: r
                    } = e;
                r.contains("rd-lW") && (r.remove("rd-lW"), i._hN(t))
            }, "_fC<click>" () {
                let t = this,
                    e = g("_mx_dd_" + t.id),
                    {
                        classList: r
                    } = e;
                r.contains("rd-lW") ? t._f3() : r.contains("rd-lU") || t._f2()
            }, "_nU<click>" (t) {
                let e = this;
                e._f3();
                let r = e.get("valueKey"),
                    i = e.get("textKey"),
                    l = e.get("iconKey"),
                    o = e.get("selected"),
                    s = t.params.item,
                    d = s,
                    a = s,
                    n = "";
                i && r && (a = s[i], d = s[r], n = s[l]), o !== d && (e.digest({
                    selected: d,
                    selectedIcon: n,
                    selectedText: a
                }), c(e.root, "change", {
                    item: s,
                    value: r ? s[r] : s,
                    text: i ? s[i] : s
                }))
            }
        })
    })), s.d("3s/6s/3i", ["3l"], (t => {
        let e = t("3l"),
            r = "span",
            {
                node: i,
                View: l,
                applyStyle: o,
                has: s,
                mark: d,
                dispatch: a,
                isFunction: n,
                delay: h
            } = e,
            f = Number.MAX_SAFE_INTEGER;
        o("rd-lV", ".rd-m_{border:none;background:0 0;padding:0 10px 0 0;font-size:100%}.rd-m_:disabled{cursor:not-allowed;color:#999;background:#f5f5f5}.rd-ma,.rd-mb{width:16px;height:50%;border:2px solid #fff}.rd-ma:hover,.rd-mb:hover{background-color:#f0f0f0}.rd-ma{top:1px}.rd-mb{bottom:1px}.rd-mc::after{width:0;height:0;position:absolute;left:0;top:0;right:0;bottom:0;border-left:4px solid transparent;border-right:4px solid transparent;content:'';display:block;margin:auto}.rd-mb:after{border-top:4px solid #ccc}.rd-ma:after{border-bottom:4px solid #ccc}.rd-ma.rd-md,.rd-mb.rd-md{border-color:#0000}.rd-ma.rd-md:hover,.rd-mb.rd-md:hover{background:0 0}.rd-me{color:#e6e6e6}");
        let p = t => t.shiftKey ? 1 : t.metaKey || t.ctrlKey ? 2 : 0;
        return l.extend({
            tmpl(t, e, i) {
                let l, o, {
                    disabled: s
                } = t;
                return l = [e("input", {
                    class: "rd-m_ rd-gB rd-gn rd-go rd-fE",
                    id: "_mx_ipt_" + i,
                    _focusin: i + "_od()",
                    _focusout: i + "_of()",
                    _change: i + "_i8()",
                    _keydown: i + "_ol()",
                    disabled: s,
                    autocomplete: "off",
                    _input: i + "_on()",
                    _wheel: i + "_om()"
                }, 1)], o = "rd-ma rd-ig rd-hS rd-gv rd-mc rd-gE rd-hd rd-in", s && (o += " rd-md rd-hC "), l.push(e(r, {
                    _click: i + "_o_({i:1})",
                    _pointerdown: i + "_ok({i:1})",
                    _contextmenu: i + "_io()",
                    class: o
                })), o = "rd-mb rd-ig rd-hS rd-gv rd-mc rd-gE rd-hd rd-in", s && (o += " rd-md rd-hC "), l.push(e(r, {
                    _click: i + "_o_()",
                    _pointerdown: i + "_ok()",
                    _contextmenu: i + "_io()",
                    class: o
                })), e(i, 0, l)
            }, assign(t) {
                let e = this,
                    {
                        root: r
                    } = e;
                if (r.classList.contains("rd-fD")) return e._nY = e._n7(t.value), !1;
                delete e._nY, n(t.max) && ( //!important callback with ops.props
                    t.max = t.max(t.props)), n(t.min) && (t.min = t.min(t.props)), n(t.fixed) && (t.fixed = t.fixed()), n(t.step) && (t.step = t.step()), e._nZ = +t.step || 1, e._n0 = t.empty, e._n1 = r.hasAttribute("disabled"), e._n2 = s(t, "max") ? +t.max : f, e._n3 = s(t, "min") ? +t.min : -f, e._n4 = +t.ratio || 10, e._n5 = +t.fixed || 0, e._n6 = e._n7(t.value)
            }, async render() {
                let {
                    root: t
                } = this, e = d(this, "_fx");
                await this.digest({
                    disabled: this._n1
                }), e() && !t.classList.contains("rd-fD") && this._n8()
            }, _n8(t) {
                let e = this;
                t = void 0 === t ? void 0 === e._nY ? e._n6 : e._nY : t, i("_mx_ipt_" + e.id).value = t
            }, _n7(t) {
                let e = this;
                t = +t;
                let r = e._n3;
                if (t || 0 === t) {
                    let i = e._n2;
                    t > i ? t = i : t < r && (t = r), t = +t.toFixed(e._n5)
                }
                return isNaN(t) ? e._n0 ? "" : r || 0 : t
            }, _n9(t, e) {
                let r = this;
                if ("" !== t || !r._n0) return (t = r._n7(t)) !== r._n6 && (e || r._n8(t), a(r.root, "input", {
                    value: r._n6 = t
                })), r._n6;
                a(r.root, "input", {
                    value: r._n6 = t
                })
            }, _o_(t, e) {
                let r = this,
                    i = r._n6;
                "" === i && (i = 0);
                let l = r._nZ;
                if (e)
                    if (1 == e) l *= r._n4;
                    else {
                        let t = r._n5,
                            e = Number((l / r._n4).toFixed(t));
                        0 != e && (l = e)
                    }
                t ? i += l : i -= l, r._n9(i)
            }, _oa() {
                let t = i("_mx_ipt_" + this.id);
                t && (t.focus(), t.selectionStart = t.selectionEnd = t.value.length)
            }, _oc() {
                let t = this;
                t.root.classList.add("rd-fD"), s(t, "_ob") || (t._ob = t._n6)
            }, "_od<focusin>" () {
                this._oc()
            }, "_of<focusout>" () {
                let t = this;
                t._oe || (t.root.classList.remove("rd-fD"), t._n8(), t._ob != t._n6 && a(t.root, "change", {
                    value: t._n6
                }), delete t._ob)
            }, "_o_<click>" (t) {
                let e = this;
                e._n1 || e._og || (e._o_(t.params.i, p(t)), e._oa())
            }, "_ok<pointerdown>" (t) {
                let e = this;
                if (!e._n1) {
                    e._oe = 1, e._oc();
                    let r = t.params.i,
                        i = d(this, "_oh");
                    e._oi = setTimeout((() => {
                        i() && (e._oj = setInterval((() => {
                            i() && (e._og = 1, e._o_(r, p(t)), e._oa())
                        }), 50))
                    }), 300)
                }
            }, "_ol<keydown>&{passive:false}" (t) {
                if ("ArrowUp" == t.code || "ArrowDown" == t.code) {
                    this._f9(t), this._o_("ArrowUp" == t.code, p(t))
                }
            }, "_om<wheel>&{passive:false}" (t) {
                if (this.root.classList.contains("rd-fD")) {
                    this._f9(t);
                    let e = t.deltaY;
                    this._o_(e < 0, p(t))
                }
            }, "_on<input>" (t) {
                this._i7(t);
                let e = t.eventTarget;
                this._n9(e.value, 1)
            }, async "$doc<pointerup>" () {
                let t = this;
                clearTimeout(t._oi), clearInterval(t._oj), delete t._oe;
                let e = d(this, "_oo");
                await h(0), e() && delete t._og
            }
        })
    })), s.d("3s/6s/70", ["3l", "./3i"], (t => {
        let e = t("3l");
        t("./3i");
        let r, i = "value",
            l = "rd-g1 rd-fB rd-gw",
            o = "div",
            s = {
                class: "rd-gL"
            },
            {
                View: d,
                dispatch: a
            } = e;
        return d.extend({
            tmpl(t, e, d, a, n, h) {
                let f, p, g, {
                    disabled: c,
                    value: u
                } = t;
                return g = [e(o, {
                    $$: i,
                    _5: d,
                    disabled: c,
                    class: l,
                    _input: d + "_op({i:0})",
                    _change: d + "_i8()",
                    _: "3s/6s/3i?value=" + h(n, u[0], "d;")
                })], r ? g.push(r) : (p = [e(0, "~")], g.push(r = e("span", {
                    $: "d;",
                    class: "rd-gK rd-me rd-gs"
                }, p))), g.push(e(o, {
                    $$: i,
                    _5: d,
                    disabled: c,
                    class: l,
                    _input: d + "_op({i:1})",
                    _change: d + "_i8()",
                    _: "3s/6s/3i?value=" + h(n, u[1], "d:")
                })), f = [e(o, s, g)], e(d, 0, f)
            }, assign(t) {
                t.value || (t.value = []), this.set(t)
            }, render() {
                this.digest()
            }, "_op<input>" (t) {
                this._i7(t);
                let {
                    i: e
                } = t.params, r = this.get("value");
                r[e] = t.value, a(this.root, "input", {
                    pair: r
                })
            }
        })
    })), s.d("3s/72/3i", ["3l"], (t => {
        let e, r, i = t("3l"),
            {
                node: l,
                attach: o,
                detach: s
            } = i,
            d = 0,
            a = ["pointerdown", "keyup", "keydown"],
            n = document,
            h = window,
            f = {
                capture: !1,
                passive: !0
            },
            p = t => {
                let e = r;
                for (; e;) {
                    let r = e.fx;
                    "resize" != t.type && "blur" != t.type && r._nv(t.target) || r._f3(), e = e.fy
                }
            };
        return {
            _nw: t => {
                r = r ? {
                    fx: t,
                    fy: r
                } : {
                    fx: t
                }
            },
            _hN: t => {
                let e, i = r;
                for (; i;) {
                    if (i.fx == t) {
                        e ? e.fy = i.fy : r = i.fy;
                        break
                    }
                    e = i, i = i.fy
                }
            },
            _ng() {
                if (!d) {
                    e || (e = l("_rd_stage"));
                    for (let t of a) o(n, t, p, f);
                    o(h, "resize", p, f), o(h, "blur", p, f), o(h, "scroll", p, f), e && o(e, "scroll", p, f)
                }
                d++
            },
            _nh() {
                if (d > 0 && (d--, !d)) {
                    for (let t of a) s(n, t, p, f);
                    s(h, "resize", p, f), s(h, "blur", p, f), s(h, "scroll", p, f), e && s(e, "scroll", p, f)
                }
            }
        }
    })), s.d("3s/40/3i", ["3l"], (t => {
        let e, r, i, l, o = t("3l"),
            {
                toTry: s,
                now: d
            } = o,
            a = t => setTimeout(t, 16),
            n = requestAnimationFrame;
        return {
            _fR(t, r) {
                let l = {
                    fx: d(),
                    fy: t || 15,
                    fz: r
                };
                i && (l.fA = i), i = l, (() => {
                    if (!e) {
                        let t = () => {
                            let r = i;
                            for (; r;) {
                                let t = d();
                                t - r.fx >= r.fy && (r.fx = t, s(r.fz)), r = r.fA
                            }
                            e = i ? n(t) : 0
                        };
                        e = n(t)
                    }
                })()
            }, _fQ(t) {
                let e, r = i;
                for (; r;) {
                    if (r.fz == t) {
                        e ? e.fA = r.fA : i = r.fA;
                        break
                    }
                    e = r, r = r.fA
                }
            }, _ie(t, e) {
                let i = {
                    fx: d(),
                    fy: t || 15,
                    fz: e
                };
                l && (i.fA = l), l = i, (() => {
                    if (!r) {
                        let t = () => {
                            let e = l;
                            for (; e;) {
                                let t = d();
                                t - e.fx >= e.fy && (e.fx = t, s(e.fz)), e = e.fA
                            }
                            r = l ? a(t) : 0
                        };
                        r = a(t)
                    }
                })()
            }, _ib(t) {
                let e, r = l;
                for (; r;) {
                    if (r.fz == t) {
                        e ? e.fA = r.fA : l = r.fA;
                        break
                    }
                    e = r, r = r.fA
                }
            }
        }
    })), s.d("7h/3i", ["3l", "../3j/3n", "../3j/5f", "../3s/5k/3i", "../3s/4b/3i", "../41/3i", "../42/6j", "../42/fs", "../42/43", "../42/html2canvas", "../42/7g", "./43/3i", "./43/7i", "./7j/3i", "./7k/3i", "./7l/7m", "./7l/7n", "./7l/data-celltable", "./7l/data-coltable", "./7l/data-dtable", "./7l/data-ftable", "./7l/data-repeater", "./7l/richtext", "3s/6t/3i"], (t => {
        let e = t("3l"),
            r = t("../3j/3n"),
            i = t("../3j/5f"),
            l = t("../3s/5k/3i"),
            o = t("../3s/4b/3i"),
            s = t("../41/3i"),
            d = t("../42/6j"),
            a = t("../42/fs"),
            n = t("../42/43"),
            h = t("../42/html2canvas"),
            f = t("../42/7g"),
            p = t("./43/3i"),
            g = t("./43/7i"),
            c = t("./7j/3i"),
            u = t("./7k/3i"),
            $ = t("./7l/7m"),
            y = t("./7l/7n"),
            m = t("./7l/data-celltable"),
            x = t("./7l/data-coltable"),
            _ = t("./7l/data-dtable"),
            b = t("./7l/data-ftable"),
            w = t("./7l/data-repeater"),
            k = t("./7l/richtext");
        t("3s/6t/3i");
        let v, j, L, S, z, A = "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-f9",
            C = "button",
            I = "d:",
            T = "rd-oc rd-gY",
            M = "div",
            P = "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
            H = "rd-gn rd-oa",
            F = "application/pdf",
            W = "embed",
            B = "rd-fV rd-gp",
            q = {
                class: "rd-oe rd-gx rd-ha rd-gh rd-hX rd-gL rd-gP"
            },
            V = {
                class: "rd-oh rd-gL rd-gP rd-gN"
            },
            O = {
                class: "rd-oj rd-hP"
            },
            {
                State: R,
                View: N,
                lowTaskFinale: Y,
                has: X,
                applyStyle: U,
                parseUrl: E,
                config: D,
                mark: K,
                guid: J,
                unboot: G,
                delay: Q,
                task: Z,
                node: tt,
                toUrl: et
            } = e;
        let {
            min: rt
        } = Math;
        U("rd-nn", ".rd-n6{background:#eee}.rd-n7{page-break-after:auto;page-break-inside:avoid}.rd-n8{width:120px}.rd-n9{width:350px}.rd-o_{margin-top:20px}.rd-oa{height:calc(100vh - 45px)}.rd-ob{box-shadow:-1px -1px 4px #0000002b}.rd-oc{height:30px;background:linear-gradient(#ddd4,#ddd 30%,#ddd 70%,#ddd4);margin:4px 20px}.rd-od{box-shadow:0 0 6px 0 rgba(0,0,0,.2);right:0;top:44px;height:calc(100vh - 50px);width:440px}@page{margin:0}@media screen{.rd-oe{box-shadow:0 0 6px 0 rgba(0,0,0,.3);height:36px;padding-right:50px;left:0;top:0;right:0;bottom:auto}.rd-of{margin:60px 0 40px}.rd-og{margin:38px 0 0}.rd-oh{padding:0 20px}.rd-oi{margin:44px 0 0;width:calc(100vw - 450px);height:calc(100vh - 50px);box-shadow:0 2px 6px 2px rgba(0,0,0,.2)}.rd-oj{height:120px;line-height:120px}.rd-ok{box-shadow:0 2px 6px 2px rgba(0,0,0,.2);contain:paint}.rd-ol{background:#eee}.rd-om{margin:5px auto}}@media print{.rd-oe{display:none}body{min-width:auto}.rd-om{margin:0}.rd-of{padding:0;display:block}.rd-oi{margin:0;width:100vw;height:100vh}.rd-ol{display:none}.rd-ok{box-shadow:none}.rd-oh{display:block;padding:0}}");
        let it = document,
            lt = it.documentElement,
            ot = /<(\w+)[\s\S]*?role="pole"[\s\S]*?>[\s\S]*?<\/\1>/g,
            st = [{
                text: "网页",
                value: "web"
            }, {
                text: "图片",
                value: "image"
            }, {
                text: "pdf",
                value: "pdf"
            }];
        st.push({
            text: "图片-RDS服务",
            value: "rdImage"
        }, {
            text: "pdf-RDS服务",
            value: "rdPdf"
        });
        return N.extend({
            tmpl(t, e, r, i, l, o) {
                let s, d, a, n, h, f, p, g, c, {
                    d: u,
                    approve: $,
                    inner: y,
                    i18n: m,
                    empty: x,
                    format: _,
                    sf: b,
                    enable: w,
                    rds: k,
                    hasData: R,
                    loading: N,
                    page: Y,
                    unit: X,
                    pdf: U,
                    rdPdf: E,
                    pages: D,
                    images: K,
                    rdImages: J
                } = t;
                if (h = [], v ? h.push(v) : (a = [e(0, "打印预览")], h.push(v = e("h5", {
                    $: "d;",
                    class: "rd-ia rd-hO rd-fA rd-gK rd-f2"
                }, a))), !u && $ || (y && (a = [e(0, m("pf"))], h.push(e(C, {
                    class: A,
                    _click: r + "_rw()"
                }, a))), a = [e(0, m("pe"))], h.push(e(C, {
                    class: A,
                    _click: r + "_rr()"
                }, a)), j ? h.push(j) : h.push(j = e(M, {
                    $: I,
                    class: T
                }))), a = [e(0, m("p_"))], h.push(e(M, 0, a)), n = "3s/6t/3i?", (s = x) && (n += `disabled=${o(l,s,"d;")}&`), n += `list=${o(l,_,"d:")}&textKey=text&valueKey=value&selected=` + i(b), h.push(e(M, {
                    $$: "format,empty",
                    _5: r,
                    class: "rd-n8 rd-f9",
                    _change: r + "_rq()",
                    _: n
                })), a = [e(0, m("gL"))], h.push(e(C, {
                    disabled: "pdf" != b && "rdPdf" != b && !w,
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH rd-f9",
                    _click: r + "_ry()"
                }, a)), a = [L || (L = e(0, "Lodop设置"))], h.push(e(C, {
                    disabled: !w,
                    class: A,
                    _click: r + "_r_()"
                }, a)), a = [S || (S = e(0, "Lodop打印"))], h.push(e(C, {
                    disabled: !w || x,
                    class: P,
                    _click: r + "_rc()"
                }, a)), k && (j ? h.push(j) : h.push(j = e(M, {
                    $: I,
                    class: T
                })), a = [e(0, m("pd"))], h.push(e(C, {
                    disabled: !w,
                    class: A,
                    _click: r + "_rs()"
                }, a)), a = [e(0, m("pc"))], h.push(e(C, {
                    disabled: !w,
                    class: P,
                    _click: r + "_rv()"
                }, a))), j ? h.push(j) : h.push(j = e(M, {
                    $: I,
                    class: T
                })), a = [e(0, m("o9"))], h.push(e(C, {
                    disabled: !w,
                    class: P,
                    _click: r + "_h1()"
                }, a)), d = [e(M, q, h)], a = [], R)
                    if (N) p = [e(0, m("pb"))], g = [e(M, O, p)], a.push(e(M, {
                        class: "rd-gw rd-ok rd-om rd-gL rd-h_ rd-hH",
                        style: `width:${Y.width}${X};height:${Y.height}${X};border-radius:${Y.radius};background:` + Y.background
                    }, g));
                    else if ("pdf" == b) a.push(e(W, {
                    src: U,
                    class: H,
                    type: F
                }, 1));
                else if ("rdPdf" == b) a.push(e(W, {
                    src: E,
                    class: H,
                    type: F
                }, 1));
                else
                    for (let t = null == D ? void 0 : D.length, i = 0; i < t; i += 1) {
                        let t = D[i];
                        if (g = [], "web" == b)
                            for (let s = null == t ? void 0 : t.length, d = 0; d < s; d += 1) {
                                let s = t[d];
                                g.push(e(M, {
                                    $$: "pages,unit",
                                    _5: r,
                                    class: "rd-gD",
                                    _: `4e/${s.type}/3i?props=${o(l,s.props,`
                                    d - .$ {
                                        i
                                    }.e_.$ {
                                        d
                                    }.ea `)}&unit=` + o(l, X, "eb")
                                }))
                            } else "image" == b && K ? g.push(e("img", {
                                class: B,
                                src: K[i]
                            }, 1)) : "rdImage" == b && J && g.push(e("img", {
                                class: B,
                                src: J[i]
                            }, 1));
                        c = `width:${Y.width}${X};height:${Y.height}${X};border-radius:${Y.radius};background:${Y.background};`, !Y.preformat && Y.backgroundImage && (c += `background-image:url(${Y.backgroundImage});background-repeat:${"full"==Y.backgroundRepeat?"no-repeat":Y.backgroundRepeat};background-size:`, "full" == Y.backgroundRepeat ? c += "100% 100%" : c += Y.backgroundWidth + X + ` ${Y.backgroundHeight}${X};background-position:${Y.backgroundXOffset}${X} ` + Y.backgroundYOffset + X), a.push(e(M, {
                            role: "page-content",
                            class: "rd-fy rd-gw rd-ok rd-om rd-hH rd-n7",
                            style: c
                        }, g))
                    } else g = [e(0, m("pa"))], a.push(e(M, O, g));
                return h = [e(M, V, a)], f = "", f += "pdf" == b || "rdPdf" == b ? "rd-og" : "rd-of rd-gL rd-h_", d.push(e(M, {
                    id: "c_" + r,
                    class: f
                }, h)), z ? d.push(z) : d.push(z = e(M, {
                    $: "d-",
                    id: "_rd_tip",
                    class: "rd-ob rd-hU rd-gx rd-i_ rd-gh rd-iz rd-hS"
                })), e(r, 0, d)
            }, init() {
                lt.classList.add("rd-gF", "rd-hK", "rd-ip", "rd-n6")
            }, async render() {
                it.rdState = 1;
                let t = top != self;
                this.set({
                    inner: t,
                    rds: !0,
                    approve: !1,
                    d: !1,
                    format: st,
                    hasData: !1,
                    empty: !0,
                    sf: "web"
                }), t || await this.digest(), it.rdState |= 2;
                let {
                    params: e
                } = E(location.href), r = D("getContentUrl");
                if (e.id && r && !t) {
                    (new i).all({
                        name: "_ih",
                        _hy: e
                    }, ((t, e) => {
                        if (!t) {
                            let t = e.get("data");
                            this._q7(t)
                        }
                    }))
                }
            }, async _q9(t, e, r, i, l) {
                let o = 0,
                    s = this._q8,
                    d = this.get("unit"),
                    a = R.get("f6"),
                    h = R.get("fS"),
                    f = R.get("fT");
                for (let e of t) "data-dtable" != e.type && "data-ftable" != e.type || p._q3(e);
                let g = (t, e) => {
                    for (let r = t.length; r--;) {
                        let i = t[r];
                        if (("data-coltable" == i.type || "data-celltable" == i.type || "data-dtable" == i.type || "data-rdtable" == i.type || "batch-barcode" == i.type || "batch-qrcode" == i.type || "batch-text" == i.type || "data-repeater" == i.type || "data-ftable" == i.type || "richtext" == i.type || "html" == i.type || "data-richtext" == i.type) && -1 != e[r]) return !0
                    }
                    return !1
                };
                for (; o < e.pages;) {
                    let c = o * e.height,
                        u = p._qS(e, o, t, f);
                    o++;
                    let v = {},
                        j = async(t, e, i) => {
                            var o;
                            let g = [];
                            for (let u = 0; u < t.length; u++) {
                                let L = t[u],
                                    S = i ? L : {
                                        type: L.type,
                                        id: L.id,
                                        props: n.fB(L.props)
                                    };
                                if (i || (S.props.x += h, S.props.y += f, S.props.y -= c), "pager" == L.type) S.props.ext._currentPage = r.length + 1, i || g.push(S), l(L.type, S, L.id);
                                else if ("number" == L.type) i || g.push(S), l(L.type, S, L.id);
                                else if ("data-coltable" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = x(S, t, e, a, g, i))
                                } else if ("data-celltable" == L.type)
                                    if (i) m(S, 0, g, i);
                                    else {
                                        let t = v[u] || 0; - 1 != t && (v[u] = m(S, t, g, i))
                                    } else if ("data-dtable" == L.type || "data-rdtable" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = await _(S, t, e, a, d, g, i))
                                } else if ("batch-barcode" == L.type || "batch-qrcode" == L.type || "batch-text" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = await $(S, t, e, a, g, i, d))
                                } else if ("data-repeater" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = await w(S, t, e, a, g, i))
                                } else if ("data-ftable" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = await b(S, t, e, a, s, g, i, d))
                                } else if ("richtext" == L.type || "data-richtext" == L.type || "html" == L.type) {
                                    let t = v[u] || 0; - 1 != t && (v[u] = await k(S, t, e, a, s, d, g))
                                } else L.props.bind ? y(S, g, s, i) : g.push(S); if (X(p._qN, L.type)) {
                                    let {
                                        rows: t
                                    } = S.props;
                                    for (let r of t)
                                        for (let t of r.cols)(null === (o = t.elements) || void 0 === o ? void 0 : o.length) && j(t.elements, e, 1)
                                }
                            }
                            return await Q(0), g
                        };
                    do {
                        i && p._qP(`正在计算第${r.length+1}页`);
                        let t = await j(u, e);
                        r.push(t)
                    } while (g(u, v))
                }
                i && p._qQ()
            }, async _q7(t) {
                if (!t) return void(it.rdState |= 4);
                let {
                    page: e,
                    elements: r,
                    unit: i,
                    vars: l
                } = t;
                if (!e || !r || !i) return void(it.rdState |= 4);
                l && (it.documentElement.style.cssText = l), o.show("正在准备数据..."), d._fB(), await this.digest({
                    enable: !1,
                    empty: !0,
                    page: e,
                    unit: i,
                    hasData: !0,
                    loading: !0
                });
                let s = e.xOffset,
                    a = e.yOffset,
                    n = [],
                    h = new g;
                this._q8 = h;
                let {
                    _qZ: f,
                    _q0: c
                } = p._q2(r, h);
                R.set({
                    fB: i,
                    f6: f,
                    fS: s,
                    fT: a
                }), await(t => {
                    let e = [];
                    for (let r of t) e.push(d._jY(r));
                    return Promise.all(e)
                })(c), o.show("正在准备资源..."), await h._hF(), o.show("正在计算分页...");
                let u = [],
                    $ = {};
                await this._q9(r, e, n, !0, ((t, e, r) => {
                    if ("pager" == t) u.push(e);
                    else if ("number" == t) {
                        let t = $[r];
                        t || ($[r] = t = []), t.push(e)
                    }
                }));
                for (let {
                        props: {
                            ext: t
                        }
                    }
                    of u) t._totalPage = n.length;
                for (let t in $) {
                    let e = 0,
                        r = $[t];
                    for (let {
                            props: {
                                ext: t
                            }
                        }
                        of r) t._fill = 1, t._index = e++, t._total = r.length
                }
                p._qW(n);
                let {
                    copies: y = 1
                } = e;
                if (y > 1) {
                    let t = n.slice();
                    for (; y > 1;) n.push(...t), y--
                }
                o.show("等待页面生成..."), await this.digest({
                    stage: t,
                    enable: !1,
                    images: null,
                    pdf: null,
                    sf: "web",
                    pages: n,
                    loading: !1
                }), await Q(500), await Y(), o.show("正在检查图片状态..."), await p._qT(this.root), o.show("马上就好..."), this.digest({
                    enable: !0,
                    empty: !1
                }), await Q(200), o.hide(), it.rdState |= 4
            }, "_h1<click>" () {
                print()
            }, "_r_<click>" () {
                this.mxDialog("7h/7j/78", {
                    width: 600
                })
            }, async "_rc<click>" () {
                let t = K(this, "_ra"),
                    e = this.get("page"),
                    i = await c._rb();
                if (t())
                    if (i) {
                        let t = it.getElementsByTagName("style"),
                            l = ["<!DOCTYPE html>"];
                        for (let e = 0; e < t.length; e++) {
                            let r = t[e].innerHTML.trim();
                            r && l.push(`<style>${r}</style>`)
                        }
                        let o = l.join(""),
                            {
                                width: s,
                                height: d
                            } = e;
                        s = r.fI(s), d = r.fI(d), i.SET_PRINT_PAGESIZE(0, s + 1 + "px", d + 1 + "px", "report-designer"), i.SET_PRINT_MODE("POS_BASEON_PAPER", !0);
                        let a = it.querySelectorAll('[role="page-content"]');
                        for (let t = 0; t < a.length; t++) {
                            let e = a[t];
                            i.NewPage(), i.ADD_PRINT_HTM(0, 0, s + "px", d + "px", `${o}${e.outerHTML.replace(ot,"")}`)
                        }
                        i.PREVIEW()
                    } else this.mxDialog("7h/7j/4g")
            }, _re() {
                return new Promise((async t => {
                    let e = this.get("images"),
                        r = K(this, "_rd");
                    if (e) t(e);
                    else {
                        "web" != this.get("sf") && (await this.digest({
                            sf: "web"
                        }), await Y(), this.set({
                            sf: "image"
                        })), e = [];
                        let i = {
                                useCORS: !0,
                                scale: 2
                            },
                            l = this.root.querySelectorAll(".rd-ok"),
                            o = 0,
                            s = l.length,
                            d = 4;
                        it.querySelectorAll("svg").length > 20 && (d = 2);
                        let a = async() => {
                            if (r()) {
                                scrollTo(0, 0);
                                let r = o + 1,
                                    n = rt(r + d - 1, s);
                                p._qP(`转换进度：[${r}~${n}] / ${s}`);
                                let h = [],
                                    f = 0;
                                if (o < s) {
                                    for (; f < d && !(o + f >= s);) h.push(html2canvas(l[o + f], i)), f++;
                                    let t = await Promise.all(h);
                                    for (let r of t) e.push(r.toDataURL("image/jpeg", 1));
                                    setTimeout(a, 0), o += f
                                } else p._qQ(), this.set({
                                    images: e
                                }), t(e)
                            }
                        };
                        a()
                    }
                }))
            }, async _rg() {
                let t = this.get("images");
                if (t) this.digest({
                    enable: !0
                });
                else {
                    let e = K(this, "_rf");
                    o.show("正在转换为图片...");
                    try {
                        await h(), e() && (t = await this._re()), e() && (o.show("转换图片成功～", 2e3), this.digest({
                            enable: !0,
                            images: t
                        }))
                    } catch (t) {
                        e() && o.show(t.message || t, 5e3)
                    }
                }
            }, _rj() {
                if (this.get("rdImages")) this.digest({
                    enable: !0
                });
                else {
                    let t = K(this, "_rh");
                    o.show("正在转换为图片...");
                    let e = {
                        location: location.href,
                        stage: this.get("stage")
                    };
                    (new i).save({
                        name: "_ix",
                        url: D("rdsUrl") + "image",
                        _i_: et("", {
                            print: JSON.stringify(e)
                        })
                    }, ((e, r) => {
                        t() && (e ? (o.hide(), this.alert(u._ri(e)), this.digest({
                            sf: "rdImage"
                        })) : (o.show("转换图片成功～", 2e3), this.digest({
                            sf: "rdImage",
                            enable: !0,
                            rdImages: r.get("data", [])
                        })))
                    }))
                }
            }, _rl() {
                if (this.get("rdPdf")) this.digest({
                    enable: !1
                });
                else {
                    let t = K(this, "_rk");
                    o.show("正在转换为pdf...");
                    let e = {
                        location: location.href,
                        stage: this.get("stage")
                    };
                    (new i).save({
                        name: "_ix",
                        url: D("rdsUrl") + "pdf",
                        _i_: et("", {
                            print: JSON.stringify(e)
                        })
                    }, ((e, r) => {
                        if (t())
                            if (e) o.hide(), this.alert(u._ri(e)), this.digest({
                                sf: "rdPdf"
                            });
                            else {
                                o.show("转换pdf成功～", 2e3);
                                let t = r.get("data", []),
                                    e = atob(t[0]),
                                    i = e.length,
                                    l = new Uint8Array(i);
                                for (; i--;) l[i] = e.charCodeAt(i);
                                let s = new Blob([l], {
                                    type: "application/pdf"
                                });
                                this.digest({
                                    sf: "rdPdf",
                                    enable: !1,
                                    rdPdf: URL.createObjectURL(s)
                                })
                            }
                    }))
                }
            }, async _ro() {
                let t = this.get("pdf"),
                    e = this.get("page");
                if (!t && e) {
                    let t = K(this, "_rm");
                    try {
                        let i = this.get("rdImages");
                        i || (o.show("先转换为图片..."), await h(), i = await this._re()), o.show("正在加载PDF插件..."), await f(), o.show("正在生成PDF...");
                        let l = r.fI(e.width),
                            d = r.fI(e.height),
                            a = new jspdf.jsPDF({
                                unit: "px",
                                hotfixes: ["px_scaling"],
                                orientation: l > d ? "l" : "p",
                                format: [l, d],
                                compress: !0
                            });
                        this._rn = a, a.setDocumentProperties({
                            title: s("fY") + "<未注册版>",
                            subject: "打印页面",
                            author: "kooboy_li@163.com",
                            keywords: "打印、可视化、编辑器",
                            creator: location.host
                        });
                        let n = i.length,
                            g = t => {
                                p._qP(`生成进度：${t+1} / ${n}`), t && a.addPage();
                                let e = i[t];
                                a.addImage(e, "JPEG", 0, 0, l, d, void 0, "FAST")
                            };
                        for (let t = 0; t < n; t++) Z(g, [t]);
                        await Y(), p._qQ(), t() && (o.show("转换PDF成功～", 2e3), this.digest({
                            sf: "pdf",
                            enable: !1,
                            pdf: a.output("bloburi")
                        }))
                    } catch (e) {
                        t() && o.show(e.message || e, 5e3)
                    }
                } else this.digest({
                    enable: !1
                })
            }, _rp() {
                o.hide(), K(this, "_rd"), K(this, "_rf"), K(this, "_rh"), K(this, "_rm"), K(this, "_rk"), p._qQ()
            }, async "_rq<change>" (t) {
                this._rp(), await this.digest({
                    enable: !1
                }), this.set({
                    sf: t.value
                }), "image" == t.value ? this._rg() : "pdf" == t.value ? this._ro() : "rdImage" == t.value ? this._rj() : "rdPdf" == t.value ? this._rl() : this.digest({
                    enable: !0
                })
            }, "_rr<click>" () {
                open("//github.com/xinglie/report-designer/issues/49")
            }, "_rs<click>" () {
                this.mxDialog("7h/7k/78")
            }, "_rv<click>" () {
                let t = K(this, "_rt");
                o.show("正在调用RDS打印服务...");
                let e = u._ru(),
                    r = {
                        location: location.href,
                        printer: e,
                        stage: this.get("stage")
                    };
                (new i).save({
                    name: "_ix",
                    url: D("rdsUrl") + "print",
                    _i_: et("", {
                        print: JSON.stringify(r)
                    })
                }, (e => {
                    t() && (e ? (o.hide(), this.alert(u._ri(e))) : o.show("打印成功～", 2e3))
                }))
            }, "_rw<click>" () {
                let {
                    params: t,
                    path: e
                } = E(location.href), r = {...t
                };
                r.id || (r.id = "xl");
                let i = et(e, r);
                open(i)
            }, async "_ry<click>" () {
                let t, e, r, i = this.get("sf"),
                    l = K(this, "_rx");
                try {
                    await a._gH()
                } catch (t) {
                    return this.alert(t.message)
                }
                if (o.show(s("fX")), "web" == i) {
                    let i = [],
                        d = [],
                        n = it.getElementsByTagName("style");
                    for (let t = 0; t < n.length; t++) {
                        let e = n[t].innerHTML.trim();
                        e && i.push(`<style>${e}</style>`)
                    }
                    let h = it.querySelectorAll(".rd-ok");
                    for (let t = 0; t < h.length; t++) d.push(p._qV(h[t].outerHTML));
                    r = [".html"], t = `${s("fY")}-web.html`, e = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${s("fY")}-web</title>${i.join("")}</head><body class="rd-gL rd-gN">${d.join("")}</body></html>`;
                    try {
                        l() && (await a._gI(t, e, r), o.show(s("fZ"), 3e3))
                    } catch (t) {
                        o.hide(), l() && "AbortError" != t.name && this.alert(t.message)
                    }
                } else if ("pdf" == i && this._rn) this._rn.save(`${s("fY")}.pdf`), o.show(s("fZ"), 3e3);
                else if ("rdPdf" == i && this.get("rdPdf")) {
                    let t = it.createElement("a");
                    t.download = `${s("fY")}.pdf`, t.href = this.get("rdPdf"), t.click()
                } else o.show("暂不支持当前类型的文件导出", 3e3)
            }, "$win<keydown>&{passive:false}" (t) {
                let {
                    code: e,
                    ctrlKey: r,
                    shiftKey: i,
                    altKey: l,
                    metaKey: o
                } = t;
                "KeyP" != e || i || l || !r && !o || (t.preventDefault(), print())
            }, "$doc<paste>" (t) {
                let e = t.clipboardData.getData("text/plain");
                this._q7(p._qU(e))
            }, "$win<render>" (t) {
                4 & it.rdState && (it.rdState ^= 4), 8 & it.rdState && (it.rdState ^= 8), it.rdState |= 8, this._q7(p._qU(t.json))
            }, "$win<message>" (t) {
                let {
                    protocol: e,
                    host: r
                } = location, i = e + "//" + r;
                t.source != window && t.source.postMessage("_in", i), t.origin == i && t.data && this._q7(p._qU(t.data))
            }
        }).merge(l)
    })), s.d("7h/7q", ["3l", "../3j/5f", "../42/6j", "./43/3i", "./43/7i", "./3i"], (t => {
        let e = t("3l"),
            r = t("../3j/5f"),
            i = t("../42/6j"),
            l = t("./43/3i"),
            o = t("./43/7i"),
            s = t("./3i"),
            {
                State: d,
                lowTaskFinale: a,
                applyStyle: n,
                delay: h
            } = e;
        return n("rd-nE", ".rd-on{page-break-after:auto;page-break-inside:avoid}.rd-oo{display:block;contain:paint}"), s.extend({
            tmpl(t, e, r, i, l, o) {
                let s, d, a, n = [],
                    {
                        page: h,
                        pages: f,
                        unit: p
                    } = t;
                if (h && f)
                    for (let t = null == f ? void 0 : f.length, i = t - 1, g = 0; g < t; g += 1) {
                        let t = f[g],
                            c = g === i;
                        a = [];
                        for (let i = null == t ? void 0 : t.length, s = 0; s < i; s += 1) {
                            let i = t[s];
                            a.push(e("div", {
                                $$: "pages,unit",
                                _5: r,
                                class: "rd-gD",
                                _: `4e/${i.type}/3i?props=${o(l,i.props,`
                                d;.$ {
                                    g
                                }.d: .$ {
                                    s
                                }.d - `)}&unit=` + o(l, p, "e_")
                            }))
                        }
                        s = "rd-fy rd-gw rd-oo rd-hH", c || (s += " rd-on"), d = `width:${h.width}${p};height:${h.height}${p};border-radius:${h.radius};background:${h.background};`, !h.preformat && h.backgroundImage && (d += `background-image:url(${h.backgroundImage});background-repeat:${"full"==h.backgroundRepeat?"no-repeat":h.backgroundRepeat};background-size:`, "full" == h.backgroundRepeat ? d += "100% 100%" : d += h.backgroundWidth + p + ` ${h.backgroundHeight}${p};background-position:${h.backgroundXOffset}${p} ` + h.backgroundYOffset + p), n.push(e("div", {
                            class: s,
                            style: d
                        }, a))
                    }
                return e(r, 0, n)
            }, init() {}, render() {
                this.digest()
            }, async getHTML({
                stage: t,
                data: e
            }) {
                for (let t in e) {
                    let l = e[t],
                        {
                            _ir: o,
                            _iq: s
                        } = r._iy(l, t);
                    i._qt(t, o, s)
                }
                if (!t) return {
                    styles: [],
                    pages: []
                };
                let {
                    page: s,
                    elements: n,
                    unit: f
                } = t;
                if (!s || !n || !f) return {
                    styles: [],
                    pages: []
                };
                let p = new o;
                this._q8 = p, this.set({
                    page: s,
                    unit: f
                });
                let g = s.xOffset,
                    c = s.yOffset,
                    u = [],
                    {
                        _qZ: $
                    } = l._q2(n, p, 1);
                d.set({
                    fB: f,
                    f6: $,
                    fS: g,
                    fT: c
                }), await p._hF();
                let y = [],
                    m = {};
                await this._q9(n, s, u, !1, ((t, e, r) => {
                    if ("pager" == t) y.push(e);
                    else if ("number" == t) {
                        let t = m[r];
                        t || (m[r] = t = []), t.push(e)
                    }
                }));
                for (let {
                        props: {
                            ext: t
                        }
                    }
                    of y) t._totalPage = u.length;
                for (let t in m) {
                    let e = 0,
                        r = m[t];
                    for (let {
                            props: {
                                ext: t
                            }
                        }
                        of r) t._fill = 1, t._index = e++, t._total = r.length
                }
                l._qW(u);
                let {
                    copies: x = 1
                } = s;
                if (x > 1) {
                    let t = u.slice();
                    for (; x > 1;) u.push(...t), x--
                }
                l._qW(u), await this.digest({
                    stage: t,
                    pages: u
                }), await a(), await h(1e3);
                let _ = [],
                    b = [],
                    w = document.getElementsByTagName("style");
                for (let t = 0; t < w.length; t++) {
                    let e = w[t].innerHTML.trim();
                    e && _.push(`<style>${e}</style>`)
                }
                let k = document.querySelectorAll(".rd-oo");
                for (let t = 0; t < k.length; t++) b.push(l._qV(k[t].outerHTML));
                return {
                    styles: _,
                    pages: b
                }
            }
        })
    })), s.d("7h/43/3i", ["3l", "../../3j/3o", "../../42/6j", "../../42/4o"], (t => {
        let e = t("3l"),
            r = t("../../3j/3o"),
            i = t("../../42/6j"),
            l = t("../../42/4o"),
            {
                Vframe: o,
                node: s,
                has: d,
                guid: a,
                delay: n,
                lowTaskFinale: h,
                isArray: f,
                toMap: p
            } = e,
            g = {
                "data-coltable": 1,
                "data-dtable": 1,
                "data-rdtable": 1,
                "data-ftable": 1,
                "data-richtext": 1,
                video: 1
            },
            c = {
                xsheet: 1
            },
            u = {
                "hod-table": 1,
                "hod-hflex": 1,
                "hod-vflex": 1,
                "hod-footer": 1,
                "hod-header": 1,
                "data-dtable": 1,
                "hod-tabs": 1,
                "data-rdtable": 1
            },
            $ = {...u, "data-repeater": 1,
                "data-ftable": 1,
                "data-celltable": 1
            },
            y = /<[^>]+>/g,
            m = /\s*(?:id|_\d?[a-z]*)\s*=\s*"[^"]+"/gi,
            x = a("_rd_mdt"),
            _ = "rd-iz",
            b = t => {
                let e = s("_rd_tip"),
                    {
                        classList: r
                    } = e;
                r.contains(_) && r.remove(_), e.innerHTML = t
            },
            w = () => {
                let t = s("_rd_tip"),
                    {
                        classList: e
                    } = t;
                e.contains(_) || e.add(_)
            },
            k = (t, e) => {
                if (null == t ? void 0 : t.length) {
                    let r;
                    for (let {
                            props: i
                        }
                        of t) {
                        if (!(i.bind && i.bind.fields && i.bind.fields.length)) {
                            r = 1;
                            break
                        }
                        if (null != e[i.bind.fields[0].id]) {
                            r = 1;
                            break
                        }
                    }
                    return r
                }
                return 1
            },
            v = (t, e, r) => {
                var i;
                for (let l = t.length; l--;) {
                    let {
                        id: o,
                        type: s,
                        props: a
                    } = t[l];
                    if (d($, s)) {
                        let {
                            rows: t
                        } = a;
                        for (let l of t)
                            for (let t of l.cols)(null === (i = t.elements) || void 0 === i ? void 0 : i.length) && v(t.elements, e, r)
                    }
                    if (a.print)
                        if ("odd" == a.print) e % 2 && t.splice(l, 1);
                        else if ("even" == a.print) e % 2 == 0 && t.splice(l, 1);
                    else if ("last" == a.print) {
                        let i = `${o}:${e}`;
                        r[`${o}:${e+1}`] && t.splice(l, 1), r[i] = 1
                    } else if ("first" == a.print) {
                        let i = `${o}:${e+1}`;
                        if (r[i]) {
                            for (let t of r[i]) {
                                let [e, r] = t;
                                e.splice(r, 1)
                            }
                            r[i] = null
                        }
                        let s = `${o}:${e}`;
                        r[s] || (r[s] = []), r[s].push([t, l])
                    }
                }
            };
        return {
            _qN: u,
            _qO: $,
            _qP: b,
            _qQ: w,
            _qR: async(t, e) => {
                let r = s(x);
                r || (r = document.createElement("div"), r.className = "rd-fy rd-ir rd-gx rd-gz rd-hy", r.id = x, document.body.appendChild(r));
                let i = o.root();
                for (i.unmount(r), i.mount(r, `4e/${t}/3i`, e); !r.childNodes.length;) await n(10);
                return await h(), await n(50), r
            },
            _qS: (t, e, i, l) => {
                let o = [],
                    {
                        width: s,
                        height: a
                    } = t,
                    n = e * a,
                    h = n + a,
                    f = {
                        x: 0,
                        y: n,
                        width: s,
                        height: a
                    };
                for (let t of i) {
                    let {
                        props: i,
                        type: p
                    } = t;
                    if (!t.used || !c[p])
                        if (t.used = 1, "hod-header" == p || "hod-footer" == p) i.x = 0, i.width = s, i.y = "hod-header" == p ? e * a : (e + 1) * a - i.height, o.push(t);
                        else {
                            let {
                                x: s,
                                y: a,
                                width: c,
                                height: u,
                                rotate: $
                            } = i;
                            if (a += l, d(g, p))(a >= n && a <= h || a < 0 && 0 == e) && o.push(t);
                            else {
                                let e = r.fy({
                                        x: s,
                                        y: a,
                                        width: c,
                                        height: u,
                                        rotate: $
                                    }),
                                    i = {
                                        x: e._gd,
                                        y: e._ge,
                                        width: e._fG,
                                        height: e._fH
                                    };
                                r.fz(i, f) && o.push(t)
                            }
                        }
                }
                return o
            },
            _qT: async(t, e = !0) => {
                let r = t.getElementsByTagName("img");
                for (;;) {
                    let t = 1,
                        i = 0;
                    for (let e = r.length; e--;) {
                        r[e].complete ? i++ : t = 0
                    }
                    if (e && b(`图片完成进度：${i} / ${r.length}`), t) {
                        e && w();
                        break
                    }
                    await n(6)
                }
            },
            _qU: t => {
                let e;
                try {
                    e = JSON.parse(t)
                } finally {
                    return e
                }
            },
            _qV: t => t.replace(y, (t => t.replace(m, ""))),
            _qW: t => {
                let e = {};
                for (let r = t.length; r--;) {
                    let i = t[r];
                    v(i, r, e)
                }
            },
            _q2(t, e, r) {
                let l = {},
                    o = [],
                    s = 0,
                    n = t => {
                        var h;
                        for (let f of t) {
                            f.id || (f.id = a("e"));
                            let {
                                props: t,
                                type: p
                            } = f, {
                                bind: g
                            } = t;
                            if (null == g ? void 0 : g.id)
                                if (r) {
                                    let t = i._qv(g);
                                    i._qu(t) || i._qt(t, null, `未提供${t}的数据`)
                                } else {
                                    let t = g.url + "~" + g.id;
                                    l[t] || (l[t] = g, o.push(g))
                                }
                            if (d($, p)) {
                                let {
                                    rows: r
                                } = t;
                                for (let t of r)
                                    for (let r of t.cols) "qrcode" != r.type && "barcode" != r.type || e._nw("_qX", r.type), (null === (h = r.elements) || void 0 === h ? void 0 : h.length) && n(r.elements), r.bindKey && (g.fields || (g.fields = []), g.fields.push({
                                        id: r.bindKey,
                                        name: r.bindName
                                    }))
                            }
                            "data-richtext" == p && (p = "richtext"), e._nw("_qY", p), "hod-footer" == p ? s = t.height : "barcode" == p || "qrcode" == p || "fx" == p || "signature" == p ? e._nw("_qX", p) : "batch-barcode" == p || "batch-qrcode" == p ? e._nw("_qX", p.substring(6)) : p.startsWith("chart/") ? (p = "chart/chartjs" == p ? "chart" : "echarts", e._nw("_qX", p)) : "formula" == p ? e._nw("_qX", "mathjax") : "richtext" == p ? e._nw("_qX", "html2canvas") : "html" == p && e._nw("_qX", "underscore")
                        }
                    };
                return n(t), {
                    _qZ: s,
                    _q0: o,
                    _q1: {}
                }
            },
            _q3(t) {
                let {
                    props: e,
                    type: r
                } = t, {
                    bind: o,
                    rows: s,
                    dynamicCols: d,
                    avgDynamicColsWidth: a
                } = e;
                if (o.id && d) {
                    let {
                        _iq: t,
                        _ir: d
                    } = i._qp(o);
                    if (!t) {
                        let t, i = (t => {
                            if (f(t)) {
                                let e = {};
                                for (let r of t)
                                    for (let t in r) null != r[t] && (e[t] = t);
                                return e
                            }
                            return t
                        })(d);
                        t = "data-dtable" == r ? ((t, e) => {
                            let r = [],
                                i = 0,
                                l = 0;
                            for (let o of t) {
                                if (o.data) {
                                    for (let t = o.cols.length; t--;) {
                                        let l = o.cols[t];
                                        l.bindKey && null == e[l.bindKey] && (r.push(t), i += l.width)
                                    }
                                    break
                                }
                                l++
                            }
                            return {
                                fx: l,
                                fy: r,
                                fz: i
                            }
                        })(s, i) : ((t, e) => {
                            let r = [],
                                i = 0,
                                l = 0;
                            for (let o of t) {
                                if (o.data) {
                                    for (let t = o.cols.length; t--;) {
                                        let l = o.cols[t];
                                        k(l.elements, e) || (r.push(t), i += l.width)
                                    }
                                    break
                                }
                                l++
                            }
                            return {
                                fx: l,
                                fy: r,
                                fz: i
                            }
                        })(s, i);
                        let o = t.fy,
                            n = t.fz,
                            h = t.fx;
                        e.focusRow = h, l.fx(e);
                        for (let t of o) e.focusCol = t, l.fC(e), l.fx(e);
                        if ("none" == a) e.width -= n;
                        else if ("direct" == a) {
                            let t = n / e._j3;
                            for (let e of s)
                                for (let r of e.cols) {
                                    let e = r.colspan;
                                    r.width += t * e
                                }
                        } else {
                            let t = l.fy(e)._j4,
                                r = 0;
                            for (let e of t) r += e;
                            for (let t of s)
                                for (let e of t.cols) e.width += e.width / r * n
                        }
                    }
                }
            }
        }
    })), s.d("7h/43/7i", ["3l"], (t => {
        let e = t("3l"),
            {
                use: r,
                isFunction: i,
                mix: l
            } = e,
            o = async t => {
                let [e] = await r("42/" + t);
                i(e) ? await e() : i(e._jF) && await e._jF()
            },
            s = async t => {
                await r("4e/" + t + "/3i")
            },
            d = t => new Promise((e => {
                let r = new Image;
                r.onload = r.onerror = () => {
                    e()
                }, r.src = t, r.complete && e()
            })),
            a = function() {
                this._q4 = {}, this._q5 = []
            };
        return l(a.prototype, {
            _nw(t, e) {
                let r = t + "~" + e,
                    i = this._q4,
                    l = this._q5;
                1 != i[r] && (i[r] = 1, l.push({
                    type: t,
                    src: e
                }))
            }, _hF() {
                let t = [],
                    e = this._q5;
                for (let r of e) "_qX" == r.type ? t.push(o(r.src)) : "_qY" == r.type ? t.push(s(r.src)) : t.push(d(r.src));
                return Promise.all(t)
            }, _q6() {
                this._q5.length = 0
            }
        }), a
    })), s.d("7h/7j/3i", [], (() => {
        let t = "http://127.0.0.1:8000/CLodopfuncs.js",
            e = () => {
                try {
                    let e = localStorage.getItem("lodop.src");
                    return e || (e = t), e
                } catch {
                    return t
                }
            },
            r = {};
        return {
            _rC(t) {
                try {
                    localStorage.setItem("lodop.src", t)
                } catch {}
            }, _rD: e, _rb: () => new Promise((t => {
                let i = e(),
                    l = r[i];
                l || (l = {
                    _rE: 1,
                    _rF: []
                }, r[i] = l), l._rF.push(t);
                let o = () => {
                    let t;
                    l._rE |= 4, window.getCLodop && (t = getCLodop());
                    for (let e of l._rF) e(t);
                    l._rF.length = 0
                };
                if (4 & l._rE) o();
                else if (!(2 & l._rE)) {
                    l._rE |= 2;
                    let t = document.createElement("script");
                    t.onload = t.onerror = o, t.src = i, document.head.appendChild(t)
                }
            }))
        }
    })), s.d("7h/7j/78", ["3l", "./3i"], (t => {
        let e, r, i, l, o, s = t("3l"),
            d = t("./3i"),
            a = "div",
            n = "button",
            h = {
                class: "rd-fM"
            },
            f = {
                class: "rd-gL rd-gP"
            },
            p = {
                class: "rd-fO rd-gL rd-ha"
            },
            g = {
                value: "value"
            };
        return s.View.extend({
            tmpl(t, s, d) {
                let c, u, $, y, {
                    src: m
                } = t;
                return e ? c = [e] : (u = [s(0, '<h5 class="rd-ia rd-hO rd-fA">Lodop打印设置</h5>', 1)], c = [e = s(a, {
                    $: "d;",
                    class: "rd-fI rd-fA rd-gh"
                }, u)]), r ? y = [r] : ($ = [s(0, "打印插件地址：")], y = [r = s(a, {
                    $: "d:",
                    class: "rd-n8"
                }, $)]), $ = [s("input", {
                    placeholder: "打印插件地址",
                    class: "rd-fA rd-fB rd-n9",
                    value: m,
                    _input: d + "_rG()"
                }, 1, g)], y.push(s(a, 0, $)), u = [s(a, f, y)], i ? u.push(i) : (y = [s(0, 'Lodop安装后会有一个通过http协议来控制打印服务的javascript插件，在这里设置该插件的地址。如果打印服务安装在当前电脑上且未修改过端口，则无需做任何设置。<a class="rd-fU" href="http://www.lodop.net/download.html" target="_blank" rel="noopener noreferrer">去Lodop官网了解更多信息</a>', 1)], u.push(i = s(a, {
                    $: "d-",
                    class: "rd-hE rd-o_"
                }, y))), c.push(s(a, h, u)), y = [l || (l = s(0, "应用"))], u = [s(n, {
                    _click: d + "_gE()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
                    type: n
                }, y)], y = [o || (o = s(0, "取消"))], u.push(s(n, {
                    _click: d + "_gD()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-f2",
                    type: n
                }, y)), c.push(s(a, p, u)), s(d, 0, c)
            }, init(t) {
                this._gC = t.dialog
            }, render() {
                this.digest({
                    src: d._rD()
                })
            }, "_gD<click>" () {
                this._gC.close()
            }, "_rG<input>" (t) {
                let e = t.eventTarget.value;
                this.digest({
                    src: e
                })
            }, "_gE<click>" () {
                d._rC(this.get("src")), this._gC.close()
            }
        })
    })), s.d("7h/7j/4g", ["3l"], (t => {
        let e, r, i = t("3l"),
            l = "div",
            o = "button",
            s = {
                class: "rd-fO rd-gL rd-ha"
            };
        return i.View.extend({
            tmpl(t, i, d) {
                let a, n, h, {
                    i18n: f
                } = t;
                return e ? a = [e] : (n = [i(0, '<h5 class="rd-ia rd-hO rd-fA">安装提示</h5>', 1)], a = [e = i(l, {
                    $: "d;",
                    class: "rd-fI rd-fA rd-gh"
                }, n)]), r ? a.push(r) : (n = [i(0, '未检测到Lodop打印服务，请您先前往<a class="rd-fU" href="http://www.lodop.net/LodopDemo.html" target="_blank" rel="noopener noreferrer">Lodop官方示例页面</a>，按相关说明安装Lodop打印服务并能正常运行官网提供的示例后，再来该页面尝试使用Lodop打印。', 1)], a.push(r = i(l, {
                    $: "d:",
                    class: "rd-fM"
                }, n))), h = [i(0, f("oK"))], n = [i(o, {
                    _click: d + "_nI()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
                    type: o
                }, h)], a.push(i(l, s, n)), i(d, 0, a)
            }, init(t) {
                this._gC = t.dialog
            }, render() {
                this.digest()
            }, "_nI<click>" () {
                this._gC.close()
            }
        })
    })), s.d("7h/7k/3i", [], (() => {
        let t = {
            "127.0.0.1": 1,
            localhost: 1
        };
        return {
            _ru() {
                let t = {
                    name: "",
                    nc: 1,
                    pt: 0,
                    pl: 0,
                    pr: 0,
                    pb: 0,
                    l: "portrait",
                    ts: !1
                };
                try {
                    let e = JSON.parse(localStorage.getItem("rds.printer"));
                    Object.assign(t, e)
                } catch {}
                return t
            }, _rH(t) {
                try {
                    localStorage.setItem("rds.printer", JSON.stringify(t))
                } catch {}
            }, _ri(e) {
                let r = location.hostname;
                return t[r] ? `RDS服务异常[${e.message||e}]` : r + "环境不支持RDS服务"
            }
        }
    })), s.d("7h/7k/78", ["3l", "../../3j/5f", "./3i", "3s/6t/3i", "3s/6s/3i"], (t => {
        let e = t("3l"),
            r = t("../../3j/5f"),
            i = t("./3i");
        t("3s/6t/3i"), t("3s/6s/3i");
        let l, o, s, d, a, n, h, f, p, g, c, u, $, y, m = "div",
            x = "rd-n8 rd-gr",
            _ = "rd-n9",
            b = "printer",
            w = "rd-fB rd-gw",
            k = "button",
            v = {
                class: "rd-fM"
            },
            j = {
                class: "rd-gL rd-gP"
            },
            L = {
                class: "rd-gL rd-gP rd-o_"
            },
            S = {
                class: "rd-fS rd-fG rd-gp rd-hd rd-gL rd-gP"
            },
            z = {
                class: "rd-fO rd-gL rd-ha rd-gP rd-gS rd-hU rd-hZ rd-fP rd-gh"
            },
            A = {
                checked: "checked"
            },
            {
                config: C,
                mark: I,
                View: T,
                toUrl: M
            } = e,
            P = [{
                text: "纵向",
                value: "portrait"
            }, {
                text: "横向",
                value: "landscape"
            }];
        return T.extend({
            tmpl(t, e, r, i, C, I) {
                let T, M, P, H, {
                    error: F,
                    exf: W,
                    list: B,
                    printer: q,
                    layouts: V
                } = t;
                return T = l ? [l] : [l = e(m, {
                    $: "d;",
                    class: "rd-fJ rd-gS rd-h0"
                })], o ? T.push(o) : (M = [e(0, '<h5 class="rd-ia rd-hO rd-fA">RDS打印设置</h5>', 1)], T.push(o = e(m, {
                    $: "d:",
                    class: "rd-fI rd-fA rd-gh rd-gS rd-gT rd-h1 rd-gW"
                }, M))), M = [], F ? M.push(e(0, W(F.message))) : (s ? H = [s] : (P = [e(0, "打印机：")], H = [s = e(m, {
                    $: "d-",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: "list",
                    _5: r,
                    class: _,
                    _change: r + "_rK({key:'name'})",
                    _: `3s/6t/3i?list=${I(C,B,"d;")}&selected=` + i(q.name)
                })), M.push(e(m, j, H)), d ? H = [d] : (P = [e(0, "方向：")], H = [d = e(m, {
                    $: "e_",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: "layouts",
                    _5: r,
                    class: _,
                    _change: r + "_rK({key:'l'})",
                    _: `3s/6t/3i?list=${I(C,V,"d:")}&textKey=text&valueKey=value&selected=` + i(q.l)
                })), M.push(e(m, L, H)), a ? H = [a] : (P = [e(0, "双面打印：")], H = [a = e(m, {
                    $: "ea",
                    class: x
                }, P)]), P = [e("input", {
                    class: "rd-hr rd-gv",
                    type: "checkbox",
                    checked: q.ts,
                    _change: r + "_rL()"
                }, 1, A)], n ? P.push(n) : P.push(n = e("i", {
                    $: "eb",
                    class: "rd-hs rd-hu rd-gE rd-gw"
                })), H.push(e("label", S, P)), M.push(e(m, L, H)), h ? H = [h] : (P = [e(0, "打印份数：")], H = [h = e(m, {
                    $: "ec",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: b,
                    _5: r,
                    _input: r + "_rJ({key:'nc'})",
                    class: w,
                    _: "3s/6s/3i?min=1&value=" + I(C, q.nc, "d-")
                })), M.push(e(m, L, H)), f ? H = [f] : (P = [e(0, "左页边距：")], H = [f = e(m, {
                    $: "ed",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: b,
                    _5: r,
                    _input: r + "_rJ({key:'pl'})",
                    class: w,
                    _: "3s/6s/3i?min=0&value=" + I(C, q.pl, "e_")
                })), M.push(e(m, L, H)), p ? H = [p] : (P = [e(0, "上页边距：")], H = [p = e(m, {
                    $: "ee",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: b,
                    _5: r,
                    _input: r + "_rJ({key:'pt'})",
                    class: w,
                    _: "3s/6s/3i?min=0&value=" + I(C, q.pt, "ea")
                })), M.push(e(m, L, H)), g ? H = [g] : (P = [e(0, "右页边距：")], H = [g = e(m, {
                    $: "ef",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: b,
                    _5: r,
                    _input: r + "_rJ({key:'pr'})",
                    class: w,
                    _: "3s/6s/3i?min=0&value=" + I(C, q.pr, "eb")
                })), M.push(e(m, L, H)), c ? H = [c] : (P = [e(0, "下页边距：")], H = [c = e(m, {
                    $: "eg",
                    class: x
                }, P)]), H.push(e(m, {
                    $$: b,
                    _5: r,
                    _input: r + "_rJ({key:'pb'})",
                    class: w,
                    _: "3s/6s/3i?min=0&value=" + I(C, q.pb, "ec")
                })), M.push(e(m, L, H))), T.push(e(m, v, M)), H = [u || (u = e(0, "应用"))], M = [e(k, {
                    _click: r + "_gE()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-fH",
                    type: k
                }, H)], H = [$ || ($ = e(0, "取消"))], M.push(e(k, {
                    _click: r + "_gD()",
                    class: "rd-fF rd-fG rd-fE rd-fA rd-gs rd-hd rd-f2",
                    type: k
                }, H)), T.push(e(m, z, M)), y ? T.push(y) : T.push(y = e(m, {
                    $: "eh",
                    class: "rd-fN rd-gS rd-hY"
                })), e(r, 0, T)
            }, init(t) {
                this._gC = t.dialog, this.set({
                    exf: i._ri,
                    layouts: P
                })
            }, render() {
                let t = I(this, "_rI"),
                    e = new r,
                    l = M("", {
                        print: JSON.stringify({
                            width: 0,
                            height: 0,
                            location: location.href
                        })
                    });
                e.all({
                    name: "_ix",
                    url: C("rdsUrl") + "printers",
                    _i_: l
                }, ((e, r) => {
                    if (t()) {
                        let t = i._ru(),
                            l = r.get("data", []);
                        t.name || (t.name = l[0]), this.digest({
                            error: e,
                            list: l,
                            printer: t
                        })
                    }
                }))
            }, "_gD<click>" () {
                this._gC.close()
            }, "_rJ<input>" (t) {
                let e = this.get("printer"),
                    {
                        key: r
                    } = t.params;
                e[r] = t.value
            }, "_rK<change>" (t) {
                let e = this.get("printer"),
                    {
                        key: r
                    } = t.params;
                e[r] = t.value
            }, "_rL<change>" (t) {
                this.get("printer").ts = t.eventTarget.checked
            }, "_gE<click>" () {
                i._rH(this.get("printer")), this._gC.close()
            }
        })
    })), s.d("7h/7l/7m", ["3l", "../../3j/3n", "../../3j/3o", "../../42/6j", "../../42/43", "../43/3i"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../3j/3o"),
            l = t("../../42/6j"),
            o = t("../../42/43"),
            s = t("../43/3i"),
            {
                guid: d,
                isArray: a
            } = e,
            {
                max: n,
                abs: h
            } = Math;
        return async(t, e, h, f, p, g, c) => {
            let u, {
                    props: $,
                    type: y,
                    id: m
                } = t,
                {
                    x: x,
                    y: _,
                    width: b,
                    hspace: w,
                    vspace: k,
                    rotate: v,
                    bind: j
                } = $;
            if (!j || !j.id) return -1;
            let L, S, z, A = h.height - f,
                C = i.fy($),
                I = C._fH,
                T = C._fG,
                M = C._gd,
                P = C._ge,
                H = C._gb[0],
                F = M - x,
                W = P - _,
                B = _,
                q = x,
                V = 0,
                O = p.length,
                R = 0,
                {
                    _iq: N,
                    _ir: Y
                } = l._qp(j);
            for (a(Y) || (Y = [Y]), R = Y.length;;) {
                let t = o.fB($),
                    l = t.bind;
                if (N) l._tip = N;
                else {
                    let t = Y[e++];
                    l._data = t, e > R && (u = -1)
                } if (-1 == u) break; {
                    t.x = q, t.y = B;
                    let l = {
                        type: y,
                        id: d(m),
                        props: t
                    };
                    if (g || p.push(l), "batch-text" == y && t.autoReturn) {
                        let l = await s._qR(y, {
                                props: t,
                                unit: c
                            }),
                            o = r.fy(l.firstElementChild.offsetHeight),
                            d = i.fy({
                                x: x,
                                y: _,
                                width: b,
                                rotate: v,
                                height: o
                            }),
                            a = d._gb[0],
                            f = H.x - a.x + q - x + (L ? L - d._gd + w : 0),
                            g = H.y - a.y + B - _ + (S ? S - d._ge + k : 0);
                        if (t.x += f, t.y += g, M = d._hG + f, M > h.width) {
                            z = 1, O = p.length;
                            let e = P - (d._ge + g) + k,
                                r = t.x - x;
                            t.y += e, t.x = x, M -= r, S = P, L = M, V = d._fH, P = d._hH + g + e
                        } else P = n(P, d._hH + g), V = n(V, d._fH), L = M; if (z && P > A) {
                            let t = p.length - O + 1;
                            u = e - t, p.splice(O - 1, t);
                            break
                        }
                    } else if (M += T + w, q = M - F, M + T > h.width && (M = C._gd, q = M - F, P += I + k, B = P - W, P + I > A)) {
                        u = e;
                        break
                    }
                }
            }
            return u == R ? -1 : u
        }
    })), s.d("7h/7l/7n", ["3l", "../../42/6j"], (t => {
        let e = t("3l"),
            r = t("../../42/6j"),
            {
                isArray: i
            } = e;
        return (t, e, l, o) => {
            let {
                props: s
            } = t, {
                bind: d
            } = s;
            if (d.id && !d._tip && !d._data) {
                let {
                    _iq: t,
                    _ir: e
                } = r._qp(d);
                t ? d._tip = t : d._data = e
            }
            if ("repeat" == t.type) {
                let t = s.image;
                if (d._data) {
                    let e = d._data;
                    i(e) && (e = e[0]), t = e[d.fields[0].id]
                }
                l._nw("_rM", t)
            }
            o || e.push(t)
        }
    })), s.d("7h/7l/data-celltable", ["../../42/6j"], (t => {
        let e = t("../../42/6j");
        return (t, r, i, l) => {
            l || i.push(t);
            let {
                props: o
            } = t, {
                bind: s
            } = o;
            if (s.id) {
                let {
                    _iq: t,
                    _ir: i
                } = e._qp(s);
                if (!t) return s._data = i[r], r == i.length - 1 ? -1 : r + 1;
                s._tip = t
            }
            return -1
        }
    })), s.d("7h/7l/data-coltable", ["../../3j/3n", "../../4e/data-coltable/6m", "../../42/6j"], (t => {
        let e = t("../../3j/3n"),
            r = t("../../4e/data-coltable/6m"),
            i = t("../../42/6j"),
            {
                floor: l
            } = Math;
        return (t, o, s, d, a, n) => {
            n || a.push(t);
            let {
                props: h
            } = t, {
                bind: f,
                columns: p
            } = h;
            if (f.fields && f.fields.length) {
                let t = 0;
                for (let e of f.fields) t += p[e.id];
                let a = e.fy(1);
                h.width = t + a;
                let {
                    _iq: n,
                    _ir: g
                } = i._qp(f);
                if (!n) {
                    let t = s.height - h.y - h.theadRowHeight - a - h.tfootSpacing - d,
                        e = l(t / (h.tbodyRowHeight + a));
                    e < 1 && (e = 1);
                    let r = e + o;
                    return r > g.length && (r = g.length), f._data = g.slice(o, r), r == g.length ? -1 : r
                }
                h.loadingHeight = r._ki, f._tip = n
            } else h.width = r._kh;
            return -1
        }
    })), s.d("7h/7l/data-dtable", ["3l", "../../3j/3n", "../../42/6j", "../../42/43", "../../42/4o", "../43/3i"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/6j"),
            l = t("../../42/43"),
            o = t("../../42/4o"),
            s = t("../43/3i"),
            {
                keys: d
            } = e,
            {
                min: a,
                floor: n
            } = Math,
            h = {},
            f = (t, e, r, i) => {
                let l = {},
                    o = d(t[0]);
                r = a(r, t.length);
                for (let i of o) {
                    let o = 0,
                        s = 0;
                    for (let l = e; l < r; l++) {
                        o += t[l][i], s++
                    }
                    isNaN(o) && (o = 0), l[i + "Sumpage"] = o, l[i + "Avgpage"] = s > 0 ? o / s : 0, o = 0, s = 0;
                    for (let e = 0; e < r; e++) {
                        o += t[e][i], s++
                    }
                    isNaN(o) && (o = 0), l[i + "Acc"] = o, l[i + "Avgacc"] = s > 0 ? o / s : 0, o = 0, s = 0;
                    for (let e = 0; e < t.length; e++) {
                        o += t[e][i], s++
                    }
                    isNaN(o) && (o = 0), l[i + "Sum"] = o, l[i + "Avg"] = s > 0 ? o / s : 0
                }
                for (let t = i.cols.length; t--;) {
                    i.cols[t].totalData = l
                }
            };
        return async(t, e, d, a, p, g, c) => {
            c || g.push(t);
            let {
                props: u,
                type: $
            } = t, {
                bind: y,
                rows: m,
                borderwidth: x,
                tfootSpacing: _,
                borderdeed: b,
                headFirst: w,
                footLast: k,
                hideFoot: v,
                hideHead: j,
                hideTotal: L,
                hideLabel: S,
                columnsPrint: z,
                hspace: A
            } = u, C = async(t, i, l) => {
                y._data = t.slice(e, e + 1), y._showAcc = !0, y._showFoot = !1, y._showHead = !1, f(t, e, i, l);
                let o = (await s._qR($, {
                        props: u,
                        unit: p
                    })).getElementsByTagName("tr"),
                    d = o[o.length - 1];
                return r.fy(d.offsetHeight)
            };
            if (y.id) {
                let {
                    _iq: c,
                    _ir: I
                } = i._qp(y);
                if (!c) {
                    let i = !1,
                        c = 0,
                        T = -1,
                        M = -1,
                        P = -1,
                        H = 0,
                        F = 0;
                    for (let t of m) t.label ? -1 == T && (T = c) : t.data ? M = c : t.total ? P = c : -1 == T ? H++ : -1 != P && F++, c++;
                    let W = m[P],
                        B = m[M],
                        q = !1,
                        V = !1,
                        O = !1;
                    for (let t of B.cols)
                        if (t.bindKey && t.textAutoReturn) {
                            q = !0;
                            break
                        }
                    for (let t = T; t < M; t++) {
                        let e, r = m[t];
                        for (let t of r.cols)
                            if (t.textAutoReturn) {
                                V = !0, e = !0;
                                break
                            }
                        if (e) break
                    }
                    let R = q || V,
                        N = [];
                    if (R && (await(async(e, i) => {
                        if (!h[t.id]) {
                            y._data = e, y._showAcc = !1, y._showFoot = !1, y._showHead = !1, u.hideLabel = !1;
                            let l = await s._qR(i, {
                                props: u,
                                unit: p
                            });
                            u.hideLabel = S;
                            let o = l.getElementsByTagName("tr"),
                                d = [];
                            for (let t = o.length; t--;) {
                                let e = o[t];
                                d[t] = r.fy(e.offsetHeight)
                            }
                            h[t.id] = d
                        }
                    })(I, $), N = h[t.id]), !L)
                        for (let t of W.cols)
                            if ("sumpage" == t.type || "sum" == t.type || "acc" == t.type || "custom" == t.type || "avg" == t.type || "avgpage" == t.type || "avgacc" == t.type || "text" == t.type && t.textContent) {
                                i = !0;
                                break
                            }
                    if (i)
                        for (let t of W.cols)
                            if (t.textAutoReturn) {
                                O = !0;
                                break
                            }
                    o.fx(u, !0);
                    let Y = o.fy(u)._j5,
                        X = Y[P] || 0,
                        U = X,
                        E = 0,
                        D = Y[M] || 0,
                        K = 0,
                        J = 0;
                    if (V)
                        for (let t = T; t < M; t++) {
                            let e = m[t],
                                r = N[t - T] || 0;
                            K += r;
                            for (let t of e.cols) t.height = r
                        } else
                            for (let t = T; t < M; t++) {
                                K += Y[t] || 0
                            }
                    for (let t = 0; t < Y.length; t++)!j && t < T && (E += Y[t] || 0), t > P && !v && (J += Y[t] || 0);
                    "separate" == b && (E += 2 * H, J += 2 * F, X += 2, K += 2, x = 2, D += 2);
                    let G, Q, Z, tt = !1;
                    for (;;) {
                        let r = !0,
                            o = !0;
                        0 == e || u.eachPageLabel || (u.hideLabel = !0), u.hideLabel && (K = 0);
                        let s, h = d.height - u.y - x - _ - a - K;
                        j ? o = !1 : w ? 0 == e ? h -= E : o = !1 : h -= E, i && (h -= X);
                        let p = async() => {
                            for (;;) {
                                if (Q < 1 && (Q = 1), Q + e > I.length && (Q = I.length - e), R) {
                                    let t = M - T,
                                        r = N.slice(e + t, e + Q + t);
                                    y._rHeights = r, s = 0;
                                    for (let t of r) s += t
                                } else s = Q * D + x; if (O) {
                                    for (let t of W.cols) t.height = U;
                                    let t = await C(I, Q + e, W);
                                    for (let e of W.cols) e.height = t;
                                    h += X, h -= t, X = t
                                }
                                if (s > h && Q > 1 ? Q-- : Z = 1, Z) break
                            }
                            G = Q + e
                        };
                        if (k && !v)
                            if (Q = n(h / D), await p(), G >= I.length)
                                if (G = I.length, e < G) {
                                    let t = s + x + K + J + _;
                                    i && (t += X), u.y + t <= d.height ? tt = !0 : r = !1
                                } else tt = !0;
                        else r = !1;
                        else h -= J, Q = n(h / D), await p(), G >= I.length && (G = I.length, tt = !0);
                        y._data = I.slice(e, G), y._all = I, y._showAcc = i, y._showFoot = r, y._showHead = o, i && f(I, e, G, W);
                        let c = u.x + 2 * u.width + A <= d.width;
                        if (tt || !z || !c) break;
                        e = G, t = l.fB(t), g.push(t), u = t.props, y = u.bind, m = u.rows, W = m[P], u.x += u.width + A, Z = 0
                    }
                    return tt ? -1 : G
                }
                y._tip = c
            } else y._showHead = !0, y._showFoot = !0;
            return -1
        }
    })), s.d("7h/7l/data-ftable", ["../../3j/3n", "../../3j/3o", "../../42/6j", "../../42/43", "../../42/4o", "../43/3i", "./7n"], (t => {
        let e = t("../../3j/3n"),
            r = t("../../3j/3o"),
            i = t("../../42/6j"),
            l = t("../../42/43"),
            o = t("../../42/4o"),
            s = t("../43/3i"),
            d = t("./7n"),
            {
                floor: a
            } = Math,
            n = {};
        return async(t, h, f, p, g, c, u, $) => {
            var y, m;
            u || c.push(t);
            let x, _, {
                    props: b,
                    id: w
                } = t,
                {
                    bind: k,
                    rows: v,
                    borderwidth: j,
                    tfootSpacing: L,
                    borderdeed: S,
                    headFirst: z,
                    footLast: A,
                    hideFoot: C,
                    hideHead: I,
                    hideLabel: T,
                    hideTotal: M,
                    hspace: P,
                    columnsPrint: H,
                    autoHeight: F
                } = b,
                W = l.fB(v);
            if (k.id) {
                let t = i._qp(k);
                x = t._iq, _ = t._ir
            } else _ = []; if (!x) {
                let i;
                F && (n[w] ? i = n[w] : (i = await(async(t, i, o, a, n) => {
                    var h, f, p;
                    (i = l.fB(i)).hideLabel = !1, i.hideTotal = !1;
                    let {
                        rows: g,
                        bind: c
                    } = i;
                    c._showAcc = !0, c._showHead = !0, c._showFoot = !0;
                    let u = 0,
                        $ = -1;
                    for (let t of g) {
                        if (t.data) {
                            $ = u;
                            break
                        }
                        u++
                    }
                    u = 0;
                    for (let t of g) {
                        if (u != $)
                            for (let e of t.cols)
                                if (null === (h = e.elements) || void 0 === h ? void 0 : h.length)
                                    for (let t of e.elements) t.props.bind && d(t, n, a, 1);
                        u++
                    }
                    let y = g[$],
                        m = [];
                    for (let e of t) {
                        let t = l.fB(y);
                        for (let r of t.cols)
                            if (null === (f = r.elements) || void 0 === f ? void 0 : f.length)
                                for (let t of r.elements) t.props.bind && (t.props.bind._data = e);
                        m.push(t)
                    }
                    g.splice($, 1, ...m);
                    let x = (await s._qR("data-ftable", {
                            props: i,
                            unit: o
                        })).querySelector("tbody").getElementsByTagName("tr"),
                        _ = [];
                    u = 0;
                    for (let t of g) {
                        let i = 0,
                            l = 0;
                        for (let s of t.cols) {
                            if (null === (p = s.elements) || void 0 === p ? void 0 : p.length) {
                                let t = 0,
                                    d = x[u].cells[l].children,
                                    a = 0;
                                for (let i of s.elements) {
                                    let l = r.fy(i.props)._fH,
                                        s = d[t].firstElementChild.getBoundingClientRect(),
                                        n = e.fy(s.height, o) - l;
                                    n > a && (a = n), t++
                                }
                                a > i && (i = a)
                            }
                            l++
                        }
                        _[u] = i, u++
                    }
                    return _
                })(_, b, $, g, c), n[w] = i));
                let u = !M,
                    x = 0,
                    B = -1,
                    q = -1,
                    V = -1,
                    O = -1,
                    R = 0,
                    N = 0;
                for (let t of v) t.label ? -1 == B && (B = x) : t.data ? q = x : t.total ? -1 == V && (V = x) : -1 == B ? R++ : -1 != V && (-1 == O && (O = x), N++), x++;
                let Y = v[q];
                o.fx(b, !0);
                let X, U, E, D, K = o.fy(b)._j5,
                    J = 0,
                    G = 0,
                    Q = 0,
                    Z = K[q] || 0,
                    tt = 0,
                    et = !1;
                F && (X = i.slice(0, q + 1).concat(i.slice(V - v.length)));
                for (let t = 0; t < K.length; t++) {
                    let e = F ? X[t] : 0;
                    !I && t < B ? Q += K[t] + e : t >= B && t < q && !T ? G += K[t] + e : t >= V && t < O && !M ? J += K[t] + e : t >= O && !C && (tt += K[t] + e)
                }
                for ("separate" == S && (Q += 2 * R, tt += 2 * N, J += 2, G += 2, j = 2, Z += 2);;) {
                    let e = !0,
                        r = !0,
                        o = f.height - b.y - j - L - p - G;
                    I ? r = !1 : z ? 0 == h ? o -= Q : r = !1 : o -= Q, u && (o -= J);
                    let s, n = q + h,
                        $ = () => {
                            for (;;) {
                                if (E < 1 && (E = 1), E + h > _.length && (E = _.length - h), F) {
                                    s = 0;
                                    for (let t = n + E - 1; t >= n; t--) s += Z + i[t]
                                } else s = E * Z; if (s > o && E > 1 ? E-- : D = 1, D) break
                            }
                            U = E + h
                        };
                    if (A && !C)
                        if (E = a(o / Z), $(), U >= _.length)
                            if (U = _.length, h < U) {
                                let t = s + j + G + tt + L;
                                u && (t += J), b.y + t <= f.height ? et = !0 : e = !1
                            } else et = !0;
                    else e = !1;
                    else e = !C, o -= tt, E = a(o / Z), $(), U >= _.length && (U = _.length, et = !0);
                    x = 0;
                    for (let t of v) {
                        if (x != q) {
                            let e;
                            e = x < q ? x : _.length + x - 1;
                            for (let r of t.cols)
                                if (null === (y = r.elements) || void 0 === y ? void 0 : y.length) {
                                    for (let t of r.elements) t.props.bind && d(t, c, g, 1);
                                    F && (r.height += i[e])
                                }
                        }
                        x++
                    }
                    let w = q + h,
                        S = _.slice(h, U),
                        T = [];
                    for (let t of S) {
                        let e = l.fB(Y);
                        for (let r of e.cols) {
                            if (null === (m = r.elements) || void 0 === m ? void 0 : m.length)
                                for (let e of r.elements) e.props.bind && (e.props.bind._data = t);
                            F && (r.height += i[w])
                        }
                        w++, T.push(e)
                    }
                    v.splice(q, 1, ...T), k._showAcc = u, k._showFoot = e, k._showHead = r;
                    let M = b.x + 2 * b.width + P <= f.width;
                    if (et || !H || !M) break;
                    h = U, t = l.fB(t), c.push(t), b = t.props, k = b.bind, b.rows = l.fB(W), v = b.rows, b.x += b.width + P, D = 0
                }
                return et ? -1 : U
            }
            return k._tip = x, -1
        }
    })), s.d("7h/7l/data-repeater", ["3l", "../../42/6j", "../../42/43"], (t => {
        let e = t("3l"),
            r = t("../../42/6j"),
            i = t("../../42/43"),
            {
                guid: l,
                isArray: o
            } = e;
        return async(t, e, s, d, a, n) => {
            var h;
            let f, {
                    props: p,
                    type: g,
                    id: c
                } = t,
                {
                    x: u,
                    y: $,
                    width: y,
                    height: m,
                    hspace: x,
                    vspace: _
                } = p,
                b = s.height - d,
                w = u,
                k = $,
                v = m;
            for (;;) {
                let t = i.fB(p);
                t.x = w, t.y = k;
                let d = t.bind;
                if (d.id) {
                    let {
                        _iq: t,
                        _ir: i
                    } = r._qp(d);
                    if (t) d._tip = t;
                    else {
                        o(i) || (i = [i]);
                        let t = i[e++];
                        d._data = t, e >= i.length && (f = -1)
                    }
                } else f = -1;
                for (let e of t.rows)
                    for (let t of e.cols)
                        if (null === (h = t.elements) || void 0 === h ? void 0 : h.length)
                            for (let e of t.elements) {
                                let t = e.props.bind;
                                (null == t ? void 0 : t.id) == d.id && (t._data = d._data)
                            }
                        let $ = {
                            type: g,
                            id: l(c),
                            props: t
                        };
                if (n || a.push($), -1 == f) break;
                if (w += y + x, w + y > s.width) {
                    if (w = u, k += v + _, k + m > b) {
                        f = e;
                        break
                    }
                    v = m
                }
            }
            return f
        }
    })), s.d("7h/7l/richtext", ["3l", "../../3j/3n", "../../42/6j", "../../42/html2canvas", "../43/3i"], (t => {
        let e = t("3l"),
            r = t("../../3j/3n"),
            i = t("../../42/6j"),
            l = t("../../42/html2canvas"),
            o = t("../43/3i"),
            {
                task: s,
                lowTaskFinale: d,
                isArray: a,
                has: n
            } = e,
            h = {
                TD: 1,
                BR: 1,
                TH: 1,
                P: 1,
                DIV: 1
            },
            f = (t, e) => t - e,
            p = (t, e) => t.y - e.y,
            g = (t, e) => {
                let r = e.getBoundingClientRect();
                if (r.height) {
                    let e = `${r.y}~${r.height}`;
                    t[e] || (t[e] = 1, t.push({
                        y: scrollY + r.y,
                        height: r.height
                    }))
                }
            },
            c = async(t, e, r) => {
                let i = devicePixelRatio,
                    a = t.x,
                    c = t.y;
                t.x = 0, t.y = 0, o._qP("富文本:正在检测图片...");
                let u = await o._qR(r, {
                    props: t,
                    unit: e
                });
                t.x = a, t.y = c;
                let $ = u.firstElementChild;
                await o._qT($, !1), o._qP("富文本:正在准备环境和数据..."), await l(), scrollTo(0, 0);
                let y = await html2canvas($, {
                    useCORS: !0,
                    scale: i
                });
                o._qP("富文本:正在检测分割点...");
                let m = $.getBoundingClientRect(),
                    x = await(async(t, {
                        y: e,
                        height: r
                    }) => {
                        let i = document.createRange(),
                            l = [],
                            o = t => {
                                if (scrollTo(0, 0), 3 == t.nodeType) {
                                    let e = 0;
                                    for (; e < t.length;) i.setStart(t, e), i.setEnd(t, e + 1), g(l, i), e++
                                } else i.setStartBefore(t), i.setEndAfter(t), g(l, i)
                            },
                            a = t => {
                                for (let e of t) 3 == e.nodeType ? s(o, [e]) : 1 == e.nodeType && (e.childNodes.length ? s(a, e.childNodes) : n(h, e.tagName.toUpperCase()) || s(o, [e]))
                            };
                        a(t), await d(), l = l.sort(p), l.length || l.push({
                            y: e,
                            height: 2
                        });
                        let f = e + r,
                            c = l[l.length - 1];
                        return f - (c.y + c.height) >= 30 && l.push({
                            y: f - 2,
                            height: 2
                        }), (t => {
                            let e = [],
                                r = t[0];
                            for (let i = 1; i < t.length; i++) {
                                e.push(r);
                                let l = t[i],
                                    o = r.y + r.height,
                                    s = l.y - o,
                                    d = s / 30 | 0;
                                if (d) {
                                    let t = s / d;
                                    for (let r = 0; r < d; r++) e.push({
                                        y: o + t * (r + 1) - 2,
                                        height: 4
                                    })
                                }
                                r = l
                            }
                            return e.push(r), e
                        })(l)
                    })([$], m),
                    _ = await(async(t, e) => {
                        let r = [],
                            i = i => {
                                let l, o = i.y + i.height,
                                    s = 1;
                                for (let t of e) {
                                    if (t.y + t.height > o && t.y < o) {
                                        s = 0;
                                        break
                                    }
                                    t.y > o && (null == l || t.y < l) && (l = t.y)
                                }
                                if (s) {
                                    let e = o - t.y;
                                    null != l && (l -= t.y, e += (l - e) / 2), -1 == r.indexOf(e) && r.push(e)
                                }
                            };
                        for (let t of e) s(i, [t]);
                        return await d(), r.sort(f)
                    })(m, x);
                return o._qP("富文本:正在分割..."), await(async(t, e, r) => {
                    let i = [],
                        l = document.createElement("canvas"),
                        o = l.getContext("2d"),
                        a = 0,
                        n = e.width;
                    l.width = n, t[t.length - 1] = e.height / r;
                    let h = t => {
                        let s = (t - a) * r;
                        s > 0 && (l.height = s, o.drawImage(e, 0, a * r, n, s, 0, 0, n, s), i.push({
                            _ir: l.toDataURL("image/png", 1),
                            _fG: n / r,
                            _fH: s / r
                        })), o.clearRect(0, 0, n, s), a = t
                    };
                    for (let e of t) s(h, [e]);
                    return await d(), i
                })(_, y, i)
            };
        return async(t, e, l, s, d, n, h) => {
            let {
                props: f,
                type: p,
                id: g
            } = t, u = r.fI(l.height - s - f.y), $ = "richtext";
            if ("data-richtext" == p) {
                t.type = "richtext";
                let e = f.bind;
                if (e.id) {
                    f.splitToPages = !0;
                    let {
                        _iq: t,
                        _ir: r
                    } = i._qp(e), l = e.fields[0];
                    if (t) f.text = t;
                    else {
                        let t = a(r) ? r[0] : r;
                        f.text = t[l.id]
                    }
                } else f.height = r.fy(30)
            } else if ("html" == p) {
                let e = f.bind;
                if (f.splitToPages = !0, e.id) {
                    let {
                        _iq: t,
                        _ir: r
                    } = i._qp(e);
                    t || (e._data = r)
                }
                t.type = "richtext", $ = "html"
            }
            if (f.splitToPages) try {
                let r = d[`_rN_${g}`];
                r || (r = await c(f, n, $), d[`_rN_${g}`] = r);
                let i = e,
                    l = r.length,
                    s = [];
                for (; i < l;) {
                    let t = r[i];
                    if (u < t._fH) {
                        s.length || (i++, s.push(t));
                        break
                    }
                    u -= t._fH, s.push(t), i++
                }
                let a = '<div style="display:flex;flex-direction:column;">';
                for (let t of s) a += `<img src="${t._ir}" style="width:${t._fG}px;height:${t._fH}px"/>`;
                return a += "</div>", f.text = a, h.push(t), i < l ? i : -1
            } catch (t) {
                f.text = t.message || t.name
            } finally {
                o._qQ()
            }
            return h.push(t), -1
        }
    }));