import { useState } from 'react'
import { ReactQRCode } from '@lglab/react-qr-code'

// 1. ESCAPE: il formato WIFI: usa ; : , " \ come separatori.
// Se la password contiene uno di questi (es. ab;c:d) dobbiamo mettere
// un backslash davanti, altrimenti il telefono tronca la lettura.
function escapeWifiValue(value) {
  return value.replace(/([\\;:,"])/g, '\\$1')
}

export default function App() {
  // 2. INPUT CONTROLLATI: React è la source of truth.
  // Ogni input ha value + onChange collegati allo stato.
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  // 3. IL QR APPARE SOLO SE SSID e password sono compilati (richiesta samuel)
  const isReady = ssid.trim() !== '' && password !== ''

  // 4. STRINGA STANDARD WIFI: è solo testo, nessuna "magia".
  // Il telefono la legge e capisce SSID, password, sicurezza.
  const wifiString = `WIFI:T:WPA;S:${escapeWifiValue(ssid)};P:${escapeWifiValue(password)};H:${isHidden ? 'true' : 'false'};;`

  return (
    <div className="container py-5">
      <header className="text-center mb-4">
        <h1 className="h3">📶QRCode Wi-Fi</h1>
        <p className="text-muted">
          Compila il form, inquadra il QR con il telefono per collegarti.
        </p>
      </header>

      <div className="row g-4">
        {/* COLONNA FORM */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5 mb-3">Dati rete</h2>

              <form onSubmit={(e) => e.preventDefault()}>
                {/* SSID: da docs Bootstrap "Form controls" -> form-control */}
                <div className="mb-3">
                  <label htmlFor="ssid" className="form-label">
                    Nome rete (SSID)
                  </label>
                  <input
                    type="text"
                    id="ssid"
                    className="form-control"
                    placeholder="es. Casa-Mia"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                  />
                </div>

                {/* Password: stesso pattern, type=password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="es. ab;c:d (prova i caratteri speciali)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="form-text">
                    Prova con <code>ab;c:d</code> per vedere l'escape in azione.
                  </div>
                </div>

                {/* Rete nascosta: da docs "Checks and radios" -> form-check */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="hidden"
                    className="form-check-input"
                    checked={isHidden}
                    onChange={(e) => setIsHidden(e.target.checked)}
                  />
                  <label htmlFor="hidden" className="form-check-label">
                    Rete nascosta
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLONNA QR */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h2 className="card-title h5 mb-3">QR code</h2>

              {isReady ? (
                <>
                  {/* BONUS STILE: moduli arrotondati + colori (docs reactqrcode.com) */}
                  <div className="bg-white p-3 d-inline-block rounded border">
                    <ReactQRCode
                      value={wifiString}
                      size={220}
                      dataModulesSettings={{ style: 'rounded', color: '#0d6efd' }}
                      finderPatternOuterSettings={{ style: 'rounded', color: '#0d6efd' }}
                      finderPatternInnerSettings={{ color: '#0d6efd' }}
                    />
                  </div>
                  <p className="mt-3 mb-1 text-muted small">Contenuto del QR:</p>
                  <code className="d-block text-break small">{wifiString}</code>
                </>
              ) : (
                <p className="text-muted mb-0">
                  Inserisci SSID e password per generare il QR.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
