import { useEffect, useRef, useState } from 'react'
import reelVideo from '../../WORK ASSETS/Homepage/jruckjunior_2025_v2_reel.mp4'
import './ShowreelScroll.css'

// Scroll timeline across the pinned section (0 = pinned, 1 = released):
// shrink the reel, float the placeholders up past the top, then grow it back.
const SHRINK_END = 0.12
const FLOAT_START = 0.14
const FLOAT_END = 0.86
const GROW_START = 0.88
const MIN_SCALE = 0.8
// Share of the float window each placeholder spends crossing the screen.
const FLOAT_DURATION = 0.3

// Hand-placed so the nine don't stack. Each sits in the left or right gutter
// beside the clear centre column (see ShowreelScroll.css); offset and width are
// fractions of that gutter's width.
const PLACEHOLDERS = [
  { side: 'left', offset: 0.1, width: 0.6, ratio: '4 / 5' },
  { side: 'right', offset: 0.3, width: 0.65, ratio: '16 / 10' },
  { side: 'left', offset: 0.35, width: 0.55, ratio: '1 / 1' },
  { side: 'right', offset: 0.05, width: 0.55, ratio: '3 / 4' },
  { side: 'left', offset: 0.05, width: 0.75, ratio: '16 / 9' },
  { side: 'right', offset: 0.25, width: 0.6, ratio: '4 / 5' },
  { side: 'left', offset: 0.3, width: 0.6, ratio: '1 / 1' },
  { side: 'right', offset: 0.1, width: 0.7, ratio: '4 / 3' },
  { side: 'left', offset: 0.15, width: 0.6, ratio: '3 / 4' },
] as const

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

function ShowreelScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const reelRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const placeholderRefs = useRef<(HTMLDivElement | null)[]>([])
  const [soundOn, setSoundOn] = useState(false)

  function toggleSound() {
    const video = videoRef.current
    if (!video) return
    // React only applies `muted` on mount, so flip it on the element directly.
    video.muted = soundOn
    setSoundOn(!soundOn)
  }

  // Muted autoplay starts the reel once it scrolls into view and pauses it
  // when it leaves, so it isn't decoding off screen.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Reduced motion: no autoplay, let the viewer start it themselves.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Fast scrolls can batch several changes; the last one is current.
        if (entries[entries.length - 1].isIntersecting) {
          // play() rejects if the browser blocks autoplay; the poster frame stays up.
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const reel = reelRef.current
    if (!section || !reel) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    function update() {
      frame = 0
      const rect = section!.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = clamp01(-rect.top / (rect.height - viewport))

      const shrink = easeInOut(clamp01(progress / SHRINK_END))
      const grow = easeInOut(clamp01((progress - GROW_START) / (1 - GROW_START)))
      const scale = 1 - (1 - MIN_SCALE) * (shrink - grow)
      reel!.style.transform = `scale(${scale})`

      const stagger = (FLOAT_END - FLOAT_START - FLOAT_DURATION) / (PLACEHOLDERS.length - 1)
      placeholderRefs.current.forEach((el, i) => {
        if (!el) return
        const start = FLOAT_START + i * stagger
        const t = clamp01((progress - start) / FLOAT_DURATION)
        // From just below the screen to just above it.
        const y = viewport - t * (viewport + el.offsetHeight)
        el.style.transform = `translate3d(0, ${y}px, 0)`
        el.style.visibility = t > 0 && t < 1 ? 'visible' : 'hidden'
      })
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section ref={sectionRef} className="showreel-scroll">
      <div className="showreel-scroll-stage">
        <div ref={reelRef} className="showreel-scroll-reel">
          <video
            ref={videoRef}
            className="showreel-scroll-video"
            src={reelVideo}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Showreel"
          />
          <button
            type="button"
            role="switch"
            aria-checked={soundOn}
            className="showreel-scroll-sound"
            onClick={toggleSound}
          >
            sound
            <span className="showreel-scroll-sound-track" aria-hidden="true">
              <span className="showreel-scroll-sound-knob" />
            </span>
          </button>
        </div>

        {PLACEHOLDERS.map((placeholder, i) => (
          <div
            key={i}
            ref={(el) => {
              placeholderRefs.current[i] = el
            }}
            className="showreel-scroll-placeholder"
            style={{
              left: `calc(var(--gutter-${placeholder.side}-start) + var(--gutter) * ${placeholder.offset})`,
              width: `calc(var(--gutter) * ${placeholder.width})`,
              aspectRatio: placeholder.ratio,
            }}
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShowreelScroll
