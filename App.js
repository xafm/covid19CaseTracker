import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import * as HTMLParser from "node-html-parser";
import DropdownMessage from "./components/DropdownMessage";
import SinceYourPreviousVisit from "./components/screens/SinceYourPreviousVisit";
import TotalScreen from "./components/screens/TotalScreen";
import Swiper from "react-native-swiper";

export default function App() {
  const [dataSinceYourPreviousVisit, setDataSinceYourPreviousVisit] = useState({
    confirmed: 0,
    deaths: 0,
    recovered: 0
  });

  const [totalData, setTotalData] = useState({
    confirmed: 0,
    deaths: 0,
    recovered: 0
  });

  const [previousVisitTime, setPreviousVisitTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({
    text: "",
    type: ""
  });
  const [lastUpdateTime, setLastUpdate] = useState("");

  useEffect(() => {
    initiate();
  }, []);

  useEffect(() => {
    if (!message.text) return;
    DropdownMessage.alert(message.text, message.type);
  }, [message]);

  const initiate = async () => {
    let localDataFromPreviousVisit = await retrieveLocalDataFromPreviousVisit();
    let currentData = await getFormatedCurrentData();

    if (!currentData) {
      if (localDataFromPreviousVisit.storedAt) {
        setLastUpdate(localDataFromPreviousVisit.storedAt);
        setPreviousVisitTime(localDataFromPreviousVisit.storedAt);
        setTotalData(localDataFromPreviousVisit);
      }

      setIsLoading(false);
      return;
    }

    let dataSinceYourLastVisit = calculateDataSinceYourLastVisit(
      currentData,
      localDataFromPreviousVisit
    );

    if (currentData && !localDataFromPreviousVisit.storedAt) {
      setMessage({
        text:
          "Looks like it's your first time. Data on this screen will be updated next time you visit.",
        type: "info"
      });
    }

    setTotalData(currentData);
    storeLatestDataToLocal(currentData);
    setDataSinceYourPreviousVisit(dataSinceYourLastVisit);
    setLastUpdate(new Date());
    setIsLoading(false);
    if (localDataFromPreviousVisit.storedAt) {
      setPreviousVisitTime(localDataFromPreviousVisit.storedAt);
    }
  };

  const retrieveLocalDataFromPreviousVisit = async () => {
    try {
      let storeObject = await AsyncStorage.getItem("dataOnLastVisit");

      if (!storeObject) {
        return {};
      }

      storeObject = JSON.parse(storeObject);
      storeObject.storedAt = new Date(storeObject.storedAt);
      return storeObject;
    } catch (error) {
      setMessage({
        text: "Error while retrieving your previous data",
        type: "error"
      });
    }
  };

  const getFormatedCurrentData = async () => {
    let result = {};
    try {
      result = await axios.get(
        "https://api.allorigins.win/get?url=" +
          encodeURIComponent("https://www.worldometers.info/coronavirus/"),
        {
          timeout: 10000
        }
      );
    } catch (error) {
      // console.log(error);
      setMessage({
        text:
          "Could not reach latest data. You may not have internet connection.",
        type: "error"
      });
      return;
    }

    try {
      const converToNumber = str => {
        let result = "";

        for (let i = 0; i < str.length; i++) {
          if (!isNaN(str[i])) {
            result += str[i];
          }
        }

        return Number(result);
      };

      let root = HTMLParser.parse(result.data.contents);
      let texts = root.querySelectorAll(".maincounter-number");

      let totalConfirmed = texts[0].childNodes[1].childNodes[0].text;
      let totalDeath = texts[1].childNodes[1].childNodes[0].text;
      let totalRecovered = texts[2].childNodes[1].childNodes[0].text;

      totalConfirmed = converToNumber(totalConfirmed);
      totalDeath = converToNumber(totalDeath);
      totalRecovered = converToNumber(totalRecovered);

      return {
        confirmed: totalConfirmed,
        deaths: totalDeath,
        recovered: totalRecovered
      };
    } catch (error) {
      // console.log(error);
      setMessage({
        text: "Error while parsing data. The problem will be fixed soon",
        type: "error"
      });
    }
  };

  const calculateDataSinceYourLastVisit = (
    latestData,
    localDataFromPreviousVisit
  ) => {
    if (Object.entries(localDataFromPreviousVisit).length === 0) {
      return {
        confirmed: 0,
        deaths: 0,
        recovered: 0
      };
    }

    let calculatedData = {
      confirmed: latestData.confirmed - localDataFromPreviousVisit.confirmed,
      deaths: latestData.deaths - localDataFromPreviousVisit.deaths,
      recovered: latestData.recovered - localDataFromPreviousVisit.recovered
    };

    return {
      confirmed: calculatedData.confirmed < 0 ? 0 : calculatedData.confirmed,
      deaths: calculatedData.deaths < 0 ? 0 : calculatedData.deaths,
      recovered: calculatedData.recovered < 0 ? 0 : calculatedData.recovered
    };
  };

  const storeLatestDataToLocal = async latestData => {
    try {
      let storeObject = { ...latestData, storedAt: new Date() };
      await AsyncStorage.setItem(
        "dataOnLastVisit",
        JSON.stringify(storeObject)
      );
    } catch (error) {
      // console.log("Persisting exchange rates failed.");
      // console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper loop={false} index={0}>
        <View style={styles.container}>
          <SinceYourPreviousVisit
            dataSinceYourPreviousVisit={dataSinceYourPreviousVisit}
            previousVisitTime={previousVisitTime}
            styles={styles}
          />
          {isLoading && (
            <ActivityIndicator
              color={"#fff"}
              size={70}
              style={{
                position: "absolute"
              }}
            />
          )}
        </View>

        <View style={styles.container}>
          <TotalScreen
            totalData={totalData}
            lastUpdateTime={lastUpdateTime}
            styles={styles}
          />
        </View>
      </Swiper>
      <DropdownMessage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#f7c08a"
  },
  textHeaders: {
    fontSize: 30,
    color: "grey",
    marginBottom: 0
  },
  textRed: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: 30,
    color: "red",
    fontWeight: "bold",
    margin: 10
  },
  textGrey: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: 30,
    color: "grey",
    fontWeight: "bold",
    margin: 10
  },
  textGreen: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: 30,
    color: "green",
    fontWeight: "bold",
    margin: 0
  },
  textBlack: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    margin: 10
  }
});
