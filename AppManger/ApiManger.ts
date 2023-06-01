import axios, { AxiosError, AxiosHeaders } from "axios";
import { DashboardKPI } from "../responseModels/DashboardKPIResponse";
import {
  FetchWalletBalanceResponse,
  WalletBalanceDAO,
} from "../responseModels/FetchWalletbalanceResponse";
import {
  APIError,
  LoginSuccessfull,
  RoleChangeSuccss,
  UnauthorizedError,
} from "../responseModels/responseModels";
import { SelfUserDetails } from "../responseModels/SelfUserDetailsResponse";
import { StockStatusResponse } from "../responseModels/StockStatusResponse";
import { POSWalletDAO } from "./POSAppManager";
import { HistoryListResponse } from "../responseModels/HistoryListResponse";
import {
  AvailableSerialsRequest,
  AvailableSerialsResponse,
  InventoryOrderListResponse,
  InventoryOrderReq,
  InventoryOrderResponse,
  InventoryProductResponse,
  InventoryRulesResponse,
  UploadMemoReq,
  UploadMemoResponse,
} from "../responseModels/InventoryRulesResponse";
import FormData from "form-data";
import {
  InventoryAllocateReq,
  InventoryAllocateResp,
  InventoryApprovalUIModel,
  InventoryOrderDetailsResponse,
  InventoryReqApprovalResp,
  POSInventoryCatelogResponse,
} from "../responseModels/InventoryOrderDetailsResponse";
export class APIManager {
  private static instance: APIManager;
  private constructor() {
    //axios.defaults.baseURL = "http://192.168.29.217:8000/pos";
    axios.defaults.baseURL = "http://10.10.9.113:9080";
    axios.defaults.headers.common["x-auth-token"] = "";
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
      const response = await axios.get<
        InventoryRulesResponse[] | InventoryProductResponse[]
      >(`api/inventory/transfer/rules/${transferType}`);
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fetchSerialsForUser = async (request: AvailableSerialsRequest) => {
    try {
      const response = await axios.post<AvailableSerialsResponse[]>(
        "master/searchInventory",
        request
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireIntiateInventoryOrder = async (request: InventoryOrderReq) => {
    try {
      const response = await axios.put<InventoryOrderResponse>(
        "api/inventory/transfer/orders",
        request
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireInventoryOrderHistory = async (fromDate: string, toDate: string) => {
    try {
      const response = await axios.post<InventoryOrderListResponse[]>(
        "api/search/inventory/transfer/orders",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
      this.printJSON(response.data);
        return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireUploadMemo = async ({ selectedDoc, orderId }: UploadMemoReq) => {
    try {
      const formData = new FormData();
      formData.append("uploadfile", {
        uri: selectedDoc,
        name: "memo.jpg",
        type: "image/jpg",
      });
      const response = await axios.post<UploadMemoResponse>(
        `api/inventory/transfer/upload/file/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
          onUploadProgress(progressEvent) {
            if (progressEvent.total && progressEvent.loaded) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total!
              );
              console.log(`File upload progress: ${percentCompleted}%`);
            }
          },
        }
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireChangeRole = async (newRole: string) => {
    try {
      const response = await axios.post<RoleChangeSuccss>(
        `app/api/setUsersCurrentRole/${newRole}`
      );
      this.printJSON(response.data);
      axios.defaults.headers.common["x-auth-token"] =
        response.data.responseBody;
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireInventoryDetails = async (orderId: string) => {
    try {
      const response = await axios.get<InventoryOrderDetailsResponse>(
        `api/inventory/transfer/orders/${orderId}`
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  firePOSInventoryCatelog = async () => {
    try {
      const response = await axios.get<POSInventoryCatelogResponse[]>(
        `master/inventoryTypes`
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireInventoryApproval = async (
    endpointId: string,
    decision: string,
    remarks?: string
  ) => {
    try {
      const response = await axios.post<InventoryReqApprovalResp>(endpointId, {
        remarks: remarks,
      });
      this.printJSON(response.data);
      let uiObj: InventoryApprovalUIModel = {
        decision: decision,
        orderId: response.data.orderId,
      };
      return uiObj;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  fireInventoryAllocate = async (
    request: InventoryAllocateReq[],
    orderId: number
  ) => {
    try {
      const response = await axios.post<InventoryAllocateResp>(
        `api/inventory/transfer/allocation/${orderId}`,
        request
      );
      this.printJSON(response.data);
      return response.data;
    } catch (error) {
      throw this.errorhandling(error);
    }
  };
  errorhandling = (error: unknown): APIError | UnauthorizedError => {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      throw new APIError(error.response?.data, error.response?.status ?? 400);
    } else if (error instanceof APIError) {
      throw error
    } else {
      throw new APIError("API process failed", 400);
    }
  };
  printJSON = (response: any) => {
    console.log(`Response received: \n ${JSON.stringify(response)}`);
    // console.log(`Response received: \n ${JSON.stringify(response, null, 2)}`);
  };
  removeAuthToken = () => {
    axios.defaults.headers.common["x-auth-token"] = undefined;
  };
}

export interface POSAPIHeaders extends AxiosHeaders {
  "X-AUTH-TOKEN": string | null;
}
