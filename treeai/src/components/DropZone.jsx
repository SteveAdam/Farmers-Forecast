import { useState } from 'react'

export default function DropZone({ selectedFile, previewUrl, onFileSelect, fileInputRef }) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragEnter = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) onFileSelect(file)
    }

    const handleInputChange = (e) => {
        const file = e.target.files?.[0]
        if (file) onFileSelect(file)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            fileInputRef.current?.click()
        }
    }

    return (
        <div
            className={`dropzone ${isDragging ? 'drag-over' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
            aria-label="Drop a farm image here or click to browse"
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleInputChange}
                style={{ display: 'none' }}
            />

            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-img" />
            ) : (
                <div className="dropzone-inner">
                    <div className="upload-icon">🌱</div>
                    <div className="dz-title">Drop a farm image here</div>
                    <p className="dz-sub">or <span className="link-text" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>click to browse</span> — JPEG, PNG, WEBP, max 20MB</p>
                </div>
            )}
        </div>
    )
}
