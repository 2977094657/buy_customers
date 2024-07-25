<script setup>
import {ref, onMounted, watch, computed, onBeforeUnmount, nextTick, onUpdated} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import { useStore } from '../../store/index'
import {ChatDotSquare, Document, ShoppingTrolley} from "@element-plus/icons-vue";
import {HeartOutlined} from "@ant-design/icons-vue";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {UpCircleOutlined,DownCircleOutlined} from '@ant-design/icons-vue';
import Navbars from "@/components/tailwind/Navbars.vue";
import SidebarblCart from "@/components/tailwind/sidebarbl/SidebarblCart.vue";
import SidebarblStar from "@/components/tailwind/sidebarbl/SidebarblStar.vue";
import SidebarblMyComments from "@/components/tailwind/sidebarbl/SidebarblMyComments.vue";
import SidebarblMyOrders from "@/components/tailwind/sidebarbl/SidebarblMyOrders.vue";
import {getGlobalSettings} from "@/api/api";

const store = useStore()
const route = useRoute();
const land = computed(() => store.userInfo.land)
let deviceType = computed(() => store.deviceType)
const sidebar = ref('') //网站是否显示侧边栏参数
const product = computed(() => route.path.startsWith('/product'));

// 定义一个新的函数，用于更新值
async function updateValues() {
  const globalSettings = await getGlobalSettings('sidebarbl');
  if(!product.value&&deviceType.value==='PC'){
    sidebar.value=globalSettings.data.data.value
    return
  }else if (deviceType.value==='PC'){
    sidebar.value=globalSettings.data.data.value
    return
  }else if (deviceType.value!=='PC'&&product.value){
    return
  }
  sidebar.value=globalSettings.data.data.value
}

onMounted(updateValues);  // 在页面加载时调用函数

// 监听路由的变化
watch(() => route.path, updateValues);  // 在路由变化时调用函数

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  watch(() => route.name, (newName) => {
    if (newName === 'Home') {
      inputValue.value = '';
    }
  });
});

const isSticky = ref(false);
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
const isPlaceholderVisible = ref(false);

const handleScroll = () => {
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    const searchContainerHeight = searchContainer.offsetHeight;
    isSticky.value = window.pageYOffset > searchContainerHeight;
    isPlaceholderVisible.value = isSticky.value;
  }
};


const inputValue = ref('');

const router = useRouter();
let open = ref(false)


let title = ref(false);
let description = ref('')

const drawer = ref(false)
const dd = ref(false)
const pj = ref(false)
let sc = ref(false)

const isSidebarVisible = ref(true);
const show = ref(false);

const checkScroll = () => {
  show.value = window.scrollY > 100;
};

const toggleSidebarVisibility = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

onMounted(() => {
  if (router.currentRoute.value.path.startsWith('/Reviews')) {
    isSidebarVisible.value = false;
    show.value = false;
  } else {
    window.addEventListener('scroll', checkScroll);
  }
});

onBeforeUnmount(() => {
  if (router.currentRoute.value.path.startsWith('/Reviews')) {
    isSidebarVisible.value = false;
    show.value = false;
  } else {
    window.removeEventListener('scroll', checkScroll);
  }
});

const size = ref('50%')
const PersonalCenter = () => {
  if (land.value) {
    const url = router.resolve({name: 'PersonalCenter'}).href;
    window.open(url, '_blank');
  }
};

const hasScrollbar = ref(false);

const checkScrollbar = async () => {
  await nextTick();
  hasScrollbar.value = document.documentElement.scrollHeight > window.innerHeight;
};

onMounted(checkScrollbar);
onUpdated(checkScrollbar);
</script>

<template>
  <div class="z-[50] search-container lm:mt-0 lm:m-0 lm:p-0" :class="{ 'sticky': isSticky }">
    <Navbars></Navbars>
  </div>
