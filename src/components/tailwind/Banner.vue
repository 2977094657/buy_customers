<script setup>
import {ref, onMounted, computed } from 'vue'
import router from "@/router/router";
import {useStore} from 'vuex';
import {getAllProducts} from "@/api/api";

const store = useStore();
const land = computed(() => store.state.userInfo.land)
let deviceType = ref(null);
const state = ref('hover')

onMounted(() => {
  setTimeout(() => {
    deviceType.value = store.state.deviceType;
    if (deviceType.value==='iPhone'||deviceType.value==='Android'){
      state.value='always'
    }
  }, 1000); // 延迟 1 秒
});

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
            <el-carousel class="lm:rounded-md rounded-2xl" :arrow=state style="overflow: hidden;">
              <el-carousel-item v-for="Banner in Banner" :key="Banner.productId">
                <img style="max-width: 100%;height: 100%;" @click="goToProduct(Banner.productId)" :src="Banner.img.slice(1, -1).split(',')[0]" alt=""
                     class="aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[3/2]"/>
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
/deep/.el-carousel__indicators--horizontal {
  left: 47%;
}
</style>
