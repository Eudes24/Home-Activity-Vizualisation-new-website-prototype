import { useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import useTooltip from '../charts/useTooltip.js'
import Sparkline from '../charts/Sparkline.jsx'
import DonutChart from '../charts/DonutChart.jsx'
import DetectionsOverTimeChart from '../charts/raw/DetectionsOverTimeChart.jsx'
import DayOfWeekChart from '../charts/raw/DayOfWeekChart.jsx'
import CalendarHeatmap from '../charts/raw/CalendarHeatmap.jsx'
import HourOfDayChart from '../charts/raw/HourOfDayChart.jsx'
import PresenceTimelineChart from '../charts/raw/PresenceTimelineChart.jsx'
import CumulativeChart from '../charts/raw/CumulativeChart.jsx'
import SummaryTable from '../charts/raw/SummaryTable.jsx'
import {
  months,
  hours,
  dailyDetections,
  totalDetections,
  meanPerDay,
  detectionsByWeekday,
  detectionsByHour,
  roomBreakdown,
  presenceRatio,
  presenceAnomalies,
  cumulativeDetections,
  timeDistribution,
  totalHours,
  calendarHeatmap,
  summaryRows,
  summaryTotals,
} from './rawDetectionData.js'
import './RawDetectionDashboard.css'

const TABS = ['Overview', 'Day', 'Week', 'Month', 'Quarter']

const peakHourIndex = detectionsByHour.indexOf(Math.max(...detectionsByHour))
const recentDaily = dailyDetections.slice(-30).map((d) => d.value)

export default function RawDetectionDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const tooltip = useTooltip()

  return (
    <div className="dash raw-dash">
      <TopBar
        participant="Domassist110"
        dateRange="Nov 2016 – Dec 2017"
        pageTitle="Raw detection dashboard"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="metric-row raw-metric-row">
        <div className="metric-card">
          <div className="metric-label">Total detections</div>
          <div className="metric-card-body">
            <div className="metric-value">{totalDetections.toLocaleString()}</div>
            <Sparkline data={recentDaily} />
          </div>
          <div className="metric-sub">Total events</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Detection / day (mean)</div>
          <div className="metric-card-body">
            <div className="metric-value">{meanPerDay}</div>
            <Sparkline data={recentDaily} color="#4ea768" />
          </div>
          <div className="metric-sub">Last 30 days</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Rooms monitored</div>
          <div className="metric-value">{roomBreakdown.length}</div>
          <div className="metric-sub">Active sensors</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Peak hour</div>
          <div className="metric-value">{String(hours[peakHourIndex]).padStart(2, '0')}:00</div>
          <div className="metric-sub">Highest mean activity</div>
        </div>
      </div>

      <div className="raw-row raw-row-primary">
        <div className="card">
          <div className="card-title">Detections over time</div>
          <DetectionsOverTimeChart data={dailyDetections} />
        </div>
        <div className="card">
          <div className="card-title">Detections by day of week</div>
          <DayOfWeekChart data={detectionsByWeekday} tooltip={tooltip} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Detections heatmap</div>
        <div className="card-subtitle">Month × day of the month</div>
        <CalendarHeatmap rows={calendarHeatmap.rows} max={calendarHeatmap.max} tooltip={tooltip} />
      </div>

      <div className="raw-row raw-row-triple">
        <div className="card">
          <div className="card-title">Detections by hour of day (mean)</div>
          <HourOfDayChart hours={hours} data={detectionsByHour} tooltip={tooltip} />
        </div>
        <div className="card">
          <div className="card-title">Detections by room</div>
          <DonutChart
            data={roomBreakdown}
            centerValue={totalDetections.toLocaleString()}
            centerLabel="Total"
            tooltip={tooltip}
            formatTooltip={(d) => `${d.label}<br>${d.pct}% · ${d.count.toLocaleString()}`}
          />
        </div>
        <div className="card">
          <div className="card-title">Home presence ratio</div>
          <div className="legend">
            <span><span className="legend-dot" style={{ background: '#4ea768' }} />Presence</span>
            <span><span className="legend-dot" style={{ background: '#e24b4a' }} />Critical</span>
            <span><span className="legend-dot" style={{ background: '#e8c33c' }} />Warning</span>
            <span><span className="legend-dot" style={{ background: '#e0973c' }} />Moderate</span>
          </div>
          <PresenceTimelineChart months={months} data={presenceRatio} anomalies={presenceAnomalies} tooltip={tooltip} />
        </div>
      </div>

      <div className="raw-row raw-row-bottom">
        <div className="card">
          <div className="card-title">Cumulative detections</div>
          <CumulativeChart months={months} data={cumulativeDetections} tooltip={tooltip} />
        </div>
        <div className="card">
          <div className="card-title">Distribution of the time</div>
          <DonutChart
            data={timeDistribution}
            centerValue={`${totalHours.toLocaleString()}h`}
            centerLabel="Total"
            tooltip={tooltip}
            formatTooltip={(d) => `${d.label}<br>${d.pct}%`}
          />
        </div>
        <div className="card">
          <div className="card-title">Summary</div>
          <SummaryTable rows={summaryRows} totals={summaryTotals} />
        </div>
      </div>
    </div>
  )
}
