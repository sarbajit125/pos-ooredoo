import { useMutation, useQuery } from "react-query";
import { APIManager } from "../AppManger/ApiManger";
import { POSWalletDAO } from "../AppManger/POSAppManager";
import CryptoES from "crypto-es";
import { AppConstants } from "../constants/AppConstants";
import dayjs from "dayjs";
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
      const formatDate = dayjs(yesterDay).format("YYYY-MM_DD").toString();
      return APIManager.sharedInstance().fetchDashboardGraph(formatDate, posCode)
    },
  })
