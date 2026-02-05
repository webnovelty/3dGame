# Архитектура Проекта

## Технологический Стек
- **Core**: React, TypeScript, Vite
- **3D Rendering**: Three.js, React Three Fiber (R3F)
- **Helpers**: @react-three/drei
- **UI/Animations**: Framer Motion, Vanilla CSS
- **Debug**: Leva

## Структура Компонентов

### App.tsx
Корневой компонент, инициализирует Canvas и основные провайдеры.

### Components
- **Scene.tsx**: Содержит всю 3D логику, освещение, камеру и объекты.
- **Interface.tsx**: 2D UI слой поверх 3D сцены (HUD, меню).

## Состояние (State Management)
Для простых игр состояние может управляться локально в React или с помощью простых сторов (Zustand), если потребуется масштабирование.
