
import qs from 'qs';
import { Tip, UID, router, URL, app } from '@/utils';
import { get } from "@/api/http";

const fields = ['departmentList', 'areaList', 'myDoctor', 'goodsClassify', 'hospitalClassify', 'addressList', 'invoiceList', 'hospitalClassify', 'agentUserInfo', 'userInfo'];
const locale = ['userinfo'];
const wait = (timeout = 3000) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}
const shouldCallStatus = ['init', 'error'];

const API = {
    MY_DOCTOR() {
        return get("/Api/getUserDoctorInfo_api.php");
    },
    DEPARTMENT_LIST() {
        return get('/Api/getDoctorRoomList_api.php')
    },
    AREA_LIST() {
        return get('/Api/getDoctorCity_api.php')
    },
    GOODS_CLASSIFY() {
        return get("/Api/getGoodsType_api.php", { root: '服务' });
    },
    HOSPITAL_CLASSIFY() {
        return get("/Api/getGoodsType_api.php", { root: '医院' });
    },
    ADDRESS_LIST() {
        return get("/Api/getMailList_api.php");
    },
    INVOICE_LIST() {
        return get("/Api/getInvList_api.php");
    },
    USER_INFO() {
        if (!UID.GET()) {
            return Promise.reject({});
        }
        return get("/Api/getUserInfo_api.php", {}, { showError: false });
    },
    AGENT_USER_INFO() {
        return get('/Api/xcx/getUserInfo_api.php', {}, { showError: false })
    },
    HOSPITAL_CLASSIFY() {
        return get("/Api/getGoodsType_api.php", { root: '医院' });
    },
};
export const state = () => {
    const initState = {
        selected: {
            address: null,
            invoice: null
        },
        goHomeBtnVisilbe: false,
        advancedRewardsModal: {
            visible: false,
            type: 'login'//登录或活动
        },
        forceLoginModalVisible: false
    };
    fields.forEach(field => {
        initState[field] = {
            status: 'init',
            success: false,
            loading: false,
            data: null
        };
    });
    //如果不在service端初始化字段 则数据不会被watch到
    if (process.browser) {
        locale.forEach(fields => {
            const value = window.localStorage.getItem(fields);
            try {
                initState[`locale_${fields}`] = JSON.parse(value);
            } catch (e) {
                initState[`locale_${fields}`] = value;
            }
        });
    } else {
        locale.forEach(fields => {
            const value = '';
            try {
                initState[`locale_${fields}`] = JSON.parse(value);
            } catch (e) {
                initState[`locale_${fields}`] = value;
            }
        });
    }
    return initState;
}
export const getters = {

};
export const mutations = {
    //组件挂载后为字段赋值
    initLocale(state) {
        locale.forEach(fields => {
            const value = window.localStorage.getItem(fields);
            try {
                state[`locale_${fields}`] = JSON.parse(value);
            } catch (e) {
                state[`locale_${fields}`] = value;
            }
        });
    },
    setLocale(state, action) {
        const { key, value } = action;
        state[`locale_${key}`] = value;
        window.localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    },
    update(state, action) {
        const { field, payload } = action;
        state[field] = payload
    },
    setSelected(state, data) {
        state.selected = data;
    },
    select(state, { key, value }) {
        state.selected[key] = value;
    },
    toggleGoHomeBtn(state, v) {
        state.goHomeBtnVisilbe = v;
        console.log('call toggleGoHomeBtn', v);
    },
    toggleForceLoginModalVisible(state, v) {
        state.forceLoginModalVisible = v;
    },
    showAdvancedRewardsModal(state, isHas) {
        state.advancedRewardsModal = {
            visible: true,
            type: isHas
        }
    },
    hideAdvancedRewardsModal(state) {
        state.advancedRewardsModal = {
            visible: false,
            type: ''
        }
    }
}
export const actions = {
    async asyncActionWrapper({ commit, dispatch }, config) {
        const { call, field, key, params = {}, retry = false, isInRetry, format } = config
        commit(
            {
                type: 'update',
                field: field || key,
                payload: {
                    status: 'loading',
                    loading: true
                }
            }
        )
        // 如果是重试状态 等待10s再重试
        if (isInRetry) {
            await wait(10000)
        }
        return call(params)
            .then(data => {
                commit({
                    type: 'update',
                    field: field || key,
                    payload: {
                        status: 'success',
                        success: true,
                        loading: false,
                        data: format ? format(data) : data
                    }
                })
                return Promise.resolve(data)
            })
            .catch(msg => {
                if (retry) {
                    return dispatch('asyncActionWrapper', Object.assign(config, { isInRetry: true }))
                } else {
                    commit({
                        type: 'update',
                        field: field || key,
                        payload: {
                            status: 'error',
                            loading: false,
                            msg
                        }
                    })
                    return Promise.reject(msg)
                }
            })
    },
    async getBase({ state, dispatch }, { call, params, field, force, format }) {
        // if (!process.browser) {
        //     return Promise.reject('请等待客户端请求');
        // }
        if (!process.browser) {
            return Promise.reject('请等待浏览器访问');
        }
        if (!state[field]) {
            return Promise.reject('不存在此字段的数据');
        }
        if (shouldCallStatus.includes(state[field].status) || force) {
            return await dispatch('asyncActionWrapper', {
                call,
                params,
                retry: false,
                field,
                format
            });
        } else {
            return await Promise.resolve(state[field].data);
        }
    },
    getMyDoctor({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.MY_DOCTOR,
            field: 'myDoctor',
            force,
            retry: true
        });
    },
    getDepartmentList({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.DEPARTMENT_LIST,
            field: 'departmentList',
            force,
            retry: true
        });
    },
    getAreaList({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.AREA_LIST,
            field: 'areaList',
            force,
            retry: true
        });
    },
    getGoodsClassify({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.GOODS_CLASSIFY,
            field: 'goodsClassify',
            force,
            retry: true,
            format(list) {
                return list.map(({ TypeName, tid }) => {
                    return {
                        label: TypeName,
                        value: tid
                    }
                })
            }
        });
    },
    getHospitalClassify({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.HOSPITAL_CLASSIFY,
            field: 'hospitalClassify',
            force,
            retry: true,
            format(list) {
                return list.map(({ TypeName, tid }) => {
                    return {
                        label: TypeName,
                        value: tid
                    }
                })
            }
        });
    },
    getAddressList({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.ADDRESS_LIST,
            field: 'addressList',
            force,
            retry: true
        });
    },
    getInvoiceList({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.INVOICE_LIST,
            field: 'invoiceList',
            force,
            retry: true
        });
    },
    getUserInfo({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.USER_INFO,
            field: 'userInfo',
            force,
            retry: true
        });
    },
    getAgentUserInfo({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.AGENT_USER_INFO,
            field: 'agentUserInfo',
            force,
            retry: true
        });
    },
    init({ dispatch }) {

    },
    getHospitalClassify({ dispatch }, config = {}) {
        const { force } = config;
        return dispatch('getBase', {
            call: API.HOSPITAL_CLASSIFY,
            field: 'hospitalClassify',
            force,
            retry: true,
            format(list) {
                return list.map(({ TypeName, tid }) => {
                    return {
                        label: TypeName,
                        value: tid
                    }
                })
            }
        });
    },
    // async nuxtServerInit({ dispatch }) {
    //     console.log('call nuxtServerInit')
    // },
    login({ commit }, value) {
        commit('setLocale', { key: 'userinfo', value });
        UID.SET(value.uid);
        let redirect = localStorage.getItem('redirect')
        try {
            redirect = JSON.parse(redirect)
        } catch (e) {
            redirect = null;
        }
        if (+value.canGet === 1) {
            //显示领取优惠券弹窗
            app.$store.commit("showAdvancedRewardsModal", '500');
        }
        const { path = '/', query = {} } = redirect || { path: '/', query: {} };
        router.replace({
            path: path || '/',
            query,
        });
        Tip.success('登录成功');
        setTimeout(() => {
            app.$root.$emit('requestShow628Modal')
        });
    },
    logout({ commit }, value) {
        commit('setLocale', { key: 'userinfo', value: null });
        UID.SET('')
        router.replace({
            path: '/login'
        });
    }
}