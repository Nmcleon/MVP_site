import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer } from './reducers/productReducers'; 
import { productDetailsReducre } from './reducers/productReducers';
import { authReducer } from './reducers/userReducers';

const reducer = combineReducers({
	products: productReducer,
	productDetails: productDetailsReducre,
	auth: authReducer
});
 
let initialState = {}

const middleware = [thunk];
const store = createStore(
	reducer,  
	initialState,  
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
