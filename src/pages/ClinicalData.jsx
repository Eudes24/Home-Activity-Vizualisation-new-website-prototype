import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import VisitTimeline from '../charts/clinical/VisitTimeline.jsx'
import Sparkline from '../charts/Sparkline.jsx'
import {
  participant,
  participationPeriod,
  visits,
  statusCards,
  clinicalBackground,
  assessments,
  secondaryMeasures,
  majorEvents,
} from './clinicalData.js'
import './ClinicalData.css'

const TABS = ['Overview', 'Day', 'Week', 'Month', 'Quarter']

export default function ClinicalData() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedVisit, setSelectedVisit] = useState('T12')

  const [medicalConditions, chronicDiseases, sensoryImpairments, mobilityLimitations, medications] = clinicalBackground

  return (
    <div className="dash clinical-dash">
      <TopBar
        participant="Domassist110"
        pageTitle="Clinical data"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightStats={[
          { label: 'Age', value: participant.age },
          { label: 'Sex', value: participant.sex },
          { label: 'Living Area', value: participant.livingArea },
        ]}
      />

      <div className="card participation-card">
        <div className="participation-period">Participation period : {participationPeriod}</div>
        <VisitTimeline visits={visits} selected={selectedVisit} onSelect={setSelectedVisit} />
        <div className="timeline-legend">
          <span><span className="legend-dot completed-dot" />Completed</span>
          <span><span className="legend-dot missing-dot" />Missing</span>
        </div>
      </div>

      <div className="status-row">
        {statusCards.map((title) => (
          <div className="card status-card" key={title}>
            <div className="card-title">{title}</div>
          </div>
        ))}
      </div>

      <div className="clinical-main-grid">
        <div className="card clinical-background-card">
          <div className="card-title">Clinical Background</div>
          <div className="background-pair-row">
            <div className="background-item">
              <div className="background-label">{medicalConditions.label}</div>
              <div className="background-value">{medicalConditions.value}</div>
            </div>
            <div className="background-item">
              <div className="background-label">{chronicDiseases.label}</div>
              <div className="background-value">{chronicDiseases.value}</div>
            </div>
          </div>
          <div className="background-item full zebra">
            <div className="background-label">{sensoryImpairments.label}</div>
            <div className="background-value">{sensoryImpairments.value}</div>
          </div>
          <div className="background-item full">
            <div className="background-label">{mobilityLimitations.label}</div>
            <div className="background-value">{mobilityLimitations.value}</div>
          </div>
          <div className="background-item full zebra">
            <div className="background-label">{medications.label}</div>
          </div>
        </div>

        <div className="card assessments-card">
          <div className="card-title">Objective clinical assessments</div>
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Test/Measure</th>
                <th>T0<span className="th-sub">Sep 2016</span></th>
                <th>T6<span className="th-sub">Mar 2017</span></th>
                <th>T12<span className="th-sub">Sep 2017</span></th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((row) => (
                <tr key={row.label} className={row.highlighted ? 'highlighted' : ''}>
                  <td>{row.label}</td>
                  {row.values.map((v, i) => <td key={i}>{v}</td>)}
                  <td><Sparkline data={row.values} color="#e24b4a" width={56} height={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card secondary-measures-card">
          <div className="card-title">Additional clinical measures</div>
          <table className="clinical-table">
            <thead>
              <tr><th>Measure</th><th>T0</th><th>T6</th><th>T12</th></tr>
            </thead>
            <tbody>
              {secondaryMeasures.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {row.values.map((v, i) => <td key={i}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card events-card">
          <div className="card-title">Major clinical events</div>
          <div className="events-header">
            <span>Date</span><span>Event type</span><span>Details</span>
          </div>
          <ul className="events-list">
            {majorEvents.map((ev) => (
              <li key={ev.date}>
                <span className="event-dot" />
                <span className="event-date">{ev.date}</span>
                <span className="event-type">{ev.type}</span>
                <span className="event-details">{ev.details}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
