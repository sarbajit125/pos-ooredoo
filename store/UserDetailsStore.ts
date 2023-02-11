import { action, makeAutoObservable } from "mobx";
import { APIManager } from "../AppManger/ApiManger";
import { POSWalletDAO } from "../AppManger/POSAppManager";
import { RootStore } from "./RootStore";

export default class UserDetailsStore {
  fname: string = "";;
  lname?: string = "";;
  username: string = "";;
  userDesc: string = "";;
  contact: string = "";;
  email: string = "";;
  salesChannelList: string[] = [];
  rastasWallets: POSWalletDAO[] = [];
  faisaWallets: POSWalletDAO[] = [];
  selectedRastasWallet: POSWalletDAO = {
    walletid: "",
    type: "Rastas",
  };
  selectedFaisaWallet: POSWalletDAO = {
    walletid: "",
    type: "Faisa",
  };
  currentRole: string = "";
  selecetedRastasBalance: string  = "0.00";;
  selectedFaisaBalance: string  = "0.00";;
  rootStore: RootStore;
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  @action setUserDetails = (
    fname: string,
    username: string,
    userDesc: string,
    contact: string,
    email: string,
    lname?: string
  ) => {
    this.fname = fname;
    this.lname = lname;
    this.userDesc = userDesc;
    this.username = username;
    this.contact = contact;
    this.email = email;
  };

  @action setSalesChannelList = (list: string[]) => {
    this.salesChannelList = list;
  };

  @action setRastasList = (list: string[]) => {
    this.rastasWallets = list.map((id) => ({
      walletid: id,
      type: "Rastas",
    }));
  };
  @action setFaisaList = (list: string[]) => {
    this.faisaWallets = list.map((item) => {
      return {
        walletid: item,
        type: "Faisa",
      };
    });
  };

  @action setDefaultRastasWallet = (wallet?: POSWalletDAO) => {
    if (wallet != null) {
      this.selectedRastasWallet = wallet;
    } else {
      this.selectedRastasWallet = this.rastasWallets[0];
    }
  };
  @action setDefaultFaisaWallet = (wallet?: POSWalletDAO) => {
    if (wallet != null) {
      this.selectedFaisaWallet = wallet;
    } else {
      this.selectedFaisaWallet = this.faisaWallets[0];
    }
  };
  @action setUserRole(role: string) {
    this.currentRole = role;
  }
  fetchSelfDetails = () => {
    this.salesChannelList = [];
    this.faisaWallets = Object.assign([], this.faisaWallets);
    this.rastasWallets = Object.assign([], this.rastasWallets);
    APIManager.sharedInstance()
      .userDetails()
      .then(
        action((response) => {
          this.setUserDetails(
            response.userFirstName,
            response.userCredentials.username,
            response.userCredentials.userDesc,
            response.userAddress.contactNumber,
            response.userAddress.emailId,
            response.userLastName
          );
          this.setSalesChannelList(response.salesChannelIdList);
          this.setRastasList(response.walletNumbers.Raastas);
          this.setFaisaList(response.walletNumbers.MFaisa);
          this.setDefaultRastasWallet(undefined);
          this.setDefaultFaisaWallet(undefined);
          this.currentRole = response.currentRole;
        })
      );
  };

  fetchBalance(wallet?: POSWalletDAO, pin?: string) {
    if (wallet != null) {
      APIManager.sharedInstance()
        .fetchWalletBalance(wallet, this.salesChannelList[0], pin)
        .then(
          action((response) => {
            if (wallet.type === "Rastas") {
              this.selecetedRastasBalance = response.responseBody[0].balance;
            } else {
              this.selectedFaisaBalance = response.responseBody[0].balance;
            }
          })
        );
    } else {
      APIManager.sharedInstance()
        .fetchWalletBalance(
          this.selectedRastasWallet,
          this.salesChannelList[0],
          pin
        )
        .then(
          action((response) => {
            this.selecetedRastasBalance = response.responseBody[0].balance;
          })
        );
    }
  }
}
