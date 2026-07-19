export default function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
      <style>{`
        .skip-link {
          position: fixed;
          top: -60px;
          left: 16px;
          z-index: 1000;
          background: var(--primary);
          color: var(--on-primary);
          padding: 12px 20px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          transition: top 120ms ease;
        }
        .skip-link:focus {
          top: 16px;
        }
      `}</style>
    </a>
  )
}
