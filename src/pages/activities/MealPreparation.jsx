import { useState } from 'react'
import TopBar from '../../components/TopBar.jsx'
import SegmentedSelect from '../../components/SegmentedSelect.jsx'
import useTooltip from '../../charts/useTooltip.js'
import StartTimeTrendChart from '../../charts/StartTimeTrendChart.jsx'
import DailySpreadChart from '../../charts/DailySpreadChart.jsx'
import HourlyDistributionChart from '../../charts/HourlyDistributionChart.jsx'
import MonthlyFrequencyChart from '../../charts/MonthlyFrequencyChart.jsx'
import { months, monthLabels, hours, trendData, spreadData, bellData, monthlyData } from './mealData.js'
import './MealPreparation.css'

const TABS = ['Overview', 'Day', 'Week', 'Month', 'Quarter']
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner']

export default function MealPreparation() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [mealType, setMealType] = useState('Breakfast')
  const tooltip = useTooltip()

  return (
    <div className="dash">
      <h2 className="sr-only">Participant Domassist110 health monitoring dashboard, November 2016 to December 2017.</h2>

      <TopBar
        participant="Domassist110"
        dateRange="Nov 2016 – Dec 2017"
        pageTitle="Activity : Meals Preparation"
        pills={[
          { type: 'danger', label: '3 failures' },
          { type: 'success', label: '4/5 sensors installed' },
        ]}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightControl={<SegmentedSelect options={MEAL_TYPES} value={mealType} onChange={setMealType} />}
      />

      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-label">Detections</div>
          <div className="metric-value">179</div>
          <div className="metric-sub"><span className="dot-red" />8 spikes</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Mean time</div>
          <div className="metric-value">7h36</div>
          <div className="metric-sub"><span className="dot-red" />14 spikes</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Mean duration</div>
          <div className="metric-value">11 min</div>
          <div className="metric-sub" style={{ color: 'var(--color-text-tertiary)' }}>avg per event</div>
        </div>
        <div className="metric-card green">
          <div className="metric-label">Sensor baseline</div>
          <div className="metric-value">100%</div>
          <div className="metric-sub" style={{ color: '#639922' }}>All installed</div>
        </div>
      </div>

      <div className="alert-row">
        <div className="alert-card danger">
          <span>2 major clinical events</span>
          <span>›</span>
        </div>
        <div className="alert-card info">
          <span>Clinical data related to meals</span>
          <span>›</span>
        </div>
      </div>

      <div className="charts-row">
        <div className="card">
          <div className="card-title">Start time trend over time</div>
          <div className="legend">
            <span><span className="legend-dot" style={{ background: '#378add' }} />Probable detection</span>
            <span><span className="legend-dot" style={{ background: '#888780' }} />Weak detection</span>
            <span><span className="legend-dot" style={{ background: '#e24b4a' }} />Failure</span>
          </div>
          <StartTimeTrendChart months={months} data={trendData} tooltip={tooltip} />
        </div>
        <div className="card">
          <div className="card-title">Detection start time — daily spread</div>
          <div className="legend">
            <span><span className="legend-dot" style={{ background: '#378add' }} />Start time (min from midnight)</span>
            <span><span className="legend-dot" style={{ background: '#e24b4a' }} />Failure</span>
          </div>
          <DailySpreadChart months={months} data={spreadData} tooltip={tooltip} />
        </div>
      </div>

      <div className="bottom-row">
        <div className="card">
          <div className="card-title">Hourly distribution of detections</div>
          <div className="info-strip">75% of detections occur between 7:00 AM and 7:29 AM</div>
          <HourlyDistributionChart hours={hours} data={bellData} tooltip={tooltip} />
        </div>
        <div className="card">
          <div className="card-title">Monthly detection frequency</div>
          <SegmentedSelect options={['Month', 'Week', 'Quarter']} value="Month" onChange={() => {}} />
          <MonthlyFrequencyChart monthLabels={monthLabels} data={monthlyData} tooltip={tooltip} />
        </div>
      </div>
    </div>
  )
}
