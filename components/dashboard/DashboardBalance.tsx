import { StyleSheet, View, Switch, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import OoredooModBtn from "../OoredooModBtn";
import { ColorConstants } from "../../constants/Colors";
import Header14RubikLbl from "../OoredooFonts/Rubik/Header14RubikLbl";
import NotoRegular12 from "../OoredooFonts/Noto/NotoRegular12";
import { StoresContext } from "../../store/RootStore";
import { observer } from "mobx-react";
import OoredooPinModal from "../OoredooPinModal";
import { walletBalanceHook } from "../../query-hooks/QueryHooks";
const DashboardBalance = observer((props: DashboardBalanceProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const balanceMutation = walletBalanceHook();
  const [switchState, setSwitch] = useState(false);
  const [showModal, setModal] = useState(false);
  const [rastasbalance, setRastasBalance] = useState('0.00')
  const [faisaBalance, setFaisaBalance] = useState('0.00')
  const fetchBalance = (isFaisa: boolean) => {
    if (isFaisa) {
      setModal(true);
    } else {
      balanceMutation.mutate({
        wallet: userStore.selectedRastasWallet,
        salesChannelId: userStore.salesChannelList[0],
        mpin: undefined,
      },{
        onSuccess(data, variables, context) {
          data.type === "Faisa"
            ? setFaisaBalance(data.balance)
            : setFaisaBalance("0.00")
        },
      });
    }
  };
  const handleFaisaPin = (pin: string) => {
    setModal(false);
    balanceMutation.mutate({
      wallet: userStore.selectedFaisaWallet,
      salesChannelId: userStore.salesChannelList[0],
      mpin: pin,
    }, {onSuccess(data, variables, context) {
      data.type === "Rastas"
      ? setRastasBalance(data.balance)
      : setRastasBalance("0.00")
    },});
  };
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
          thumbColor={switchState ? ColorConstants.white : ColorConstants.white}
          ios_backgroundColor={ColorConstants.grey_898}
          value={switchState}
          style={styles.switch}
          onValueChange={() => setSwitch(!switchState)}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => fetchBalance(false)}>
        <Header14RubikLbl>
          {`Rastas wallet ${userStore.selectedRastasWallet.walletid} balance : `}
        </Header14RubikLbl>
      </TouchableOpacity>
      <NotoRegular12>
        {switchState && rastasbalance}
      </NotoRegular12>
      <TouchableOpacity style={styles.btn} onPress={() => fetchBalance(true)}>
        <Header14RubikLbl>
          {`Faisa wallet ${userStore.selectedFaisaWallet.walletid} balance : `}
        </Header14RubikLbl>
      </TouchableOpacity>
      <NotoRegular12>
        {switchState && faisaBalance}
      </NotoRegular12>
      {showModal && (
        <OoredooPinModal
          show={showModal}
          walledId={userStore.selectedFaisaWallet.walletid}
          returnPrin={handleFaisaPin}
          onDismiss={function (): void {
            setModal(false);
          }}
        />
      )}
    </View>
  );
});
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
    width: 70,
  },
  btn: {
    padding: 2,
    marginTop: 5,
  },
});
