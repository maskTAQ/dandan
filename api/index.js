import { get, post, put, deletes, } from './http.js';

export function mock({ timeout = 1000, data, success = true }) {
  return new Promise((resolve, reject) => {
    setTimeout(success ? resolve : reject, timeout, data)
  })
}

export function getWXApiConfig(params) {
  return get('/Api/wchat_api.php', params, { showError: false });
}
  //http://www.vmweimei.cn/Api/wchat_api.php