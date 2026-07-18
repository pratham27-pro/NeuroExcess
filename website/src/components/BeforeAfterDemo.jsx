import { useState } from 'react'
import { IconContrast, IconCheck, IconImage } from './Icons.jsx'

// The one signature element of the site: a static mock webpage the visitor
// can toggle between "before" (typical low-contrast, unlabeled, dense page)
// and "after" (what NeuroAccess's one-click mode produces). No auto-play,
// no scroll animation — the visitor drives the only motion on the page.
export default function BeforeAfterDemo() {
  const [fixed, setFixed] = useState(true)

  return (
    <div className={'bad-card' + (fixed ? ' is-fixed' : '')}>
      <div className="bad-toolbar">
        <div className="bad-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="bad-url">gov-portal.example/apply</div>
      </div>

      <div className="bad-body">
        <div className="bad-mock-image">
          <IconImage width={26} height={26} />
          {fixed && <span className="bad-alt-chip">Alt text: "Application form, section 2 of 4"</span>}
        </div>
        <div className={'bad-line bad-line-h' + (fixed ? '' : ' is-low-contrast')} />
        <div className={'bad-line' + (fixed ? '' : ' is-low-contrast')} style={{ width: '92%' }} />
        <div className={'bad-line' + (fixed ? '' : ' is-low-contrast')} style={{ width: '78%' }} />
        <div className={'bad-line' + (fixed ? '' : ' is-low-contrast')} style={{ width: '85%' }} />
        <div className="bad-actions">
          <span className={'bad-btn' + (fixed ? '' : ' is-low-contrast')}>Continue</span>
          <span className={'bad-focus' + (fixed ? ' show-focus' : '')} aria-hidden="true" />
        </div>
      </div>

      <div className="bad-footer">
        <div className="bad-status">
          {fixed ? (
            <>
              <IconCheck width={16} height={16} />
              <span>Contrast fixed · 3 images labeled · focus order repaired</span>
            </>
          ) : (
            <>
              <IconContrast width={16} height={16} />
              <span>4 accessibility issues detected</span>
            </>
          )}
        </div>
        <button type="button" className="bad-toggle" onClick={() => setFixed((v) => !v)}>
          {fixed ? 'View original page' : 'Run one-click fix'}
        </button>
      </div>

      <style>{`
        .bad-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .bad-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-soft);
          border-bottom: 1px solid var(--border);
        }
        .bad-dots { display: flex; gap: 6px; }
        .bad-dots span {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--border-strong);
        }
        .bad-url {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-faint);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
        }
        .bad-body { padding: 24px; }
        .bad-mock-image {
          position: relative;
          height: 96px;
          border-radius: 12px;
          background: var(--bg-soft);
          border: 1px dashed var(--border-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-faint);
          margin-bottom: 20px;
        }
        .bad-alt-chip {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          font-size: 11.5px;
          font-family: var(--font-mono);
          background: var(--accent-soft);
          color: var(--accent);
          border: 1px solid var(--accent);
          padding: 5px 10px;
          border-radius: 8px;
        }
        .bad-line {
          height: 12px;
          border-radius: 6px;
          background: var(--text);
          opacity: 0.82;
          margin-bottom: 10px;
        }
        .bad-line-h { height: 16px; width: 60%; opacity: 1; }
        .bad-line.is-low-contrast, .bad-line-h.is-low-contrast {
          background: var(--border-strong);
          opacity: 1;
        }
        .bad-actions { margin-top: 18px; display: flex; align-items: center; gap: 10px; position: relative; }
        .bad-btn {
          display: inline-block;
          padding: 9px 20px;
          border-radius: var(--radius-pill);
          background: var(--primary);
          color: var(--on-primary);
          font-size: 13.5px;
          font-weight: 500;
        }
        .bad-btn.is-low-contrast {
          background: var(--bg-soft);
          color: var(--text-faint);
          border: 1px solid var(--border);
        }
        .bad-focus {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .bad-focus.show-focus {
          border-color: var(--primary);
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .bad-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid var(--border);
          background: var(--bg-soft);
          flex-wrap: wrap;
        }
        .bad-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: var(--text-muted);
        }
        .is-fixed .bad-status { color: var(--accent); }
        .bad-toggle {
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color var(--duration) ease, color var(--duration) ease;
        }
        .bad-toggle:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>
    </div>
  )
}
