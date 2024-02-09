import { AppRegistry } from 'react-native';
import App from './App';
import appInfo from './app.json';

// If running into useEffect issues with firebase: https://rnfirebase.io/messaging/usage
AppRegistry.registerComponent(appInfo.name, () => App);
