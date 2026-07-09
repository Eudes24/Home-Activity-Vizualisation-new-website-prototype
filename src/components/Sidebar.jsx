import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDownIcon, ChevronRightIcon, SidebarCollapseIcon, SidebarExpandIcon } from './icons.jsx'
import './Sidebar.css'

const activityItems = [
  { to: '/activities/sleep', label: 'Sleep' },
  { to: '/activities/meals', label: 'Meal preparation' },
  { to: '/activities/outings', label: 'Outings, Home presence & Hygiene' },
  { to: '/activities/trends', label: 'Trend & Anomalies' },
  { to: '/activities/mobility', label: 'Mobility & transitions' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activitiesOpen, setActivitiesOpen] = useState(true)

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-title">MAIN MENU</span>}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <SidebarExpandIcon /> : <SidebarCollapseIcon />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-hidden={collapsed}>
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Temporal exploration
        </NavLink>

        <button
          type="button"
          className="nav-group-toggle"
          onClick={() => setActivitiesOpen((v) => !v)}
          aria-expanded={activitiesOpen}
        >
          <ChevronDownIcon className={`nav-group-chevron${activitiesOpen ? '' : ' collapsed'}`} />
          Activities
        </button>

        {activitiesOpen && (
          <div className="nav-sub">
            {activityItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-sub-item${isActive ? ' active' : ''}`}
              >
                <ChevronRightIcon className="nav-sub-bullet" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        <NavLink to="/raw-detections" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Raw detection dashboard
        </NavLink>
        <NavLink to="/clinical-data" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Clinical data
        </NavLink>
        <NavLink to="/failures" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Failures
        </NavLink>
      </nav>
    </aside>
  )
}
