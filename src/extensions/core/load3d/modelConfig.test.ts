import { describe, expect, it } from 'vitest'

import type { GizmoConfig } from './interfaces'
import {
  activeGizmoConfig,
  defaultGizmoConfig,
  normalizeGizmoModels
} from './modelConfig'

const fullGizmo: GizmoConfig = {
  enabled: true,
  mode: 'rotate',
  position: { x: 1, y: 2, z: 3 },
  rotation: { x: 0.1, y: 0.2, z: 0.3 },
  scale: { x: 2, y: 2, z: 2 }
}

describe('normalizeGizmoModels', () => {
  it('returns a single default entry when neither models nor gizmo exist', () => {
    expect(normalizeGizmoModels({})).toEqual([defaultGizmoConfig()])
  })

  it('migrates a legacy gizmo field into a one-element list', () => {
    expect(normalizeGizmoModels({ gizmo: fullGizmo })).toEqual([fullGizmo])
  })

  it('backfills scale on a legacy gizmo missing it', () => {
    const legacy = {
      enabled: false,
      mode: 'translate',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    } as unknown as GizmoConfig

    expect(normalizeGizmoModels({ gizmo: legacy })[0].scale).toEqual({
      x: 1,
      y: 1,
      z: 1
    })
  })

  it('prefers an existing models list over the legacy gizmo', () => {
    expect(
      normalizeGizmoModels({ models: [fullGizmo], gizmo: defaultGizmoConfig() })
    ).toEqual([fullGizmo])
  })
})

describe('activeGizmoConfig', () => {
  it('returns the first models entry when present', () => {
    expect(activeGizmoConfig({ models: [fullGizmo] })).toBe(fullGizmo)
  })

  it('falls back to the legacy gizmo field', () => {
    expect(activeGizmoConfig({ gizmo: fullGizmo })).toBe(fullGizmo)
  })

  it('returns undefined when neither is set', () => {
    expect(activeGizmoConfig({})).toBeUndefined()
  })
})
