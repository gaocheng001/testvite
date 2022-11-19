<template>
  <BasicModal
    title="总账打印"
    v-bind="$attrs"
    width="800px"
    @ok="handleOk()"
    okText="PDF打印"
    @register="register"
  >
    <div class="nc-open-content" style="height: 100%">
      <div class="open-content-up">
        <div class="ocup-position"> 系统方案</div>

        <a-tabs v-model:activeKey="activeKey" tabPosition="left" type="card">
          <a-tab-pane key="" tab="标准模式">
            <ul>
              <li>
                <AccountPicker readonly theme="one" @reloadTable="dynamicAdReload"/>
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="formItems.printKemu">
                  <span>打印范围：</span>
                  <a-radio value="1" style="width: 150px;">
                    当前页面
                  </a-radio>
<!--                  <a-radio value="2" style="width: 150px;">-->
<!--                    全部科目-->
<!--                  </a-radio>-->
                </a-radio-group>
              </li>
<!--              <li>-->
<!--                <span>期&emsp;&emsp;间：</span>-->
<!--                <a-select-->
<!--                  v-model:value="formItems.strDate"-->
<!--                  show-search-->
<!--                  style="width: 150px"-->
<!--                  @focus="focusStrDate"-->
<!--                  @change="handleChangeStrDate"-->
<!--                >-->
<!--                  <a-select-option-->
<!--                    v-for="item in strDateList"-->
<!--                    :key="item.id"-->
<!--                    :value="item.value"-->
<!--                  >-->
<!--                    {{ item.value }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--                <span>&emsp;~&emsp;</span>-->
<!--                <a-select-->
<!--                  v-model:value="formItems.endDate"-->
<!--                  show-search-->
<!--                  style="width: 150px"-->
<!--                  @focus="focusEndDate"-->
<!--                  @change="handleChangeEndDate"-->
<!--                >-->
<!--                  <a-select-option-->
<!--                    v-for="item in endDateList"-->
<!--                    :key="item.id"-->
<!--                    :value="item.value"-->
<!--                  >-->
<!--                    {{ item.value }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </li>-->
              <li>
                <a-radio-group style="width: 100%" v-model:value="formItems.paperFangxiang">
                  <span>纸张方向：</span>
                  <a-radio value="1" style="width: 150px;">
                    A4横向&emsp;
                  </a-radio>
<!--                  <a-radio value="2" disabled style="width: 150px;">-->
<!--                    A4竖向&emsp;-->
<!--                  </a-radio>-->
                </a-radio-group>
              </li>
<!--              <li>-->
<!--                <div-->
<!--                  style="width: 100%;background: #ffffff;position: relative;margin-top:20px;border: 1px solid #999999;">-->
<!--                  <div-->
<!--                    style="position: absolute;background: #ffffff; top: -15px;left: 20px;padding: 0 10px;">-->
<!--                    打印边距-->
<!--                  </div>-->
<!--                  <div style="margin: 20px 20px 10px;">-->
<!--                    <span>左边距：</span>-->
<!--                    <a-input-number v-model:value="formItems.paperLeft" :disabled="true" style="width:100px;"/>-->
<!--                    <EditOutlined/>-->
<!--                    &emsp;&emsp;-->
<!--                    <span>右边距：</span>-->
<!--                    <a-input-number v-model:value="formItems.paperRight" :disabled="true" style="width:100px;"/>-->
<!--                    <EditOutlined/>-->
<!--                    <br/>-->
<!--                    <span>上边距：</span>-->
<!--                    <a-input-number v-model:value="formItems.paperTop" :disabled="true" style="width:100px;"/>-->
<!--                    <EditOutlined/>-->
<!--                    &emsp;&emsp;-->
<!--                    <span>下边距：</span>-->
<!--                    <a-input-number v-model:value="formItems.paperBottom" :disabled="true" style="width:100px;"/>-->
<!--                    <EditOutlined/>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </li>-->
              <li>
                <div style="height:30px;"></div>
              </li>
              <li>
<!--                <a-checkbox v-model:checked="formItems.qichu" style="width: 190px;text-align: left;">-->
<!--                  有期初无发生也打印-->
<!--                </a-checkbox>-->
                <a-checkbox v-model:checked="formItems.printUser" style="width: 130px">
                  打印制表人
                </a-checkbox>
                <a-checkbox v-model:checked="formItems.printBz" style="width: 120px">
                  打印币种
                </a-checkbox>
              </li>
            </ul>
          </a-tab-pane>
<!--          <a-tab-pane key="0" tab="套打模式">-->
<!--            <ul>-->
<!--              <li>-->
<!--                <span>核算单位：</span>-->

<!--                <a-select-->
<!--                  mode="multiple"-->
<!--                  option-label-prop="label"-->
<!--                  placeholder="可多选"-->
<!--                  style="width: 400px;"-->
<!--                >-->
<!--                  <a-select-option label="湖北万亚" value="湖北万亚"> 湖北万亚</a-select-option>-->
<!--                  <a-select-option label="北京希格" value="北京希格"> 北京希格</a-select-option>-->
<!--                </a-select>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </a-tab-pane>-->
        </a-tabs>
      </div>
    </div>

    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose()">取消</a-button>
          <a-button v-if="formItems.printKemu==1" @click="handleOk()" type="primary">PDF打印</a-button>
<!--          <a-button @click="handleOk()" type="primary">直接打印</a-button>-->
        </div>
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup="props, { content }">
import {ref, unref, onMounted, reactive} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {PageWrapper} from '/@/components/Page';
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  InputNumber as AInputNumber,
  Checkbox as ACheckbox,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  Table as ATable,
  Tabs as ATabs,
  message,
  Modal as AModal
} from 'ant-design-vue';
import {EditOutlined} from '@ant-design/icons-vue'

import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findPeriodByAccontId} from "/@/api/record/generalLedger/data";
import {findAccPrintByAccIdAndMenuName, saveAccPrint} from "/@/api/record/system/group-acc-print";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const ATabPane = ATabs.TabPane;
const emit = defineEmits(['register', 'save']);

