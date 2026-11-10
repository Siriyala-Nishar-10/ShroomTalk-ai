import { useEffect, useState } from "react";
import "./App.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "assistant", label: "AI Assistant", icon: "message" },
  { id: "schemes", label: "Schemes", icon: "book" },
  { id: "loan", label: "Loan & EMI", icon: "calculator" },
  { id: "cultivation", label: "Cultivation", icon: "sprout" },
  { id: "business", label: "Business", icon: "chart" },
  { id: "reports", label: "Reports", icon: "file" },
  { id: "profile", label: "Profile", icon: "user" },
];

const SCHEMES = [
  {
    name: "PM Formalisation of Micro Food Processing Enterprises",
    category: "Food processing",
    description:
      "Explore official information and current guidelines for micro food-processing enterprises.",
    relevance:
      "May be worth exploring if you process mushrooms into food products. Check the current guidelines and availability in your area.",
    source: "Ministry of Food Processing Industries",
    url: "https://pmfme.mofpi.gov.in/",
  },
  {
    name: "Prime Minister’s Employment Generation Programme",
    category: "Enterprise",
    description:
      "Find official programme information and application guidance for establishing eligible micro-enterprises.",
    relevance:
      "Review the current rules to see whether your planned enterprise and location are covered.",
    source: "Khadi and Village Industries Commission",
    url: "https://www.kviconline.gov.in/pmegpeportal/",
  },
  {
    name: "Agriculture Infrastructure Fund",
    category: "Agriculture",
    description:
      "Read official information about financing support for eligible agriculture infrastructure projects.",
    relevance:
      "Check the official portal to see whether your proposed infrastructure and applicant type are eligible.",
    source: "Agriculture Infrastructure Fund portal",
    url: "https://agriinfra.dac.gov.in/",
  },
  {
    name: "Pradhan Mantri MUDRA Yojana",
    category: "Credit",
    description:
      "Explore official MUDRA information and guidance on approaching participating lending institutions.",
    relevance:
      "Loan terms, eligibility and approval are determined by the lender and current programme rules.",
    source: "Micro Units Development & Refinance Agency",
    url: "https://www.mudra.org.in/",
  },
  {
    name: "National Horticulture Board",
    category: "Agriculture",
    description:
      "Review current horticulture-related schemes, guidelines and notices from the National Horticulture Board.",
    relevance:
      "Check the latest official documents to confirm whether a particular activity or project is covered.",
    source: "National Horticulture Board",
    url: "https://nhb.gov.in/",
  },
];

const CHAT_WELCOME =
  "Namaste! I can help you find the right tool in this demo. Ask about planning costs, estimating an EMI, or checking scheme information. For current eligibility or financial decisions, verify details with the official source or a qualified adviser.";

function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }) {
  const glyphs = {
    mushroom: (
      <>
        <path d="M3.2 11.5a8.8 8.8 0 0 1 17.6 0H3.2Z" />
        <path d="M7.1 11.5v1.7A2.8 2.8 0 0 0 9.9 16h4.2a2.8 2.8 0 0 0 2.8-2.8v-1.7" />
        <path d="M9.2 16v2.2a1.8 1.8 0 0 0 1.8 1.8h2a1.8 1.8 0 0 0 1.8-1.8V16" />
        <path d="M9 8.5h.01M12 6.4h.01M15 8.5h.01" />
      </>
    ),
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.2-3.2A7.4 7.4 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4h.5a7.5 7.5 0 0 1 7.5 7.5Z" />
        <path d="M8.5 11.5h7M8.5 14.5h4" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
        <path d="M4 5.5v15M8 7h8M8 10h7" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 6.5h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01M16 16.5h.01" />
      </>
    ),
    sprout: (
      <>
        <path d="M12 21v-9" />
        <path d="M12 12c0-4.5 2.7-7 7-7-.1 4.7-2.6 7-7 7Z" />
        <path d="M12 15c0-3.7-2.2-5.8-6-5.8.1 4 2.3 5.8 6 5.8Z" />
        <path d="M8 21h8" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4M4 20h17" />
        <path d="m7 15 4-4 3 2 5-6" />
        <path d="M16 7h3v3" />
      </>
    ),
    file: (
      <>
        <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M14 3.5v5h5M8 13h8M8 16.5h8" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M4 12h15" />
        <path d="m13 5 7 7-7 7" />
      </>
    ),
    arrowUpRight: (
      <>
        <path d="M7 17 17 7M8 7h9v9" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4 11 13" />
        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4c-8 0-13 3.8-13 10a6 6 0 0 0 6 6c6.2 0 10-5 7-16Z" />
        <path d="M4 21c3-5 6-8 12-11" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4.5 4.5L19 7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    coins: (
      <>
        <ellipse cx="9" cy="7" rx="5" ry="2.5" />
        <path d="M4 7v4c0 1.4 2.2 2.5 5 2.5 1.2 0 2.3-.2 3.1-.6M4 11v4c0 1.4 2.2 2.5 5 2.5 1.3 0 2.5-.2 3.4-.7" />
        <ellipse cx="16" cy="15" rx="4" ry="2" />
        <path d="M12 15v3.5c0 1.1 1.8 2 4 2s4-.9 4-2V15" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    printer: (
      <>
        <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M7 14h10v7H7zM17 11h.01" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1Z" />
        <path d="M7 3v6h9V3M7 21v-8h10v8" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
        <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
        <path d="m5 15 .7 1.8L7.5 17l-1.8.7L5 19.5l-.7-1.8L2.5 17l1.8-.2L5 15Z" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    chevronDown: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),
    checkCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name] || glyphs.sparkles}
    </svg>
  );
}

function Brand({ onClick }) {
  return (
    <button
      className="brand"
      type="button"
      onClick={onClick}
      aria-label="ShroomTalk-AI home"
    >
      <span className="brand-mark">
        <Icon name="mushroom" size={25} strokeWidth={1.7} />
      </span>
      <span className="brand-copy">
        <strong>
          ShroomTalk<span>-AI</span>
        </strong>
        <small>Grow with clarity</small>
      </span>
    </button>
  );
}

