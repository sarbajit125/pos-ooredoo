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
          wallet: {
            type: "Rastas",
            walletid:
              data != undefined && data.walletNumbers?.Raastas != undefined
                ? data.walletNumbers?.Raastas.length > 0
                  ? data.walletNumbers?.Raastas[0]
                  : "" || ""
                : "",
          },
          salesChannelId: data?.salesChannelIdList[0] || "",
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
        wallet: {
          type: "Faisa",
          walletid:
            data != undefined && data.walletNumbers?.MFaisa != undefined
              ? data.walletNumbers?.MFaisa.length > 0
                ? data.walletNumbers?.MFaisa[0]
                : "" || ""
              : "",
        },
        salesChannelId: data?.salesChannelIdList[0] || "",
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
              data != undefined && data.walletNumbers?.Raastas != undefined
                ? data.walletNumbers?.Raastas.length > 0
                  ? data.walletNumbers?.Raastas[0]
                  : "" || ""
                : ""
            } balance : `}
          </Header14RubikLbl>
        </TouchableOpacity>
        <NotoRegular12>{switchState && rastasbalance}</NotoRegular12>
        <TouchableOpacity style={styles.btn} onPress={() => fetchBalance(true)}>
          <Header14RubikLbl>
            {`Faisa wallet ${
              data != undefined && data.walletNumbers?.MFaisa != undefined
                ? data.walletNumbers?.MFaisa.length > 0
                  ? data.walletNumbers?.MFaisa[0]
                  : "" || ""
                : ""
            } balance : `}
          </Header14RubikLbl>
        </TouchableOpacity>
        <NotoRegular12>{switchState && faisaBalance}</NotoRegular12>
        {showModal && (
          <OoredooPinModal
            show={showModal}
            walledId={
              data != undefined && data.walletNumbers?.MFaisa != undefined
                ? data.walletNumbers?.MFaisa.length > 0
                  ? data.walletNumbers?.MFaisa[0]
                  : "" || ""
                : ""
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
