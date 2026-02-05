import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import Gun, { type GunHandle } from './Gun'
import { useSettingsStore } from '../store'

// Reusable vectors for player movement (object pooling)
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _moveDir = new THREE.Vector3()

export default function Player({ onShoot }: { onShoot: (position: THREE.Vector3, direction: THREE.Vector3) => void }) {
    const { camera } = useThree()
    const { mouseSensitivity } = useSettingsStore()
    const [moveForward, setMoveForward] = useState(false)
    const [moveBackward, setMoveBackward] = useState(false)
    const [moveLeft, setMoveLeft] = useState(false)
    const [moveRight, setMoveRight] = useState(false)
    const velocity = useRef(new THREE.Vector3())
    const [isJumping, setIsJumping] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const gunRef = useRef<GunHandle>(null)
    const lastPosition = useRef(new THREE.Vector3())
    const controlsRef = useRef<any>(null)

    // Apply mouse sensitivity
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.pointerSpeed = mouseSensitivity
        }
    }, [mouseSensitivity])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    setMoveForward(true)
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    setMoveLeft(true)
                    break
                case 'ArrowDown':
                case 'KeyS':
                    setMoveBackward(true)
                    break
                case 'ArrowRight':
                case 'KeyD':
                    setMoveRight(true)
                    break
                case 'Space':
                    if (!isJumping) {
                        velocity.current.y = 5
                        setIsJumping(true)
                    }
                    break
            }
        }

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    setMoveForward(false)
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    setMoveLeft(false)
                    break
                case 'ArrowDown':
                case 'KeyS':
                    setMoveBackward(false)
                    break
                case 'ArrowRight':
                case 'KeyD':
                    setMoveRight(false)
                    break
            }
        }

        const onMouseDown = () => {
            if (gunRef.current) {
                const barrelPos = gunRef.current.getBarrelPosition()
                const direction = new THREE.Vector3()
                camera.getWorldDirection(direction)
                onShoot(barrelPos, direction)
                gunRef.current.triggerRecoil()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('keyup', onKeyUp)
        document.addEventListener('mousedown', onMouseDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
            document.removeEventListener('mousedown', onMouseDown)
        }
    }, [onShoot, camera, isJumping])

    useFrame((_, delta) => {
        // Reuse _forward instead of creating new Vector3
        camera.getWorldDirection(_forward)
        _forward.y = 0
        _forward.normalize()

        // Reuse _right instead of creating new Vector3
        _right.crossVectors(_forward, camera.up).normalize()

        // Reuse _moveDir instead of creating new Vector3
        _moveDir.set(0, 0, 0)
        if (moveForward) _moveDir.add(_forward)
        if (moveBackward) _moveDir.sub(_forward)
        if (moveRight) _moveDir.add(_right)
        if (moveLeft) _moveDir.sub(_right)
        _moveDir.normalize()

        const accel = 150.0

        if (_moveDir.length() > 0) {
            velocity.current.x += _moveDir.x * accel * delta
            velocity.current.z += _moveDir.z * accel * delta
        }

        velocity.current.x -= velocity.current.x * 10.0 * delta
        velocity.current.z -= velocity.current.z * 10.0 * delta

        velocity.current.y -= 9.8 * delta * 2

        camera.position.x += velocity.current.x * delta
        camera.position.z += velocity.current.z * delta
        camera.position.y += velocity.current.y * delta

        if (camera.position.y < 1.6) {
            velocity.current.y = 0
            camera.position.y = 1.6
            setIsJumping(false)
        }

        const moved = camera.position.distanceTo(lastPosition.current) > 0.01
        setIsMoving(moved)
        lastPosition.current.copy(camera.position)
    })

    return (
        <group>
            <PointerLockControls ref={controlsRef} pointerSpeed={mouseSensitivity} />
            <Gun ref={gunRef} isMoving={isMoving} />
            <Legs />
        </group>
    )
}

function Legs() {
    const { camera } = useThree()
    const ref = useRef<THREE.Group>(null)
    const [visible, setVisible] = useState(false)

    useFrame((state) => {
        if (!ref.current) return

        ref.current.position.copy(camera.position)
        ref.current.position.y -= 1.6

        const euler = new THREE.Euler(0, 0, 0, 'YXZ')
        euler.setFromQuaternion(camera.quaternion)
        ref.current.rotation.y = euler.y

        setVisible(euler.x < -0.5)

        const isMoving = Math.abs(camera.position.x - (ref.current.userData.lastX || 0)) > 0.01 ||
            Math.abs(camera.position.z - (ref.current.userData.lastZ || 0)) > 0.01

        ref.current.userData.lastX = camera.position.x
        ref.current.userData.lastZ = camera.position.z

        if (isMoving) {
            const time = state.clock.elapsedTime * 10
            const leftLeg = ref.current.children[0]
            const rightLeg = ref.current.children[1]

            leftLeg.rotation.x = Math.sin(time) * 0.5
            rightLeg.rotation.x = Math.sin(time + Math.PI) * 0.5
        } else {
            const leftLeg = ref.current.children[0]
            const rightLeg = ref.current.children[1]
            leftLeg.rotation.x = 0
            rightLeg.rotation.x = 0
        }
    })

    return (
        <group ref={ref} visible={visible}>
            <mesh position={[-0.2, 0.75, 0]}>
                <boxGeometry args={[0.15, 1.5, 0.15]} />
                <meshStandardMaterial color="blue" />
            </mesh>
            <mesh position={[0.2, 0.75, 0]}>
                <boxGeometry args={[0.15, 1.5, 0.15]} />
                <meshStandardMaterial color="blue" />
            </mesh>
        </group>
    )
}
