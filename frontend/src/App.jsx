import { useState } from 'react'
import './App.css'

const navigation = [
  { section: 'MAIN MENU' },
  { name: 'Dashboard', icon: '▦' },
  { name: 'AI Assistant', icon: '✳' },
  { name: 'Government Schemes', icon: '▤' },
  { section: 'FINANCIAL TOOLS' },
  { name: 'Loan & EMI Calculator', icon: '₹' },
  { name: 'Cultivation Calculator', icon: '♧' },
  { name: 'Business Analysis', icon: '◫' },
  { section: 'MANAGEMENT' },
  { name: 'Reports', icon: '▧' },
  { name: 'My Profile', icon: '◎' },
]

const modules = [
  {
    icon: '✳',
    title: 'AI Assistant',
    description: 'Get answers to your mushroom farming and business questions.',
    color: 'purple',
  },
  {
    icon: '▤',
    title: 'Government Schemes',
    description: 'Explore schemes, subsidies and financial support opportunities.',
    color: 'blue',
  },
  {
    icon: '₹',
    title: 'Loan & EMI Calculator',
    description: 'Estimate monthly instalments and understand loan affordability.',
    color: 'green',
  },
  {
    icon: '♧',
    title: 'Cultivation Calculator',
    description: 'Estimate mushroom cultivation expenses and production costs.',
    color: 'orange',
  },
  {
    icon: '◫',
    title: 'Business Analysis',
    description: 'Understand revenue, expenses and potential profitability.',
    color: 'pink',
  },
  {
    icon: '▧',
    title: 'Reports',
    description: 'View and organise your business and financial summaries.',
    color: 'teal',
  },
]

const governmentSchemes = [
  {
    id: 1,
    schemeType: 'Central Government Scheme',
    lastVerified: '9 November 2026',
    name: 'Mission for Integrated Development of Horticulture',
    shortName: 'MIDH',
    category: 'Mushroom Cultivation',
    description:
      'Government support for mushroom production, spawn-making and compost-making infrastructure.',
    benefits: [
      'Production unit: ₹30 lakh cost norm, 40% assistance for private sector.',
      'Spawn unit: ₹20 lakh cost norm, 40% assistance for private sector.',
      'Compost unit: ₹30 lakh cost norm, 40% assistance for private sector.',
      'Small-scale unit: ₹2 lakh cost norm for 200 sq. ft., 50% assistance.',
      'Small-scale assistance is limited to 5 units per beneficiary.',
    ],
    eligibility:
      'Assistance depends on the project type, applicant, location and approval by the implementing authority.',
    application:
      'Contact your State Horticulture Mission or District Horticulture Office to confirm current application procedures and availability.',
    officialLink:
      'https://nhb.gov.in/writereaddata/082825102800MIDH%20Guideline%202025.pdf',
  },
  {
    id: 2,
    schemeType: 'Central Government Scheme',
    lastVerified: '9 November 2026',
    name: 'Pradhan Mantri Formalisation of Micro Food Processing Enterprises',
    shortName: 'PMFME',
    category: 'Food Processing',
    description:
      'Financial and technical support for eligible new or existing micro food-processing enterprises.',
    benefits: [
      'Credit-linked capital subsidy of 35% of eligible project cost.',
      'Maximum subsidy of ₹10 lakh per individual unit.',
      'Minimum beneficiary contribution of 10%; remaining project cost is financed through a bank loan.',
      'Training and business support may also be available.',
    ],
    eligibility:
      'Eligible individual entrepreneurs, proprietorships, partnerships, FPOs, NGOs, cooperatives, SHGs and private limited companies undertaking eligible food-processing activities. Fresh mushroom cultivation alone does not qualify as food processing.',
    application:
      'Check the official PMFME portal and contact the Karnataka State Nodal Agency or District Resource Person for application availability and guidance.',
    officialLink: 'https://www.mofpi.gov.in/schemes/pmfme',
  },
  {
    id: 3,
    schemeType: 'Central Government Scheme',
    lastVerified: '9 November 2026',
    name: 'Agriculture Infrastructure Fund',
    shortName: 'AIF',
    category: 'Community Infrastructure',
    description:
      'Financing support for eligible post-harvest infrastructure and community farming assets, including qualifying mushroom farming projects.',
    benefits: [
      '3% annual interest subvention on eligible loans up to ₹2 crore.',
      'Interest support available for up to 7 years.',
      'Eligible borrowers may receive credit guarantee support, subject to scheme conditions.',
    ],
    eligibility:
      'For mushroom farming as a community farming asset, eligible group entities such as FPOs, SHGs, JLGs, cooperatives and other specified organisations can apply. Individual mushroom farming should not be assumed eligible under this project category.',
    application:
      'Prepare a project proposal and approach an eligible lending institution. Confirm project eligibility and current application procedures through the official AIF portal.',
    officialLink: 'https://agriinfra.dac.gov.in/',
  },
  {
    id: 4,
    schemeType: 'Related Government Resource',
    lastVerified: '9 November 2026',
    name: 'National Horticulture Board Schemes',
    shortName: 'NHB',
    category: 'Horticulture Infrastructure',
    description:
      'Horticulture development and infrastructure programmes, including commercial horticulture and post-harvest infrastructure support.',
    benefits: [
      'Potential financial assistance under applicable horticulture project schemes.',
      'Resources and guidance for eligible commercial horticulture and storage projects.',
      'Project-specific eligibility and assistance norms apply.',
    ],
    eligibility:
      'Depends on the specific NHB scheme, project type, applicant category and current operational guidelines. This is not a guaranteed standalone mushroom cultivation subsidy.',
    application:
      'Review the current NHB scheme guidelines and application requirements before preparing a project proposal.',
    officialLink: 'https://nhb.gov.in/schemes.aspx',
  },
]

