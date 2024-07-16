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
            const aesKey = generateRandomAESKey(); // 生成随机的 AES 密钥
            const encryptedData = {};

            for (const key in config.data) {
                encryptedData[key] = encryptData(config.data[key], aesKey); // 使用 AES 密钥加密数据
            }

            const encryptedAESKey = encryptAESKey(aesKey, rsaPublicKey.data.data.publicKey); // 使用 RSA 公钥加密 AES 密钥

            // 更新请求数据
            config.data = {
                ...encryptedData,
                rsaPublicKey: rsaPublicKey.data.data.publicKey,
                aesKey: encryptedAESKey
            };
        }

        if (config.headers['X-Request-Type'] !== 'setNonce') {
            const timestamp = new Date().getTime(); // 获取当前时间戳
            const nonce = Math.random().toString(36).slice(2, 17); // 生成随机字符串

            await setNonce(nonce); // 将 nonce 存入 Redis

            let paramsString = '';
            const urlParams = new URLSearchParams(config.params || {});

            if (config.url.includes('?')) {
                const urlQueryParams = new URLSearchParams(config.url.split('?')[1]);
                for (const [key, value] of urlQueryParams.entries()) {
                    urlParams.append(key, value);
                }
            }

            urlParams.sort(); // 确保参数排序

            for (const [key, value] of urlParams.entries()) {
                paramsString += `${key}=${value}&`;
            }

            paramsString = paramsString.slice(0, -1);
            // console.log(`请求参数: ${paramsString}`); // 打印请求参数

            const secretKey = 'skfjnANJjmvkAFSVBNvn';
            const signString = `${paramsString}&timestamp=${timestamp}&nonce=${nonce}&secret=${secretKey}`;
            config.headers['x-sign'] = CryptoJS.SHA256(signString).toString(CryptoJS.enc.Hex); // 使用 CryptoJS 生成签名
            config.headers['x-timestamp'] = timestamp;
            config.headers['x-nonce'] = nonce;
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
        // 检查请求头是否为 setNonce 请求
        const requestTypeHeader = response.config.headers['X-Request-Type'];
        if (requestTypeHeader && requestTypeHeader === 'setNonce') {
            return response; // 直接放行
        }

        // 验证响应数据签名
        const responseData = JSON.stringify(response.data);
        const responseSign = response.headers['x-response-sign'];

        if (!verifyResponseSign(responseData, responseSign)) {
            console.log('响应数据被篡改');
            // 你可以在这里抛出一个错误或者根据你的需求进行其他处理
            return Promise.reject(new Error('响应数据被篡改'));
        }

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

function verifyResponseSign(responseData, responseSign) {
    const hash = CryptoJS.SHA256(responseData);
    const calculatedSign = hash.toString(CryptoJS.enc.Hex);

    // 记录调试信息
    // console.log("前端响应数据:", responseData);
    // console.log("前端计算签名:", calculatedSign);
    // console.log("后端提供签名:", responseSign);

    return calculatedSign === responseSign;
}

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
                    // 将解密后的数据转换为UTF-8字符串
                    let decryptedString = CryptoJS.enc.Utf8.stringify(decryptedValue);

                    // 尝试将解密后的字符串转换为一个数字
                    let maybeNumber = Number(decryptedString);
                    if (!isNaN(maybeNumber)) {
                        // 如果解密后的字符串可以被解析为一个数字，那么就使用这个数字
                        json[key] = maybeNumber;
                    } else {
                        // 否则，就使用解密后的字符串
                        json[key] = decryptedString;
                    }
                } catch (e) {
                    console.log(`解密键${key}的值失败：` + e); // 输出解密失败的错误信息
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
export const addHistorys = (userId, productId) => instance.post(`/user/addHistory`, {}, {
    params: {
        userid: userId,
        productId
    }
});
export const deleteAllCartItems = (ids) => instance.delete(`/cart/deleteAll`, {params: {id: ids.join(',')}});
export const deleteCartItem = (id) => instance.delete(`/cart/delete`, {params: {id}});
export const updateCart = (id, quantity) => instance.put(`/cart/update?id=${id}&quantity=${quantity}`);
export const messageUser = (phoneNumber) => instance.post(`/user/message?phoneNumber=${phoneNumber}`);
export const registers = (phone, name, pwd, code) => instance.post(`/user/register?phone=${phone}&name=${name}&pwd=${pwd}&code=${code}`);
export const cartList = (userId) => instance.get(`/cart/list`, {params: {userId}});
export const getUnpaidOrder = (userId) => instance.get(`/order/getUnpaidOrder`, {params: {userId}});
export const deleteUnpaidOrder = (orderLong, userId) => instance.delete(`/order/deleteUnpaidOrder`, {
    params: {
        orderLong,
        userId
    }
});
export const confirmOrder = (orderLong, userId) => instance.post(`/order/confirmOrder`, {orderLong, userId});
export const getOrdersByUserId = (userId) => instance.post(`/order/getOrdersByUserId`, {userId});
export const updateOrderStatus = (orderId, state) => instance.put(`/order/updateOrderStatus`, {orderId, state});
export const receiveOrders = (orderId) => instance.post(`/order/receiveOrder`, {orderId});
export const getOrdersByUserIdAndState = (userId, state) => instance.post(`/order/getOrdersByUserIdAndState`, {
    userId,
    state
});
export const deleteOrders = (id) => instance.delete(`/order/deleteOrder`, {params: {id}});
export const selectStar = (userId) => instance.get(`/star/select`, {params: {userId}});
export const deleteAllStars = (ids) => instance.delete(`/star/deleteAll`, {params: {id: ids.join(',')}});
export const getUser = (userId) => instance.get(`/user/all`, {params: {userId}});
export const getAddress = (userId) => instance.get(`/address/all`, {params: {userId}});
export const addAddres = (userId, consignee, area, fullAddress, phone) => instance.post(`/address/add`, null, {
    params: {
        userId,
        consignee,
        area,
        fullAddress,
        phone
    }
});
export const updateAddress = (params) => instance.put(`/address/update`, null, {params});
export const deleteAddress = (id) => instance.delete(`/address/delete`, {params: {id}});
export const updateDefaultAddress = (id, defaultOperate) => instance.put(`/address/updateDefault`, null, {
    params: {
        id,
        defaultOperate
    }
});
export const getAllProducts = (current, size, sortField, isAsc) => instance.get(`/product/all`, {
    params: {
        current,
        size,
        sortField,
        isAsc
    }
});
export const getUserToken = (tokenValue) => instance.post(`/user/getLoginIdByToken`, {tokenValue});
export const getOrder = (orderNumber) => instance.get(`/order/getOrder`, {params: {orderNumber}});
export const addToCarts = (userId, productId, quantity) => instance.post(`/cart/add`, null, {
    params: {
        userId,
        productId,
        quantity
    }
});
export const addToFavorite = (userId, productId, quantity) => instance.post(`/star/staradd`, {
    userId,
    productId,
    quantity
});
export const getHistoryByUserId = (userId) => instance.get(`/user/getHistoryByUserId`, {params: {userId}});
export const deleteHistorys = (userid, productId, date) => instance.delete(`/user/deleteHistory`, {
    params: {
        userid,
        productId,
        date
    }
});
export const deleteAllHistory = (userId) => instance.delete(`/user/deleteAllHistory`, {params: {userId}});
export const log = (usernameOrPhone, pwd, expirationTimeOption) => instance.post(`/user/login`, {
    usernameOrPhone,
    pwd,
    expirationTimeOption
}, {headers: {'X-Needs-Decryption': 'true'}});
export const forgotPassword = (phoneNumber, newPassword, code) => instance.post(`/user/forgotPassword`, {
    phoneNumber,
    newPassword,
    code
});

export const getAllProductsRandomly = (page, size, randomSeed) => instance.get(`/product/all`, {
    params: {
        current: page,
        size,
        randomSeed
    }
});
export const addOrder = (vendorName, userId, address, price, productId, productNumber, consignee, phone, notes, payMethod) => instance.post(`/order/add`, {
    vendorName,
    userId,
    address,
    price,
    productId,
    productNumber,
    consignee,
    phone,
    notes,
    payMethod
});
export const updateAvatar = (data) => instance.put(`/user/updateAvatar`, data);
export const updateUser = (userId, name, description, gender) => instance.put(`/user/updateUser`, null, {
    params: {
        userId,
        name,
        description,
        gender
    }
});
export const changePassword = (userId, oldPassword, newPassword, confirmPassword) => instance.post(`/user/password`, {
    userId,
    oldPassword,
    newPassword,
    confirmPassword
});
export const changePhones = (userId, oldPhone, code, phone) => instance.put(`/user/changePhone`, {
    userId,
    oldPhone,
    code,
    phone
});
export const searchProduct = (keyword, page) => instance.get(`/product/search`, {params: {keyword, page}});
export const getVendorProduct = (name) => instance.get(`/product/vendor`, {params: {name}});
export const addComment = (userId, comments, productId, score, ip, files) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('comments', comments.trim());
    formData.append('productId', productId);
    formData.append('score', score);
    formData.append('ip', ip)
    files.forEach((file) => {
        formData.append(`imgId`, file, file.name);
    });
    return instance.post(`/productComments/add`, formData);
};
export const getProductCommentsByTime = (productId, pageNum, sortByTime, pageSize, sortByLikes) => instance.get(`/product/comments`, {
    params: {
        productId,
        pageNum,
        sortByTime,
        pageSize,
        sortByLikes
    }
});
export const getProductComments = (productId, currentPage, pageSize) => instance.get(`/product/comments`, {
    params: {
        productId,
        pageNum: currentPage,
        pageSize
    }
});
export const publicKey = () => instance.get(`/admin/publicKey`);
export const privateKey = (publicKey) => instance.post(`/admin/privateKey`, {publicKey});
export const likes = (newLikes) => instance.post(`/likes/likes`, newLikes);
export const getUserLikes = (userId) => instance.get(`/likes/userLikes`, {params: {userId: userId}});
export const setNonce = (nonce) => instance.post('/admin/setNonce', {nonce}, {headers: {'X-Request-Type': 'setNonce'}});