function MushroomIllustration() {
  return (
    <svg className="mushroom-art" viewBox="0 0 520 440" aria-hidden="true">
      <circle cx="380" cy="90" r="50" fill="#e9d6ad" opacity=".65" />
      <circle cx="114" cy="142" r="25" fill="#c8d5bd" opacity=".72" />
      <ellipse
        cx="258"
        cy="393"
        rx="182"
        ry="18"
        fill="#294b39"
        opacity=".12"
      />
      <path
        d="M136 201c4-80 55-132 122-132s118 52 122 132H136Z"
        fill="#d2a176"
      />
      <path
        d="M136 200h244c-5 24-25 39-54 39H190c-29 0-49-15-54-39Z"
        fill="#b9785a"
      />
      <path
        d="M202 235h112v106c0 35-23 58-56 58s-56-23-56-58V235Z"
        fill="#f3e3c7"
      />
      <path
        d="M228 245v118M285 245v118"
        stroke="#dec9a8"
        strokeWidth="3"
        opacity=".7"
      />
      <circle cx="211" cy="152" r="8" fill="#f3e3c7" opacity=".9" />
      <circle cx="264" cy="112" r="10" fill="#f3e3c7" opacity=".9" />
      <circle cx="317" cy="158" r="7" fill="#f3e3c7" opacity=".9" />
      <path d="M99 354c-11-44 10-75 46-92 7 35-2 75-46 92Z" fill="#7e9c7b" />
      <path d="M105 353c13-29 25-47 40-63" stroke="#f0f1df" strokeWidth="3" />
      <path d="M417 356c12-43-8-74-43-94-9 36-1 76 43 94Z" fill="#87a47e" />
      <path d="M412 353c-11-29-23-48-38-65" stroke="#f0f1df" strokeWidth="3" />
      <path
        d="M75 337c-2-22 8-37 25-45 4 18-2 36-25 45ZM450 339c3-23-7-39-25-47-3 18 2 38 25 47Z"
        fill="#bd775b"
      />
      <circle cx="127" cy="384" r="4" fill="#bd775b" opacity=".7" />
      <circle cx="390" cy="390" r="4" fill="#bd775b" opacity=".7" />
      <circle cx="168" cy="375" r="3" fill="#8da27e" />
      <circle cx="350" cy="376" r="3" fill="#8da27e" />
    </svg>
  );
}

function LandingPage({ onLogin }) {
  const features = [
    {
      icon: "book",
      title: "Explore scheme information",
      text: "Find a starting point for researching relevant government programmes and their official sources.",
    },
    {
      icon: "calculator",
      title: "Estimate loan repayments",
      text: "Try an EMI estimate using your own loan amount, interest rate and repayment period.",
    },
    {
      icon: "sprout",
      title: "Plan a cultivation cycle",
      text: "Compare your expected production costs with your own yield and sale-price assumptions.",
    },
    {
      icon: "chart",
      title: "Review business numbers",
      text: "Look at monthly costs, contribution, estimated profit and an indicative break-even sales figure.",
    },
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="landing-header-actions">
          <button className="btn btn-quiet" type="button" onClick={onLogin}>
            Log in
          </button>
          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={onLogin}
          >
            Get started <Icon name="arrowRight" size={17} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />A planning companion for mushroom
              growers
            </p>
            <h1>
              Grow your business with <em>clearer decisions.</em>
            </h1>
            <p className="hero-description">
              ShroomTalk-AI brings practical finance and planning tools together
              for rural mushroom farming entrepreneurs—so you can explore your
              numbers one step at a time.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={onLogin}
              >
                Get started <Icon name="arrowRight" size={18} />
              </button>
              <a className="btn btn-secondary" href="#features">
                Explore the tools
              </a>
            </div>
            <div className="hero-assurance">
              <span className="assurance-icon">
                <Icon name="check" size={15} />
              </span>
              <span>Practical estimates, with assumptions you control</span>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <div className="hero-visual-card">
              <div className="visual-label">
                <span className="visual-label-icon">
                  <Icon name="leaf" size={17} />
                </span>
                <span>
                  <strong>Small steps, stronger plans</strong>
                  <small>Tools built around your growing journey</small>
                </span>
              </div>
              <MushroomIllustration />
              <div className="visual-note">
                <span className="visual-note-mark">
                  <Icon name="sparkles" size={17} />
                </span>
                <span>
                  <strong>Your experience matters.</strong>
                  <small>
                    Use your own figures to explore what may work for you.
                  </small>
                </span>
              </div>
            </div>
            <div className="floating-note floating-note-top">
              <span className="floating-note-icon sage-icon">
                <Icon name="calculator" size={18} />
              </span>
              <span>
                <strong>Plan with numbers</strong>
                <small>Clear, editable estimates</small>
              </span>
            </div>
            <div className="floating-note floating-note-bottom">
              <span className="floating-note-icon clay-icon">
                <Icon name="book" size={18} />
              </span>
              <span>
                <strong>Find a starting point</strong>
                <small>Links to official sources</small>
              </span>
            </div>
          </div>
        </section>

        <section className="landing-values" aria-label="Product principles">
          <div>
            <span className="value-icon">
              <Icon name="shield" size={19} />
            </span>
            <span>
              <strong>Transparent</strong>
              <small>Estimates are clearly labelled</small>
            </span>
          </div>
          <div>
            <span className="value-icon">
              <Icon name="sprout" size={19} />
            </span>
            <span>
              <strong>Made for growers</strong>
              <small>Focused on mushroom enterprise planning</small>
            </span>
          </div>
          <div>
            <span className="value-icon">
              <Icon name="globe" size={19} />
            </span>
            <span>
              <strong>Grounded in sources</strong>
              <small>Check official links for current rules</small>
            </span>
          </div>
        </section>

        <section className="features-section section-container" id="features">
          <div className="section-heading">
            <p className="eyebrow">A useful place to begin</p>
            <h2>Tools for your next business decision.</h2>
            <p>
              Start with an estimate, explore the options, and adjust the
              numbers to fit your own situation.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <span className={`feature-icon feature-icon-${index + 1}`}>
                  <Icon name={feature.icon} size={21} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-arrow" aria-hidden="true">
                  <Icon name="arrowUpRight" size={17} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-container how-inner">
            <div className="how-copy">
              <p className="eyebrow">A simple workflow</p>
              <h2>Start with what you know. Refine as you go.</h2>
              <p>
                You do not need perfect information to begin planning. Enter
                your best estimates, compare scenarios and update them as you
                learn more.
              </p>
              <button
                className="btn btn-primary"
                type="button"
                onClick={onLogin}
              >
                Open your workspace <Icon name="arrowRight" size={18} />
              </button>
            </div>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-number">01</span>
                <span>
                  <strong>Choose a tool</strong>
                  <small>
                    Start with a calculator, scheme listing or planning
                    question.
                  </small>
                </span>
              </div>
              <div className="step-item">
                <span className="step-number">02</span>
                <span>
                  <strong>Enter your assumptions</strong>
                  <small>
                    Use your own prices, costs, loan details and timelines.
                  </small>
                </span>
              </div>
              <div className="step-item">
                <span className="step-number">03</span>
                <span>
                  <strong>Review and verify</strong>
                  <small>
                    Treat outputs as estimates and verify official programme
                    details.
                  </small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta section-container">
          <div>
            <p className="eyebrow">Your workspace is ready when you are</p>
            <h2>Make your next plan a little clearer.</h2>
            <p>Open the demo workspace and explore the tools.</p>
          </div>
          <button className="btn btn-light" type="button" onClick={onLogin}>
            Get started <Icon name="arrowRight" size={18} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <p>
          ShroomTalk-AI · A planning prototype for mushroom farming
          entrepreneurs.
        </p>
        <small>
          Estimates are for exploration only. Verify financial and scheme
          details with official sources.
        </small>
      </footer>
    </div>
  );
}

