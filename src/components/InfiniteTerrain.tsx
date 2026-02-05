import { useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Forest from './Forest'

const CHUNK_SIZE = 200
const RENDER_DISTANCE = 2 // chunks in each direction

interface Chunk {
    x: number
    z: number
    key: string
}

export default function InfiniteTerrain() {
    const { camera } = useThree()
    const [chunks, setChunks] = useState<Chunk[]>([])
    const texture = useTexture('/floor.jpg')

    useEffect(() => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(50, 50)

        // Initial chunk generation
        const initialChunks: Chunk[] = []
        for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
            for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
                initialChunks.push({ x, z, key: `${x},${z}` })
            }
        }
        setChunks(initialChunks)
    }, [texture])

    useFrame(() => {
        const playerX = camera.position.x
        const playerZ = camera.position.z

        const currentChunkX = Math.floor(playerX / CHUNK_SIZE)
        const currentChunkZ = Math.floor(playerZ / CHUNK_SIZE)

        const newChunks: Chunk[] = []

        for (let x = currentChunkX - RENDER_DISTANCE; x <= currentChunkX + RENDER_DISTANCE; x++) {
            for (let z = currentChunkZ - RENDER_DISTANCE; z <= currentChunkZ + RENDER_DISTANCE; z++) {
                newChunks.push({
                    x,
                    z,
                    key: `${x},${z}`
                })
            }
        }

        // Update chunks if changed
        const newKeys = new Set(newChunks.map(c => c.key))
        const oldKeys = new Set(chunks.map(c => c.key))

        const hasChanged = newKeys.size !== oldKeys.size ||
            [...newKeys].some(k => !oldKeys.has(k))

        if (hasChanged) {
            setChunks(newChunks)
        }
    })

    return (
        <>
            {chunks.map((chunk) => {
                const offsetX = chunk.x * CHUNK_SIZE
                const offsetZ = chunk.z * CHUNK_SIZE

                return (
                    <group key={chunk.key} position={[offsetX, 0, offsetZ]}>
                        {/* Floor chunk */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                            <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
                            <meshStandardMaterial map={texture} />
                        </mesh>

                        {/* Forest for this chunk */}
                        <Forest count={50} boundary={CHUNK_SIZE / 2} offset={[offsetX, 0, offsetZ]} />
                    </group>
                )
            })}
        </>
    )
}
