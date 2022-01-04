export enum Mode {
  Display = 'display',
  Template = 'template'
}

/**
 * Get available modes.
 */
export const getModes = (): string[] => {
  return Object.values(Mode)
}
