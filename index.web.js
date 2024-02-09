import { AppRegistry } from 'react-native';
import BaseApp from './App';
import appInfo from './app.json';

AppRegistry.registerComponent(appInfo.name, () => BaseApp);
AppRegistry.runApplication(appInfo.name, {
    rootTag: document.getElementById('root'),
});