const activeKey: any = ref('');
const formItems: any = ref({});

const year = ref(useCompanyOperateStoreWidthOut().getLoginDate.slice(0, 4))

const userStore: any = useUserStore();
// 数据库模式名称
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const accPrint: any = ref({})

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  dynamicTenantId.value = data.data.dynamicTenantId
  defaultAdName.value = data.data.defaultAdName
  year.value = data.data.year
  /*findAccPrintByAccIdAndMenuName({accId: defaultAdName.value, menuName: 'xjrjz'}).then(res => {
    if (res.length > 0) {
      accPrint.value.id = res[0].id
      formItems.value.paperFangxiang = res[0].paperFangxiang
      formItems.value.paperLeft = Number(res[0].paperLeft)
      formItems.value.paperRight = Number(res[0].paperRight)
      formItems.value.paperTop = Number(res[0].paperTop)
      formItems.value.paperBottom = Number(res[0].paperBottom)
    } else {
      accPrint.value.id = null
      formItems.value.paperFangxiang = '1'
      formItems.value.paperLeft = 30
      formItems.value.paperRight = 30
      formItems.value.paperTop = 30
      formItems.value.paperBottom = 30
    }
  })*/
  formItems.value.paperFangxiang = '1'
  formItems.value.paperLeft = 25
  formItems.value.paperRight = 30
  formItems.value.paperTop = 20
  formItems.value.paperBottom = 30

  formItems.value.printKemu = '1'
  // formItems.value.paperFangxiang = '1'
  formItems.value.qichu = true
  formItems.value.printUser = true
  formItems.value.printBz = true
});

const dateList: any = ref([])
let endDateList: any = ref([])
let strDateList: any = ref([])

async function focusStrDate() {
  if (formItems.value.endDate) {
    strDateList.value = dateList.value.filter(o => o.value <= formItems.value.endDate)
  } else {
    strDateList.value = dateList.value
  }
}

