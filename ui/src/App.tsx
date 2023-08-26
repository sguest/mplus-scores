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
    const [showError, setShowError] = useState(false);

    const charactersStateKey = 'characterList';

    useEffect(() => {
        const stateValue = localStorage.getItem(charactersStateKey);
        if(stateValue) {
            setCharacters(JSON.parse(stateValue));
        }
    }, []);

    useEffect(() => {
        if(characters.length) {
            GetArmoryData(characters[0]).then(response => {
                if(response.success)
                {
                    const dungeonData: {[key: string]: string} = {};
                    for(let dungeon of response.data.dungeons) {
                        dungeonData[dungeon.dungeon.slug] = dungeon.dungeon.name;
                    }
                    setDungeons(dungeonData);
                }
                else {
                    setShowError(true);
                }
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
        {showError && <p>
            Failed to load dungeon data. This app requires CORS requirements to be bypassed, likely by use of a browser extension.<br />
            Possible extensions for <a target="_blank" href="https://addons.mozilla.org/en-CA/firefox/addon/cors-everywhere/">Firefox</a> or <a target="_blank" href="https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino">Chrome</a><br />
            See <a href="https://github.com/sguest/mplus-scores#cors">here</a> for more information.
        </p>}
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
        {!showError && <AddCharacter onCreate={onAddCharacter} />}
        {!!Object.keys(dungeons).length && 
            <Keystone keystone={newKeystone} dungeons={dungeons} onChange={setNewKeystone} />
        }
    </>
}

export default App
