import { useMenuStore, useSettingsStore } from '../store'
import { useState } from 'react'

export default function Menu() {
    const { menuOpen, settingsOpen, aboutOpen, setMenuOpen, setSettingsOpen, setAboutOpen } = useMenuStore()
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
        // Pointer lock will be requested on next click via App.tsx effect
    }

    const handleOpenSettings = () => {
        setSettingsOpen(true)
        setTempMouseSens(mouseSensitivity)
        setTempGraphics(graphics)
        setTempResolution(resolution)
        setTempShowFPS(showFPS)
        // Ensure pointer is released for Settings screen
        document.exitPointerLock()
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

    const handleOpenAbout = () => {
        setAboutOpen(true)
        // Ensure pointer is released for About screen
        document.exitPointerLock()
    }

    const handleCloseAbout = () => {
        setAboutOpen(false)
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
            {!settingsOpen && !aboutOpen ? (
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
                        <button onClick={handleOpenAbout} style={buttonStyle}>
                            ОБ ИГРЕ
                        </button>
                    </div>
                </div>
            ) : aboutOpen ? (
                // About Screen
                <div style={{
                    background: 'rgba(0,0,0,0.9)',
                    padding: '40px',
                    borderRadius: '15px',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                    maxWidth: '700px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        marginBottom: '30px',
                        fontSize: '36px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        ОБ ИГРЕ
                    </h2>

                    {/* Game Description */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Описание</h3>
                        <p style={textStyle}>
                            3D Shooter — это динамичный шутер от первого лица, где вы должны 
                            выживать против волн врагов. С каждой волной враги становятся 
                            сильнее и их становится больше!
                        </p>
                    </div>

                    {/* Controls */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Управление</h3>
                        <div style={controlsGridStyle}>
                            <div style={controlItemStyle}>
                                <span style={keyStyle}>W A S D</span>
                                <span>Передвижение</span>
                            </div>
                            <div style={controlItemStyle}>
                                <span style={keyStyle}>Мышь</span>
                                <span>Обзор / Прицеливание</span>
                            </div>
                            <div style={controlItemStyle}>
                                <span style={keyStyle}>ЛКМ</span>
                                <span>Стрельба</span>
                            </div>
                            <div style={controlItemStyle}>
                                <span style={keyStyle}>ESC</span>
                                <span>Пауза / Меню</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Особенности игры</h3>
                        <ul style={featureListStyle}>
                            <li style={featureItemStyle}>
                                <span style={featureIconStyle}>🎯</span>
                                <div>
                                    <strong>Система волн</strong>
                                    <p style={featureDescStyle}>Враги атакуют волнами. Каждая новая волна сложнее предыдущей!</p>
                                </div>
                            </li>
                            <li style={featureItemStyle}>
                                <span style={featureIconStyle}>📈</span>
                                <div>
                                    <strong>Прогрессия сложности</strong>
                                    <p style={featureDescStyle}>+2 врага и +25 HP врагам за каждую волну</p>
                                </div>
                            </li>
                            <li style={featureItemStyle}>
                                <span style={featureIconStyle}>⏱️</span>
                                <div>
                                    <strong>Передышка между волнами</strong>
                                    <p style={featureDescStyle}>3 секунды на подготовку перед каждой волной</p>
                                </div>
                            </li>
                            <li style={featureItemStyle}>
                                <span style={featureIconStyle}>💥</span>
                                <div>
                                    <strong>Хитмаркер</strong>
                                    <p style={featureDescStyle}>Визуальное подтверждение попадания по врагу</p>
                                </div>
                            </li>
                            <li style={featureItemStyle}>
                                <span style={featureIconStyle}>⚙️</span>
                                <div>
                                    <strong>Настройки графики</strong>
                                    <p style={featureDescStyle}>Настраивайте качество для оптимальной производительности</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Советы</h3>
                        <ul style={{ ...featureListStyle, paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px', color: '#ccc' }}>Двигайтесь постоянно — стоячая цель легко поражается</li>
                            <li style={{ marginBottom: '8px', color: '#ccc' }}>Следите за здоровьем — оно не восстанавливается</li>
                            <li style={{ marginBottom: '8px', color: '#ccc' }}>Используйте паузу между волнами для отдыха</li>
                            <li style={{ marginBottom: '8px', color: '#ccc' }}>Включите FPS в настройках для мониторинга производительности</li>
                        </ul>
                    </div>

                    <button onClick={handleCloseAbout} style={{ ...buttonStyle, width: '100%', marginTop: '20px' }}>
                        НАЗАД
                    </button>
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

// About screen styles
const sectionStyle: React.CSSProperties = {
    marginBottom: '25px',
    padding: '20px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
}

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#ffd700',
    borderBottom: '2px solid #ffd700',
    paddingBottom: '8px',
}

const textStyle: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#ddd',
}

const controlsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
}

const controlItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
}

const keyStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '8px 12px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '13px',
    minWidth: '70px',
    textAlign: 'center',
}

const featureListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
}

const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '15px',
    padding: '10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
}

const featureIconStyle: React.CSSProperties = {
    fontSize: '24px',
    minWidth: '35px',
}

const featureDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#aaa',
    marginTop: '4px',
}
