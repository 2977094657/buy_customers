<template>
  <h3>确认收货地址</h3>
  <div style="margin: 0 50px 0 0">
    <Address></Address>
  </div>
  <h3>确认订单信息</h3>
  <div class="db1">
    <div style="margin: 0 0 0 70px">
      <b>店铺信息</b>
    </div>
    <div style="margin: 0 0 0 170px">
      <b>商品信息</b>
    </div>
    <div style="margin: 0 0 0 290px">
      <b>单价</b>
    </div>
    <div style="margin: 0 0 0 150px">
      <b>数量</b>
    </div>
    <div style="margin: 0 0 0 170px">
      <b>总价</b>
    </div>
  </div>

  <el-divider style="margin: 20px 0 0 -25px;border-top: 3px solid #c9c2c2;" />

  <div v-if="product && product.imgs" class="dj" @click="goToVendor(product.name)">
    <svg style="margin: 10px 20px 0 0;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-shop-window" viewBox="0 0 16 16">
      <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5z"/>
    </svg>
    <p class="vendor"><b>{{product.name}}</b></p>
    <el-icon style="margin: 19px 0 0 0"><Right /></el-icon>
  </div>

    <div v-if="product && product.imgs" class="cart1" @click="goToProduct(product.productId);addHistory(product.productId)">
      <img style="margin: 0 0 0 30px;width: 100px;height: 100px;" :src="product.img.slice(1, -1).split(',')[0]" alt="Product image" />
      <div class="productName1">
        {{ product.productName }}
      </div>
      <div class="price1">
        ￥{{ product.price }}
      </div>
      <div class="number1">
        <el-input-number @click.stop class="number1" v-model="productNumber" :min="1" :max="100" />
      </div>
      <div class="total1">
        ￥{{ productNumber * product.price }}
      </div>
    </div>

  <el-divider style="margin: 20px 0 0 -25px;border-top: 1px dashed #c9c2c2;" />

  <div class="summary">
    <div>
      <div>
        给卖家留言：
      </div>
      <el-input resize="none" style="width: 500px;margin: -20px 0 0 100px" size="large" v-model="text" maxlength="200" placeholder="选填，请先和商家协商一致，付款后商家可见" show-word-limit type="textarea"/>
    </div>
    <div style="margin: -53px 0 0 700px">
        店铺优惠：
        <el-select v-model="select" placeholder="暂无优惠" size="default">
        <el-option label="暂无优惠" value="暂无优惠"/>
          <el-option label="不使用优惠券" value="不使用优惠券"/>
        </el-select>
      <span style="margin: 0 0 0 40px" class="total2">-￥0.00</span>
      <hr style="border: 1px solid white;margin-top: 20px">
      <div style="margin: 20px 0 0 0">
        运送方式：普通配送 快递 免邮
        <span style="margin: 0 0 0 129px" class="total2">￥0.00</span>
      </div>
    </div>
  </div>

  <el-divider style="margin: 50px 0 50px -25px;" />


  <div class="wc">
    <div v-if="selectedAddress" class="js">
      <div style="margin-bottom: 10px">
        <span class="size">实付款：</span>
        <span v-if="product" class="total2" style="font: 700 26px tahoma;">
        ￥{{ productNumber * product.price }}
      </span>
      </div>
      <div>
        <span class="size">寄送至：</span>
        <span style="color: #333;font: 16px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53';">
    {{ selectedAddress.address }}&nbsp&nbsp&nbsp&nbsp&nbsp{{ selectedAddress.fullAddress }}
    </span>
      </div>
      <div>
        <span class="size">收货人：</span>
        <span style="color: #333;font: 16px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53';">
    {{ selectedAddress.consignee }}&nbsp&nbsp&nbsp&nbsp&nbsp{{ selectedAddress.phoneNumber }}
    </span>
      </div>
    </div>
  </div>

  <el-button @click="showMessage('功能开发中')" type="danger" style="width: 180px;height: 40px;margin: 0 0 100px 924px;border-radius: 0;background-color: rgb(255, 0, 54)">确认付款</el-button>

</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import store from "@/store";
import router from "@/router/router";
import axios from "axios";
import {Right} from "@element-plus/icons-vue";
import Address from "@/components/OrdersAddress.vue";

const route = useRoute()
const product = ref()
const httpError = ref(false)
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const childRef = ref();
const productNumber = ref(1)
const select = ref()
const text = ref()
let selectedAddress = ref(null);

onMounted(() => {
  // 监听事件并接收数据
  window.addEventListener('selected-address-changed', (event) => {
    selectedAddress.value = event.detail;
  });
});

const star = async () => {
  if (!isNaN(route.params.productId)) {
    try {
      const response = await fetch(`http://1.14.126.98:8081/product/selectById?productId=${route.params.productId}`);
      const data = await response.json();
      data.imgs = data.img.slice(1, -1).split(',');
      product.value = data;
    } catch (error) {
      if (error.message.startsWith('HTTP error 404')) { // 如果是 404 错误，设置 httpError 为 true
        childRef.value.switchShow()
        httpError.value = true;
      }
    }
  } else {
    httpError.value = true;
    childRef.value.switchShow()
  }
}

onMounted(async () => {
  await star()
})

const goToVendor = (name) => {
  const url = router.resolve({ name: 'vendor', params: { name } }).href;
  window.open(url, '_blank');
}

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}

const addHistory = async (productId) => {
  if(land.value){
    try {
      const response = await axios.post('http://1.14.126.98:8081/user/addHistory', {}, {
        params: {
          userid: userid.value,
          productId
        }
      });

      if (response.data.code === 200) {
        console.log('History added successfully');
      } else {
        console.log('Failed to add history');
      }
    } catch (error) {
      console.error(error);
    }
  }
};

let currentMessageInstance = null
const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}

</script>

<style scoped>
@import '../assets/ShoppingCart.css';
@import '../assets/Orders.css';
</style>
