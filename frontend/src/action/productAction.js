import axios from 'axios';

import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	CLEAR_ERRORS
  } from '../constance/productConstants';

  export const getProdycts  = () => async (dispatch) => {
	try{

		dispatch({ type: ALL_PRODUCTS_REQUEST })

		const { data } = await axios.get('/api/vi/products')

		dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })

	}
	catch (error) {
			dispatch({
				type: ALL_PRODUCTS_FAIL,
				payload: error.response.data.message
		})

	}
}

// clear Err
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}