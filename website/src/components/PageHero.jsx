export default function PageHero({ eyebrow, title, lede, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
      <style>{`
        .page-hero {
          padding: 72px 0 56px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .page-hero h1 {
          font-size: clamp(32px, 4.5vw, 46px);
          max-width: 16ch;
        }
      `}</style>
    </section>
  )
}
