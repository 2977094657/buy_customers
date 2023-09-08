<template>
  <div>
    <div v-if="isMobile" class="mobile-warning">
      <p v-html="randomSentence"></p>
    </div>
    <div v-if="!isMobile">
    <router-view name="top"></router-view>
    <div class="main">
      <router-view name="banner"></router-view>
      <router-view name="main"></router-view>
      <router-view name="search"></router-view>
      <router-view name="description"></router-view>
      <router-view name="productComments"></router-view>
      <router-view name="personalCenter"></router-view>
      <router-view name="shoppingCart"></router-view>
      <router-view name="orders"></router-view>
      <router-view name="vendor"></router-view>
    </div>
  </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';

useRouter();
import {ref, onMounted, computed} from 'vue'

const isMobile = ref(false)

onMounted(() => {
  const str = navigator.userAgent;
  const ipad = str.match(/(iPad).*OS\s([\d_]+)/);
  const isIphone = !!( !ipad && str.match(/(iPhone\sOS)\s([\d_]+)/) );
  const isAndroid = !!( str.match(/(Android)\s+([\d.]+)/) );
  isMobile.value = isIphone || isAndroid;
});

const sentences = [
  "你知道\&nbsp\&nbsp<strong>\"蒂姆·伯纳斯-李(Timothy John Berners-Lee)\"</strong>\&nbsp\&nbsp万维网的发明者，是怎么看待互联网的吗？他说，<em>'这就是关于空间'</em>你在现实世界中是如何处理空间的'。<br><b>为了在我们的网站上获得更大的'空间'，请切换到电脑端吧</b>",
  "2020年，海外知名科技博主<strong>Marques Brownlee</strong>询问苹果高管<strong>\"克雷格·费得里吉\"(Craig Federighi)</strong>为什么iPad到现在都没有天气软件，他回答说<br><strong><em>\"我们还没有去做，因为如果我们要去做，我们希望在那个领域里做出一些真正独特且卓越的事情。\"<br>\"we have not done because we to do it we would want to do something really distinctly great in that space\"</em></strong><br>就像\"Craig Federighi\"所说的那样，我们希望呈现给用户最完美的一面，要么不做，要做就做最好的，我们希望在不久的将来在移动端呈现出我们最完美的作品<br><b>所以现在试试在电脑上打开我们的网站吧！</b>",
  "<b>嘿，看起来你正在移动设备上冒险！为什么不在电脑上打开我们的网站，享受一下大屏幕的盛宴呢？</b>",
  "<b>看来你在手机上找到了我们，但我们的网站更喜欢在电脑上展现自己的风采。赶快换到电脑上来吧！</b>",
  "<b>你的手机是个出色的画家，但我们的网站在大画布（你的电脑）上能绘出更精美的画作。换画布吧！</b>",
  "<b>我们的网站在电脑上可以展现更多魅力，就像披萨在大盘子里更诱人。让我们切换到电脑浏览体验吧！</b>",
  "<b>看起来你正在用手机浏览我们的网站，就像在小巷子里走路。试试在电脑上打开，就像在宽阔的大道上快乐地奔跑！</b>",
  "<b>有人说，'人生就像一盒巧克力，你永远不知道下一颗是什么味道。' 但在我们的网站上，用电脑访问就像一盒全是你最爱味道的巧克力，不用猜，直接享受！</b>",
  "<b>生活不能没有电脑，就像《星球大战》不能没有绝地武士，亲爱的用户，切换到电脑端，感受力量的觉醒吧！</b>",
  "<b>在《星际穿越》中，Cooper穿越了黑洞，发现了新的世界。现在，让我们切换到电脑端，一起探索未知的网站宇宙吧！</b>",
  "<b>在《阿凡达》中，主角通过连接阿凡达体验了全新的世界。现在，切换到电脑端，像连接阿凡达一样，开启全新的网站浏览体验吧！</b>",
  "<b>《海上钢琴师》的1900选择了海洋而非陆地，但在我们的网站，电脑端才是你应当选择的世界。切换吧，让我们一起弹奏出生活的乐章！</b>",
  "<b>《E.T. 外星人》中，E.T. 想要回家，而在我们的网站，电脑端就是你的家。切换吧，让我们一起回家！</b>",
  "<b>你正在用手机浏览，但我们的网站在电脑上更加精彩！不信你试试？</b>",
  "<b>我们的网站在电脑端看起来更美。换个设备，让你的眼睛有个舒服的环境吧！</b>",
  "<b>马云曾说，'机会是给有准备的人，而不是给有资格的人'。我们已经在电脑端上为您做好了充分的准备。</b>",
  "<b>乔布斯说过，'人们不知道他们想要什么，直到你把它展示给他们'。我们的网站在电脑端，有更多想要展示给您的东西。</b>",
  "<b>恩斯特·海明威说过：'写作就像冰山，真正的部分是看不见的'。同样，您在移动端看到的只是冰山一角，真正的精彩在电脑端等着您。</b>",
  "<b>《飞屋环游记》的老人用气球把房子带到了天空。现在，切换到电脑端，让我们一起把浏览体验提升到新的高度吧！</b>",
  "<b>你的手机已经工作得够辛苦了，让它休息一会儿，试试在电脑上访问我们的网站吧！</b>",
  "<b>您正在手机上浏览，这就像是用望远镜看电影。切换到电脑端，就能像在IMAX电影院看电影一样，拥有全景的视野和完全的体验。</b>",
  "<b>艾萨克·牛顿曾经说过，'我们站在巨人的肩膀上'。让我们的网站也成为您的巨人，为您提供更宽广的视野。请切换到电脑端，让我们一起看得更远。</b>",
  "<b>阿诺·施瓦辛格曾经说，'我会回来的'。我们希望您也能这样，用电脑端返回我们的网站，享受更完整的体验。</b>",
  "<b>马丁·路德·金曾经说过，'我有一个梦想'。我们也有一个梦想，那就是希望您能在电脑端访问我们的网站，享受到全面的体验。那么，您现在愿意帮我们实现这个梦想吗？</b>",
  "<b>莎士比亚在他的戏剧《哈姆雷特》中写道，'存在还是不存在，这是个问题'。在手机端上，我们的网站或许存在，但也或许不存在？但在电脑端，我们的网站将全面存在。请切换到电脑端，让我们的网站在您的电脑上全面存在吧！</b>",
  "<b>就像莫扎特在创作奇妙乐章时需要一架宏伟的钢琴，我们的网站也需要电脑端的广阔空间来完全展示其魅力。在手机上浏览就像在口琴上演奏交响乐，可能有点困难。请切换到电脑端，享受我们的全套交响乐吧！</b>",
  "<b>恩斯特·海明威曾经说过：'每次我面对白纸，我都觉得极度恐惧'。我们不希望您在使用移动设备访问我们的网站时有同样的感觉。为了您能更好地体验，我们建议您在电脑端访问。</b>",
  "<b>史蒂夫·乔布斯曾经说过，'设计不只是外表和感觉。设计是如何工作的'。我们的网站在电脑端工作得更好，为了您能有最好的体验，建议您切换到电脑端访问</b>",
  "<b>你可能听过冒险家阿米莉亚·埃尔哈特的名言，'决定去做的最难的事就是决定去做'。那么，现在就决定从手机切换到电脑，开始你的冒险吧！</b>",
  "<b>你听过约翰·冯·诺伊曼的名言吗？他说：'如果人们不相信数学的美丽，那只是因为他们还不了解数学。' 这也适用于电脑浏览体验。切换到电脑，你就会发现它的美丽</b>",
  "你知道吗，<b>史蒂夫·乔布斯</b>曾经说过，<em>'人们不知道他们需要什么，直到你告诉他们'</em><br><b>对于我们的网站，这句话再合适不过了。请切换到电脑端，享受更好的浏览体验吧！</b>"
];

const randomSentence = computed(() => {
  return sentences[Math.floor(Math.random() * sentences.length)];
});
</script>

<style scoped>
.main {
  margin: 70px 10% 0 10%;
  padding: 20px 0 20px 50px;
  border-radius: 20px;
  background-color: white;
}

.mobile-warning {
  white-space: pre-line;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.mobile-warning strong {
  font-weight: bold;
}
</style>
