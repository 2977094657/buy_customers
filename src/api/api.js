import axios from 'axios';
import CryptoJS from "crypto-js";
import {encryptAESKey, encryptData, generateRandomAESKey} from "@/encryption/encryption";

// 服务器地址
const BASE_URL = 'http://124.221.7.201:8081';

// 创建一个 axios 实例
const instance = axios.create({
    baseURL: BASE_URL
});

// 请求拦截器
instance.interceptors.request.use(
    async config => {
        if (config.headers['X-Needs-Decryption'] === 'true') {
            const rsaPublicKey = await publicKey();
            // 生成随机的 AES 密钥
            const aesKey = generateRandomAESKey();
            // 使用 AES 密钥加密数据
            const encryptedData = {};
            for (const key in config.data) {
                encryptedData[key] = encryptData(config.data[key], aesKey);
            }
            // 使用 RSA 公钥加密 AES 密钥
            const encryptedAESKey = encryptAESKey(aesKey, rsaPublicKey.data.data.publicKey);
            // 更新请求数据
            config.data = {
                ...encryptedData,
                rsaPublicKey: rsaPublicKey.data.data.publicKey,
                aesKey: encryptedAESKey
            };
        }
        return config;
    },
    error => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);


// 响应拦截器
instance.interceptors.response.use(
    async response => {
        // 检查响应头
        if (response.headers['x-encrypted'] === 'true') {

            // 获取Base64编码后的AES密钥和IV
            const encryptedAesKey = response.data.aesKey;
            const encryptedIv = response.data.iv;

            // 将Base64编码的AES密钥和IV解码为字节数组
            const aesKeyBytes = CryptoJS.enc.Base64.parse(encryptedAesKey);
            const ivBytes = CryptoJS.enc.Base64.parse(encryptedIv);

            // 遍历响应数据，对每个值进行解密
            try {
                response.data = await decryptJsonValues(response.data.data, aesKeyBytes, ivBytes);
            } catch (e) {
                console.log('解密失败：'+e) // 输出解密失败的错误信息
            }
        }

        // 返回整个response对象
        return response;
    },
    error => {
        console.log('err' + error); // for debug
        return Promise.reject(error);
    }
);

async function decryptJsonValues(json, aesKeyBytes, ivBytes) {
    // 遍历json对象并解密每个值
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let value = json[key];
            if (typeof value === 'string') {
                // 对字符串值进行解密
                try {
                    // 直接使用原始的加密数据进行解密
                    let decryptedValue = CryptoJS.AES.decrypt(value, aesKeyBytes, {
                        iv: ivBytes,
                        mode: CryptoJS.mode.CTR,
                        padding: CryptoJS.pad.NoPadding
                    });
                    json[key] = CryptoJS.enc.Utf8.stringify(decryptedValue);
                } catch (e) {
                    console.log(`解密键${key}的值失败：`+e); // 输出解密失败的错误信息
                }
            } else if (typeof value === 'object') {
                // 递归地对子对象或数组进行解密
                json[key] = await decryptJsonValues(value, aesKeyBytes, ivBytes);
            }
        }
    }
    return json;
}


