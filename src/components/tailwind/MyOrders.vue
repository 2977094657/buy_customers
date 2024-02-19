<script setup>
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {computed,ref} from "vue";
import { useStore } from '../../store/index'
const store = useStore()
import Obligation from "@/components/tailwind/Obligation.vue";
import Paid from "@/components/tailwind/OrdersState.vue";
import AllOrders from "@/components/tailwind/AllOrders.vue";

const userid = computed(() => store.userInfo.userId)
const land = computed(() => store.userInfo.land)
let emptyValue = ref('');

const handleEmptyUpdate = (value) => {
  emptyValue.value = value;
};
</script>

<template>
  <div class="bg-white">
    <TabGroup as="div">
      <div class="border-b border-gray-200">
        <TabList class="-mb-px flex space-x-8">
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 10px;margin-left: 10px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              全部
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 10px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待付款
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 10px"
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待发货
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 10px"
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待收货
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button
                :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              已收货
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels as="template">
        <TabPanel>
          <AllOrders></AllOrders>
        </TabPanel>

        <TabPanel>
          <Obligation></Obligation>
        </TabPanel>

        <TabPanel>
          <Paid :state="'待发货'"></Paid>
        </TabPanel>

        <TabPanel>
          <Paid :state="'待收货'"></Paid>
        </TabPanel>

        <TabPanel>
          <Paid v-if="emptyValue!=='待评价'" :state="'待评价'" @update-empty="handleEmptyUpdate"></Paid>
          <Paid :state="'已完成'" @update-empty="handleEmptyUpdate"></Paid>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style scoped>
@import '../../assets/Tailwind.css';

</style>
