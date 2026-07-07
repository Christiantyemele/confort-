import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GAMING_IMAGES } from '../constants/gamingImages'

export function GamingBackground({ opacity = 0.5 }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = GAMING_IMAGES.primary
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageError(true)
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
