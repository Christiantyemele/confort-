import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  SOUND_KEY,
  DEFAULT_SOUND_SETTINGS,
  getSoundSettings,
  setSoundSettings,
  updateSoundSettings,
  playSound,
} from '../lib/soundSettings'

describe('soundSettings store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('getSoundSettings', () => {
    it('returns defaults when localStorage is empty', () => {
      expect(getSoundSettings()).toEqual(DEFAULT_SOUND_SETTINGS)
    })

    it('returns stored settings when present', () => {
      localStorage.setItem(SOUND_KEY, JSON.stringify({ enabled: false, volume: 0.3 }))
      expect(getSoundSettings()).toEqual({ enabled: false, volume: 0.3 })
    })

    it('returns defaults when stored JSON is malformed', () => {
      localStorage.setItem(SOUND_KEY, 'not-json{')
      expect(getSoundSettings()).toEqual(DEFAULT_SOUND_SETTINGS)
    })

    it('falls back to defaults per-field when types are invalid', () => {
      localStorage.setItem(
        SOUND_KEY,
        JSON.stringify({ enabled: 'yes', volume: 'loud' })
      )
      const result = getSoundSettings()
      expect(result.enabled).toBe(DEFAULT_SOUND_SETTINGS.enabled)
      expect(result.volume).toBe(DEFAULT_SOUND_SETTINGS.volume)
    })

    it('clamps volume out of 0..1 range to default', () => {
      localStorage.setItem(SOUND_KEY, JSON.stringify({ enabled: true, volume: 5 }))
      expect(getSoundSettings().volume).toBe(DEFAULT_SOUND_SETTINGS.volume)
    })

    it('returns a copy, not a shared reference', () => {
      const a = getSoundSettings()
      const b = getSoundSettings()
      a.volume = 0.1
      expect(b.volume).toBe(DEFAULT_SOUND_SETTINGS.volume)
    })
  })

  describe('setSoundSettings', () => {
    it('persists valid settings to localStorage', () => {
      setSoundSettings({ enabled: false, volume: 0.25 })
      const stored = JSON.parse(localStorage.getItem(SOUND_KEY))
      expect(stored).toEqual({ enabled: false, volume: 0.25 })
    })

    it('sanitizes invalid fields before persisting', () => {
      setSoundSettings({ enabled: 'nope', volume: 99 })
      const stored = JSON.parse(localStorage.getItem(SOUND_KEY))
      expect(stored.enabled).toBe(true)
      expect(stored.volume).toBe(0.7)
    })
  })

  describe('updateSoundSettings', () => {
    it('merges partial updates into existing settings', () => {
      setSoundSettings({ enabled: true, volume: 0.5 })
      const result = updateSoundSettings({ volume: 0.9 })
      expect(result).toEqual({ enabled: true, volume: 0.9 })
      expect(getSoundSettings()).toEqual({ enabled: true, volume: 0.9 })
    })

    it('updates only the provided field', () => {
      setSoundSettings({ enabled: true, volume: 0.5 })
      const result = updateSoundSettings({ enabled: false })
      expect(result).toEqual({ enabled: false, volume: 0.5 })
    })

    it('creates settings from defaults when nothing is stored', () => {
      const result = updateSoundSettings({ volume: 0.4 })
      expect(result).toEqual({ enabled: true, volume: 0.4 })
    })
  })

  describe('playSound', () => {
    it('returns false when sound effects are disabled', () => {
      setSoundSettings({ enabled: false, volume: 0.7 })
      expect(playSound('click')).toBe(false)
    })

    it('returns false when volume is zero', () => {
      setSoundSettings({ enabled: true, volume: 0 })
      expect(playSound('click')).toBe(false)
    })

    it('returns false for unregistered sound names', () => {
      setSoundSettings({ enabled: true, volume: 0.7 })
      expect(playSound('click')).toBe(false)
    })

    it('returns false when sound is enabled with volume but registry is empty', () => {
      setSoundSettings({ enabled: true, volume: 0.7 })
      expect(playSound('success')).toBe(false)
      expect(playSound('error')).toBe(false)
    })
  })
})
