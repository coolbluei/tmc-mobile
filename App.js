import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { Provider, createStore } from 'jotai';
import AuthProvider from './components/Authentication/AuthProvider';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ApiProvider from './components/ApiProvider';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export default function App() {

  const providerStore = createStore();
  TrackPlayer.registerPlaybackService(() => require('./TrackPlayerService'));

  return (
    <Provider store={providerStore}>
      <ApiProvider store={providerStore}>
        <NavigationContainer>
          <Suspense fallback={<ActivityIndicator size="large" color="#000000" />}>
            <AuthProvider />
          </Suspense>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ApiProvider>
    </Provider>
  );
};