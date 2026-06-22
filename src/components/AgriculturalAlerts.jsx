export default function AgriculturalAlerts({ current, forecast }) {
    // Helper to extract daily forecast from different API response structures
    const getDailyForecast = () => {
        // If API returns daily directly
        if (forecast.daily && Array.isArray(forecast.daily) && forecast.daily.length > 0) {
            return forecast.daily
        }

        // Otherwise extract from hourly data
        const hourly = forecast.hourly || forecast.forecast || []
        if (!hourly || hourly.length === 0) return []

        const dailyMap = {}
        hourly.forEach(hour => {
            const dateStr = (hour.time || hour.datetime || '').split('T')[0]
            if (!dateStr) return

            if (!dailyMap[dateStr]) {
                dailyMap[dateStr] = {
                    date: dateStr,
                    temps: [],
                    precip: [],
                    humidity: []
                }
            }
            if (hour.temperature != null) dailyMap[dateStr].temps.push(hour.temperature)
            if (hour.precipitation != null) dailyMap[dateStr].precip.push(hour.precipitation)
            if (hour.humidity != null) dailyMap[dateStr].humidity.push(hour.humidity)
        })

        return Object.values(dailyMap).map(day => ({
            date: day.date,
            temp_max: day.temps.length ? Math.max(...day.temps) : null,
            temp_min: day.temps.length ? Math.min(...day.temps) : null,
            precipitation: day.precip.length ? Math.max(...day.precip) : 0,
            humidity: day.humidity.length ? Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length) : null
        }))
    }

    const generateAlerts = () => {
        const alerts = []

        // Extract current data (handle both nested and flat structures)
        const curr = current.current || current
        const temp = curr.temperature
        const humidity = curr.humidity

        console.log('AgriculturalAlerts - Current:', { temp, humidity })
        console.log('AgriculturalAlerts - Forecast:', forecast)

        // FROST WARNING (current conditions)
        if (temp != null && temp < 5) {
            alerts.push({
                type: 'frost',
                severity: 'critical',
                icon: '❄️',
                title: 'FROST WARNING',
                message: `Temperature at ${Math.round(temp)}°C. Protect young seedlings and high-value crops.`,
                action: 'Cover crops with mulch or plastic sheeting. Delay irrigation.'
            })
        } else if (temp != null && temp < 10) {
            alerts.push({
                type: 'frost',
                severity: 'warning',
                icon: '⛅',
                title: 'Frost Risk',
                message: `Temperature dropping to ${Math.round(temp)}°C tonight. Monitor frost-sensitive crops.`,
                action: 'Prepare frost protection. Schedule watering for morning.'
            })
        }

        // FUNGAL/PEST RISK (current conditions)
        if (temp != null && humidity != null && temp > 20 && humidity > 75) {
            alerts.push({
                type: 'fungal',
                severity: 'warning',
                icon: '🍄',
                title: 'High Fungal Disease Risk',
                message: `Warm (${Math.round(temp)}°C) + High humidity (${humidity}%) = ideal for fungal infections.`,
                action: 'Scout crops for early signs. Consider fungicide if susceptible varieties present. Improve air circulation.'
            })
        }

        // CHECK FORECAST for heavy rain
        const daily = getDailyForecast()
        console.log('Extracted daily forecast:', daily)

        const heavyRainDay = daily.find(day => {
            const precip = day.precipitation || 0
            return precip > 50
        })

        if (heavyRainDay) {
            alerts.push({
                type: 'flooding',
                severity: 'warning',
                icon: '🌧️',
                title: 'Heavy Rain Forecast',
                message: `Expected rainfall: ${Math.round(heavyRainDay.precipitation)}mm. Risk of waterlogging and erosion.`,
                action: 'Ensure good drainage. Avoid plowing waterlogged fields. Prepare water management.'
            })
        }

        // CHECK for extended dry period
        const nextDaysRain = daily.slice(0, 5)
        const avgRain = nextDaysRain.length > 0
            ? nextDaysRain.reduce((sum, day) => sum + (day.precipitation || 0), 0) / nextDaysRain.length
            : 0

        if (avgRain < 2 && temp != null && temp > 25) {
            alerts.push({
                type: 'drought',
                severity: 'info',
                icon: '💧',
                title: 'Irrigation Recommended',
                message: `Low rainfall forecast + high temperature = rapid water loss from soil.`,
                action: 'Schedule irrigation in early morning or late afternoon. Use drip if possible to save water.'
            })
        }

        return alerts
    }

    const generateRecommendations = () => {
        const recs = []
        const curr = current.current || current
        const temp = curr.temperature
        const daily = getDailyForecast()

        // OPTIMAL WEATHER CONDITIONS
        if (temp != null && temp > 18 && temp < 28) {
            recs.push({
                icon: '✓',
                title: 'Good Field Conditions',
                text: 'Comfortable temperature for outdoor farm work today.'
            })
        }

        // FORECAST-BASED RECOMMENDATIONS
        if (daily.length > 0) {
            // Check next 3 days for rain
            const next3Days = daily.slice(0, 3)
            const totalRain = next3Days.reduce((sum, day) => sum + (day.precipitation || 0), 0)

            if (totalRain > 50) {
                recs.push({
                    icon: '☔',
                    title: 'Significant Rain Coming',
                    text: `${Math.round(totalRain)}mm expected in next 3 days. Perfect timing for planting seeds. Harvest vegetables before rain.`
                })
            }

            // Check for completely dry period
            const dryDays = next3Days.filter(day => (day.precipitation || 0) < 2)
            if (dryDays.length >= 2) {
                recs.push({
                    icon: '🚜',
                    title: 'Window for Field Work',
                    text: 'Dry weather ahead. Good opportunity for plowing, harrowing, or pesticide application.'
                })
            }
        }

        // Temperature-based recommendations
        if (temp != null && temp > 28) {
            recs.push({
                icon: '☀️',
                title: 'High Heat Alert',
                text: 'Hot day ahead. Water crops early morning. Provide shade for sensitive seedlings if possible.'
            })
        }

        return recs
    }

    const alerts = generateAlerts()
    const recommendations = generateRecommendations()

    return (
        <section className="survey-card" style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, marginBottom: '20px', color: 'var(--canopy-dark)' }}>
                Agri Alerts & Recommendations
            </h2>

            {/* ALERTS */}
            {alerts.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--canopy-dark)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Weather Alerts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {alerts.map((alert, idx) => {
                            const bgColor = {
                                critical: '#FFE5E5',
                                warning: '#FFF4E5',
                                info: '#E5F5FF'
                            }[alert.severity]

                            const borderColor = {
                                critical: '#C83030',
                                warning: '#D98E3C',
                                info: '#3D7FA5'
                            }[alert.severity]

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        background: bgColor,
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '8px',
                                        padding: '14px',
                                        borderLeft: `4px solid ${borderColor}`
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '20px' }}>{alert.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: borderColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {alert.title}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#3A3527', marginTop: '4px', lineHeight: '1.5' }}>
                                                {alert.message}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'rgba(0,0,0,0.05)',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#3A3527',
                                        lineHeight: '1.5',
                                        fontWeight: '500'
                                    }}>
                                        <span style={{ color: borderColor, fontWeight: '700' }}>Action: </span>
                                        {alert.action}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* RECOMMENDATIONS */}
            {recommendations.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--canopy-dark)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Farming Recommendations
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {recommendations.map((rec, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'var(--parchment-dim)',
                                    border: '1px solid var(--line)',
                                    borderRadius: '8px',
                                    padding: '14px'
                                }}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{rec.icon}</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--canopy-dark)', marginBottom: '6px' }}>
                                    {rec.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#3A3527', lineHeight: '1.5' }}>
                                    {rec.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {alerts.length === 0 && recommendations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#8A8470' }}>
                    <p style={{ fontSize: '14px' }}>No specific alerts or recommendations at this time.</p>
                </div>
            )}
        </section>
    )
}
