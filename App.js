import React, {useEffect, useContext} from 'react';
import {ActivityIndicator, StyleSheet, View, Dimensions} from 'react-native';
import DropdownMessage from './src/components/DropdownMessage';
import SinceYourPreviousVisit from './src/screens/SinceYourPreviousVisit';
import TotalScreen from './src/screens/TotalScreen';
import Swiper from 'react-native-swiper';
import getLatestCovidData from './src/apis/getLatestCovidData';
import useStorage from './src/hooks/useStorage';
import {AppContext, AppProvider} from './src/context/AppContext';

console.log(AppContext);
console.log(AppProvider);

const windowHeight = Dimensions.get('window').height;

const App = () => {
  const [
    state,
    setDataSincePreviousVisit,
    setTotalData,
    setPreviousVisitTime,
    setIsLoading,
    setMessage,
    setLastUpdateTime,
    calculateDataSinceYourLastVisit,
  ] = useContext(AppContext);

  const [
    retrieveLocalDataFromPreviousVisit,
    storeLatestDataToLocal,
  ] = useStorage();

  useEffect(() => {
    initiate();
  }, []);

  useEffect(() => {
    if (!state.message.text) {
      return;
    }
    DropdownMessage.alert(state.message.text, state.message.type);
  }, [state.message]);

  const initiate = async () => {
    let localDataFromPreviousVisit = null;
    try {
      localDataFromPreviousVisit = await retrieveLocalDataFromPreviousVisit();
    } catch (error) {
      setMessage(error.message, 'error');
    }

    let currentData = null;
    try {
      currentData = await getLatestCovidData();
    } catch (error) {
      setMessage(error.message, 'error');
    }

    if (!currentData) {
      if (localDataFromPreviousVisit.storedAt) {
        setLastUpdateTime(localDataFromPreviousVisit.storedAt);
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
      let message =
        "Looks like it's your first time. Data on this screen will be updated next time you visit.";
      setMessage(message, 'error');
    }

    setTotalData(currentData);
    storeLatestDataToLocal(currentData);
    setDataSincePreviousVisit(dataSinceYourPreviousVisit);
    setLastUpdateTime(new Date());
    setIsLoading(false);
    if (localDataFromPreviousVisit.storedAt) {
      setPreviousVisitTime(localDataFromPreviousVisit.storedAt);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper loop={false} index={0}>
        <View style={styles.container}>
          <SinceYourPreviousVisit
            dataSinceYourPreviousVisit={state.dataSinceYourPreviousVisit}
            previousVisitTime={state.previousVisitTime}
            styles={styles}
          />
          {state.isLoading && (
            <ActivityIndicator
              color={'#fff'}
              size={70}
              style={styles.loading}
            />
          )}
        </View>

        <View style={styles.container}>
          <TotalScreen
            totalData={state.totalData}
            lastUpdateTime={state.lastUpdateTime}
            styles={styles}
          />
        </View>
      </Swiper>
      <DropdownMessage />
    </View>
  );
};

export default () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

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
