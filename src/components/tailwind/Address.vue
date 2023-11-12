<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div style="margin-top: 20px" class="sm:flex sm:items-center flex justify-between items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">收货地址</h1>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="showModal2();address()" type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">添加收货地址</button>
      </div>
    </div>
    <p class="mt-2 text-sm text-gray-700"><el-alert :closable="false" style="background-color: #e3f2fd;margin: 20px 0 0 0" :title="'已保存了'+(number)+'条地址，还能保存'+(20-number)" type="info" show-icon/></p>

    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">收货人</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">所在地区</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">详细地址</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">手机号</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">操作</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">默认地址</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(plan, planIdx) in tableData.value" :key="plan.id">
          <td :class="[planIdx === 0 ? '' : 'border-t border-transparent', 'relative py-4 pl-4 pr-3 text-sm sm:pl-6']">
            <div class="font-medium text-gray-900">
              {{ plan.consignee }}
              <span v-if="plan.isCurrent" class="ml-1 text-indigo-600">(Current Plan)</span>
            </div>
            <div class="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
              <span>{{ plan.address }} / {{ plan.fullAddress }}</span>
              <span class="hidden sm:inline">·</span>
              <span>{{ plan.phoneNumber }}</span>
            </div>
            <div v-if="planIdx !== 0" class="absolute -top-px left-6 right-0 h-px bg-gray-200" />
          </td>
          <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">{{ plan.address }}</td>
          <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">{{ plan.fullAddress }}</td>
          <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">{{ plan.phoneNumber }}</td>
          <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'px-3 py-3.5 text-sm text-gray-500']">
            <button style="margin-right: 10px" @click="editAddress(plan);address()" type="button" class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
              修改
            </button>
            <button @click="schu(plan);address()" type="button" class="inline-flex justify-center rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm transition duration-500 ease select-none hover:bg-red-600">
              删除
            </button>
          </td>
          <td :class="[planIdx === 0 ? '' : 'border-t border-transparent', 'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6']">
            <button v-if="plan.defaultOperate === 0" @click="setDefaultAddress(plan)" type="button" class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
              设为默认
            </button>
            <button v-else class="default">已为默认</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--        添加收货地址弹窗-->
  <a-modal style="text-align: center;" title="添加收货地址"
           v-model:open="open2" @ok="addAddress()" ok-text="添加" cancel-text="取消">
    <el-form
        style="margin: 25px 0 0 -40px"
        ref="ruleFormRef"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="收货人" :required="true">
        <el-input v-model="ruleForm.consignee" placeholder="不能超过20个字符"/>
      </el-form-item>
      <el-form-item label="所在地区" :required="true">
        <el-cascader style="width: 100%"
                     placeholder="请选择省 / 市 / 区"
                     v-model="selectedRegion"
                     :options="regions"
                     :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" :required="true">
        <el-input type="textarea" :resize="'none'" autosize v-model="ruleForm.fullAddress"
                  placeholder="请输入详细地址信息，如乡镇、道路、门牌号、小区、楼栋号、单元等信息"/>
      </el-form-item>
      <el-form-item label="手机号" :required="true">
        <div style="width: 100%">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号">
            <template #prepend>
              <el-select placeholder="中国大陆 +86" style="width: 130px">
                <el-option label="抱歉，暂时只支持中国大陆手机号"/>
              </el-select>
            </template>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
  </a-modal>

  <!--        修改收货地址弹窗-->
  <a-modal style="text-align: center;" title="修改收货地址"
           v-model:open="open1" @ok="handleOk1" ok-text="修改" cancel-text="取消">
    <el-form
        style="margin: 25px 0 0 -40px"
        ref="ruleFormRef"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="收货人" :required="true">
        <el-input v-model="currentAddress.consignee" placeholder="不能超过20个字符"/>
      </el-form-item>
      <el-form-item label="所在地区" :required="true">
        <el-cascader
            style="width: 100%"
            placeholder="请选择省 / 市 / 区"
            v-model="currentAddress.address"
            :options="regions"
            :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" :required="true">
        <el-input type="textarea" :resize="'none'" autosize v-model="currentAddress.fullAddress"
                  placeholder="请输入详细地址信息，如乡镇、道路、门牌号、小区、楼栋号、单元等信息"/>
      </el-form-item>
      <el-form-item label="手机号" :required="true">
        <div style="width: 100%">
          <el-input placeholder="请输入手机号" v-model="currentAddress.phoneNumber">
            <template #prepend>
              <el-select placeholder="中国大陆 +86" style="width: 130px">
                <el-option label="抱歉，暂时只支持中国大陆手机号"/>
              </el-select>
            </template>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script setup>
