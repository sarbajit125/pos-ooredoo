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
  // export const InventoryAllocateContext = create<InventoryConfirmationProps>(
  //   (set) => ({
  //     type: "P",
  //     productURL: "",
  //     selectedProductId: 0,
  //     setType: (type) => set(() => ({ type: type })),
  //     setProductURL: (str) => set(() => ({ productURL: str })),
  //     setProductId: (id) => set(() => ({selectedProductId: id})),
  //     reset: () => set(() => ({ type: "P", productURL: "", selectedProductId: 0 })),
  //   })
  // );
  export const InventoryAllocateContext = create<InventoryConfirmationProps>(
    (set) => ({
      type: "P",
      productURL: "P/13/4853/1029/products",
      selectedProductId: 26,
      setType: (type) => set(() => ({ type: type })),
      setProductURL: (str) => set(() => ({ productURL: str })),
      setProductId: (id) => set(() => ({selectedProductId: id})),
      reset: () => set(() => ({ type: "P", productURL: "", selectedProductId: 0 })),
    })
  );
  
  
  export const UserDetailContext = create<POSUserStore>((set) => ({
    contact: "",
    email: "",
    fname: "",
    userDesc: "",
    username: "",
    salesChannelList: [],
    faisaWallets: [],
    rastasWallets: [],
    currentRole: "",
    userId: '',
    setUserDetails(response) {
      set(() => ({
        contact: response.userAddress.contactNumber,
        currentRole: response.currentRole,
        email: response.userAddress.emailId,
        fname: response.userFirstName,
        lname: response.userLastName,
        faisaWallets: setFaisaList(response.walletNumbers.MFaisa),
        rastasWallets: setRastasList(response.walletNumbers.Raastas),
        salesChannelList: response.salesChannelIdList,
        userDesc: response.userCredentials.userDesc,
        username: response.userCredentials.username,
        userId: response.userId,
      }));
    },
  }));
  
  const setFaisaList = (list: string[]): POSWalletDAO[] => {
    return list.map((item) => {
      return {
        walletid: item,
        type: "Faisa",
      };
    });
  };
  const setRastasList = (list: string[]): POSWalletDAO[] => {
    return list.map((id) => ({
      walletid: id,
      type: "Rastas",
    }));
  };