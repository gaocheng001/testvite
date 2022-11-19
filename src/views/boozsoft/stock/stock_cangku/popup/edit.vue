<template>
  <BasicModal
    width="900px"
    :height="490"
    v-bind="$attrs"
    title="仓库信息"
    @ok="handleOk()"
    @cancel="closeOk()"
    :showOkBtn="isEdit"
    :showCancelBtn="isEdit"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <template v-if="openType=='add'" #title>
      <div style="display: flex;color: #0096c7;margin-left: 10px;margin-top: 5px;">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;仓库信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>
    <template v-if="openType=='edit'" #title>
      <div style="display: flex;color: #0096c7;margin-left: 10px;margin-top: 5px;">
        <span style="line-height:40px;font-size: 28px;">
          <FormOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;仓库信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>
    <div
      :class="isEdit ? 'nc-open-content' : 'nc-open-show-content'"
      style="height: 100%; overflow: hidden"
    >
      <div class="open-content-up">
        <br /><br />&emsp;
        <a-radio-group v-model:value="formItems.ckFlag">
          <a-radio value="1">
            <span style="color: #000000; font-weight: bold; font-size: 10px">可用</span>
          </a-radio>
          <a-radio value="0" style="margin-left: -10px">
            <span style="color: #000000; font-weight: bold; font-size: 10px">不可用</span>
          </a-radio>
        </a-radio-group>
        <br />
        <label style="font-size: 18px; width: 150px">仓库名称：</label>
        <a-input
          v-model:value="formItems.ckName"
          class="abc"
          style="width: 70%; border-bottom: 2px solid #000000"
        />
        <span class="red_span">*</span>
        <br /><br /><br />
        <label style="margin-left: 7%">仓库编号：</label>
        <a-input v-model:value="formItems.ckNum" style="width: 22%" @blur="countNum" />
        <span class="red_span">*</span>
        <label>仓库级别：</label>
        <a-select
          v-model:value="formItems.ckLevel"
          show-search
          style="width: 22%; text-align: center"
          allow-clear
        >
          <a-select-option v-for="temp in ckLevelList" :key="temp.value" :value="temp.value">
            {{ temp.title }}
          </a-select-option>
        </a-select>
        <br />
        <label style="margin-left: 7%">管理属性：</label>
        <a-select
          v-model:value="formItems.ckType"
          show-search
          option-filter-prop="children"
          style="width: 22%; text-align: center"
          allow-clear
        >
          <a-select-option v-for="temp in ckTypeList" :key="temp.value" :value="temp.value">
            {{ temp.title }}
          </a-select-option>
        </a-select>
        <span class="red_span"></span>
        <label>所在城市：</label>
        <a-input v-model:value="formItems.ckCity" style="width: 22%" />
        <br />
        <label  style="margin-left: 7%">所属工厂：</label>
        <a-select
          v-model:value="formItems.plantUnique"
          show-search
          option-filter-prop="children"
          style="width: 22%; text-align: center"
          allow-clear
        >
          <a-select-option v-for="temp in sysPlanList" :key="temp.id" :value="temp.id">
            {{ temp.plantNamej }}
          </a-select-option>
        </a-select>
        <span class="red_span"></span>
        <label>仓库注释：</label>
        <a-input v-model:value="formItems.ckRemark" style="width: 22%" />
      </div>
      <div class="open-content-down" style="margin-top: 50px">
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="常用信息">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label style="margin-left: 7%">收/送货地址：</label>
                <a-input v-model:value="formItems.ckAddress" style="width: 22%" />
                <label>联系人及电话：</label>
                <a-input v-model:value="formItems.ckPsnPhone" style="width: 22%" />
                <br />
                <label style="margin-left: 7%">楼/层/室：</label>
                <a-input v-model:value="formItems.ckAddress2" style="width: 22%" />
                <label>国家(地区)：</label>
                <a-select
                  v-model:value="formItems.country"
                  show-search
                  option-filter-prop="children"
                  style="width: 22%; text-align: center"
                  allow-clear
                >
                  <a-select-option
                    v-for="temp in countryList"
                    :key="temp.namech"
                    :value="temp.namech"
                  >
                    {{ temp.namech }}
                  </a-select-option>
                </a-select>
                <br />
                <label style="margin-left: 7%">地球经纬度：</label>
                <a-input v-model:value="formItems.ckJwd" style="width: 22%" />
                <label>全球位置编码：</label>
                <a-input v-model:value="formItems.ckGlobalAddress" readonly style="width: 22%" />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template #footer>
      <div v-if="!isEdit">
        <a-button @click="closeOk()" type="primary">关闭</a-button>
      </div>
      <div v-if="isEdit">
        <a-button @click="closeOk()">取消</a-button>
        <a-button @click="handleOk('1')" type="primary">提交</a-button>
        <a-button v-if="openType=='add'" @click="handleOk('2')" type="primary">保存并新增</a-button>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {
  PlusCircleOutlined,FormOutlined
} from '@ant-design/icons-vue'
  import {
    Tabs as ATabs,
    Select as ASelect,
    Radio as ARadio,
    Input as AInput,
    Statistic as AStatistic,
  } from 'ant-design-vue';
  import { ref, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
import {findByCkNum, findByCkName, ckSave, findByNewCkNum} from '/@/api/record/stock/stock-cangku';
  import { findAll as cangkuLevelFindAll } from '/@/api/record/stock/stock-cangku-level';

  // tab默认
  const activeKey = ref('1');
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const ARadioGroup = ARadio.Group;
  const { createConfirm, createWarningModal, createMessage } = useMessage();
  const emit = defineEmits([
    'save',
    'approveSave',
    'updateKeyWordIsAutoSave',
    'edit_database',
    'register',
  ]);
  const isEdit = ref(true);
  const openType: any = ref('');
  const database: any = ref('');
  const databaseId: any = ref('');
  const formItems: any = ref({});
  const countryList: any = ref([]);
  const sysPlanList: any = ref([]);   // 工厂
  const ckLevelList: any = ref([]);
  const ckTypeList: any = ref([
    { title: '自有仓库', value: '1' },
    { title: '供应商直发仓库', value: '2' },
  ]);

  const [register, { closeModal }] = useModalInner(async (data) => {
    openCompFullLoading();
    openType.value = data.openType;
    database.value = data.database;
    databaseId.value = data.databaseId;
    isEdit.value = data.isEdit;

    // 国家信息
    findAllCountry().then((res) => {
      countryList.value = res.items;
    });

    // 工厂
    findByCorpUniqueCode(data.databaseId).then((res) => {
      if(res.items!==undefined){
        sysPlanList.value = res.items;
      }
    });

    // 仓库级别档案
    cangkuLevelFindAll().then((res) => {
      ckLevelList.value=[]
      res.forEach(item=>{
        let name=item.levelOrder==='1'?'独立'+item.level1:item.level1
        let str=''
        if(item.level1!=null && item.level1!=''){
          str+=name+'\\'
        } if(item.level2!=null && item.level2!=''){
          str+=item.level2+'\\'
        } if(item.level3!=null && item.level3!=''){
          str+=item.level3+'\\'
        } if(item.level4!=null && item.level4!=''){
          str+=item.level4+'\\'
        } if(item.level5!=null && item.level5!=''){
          str+=item.level5+'\\'
        } if(item.level6!=null && item.level6!=''){
          str+=item.level6+'\\'
        }
        ckLevelList.value.push(
          {title:str.substring(0,str.length-1),value:item.id}
        )
        if (data.isEdit && data.data!='') {

        }
        formItems.value.ckLevel=ckLevelList.value[0].value
      })
    });

    formItems.value.ckFlag='1'
    formItems.value.ckType='1'
    formItems.value.country='中国'
    formItems.value.ckGlobalAddress=generateMixed(15)

    if (data.isEdit && data.data!='') {
      formItems.value = data.data;
    }
    if(data.openType=='add'){
      getNewCkNum()
    }
    compState.loading = false;
  });

  async function getNewCkNum() {
    formItems.value.ckNum= await useRouteApi(findByNewCkNum, { schemaName: database })({});
  }
  // 随机数
  const chars=reactive(['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'])
  function generateMixed(n) {
    var res = "";
    for(var i = 0; i < n ; i ++) {
      var id = Math.ceil(Math.random()*35);
      res += chars[id];
    }
    return res;
  }
  /******************* 弹框加载中 **************************/
  import { Loading } from '/@/components/Loading';
  import { findAllCountry } from '/@/api/record/supplier_data/supplier';
  import { useRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {findByCorpUniqueCode} from "/@/api/record/group/im-plant";
  const loadingRef = ref(false);
  const compState = reactive({
    absolute: false,
    loading: false,
    tip: '加载中...',
  });
  function openCompFullLoading() {
    openLoading(false);
  }
  function openLoading(absolute: boolean) {
    compState.absolute = absolute;
    compState.loading = true;
  }
  /******************* END **************************/

  async function countNum() {
    if (formItems.value.ckNum !== '') {
      let temp = await useRouteApi(findByCkNum, { schemaName: database })(formItems.value.ckNum);
      if (temp > 0) {
        return createWarningModal({ content: '仓库编码已存在！' });
      }
    }
  }
  async function countName() {
    if (formItems.value.ckName !== '') {
      let temp2=formItems.value.ckName.indexOf('\\')!=-1
      if(temp2){
        return createWarningModal({ content: '仓库名称不能有\\！' });
      }
      let temp = await useRouteApi(findByCkName, { schemaName: database })(formItems.value.ckName);
      if (temp > 0) {
        return createWarningModal({ content: '仓库名称已存在！' });
      }
    }
  }

  async function handleOk(flag) {
    if (formItems.value.ckNum == '') {
      return createWarningModal({ content: '仓库编码不能为空！' });
    }
    if (formItems.value.ckName == '') {
      return createWarningModal({ content: '仓库名称不能为空！' });
    }else{
      let temp=formItems.value.ckName.indexOf('\\')!=-1
      if(temp){
        return createWarningModal({ content: '仓库名称不能有\\！' });
      }
    }

    let temp=ckLevelList.value.filter(a=>a.value==formItems.value.ckLevel&&a.title.indexOf('独立')!=-1)
    formItems.value.ckIsDuli=temp.length>0?'1':'0'
    await useRouteApi(ckSave, { schemaName: database })(unref(formItems)).then((item) => {
      if(flag=='1'){
        closeOk();
      }else{
        formItems.value={}
        // 国家信息
        findAllCountry().then((res) => {
          countryList.value = res.items;
        });

        // 工厂
        findByCorpUniqueCode(database).then((res) => {
          if(res.items!==undefined){
            sysPlanList.value = res.items;
          }
        });

        // 仓库级别档案
        cangkuLevelFindAll().then((res) => {
          ckLevelList.value=[]
          res.forEach(item=>{
            let name=item.levelOrder==='1'?'独立'+item.level1:item.level1
            let str=''
            if(item.level1!=null && item.level1!=''){
              str+=name+'\\'
            } if(item.level2!=null && item.level2!=''){
              str+=item.level2+'\\'
            } if(item.level3!=null && item.level3!=''){
              str+=item.level3+'\\'
            } if(item.level4!=null && item.level4!=''){
              str+=item.level4+'\\'
            } if(item.level5!=null && item.level5!=''){
              str+=item.level5+'\\'
            } if(item.level6!=null && item.level6!=''){
              str+=item.level6+'\\'
            }
            ckLevelList.value.push(
              {title:str.substring(0,str.length-1),value:item.id}
            )

            formItems.value = {
              id: null,
              ckFlag: '1',
              ckName: '',
              ckNum: '',
              ckLevel: ckLevelList.value[0].value,
              ckType: '1',
              ckCity: '',
              ckRemark: '',
              ckAddress: '',
              ckPsnPhone: '',
              ckAddress2: '',
              country: '中国',
              ckJwd: '',
              plantUnique: '',
              ckGlobalAddress: generateMixed(15),
            };
          })
        });
      }
    });
  }

  const closeOk = () => {
    emit('closeOk');
    closeModal();
  };
</script>
<style>
  .vben-basic-title {
    color: rgb(1, 129, 226) !important;
  }

  .ant-modal-body {
    padding: 0px;
    border: 1px solid rgb(1, 129, 226);
    border-left: none;
    border-right: none;
  }
</style>
<style lang="less" scoped>
  :deep(.ant-calendar-picker-input.ant-input),
  :deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
    width: 100%;
    font-weight: bold;
  }

  :deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
    border: none !important;
  }

  .vben-basic-title {
    color: rgb(1, 129, 226) !important;
  }

  .ant-modal-body {
    padding: 0px;
    border: 1px solid rgb(1, 129, 226);
    border-left: none;
    border-right: none;
  }

  .red_span {
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }

  .nc-open-content {
    input {
      width: 30%;
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
      font-weight: bold;
      font-size: 14px;
    }

    .abc {
      border-bottom: 2px solid #666666 !important;
      font-size: 18px;
    }

    .ant-input:focus {
      box-shadow: none;
    }

    :deep(.ant-select-selector) {
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
      font-weight: bold;
      font-size: 14px;
    }

    label {
      text-align: left;
      width: 130px;
      display: inline-block;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 2em;
      color: #535353;
      font-size: 13px;
      margin-left: 2em;
      font-weight: bold;
    }

    .open-content-down {
      margin-top: 5%;

      .ant-tabs-tab-active::before {
        position: absolute;
        top: 0px;
        left: 0;
        width: 100%;
        border-top: 2px solid transparent;
        border-radius: 2px 2px 0 0;
        transition: all 0.3s;
        content: '';
        pointer-events: none;
        background-color: rgb(1, 143, 251);
      }
    }
  }

  .nc-open-show-content {
    input {
      width: 30%;
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
      font-weight: bold;
      font-size: 14px;
    }

    .abc {
      border-bottom: 2px solid #666666 !important;
      font-size: 18px;
    }

    pointer-events: none;
    cursor: default;

    .ant-input:focus {
      box-shadow: none;
    }

    :deep(.ant-select-selector) {
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
      font-weight: bold;
      font-size: 14px;
    }

    label {
      text-align: left;
      width: 120px;
      display: inline-block;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 2em;
      color: #535353;
      font-size: 13px;
      margin-left: 2em;
      font-weight: bold;
    }

    .open-content-down {
      margin-top: 5%;

      :deep(.ant-tabs-tab) {
        pointer-events: auto;
      }

      .ant-tabs-tab-active::before {
        position: absolute;
        top: 0px;
        left: 0;
        width: 100%;
        border-top: 2px solid transparent;
        border-radius: 2px 2px 0 0;
        transition: all 0.3s;
        content: '';
        background-color: rgb(1, 143, 251);
      }
    }
  }

  :deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab) {
    height: 40px;
    margin: 0;
    margin-right: 2px;
    padding: 0 16px;
    line-height: 38px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-weight: bold;
    font-size: 13px;
  }
</style>
