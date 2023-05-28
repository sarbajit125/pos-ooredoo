import { StyleSheet, View, Switch, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import OoredooModBtn from "../OoredooModBtn";
import { ColorConstants } from "../../constants/Colors";
import Header14RubikLbl from "../OoredooFonts/Rubik/Header14RubikLbl";
import NotoRegular12 from "../OoredooFonts/Noto/NotoRegular12";
import OoredooPinModal from "../OoredooPinModal";
import {
  fetchSelfDetails,
  walletBalanceHook,
} from "../../query-hooks/QueryHooks";
import { FaisaWalletPlaceholder, RastasWalletPlaceholder } from "../../AppManger/POSAppManager";
const DashboardBalance = (props: DashboardBalanceProps) => {
  const balanceMutation = walletBalanceHook();
  const [switchState, setSwitch] = useState(false);
  const [showModal, setModal] = useState(false);
  const [rastasbalance, setRastasBalance] = useState("0.00");
  const [faisaBalance, setFaisaBalance] = useState("0.00");
  const { data, isSuccess } = fetchSelfDetails();
  const fetchBalance = (isFaisa: boolean) => {
    if (isFaisa) {
      setModal(true);
    } else {
      balanceMutation.mutate(
        {
          wallet: data?.defaultRastas ?? RastasWalletPlaceholder,
          salesChannelId: data?.salesChannelList ?? "",
          mpin: undefined,
        },
        {
          onSuccess(data) {
            data.type === "Faisa"
              ? setFaisaBalance(data.balance)
              : setFaisaBalance("0.00");
          },
        }
      );
    }
  };
  const handleFaisaPin = (pin: string) => {
    setModal(false);
    balanceMutation.mutate(
      {
        wallet: data?.defaultFaisa ?? FaisaWalletPlaceholder,
        salesChannelId:  data?.salesChannelList ?? "",
        mpin: pin,
      },
      {
        onSuccess(data) {
          data.type === "Rastas"
            ? setRastasBalance(data.balance)
            : setRastasBalance("0.00");
        },
      }
    );
  };
  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.btnView}>
          <OoredooModBtn
            onPress={props.stockBalancePressed}
            style={styles.stockBtn}
            title={"Stock Balance"}
          />
          <Switch
            trackColor={{
              false: ColorConstants.grey_898,
              true: ColorConstants.red_ED1,
            }}
            thumbColor={
              switchState ? ColorConstants.white : ColorConstants.white
            }
            ios_backgroundColor={ColorConstants.grey_898}
            value={switchState}
            style={styles.switch}
            onValueChange={() => setSwitch(!switchState)}
          />
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => fetchBalance(false)}
        >
          <Header14RubikLbl>
            {`Rastas wallet ${
               data?.defaultRastas.walletid ?? RastasWalletPlaceholder.walletid
            } balance : `}
          </Header14RubikLbl>
        </TouchableOpacity>
        <NotoRegular12>{switchState && rastasbalance}</NotoRegular12>
        <TouchableOpacity style={styles.btn} onPress={() => fetchBalance(true)}>
          <Header14RubikLbl>
            {`Faisa wallet ${
             data?.defaultFaisa.walletid ?? FaisaWalletPlaceholder.walletid
            } balance : `}
          </Header14RubikLbl>
        </TouchableOpacity>
        <NotoRegular12>{switchState && faisaBalance}</NotoRegular12>
        {showModal && (
          <OoredooPinModal
            show={showModal}
            walledId={
              data?.defaultFaisa.walletid ?? FaisaWalletPlaceholder.walletid
            }
            returnPrin={handleFaisaPin}
            onDismiss={function (): void {
              setModal(false);
            }}
          />
        )}
      </View>
    );
  } else {
    return <View style={styles.container}></View>;
  }
};
type DashboardBalanceProps = {
  stockBalancePressed: () => void;
};

export default DashboardBalance;

const styles = StyleSheet.create({
  container: {},
  btnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockBtn: {
    width: 100,
  },
  switch: {
    padding: 5,
  },
  btn: {
    padding: 2,
    marginTop: 5,
  },
});
