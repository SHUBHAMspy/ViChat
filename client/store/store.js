const { createStore } = require("redux");
import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducer from './reducer';

const store = createStore(mainReducer, composeWithDevTools());

export default store;