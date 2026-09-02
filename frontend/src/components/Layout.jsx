import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { ParticleBackground } from './ParticleBackground'
import { GamingBackground } from './GamingBackground'
import { SettingsPanel } from './SettingsPanel'

export function Layout({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-arcade-black font-space">
      {/* Gaming background image with dark overlay */}
      <GamingBackground opacity={0.5} />

      {/* Particle background - reduced on mobile */}
      <ParticleBackground count={15} intensity={0.6} />

      {/* Content with safe area support */}
      <div
        className="relative z-10 flex flex-col items-center justify-start min-h-screen w-full overflow-y-auto"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingTop: 'max(2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Logo / Header - mobile responsive */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 md:mb-10 text-center flex-shrink-0 relative"
        >
          {/* Settings gear button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center rounded-lg text-white/50 hover:text-neon-cyan hover:bg-white/10 transition-colors min-h-touch min-w-touch"
            data-testid="settings-button"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider neon-glow text-neon-cyan">
            Confort+
          </h1>
          <p className="mt-2 text-xs md:text-sm text-white/40 tracking-widest uppercase">
            Premium Wi-Fi Access
          </p>
        </motion.header>

        {/* Main content - responsive max-width */}
        <main className="w-full max-w-sm md:max-w-md lg:max-w-lg px-4 md:px-0 flex-1 flex flex-col justify-start">
          {children}
        </main>
      </div>

      {/* Settings panel */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
