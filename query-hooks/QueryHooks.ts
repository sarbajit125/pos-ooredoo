import { useMutation, useQuery } from "react-query";
import { APIManager } from "../AppManger/ApiManger";
import { POSUtilityManager, POSWalletDAO } from "../AppManger/POSAppManager";
import CryptoES from "crypto-es";
import { AppConstants } from "../constants/AppConstants";
import dayjs from "dayjs";
import {
  DashboardGraphUI,
  GraphData,
  POSSelectData,
  POSUserDetailsV2,
} from "../types";
import {
  AvailableSerialsRequest,
  InventoryOrderReq,
  InventoryProductResponse,
  InventoryRulesResponse,
  UploadMemoReq,
} from "../responseModels/InventoryRulesResponse";
import { InventoryApprovalReq } from "../responseModels/InventoryOrderDetailsResponse";
export const walletBalanceHook = () =>
  useMutation({
    mutationKey: ["walletbalance"],
    mutationFn: (reqObj: FetchbalanceReq) => {
      if (reqObj.wallet.type === "Faisa") {
        let encodedPin = CryptoES.enc.Utf8.parse(reqObj.mpin);
        let encodedKey = CryptoES.enc.Utf8.parse(AppConstants.aesKey);
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
    queryKey: ["dashbordKPI", posCode],
    queryFn: () => {
      let yesterDay = new Date().getDate() - 1;
      const formatDate = dayjs(yesterDay).format("YYYY-MM-DD").toString();
      return APIManager.sharedInstance().fetchDashboardGraph(
        formatDate,
        posCode
      );
    },
    enabled: false,
    select: (response): DashboardGraphUI => {
      const lastObj = response.responseBody.slice(-1).pop() ?? [];
      let grossArr: GraphData[] = [];
      let primaryArr: GraphData[] = [];
      let secondaryArr: GraphData[] = [];
      response.responseBody.map((item) => {
        item
          .filter((item) => item.kpi === "Gross Add")
          .forEach((item) => {
            let graphObj: GraphData = { date: item.addDate, value: item.mtd };
            grossArr.push(graphObj);
          });
        item
          .filter((item) => item.kpi === "Primary")
          .forEach((item) => {
            let graphObj: GraphData = { date: item.addDate, value: item.mtd };
            primaryArr.push(graphObj);
          });
        item
          .filter((item) => item.kpi === "Secondary")
          .forEach((item) => {
            let graphObj: GraphData = { date: item.addDate, value: item.mtd };
            secondaryArr.push(graphObj);
          });
      });
      return {
        grossList: grossArr,
        primaryList: primaryArr,
        secondaryList: secondaryArr,
        lastObj: lastObj,
      };
    },
  });
export const StockDetailsHook = (posCode: string) =>
  useQuery({
    queryKey: ["stockStatus", posCode],
    queryFn: () => APIManager.sharedInstance().fetchStockStatus(posCode),
    staleTime: 3600000,
  });
export const TransactionHistoryHook = (
  orderType?: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery({
    queryKey: ["posHistory", orderType, startDate, endDate],
    queryFn: () => {
      let requestType = orderType || "";
      let fromDate =
        startDate ||
        dayjs(new Date().getDate() - 7)
          .format("YYYY-MM-DD")
          .toString();
      let toDate =
        endDate || dayjs(new Date().getDate()).format("YYYY-MM-DD").toString();
      return APIManager.sharedInstance().fetchTransactionHistory(
        requestType,
        "2023-03-29",
        "2023-04-05"
      );
    },
  });
export const FetchInventoryRules1 = (id: string) =>
  useQuery({
    queryKey: ["inventoryRules", id],
    enabled: false,
    queryFn: () => {
      return APIManager.sharedInstance().fetchInventoryRules(id);
    },
    select: (data): POSSelectData[] => {
      if (checkResponseIfProduct(data)) {
        return data.map((item) => ({
          id: item.value,
          name: item.text,
          isSelected: false,
        }));
      } else {
        return data.map((item) => ({
          id: item.inventoryTypeid.toString(),
          name: item.inventoryTypeDescription,
          isSelected: false,
        }));
      }
    },
  });
export const checkResponseIfProduct = (
  response: InventoryRulesResponse[] | InventoryProductResponse[]
): response is InventoryRulesResponse[] => {
  return (response as InventoryRulesResponse[])[0].value != undefined;
};

export const FetchInventoryProduct = (url: string) =>
  useQuery({
    queryKey: ["inventoryDetails", url],
    queryFn: () => {
      return APIManager.sharedInstance().fetchInventoryRules(url);
    },
  });
export const FireSerialsForUser = (request: AvailableSerialsRequest) =>
  useMutation({
    mutationKey: ["SerialsList"],
    mutationFn: () => APIManager.sharedInstance().fetchSerialsForUser(request),
  });
export const InitateInventoryOrder = () =>
  useMutation({
    mutationKey: ["InventoryOrder"],
    mutationFn: (request: InventoryOrderReq) =>
      APIManager.sharedInstance().fireIntiateInventoryOrder(request),
  });
export const fetchInventoryOrdersList = (fromDate: string, toDate: string) =>
  useQuery({
    queryKey: ["InvntoryOrdersList", fromDate],
    queryFn: () =>
      APIManager.sharedInstance().fireInventoryOrderHistory(fromDate, toDate),
  });
export const uploadMemoToRequest = () =>
  useMutation({
    mutationKey: ["UploadMemo"],
    mutationFn: (request: UploadMemoReq) =>
      APIManager.sharedInstance().fireUploadMemo(request),
  });
export const fetchSelfDetails = () =>
  useQuery({
    queryKey: ["userdetails"],
    queryFn: () => APIManager.sharedInstance().userDetails(),
    select: (response): POSUserDetailsV2 => {
      const { defaultWallet: faisaDefault, wallets: faisaWallets } =
        POSUtilityManager.sharedInstance().prepareFaisaWallets(
          response.walletNumbers?.MFaisa
        );
      const { defaultWallet: rastasDefault, wallets: rastasWallets } =
        POSUtilityManager.sharedInstance().prepareRastasWallets(
          response.walletNumbers?.Raastas
        );
      return {
        contact: response.userAddress.contactNumber,
        email: response.userAddress.emailId,
        currentRole: response.currentRole,
        faisaWallets: faisaWallets,
        defaultFaisa: faisaDefault,
        fname: response.userFirstName,
        rastasWallets: rastasWallets,
        defaultRastas: rastasDefault,
        salesChannelList:
          response.salesChannelIdList.length > 0
            ? response.salesChannelIdList[0]
            : "",
        userDesc: response.userCredentials.userDesc,
        userId: response.userId,
        username: response.userCredentials.username,
        lname: response.userLastName,
        fullname: response.userFirstName + response.userLastName,
        userAuthorities: response.userAuthorities.map((item) => item.authority),
      };
    },
  });
export const changeUserRole = () =>
  useMutation({
    mutationKey: ["changeRole"],
    mutationFn: (newRole: string) =>
      APIManager.sharedInstance().fireChangeRole(newRole),
  });
export const fetchInventoryDetails = (orderId: number) =>
  useQuery({
    queryKey: ["inventoryDetail"],
    queryFn: () =>
      APIManager.sharedInstance().fireInventoryDetails(orderId.toString()),
  });
export const POSInventoryCatelogManger = () =>
  useQuery({
    queryKey: ["inventoryTypes"],
    queryFn: () => APIManager.sharedInstance().firePOSInventoryCatelog(),
    staleTime: 300000,
  });
export const callInventoryApproval = (orderId: string) => 
    useMutation({
      mutationKey:['InventoryApproval', orderId],
      mutationFn: (request: InventoryApprovalReq) => {
        let endpointId: string = ""
        switch (request.type) {
          case 'APPROVE':
            endpointId = "api/inventory/transfer/orders/" + orderId + "/approve"
            break
          case 'ACK':
            endpointId = "api/inventory/transfer/" + "accept/" + orderId
            break
          case 'REJECT':
            endpointId = "api/inventory/transfer/orders/" + orderId + "/reject"
            break
        }
        return APIManager.sharedInstance().fireInventoryApproval(endpointId, request.type, request.remarks)
      },
    })
