import { StyleSheet, View, Switch, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import OoredooModBtn from "../OoredooModBtn";
import { ColorConstants } from "../../constants/Colors";
import Header14RubikLbl from "../OoredooFonts/Rubik/Header14RubikLbl";
import NotoRegular12 from "../OoredooFonts/Noto/NotoRegular12";
import { StoresContext } from "../../store/RootStore";
import { observer } from "mobx-react";
import OoredooPinModal from "../OoredooPinModal";

const DashboardBalance = observer((props: DashboardBalanceProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const [switchState, setSwitch] = useState(false);
  const [showModal, setModal] = useState(false);
  const fetchBalance = async (isFaisa: boolean) => {
    if (isFaisa) {
      setModal(true);
    } else {
      userStore.fetchBalance();
    }
  };
  const handleFaisaPin = (pin: string) => {
    setModal(false)
    userStore.fetchBalance(userStore.selectedFaisaWallet, pin);
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
        {switchState && userStore.selecetedRastasBalance}
      </NotoRegular12>
      <TouchableOpacity style={styles.btn} onPress={() => fetchBalance(true)}>
        <Header14RubikLbl>
          {`Faisa wallet ${userStore.selectedFaisaWallet.walletid} balance : `}
        </Header14RubikLbl>
      </TouchableOpacity>
      <NotoRegular12>
        {switchState && userStore.selectedFaisaBalance}
      </NotoRegular12>
      {showModal && <OoredooPinModal
        show={showModal}
        walledId={userStore.selectedFaisaWallet.walletid}
        returnPrin={handleFaisaPin}
        onDismiss={function (): void {
          setModal(false);
        }}
      />}
      
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
