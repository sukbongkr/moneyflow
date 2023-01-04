import create from "zustand"
import { persist } from "zustand/middleware"

export interface Asset {
  id : string
  title : string
  income : number
  outcome : number
  price : number
  debt : number
}

interface State {
  assets : Asset[]

  addAsset : (asset : Asset) => void
  removeAsset : (id : string) => void
}

export const useAssetStore = create(persist<State>((set)=>({
    assets : [],
 
    addAsset: (asset : Asset) => set((state) => 
    ({ assets: [...state.assets, asset] })) ,
    removeAsset : (id : string) => set((state) => {
        const removedList = state.assets.filter((e : Asset) => e.id !== id )

        return {assets : removedList}}),
    }),
    {
        name: 'asset-storage', // unique name
         // (optional) by default, 'localStorage' is used
    }
))

