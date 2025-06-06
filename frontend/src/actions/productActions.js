import axios from 'axios'
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
} from '../constants/productConstant'

export const listProducts = (
  keyword = '',
  classFilter = '',
  schoolFilter = '',
  priceSort = '',
  minPrice = '',
  maxPrice = '',
  category = '',
  type = ''
) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    // Create an object to hold query parameters
    const params = {};

    // Add parameters if they are not empty
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (classFilter) params.class = classFilter;
    if (schoolFilter) params.school = schoolFilter;
    if (priceSort) params.price = priceSort;
    if (minPrice && maxPrice) {
      params.price = 'range';
      params.min_price = minPrice;
      params.max_price = maxPrice;
    }
    if (type) params.type = type;

    // Log the params to make sure they are correct
    console.log("Params object before query string:", params);

    // Convert the params object to a query string (URL encoded)
    const queryString = new URLSearchParams(params).toString();
    console.log("Generated query string:", queryString);  // Ensure proper query string is generated

    // Send the request with the query string
    const { data } = await axios.get(`/api/products/?${queryString}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error in fetching products:", error); // Log error for further inspection

    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};


export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_DELETE_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      const { data } = await axios.delete(
          `/api/products/delete/${id}/`,
          config
      )

      dispatch({
          type: PRODUCT_DELETE_SUCCESS,
      })


  } catch (error) {
      dispatch({
          type: PRODUCT_DELETE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}

export const createProduct = () => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_CREATE_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      const { data } = await axios.post(
          `/api/products/create/`,
          {},
          config
      )
      dispatch({
          type: PRODUCT_CREATE_SUCCESS,
          payload: data,
      })


  } catch (error) {
      dispatch({
          type: PRODUCT_CREATE_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(
            `/api/products/update/${product._id}/`,
            product,
            config
        )
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data,
        })


        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}