function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(email.trim());
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <Brand onClick={onBack} />
        <button className="btn btn-quiet" type="button" onClick={onBack}>
          <Icon name="arrowRight" size={16} className="back-arrow-icon" />
          Back to home
        </button>
      </header>

      <main className="login-layout">
        <section className="login-promo">
          <span className="login-promo-badge">
            <Icon name="leaf" size={16} /> A little more clarity, step by step
          </span>
          <h1>Your planning tools, all in one place.</h1>
          <p>
            Explore finance estimates, cultivation planning and official
            programme links in the ShroomTalk-AI workspace.
          </p>
          <div className="login-promo-art">
            <MushroomIllustration />
          </div>
          <div className="login-promo-foot">
            <Icon name="shield" size={17} />
            <span>Demo workspace · No account data is sent to a server</span>
          </div>
        </section>

        <section className="login-card">
          <span className="login-card-icon">
            <Icon name="mushroom" size={25} />
          </span>
          <p className="eyebrow">Welcome to ShroomTalk-AI</p>
          <h2>Log in to your workspace</h2>
          <p className="login-card-description">
            Enter an email and password to open the frontend demo.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field" htmlFor="login-email">
              <span className="field-label">Email address</span>
              <span className="field-control">
                <span className="field-leading-icon">
                  <Icon name="mail" size={17} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="off"
                  required
                />
              </span>
            </label>

            <label className="field" htmlFor="login-password">
              <span className="field-label">Password</span>
              <span className="field-control">
                <span className="field-leading-icon">
                  <Icon name="lock" size={17} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="off"
                  minLength={6}
                  required
                />
              </span>
            </label>

            <button className="btn btn-primary login-submit" type="submit">
              Continue to workspace <Icon name="arrowRight" size={18} />
            </button>
          </form>

          <div className="login-demo-note">
            <Icon name="info" size={18} />
            <p>
              <strong>Prototype sign-in only.</strong> Any valid email and a
              password of 6 or more characters opens the demo. Credentials are
              not verified, sent to a server or saved by this app.
            </p>
          </div>
        </section>
      </main>
      <footer className="login-footer">
        ShroomTalk-AI · Prototype workspace
      </footer>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, action }) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-intro-description">{description}</p>}
      </div>
      {action && <div className="page-intro-action">{action}</div>}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "number",
  prefix,
  suffix,
  placeholder,
  help,
  min = "0",
  step = "any",
  autoComplete,
}) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span
        className={`field-control${prefix ? " has-prefix" : ""}${suffix ? " has-suffix" : ""}`}
      >
        {prefix && <span className="field-prefix">{prefix}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={type === "number" ? min : undefined}
          step={type === "number" ? step : undefined}
          autoComplete={autoComplete}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
      {help && <small className="field-help">{help}</small>}
    </label>
  );
}

