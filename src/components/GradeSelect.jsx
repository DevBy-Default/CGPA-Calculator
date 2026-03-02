import { GRADES, GRADE_POINTS } from '../utils/calculations'

const GradeSelect = ({ value, onChange, className = '' }) => {
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {GRADES.map(grade => (
        <option key={grade} value={grade}>
          {grade} ({GRADE_POINTS[grade]})
        </option>
      ))}
    </select>
  )
}

export default GradeSelect
