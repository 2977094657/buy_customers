import axios from 'axios';

// 你的服务器地址
const BASE_URL = 'http://124.221.7.201:8081';

// 创建一个 axios 实例
const instance = axios.create({
    baseURL: BASE_URL
});

// 导出你的 API 函数
export const getMyComments = (userId) => instance.get(`/productComments/myComments`, {params: {userId}});
export const getProductById = (productId) => instance.get(`/product/selectById`, {params: {productId}});
// const productResponse = await getProductById(productId);
export const deleteCommentById = (id) => instance.delete(`/productComments/delete`, {params: {id}});
// const response = await deleteCommentById(id);
export const addHistorys = (userId, productId) => instance.post(`/user/addHistory`, {}, {params: {userid: userId, productId}});
// const response = await addHistorys(userid.value, productId);
export const deleteAllCartItems = (ids) => instance.delete(`/cart/deleteAll`, {params: {id: ids.join(',') }});
export const deleteCartItem = (id) => instance.delete(`/cart/delete`, {params: {id}});
export const updateCart = (id, quantity) => instance.put(`/cart/update`, {params: {id, quantity}});
export const cartList = (userId) => instance.get(`/cart/list`, {params: {userId}});
export const getUnpaidOrder = (userId) => instance.get(`/order/getUnpaidOrder`, {params: {userId}});
// const response = await getUnpaidOrder(userid.value);
export const deleteUnpaidOrder = (orderLong, userId) => instance.delete(`/order/deleteUnpaidOrder`, {params: {orderLong, userId}});
// const response = await deleteUnpaidOrder(orderLong, userid.value);
export const confirmOrder = (orderLong, userId) => instance.post(`/order/confirmOrder`, {orderLong, userId});
// const response = await confirmOrder(orderLong, userid.value);
export const getOrdersByUserId = (userId) => instance.post(`/order/getOrdersByUserId`, {userId});
export const deleteOrders = (id) => instance.delete(`/order/deleteOrder`, {params: {id}});
export const selectStar = (userId) => instance.get(`/star/select`, {params: {userId}});
// const response = await selectStar(userid.value);
export const deleteAllStars = (ids) => instance.delete(`/star/deleteAll`, {params: {id: ids.join(',') }});
// const response = await deleteAllStars(selectedIds);
export const getUser = (userId) => instance.get(`/user/all`, {params: {userId}});
// const response = await getUser(userId);
export const getAddress = (userId) => instance.get(`/address/all`, {params: {userId}});
// const response = await getAddress(userId);
export const addAddres = (userId, consignee, area, fullAddress, phone) => instance.post(`/address/add`, null, {params: {userId, consignee, area, fullAddress, phone}});
export const updateAddress = (params) => instance.put(`/address/update`, null, {params});
// const response = await updateAddress(params);
export const deleteAddress = (id) => instance.delete(`/address/delete`, {params: {id}});
// const response = await deleteAddress(id);
export const updateDefaultAddress = (id, defaultOperate) => instance.put(`/address/updateDefault`, null, {params: {id, defaultOperate}});
// await updateDefaultAddress(currentDefault.id, 0);
export const getAllProducts = (current, size, sortField, isAsc) => instance.get(`/product/all`, {params: {current, size, sortField, isAsc}});
// const response = await getAllProducts(currentPage.value, 5, 'score', false);
export const getUserToken = (token) => instance.get(`/user/token`, {headers: {Authorization: `Bearer ${token}`}});
// const response = await getUserToken(token);
export const getOrder = (orderNumber) => instance.get(`/order/getOrder`, {params: {orderNumber}});
export const addToCarts = (userId, productId, quantity) => instance.post(`/cart/add`, null, {params: {userId, productId, quantity}});
export const addToFavorite = (userId, productId, quantity) => instance.post(`/star/staradd`, {userId, productId, quantity});
export const getHistoryByUserId = (userId) => instance.get(`/user/getHistoryByUserId`, {params: {userId}});
export const deleteHistorys = (userId, productId, date) => instance.delete(`/user/deleteHistory`, {params: {userId, productId, date}});
export const deleteAllHistory = (userId) => instance.delete(`/user/deleteAllHistory`, {params: {userId}});
export const log = (phone, pwd, expirationTimeOption) => instance.post(`/user/login`, {phone, pwd, expirationTimeOption});
export const messageUser = (phoneNumber) => instance.post(`/user/message`, {phoneNumber});
export const registers = (phone, name, pwd, code) => instance.post(`/user/register`, {phone, name, pwd, code});
export const getAllProductsRandomly = (page, size, randomSeed) => instance.get(`/product/all`, {params: {current: page, size, randomSeed}});
export const addOrder = (vendorName, userId, address, price, productId, productNumber, consignee, phone, notes, payMethod) => instance.post(`/order/add`, {vendorName, userId, address, price, productId, productNumber, consignee, phone, notes, payMethod});
export const updateAvatar = (data) => instance.put(`/user/updateAvatar`, data);
export const updateUser = (userId, name, description, gender) => instance.put(`/user/updateUser`, null, {params: {userId, name, description, gender}});
export const changePassword = (userId, oldPassword, newPassword, confirmPassword) => instance.post(`/user/password`, {userId, oldPassword, newPassword, confirmPassword});
export const changePhones = (userId, oldPhone, code, phone) => instance.put(`/user/changePhone`, {userId, oldPhone, code, phone});
export const searchProduct = (keyword, page) => instance.get(`/product/search`, {params: {keyword, page}});
export const getVendorProduct = (name) => instance.get(`/product/vendor`, {params: {name}});
export const addComment = (userId, comments, productId, files) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('comments', comments.trim());
    formData.append('productId', productId);
    files.forEach((file) => { formData.append(`imgId`, file, file.name); });
    return instance.post(`/productComments/add`, formData);
};
export const getProductCommentsByTime = (productId, pageNum, sortByTime, pageSize) => instance.get(`/product/comments`, {params: {productId, pageNum, sortByTime, pageSize}});
export const getProductComments = (productId, currentPage, pageSize) => instance.get(`/product/comments`, {params: {productId, pageNum: currentPage, pageSize}});
