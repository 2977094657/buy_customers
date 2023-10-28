<template>
  <div class="bg-white">
    <div class="mx-auto px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
      <!-- Product -->
      <div class="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">

        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-full lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <div class="border-b border-gray-200">
              <TabList class="-mb-px flex space-x-8">
                <Tab as="template" v-slot="{ selected }">
                  <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">宝贝评价</button>
                </Tab>
                <Tab as="template" v-slot="{ selected }">
                  <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">优质服务</button>
                </Tab>
              </TabList>
            </div>
            <TabPanels as="template">
              <TabPanel class="-mb-10">
<!--                评价列表-->
                <div v-for="(review) in reviews.featured" :key="review.id" class="flex space-x-4 text-sm text-gray-500">
                  <div class="bg-white">
                    <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                      <div class="lg:col-span-4">

                        <div class="mt-3 flex items-center">
                          <div>
                            <div class="flex items-center">
                              <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[reviews.average > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                            </div>
                            <p class="sr-only">{{ reviews.average }} out of 5 stars</p>
                          </div>
                          <p class="ml-2 text-sm text-gray-900">基于 {{ reviews.totalCount }} 条评论</p>
                        </div>

                        <div class="mt-6">
                          <h3 class="sr-only">Review data</h3>

                          <dl class="space-y-3">
                            <div v-for="count in reviews.counts" :key="count.rating" class="flex items-center text-sm">
                              <dt class="flex flex-1 items-center">
                                <p class="w-3 font-medium text-gray-900">{{ count.rating }}<span class="sr-only"> star reviews</span></p>
                                <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
                                  <StarIcon :class="[count.count > 0 ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />

                                  <div class="relative ml-3 flex-1">
                                    <div class="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                    <div v-if="count.count > 0" class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400" :style="{ width: `calc(${count.count} / ${reviews.totalCount} * 100%)` }" />
                                  </div>
                                </div>
                              </dt>
                              <dd class="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">{{ Math.round((count.count / reviews.totalCount) * 100) }}%</dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                        <h3 class="sr-only">Recent reviews</h3>

                        <div class="flow-root">
                          <div class="-my-12 divide-y divide-gray-200">
                            <div v-for="review in reviews.featured" :key="review.id" class="py-12">
                              <div class="flex items-center">
                                <img :src="review.avatarSrc" :alt="`${review.author}.`" class="h-12 w-12 rounded-full" />
                                <div class="ml-4">
                                  <h4 class="text-sm font-bold text-gray-900">{{ review.author }}</h4>
                                  <div class="mt-1 flex items-center">
                                    <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                                  </div>
                                  <p class="sr-only">{{ review.rating }} out of 5 stars</p>
                                </div>
                              </div>

                              <div class="mt-4 space-y-6 text-base italic text-gray-600" v-html="review.content" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel class="text-sm text-gray-500">
                <h3 class="sr-only">Frequently Asked Questions</h3>

                <dl>
                  <Incentive></Incentive>
                </dl>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/20/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import Incentive from "@/components/tailwind/Incentive.vue";

const reviews = {
  average: 4,
  totalCount: 1624,
  counts: [
    { rating: 5, count: 1019 },
    { rating: 4, count: 162 },
    { rating: 3, count: 97 },
    { rating: 2, count: 199 },
    { rating: 1, count: 147 },
  ],
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>产品很好</p>
      `,
      author: 'Emily Selman',
      avatarSrc:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    // More reviews...
  ],
}
</script>

<style scoped>
@import '../../assets/Tailwind.css';
</style>
