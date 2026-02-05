import { useMenuStore, useSettingsStore } from '../store'
import { useState } from 'react'

export default function Menu() {
    const { menuOpen, settingsOpen, setMenuOpen, setSettingsOpen } = useMenuStore()
    const {
        mouseSensitivity,
        graphics,
        resolution,
        showFPS,
        setMouseSensitivity,
        setGraphics,
        setResolution,
        setShowFPS
    } = useSettingsStore()

    const [tempMouseSens, setTempMouseSens] = useState(mouseSensitivity)
    const [tempGraphics, setTempGraphics] = useState(graphics)
    const [tempResolution, setTempResolution] = useState(resolution)
    const [tempShowFPS, setTempShowFPS] = useState(showFPS)

    if (!menuOpen) return null

    const handlePlay = () => {
        setMenuOpen(false)
    }

    const handleOpenSettings = () => {
        setSettingsOpen(true)
        setTempMouseSens(mouseSensitivity)
        setTempGraphics(graphics)
        setTempResolution(resolution)
        setTempShowFPS(showFPS)
    }

    const handleSaveSettings = () => {
        setMouseSensitivity(tempMouseSens)
        setGraphics(tempGraphics)
        setResolution(tempResolution)
        setShowFPS(tempShowFPS)
        setSettingsOpen(false)
    }

    const handleCancelSettings = () => {
        setSettingsOpen(false)
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(26, 26, 46, 0.85)', // Semi-transparent dark blue
            backdropFilter: 'blur(5px)', // Add blur effect
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {!settingsOpen ? (
                // Main Menu
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                }}>
                    <h1 style={{
                        fontSize: '72px',
                        marginBottom: '50px',
                        textShadow: '0 0 20px rgba(255,255,255,0.5)',
                        letterSpacing: '4px',
                    }}>
                        3D SHOOTER
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <button onClick={handlePlay} style={buttonStyle}>
                            ИГРАТЬ
                        </button>
                        <button onClick={handleOpenSettings} style={buttonStyle}>
                            НАСТРОЙКИ
                        </button>
                    </div>
                </div>
            ) : (
                // Settings Menu
                <div style={{
                    background: 'rgba(0,0,0,0.8)',
                    padding: '40px',
                    borderRadius: '10px',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                    minWidth: '500px',
                }}>
                    <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>НАСТРОЙКИ</h2>

                    {/* Mouse Sensitivity */}
                    <div style={settingRowStyle}>
                        <label style={labelStyle}>Чувствительность мыши: {tempMouseSens.toFixed(1)}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={tempMouseSens}
                            onChange={(e) => setTempMouseSens(parseFloat(e.target.value))}
                            style={sliderStyle}
                        />
                    </div>

                    {/* Graphics Quality */}
                    <div style={settingRowStyle}>
                        <label style={labelStyle}>Качество графики:</label>
                        <select
                            value={tempGraphics}
                            onChange={(e) => setTempGraphics(e.target.value as any)}
                            style={selectStyle}
                        >
                            <option value="low">Низкое</option>
                            <option value="medium">Среднее</option>
                            <option value="high">Высокое</option>
                        </select>
                    </div>

                    {/* Resolution Scale */}
                    <div style={settingRowStyle}>
                        <label style={labelStyle}>Масштаб разрешения: {(tempResolution * 100).toFixed(0)}%</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={tempResolution}
                            onChange={(e) => setTempResolution(parseFloat(e.target.value))}
                            style={sliderStyle}
                        />
                    </div>

                    {/* Show FPS */}
                    <div style={settingRowStyle}>
                        <label style={labelStyle}>Показывать FPS:</label>
                        <input
                            type="checkbox"
                            checked={tempShowFPS}
                            onChange={(e) => setTempShowFPS(e.target.checked)}
                            style={{ width: '20px', height: '20px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                        <button onClick={handleSaveSettings} style={{ ...buttonStyle, flex: 1 }}>
                            СОХРАНИТЬ
                        </button>
                        <button onClick={handleCancelSettings} style={{ ...buttonStyle, flex: 1, background: '#555' }}>
                            ОТМЕНА
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const buttonStyle: React.CSSProperties = {
    padding: '15px 40px',
    fontSize: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
}

const settingRowStyle: React.CSSProperties = {
    marginBottom: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
}

const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
}

const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: '5px',
    outline: 'none',
    cursor: 'pointer',
}

const selectStyle: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    background: '#333',
    color: 'white',
    border: '1px solid #555',
    borderRadius: '5px',
    cursor: 'pointer',
}
