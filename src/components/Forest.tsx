import { Instance, Instances } from '@react-three/drei'
import { useMemo } from 'react'

type TreeData = {
    position: [number, number, number]
    scale: number
}

interface ForestProps {
    count?: number
    boundary?: number
    offset?: [number, number, number]
}

export default function Forest({ count = 100, boundary = 200, offset = [0, 0, 0] }: ForestProps) {
    const { pines, broadleaves } = useMemo(() => {
        const pines: TreeData[] = []
        const broadleaves: TreeData[] = []

        // Use offset for seeded random
        const seed = offset[0] * 1000 + offset[2]

        for (let i = 0; i < count; i++) {
            // Seeded random for consistent trees per chunk
            const random1 = Math.abs(Math.sin(seed + i * 12.9898) * 43758.5453) % 1
            const random2 = Math.abs(Math.sin(seed + i * 78.233) * 43758.5453) % 1
            const random3 = Math.abs(Math.sin(seed + i * 37.719) * 43758.5453) % 1
            const random4 = Math.abs(Math.sin(seed + i * 56.512) * 43758.5453) % 1

            const x = (random1 - 0.5) * boundary
            const z = (random2 - 0.5) * boundary

            // Safe zone only for center chunk
            if (offset[0] === 0 && offset[2] === 0) {
                if (Math.abs(x) < 20 && Math.abs(z) < 20) continue
            }

            const scale = 0.8 + random3 * 0.6
            const type = random4 > 0.5 ? 'pine' : 'broadleaf'

            if (type === 'pine') {
                pines.push({ position: [x, 0, z], scale })
            } else {
                broadleaves.push({ position: [x, 0, z], scale })
            }
        }
        return { pines, broadleaves }
    }, [count, boundary, offset])

    return (
        <group>
            <PineTrees data={pines} />
            <BroadleafTrees data={broadleaves} />
        </group>
    )
}

function PineTrees({ data }: { data: TreeData[] }) {
    if (data.length === 0) return null
    return (
        <group>
            {/* Trunks */}
            <Instances range={data.length}>
                <cylinderGeometry args={[0.5, 0.8, 2, 6]} />
                <meshStandardMaterial color="#4a3728" />
                {data.map((d, i) => (
                    <Instance
                        key={i}
                        position={[d.position[0], 1 * d.scale, d.position[2]]}
                        scale={[d.scale, d.scale, d.scale]}
                    />
                ))}
            </Instances>
            {/* Foliage Bottom Layer */}
            <Instances range={data.length}>
                <coneGeometry args={[2.5, 4, 8]} />
                <meshStandardMaterial color="#1a472a" />
                {data.map((d, i) => (
                    <Instance
                        key={i}
                        position={[d.position[0], 3 * d.scale, d.position[2]]}
                        scale={[d.scale, d.scale, d.scale]}
                    />
                ))}
            </Instances>
            {/* Foliage Top Layer */}
            <Instances range={data.length}>
                <coneGeometry args={[1.8, 3, 8]} />
                <meshStandardMaterial color="#2d5a3f" />
                {data.map((d, i) => (
                    <Instance
                        key={i}
                        position={[d.position[0], 5 * d.scale, d.position[2]]}
                        scale={[d.scale, d.scale, d.scale]}
                    />
                ))}
            </Instances>
        </group>
    )
}

function BroadleafTrees({ data }: { data: TreeData[] }) {
    if (data.length === 0) return null
    return (
        <group>
            {/* Trunks */}
            <Instances range={data.length}>
                <cylinderGeometry args={[0.4, 0.6, 2, 6]} />
                <meshStandardMaterial color="#5c4033" />
                {data.map((d, i) => (
                    <Instance
                        key={i}
                        position={[d.position[0], 1 * d.scale, d.position[2]]}
                        scale={[d.scale, d.scale, d.scale]}
                    />
                ))}
            </Instances>
            {/* Foliage */}
            <Instances range={data.length}>
                <dodecahedronGeometry args={[2.2, 0]} />
                <meshStandardMaterial color="#4caf50" />
                {data.map((d, i) => (
                    <Instance
                        key={i}
                        position={[d.position[0], 3.5 * d.scale, d.position[2]]}
                        scale={[d.scale, d.scale, d.scale]}
                    />
                ))}
            </Instances>
        </group>
    )
}
