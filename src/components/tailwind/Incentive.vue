<template>
  <div class="bg-gray-50">
    <div class="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
      <div class="mx-auto max-w-2xl px-4 lg:max-w-none">
        <div class="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
          <div>
            <h2 class="text-4xl font-bold tracking-tight text-gray-900">我们的业务建立在优质的客户服务之上</h2>
            <p class="mt-4 text-gray-500">至少在一开始是这样，但后来我们意识到，如果我们不再关心这一点，我们可以赚更多的钱。我们的新策略是写一堆在头条新闻中看起来非常好的东西，然后在小字中澄清，但希望人们实际上不会阅读它。</p>
          </div>
          <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
            <img src="https://tailwindui.com/img/ecommerce-images/incentives-07-hero.jpg" alt="" class="object-cover object-center" />
          </div>
        </div>
        <div class="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div v-for="incentive in incentives" :key="incentive.name" class="sm:flex lg:block">
            <div class="sm:flex-shrink-0">
              <img class="h-20 w-20" :src="incentive.imageSrc" alt="" />
            </div>
            <div class="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
              <h3 class="text-sm font-medium text-gray-900">{{ incentive.name }}</h3>
              <p class="mt-2 text-sm text-gray-500">{{ incentive.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const incentives = [
  {
    name: '免费送货',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg',
    description: "立即购买，您将获得免邮资格，此资格从你看见后开始计时，仅此一天，赶快行动吧。好吧，它实际上不是免费的，我们只是将其定价到产品中。有人为此买单，而不是我们",
  },
  {
    name: '为了地球',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg',
    description: "我们将从每笔订单中拿出1%用来进行环保事业，什么？你问我们为什么这样做？很简单，当然是用户多出了1%，羊毛出在羊身上",
  },
  {
    name: '24/7客服支持',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-chat-light.svg',
    description:
        "我们的AI聊天小组件由一系列朴素的if/else语句提供支持。保证刺激。",
  },
]
</script>

<style scoped>
@import '../../assets/Tailwind.css';
</style>
