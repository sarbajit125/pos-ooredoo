/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { POSWalletDAO } from './AppManger/POSAppManager';
import { SelfUserDetails } from './responseModels/SelfUserDetailsResponse';
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root:   undefined;
  Home: BottomTabScreenProps<RootTabParamList> | undefined;
  StockStatus: undefined;
  Profile: undefined;
  TransactionHistory: HistoryType;
  InventorySale: InventoryScreenList;
  SearchScreen: undefined;
  InventoryConfirmation: undefined;
  POSSuccess: POSSuccessProps;
  InventoryOrderHistory: undefined;
  InventoryOrderDetails: InventoryDetailsTypes
  ProfileDetails: undefined
};
export type HistoryType = {
  id: 'transactionHistory' | 'walletHistory'
}
export type InventoryScreenList = {
  screeName: InventorySaleScreen
}
export enum InventorySaleScreen {
   Entry = "entry",
   Type  = "type",
   Source  = "source",
   Target  = "target",
   Product  = "product",
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Rewards: undefined;
  Support: undefined
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
export interface POSSelectData {
  id: string,
  name: string,
  isSelected: boolean
}
export enum POSAPIHelper {
  isLoading = 0,
  isError = 1,
  None = 2
}

export interface POSUserStore extends POSUserDetailsV2 {
  setUserDetails: (response: POSUserDetailsV2) => void
  setNewRole: (newRole: string) => void
}

export interface POSSuccessProps {
  btnTitle?: string;
  heading: string;
  desc?: string;
  resetTo: 'Dashboard' | 'Profile'
}

export interface InventoryDetailsTypes {
  orderId: number,
  type : 'InventoryDetails'|'ReversalDetails'
}

export interface POSUserDetailsV2 {
  fname: string
  lname?: string 
  fullname: string
  username: string
  userDesc: string 
  contact: string 
  email: string 
  salesChannelList: string
  rastasWallets: POSWalletDAO[]
  faisaWallets: POSWalletDAO[]
  currentRole: string
  userId: string
  userAuthorities: string[]
  defaultRastas: POSWalletDAO
  defaultFaisa: POSWalletDAO
}