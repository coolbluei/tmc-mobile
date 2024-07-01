import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { Suspense } from 'react';
import { Provider, createStore } from 'jotai';
import AuthProvider from './components/Authentication/AuthProvider';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Styles from './styles';
import ApiProvider from './components/ApiProvider';

export default function App() {

  const providerStore = createStore();

  return (
    <Provider store={providerStore}>
      <ApiProvider store={providerStore}>
        <SafeAreaView style={Styles.appWrapper}>
            <Suspense fallback={<FontAwesomeIcon icon={faSpinner}/>}>
              <AuthProvider />
            </Suspense>
          <StatusBar style="auto" />
        </SafeAreaView>
      </ApiProvider>
    </Provider>
  );
};