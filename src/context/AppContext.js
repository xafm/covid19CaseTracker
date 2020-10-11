import React, {useReducer} from 'react';
const AppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_data_since_previous_visit':
      return {...state, dataSinceYourPreviousVisit: action.payload};
    case 'set_total_data':
      return {...state, totalData: action.payload};
    case 'set_previous_visit_time':
      return {...state, previousVisitTime: action.payload};
    case 'set_is_loading':
      return {...state, isLoading: action.payload};
    case 'set_message':
      return {...state, message: action.payload};
    case 'set_last_update_time':
      return {...state, lastUpdateTime: action.payload};
    default:
      return state;
  }
};

const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {
    dataSinceYourPreviousVisit: {
      confirmed: 0,
      deaths: 0,
      recovered: 0,
    },
    totalData: {
      confirmed: 0,
      deaths: 0,
      recovered: 0,
    },
    previousVisitTime: '',
    isLoading: true,
    message: {
      text: '',
      type: '',
    },
    lastUpdateTime: '',
  });

  const setDataSincePreviousVisit = dataSinceYourPreviousVisit => {
    dispatch({
      type: 'set_data_since_previous_visit',
      payload: dataSinceYourPreviousVisit,
    });
  };

  const setTotalData = localDataFromPreviousVisit => {
    dispatch({type: 'set_total_data', payload: localDataFromPreviousVisit});
  };

  const setIsLoading = isLoading => {
    dispatch({type: 'set_is_loading', payload: isLoading});
  };

  const setPreviousVisitTime = previousVisitTime => {
    dispatch({
      type: 'set_previous_visit_time',
      payload: previousVisitTime,
    });
  };

  const setMessage = (message, type) => {
    dispatch({
      type: 'set_message',
      payload: {
        text: message,
        type: type,
      },
    });
  };

  const setLastUpdateTime = lastUpdateTime => {
    dispatch({
      type: 'set_last_update_time',
      payload: lastUpdateTime,
    });
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
    <AppContext.Provider
      value={[
        state,
        setDataSincePreviousVisit,
        setTotalData,
        setPreviousVisitTime,
        setIsLoading,
        setMessage,
        setLastUpdateTime,
        calculateDataSinceYourLastVisit,
      ]}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};
