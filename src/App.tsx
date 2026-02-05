import { Suspense, useEffect } from 'react'
import Scene from './components/Scene'
import Menu from './components/Menu'
import HUD from './components/HUD'
import { useMenuStore } from './store'
import './index.css'

import ErrorBoundary from './components/ErrorBoundary'

function App() {
    const { menuOpen, setMenuOpen } = useMenuStore()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                setMenuOpen(true)
                document.exitPointerLock()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [setMenuOpen])

    // Request pointer lock when clicking on the game area (when menu is closed)
    useEffect(() => {
        if (menuOpen) return

        const handleClick = () => {
            if (!document.pointerLockElement) {
                const canvas = document.querySelector('canvas')
                if (canvas) {
                    canvas.requestPointerLock()
                }
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [menuOpen])

    return (
        <>
            <Menu />
            <ErrorBoundary>
                <Suspense fallback={<div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading...</div>}>
                    <Scene />
                </Suspense>
            </ErrorBoundary>
            <HUD />
        </>
    )
}

export default App
