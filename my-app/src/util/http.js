import axios from "axios";
import {store} from '../redux/store'
axios.defaults.baseURL = "http://localhost:8000"

// axios.defaults.headers

axios.interceptors.request.use(function (config) {
    // 显示loading
    store.dispatch({
        type: 'change_loading',
        payload: true
    })
    return config
}, function (err) {
    return Promise.reject(err)
})
axios.interceptors.response.use(function (response) {
    // 隐藏loading
    store.dispatch({
        type: 'change_loading',
        payload: false
    })
    return response
}, function (err) {
    store.dispatch({
        type: 'change_loading',
        payload: false
    })
    return Promise.reject(err)
})