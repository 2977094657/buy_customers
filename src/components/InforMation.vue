<script setup>
import {ref, onMounted, computed, reactive} from 'vue';
import store from "@/store";
import {Female, Male} from "@element-plus/icons-vue";
import axios from 'axios';

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');

const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await fetch(`http://1.14.126.98:8081/user/all?userId=${userId}`);
    const data = await response.json();
    if (data.code === 0) {
      userInfo.value = data.data;
      avatarUrl.value = data.data.userAvatar; // 获取头像图片URL
    } else {
      console.error('获取用户信息失败');
    }
  } else {
    setTimeout(fetchUserInfo, 1);
  }
};

onMounted(fetchUserInfo);

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber && phoneNumber.length === 11) {
    const firstThreeDigits = phoneNumber.substr(0, 3);
    const lastFourDigits = phoneNumber.substr(7, 4);
    return `${firstThreeDigits}****${lastFourDigits}`;
  }
  return phoneNumber;
}


const selectedRegion = ref([]);
const regions = ref([]);
const props = {
  value: 'value',
  label: 'label',
  children: 'children'
};

onMounted(async () => {
  try {
    const response = await axios.get('https://www.mxnzp.com/api/address/list?app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09');
    const data = response.data;
    if (data.code === 1) {
      regions.value = data.data.map(region => ({
        value: region.code,
        label: region.name,
        children: region.pchilds.map(city => ({
          value: city.code,
          label: city.name,
          children: city.cchilds.map(district => ({
            value: district.code,
            label: district.name
          }))
        }))
      }));
    } else {
      console.error('接口返回错误:', data.msg);
    }
  } catch (error) {
    console.error('请求接口出错:', error);
  }
});


const ruleFormRef = ref()
const ruleForm = reactive({
  address: '',
  name: '',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})


const tableData = [
  {
    consignee: '14863',
    address: '四川省 眉山市 仁寿县 视高街道',
    fullAddress: '四川科技职业学院10号公寓',
    phoneNumber: '17628887613',
  },
]
</script>

<template>
  <div class="user-avatar-container">
    <div class="avatar" :style="{'background-image': `url(${avatarUrl})`}"></div>
    <div style="margin: -180px 0 0 0;">
      <img :src="avatarUrl" alt="用户头像" class="user-avatar"/>
    </div>
  </div>
  <div class="user-info-wrapper">
    <div v-if="userInfo" class="user-info-container">
      <div class="user-info-details">
        <h1 style="margin: 30px 0 40px 0">
          {{ userInfo.name }}
          <span>
            <el-icon style="color: rgb(95,212,242);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='男性'"><Male/></el-icon>
            <el-icon style="color: rgb(255,117,143);font-size: 20px;margin-left: 50px" v-if="userInfo.gender==='保密'"><Female/></el-icon>
          </span>
        </h1>
        <span>
          <span style="color:#606266;">个性标签：</span>{{ userInfo.description }}
        </span>
        <span style="margin: 0 0 0 100px">
          <span style="color:#606266;">绑定手机：</span>{{ formatPhoneNumber(userInfo.phone) }}
        </span>
        <span style="margin: 0 0 0 100px">
          <span style="color:#606266;">注册时间：</span>{{ formatTime(userInfo.signupTime) }}
        </span>
        <div style="margin: 20px 0 0 0"><span style="color:#606266;">当前默认收货地址：</span>{{ userInfo.address }}
        </div>
        <el-button style="margin: 15px 0 40px 43%;" type="primary" size="large" @click="">修改个人信息</el-button>
        <el-alert :closable="false" style="background-color: #e3f2fd;" title=" 已保存4了条地址，还能保存16条地址"
                  type="info" show-icon/>
        <el-table :border="true" :data="tableData" height="400" style="width: 100%;margin: 20px 0 0 0">
          <el-table-column prop="consignee" label="收货人" width="130"/>
          <el-table-column prop="address" label="所在地区" width="175"/>
          <el-table-column prop="fullAddress" label="详细地址" width="175"/>
          <el-table-column prop="phoneNumber" label="手机号" width="175"/>
          <el-table-column label="操作">
            <el-button size="small" @click="">修改</el-button>
            <el-button size="small" type="danger" @click="">删除</el-button>
            <el-button size="small" type="warning" @click="">设为默认</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--      <el-form-->
    <!--          style="margin: 25px 0 0 -40px"-->
    <!--          ref="ruleFormRef"-->
    <!--          label-width="120px"-->
    <!--          class="demo-ruleForm"-->
    <!--          status-icon-->
    <!--      >-->
    <!--        <el-form-item label="地址信息" :required="true">-->
    <!--          <el-cascader-->
    <!--              placeholder="请选择省 / 市 / 区"-->
    <!--              v-model="selectedRegion"-->
    <!--              :options="regions"-->
    <!--              :props="props"-->
    <!--          ></el-cascader>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="详细地址" :required="true">-->
    <!--          <el-input type="textarea" :resize="'none'" autosize v-model="ruleForm.region" placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单-->
    <!--元等信息"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="收货人姓名" :required="true">-->
    <!--          <el-input v-model="ruleForm.name"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="手机号" :required="true">-->
    <!--          <div>-->
    <!--            <el-input placeholder="请输入手机号">-->
    <!--              <template #prepend>-->
    <!--                <el-select placeholder="中国大陆 +86" style="width: 130px">-->
    <!--                  <el-option label="抱歉，暂时只支持中国大陆手机号"/>-->
    <!--                </el-select>-->
    <!--              </template>-->
    <!--            </el-input>-->
    <!--          </div>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->


  </div>


</template>

<style scoped>
@import '../assets/InforMation.css';
</style>
