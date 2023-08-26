import KeystoneDefinition from './KeystoneDefinition'
import { Dungeon } from './MplusData'

export interface KeystoneProps {
    keystone: KeystoneDefinition
    onChange: (keystone: KeystoneDefinition) => void
    dungeons: {[key: string]: Dungeon}
}

export default function Keystone(props: KeystoneProps) {
    const types: Array<'Tyrannical' | 'Fortified'> = ['Fortified', 'Tyrannical']

    const calculateTime = (minutes: number, seconds: number) => {
        const totalSeconds = minutes * 60 + seconds;
        const percentTime = !!props.keystone.dungeon ? (totalSeconds * 1000 / props.dungeons[props.keystone.dungeon].qualifyingDuration) * 100 : 0;
        props.onChange({ ...props.keystone, elapsedMinutes: minutes, elapsedSeconds: seconds, percentTime: percentTime })
    }

    return <div>
        <h2>Estimate additional run</h2>
        <label>
            Dungeon
            <select value={props.keystone.dungeon} onChange={e => props.onChange({...props.keystone, dungeon: e.target.value})}>
                <option></option>
                {Object.keys(props.dungeons).map(slug => <option value={slug} key={slug}>{props.dungeons[slug].dungeon.name}</option>)}
            </select>
        </label><br />
        <label>Level<input type="number" min="2" value={props.keystone.level} onChange={e => props.onChange({...props.keystone, level: +e.target.value})}></input></label><br />
        {types.map(type => <label key={type}>
            {type}
            <input type="radio" name="type" checked={props.keystone.type === type} onChange={() => props.onChange({...props.keystone, type })} />
        </label>)}
        <label><br />
            Time elapsed
            <input type="number" min="0" value={props.keystone.elapsedMinutes} onChange={e => calculateTime(+e.target.value, props.keystone.elapsedSeconds)} /> min
            <input type="number" min="0" max="59" value={props.keystone.elapsedSeconds} onChange={e => calculateTime(props.keystone.elapsedMinutes, +e.target.value)} /> sec
        </label><br />
        {!!props.keystone.dungeon && <>{props.keystone.percentTime.toFixed(1)}% of timer</>}
    </div>
}