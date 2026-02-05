# 3D Shooter Game

A first-person 3D shooter game built with React, TypeScript, Three.js, and React Three Fiber.

## Features

### Core Gameplay
- **First-person controls**: WASD movement, mouse look
- **Shooting mechanics**: Left-click to shoot with hit detection
- **Enemy AI**: Enemies chase and attack the player
- **Health system**: Player takes damage from enemy attacks

### Wave System
- **Progressive waves**: Enemies spawn in waves with increasing difficulty
- **Scaling difficulty**: Each wave adds more enemies with higher health
- **Wave countdown**: 3-second preparation period between waves
- **Wave UI**: Displays current wave number and remaining enemies

### Performance Optimizations
- **Object pooling**: Efficient memory management for Vector3/Quaternion objects
- **Dynamic graphics settings**: Adjustable DPR, shadows, and antialiasing
- **FPS monitoring**: Built-in Stats component for performance tracking

### Settings
- **Volume control**: Music and sound effects
- **Graphics presets**: Low, Medium, High, Ultra
- **Sensitivity**: Mouse sensitivity adjustment

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Zustand** - State management

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move |
| Mouse | Look around |
| Left Click | Shoot |
| ESC | Pause menu |

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx      # Main game scene and logic
│   ├── Player.tsx     # Player controller
│   ├── Enemy.tsx      # Enemy AI and rendering
│   ├── Gun.tsx        # Weapon model and animations
│   ├── Bullet.tsx     # Projectile physics
│   ├── HUD.tsx        # Health, score, wave display
│   ├── Menu.tsx       # Pause menu and settings
│   └── ErrorBoundary.tsx
├── store.ts           # Zustand state management
├── App.tsx            # Application root
└── main.tsx           # Entry point
```

## Wave System Details

The wave system introduces progressive difficulty:

| Wave | Enemies | Enemy Health |
|------|---------|--------------|
| 1    | 3       | 100          |
| 2    | 5       | 125          |
| 3    | 7       | 150          |
| 4    | 9       | 175          |
| ...  | +2/wave | +25/wave     |

Enemies spawn in a circle around the player at the start of each wave, with a 3-second countdown to prepare.

## License

MIT
