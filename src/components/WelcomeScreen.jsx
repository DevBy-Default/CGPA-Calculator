import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import { DEPARTMENTS, YEARS } from '../data/rtuSyllabus'

const WelcomeScreen = ({ onStart }) => {
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!department || !year) {
      setError('Please select both Department and Year')
      return
    }
    onStart({ department, year: parseInt(year) })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="welcome-screen">
      <motion.div
        className="welcome-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Animation */}
        <motion.div className="welcome-header" variants={itemVariants}>
          <motion.div
            className="logo-container"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <GraduationCap size={48} className="logo-icon" />
          </motion.div>
          <h1 className="welcome-title">
            <span className="gradient-text">RTU B.Tech CGPA Calculator</span>
          </h1>
          <p className="welcome-subtitle">
            Calculate your SGPA & CGPA with precise RTU syllabus
          </p>
        </motion.div>

        {/* Selection Cards */}
        <motion.div className="selection-grid" variants={itemVariants}>
          {/* Department Selection */}
          <motion.div
            className="selection-card"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="card-icon-wrapper">
              <BookOpen size={24} />
            </div>
            <h3 className="selection-title">Select Department</h3>
            <select
              className="form-select"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setError('')
              }}
            >
              <option value="">Choose Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </motion.div>

          {/* Year Selection */}
          <motion.div
            className="selection-card"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="card-icon-wrapper">
              <Sparkles size={24} />
            </div>
            <h3 className="selection-title">Select Year</h3>
            <select
              className="form-select"
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setError('')
              }}
            >
              <option value="">Choose Year</option>
              {YEARS.map((yr) => (
                <option key={yr.id} value={yr.id}>
                  {yr.name}
                </option>
              ))}
            </select>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.p
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        {/* Continue Button */}
        <motion.button
          className="btn btn-primary continue-btn"
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          <span>Continue to Calculator</span>
          <ArrowRight size={20} />
        </motion.button>

        {/* Features Preview */}
        <motion.div className="features-preview" variants={itemVariants}>
          <div className="feature-item">
            <span className="feature-badge">RTU</span>
            <span>Full Syllabus</span>
          </div>
          <div className="feature-item">
            <span className="feature-badge">Live</span>
            <span>SGPA Calculation</span>
          </div>
          <div className="feature-item">
            <span className="feature-badge">PDF</span>
            <span>Export Results</span>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .welcome-screen {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
        }

        .welcome-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .welcome-header {
          margin-bottom: var(--space-2xl);
        }

        .logo-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-lg);
          backdrop-filter: blur(12px);
        }

        .logo-icon {
          color: var(--accent-primary);
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
          letter-spacing: -0.02em;
        }

        .welcome-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        .selection-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
        }

        .selection-card {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          text-align: left;
          transition: all var(--transition-normal);
        }

        .selection-card:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
        }

        .card-icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-gradient);
          border-radius: var(--radius-md);
          color: white;
          margin-bottom: var(--space-md);
        }

        .selection-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-md);
        }

        .error-message {
          color: var(--error);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);
        }

        .continue-btn {
          width: 100%;
          padding: var(--space-md) var(--space-xl);
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--space-xl);
        }

        .continue-btn span {
          flex: 1;
        }

        .features-preview {
          display: flex;
          justify-content: center;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .feature-badge {
          padding: 2px 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-primary);
        }

        @media (max-width: 600px) {
          .selection-grid {
            grid-template-columns: 1fr;
          }

          .welcome-title {
            font-size: 1.75rem;
          }

          .features-preview {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

export default WelcomeScreen
