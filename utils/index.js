import { Notify } from 'vant';
import qs from 'qs';
import day from "dayjs";
import { Dialog } from 'vant';

import { getWXApiConfig } from "@/api";
import { get } from "@/api/http";
export let app;
export const UID = {
    SET(v) {
        if (!process.browser) return
        return localStorage.setItem('uid', v);
    },
    GET() {
        if (!process.browser) return
        return localStorage.getItem('uid');
    }
};
if (process.browser) {
    window.day = day;
}
const RULES = {
    REQUIRED({ value, error }) {
        return {
            result: !!value,
            msg: error
        }
    }
}
const Tip = {
    success(message) {
        Notify({
            message,
            duration: 3000,
            background: '#1989fa'
        });
    },
    error(e) {
        const message = (typeof e === 'object' ? e.message : e) || '';
        Notify({
            message,
            duration: 3000,
            background: 'red'
        });
    },
    request({ title, content, call, params }) {
        return new Promise((resolve, reject) => {
            Dialog.confirm({
                title,
                message: content,
            })
                .then(() => {
                    call(params)
                        .then(res => {
                            resolve(res);
                        })
                        .catch(reject);
                })
                .catch(() => {
                    reject('user:cancel')
                });
        })
    },
    verify(params, promise = true) {
        let fields
        if (Array.isArray(params)) {
            fields = params
        } else {
            fields = params.list
        }
        for (let i = 0; i < fields.length; i++) {
            const { value, rules = [RULES.REQUIRED], error } = fields[i]
            let cache
            const result = rules.every(call => {
                cache = call({ value, error })
                return cache.result
            })
            if (!result) {
                Tip.error(cache.msg)
                return promise ? Promise.reject(cache) : { result: false, data: cache }
            }
        }
        return promise ? Promise.resolve() : { result: true }
    },
};

