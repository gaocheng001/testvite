<template>
  <BasicModal
    v-bind="$attrs"
    width="600px"
    @ok="handleOk()"
    @register="register"
    :footer="null"
    :loading="loading"
    :canFullscreen="false"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <PrinterOutlined  style="margin: 0 10px;font-size: 14px;"/>
        <span style="font-size: 14px">打印</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="con-left">
        <SecondaryTitle :iconType="'print'">{{openTitle}}</SecondaryTitle>
        <div class="open-content-up">
          <ul style="width: 100%;display: inline-block;">
            <li>
              <div class="special-border-div">
                <span>业务范围</span>
                <AccountPicker theme="three" readonly/>
              </div>
            </li>
            <li>
              <div class="special-border-div">
                <span>打印条件</span>
                <div style="display: inline-block;width: 96%;">
                  <div >
                    <span class="right_span">打印模板：</span>
                    <a-select  v-model:value="printParameter.tempId" :options="printStencils.map(it=>({value: it.id,label:`[${typeList.filter(a=>a.value==it.templateType)[0]?.label}]${it.templateName}`}))"
                               style="width: 250px;text-align-last: center;" @change="showChange">
                    </a-select>
                  </div>
                  <div>
                    <span class="right_span">纸张大小：</span>
                    <a-select  v-model:value="printParameter.template"
                      style="width: 250px;text-align-last: center;" @change="showChange2">
                      <a-select-option value="a4l">A4横向</a-select-option>
                      <a-select-option value="a4p">A4纵向</a-select-option>
                      <a-select-option value="p2">二等分</a-select-option>
                      <a-select-option value="p3">三等分</a-select-option>
                    </a-select>
                  </div>
                  <div >
                    <span class="right_span">纸张方向：</span>
                    <a-select v-model:value="printParameter.direction"
                      style="width: 250px;text-align-last: center;color: black;"  :disabled="true">
                      <a-select-option value="l">横向</a-select-option>
                      <a-select-option value="p">纵向</a-select-option>
                      <template #suffixIcon></template>
                    </a-select>
                  </div>
                  <div >
                    <span class="right_span">打印行数：</span>
                    <a-input-number v-model:value="printParameter.rowNumber" :min="1" :max="30" style="width: 250px;color: black;text-align-all: center;" />
                  </div>
                </div>
              </div>
            </li>
<!--            <li>
              <div class="special-border-div">
                <span>表尾打印</span>
                <div style="display: inline-block;width: 96%;">
                  <div >
                    <a-checkbox v-model:checked="printParameter.isMark"><span style="font-weight: bold;">制表人</span></a-checkbox>
                    <a-checkbox v-model:checked="printParameter.isReview"><span style="font-weight: bold;">审核人</span></a-checkbox>
                  </div>
                </div>
              </div>
            </li>-->
          </ul>
        </div>
      </div>
      <div  class="con-right right-btns">
        <a-button @click="handleOk"  type="primary" shape="round"  style="width: 100px">打印</a-button>
        <a-button @click="handleClose" shape="round" style="width: 100px;margin-top: 10px">取消</a-button>
      </div>
    </div>

<!--    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose()">取消</a-button>
          <a-button @click="handleOk()" type="primary">PDF打印</a-button>
        </div>
      </div>
    </template>-->
  </BasicModal>
</template>

<script lang="ts" setup="props, { content }">
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Checkbox as ACheckbox,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs,InputNumber as AInputNumber
} from 'ant-design-vue';
import {PrinterOutlined} from '@ant-design/icons-vue'

import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const ATabPane = ATabs.TabPane;
const emit = defineEmits(['register', 'save']);
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
import {findStencil, findTree} from "/@/api/record/stock/stock-template";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
const formItems: any = ref({});


const userStore: any = useUserStore();
// 数据库模式名称
const dynamicTenantId = ref(getCurrentAccountName(true))
const openTitle = ref('')

const printStencils: any = ref([])
const typeList = [{value:'0',label:'系统'},{value:'1',label:'A4横向'},{value:'2',label:'A4纵向'},{value:'3',label:'二等分'},{value:'4',label:'三等分'}]
const printParameter = reactive({
  template: '',
  direction: 'l',
  rowNumber: 1,
  isMark: true,
  isReview: false,
  tempId: '',
  list: []
})

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  setModalProps({ minHeight: 350 });
  dynamicTenantId.value = data.dynamicTenantId
  printStencils.value = await useRouteApi(findTree,{schemaName: dynamicTenantId})({belong: data.mark})
  openTitle.value = ( data?.name || '打印选项')
});

const {
  createWarningModal,
} = useMessage()

