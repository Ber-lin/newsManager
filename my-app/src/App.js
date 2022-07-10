import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react'
import axios from 'axios'
import IndexRouter from './router/indexRouter';
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'//使用这个让状态持久化作用在侧边栏上无延迟
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  );
}
export default App;
