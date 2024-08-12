import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { Provider, createStore } from 'jotai';
import AuthProvider from './components/Authentication/AuthProvider';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ApiProvider from './components/ApiProvider';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const providerStore = createStore();

  return (
    <Provider store={providerStore}>
      <ApiProvider store={providerStore}>
        <NavigationContainer>
          <Suspense fallback={<FontAwesomeIcon icon={faSpinner}/>}>
            <AuthProvider />
          </Suspense>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ApiProvider>
    </Provider>
  );
};