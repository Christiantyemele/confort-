/**
 * Sound settings stored in localStorage.
 *
 * Preferences persist across sessions:
 *   - enabled: boolean — master switch for all sound effects
 *   - volume: number   — 0..1 gain applied to any played sound
 */
export const SOUND_KEY = 'confort:sound-settings'

export const DEFAULT_SOUND_SETTINGS = {
  enabled: true,
  volume: 0.7,
}

/**
 * Internal registry of sound resources. Sound files (URLs or buffers) can be
 * added later against these slots without changing the public API below.
 */
const SOUND_REGISTRY = {
  click: null,
  success: null,
  error: null,
}

/**
 * Read the current sound settings from localStorage.
 * Falls back to defaults if the key is missing, unparseable, or malformed.
 *
 * @returns {{ enabled: boolean, volume: number }}
 */
export function getSoundSettings() {
  try {
    const raw = localStorage.getItem(SOUND_KEY)
    if (!raw) return { ...DEFAULT_SOUND_SETTINGS }

    const parsed = JSON.parse(raw)
    const enabled =
      typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_SOUND_SETTINGS.enabled
    const volume =
      typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1
        ? parsed.volume
        : DEFAULT_SOUND_SETTINGS.volume

    return { enabled, volume }
  } catch {
    return { ...DEFAULT_SOUND_SETTINGS }
  }
}

/**
 * Persist a full sound settings object to localStorage.
 *
 * @param {{ enabled: boolean, volume: number }} settings
 */
export function setSoundSettings(settings) {
  const sanitized = {
    enabled:
      typeof settings.enabled === 'boolean' ? settings.enabled : DEFAULT_SOUND_SETTINGS.enabled,
    volume:
      typeof settings.volume === 'number' && settings.volume >= 0 && settings.volume <= 1
        ? settings.volume
        : DEFAULT_SOUND_SETTINGS.volume,
  }
  localStorage.setItem(SOUND_KEY, JSON.stringify(sanitized))
}

/**
 * Merge a partial settings object into the current stored settings and persist.
 *
 * @param {Partial<{ enabled: boolean, volume: number }>} partial
 * @returns {{ enabled: boolean, volume: number }} the merged settings
 */
export function updateSoundSettings(partial) {
  const current = getSoundSettings()
  const next = { ...current, ...partial }
  setSoundSettings(next)
  return next
}

/**
 * Placeholder audio hook. Plays a registered sound if sound effects are
 * enabled and volume is above zero. Returns true when a sound would play,
 * false otherwise.
 *
 * Sound files are not yet wired up; each registry slot is currently null and
 * emitted here as a no-op so files can be added later without changing callers.
 *
 * @param {'click' | 'success' | 'error'} name
 * @returns {boolean} true if a sound is available and should play
 */
export function playSound(name) {
  const { enabled, volume } = getSoundSettings()

  if (!enabled || volume <= 0) return false
  if (!SOUND_REGISTRY[name]) return false

  // TODO(T-048): create Audio objects from SOUND_REGISTRY entries and play
  // them at `volume` gain once sound files are added.
  return true
}
