
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