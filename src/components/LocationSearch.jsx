import { useState } from 'react'

export default function LocationSearch({ onSearch, isLoading, error }) {
    const [lat, setLat] = useState('')
    const [lon, setLon] = useState('')
    const [label, setLabel] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!lat || !lon) {
            return
        }
        onSearch(parseFloat(lat), parseFloat(lon), label || `${lat}, ${lon}`)
    }

    // Common locations for quick access
    const quickLocations = [
        { label: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219 },
        { label: 'Kisii, Kenya', lat: -0.6833, lon: 34.7667 },
        { label: 'Bomet, Kenya', lat: -0.4, lon: 35.3833 },
        { label: 'Kericho, Kenya', lat: -0.3667, lon: 35.2833 },
    ]

    return (
        <section className="survey-card">
            <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '20px', marginTop: 0, marginBottom: '16px', color: 'var(--canopy-dark)' }}>
                    Search Weather by Location
                </h2>

                <div className="field-grid">
                    <div className="field">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                            id="latitude"
                            type="number"
                            step="0.0001"
                            placeholder="-1.2921"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="longitude">Longitude</label>
                        <input
                            id="longitude"
                            type="number"
                            step="0.0001"
                            placeholder="36.8219"
                            value={lon}
                            onChange={(e) => setLon(e.target.value)}
                        />
                    </div>
                </div>

                <div className="field field-wide">
                    <label htmlFor="label">Location Name <span className="optional">optional</span></label>
                    <input
                        id="label"
                        type="text"
                        placeholder="e.g., My Farm, Nairobi"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>

                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#6B6555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Quick Locations
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                        {quickLocations.map((loc) => (
                            <button
                                key={loc.label}
                                type="button"
                                onClick={() => {
                                    setLat(loc.lat.toString())
                                    setLon(loc.lon.toString())
                                    setLabel(loc.label)
                                }}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid var(--line)',
                                    borderRadius: '6px',
                                    background: 'var(--parchment-dim)',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    color: 'var(--ink)',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {loc.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <div style={{ color: 'var(--rust)', background: 'rgba(140, 47, 27, 0.08)', border: '1px solid rgba(140, 47, 27, 0.3)', borderRadius: '7px', padding: '11px 14px', fontSize: '13.5px', marginTop: '14px' }}>{error}</div>}

                <button
                    type="submit"
                    className="primary-btn"
                    disabled={isLoading || !lat || !lon}
                >
                    <span>{isLoading ? 'Loading...' : 'Get Weather'}</span>
                    <span className="btn-arrow">→</span>
                </button>
            </form>
        </section>
    )
}
