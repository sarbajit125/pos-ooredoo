/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
};
export type HistoryType = {
  id: 'transactionHistory' | 'walletHistory'
}
export type InventoryScreenList = {
  screeName: InventorySaleScreen
}
export enum InventorySaleScreen {
   Entry = 1,
   Type,
   Source,
   Target,
   Product,
   Validate
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
