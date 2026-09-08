/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsPanel } from '../components/SettingsPanel'
import {
  SOUND_KEY,
  setSoundSettings,
  getSoundSettings,
} from '../lib/soundSettings'

describe('SettingsPanel Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders nothing when closed', () => {
    render(<SettingsPanel open={false} onClose={() => {}} />)
    expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument()
  })

  it('renders the panel when open', () => {
    render(<SettingsPanel open onClose={() => {}} />)
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument()
    expect(screen.getByText('Paramètres')).toBeInTheDocument()
  })

  it('shows sound toggle in the enabled state by default', () => {
    render(<SettingsPanel open onClose={() => {}} />)
    const toggle = screen.getByTestId('sound-toggle')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('loads stored settings from localStorage', () => {
    setSoundSettings({ enabled: false, volume: 0.4 })
    render(<SettingsPanel open onClose={() => {}} />)

    const toggle = screen.getByTestId('sound-toggle')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    const slider = screen.getByTestId('volume-slider')
    expect(slider).toHaveValue('40')
  })

  it('toggles sound effects off and persists to localStorage', async () => {
    const user = userEvent.setup()
    render(<SettingsPanel open onClose={() => {}} />)

    const toggle = screen.getByTestId('sound-toggle')
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    const stored = getSoundSettings()
    expect(stored.enabled).toBe(false)
  })

  it('toggles sound effects back on and persists', async () => {
    setSoundSettings({ enabled: false, volume: 0.7 })
    const user = userEvent.setup()
    render(<SettingsPanel open onClose={() => {}} />)

    const toggle = screen.getByTestId('sound-toggle')
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'true')
    const stored = getSoundSettings()
    expect(stored.enabled).toBe(true)
  })

  it('adjusts volume via slider and persists', () => {
    render(<SettingsPanel open onClose={() => {}} />)

    const slider = screen.getByTestId('volume-slider')
    fireEvent.change(slider, { target: { value: '50' } })

    const stored = getSoundSettings()
    expect(stored.volume).toBeCloseTo(0.5, 1)
  })

  it('disables the volume slider when sound is off', async () => {
    setSoundSettings({ enabled: false, volume: 0.7 })
    const user = userEvent.setup()
    render(<SettingsPanel open onClose={() => {}} />)

    const slider = screen.getByTestId('volume-slider')
    expect(slider).toBeDisabled()

    const toggle = screen.getByTestId('sound-toggle')
    await user.click(toggle)
    expect(slider).not.toBeDisabled()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel open onClose={onClose} />)

    // The bottom "Fermer" button (not the header X icon)
    const closeButton = screen.getByRole('button', { name: 'Fermer' })
    await user.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsPanel open onClose={onClose} />)

    const overlay = screen.getByTestId('settings-overlay')
    await user.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('persists the correct volume after adjusting with the slider', () => {
    setSoundSettings({ enabled: true, volume: 0.3 })
    render(<SettingsPanel open onClose={() => {}} />)

    const slider = screen.getByTestId('volume-slider')
    fireEvent.change(slider, { target: { value: '80' } })

    const stored = JSON.parse(localStorage.getItem(SOUND_KEY))
    expect(stored.volume).toBeCloseTo(0.8, 1)
  })
})
