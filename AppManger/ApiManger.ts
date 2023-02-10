import axios, { AxiosError, AxiosHeaders } from "axios";
import { APIError, LoginSuccessfull, UnauthorizedError } from "../responseModels/responseModels";
import { SelfUserDetails } from "../responseModels/SelfUserDetailsResponse";


export class APIManager {
    private static instance: APIManager;
  private constructor() {
axios.defaults.baseURL = "http://10.10.9.113:9080"
    axios.defaults.headers.common['x-auth-token'] = ""
  }
  public static sharedInstance(): APIManager {
    if (!APIManager.instance) { 
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }
  loginAPI = async (username:string, password: string) : Promise<LoginSuccessfull> => {
    try {
      const response = await  axios.post(`/api/login`,{
        username: username,
        password: password
      })
      const apiHeaders = response.headers as POSAPIHeaders
      if (response.status != 200) {
        throw new UnauthorizedError("Unable to login")
      } else if (apiHeaders.get("X-AUTH-TOKEN") == undefined) { 
        throw new UnauthorizedError('Unable to retrive auth token')
      } else {       
        axios.defaults.headers.common['x-auth-token'] =  apiHeaders.get("X-AUTH-TOKEN")
         const uiReponse: LoginSuccessfull = {
             message: "Login Succesfull"
         }
         return Promise.resolve(uiReponse) 
      }
    } catch (error) {
        throw this.errorhandling(error)
    }
  }
  userDetails = async (): Promise<SelfUserDetails>  => {
    try {
      const response = await axios.get(`/userDetail/self`)
      console.log( axios.defaults.headers.common['x-auth-token'])
      if (response.status !=200) {
        throw new APIError("API error", response.status)
      } else {
        this.printJSON(response.data)
        return response.data as SelfUserDetails
      }
    } catch (error) {  
      throw  this.errorhandling(error)
    }
  }
  errorhandling = (error: unknown) : APIError => {
    if (error instanceof AxiosError) {
        throw new APIError(error.response?.data.message ,error.response?.status ?? 400)
   } else {
         throw new APIError("APi process falied", 400)
   }
  }
  printJSON = (response: any) => {
    console.log("Response recvied: ")
    console.log(JSON.stringify(response, null, 2))
  }
}

export interface POSAPIHeaders extends AxiosHeaders {
  "X-AUTH-TOKEN": string | null
}