import TopBar from './TopBar.jsx'
import './PlaceholderPage.css'

export default function PlaceholderPage({ pageTitle }) {
  return (
    <div className="placeholder-page">
      <TopBar
        participant="Domassist110"
        dateRange="Nov 2016 – Dec 2017"
        pageTitle={pageTitle}
      />
      <div className="placeholder-body">
        <p>This page is not built yet.</p>
      </div>
    </div>
  )
}
