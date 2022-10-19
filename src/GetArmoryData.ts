import CharacterId from './CharacterId';
import MplusData from './MplusData';

const cachedData: {[key: string]: MplusData} = {};

export default async function GetArmoryData(characterId: CharacterId) {
    const key = `${characterId.name}_${characterId.realm}_${characterId.region}`;
    if(!cachedData[key]) {
        const response = await fetch(`http://localhost:3000/en-us/character/${characterId.region.toLowerCase()}/${characterId.realm.toLowerCase()}/${characterId.name.toLowerCase()}/pve/mythic.json`);
        const data = await response.json() as MplusData;
        cachedData[key] = data
    }

    return cachedData[key];
}