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
            <button style="margin-right: 30px;margin-left: 30px" :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              待评价
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button style="margin-right: 30px"
                    :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">
              已评价
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels as="template">
        <TabPanel>
          <Evaluated></Evaluated>
        </TabPanel>
        <TabPanel>
          <Paid></Paid>
        </TabPanel>
        <TabPanel class="p-10">
          3
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import Paid from "@/components/tailwind/Paid.vue";
import Evaluated from "@/components/tailwind/Evaluated.vue";
</script>

<style scoped>
@import '../../assets/Tailwind.css';
</style>
