import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { IconDownload, IconSettings, IconCheck, IconPuzzle, IconArrowRight } from '../components/Icons.jsx'

// Flip this once the extension is live on the Chrome Web Store.
// Everything below is provisioned for both states so the page
// doesn't need a rebuild at launch — just this flag and the URL.
const IS_LIVE = false
const CHROME_STORE_URL = 'https://chromewebstore.google.com/'

const steps = [
  {
    icon: IconDownload,
    title: 'Add NeuroAccess to Chrome',
    text: 'Install from the Chrome Web Store. It only takes a few seconds and there is no account required to start.',
  },
  {
    icon: IconPuzzle,
    title: 'Pin the extension',
    text: 'Click the puzzle-piece icon in your toolbar and pin NeuroAccess so it is always one click away.',
  },
  {
    icon: IconSettings,
    title: 'Pick a starting profile',
    text: 'Choose Default, Blind, Low Vision, or Dyslexic. You can fine-tune or switch profiles per site at any time.',
  },
  {
    icon: IconCheck,
    title: 'Run your first audit',
    text: 'Open any page and click "Fix this page." NeuroAccess shows an issue summary, then applies safe fixes instantly.',
  },
]

export default function Setup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        eyebrow={IS_LIVE ? 'Available now' : 'Coming soon'}
        title={IS_LIVE ? 'Set up NeuroAccess in under a minute' : 'NeuroAccess is finishing development'}
        lede={
          IS_LIVE
            ? 'Install the extension, pick a profile, and start fixing pages immediately.'
            : "The extension is being built right now. Join the list below and we'll email you the moment it's live on the Chrome Web Store."
        }
      >
        {IS_LIVE ? (
          <a href={CHROME_STORE_URL} className="btn btn-primary btn-lg" target="_blank" rel="noreferrer">
            Add to Chrome — free <IconArrowRight width={18} height={18} />
          </a>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            {submitted ? (
              <div className="waitlist-success">
                <IconCheck width={18} height={18} />
                You're on the list — we'll email you at launch.
              </div>
            ) : (
              <>
                <label className="sr-only" htmlFor="waitlist-email">Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Notify me at launch
                </button>
              </>
            )}
          </form>
        )}
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Setup guide</span>
            <h2>What installing looks like</h2>
            <p>This is the exact flow you'll follow once the extension is published — provisioned now so nothing changes at launch.</p>
          </div>

          <div className="steps-list">
            {steps.map((s, i) => (
              <div className="step-row" key={s.title}>
                <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon">
                  <s.icon width={22} height={22} />
                </div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dev-install-section">
        <div className="container">
          <div className="dev-install card">
            <div className="dev-install-head">
              <span className="eyebrow">For testers & developers</span>
              <h2>Load it unpacked, before the store listing goes live</h2>
              <p>If you have access to the source build, you can load NeuroAccess as an unpacked extension in Chrome for early testing.</p>
            </div>
            <ol className="dev-install-steps">
              <li>Download or clone the extension source to your machine.</li>
              <li>Open <code>chrome://extensions</code> in Chrome.</li>
              <li>Turn on <strong>Developer mode</strong> in the top-right corner.</li>
              <li>Click <strong>Load unpacked</strong> and select the extension's <code>dist/</code> folder.</li>
              <li>Pin NeuroAccess from the toolbar puzzle-piece menu.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>Want early access?</h2>
              <p>We're inviting a small group of testers before the public launch.</p>
            </div>
            <Link to="/contact" className="btn cta-banner-btn">
              Request early access <IconArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .waitlist-form {
          display: flex;
          gap: 10px;
          margin-top: 28px;
          max-width: 460px;
          flex-wrap: wrap;
        }
        .waitlist-form input {
          flex: 1;
          min-width: 220px;
          padding: 13px 18px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
        }
        .waitlist-form input:focus { border-color: var(--primary); }
        .waitlist-success {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 20px;
          border-radius: var(--radius-pill);
          background: var(--accent-soft);
          color: var(--accent);
          font-weight: 500;
          font-size: 14.5px;
        }
        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }

        .steps-list { display: flex; flex-direction: column; gap: 4px; }
        .step-row {
          display: grid;
          grid-template-columns: 56px 52px 1fr;
          gap: 20px;
          align-items: flex-start;
          padding: 22px 0;
          border-bottom: 1px solid var(--border);
        }
        .step-row:last-child { border-bottom: none; }
        .step-number {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-faint);
          padding-top: 12px;
        }
        .step-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: var(--primary-soft);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .step-body h3 { font-size: 17px; margin-bottom: 6px; }
        .step-body p { margin: 0; font-size: 14.5px; }

        .dev-install-section { background: var(--bg-soft); }
        .dev-install { padding: 36px; max-width: 760px; margin: 0 auto; }
        .dev-install-head { margin-bottom: 20px; }
        .dev-install-steps { display: flex; flex-direction: column; gap: 12px; padding-left: 20px; }
        .dev-install-steps li { font-size: 14.5px; color: var(--text-muted); }
        .dev-install-steps code {
          font-family: var(--font-mono);
          background: var(--bg-soft);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: 5px;
          font-size: 13px;
          color: var(--text);
        }

        @media (max-width: 600px) {
          .step-row { grid-template-columns: 44px 1fr; }
          .step-number { display: none; }
        }
      `}</style>
    </>
  )
}