import {ref, onMounted, computed, reactive, watch } from 'vue';
import store from "@/store";
import axios from 'axios';
import {addAddres, deleteAddress, getAddress, getUser, updateAddress, updateDefaultAddress} from "@/api/api";

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');
const imageUrl1 = ref('')
const empty = ref(false)
const number = ref(0)


const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await getUser(userId);
    const data = response.data;
    if (data.code === 0) {
      userInfo.value = data.data;
      avatarUrl.value = data.data.userAvatar; // 获取头像图片URL
      imageUrl1.value = data.data.userAvatar;
    } else {
      console.error('获取用户信息失败');
    }
  } else {
    setTimeout(fetchUserInfo, 1);
  }
};

onMounted(fetchUserInfo);


const selectedRegion = ref([]);
const regions = ref([]);
const props = {
  value: 'value',
  label: 'label',
  children: 'children'
};

const address = async () => {
  try {
    const response = await axios.get('https://www.mxnzp.com/api/address/list?app_id=uiawjmtjkygeqlif&app_secret=UDBzbzNRd2psc3B1UnZ6RTVBZEFEUT09');
    const data = response.data;
    if (data.code === 1) {
      regions.value = data.data.map(region => ({
        value: region.name,
        label: region.name,
        children: region.pchilds.map(city => ({
          value: city.name,
          label: city.name,
          children: city.cchilds.map(district => ({
            value: district.name,
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
}


const ruleFormRef = ref()
const ruleForm = reactive({
  consignee: '',
  fullAddress: '',
  phone: '',
})


const tableData = reactive({
  data: [
    {
      consignee: '',
      address: '',
      fullAddress: '',
      phoneNumber: '',
    },
  ],
  version: 0,
});

let open = ref(false)
let open1 = ref(false)
let open2 = ref(false)
const land = computed(() => store.state.userInfo.land)

let currentMessageInstance = null
const showMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例
  currentMessageInstance = ElMessage({message, type: 'error'})
}

const showSuccessMessage = (message) => {
  // 如果当前有消息正在显示，先关闭它
  if (currentMessageInstance) {
    currentMessageInstance.close()
  }

  // 显示新的消息并保存该消息实例，消息类型设置为 'success'
  currentMessageInstance = ElMessage({message, type: 'success'})
}


const showModal1 = () => {
  if (land.value) {
    open1.value = true
  } else {
    showMessage('请先登录')
  }
}

const showModal2 = () => {
  if (land.value) {
    open2.value = true
  } else {
    showMessage('请先登录')
  }
}

const fetchUserAddresses = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await getAddress(userId);
    const data = response.data;
    if (data.code === 200) {
      empty.value = data.data.length === 0;

      number.value = data.data.length;

      let addresses = data.data.map(item => ({
        id: item.id,
        consignee: item.consignee,
        address: item.area,
        fullAddress: item.fullAddress,
        phoneNumber: item.phone,
        defaultOperate: item.defaultOperate,
      }));
      addresses.sort((a, b) => b.defaultOperate - a.defaultOperate);
      tableData.value = addresses;
    } else {
      console.error('获取用户收货地址失败');
    }
  } else {
    setTimeout(fetchUserAddresses, 1);
  }
};

onMounted(fetchUserAddresses);
watch(() => tableData.version, fetchUserAddresses);

const addAddress = async () => {
  // 验证表单字段是否都已填写
  if (!ruleForm.consignee || selectedRegion.value.length === 0 || !ruleForm.fullAddress || !ruleForm.phone) {
    showMessage('请填写所有字段');
    return;
  } else {
    // 使用正则表达式验证手机号码
    const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phoneNumberReg.test(ruleForm.phone)) {
      // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
      showMessage('请输入正确的手机号码');
      return;
    }
  }

  try {
    const response = await addAddres(userid.value, ruleForm.consignee, selectedRegion.value.join('/'), ruleForm.fullAddress, ruleForm.phone);

    if (response.data.code === 200) {
      showSuccessMessage(response.data.msg);
      open2.value = false
      // 通过更新表格值来刷新收货地址
      tableData.version++;
    } else {
      showMessage(response.data.msg)
    }
  } catch (error) {
    if (error.response) {
      // 请求已经发送，服务器也已响应，但是状态码超出了 2xx 的范围
      showMessage(error.response.data.msg);
    } else if (error.request) {
      // 请求已经发送，但没有收到任何服务器响应
      showMessage('服务器没有响应');
    }
  }
};

const currentAddress = ref(null);
const currentAddressId = ref(null);
const editAddress = (row) => {
  currentAddressId.value = row.id;
  // 拆分地址字符串为数组
  const addressArray = row.address.split('/');
  currentAddress.value = {
    ...row,
    address: addressArray, // 将拆分后的数组赋值给 address 属性
  };
  showModal1();
};

const handleOk1 = async () => {
  // 验证表单字段是否都已填写
  if (!currentAddress.value.consignee || currentAddress.value.address.join('/') === null || !currentAddress.value.fullAddress || !currentAddress.value.phoneNumber) {
    showMessage('请填写所有字段');
    return;
  } else {
    // 使用正则表达式验证手机号码
    const phoneNumberReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phoneNumberReg.test(currentAddress.value.phoneNumber)) {
      // 如果电话号码不符合正则表达式，显示错误信息并返回，不继续发送请求
      showMessage('请输入正确的手机号码');
      return;
    }
  }
  try {
    const params = {
      id: currentAddressId.value,
      consignee: currentAddress.value.consignee,
      area: currentAddress.value.address.join('/'), // 将数组组合成字符串
      fullAddress: currentAddress.value.fullAddress,
      phone: currentAddress.value.phoneNumber,
    };
    const response = await updateAddress(params);
    if (response.data.code === 200) {
      open1.value = false
      tableData.version++;
      showSuccessMessage(response.data.msg)
    } else {
      showMessage(response.data.msg)
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};

const schu = (row) => {
  ElMessageBox.confirm(
      '确认要删除该地址吗?',
      '删除地址',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  )
      .then(() => {
        removeAddress(row.id);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

const removeAddress = async (id) => {
  try {
    const response = await deleteAddress(id);
    if (response.data.code === 200) {
      showSuccessMessage(response.data.msg);
      // 删除成功后，重新获取一次用户地址列表
      await fetchUserAddresses();
    } else {
      showMessage(response.data.msg);
    }
    tableData.version++
  } catch (error) {
    showSuccessMessage('删除失败');
  }
}

const setDefaultAddress = async (row) => {
  try {
    // 找到当前的默认地址
    const currentDefault = tableData.value.find(item => item.defaultOperate === 1);
    if (currentDefault) {
      // 取消当前的默认地址
      await updateDefaultAddress(currentDefault.id, 0);
    }
    // 设置新的默认地址
    let response = await updateDefaultAddress(row.id, 1);
    if (response.data.code === 200) {
      // 如果成功更新了默认地址，重新获取地址列表
      await fetchUserAddresses();
      showSuccessMessage(response.data.msg)
    } else {
      showMessage('设置默认地址失败：' + response.data.msg);
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};
let code = ref('');
</script>

<style scoped>
@import '../../assets/Tailwind.css';
.default{
  cursor: default;
  width: 80px;
  height: 30px;
  border: 1px solid rgb(179,225,157);
  border-radius: 3px;
  background: rgb(240,249,235);
  color: #67c23a;
}
</style>
