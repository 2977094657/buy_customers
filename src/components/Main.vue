<template>
  <div class="main">
    <div class="banner">
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
          <img  :src="Banner.img.slice(1, -1).split(',')[0]" :alt="Banner.productName">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="products">
        <div v-for="product in products" :key="product.productId" class="product">
          <img :src="product.img.slice(1, -1).split(',')[0]" :alt="product.productName" width="100" class="img">
          <div class="productName">
            {{ product.productName }}
            <br><br>
            <el-rate v-model="product.score" disabled show-score text-color="#ff9900" score-template="{value}"/>
            <br><br>收藏：{{product.star}}
            <br><br><span style="color: rgb(255,80,0);"><b>￥{{ product.price }}</b></span>
          </div>
        </div>
    </div>
    <div>
      <button @click="previousPage">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage">下一页</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const Banner = ref([])

const fetchProducts = async () => {
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${currentPage.value}&size=12`)
  const data = await response.json()
  products.value = data.records
  currentPage.value = data.current
  totalPages.value = data.pages
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    fetchProducts()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    fetchProducts()
  }
}

const banner = async () => {
  const response = await fetch(`http://1.14.126.98:8081/product/all?current=${currentPage.value}&size=5&sortField=score&isAsc=false`)
  const data = await response.json()
  Banner.value = data.records
  currentPage.value = data.current
}

onMounted(fetchProducts)
onMounted(banner)
</script>

<style scoped>
.main {
  margin: 70px 10% 0 10%;
  padding: 20px 0 0 50px;
  border-radius: 20px;
  background-color: white;
}

.banner{
  overflow: hidden;
  border-radius: 10px;
  margin: 10px 0 0 23%;
  width: 48%;
}

.el-carousel__item{
  border-radius: 10px;
}

.products {
  display: flex;
  flex-wrap: wrap;
}

.product {
  background-color: #f7f9fa;
  border-radius: 10px;
  width: 20%;
  height: 150px;
  margin: 20px 1% 0 0; /* 添加 margin 属性来控制产品之间的间距 */
  padding: 10px 10% 10px 1%;
  transition: outline 0.3s ease-in-out; /* 移动 transition 属性到这里 */
  outline: 1px transparent solid; /* 添加一个初始的透明 outline 样式 */
}

img{
  border-radius: 10px;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.3s;
}

.productName{
  position: absolute;
  margin: 0 0 0 12%;
  color: #646464;
  text-align: left;
}

.img{
  position: absolute;
  width: 10%;
  height: 150px;
}

.product:hover {
  outline: 1px #ff915e solid;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.1);
}

.img:hover{
  filter:alpha(Opacity=80);
  -moz-opacity:0.8;
  opacity: 0.8;
}

.productName:hover{
  color: rgb(253,81,2);
}
</style>