const initialChatMessage = {
  role: 'assistant',
  content:
    'Hello! I am ShroomTalk AI. Ask me anything about mushroom cultivation, farming costs, government schemes or starting your mushroom business.',
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  // Government schemes filters
  const [schemeSearch, setSchemeSearch] = useState('')
  const [schemeCategory, setSchemeCategory] = useState('All')
  const [schemeTypeFilter, setSchemeTypeFilter] = useState('All')

  // AI Assistant chat
  const [chatMessages, setChatMessages] = useState([initialChatMessage])
  const [chatInput, setChatInput] = useState('')

  // Loan & EMI calculator
  const [loanAmount, setLoanAmount] = useState('500000')
  const [interestRate, setInterestRate] = useState('10')
  const [loanYears, setLoanYears] = useState('5')

  // Cultivation calculator
  const [spawnCost, setSpawnCost] = useState('2000')
  const [substrateCost, setSubstrateCost] = useState('5000')
  const [labourCost, setLabourCost] = useState('3000')
  const [utilityCost, setUtilityCost] = useState('1000')
  const [packagingCost, setPackagingCost] = useState('1000')
  const [transportCost, setTransportCost] = useState('500')
  const [otherCost, setOtherCost] = useState('500')
  const [expectedYield, setExpectedYield] = useState('100')
  const [sellingPrice, setSellingPrice] = useState('200')

  // Business analysis
  const [initialInvestment, setInitialInvestment] = useState('100000')
  const [monthlyYield, setMonthlyYield] = useState('300')
  const [averageSellingPrice, setAverageSellingPrice] = useState('200')
  const [monthlyExpenses, setMonthlyExpenses] = useState('30000')

  // My Profile
  const [farmerName, setFarmerName] = useState('Farmer')
  const [farmName, setFarmName] = useState('')
  const [farmerLocation, setFarmerLocation] = useState('')
  const [farmerPhone, setFarmerPhone] = useState('')
  const [farmSize, setFarmSize] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)

  // Loan calculations
  const principal = Math.max(0, Number(loanAmount) || 0)
  const annualRate = Math.max(0, Number(interestRate) || 0)
  const months = Math.max(0, Number(loanYears) || 0) * 12
  const monthlyRate = annualRate / 12 / 100

  const emi =
    principal > 0 && months > 0
      ? monthlyRate === 0
        ? principal / months
        : (principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
      : 0

  const totalPayment = emi * months
  const totalInterest = Math.max(0, totalPayment - principal)

  // Cultivation calculations
  const totalCost =
    Math.max(0, Number(spawnCost) || 0) +
    Math.max(0, Number(substrateCost) || 0) +
    Math.max(0, Number(labourCost) || 0) +
    Math.max(0, Number(utilityCost) || 0) +
    Math.max(0, Number(packagingCost) || 0) +
    Math.max(0, Number(transportCost) || 0) +
    Math.max(0, Number(otherCost) || 0)

  const yieldKg = Math.max(0, Number(expectedYield) || 0)
  const pricePerKg = Math.max(0, Number(sellingPrice) || 0)
  const costPerKg = yieldKg > 0 ? totalCost / yieldKg : 0
  const expectedRevenue = yieldKg * pricePerKg
  const estimatedProfit = expectedRevenue - totalCost

  // Business analysis calculations
  const investment = Math.max(0, Number(initialInvestment) || 0)
  const productionKg = Math.max(0, Number(monthlyYield) || 0)
  const sellingRate = Math.max(0, Number(averageSellingPrice) || 0)
  const operatingExpenses = Math.max(0, Number(monthlyExpenses) || 0)
  const monthlyRevenue = productionKg * sellingRate
  const monthlyProfit = monthlyRevenue - operatingExpenses
  const businessStatus =
    monthlyProfit > 0
      ? 'Profitable'
      : monthlyProfit < 0
        ? 'Operating at a loss'
        : 'Break-even'
  const annualProfit = monthlyProfit * 12
  const breakEvenMonths =
    monthlyProfit > 0 && investment > 0 ? investment / monthlyProfit : 0
  const annualROI = investment > 0 ? (annualProfit / investment) * 100 : 0

  const currentModule = modules.find((module) => module.title === activePage)

  const filteredSchemes = governmentSchemes.filter((scheme) => {
    const search = schemeSearch.toLowerCase()
    const matchesSearch =
      scheme.name.toLowerCase().includes(search) ||
      scheme.shortName.toLowerCase().includes(search) ||
      scheme.description.toLowerCase().includes(search)

    const matchesCategory =
      schemeCategory === 'All' || scheme.category === schemeCategory

    const matchesType =
      schemeTypeFilter === 'All' || scheme.schemeType === schemeTypeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  function navigate(page) {
    setActivePage(page)
    setMenuOpen(false)
  }

  function handleChatSubmit(event) {
    event.preventDefault()
    const message = chatInput.trim()
    if (!message) return

    setChatMessages((previous) => [
      ...previous,
      { role: 'user', content: message },
      {
        role: 'assistant',
        content:
          'Thank you for your question! This frontend demonstration is ready for the project AI service to be connected by the responsible team.',
      },
    ])
    setChatInput('')
  }

  function clearChat() {
    setChatMessages([initialChatMessage])
  }

  function saveProfile(event) {
    event.preventDefault()
    setProfileSaved(true)
  }

  function formatCurrency(value) {
    return `₹${Math.round(value || 0).toLocaleString('en-IN')}`
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">🍄</div>
          <div>
            <h2>ShroomTalk</h2>
            <span>SMART FARMING, BETTER FUTURE</span>
          </div>
        </div>

        <nav className="navigation">
          {navigation.map((item, index) =>
            item.section ? (
              <p className="nav-section" key={`${item.section}-${index}`}>
                {item.section}
              </p>
            ) : (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                onClick={() => navigate(item.name)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.name}</span>
                {item.name === 'AI Assistant' && (
                  <span className="new-tag">AI</span>
                )}
              </button>
            ),
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">🌱</div>
            <strong>Growing together</strong>
            <p>Building smarter mushroom businesses, one step at a time.</p>
          </div>
          <div className="sidebar-footer">
            <span className="online-dot" />
            Prototype version 1.0
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="today-label">Farmer workspace</span>
            <button className="notification-button" aria-label="Notifications">
              ♧
              <span />
            </button>
            <div className="profile-avatar">
              {(farmerName.trim().charAt(0) || 'F').toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{farmerName || 'Farmer'}</strong>
              <span>My account</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {activePage === 'Dashboard' ? (
            <>
              <section className="welcome-row">
                <div>
                  <p className="eyebrow">FARMER WORKSPACE</p>
                  <h1>Good day, {farmerName || 'Farmer'}! <span>🌿</span></h1>
                  <p className="welcome-description">
                    Welcome to ShroomTalk. Your companion for smarter
                    mushroom farming and business decisions.
                  </p>
                </div>
                <div className="date-chip">
                  <span>◷</span> Your farming journey starts here
                </div>
              </section>

              <section className="hero-banner">
                <div className="hero-copy">
                  <span className="hero-label">YOUR BUSINESS, YOUR GROWTH</span>
                  <h2>Grow smarter.<br />Earn better.</h2>
                  <p>
                    Make informed decisions with AI-powered guidance,
                    financial tools and farming resources.
                  </p>
                  <button
                    className="hero-button"
                    onClick={() => navigate('AI Assistant')}
                  >
                    Explore AI Assistant <span>→</span>
                  </button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-circle circle-one" />
                  <div className="art-circle circle-two" />
                  <div className="mushroom-art">🍄</div>
                  <div className="leaf-art">🌿</div>
                  <div className="art-caption">SUSTAINABLE GROWTH</div>
                </div>
              </section>

              <section className="section-heading">
                <div>
                  <p className="eyebrow">AT A GLANCE</p>
                  <h2>Your workspace</h2>
                </div>
                <span className="section-note">Tools to support your journey</span>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon purple">✳</span>
                    <span className="stat-label">AI SUPPORT</span>
                  </div>
                  <h3>24/7</h3>
                  <p>AI assistance availability</p>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon green">₹</span>
                    <span className="stat-label">FINANCIAL TOOLS</span>
                  </div>
                  <h3>3</h3>
                  <p>Calculators and analysis tools</p>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon orange">▤</span>
                    <span className="stat-label">RESOURCES</span>
                  </div>
                  <h3>Explore</h3>
                  <p>Government schemes and guidance</p>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon blue">▧</span>
                    <span className="stat-label">YOUR REPORTS</span>
                  </div>
                  <h3>Ready</h3>
                  <p>Financial summaries and reports</p>
                </div>
              </section>

              <section className="section-heading modules-heading">
                <div>
                  <p className="eyebrow">GET STARTED</p>
                  <h2>Explore your tools</h2>
                </div>
                <span className="section-note">Select a module to continue →</span>
              </section>

              <section className="modules-grid">
                {modules.map((module) => (
                  <button
                    className="module-card"
                    key={module.title}
                    onClick={() => navigate(module.title)}
                  >
                    <div className={`module-icon ${module.color}`}>
                      {module.icon}
                    </div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                    <span className="module-link">Open module <span>→</span></span>
                  </button>
                ))}
              </section>

              <section className="bottom-note">
                <span>🌾</span>
                <p>
                  <strong>Built for farmers.</strong> ShroomTalk aims to make
                  business knowledge and financial guidance more accessible
                  to rural mushroom entrepreneurs.
                </p>
              </section>
            </>
          ) : activePage === 'Loan & EMI Calculator' ? (
            <section className="calculator-page">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <p className="eyebrow">FINANCIAL TOOLS</p>
              <h1>Loan & EMI Calculator</h1>
              <p className="calculator-description">
                Estimate your monthly loan instalment and total repayment.
              </p>

              <div className="calculator-layout">
                <div className="calculator-inputs">
                  <h2>Loan details</h2>
                  <label>
                    Loan amount (₹)
                    <input type="number" min="1" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} />
                  </label>
                  <label>
                    Annual interest rate (%)
                    <input type="number" min="0" step="0.1" value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)} />
                  </label>
                  <label>
                    Loan tenure (years)
                    <input type="number" min="1" max="30" value={loanYears}
                      onChange={(e) => setLoanYears(e.target.value)} />
                  </label>
                  <p className="input-hint">
                    Adjust the values to see your estimated EMI instantly.
                  </p>
                </div>

                <div className="calculator-results">
                  <p className="eyebrow">YOUR ESTIMATED MONTHLY PAYMENT</p>
                  <h2>{formatCurrency(emi)}</h2>
                  <span className="result-caption">Monthly EMI</span>
                  <div className="result-divider" />
                  <div className="result-row">
                    <span>Principal amount</span><strong>{formatCurrency(principal)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Total interest</span><strong>{formatCurrency(totalInterest)}</strong>
                  </div>
                  <div className="result-row total-row">
                    <span>Total repayment</span><strong>{formatCurrency(totalPayment)}</strong>
                  </div>
                  <p className="result-note">
                    This is an estimate using a monthly reducing-balance
                    interest calculation. Actual lender terms may differ.
                  </p>
                </div>
              </div>
            </section>
          ) : activePage === 'Cultivation Calculator' ? (
            <section className="calculator-page">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <p className="eyebrow">FARMING & PRODUCTION</p>
              <h1>Cultivation Cost Calculator</h1>
              <p className="calculator-description">
                Estimate your mushroom cultivation expenses, revenue and profit per batch.
              </p>

              <div className="calculator-layout">
                <div className="calculator-inputs">
                  <h2>Production expenses</h2>
                  <label>Spawn cost (₹)
                    <input type="number" min="0" value={spawnCost}
                      onChange={(e) => setSpawnCost(e.target.value)} />
                  </label>
                  <label>Substrate and raw materials (₹)
                    <input type="number" min="0" value={substrateCost}
                      onChange={(e) => setSubstrateCost(e.target.value)} />
                  </label>
                  <label>Labour cost (₹)
                    <input type="number" min="0" value={labourCost}
                      onChange={(e) => setLabourCost(e.target.value)} />
                  </label>
                  <label>Electricity and water (₹)
                    <input type="number" min="0" value={utilityCost}
                      onChange={(e) => setUtilityCost(e.target.value)} />
                  </label>
                  <label>Packaging cost (₹)
                    <input type="number" min="0" value={packagingCost}
                      onChange={(e) => setPackagingCost(e.target.value)} />
                  </label>
                  <label>Transportation cost (₹)
                    <input type="number" min="0" value={transportCost}
                      onChange={(e) => setTransportCost(e.target.value)} />
                  </label>
                  <label>Other expenses (₹)
                    <input type="number" min="0" value={otherCost}
                      onChange={(e) => setOtherCost(e.target.value)} />
                  </label>
                  <div className="result-divider" />
                  <h2>Production details</h2>
                  <label>Expected mushroom yield (kg)
                    <input type="number" min="0" value={expectedYield}
                      onChange={(e) => setExpectedYield(e.target.value)} />
                  </label>
                  <label>Selling price per kg (₹)
                    <input type="number" min="0" value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)} />
                  </label>
                </div>

                <div className="calculator-results">
                  <p className="eyebrow">BATCH FINANCIAL SUMMARY</p>
                  <h2>{formatCurrency(estimatedProfit)}</h2>
                  <p className="result-caption">Estimated profit per batch</p>
                  <div className="result-divider" />
                  <div className="result-row">
                    <span>Total cultivation cost</span><strong>{formatCurrency(totalCost)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Cost per kg</span>
                    <strong>{formatCurrency(costPerKg)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Expected revenue</span><strong>{formatCurrency(expectedRevenue)}</strong>
                  </div>
                  <div className="result-divider" />
                  <div className="result-row total-row">
                    <span>Estimated profit</span><strong>{formatCurrency(estimatedProfit)}</strong>
                  </div>
                  <p className="result-note">
                    Estimates are based on your entered expenses, expected yield
                    and selling price. Actual results may vary.
                  </p>
                </div>
              </div>
            </section>
          ) : activePage === 'Business Analysis' ? (
            <section className="calculator-page">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <p className="eyebrow">FINANCIAL PLANNING</p>
              <h1>Business Analysis</h1>
              <p className="calculator-description">
                Evaluate your mushroom business revenue, expenses,
                profitability and investment recovery.
              </p>

              <div className="calculator-layout">
                <div className="calculator-inputs">
                  <h2>Business details</h2>
                  <label>Initial investment (₹)
                    <input type="number" min="0" value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)} />
                  </label>
                  <label>Monthly production (kg)
                    <input type="number" min="0" value={monthlyYield}
                      onChange={(e) => setMonthlyYield(e.target.value)} />
                  </label>
                  <label>Average selling price per kg (₹)
                    <input type="number" min="0" value={averageSellingPrice}
                      onChange={(e) => setAverageSellingPrice(e.target.value)} />
                  </label>
                  <label>Monthly operating expenses (₹)
                    <input type="number" min="0" value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)} />
                  </label>
                </div>

                <div className="calculator-results">
                  <p className="eyebrow">BUSINESS PERFORMANCE</p>
                  <h2>{formatCurrency(monthlyProfit)}</h2>
                  <p className="result-caption">Estimated monthly profit</p>
                  <div className={`business-status ${
                    monthlyProfit > 0 ? 'status-positive' :
                    monthlyProfit < 0 ? 'status-negative' : 'status-neutral'
                  }`}>
                    <span className="status-dot" />
                    {businessStatus}
                  </div>
                  <div className="result-divider" />
                  <div className="result-row">
                    <span>Monthly revenue</span><strong>{formatCurrency(monthlyRevenue)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Monthly expenses</span><strong>{formatCurrency(operatingExpenses)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Annual profit</span><strong>{formatCurrency(annualProfit)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Annual ROI</span><strong>{annualROI.toFixed(2)}%</strong>
                  </div>
                  <div className="result-row total-row">
                    <span>Break-even period</span>
                    <strong>{breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} months` : 'Not yet achievable'}</strong>
                  </div>
                  <p className="result-note">
                    Estimates assume consistent monthly production,
                    selling price and operating expenses. Actual
                    business performance may vary.
                  </p>
                </div>
              </div>
            </section>
          ) : activePage === 'AI Assistant' ? (
            <section className="chat-page">
              <div className="chat-heading-row">
                <div>
                  <p className="eyebrow">SHROOMTALK INTELLIGENCE</p>
                  <h1>AI Assistant</h1>
                  <p className="calculator-description">
                    Your farming and mushroom business assistant.
                  </p>
                </div>
                <button className="back-link" type="button" onClick={clearChat}>
                  Clear chat
                </button>
              </div>

              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.role}`}>
                      <strong>{message.role === 'assistant' ? 'ShroomTalk AI' : 'You'}</strong>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-input-area" onSubmit={handleChatSubmit}>
                  <input
                    type="text"
                    placeholder="Ask about mushroom farming..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    aria-label="Type your question"
                  />
                  <button type="submit" disabled={!chatInput.trim()}>
                    Send
                  </button>
                </form>
              </div>
              <p className="result-note">
                Demonstration interface: responses are sample messages and are not generated by a live AI service.
              </p>
            </section>
          ) : activePage === 'Government Schemes' ? (
            <section className="schemes-page">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <p className="eyebrow">FARMING RESOURCES</p>
              <h1>Government Schemes</h1>
              <p className="calculator-description">
                Explore government support available for mushroom entrepreneurs.
              </p>

              <div className="schemes-filters">
                <input
                  type="text"
                  placeholder="Search schemes..."
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                />
                <select value={schemeCategory}
                  onChange={(e) => setSchemeCategory(e.target.value)}>
                  <option value="All">All categories</option>
                  <option value="Mushroom Cultivation">Mushroom Cultivation</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Community Infrastructure">Community Infrastructure</option>
                  <option value="Horticulture Infrastructure">Horticulture Infrastructure</option>
                </select>
                <select value={schemeTypeFilter}
                  onChange={(e) => setSchemeTypeFilter(e.target.value)}>
                  <option value="All">All scheme types</option>
                  <option value="Central Government Scheme">Central Government Schemes</option>
                  <option value="Related Government Resource">Related Government Resources</option>
                </select>
              </div>

              <div className="schemes-list">
                {filteredSchemes.length > 0 ? (
                  filteredSchemes.map((scheme) => (
                    <article className="scheme-card" key={scheme.id}>
                      <span className="scheme-category">{scheme.category}</span>
                      <div className="scheme-meta">
                        <span className="scheme-type">{scheme.schemeType}</span>
                        <span className="scheme-verified">Last verified: {scheme.lastVerified}</span>
                      </div>
                      <h2>{scheme.name}</h2>
                      <p>{scheme.description}</p>
                      <h3>Financial assistance</h3>
                      <ul>
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                      <h3>Eligibility</h3>
                      <p>{scheme.eligibility}</p>
                      <h3>How to apply</h3>
                      <p>{scheme.application}</p>
                      <a className="scheme-link" href={scheme.officialLink}
                        target="_blank" rel="noreferrer">
                        View official guidelines →
                      </a>
                    </article>
                  ))
                ) : (
                  <p>No matching schemes found.</p>
                )}
              </div>
            </section>
          ) : activePage === 'Reports' ? (
            <section className="reports-page">
              <div className="page-heading-row">
                <div>
                  <p className="eyebrow">BUSINESS MANAGEMENT</p>
                  <h1>Reports & Summaries</h1>
                  <p className="calculator-description">
                    Review the financial estimates generated by your ShroomTalk tools.
                  </p>
                </div>
                <button className="hero-button" type="button" onClick={() => window.print()}>
                  Print report
                </button>
              </div>

              <div className="report-summary-grid">
                <article className="stat-card">
                  <span className="stat-label">MONTHLY REVENUE</span>
                  <h3>{formatCurrency(monthlyRevenue)}</h3>
                  <p>Based on Business Analysis inputs</p>
                </article>
                <article className="stat-card">
                  <span className="stat-label">MONTHLY PROFIT / LOSS</span>
                  <h3>{formatCurrency(monthlyProfit)}</h3>
                  <p>{businessStatus}</p>
                </article>
                <article className="stat-card">
                  <span className="stat-label">CULTIVATION COST</span>
                  <h3>{formatCurrency(totalCost)}</h3>
                  <p>Estimated cost per batch</p>
                </article>
                <article className="stat-card">
                  <span className="stat-label">MONTHLY LOAN EMI</span>
                  <h3>{formatCurrency(emi)}</h3>
                  <p>Based on current loan calculator inputs</p>
                </article>
              </div>

              <div className="report-detail-card">
                <p className="eyebrow">FINANCIAL OVERVIEW</p>
                <h2>Business performance summary</h2>
                <div className="result-row">
                  <span>Monthly revenue</span><strong>{formatCurrency(monthlyRevenue)}</strong>
                </div>
                <div className="result-row">
                  <span>Monthly operating expenses</span><strong>{formatCurrency(operatingExpenses)}</strong>
                </div>
                <div className="result-row">
                  <span>Monthly profit / loss</span><strong>{formatCurrency(monthlyProfit)}</strong>
                </div>
                <div className="result-row">
                  <span>Annual profit estimate</span><strong>{formatCurrency(annualProfit)}</strong>
                </div>
                <div className="result-row">
                  <span>Annual return on investment</span><strong>{annualROI.toFixed(2)}%</strong>
                </div>
                <div className="result-row">
                  <span>Estimated break-even period</span>
                  <strong>{breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} months` : 'Not yet achievable'}</strong>
                </div>
                <p className="result-note">
                  These summaries are calculated from the values currently entered in the frontend calculators.
                  They are estimates, not audited financial statements.
                </p>
              </div>

              <div className="report-detail-card">
                <p className="eyebrow">REPORT INFORMATION</p>
                <h2>Available summaries</h2>
                <ul className="report-list">
                  <li><strong>Loan summary:</strong> Principal, estimated EMI, interest and total repayment.</li>
                  <li><strong>Cultivation summary:</strong> Batch expenses, cost per kg, expected revenue and estimated profit.</li>
                  <li><strong>Business summary:</strong> Revenue, operating expenses, profit, ROI and break-even estimate.</li>
                </ul>
                <p className="result-note">
                  Use the Print report button to print this page or choose Save as PDF in your browser's print dialog.
                </p>
              </div>
            </section>
          ) : activePage === 'My Profile' ? (
            <section className="profile-page">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <p className="eyebrow">FARMER ACCOUNT</p>
              <h1>My Profile</h1>
              <p className="calculator-description">
                Manage the basic details shown in your ShroomTalk workspace.
              </p>

              <div className="profile-layout">
                <div className="profile-summary-card">
                  <div className="profile-large-avatar">
                    {(farmerName.trim().charAt(0) || 'F').toUpperCase()}
                  </div>
                  <h2>{farmerName || 'Farmer'}</h2>
                  <p>{farmName || 'Mushroom farming workspace'}</p>
                  <span className="profile-summary-location">
                    {farmerLocation || 'Location not added'}
                  </span>
                </div>

                <form className="calculator-inputs profile-form" onSubmit={saveProfile}>
                  <h2>Farmer information</h2>
                  <label>
                    Farmer name
                    <input value={farmerName}
                      onChange={(e) => { setFarmerName(e.target.value); setProfileSaved(false) }}
                      placeholder="Enter your name" />
                  </label>
                  <label>
                    Farm / business name
                    <input value={farmName}
                      onChange={(e) => { setFarmName(e.target.value); setProfileSaved(false) }}
                      placeholder="Enter your farm name" />
                  </label>
                  <label>
                    Location
                    <input value={farmerLocation}
                      onChange={(e) => { setFarmerLocation(e.target.value); setProfileSaved(false) }}
                      placeholder="Village, district or city" />
                  </label>
                  <label>
                    Contact number
                    <input type="tel" value={farmerPhone}
                      onChange={(e) => { setFarmerPhone(e.target.value); setProfileSaved(false) }}
                      placeholder="Enter contact number" />
                  </label>
                  <label>
                    Farm size / production capacity
                    <input value={farmSize}
                      onChange={(e) => { setFarmSize(e.target.value); setProfileSaved(false) }}
                      placeholder="e.g. 500 sq. ft. or 100 kg per month" />
                  </label>
                  <button className="hero-button" type="submit">Save profile</button>
                  {profileSaved && (
                    <p className="profile-saved-message" role="status">
                      Profile details updated for this session.
                    </p>
                  )}
                  <p className="result-note">
                    This prototype keeps profile changes in the current browser session only.
                  </p>
                </form>
              </div>
            </section>
          ) : (
            <section className="module-placeholder">
              <button className="back-link" onClick={() => navigate('Dashboard')}>
                ← Back to dashboard
              </button>
              <div className="placeholder-icon">{currentModule?.icon || '◎'}</div>
              <p className="eyebrow">SHROOMTALK WORKSPACE</p>
              <h1>{activePage}</h1>
              <p className="placeholder-description">
                {currentModule?.description ||
                  'Manage your ShroomTalk account and personal information.'}
              </p>
              <div className="coming-soon">
                <span>🚧</span>
                <div>
                  <strong>Module under development</strong>
                  <p>The interface for this module will be developed in the next stage of the project.</p>
                </div>
              </div>
            </section>
          )}

          <footer className="page-footer">
            <span>© 2026 ShroomTalk-AI</span>
            <span>Supporting smarter rural entrepreneurship 🌱</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App