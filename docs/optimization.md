# Оптимизация производительности

## Обзор

Проект оптимизирован для высокой производительности в браузере с минимальной нагрузкой на garbage collector.

## Object Pooling для Vector3

### Проблема
Three.js операции часто требуют создания временных объектов `Vector3`, `Quaternion` и т.д. Создание новых объектов в каждом кадре приводит к:
- Частому срабатыванию garbage collector
- Просадкам FPS (stuttering)
- Повышенному потреблению памяти

### Решение
Создание переиспользуемых объектов на уровне модуля:

```typescript
// Вместо создания в useFrame:
const direction = new THREE.Vector3()

// Используем переиспользуемый объект:
const _direction = new THREE.Vector3() // На уровне модуля

useFrame(() => {
    _direction.subVectors(target, position).normalize()
})
```

### Оптимизированные компоненты

| Компонент | Переиспользуемые объекты |
|-----------|-------------------------|
| `Scene.tsx` | `_bulletPos`, `_enemyWorldPos` |
| `Player.tsx` | `_forward`, `_right`, `_moveDir` |
| `Enemy.tsx` | `_direction` |
| `Gun.tsx` | `_cameraWorldPosition`, `_cameraWorldQuaternion`, `_localOffset`, `_barrelTipOffset`, `_tempQuaternion` |

## Применение настроек графики

Настройки из store теперь реально влияют на рендеринг:

### Resolution (DPR)
```typescript
<Canvas dpr={resolution} />
```
- Значение `0.5` - низкое качество, высокий FPS
- Значение `1.0` - стандартное качество
- Значение `2.0` - высокое качество (для Retina)

### Graphics Quality
```typescript
<Canvas 
    shadows={graphics !== 'low'}
    gl={{ 
        antialias: graphics === 'high',
        powerPreference: graphics === 'low' ? 'low-power' : 'high-performance'
    }}
/>
```

### FPS Counter
```typescript
{showFPS && <Stats />}
```
Использует `@react-three/drei` Stats компонент для отображения FPS.

## Рекомендации по дальнейшей оптимизации

1. **Instanced Meshes** - для большого количества одинаковых объектов (пули, враги)
2. **Spatial Hashing** - для O(1) проверки коллизий при большом количестве объектов
3. **Level of Detail (LOD)** - уменьшение детализации далёких объектов
4. **Frustum Culling** - отключение рендеринга объектов вне поля зрения
5. **Web Workers** - вынос физики в отдельный поток
