# Архитектура Проекта

## Технологический Стек
- **Core**: React 19, TypeScript, Vite 7
- **3D Rendering**: Three.js 0.181, React Three Fiber 9
- **Helpers**: @react-three/drei (Stats, PointerLockControls, Billboard, Text)
- **State Management**: Zustand с persist middleware
- **UI/Animations**: Framer Motion, Vanilla CSS
- **Debug**: Leva (опционально)

## Структура Компонентов

### App.tsx
Корневой компонент, управляет:
- Глобальными keyboard events (Escape для паузы)
- Pointer lock состоянием
- Рендерингом Menu, Scene и HUD

### 3D Компоненты (src/components/)
- **Scene.tsx**: Canvas, освещение, Game loop с коллизиями, настройки графики
- **Player.tsx**: Управление игроком (WASD, прыжок, стрельба), физика движения
- **Gun.tsx**: 3D модель оружия, анимации отдачи и покачивания
- **Bullet.tsx**: Рендеринг пуль с движением
- **Enemy.tsx**: AI врагов (движение к игроку), здоровье, hit effects

### UI Компоненты
- **HUD.tsx**: Очки, здоровье, прицел, hit marker, экран Game Over
- **Menu.tsx**: Главное меню, настройки (чувствительность, графика, FPS)
- **ErrorBoundary.tsx**: Обработка ошибок рендеринга

## Состояние (State Management)

### Zustand Stores (src/store.ts)

| Store | Назначение | Persist |
|-------|-----------|---------|
| `useGameStore` | score, health, gameOver, hitMarker | Нет |
| `useSettingsStore` | mouseSensitivity, graphics, resolution, showFPS | Да |
| `useMenuStore` | menuOpen, settingsOpen | Нет |

## Оптимизация

Подробности в [optimization.md](./optimization.md):
- Object pooling для Vector3/Quaternion
- Применение настроек графики (DPR, shadows, antialias)
- FPS counter через @react-three/drei Stats
