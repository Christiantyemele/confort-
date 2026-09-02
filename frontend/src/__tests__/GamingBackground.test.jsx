import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { GamingBackground } from '../components/GamingBackground'

describe('GamingBackground', () => {
  // Capture the Image instance created inside the component so we can
  // assert that its event handlers are cleaned up on unmount.
  let imageInstance

  beforeEach(() => {
    imageInstance = null
    globalThis.Image = vi.fn(function MockImage() {
      imageInstance = this
      this.onload = null
      this.onerror = null
      this.src = ''
    })
  })

  afterEach(() => {
    cleanup()
    // Restore the original Image constructor so other tests are unaffected.
    delete globalThis.Image
  })

  it('should render background fallback initially', () => {
    const { container } = render(<GamingBackground opacity={0.5} />)
    const fallbackDiv = container.querySelector('div[style*="background"]')
    expect(fallbackDiv).toBeInTheDocument()
  })

  it('should create an Image to preload the gaming background', () => {
    render(<GamingBackground />)
    expect(globalThis.Image).toHaveBeenCalledTimes(1)
    expect(imageInstance).toBeTruthy()
    expect(imageInstance.src).toBeTruthy()
  })

  it('should not set state after unmount (guards against late load)', () => {
    const { unmount } = render(<GamingBackground />)
    unmount()

    // After unmount, triggering handlers must not update state (no crash,
    // handlers are detached, so these should be no-ops / null).
    expect(imageInstance.onload).toBeNull()
    expect(imageInstance.onerror).toBeNull()
  })

  it('should detach event handlers and clear src on unmount (prevents leak)', () => {
    const { unmount } = render(<GamingBackground />)
    expect(imageInstance.onload).not.toBeNull()
    expect(imageInstance.onerror).not.toBeNull()

    unmount()

    // Handlers must be nulled to release references; src cleared to abort
    // the in-flight download so the Image can be garbage collected.
    expect(imageInstance.onload).toBeNull()
    expect(imageInstance.onerror).toBeNull()
    expect(imageInstance.src).toBe('')
  })
})
