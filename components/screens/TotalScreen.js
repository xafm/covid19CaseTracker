import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";

export default function TotalScreen(props) {
  const formatDate = date => {
    if (date) {
      date = new Date(date);
      let month =
        date.getMonth() + 1 < 10
          ? "0" + Number(date.getMonth() + 1)
          : date.getMonth() + 1;
      let minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `Last update: ${date.getDate()}.${month}.${date.getFullYear()} ${date.getHours()}:${minute}`;
    }

    return "-";
  };

  return (
    <View style={props.styles.container}>
      <View style={props.styles.container}>
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          <Text style={props.styles.header}> Total </Text>
          <Text style={{ ...props.styles.header, fontSize: 12 }}>
            {formatDate(props.lastUpdateTime)}
          </Text>
        </View>

        <Text style={props.styles.textHeaders}>Confirmed</Text>
        <Text style={props.styles.textRed}>{props.totalData.confirmed}</Text>
        <Text style={props.styles.textHeaders}>Deaths</Text>
        <Text style={props.styles.textGrey}>{props.totalData.deaths}</Text>
        <Text style={props.styles.textHeaders}>Recovered</Text>
        <Text style={props.styles.textGreen}>{props.totalData.recovered}</Text>
        <Text style={{ ...props.styles.header, fontSize: 10 }}>
          Swipe right to see number of cases since your last visit
      </Text>
      </View>
    </View>
  );
}
