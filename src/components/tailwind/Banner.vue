<script setup>
import {ref, onMounted, computed } from 'vue'
import {router} from "@/router/router";
import { useStore } from '../../store/index'
import {getAllProducts} from "@/api/api";

const store = useStore();
const land = computed(() => store.userInfo.land)

let title = ref(false);

const currentPage = ref(1)
const Banner = ref([])

const banner = async () => {
  const response = await getAllProducts(currentPage.value, 5, 'score', false);
  Banner.value = response.data.records
  currentPage.value = response.data.current
}

const goToProduct = (productId) => {
  // 本页面打开
  router.push({ name: 'Product', params: { productId } });
  // 新页面打开
  // const url = router.resolve({ name: 'Product', params: { productId } }).href;
  // window.open(url, '_blank');
}

let open = ref(false)
let currentMessageInstance = null

const PersonalCenter = () => {
  if (land.value){
    const url = router.resolve({ name: 'PersonalCenter'}).href;
    window.open(url, '_blank');
  }
};
onMounted(banner)

let startX = ref(0); // 记录触摸开始的位置
let carousel = ref(null); // 添加一个 ref 来引用 el-carousel 组件

const touchStart = (e) => {
  startX.value = e.touches[0].clientX;
};

const touchEnd = (e) => {
  const endX = e.changedTouches[0].clientX;
  const diffX = endX - startX.value;
  if (diffX > 0) {
    // 用户向右滑动，切换到上一张图片
    carousel.value.prev();
  } else if (diffX < 0) {
    // 用户向左滑动，切换到下一张图片
    carousel.value.next();
  }
};
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl lm:px-0 px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl max-h-70 grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <!-- 第一个位置 -->
        <article class="flex flex-col items-start justify-between">
          <!-- 内容 -->
        </article>

        <!-- 轮播图 -->
        <article class="flex flex-col items-start justify-between">
          <div class="relative w-full">
            <el-carousel ref="carousel" class="lm:h-60 lm:rounded-md rounded-2xl" style="overflow: hidden;" @touchstart="touchStart" @touchend="touchEnd">
              <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
                <img style="max-width: 100%;" @click="goToProduct(Banner.productId)" :src="Banner.img.slice(1, -1).split(',')[0]" alt=""
                     class="w-full h-full lm:h-60 aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]"/>
              </el-carousel-item>
            </el-carousel>
          </div>
        </article>

        <!-- 第三个位置 -->
        <article class="flex flex-col items-start justify-between">
          <!-- 内容 -->
        </article>
      </div>
    </div>
  </div>


</template>

<style scoped>
@import '../../assets/Tailwind.css';
/deep/.el-carousel__indicator--horizontal .el-carousel__button {
  width: 5px;
  height: 5px;
  background: gray;
  border-radius: 50%;
  opacity: 0.3;
}
/deep/.el-carousel__indicator--horizontal.is-active .el-carousel__button{
  width: 5px;
  height: 5px;
  background: #ff5000;
  border-radius: 50%;
  opacity: 1;
}

</style>
