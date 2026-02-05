import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface GunHandle {
    getBarrelPosition: () => THREE.Vector3
    triggerRecoil: () => void
}

interface GunProps {
    isMoving: boolean
}

const Gun = forwardRef<GunHandle, GunProps>(({ isMoving }, ref) => {
    const { camera } = useThree()
    const groupRef = useRef<THREE.Group>(null)
    const barrelRef = useRef<THREE.Mesh>(null)
    const recoilTime = useRef(0)
    const walkCycle = useRef(0)
    const barrelWorldPos = useRef(new THREE.Vector3())

    useImperativeHandle(ref, () => ({
        getBarrelPosition: () => {
            return barrelWorldPos.current.clone()
        },
        triggerRecoil: () => {
            recoilTime.current = Date.now()
        }
    }))

    useFrame((state) => {
        if (!groupRef.current) return

        // Get camera world transform
        const cameraWorldPosition = new THREE.Vector3()
        const cameraWorldQuaternion = new THREE.Quaternion()
        camera.getWorldPosition(cameraWorldPosition)
        camera.getWorldQuaternion(cameraWorldQuaternion)

        // Apply camera transform to gun
        groupRef.current.position.copy(cameraWorldPosition)
        groupRef.current.quaternion.copy(cameraWorldQuaternion)

        // Apply local offset in camera space
        const localOffset = new THREE.Vector3(0.3, -0.25, -0.4)

        // Walking bob animation (slowed down)
        if (isMoving) {
            walkCycle.current += state.clock.getDelta() * 6 // Reduced from 10
            localOffset.y += Math.sin(walkCycle.current) * 0.015 // Reduced amplitude
            localOffset.x += Math.cos(walkCycle.current * 0.5) * 0.008 // Reduced amplitude
        }

        // Recoil animation
        const timeSinceRecoil = (Date.now() - recoilTime.current) / 1000
        if (timeSinceRecoil < 0.2) {
            const recoilAmount = Math.max(0, 1 - timeSinceRecoil / 0.2)
            localOffset.z += recoilAmount * 0.1 // Pull back
            localOffset.y += recoilAmount * 0.05 // Lift up
        }

        localOffset.applyQuaternion(cameraWorldQuaternion)
        groupRef.current.position.add(localOffset)

        // Idle sway
        const time = state.clock.elapsedTime
        groupRef.current.rotation.z += Math.sin(time * 2) * 0.0005
        groupRef.current.rotation.y += Math.cos(time * 1.5) * 0.0005

        // Update barrel world position AFTER all transformations
        if (barrelRef.current) {
            groupRef.current.updateMatrixWorld()
            barrelRef.current.getWorldPosition(barrelWorldPos.current)

            // Add offset to tip of barrel (forward in barrel's local space)
            const barrelTipOffset = new THREE.Vector3(0, -0.2, 0) // -Y because cylinder is rotated
            barrelTipOffset.applyQuaternion(barrelRef.current.getWorldQuaternion(new THREE.Quaternion()))
            barrelWorldPos.current.add(barrelTipOffset)
        }
    }, 1) // Priority 1 to update AFTER camera movement

    return (
        <group ref={groupRef}>
            {/* Handle */}
            <mesh position={[0, -0.1, 0]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.08, 0.25, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Barrel */}
            <mesh ref={barrelRef} position={[0, 0.05, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
                <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Slide */}
            <mesh position={[0, 0.05, 0.05]}>
                <boxGeometry args={[0.08, 0.06, 0.2]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    )
})

Gun.displayName = 'Gun'

export default Gun
