import { useEffect, useId, useRef } from 'react'
import './MeltText.css'

// A patch of smooth noise follows the cursor and is fed into an SVG
// displacement filter, so the glyph shapes themselves bend and drip instead
// of whole letters moving. The patch radius scales with the font size
// (overridable per use, e.g. a bigger patch for small text).
const RADIUS_EM = 1.2
// fractalNoise channels mostly stay within ±0.3 of neutral, so this turns
// `strength` into roughly the largest pixel shift you'll see.
const NOISE_RANGE = 0.3
const FOLLOW_EASE = 0.12
const INTENSITY_EASE = 0.08
const WOBBLE_SPEED = 0.0012
const BASE_FREQUENCY = { x: 0.018, y: 0.006 }
// Blur applied inside the melt patch, as a fraction of the font size.
const BLUR_EM = 0.03
// Film grain laid over the melted (blurred) area: peak opacity, speck size
// (noise frequency) and how many frames each grain pattern holds before reseeding.
const GRAIN_OPACITY = 0.9
const GRAIN_FREQUENCY = 0.85
const GRAIN_HOLD_FRAMES = 3

// Soft white disc (opaque centre, transparent edge) used to confine the noise.
function createMask(size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const r = size / 2
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.75)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas.toDataURL()
}

type MeltTextProps = {
  as?: 'h1' | 'p' | 'div'
  // Text to melt, or any content passed as children (e.g. a list).
  text?: string
  children?: React.ReactNode
  radiusEm?: number
  className?: string
  strength?: number
}

function MeltText({
  as: Tag = 'p',
  text,
  children,
  className,
  strength = 40,
  radiusEm = RADIUS_EM,
}: MeltTextProps) {
  const filterId = `melt-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const textRef = useRef<HTMLElement>(null)
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null)
  const maskRef = useRef<SVGFEImageElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)
  const blurRef = useRef<SVGFEGaussianBlurElement>(null)
  const grainNoiseRef = useRef<SVGFETurbulenceElement>(null)
  const grainAlphaRef = useRef<SVGFEFuncAElement>(null)

  useEffect(() => {
    const el = textRef.current
    const turbulence = turbulenceRef.current
    const mask = maskRef.current
    const displacement = displacementRef.current
    const blur = blurRef.current
    const grainNoise = grainNoiseRef.current
    const grainAlpha = grainAlphaRef.current
    if (!el || !turbulence || !mask || !displacement || !blur || !grainNoise || !grainAlpha) return

    const canMelt = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches
    if (!canMelt) return

    const maxScale = strength / NOISE_RANGE
    let radius = 0
    let maxBlur = 0
    let target: { x: number; y: number } | null = null
    let x = 0
    let y = 0
    let intensity = 0
    let frame = 0
    let grainFrame = 0

    function measure() {
      const fontSize = parseFloat(getComputedStyle(el!).fontSize)
      radius = fontSize * radiusEm
      maxBlur = fontSize * BLUR_EM
      const size = Math.round(radius * 2)
      mask!.setAttribute('width', String(size))
      mask!.setAttribute('height', String(size))
      mask!.setAttribute('href', createMask(size))
    }

    function tick(time: number) {
      if (target) {
        x += (target.x - x) * FOLLOW_EASE
        y += (target.y - y) * FOLLOW_EASE
      }
      intensity += ((target ? 1 : 0) - intensity) * INTENSITY_EASE

      const wobble = 1 + Math.sin(time * WOBBLE_SPEED) * 0.06
      turbulence!.setAttribute(
        'baseFrequency',
        `${BASE_FREQUENCY.x * wobble} ${BASE_FREQUENCY.y / wobble}`,
      )
      mask!.setAttribute('x', String(x - radius))
      mask!.setAttribute('y', String(y - radius))
      displacement!.setAttribute('scale', String(maxScale * intensity))
      blur!.setAttribute('stdDeviation', String(maxBlur * intensity))
      grainAlpha!.setAttribute('slope', String(GRAIN_OPACITY * intensity))
      // A fresh grain pattern every few frames reads as flickering film grain.
      if (++grainFrame % GRAIN_HOLD_FRAMES === 0) {
        grainNoise!.setAttribute('seed', String(grainFrame))
      }

      if (!target && intensity < 0.005) {
        // Fully settled: drop the filter so the text renders normally.
        el!.style.filter = ''
        frame = 0
        return
      }
      frame = requestAnimationFrame(tick)
    }

    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect()
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (!target && intensity < 0.005) {
        x = point.x
        y = point.y
      }
      target = point
      el!.style.filter = `url(#${filterId})`
      if (!frame) frame = requestAnimationFrame(tick)
    }

    function handleLeave() {
      target = null
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(el)
    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerleave', handleLeave)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', handleLeave)
      el.style.filter = ''
    }
  }, [filterId, strength, radiusEm])

  return (
    <>
      <Tag
        ref={textRef as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement>}
        className={className}
      >
        {children ?? text}
      </Tag>
      <svg className="melt-text-defs" aria-hidden="true" focusable="false">
        <filter
          id={filterId}
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency={`${BASE_FREQUENCY.x} ${BASE_FREQUENCY.y}`}
            numOctaves={1}
            seed={7}
            result="noise"
          />
          {/* Turbulence alpha is noisy too; force it opaque before masking. */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"
            result="opaqueNoise"
          />
          <feImage ref={maskRef} preserveAspectRatio="none" result="mask" />
          <feComposite in="opaqueNoise" in2="mask" operator="in" result="localNoise" />
          {/* Mid-grey means "no displacement" everywhere outside the patch. */}
          <feFlood floodColor="rgb(128,128,128)" result="neutral" />
          <feComposite in="localNoise" in2="neutral" operator="over" result="rawMap" />
          {/* Smooths out gradient dithering that otherwise shows as speckled edges. */}
          <feGaussianBlur in="rawMap" stdDeviation={3} result="map" />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="map"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="melted"
          />
          {/* Cross-fade to a blurred copy inside the patch: sharp outside, soft in the middle. */}
          <feGaussianBlur ref={blurRef} in="melted" stdDeviation={0} result="meltedBlur" />
          <feComposite in="meltedBlur" in2="mask" operator="in" result="blurInside" />
          <feComposite in="melted" in2="mask" operator="out" result="sharpOutside" />
          <feComposite
            in="blurInside"
            in2="sharpOutside"
            operator="arithmetic"
            k2={1}
            k3={1}
            result="meltedText"
          />
          {/* Grain over the melt: light specks where the noise peaks, dark specks
              where it dips (those show on the pale blur halo), kept to the
              blurred glyphs inside the patch and faded in with the melt. */}
          <feTurbulence
            ref={grainNoiseRef}
            type="fractalNoise"
            baseFrequency={GRAIN_FREQUENCY}
            numOctaves={2}
            seed={1}
            result="grainNoise"
          />
          <feColorMatrix
            in="grainNoise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -1.5"
            result="lightSpecks"
          />
          <feColorMatrix
            in="grainNoise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 1.4"
            result="darkSpecks"
          />
          <feMerge result="grain">
            <feMergeNode in="lightSpecks" />
            <feMergeNode in="darkSpecks" />
          </feMerge>
          <feComposite in="grain" in2="blurInside" operator="in" result="grainOnMelt" />
          <feComponentTransfer in="grainOnMelt" result="fadedGrain">
            <feFuncA ref={grainAlphaRef} type="linear" slope={0} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="meltedText" />
            <feMergeNode in="fadedGrain" />
          </feMerge>
        </filter>
      </svg>
    </>
  )
}

export default MeltText
