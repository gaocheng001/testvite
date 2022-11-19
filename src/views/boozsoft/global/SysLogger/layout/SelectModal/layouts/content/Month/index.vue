<template>
  <div style="text-align: center">
    <ul>
      <li>
        <div class="special-border-div" style="padding: 20px 0">
          <span>日志日期</span>
          <div style="display: flex">
            <div class="sbd-left">
              <RadioGroup style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                <p style="font-size: 10px">
                  <Radio value="1" />
                  <span>会计期间：</span>

                  <DatePicker
                    v-model:value="strDate"
                    show-search
                    :disabled="dateselflg"
                    picker="month"
                    style="width: 94px"
                    @focus="focusStrDate"
                    @change="handleChangeStrDate"
                  />
                  <span>&emsp;~&emsp;</span>
                  <DatePicker
                    v-model:value="strDate"
                    show-search
                    :disabled="dateselflg"
                    picker="month"
                    style="width: 94px"
                    @focus="focusStrDate"
                    @change="handleChangeStrDate"
                  />
                </p>
                <p style="font-size: 10px">
                  <Radio value="2" />
                  <span>制度日期：</span>
                  <RangePicker
                    v-model:value="riqi"
                    style="width: 224px"
                    :disabled="timeselflg"
                    @change="timechange"
                  />
                </p>
              </RadioGroup>
            </div>
            <div class="sbd-right">
              <RadioGroup size="small" :disabled="radiovalue == '2'" @change="checkChange">
                <RadioButton value="1">上月</RadioButton>
                <RadioButton value="2">本月</RadioButton>
                <RadioButton value="3">本季</RadioButton>
                <RadioButton value="4">本年</RadioButton>
              </RadioGroup>
              <RadioGroup size="small" :disabled="radiovalue == '1'" @change="checkChange">
                <RadioButton value="5">今天</RadioButton>
                <RadioButton value="6">昨天</RadioButton>
                <RadioButton value="7">前天</RadioButton>
                <RadioButton value="8">月末</RadioButton>
              </RadioGroup>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!--    <DatePicker-->
    <!--      v-model:value="month"-->
    <!--      :locale="localeCn"-->
    <!--      picker="month"-->
    <!--      placeholder="时点日期"-->
    <!--      format="YYYY-MM"-->
    <!--      value-format="YYYY-MM"-->
    <!--      style="width: 50%"-->
    <!--    />-->
  </div>
</template>
<script setup>
  import { Radio, Select, DatePicker } from 'ant-design-vue';
  import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';

  import { ref } from 'vue';
  import { getLoggerTableFuns } from '/@/views/boozsoft/global/SysLogger/layout/funs';
  const year = ref('2021');
  const month = ref('2021-01');
  let loggerTableFuns = getLoggerTableFuns();
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const Option = Select.Option;
  const RangePicker = DatePicker.RangePicker;

  const radiovalue = ref('');
  const endDate = ref('');
  const strDate = ref('');
  const riqi = ref('');
  const timeselflg = ref(false);
  const strDateList = ref([]);
  const endDateList = ref([]);
  const dateselflg = ref(false);

  function timechange() {}
  function radiochange() {}
  function focusStrDate() {}
  function handleChangeStrDate() {}
  function checkChange() {}

  function focusEndDate() {}
  function handleChangeEndDate() {}
</script>
<style>
  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 20px 1%;
  }
  .special-border-div > span {
    position: absolute;
    top: -12px;
    left: 50px;
    font-size: 15px;
    background: white;
    padding: 0 15px;
  }
  .special-border-div > div .sbd-left {
    width: 60%;
  }
  .special-border-div > div .sbd-right {
    width: 40%;
    padding: 2% 5%;
  }
</style>
