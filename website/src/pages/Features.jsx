import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import {
  IconContrast, IconImage, IconSpeaker, IconMic, IconKeyboard, IconLayers,
  IconShield, IconArrowRight, IconCheck,
} from '../components/Icons.jsx'

const mainFeatures = [
  {
    icon: IconContrast,
    title: 'One-click Global Accessibility Mode',
    text: 'Runs a full audit, then applies safe auto-fixes: alt text placeholders, ARIA improvements, and heading or navigation repairs.',
    points: ['Full-page accessibility audit', 'Safe, reversible auto-fixes', 'Before/after issue summary'],
  },
  {
    icon: IconImage,
    title: 'AI image labeling & OCR',
    text: 'Finds unlabeled images and generates editable alt text suggestions, plus OCR for text trapped in images or scans.',
    points: ['Detects unlabeled images automatically', 'Editable, human-readable suggestions', 'OCR for scanned or image-only text'],
  },
  {
    icon: IconSpeaker,
    title: 'Text-to-speech',
    text: 'Reads a selection or the full page aloud, with playback controls you stay in charge of — nothing plays without asking.',
    points: ['Read selection or full page', 'Adjustable pace and voice', 'Manual playback controls'],
  },
  {
    icon: IconMic,
    title: 'Speech-to-text & voice commands',
    text: 'Hands-free navigation for scrolling, moving between sections, and triggering common actions.',
    points: ['Voice-driven scrolling and navigation', 'Hands-free action triggers', 'Built for limited fine motor control'],
  },
  {
    icon: IconContrast,
    title: 'Smart contrast fixer',
    text: 'WCAG-oriented readability improvements plus dedicated presets for protanopia, deuteranopia, and tritanopia.',
    points: ['WCAG-aware contrast correction', 'Color-blind presets', 'Preserves brand color intent where possible'],
  },
  {
    icon: IconKeyboard,
    title: 'Enhanced keyboard navigation',
    text: 'Better tab order, visible focus states, and skip-link support so precise mouse use is never required.',
    points: ['Improved tab flow', 'Stronger focus visibility', 'Skip-link support on every page'],
  },
  {
    icon: IconLayers,
    title: 'Accessibility profiles',
    text: 'Default, Blind, Low Vision, and Dyslexic profiles, with per-site overrides that remember your preferences.',
    points: ['Four starting profiles', 'Site-level overrides', 'Personalized profile combinations'],
  },
  {
    icon: IconShield,
    title: 'Accessibility report export',
    text: 'A machine-readable report of what was found and fixed, so progress is easy to track over time.',
    points: ['Machine-readable export', 'Tracks improvement over time', 'Useful for teams and auditors'],
  },
]

const mapping = [
  { group: 'Blind users', barrier: 'Images and controls unreadable by screen readers', support: 'AI image labeling + OCR, ARIA improvements, voice commands' },
  { group: 'Low vision users', barrier: 'Small text, poor contrast, visual clutter', support: 'Smart contrast fixer, readability profiles, focus visibility' },
  { group: 'Color vision deficiency', barrier: 'Color-only meaning, weak contrast', support: 'Color-blind presets, WCAG-oriented contrast' },
  { group: 'Dyslexia & reading difficulty', barrier: 'Dense text, reading fatigue', support: 'Text-to-speech, paced reading, simplification profiles' },
  { group: 'Motor impairments', barrier: 'Precise clicking, deep navigation', support: 'Voice navigation, keyboard enhancements, skip links' },
  { group: 'Cognitive & attention challenges', barrier: 'Complex layouts, high cognitive load', support: 'One-click mode, guided profiles, cleaner navigation' },
  { group: 'Age-related decline', barrier: 'Mixed vision, motor, reading friction', support: 'Personalized profile combinations, one-click fixes' },
  { group: 'Temporary impairments', barrier: 'Reduced readability and navigation speed', support: 'Instant contrast, TTS, keyboard-first shortcuts' },
]

export default function Features() {
  return (
    <>
      <PageHero
        eyebrow="Everything, in one extension"
        title="Every feature exists to remove one specific barrier"
        lede="No feature here is decorative. Each one maps to a real reading, seeing, hearing, or moving barrier that shows up on ordinary websites."
      />

      <section className="section">
        <div className="container">
          <div className="features-list">
            {mainFeatures.map((f, i) => (
              <div className="feature-row" key={f.title}>
                <div className="feature-row-icon">
                  <f.icon width={24} height={24} />
                </div>
                <div className="feature-row-body">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <ul className="feature-row-points">
                    {f.points.map((p) => (
                      <li key={p}><IconCheck width={16} height={16} /> {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section mapping-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who it's for</span>
            <h2>Barrier to support, mapped directly</h2>
            <p>NeuroAccess is an assistive tool, not a medical treatment — it helps people navigate and read the web more effectively.</p>
          </div>

          <div className="mapping-table card">
            <div className="mapping-header">
              <span>User group</span>
              <span>Common barrier</span>
              <span>NeuroAccess support</span>
            </div>
            {mapping.map((row) => (
              <div className="mapping-row" key={row.group}>
                <span className="mapping-group">{row.group}</span>
                <span className="mapping-barrier">{row.barrier}</span>
                <span className="mapping-support">{row.support}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner cta-banner-flat">
            <div>
              <h2>Ready to try one-click mode?</h2>
              <p>Install the extension and run your first audit in under a minute.</p>
            </div>
            <Link to="/setup" className="btn btn-primary btn-lg">
              Get the extension <IconArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .features-list { display: flex; flex-direction: column; gap: 28px; }
        .feature-row {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 24px;
          padding: 28px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .feature-row-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: var(--primary-soft);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
        }
        .feature-row-body h3 { font-size: 19px; margin-bottom: 8px; }
        .feature-row-points {
          display: flex; flex-wrap: wrap; gap: 10px 22px;
          margin-top: 14px;
        }
        .feature-row-points li {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--text);
        }
        .feature-row-points svg { color: var(--accent); flex-shrink: 0; }

        .mapping-section { background: var(--bg-soft); }
        .mapping-table { overflow: hidden; }
        .mapping-header, .mapping-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.4fr;
          gap: 16px;
          padding: 16px 22px;
        }
        .mapping-header {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-faint);
          border-bottom: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .mapping-row { border-bottom: 1px solid var(--border); font-size: 14.5px; }
        .mapping-row:last-child { border-bottom: none; }
        .mapping-group { font-weight: 600; color: var(--text); }
        .mapping-barrier, .mapping-support { color: var(--text-muted); }

        .cta-banner-flat {
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .cta-banner-flat h2 { color: var(--text); font-size: clamp(24px, 3vw, 32px); }
        .cta-banner-flat p { color: var(--text-muted); }

        @media (max-width: 700px) {
          .feature-row { grid-template-columns: 1fr; }
          .mapping-header { display: none; }
          .mapping-row { grid-template-columns: 1fr; gap: 6px; }
          .mapping-barrier::before { content: 'Barrier: '; color: var(--text-faint); }
          .mapping-support::before { content: 'Support: '; color: var(--text-faint); }
        }
      `}</style>
    </>
  )
}
