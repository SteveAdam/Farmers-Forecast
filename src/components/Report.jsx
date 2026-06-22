import { forwardRef } from 'react'

const Report = forwardRef(function Report({ data, onReset }, ref) {
    const formatTimestamp = (ts) => {
        if (!ts) return "—"
        try {
            const d = new Date(ts)
            return d.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (_) {
            return ts
        }
    }

    const renderHealthBar = () => {
        const health = data.tree_health
        if (!health) {
            return <div className="health-bar"><div className="health-segment" style={{ width: '100%', background: '#E0DACB' }}></div></div>
        }

        const total = (health.healthy || 0) + (health.needs_care || 0) + (health.needs_replacement || 0)

        const segments = [
            { key: "healthy", label: "Healthy", value: health.healthy || 0, color: "#3E5C3A" },
            { key: "needs_care", label: "Needs care", value: health.needs_care || 0, color: "#D98E3C" },
            { key: "needs_replacement", label: "Needs replacement", value: health.needs_replacement || 0, color: "#8C2F1B" },
        ]

        return (
            <div className="health-block">
                <h3 className="section-title">Tree Health</h3>
                <div className="health-bar">
                    {segments.map((seg) => {
                        const pct = total > 0 ? (seg.value / total) * 100 : 0
                        return pct > 0 ? (
                            <div key={seg.key} className="health-segment" style={{ width: `${pct}%`, background: seg.color }}></div>
                        ) : null
                    })}
                </div>
                <div className="health-legend">
                    {segments.map((seg) => (
                        <div key={seg.key} className="legend-item">
                            <span className="legend-dot" style={{ background: seg.color }}></span>
                            {seg.label} — {seg.value}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderList = (items) => {
        if (!items || items.length === 0) {
            return <li>None reported for this image.</li>
        }
        return items.map((text, idx) => <li key={idx}>{text}</li>)
    }

    return (
        <section className={`report ${data ? 'show' : ''}`} ref={ref}>
            <div className="report-stamp">Analysis Complete</div>

            <div className="report-head">
                <div>
                    <p className="report-eyebrow">Analysis Report</p>
                    <h2>{data.location || data.county || "Farm plot analysis"}</h2>
                </div>
                <div className="report-meta">
                    <div>
                        <span className="meta-k">Analysis ID</span>
                        <span className="meta-v">{data.analysis_id || "—"}</span>
                    </div>
                    <div>
                        <span className="meta-k">Timestamp</span>
                        <span className="meta-v">{formatTimestamp(data.timestamp)}</span>
                    </div>
                </div>
            </div>

            <div className="report-images">
                <div className="img-block">
                    <p className="img-label">Original Image</p>
                    <img src={data.original_image_url || data.originalImageUrl} alt="Original" />
                </div>
                <div className="img-block">
                    <p className="img-label">Analysis Overlay</p>
                    <img src={data.overlay_image_url || data.original_image_url || data.originalImageUrl} alt="Overlay" />
                </div>
            </div>

            <div className="stat-strip">
                <div className="stat">
                    <span className="stat-num">{data.total_tree_count ?? "—"}</span>
                    <span className="stat-label">Total Trees</span>
                </div>
                <div className="stat">
                    <span className="stat-num">
                        {data.tree_density_per_acre != null ? data.tree_density_per_acre.toFixed(1) : "—"}
                    </span>
                    <span className="stat-label">Trees/Acre</span>
                </div>
                <div className="stat">
                    <span className="stat-num">
                        {data.canopy_coverage_pct != null ? `${data.canopy_coverage_pct}%` : "—"}
                    </span>
                    <span className="stat-label">Canopy Coverage</span>
                </div>
                <div className="stat">
                    <span className="stat-num">
                        {data.confidence_score != null ? `${Math.round(data.confidence_score * 100)}%` : "—"}
                    </span>
                    <span className="stat-label">Confidence</span>
                </div>
            </div>

            {renderHealthBar()}

            <div className="notes-grid">
                <div>
                    <h3 className="section-title">Observations</h3>
                    <ul className="notes-list">
                        {renderList(data.observations)}
                    </ul>
                </div>
                <div>
                    <h3 className="section-title">Recommendations</h3>
                    <ul className="notes-list recs">
                        {renderList(data.recommendations)}
                    </ul>
                </div>
            </div>

            {data.tree_species_guess && (
                <div className="species-row">
                    <span>
                        <strong>Dominant species:</strong> {data.tree_species_guess}
                        {data.low_confidence ? " (low confidence)" : ""}
                    </span>
                </div>
            )}

            <button onClick={onReset} className="primary-btn reset-btn">
                <span>Start Over</span>
                <span className="btn-arrow">↻</span>
            </button>
        </section>
    )
})

export default Report
