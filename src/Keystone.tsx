import KeystoneDefinition from './KeystoneDefinition'

export interface KeystoneProps {
    keystone: KeystoneDefinition
    onChange: (keystone: KeystoneDefinition) => void
    dungeons: {[key: string]: string}
}

export default function Keystone(props: KeystoneProps) {
    const types: Array<'Tyrannical' | 'Fortified'> = ['Fortified', 'Tyrannical']

    return <div><>
        <label>
            Dungeon
            <select value={props.keystone.dungeon} onChange={e => props.onChange({...props.keystone, dungeon: e.target.value})}>
                <option></option>
                {Object.keys(props.dungeons).map(slug => <option value={slug} key={slug}>{props.dungeons[slug]}</option>)}
            </select>
        </label><br />
        <label>Level<input type="number" min="2" value={props.keystone.level} onChange={e => props.onChange({...props.keystone, level: +e.target.value})}></input></label><br />
        {types.map(type => <label key={type}>
            {type}
            <input type="radio" name="type" checked={props.keystone.type === type} onChange={() => props.onChange({...props.keystone, type })} />
        </label>)}
    </></div>
}