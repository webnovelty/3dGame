import { Suspense, useEffect } from 'react'
import Scene from './components/Scene'
import Menu from './components/Menu'
import HUD from './components/HUD'
import { useMenuStore } from './store'
import './index.css'

import ErrorBoundary from './components/ErrorBoundary'

function App() {
    const { setMenuOpen } = useMenuStore()

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
