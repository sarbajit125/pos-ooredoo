import { useMutation, useQuery } from "react-query";
import { APIManager } from "../AppManger/ApiManger";
import { POSWalletDAO } from "../AppManger/POSAppManager";
import CryptoES from "crypto-es";
import { AppConstants } from "../constants/AppConstants";
import dayjs from "dayjs";
import { InventorySaleScreen, POSSelectData } from "../types";
export const walletBalanceHook = () =>
  useMutation({
    mutationKey: ["walletbalance"],
    mutationFn: (reqObj: FetchbalanceReq) => {
      if (reqObj.wallet.type === "Faisa") {
        let encodedPin = CryptoES.enc.Utf8.parse(reqObj.mpin)
        let encodedKey = CryptoES.enc.Utf8.parse(AppConstants.aesKey)
        const encoded = CryptoES.AES.encrypt(encodedPin, encodedKey, {
          padding: CryptoES.pad.Pkcs7,
          mode: CryptoES.mode.ECB,
        });
        reqObj.mpin = encoded.ciphertext.toString(CryptoES.enc.Base64);
      }
      return APIManager.sharedInstance().fetchWalletBalance(
        reqObj.wallet,
        reqObj.salesChannelId,
        reqObj.mpin
      );
    },
  });

export interface FetchbalanceReq {
  wallet: POSWalletDAO;
  salesChannelId: string;
  mpin?: string;
}

export interface DashboardKPIReq {
  data: string;
  posCode: string;
}

export const dashboardGraphHook = (posCode: string) =>
  useQuery({
    queryKey: ['dashbordKPI'],
    queryFn: () => {
      let yesterDay = new Date().getDate() - 1;
      const formatDate = dayjs(yesterDay).format("YYYY-MM-DD").toString();
      return APIManager.sharedInstance().fetchDashboardGraph(formatDate, posCode)
    },
  })
  export const StockDetailsHook = (posCode: string) => useQuery({
    queryKey:['stockStatus', posCode],
    queryFn:() => APIManager.sharedInstance().fetchStockStatus(posCode),
    staleTime: 3600000,
  })
  export const TransactionHistoryHook = (orderType?: string, startDate?: string, endDate?: string) => useQuery({
    queryKey:['posHistory', orderType, startDate, endDate],
    queryFn: () => {
      let requestType = orderType || ""
      let fromDate = startDate || dayjs(new Date().getDate() - 7).format("YYYY-MM-DD").toString();
      let toDate =  endDate || dayjs(new Date().getDate()).format("YYYY-MM-DD").toString();
      return APIManager.sharedInstance().fetchTransactionHistory(requestType, "2023-03-29", "2023-04-05")
    },
    staleTime: 3600000,
  })

  export const FetchInventoryRules = (screen: InventorySaleScreen, id: string) => useQuery({
    queryKey: ['inventoryRules',screen, id],
    enabled: false,
    queryFn: () => {
      let type = "/transferTypes"
      switch (screen){
        case InventorySaleScreen.Type:
          type ="/transferTypes"
          break
        case InventorySaleScreen.Source:
          type ="/sources"
          break
        case InventorySaleScreen.Target:
          type ="/targets"
          break
        case InventorySaleScreen.Product:
          type ="/product"
          break
        case InventorySaleScreen.Entry:
          type = "/transferTypes"
          break
      }
      let query = id + type
     return  APIManager.sharedInstance().fetchInventoryRules(query)},
     select: (data) : POSSelectData[] => data.map((item) => ({
      id: item.value,
      name: item.text,
      isSelected: false,
    }))
  })
