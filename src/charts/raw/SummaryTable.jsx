export default function SummaryTable({ rows, totals }) {
  return (
    <div className="summary-table-wrap">
      <table className="summary-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Detections</th>
            <th>Avg/Day</th>
            <th>Time inside (avg/day)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.detections.toLocaleString()}</td>
              <td>{r.avgPerDay}</td>
              <td>{r.timeInsideAvg}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="summary-total-row">
            <td>Total / Avg</td>
            <td>{totals.detections.toLocaleString()}</td>
            <td>{totals.avgPerDay}</td>
            <td>{totals.timeInsideAvg}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
