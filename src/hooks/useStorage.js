import AsyncStorage from '@react-native-community/async-storage';

export default () => {
  const retrieveLocalDataFromPreviousVisit = async () => {
    try {
      let storeObject = await AsyncStorage.getItem('dataOnLastVisit');

      if (!storeObject) {
        return {};
      }

      storeObject = JSON.parse(storeObject);
      storeObject.storedAt = new Date(storeObject.storedAt);
      return storeObject;
    } catch (error) {
      throw new Error('Error while retrieving your previous data');
      // setMessage({
      //   text: 'Error while retrieving your previous data',
      //   type: 'error',
      // });
    }
  };

  const storeLatestDataToLocal = async latestData => {
    try {
      let storeObject = {...latestData, storedAt: new Date()};
      await AsyncStorage.setItem(
        'dataOnLastVisit',
        JSON.stringify(storeObject),
      );
    } catch (error) {}
  };

  return [retrieveLocalDataFromPreviousVisit, storeLatestDataToLocal];
};
