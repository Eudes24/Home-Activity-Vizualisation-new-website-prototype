export default function SegmentedSelect({ options, value, onChange }) {
  return (
    <div className="segmented-select">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`segmented-option${option === value ? ' active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
