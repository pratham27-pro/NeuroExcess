import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>That page took a wrong turn</h1>
        <p style={{ margin: '0 auto 28px' }}>The page you're looking for doesn't exist, or has moved.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  )
}
