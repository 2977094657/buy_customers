import { defineStore } from 'pinia'

export const useStore = defineStore({
    id: 'mainStore',
    state: () => ({
        userInfo: {
            name:'',
            userAvatar:'',
            userId: '',
            land: '',
            gender: '',
            description: '',
            vertical: true,
            ip: ''
        },
        maskDialog: false,
        maskDialogMode: 'dark',
        randomSeed: Math.floor(Math.random() * 10000),
        deviceType: ''
    }),
    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },
        setRandomSeed(seed) {
            this.randomSeed = seed;
        },
        setDeviceType(deviceType) {
            this.deviceType = deviceType;
        },
        setMaskDialog(val) {
            this.maskDialog = val.state
            if (val.mode) {
                this.maskDialogMode = val.mode
            }
        },
    }
})
