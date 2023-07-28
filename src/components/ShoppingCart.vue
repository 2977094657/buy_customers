<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import store from "@/store";
import router from "@/router/router";
import { debounce } from 'lodash'


const isLoading = ref(true)
const cartItems = ref([])
const productResponses = ref([])
const userid = computed(() => store.state.userInfo.userId)

const loadCartItems = async () => {
  try {
    const response = await axios.get('http://1.14.126.98:8081/cart/list', {
      params: {
        userId: userid.value
      }
    })
    cartItems.value = response.data

    const productRequests = cartItems.value.map(item =>
        axios.get('http://1.14.126.98:8081/product/selectById', {
          params: {
            productId: item.productId
          }
        })
    )

    productResponses.value = await Promise.all(productRequests)

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
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
}, 1000)

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
    // After deleting item, we refresh the cart items
    await loadCartItems();
  } catch (error) {
    showMessage('删除购物车失败');
  }
}

const open = (id) => {
  ElMessageBox.confirm(
      '删除后将无法恢复,确认要删除购物车里的此商品吗?',
      '删除商品？',
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
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else>
    <div style="color: rgb(255,80,0);width: 100px;position: relative;top: -62px;left: 150px;">
      <h1>{{ totalCount }}</h1>
    </div>
    <div style="width: 700px;position: sticky; top: -20px;z-index: 1000;background-color: white;height: 40px;">
      <div class="sticky" style="margin: -60px 0 20px 170px;">
        <b>商品信息</b>
      </div>
      <div class="sticky" style="margin: -40px 0 20px 317px;">
        <b>单价</b>
      </div>
      <div class="sticky" style="margin: -40px 0 20px 455px;">
        <b>数量</b>
      </div>
      <div class="sticky" style="margin: -40px 0 20px 570px;">
        <b>总价</b>
      </div>
      <div class="sticky" style="margin: -40px 0 20px 642px;">
        <b>操作</b>
      </div>
    </div>
    <div v-for="(item, index) in cartItems" :key="item.id">
      <div class="cart" @click="goToProduct(item.productId)">
        <img style="width: 100px;height: 100px;" :src="productResponses[index].data.img.slice(1, -1).split(',')[0]" alt="Product image" />
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
          <el-button style="background-color: #ff2020;border: none;border-radius: 10px;color: white;padding: 10px"
                     @click.stop text
                     @click="open(item.id)">删除</el-button>
        </div>
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/ShoppingCart.css';
</style>
