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
                if (config.data[key] instanceof File) {
                    // 保持文件数据不变
                    encryptedData[key] = config.data[key];
                } else {
                    encryptedData[key] = encryptData(config.data[key], aesKey);
                }
            }
            // 使用 RSA 公钥加密 AES 密钥
            const encryptedAESKey = encryptAESKey(aesKey, rsaPublicKey.data.data);
            // 更新请求数据
            config.data = {
                ...encryptedData,
                rsaPublicKey: rsaPublicKey.data.data,
                aesKey: encryptedAESKey
            };
            // console.log(config.data);
        }

        if (config.headers['X-Request-Type'] !== 'setNonce') {
            const timestamp = new Date().getTime();
            const nonce = Math.random().toString(36).slice(2, 17);

            // await setNonce(nonce); // 将nonce存入Redis，暂时放弃，fixme 频繁读写redis服务器压力过大，考虑使用其他方法应对重放攻击

            let paramsString = '';
            const secretKey = 'skfjnANJjmvkAFSVBNvn';

            function flattenObject(obj, parentKey = '', result = {}) {
                for (const [key, value] of Object.entries(obj)) {
                    const newKey = parentKey ? `${parentKey}.${key}` : key;
                    if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
                        flattenObject(value, newKey, result);
                    } else {
                        result[newKey] = value;
                    }
                }
                return result;
            }

            if (config.data instanceof FormData) {
                // console.log("进入formData格式")
                // console.log(config.data)
                // 处理FormData数据
                const formDataEntries = Array.from(config.data.entries())
                    .filter(([key, value]) => !(value instanceof File))// 排除文件类型参数
                    .filter(([key, value]) => value !== undefined) // 排除undefined值
                    .sort(([a], [b]) => a.localeCompare(b));// 确保参数排序
                paramsString = formDataEntries.map(([key, value]) => `${key}=${value}`).join('&');
            } else if (config.data) {
                // console.log("进入json格式")
                // console.log(config.data);
                // 处理JSON数据
                const flattenedData = flattenObject(config.data);
                const jsonEntries = Object.entries(flattenedData)
                    .filter(([key, value]) => value !== undefined) // 排除undefined值
                    .sort(([a], [b]) => a.localeCompare(b));
                paramsString = jsonEntries.map(([key, value]) => `${key}=${value}`).join('&');
            } else {
                // console.log("进入URL格式")
                // 处理URL参数
                const urlParams = new URLSearchParams(config.params || {});

                if (config.url.includes('?')) {
                    const urlQueryParams = new URLSearchParams(config.url.split('?')[1]);
                    for (const [key, value] of urlQueryParams.entries()) {
                        urlParams.append(key, value);
                    }
                }

                urlParams.sort(); // 确保参数排序

                for (const [key, value] of urlParams.entries()) {
                    if (value !== undefined) {
                        paramsString += `${key}=${value}&`;
                    }
                }

                if (paramsString.length > 0) {
                    paramsString = paramsString.slice(0, -1);
                }
            }

            // console.log(`请求参数: ${paramsString}`); // 打印请求参数

            const signString = `${paramsString}&timestamp=${timestamp}&nonce=${nonce}&secret=${secretKey}`;
            config.headers['x-sign'] = CryptoJS.SHA256(signString).toString(CryptoJS.enc.Hex); // 使用CryptoJS生成签名
            config.headers['x-timestamp'] = timestamp;
            config.headers['x-nonce'] = nonce;
        }

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);


// 响应拦截器
instance.interceptors.response.use(
    async response => {
        // 如果请求头中包含 `X-Skip-Verification`，则跳过验证逻辑
        if (response.config.headers['X-Skip-Verification'] === 'true') {
            return response;
        }

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

        return decryptResponseData(response);
    },
    error => {
        console.log('err' + error); // for debug
        return Promise.reject(error);
    }
);

// 解密响应数据的逻辑提取为一个独立函数
const decryptResponseData = async (response) => {
    if (response.headers['x-encrypted'] === 'true') {
        // 获取Base64编码后的AES密钥和IV
        const encryptedAesKey = response.data.data.aesKey;
        const encryptedIv = response.data.data.iv;
        const encryptedData = response.data.data

        // 移除加密数据中的AES密钥和IV
        delete encryptedData.aesKey;
        delete encryptedData.iv;

        // 将Base64编码的AES密钥和IV解码为字节数组
        const aesKeyBytes = CryptoJS.enc.Base64.parse(encryptedAesKey);
        const ivBytes = CryptoJS.enc.Base64.parse(encryptedIv);

        // 遍历响应数据，对每个值进行解密
        try {
            // 将解密后的数据重新赋值给 response.data
            response.data.data = await decryptJsonValues(encryptedData, aesKeyBytes, ivBytes);
        } catch (e) {
            console.log('解密失败：' + e); // 输出解密失败的错误信息
        }
    }
    return response;
};

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
/*glks********************************************* 网站相关api开始  **********************************************/
// 网站相关组件和权限的设置
export const getGlobalSettings = (name) => instance.get(`/globalSettings/selectOne`, {params: {name},headers: {'X-Skip-Verification': 'true'}});

