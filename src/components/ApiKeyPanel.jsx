export default function ApiKeyPanel({ apiKey, onApiKeyChange, showKey, onToggleKey }) {
    return (
        <section className="key-panel">
            <label htmlFor="api-key-input" className="key-label">WeatherAI API key</label>
            <div className="key-row">
                <input
                    id="api-key-input"
                    type={showKey ? "text" : "password"}
                    placeholder="wai_••••••••••••••••"
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    className="key-input"
                    autoComplete="off"
                    spellCheck="false"
                />
                <button
                    type="button"
                    onClick={onToggleKey}
                    className="ghost-btn"
                    aria-label={showKey ? "Hide key" : "Show key"}
                >
                    {showKey ? "Hide" : "Show"}
                </button>
            </div>
            <p className="key-note">Stays in your browser tab only — never saved, never sent anywhere but <code>api.weather-ai.co</code>.</p>
        </section>
    )
}
