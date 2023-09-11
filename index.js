import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// If running into useEffect issues with firebase: https://rnfirebase.io/messaging/usage
AppRegistry.registerComponent(appName, () => App);