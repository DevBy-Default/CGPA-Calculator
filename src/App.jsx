import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import SGPACalculator from './components/SGPACalculator'
import CGPACalculator from './components/CGPACalculator'
import './App.css'

// LocalStorage keys
const STORAGE_KEYS = {
  USER_DATA: 'rtu_cgpa_user_data',
  SEMESTER_DATA: 'rtu_cgpa_semester_data',
  THEME: 'rtu_cgpa_theme'
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [showWelcome, setShowWelcome] = useState(true)
  const [userData, setUserData] = useState(null)
  const [semesterData, setSemesterData] = useState({})
  const [cgpaData, setCgpaData] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // Load user data
    const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (savedUserData) {
      const parsed = JSON.parse(savedUserData)
      setUserData(parsed)
      setShowWelcome(false)
    }

    // Load semester data
    const savedSemesterData = localStorage.getItem(STORAGE_KEYS.SEMESTER_DATA)
    if (savedSemesterData) {
      const parsed = JSON.parse(savedSemesterData)
      setSemesterData(parsed)
      
      // Rebuild cgpaData from saved semester data
      const cgpaArray = []
      Object.entries(parsed).forEach(([sem, data]) => {
        if (data.sgpa) {
          cgpaArray[parseInt(sem) - 1] = { 
            sgpa: data.sgpa, 
            credits: data.totalCredits, 
            semester: parseInt(sem) 
          }
        }
      })
      setCgpaData(cgpaArray.filter(Boolean))
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleWelcomeComplete = (data) => {
    setUserData(data)
    setShowWelcome(false)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data))
  }

  const handleSemesterSave = (semester, data) => {
    const newSemesterData = {
      ...semesterData,
      [semester]: data
    }
    setSemesterData(newSemesterData)
    localStorage.setItem(STORAGE_KEYS.SEMESTER_DATA, JSON.stringify(newSemesterData))
    
    // Update CGPA data
    const sgpa = data.sgpa || 0
    const credits = data.totalCredits || 0
    
    setCgpaData(prev => {
      const newData = [...prev]
      newData[semester - 1] = { sgpa, credits, semester }
      return newData
    })
  }

  const handleCGPAUpdate = (data) => {
    setCgpaData(data)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      localStorage.removeItem(STORAGE_KEYS.SEMESTER_DATA)
      setUserData(null)
      setShowWelcome(true)
      setSemesterData({})
      setCgpaData([])
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="app">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        userData={userData}
        onReset={handleReset}
        showReset={!showWelcome && !!userData}
      />
      
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onStart={handleWelcomeComplete} />
          </motion.div>
        ) : (
          <motion.main 
            key="calculator"
            className="main-content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.section className="hero" variants={itemVariants}>
              <h1 className="hero-title">
                <span className="gradient-text">RTU B.Tech CGPA Calculator</span>
              </h1>
              <p className="hero-subtitle">
                {userData && `Department: ${userData.department.toUpperCase()} • Year: ${userData.year}${getOrdinal(userData.year)} Year`}
              </p>
              <p className="hero-description">
                Calculate & Predict Your Academic Performance
              </p>
            </motion.section>

            <div className="calculator-grid">
              <motion.div variants={itemVariants}>
                <SGPACalculator 
                  onSave={handleSemesterSave} 
                  department={userData?.department}
                  year={userData?.year}
                  initialData={semesterData}
                />
              </motion.div>
              
              <motion.div className="right-column" variants={itemVariants}>
                <CGPACalculator 
                  semesterData={cgpaData} 
                  onUpdate={handleCGPAUpdate}
                />
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="footer">
        <p>Made for B.Tech Students | By Durgesh</p>
      </footer>
    </div>
  )
}

// Helper function to get ordinal suffix
function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export default App

