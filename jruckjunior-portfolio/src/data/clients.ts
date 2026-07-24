import chicagoSky from '../assets/logos/chicago-sky.png'
import premierLeagueSummerSeries from '../assets/logos/premier-league-summer-series.png'
import spokane from '../assets/logos/spokane.png'
import seahawks from '../assets/logos/seahawks.png'
import ccHockey from '../assets/logos/cc-hockey.png'
import espnEvents from '../assets/logos/espn-events.png'
import brooks from '../assets/logos/brooks.png'
import wicc from '../assets/logos/wicc.png'
import worldRugby from '../assets/logos/world-rugby.png'
import seattleStorm from '../assets/logos/seattle-storm.png'
import laSparks from '../assets/logos/la-sparks.png'
import su from '../assets/logos/su.png'
import atl from '../assets/logos/atl.png'
import portlandThorns from '../assets/logos/portland-thorns.png'
import wnba from '../assets/logos/wnba.png'
import premierRugbySevens from '../assets/logos/premier-rugby-sevens.png'
import laClippers from '../assets/logos/la-clippers.png'
import nba from '../assets/logos/nba.png'
import lasVegasAces from '../assets/logos/las-vegas-aces.png'

export interface Client {
  name: string
  logo: string
}

// Logos pulled from the current site (jruckjunior.com). A few names are
// inferred from abbreviated filenames — worth double-checking against
// the source site: Premier League Summer Series, Premier Rugby Sevens,
// Atlanta Dream, CC Hockey, WICC, SU, Spokane.
export const clients: Client[] = [
  { name: 'NBA', logo: nba },
  { name: 'WNBA', logo: wnba },
  { name: 'Seattle Storm', logo: seattleStorm },
  { name: 'Seattle Seahawks', logo: seahawks },
  { name: 'Chicago Sky', logo: chicagoSky },
  { name: 'Los Angeles Sparks', logo: laSparks },
  { name: 'Los Angeles Clippers', logo: laClippers },
  { name: 'Portland Thorns', logo: portlandThorns },
  { name: 'Las Vegas Aces', logo: lasVegasAces },
  { name: 'Atlanta Dream', logo: atl },
  { name: 'ESPN Events', logo: espnEvents },
  { name: 'World Rugby', logo: worldRugby },
  { name: 'Premier Rugby Sevens', logo: premierRugbySevens },
  { name: 'Premier League Summer Series', logo: premierLeagueSummerSeries },
  { name: 'Brooks Running', logo: brooks },
  { name: 'CC Hockey', logo: ccHockey },
  { name: 'WICC', logo: wicc },
  { name: 'SU', logo: su },
  { name: 'Spokane', logo: spokane },
]
