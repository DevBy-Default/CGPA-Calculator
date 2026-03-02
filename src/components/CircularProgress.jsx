import { motion } from 'framer-motion'
import { getGradeColor } from '../utils/calculations'

const CircularProgress = ({ value, maxValue = 10, size = 140 }) => {
  const percentage = (value / maxValue) * 100
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getGradeColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            filter: `drop-shadow(0 0 8px ${getGradeColor(value)}40)`
          }}
        />
      </svg>
      
      <div className="progress-inner">
        <motion.span
          className="progress-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(2)}
        </motion.span>
      </div>

      <style>{`
        .circular-progress {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circular-progress svg {
          position: absolute;
          top: 0;
          left: 0;
        }

        .progress-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .progress-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}

export default CircularProgress
