export default function VisitTimeline({ visits, selected, onSelect }) {
  const step = 100 / (visits.length - 1)

  return (
    <div className="visit-timeline">
      <div className="visit-track">
        {visits.slice(0, -1).map((v, i) => (
          <div
            key={`seg-${v.key}`}
            className={`visit-segment${v.completed && visits[i + 1].completed ? ' completed' : ''}`}
            style={{ left: `${i * step}%`, width: `${step}%` }}
          />
        ))}
        {visits.map((v, i) => (
          <div key={v.key} className="visit-dot-wrap" style={{ left: `${i * step}%` }}>
            <button
              type="button"
              className={`visit-dot${v.completed ? ' completed' : ''}${selected === v.key ? ' selected' : ''}`}
              disabled={!v.completed}
              onClick={() => v.completed && onSelect(v.key)}
              aria-label={v.completed ? `View data for ${v.key}` : `${v.key} data missing`}
            />
          </div>
        ))}
      </div>
      <div className="visit-labels">
        {visits.map((v) => (
          <div className="visit-label-col" key={v.key}>
            <div className="visit-key">{v.key}</div>
            {v.sub && <div className="visit-sub">{v.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
