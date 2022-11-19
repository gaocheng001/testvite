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
        <AppstoreOutlined  style="margin: 0 10px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="con-left">
        <SecondaryTitle >新增模板</SecondaryTitle>
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
                <span>新增参数</span>
                <div style="display: inline-block;width: 96%;">
                  <div >
                    <span class="right_span">参考模板：</span>
                    <a-select  v-model:value="printParameter.source" :options="treeList.map(it=>({value: it.id,label:`[${typeList.filter(a=>a.value==it.templateType)[0]?.label}]${it.templateName}`}))"
                      style="width: 250px;text-align-last: center;" />
                  </div>
                  <div>
                    <span class="right_span">模板名称：</span>
                    <a-input v-model:value="printParameter.name" style="width: 250px;" />
                  </div>
                  <div>
                  <span class="right_span">模板类型：</span>
                  <a-select  v-model:value="printParameter.type" :options="typeList.slice(1)"
                             style="width: 250px;text-align-last: center;" />
                    </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div  class="con-right right-btns">
        <a-button @click="handleOk"  type="primary" shape="round"  style="width: 100px">确定</a-button>
        <a-button @click="handleClose" shape="round" style="width: 100px;margin-top: 10px">取消</a-button>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup="props, { content }">
import {inject, reactive, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Checkbox as ACheckbox,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs
} from 'ant-design-vue';
import {AppstoreOutlined} from '@ant-design/icons-vue'

import { hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const ATabPane = ATabs.TabPane;
const emit = defineEmits(['register', 'save']);
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {checkName} from "/@/api/record/stock/stock-template";
const treeList = inject('treeList')
const pathMark = inject('pathMark')


// 数据库模式名称
const dynamicTenantId = ref('')

const showNext = ref(false)
const printParameter = reactive({
  source: '',
  name: '',type:'1'
})
const typeList = [{value:'0',label:'系统'},{value:'1',label:'A4横向'},{value:'2',label:'A4纵向'},{value:'3',label:'二等分'},{value:'4',label:'三等分'}]
const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  setModalProps({ minHeight: 400 });
  // 方式2
  showNext.value = true
  dynamicTenantId.value = data.data.dynamicTenantId
  if (treeList.value.length > 0)printParameter.source = treeList.value[0].id
});


const {
  createWarningModal,
} = useMessage()

async function handleOk() {
  showNext.value = false
  if (hasBlank(printParameter.source) || hasBlank(printParameter.name)) {
    createWarningModal({title:'温馨提示',content: '模板来源与名称不能为空！'})
    showNext.value = true
    return false
  }
  let i =  await useRouteApi(checkName,{schemaName: dynamicTenantId})({belong: pathMark.value,name: printParameter.name})
  if (null == i || i > 0){
    createWarningModal({title:'温馨提示',content: '模板名称已存在！'})
    showNext.value = true
    return false
  }
  emit('save', unref(printParameter));
  closeModal();
  return true;
}

const loading = ref('false')

function handleClose() {
  closeModal();
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
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
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
