import ACTIONS from '../actions/'

const products = []

const productsReducer = (state = products, action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_PRODUCTS:
            return action.payload
        default:
            return state
    }
}

export default productsReducer