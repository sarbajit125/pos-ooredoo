import { ColorConstants } from "../constants/Colors"


export interface POSWalletDAO {
  walletid: string
  type: "Rastas" | "Faisa"
}

export interface CurrencyDetails {
  name: string
  symbol: string
}

export interface CountryDetails {
  name: string
  countryCode: string
}

export class POSUtilityManager {
  private static instance: POSUtilityManager;
  private constructor() {}
  public static sharedInstance(): POSUtilityManager {
    if (!POSUtilityManager.instance) {
      POSUtilityManager.instance = new POSUtilityManager();
    }
    return POSUtilityManager.instance;
  }
  fetchOrderTypeForList = (orderType: number): string => {
    switch (orderType) {
        case 1:
          return "Warehouse to Warehouse Transfer"
        case 2:
          return "Dealer Purchase Order Transfer"
        case 3:
          return "Retailer to Retailer Transfer"
        case 4:
          return "Shop to warehouse Return"
        case 5:
          return "Vendor Receiving"
        case 6:
          return "Dealer to warehouse Return"
        case 7:
          return "Write-off"
        case 8:
          return "Write-off reversal"
        case 9:
          return "Dealer to DSA transfer"
        case 10:
          return "DSA Return to dealer"
        case 11:
          return "Sold to Customer"
        case 12:
          return "Retailer Return to dealer"
        case 13:
          return "Dealer to Retailer"
        case 14:
          return "Shop to Shop"
        case 15:
          return "DSA to Retailer"
        case 16:
          return "RO To customer"
        case 17:
          return "Write-off Warehouse level"
        case 18:
          return "W2W Transfer"
        case 19:
          return "W2W Dealer to DSA"
        case 20:
          return "W2W Dealer to RO"
        case 21:
          return "W2W Dealer to SubDealer"
        case 22:
          return "W2W DSA To RO"
        case 23:
          return "Shop To Sales Agent"
        case 24:
          return "MPT Bundling for finished goods"
        case 25:
          return "MPT Bundling for material goods"
        case 26:
          return "WG W2W Transfer"
        case 27:
          return "DSA to DSA"
        case 28:
          return "Retailer to DSA"
        case 29:
          return "Sales agent to Shop"
        case 30:
          return "Shop to Sales agent"
        case 31:
          return "W2W Sales agent to Shop"
        case 32:
          return "W2W Shop to Sales agent"
        case 33:
          return "Stock Allocation"
        case 34:
          return "Stock Deallocation"
        case 35:
          return "Distributor to distributor shop manager"
        case 36:
          return "Distributor shop manager to Distributor Return"
        case 37:
          return "DSP to Distributor Return"
        case 38:
          return "Distributor to DSP"
        case 39:
          return "DSP to Distributor shop manager return"
        case 40:
          return "Distributor shop manager to DSP"
        case 41:
          return "Distributor shop manager to DSA"
        case 42:
          return "DSA to Distributor shop manager return"
        case 43:
          return "Distributor shop manager to Retailer"
        case 44:
          return "Retailer to Distributor shop manager return"
        default:
          return ''
        }
}
prepareStatusforInventoryOrdersList = (statusId:number): {text: string, color:string} => {
  switch (statusId) {
    case -1:
      return {text: "Pre Order", color: ColorConstants.red_ED1}
    case 0:
      return {text: "Canceled", color:  ColorConstants.red_ED1}
    case 1:
      return {text: "New", color:  ColorConstants.red_ED1}
    case 2:
      return {text: "L1 Approval", color:  ColorConstants.red_ED1}
    case 3:
      return {text: "L2 Approval", color:  ColorConstants.red_ED1}
    case 4:
      return {text: "Allocated", color:  ColorConstants.orange_FFA}
    case 5:
      return {text: "Accepted", color:  ColorConstants.green_20}
    case 6:
      return {text: "Partial Allocated", color:  ColorConstants.red_ED1}
    case 7:
      return {text: "MPT API accepted", color:  ColorConstants.green_20}
    case 8:
      return {text: "MPT API rejected", color:  ColorConstants.red_ED1}
    case 9:
      return {text: "L3 Approval", color:  ColorConstants.red_ED1}
    case 10:
      return {text: "New serials dispatched", color:  ColorConstants.red_ED1}
    case 11:
      return {text: "New serials received by Partner", color:  ColorConstants.red_ED1}
    default:
      return {text: "", color:  ColorConstants.white}
    }
  }
}