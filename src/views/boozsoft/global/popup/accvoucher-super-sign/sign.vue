<template>
  <BasicModal
    width="650px"
    v-bind="$attrs"
    :title="pageMark?'主管签字':'取消签字'"
    cancel-text="确定"
    :showOkBtn="false"
    @register="register"
  >
    <div class="nc-open-content">
      <ul>
        <li>
          <span>本次选择{{ pageMark ? '签字' : '取消签字' }}凭证的数量：</span>
          <a-input v-model:value="resultModel.selectNumber" placeholder=""
                   style="width: 100px;margin-left: 10%;text-align: center;pointer-events: none"/>
          <span>张</span>
        </li>
<!--        <li>
          <span>已经{{ pageMark ? '签字' : '取消签字' }}过的凭证数量：&emsp;</span>
          <a-input placeholder="" v-model:value="resultModel.passNumber"
                   style="width: 100px;margin-left: 10%;text-align: center;pointer-events: none"/>
          <span>张</span>
        </li>-->
        <li>
          <span>本次{{ pageMark ? '签字' : '取消签字' }}成功的凭证数量：</span>
          <a-input placeholder="" v-model:value = "resultModel.successNumber"
                   style="width: 100px;margin-left: 10%;text-align: center;pointer-events: none"/>
          <span>张</span>
        </li>
        <li>
          <span>本次{{ pageMark ? '签字' : '取消签字' }}失败的凭证数量：</span>
          <a-input placeholder="" v-model:value="resultModel.errorNumber"
                   style="width: 100px;margin-left: 10%;text-align: center;pointer-events: none"/>
          <span>张</span>
        </li>
      </ul>

      <BasicTable
        :data-source="resultModel.errorList"
        :showIndexColumn="false"
        :pagination="false"
        :scroll="{y: 400 }"
        :columns="[
          {title: '凭证日期',dataIndex: 'dbillDate',width: '120px'},
          {title: '凭证编号',dataIndex: 'inoId',width: '120px',slots: {customRender: 'inoId'}},
          {title: `${pageMark.value?'签字':'取消签字'}错误原因`,dataIndex: 'errorType',width: '300px',slots: {customRender: 'errorType'}},
        ]"
        size="small"
      >
        <template #inoId="{record,index }">
          <span>{{
              voucherNoAutocomplete(record.inoId, voucherRuleSize)
            }}</span>
        </template>
        <template #errorType="{record,index }">
          <span>{{
              voucherErrorTypeAutocomplete(record.errorType, errorTypes)
            }}</span>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal';
import {BasicTable} from '/@/components/Table';
import {useMessage} from "/@/hooks/web/useMessage";
// import {
//   voucherNoAutocomplete,
// } from "/@/views/boozsoft/system/accvoucher/data";
const voucherNoAutocomplete=null
const {
  createWarningModal,
} = useMessage()
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
} from "ant-design-vue";

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
// 页面变量
const pageMark = ref(true)
const voucherRuleSize = ref(4)
const errorTypes = {
  '1': `签字与取消签字需为同一人`,
  '2': '作废凭证不需要进行主管签字',
  '3': '签字日期不能小于凭证日期',
  '4': `标错凭证必须修改为正常凭证后才能进行${pageMark.value?'签字':'取消签字'}`,
  '5': `暂存凭证必须修改为正常凭证后才能进行${pageMark.value?'签字':'取消签字'}`,
  '6': '出纳凭证未进行出纳签字，签字后才能进行主管签字',
  '7': '凭证借贷方金额不平衡',
  '8': '会计科目非末级',
  '9': '辅助核算项未录入',
  '10': '已签字凭证不可重复签字',
  '11': '已取消签字凭证不可重复取消签字'
}
const resultModel = ref({
  selectNumber: 0,
  passNumber: 0,
  successNumber: 0,
  errorNumber: 0,
  errorList: [],
})

const emit = defineEmits(['reload', 'register'])
const [register, {closeModal, changeOkLoading, setModalProps}] = useModalInner((data) => {
  pageMark.value = data.data.mark
  resultModel.value = data.data.result
  voucherRuleSize.value = data.data.voucherRuleSize
  setModalProps({minHeight: 400});
})

const voucherErrorTypeAutocomplete = (key, map) => {
  return map[key] || '其他错误'
}
</script>
<style lang="less" scoped>
:deep(.ant-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
}

.nc-open-content {
  margin: 2% 10%;
  color: black;
  font-size: 14px;
  font-weight: bold;
  text-align: center;

  ul {
    margin: 0 5% 5%;

    li {
      margin: 2% 0;

      span:nth-of-type(1) {
        color: slategrey;
      }
    }
  }
}
</style>