const loading = ref(false)
async function handleOk() {
  loading.value = true
  if (hasBlank(printParameter.tempId)){
    createWarningModal({title:'温馨提示',content: '请先选择打印模版！'})
  }else if (hasBlank(printParameter.template)){
    createWarningModal({title:'温馨提示',content: '请先选择打印大小！'})
  }else{
    let tempList = await useRouteApi(findStencil, { schemaName: dynamicTenantId })({'selectValue': printParameter.tempId})
    if (tempList == null || tempList.length == 0){
      createWarningModal({title:'温馨提示',content: '未找到相关模版，请先检查打印模版！'})
    }else {
      printParameter.list = tempList
      emit('save', unref(printParameter));
      loading.value = false
      closeModal();
      return true;
    }
  }
  loading.value = false
}

function handleClose() {
  closeModal();
}


const showChange = (v) => {
 let e = printStencils.value.filter(it=>it.id == v)[0]
  printParameter.direction = 'p'
  if (e.templateType == '1'){
    printParameter.template = 'a4l'
    printParameter.direction = 'l'
    printParameter.rowNumber = 20
  }else if (e.templateType == '2'){
    printParameter.rowNumber = 30
    printParameter.template = 'a4p'
  }else if (e.templateType == '3'){
    printParameter.rowNumber = 8
    printParameter.template = 'p2'
  }else if (e.templateType == '4'){
    printParameter.rowNumber = 4
    printParameter.template = 'p3'
  }else {
    printParameter.rowNumber = 1
    printParameter.template =''
  }
}

const showChange2 = (v) => {
  if (v == 'a4l'){
    printParameter.direction = 'l'
    printParameter.rowNumber = 20
  }else {
    printParameter.direction = 'p'
    if (v == 'a4p'){
       printParameter.rowNumber = 30
    }else if (v == 'p2'){
       printParameter.rowNumber = 8
    }else {
       printParameter.rowNumber = 4
    }
  }
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  width: 100%;

  .open-content-title {
    > div {
      display: inline-block;
    }

    > div:nth-of-type(1) {
      width: 200px;
      background-color: #efeeee;
      color: black;
      font-size: 20px;
      text-align: center;
      padding: 5px 10px
    }
  }

  .open-content-up {
    position: relative;

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
      background-color: #65cbec;
      color: white;
      font-size: 16px;
      text-align: left;
      padding: 5px 10px;
    }

    .ocup-position:nth-of-type(1) {
      top: 0px;
    }

    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 0 10px;

      li {
        margin: 10px 0;

        span {
          font-size: 14px;
          color: #747272;
        }

        .right_span{
          display: inline-block;
          width: 90px !important;
        }

        /*> span:nth-of-type(1), .right_span {
          display: inline-block;
          width: 120px;
        }*/

        .ant-select {
          font-size: 14px;
        }
        :deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input)) {
          .ant-select-selector {
            background-color: white !important;
            color: black !important;
          }
        }

      }


    }
  }

  .open-content-foot {
    display: block;
    position: fixed;
    margin-top: 43px;
  }

  .ant-tabs-tabpane-active {
    overflow-y: auto;
    height: 400px;
  }

  .ant-select-selection-search-input {
    border-bottom: none !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-input) {
    background: none !important;
  }

  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper),.ant-input-number {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
    .ant-select-selection-item{
      font-weight: bold;
    }
  }

  label:not(.ant-radio-button-wrapper) {
    text-align: right;
    width: 110px;
    padding: 5px 10px;
  }

  .ant-radio-group {
    .ant-radio-wrapper {
      width: 70px;

      .ant-radio-input {
        border-color: slategrey;
      }
    }

    p:nth-of-type(2) {
      margin-bottom: 0;
    }
  }

  :deep(.ant-picker-range),:deep(.ant-picker) {
    background: none;
    border: none;
    border-bottom: 1px solid #bdb9b9;

    input {
      text-align: center;
    }
  }
  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 20px 0;

    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      font-size: 15px;
      background: white;
      padding: 0 15px;
    }

    > div {
      margin: 15px;
      color: black;
      display: flex;

      .sbd-left {
        width: 60%;

        .ant-radio-group {
          .ant-radio-wrapper {
            width: 11% !important;
            text-align: left;

            .ant-radio-input {
              border-color: slategrey;
            }
          }
        }
      }

      .sbd-right {
        width: 40%;
        padding: 2% 5% 0;

        > div:nth-of-type(2) {
          margin-top: 14px;
        }

        .ant-radio-button-wrapper {
          color: #0096c7;
        }
      }

    }
  }
  display: inline-flex;
  justify-content: space-between;
  .con-left{
    width: 75%;
  }
  .con-right{
    width: 25%;
    background-color: #f1f1f1;
    padding: 5%;
    .right-btns{
      width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 490px;
      :deep(.ant-btn-primary:hover){
        border: 1px solid #5f375c;
      }
    }
  }
}

:deep(.ant-cascader-input){
  border: none;
  border-bottom: 1px solid #bdb9b9;
}
</style>
