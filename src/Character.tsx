import { useEffect, useState } from 'react';
import CharacterId from './CharacterId';
import GetArmoryData from './GetArmoryData';
import MplusData, { Color } from './MplusData';

export interface CharacterProps {
    characterId: CharacterId
    dungeonSlugs: string[],
    onDelete: () => void,
}

interface Dungeon {
    slug: string
    rating: number
    ratingColour: string
    level: number
    highRating: number
    highValue: number
    highType: string
    highColour: string
    lowRating: number
    lowValue: number
    lowType: string
    lowColour: string
}

const classColours: {[key: string]: string} = {
    'death-knight': '#c41e3a',
    'demon-hunter': '#a330c9',
    'druid': '#ff7c0a',
    'evoker': '#33937f',
    'hunter': '#aad372',
    'mage': '#3fc7eb',
    'monk': '#00ff98',
    'paladin': '#f48cba',
    'priest': '#fff',
    'rogue': '#fff468',
    'shaman': '#0070dd',
    'warlock': '#8788ee',
    'warrior': '#c69b6d',
}

const dungeonRatingCutoffs: {[key: number]: string} = {
    138: 'rgba(255, 128, 0)',   //orange
    112: 'rgba(163, 53, 238)',  //purple - could be anywhere from 111-113
    50: 'rgba(0, 112, 221)',    //blue - cutoff is a total guess. Minimum bound unknown
    3: 'rgba(30, 255, 0)',      //green - minimum unknown
    0: '#777',
}

// these are mostly guesses based on previous season ratios
const totalRatingCutoffs: {[key: number]: string} = {
    2400: 'rgba(255, 128, 0)',   //orange
    1800: 'rgba(163, 53, 238)',  //purple
    1200: 'rgba(0, 112, 221)',    //blue
    720: 'rgba(30, 255, 0)',      //green
    0: 'white',

}

function getRgba(colour: Color) {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
}

export default function Character(props: CharacterProps) {
    const [dungeons, setDungeons] = useState<{[key: string]: Dungeon}>({});
    const [characterClass, setCharacterClass] = useState<string | undefined>();
    const { characterId, dungeonSlugs } = props;

    useEffect(() => {
        GetArmoryData(props.characterId)
        .then((data: MplusData) => {
            let newDungeons: {[key: string]: Dungeon} = {};
            data.dungeons.forEach(dungeon => {
                let dungeonData: Dungeon;

                if(dungeon.modifiers) {
                    const highType = dungeon.modifiers.find(m => m.name === 'Fortified' || m.name === 'Tyrannical')!.name;
                    const lowType = highType === 'Fortified' ? 'Tyrannical' : 'Fortified';
                    const highValue = dungeon.dungeonRating.rating * 1.5;
                    const lowValue = dungeon.mapRating.rating - highValue;
                    const lowRating = lowValue * 2;

                    let lowColour = '#777';

                    for(let cutoff in dungeonRatingCutoffs) {
                        if(lowRating >= +cutoff) {
                            lowColour = dungeonRatingCutoffs[cutoff];
                        }
                    }

                    setCharacterClass(dungeon.party.find(p => !p.name.localeCompare(characterId.name, undefined, {sensitivity: 'accent'}) &&
                        !p.realm.name.localeCompare(characterId.realm, undefined, {sensitivity: 'accent'}) &&
                        !p.region.localeCompare(characterId.region, undefined, { sensitivity: 'accent'}))?.class.slug);
                    dungeonData = {
                        slug: dungeon.dungeon.slug,
                        rating: dungeon.mapRating.rating,
                        ratingColour: getRgba(dungeon.mapRating.color),
                        level: dungeon.level,
                        highRating: dungeon.dungeonRating.rating,
                        highValue,
                        highType,
                        highColour: getRgba(dungeon.dungeonRating.color),
                        lowRating,
                        lowValue,
                        lowType,
                        lowColour,
                    }
                }
                else {
                    dungeonData = {
                        slug: dungeon.dungeon.slug,
                        rating: 0,
                        ratingColour: '#777',
                        level: 0,
                        highRating: 0,
                        highValue: 0,
                        highType: '',
                        highColour: '#777',
                        lowRating: 0,
                        lowValue: 0,
                        lowType: '',
                        lowColour: '#777',
                    }
                }

                newDungeons[dungeonData.slug] = dungeonData;
            });
            setDungeons(newDungeons);
        })
    }, [dungeonSlugs, characterId]);

    const nameCell = (rowSpan: number) => {
        return <td rowSpan={rowSpan} style={{color: characterClass ? classColours[characterClass] : 'white'}}>
            {characterId.name}<br />
            <button type="button" onClick={props.onDelete}>Delete</button>
        </td>
    }

    const totalScore = Object.values(dungeons).reduce((previous, dungeon) => previous + dungeon.rating, 0)
    let totalColour = '#777';
    for(let cutoff in totalRatingCutoffs) {
        if(totalScore >= +cutoff) {
            totalColour = totalRatingCutoffs[cutoff];
        }
    }

    return <tbody>
        {Object.keys(dungeons)?.length ?
        <>
            <tr>
                {nameCell(3)}
                <td>Dungeon rating</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].ratingColour}}>{dungeons[slug].rating}</td>)}
                <td rowSpan={3} style={{color: totalColour}}>{totalScore}</td>
            </tr>
            <tr>
                <td>High run</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].highColour}}>
                    {dungeons[slug].highRating > 1 && <>
                        +{dungeons[slug].level} {dungeons[slug].highType}<br />
                        {dungeons[slug].highRating} rating ({dungeons[slug].highValue} value)
                    </>}
                </td>)}
            </tr>
            <tr>
                <td>Low run</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].lowColour}}>
                    {dungeons[slug].lowRating > 2 ? <>
                        {dungeons[slug].lowType}<br />
                        {dungeons[slug].lowRating} rating ({dungeons[slug].lowValue} value)
                    </> : dungeons[slug].lowType && <>No {dungeons[slug].lowType}</>}
                </td>)}
            </tr>
        </>:
        <tr>
            {nameCell(1)}
            <td colSpan={props.dungeonSlugs.length + 2}>Loading...</td>
        </tr> }
    </tbody>
    }