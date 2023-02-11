import { createContext, useContext } from "react";
import UserDetailsStore from "./UserDetailsStore";


export class RootStore{
    userDetailStore: UserDetailsStore
    constructor(){
        this.userDetailStore = new UserDetailsStore(this)
    }
}
export const StoresContext = createContext(new RootStore());
export const defaultStore = new RootStore()