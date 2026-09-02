import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GAMING_IMAGES } from '../constants/gamingImages'

export function GamingBackground({ opacity = 0.5 }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = GAMING_IMAGES.primary
    img.onload = () => {
      if (!cancelled) setImageLoaded(true)
    }
    img.onerror = () => {
      if (!cancelled) setImageError(true)
    }

    return () => {
      // Detach event handlers and abort the in-flight request so the
      // Image object (and its listeners) can be garbage collected when
      // the scene switches / component unmounts. Prevents a memory leak.
      cancelled = true
      img.onload = null
      img.onerror = null
      img.src = ''
    }
  }, [])

  const backgroundStyle = imageLoaded && !imageError
    ? {
        backgroundImage: `url('${GAMING_IMAGES.primary}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    : {
        background: GAMING_IMAGES.fallback,
      }

  return (
    <>
      {/* Gaming background image */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={backgroundStyle}
      />

      {/* Dark overlay for text readability */}
      <div
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </>
  )
}

GamingBackground.propTypes = {
  opacity: PropTypes.number,
}
