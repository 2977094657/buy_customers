<script setup>
import {ref, onMounted, computed, reactive, watch,provide} from 'vue';
import store from "@/store";
import axios from 'axios';
import {LocationInformation} from "@element-plus/icons-vue";

const userInfo = ref(null);
const userid = computed(() => store.state.userInfo.userId)
const avatarUrl = ref('');
const imageUrl1 = ref('')
const empty = ref(false)
const number = ref()


const fetchUserInfo = async () => {
  const userId = userid.value;
  if (userId) {
    const response = await fetch(`http://1.14.126.98:8081/user/all?userId=${userId}`);
    const data = await response.json();
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

onMounted(async () => {
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
});


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
    const response = await fetch(`http://1.14.126.98:8081/address/all?userId=${userId}`);
    const data = await response.json();
    if (data.code === 200) {
      if (data.data.length === 0) {
        empty.value = true
      } else {
        empty.value = false
        number.value = data.data.length
        let addresses = data.data.map(item => ({
          id: item.id,
          consignee: item.consignee,
          address: item.area,
          fullAddress: item.fullAddress,
          phoneNumber: item.phone,
          defaultOperate: item.defaultOperate,
        }));
        // 按照默认地址排序，将默认地址放在第一位
        addresses.sort((a, b) => b.defaultOperate - a.defaultOperate);
        tableData.value = addresses;
        // 找到默认地址并将它的id赋值给selectedAddress
        const defaultAddress = addresses.find(address => address.defaultOperate === 1);
        if (defaultAddress) {
          selectedAddress.value = defaultAddress.id;
        }
      }
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
    const response = await axios.post('http://1.14.126.98:8081/address/add', null, {
      params: {
        userId: userid.value,
        consignee: ruleForm.consignee,
        area: selectedRegion.value.join('/'),
        fullAddress: ruleForm.fullAddress,
        phone: ruleForm.phone,
      }
    });

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
    const response = await axios.put('http://1.14.126.98:8081/address/update', null, {params});
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

const setDefaultAddress = async (row) => {
  try {
    // 找到当前的默认地址
    const currentDefault = tableData.value.find(item => item.defaultOperate === 1);
    if (currentDefault) {
      // 取消当前的默认地址
      await axios.put('http://1.14.126.98:8081/address/updateDefault', null, {
        params: {
          id: currentDefault.id,
          defaultOperate: 0,
        },
      });
      // 更新本地数据
      currentDefault.defaultOperate = 0;
    }
    // 设置新的默认地址
    const response = await axios.put('http://1.14.126.98:8081/address/updateDefault', null, {
      params: {
        id: row.id,
        defaultOperate: 1,
      },
    });
    if (response.data.code === 200) {
      showSuccessMessage(response.data.msg)
      // 更新本地数据
      row.defaultOperate = 1;
    } else {
      showMessage('设置默认地址失败：' + response.data.msg);
    }
  } catch (error) {
    showMessage('请求接口出错：' + error.message);
  }
};

let code = ref('');

let selectedAddress = ref(null);
provide('selectedAddress', selectedAddress);


watch(selectedAddress, async (newId) => {
  // 找到被选中的地址
  const selected = tableData.value.find(item => item.id === newId);
  if (selected) {
    // 从数组中删除被选中的地址
    const index = tableData.value.indexOf(selected);
    tableData.value.splice(index, 1);
    // 将被选中的地址放到数组的最前面
    tableData.value.unshift(selected);
  }
});

watch(selectedAddress, newId => {
  const selected = tableData.value.find(item => item.id === newId);
  if (selected) {
    // 触发事件并传递数据
    const event = new CustomEvent('selected-address-changed', {
      detail: selected,
    });
    window.dispatchEvent(event);
  }
});
</script>

<template>
  <div class="user-info-wrapper">
    <div v-if="userInfo" class="user-info-container">
      <el-button style="position: absolute;z-index: 10;right: 270px;top: 288px;" type="warning" size="large" link @click="showModal2()">
        使用新地址
      </el-button>
      <div style="margin: 0 50px 20px 20px">
        <el-alert :closable="false" style="background-color: #e3f2fd;margin: 20px 0 0 0"
                  :title="'已保存了'+(number)+'条地址，还能保存'+(20-number)" type="info" show-icon/>

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


        <!--        收货地址列表-->
        <div v-for="(address, index) in tableData.value" :key="index" class="address-item" :class="{ 'selected-address': selectedAddress === address.id }">
          <div class="address-info">
            <!-- 条件渲染 "寄送至" 字样 -->
            <span v-if="selectedAddress === address.id" style="margin: 0 10px 0 0;color: #F40;font-weight: 700;font-size: 12px;position: relative;top: -5px;">
            <el-icon style="font-size: 25px;top: 5px;"><LocationInformation /></el-icon>
              寄送至
            </span>
            <!-- 添加单选按钮 -->
            <el-radio v-model="selectedAddress" :label="address.id">
              <div>
                {{ address.address }}
                {{ address.fullAddress }}
                （{{ address.consignee }} 收）
                <span style="color: rgb(128,128,128);">
                {{ address.phoneNumber }}
                </span>
              </div>
            </el-radio>
            <div class="address-actions" :class="{ 'address-actions1': selectedAddress === address.id }">
              <el-button size="small" type="primary" @click="editAddress(address)">修改</el-button>
              <span style="color: #67c23a;margin: 0 0 0 20px" v-if="address.defaultOperate === 1">默认地址</span>
              <el-button size="small" type="warning" v-if="address.defaultOperate === 0" @click="setDefaultAddress(address)">设为默认</el-button>
            </div>
          </div>
        </div>


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
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/InforMation.css';
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

:where(.css-dev-only-do-not-override-eq3tly).ant-modal .ant-modal-footer {
  text-align: center;
  background: transparent;
  padding: 30px 0 20px 0;
}

:where(.css-dev-only-do-not-override-eq3tly).ant-btn {
  left: 28px;
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
  margin: 0 30px 0 0;
}

.address-item {
  margin: 10px 10px 10px 78px;
  padding: 5px;
}

.address-info {

}

.address-actions {
  margin: -30px 0 0 700px;
}

.selected-address {
  margin: 10px 10px 10px 0;
  padding: 5px;
  outline: 1px solid #f40;
  background-color: #fff0e8;
  box-shadow: 5px 5px 0 #f3f3f3;
}

.address-actions1{
  margin: -30px 0 0 778px;
}
</style>