const URL = {
    decode(value) {
        const v = decodeURIComponent(value);
        try {
            return JSON.parse(v);
        } catch (e) {
            return v;
        }
    },
    encode(value) {
        console.log(value, 'value')
        const v = typeof value === 'object' ? JSON.stringify(value) : value;
        // return encodeURIComponent(v);
        return v;
    }
};
class WxApi {
    constructor() {
        this.get();
    }
    get() {
        if (!process.browser) return
        if (this.instance) {
            return this.instance;
        }
        const result = new Promise((resolve, reject) => {
            // const { origin, pathname } = window.location;
            getWXApiConfig({
                url: location.href.split('#')[0]
            }).then((config) => {
                wx.config({
                    beta: true,
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    ...config,
                    jsApiList: ['onMenuShareAppMessage', 'chooseWXPay', "chooseImage", "showAllNonBaseMenuItem", "scanQRCode", 'updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(() => {
                    this.instance = Promise.resolve(wx);
                    resolve(wx)
                });
                wx.error((err) => {
                    reject(err)
                });
            });
        });
        return result;
    }
    scanQRCode = () => {
        return new Promise((resolve, reject) => {
            return this.get()
                .then(() => {
                    wx.scanQRCode({
                        needResult: 1,
                        success(res) {
                            resolve(res);
                        },
                        fail(e) {
                            reject(e)
                        }
                    });
                })
                .catch(reject)
        })
    }
    showAllNonBaseMenuItem() {
        return wx.showAllNonBaseMenuItem();
    }
    onMenuShareAppMessage(data) {
        return new Promise((resolve, reject) => {
            return this.get()
                .then(() => {
                    console.log('等待分享')
                    wx.updateAppMessageShareData({
                        ...data,
                        // title: '', // 分享标题
                        // desc: '', // 分享描述
                        // link: '', // 分享链接
                        // imgUrl: '', // 分享图标
                        // type: '', // 分享类型,music、video或link，不填默认为link
                        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success(res) {
                            resolve(res);
                        },
                        fail(e) {
                            reject(e)
                        }
                    });
                })
                .catch(reject)
        })
    }
    updateAppMessageShareData(data) {
        return new Promise((resolve, reject) => {
            return this.get()
                .then(() => {
                    console.log('等待分享')
                    wx.updateAppMessageShareData({
                        ...data,
                        // title: '', // 分享标题
                        // desc: '', // 分享描述
                        // link: '', // 分享链接
                        // imgUrl: '', // 分享图标
                        // type: '', // 分享类型,music、video或link，不填默认为link
                        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success(res) {
                            resolve(res);
                        },
                        fail(e) {
                            reject(e)
                        }
                    });
                })
                .catch(reject)
        })
    }
    updateTimelineShareData(data) {
        return new Promise((resolve, reject) => {
            return this.get()
                .then(() => {
                    wx.updateTimelineShareData({
                        ...data,
                        success(res) {
                            resolve(res);
                        },
                        fail(e) {
                            reject(e)
                        }
                    });
                })
                .catch(reject)
        })
    }
    chooseWXPay = (data) => {
        return new Promise((resolve, reject) => {
            return this.get()
                .then(() => {
                    wx.chooseWXPay({
                        ...data,
                        success(res) {
                            resolve(res);
                        },
                        fail(e) {
                            reject(e)
                        }
                    });
                })
                .catch(reject)
        })
    }
}
const wxApi = new WxApi()
export function getRoot() {
    return process.browser ? (window.document.body.offsetWidth / 375) * 100 : 100
}
export function LoadingControl({ call, params, change }) {
    change({
        status: 'loading',
        loading: true
    })
    return call(params)
        .then((res) => {
            setTimeout(() => {
                change({
                    status: 'success',
                    loading: false,
                    data: res
                })
            })
            return res
        })
        .catch((e) => {
            change({
                status: 'error',
                loading: false
            })
            return Promise.reject(e)
        })
}
export function initApp(instance) {
    app = instance;
    if (process.browser) {
        window.app = instance;
        window.copyTrigger = document.getElementById('copy-trigger');
        window.mobileCall = document.getElementById('mobile-call');
    }

}
export function link(query) {
    const { src } = query;
    if (src.includes('dandan.cn/h5')) {
        window.location.href = src;
        return;
    }
    if (app) {
        router.push({
            path: '/webview',
            query
        });
    } else {
        window.location.href = `/webview?${qs.stringify(query)}`;
    }

}
export function split(s, n) {
    const string = String(s);
    if (string.length >= n) {
        return string.substr(0, n) + '...';
    } else {
        return string;
    }
}

export function formatSelect(list, config) {
    const { label, value, children } = config
    return list.map(node => {
        const c = Array.isArray(node[children]) ? formatSelect(node[children], config) : null
        if (c) {
            delete node[children]
            return {
                ...node,
                label: node[label],
                value: node[value],
                children: c
            }
        }
        return {
            ...node,
            label: node[label],
            value: node[value]
        }
    })
}

export function formatTime(s, format) {
    if (!s) {
        return '';
    }

    return day(String(s).length === 10 ? s * 1000 : s).format(format || "YYYY/MM/DD HH:mm:ss")
}
export function size(v) {
    const w = process.browser ? document.body.offsetWidth : 375;
    return (w / 375) * v;
}

export { Tip, URL, wxApi };

export async function onBridgeReady(data) {
    return new Promise((resolve, reject) => {
        if (typeof WeixinJSBridge === "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
            return reject();
        }
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', data,
            function (res) {
                if (res.err_msg.includes('ok')) {
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    resolve('ok')
                } else {
                    reject('cancel')
                }
            });
    })
}
export function encodeMobile(mobile = '') {
    if (!mobile) return ''
    return mobile.slice(0, 3) + "****" + mobile.slice(mobile.length - 4);
}
export const router = {
    list: [],
    push(params) {
        if (!app) return;
        params.query = params.query || {};
        params.query.uid = UID.GET();
        app.$router.push(params);
        router.list.push(params.path);
    },
    back() {
        if (!app) return;
        app.$router.back();
        if (router.list.length) {
            router.list.length -= 1;
        }
    },
    replace(params) {
        if (!app) return;
        params.query = params.query || {};
        params.query.uid = UID.GET();
        params.query.replace = 1;
        params.replace = true;
        app.$router.replace(params);
        if (router.list.length) {
            router.list[router.list.length - 1] = params.path;
        } else {
            router.list.push(params.path)
        }
    },
    login() {
        router.replace({
            path: "/login", query: {
                redirect: URL.decode(app.$route.fullPath)
            }
        });
    }
}