// 获取公钥
export const publicKey = () => instance.get(`/admin/publicKey`);

// 获取私钥
export const privateKey = (publicKey) => instance.post(`/admin/privateKey`, {publicKey});

// 存入随机数
export const setNonce = (nonce) => instance.post('/admin/setNonce', {nonce}, {headers: {'X-Request-Type': 'setNonce'}});
/*gljs********************************************* 网站相关api结束 **********************************************/





/*glks********************************************* 用户相关api开始 **********************************************/

// 增加历史记录
export const addHistorys = (userid, productId) => instance.post(`/user/addHistory`, {}, {
    params: {
        userid,
        productId
    }
});

// 注册
export const registers = (phone, name, pwd, code) => instance.post(`/user/register?phone=${phone}&name=${name}&pwd=${pwd}&code=${code}`);

// 登录
export const log = (usernameOrPhone, pwd, expirationTimeOption) => instance.post(`/user/login`, {
    usernameOrPhone,
    pwd,
    expirationTimeOption
}, {headers: {'X-Needs-Decryption': 'true'}});

// 更新个人信息
export const updateUser = (userId, name, description, gender) => instance.put(`/user/updateUser`, null, {
    params: {
        userId,
        name,
        description,
        gender
    }
});

// 忘记密码
export const forgotPassword = (phoneNumber, newPassword, code) => instance.post(`/user/forgotPassword`, {
    phoneNumber,
    newPassword,
    code
});

// 修改手机号
export const changePhones = (userid, oldPhone, code, phone) => instance.put(`/user/changePhone`, {userid, oldPhone, code, phone});

// 获取历史记录
export const getHistoryByUserId = (userId) => instance.get(`/user/getHistoryByUserId`, {params: {userId}});

// 删除历史记录
export const deleteHistorys = (userid, productId, date) => instance.delete(`/user/deleteHistory`, {
    params: {
        userid,
        productId,
        date
    }
});

// 删除所有历史记录
export const deleteAllHistory = (userid) => instance.delete(`/user/deleteAllHistory`, {params: {userid}});

// 通过手机号发送短信验证码
export const messageUser = (phoneNumber) => instance.post(`/user/message?phoneNumber=${phoneNumber}`);

// 通过token获取用户信息
export const getUserToken = (tokenValue) => instance.post(`/user/getLoginIdByToken`, {tokenValue},{headers: {'X-Needs-Decryption': 'true'}});


// 根据用户id查询收藏
export const selectStar = (userId) => instance.get(`/star/select`, {params: {userId}});

// 删除单个或多个收藏
export const deleteAllStars = (ids) => instance.delete(`/star/deleteAll`, {params: {id: ids.join(',')}});

// 根据id获取用户信息 fixme 同样的加入权限防止其他人获取到该用户信息
export const getUser = (userId) => instance.get(`/user/all`, {params: {userId}});

// 获取收货地址
export const getAddress = (userId) => instance.get(`/address/all`, {params: {userId}});

// 新增收货地址
export const addAddres = (userId, consignee, area, fullAddress, phone) => instance.post(`/address/add`,{
    userId,
    consignee,
    area,
    fullAddress,
    phone
});

// 修改收货地址
export const updateAddress = (params) => instance.put(`/address/update`,params);

// 删除收货地址
export const deleteAddress = (id) => instance.delete(`/address/delete`, {params: {id}});

// 修改默认收货地址
export const updateDefaultAddress = (id, defaultOperate) => instance.put(`/address/updateDefault`, null, {
    params: {
        id,
        defaultOperate
    }
});

// 添加收藏
export const addToFavorite = (userId, productId, quantity) => instance.post(`/star/staradd`, {
    userId,
    productId,
    quantity
});

// 更新头像
export const updateAvatar = (data) => instance.put(`/user/updateAvatar`, data,{headers: {
        'Content-Type': 'multipart/form-data'
    }});

