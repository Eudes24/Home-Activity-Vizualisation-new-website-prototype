import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import WeeklyTimelineChart from '../charts/temporal/WeeklyTimelineChart.jsx'
import {
  ACTIVITY_TYPES,
  SENSOR_TYPES,
  SENSOR_RULES,
  weekData,
  weekLabel,
  weeklyTotals,
  transitionsThisWeek,
  sleepMetrics,
  anomalies,
  fmtTime,
  fmtDuration,
} from './temporalWeekData.js'
import './TemporalExploration.css'

const TABS = ['Weekly view', 'Day view', 'Monthly view', 'Yearly view']
const totals = weeklyTotals()

function DeltaIndicator({ minutes, avg }) {
  const positive = minutes >= 0
  return (
    <span className="metric-delta">
      <span className={`delta-arrow ${positive ? 'up' : 'down'}`}>{positive ? '↑' : '↓'}</span>
      {positive ? '+' : ''}{minutes} min
      <span> · {avg}</span>
    </span>
  )
}

export default function TemporalExploration() {
  const [activeTab, setActiveTab] = useState('Weekly view')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleSelect = (day, segment) => setSelectedEvent({ day, ...segment })

  return (
    <div className="dash temporal-dash">
      <TopBar
        participant="Domassist110"
        dateRange="Nov 2016 – Dec 2017"
        pageTitle="Temporal exploration"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab !== 'Weekly view' ? (
        <div className="temporal-empty">This view is not built yet.</div>
      ) : (
        <>
          <div className="metric-row">
            <div className="metric-card">
              <div className="metric-label">Sleep</div>
              <div className="metric-value">{sleepMetrics.duration.value}</div>
              <div className="metric-sub"><DeltaIndicator minutes={sleepMetrics.duration.deltaMinutes} avg={sleepMetrics.duration.avg} /></div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Bedtime</div>
              <div className="metric-value">{sleepMetrics.bedtime.value}</div>
              <div className="metric-sub"><DeltaIndicator minutes={sleepMetrics.bedtime.deltaMinutes} avg={sleepMetrics.bedtime.avg} /></div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Wake time</div>
              <div className="metric-value">{sleepMetrics.wakeTime.value}</div>
              <div className="metric-sub"><DeltaIndicator minutes={sleepMetrics.wakeTime.deltaMinutes} avg={sleepMetrics.wakeTime.avg} /></div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Awakenings</div>
              <div className="metric-value">{sleepMetrics.awakenings.value}</div>
              <div className="metric-sub"><DeltaIndicator minutes={sleepMetrics.awakenings.deltaMinutes} avg={sleepMetrics.awakenings.avg} /></div>
            </div>
          </div>

          <div className="temporal-main-row">
            <div className="card timeline-card">
              <div className="card-title">Weekly activity timeline</div>
              <div className="card-subtitle">{weekLabel}</div>
              <div className="legend">
                {Object.values(ACTIVITY_TYPES).map((a) => (
                  <span key={a.label}><span className="legend-dot" style={{ background: a.color }} />{a.label}</span>
                ))}
              </div>
              <WeeklyTimelineChart weekData={weekData} selected={selectedEvent} onSelect={handleSelect} />
            </div>

            <div className="temporal-side-col">
              <div className="card event-detail-card">
                <div className="card-title">Event detail</div>
                {selectedEvent ? (
                  <div className="event-detail-body">
                    <div className="event-detail-heading">
                      <span className="legend-dot" style={{ background: ACTIVITY_TYPES[selectedEvent.type].color }} />
                      {ACTIVITY_TYPES[selectedEvent.type].label} · {selectedEvent.day}
                    </div>
                    <div className="event-detail-time">
                      {fmtTime(selectedEvent.start)} – {fmtTime(selectedEvent.end)}
                    </div>
                    <div className="event-detail-duration">
                      Duration: <strong>{fmtDuration(selectedEvent.end - selectedEvent.start)}</strong>
                    </div>
                    <div className="event-detail-sensors-label">Sensors involved</div>
                    <ul className="sensor-list">
                      {SENSOR_RULES[selectedEvent.type].map((s) => (
                        <li key={s.name}>
                          <span className="legend-dot" style={{ background: SENSOR_TYPES[s.type].color }} />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="event-detail-placeholder">Hover or click an event on the timeline</div>
                )}
              </div>

              <div className="card summary-card">
                <div className="card-title">7 Day summary - {weekLabel}</div>
                <ul className="summary-list">
                  <li><span>Sleep</span><span>{fmtDuration(totals.sleep)}</span></li>
                  <li><span>Meal preparation</span><span>{fmtDuration(totals.meals)}</span></li>
                  <li><span>Outings</span><span>{fmtDuration(totals.outings)}</span></li>
                  <li><span>Bathroom</span><span>{fmtDuration(totals.bathroom)}</span></li>
                  <li><span>Transitions</span><span>{transitionsThisWeek}</span></li>
                </ul>
              </div>

              <div className="card anomalies-card">
                <div className="card-title">Anomalies</div>
                <ul className="anomalies-list">
                  {anomalies.map((a) => (
                    <li key={a.label}>
                      <span className="anomaly-bar" style={{ background: a.color }} />
                      <div>
                        <div className="anomaly-label">{a.label}</div>
                        <div className="anomaly-detail">{a.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
