<script setup>
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import {computed} from "vue";
import store from "@/store";
import Obligation from "@/components/tailwind/Obligation.vue";
import Paid from "@/components/tailwind/Paid.vue";

const userid = computed(() => store.state.userInfo.userId)
const land = computed(() => store.state.userInfo.land)
</script>

<template>
  <div class="bg-white">
    <TabGroup as="div">
      <div class="border-b border-gray-200">
        <TabList class="-mb-px flex space-x-8">
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px;margin-left: 30px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待付款
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px;margin-left: 30px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              已付款
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
        <!--待付款-->
        <TabPanel>
          <Obligation></Obligation>
        </TabPanel>


        <!--已付款内容-->
        <TabPanel>
          <Paid></Paid>
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
@import '../../assets/Tailwind.css';

</style>
