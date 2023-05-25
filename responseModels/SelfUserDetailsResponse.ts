export interface SelfUserDetails {
    userId: string,
    userCredentials: UserCredentials,
    userAuthorities:  UserAuthorities[],
    userAddress: UserAddress,
    currentRole: string,
    userLastName?: string,
    userFirstName: string,
    walletNumbers?: WalletResponse,
    salesChannelIdList: string[]
}
export interface UserCredentials {
    username: string,
    userDesc: string,
}
export interface UserAuthorities {
    authority: string
}
export interface UserAddress {
    contactNumber: string,
    emailId: string
}
export interface WalletResponse {
    MFaisa: string[]
    Raastas: string[] 
}