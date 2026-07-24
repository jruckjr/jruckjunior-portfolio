import { clients } from '../data/clients'
import './ClientTicker.css'

function ClientTicker() {
  return (
    <div className="client-ticker">
      <div className="client-ticker-track">
        <ul className="client-ticker-group" aria-label="Clients">
          {clients.map((client) => (
            <li key={client.name} className="client-ticker-item">
              <img src={client.logo} alt={client.name} loading="lazy" />
            </li>
          ))}
        </ul>
        <ul className="client-ticker-group" aria-hidden="true">
          {clients.map((client) => (
            <li key={client.name} className="client-ticker-item">
              <img src={client.logo} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ClientTicker
