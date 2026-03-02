import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { calculateRequiredSGPA, getGradeColor } from '../utils/calculations'

const PredictionCalculator = ({ cgpaData }) => {
  const [targetCGPA, setTargetCGPA] = useState(8.0)
  const [remainingSemesters, setRemainingSemesters] = useState(4)
  const [creditsPerSemester, setCreditsPerSemester] = useState(24)
  const [result, setResult] = useState(null)

  const targets = [7.0, 7.5, 8.0, 8.5, 9.0]

  useEffect(() => {
    // Calculate current CGPA and credits from data
    let currentCGPA = 0
    let completedCredits = 0

    cgpaData.forEach(sem => {
      if (sem.sgpa && sem.credits) {
        currentCGPA = sem.sgpa
        completedCredits += parseFloat(sem.credits)
      }
    })

    if (completedCredits > 0) {
      // Recalculate weighted CGPA
      let totalPoints = 0
      cgpaData.forEach(sem => {
        if (sem.sgpa && sem.credits) {
          totalPoints += sem.sgpa * sem.credits
        }
      })
      currentCGPA = totalPoints / completedCredits
    }

    const calculated = calculateRequiredSGPA(
      currentCGPA || 0,
      completedCredits || 0,
      targetCGPA,
      remainingSemesters,
      creditsPerSemester
    )

    setResult({
      ...calculated,
      currentCGPA: currentCGPA || 0,
      completedCredits: completedCredits || 0
    })
  }, [cgpaData, targetCGPA, remainingSemesters, creditsPerSemester])

  return (
    <div className="glass-card prediction-calculator">
      <div className="card-header">
        <div className="card-icon">
          <Target size={20} />
        </div>
        <h2 className="card-title">Result Prediction</h2>
      </div>

      <div className="prediction-inputs">
        <div className="form-group">
          <label className="form-label">Target CGPA</label>
          <div className="target-buttons">
            {targets.map(target => (
              <motion.button
                key={target}
                className={`target-btn ${targetCGPA === target ? 'active' : ''}`}
                onClick={() => setTargetCGPA(target)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  '--target-color': getGradeColor(target)
                }}
              >
                {target}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Remaining Semesters</label>
            <select
              className="form-select"
              value={remainingSemesters}
              onChange={(e) => setRemainingSemesters(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Credits/Semester</label>
            <select
              className="form-select"
              value={creditsPerSemester}
              onChange={(e) => setCreditsPerSemester(parseInt(e.target.value))}
            >
              {[20, 21, 22, 23, 24, 25, 26].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <motion.div 
          className="prediction-result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="current-status">
            <div className="status-item">
              <span className="status-label">Current CGPA</span>
              <span className="status-value">{result.currentCGPA.toFixed(2)}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Completed Credits</span>
              <span className="status-value">{result.completedCredits}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Target CGPA</span>
              <span className="status-value target">{targetCGPA.toFixed(1)}</span>
            </div>
          </div>

          <div className={`required-sgpa ${result.achievable ? 'achievable' : 'not-achievable'}`}>
            {result.achievable ? (
              <>
                <CheckCircle className="result-icon success" size={24} />
                <div className="required-info">
                  <span className="required-label">Required SGPA</span>
                  <span className="required-value">{result.requiredSGPA?.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="result-icon warning" size={24} />
                <div className="required-info">
                  <span className="required-label">Not Achievable</span>
                  <span className="required-message">{result.message}</span>
                </div>
              </>
            )}
          </div>

          <div className="roadmap">
            <h4 className="roadmap-title">
              <TrendingUp size={16} />
              Progress Roadmap
            </h4>
            <div className="roadmap-bar">
              <motion.div 
                className="roadmap-progress"
                initial={{ width: 0 }}
                animate={{ width: `${(result.completedCredits / 192) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <div className="roadmap-markers">
                <span>0</span>
                <span className="marker-current">{result.currentCGPA.toFixed(1)}</span>
                <span>{targetCGPA}</span>
                <span>10</span>
              </div>
            </div>
            <p className="roadmap-note">
              {result.achievable 
                ? `Maintain ${result.requiredSGPA?.toFixed(2)}+ SGPA in next ${remainingSemesters} semester${remainingSemesters > 1 ? 's' : ''}`
                : 'Target is beyond maximum achievable CGPA of 10.0'
              }
            </p>
          </div>
        </motion.div>
      )}

      <style>{`
        .prediction-calculator {
          padding: var(--space-lg);
        }

        .prediction-inputs {
          margin-bottom: var(--space-lg);
        }

        .target-buttons {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .target-btn {
          flex: 1;
          min-width: 50px;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .target-btn.active {
          background: var(--target-color);
          border-color: var(--target-color);
          color: white;
          box-shadow: 0 4px 12px color-mix(in srgb, var(--target-color) 40%, transparent);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          margin-top: var(--space-md);
        }

        .prediction-result {
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
        }

        .current-status {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--border-color);
        }

        .status-item {
          text-align: center;
        }

        .status-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: var(--space-xs);
        }

        .status-value.target {
          color: var(--accent-primary);
        }

        .required-sgpa {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
        }

        .required-sgpa.achievable {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success);
        }

        .required-sgpa.not-achievable {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid var(--warning);
        }

        .result-icon.success {
          color: var(--success);
        }

        .result-icon.warning {
          color: var(--warning);
        }

        .required-info {
          flex: 1;
        }

        .required-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .required-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--success);
        }

        .required-message {
          font-size: 0.875rem;
          color: var(--warning);
        }

        .roadmap {
          margin-top: var(--space-md);
        }

        .roadmap-title {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
        }

        .roadmap-bar {
          position: relative;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .roadmap-progress {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 4px;
        }

        .roadmap-markers {
          display: flex;
          justify-content: space-between;
          margin-top: var(--space-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .marker-current {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .roadmap-note {
          margin-top: var(--space-md);
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-align: center;
        }

        @media (max-width: 768px) {
          .target-buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .current-status {
            flex-wrap: wrap;
            gap: var(--space-md);
          }

          .status-item {
            flex: 1;
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  )
}

export default PredictionCalculator