async function focusEndDate() {
  if (formItems.value.strDate) {
    endDateList.value = dateList.value.filter(o => o.value >= formItems.value.strDate)
  } else {
    endDateList.value = dateList.value
  }
}

async function handleChangeStrDate() {
  if (formItems.value.strDate === undefined) {
    formItems.value.endDate = '';
  }
  // 开始日期变动  如果开始日期大于结束于日期 则重置结束日期
  if (formItems.value.endDate) {
    if (formItems.value.strDate > formItems.value.endDate) {
      formItems.value.endDate = '';
    }
  }
}

/*function timechange() {
  dateselflg.value = time.value.length > 0;
}*/
async function handleChangeEndDate() {
  if (formItems.value.endDate === undefined) {
    formItems.value.strDate = '';
  }
  // 开始日期变动  如果结束日期小于开始日期 则重置开始日期
  if (formItems.value.strDate) {
    closeModal();
    if (formItems.value.strDate > formItems.value.endDate) {
      formItems.value.strDate = '';
    }
  }
}

async function handleOk() {
  formItems.value.dynamicTenantId = dynamicTenantId.value
  formItems.value.defaultAdName = defaultAdName.value
  formItems.value.year = year.value

  /*accPrint.value.menuName = 'xjrjz'
  accPrint.value.menuChName = '现金日记账'
  accPrint.value.accId = defaultAdName.value
  accPrint.value.paperFangxiang = formItems.value.paperFangxiang
  accPrint.value.paperLeft = formItems.value.paperLeft == '' ? 30 : formItems.value.paperLeft
  accPrint.value.paperRight = formItems.value.paperRight == '' ? 30 : formItems.value.paperRight
  accPrint.value.paperTop = formItems.value.paperTop == '' ? 30 : formItems.value.paperTop
  accPrint.value.paperBottom = formItems.value.paperBottom == '' ? 30 : formItems.value.paperBottom
  await saveAccPrint(accPrint.value)*/
  emit('save', unref(formItems));
  closeModal();
  return true;
}

const loading = ref('false')

function handleClose() {
  closeModal();
}

onMounted(async () => {
  const res = await findPeriodByAccontId(defaultAdName.value);
  dateList.value = res.filter(item => item.iyear == year.value)
  await focusEndDate()
  await focusStrDate()
  // 初始化默认区间
  formItems.value.strDate = dateList.value[0].value
  formItems.value.endDate = dateList.value[dateList.value.length - 1].value
});

async function dynamicAdReload(data) {
  defaultAdName.value = data.accId
  dynamicTenantId.value = data.accountMode
  year.value = data.year
  formItems.value.companyName = data.companyName

  const res = await findPeriodByAccontId(data.accId);
  dateList.value = res.filter(item => item.iyear == data.year)
  await focusEndDate()
  await focusStrDate()
  // 初始化默认区间
  formItems.value.strDate = dateList.value[0].value
  formItems.value.endDate = dateList.value[dateList.value.length - 1].value
}
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
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input-number), :deep(.ant-input-affix-wrapper) {
  border: none;
  border-bottom: 1px solid rgb(191, 191, 191) !important;
  width: 100%;
}

.nc-open-content {
  position: relative;

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
      width: 180px;
      background-color: #0096c7;
      color: white;
      font-size: 16px;
      text-align: center;
      padding: 5px 10px;
    }

    .ocup-position:nth-of-type(1) {
      top: 0px;
    }

    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 10px 60px 0;

      li {
        margin: 10px 0;
        text-align: left;

        span {
          font-size: 14px;
          color: #535353;
        }

        > span:nth-of-type(1), .right_span {
          display: inline-block;
          width: 120px;
        }

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

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: right;
    width: 110px;
    display: inline-block;
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
}


:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 180px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0px !important;
  }

  .ant-tabs-tab-active {
    background-color: #65cbec !important;
    color: rgba(0, 0, 0, 0.85) !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
  }

  .ant-tabs-tab:nth-of-type(3) {
    margin-top: 110px;
  }
}

</style>
