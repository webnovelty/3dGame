import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TargetProps {
    position: [number, number, number]
    onHit: () => void
}

export default function Target({ position, onHit }: TargetProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hit, setHit] = useState(false)

    useFrame((state) => {
        if (meshRef.current && !hit) {
            // Simple floating animation
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.005
        }
    })

    // Expose mesh for collision detection in Scene (simplified for now)
    // Ideally, we'd use a physics engine or a global store for positions.
    // For this simple demo, we'll check distance in Scene or Bullet.

    // Actually, let's make the target check for bullets if we passed them down, 
    // but for better performance/architecture in React, 
    // let's handle collisions in the parent Scene or use a simple distance check here if we had global state.

    // For this MVP, we will rely on the Scene to check collisions or Raycaster.
    // But to keep it simple without Raycaster complex setup, let's just give it a bounding box.

    return (
        <mesh
            ref={meshRef}
            position={position}
            userData={{ isTarget: true, onHit: () => { setHit(true); setTimeout(onHit, 100); } }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hit ? 'red' : 'green'} />
        </mesh>
    )
}
