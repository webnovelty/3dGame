import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

interface EnemyProps {
    initialPosition: [number, number, number]
    health: number
    maxHealth: number
    registerMesh: (id: number, mesh: THREE.Mesh) => void
    unregisterMesh: (id: number) => void
    id: number
    lastHit: number
}

export default function Enemy({ initialPosition, health, maxHealth, registerMesh, unregisterMesh, id, lastHit }: EnemyProps) {
    const groupRef = useRef<THREE.Group>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!)

    const speed = 0.5

    useEffect(() => {
        console.log(`Enemy ${id} spawned at ${initialPosition}`)
        if (meshRef.current) {
            registerMesh(id, meshRef.current)
        }
        return () => {
            unregisterMesh(id)
        }
    }, [id, registerMesh, unregisterMesh, initialPosition])

    // Flash effect
    useEffect(() => {
        if (lastHit > 0 && materialRef.current) {
            materialRef.current.color.set('white')
            const timeout = setTimeout(() => {
                if (materialRef.current) materialRef.current.color.set('red')
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [lastHit])

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Move towards player (camera)
            const playerPos = state.camera.position
            const enemyPos = groupRef.current.position

            const direction = new THREE.Vector3()
            direction.subVectors(playerPos, enemyPos).normalize()

            // Ignore Y axis for movement (stay on ground)
            direction.y = 0

            groupRef.current.position.add(direction.multiplyScalar(speed * delta))
            groupRef.current.lookAt(playerPos.x, groupRef.current.position.y, playerPos.z)
        }
    })

    return (
        <group ref={groupRef} position={initialPosition}>
            <mesh
                ref={meshRef}
                userData={{ isTarget: true }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial ref={materialRef} color="red" />
                {/* Eyes */}
                <mesh position={[0.2, 0.2, 0.4]}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.2, 0.2, 0.4]}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </mesh>

            {/* Health Bar */}
            <Billboard position={[0, 1.5, 0]}>
                <Text fontSize={0.5} color="white">
                    {Math.ceil(health)}/{maxHealth}
                </Text>
                <mesh position={[0, -0.3, 0]}>
                    <planeGeometry args={[1, 0.1]} />
                    <meshBasicMaterial color="gray" />
                </mesh>
                <mesh position={[-0.5 + (health / maxHealth) * 0.5, -0.3, 0.01]}>
                    <planeGeometry args={[health / maxHealth, 0.1]} />
                    <meshBasicMaterial color="green" />
                </mesh>
            </Billboard>
        </group>
    )
}
