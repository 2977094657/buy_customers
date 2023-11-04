<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="z-[9998] fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="z-[9999] fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- 侧边栏组件，如果您愿意，可以将此元素与另一个侧边栏交换 -->
              <div class="z-[9999] flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <img @click="goHome" class="h-8 w-auto" src="http://124.221.7.201:5000/logo.png" alt="Your Company" />
                </div>
                <nav class="z-[9999] flex flex-1 flex-col" :key="forceUpdate">
                  <ul role="list" class="z-[9999] flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link :to="item.href"
                                       @click="selectItem(item)"
                                       :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                            <component :is="item.icon"
                                       :class="[item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                                       aria-hidden="true" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- 桌面静态侧边栏 -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- 侧边栏组件，如果您愿意，可以将此元素与另一个侧边栏交换 -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <img @click="goHome" class="h-8 w-auto" src="http://124.221.7.201:5000/logo.png" alt="Your Company" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href"
                               @click="selectItem(item)"
                               :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                    <component :is="item.icon"
                               :class="[item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                               aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky z-50  top-0 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- 分隔符 -->
        <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="relative flex flex-1" action="#" method="GET">
            <Input id="search-field" class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." type="search" name="search" />
          </form>
        </div>
      </div>

<!--      显示内容-->
      <main style="background-color: rgb(243,244,246);padding-bottom: 50px">
        <router-view name="personalInformation"></router-view>
        <router-view name="address"></router-view>
        <div style="margin-left: 20px;">
          <router-view name="star"></router-view>
          <router-view name="ShoppingCart"></router-view>
          <router-view name="History"></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot,} from '@headlessui/vue'
import {Bars3Icon, XMarkIcon,} from '@heroicons/vue/24/outline'
import router from "@/router/router";
import Input from "@/components/tailwind/Input.vue";
import {HeartIcon, ShoppingCartIcon, UserIcon,ChatBubbleLeftEllipsisIcon,ClockIcon,ClipboardDocumentListIcon} from "@heroicons/vue/24/outline";

const navigation = [
  { name: '个人信息', href: '/PersonalCenter/InforMation', icon: UserIcon, current: false },
  { name: '宝贝收藏', href: '/PersonalCenter/star', icon: HeartIcon, current: false },
  { name: '购物车', href: '/PersonalCenter/ShoppingCart', icon: ShoppingCartIcon, current: false },
  { name: '我的评价', href: '#', icon: ChatBubbleLeftEllipsisIcon, current: false },
  { name: '我的足迹', href: '/PersonalCenter/History', icon: ClockIcon, current: false },
  { name: '我的订单', href: '#', icon: ClipboardDocumentListIcon, current: false },
]

const selectItem = (selectedItem) => {
  navigation.forEach(item => {
    item.current = false;
  });
  selectedItem.current = true;
};

// 在 setup() 中定义一个新的 ref
const forceUpdate = ref(0);

// 解决手机端侧边栏点击后文字颜色不立即变化，而是上一个被选中的有颜色的问题
router.afterEach((to) => {
  navigation.forEach(item => {
    item.current = to.path === item.href;
  });

  // 强制更新
  forceUpdate.value++;
});


const sidebarOpen = ref(false)

const goHome = () => {
  // 导航到首页
  router.push({name: 'Home'});
};

</script>


<style scoped>
@import '../../assets/Tailwind.css';
</style>
