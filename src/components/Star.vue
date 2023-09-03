<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import store from "@/store";
import router from "@/router/router";


const cartItems = ref([])
const productResponses = ref([])
const userid = computed(() => store.state.userInfo.userId)
const empty = ref(false)
const land = computed(() => store.state.userInfo.land)
const loading = ref(true)

const loadCartItems = async () => {
  loading.value = true
  if (land.value) {
    try {
      const response = await axios.get('http://1.14.126.98:8081/star/select', {
        params: {
          userId: userid.value
        }
      })
      cartItems.value = response.data
      if (cartItems.value.length === 0) {
        empty.value = true
      }

      const productRequests = cartItems.value.map(item =>
          axios.get('http://1.14.126.98:8081/product/selectById', {
            params: {
              productId: item.productId
            }
          })
      )
      productResponses.value = await Promise.all(productRequests)
      // 数据加载完成后
      loading.value = false
    } catch (error) {
    }
  } else {
    loading.value = false
    empty.value = true
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
  const url = router.resolve({name: 'Product', params: {productId}}).href;
  window.open(url, '_blank');
}

const totalCount = computed(() => {
  return cartItems.value.length
})

const removeCartItem = async (id) => {
  try {
    await axios.delete(`http://1.14.126.98:8081/star/delete`, {
      params: {
        id: id
      }
    });
    showSuccessMessage('删除成功');
    // After deleting item, we refresh the cart items
    await loadCartItems();
  } catch (error) {
    showMessage('删除失败');
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
    const response = await axios.delete('http://1.14.126.98:8081/star/deleteAll', {
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
</script>

<template>
  <div>
    <a-spin style="display: flex;justify-content: center;align-items: center;height: 50vh;" v-if="loading"
            tip="Loading..." size="large">
      <br>
    </a-spin>
    <div v-else>
      <div class="zs">
        <h1>{{ totalCount }}</h1>
      </div>
      <div class="db1">
        <div style="position:absolute;left: 30px;background-color: white">
          <input style="width: 20px;height: 20px;" type="checkbox" v-model="selectAll" @change="handleSelectAllChange">
          <label for="selectAll"><b style="position:absolute;width: 32px;margin: 2px 0 0 0">全选</b></label>
        </div>
        <div style="margin: -60px 0 20px 215px;">
          <b>商品信息</b>
        </div>
        <div style="margin: -42px 0 20px 470px;">
          <b>单价</b>
        </div>
        <div class="cz1">
          <b>操作</b>
        </div>
      </div>
      <div v-for="(item, index) in cartItems" :key="item.id">
        <div class="cart" @click="goToProduct(item.productId);addHistory(item.productId)" :class="{ 'selected': item.checked }">
          <input style="width: 20px;height: 20px;" type="checkbox" v-model="item.checked" @click.stop>
          <img style="margin: 0 0 0 30px;width: 100px;height: 100px;"
               :src="productResponses[index].data.img.slice(1, -1).split(',')[0]" alt="Product image"/>
          <div class="productName">
            {{ productResponses[index].data.productName }}
          </div>
          <div class="description1">
            {{ productResponses[index].data.description }}
          </div>
          <div class="price1">
          <span class="total-symbol">
            ￥
          </span>
            <span class="price-sum">
            {{ productResponses[index].data.price }}
          </span>
          </div>
          <div class="time1">
            {{ formatDate(item.time) }}
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
        <div class="delete2">
          <el-button style="background-color: #ff2020;border: none;border-radius: 5px;color: white;padding: 10px"
                     @click.stop text
                     @click="open1()">删除
          </el-button>
        </div>
      </div>
      <br><br><br><br><br><br>
      <div class="checkout-bar">
      </div>
    </div>
  </div>
  <el-empty v-if="empty" style="margin: -80px 0 0 0" :image-size="350"
            description="发现更多精彩，将心动的宝贝加入收藏夹，随时回来再次欣赏！"
            image="http://1.14.126.98:5000/state/Star-empty.png"></el-empty>
</template>

<style scoped>
@import '../assets/ShoppingCart.css';
.description1 {
  width: 200px;
  position: absolute;
  left: 200px;
  margin: -60px 0 0 0;
  font: 12px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
}

.price1 {
  position: absolute;
  left: 220px;
  margin: -65px 0 0 228px;
}

.delete2 {
  left: 360px;
  z-index: 200;
  position: absolute;
  bottom: 25px
}

.cz1 {
  margin: -40px 0 20px 662px;
}

.db1 {
  width: 730px;
  position: sticky;
  top: -20px;
  z-index: 1000;
  background-color: white;
  height: 30px;
  margin: 0 0 10px -20px;
}

.zs {
  color: rgb(255, 80, 0);
  width: 100px;
  position: relative;
  top: -62px;
  left: 150px;
}


/*本地加载的css，不知道为什么打包后css悔发生变化因此本地和服务器各一份*/
/deep/ :where(.css-dev-only-do-not-override-eq3tly).ant-spin .ant-spin-dot-item {
  background-color: #ff915e;
}

/deep/ :where(.css-dev-only-do-not-override-eq3tly).ant-spin {
  color: #ff915e;
}

/*服务器加载的css*/
/deep/:where(.css-eq3tly).ant-spin .ant-spin-dot-item {
  background-color: #ff915e;
}

/deep/:where(.css-eq3tly).ant-spin {
  color: #ff915e;
}
</style>
