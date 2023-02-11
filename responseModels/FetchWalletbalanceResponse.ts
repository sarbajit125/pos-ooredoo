
export interface FetchWalletBalanceResponse {
    status: string,
    userMessage: string
    responseBody: WalletBalanceDAO[]
}

export interface WalletBalanceDAO {
    id: string,
    type: string,
    balance: string
}