export const PARENT = {
    SET(v) {
        if (process.browser && v) {
            localStorage.setItem('parent', v);
            setTimeout(() => {
                if (app.$route.query.uid !== UID.GET()) {
                    const query = {
                        ...app.$route.query,
                        uid: UID.GET() || ''
                    }
                    //设置父级后 重置uid
                    router.replace({
                        query
                    });
                }

            })
        }
    },
    GET() {
        return localStorage.getItem('parent') || '';
    },
    BIND(self = UID.GET()) {
        return new Promise((resolve, reject) => {
            if (process.browser) {
                const parent = PARENT.GET();
                // alert(JSON.stringify({ self, parent }))
                if (self && parent) {
                    if (parent === self) {
                        // alert('上级跟自己id相同不触发绑定');
                    }
                    // if (localStorage.getItem('bind') === parent) {
                    //     alert('上级id绑定过');
                    // }
                }
                // && localStorage.getItem('bind') !== parent
                if (self && parent && parent !== self) {
                    // alert(`开始绑定上级id${parent},自己的id${self}`)
                    get("/Api/bindDoctor_api.php", {
                        uid: self,
                        getuid: parent,
                    }, { showError: false })
                        .then(res => {
                            // alert(`绑定成功,更新医生信息`)
                            localStorage.setItem('bind', parent);
                            if (app) {
                                app.$store.dispatch("getMyDoctor", { force: true });
                            }
                            resolve(res)
                        })
                        .catch(e => {
                            // alert(`绑定失败${String(JSON.stringify(e))}`);
                            reject(e)
                        })
                } else {
                    reject()
                }
            } else {
                reject()
            }
        })
    }
};
export const timeDiff = (time) => {
    const now = day();
    const date = day(time);
    const d = now.diff(date, 'd');
    const h = now.diff(date, 'h') % 24;
    const m = now.diff(date, 'm') % 60;
    const s = now.diff(date, 's') % 60;
    const list = [{ v: d, unit: '天' }, { v: h, unit: '小时' }, { v: m, unit: '分钟' }, { v: s, unit: '秒' }]
    // console.log(list, 'list')
    // const match = list.find(item => !!item.v);
    // if (match) {
    //     const { v, unit } = match;
    //     return `${-v}${unit}`
    // }
    // return '刚刚发布'
    // const list = [{ v: d, unit: '天' }, { v: h, unit: '小时' }, { v: m, unit: '分钟' }, { v: s, unit: '秒' }]
    return list.filter(v => +v.v < 0).map(({ v, unit }) => `${-v}${unit}`).join('');
}
export function getPath(path = '', remove = 'h5') {
    const list = path.split('/').filter(v => v && v !== remove);
    return list.length ? '/' + list.join('/') : '';
}
export function toArray(a, split) {
    if (Array.isArray(a)) {
        return a;
    }
    if (split) {
        return String(a || '').split(split);
    }

    return a ? [a] : []
}
export const OS = function () {
    if (!process.browser) {
        return {}
    }
    var ua = navigator.userAgent,
        isWechat = /MicroMessenger/.test(ua),
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    return {
        isChrome,
        isWechat,
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        mode: isPc ? 'pc' : 'mobile'
    };
}();

export function checkLogin(tip = true) {
    if (!UID.GET()) {
        tip && Tip.error('请先登录');
        // localStorage.setItem(
        //     "redirect",
        //     JSON.stringify({
        //         path: app.$route.path,
        //         query: app.$route.query,
        //     })
        // );
        router.replace({
            path: "/login", query: {
                redirect: URL.decode(app.$route.fullPath)
            }
        });
        return false
    } else {
        return true
    }
}
export function isMobile(value) {
    return value && value.length <= 12 && value.length >= 11
}
export const KF_URL = {
    home: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    goods: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    baoxian: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    propaganda: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    platform: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    baoxian1: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    doctor: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
    hospital: 'https://work.weixin.qq.com/kfid/kfcdbb8e68168d3fcb6',
};

export function goKf(type) {
    window.location.href = KF_URL[type];
}
export function onReady(fn) {
    const readyState = document.readyState;
    if (readyState === 'interactive' || readyState === 'complete') {
        fn()
    } else {
        window.addEventListener("DOMContentLoaded", fn);
    }
}
export function copy(value) {
    if (window.copyTrigger) {
        window.copyTrigger.dataset.clipboardText = value;
        window.copyTrigger.click();
    }
}
export function call(mobile) {
    if (mobileCall) {
        mobileCall.href = `tel:${mobile}`;
        mobileCall.click();
    }
}
export function download(url) {
    var a = document.createElement("a");
    const list = url.split("/");
    a.download = list[list.length - 1];
    a.href = url;
    document.body.appendChild(a);
    // a.click();
    const event = document.createEvent("MouseEvents");
    event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    );
    a.dispatchEvent(event);
    a.parentElement.removeChild(a);
}
export class Timing {
    duration = 60;
    remain = 0;
    constructor(duration, on) {
        this.duration = duration;
        this.on = on;
    }
    start() {
        this.reset();
        this.run();
    }
    run = () => {
        if (this.remain > 0) {
            this.remain -= 1;
            this.on({
                type: 'run',
                value: this.remain
            });
            clearTimeout(this.timout);
            this.timout = setTimeout(this.run, 1000);
        } else {
            this.on({
                type: 'over',
                value: 0
            });
        }
    }
    reset() {
        if (this.remain) {
            this.on({
                type: 'over',
                value: 0
            });
        }
        this.remain = this.duration;
        clearTimeout(this.timout);
    }
    stop() {
        if (this.remain) {
            this.on({
                type: 'over'
            });
        }
        this.reset();
    }
}

export function getTagList({ text, max }) {
    const string = String(text || "");
    let result;
    if (typeof string === "string") {
        result = string.split(";");
    } else {
        result = toArray(string);
    }
    if (max && result.length > max) {
        result.length = max;
        result.push("...");
    }
    return result;
}
if (process.browser) {
    window.UID = UID;
    window.router = router;
}