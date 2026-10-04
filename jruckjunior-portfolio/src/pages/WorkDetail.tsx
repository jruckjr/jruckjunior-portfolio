import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '../data/projects'
import type { CaseStudyMedia, CaseStudySection, CaseStudyText } from '../data/projects'
import './WorkDetail.css'

// Paragraph text may wrap a phrase in *asterisks* to emphasise it.
function Emphasis({ text }: { text: string }) {
  return text.split(/\*(.+?)\*/).map((part, i) =>
    i % 2 ? (
      <strong key={i}>
        <em>{part}</em>
      </strong>
    ) : (
      part
    ),
  )
}

function CaseStudyBody({ body }: { body: CaseStudyText[] }) {
  return body.map((item, i) =>
    typeof item === 'string' ? (
      <p key={i}>
        <Emphasis text={item} />
      </p>
    ) : (
      <h3 key={i} className="case-study-subhead">
        {item.subhead}
      </h3>
    ),
  )
}

function Media({ media, eager = false }: { media: CaseStudyMedia; eager?: boolean }) {
  if (media.video && media.controls) {
    // A full piece the viewer controls; it starts on click unless it's set to
    // autoplay, in which case it plays muted on loop like the others.
    const autoplay = media.autoplay
      ? { 'data-autoplay': '', muted: true, loop: true }
      : {}
    return (
      <video
        className="case-study-media"
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        controls
        playsInline
        preload="metadata"
        {...autoplay}
      />
    )
  }
  // Other videos autoplay muted and loop like GIFs; CaseStudy plays them only on screen.
  return media.video ? (
    <video
      className="case-study-media"
      src={media.src}
      poster={media.poster}
      aria-label={media.alt}
      data-autoplay=""
      muted
      loop
      playsInline
      preload="metadata"
    />
  ) : (
    <img
      className="case-study-media"
      src={media.src}
      alt={media.alt}
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}

// Full-size view of a zoomable image; Esc, the close button or a click outside closes it.
function Lightbox({ media, onClose }: { media: CaseStudyMedia | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (media && !dialog.open) dialog.showModal()
    if (!media && dialog.open) dialog.close()
  }, [media])

  return (
    <dialog
      ref={dialogRef}
      className="case-study-lightbox"
      aria-label={media?.alt}
      onClose={onClose}
      // A click on the dialog itself (not the image) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {media && <img src={media.src} alt={media.alt} />}
      <button type="button" className="case-study-lightbox-close" onClick={onClose}>
        close
      </button>
    </dialog>
  )
}

function CaseStudy({ sections }: { sections: CaseStudySection[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [zoomed, setZoomed] = useState<CaseStudyMedia | null>(null)

  // Fade each text block and image in the first time it scrolls into view.
  // The hidden starting state only applies once `is-animated` is set here, so
  // content stays visible without JS or with reduced motion.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = root.querySelectorAll('.case-study-text, .case-study-media')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    root.classList.add('is-animated')
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [sections])

  // Play videos while they're on screen and pause them when they leave.
  // Reduced motion: no autoplay, show controls instead.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const videos = root.querySelectorAll<HTMLVideoElement>('video[data-autoplay]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videos.forEach((video) => (video.controls = true))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      // Fast scrolls can batch several changes per video; the last one is current.
      const latest = new Map(entries.map((entry) => [entry.target, entry]))
      latest.forEach((entry) => {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks autoplay; the first frame stays up.
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    })
    videos.forEach((video) => observer.observe(video))
    return () => observer.disconnect()
  }, [sections])

  // Images in zoomable sections open in the lightbox; videos never do.
  function renderTile(media: CaseStudyMedia, zoom = false, eager = false) {
    if (!zoom || media.video) return <Media media={media} eager={eager} />
    return (
      <button
        type="button"
        className="case-study-zoom"
        aria-label={`Enlarge: ${media.alt}`}
        onClick={() => setZoomed(media)}
      >
        <Media media={media} eager={eager} />
      </button>
    )
  }

  return (
    <div ref={rootRef} className="case-study">
      {sections.map((section, i) => {
        switch (section.kind) {
          case 'wide':
            return (
              <section key={i} className="case-study-wide">
                {section.heading && <h2 className="case-study-heading">{section.heading}</h2>}
                {section.body && (
                  <div className="case-study-text">
                    <CaseStudyBody body={section.body} />
                  </div>
                )}
                <Media media={{ src: section.image, alt: section.alt }} eager={i === 0} />
              </section>
            )
          case 'split':
            return (
              <section
                key={i}
                className={`case-study-split case-study-split--image-${section.imageSide}`}
              >
                <div className="case-study-text">
                  <h2 className="case-study-heading">{section.heading}</h2>
                  <CaseStudyBody body={section.body} />
                </div>
                <Media media={{ src: section.image, alt: section.alt }} />
              </section>
            )
          case 'text':
            return (
              <section
                key={i}
                className={`case-study-text${section.align === 'center' ? ' case-study-text--center' : ''}`}
              >
                {section.heading && <h2 className="case-study-heading">{section.heading}</h2>}
                <CaseStudyBody body={section.body} />
              </section>
            )
          case 'row':
            return (
              <section
                key={i}
                className="case-study-row"
                style={section.maxWidth ? { maxWidth: section.maxWidth } : undefined}
              >
                {section.media.map((media, j) => (
                  // Flex-grow by aspect ratio so every item in the row shares one height.
                  <div
                    key={j}
                    className="case-study-row-item"
                    style={{ flexGrow: media.ratio ?? 1, aspectRatio: media.ratio }}
                  >
                    {renderTile(media, section.zoom, i === 0)}
                  </div>
                ))}
              </section>
            )
          case 'columns':
            return (
              <section key={i} className="case-study-columns">
                {section.columns.map((column, c) => (
                  <div key={c} className="case-study-column">
                    {column.map((media, j) => (
                      <div key={j}>{renderTile(media, section.zoom, i === 0)}</div>
                    ))}
                  </div>
                ))}
              </section>
            )
          case 'grid':
            return (
              <section
                key={i}
                className="case-study-grid"
                style={{ '--columns': section.columns } as React.CSSProperties}
              >
                {section.media.map((media, j) => (
                  <div key={j} className="case-study-row-item" style={{ aspectRatio: section.ratio }}>
                    {renderTile(media, section.zoom, i === 0)}
                  </div>
                ))}
              </section>
            )
        }
      })}
      <Lightbox media={zoomed} onClose={() => setZoomed(null)} />
    </div>
  )
}

function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <Navigate to="/work" replace />
  }

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="container work-detail">
      <header className="work-detail-header">
        <h1>{project.title}</h1>
        <dl className="work-detail-facts">
          <div>
            <dt>Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </header>

      {project.sections ? (
        <CaseStudy sections={project.sections} />
      ) : (
        <>
          <div className="work-detail-media">
            <img src={project.image} alt={project.title} />
          </div>

          <p className="work-detail-summary">{project.summary}</p>
        </>
      )}

      <Link to={`/work/${next.slug}`} className="work-detail-next">
        Next project: {next.title} &rarr;
      </Link>
    </article>
  )
}

export default WorkDetail
