export default interface KeystoneDefinition {
    dungeon: string
    level: number
    type: 'Fortified' | 'Tyrannical'
    elapsedSeconds: number
    elapsedMinutes: number
    percentTime: number
}