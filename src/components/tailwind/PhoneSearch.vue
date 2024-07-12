<template>
  <div v-if="isDeviceTypeResolved && deviceType !== 'PC'" class="search-bar">
    <div class="search-input">
      <input type="text" placeholder="输入商品关键字搜索"/>
      <i class="icon-camera"></i>
      <button class="search-button">搜索</button>
    </div>

    <div>
      <van-tabs class="selectTab" v-model:active="activeName" title-active-color="#FF5000" line-width="20px"
                line-height="2px" animated swipeable color="#FF5000" background="rgb(241 242 243)">
        <van-tab title="标签 1" name="a"></van-tab>
        <van-tab title="标签 2" name="b"></van-tab>
        <van-tab title="标签 3" name="c"></van-tab>
        <van-tab title="标签 4" name="d"></van-tab>
        <van-tab title="标签 5" name="e"></van-tab>
        <van-tab title="标签 6" name="f"></van-tab>
        <van-tab title="标签 7" name="g"></van-tab>
        <van-tab title="标签 8" name="h"></van-tab>
        <van-tab title="标签 9" name="i"></van-tab>
      </van-tabs>
    </div>

    <div style="height: 5px;width: 100%"></div>

  </div>
</template>


<script setup>
import {ref, computed, onMounted} from 'vue';
import {useStore} from '@/store';

const store = useStore();
const deviceType = computed(() => store.deviceType);

const isDeviceTypeResolved = ref(false);

onMounted(() => {
  setTimeout(() => {
    isDeviceTypeResolved.value = true;
  }, 500);
});
const activeName = ref('b');
</script>

<style scoped>
.search-bar {
  background-color: rgb(241 242 243);
}

.search-input {
  background-color: white;
  display: flex;
  align-items: center;
  border: 2px solid #ff6600;
  border-radius: 10px;
  padding: 2px;
}

.search-input input {
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 5px;
}

.search-input .icon-scan,
.search-input .icon-camera {
  font-size: 20px;
  margin: 0 10px;
}

.search-input .search-button {
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 5px 15px;
  cursor: pointer;
}

.categories span {
  margin-right: 15px;
  color: #333;
  cursor: pointer;
}

.categories .active {
  color: #ff6600;
  border-bottom: 2px solid #ff6600;
}

.categories .icon-dropdown {
  font-size: 20px;
  margin-left: 10px;
}

.selectTab /deep/ .van-tabs--line {
  height: 30px;
  margin-left: -15px;
}

.selectTab /deep/ .van-tabs__wrap {
  height: 30px;
  margin-left: -15px;
}
</style>