function ResultTile({ label, value, note, icon, negative = false }) {
  return (
    <div className={`result-tile${negative ? " result-tile-negative" : ""}`}>
      {icon && (
        <span className="result-tile-icon">
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className="result-tile-label">{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function EmptyResult({ icon = "calculator", title, children }) {
  return (
    <div className="empty-result">
      <span className="empty-result-icon">
        <Icon name={icon} size={24} />
      </span>
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}

function DashboardPage({
  user,
  loanResult,
  cultivationResult,
  businessResult,
  onNavigate,
}) {
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const estimates = [
    {
      title: "Loan EMI estimate",
      value: loanResult ? formatMoney(loanResult.emi) : "Add loan details",
      note: loanResult
        ? "Estimated monthly payment"
        : "Open the calculator to begin",
      icon: "calculator",
      page: "loan",
    },
    {
      title: "Cultivation profit",
      value: cultivationResult
        ? formatMoney(cultivationResult.profit)
        : "Add cycle details",
      note: cultivationResult
        ? "Estimated for one cycle"
        : "Use your own assumptions",
      icon: "sprout",
      page: "cultivation",
    },
    {
      title: "Monthly business profit",
      value: businessResult
        ? formatMoney(businessResult.monthlyProfit)
        : "Add business details",
      note: businessResult
        ? "Estimate based on your inputs"
        : "Enter monthly figures to begin",
      icon: "chart",
      page: "business",
      negative: businessResult ? businessResult.monthlyProfit < 0 : false,
    },
  ];

  const tools = [
    {
      id: "assistant",
      icon: "message",
      title: "Ask the assistant",
      text: "Get help finding a tool or thinking through a planning question.",
    },
    {
      id: "schemes",
      icon: "book",
      title: "Explore schemes",
      text: "Browse programme information and links to official sources.",
    },
    {
      id: "loan",
      icon: "calculator",
      title: "Estimate an EMI",
      text: "Explore a monthly repayment estimate using your loan assumptions.",
    },
    {
      id: "cultivation",
      icon: "sprout",
      title: "Plan a cultivation cycle",
      text: "Compare estimated revenue and costs for a growing cycle.",
    },
    {
      id: "business",
      icon: "chart",
      title: "Review business numbers",
      text: "Explore profit, return and an indicative break-even sales figure.",
    },
    {
      id: "reports",
      icon: "file",
      title: "Prepare a report",
      text: "Review your current estimates and print a simple summary.",
    },
  ];

  return (
    <>
      <section className="welcome-panel">
        <div className="welcome-copy">
          <p className="welcome-eyebrow">
            <Icon name="leaf" size={16} /> YOUR GROWING JOURNEY, ONE STEP AT A
            TIME
          </p>
          <h1>Welcome, {firstName}.</h1>
          <p>
            Use your own figures to explore cultivation costs, repayment
            estimates and business plans.
          </p>
          <button
            className="btn btn-light"
            type="button"
            onClick={() => onNavigate("cultivation")}
          >
            Plan a cultivation cycle <Icon name="arrowRight" size={18} />
          </button>
        </div>
        <div className="welcome-art">
          <MushroomIllustration />
          <span className="welcome-art-caption">
            <Icon name="sparkles" size={15} /> Built for practical planning
          </span>
        </div>
      </section>

      <section className="dashboard-estimates">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h2>Current estimates</h2>
          </div>
          <p className="quiet-note">
            These figures use only the inputs you enter.
          </p>
        </div>
        <div className="estimate-grid">
          {estimates.map((item) => (
            <button
              className={`estimate-card${item.negative ? " estimate-negative" : ""}`}
              type="button"
              key={item.title}
              onClick={() => onNavigate(item.page)}
            >
              <span className="estimate-card-icon">
                <Icon name={item.icon} size={19} />
              </span>
              <span className="estimate-card-label">{item.title}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
              <span className="estimate-card-arrow">
                <Icon name="arrowUpRight" size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-tools">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Explore the toolkit</p>
            <h2>What would you like to work on?</h2>
          </div>
        </div>
        <div className="quick-tool-grid">
          {tools.map((tool) => (
            <button
              className="quick-tool-card"
              type="button"
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
            >
              <span className="quick-tool-icon">
                <Icon name={tool.icon} size={20} />
              </span>
              <strong>{tool.title}</strong>
              <span>{tool.text}</span>
              <span className="quick-tool-link">
                Open tool <Icon name="arrowRight" size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <aside className="dashboard-notice">
        <span className="notice-icon">
          <Icon name="shield" size={19} />
        </span>
        <p>
          <strong>A note on estimates</strong>
          <span>
            Calculators provide illustrative results, not financial advice.
            Programme rules and availability can change, so confirm details
            through the relevant official source.
          </span>
        </p>
        <button
          className="text-link"
          type="button"
          onClick={() => onNavigate("schemes")}
        >
          View scheme sources <Icon name="arrowRight" size={15} />
        </button>
      </aside>
    </>
  );
}

function getDemoReply(question) {
  const lower = question.toLowerCase();

  if (
    lower.includes("emi") ||
    lower.includes("loan") ||
    lower.includes("repay")
  ) {
    return "To explore repayments, open Loan & EMI and enter the amount, annual interest rate and term you want to compare. The result is only an estimate; a lender can confirm the actual rate, fees and repayment schedule.";
  }

  if (
    lower.includes("scheme") ||
    lower.includes("government") ||
    lower.includes("subsidy")
  ) {
    return "Open Government Schemes to browse a few starting points and official links. Eligibility, application windows and benefits can change, so check the latest official guidelines and speak with the relevant department before applying.";
  }

  if (
    lower.includes("cultivat") ||
    lower.includes("cost") ||
    lower.includes("yield") ||
    lower.includes("profit")
  ) {
    return "The Cultivation Calculator can compare your bag count, expected saleable yield, selling price and costs for one cycle. Try a cautious estimate and a second scenario, then compare the results with your own records.";
  }

  if (
    lower.includes("business") ||
    lower.includes("break-even") ||
    lower.includes("break even") ||
    lower.includes("roi")
  ) {
    return "Use Business Analysis to enter monthly revenue, variable costs, fixed costs and setup investment. The break-even sales figure depends on the contribution margin you enter, so treat it as an indicative planning estimate.";
  }

  return "I can point you to the scheme directory, loan calculator, cultivation planner or business analysis. This is a sample assistant in the frontend demo—not a live AI service—and it does not review your records or provide verified financial advice.";
}

function AssistantPage({ messages, chatInput, setChatInput, onSend }) {
  const prompts = [
    "How do I estimate an EMI?",
    "Where can I check scheme information?",
    "What costs should I include in a cultivation cycle?",
  ];

  return (
    <>
      <PageIntro
        eyebrow="Planning companion"
        title="AI Assistant"
        description="Ask a planning question or use a suggested prompt to find the right tool."
      />

      <div className="chat-layout">
        <aside className="chat-context-card">
          <span className="chat-context-icon">
            <Icon name="sparkles" size={22} />
          </span>
          <p className="eyebrow">A helpful starting point</p>
          <h2>Explore your next question.</h2>
          <p>
            This demo assistant can guide you around the interface and offer
            general planning prompts.
          </p>
          <div className="chat-context-divider" />
          <div className="chat-capability">
            <Icon name="checkCircle" size={17} />
            <span>Find the right calculator</span>
          </div>
          <div className="chat-capability">
            <Icon name="checkCircle" size={17} />
            <span>Navigate scheme information</span>
          </div>
          <div className="chat-capability">
            <Icon name="checkCircle" size={17} />
            <span>Think through planning inputs</span>
          </div>
          <div className="chat-warning">
            <Icon name="info" size={17} />
            <p>
              Sample responses only. No live AI, retrieval system or personal
              records are connected.
            </p>
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-panel-header">
            <span className="chat-bot-avatar">
              <Icon name="mushroom" size={21} />
            </span>
            <span>
              <strong>ShroomTalk-AI assistant</strong>
              <small>
                <span className="status-dot" /> Demo mode
              </small>
            </span>
            <span className="demo-pill">SAMPLE RESPONSES</span>
          </div>

          <div className="chat-message-list" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`chat-message-row ${message.role === "user" ? "is-user" : "is-assistant"}`}
                key={`${message.role}-${index}`}
              >
                {message.role !== "user" && (
                  <span className="message-avatar">
                    <Icon name="mushroom" size={17} />
                  </span>
                )}
                <div className="chat-message-content">
                  <span className="message-sender">
                    {message.role === "user" ? "You" : "ShroomTalk-AI"}
                  </span>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-prompt-area">
            <p className="suggestions-label">Try asking</p>
            <div className="chat-suggestions">
              {prompts.map((prompt) => (
                <button
                  type="button"
                  className="suggestion-chip"
                  key={prompt}
                  onClick={() => onSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault();
              onSend(chatInput);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Ask a planning question
            </label>
            <textarea
              id="chat-input"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend(chatInput);
                }
              }}
              placeholder="Type your question..."
              rows={2}
            />
            <button
              className="btn btn-primary chat-send"
              type="submit"
              disabled={!chatInput.trim()}
            >
              Send <Icon name="arrowRight" size={17} />
            </button>
          </form>
          <p className="chat-footnote">
            Demo responses may be incomplete. Verify financial and scheme
            information independently.
          </p>
        </section>
      </div>
    </>
  );
}

function SchemesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = [
    "All",
    "Food processing",
    "Enterprise",
    "Agriculture",
    "Credit",
  ];

  const visibleSchemes = SCHEMES.filter((scheme) => {
    const matchesFilter =
      activeFilter === "All" || scheme.category === activeFilter;
    const searchText =
      `${scheme.name} ${scheme.category} ${scheme.description} ${scheme.source}`.toLowerCase();
    return matchesFilter && searchText.includes(search.toLowerCase().trim());
  });

  return (
    <>
      <PageIntro
        eyebrow="Explore official sources"
        title="Government schemes"
        description="A starting-point directory for researching programmes that may be relevant to a growing or food-processing enterprise."
      />

      <div className="scheme-notice">
        <span className="notice-icon">
          <Icon name="info" size={18} />
        </span>
        <p>
          <strong>Please verify before applying.</strong> This directory does
          not determine eligibility. Current terms, coverage and application
          windows may change; confirm them through the linked official source.
        </p>
      </div>

      <div className="scheme-toolbar">
        <label className="scheme-search" htmlFor="scheme-search">
          <Icon name="search" size={19} />
          <input
            id="scheme-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search schemes or topics..."
          />
        </label>
        <div className="scheme-filter-row" aria-label="Filter schemes">
          {filters.map((filter) => (
            <button
              type="button"
              className={`filter-chip${activeFilter === filter ? " is-active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {visibleSchemes.length > 0 ? (
        <div className="scheme-grid">
          {visibleSchemes.map((scheme) => (
            <article className="scheme-card" key={scheme.name}>
              <div className="scheme-card-top">
                <span className="scheme-card-icon">
                  <Icon name="book" size={20} />
                </span>
                <span className="scheme-category">{scheme.category}</span>
              </div>
              <h2>{scheme.name}</h2>
              <p className="scheme-description">{scheme.description}</p>
              <div className="scheme-relevance">
                <span className="scheme-relevance-label">Why explore it?</span>
                <p>{scheme.relevance}</p>
              </div>
              <div className="scheme-card-footer">
                <span className="scheme-source">{scheme.source}</span>
                <a
                  href={scheme.url}
                  target="_blank"
                  rel="noreferrer"
                  className="official-link"
                >
                  Official source <Icon name="external" size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <span className="empty-result-icon">
            <Icon name="search" size={24} />
          </span>
          <h2>No matching schemes found</h2>
          <p>Try another search term or choose a different category.</p>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setSearch("");
              setActiveFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

function LoanCalculatorPage({ values, setValues, result }) {
  function update(key) {
    return (event) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };
  }

  return (
    <>
      <PageIntro
        eyebrow="Finance calculator"
        title="Loan & EMI calculator"
        description="Estimate a monthly repayment using the loan assumptions you enter."
      />

      <div className="calculator-layout">
        <section className="panel calculator-input-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Your loan assumptions</p>
              <h2>Enter the loan details</h2>
            </div>
            <span className="panel-heading-icon">
              <Icon name="coins" size={21} />
            </span>
          </div>

          <div className="field-grid">
            <Field
              id="loan-principal"
              label="Loan amount"
              value={values.principal}
              onChange={update("principal")}
              prefix="₹"
              placeholder="e.g. 250000"
              help="Enter the amount you plan to borrow."
              step="1000"
            />
            <Field
              id="loan-rate"
              label="Annual interest rate"
              value={values.rate}
              onChange={update("rate")}
              suffix="%"
              placeholder="e.g. 10.5"
              help="Use the annual rate provided by your lender."
              step="0.1"
            />
            <Field
              id="loan-term"
              label="Loan term"
              value={values.years}
              onChange={update("years")}
              suffix="years"
              placeholder="e.g. 3"
              help="Enter the repayment period in years."
              step="1"
            />
          </div>

          <div className="input-note">
            <Icon name="info" size={17} />
            <p>
              This estimate does not include fees, insurance, changing rates or
              lender-specific terms.
            </p>
          </div>
        </section>

        <section className="results-panel" aria-live="polite">
          <div className="results-panel-heading">
            <span className="results-panel-icon">
              <Icon name="chart" size={20} />
            </span>
            <span>
              <small>YOUR ESTIMATE</small>
              <strong>Repayment overview</strong>
            </span>
          </div>

          {result ? (
            <>
              <div className="primary-result">
                <span>Estimated monthly instalment</span>
                <strong>{formatMoney(result.emi)}</strong>
                <small>
                  for approximately {result.months} monthly payments
                </small>
              </div>
              <div className="result-tile-grid">
                <ResultTile
                  label="Total repayment"
                  value={formatMoney(result.totalPayment)}
                  icon="coins"
                />
                <ResultTile
                  label="Estimated interest"
                  value={formatMoney(result.totalInterest)}
                  icon="chart"
                />
              </div>
              <div className="breakdown-block">
                <div className="breakdown-title-row">
                  <strong>Repayment breakdown</strong>
                  <span>Estimate</span>
                </div>
                <div
                  className="breakdown-bar"
                  aria-label="Principal and interest breakdown"
                >
                  <span
                    className="breakdown-principal"
                    style={{
                      width: `${Math.max(0, Math.min(100, (result.principal / result.totalPayment) * 100))}%`,
                    }}
                  />
                  <span className="breakdown-interest" />
                </div>
                <div className="breakdown-legend">
                  <span>
                    <i className="legend-dot principal-dot" /> Principal{" "}
                    {formatMoney(result.principal)}
                  </span>
                  <span>
                    <i className="legend-dot interest-dot" /> Interest{" "}
                    {formatMoney(result.totalInterest)}
                  </span>
                </div>
              </div>
              <p className="results-disclaimer">
                Illustrative estimate only. Ask a lender for an official
                repayment schedule.
              </p>
            </>
          ) : (
            <EmptyResult
              icon="calculator"
              title="Your estimate will appear here"
            >
              Enter a loan amount, annual interest rate and term to see an
              indicative monthly repayment.
            </EmptyResult>
          )}
        </section>
      </div>
    </>
  );
}

function CultivationCalculatorPage({ values, setValues, result }) {
  function update(key) {
    return (event) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };
  }

  return (
    <>
      <PageIntro
        eyebrow="Production planning"
        title="Cultivation calculator"
        description="Explore the estimated revenue and costs for one cultivation cycle using your own assumptions."
      />

      <div className="calculator-layout">
        <section className="panel calculator-input-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">One growing cycle</p>
              <h2>Enter your production details</h2>
            </div>
            <span className="panel-heading-icon">
              <Icon name="sprout" size={21} />
            </span>
          </div>

          <div className="field-grid">
            <Field
              id="grow-bags"
              label="Number of grow bags"
              value={values.bags}
              onChange={update("bags")}
              placeholder="e.g. 100"
              help="The number of bags in this cycle."
              step="1"
            />
            <Field
              id="yield-per-bag"
              label="Saleable yield per bag"
              value={values.yieldPerBag}
              onChange={update("yieldPerBag")}
              suffix="kg"
              placeholder="e.g. 0.8"
              help="Your estimated saleable yield per bag."
              step="0.1"
            />
            <Field
              id="selling-price"
              label="Expected selling price"
              value={values.sellingPrice}
              onChange={update("sellingPrice")}
              prefix="₹"
              suffix="/ kg"
              placeholder="e.g. 180"
              help="Use your expected price per kilogram."
              step="1"
            />
            <Field
              id="cost-per-bag"
              label="Production cost per bag"
              value={values.costPerBag}
              onChange={update("costPerBag")}
              prefix="₹"
              placeholder="e.g. 45"
              help="Include the costs you associate with each bag."
              step="1"
            />
            <Field
              id="other-cycle-costs"
              label="Other cycle expenses"
              value={values.otherCosts}
              onChange={update("otherCosts")}
              prefix="₹"
              placeholder="e.g. 5000"
              help="Optional: labour, transport, utilities or other costs."
              step="100"
            />
          </div>

          <div className="input-note">
            <Icon name="info" size={17} />
            <p>
              Results depend on your inputs. Actual yield, selling price and
              costs can vary by location and cycle.
            </p>
          </div>
        </section>

        <section className="results-panel" aria-live="polite">
          <div className="results-panel-heading">
            <span className="results-panel-icon">
              <Icon name="sprout" size={20} />
            </span>
            <span>
              <small>ONE-CYCLE ESTIMATE</small>
              <strong>Cultivation overview</strong>
            </span>
          </div>

          {result ? (
            <>
              <div
                className={`primary-result${result.profit < 0 ? " primary-result-negative" : ""}`}
              >
                <span>Estimated net result</span>
                <strong>{formatMoney(result.profit)}</strong>
                <small>
                  {formatNumber(result.totalYield)} kg estimated saleable yield
                </small>
              </div>
              <div className="result-tile-grid">
                <ResultTile
                  label="Estimated revenue"
                  value={formatMoney(result.revenue)}
                  icon="coins"
                />
                <ResultTile
                  label="Estimated cycle costs"
                  value={formatMoney(result.totalCosts)}
                  icon="chart"
                />
                <ResultTile
                  label="Estimated margin"
                  value={formatPercent(result.margin)}
                  icon="checkCircle"
                  negative={result.margin < 0}
                />
              </div>
              <p className="results-disclaimer">
                This is a planning estimate for one cycle, not a guarantee of
                yield, sales or profit.
              </p>
            </>
          ) : (
            <EmptyResult
              icon="sprout"
              title="Your cycle estimate will appear here"
            >
              Enter the number of bags, saleable yield and selling price. Add
              your cost assumptions to compare revenue and costs.
            </EmptyResult>
          )}
        </section>
      </div>
    </>
  );
}

function BusinessAnalysisPage({ values, setValues, result }) {
  function update(key) {
    return (event) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };
  }

  return (
    <>
      <PageIntro
        eyebrow="Monthly business planning"
        title="Business analysis"
        description="Explore how revenue, variable costs, fixed costs and setup investment affect your estimates."
      />

      <div className="calculator-layout">
        <section className="panel calculator-input-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Your monthly figures</p>
              <h2>Enter business assumptions</h2>
            </div>
            <span className="panel-heading-icon">
              <Icon name="briefcase" size={21} />
            </span>
          </div>

          <div className="field-grid">
            <Field
              id="monthly-revenue"
              label="Monthly sales revenue"
              value={values.revenue}
              onChange={update("revenue")}
              prefix="₹"
              placeholder="e.g. 60000"
              help="Estimated monthly sales before expenses."
              step="1000"
            />
            <Field
              id="monthly-variable-costs"
              label="Monthly variable costs"
              value={values.variableCosts}
              onChange={update("variableCosts")}
              prefix="₹"
              placeholder="e.g. 22000"
              help="Costs that change with production or sales."
              step="1000"
            />
            <Field
              id="monthly-fixed-costs"
              label="Monthly fixed costs"
              value={values.fixedCosts}
              onChange={update("fixedCosts")}
              prefix="₹"
              placeholder="e.g. 12000"
              help="Regular operating costs you include in your estimate."
              step="1000"
            />
            <Field
              id="setup-investment"
              label="Initial setup investment"
              value={values.investment}
              onChange={update("investment")}
              prefix="₹"
              placeholder="e.g. 150000"
              help="Used for a simple annualised return estimate."
              step="1000"
            />
          </div>

          <div className="input-note">
            <Icon name="info" size={17} />
            <p>
              Keep your categories consistent and avoid counting the same cost
              in both variable and fixed expenses.
            </p>
          </div>
        </section>

        <section className="results-panel" aria-live="polite">
          <div className="results-panel-heading">
            <span className="results-panel-icon">
              <Icon name="chart" size={20} />
            </span>
            <span>
              <small>BASED ON YOUR MONTHLY INPUTS</small>
              <strong>Business overview</strong>
            </span>
          </div>

          {result ? (
            <>
              <div
                className={`primary-result${result.monthlyProfit < 0 ? " primary-result-negative" : ""}`}
              >
                <span>Estimated monthly profit</span>
                <strong>{formatMoney(result.monthlyProfit)}</strong>
                <small>Revenue minus variable and fixed costs</small>
              </div>
              <div className="result-tile-grid">
                <ResultTile
                  label="Indicative break-even sales"
                  value={
                    result.breakEvenRevenue === null
                      ? "Not estimated"
                      : formatMoney(result.breakEvenRevenue)
                  }
                  icon="chart"
                  note="Based on your current contribution margin"
                />
                <ResultTile
                  label="Simple annualised ROI"
                  value={
                    result.annualizedROI === null
                      ? "Add setup investment"
                      : formatPercent(result.annualizedROI)
                  }
                  icon="coins"
                  note="Assumes the monthly estimate stays constant"
                  negative={
                    result.annualizedROI !== null && result.annualizedROI < 0
                  }
                />
                <ResultTile
                  label="Estimated payback time"
                  value={
                    result.paybackMonths === null
                      ? "Not estimated"
                      : `${formatNumber(result.paybackMonths)} months`
                  }
                  icon="clock"
                  note={
                    result.paybackMonths === null
                      ? "Requires positive monthly profit and investment"
                      : "Simple estimate"
                  }
                />
              </div>
              <p className="results-disclaimer">
                Indicative planning estimates only. Break-even sales use your
                entered costs and contribution margin; actual results can
                differ.
              </p>
            </>
          ) : (
            <EmptyResult
              icon="chart"
              title="Your business estimate will appear here"
            >
              Enter monthly revenue and costs. Add your setup investment to
              explore the simple annualised return and payback estimates.
            </EmptyResult>
          )}
        </section>
      </div>
    </>
  );
}

function ReportsPage({ loanResult, cultivationResult, businessResult }) {
  const generatedOn = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(new Date());
  const rows = [
    ["Loan EMI", loanResult ? formatMoney(loanResult.emi) : "Not calculated"],
    [
      "Cultivation cycle result",
      cultivationResult
        ? formatMoney(cultivationResult.profit)
        : "Not calculated",
    ],
    [
      "Monthly business profit",
      businessResult
        ? formatMoney(businessResult.monthlyProfit)
        : "Not calculated",
    ],
    [
      "Indicative business break-even sales",
      businessResult && businessResult.breakEvenRevenue !== null
        ? formatMoney(businessResult.breakEvenRevenue)
        : "Not calculated",
    ],
  ];

  return (
    <>
      <PageIntro
        eyebrow="A snapshot of your workspace"
        title="Reports"
        description="Review your current frontend estimates and print a simple summary for your own reference."
        action={
          <button
            className="btn btn-primary no-print"
            type="button"
            onClick={() => window.print()}
          >
            <Icon name="printer" size={17} /> Print report
          </button>
        }
      />

      <section className="report-print-area">
        <div className="report-cover">
          <div>
            <span className="report-brand-mark">
              <Icon name="mushroom" size={24} />
            </span>
            <p className="eyebrow">ShroomTalk-AI · Planning summary</p>
            <h2>Your estimates at a glance</h2>
            <p>Generated on {generatedOn}</p>
          </div>
          <div className="report-cover-stamp">
            <Icon name="file" size={28} />
            <span>
              PERSONAL
              <br />
              WORKING COPY
            </span>
          </div>
        </div>

        <div className="report-summary-note">
          <Icon name="info" size={18} />
          <p>
            This report contains frontend estimates based on the values entered
            in this browser session. It is not financial advice or an official
            application document.
          </p>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th scope="col">Estimate</th>
                <th scope="col">Current result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="report-detail-grid">
          <article className="report-detail-card">
            <span className="report-detail-icon">
              <Icon name="calculator" size={19} />
            </span>
            <div>
              <p className="eyebrow">Loan calculator</p>
              <h3>
                {loanResult
                  ? formatMoney(loanResult.totalPayment)
                  : "No estimate entered"}
              </h3>
              <p>
                {loanResult
                  ? `Estimated total repayment across ${loanResult.months} payments.`
                  : "Enter loan details to create a repayment estimate."}
              </p>
            </div>
          </article>
          <article className="report-detail-card">
            <span className="report-detail-icon">
              <Icon name="sprout" size={19} />
            </span>
            <div>
              <p className="eyebrow">Cultivation calculator</p>
              <h3>
                {cultivationResult
                  ? formatMoney(cultivationResult.revenue)
                  : "No estimate entered"}
              </h3>
              <p>
                {cultivationResult
                  ? `Estimated one-cycle revenue from ${formatNumber(cultivationResult.totalYield)} kg of saleable yield.`
                  : "Enter your cycle assumptions to estimate revenue and costs."}
              </p>
            </div>
          </article>
          <article className="report-detail-card">
            <span className="report-detail-icon">
              <Icon name="chart" size={19} />
            </span>
            <div>
              <p className="eyebrow">Business analysis</p>
              <h3>
                {businessResult
                  ? formatMoney(businessResult.monthlyProfit)
                  : "No estimate entered"}
              </h3>
              <p>
                {businessResult
                  ? "Estimated monthly profit using the figures entered."
                  : "Enter monthly revenue and costs to create a business estimate."}
              </p>
            </div>
          </article>
        </div>

        <div className="report-footer-note">
          <Icon name="shield" size={17} />
          <p>
            Verify all finance assumptions and scheme information through
            relevant official sources before making a decision.
          </p>
        </div>
      </section>
    </>
  );
}

function ProfilePage({ profile, onSave }) {
  const [form, setForm] = useState(() => ({ ...profile }));

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <>
      <PageIntro
        eyebrow="Your workspace details"
        title="My profile"
        description="Update the details shown in this prototype workspace."
      />

      <div className="profile-layout">
        <section className="panel profile-form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Personal details</p>
              <h2>About you</h2>
            </div>
            <span className="panel-heading-icon">
              <Icon name="user" size={21} />
            </span>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <Field
                id="profile-name"
                label="Name"
                type="text"
                value={form.name || ""}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                id="profile-email"
                label="Email address"
                type="email"
                value={form.email || ""}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Field
                id="profile-location"
                label="Location"
                type="text"
                value={form.location || ""}
                onChange={(event) => update("location", event.target.value)}
                placeholder="Town, district or state"
                autoComplete="address-level2"
              />
              <label className="field" htmlFor="profile-language">
                <span className="field-label">Preferred language</span>
                <span className="field-control select-control">
                  <select
                    id="profile-language"
                    value={form.language || "English"}
                    onChange={(event) => update("language", event.target.value)}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>Other</option>
                  </select>
                  <Icon name="chevronDown" size={17} />
                </span>
              </label>
              <label className="field" htmlFor="profile-stage">
                <span className="field-label">Business stage</span>
                <span className="field-control select-control">
                  <select
                    id="profile-stage"
                    value={form.stage || "Exploring"}
                    onChange={(event) => update("stage", event.target.value)}
                  >
                    <option>Exploring</option>
                    <option>Planning</option>
                    <option>Starting out</option>
                    <option>Growing an existing business</option>
                  </select>
                  <Icon name="chevronDown" size={17} />
                </span>
              </label>
            </div>

            <div className="profile-form-footer">
              <span>
                <Icon name="info" size={16} /> Details are held in this browser
                session only.
              </span>
              <button className="btn btn-primary" type="submit">
                <Icon name="save" size={17} /> Save changes
              </button>
            </div>
          </form>
        </section>

        <aside className="profile-side-card">
          <span className="profile-side-icon">
            <Icon name="shield" size={23} />
          </span>
          <p className="eyebrow">Prototype privacy note</p>
          <h2>Your details are not connected to an account service.</h2>
          <p>
            Profile changes remain in React state while this page is open. This
            prototype does not save them to a database or authenticate a user
            with a backend.
          </p>
          <div className="profile-side-divider" />
          <div className="profile-side-row">
            <Icon name="checkCircle" size={17} />
            <span>No backend profile API is connected</span>
          </div>
          <div className="profile-side-row">
            <Icon name="checkCircle" size={17} />
            <span>Refresh the page to reset this demo state</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function Workspace({ activePage, onNavigate, user, onSignOut, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (user?.name || "Grower")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function navigate(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  return (
    <div className="workspace-shell">
      <header className="workspace-header no-print">
        <div className="workspace-header-inner">
          <Brand onClick={() => navigate("dashboard")} />

          <nav className="desktop-nav" aria-label="Workspace navigation">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`nav-item${activePage === item.id ? " is-active" : ""}`}
                onClick={() => navigate(item.id)}
                aria-current={activePage === item.id ? "page" : undefined}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="workspace-header-actions">
            <button
              type="button"
              className="account-button"
              onClick={() => navigate("profile")}
              aria-label="Open profile"
            >
              <span className="account-avatar">{initials}</span>
              <span className="account-label">
                <strong>{user?.name || "Grower"}</strong>
                <small>Workspace</small>
              </span>
            </button>
            <button
              className="signout-button"
              type="button"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </div>

          <button
            className="mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-workspace-menu"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            <Icon name={menuOpen ? "close" : "menu"} size={21} />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu-panel" id="mobile-workspace-menu">
            <nav aria-label="Mobile workspace navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`mobile-nav-item${activePage === item.id ? " is-active" : ""}`}
                  onClick={() => navigate(item.id)}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                  {activePage === item.id && <Icon name="check" size={16} />}
                </button>
              ))}
            </nav>
            <div className="mobile-menu-account">
              <span className="account-avatar">{initials}</span>
              <span>{user?.name || "Grower"}</span>
              <button type="button" onClick={onSignOut}>
                <Icon name="logout" size={17} /> Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="workspace-main">
        <div className="page-container">{children}</div>
      </main>

      <footer className="workspace-footer no-print">
        <span>© {new Date().getFullYear()} ShroomTalk-AI</span>
        <span>Planning estimates are for exploration only.</span>
        <button type="button" onClick={() => onNavigate("schemes")}>
          Check official sources <Icon name="arrowUpRight" size={14} />
        </button>
      </footer>
    </div>
  );
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(
    value,
  );
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(1)}%`;
}

function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function calculateLoan(values) {
  const principal = toNumber(values.principal);
  const annualRate = toNumber(values.rate);
  const termYears = toNumber(values.years);

  if (principal <= 0 || annualRate < 0 || termYears <= 0) return null;

  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRate / 1200;
  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);

  if (!Number.isFinite(emi)) return null;

  const totalPayment = emi * months;
  return {
    principal,
    months,
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

function calculateCultivation(values) {
  const bags = toNumber(values.bags);
  const yieldPerBag = toNumber(values.yieldPerBag);
  const sellingPrice = toNumber(values.sellingPrice);
  const costPerBag = toNumber(values.costPerBag);
  const otherCosts = toNumber(values.otherCosts);

  if (
    bags <= 0 ||
    yieldPerBag <= 0 ||
    sellingPrice <= 0 ||
    costPerBag < 0 ||
    otherCosts < 0
  ) {
    return null;
  }

  const totalYield = bags * yieldPerBag;
  const revenue = totalYield * sellingPrice;
  const totalCosts = bags * costPerBag + otherCosts;
  const profit = revenue - totalCosts;

  return {
    totalYield,
    revenue,
    totalCosts,
    profit,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
  };
}

function calculateBusiness(values) {
  const revenue = toNumber(values.revenue);
  const variableCosts = toNumber(values.variableCosts);
  const fixedCosts = toNumber(values.fixedCosts);
  const investment = toNumber(values.investment);

  if (revenue <= 0 || variableCosts < 0 || fixedCosts < 0 || investment < 0) {
    return null;
  }

  const contribution = revenue - variableCosts;
  const contributionMargin = revenue > 0 ? contribution / revenue : 0;
  const monthlyProfit = contribution - fixedCosts;
  const breakEvenRevenue =
    contributionMargin > 0 ? fixedCosts / contributionMargin : null;
  const annualizedROI =
    investment > 0 ? (monthlyProfit * 12 * 100) / investment : null;
  const paybackMonths =
    investment > 0 && monthlyProfit > 0 ? investment / monthlyProfit : null;

  return {
    revenue,
    variableCosts,
    fixedCosts,
    investment,
    contributionMargin,
    monthlyProfit,
    breakEvenRevenue,
    annualizedROI,
    paybackMonths,
  };
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    language: "English",
    stage: "Exploring",
  });
  const [toast, setToast] = useState("");

  const [loanInputs, setLoanInputs] = useState({
    principal: "",
    rate: "",
    years: "",
  });
  const [cultivationInputs, setCultivationInputs] = useState({
    bags: "",
    yieldPerBag: "",
    sellingPrice: "",
    costPerBag: "",
    otherCosts: "",
  });
  const [businessInputs, setBusinessInputs] = useState({
    revenue: "",
    variableCosts: "",
    fixedCosts: "",
    investment: "",
  });
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: CHAT_WELCOME },
  ]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loanResult = calculateLoan(loanInputs);
  const cultivationResult = calculateCultivation(cultivationInputs);
  const businessResult = calculateBusiness(businessInputs);

  function handleLogin(email) {
    const localPart = email.split("@")[0] || "Grower";
    const guessedName = localPart
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const nextUser = { name: guessedName || "Grower", email };

    setUser(nextUser);
    setProfile((current) => ({
      ...current,
      name: current.name || nextUser.name,
      email,
    }));
    setActivePage("dashboard");
    setScreen("workspace");
  }

  function handleSignOut() {
    setUser(null);
    setActivePage("dashboard");
    setScreen("landing");
  }

  function handleSendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: getDemoReply(trimmed) },
    ]);
    setChatInput("");
  }

  function handleProfileSave(nextProfile) {
    setProfile(nextProfile);
    setUser((current) =>
      current
        ? {
            ...current,
            name: nextProfile.name || current.name,
            email: nextProfile.email || current.email,
          }
        : current,
    );
    setToast("Profile updated for this session.");
  }

  if (screen === "landing") {
    return <LandingPage onLogin={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return (
      <LoginPage onBack={() => setScreen("landing")} onLogin={handleLogin} />
    );
  }

  let pageContent;

  switch (activePage) {
    case "assistant":
      pageContent = (
        <AssistantPage
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSend={handleSendMessage}
        />
      );
      break;
    case "schemes":
      pageContent = <SchemesPage />;
      break;
    case "loan":
      pageContent = (
        <LoanCalculatorPage
          values={loanInputs}
          setValues={setLoanInputs}
          result={loanResult}
        />
      );
      break;
    case "cultivation":
      pageContent = (
        <CultivationCalculatorPage
          values={cultivationInputs}
          setValues={setCultivationInputs}
          result={cultivationResult}
        />
      );
      break;
    case "business":
      pageContent = (
        <BusinessAnalysisPage
          values={businessInputs}
          setValues={setBusinessInputs}
          result={businessResult}
        />
      );
      break;
    case "reports":
      pageContent = (
        <ReportsPage
          loanResult={loanResult}
          cultivationResult={cultivationResult}
          businessResult={businessResult}
        />
      );
      break;
    case "profile":
      pageContent = (
        <ProfilePage profile={profile} onSave={handleProfileSave} />
      );
      break;
    case "dashboard":
    default:
      pageContent = (
        <DashboardPage
          user={user}
          loanResult={loanResult}
          cultivationResult={cultivationResult}
          businessResult={businessResult}
          onNavigate={setActivePage}
        />
      );
  }

  return (
    <div className="app-shell">
      <Workspace
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onSignOut={handleSignOut}
      >
        {pageContent}
      </Workspace>

      {toast && (
        <div className="toast-message" role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}