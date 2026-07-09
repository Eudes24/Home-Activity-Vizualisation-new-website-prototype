import { CalendarIcon, CheckIcon } from './icons.jsx'
import './TopBar.css'

export default function TopBar({
  participant,
  dateRange,
  pageTitle,
  pills = [],
  tabs = [],
  activeTab,
  onTabChange,
  rightControl,
}) {
  return (
    <div className="top-bar-block">
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="top-bar-label">Participant</span>
          <span className="participant-badge">{participant}</span>
          <span className="period-badge">
            <CalendarIcon style={{ marginRight: 4, verticalAlign: -1 }} />
            {dateRange}
          </span>
          {pageTitle && <span className="page-title">{pageTitle}</span>}
        </div>
        <div className="top-bar-right">
          {pills.map((pill) => (
            <span key={pill.label} className={`pill pill-${pill.type}`}>
              {pill.type === 'danger' && <span className="dot-red" />}
              {pill.type === 'success' && <CheckIcon />}
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {(tabs.length > 0 || rightControl) && (
        <div className="tabs-row">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab${tab === activeTab ? ' active' : ''}`}
                onClick={() => onTabChange && onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {rightControl}
        </div>
      )}
    </div>
  )
}
