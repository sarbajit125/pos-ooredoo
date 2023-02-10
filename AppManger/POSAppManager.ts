export class POSAppManger {
    private static instance: POSAppManger;
  private constructor() {}
  public static sharedInstance(): POSAppManger {
    if (!POSAppManger.instance) { 
      POSAppManger.instance = new POSAppManger();
    }
    return POSAppManger.instance;
  }

  UserDetails: POSUserDetailsDAO = new POSUserDetailsDAO("","","","","")
  SalesChannelIdList:string[] = []
  FaisaWallets: POSWalletDAO[] = []
  RastasWallets: POSWalletDAO[] = []
  SelectedFaisaWallet: POSWalletDAO = {
    walletid: "",
    type: "Faisa"
  }
  SelectedRastasWallet: POSWalletDAO = {
    walletid: "",
    type: "Rastas"
  }
  defaultCurrency: CurrencyDetails = {
    name: "Maldivian Rufiyaa",
    symbol: "MVR"
  }
  defaultCountry: CountryDetails = {
    name: "Maldives",
    countryCode: "960"
  }
  currentRole: string = ""
}


export class POSUserDetailsDAO {
  userId: string
  username: string
  firstname: string
  lastname?: string
  contactNumber: string
  userDesc: string

  constructor(userId:string, username: string, firstname: string,contactNumber: string, userDesc: string, lastname?: string  ){
    this.userId = userId
    this.username = username
    this.firstname = firstname
    this.lastname = lastname
    this.contactNumber = contactNumber
    this.userDesc = userDesc
  }

}

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