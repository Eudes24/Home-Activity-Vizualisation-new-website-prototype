import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import TemporalExploration from './pages/TemporalExploration.jsx'
import RawDetectionDashboard from './pages/RawDetectionDashboard.jsx'
import ClinicalData from './pages/ClinicalData.jsx'
import Failures from './pages/Failures.jsx'
import Sleep from './pages/activities/Sleep.jsx'
import MealPreparation from './pages/activities/MealPreparation.jsx'
import OutingsHygiene from './pages/activities/OutingsHygiene.jsx'
import TrendAnomalies from './pages/activities/TrendAnomalies.jsx'
import MobilityTransitions from './pages/activities/MobilityTransitions.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TemporalExploration />} />
          <Route path="/activities/sleep" element={<Sleep />} />
          <Route path="/activities/meals" element={<MealPreparation />} />
          <Route path="/activities/outings" element={<OutingsHygiene />} />
          <Route path="/activities/trends" element={<TrendAnomalies />} />
          <Route path="/activities/mobility" element={<MobilityTransitions />} />
          <Route path="/raw-detections" element={<RawDetectionDashboard />} />
          <Route path="/clinical-data" element={<ClinicalData />} />
          <Route path="/failures" element={<Failures />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
