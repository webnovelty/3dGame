import { useGameStore } from '../store'
import { useEffect, useState } from 'react'

export default function HUD() {
    const { score, health, gameOver, hitMarker, reset: _reset, wave, enemiesRemaining, betweenWaves, waveCountdown } = useGameStore()
    const [showHitMarker, setShowHitMarker] = useState(false)

    useEffect(() => {
        if (hitMarker > 0) {
            setShowHitMarker(true)
            const timer = setTimeout(() => setShowHitMarker(false), 100)
            return () => clearTimeout(timer)
        }
    }, [hitMarker])

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {/* Top left - Score & Health */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', pointerEvents: 'none' }}>
                <div style={{ fontSize: '24px' }}>Score: {score}</div>
                <div style={{ fontSize: '24px', color: health < 30 ? 'red' : 'white' }}>Health: {Math.ceil(health)}</div>
            </div>

            {/* Top right - Wave info */}
            <div style={{ position: 'absolute', top: 20, right: 20, color: 'white', fontFamily: 'sans-serif', textAlign: 'right', pointerEvents: 'none' }}>
                <div style={{ fontSize: '24px', color: '#ffd700' }}>Wave {wave}</div>
                {!betweenWaves && (
                    <div style={{ fontSize: '18px', color: '#ff6b6b' }}>Enemies: {enemiesRemaining}</div>
                )}
            </div>

            {/* Wave countdown overlay */}
            {betweenWaves && !gameOver && (
                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    pointerEvents: 'none'
                }}>
                    <div style={{ fontSize: '32px', color: '#ffd700', marginBottom: '10px' }}>
                        {wave === 1 ? 'Get Ready!' : `Wave ${wave} Incoming!`}
                    </div>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        color: waveCountdown <= 1 ? '#ff4444' : '#ffffff',
                        textShadow: '0 0 20px rgba(255,255,255,0.5)'
                    }}>
                        {waveCountdown > 0 ? waveCountdown : 'GO!'}
                    </div>
                </div>
            )}

            {/* Hit Marker */}
            {showHitMarker && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 20, height: 20,
                    border: '2px solid red', borderRadius: '50%',
                    zIndex: 11, pointerEvents: 'none'
                }} />
            )}

            {/* Crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 10, background: 'white', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none' }} />

            {gameOver && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 20, pointerEvents: 'auto' }}>
                    <h1>GAME OVER</h1>
                    <p>Score: {score}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer', pointerEvents: 'auto' }}>Restart</button>
                </div>
            )}
        </div>
    )
}
