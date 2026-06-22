export default function Forecast({ data }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    }

    // Process hourly data into daily forecasts
    const getDailyForecasts = () => {
        const hourly = data.hourly || data.forecast || []
        if (hourly.length === 0) return []

        const dailyMap = {}
        hourly.forEach(hour => {
            // Extract date part (YYYY-MM-DD) from timestamp
            const dateStr = (hour.time || hour.datetime || '').split('T')[0]
            if (!dateStr) return

            if (!dailyMap[dateStr]) {
                dailyMap[dateStr] = {
                    date: dateStr,
                    temps: [],
                    precip: [],
                    humidity: [],
                    description: hour.description || hour.weather_condition || 'Clear'
                }
            }
            if (hour.temperature != null) dailyMap[dateStr].temps.push(hour.temperature)
            if (hour.precipitation_probability != null) dailyMap[dateStr].precip.push(hour.precipitation_probability)
            if (hour.humidity != null) dailyMap[dateStr].humidity.push(hour.humidity)
        })

        return Object.values(dailyMap).map(day => ({
            date: day.date,
            max_temp: day.temps.length ? Math.max(...day.temps) : null,
            min_temp: day.temps.length ? Math.min(...day.temps) : null,
            precipitation: day.precip.length ? Math.max(...day.precip) : null,
            humidity: day.humidity.length ? Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length) : null,
            description: day.description
        })).slice(0, 7)
    }

    const forecasts = getDailyForecasts()

    return (
        <section className="survey-card" style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, marginBottom: '20px', color: 'var(--canopy-dark)' }}>
                7-Day Forecast
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
            }}>
                {forecasts.map((day, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: 'var(--parchment-dim)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '14px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            fontSize: '12px',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: 'var(--canopy-mid)',
                            marginBottom: '8px'
                        }}>
                            {formatDate(day.date || day.datetime)}
                        </div>

                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: 'var(--canopy-dark)',
                            marginBottom: '6px'
                        }}>
                            {day.max_temp != null ? Math.round(day.max_temp) : '—'}°
                        </div>

                        <div style={{
                            fontSize: '12px',
                            color: '#8A8470',
                            marginBottom: '10px'
                        }}>
                            {day.min_temp != null ? `Low ${Math.round(day.min_temp)}°` : 'No low'}
                        </div>

                        <div style={{
                            fontSize: '12px',
                            color: '#6B6555',
                            lineHeight: '1.4',
                            marginBottom: '8px',
                            minHeight: '28px'
                        }}>
                            {day.description || day.weather_condition || 'N/A'}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            fontSize: '11px',
                            color: '#8A8470',
                            borderTop: '1px solid var(--line)',
                            paddingTop: '8px'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontWeight: '600' }}>
                                    {day.precipitation != null ? `${day.precipitation}mm` : '—'}
                                </span>
                                <span>Rain</span>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontWeight: '600' }}>
                                    {day.humidity != null ? `${day.humidity}%` : '—'}
                                </span>
                                <span>Humidity</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {data.summary && (
                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--parchment-dim)', borderRadius: '8px' }}>
                    <h3 className="section-title">7-Day Summary</h3>
                    <p style={{ margin: '0', fontSize: '13.5px', lineHeight: '1.6', color: '#3A3527' }}>
                        {Array.isArray(data.summary) ? data.summary.join(' ') : data.summary}
                    </p>
                </div>
            )
            }
        </section>
        )
}