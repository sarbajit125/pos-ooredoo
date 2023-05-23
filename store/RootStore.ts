import { createContext, useContext } from "react";
import UserDetailsStore from "./UserDetailsStore";
import { create } from 'zustand'
import { SearchScreenProps } from "../screens/SearchScreen";
import { POSWalletDAO } from "../AppManger/POSAppManager";
import { POSUserStore } from "../types";
import { InventoryConfirmationProps } from "../screens/InventoryConfirmation";

export class RootStore{
    userDetailStore: UserDetailsStore
    constructor(){
        this.userDetailStore = new UserDetailsStore(this)
    }
}
export const StoresContext = createContext(new RootStore());
export const defaultStore = new RootStore()

export const SearchScreenContext = create<SearchScreenProps>((set) => ({
  data: [{id:'',name:'',isSelected: false}],
  setData: (data) => set(() => ({data: data})),
  selectedData: undefined,
  setSelectedData: (data) => set(() => ({selectedData: data})),
  serviceCode: "",
  setServiceCode: (code) => set(() => ({serviceCode: code}))
  }))
  export const InventoryAllocateContext = create<InventoryConfirmationProps>(
    (set) => ({
      type: "P",
      productURL: "",
      selectedProductId: 0,
      setType: (type) => set(() => ({ type: type })),
      setProductURL: (str) => set(() => ({ productURL: str })),
      setProductId: (id) => set(() => ({selectedProductId: id})),
      reset: () => set(() => ({ type: "P", productURL: "", selectedProductId: 0 })),
    })
  );