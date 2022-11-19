<template>
  <BasicModal
    v-bind="$attrs"
    width="600px"
    @ok="handleOk()"
    @register="register"
    :footer="null"
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
        <SecondaryTitle :iconType="'print'">销售发票列表</SecondaryTitle>
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
                    <span class="right_span">纸张大小：</span>
                    <a-select  v-model:value="printParameter.size"
                      style="width: 250px;text-align-last: center;">
                      <a-select-option value="a4">A4</a-select-option>
                    </a-select>
                  </div>
                  <div >
                    <span class="right_span">纸张方向：</span>
                    <a-select v-model:value="printParameter.direction"
                      style="width: 250px;text-align-last: center;">
                      <a-select-option value="l">横向</a-select-option>
                      <a-select-option value="p">纵向</a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="special-border-div">
                <span>表尾打印</span>
                <div style="display: inline-block;width: 96%;">
                  <div >
                    <a-checkbox v-model:checked="printParameter.isMark"><span style="font-weight: bold;">制表人</span></a-checkbox>
                    <a-checkbox v-model:checked="printParameter.isDate"><span style="font-weight: bold;">当前日期</span></a-checkbox>
                  </div>
                </div>
              </div>
            </li>
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
  Tabs as ATabs
} from 'ant-design-vue';
import {PrinterOutlined} from '@ant-design/icons-vue'

import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const ATabPane = ATabs.TabPane;
const emit = defineEmits(['register', 'save']);
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
const activeKey: any = ref('');
const formItems: any = ref({});

const year = ref(useCompanyOperateStoreWidthOut().getLoginDate.slice(0, 4))

const userStore: any = useUserStore();
// 数据库模式名称
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const accPrint: any = ref({})

const printParameter = reactive({
  size: 'a4',
  direction: 'l',
  isMark: true,
  isDate: false,
})

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  setModalProps({ minHeight: 400 });
  // 方式2
  dynamicTenantId.value = data.data.dynamicTenantId
  defaultAdName.value = data.data.defaultAdName
  year.value = data.data.year
});

const dateList: any = ref([])
let endDateList: any = ref([])
let strDateList: any = ref([])




async function handleOk() {
  emit('save', unref(printParameter));
  closeModal();
  return true;
}

const loading = ref('false')

function handleClose() {
  closeModal();
}


async function dynamicAdReload(data) {
  defaultAdName.value = data.accId
  dynamicTenantId.value = data.accountMode
  year.value = data.year
  formItems.value.companyName = data.companyName
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

  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
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
