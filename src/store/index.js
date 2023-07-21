import { createStore } from 'vuex'

export default createStore({
    // 状态
    state () {
        return {
            userInfo: {
                name:'',
                userAvatar:''
            }
        }
    },

    // 变更
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },

    // actionss
    actions: {

    },
    modules: {}
})