export default function SavedLocations({ locations, onLoad, onRemove }) {
    return (
        <section className="survey-card" style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, marginBottom: '20px', color: 'var(--canopy-dark)' }}>
                Saved Locations ({locations.length})
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
            }}>
                {locations.map((location) => (
                    <div
                        key={location.id}
                        style={{
                            background: 'var(--parchment-dim)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--canopy-dark)'
                        }}>
                            {location.label}
                        </div>

                        <div style={{
                            fontSize: '11px',
                            color: '#8A8470',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <button
                                onClick={() => onLoad(location)}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: 'var(--canopy-mid)',
                                    color: 'var(--parchment)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--canopy-dark)'}
                                onMouseLeave={(e) => e.target.style.background = 'var(--canopy-mid)'}
                            >
                                Load
                            </button>
                            <button
                                onClick={() => onRemove(location.id)}
                                style={{
                                    padding: '8px 12px',
                                    background: 'transparent',
                                    color: 'var(--rust)',
                                    border: '1px solid var(--rust)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'var(--rust)'
                                    e.target.style.color = 'var(--parchment)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent'
                                    e.target.style.color = 'var(--rust)'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
