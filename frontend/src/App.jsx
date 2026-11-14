import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import hero from "./assets/hero.png";
import { api, getToken, setToken } from "./api.js";
import { t } from "./i18n.js";

const AuthContext = createContext(null);
const LangContext = createContext(null);

function money(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function friendlyError(error, lang) {
  if (!error) return t(lang, "common.error");
  if (error.code === "offline") return t(lang, "common.offline");
  if (error.status === 503) return t(lang, "common.unavailable");
  return error.message || t(lang, "common.error");
}

function useDraft(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

function useHashRoute() {
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || "/",
  );
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (path) => {
    window.location.hash = path;
  };
  return [route, go];
}

function Mark({ light }) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <path
        fill={light ? "#cfe8d7" : "#1a4735"}
        d="M16 4c6.2 0 11 3.6 12 8.2-1.2 1-4.4 1.8-12 1.8S5.2 13.2 4 12.2C5 7.6 9.8 4 16 4z"
      />
      <path
        fill={light ? "#12382a" : "#eef3e6"}
        d="M12.5 14.5h7v9.2a3.5 3.5 0 01-7 0z"
      />
    </svg>
  );
}

function Leaves() {
  return (
    <svg className="leaves" viewBox="0 0 200 200" aria-hidden="true">
      <path fill="#2d6a4f" d="M170 40c-40 10-70 50-62 92 28-8 62-38 62-92z" />
      <path fill="#1a4735" d="M150 70c-36 18-48 58-28 88 24-14 48-46 28-88z" />
      <path fill="#40916c" d="M188 90c-30 8-52 40-40 78 22-6 48-32 40-78z" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <b>{value}</b>
      {hint ? (
        <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function AuthProvider({ children }) {
  const [token, setTok] = useState(() => getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const lost = () => {
      setTok(null);
      setUser(null);
    };
    window.addEventListener("shroomtalk-auth-lost", lost);
    return () => window.removeEventListener("shroomtalk-auth-lost", lost);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let live = true;
    api
      .me()
      .then((data) => {
        if (live) setUser(data);
      })
      .catch(() => {
        if (live) {
          setToken(null);
          setTok(null);
          setUser(null);
        }
      });
    return () => {
      live = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      signedIn: Boolean(user),
      signIn: (accessToken, nextUser) => {
        setToken(accessToken);
        setTok(accessToken);
        setUser(nextUser);
      },
      signOut: () => {
        setToken(null);
        setTok(null);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("shroomtalk_lang") || "en",
  );
  useEffect(() => {
    localStorage.setItem("shroomtalk_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

function useLang() {
  return useContext(LangContext);
}

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang" role="group" aria-label="Language">
      {["en", "hi", "kn"].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code === "en" ? "EN" : code === "hi" ? "हिं" : "ಕನ್"}
        </button>
      ))}
    </div>
  );
}

function OfflineBanner() {
  const { lang } = useLang();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  if (online) return null;
  return <div className="banner">{t(lang, "common.offline")}</div>;
}

const LINKS = [
  ["/dashboard", "nav.dashboard", "▦"],
  ["/assistant", "nav.assistant", "✦"],
  ["/schemes", "nav.schemes", "▣"],
  ["/loan", "nav.loan", "₹"],
  ["/cultivation", "nav.cultivation", "🍄"],
  ["/business", "nav.business", "☰"],
  ["/profile", "nav.profile", "☺"],
];

function Sidebar({ route, go, open, onClose }) {
  const { lang } = useLang();
  const { signedIn, signOut } = useAuth();
  const goTo = (path) => {
    onClose();
    go(path);
  };
  return (
    <aside className={`sidebar${open ? " open" : ""}`} aria-label="Main">
      <a
        className="brand"
        href="#/dashboard"
        onClick={() => goTo("/dashboard")}
      >
        <Mark light />
        <span className="brand-text">
          ShroomTalk-AI
          <small>{t(lang, "brand.tag")}</small>
        </span>
      </a>
      <nav className="side-nav">
        {LINKS.map(([path, key, ico]) => (
          <a
            key={path}
            href={`#${path}`}
            aria-current={route === path ? "page" : undefined}
            onClick={() => goTo(path)}
          >
            <span className="side-ico" aria-hidden="true">
              {ico}
            </span>
            {t(lang, key)}
          </a>
        ))}
      </nav>
      <div className="side-foot">
        <nav className="side-nav">
          {signedIn ? (
            <button
              type="button"
              onClick={() => {
                signOut();
                goTo("/");
              }}
            >
              {t(lang, "nav.signout")}
            </button>
          ) : (
            <a href="#/login" onClick={() => goTo("/login")}>
              {t(lang, "nav.signin")}
            </a>
          )}
        </nav>
      </div>
    </aside>
  );
}

function AppFrame({ route, go, title, children, chatMode }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Leaves />
      <div
        className={`backdrop${open ? " show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <Sidebar
        route={route}
        go={go}
        open={open}
        onClose={() => setOpen(false)}
      />
      <section className={`pane${chatMode ? " chat-mode" : ""}`}>
        <div className="mobile-top">
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {t(lang, "nav.menu")}
          </button>
          <strong>ShroomTalk-AI</strong>
        </div>
        <OfflineBanner />
        <div className="pane-head">
          <h1>{title}</h1>
          <LangSwitch />
        </div>
        {children}
      </section>
    </div>
  );
}

function Landing({ go }) {
  const { lang } = useLang();
  return (
    <div>
      <Leaves />
      <header className="topbar">
        <a className="brand" href="#/" onClick={() => go("/")}>
          <Mark />
          <span className="brand-text">
            ShroomTalk-AI
            <small>{t(lang, "brand.tag")}</small>
          </span>
        </a>
        <a
          className="top-cta"
          href="#/register"
          onClick={() => go("/register")}
        >
          {t(lang, "land.account")}
        </a>
      </header>
      <section className="hero-market">
        <div>
          <h1>{t(lang, "land.title")}</h1>
          <p className="lead">{t(lang, "land.lead")}</p>
          <div className="row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => go("/register")}
            >
              {t(lang, "land.account")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => go("/dashboard")}
            >
              {t(lang, "land.cta")}
            </button>
          </div>
          <div className="chips">
            <span className="chip">{t(lang, "land.step1t")}</span>
            <span className="chip">{t(lang, "nav.schemes")}</span>
            <span className="chip">{t(lang, "nav.assistant")}</span>
          </div>
        </div>
        <figure className="photo">
          <img src={hero} alt="" />
        </figure>
      </section>
      <p className="disclaimer">{t(lang, "land.disclaimer")}</p>
    </div>
  );
}

function AuthPage({ mode, go }) {
  const { lang, setLang } = useLang();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    display_name: "",
    preferred_language: lang,
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const register = mode === "register";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = register
        ? await api.register({
            email: form.email,
            password: form.password,
            display_name: form.display_name || null,
            preferred_language: form.preferred_language,
          })
        : await api.login({ email: form.email, password: form.password });
      signIn(data.access_token, data.user);
      if (register) setLang(form.preferred_language);
      go("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <Leaves />
      <div className="auth-card">
        <div className="mushroom-mark" aria-hidden="true">
          🍄
        </div>
        <a
          className="brand"
          href="#/"
          onClick={() => go("/")}
          style={{ justifyContent: "center", marginTop: 8 }}
        >
          <span className="brand-text">
            ShroomTalk-AI
            <small>{t(lang, "brand.tag")}</small>
          </span>
        </a>
        <h1>{t(lang, register ? "auth.registerTitle" : "auth.loginTitle")}</h1>
        <p className="muted">{t(lang, "auth.hint")}</p>
        <form onSubmit={submit}>
          {register ? (
            <Field label={t(lang, "auth.name")}>
              <input
                value={form.display_name}
                onChange={(e) =>
                  setForm({ ...form, display_name: e.target.value })
                }
                autoComplete="name"
              />
            </Field>
          ) : null}
          <Field label={t(lang, "auth.email")}>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </Field>
          <Field label={t(lang, "auth.password")}>
            <div className="pass-row">
              <input
                type={show ? "text" : "password"}
                required
                minLength={register ? 8 : 1}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete={register ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShow((v) => !v)}
              >
                {t(lang, show ? "auth.hide" : "auth.show")}
              </button>
            </div>
          </Field>
          {register ? (
            <Field label={t(lang, "auth.language")}>
              <select
                value={form.preferred_language}
                onChange={(e) =>
                  setForm({ ...form, preferred_language: e.target.value })
                }
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </Field>
          ) : null}
          {error ? <div className="error">{error}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy
              ? t(lang, "common.loading")
              : t(lang, register ? "auth.submitRegister" : "auth.submitLogin")}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => go(register ? "/login" : "/register")}
          >
            {t(lang, register ? "auth.toLogin" : "auth.toRegister")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ go }) {
  const { lang } = useLang();
  const { user, signedIn } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    api
      .calcHistory()
      .then((data) => {
        if (live) setRows(data);
      })
      .catch((err) => {
        if (live) setError(friendlyError(err, lang));
      });
    return () => {
      live = false;
    };
  }, [signedIn, lang]);

  const last = (type) => rows.find((row) => row.type === type);
  const lastLoan = last("loan");
  const lastCult = last("cultivation");
  const lastBiz = last("business");
  const hint = "Figures appear after you run a calculator.";

  return (
    <>
      <p className="lead">
        {signedIn
          ? t(lang, "dash.hello", {
              name: user?.email?.split("@")[0] || "there",
            })
          : t(lang, "dash.guest")}
      </p>
      <div className="stats">
        <Stat
          label={t(lang, "loan.emi")}
          value={lastLoan ? money(lastLoan.result?.monthly_emi) : "—"}
          hint={hint}
        />
        <Stat
          label={t(lang, "cu.profit")}
          value={lastCult ? money(lastCult.result?.profit) : "—"}
          hint={hint}
        />
        <Stat
          label={t(lang, "biz.after")}
          value={
            lastBiz ? money(lastBiz.result?.monthly_profit_after_emi) : "—"
          }
          hint={hint}
        />
      </div>
      <h2 style={{ marginTop: 28 }}>{t(lang, "land.tools")}</h2>
      <div className="tool-list">
        <a href="#/loan" onClick={() => go("/loan")}>
          <strong>{t(lang, "nav.loan")}</strong>
        </a>
        <a href="#/cultivation" onClick={() => go("/cultivation")}>
          <strong>{t(lang, "nav.cultivation")}</strong>
        </a>
        <a href="#/assistant" onClick={() => go("/assistant")}>
          <strong>{t(lang, "nav.assistant")}</strong>
        </a>
        <a href="#/schemes" onClick={() => go("/schemes")}>
          <strong>{t(lang, "nav.schemes")}</strong>
        </a>
      </div>
      <h2 style={{ marginTop: 28 }}>{t(lang, "dash.recent")}</h2>
      {!signedIn ? <p className="notice">{t(lang, "dash.needLogin")}</p> : null}
      {error ? <div className="error">{error}</div> : null}
      {signedIn && rows.length === 0 ? (
        <p className="muted">{t(lang, "dash.empty")}</p>
      ) : null}
      {rows.slice(0, 5).map((row) => (
        <article className="card" key={row.id} style={{ marginTop: 10 }}>
          <strong>{row.type}</strong>
          <p className="muted">{new Date(row.created_at).toLocaleString()}</p>
        </article>
      ))}
    </>
  );
}

function Assistant() {
  const { lang } = useLang();
  const { signedIn } = useAuth();
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const boxRef = useRef(null);

  const starters = {
    en: [
      "Which scheme gives loans to small businesses?",
      "What is PMFME in simple words?",
      "Can MUDRA help a mushroom unit?",
    ],
    hi: [
      "छोटे व्यवसाय के लिए कौन सी योजना ऋण देती है?",
      "PMFME क्या है, सरल भाषा में?",
      "क्या मुद्रा मशरूम इकाई में मदद कर सकती है?",
    ],
    kn: [
      "ಸಣ್ಣ ವ್ಯವಹಾರಕ್ಕೆ ಯಾವ ಯೋಜನೆ ಸಾಲ ನೀಡುತ್ತದೆ?",
      "PMFME ಎಂದರೇನು, ಸರಳವಾಗಿ?",
      "ಮುದ್ರಾ ಅಣಬೆ ಘಟಕಕ್ಕೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?",
    ],
  };

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    api
      .chatHistory()
      .then((data) => {
        if (live) {
          setItems(
            data.map((row) => ({
              role: row.role,
              text: row.content,
              mode: row.mode,
              sources: row.sources || [],
            })),
          );
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [signedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, busy]);

  const modeLabel = (mode) => {
    if (mode === "rag_gemini") return t(lang, "as.rag");
    if (mode === "retrieval_only") return t(lang, "as.excerpts");
    if (mode === "no_match") return t(lang, "as.none");
    return "";
  };

  const send = async (text) => {
    const trimmed = (text ?? message).trim();
    if (!trimmed || busy) return;
    setMessage("");
    setError("");
    setItems((prev) => [...prev, { role: "user", text: trimmed }]);
    setBusy(true);
    if (boxRef.current) boxRef.current.style.height = "44px";
    try {
      const data = await api.chat({ message: trimmed, language: lang });
      setItems((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          mode: data.mode,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setError(
        err.code === "offline"
          ? t(lang, "as.offline")
          : friendlyError(err, lang),
      );
    } finally {
      setBusy(false);
    }
  };

  const onType = (event) => {
    setMessage(event.target.value);
    const el = event.target;
    el.style.height = "44px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="chat-shell">
      <div className="chat-scroll">
        {items.length === 0 && !busy ? (
          <div className="chat-empty">
            <div className="chat-empty-icon" aria-hidden="true">
              ✦
            </div>
            <h2>{t(lang, "as.title")}</h2>
            <p className="muted">{t(lang, "as.lead")}</p>
            <div className="prompts">
              {(starters[lang] || starters.en).map((q) => (
                <button
                  key={q}
                  type="button"
                  className="prompt-btn"
                  onClick={() => send(q)}
                  disabled={busy}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat">
            {items.map((item, index) => (
              <div key={index} className={`bubble ${item.role}`}>
                {item.mode ? (
                  <div className="kicker">{modeLabel(item.mode)}</div>
                ) : null}
                {item.text}
                {item.sources?.length ? (
                  <div className="sources">
                    {item.sources.map((source) => (
                      <a
                        key={source.scheme_code + source.title}
                        href={source.official_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy ? (
              <div className="bubble assistant">
                <span className="typing" aria-label={t(lang, "common.loading")}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        )}
        {error ? <div className="error">{error}</div> : null}
      </div>
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <div className="composer-box">
          <textarea
            ref={boxRef}
            value={message}
            onChange={onType}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            maxLength={1000}
            rows={1}
            placeholder={t(lang, "as.placeholder")}
            disabled={busy}
          />
          <button
            className="send-btn"
            type="submit"
            disabled={busy || !message.trim()}
            aria-label={t(lang, "as.send")}
          >
            ↑
          </button>
        </div>
        <p className="composer-note">{t(lang, "as.verify")}</p>
      </form>
    </div>
  );
}

function Schemes() {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handle = setTimeout(async () => {
      setError("");
      try {
        const data = await api.schemes(q, lang);
        setItems(data);
        setOffline(false);
        localStorage.setItem(
          "shroomtalk_schemes",
          JSON.stringify({ lang, data }),
        );
      } catch (err) {
        if (err.code === "offline") {
          setOffline(true);
          try {
            const cached = JSON.parse(
              localStorage.getItem("shroomtalk_schemes") || "null",
            );
            if (cached?.data) setItems(cached.data);
          } catch {
            setItems([]);
          }
        } else setError(friendlyError(err, lang));
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [q, lang]);

  return (
    <>
      <Field label={t(lang, "sc.search")}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, "sc.placeholder")}
        />
      </Field>
      {offline ? <div className="banner">{t(lang, "sc.offline")}</div> : null}
      {error ? <div className="error">{error}</div> : null}
      <div className="grid-2" style={{ marginTop: 16 }}>
        {items.map((item) => (
          <article className="card" key={item.scheme_code + item.language_code}>
            <h3>{item.title}</h3>
            <p>
              <span className={item.verified ? "badge ok" : "badge"}>
                {item.verified
                  ? t(lang, "sc.verified")
                  : t(lang, "sc.unverified")}
              </span>
            </p>
            <p>{item.content}</p>
            {item.official_url ? (
              <a href={item.official_url} target="_blank" rel="noreferrer">
                {t(lang, "sc.official")}
              </a>
            ) : null}
          </article>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="muted">{t(lang, "sc.empty")}</p>
      ) : null}
      <p className="notice">{t(lang, "as.verify")}</p>
    </>
  );
}

function LoanPage() {
  const { lang } = useLang();
  const [form, setForm] = useDraft("shroomtalk_draft_loan", {
    principal: "100000",
    annual_rate_percent: "12",
    tenure_months: "12",
  });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.loan({
        principal: Number(form.principal),
        annual_rate_percent: Number(form.annual_rate_percent),
        tenure_months: Number(form.tenure_months),
      });
      setResult(data.result);
      setSaved(data.saved);
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid-2">
      <form className="card form" onSubmit={submit}>
        <Field label={t(lang, "loan.principal")}>
          <input
            type="number"
            min="1"
            required
            value={form.principal}
            onChange={(e) => setForm({ ...form, principal: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "loan.rate")}>
          <input
            type="number"
            min="0"
            max="60"
            step="0.01"
            required
            value={form.annual_rate_percent}
            onChange={(e) =>
              setForm({ ...form, annual_rate_percent: e.target.value })
            }
          />
        </Field>
        <Field label={t(lang, "loan.tenure")}>
          <input
            type="number"
            min="1"
            max="600"
            required
            value={form.tenure_months}
            onChange={(e) =>
              setForm({ ...form, tenure_months: e.target.value })
            }
          />
        </Field>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? t(lang, "common.loading") : t(lang, "loan.go")}
        </button>
      </form>
      <div className="card">
        {!result ? (
          <p className="muted">{t(lang, "loan.go")}</p>
        ) : (
          <>
            {saved ? (
              <div className="ok-msg">{t(lang, "common.saved")}</div>
            ) : null}
            <Stat
              label={t(lang, "loan.emi")}
              value={money(result.monthly_emi)}
            />
            <div className="stats" style={{ marginTop: 12 }}>
              <Stat
                label={t(lang, "loan.interest")}
                value={money(result.total_interest)}
              />
              <Stat
                label={t(lang, "loan.total")}
                value={money(result.total_payment)}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>{t(lang, "loan.year")}</th>
                  <th>{t(lang, "loan.pp")}</th>
                  <th>{t(lang, "loan.ip")}</th>
                  <th>{t(lang, "loan.bal")}</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{money(row.principal_paid)}</td>
                    <td>{money(row.interest_paid)}</td>
                    <td>{money(row.closing_balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

function CultivationPage() {
  const { lang } = useLang();
  const [form, setForm] = useDraft("shroomtalk_draft_cult", {
    number_of_bags: "100",
    substrate_cost_per_bag: "40",
    spawn_cost_per_bag: "10",
    labour_cost: "2000",
    utilities_cost: "500",
    other_costs: "500",
    expected_yield_kg_per_bag: "1",
    wastage_percent: "10",
    selling_price_per_kg: "200",
  });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.cultivation({
        number_of_bags: Number(form.number_of_bags),
        substrate_cost_per_bag: Number(form.substrate_cost_per_bag),
        spawn_cost_per_bag: Number(form.spawn_cost_per_bag),
        labour_cost: Number(form.labour_cost || 0),
        utilities_cost: Number(form.utilities_cost || 0),
        other_costs: Number(form.other_costs || 0),
        expected_yield_kg_per_bag: Number(form.expected_yield_kg_per_bag),
        wastage_percent: Number(form.wastage_percent || 0),
        selling_price_per_kg: Number(form.selling_price_per_kg),
      });
      setResult(data.result);
      setSaved(data.saved);
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid-2">
      <form className="card form" onSubmit={submit}>
        {[
          ["number_of_bags", "cu.bags"],
          ["substrate_cost_per_bag", "cu.substrate"],
          ["spawn_cost_per_bag", "cu.spawn"],
          ["labour_cost", "cu.labour"],
          ["utilities_cost", "cu.utilities"],
          ["other_costs", "cu.other"],
          ["expected_yield_kg_per_bag", "cu.yield"],
          ["wastage_percent", "cu.waste"],
          ["selling_price_per_kg", "cu.price"],
        ].map(([name, key]) => (
          <Field key={name} label={t(lang, key)}>
            <input
              type="number"
              step="any"
              required
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            />
          </Field>
        ))}
        {error ? <div className="error">{error}</div> : null}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? t(lang, "common.loading") : t(lang, "cu.go")}
        </button>
      </form>
      {result ? (
        <div className="card">
          {saved ? (
            <div className="ok-msg">{t(lang, "common.saved")}</div>
          ) : null}
          <div className="stats">
            <Stat label={t(lang, "cu.cost")} value={money(result.total_cost)} />
            <Stat label={t(lang, "cu.rev")} value={money(result.revenue)} />
            <Stat label={t(lang, "cu.profit")} value={money(result.profit)} />
          </div>
          <h3>{t(lang, "cu.sens")}</h3>
          <table>
            <thead>
              <tr>
                <th>{t(lang, "cu.change")}</th>
                <th>{t(lang, "cu.price")}</th>
                <th>{t(lang, "cu.profit")}</th>
              </tr>
            </thead>
            <tbody>
              {result.sensitivity.map((row) => (
                <tr key={row.price_change_percent}>
                  <td>{row.price_change_percent}%</td>
                  <td>{money(row.selling_price_per_kg)}</td>
                  <td>{money(row.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function BusinessPage() {
  const { lang } = useLang();
  const [form, setForm] = useDraft("shroomtalk_draft_biz", {
    monthly_revenue: "50000",
    monthly_operating_costs: "30000",
    monthly_loan_emi: "10000",
    initial_investment: "100000",
  });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.business({
        monthly_revenue: Number(form.monthly_revenue),
        monthly_operating_costs: Number(form.monthly_operating_costs),
        monthly_loan_emi: Number(form.monthly_loan_emi || 0),
        initial_investment: Number(form.initial_investment || 0),
      });
      setResult(data.result);
      setSaved(data.saved);
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid-2">
      <form className="card form" onSubmit={submit}>
        <Field label={t(lang, "biz.rev")}>
          <input
            type="number"
            min="0"
            required
            value={form.monthly_revenue}
            onChange={(e) =>
              setForm({ ...form, monthly_revenue: e.target.value })
            }
          />
        </Field>
        <Field label={t(lang, "biz.costs")}>
          <input
            type="number"
            min="0"
            required
            value={form.monthly_operating_costs}
            onChange={(e) =>
              setForm({ ...form, monthly_operating_costs: e.target.value })
            }
          />
        </Field>
        <Field label={t(lang, "biz.emi")}>
          <input
            type="number"
            min="0"
            value={form.monthly_loan_emi}
            onChange={(e) =>
              setForm({ ...form, monthly_loan_emi: e.target.value })
            }
          />
        </Field>
        <Field label={t(lang, "biz.invest")}>
          <input
            type="number"
            min="0"
            value={form.initial_investment}
            onChange={(e) =>
              setForm({ ...form, initial_investment: e.target.value })
            }
          />
        </Field>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? t(lang, "common.loading") : t(lang, "biz.go")}
        </button>
      </form>
      {result ? (
        <div className="card">
          {saved ? (
            <div className="ok-msg">{t(lang, "common.saved")}</div>
          ) : null}
          <p>{t(lang, `biz.${result.assessment}`)}</p>
          <div className="stats">
            <Stat
              label={t(lang, "biz.before")}
              value={money(result.monthly_profit_before_emi)}
            />
            <Stat
              label={t(lang, "biz.after")}
              value={money(result.monthly_profit_after_emi)}
            />
            <Stat
              label={t(lang, "biz.cover")}
              value={result.emi_coverage_ratio ?? "—"}
            />
          </div>
          <p className="notice">{t(lang, "biz.note")}</p>
        </div>
      ) : null}
    </div>
  );
}

function ProfilePage() {
  const { lang, setLang } = useLang();
  const { signedIn, signOut } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    api
      .getProfile()
      .then((data) => {
        if (live) {
          setForm({
            display_name: data.display_name || "",
            farm_name: data.farm_name || "",
            village: data.village || "",
            district: data.district || "",
            state: data.state || "",
            preferred_language: data.preferred_language || "en",
          });
        }
      })
      .catch((err) => {
        if (live) setError(friendlyError(err, lang));
      });
    return () => {
      live = false;
    };
  }, [signedIn, lang]);

  if (!signedIn) return <p className="notice">{t(lang, "dash.needLogin")}</p>;
  if (!form) return <p>{t(lang, "common.loading")}</p>;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const data = await api.saveProfile({
        display_name: form.display_name || null,
        farm_name: form.farm_name || null,
        village: form.village || null,
        district: form.district || null,
        state: form.state || null,
        preferred_language: form.preferred_language,
      });
      setLang(data.preferred_language);
      setSaved(true);
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit} style={{ maxWidth: 640 }}>
      <div className="grid-2">
        <Field label={t(lang, "auth.name")}>
          <input
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "pr.farm")}>
          <input
            value={form.farm_name}
            onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "pr.village")}>
          <input
            value={form.village}
            onChange={(e) => setForm({ ...form, village: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "pr.district")}>
          <input
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "pr.state")}>
          <input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        </Field>
        <Field label={t(lang, "auth.language")}>
          <select
            value={form.preferred_language}
            onChange={(e) =>
              setForm({ ...form, preferred_language: e.target.value })
            }
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </Field>
      </div>
      {error ? <div className="error">{error}</div> : null}
      {saved ? <div className="ok-msg">{t(lang, "pr.saved")}</div> : null}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? t(lang, "common.loading") : t(lang, "pr.save")}
      </button>
      <button type="button" className="btn btn-ghost" onClick={signOut}>
        {t(lang, "nav.signout")}
      </button>
    </form>
  );
}

function AppShell() {
  const { lang } = useLang();
  const [route, go] = useHashRoute();
  const page = route.split("?")[0] || "/";

  if (page === "/login") return <AuthPage mode="login" go={go} />;
  if (page === "/register") return <AuthPage mode="register" go={go} />;
  if (page === "/" || page === "") return <Landing go={go} />;

  const titles = {
    "/dashboard": "dash.title",
    "/assistant": "as.title",
    "/schemes": "sc.title",
    "/loan": "loan.title",
    "/cultivation": "cu.title",
    "/business": "biz.title",
    "/profile": "pr.title",
  };

  let inner = <Dashboard go={go} />;
  if (page === "/assistant") inner = <Assistant />;
  else if (page === "/schemes") inner = <Schemes />;
  else if (page === "/loan") inner = <LoanPage />;
  else if (page === "/cultivation") inner = <CultivationPage />;
  else if (page === "/business") inner = <BusinessPage />;
  else if (page === "/profile") inner = <ProfilePage />;

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <AppFrame
        route={page}
        go={go}
        title={t(lang, titles[page] || "dash.title")}
        chatMode={page === "/assistant"}
      >
        <div id="main">{inner}</div>
      </AppFrame>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </LangProvider>
  );
}