// 导出 API 函数
export const getGlobalSettings = (id) => instance.get(`/globalSettings/selectOne`, {params: {id}});
export const getMyComments = (userId) => instance.get(`/productComments/myComments`, {params: {userId}});
export const getProductById = (productId) => instance.get(`/product/selectById`, {params: {productId}});
export const deleteCommentById = (id) => instance.delete(`/productComments/delete`, {params: {id}});
export const addHistorys = (userId, productId) => instance.post(`/user/addHistory`, {}, {params: {userid: userId, productId}});
export const deleteAllCartItems = (ids) => instance.delete(`/cart/deleteAll`, {params: {id: ids.join(',') }});
export const deleteCartItem = (id) => instance.delete(`/cart/delete`, {params: {id}});
export const updateCart = (id, quantity) => instance.put(`/cart/update?id=${id}&quantity=${quantity}`);
export const cartList = (userId) => instance.get(`/cart/list`, {params: {userId}});
export const getUnpaidOrder = (userId) => instance.get(`/order/getUnpaidOrder`, {params: {userId}});
export const deleteUnpaidOrder = (orderLong, userId) => instance.delete(`/order/deleteUnpaidOrder`, {params: {orderLong, userId}});
export const confirmOrder = (orderLong, userId) => instance.post(`/order/confirmOrder`, {orderLong, userId});
export const getOrdersByUserId = (userId) => instance.post(`/order/getOrdersByUserId`, {userId});
export const updateOrderStatus = (orderId,state) => instance.put(`/order/updateOrderStatus`, {orderId, state});
export const receiveOrders = (orderId) => instance.post(`/order/receiveOrder`, {orderId});
export const getOrdersByUserIdAndState = (userId,state) => instance.post(`/order/getOrdersByUserIdAndState`, {userId,state});
export const deleteOrders = (id) => instance.delete(`/order/deleteOrder`, {params: {id}});
export const selectStar = (userId) => instance.get(`/star/select`, {params: {userId}});
export const deleteAllStars = (ids) => instance.delete(`/star/deleteAll`, {params: {id: ids.join(',') }});
export const getUser = (userId) => instance.get(`/user/all`, {params: {userId}});
export const getAddress = (userId) => instance.get(`/address/all`, {params: {userId}});
export const addAddres = (userId, consignee, area, fullAddress, phone) => instance.post(`/address/add`, null, {params: {userId, consignee, area, fullAddress, phone}});
export const updateAddress = (params) => instance.put(`/address/update`, null, {params});
export const deleteAddress = (id) => instance.delete(`/address/delete`, {params: {id}});
export const updateDefaultAddress = (id, defaultOperate) => instance.put(`/address/updateDefault`, null, {params: {id, defaultOperate}});
export const getAllProducts = (current, size, sortField, isAsc) => instance.get(`/product/all`, {params: {current, size, sortField, isAsc}});
export const getUserToken = (token) => instance.get(`/user/token`, {headers: {Authorization: `Bearer ${token}`}});
export const getOrder = (orderNumber) => instance.get(`/order/getOrder`, {params: {orderNumber}});
export const addToCarts = (userId, productId, quantity) => instance.post(`/cart/add`, null, {params: {userId, productId, quantity}});
export const addToFavorite = (userId, productId, quantity) => instance.post(`/star/staradd`, {userId, productId, quantity});
export const getHistoryByUserId = (userId) => instance.get(`/user/getHistoryByUserId`, {params: {userId}});
export const deleteHistorys = (userId, productId, date) => instance.delete(`/user/deleteHistory`, {params: {userId, productId, date}});
export const deleteAllHistory = (userId) => instance.delete(`/user/deleteAllHistory`, {params: {userId}});
export const log = (usernameOrPhone, pwd, expirationTimeOption) => instance.post(`/user/login`, { usernameOrPhone, pwd, expirationTimeOption}, { headers: { 'X-Needs-Decryption': 'true' } });
export const forgotPassword = (phoneNumber, newPassword, code) => instance.post(`/user/forgotPassword`, {phoneNumber, newPassword, code});
export const messageUser = (phoneNumber) => instance.post(`/user/message?phoneNumber=${phoneNumber}`);
export const registers = (phone, name, pwd, code) => instance.post(`/user/register`, {phone, name, pwd, code});
export const getAllProductsRandomly = (page, size, randomSeed) => instance.get(`/product/all`, {params: {current: page, size, randomSeed}});
export const addOrder = (vendorName, userId, address, price, productId, productNumber, consignee, phone, notes, payMethod) => instance.post(`/order/add`, {vendorName, userId, address, price, productId, productNumber, consignee, phone, notes, payMethod});
export const updateAvatar = (data) => instance.put(`/user/updateAvatar`, data);
export const updateUser = (userId, name, description, gender) => instance.put(`/user/updateUser`, null, {params: {userId, name, description, gender}});
export const changePassword = (userId, oldPassword, newPassword, confirmPassword) => instance.post(`/user/password`, {userId, oldPassword, newPassword, confirmPassword});
export const changePhones = (userId, oldPhone, code, phone) => instance.put(`/user/changePhone`, {userId, oldPhone, code, phone});
export const searchProduct = (keyword, page) => instance.get(`/product/search`, {params: {keyword, page}});
export const getVendorProduct = (name) => instance.get(`/product/vendor`, {params: {name}});
export const addComment = (userId, comments, productId, score, files) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('comments', comments.trim());
    formData.append('productId', productId);
    formData.append('score', score);
    files.forEach((file) => { formData.append(`imgId`, file, file.name); });
    return instance.post(`/productComments/add`, formData);
};
export const getProductCommentsByTime = (productId, pageNum, sortByTime, pageSize) => instance.get(`/product/comments`, {params: {productId, pageNum, sortByTime, pageSize}});
export const getProductComments = (productId, currentPage, pageSize) => instance.get(`/product/comments`, {params: {productId, pageNum: currentPage, pageSize}});
export const publicKey = () => instance.get(`/admin/publicKey`);
export const privateKey = (publicKey) => instance.post(`/admin/privateKey`, {publicKey});
