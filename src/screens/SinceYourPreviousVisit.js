import React from 'react';
import {Text, View} from 'react-native';
import Formatter from '../scripts/formatters';

export default function SinceYourPreviousVisit(props) {
  const getHeaderDates = () => {
    if (props.previousVisitTime) {
      let date = new Date(props.previousVisitTime);
      let month =
        date.getMonth() + 1 < 10
          ? '0' + Number(date.getMonth() + 1)
          : date.getMonth() + 1;
      let minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      return `${date.getDate()}.${month}.${date.getFullYear()} ${date.getHours()}:${minute}`;
    }
    return '-';
  };

  return (
    <View style={props.styles.container}>
      <View style={props.styles.headerContainer}>
        <Text style={{...props.styles.header}}> Since Your Last Visit On </Text>
        <Text style={{...props.styles.subheader}}>{getHeaderDates()}</Text>
      </View>

      <Text style={props.styles.textHeaders}>Confirmed</Text>
      <Text style={props.styles.textRed}>
        {Formatter.numberThousandSeperator(
          props.dataSinceYourPreviousVisit.confirmed,
        )}
      </Text>
      <Text style={props.styles.textHeaders}>Deaths</Text>
      <Text style={props.styles.textGrey}>
        {Formatter.numberThousandSeperator(
          props.dataSinceYourPreviousVisit.deaths,
        )}
      </Text>
      <Text style={props.styles.textHeaders}>Recovered</Text>
      <Text style={props.styles.textGreen}>
        {Formatter.numberThousandSeperator(
          props.dataSinceYourPreviousVisit.recovered,
        )}
      </Text>
      <Text style={{...props.styles.footerInfoText}}>
        Swipe left to see number of total cases
      </Text>
    </View>
  );
}
