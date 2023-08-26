import CharacterId from './CharacterId';
import MplusData from './MplusData';

const cachedData: {[key: string]: MplusData} = {};

export default async function GetArmoryData(characterId: CharacterId): Promise<({ success: true, data: MplusData } | { success:false, error: any })> {
    const key = `${characterId.name}_${characterId.realm}_${characterId.region}`;
    if(!cachedData[key]) {
        try {
            const response = await fetch(`https://worldofwarcraft.com/en-us/character/${characterId.region.toLowerCase()}/${characterId.realm.toLowerCase()}/${characterId.name.toLowerCase()}/pve/mythic.json`);
            const data = await response.json() as MplusData;
            cachedData[key] = data
            }
        catch(e)
        {
            return { success:false, error: e };
        }
    }

    return { success: true, data: cachedData[key] };
}