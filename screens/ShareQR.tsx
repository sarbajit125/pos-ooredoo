import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import QRCode from "react-native-qrcode-svg";
import { fetchQRCodeForUser } from "../query-hooks/QueryHooks";
import { POSUserDataContext } from "../store/RootStore";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { QRGenerationReq } from "../responseModels/QRGenerationResponse";
import * as Location from "expo-location";
import { POSUtilityManager } from "../AppManger/POSAppManager";
import { POSQRTimer } from "../constants/AppConstants";
const ShareQR = (props: QRShareNavProps) => {
  const [timer, setTimer] = useState<number>(0);
  const [qrString, setQrString] = useState<string>("");
  const qrVM = fetchQRCodeForUser();
  const userDetailStore = POSUserDataContext();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showError, toggleError] = useState<boolean>(false);
  const [showQr, toggleQr] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);
  useEffect(() => {
    if (timer === 0) {
      prepareQRRequest();
    }
  }, [timer]);

  useEffect(() => {
    if (qrVM.isSuccess) {
      const qrDate = `posID=${qrVM.data.posId},qrcodeId=${qrVM.data.qrCodeId}`;
      console.log(qrDate);
      setQrString(qrDate);
      toggleQr(true);
      setTimer(POSQRTimer);
      let interval = setInterval(() => {
        setTimer((lastTimerCount) => {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        });
      }, 1000); //each count lasts for a second
      //cleanup the interval on complete
      return () => clearInterval(interval);
    } else if (qrVM.isError) {
      setErrorMsg(
        POSUtilityManager.sharedInstance().prepareErrorMsg(qrVM.error)
      );
      toggleQr(false);
      toggleError(true);
    }
  }, [qrVM.isSuccess, qrVM.isError]);

  const prepareQRRequest = () => {
    const request: QRGenerationReq = {
      addDate: new Date().getUTCDate().toString(),
      beatPlan: "Demo_beat_plan",
      latLong: `${latitude?.toString() ?? ""}${longitude?.toString() ?? ""}`,
      posId: userDetailStore.userId,
      qrCodeId:
        userDetailStore.userId +
        Math.floor(
          Math.random() * (9999999 - 1000000 + 1) + 1000000
        ).toString(),
    };
    qrVM.mutate(request);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        {showQr ? (
          <QRCode size={300} value={qrString} color={ColorConstants.black} />
        ) : null}
      </View>
      <View style={styles.descView}>
        <Text style={styles.descText}> Don't generate QR Code auto? </Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => prepareQRRequest()}
        >
          <Text style={styles.refreshBtnText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timerView}>
        <Text style={styles.timerText}>{timer}</Text>
      </View>
      {qrVM.isLoading ? <OoredooActivityView /> : null}
      {showError ? (
        <OoredooBadReqView
          modalVisible={showError}
          action={function (): void {
            toggleError(false);
            props.navigation.goBack();
          }}
          title={errorMsg}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ShareQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  descView: {
    flexDirection: "row",
  },
  qrView: {
    height: 300,
  },
  descText: {
    marginLeft: 16,
    marginRight: 3,
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
    flexWrap:'wrap'
  },
  refreshBtn: {
    justifyContent:'center',
    flexWrap:'wrap'
  },
  refreshBtnText: {
    color: ColorConstants.red_ED1,
    fontFamily: Fontcache.rubikBold,
    fontSize: 18,
  },
  timerView: {
    height: 60,
    alignItems: "center",
  },
  timerText: {
    fontFamily: Fontcache.rubikBold,
    fontSize: 24,
  },
});
type QRShareNavProps = NativeStackScreenProps<RootStackParamList, "QRShare">;
