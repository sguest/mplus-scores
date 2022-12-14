import Character from './Character';
import './App.css';
import AddCharacter from './AddCharacter';
import { useEffect, useState } from 'react';
import CharacterId from './CharacterId';
import GetArmoryData from './GetArmoryData';
import KeystoneDefinition from './KeystoneDefinition';
import Keystone from './Keystone';

function App() {
    const [dungeons, setDungeons] = useState<{[key: string]: string}>({})
    const [characters, setCharacters] = useState<CharacterId[]>([]);
    const [newKeystone, setNewKeystone] = useState<KeystoneDefinition>({dungeon: '', level: 2, type: 'Fortified'});

    const charactersStateKey = 'characterList';

    useEffect(() => {
        const stateValue = localStorage.getItem(charactersStateKey);
        if(stateValue) {
            setCharacters(JSON.parse(stateValue));
        }
    }, []);

    useEffect(() => {
        if(characters.length) {
            GetArmoryData(characters[0]).then(data => {
                const dungeonData: {[key: string]: string} = {};
                for(let dungeon of data.dungeons) {
                    dungeonData[dungeon.dungeon.slug] = dungeon.dungeon.name;
                }
                setDungeons(dungeonData);
            });
        }
    }, [characters]);

    const onAddCharacter = (character: CharacterId) => {
        const newCharacters = [...characters, character];
        localStorage.setItem(charactersStateKey, JSON.stringify(newCharacters));
        setCharacters(newCharacters);
    }

    const onDeleteCharacter = (character: CharacterId) => {
        const newCharacters = characters.filter(c => c.name !== character.name || c.region !== character.region || c.realm !== character.realm);
        localStorage.setItem(charactersStateKey, JSON.stringify(newCharacters));
        setCharacters(newCharacters);
    }

    return <>
        {!!Object.keys(dungeons).length &&
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}></th>
                        {Object.values(dungeons).map(name => <th key={name}>{name}</th>)}
                        <th>Total</th>
                        {!!newKeystone.dungeon && <th>Projected</th>}
                    </tr>
                </thead>
                {characters.map(character => <Character 
                    key={`${character.name}-${character.realm}-${character.region}`}
                    dungeonSlugs={Object.keys(dungeons)}
                    onDelete={() => onDeleteCharacter(character)}
                    characterId={character}
                    newKeystone={newKeystone.dungeon ? newKeystone : undefined}/>)}
            </table>}
        <AddCharacter onCreate={onAddCharacter} />
        {!!Object.keys(dungeons).length && 
            <Keystone keystone={newKeystone} dungeons={dungeons} onChange={setNewKeystone} />
        }
    </>
}

export default App