<!--  提示下载APP的部分-->
<!--  <div v-if="deviceType==='Android'" class="text-center" style="margin: 0; padding: 0;">-->
<!--    <Test></Test><br>-->
<!--  </div>-->



  <!--  收起侧边栏选项-->
  <div v-if="sidebar==='1'||deviceType==='PC'" class="cbl2" v-show="show">
    <el-button style="margin-left: 5px;height: 0" class="sticky-button" type="primary" @click="toggleSidebarVisibility">
      <div class="sticky-button3">
        <el-icon class="text-gray-500" style="font-size: 20px;margin-left: -5px">
          <UpCircleOutlined v-if="isSidebarVisible" />
          <DownCircleOutlined v-else />
        </el-icon>
        <div class="text-gray-500" style="position:absolute;margin-top: -5px;margin-left: -10px">
          <span v-if="isSidebarVisible">&nbsp收起</span>
          <span v-else>&nbsp展开</span>
        </div>
      </div>
    </el-button>
  </div>

<!--  侧边栏选项-->
  <div v-if="sidebar==='1'||deviceType==='PC'" class="cbl" v-show="show&&isSidebarVisible">
    <el-button class="sticky-button4" type="primary" @click="drawer=true">
      <div class="sticky-button2">
        <el-icon class="text-gray-500" style="font-size: 20px;margin-left: -10px">
          <ShoppingTrolley />
        </el-icon>
        <div class="text-gray-500" style="margin: 5px 0 0 0;">
          购物车&nbsp&nbsp
        </div>
      </div>
    </el-button>

    <TransitionRoot as="template" :show="drawer">
      <Dialog as="div" class="relative z-10" @close="drawer = false">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-hidden z-[200]">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div style="padding: 10px 0" class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="relative flex-1 sm:px-6">
                      <SidebarblCart></SidebarblCart>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="sticky-button4" type="primary" @click="dd = true;">
      <div class="sticky-button2" style="margin: 30px 15px 0 0">
        <el-icon class="text-gray-500" style="font-size: 20px;">
          <Document />
        </el-icon>
        <div class="text-gray-500" style="margin: 5px 0 0 0;">
          订单
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="dd">
      <Dialog as="div" class="relative z-10" @close="dd = false">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden z-[200]">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div style="padding: 10px 0" class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="relative flex-1">
                      <SidebarblMyOrders></SidebarblMyOrders>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <div class="sticky-button4" type="primary" @click="pj = true;">
      <div class="sticky-button2" style="margin: 40px 15px 0 0">
        <el-icon class="text-gray-500" style="font-size: 20px;">
          <ChatDotSquare/>
        </el-icon>
        <div class="text-gray-500" style="margin: 5px 0 0 0;">
          评价
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="pj">
      <Dialog as="div" class="relative z-10" @close="pj = false">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden z-[200]">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div style="padding: 10px 0" class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="relative flex-1">
                      <SidebarblMyComments></SidebarblMyComments>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <div class="sticky-button4" type="primary" @click="sc=true">
      <div class="sticky-button2" style="margin: 50px 15px 0 0">
        <HeartOutlined class="text-gray-500" style="font-size: 20px"/>
        <div class="text-gray-500" style="margin: 5px 0 0 0;">
          收藏
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="sc">
      <Dialog as="div" class="relative z-10" @close="sc = false">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden z-[200]">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div style="padding: 10px 0" class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="relative flex-1 sm:px-6">
                      <SidebarblStar></SidebarblStar>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <el-backtop :bottom="100" style="
    border: 1px solid rgb(209,213,219);
    border-top: none;
    border-right: none;
    position: absolute;
    right: 0;
    top: 236px;
    height: 50px;
    width: 60px;
    box-shadow: none;
    border-radius: 0 0 0 15px;" :visibility-height="600">
      <div class="up text-gray-500"><br>&nbsp&nbsp&nbsp▲<br>&nbsp&nbsp&nbsp顶部</div>
    </el-backtop>
  </div>
</template>

<style scoped>
@import '../../assets/Top.css';
@import '../../assets/Tailwind.css';
</style>

