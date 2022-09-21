import ACTIONS from './index'
import axios from 'axios'

export const fetchAllProducts = async (token) => {
    const res = await axios.get('/api/products', {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetAllProducts = (res) => {
    return {
        type: ACTIONS.GET_ALL_PRODUCTS,
        payload: res.data
    }
}