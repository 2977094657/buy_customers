<script setup>
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {computed, ref} from "vue";
import store from "@/store";
import SidebarblObligation from "@/components/tailwind/sidebarbl/SidebarblObligation.vue";
import SidebarblPaid from "@/components/tailwind/sidebarbl/SidebarblPaid.vue";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
let unpaidOrdersLength = ref(0); // 用于存储从子组件传递过来的未付款订单数量

const handleUnpaidOrdersLength = (length) => {
  unpaidOrdersLength.value = length;
}
</script>

<template>
  <div class="bg-white">
    <TabGroup as="div">
      <div class="border-b border-gray-200">
        <TabList class="-mb-px flex space-x-8">
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px;margin-left: 30px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              <el-badge :hidden="unpaidOrdersLength===0" :value="unpaidOrdersLength">
                待付款
              </el-badge>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px;margin-left: 30px"
                    :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待发货
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px"
                    :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待收货
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              全部
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels as="template">
        <!--待付款-->
        <TabPanel>
          <SidebarblObligation @update:unpaidOrdersLength="handleUnpaidOrdersLength"></SidebarblObligation>
        </TabPanel>


        <!--待发货-->
        <TabPanel>
          <SidebarblPaid></SidebarblPaid>
        </TabPanel>

        <!--选项栏三的内容-->
        <TabPanel class="p-10">
          3
        </TabPanel>
        <TabPanel class="p-10">
          4
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style scoped>
@import '../../../assets/Tailwind.css';
/deep/.el-badge__content--danger {
  background-color: rgb(250,82,81);
}
</style>
