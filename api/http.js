import axios from 'axios';
import qs from 'qs';

import { Tip, UID } from '@/utils';

const NO_NEED_TOKEN_API_LIST = [];

axios.defaults.baseURL = 'https://dandan.cn/';
// axios.defaults.baseURL = 'https://m.dhcivf.com/';

axios.defaults.headers.common['Content-Type'] = "application/x-www-form-urlencoded";

const network = {
	error: '网络错误',
	400: '请求错误',
	401: '未授权，请登录',
	403: '拒绝访问',
	404: '请求地址不存在',
	408: '请求超时',
	500: '服务器内部错误',
	501: '服务未实现',
	502: '网关错误',
	503: '服务不可用',
	504: '网关超时',
	505: 'HTTP版本不受支持'
}
axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded";
// 添加拦截器
axios.interceptors.request.use((config) => {

	return config
}, error => {
	return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
	const { code, data, message = '服务器错误' } = response.data || {};
	if (code === 1) {
		return response.data;
	} else {
		return Promise.reject({ code, message });
	}
	// return response;
}, function (err) {
	err.message = network.error
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				err.message = network[400]
				break

			case 401:
				err.message = network[401]
				break

			case 403:
				err.message = network[403]
				break

			case 404:
				err.message = network[404]
				break

			case 408:
				err.message = network[408]
				break

			case 500:
				err.message = network[500]
				break

			case 501:
				err.message = network[501]
				break

			case 502:
				err.message = network[502]
				break

			case 503:
				err.message = network[503]
				break

			case 504:
				err.message = network[504]
				break

			case 505:
				err.message = network[505]
				break

			default:
		}
	}
	return Promise.reject(err)
});
function parse(data) {
	const result = {};
	for (const key in data) {
		const v = data[key];
		if (typeof v === 'string') {
			result[key] = v;
		} else {
			result[key] = JSON.stringify(v);
		}
	}
	return qs.stringify(result);
}
function base(type) {
	return function (url, data = {}, config) {
		const { showError = true, headers = {}, json = true,full=false } = config || { showError: true, headers: {}, json: true,full:false };
		const params = {
			url,
			method: type,
			headers
		};
		data.uid = data.uid || UID.GET();
		if (['post', 'put'].includes(type)) {
			if (!json) {
				params.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
			}
			params.data = json ? data : parse(data);
		} else {
			params.params = data
		}
		return axios(params)
			.then(res=>{
				if(full){
					return res
				}else{
					return res.data
				}
			})
			.catch(e => {
				console.log(e, 'e');
				showError && Tip.error(e.message);
				return Promise.reject(e)
			})
	}
}
export const get = base('get');
export const deletes = base('delete');
export const post = base('post');
export const put = base('put');
export function mock({ timeout = 1000, data, success = true }) {
	return new Promise((resolve, reject) => {
		setTimeout(success ? resolve : reject, timeout, data)
	})
}