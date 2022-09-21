import { combineReducers } from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import products from './productsReducer'


export default combineReducers({
    auth,
    token,
    products
})