<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import store from "@/store";
import router from "@/router/router";
import { debounce } from 'lodash'


const cartItems = ref([])
const productResponses = ref([])
const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
const empty = ref(false)

const loadCartItems = async () => {
  if (land.value){
    try {
      const response = await axios.get('http://1.14.126.98:8081/cart/list', {
        params: {
          userId: userid.value
        }
      })
      cartItems.value = response.data
      if (cartItems.value.length===0){
        empty.value=true
      }
      const productRequests = cartItems.value.map(item =>
          axios.get('http://1.14.126.98:8081/product/selectById', {
            params: {
              productId: item.productId
            }
          })
      )

      productResponses.value = await Promise.all(productRequests)

    } catch (error) {
    }
  }else {
    empty.value=true
  }
}

onMounted(loadCartItems)

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
ref(1);

let currentMessageInstance = null
const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}

const showSuccessMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例，消息类型设置为 'success'
  currentMessageInstance = ElMessage({message, type: 'success'})
}

const goToProduct = (productId) => {
  const url = router.resolve({ name: 'Product', params: { productId } }).href;
  window.open(url, '_blank');
}

const totalCount = computed(() => {
  return cartItems.value.length
})

const updateQuantity = debounce(async (id, quantity) => {
  try {
    const response = await axios.put(`http://1.14.126.98:8081/cart/update?id=${id}&quantity=${quantity}`)
    showSuccessMessage(response.data.message)
    if (response.data.message==='超出购物车最大限制，请将所有商品数量控制在50以内'){
      showMessage(response.data.message)
    }
  } catch (error) {
    showMessage('更新购物车失败')
  }
}, 500)

const handleChange = (value, id) => {
  updateQuantity(id, value)
}

const removeCartItem = async (id) => {
  try {
    await axios.delete(`http://1.14.126.98:8081/cart/delete`, {
      params: {
        id: id
      }
    });
    showSuccessMessage('删除成功');
    await loadCartItems();
  } catch (error) {
    showMessage('删除购物车失败');
  }
}

const open = (id) => {
  ElMessageBox.confirm(
      '确认要删除该宝贝吗?',
      '删除宝贝',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeCartItem(id);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const open1 = () => {
  ElMessageBox.confirm(
      '确认要删除该宝贝吗?',
      '删除宝贝',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeSelectedItems()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const selectAll = ref(false)
const handleSelectAllChange = () => {
  for (const item of cartItems.value) {
    item.checked = selectAll.value
  }
}

const removeSelectedItems = async () => {
  const selectedIds = cartItems.value
      .filter(item => item.checked)
      .map(item => item.id)

  console.log(selectedIds.length)
  if (selectedIds.length === 0) {
    showMessage('请至少选择一个商品')
    return
  }

  try {
    const response = await axios.delete('http://1.14.126.98:8081/cart/deleteAll', {
      params: {
        id: selectedIds.join(',')
      }
    })

    showSuccessMessage(response.data.message)
    await loadCartItems()
  } catch (error) {
    showMessage('批量删除购物车商品失败')
  }
}

const totalPrice = computed(() => {
  let sum = 0
  for (const item of cartItems.value) {
    if (item.checked) {
      const productIndex = cartItems.value.findIndex(product => product.id === item.id)
      sum += item.number * productResponses.value[productIndex].data.price
    }
  }
  return sum
})

const addHistory = async (productId) => {
  if(land){
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
</script>

<template>
  <div>
    <div class="zj">
      <h1>{{ totalCount }}</h1>
    </div>
    <div class="db">
      <div style="position:absolute;left: 30px;background-color: white">
        <input style="width: 20px;height: 20px;" type="checkbox" v-model="selectAll" @change="handleSelectAllChange">
        <label for="selectAll"><b style="position:absolute;width: 32px;margin: 2px 0 0 0">全选</b></label>
      </div>
      <div style="margin: -60px 0 20px 215px;">
        <b>商品信息</b>
      </div>
      <div style="margin: -42px 0 20px 357px;">
        <b>单价</b>
      </div>
      <div style="margin: -41px 0 20px 475px;">
        <b>数量</b>
      </div>
      <div style="margin: -42px 0 20px 590px;">
        <b>总价</b>
      </div>
      <div  class="cz">
        <b>操作</b>
      </div>
    </div>
    <div v-for="(item, index) in cartItems" :key="item.id">
      <div class="cart" @click="goToProduct(item.productId);addHistory(item.productId)" :class="{ 'selected': item.checked }">
        <input style="width: 20px;height: 20px;" type="checkbox" v-model="item.checked" @click.stop>
        <img style="margin: 0 0 0 30px;width: 100px;height: 100px;" :src="productResponses[index].data.img.slice(1, -1).split(',')[0]" alt="Product image" />
        <div class="productName">
          {{ productResponses[index].data.productName }}
        </div>
        <div class="description">
          {{ productResponses[index].data.description }}
        </div>
        <div class="price">
          ￥{{ productResponses[index].data.price }}
        </div>
        <div class="number">
          <el-input-number @click.stop class="number1" v-model="item.number" :min="1" :max="50" @change="(val) => handleChange(val, item.id)" />
        </div>
        <div class="time">
          {{ formatDate(item.time) }}
        </div>
        <div class="total">
          ￥{{ item.number * productResponses[index].data.price }}
        </div>
        <div class="delete">
          <el-button
              style="background-color: #ff2020;border: none;border-radius: 5px;color: white;padding: 10px"
              @click.stop text
              @click="open(item.id)"
          >
            删除
          </el-button>
        </div>
      </div>
      <br>
      <div class="delete1">
        <el-button style="background-color: #ff2020;border: none;border-radius: 5px;color: white;padding: 10px"
                   @click.stop text
                   @click="open1()">删除</el-button>
      </div>
    </div><br><br><br><br><br><br>
    <div v-if="!empty" class="checkout-bar">
      <div style="position:absolute;right: 130px;bottom: 25px">
        合计（不含运费）：
        <span class="total-symbol">
          ￥
        </span>
        <span class="price-sum">
          {{ totalPrice }}
        </span>
      </div>
      <div class="btn">
        <button class="checkout-btn">去结算</button>
      </div>
    </div>
  </div>
  <el-empty v-if="empty" style="margin: -80px 0 0 0" :image-size="350" description="购物车竟然是空的，再忙，也要记得买点什么犒劳自己~" image="http://1.14.126.98:5000/state/ShoppingCart-empty.png"></el-empty>
</template>

<style scoped>
@import '../assets/ShoppingCart.css';
</style>
