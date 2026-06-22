import { useState, useEffect } from 'react'
import DropZone from './DropZone'

export default function SurveyForm({
    selectedFile,
    previewUrl,
    onFileSelect,
    fileInputRef,
    formData,
    onFormChange,
    onSubmit,
    isLoading,
    error
}) {
    const [loadingMessage, setLoadingMessage] = useState("Uploading image…")

    useEffect(() => {
        if (!isLoading) return

        const messages = [
            "Uploading image…",
            "Detecting tree crowns…",
            "Grading canopy health…",
            "Asking Gemini for agronomic notes…",
        ]
        let i = 0
        setLoadingMessage(messages[0])

        const interval = setInterval(() => {
            i = (i + 1) % messages.length
            setLoadingMessage(messages[i])
        }, 1400)

        return () => clearInterval(interval)
    }, [isLoading])

    return (
        <section className="survey-card">
            <form onSubmit={onSubmit}>
                <DropZone
                    selectedFile={selectedFile}
                    previewUrl={previewUrl}
                    onFileSelect={onFileSelect}
                    fileInputRef={fileInputRef}
                />

                <div className="field-grid">
                    <div className="field">
                        <label htmlFor="farmerId">
                            Farmer / Plot ID
                            <span className="optional"> optional</span>
                        </label>
                        <input
                            id="farmerId"
                            name="farmerId"
                            type="text"
                            value={formData.farmerId}
                            onChange={onFormChange}
                            placeholder="F-001"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="county">
                            County / Region
                            <span className="optional"> optional</span>
                        </label>
                        <input
                            id="county"
                            name="county"
                            type="text"
                            value={formData.county}
                            onChange={onFormChange}
                            placeholder="Bomet"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="landAcres">
                            Plot Size (acres)
                            <span className="optional"> optional</span>
                        </label>
                        <input
                            id="landAcres"
                            name="landAcres"
                            type="text"
                            value={formData.landAcres}
                            onChange={onFormChange}
                            placeholder="2.5"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="location">
                            Farm Name or GPS
                            <span className="optional"> optional</span>
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={onFormChange}
                            placeholder="Kipkimokwa Farm, Block C"
                        />
                    </div>
                </div>

                <div className="field field-wide">
                    <label htmlFor="notes">
                        Notes
                        <span className="optional"> optional</span>
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={onFormChange}
                        placeholder="Any additional context…"
                        rows="3"
                    />
                </div>

                {error && <div className={`error-msg ${error ? 'show' : ''}`}>{error}</div>}

                <button
                    type="submit"
                    className="primary-btn"
                    disabled={isLoading}
                >
                    <span>Analyze Farm</span>
                    <span className="btn-arrow">→</span>
                </button>
            </form>

            {isLoading && (
                <div className={`loading-panel ${isLoading ? 'show' : ''}`}>
                    <div className="scan-line"></div>
                    <div className="loading-text">{loadingMessage}</div>
                </div>
            )}
        </section>
    )
}
