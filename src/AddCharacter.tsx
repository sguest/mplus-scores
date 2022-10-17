import { useState } from 'react'
import CharacterId from './CharacterId';

export interface AddCharacterProps {
    onCreate: (character: CharacterId) => void
}

export default function AddCharacter(props: AddCharacterProps) {
    const [name, setName] = useState('');
    const [realm, setRealm] = useState('');
    const [region, setRegion] = useState('US');
    return <div>
        Add Character<br />
        <label>Name<input type="text" value={name} onChange={e => setName(e.target.value)} /></label><br />
        <label>Realm<input type="text" value={realm} onChange={e => setRealm(e.target.value)} /></label><br />
        <label>
            Region
            <select value={region} onChange={e => setRegion(e.target.value)}>
                <option value="US">US</option>
                <option value="EU">EU</option>
            </select>
        </label><br/>
        <button type="button" onClick={() => props.onCreate({ name, realm, region })}>Add</button>
    </div>
}