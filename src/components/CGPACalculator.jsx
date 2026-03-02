import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, TrendingUp } from 'lucide-react'
import { calculateCGPA, getGradeColor, getGradeDescription } from '../utils/calculations'
import CircularProgress from './CircularProgress'

const CGPACalculator = ({ semesterData, onUpdate }) => {
  const [semesters, setSemesters] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      sgpa: '',
      credits: ''
    }))
  )
  const [result, setResult] = useState({ cgpa: 0, totalCredits: 0, totalPoints: 0 })

  useEffect(() => {
    // Sync with parent data if available
    if (semesterData && semesterData.length > 0) {
      const updated = semesters.map((sem, index) => {
        const data = semesterData[index]
        if (data && data.sgpa) {
          return { ...sem, sgpa: data.sgpa, credits: data.credits }
        }
        return sem
      })
      setSemesters(updated)
    }
  }, [semesterData])

  useEffect(() => {
    const validSemesters = semesters.filter(s => s.sgpa && s.credits)
    const calculated = calculateCGPA(validSemesters)
    setResult(calculated)
    onUpdate(validSemesters)
  }, [semesters])

  const updateSemester = (index, field, value) => {
    const updated = [...semesters]
    updated[index] = { ...updated[index], [field]: value }
    setSemesters(updated)
  }

  const gradeDescription = getGradeDescription(result.cgpa)

  return (
    <div className="glass-card cgpa-calculator">
      <div className="card-header">
        <div className="card-icon">
          <Award size={20} />
        </div>
        <h2 className="card-title">CGPA Calculator</h2>
      </div>

      <div className="cgpa-display">
        <CircularProgress value={result.cgpa} maxValue={10} />
        <div className="cgpa-info">
          <div className="cgpa-value" style={{ color: getGradeColor(result.cgpa) }}>
            {result.cgpa.toFixed(2)}
          </div>
          <div className="cgpa-label">Cumulative GPA</div>
          <div className="cgpa-description">{gradeDescription}</div>
        </div>
      </div>

      <div className="semesters-input">
        <h3 className="section-title">
          <TrendingUp size={18} />
          Enter Semester Data
        </h3>
        
        <div className="semester-table">
          <div className="table-header">
            <span>Sem</span>
            <span>SGPA</span>
            <span>Credits</span>
          </div>
          
          {semesters.map((sem, index) => (
            <motion.div 
              key={sem.semester}
              className="table-row"
              whileHover={{ scale: 1.01 }}
            >
              <span className="sem-number">Sem {sem.semester}</span>
              <input
                type="number"
                className="form-input small-input"
                placeholder="0.00"
                min="0"
                max="10"
                step="0.01"
                value={sem.sgpa}
                onChange={(e) => updateSemester(index, 'sgpa', e.target.value)}
              />
              <input
                type="number"
                className="form-input small-input"
                placeholder="0"
                min="0"
                max="50"
                value={sem.credits}
                onChange={(e) => updateSemester(index, 'credits', e.target.value)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="cgpa-result-details">
        <div className="result-detail">
          <div className="result-detail-value">{result.totalCredits}</div>
          <div className="result-detail-label">Completed Credits</div>
        </div>
        <div className="result-detail">
          <div className="result-detail-value">{result.totalPoints.toFixed(0)}</div>
          <div className="result-detail-label">Total Points</div>
        </div>
      </div>

      <style>{`
        .cgpa-calculator {
          padding: var(--space-lg);
        }

        .cgpa-display {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
          margin-bottom: var(--space-lg);
          padding: var(--space-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .cgpa-info {
          flex: 1;
          text-align: center;
        }

        .cgpa-value {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
        }

        .cgpa-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: var(--space-xs);
        }

        .cgpa-description {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: var(--space-xs);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--space-md);
          color: var(--text-primary);
        }

        .semester-table {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .table-header {
          display: grid;
          grid-template-columns: 60px 1fr 1fr;
          gap: var(--space-sm);
          padding: var(--space-sm);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 60px 1fr 1fr;
          gap: var(--space-sm);
          padding: var(--space-sm);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          align-items: center;
        }

        .sem-number {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .small-input {
          padding: var(--space-xs) var(--space-sm);
          text-align: center;
          font-size: 0.875rem;
        }

        .cgpa-result-details {
          display: flex;
          justify-content: center;
          gap: var(--space-xl);
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .cgpa-display {
            flex-direction: column;
            gap: var(--space-md);
          }

          .cgpa-value {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default CGPACalculator
