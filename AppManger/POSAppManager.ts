

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