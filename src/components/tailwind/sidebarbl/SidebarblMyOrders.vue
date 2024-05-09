<script setup>
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {computed, ref} from "vue";
import { useStore } from '../../../store/index'
const store = useStore()
import SidebarblObligation from "@/components/tailwind/sidebarbl/SidebarblObligation.vue";
import SidebarblPendingReceipt from "@/components/tailwind/sidebarbl/SidebarblOrderState.vue";
import SidebarblAllOrders from "@/components/tailwind/sidebarbl/SidebarblAllOrders.vue";

const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
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
                全部
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px;margin-left: 30px"
                    :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              <el-badge :hidden="unpaidOrdersLength===0" :value="unpaidOrdersLength">
              待付款
              </el-badge>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px"
                    :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待发货
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待收货
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels as="template">
        <TabPanel>
          <SidebarblAllOrders></SidebarblAllOrders>
        </TabPanel>

        <TabPanel>
          <SidebarblObligation @update:unpaidOrdersLength="handleUnpaidOrdersLength"></SidebarblObligation>
        </TabPanel>

        <TabPanel>
          <SidebarblPendingReceipt :state="'待发货'"></SidebarblPendingReceipt>
        </TabPanel>

        <TabPanel>
          <SidebarblPendingReceipt :state="'待收货'"></SidebarblPendingReceipt>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style scoped>
@import '../../../assets/Tailwind.css';
:deep(.el-badge__content--danger) {
  background-color: rgb(255,112,0);
}
</style>
