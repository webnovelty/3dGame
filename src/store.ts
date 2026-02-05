import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
    score: number
    health: number
    gameOver: boolean
    hitMarker: number
    setScore: (score: number | ((prev: number) => number)) => void
    setHealth: (health: number | ((prev: number) => number)) => void
    setGameOver: (gameOver: boolean) => void
    triggerHitMarker: () => void
    reset: () => void
}

interface SettingsState {
    mouseSensitivity: number
    graphics: 'low' | 'medium' | 'high'
    resolution: number
    showFPS: boolean
    setMouseSensitivity: (value: number) => void
    setGraphics: (value: 'low' | 'medium' | 'high') => void
    setResolution: (value: number) => void
    setShowFPS: (value: boolean) => void
}

interface MenuState {
    menuOpen: boolean
    settingsOpen: boolean
    setMenuOpen: (open: boolean) => void
    setSettingsOpen: (open: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
    score: 0,
    health: 100,
    gameOver: false,
    hitMarker: 0,
    setScore: (score) => set((state) => ({ score: typeof score === 'function' ? score(state.score) : score })),
    setHealth: (health) => set((state) => ({ health: typeof health === 'function' ? health(state.health) : health })),
    setGameOver: (gameOver) => set({ gameOver }),
    triggerHitMarker: () => set({ hitMarker: Date.now() }),
    reset: () => set({ score: 0, health: 100, gameOver: false, hitMarker: 0 }),
}))

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            mouseSensitivity: 1.0,
            graphics: 'high',
            resolution: 1.0,
            showFPS: false,
            setMouseSensitivity: (value) => set({ mouseSensitivity: value }),
            setGraphics: (value) => set({ graphics: value }),
            setResolution: (value) => set({ resolution: value }),
            setShowFPS: (value) => set({ showFPS: value }),
        }),
        {
            name: 'game-settings',
        }
    )
)

export const useMenuStore = create<MenuState>((set) => ({
    menuOpen: true,
    settingsOpen: false,
    setMenuOpen: (open) => set({ menuOpen: open }),
    setSettingsOpen: (open) => set({ settingsOpen: open }),
}))
