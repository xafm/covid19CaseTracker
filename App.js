import React, {useState, useEffect, useReducer} from 'react';
import {ActivityIndicator, StyleSheet, View, Dimensions} from 'react-native';
import DropdownMessage from './src/components/DropdownMessage';
import SinceYourPreviousVisit from './src/screens/SinceYourPreviousVisit';
import TotalScreen from './src/screens/TotalScreen';
import Swiper from 'react-native-swiper';
import getLatestCovidData from './src/apis/getLatestCovidData';
import useStorage from './src/hooks/useStorage';

const windowHeight = Dimensions.get('window').height;

const reducer = (state, action) => {
  switch (action.colorToChange) {
    case 'set_data_since_previous_visit':
      return {...state, dataSinceYourPreviousVisit: action.payload};
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    dataSinceYourPreviousVisit: {
      confirmed: 0,
      deaths: 0,
      recovered: 0,
    },
  });

  // const [dataSinceYourPreviousVisit, setDataSinceYourPreviousVisit] = useState({
  //   confirmed: 0,
  //   deaths: 0,
  //   recovered: 0,
  // });
  const [totalData, setTotalData] = useState({
    confirmed: 0,
    deaths: 0,
    recovered: 0,
  });
  const [previousVisitTime, setPreviousVisitTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  const [lastUpdateTime, setLastUpdate] = useState('');
  const [
    retrieveLocalDataFromPreviousVisit,
    storeLatestDataToLocal,
  ] = useStorage();

  useEffect(() => {
    initiate();
  }, []);

  useEffect(() => {
    if (!message.text) {
      return;
    }
    DropdownMessage.alert(message.text, message.type);
  }, [message]);

  const initiate = async () => {
    let localDataFromPreviousVisit = null;
    try {
      localDataFromPreviousVisit = await retrieveLocalDataFromPreviousVisit();
    } catch (error) {
      setMessage({
        text: error.message,
        type: 'error',
      });
    }

    let currentData = null;
    try {
      currentData = await getLatestCovidData();
      console.log(currentData);
    } catch (error) {
      setMessage({
        text: error.message,
        type: 'error',
      });
    }

    if (!currentData) {
      if (localDataFromPreviousVisit.storedAt) {
        setLastUpdate(localDataFromPreviousVisit.storedAt);
        setPreviousVisitTime(localDataFromPreviousVisit.storedAt);
        setTotalData(localDataFromPreviousVisit);
      }

      setIsLoading(false);
      return;
    }

    let dataSinceYourPreviousVisit = calculateDataSinceYourLastVisit(
      currentData,
      localDataFromPreviousVisit,
    );

    if (currentData && !localDataFromPreviousVisit.storedAt) {
      setMessage({
        text:
          "Looks like it's your first time. Data on this screen will be updated next time you visit.",
        type: 'info',
      });
    }

    setTotalData(currentData);
    storeLatestDataToLocal(currentData);
    // setDataSinceYourPreviousVisit(dataSinceYourLastVisit);
    dispatch({
      type: 'set_data_since_previous_visit',
      payload: dataSinceYourPreviousVisit,
    });
    setLastUpdate(new Date());
    setIsLoading(false);
    if (localDataFromPreviousVisit.storedAt) {
      setPreviousVisitTime(localDataFromPreviousVisit.storedAt);
    }
  };

  const calculateDataSinceYourLastVisit = (
    latestData,
    localDataFromPreviousVisit,
  ) => {
    if (Object.entries(localDataFromPreviousVisit).length === 0) {
      return {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
      };
    }

    let calculatedData = {
      confirmed: latestData.confirmed - localDataFromPreviousVisit.confirmed,
      deaths: latestData.deaths - localDataFromPreviousVisit.deaths,
      recovered: latestData.recovered - localDataFromPreviousVisit.recovered,
    };

    return {
      confirmed: calculatedData.confirmed < 0 ? 0 : calculatedData.confirmed,
      deaths: calculatedData.deaths < 0 ? 0 : calculatedData.deaths,
      recovered: calculatedData.recovered < 0 ? 0 : calculatedData.recovered,
    };
  };

  return (
    <View style={styles.container}>
      <Swiper loop={false} index={0}>
        <View style={styles.container}>
          <SinceYourPreviousVisit
            dataSinceYourPreviousVisit={state.dataSinceYourPreviousVisit}
            previousVisitTime={previousVisitTime}
            styles={styles}
          />
          {isLoading && (
            <ActivityIndicator
              color={'#fff'}
              size={70}
              style={styles.loading}
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
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: (windowHeight / 100) * 4,
    fontWeight: 'bold',
    color: '#f7c08a',
  },
  subheader: {
    fontSize: (windowHeight / 100) * 2,
    fontWeight: 'bold',
    color: '#f7c08a',
  },
  footerInfoText: {
    fontSize: (windowHeight / 100) * 2,
    fontWeight: 'bold',
    color: '#f7c08a',
  },
  textHeaders: {
    fontSize: (windowHeight / 100) * 4,
    color: 'grey',
    marginBottom: 0,
  },
  textRed: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: (windowHeight / 100) * 4,
    color: 'red',
    fontWeight: 'bold',
    margin: 10,
  },
  textGrey: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: (windowHeight / 100) * 4,
    color: 'grey',
    fontWeight: 'bold',
    margin: 10,
  },
  textGreen: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: (windowHeight / 100) * 4,
    color: 'green',
    fontWeight: 'bold',
    margin: 0,
  },
  textBlack: {
    marginTop: 0,
    marginBottom: 30,
    fontSize: (windowHeight / 100) * 4,
    color: 'black',
    fontWeight: 'bold',
    margin: 10,
  },
  loading: {
    position: 'absolute',
  },
});
