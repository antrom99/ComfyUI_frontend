import type { GizmoConfig, ModelConfig } from './interfaces'

export function defaultGizmoConfig(): GizmoConfig {
  return {
    enabled: false,
    mode: 'translate',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }
}

function withDefaultScale(gizmo: GizmoConfig): GizmoConfig {
  return { ...gizmo, scale: gizmo.scale ?? { x: 1, y: 1, z: 1 } }
}

/**
 * Resolve the persisted per-object gizmo transforms as a list, migrating the
 * legacy single `gizmo` field. The viewer renders a single main object today,
 * so this is normally a one-element list.
 */
export function normalizeGizmoModels(
  config: Pick<ModelConfig, 'gizmo' | 'models'>
): GizmoConfig[] {
  if (config.models?.length) {
    return config.models.map(withDefaultScale)
  }
  if (config.gizmo) {
    return [withDefaultScale(config.gizmo)]
  }
  return [defaultGizmoConfig()]
}

export function activeGizmoConfig(
  config: Pick<ModelConfig, 'gizmo' | 'models'>
): GizmoConfig | undefined {
  return config.models?.[0] ?? config.gizmo
}
