import { useEffect, useState } from 'react';
import CharacterId from './CharacterId';
import GetArmoryData from './GetArmoryData';
import KeystoneDefinition from './KeystoneDefinition';
import MplusData, { Color } from './MplusData';

export interface CharacterProps {
    characterId: CharacterId
    dungeonSlugs: string[],
    onDelete: () => void,
    newKeystone?: KeystoneDefinition,
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
    timeDifference: number
    timePercentage: number
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
    1900: 'rgba(163, 53, 238)',  //purple
    1500: 'rgba(0, 112, 221)',    //blue
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
        .then(response => {
            if(response.success)
            {
                let newDungeons: {[key: string]: Dungeon} = {};
                response.data.dungeons.forEach(dungeon => {
                    const dungeonData: Dungeon = {
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
                        timeDifference: 0,
                        timePercentage: 0,
                    };

                    if(dungeon.modifiers) {
                        dungeonData.highType = dungeon.modifiers.find(m => m.name === 'Fortified' || m.name === 'Tyrannical')!.name;
                        dungeonData.lowType = dungeonData.highType === 'Fortified' ? 'Tyrannical' : 'Fortified';
                        dungeonData.highValue = dungeon.dungeonRating.rating * 1.5;
                        dungeonData.lowValue = dungeon.mapRating.rating - dungeonData.highValue;
                        dungeonData.lowRating = dungeonData.lowValue * 2;

                        for(let cutoff in dungeonRatingCutoffs) {
                            if(dungeonData.lowRating >= +cutoff) {
                                dungeonData.lowColour = dungeonRatingCutoffs[cutoff];
                            }
                        }

                        setCharacterClass(dungeon.party.find(p => !p.name.localeCompare(characterId.name, undefined, {sensitivity: 'accent'}) &&
                            !p.realm.name.localeCompare(characterId.realm, undefined, {sensitivity: 'accent'}) &&
                            !p.region.localeCompare(characterId.region, undefined, { sensitivity: 'accent'}))?.class.slug);
                        dungeonData.slug = dungeon.dungeon.slug;
                        dungeonData.rating = dungeon.mapRating.rating;
                        dungeonData.ratingColour = getRgba(dungeon.mapRating.color);
                        dungeonData.level = dungeon.level;
                        dungeonData.highRating = dungeon.dungeonRating.rating;
                        dungeonData.highColour = getRgba(dungeon.dungeonRating.color);

                        dungeonData.timeDifference = dungeon.qualifyingDuration - dungeon.duration;
                        dungeonData.timePercentage = Math.floor(Math.abs(dungeonData.timeDifference / dungeon.qualifyingDuration) * 1000) / 10;
                    }

                    newDungeons[dungeonData.slug] = dungeonData;
                });
                setDungeons(newDungeons);
            }
        })
    }, [dungeonSlugs, characterId]);

    const nameCell = (rowSpan: number) => {
        return <td rowSpan={rowSpan} style={{color: characterClass ? classColours[characterClass] : 'white'}}>
            {characterId.name}<br />
            <button type="button" onClick={props.onDelete}>Delete</button>
        </td>
    }

    const formatTime = (time: number) => {
        const totalSeconds = Math.abs(Math.floor(time / 1000));
        const seconds = totalSeconds % 60;
        const secondsStr = (seconds < 10 ? '0' : '') + seconds;
        const minutes = Math.floor(totalSeconds / 60);
        return `${minutes}:${secondsStr}`;
    }

    const totalScore = Object.values(dungeons).reduce((previous, dungeon) => previous + dungeon.rating, 0)
    let totalColour = '#777';
    for(let cutoff in totalRatingCutoffs) {
        if(totalScore >= +cutoff) {
            totalColour = totalRatingCutoffs[cutoff];
        }
    }

    let newTotal = totalScore;
    let newTotalColour = '#777';

    if(props.newKeystone?.dungeon && dungeons[props.newKeystone.dungeon]) {
        let rating = 30 + 5 * props.newKeystone.level;
        if(props.newKeystone.level >= 7) {
            rating += 5;
        }
        if(props.newKeystone.level >= 14) {
            rating += 5;
        }
        if(props.newKeystone.level >= 20) {
            rating += 10;
        }

        if(props.newKeystone.percentTime >= 140) {
            rating = 0;
        }
        else if(props.newKeystone.percentTime > 100) {
            rating -= 15 * (props.newKeystone.percentTime - 100) / 100
        }
        else {
            const bonusTime = Math.min(0.4, (100 - props.newKeystone.percentTime) / 100);
            rating += 7.5 * bonusTime;
        }

        rating = Math.floor(rating);

        const targetDungeon = dungeons[props.newKeystone.dungeon];

        if(!targetDungeon.highType) {
            newTotal = totalScore + rating;
        }
        else if(targetDungeon.highType === props.newKeystone.type) {
            if(rating >= targetDungeon.highRating) {
                newTotal = totalScore + (rating - targetDungeon.highRating) * 1.5;
            }
        }
        else {
            if(rating >= targetDungeon.lowRating) {
                if(rating > targetDungeon.highRating) {
                    newTotal = totalScore - targetDungeon.rating + targetDungeon.highRating * 0.5 + rating * 1.5;
                }
                else {
                    newTotal = totalScore + (rating - targetDungeon.lowRating) * 0.5;
                }
            }
        }

        for(let cutoff in totalRatingCutoffs) {
            if(newTotal >= +cutoff) {
                newTotalColour = totalRatingCutoffs[cutoff];
            }
        }
    }

    return <tbody>
        {Object.keys(dungeons)?.length ?
        <>
            <tr>
                {nameCell(3)}
                <td>Rating</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].ratingColour}}>{dungeons[slug].rating}</td>)}
                <td rowSpan={3} style={{color: totalColour}}>{totalScore}</td>
                {props.newKeystone && <td rowSpan={3} style={{color: newTotalColour}}>{newTotal} (+{Math.max(newTotal - totalScore, 0)})</td>}
            </tr>
            <tr>
                <td>High run</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].highColour}}>
                    {dungeons[slug].highRating > 1 && <>
                        +{dungeons[slug].level} {dungeons[slug].highType}<br />
                        <span style={{color: dungeons[slug].timeDifference > 0 ? 'green' : 'red'}}>{formatTime(dungeons[slug].timeDifference)} {dungeons[slug].timeDifference > 0 ? 'under' : 'over'} ({dungeons[slug].timePercentage}%)</span><br />
                        {dungeons[slug].highRating} score ({dungeons[slug].highValue} rating)
                    </>}
                </td>)}
            </tr>
            <tr>
                <td>Low run</td>
                { dungeonSlugs.map(slug => <td key={slug} style={{color: dungeons[slug].lowColour}}>
                    {dungeons[slug].lowRating > 2 ? <>
                        {dungeons[slug].lowType}<br />
                        {dungeons[slug].lowRating} score ({dungeons[slug].lowValue} rating)
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