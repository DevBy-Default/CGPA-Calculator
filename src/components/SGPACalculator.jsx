import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Save, FileDown, RotateCcw, Award } from 'lucide-react'
import { calculateSGPA, GRADES, GRADE_POINTS } from '../utils/calculations'
import { getSemesterSubjects, getSemesterCredits, RTU_CSE_SYLLABUS } from '../data/rtuSyllabus'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const SGPACalculator = ({ onSave, department, year, initialData }) => {
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [subjects, setSubjects] = useState([])
  const [result, setResult] = useState({ sgpa: 0, totalCredits: 0, totalPoints: 0 })
  const [showResult, setShowResult] = useState(false)

  // Get available semesters based on year
  const availableSemesters = useMemo(() => {
    const yearSemMap = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8] }
    return year ? yearSemMap[year] || [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5, 6, 7, 8]
  }, [year])

  // Initialize subjects when semester changes
  useEffect(() => {
    const rtuSubjects = getSemesterSubjects(selectedSemester)
    const subjectsWithGrades = rtuSubjects.map(sub => ({
      ...sub,
      grade: 'A' // Default grade
    }))
    
    // If there's saved data for this semester, load it
    if (initialData && initialData[selectedSemester]) {
      const savedSubjects = initialData[selectedSemester].subjects || []
      const mergedSubjects = subjectsWithGrades.map(sub => {
        const saved = savedSubjects.find(s => s.name === sub.name)
        return saved ? { ...sub, grade: saved.grade } : sub
      })
      setSubjects(mergedSubjects)
    } else {
      setSubjects(subjectsWithGrades)
    }
    setShowResult(false)
  }, [selectedSemester, initialData])

  // Calculate SGPA whenever subjects change
  useEffect(() => {
    const calculated = calculateSGPA(subjects)
    setResult(calculated)
  }, [subjects])

  const updateGrade = (subjectId, grade) => {
    setSubjects(subjects.map(s => 
      s.id === subjectId ? { ...s, grade } : s
    ))
    setShowResult(true)
  }

  const resetGrades = () => {
    setSubjects(subjects.map(s => ({ ...s, grade: 'A' })))
    setShowResult(false)
  }

  const saveSemester = () => {
    onSave(selectedSemester, {
      ...result,
      subjects: subjects,
      department,
      year
    })
    setShowResult(true)
  }

  const exportPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(20)
      doc.setTextColor(0, 100, 200)
      doc.text('RTU B.Tech CGPA Calculator', 105, 20, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setTextColor(60, 60, 60)
      doc.text(`Semester ${selectedSemester} - Grade Report`, 105, 30, { align: 'center' })
      
      if (department) {
        doc.setFontSize(10)
        doc.text(`Department: ${department.toUpperCase()}`, 105, 38, { align: 'center' })
      }
      
      // Table header
      let yPos = 50
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFillColor(0, 100, 200)
      doc.rect(15, yPos, 180, 10, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text('Subject', 17, yPos + 7)
      doc.text('Credits', 100, yPos + 7)
      doc.text('Grade', 125, yPos + 7)
      doc.text('Points', 150, yPos + 7)
      doc.text('Total', 175, yPos + 7)
      
      // Table body
      yPos += 15
      doc.setTextColor(0, 0, 0)
      
      subjects.forEach((sub, index) => {
        const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255]
        doc.setFillColor(...bgColor)
        doc.rect(15, yPos - 4, 180, 10, 'F')
        
        const points = (sub.credits || 0) * (GRADE_POINTS[sub.grade] || 0)
        
        // Truncate long subject names
        const subjectName = sub.name.length > 35 ? sub.name.substring(0, 32) + '...' : sub.name
        
        doc.text(subjectName, 17, yPos + 3)
        doc.text(sub.credits.toString(), 105, yPos + 3)
        doc.text(sub.grade, 128, yPos + 3)
        doc.text((GRADE_POINTS[sub.grade] || 0).toString(), 153, yPos + 3)
        doc.text(points.toString(), 178, yPos + 3)
        
        yPos += 10
      })
      
      // Results section
      yPos += 10
      doc.setDrawColor(0, 100, 200)
      doc.line(15, yPos, 195, yPos)
      
      yPos += 10
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total Credits: ${result.totalCredits}`, 20, yPos)
      doc.text(`Total Points: ${result.totalPoints}`, 100, yPos)
      
      yPos += 10
      doc.setFontSize(16)
      doc.setTextColor(0, 100, 200)
      doc.text(`SGPA: ${result.sgpa.toFixed(2)}`, 20, yPos)
      
      // Grade distribution summary
      yPos += 10
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      const gradeSummary = GRADES.map(grade => {
        const count = subjects.filter(s => s.grade === grade).length
        return count > 0 ? `${grade}: ${count}` : null
      }).filter(Boolean).join(', ')
      
      if (gradeSummary) {
        doc.text(`Grades: ${gradeSummary}`, 20, yPos)
      }
      
      // Footer
      yPos = 280
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text('Generated by RTU B.Tech CGPA Calculator | By Durgesh', 105, yPos, { align: 'center' })
      
      // Save the PDF
      doc.save(`Semester_${selectedSemester}_Grade_Report.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }

// Get color for grade
  const getGradeColor = (grade) => {
    const colors = {
      'A++': '#FFD700',   // Gold
      'A+': '#00d4ff',    // Cyan
      'A': '#5a67d8',     // Indigo
      'B+': '#10b981',   // Green
      'B': '#f59e0b',    // Yellow
      'C+': '#f97316',   // Orange
      'C': '#ef4444',    // Red
      'D+': '#6b7280',   // Gray
      'D': '#8b5cf6',    // Purple
      'E+': '#9ca3af',   // Light Gray
      'E': '#64748b',    // Slate
      'F': '#dc2626'     // Dark Red
    }
    return colors[grade] || '#94a3b8'
  }

  return (
    <div className="glass-card sgpa-calculator">
      <div className="card-header">
        <div className="card-icon">
          <Calculator size={20} />
        </div>
        <h2 className="card-title">Semester Subjects</h2>
        <div className="semester-badge">Semester {selectedSemester}</div>
      </div>

      {/* Semester Selector */}
      <div className="semester-tabs">
        {availableSemesters.map(sem => (
          <motion.button
            key={sem}
            className={`sem-tab ${selectedSemester === sem ? 'active' : ''}`}
            onClick={() => setSelectedSemester(sem)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sem {sem}
          </motion.button>
        ))}
      </div>

      {/* Subjects List */}
      <div className="subjects-container">
        <div className="subjects-header">
          <span className="subject-col subject-name">Subject</span>
          <span className="subject-col subject-credits">Credits</span>
          <span className="subject-col subject-grade">Grade</span>
          <span className="subject-col subject-points">Points</span>
        </div>

        <AnimatePresence mode='popLayout'>
          {subjects.map((subject, index) => (
            <motion.div 
              key={subject.id}
              className="subject-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {/* Read-only Subject Name */}
              <div className="subject-name-display">
                <span className="subject-name-text">{subject.name}</span>
                <span className="subject-type">{subject.type}</span>
              </div>
              
              {/* Read-only Credits */}
              <div className="subject-credits-display">
                {subject.credits}
              </div>
              
              {/* Editable Grade Dropdown */}
              <select
                className="grade-select"
                value={subject.grade}
                onChange={(e) => updateGrade(subject.id, e.target.value)}
                style={{ 
                  '--grade-color': getGradeColor(subject.grade),
                  borderColor: getGradeColor(subject.grade)
                }}
              >
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>
                    {grade} ({GRADE_POINTS[grade]})
                  </option>
                ))}
              </select>
              
              {/* Calculated Points */}
              <div className="subject-points-display">
                {subject.credits * GRADE_POINTS[subject.grade]}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <motion.button 
          className="btn btn-secondary"
          onClick={resetGrades}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw size={18} />
          Reset
        </motion.button>

        <motion.button 
          className="btn btn-primary"
          onClick={saveSemester}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          Save
        </motion.button>

        <motion.button 
          className="btn btn-success"
          onClick={exportPDF}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileDown size={18} />
          Export PDF
        </motion.button>
      </div>

      {/* Live SGPA Result */}
      <motion.div 
        className="result-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="result-box">
          <div className="result-header">
            <Award size={24} className="result-icon" />
            <span>Your SGPA</span>
          </div>
          
          <motion.div 
            className="result-value"
            key={result.sgpa}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {result.sgpa.toFixed(2)}
          </motion.div>
          
          <div className="result-details">
            <div className="result-detail">
              <div className="result-detail-value">{result.totalCredits}</div>
              <div className="result-detail-label">Total Credits</div>
            </div>
            <div className="result-detail">
              <div className="result-detail-value">{result.totalPoints}</div>
              <div className="result-detail-label">Total Points</div>
            </div>
            <div className="result-detail">
              <div className="result-detail-value">
                {getSemesterCredits(selectedSemester)}
              </div>
              <div className="result-detail-label">Max Credits</div>
            </div>
          </div>

          {/* Grade Distribution Bar */}
          <div className="grade-distribution">
            <span className="dist-label">Grade Distribution</span>
            <div className="dist-bar">
              {GRADES.map(grade => {
                const count = subjects.filter(s => s.grade === grade).length
                if (count === 0) return null
                const percentage = (count / subjects.length) * 100
                return (
                  <motion.div
                    key={grade}
                    className="dist-segment"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getGradeColor(grade)
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    title={`${grade}: ${count}`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .sgpa-calculator {
          padding: var(--space-lg);
        }

        .semester-badge {
          margin-left: auto;
          padding: 4px 12px;
          background: var(--accent-gradient);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .semester-tabs {
          display: flex;
          gap: var(--space-xs);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
        }

        .sem-tab {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sem-tab:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .sem-tab.active {
          background: var(--accent-gradient);
          border-color: transparent;
          color: white;
        }

        .subjects-container {
          margin-bottom: var(--space-lg);
        }

        .subjects-header {
          display: grid;
          grid-template-columns: 2fr 0.7fr 1fr 0.7fr;
          gap: var(--space-sm);
          padding: var(--space-sm);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-color);
        }

        .subject-row {
          display: grid;
          grid-template-columns: 2fr 0.7fr 1fr 0.7fr;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-sm);
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          transition: background var(--transition-fast);
        }

        .subject-row:hover {
          background: var(--bg-secondary);
        }

        .subject-name-display {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .subject-name-text {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .subject-type {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .subject-credits-display {
          text-align: center;
          font-weight: 600;
          color: var(--accent-primary);
          background: var(--bg-secondary);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .grade-select {
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-secondary);
          border: 2px solid var(--grade-color, var(--border-color));
          border-radius: var(--radius-sm);
          color: var(--grade-color, var(--text-primary));
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 16px;
          padding-right: 36px;
        }

        .grade-select:hover {
          box-shadow: 0 0 12px color-mix(in srgb, var(--grade-color) 30%, transparent);
        }

        .grade-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--grade-color) 30%, transparent);
        }

        .grade-select option {
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .subject-points-display {
          text-align: center;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-secondary);
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .action-buttons {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          flex: 1;
          min-width: 100px;
        }

        .result-section {
          margin-top: var(--space-xl);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-color);
        }

        .result-box {
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          border: 1px solid var(--border-color);
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .result-icon {
          color: var(--accent-primary);
        }

        .result-value {
          text-align: center;
          font-size: 3.5rem;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .result-details {
          display: flex;
          justify-content: center;
          gap: var(--space-xl);
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-color);
        }

        .result-detail {
          text-align: center;
        }

        .result-detail-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .result-detail-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .grade-distribution {
          margin-top: var(--space-lg);
        }

        .dist-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .dist-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          background: var(--border-color);
        }

        .dist-segment {
          transition: width 0.3s ease;
        }

        @media (max-width: 768px) {
          .subjects-header {
            display: none;
          }

          .subject-row {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
            padding: var(--space-md);
            background: var(--bg-secondary);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-sm);
          }

          .subject-credits-display,
          .grade-select,
          .subject-points-display {
            justify-self: stretch;
            text-align: center;
          }

          .result-details {
            flex-wrap: wrap;
            gap: var(--space-md);
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default SGPACalculator
