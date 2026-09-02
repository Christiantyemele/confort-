import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  getSoundSettings,
  updateSoundSettings,
  playSound,
} from '../lib/soundSettings'

export function SettingsPanel({ open, onClose }) {
  const { t } = useTranslation()
  const initial = getSoundSettings()
  const [enabled, setEnabled] = useState(initial.enabled)
  const [volume, setVolume] = useState(initial.volume)

  const handleToggle = () => {
    const nextEnabled = !enabled
    setEnabled(nextEnabled)
    updateSoundSettings({ enabled: nextEnabled })
    if (nextEnabled) playSound('click')
  }

  const handleVolumeChange = (e) => {
    const nextVolume = Number(e.target.value) / 100
    setVolume(nextVolume)
    updateSoundSettings({ volume: nextVolume })
  }

  const handleClose = () => {
    playSound('click')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="settings-overlay"
          onClick={handleClose}
        >
          <motion.div
            className="glass-card w-full max-w-sm p-6 space-y-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="settings-panel"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neon-cyan neon-glow">
                {t('settings')}
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                aria-label="Close settings"
                data-testid="settings-close-icon"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Sound effects toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{t('soundEffects')}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {t('soundEffectsHint')}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={enabled}
                aria-label={t('soundEffects')}
                onClick={handleToggle}
                data-testid="sound-toggle"
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 min-h-touch min-w-touch shrink-0 ${
                  enabled ? 'bg-neon-cyan' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-arcade-black transition-transform duration-200 ${
                    enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{t('volume')}</p>
                <span className="text-sm text-neon-cyan">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={handleVolumeChange}
                disabled={!enabled}
                aria-label={t('volume')}
                data-testid="volume-slider"
                className={`w-full accent-neon-cyan ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
              {!enabled && (
                <p className="text-xs text-white/40">{t('volumeDisabled')}</p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full py-2.5 rounded-lg font-semibold text-arcade-black bg-neon-cyan neon-btn min-h-touch"
            >
              {t('close')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

SettingsPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
