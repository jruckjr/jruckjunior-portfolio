import orvisSpec from '../assets/projects/orvis-spec.png'
import seattleStormArenaCreative2025 from '../assets/projects/seattle-storm-arena-creative-2025.png'
import seattleSeahawksStadiumCreative2025 from '../assets/projects/seattle-seahawks-stadium-creative-2025.png'
import seattleStormIntroVideo2025 from '../assets/projects/seattle-storm-intro-video-2025.png'
import lasVegasAcesIntroVideo2025 from '../assets/projects/las-vegas-aces-intro-video-2025.png'
import lasVegasAcesArenaCreative2025 from '../assets/projects/las-vegas-aces-arena-creative-2025.png'
import losAngelesSparksIntroVideo2025 from '../assets/projects/los-angeles-sparks-intro-video-2025.png'
import wbcaChallengeArenaCreative2025 from '../assets/projects/wbca-challenge-arena-creative-2025.png'
import chicagoSkyBrandAndTypeGuidelines from '../assets/projects/chicago-sky-brand-and-type-guidelines.png'
import chicagoSkyCreative2020 from '../assets/projects/chicago-sky-creative-2020.png'
import photographyVideography from '../assets/projects/photography-videography.jpg'

export type ProjectCategory = 'Motion' | 'Branding' | 'Photography'

export interface Project {
  slug: string
  title: string
  client: string
  category: ProjectCategory
  year: string
  summary: string
  role: string
  image: string
}

// Titles/clients/images pulled from the current site (jruckjunior.com).
// Summaries and roles are still placeholders — real case-study copy to come.
export const projects: Project[] = [
  {
    slug: 'orvis-spec',
    title: 'Orvis — Spec',
    client: 'Orvis',
    category: 'Branding',
    year: '2025',
    summary: 'Placeholder summary — spec branding/design work for Orvis.',
    role: 'Placeholder role',
    image: orvisSpec,
  },
  {
    slug: 'seattle-storm-arena-creative-2025',
    title: '2025 Seattle Storm — Arena Creative',
    client: 'Seattle Storm',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — in-arena creative for Seattle Storm.',
    role: 'Placeholder role',
    image: seattleStormArenaCreative2025,
  },
  {
    slug: 'seattle-seahawks-stadium-creative-2025',
    title: '2025 Seattle Seahawks — Stadium Creative',
    client: 'Seattle Seahawks',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — in-stadium creative for the Seattle Seahawks.',
    role: 'Placeholder role',
    image: seattleSeahawksStadiumCreative2025,
  },
  {
    slug: 'seattle-storm-intro-video-2025',
    title: 'Seattle Storm Intro Video',
    client: 'Seattle Storm',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — player intro video for Seattle Storm.',
    role: 'Placeholder role',
    image: seattleStormIntroVideo2025,
  },
  {
    slug: 'las-vegas-aces-intro-video-2025',
    title: 'Las Vegas Aces Intro Video',
    client: 'Las Vegas Aces',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — player intro video for the Las Vegas Aces.',
    role: 'Placeholder role',
    image: lasVegasAcesIntroVideo2025,
  },
  {
    slug: 'las-vegas-aces-arena-creative-2025',
    title: '2025 Las Vegas Aces — Arena Creative',
    client: 'Las Vegas Aces',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — in-arena creative for the Las Vegas Aces.',
    role: 'Placeholder role',
    image: lasVegasAcesArenaCreative2025,
  },
  {
    slug: 'los-angeles-sparks-intro-video-2025',
    title: '2025 Los Angeles Sparks Intro Video',
    client: 'Los Angeles Sparks',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — player intro video for the LA Sparks.',
    role: 'Placeholder role',
    image: losAngelesSparksIntroVideo2025,
  },
  {
    slug: 'wbca-challenge-arena-creative-2025',
    title: '2025 WBCA Challenge Arena Creative',
    client: 'WBCA',
    category: 'Motion',
    year: '2025',
    summary: 'Placeholder summary — arena creative for the WBCA Challenge.',
    role: 'Placeholder role',
    image: wbcaChallengeArenaCreative2025,
  },
  {
    slug: 'chicago-sky-brand-and-type-guidelines',
    title: 'Chicago Sky Brand and Type Guidelines',
    client: 'Chicago Sky',
    category: 'Branding',
    year: '2021',
    summary: 'Placeholder summary — brand and type guideline system for Chicago Sky.',
    role: 'Placeholder role',
    image: chicagoSkyBrandAndTypeGuidelines,
  },
  {
    slug: 'chicago-sky-creative-2020',
    title: '2020 Chicago Sky Creative',
    client: 'Chicago Sky',
    category: 'Motion',
    year: '2020',
    summary: 'Placeholder summary — season creative for Chicago Sky.',
    role: 'Placeholder role',
    image: chicagoSkyCreative2020,
  },
  {
    slug: 'photography-videography',
    title: 'Photography / Videography',
    client: 'Self',
    category: 'Photography',
    year: '2025',
    summary: 'Placeholder summary — personal photography and videography work.',
    role: 'Placeholder role',
    image: photographyVideography,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
