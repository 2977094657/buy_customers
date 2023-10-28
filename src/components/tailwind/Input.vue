<template>
  <TransitionRoot :show="true">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
          <div :style="{ border: focusInput ? '1px solid #E3E5E7' : '1px solid transparent' }" class="relative mx-auto max-w-xl rounded-xl p-2 ring-black ring-opacity-5 transition-all" :class="{ 'bg-white': focusInput }">
            <Combobox>
              <div class="search-box transform relative"> <!-- 添加了新的 div -->
                <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input ref="refInput" style="height: 45px;border-radius: 22px" @change="inputValue = $event.target.value" @focus="focusInput=true" @blur="onBlur" @keyup.enter="searchProduct" class="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm h-12 pl-11 pr-4 placeholder:text-gray-400" placeholder="请输入商品名" />
              </div>
              <ComboboxOptions style="margin: -0.5px 0 0 -8px; border: 1px solid #E3E5E7;border-top: none; border-top-left-radius: 0;border-top-right-radius: 0;" v-show="focusInput" static class="w-full rounded-md border-0 px-4 focus:ring-0 sm:text-sm bg-white absolute -mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dropdown z-[9999] shadow-2xl">
                <div class="dropdown-title flex justify-between">
                  搜索历史
                  <span class="clear-history" @mousedown.prevent="clearHistory">清空</span>
                </div>
                <ComboboxOption v-for="history in searchHistory">
                  <div class="dropdown-item" @mousedown.prevent="selectHistory(history)">
                    <div class="history-text">{{ history }}</div>
                    <el-icon class="remove-button" @mousedown.stop="removeHistory(history)"><Close /></el-icon>
                  </div>
                </ComboboxOption>
              </ComboboxOptions>
            </Combobox>
          </div>
        </TransitionChild>
  </TransitionRoot>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxOption, ComboboxOptions,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const open = ref(true)
const refInput =ref()


const onBlur = () => {
  if (remove.value){
    refInput.value.focus()
    focusInput.value = true;
    remove.value = false
  }else if (!remove.value){
    focusInput.value = false;
  }
};

import { onMounted,watch,watchEffect  } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex'
import {Close} from "@element-plus/icons-vue";

const store = useStore()
const route = useRoute();
const land = computed(() => store.state.userInfo.land)

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


const searchHistory = ref([]); // 用于保存搜索历史的变量

watchEffect(() => {
  // 从本地存储中获取搜索历史
  const history = localStorage.getItem('searchHistory');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
});

const focusInput = ref(false); // 用于保存输入框是否获得焦点的状态
const remove = ref();

const removeHistory = (history) => {
  remove.value=true
  const index = searchHistory.value.indexOf(history);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
  }
};

const clearHistory = () => {
  // 清除所有的历史记录
  searchHistory.value = [];
  localStorage.setItem('searchHistory', JSON.stringify([]));
};
const searchProduct = () => {
  // 检查 inputValue 是否为空或只包含空格
  if (!inputValue.value || inputValue.value.trim() === '') {
    // 如果是，那么导航到首页
    router.push({ name: 'Home' });
  } else {
    const url = router.resolve({name: 'Search', params: { keyword: inputValue.value }}).href;
    window.open(url, '_blank');

    // 先移除旧的记录，然后添加新的记录
    removeHistory(inputValue.value);
    searchHistory.value.unshift(inputValue.value);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));

    focusInput.value=false // 新增这行：移除输入框的焦点
  }
};


const selectHistory = (history) => {
  // 当用户点击历史记录时，取消事件冒泡，防止触发 @mousedown.prevent
  event.stopPropagation();
  inputValue.value = history;
  searchProduct();
};
</script>

<style scoped>
@import '../../assets/Tailwind.css';
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  margin: 0;
}

img{
  width: 100%;
  height: 100%;
}

.dropdown {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.dropdown-item {
  position: relative;
  box-sizing: border-box;
  height: 30px;
  padding: 7px 10px 8px;
  font-size: 12px;
  line-height: 15px;
  background: #f6f7f8;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.clear-history {
  text-align: right;
  font-size: 13px;
  color: #9499a0;
  cursor: pointer;
}

.clear-history:hover {
  color: red;
}

.dropdown-item:hover .remove-button {
  display: block;
}

.remove-button{
  color: white;
  border-radius: 50%;
  background-color: rgb(204,204,204);
  cursor: pointer;
  display: none;
  position: absolute; /* 添加这一行 */
  top: -5px;
  right: 0;
}

.remove-button:hover {
  display: block;
}

.dropdown-item:hover {
  color: #FF5000;
  display: block;
}

.history-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 96px;
}

.dropdown-title {
  width: 100%;
  font-size: 18px;
  text-align: left;
  margin: 0 0 20px 0;
}
</style>
