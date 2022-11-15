import {QueryClient} from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';
import {persistQueryClient} from 'react-query/persistQueryClient-experimental';
import {createAsyncStoragePersistor} from 'react-query/createAsyncStoragePersistor-experimental';

//https://react-query.tanstack.com/reference/QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

//#region persist https://react-query.tanstack.com/plugins/createAsyncStoragePersistor
// const asyncStoragePersistor = createAsyncStoragePersistor({
//     storage: AsyncStorage,
// });
//
// persistQueryClient({
//     queryClient,
//     persistor: asyncStoragePersistor,
// });
//#endregion
