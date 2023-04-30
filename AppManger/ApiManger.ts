import axios, { AxiosError, AxiosHeaders } from "axios";
import { DashboardKPI } from "../responseModels/DashboardKPIResponse";
import {
  FetchWalletBalanceResponse,
  WalletBalanceDAO,
} from "../responseModels/FetchWalletbalanceResponse";
import {
  APIError,
  LoginSuccessfull,
  UnauthorizedError,
} from "../responseModels/responseModels";
import { SelfUserDetails } from "../responseModels/SelfUserDetailsResponse";
import { StockStatusResponse } from "../responseModels/StockStatusResponse";
import { POSWalletDAO } from "./POSAppManager";
import { HistoryListResponse } from "../responseModels/HistoryListResponse";
import * as FileSystem from "expo-file-system";
import { AppConstants } from "../constants/AppConstants";
export class APIManager {
  private static instance: APIManager;
  private constructor() {
    //axios.defaults.baseURL = "http://192.168.29.217:8000/pos";
    axios.defaults.baseURL = "http://10.10.9.113:9080";
    axios.defaults.headers.common["x-auth-token"] = "";
    axios.interceptors.request.use((request) => {
      console.log("Starting Request", JSON.stringify(request, null, 2));
      return request;
    });
  }
  public static sharedInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }
  loginAPI = async (
    username: string,
    password: string
  ): Promise<LoginSuccessfull> => {
    try {
      const response = await axios.post(`/api/login`, {
        username: username,
        password: password,
      });
      const apiHeaders = response.headers as POSAPIHeaders;
      if (response.status != 200) {
        throw new UnauthorizedError("Unable to login");
      } else if (apiHeaders.get("X-AUTH-TOKEN") == undefined) {
        throw new UnauthorizedError("Unable to retrieve auth token");
      } else {
        axios.defaults.headers.common["x-auth-token"] =
          apiHeaders.get("X-AUTH-TOKEN");
        const uiReponse: LoginSuccessfull = {
          message: "Login Succesfull",
        };
        return Promise.resolve(uiReponse);
      }
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  userDetails = async (): Promise<SelfUserDetails> => {
    try {
      const response = await axios.get(`/userDetail/self`);
      if (response.status != 200) {
        throw new APIError("API error", response.status);
      } else {
        this.printJSON(response.data);
        return response.data as SelfUserDetails;
      }
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchWalletBalance = async (
    wallet: POSWalletDAO,
    salesChannelId: string,
    pin?: string
  ): Promise<WalletBalanceDAO> => {
    try {
      const requestBody = [
        {
          id: wallet.walletid,
          ifApp: true,
          mpin: pin ?? "",
          type: wallet.type,
        },
      ];
      const response = await axios.post<FetchWalletBalanceResponse>(
        `/app/api/v1/wallet/balances/${salesChannelId}`,
        requestBody
      );
      if (response.status != 200) {
        throw new APIError(
          "received response status code invalid",
          response.status
        );
      } else {
        this.printJSON(response.data);
        if (
          response.data.responseBody[0].type === wallet.type &&
          response.data.responseBody[0].balance != undefined
        ) {
          return {
            type: response.data.responseBody[0].type,
            balance: response.data.responseBody[0].balance,
            id: response.data.responseBody[0].id,
          };
        } else {
          throw new APIError("Balance null", response.status);
        }
      }
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchDashboardGraph = async (date: string, posCode: string) => {
    try {
      const response = await axios.get(`app/api/pos/get/last/analytics`, {
        params: {
          date: date,
          posCode: posCode,
        },
      });
      if (response.status != 200) {
        throw new APIError(
          "recived response status code invalid",
          response.status
        );
      } else {
        this.printJSON(response.data);
        return response.data as DashboardKPI;
      }
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchStockStatus = async (poscode: string) => {
    try {
      const response = await axios.get<StockStatusResponse>(
        `app/master/stockStatus/getStockByUserId/${poscode}`
      );
      if (response.status != 200) {
        throw new APIError(
          "recived response status code invalid",
          response.status
        );
      } else {
        this.printJSON(response.data);
        return response.data;
      }
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchTransactionHistory = async (
    orderType: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axios.get<HistoryListResponse[]>(
        `/api/v1/customer/orders?orderType=${orderType}&orderDate%3E=${startDate}&orderDate%3C=${endDate}`,
        {}
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  downloadReceipt = async (url: string, name: string): Promise<Blob> => {
    try {
      const response = await axios.get(`/api/v1/customer/orders/${url}`, {
        responseType: "blob",
      });
    return response.data
    } catch (error) {
      throw this.errorhandling(error);
    }
    // const downloadURL = AppConstants.uatURl + `/api/v1/customer/orders/${url}`
    // console.log(downloadURL)
    // let filePath = FileSystem.documentDirectory + name
    // const downloadResumable = FileSystem.createDownloadResumable(
    //   downloadURL,
    //   filePath,
    //   {headers:{
    //     'x-auth-token' :   axios.defaults.headers.common["x-auth-token"]?.toString() || ""
    //   },
    // },
    // );
    // try {
    //   const response = await downloadResumable.downloadAsync()
    //   return (response)
    // } catch (error) {
    //   throw this.errorhandling(error);
    // }
  };
  errorhandling = (error: unknown): APIError | UnauthorizedError => {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.data.message,
        error.response?.status ?? 400
      );
    } else {
      throw new APIError("APi process falied", 400);
    }
  };
  printJSON = (response: any) => {
    console.log(`Response recvied: \n ${JSON.stringify(response, null, 2)}`);
  };
  removeAuthToken = () => {
    axios.defaults.headers.common["x-auth-token"] = undefined;
  };
}

export interface POSAPIHeaders extends AxiosHeaders {
  "X-AUTH-TOKEN": string | null;
}
