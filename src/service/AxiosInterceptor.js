import axios from 'axios';

// request interceptor
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// response interceptor
axios.interceptors.response.use(function (response) {
    // 如果未登陆，跳转到登陆页面
    if (response.messager === 'no login') {
        window.location.href = "/login";
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});