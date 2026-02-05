import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface BulletProps {
    position: THREE.Vector3
    direction: THREE.Vector3
    onHit: (id: string) => void
    id: string
    spawnTime: number
    speed: number
}

export default function Bullet({ position, direction, onHit: _onHit, id: _id, spawnTime, speed }: BulletProps) {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current) {
            const age = (Date.now() - spawnTime) / 1000
            // Optimized: use copy + addScaledVector instead of clone + multiplyScalar
            meshRef.current.position.copy(position).addScaledVector(direction, speed * age)
        }
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="yellow" />
        </mesh>
    )
}
