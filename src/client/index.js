import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import rootReducer from 'reducers';
import { createStore ,combineReducers} from 'redux';
import routes from '../common/routes';
import './index.less';
import axios from 'axios';
import warnListReducers from '../common/reducers/warnListReducers';
import headerReducers from "../common/reducers/headerReducers";

const reducer = combineReducers({
  warn: warnListReducers,
  header:headerReducers
});
const store = createStore(reducer);


axios.interceptors.request.use(function (config) {
  const { headers } = config;
  const { current_system_token } = localStorage;
  headers.token = current_system_token;
  headers.Authorization = current_system_token;
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  const { data } = response;

  //401未授权的访问 500token过期
  if (data.code === 403 || data.code === 401) {
    localStorage.removeItem('current_system_token');
    location.href = '../common/pages/login';
    location.reload(true);
  }

  if(data.code === 500 && data.msg == "token不存在"){
    localStorage.removeItem('current_system_token');
    location.href = '../common/pages/login';
    location.reload(true);
  }
  console.log(data);

  return response;
}, function (error) {
  const err = error.response;
  console.log(err);
  //401未授权的访问 500token过期
  if (err == null || err.status === 401 || err.status === 500) {
    localStorage.removeItem('current_system_token');
    location.href = '../common/pages/login';
    location.reload(true);
  }
  return Promise.reject(error);
});
ReactDOM.render(
  <Provider store={store}>
    { routes }
  </Provider>,
  document.getElementById('root')
);