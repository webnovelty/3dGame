import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, Stats } from '@react-three/drei'
import { useState, useRef, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import Player from './Player'
import Bullet from './Bullet'
import Enemy from './Enemy'
import { useGameStore, useSettingsStore } from '../store'

// Reusable Vector3 objects to avoid GC pressure (object pooling)
const _bulletPos = new THREE.Vector3()
const _enemyWorldPos = new THREE.Vector3()

function Lake() {
    const texture = useTexture('/water.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)

    // Animate water texture offset
    useFrame((_, delta) => {
        texture.offset.x += delta * 0.05
        texture.offset.y += delta * 0.05
    })

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0.1, 100]}>
            <circleGeometry args={[50, 32]} />
            <meshStandardMaterial map={texture} color="#00aaff" transparent opacity={0.8} />
        </mesh>
    )
}

function Game() {
    const [bullets, setBullets] = useState<any[]>([])
    const [enemies, setEnemies] = useState([
        { id: 1, position: new THREE.Vector3(-10, 1, -20), health: 100, maxHealth: 100, active: true, lastHit: 0 },
        { id: 2, position: new THREE.Vector3(0, 1, -25), health: 100, maxHealth: 100, active: true, lastHit: 0 },
        { id: 3, position: new THREE.Vector3(10, 1, -20), health: 100, maxHealth: 100, active: true, lastHit: 0 },
        { id: 4, position: new THREE.Vector3(-15, 1, -30), health: 100, maxHealth: 100, active: true, lastHit: 0 },
        { id: 5, position: new THREE.Vector3(15, 1, -30), health: 100, maxHealth: 100, active: true, lastHit: 0 },
    ])

    const {
        setScore,
        setHealth: setPlayerHealth,
        gameOver, setGameOver,
        triggerHitMarker
    } = useGameStore()

    const lastEnemyAttackTime = useRef(0)
    const enemyMeshes = useRef<{ [key: number]: THREE.Mesh }>({})
    const enemiesRef = useRef(enemies)

    useEffect(() => {
        enemiesRef.current = enemies
    }, [enemies.length, gameOver])

    const registerEnemyMesh = (id: number, mesh: THREE.Mesh) => {
        enemyMeshes.current[id] = mesh
    }

    const unregisterEnemyMesh = (id: number) => {
        delete enemyMeshes.current[id]
    }

    const handleShoot = (position: THREE.Vector3, direction: THREE.Vector3) => {
        if (gameOver) return
        const id = Math.random().toString(36).substr(2, 9)
        setBullets((prev) => [...prev, { id, position, direction, speed: 20, spawnTime: Date.now() }])
    }

    useFrame((state) => {
        if (gameOver) return

        const playerPos = state.camera.position
        const time = state.clock.elapsedTime

        // --- Bullet-Enemy Collision ---
        const bulletsToRemove = new Set<string>()
        let enemiesChanged = false
        const currentEnemies = [...enemiesRef.current]
        let hitMarkerTriggered = false

        bullets.forEach((bullet: any) => {
            const age = (Date.now() - bullet.spawnTime) / 1000
            if (age > 5) {
                bulletsToRemove.add(bullet.id)
                return
            }

            // Reuse _bulletPos instead of creating new Vector3
            _bulletPos.copy(bullet.position)
            _bulletPos.addScaledVector(bullet.direction, bullet.speed * age)

            for (let i = 0; i < currentEnemies.length; i++) {
                const enemy = currentEnemies[i]
                if (enemy.active && enemyMeshes.current[enemy.id]) {
                    const enemyMesh = enemyMeshes.current[enemy.id]
                    // Reuse _enemyWorldPos instead of creating new Vector3
                    enemyMesh.getWorldPosition(_enemyWorldPos)

                    const dist = _bulletPos.distanceTo(_enemyWorldPos)
                    if (dist < 1.5) {
                        bulletsToRemove.add(bullet.id)
                        currentEnemies[i] = { ...enemy, health: enemy.health - 25, lastHit: Date.now() }
                        enemiesChanged = true
                        hitMarkerTriggered = true

                        if (currentEnemies[i].health <= 0) {
                            currentEnemies[i] = { ...currentEnemies[i], active: false }
                            setScore((s: number) => s + 100)
                            unregisterEnemyMesh(enemy.id)
                        }
                        break
                    }
                }
            }
        })

        if (hitMarkerTriggered) triggerHitMarker()
        if (enemiesChanged) {
            enemiesRef.current = currentEnemies
            setEnemies(currentEnemies)
        }
        if (bulletsToRemove.size > 0) {
            setBullets((prev: any[]) => prev.filter((b: any) => !bulletsToRemove.has(b.id)))
        }

        // --- Enemy-Player Collision (Attack) ---
        const activeEnemies = enemiesRef.current.filter((e: any) => e.active)
        for (const enemy of activeEnemies) {
            if (enemyMeshes.current[enemy.id]) {
                const enemyMesh = enemyMeshes.current[enemy.id]
                // Reuse _enemyWorldPos
                enemyMesh.getWorldPosition(_enemyWorldPos)

                const distToPlayer = _enemyWorldPos.distanceTo(playerPos)
                if (distToPlayer < 2.0) {
                    if (time - lastEnemyAttackTime.current > 1.0) {
                        setPlayerHealth((h: number) => {
                            const newHealth = h - 10
                            if (newHealth <= 0) {
                                setGameOver(true)
                                return 0
                            }
                            return newHealth
                        })
                        lastEnemyAttackTime.current = time
                    }
                }
            }
        }
    })

    return (
        <>
            {/* Sky blue background */}
            <color attach="background" args={['#87CEEB']} />
            <fog attach="fog" args={['#87CEEB', 50, 200]} />

            {/* Lights */}
            <ambientLight intensity={1.0} />
            <directionalLight position={[10, 10, 5]} intensity={2.0} castShadow />
            <hemisphereLight intensity={0.5} />

            {/* Simple green floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="green" />
            </mesh>

            {/* Red debug cube */}
            <mesh position={[0, 2, -5]}>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>

            <Lake />

            {!gameOver && <Player onShoot={handleShoot} />}

            {bullets.map((b) => (
                <Bullet
                    key={b.id}
                    {...b}
                    onHit={(id) => setBullets((prev) => prev.filter((item) => item.id !== id))}
                />
            ))}

            {enemies.map((t: any) => (
                t.active && (
                    <Enemy
                        key={t.id}
                        initialPosition={[t.position.x, t.position.y, t.position.z]}
                        health={t.health}
                        maxHealth={t.maxHealth}
                        lastHit={t.lastHit || 0}
                        registerMesh={registerEnemyMesh}
                        unregisterMesh={unregisterEnemyMesh}
                        id={t.id}
                    />
                )
            ))}
        </>
    )
}

export default function Scene() {
    const { graphics, resolution, showFPS } = useSettingsStore()
    
    // Memoize settings to avoid unnecessary re-renders
    const shadowsEnabled = useMemo(() => graphics !== 'low', [graphics])
    const dpr = useMemo(() => {
        // Clamp resolution between 0.5 and device pixel ratio
        const maxDpr = Math.min(window.devicePixelRatio, 2)
        return Math.min(resolution, maxDpr)
    }, [resolution])
    
    return (
        <Canvas
            shadows={shadowsEnabled}
            dpr={dpr}
            camera={{ position: [0, 1.6, 5], fov: 75 }}
            onClick={(e) => (e.target as HTMLElement).requestPointerLock()}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
            gl={{ 
                antialias: graphics === 'high',
                powerPreference: graphics === 'low' ? 'low-power' : 'high-performance'
            }}
        >
            {showFPS && <Stats />}
            <Suspense fallback={null}>
                <Game />
            </Suspense>
        </Canvas>
    )
}
