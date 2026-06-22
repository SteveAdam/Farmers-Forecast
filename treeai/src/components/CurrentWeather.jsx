export default function CurrentWeather({ data, location, onSave }) {
    const formatTemp = (temp) => temp != null ? Math.round(temp) : '—'
    const formatWindSpeed = (speed) => speed != null ? speed.toFixed(1) : '—'

    // Handle both nested (data.current) and flat response structures
    const current = data.current || data

    return (
        <section className="report">
            <div className="report-stamp">Current Conditions</div>

            <div className="report-head">
                <div>
                    <p className="report-eyebrow">Weather Report</p>
                    <h2>{location.label}</h2>
                </div>
                <div className="report-meta">
                    <div>
                        <span className="meta-k">Coordinates</span>
                        <span className="meta-v">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
                    </div>
                    <div>
                        <span className="meta-k">Updated</span>
                        <span className="meta-v">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            <div className="stat-strip">
                <div className="stat">
                    <span className="stat-num">{formatTemp(current.temperature)}</span>
                    <span className="stat-label">°C Temperature</span>
                </div>
                <div className="stat">
                    <span className="stat-num">{current.humidity != null ? `${current.humidity}%` : '—'}</span>
                    <span className="stat-label">Humidity</span>
                </div>
                <div className="stat">
                    <span className="stat-num">{formatWindSpeed(current.wind_speed)}</span>
                    <span className="stat-label">Wind (m/s)</span>
                </div>
                <div className="stat">
                    <span className="stat-num">{current.precipitation != null ? `${current.precipitation}mm` : '—'}</span>
                    <span className="stat-label">Rainfall</span>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h3 className="section-title">Conditions</h3>
                <div style={{
                    background: 'var(--parchment-dim)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    {current.description || current.weather_condition || 'No description available'}
                </div>
            </div>

            {(data.summary || current.summary) && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 className="section-title">AI Summary</h3>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                        {Array.isArray(data.summary || current.summary) ? (
                            (data.summary || current.summary).map((item, idx) => (
                                <li key={idx} style={{ paddingLeft: '18px', position: 'relative', marginBottom: '8px', fontSize: '13.5px', color: '#3A3527' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--sage)' }}>—</span>
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li style={{ paddingLeft: '18px', position: 'relative', fontSize: '13.5px', color: '#3A3527' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--sage)' }}>—</span>
                                {data.summary || current.summary}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <button
                onClick={onSave}
                style={{
                    marginTop: '20px',
                    background: 'transparent',
                    border: '1.5px solid var(--canopy-dark)',
                    color: 'var(--canopy-dark)',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'var(--canopy-dark)'
                    e.target.style.color = 'var(--parchment)'
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--canopy-dark)'
                }}
            >
                ★ Save Location
            </button>
        </section>
    )
}
