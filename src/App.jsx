import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ApiKeyPanel from './components/ApiKeyPanel'
import LocationSearch from './components/LocationSearch'
import CurrentWeather from './components/CurrentWeather'
import AgriculturalAlerts from './components/AgriculturalAlerts'
import Forecast from './components/Forecast'
import SavedLocations from './components/SavedLocations'
import './index.css'

const WEATHER_API = "https://api.weather-ai.co/v1/weather"
const FORECAST_API = "https://api.weather-ai.co/v1/forecast"

export default function App() {
    const [apiKey, setApiKey] = useState('')
    const [showKey, setShowKey] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [currentLocation, setCurrentLocation] = useState(null)
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [savedLocations, setSavedLocations] = useState([])

    // Load saved locations from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('weatherLocations')
        if (saved) {
            setSavedLocations(JSON.parse(saved))
        }
    }, [])

    const handleLocationSearch = async (lat, lon, label) => {
        if (!apiKey.trim()) {
            setError("Add your WeatherAI API key first.")
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const [weatherRes, forecastRes] = await Promise.all([
                fetch(`${WEATHER_API}?lat=${lat}&lon=${lon}&ai=true`, {
                    headers: { Authorization: `Bearer ${apiKey}` }
                }),
                fetch(`${FORECAST_API}?lat=${lat}&lon=${lon}&days=7&ai=true`, {
                    headers: { Authorization: `Bearer ${apiKey}` }
                })
            ])

            if (!weatherRes.ok || !forecastRes.ok) {
                await handleApiError(weatherRes)
                return
            }

            const weatherData = await weatherRes.json()
            const forecastData = await forecastRes.json()

            console.log('Weather:', weatherData)
            console.log('Forecast:', forecastData)

            setCurrentLocation({ lat, lon, label })
            setCurrentWeather(weatherData)
            setForecast(forecastData)
        } catch (err) {
            setError("Couldn't reach the WeatherAI API. Check your connection and try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveLocation = () => {
        if (!currentLocation) return

        const newSaved = [...savedLocations, {
            id: Date.now(),
            ...currentLocation
        }]
        setSavedLocations(newSaved)
        localStorage.setItem('weatherLocations', JSON.stringify(newSaved))
    }

    const handleRemoveLocation = (id) => {
        const updated = savedLocations.filter(loc => loc.id !== id)
        setSavedLocations(updated)
        localStorage.setItem('weatherLocations', JSON.stringify(updated))
    }

    const handleLoadSavedLocation = (location) => {
        handleLocationSearch(location.lat, location.lon, location.label)
    }

    const handleApiError = async (res) => {
        let message = `Request failed with status ${res.status}.`
        try {
            const body = await res.json()
            if (body?.message) message = body.message
        } catch (_) { }

        const knownCauses = {
            401: "Unauthorized — check that your API key is correct and active.",
            403: "Forbidden — your plan may not include this feature.",
            429: "Monthly quota exceeded — check your usage in the WeatherAI dashboard.",
            400: "Bad request — check your coordinates.",
            500: "Server-side issue — try again in a moment.",
            503: "Service unavailable — try again shortly.",
        }

        setError(knownCauses[res.status] || message)
    }

    return (
        <div>
            <div className="grain"></div>
            <Header />
            <main className="page">
                <Hero />
                <ApiKeyPanel
                    apiKey={apiKey}
                    onApiKeyChange={setApiKey}
                    showKey={showKey}
                    onToggleKey={() => setShowKey(!showKey)}
                />
                <LocationSearch
                    onSearch={handleLocationSearch}
                    isLoading={isLoading}
                    error={error}
                />
                {currentLocation && (
                    <>
                        {currentWeather && (
                            <CurrentWeather
                                data={currentWeather}
                                location={currentLocation}
                                onSave={handleSaveLocation}
                            />
                        )}
                        {currentWeather && forecast && (
                            <AgriculturalAlerts
                                current={currentWeather}
                                forecast={forecast}
                            />
                        )}
                        {forecast && <Forecast data={forecast} />}
                    </>
                )}
                {savedLocations.length > 0 && (
                    <SavedLocations
                        locations={savedLocations}
                        onLoad={handleLoadSavedLocation}
                        onRemove={handleRemoveLocation}
                    />
                )}
            </main>
            <footer className="site-footer">
                <p>Built with <code>React + Vite</code> • Powered by <code>WeatherAI Weather API</code></p>
            </footer>
        </div>
    )
}
