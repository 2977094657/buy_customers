import { createStore } from 'vuex'

export default createStore({
    // 状态
    state () {
        return {
            userInfo: {
                name:'',
                userAvatar:'',
                userId: '',
                land: '',
                gender: '',
                description: '',
            },
            // 保持随机数，只在刷新的情况下改变内容，返回不变
            randomSeed: Math.floor(Math.random() * 10000),
            deviceType: ''
        }
    },

    // 变更
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setRandomSeed(state, seed) {
            state.randomSeed = seed;
        },
        setDeviceType(state, deviceType) {
            state.deviceType = deviceType;
        },
    },

    actions: {

    },
    modules: {}
})
