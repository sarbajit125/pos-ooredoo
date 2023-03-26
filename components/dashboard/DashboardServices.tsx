import { StyleSheet, View, Image, ImageSourcePropType } from "react-native";
import React, { useState } from "react";
import Header13RubikLbl from "../OoredooFonts/Rubik/Header13RubikLbl";
import Header14Noto from "../OoredooFonts/Noto/Header14Noto";
import { ColorConstants } from "../../constants/Colors";

const DashboardServices = () => {
const HomeServiceList: HomeServiceProps[] = [
    {
        link: "newCustReg",
        name: "New customer registration",
        description: "Register for pos service",
        imagePath: require("../../assets/images/newCustomerReg.png") ,
      },
      {
        link:"recharge",
        name: "Recharge bill Payment",
        description:"Rechrage services",
        imagePath: require("../../assets/images/rechargebill.png")
      },
      {
        link:"kpi",
        name:"KPI",
        description:"KPI menu here",
        imagePath: require("../../assets/images/newCustomerReg.png"),
      },
      {
        link:"services",
        name:"Services",
        description:"Services list for user",
        imagePath: require("../../assets/images/Groupcomission.png"),
      },
      {
        link:"productAwareness",
        name:"Product Awareness",
        description:"know about Ooredoo products",
        imagePath: require("../../assets/images/Homeproductawareness.png"),
      },
      {
        link:"comission",
        name:"Comission",
        description:"Get to know you monthly dividends",
        imagePath:require("../../assets/images/Homeperformance.png"),
      }
]
  const [servicelist, setServiceList] = useState<HomeServiceProps[]>(HomeServiceList);
  const renderCell = (item: HomeServiceProps) => {
    return (
        <View style={styles.cell} key={item.link}>
            <Image style={styles.image} source={item.imagePath} />
            <Header13RubikLbl style={styles.title}>{item.name}</Header13RubikLbl>
            <Header14Noto style={styles.desc}>{item.description}</Header14Noto>
        </View>
    )
  }
  return (
    <View style={styles.container}>
      {servicelist.map((item) => renderCell(item))}
    </View>
  );
};

export default DashboardServices;

const styles = StyleSheet.create({
  container: {
    height: 500,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    flexWrap:'wrap',
  },
  cell: {
    width: 140,
    height: 150,
    borderColor: ColorConstants.grey_E0E,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    margin: 10,
  },
  image:{
    width: 36,
    height: 36,
    marginTop: 20,
    marginLeft: 10,
  },
  title:{
    marginLeft: 10,
    paddingTop: 10,
  },
  desc:{
    marginLeft: 10,
    paddingTop: 5,
  },
});

interface HomeServiceProps {
  link: string;
  name: string;
  imagePath: ImageSourcePropType | undefined;
  description: string;
}
