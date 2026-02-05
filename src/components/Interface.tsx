import { motion } from 'framer-motion'

export default function Interface() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ padding: '20px', color: 'white', fontFamily: 'sans-serif' }}
            >
                <h1>3D Web Game</h1>
                <p>Click on the cubes to interact</p>
            </motion.div>
        </div>
    )
}
