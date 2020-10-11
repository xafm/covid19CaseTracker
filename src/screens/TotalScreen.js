import React from 'react';
import {Text, View} from 'react-native';
import Formatter from '../scripts/formatters';

export default function TotalScreen(props) {
  const formatDate = date => {
    if (date) {
      date = new Date(date);
      let month =
        date.getMonth() + 1 < 10
          ? '0' + Number(date.getMonth() + 1)
          : date.getMonth() + 1;
      let minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      return `Last update: ${date.getDate()}.${month}.${date.getFullYear()} ${date.getHours()}:${minute}`;
    }
    return '-';
  };

  return (
    <View style={props.styles.container}>
      <View style={props.styles.headerContainer}>
        <Text style={props.styles.header}> Total </Text>
        <Text style={{...props.styles.subheader}}>
          {formatDate(props.lastUpdateTime)}
        </Text>
      </View>

      <Text style={props.styles.textHeaders}>Confirmed</Text>
      <Text style={props.styles.textRed}>
        {Formatter.numberThousandSeperator(props.totalData.confirmed)}
      </Text>
      <Text style={props.styles.textHeaders}>Deaths</Text>
      <Text style={props.styles.textGrey}>
        {Formatter.numberThousandSeperator(props.totalData.deaths)}
      </Text>
      <Text style={props.styles.textHeaders}>Recovered</Text>
      <Text style={props.styles.textGreen}>
        {Formatter.numberThousandSeperator(props.totalData.recovered)}
      </Text>
      <Text style={{...props.styles.footerInfoText}}>
        Swipe right to see number of cases since your last visit
      </Text>
    </View>
  );
}
