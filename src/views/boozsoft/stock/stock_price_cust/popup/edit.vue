<template>
  <BasicModal width="400px" v-bind="$attrs" @ok="handleOk()" @register="register">
    <div class="nc-open-content" style="height: 100px; overflow: hidden">
      <div class="open-content-up" style="margin-top: 20px; float: right">
        <a-input
          v-model:value="initalbalancemoney"
          @blur="moneyformat(initalbalancemoney)"
          @click="removeformat"
          autocomplete="off"
          style="width: 100%; text-align: right"
        />
        <br />
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Select as ASelect,
    Input as AInput,
    Popover as APopover,
    Checkbox as ACheckbox,
    Modal as AModal,
    Upload as AUpload,
  } from 'ant-design-vue';
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const emit=defineEmits([]);

  // 传入所有值 
  const introdata = ref('');
  // 借方余额/贷方余额
  const introtype = ref('');
  // 期初余额
  const initalbalancemoney: any = ref('');
  const [register, { closeModal }] = useModalInner((data) => {
    data.type === 'md' ? moneyformat(data.data.md) : moneyformat(data.data.mc);
    introdata.value = data.data;
    introtype.value = data.type;
  });
  // 金额格式化
  function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
     * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || 'ceil'; // "ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    var dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    var s = '';
    var toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      console.log();

      return (
        '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
      );
    };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  const moneyformat = (data) => {
    initalbalancemoney.value = number_format(data, 2, '.', ',');
  };
  const removeformat = () => {
    initalbalancemoney.value = String(initalbalancemoney.value).replace(/,/g, '');
  };
  async function handleOk() {
    if (introtype.value === 'md') {
      introdata.value.md = String(initalbalancemoney.value).replace(/,/g, '');
      introdata.value.mc = parseFloat(introdata.value.mc) > 0 ? '' : introdata.value.mc;
    } else {
      introdata.value.mc = String(initalbalancemoney.value).replace(/,/g, '');
      introdata.value.md = parseFloat(introdata.value.md) > 0 ? '' : introdata.value.md;
    }
    emit('save', unref(introdata));
    closeModal();
  }
</script>
<style lang="less" scoped>
  :deep(.ant-calendar-picker-input.ant-input),
  :deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
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

  .nc-open-content {
    input {
      width: 35%;
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
    }

    .ant-input:focus {
      box-shadow: none;
    }

    :deep(.ant-select-selector) {
      border: none !important;
      border-bottom: 1px solid #ffffff !important;
    }

    label {
      text-align: right;
      width: 110px;
      display: inline-block;
      padding: 5px 10px;
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
</style>