// 修改密码
export const changePassword = (userId, oldPassword, newPassword, confirmPassword) => instance.post(`/user/password`, null,{params: {userId, oldPassword, newPassword, confirmPassword}});

// 搜索
export const searchProduct = (keyword, page) => instance.get(`/product/search`, {params: {keyword, page}});

/*gljs********************************************* 用户相关api结束 **********************************************/





/*glks********************************************* 订单相关api开始 **********************************************/

// 新增订单
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

// 获取未付款订单
export const getUnpaidOrder = (userId) => instance.get(`/order/getUnpaidOrder`, {params: {userId}});

// 删除未付款订单
export const deleteUnpaidOrder = (orderLong, userId) => instance.delete(`/order/deleteUnpaidOrder`, {
    params: {
        orderLong,
        userId
    }
});

// 删除订单
export const deleteOrders = (id) => instance.delete(`/order/deleteOrder`, {params: {id}});

// 确认支付订单
export const confirmOrder = (orderLong, userId) => instance.post(`/order/confirmOrder`, {orderLong, userId});

// 通过用户id获取所有订单
export const getOrdersByUserId = (userId) => instance.post(`/order/getOrdersByUserId`, {userId});

// 更新订单状态
export const updateOrderStatus = (orderId, state) => instance.put(`/order/updateOrderStatus`, {orderId, state});

// 确认收货
export const receiveOrders = (orderId) => instance.post(`/order/receiveOrder`, {orderId});

// 按用户 ID 和订单状态获取订单
export const getOrdersByUserIdAndState = (userId, state) => instance.post(`/order/getOrdersByUserIdAndState`, {
    userId,
    state
});

// 通过订单号获取订单
export const getOrder = (orderNumber) => instance.get(`/order/getOrder`, {params: {orderNumber}});

/*gljs********************************************* 订单相关api结束 **********************************************/





/*glks********************************************* 购物车相关api开始 **********************************************/

// 获取购物车内容
export const cartList = (userId) => instance.get(`/cart/list`, {params: {userId}});

// 删除购物车单个或多个商品
export const deleteAllCartItems = (ids) => instance.delete(`/cart/deleteAll`, {params: {id: ids.join(',')}});

// 更新购物车数量
export const updateCart = (id, quantity) => instance.put(`/cart/update?id=${id}&quantity=${quantity}`);

// 购物车添加商品
export const addToCarts = (userId, productId, quantity) => instance.post(`/cart/add`, null, {
    params: {
        userId,
        productId,
        quantity
    }
});

/*gljs********************************************* 购物车相关api结束 **********************************************/





/*glks********************************************* 评论相关api开始 **********************************************/

// 根据id删除评论 fixme 此接口应该进行权限校验防止用户评论被其他人删除
export const deleteCommentById = (id) => instance.delete(`/productComments/delete`, {params: {id}});

// 获取用户评论
export const getMyComments = (userId) => instance.get(`/productComments/myComments`, {params: {userId}});

/*gljs********************************************* 评论相关api结束 **********************************************/





/*glks********************************************* 商品相关api开始 **********************************************/

// 获取banner的前5个商品
export const getAllProducts = (current, size, sortField, isAsc) => instance.get(`/product/all`, {
    params: {
        current,
        size,
        sortField,
        isAsc
    }
});

// 根据商品id获取商品信息
export const getProductById = (productId) => instance.get(`/product/selectById`, {params: {productId}});

// 随机获取所有商品
export const getAllProductsRandomly = (page, size, randomSeed) => instance.get(`/product/all`, {
    params: {
        current: page,
        size,
        randomSeed
    }
});

// 获取商品的商家
export const getVendorProduct = (name) => instance.get(`/product/vendor`, {params: {name}});

// 添加评论
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

// 按时间获取商品评论
export const getProductCommentsByTime = (productId, pageNum, sortByTime, pageSize, sortByLikes) => instance.get(`/product/comments`, {
    params: {
        productId,
        pageNum,
        sortByTime,
        pageSize,
        sortByLikes
    }
});

// 获取商品评论
export const getProductComments = (productId, currentPage, pageSize) => instance.get(`/product/comments`, {
    params: {
        productId,
        pageNum: currentPage,
        pageSize
    }
});

// 获取评论点赞
export const likes = (newLikes) => instance.post(`/likes/likes`, newLikes);

// 获取用户赞过的评论
export const getUserLikes = (userId) => instance.get(`/likes/userLikes`, {params: {userId: userId}});
/*gljs********************************************* 商品相关api结束 **********************************************/
