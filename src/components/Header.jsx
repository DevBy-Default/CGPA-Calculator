import { motion } from 'framer-motion'
import { GraduationCap, Sun, Moon } from 'lucide-react'

const Header = ({ theme, toggleTheme }) => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-logo">
          <GraduationCap className="logo-icon" size={28} />
          <span className="logo-text">B.Tech Calculator</span>
        </div>
        
        <motion.button 
          className="theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="theme-icon" />
          ) : (
            <Moon size={20} className="theme-icon" />
          )}
        </motion.button>
      </div>
      
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          padding: var(--space-md) 0;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .header-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .logo-icon {
          color: var(--accent-primary);
        }
        
        .logo-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .theme-toggle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .theme-toggle:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
        
        .theme-icon {
          transition: transform var(--transition-normal);
        }
        
        .theme-toggle:hover .theme-icon {
          transform: rotate(15deg);
        }
        
        @media (max-width: 768px) {
          .header-content {
            padding: 0 var(--space-md);
          }
          
          .logo-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </motion.header>
  )
}

export default Header
