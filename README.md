# Weather Dashboard — React Edition

A modern React + Vite weather dashboard app that integrates with the **WeatherAI Weather API**. Search any location, get real-time weather conditions, 7-day forecasts, and AI-generated summaries to help farmers make better decisions.

**Live demo:** https://farmers-forecasts-d1fd68.netlify.app/

## Features

✅ **Real-time Weather Data** — Current conditions, temperature, humidity, wind speed, rainfall  
✅ **7-Day Forecasts** — Daily forecasts with highs, lows, and AI summaries  
✅ **Quick Locations** — Pre-loaded Kenyan farm locations for quick access  
✅ **Save Locations** — Store favorite locations and reload them instantly  
✅ **AI Summaries** — Gemini-powered weather insights and recommendations  
✅ **Responsive Design** — Works on desktop, tablet, and mobile  

## How It Works

This is a React + Vite frontend that uses the WeatherAI Weather API:

1. **Search by Coordinates** — Enter latitude/longitude or use quick location buttons (Nairobi, Kisii, Bomet, Kericho)
2. **Get Real-time Weather** — Calls `GET /v1/weather` and `GET /v1/forecast` with your API key
3. **View Report** — Displays current conditions, 7-day forecast, and AI-generated summary
4. **Save Locations** — Store locations in browser localStorage for quick re-access

### About the API Key

The app requires a WeatherAI API key (`wai_...`) to fetch weather data:
- Stored only in React state (in memory)
- Never written to localStorage, cookies, or any server
- Sent only to `api.weather-ai.co`
- Disappears when you close or refresh the tab

Anyone using the deployed demo needs their own API key. For a production version, the key should live behind a backend proxy so it's never exposed client-side.

## Running It Locally

Requires Node.js 16+:

```bash
git clone https://github.com/<your-username>/weather-dashboard.git
cd weather-dashboard/treeai

# Install dependencies
npm install

# Start the dev server (opens http://localhost:5173 automatically)
npm run dev
```

To build for production:

```bash
npm run build
# Output goes to dist/
```

## Using It

1. Paste your WeatherAI API key (`wai_...`) into the key field at the top.
2. Enter coordinates or click a quick location button (Nairobi, Kisii, Bomet, Kericho).
3. Click **Get Weather**.
4. View current conditions and 7-day forecast.
5. Click **Save Location** to store it for quick re-access.

## Project Structure

```
treeai/
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main app (state management & API calls)
│   ├── index.css            # Global styles
│   └── components/
│       ├── Header.jsx       # Header with branding
│       ├── Hero.jsx         # Hero section
│       ├── ApiKeyPanel.jsx  # API key input
│       ├── LocationSearch.jsx # Location coordinates input
│       ├── CurrentWeather.jsx # Current conditions display
│       ├── Forecast.jsx     # 7-day forecast
│       └── SavedLocations.jsx # Saved locations manager
├── css/style.css            # Original CSS (legacy)
├── js/app.js                # Original vanilla JS (legacy)
└── README.md
```

## API Endpoints Used

- **`GET /v1/weather`** — Get current weather for coordinates
- **`GET /v1/forecast`** — Get 7-day forecast with AI summaries

Both endpoints support:
- Latitude & longitude parameters
- `ai=true` for AI-generated summaries
- Bearer token authentication

## Error Handling

The app surfaces WeatherAI API error codes in user-friendly messages:

| Status | Shown as |
|---|---|
| 401 | Unauthorized — check your API key |
| 403 | Forbidden — feature not on your plan |
| 429 | Monthly quota exceeded |
| 400 | Bad request — check your coordinates |
| 500 / 503 | Server-side issue, try again |

## Future Enhancements

- Integrate SMS alerts when severe weather is forecasted
- Connect to `/v1/trees/analyze` for combined weather + canopy analysis
- Multi-location comparison view
- Historical weather trends
- Mobile app with push notifications
- Integrate with farmer registry for automated alerts

## Built with

- **React 18** — UI framework
- **Vite** — Fast build tool and dev server
- **CSS** — Custom styling (no CSS-in-JS libraries)
- **Google Fonts** — [Fraunces](https://fonts.google.com/specimen/Fraunces), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

