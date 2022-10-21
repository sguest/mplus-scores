export interface Color {
    a: number
    r: number
    b: number
    g: number
}

export interface Icon {
    url: string
}

export interface Rating {
    color: Color
    rating: number
}

export interface Modifier {
    description: string
    id: number
    name: string
    icon: Icon
}

export interface EnumValue {
    enum: string
    id: number
    name: string
    slug: string
}

export interface Spec extends EnumValue {
    role: EnumValue
}

export interface PartyMember {
    avatar: Icon
    averageItemLevel: number
    class: EnumValue
    name: string
    race: EnumValue
    realm: { name: string, slug: string }
    region: string
    spec: Spec
    url: string
}

export interface DungeonInfo {
    description: string
    expansion: EnumValue
    icon: Icon
    id: number
    name: string
    slug: string
    thumbnail: Icon
    url: string
}

export interface Dungeon {
    completed: string
    dungeon: DungeonInfo
    dungeonRating: Rating
    duration: number
    id: string
    level: number
    mapRating: Rating
    modifiers: Modifier[]
    party: PartyMember[]
    qualifyingDuration: number
    time: string
    withinTime: boolean
}

export default interface MplusData {
    expansion: string
    season: number
    dungeons: Dungeon[]
}