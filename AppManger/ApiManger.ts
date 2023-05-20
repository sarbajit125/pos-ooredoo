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
import {
  AvailableSerialsRequest,
  AvailableSerialsResponse,
  InventoryOrderReq,
  InventoryOrderResponse,
  InventoryProductResponse,
  InventoryRulesResponse,
} from "../responseModels/InventoryRulesResponse";
export class APIManager {
  private static instance: APIManager;
  private constructor() {
    //axios.defaults.baseURL = "http://192.168.29.217:8000/pos";
    axios.defaults.baseURL = "http://10.10.9.113:9080";
    axios.defaults.headers.common["x-auth-token"] = "eyJ1c2VySWQiOiJvbXZicCIsInVzZXJEZXNjIjoiT212IEJwIiwidXNlckNyZWRlbnRpYWxzIjp7InVzZXJuYW1lIjoib212YnAiLCJ1c2VyRGVzYyI6Ik9tdiBCcCIsIm5vT2ZEYXlzU2luY2VMYXN0UGFzc3dvcmRDaGFuZ2UiOjIxLCJsYXN0TG9naW5EYXRlIjoiMjAyMy0wNS0xOCIsImV4cGlyZXMiOjE2ODQ1OTgyOTk2ODgsImZpcnN0TG9naW4iOmZhbHNlLCJpbnRlcm5hbFVzZXIiOmZhbHNlLCJmYWlsQ291bnQiOjEsInVzZXJOYW1lIjoib212YnAifSwidXNlckF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0RJU1RSSUJVVE9SIn1dLCJzdGF0dXNJZCI6MywiY3JlZGVudGlhbHNFeHBpcmVkIjpmYWxzZSwicmVmcmVzaFRva2VuRmxhZyI6ZmFsc2UsInVzZXJBZGRyZXNzIjp7ImNvbnRhY3ROdW1iZXIiOiI5NjA5OTkyNzcxIiwiZW1haWxJZCI6Im9tdi5icEBnbWFpbC5jb20ifSwidXNlclR5cGVJZCI6MiwidXNlclN0YXR1cyI6IkFjdGl2ZSIsImN1cnJlbnRSb2xlIjoiUk9MRV9ESVNUUklCVVRPUiIsInVzZXJab25pbmdEZXRhaWwiOnsiem9uZUlkIjowLCJ6b25lQ29kZSI6IkFMIiwiem9uZSI6IkFsbCIsImh1YklkIjowLCJodWJDb2RlIjoiYWxsIiwiaHViIjoiQWxsIiwiYXJlYUlkIjowLCJhcmVhQ29kZSI6IkFMIiwiYXJlYSI6IkFMTCIsImxvY0lkIjowLCJsb2MiOiJBTEwifSwidXNlckNhdGVnb3J5VHlwZSI6Miwic25kU2l0ZSI6IlhMIiwidXNlckNvbnRhY3RObyI6Ijk2MDk5OTI3NzEiLCJzdGFmZiI6ZmFsc2UsInVzZXJMYXN0TmFtZSI6IkJwIiwidXNlckZpcnN0TmFtZSI6Ik9tdiIsInVzZXJab25lTGlzdCI6W3siaWQiOjEwNjMsImRlYWxlcklkIjoib212YnAiLCJ6b25lSWQiOjEsInpvbmVUeXBlIjoxfSx7ImlkIjoxMDY0LCJkZWFsZXJJZCI6Im9tdmJwIiwiem9uZUlkIjo0LCJ6b25lVHlwZSI6Mn0seyJpZCI6MTA2NSwiZGVhbGVySWQiOiJvbXZicCIsInpvbmVJZCI6MjE4LCJ6b25lVHlwZSI6M30seyJpZCI6MTA2NiwiZGVhbGVySWQiOiJvbXZicCIsInpvbmVJZCI6NSwiem9uZVR5cGUiOjR9LHsiaWQiOjEwNjcsImRlYWxlcklkIjoib212YnAiLCJ6b25lSWQiOjYsInpvbmVUeXBlIjo1fV0sInVzZXJGbGFnIjp0cnVlLCJreWNGbGFnIjpmYWxzZSwib25QcmV0dXBzIjp0cnVlLCJpbnZTYWxlTG9naWMiOiJpbnRlcm5hbCIsImlwQWRkcmVzcyI6IjEwLjEwLjMwLjk3Iiwid2FsbGV0TnVtYmVycyI6eyJNRmFpc2EiOlsiOTYwOTYxMjcyNyJdLCJSYWFzdGFzIjpbIjk2MDk2MTI4NjYiLCI5NjA5NjEyODU4IiwiOTYwOTkzMDIzOCJdfSwic2FsZXNDaGFubmVsSWRMaXN0IjpbNDg1M10sImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0RJU1RSSUJVVE9SIn1dfQ==.Oe/67UeJxg122S7F6kVYCt+XcXA5wRUCFFqd/YHYago=";
    axios.defaults.timeout = 30000;
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
          "received response status code invalid",
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
      const response = await axios.get<StockStatusResponse[]>(
        `api/inventory/status`
      );
      if (response.status != 200) {
        throw new APIError(
          "received response status code invalid",
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
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchInventoryRules = async (transferType: string) => {
    try {
      const response = await axios.get<InventoryRulesResponse[] |InventoryProductResponse[] >(
        `api/inventory/transfer/rules/${transferType}`
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchSerialsForUser = async (request:AvailableSerialsRequest) => {
    try {
      const response = await axios.post<AvailableSerialsResponse[]>('master/searchInventory',request)
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  }
  fireIntiateInventoryOrder = async (request:InventoryOrderReq) => {
      try {
        const response = await axios.post<InventoryOrderResponse>('api/inventory/transfer/orders', request)
        this.printJSON(response.data);
      return response.data;
      } catch (error) {
        throw this.errorhandling(error);
      }
  }
  errorhandling = (error: unknown): APIError | UnauthorizedError => {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      throw new APIError(error.response?.data, error.response?.status ?? 400);
    } else {
      throw new APIError("API process failed", 400);
    }
  };
  printJSON = (response: any) => {
    console.log(`Response received: \n ${JSON.stringify(response, null, 2)}`);
  };
  removeAuthToken = () => {
    axios.defaults.headers.common["x-auth-token"] = undefined;
  };
}

export interface POSAPIHeaders extends AxiosHeaders {
  "X-AUTH-TOKEN": string | null;
}
