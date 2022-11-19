<template>
  <BasicModal
    width="850px"
    class="spaceLogo"
    v-bind="$attrs"
    title="凭证查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    @visible-change="openOrClose"
    @register="register"
    :loading="modelLoadIng"
    loadingTip="查询参数初始化中"
  >
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up">
        <div class="ocup-position">
          系统方案
        </div>
        <div class="ocup-position">
          个人方案
        </div>
        <Assist
          @modify="assistModify"
          @register="registerAssist"
        />
        <a-tabs type="card" v-model:activeKey="defaultTabsKey" @change="tabsChange"
                tabPosition="left">
          <a-tab-pane key="1" tab="标准模式">
            <ul>
              <li>
                <AccountPicker theme="one" @reloadTable="codeChange" />
              </li>
              <li>
<!--                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <span>期间：</span>
                    <a-radio :value="1">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px;"
                      @focus="focusStrDate"
                      @change="handleChangeStrDate"
                    >
                      <a-select-option
                        v-for="item in strDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                    <span>&emsp;~&emsp;</span>
                    <a-select
                      v-model:value="endDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px"
                      @focus="focusEndDate"
                      @change="handleChangeEndDate"
                    >
                      <a-select-option
                        v-for="item in endDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </p>
                  <p>
                    <span>日期：</span>
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 456px;    "
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>-->
                <span>期间：</span>
                <a-select
                  v-model:value="strDate"
                  show-search
                  :disabled="dateselflg"
                  style="width: 210px;"
                  @focus="focusStrDate"
                  @change="handleChangeStrDate"
                >
                  <a-select-option
                    v-for="item in strDateList"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
                <span>&emsp;~&emsp;</span>
                <a-select
                  v-model:value="endDate"
                  show-search
                  :disabled="dateselflg"
                  style="width: 210px"
                  @focus="focusEndDate"
                  @change="handleChangeEndDate"
                >
                  <a-select-option
                    v-for="item in endDateList"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li><span class="right_span">凭证摘要：</span>
                <a-input v-model:value="modelList['1'].variable.summary" :allowClear="true"
                         placeholder="摘要" style="width: 200px"/>
                &emsp;&emsp;<span class="right_span">凭证类别：</span>
                <a-select
                  v-model:value="modelList['1'].variable.voucherType"
                  placeholder=""
                  style="width: 104px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('subjectNumber') != -1">
                  <span>科目编码：</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['1'].variable.subjectNumber"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="item in kmList" :value="item.ccode">{{ item.ccode }}
                      {{ item.ccodeName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('direction') != -1">
                  &emsp;&emsp;<span class="right_span">科目方向：</span>
                  <a-select
                    :allowClear="true"
                    placeholder=""
                    style="width: 104px"
                    v-model:value="modelList['1'].variable.direction"
                  >
                    <a-select-option value="jf">借方</a-select-option>
                    <a-select-option value="df">贷方</a-select-option>
                  </a-select>
                </template>
              </li>
              <li><span>外币币种：</span>
                <a-select show-search style="width: 200px" v-model:value="modelList['1'].constant.currency"
                          :allowClear="true">
                  <a-select-option v-for="d in bzList" :key="d.id" :value="d.foreignName">
                    {{ d.foreignName }}
                  </a-select-option>
                </a-select>&emsp;&emsp;
                <span class="right_span">分录显示：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['1'].constant.showType"
                  placeholder="明细/汇总"
                  style="width: 104px">
                  <a-select-option value="2">汇总</a-select-option>
                  <a-select-option value="1">明细</a-select-option>
                </a-select>
              </li>
              <li v-if="targetKeys.indexOf('amount') != -1"><span>本币金额：</span>
                <a-input v-model:value="modelList['1'].variable.amountMin" :allowClear="true"
                         placeholder="最小金额" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.amountMax" :allowClear="true"
                         placeholder="最大金额" style="width: 210px"/>
              </li>
              <li v-if="targetKeys.indexOf('number') != -1"><span>数量：&emsp;&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.numberMin" :allowClear="true"
                         placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.numberMax" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('wbAmount') != -1">
                  <span class="right_span">外币金额：</span>
                  <a-input v-model:value="modelList['1'].variable.wbAmountMin" :allowClear="true"
                           placeholder="最小金额" style="width: 210px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input v-model:value="modelList['1'].variable.wbAmountMax" :allowClear="true"
                           placeholder="最大金额" style="width: 210px"/>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('reviewStatus') != -1">
                  <span>审核状态：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['1'].variable.reviewStatus"
                    placeholder="全部/未审核/已审核/待审核"
                    style="width: 200px"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="2">待审核</a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('bookStatus') != -1">
                  &emsp;&emsp;<span class="right_span">记账状态：</span>
                  <a-select
                    :allowClear="true"
                    placeholder="未记账/已记账/待记账"
                    style="width: 104px"
                    v-model:value="modelList['1'].variable.bookStatus"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未记账</a-select-option>
                    <a-select-option value="1">已记账</a-select-option>
                    <a-select-option value="2">待记账</a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('preparedMan') != -1">
                  <span>制单人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['1'].variable.preparedMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  &emsp;&emsp;<span class="right_span">审核人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['1'].variable.checkMan"
                    placeholder=""
                    style="width: 104px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  <span>出纳人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    placeholder=""
                    style="width: 200px"
                    v-model:value="modelList['1'].variable.cashierMan"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('reviewMan') != -1">
                  &emsp;&emsp;<span class="right_span">财务主管：;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['1'].variable.reviewMan"
                    placeholder=""
                    style="width: 104px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template   v-if="targetKeys.indexOf('bookMan') != -1">
                <span>记账人：&emsp;</span>
                <a-select
                  :allowClear="true"
                  show-search
                  placeholder=""
                  style="width: 200px"
                  v-model:value="modelList['1'].variable.bookMan"
                >
                  <a-select-option v-for="(item,index) in userList" :key="index"
                                   :value="item.psnName">{{ item.psnName }}
                  </a-select-option>
                </a-select>&emsp;&emsp;
                </template>
                <span class="right_span">凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['1'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 104px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="2">暂存</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                  <a-select-option value="5">冲销</a-select-option>
                </a-select>
              </li>

              <li  v-if="startRendering" v-for="hsKey in targetKeys2 ">
                <span>{{getAssistNameByKey(hsKey,filterDatas2)}}核算：&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.accounting[hsKey]" class="addonAfter-input" >
                  <template #addonAfter>
                    <PlusSquareOutlined @click="openAssistPage(hsKey,modelList['1'].variable.accounting[hsKey])"/>
                  </template>
                </a-input>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="3" tab="个人标准模式">
            <ul>
              <li>
                <AccountPicker theme="one" @reloadTable="codeChange" />
              </li>
              <li>
<!--                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <span>期间：</span>
                    <a-radio :value="1">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px;"
                      @focus="focusStrDate"
                      @change="handleChangeStrDate"
                    >
                      <a-select-option
                        v-for="item in strDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                    <span>&emsp;~&emsp;</span>
                    <a-select
                      v-model:value="endDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px"
                      @focus="focusEndDate"
                      @change="handleChangeEndDate"
                    >
                      <a-select-option
                        v-for="item in endDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </p>
                  <p>
                    <span>日期：</span>
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 456px;    "
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>-->
                <span>期间：</span>
                <a-select
                  v-model:value="strDate"
                  show-search
                  :disabled="dateselflg"
                  style="width: 210px;"
                  @focus="focusStrDate"
                  @change="handleChangeStrDate"
                >
                  <a-select-option
                    v-for="item in strDateList"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
                <span>&emsp;~&emsp;</span>
                <a-select
                  v-model:value="endDate"
                  show-search
                  :disabled="dateselflg"
                  style="width: 210px"
                  @focus="focusEndDate"
                  @change="handleChangeEndDate"
                >
                  <a-select-option
                    v-for="item in endDateList"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li><span class="right_span">凭证摘要：</span>
                <a-input v-model:value="modelList['3'].variable.summary" :allowClear="true"
                         placeholder="摘要" style="width: 200px"/>
                &emsp;&emsp;<span class="right_span">凭证类别：</span>
                <a-select
                  v-model:value="modelList['3'].variable.voucherType"
                  placeholder=""
                  style="width: 104px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('subjectNumber') != -1">
                  <span>科目编码：</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['3'].variable.subjectNumber"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="item in kmList" :value="item.ccode">{{ item.ccode }}
                      {{ item.ccodeName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('direction') != -1">
                  &emsp;&emsp;<span class="right_span">科目方向：</span>
                  <a-select
                    :allowClear="true"
                    placeholder=""
                    style="width: 104px"
                    v-model:value="modelList['3'].variable.direction"
                  >
                    <a-select-option value="jf">借方</a-select-option>
                    <a-select-option value="df">贷方</a-select-option>
                  </a-select>
                </template>
              </li>
              <li><span>外币币种：</span>
                <a-select style="width: 200px" v-model:value="modelList['3'].constant.currency"
                          :allowClear="true">
                  <a-select-option v-for="d in bzList" :key="d.id" :value="d.foreignName">
                    {{ d.foreignName }}
                  </a-select-option>
                </a-select>&emsp;&emsp;
                <span class="right_span">分录显示：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['3'].constant.showType"
                  placeholder="明细/汇总"
                  style="width: 104px">
                  <a-select-option value="2">汇总</a-select-option>
                  <a-select-option value="1">明细</a-select-option>
                </a-select>
              </li>
              <li v-if="targetKeys.indexOf('amount') != -1"><span>本币金额：</span>
                <a-input v-model:value="modelList['3'].variable.amountMin" :allowClear="true"
                         placeholder="最小金额" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.amountMax" :allowClear="true"
                         placeholder="最大金额" style="width: 210px"/>
              </li>
              <li v-if="targetKeys.indexOf('number') != -1"><span>数量：&emsp;&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.numberMin" :allowClear="true"
                         placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.numberMax" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('wbAmount') != -1">
                  <span class="right_span">外币金额：</span>
                  <a-input v-model:value="modelList['3'].variable.wbAmountMin" :allowClear="true"
                           placeholder="最小金额" style="width: 210px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input v-model:value="modelList['3'].variable.wbAmountMax" :allowClear="true"
                           placeholder="最大金额" style="width: 210px"/>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('reviewStatus') != -1">
                  <span>审核状态：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['3'].variable.reviewStatus"
                    placeholder="全部/未审核/已审核/待审核"
                    style="width: 200px"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="2">待审核</a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('bookStatus') != -1">
                  &emsp;&emsp;<span class="right_span">记账状态：</span>
                  <a-select
                    :allowClear="true"
                    placeholder="未记账/已记账/待记账"
                    style="width: 104px"
                    v-model:value="modelList['3'].variable.bookStatus"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未记账</a-select-option>
                    <a-select-option value="1">已记账</a-select-option>
                    <a-select-option value="2">待记账</a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('preparedMan') != -1">
                  <span>制单人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['3'].variable.preparedMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  &emsp;&emsp;<span class="right_span">审核人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['3'].variable.checkMan"
                    placeholder=""
                    style="width: 104px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  <span>出纳人：&emsp;</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    placeholder=""
                    style="width: 200px"
                    v-model:value="modelList['3'].variable.cashierMan"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('reviewMan') != -1">
                  &emsp;&emsp;<span class="right_span">财务主管：</span>
                  <a-select
                    :allowClear="true"
                    show-search
                    v-model:value="modelList['3'].variable.reviewMan"
                    placeholder=""
                    style="width: 104px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('bookMan') != -1">
                <template v-if="targetKeys.indexOf('bookMan') != -1">
                <span>记账人：&emsp;</span>
                <a-select
                  show-search
                  :allowClear="true"
                  placeholder=""
                  style="width: 200px"
                  v-model:value="modelList['3'].variable.bookMan"
                >
                  <a-select-option v-for="(item,index) in userList" :key="index"
                                   :value="item.psnName">{{ item.psnName }}
                  </a-select-option>
                </a-select>
                  &emsp;&emsp;
                </template>
                <span class="right_span">凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['3'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 104px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="2">暂存</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                  <a-select-option value="5">冲销</a-select-option>
                </a-select>
              </li>
              <li  v-if="startRendering"  v-for="hsKey in targetKeys2 ">
                <span>{{getAssistNameByKey(hsKey,filterDatas2)}}核算：&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.accounting[hsKey]" class="addonAfter-input" >
                  <template #addonAfter>
                    <PlusSquareOutlined @click="openAssistPage(hsKey,modelList['3'].variable.accounting[hsKey])"/>
                  </template>
                </a-input>
              </li>
            </ul>
          </a-tab-pane>
        </a-tabs>
      </div>

    </div>

    <template #footer>
      <div style="height: 35px">
        <div style="float: left">
          <a-popconfirm
            ok-text="确定"
            cancel-text="关闭"
            @confirm="confirm"
            @cancel="cancel"
          >
            <template #icon><b>过滤条件设置</b></template>
            <template #title>
              <br/>
              <a-transfer
                show-search
                :data-source="filterDatas"
                :titles="['待选条件', '已选条件']"
                :operations="['确定', '取消']"
                :selected-keys="selectedKeys"
                :target-keys="targetKeys"
                :render="item => item.title"
                @change="transferHandleChange"
                @selectChange="transferHandleSelectChange"
              />
            </template>
            <a-button type="primary">过滤条件</a-button>
          </a-popconfirm>
        </div>
        <div style="float: left;margin-left: 2%">
        <a-popconfirm
          ok-text="确定"
          cancel-text="关闭"
          @confirm="confirm"
          @cancel="cancel"
        >
          <template #icon><b>辅助核算设置</b></template>
          <template #title>
            <br/>
            <a-transfer
              show-search
              :data-source="filterDatas2"
              :titles="['待选条件', '已选条件']"
              :operations="['确定', '取消']"
              :selected-keys="selectedKeys2"
              :target-keys="targetKeys2"
              :render="item => item.title"
              @change="transferHandleChange2"
              @selectChange="transferHandleSelectChange2"
            />
          </template>
          <a-button type="primary">辅助核算</a-button>
        </a-popconfirm>
      </div>
        <div style="float: right">
          <a-button @click="handleClose">放弃</a-button>
          <a-button @click="handleOk" v-if="!modelLoadIng" type="primary">确定</a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref, reactive, onMounted, watch, computed} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Popconfirm as APopconfirm,
  Tabs as ATabs, message, Transfer as ATransfer
} from "ant-design-vue"
import {PlusSquareOutlined} from '@ant-design/icons-vue'
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {Moment} from 'moment';
import {
  findPeriodByAccontId,
  findCodeKmByPeriod,
  findMaxPingZhengQiJian,
  findPeriodByAccontIdAndYaer,
  findMaxPingZhengQiJianMonth
} from '/@/api/record/generalLedger/data';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  currentAccountTypes,
  currentCyDatas,
  getAdInfoDatas,
  getAllAccAuths, filterAccListByAuth
} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {psnFindByFlag} from "/@/api/psn/psn";
import Assist from "/@/views/boozsoft/global/popup/accvoucher/HelloAbc.vue";
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import {findAllFuzhuHesuanList} from "/@/api/record/system/fuzhu-hesuan";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
//红字（无现金科目，请设置现金科目后再进行查询）
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'save'])

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane

const userStore = useUserStore();
const formItems: any = ref({})
let changeBeforeModel: any = {}
// 会计区间
const dateList: any = ref([])
// 会计科目
const kmList: any = ref([])

//币种
const bzList: any = ref([])
// 类别
const typesList: any = ref([])
// 人员
const userList: any = ref([])
// 过滤

const endDate = ref<String>("")
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
// 期间是否可选
let dateselflg: any = ref(false);
let minkmList: any = ref([])
const minKm = ref<string>()
const maxKm = ref<string>()

const maxPingzhengQj = ref('')

const ishaveRjz = ref<boolean>(true)
const isShowQjlh = ref<boolean>(false)
const datebaseYear = ref('')
const userId = userStore.getUserInfo.id
//查询条件
// 已授权账套列表
const accAuthList = ref([])

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

const targetKeys: any = ref(['subjectNumber', 'direction', 'number', 'amount', 'wbAmount', 'reviewStatus', 'bookStatus', 'preparedMan'])
const selectedKeys: any = ref([])
const filterDatas = [
  {
    key: 'subjectNumber',
    title: `科目编码`
  }
  , {
    key: 'direction',
    title: `科目方向`
  },
  {
    key: 'number',
    title: `数量`
  },
  {
    key: 'amount',
    title: `本币金额`
  },
  {
    key: 'wbAmount',
    title: `外币金额`
  },
  {
    key: 'reviewStatus',
    title: `审核状态`
  },
  {
    key: 'bookStatus',
    title: `记账状态`
  },
  {
    key: 'preparedMan',
    title: `制单人`
  },
  {
    key: 'checkMan',
    title: `审核人`
  },
  {
    key: 'cashierMan',
    title: `出纳人`
  }, {
    key: 'reviewMan',
    title: `财务主管`
  }, {
    key: 'bookMan',
    title: `记账人`
  }
]

const targetKeys2: any = ref([])
const startRendering = ref(false)
const selectedKeys2: any = ref([])
const filterDatas2 = [
  {
    key: 'cdeptId',
    title: `部门`
  }
  , {
    key: 'cpersonId',
    title: `员工`
  },
  {
    key: 'ccusId',
    title: `客户`
  },
  {
    key: 'csupId',
    title: `供应商`
  },
  {
    key: 'projectId',
    title: `项目`
  }
]

const companyOperateStore = useCompanyOperateStoreWidthOut()
onMounted(async () => {
});

const getAdObjInfoByCoCode = (value, type) => {
  let list = accAuthList.value.filter(item => item[type] == value)
  return list.length > 0 ? list[0] : null
}

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  formItems.value = data.data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  setModalProps({minHeight: 400});
})

const totalChange = computed(() => formItems.value.total)
watch(totalChange, async (a) => {
    if (a != 0) {
      modelLoadIng.value = false
      /*if (a > 0) {*/
        closeModal()
     /* } else {
        createWarningModal({title: '温馨提示', content: '暂无任何查询结果！'});
      }*/
      formItems.value.total = 0
    }
  }
)

const reLifeQueryParameter = async (dynamicTenant) => {
  if (hasBlank(dynamicTenant)) return
  // 获取最大凭证区间
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
  //加载期间数据
  dateList.value = []
  dateList.value = await findPeriodByAccontIdAndYaer({'accontId':tenantName,iyear: datebaseYear.value});
  if (dateList.value.length > 0) {
    const qijian = await useRouteApi(findMaxPingZhengQiJianMonth, {schemaName: dynamicTenant})( datebaseYear.value) || '';
    // 初始化默认区间
    if (hasBlank(qijian)) {
      strDate.value = dateList.value[0].value
      endDate.value = dateList.value[dateList.value.length - 1].value
    } else {
      maxPingzhengQj.value = qijian.substring(0, 4) + '-' + qijian.substring(4, 6)
      strDate.value = maxPingzhengQj.value
      endDate.value = maxPingzhengQj.value
    }
    await reLifeKmList(currentDynamicTenant.value)
    // 初始化已知自定义辅助核算
    let fzL = await useRouteApi(findAllFuzhuHesuanList, {schemaName: dynamicTenant})({}) || []
    if (fzL.length > 0) {
      startRendering.value = true // 开始加载辅助项
      fzL.forEach(item=>filterDatas2.push({key: 'cdfine'+item.cdfine,title: item.cname}))
    }
    // 是否集团
    let thisAccObj = getAdObjInfoByCoCode(tenantName, 'accId')
    if (null != thisAccObj) {
      let flag = thisAccObj.independent
      whetherGroup.value = (null == flag ? true : '0' == flag ? true : false)
      // 是否预算会计
      //if (thisAccObj.ibudgetAccounting ||　false)  modelList[defaultTabsKey.value].constant.nature = 'YS'
      // 获取币种信息
      bzList.value = []
      await useRouteApi(currentCyDatas, {schemaName: dynamicTenant})({accId: tenantName}).then(res1 => {
        bzList.value = res1.items.filter(item => item.foreignCode.indexOf(thisAccObj.currency) == -1)
      });
      // 凭证类别
      typesList.value = []
      await useRouteApi(currentAccountTypes, {schemaName: dynamicTenant})({
        pageSize: 20,
        pageNumber: 1
      }).then(res => {
        typesList.value = res.items
      })
      // 人员
      await useRouteApi(psnFindByFlag, {schemaName: dynamicTenant})({}).then(res => {
        userList.value = res
      })
    }
  } else {
    await pointMessage({title: '温馨提示', content: '请先初始化该公司代码账套会计期间后在进行查询！', delay: true})
    modelList[defaultTabsKey.value].constant.companyCode = ''
    currentDynamicTenant.value = ''
    strDate.value = ''
    endDate.value = ''
  }
}

async function reLifeKmList(dynamicTenant) {
  if (hasBlank(dynamicTenant)) return
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
  kmList.value = await useRouteApi(findCodeKmByPeriod, {schemaName: dynamicTenant})({
    strDate: strDate.value,
    endDate: endDate.value,
    accId: tenantName,
    userId: userId
  });
}
let count = 0
const codeChange = async (value) => {
  ++count
  if (count == 2){ //
    return false;
  }
  accAuthList.value = filterAccListByAuth(companyOperateStore.getAccountList || [], companyOperateStore.getAuthorizeList || [])
  modelLoadIng.value = true
  let newName = value.accId
  // 查看是否存在 查询参数
  dbQueryJson.accountId = newName;
  datebaseYear.value = value.iyear
  defaultModel.constant.companyCode = value.coCode
  let dbQueryData = await findParameterValue(dbQueryJson)
  if (null != dbQueryData) { // 存在
    defaultTabsKey.value = '3'
    dbQueryJson.id = dbQueryData.id
    dbQueryJson.queryConditions = dbQueryData.queryConditions
    dbQueryJson.filterConditions = dbQueryData.filterConditions
    if (!hasBlank(dbQueryData.filterConditions)) {
      targetKeys.value = JSON.parse(dbQueryData.filterConditions)['filter1']
      targetKeys2.value = JSON.parse(dbQueryData.filterConditions)['filter2']
    }
    if (!hasBlank(dbQueryData.queryConditions)) {
      let queryMap = JSON.parse(dbQueryData.queryConditions)
      modelList["3"].constant = queryMap.constant
      modelList["3"].variable = queryMap.variable
    }
  } else {
    // 清除条件
    modelList[defaultTabsKey.value].constant = defaultModel.constant
    modelList[defaultTabsKey.value].variable = defaultModel.variable
    dbQueryJson.id = null
  }
  modelList[defaultTabsKey.value].constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  await reLifeQueryParameter(currentDynamicTenant.value)
  modelLoadIng.value = false
}


async function handleChangeStrDate() {

  endDate.value = strDate.value

  return false;
  if (strDate.value === undefined) {
    endDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果开始日期大于结束于日期 则重置结束日期
  if (endDate.value) {
    if (strDate.value > endDate.value) {
      endDate.value = '';
    }
    // 会计科目
    await reLifeKmList(currentDynamicTenant.value)
    timeselflg.value = true;
  }
}

function timechange() {
  dateselflg.value = time.value.length > 0;
}

async function handleChangeEndDate() {
  if (endDate.value === undefined) {
    strDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果结束日期小于开始日期 则重置开始日期
  if (strDate.value) {
    if (strDate.value > endDate.value) {
      strDate.value = '';
    }
  /*  // 会计科目
    await reLifeKmList(currentDynamicTenant.value)
    timeselflg.value = true;*/
  }
}

async function focusStrDate() {
  /*if (endDate.value) {
    strDateList.value = dateList.value.filter(o => o.value <= endDate.value)
  } else {
    strDateList.value = dateList.value
  }*/
  strDateList.value = dateList.value
}

async function focusEndDate() {
  if (strDate.value) {
    endDateList.value = dateList.value.filter(o => o.value >= strDate.value)
  } else {
    endDateList.value = dateList.value
  }
}

const confirm = () => {

}
const cancel = () => {

}
/*********Mr·Ye*********/
const defaultTabsKey = ref('1')
const whetherGroup = ref(false)
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    currency: '',
    tenantId: '',
    companyCode: '',
    queryType: '1',
    showType: '1',
    thisAdInfo: {}
  },
  authority: {codes: [], types: []},
  variable: {
    periodStart: '',
    periodEnd: '',
    dateStart: '',
    dateEnd: '',
    voucherNumberStart: '',
    voucherNumberEnd: '',
    voucherType: '',
    summary: '',
    reviewStatus: '',
    bookStatus: '',
    subjectNumber: '',
    direction: '',
    amountMax: '',
    amountMin: '',
    numberMax: '',
    numberMin: '',
    wbAmountMax: '',
    wbAmountMin: '',
    /*    billNumberStart: '',
        billNumberEnd: '',*/
    preparedMan: '',
    checkMan: '',
    cashierMan: '',
    reviewMan: '',
    bookMan: '',
    accounting:{},
    assists:{}
  }
}
const modelList = reactive({
  '1': {
    constant: {
      currency: '',
      tenantId: '',
      thisAdInfo: {},
      queryType: '1',
      showType: '1',
      companyCode: ''
    },
    authority: {codes: [], types: []},
    variable: {
      periodStart: '',
      periodEnd: '',
      dateStart: '',
      dateEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      summary: '',
      reviewStatus: '',
      bookStatus: '',
      subjectNumber: '',
      direction: '',
      amountMax: '',
      amountMin: '',
      numberMax: '',
      numberMin: '',
      wbAmountMax: '',
      wbAmountMin: '',
      /*  billNumberStart: '',
        billNumberEnd: '',*/
      preparedMan: '',
      checkMan: '',
      cashierMan: '',
      reviewMan: '',
      bookMan: '',
      accounting:{},
      assists:{},
    }
  },
  '2': {
  },
  '3': {
    constant: {
      currency: '',
      tenantId: '',
      queryType: '2',
      showType: '1',
      thisAdInfo: {},
      companyCode: ''
    },
    authority: {codes: [], types: []},
    variable: {
      periodStart: '',
      periodEnd: '',
      dateStart: '',
      dateEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      summary: '',
      reviewStatus: '',
      bookStatus: '',
      subjectNumber: '',
      direction: '',
      amountMax: '',
      amountMin: '',
      numberMax: '',
      numberMin: '',
      wbAmountMax: '',
      wbAmountMin: '',
      /*   billNumberStart: '',
         billNumberEnd: '',*/
      preparedMan: '',
      checkMan: '',
      cashierMan: '',
      reviewMan: '',
      bookMan: '',
      accounting:{},
      assists:{},
    }
  },
  '4': {}
})

const openOrClose = (visible: boolean) => {
  // 初始化选中
  if (visible && null != formItems.value.openOne && Object.keys(modelList['3']).length != 0) {
    //默认赋值
    defaultTabsKey.value = '3'
  }
}
const tabsChange = (value) => {
  if (value == '1') {
    modelList[defaultTabsKey.value] = defaultModel
  } else if (value == '2') {
    modelList[defaultTabsKey.value] = modelList[value]
  } else if (value == '3') {
    modelList[defaultTabsKey.value] = modelList[value]
  } else if (value == '4') {
    modelList[defaultTabsKey.value] = modelList[value]
  }
  if ((value == '1' || value == '3' ) && modelList[defaultTabsKey.value].constant.companyCode == '') modelList[defaultTabsKey.value].constant.companyCode = defaultModel.constant.companyCode
}

function initAuthCondition(adName, authList) {
  // 获取当前选中的年度
  modelList[defaultTabsKey.value].constant.thisAdInfo = accAuthList.value.filter(item => item.accId === adName)[0]
  let newList = authList.filter(item => item.accId == adName)
  if (newList.length == 0) return false;
  let obj = newList[0]
  if (newList.length > 1) {
    let startRq = modelList[defaultTabsKey.value].variable.periodStart
    let dateStart = modelList[defaultTabsKey.value].variable.dateStart
    let yearValue = ''
    if (startRq == '') {
      yearValue = dateStart.substring(0, 4)
    } else {
      yearValue = startRq.substring(0, 4)
    }
    obj = newList.filter(item => item.iyear == yearValue)[0]
  }
  if (obj.ccodeAll != '1') modelList[defaultTabsKey.value].authority.codes = JSON.parse(obj.codeListJson)
  if (obj.ccodeAll != '1') modelList[defaultTabsKey.value].authority.types = JSON.parse(obj.voucherTypeJson)
}

/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {
  modelLoadIng.value = false

  if (accAuthList.value.length === 0) {
    message.error('请先获取账套查询权限!');
    return
  } else if (modelList[defaultTabsKey.value].constant.queryType == '1' && hasBlank(modelList[defaultTabsKey.value].constant.companyCode)) {
    message.error('请选择公司代码!');
    return
  }else if (dateList.value.length === 0) {
    message.error('请先初始化会计期间后再进行查询!');
    return
  }
  let startQj = strDate.value || ''
  let endQj = endDate.value || ''
  let startRq = null == riqi.value[0] ? '' : riqi.value[0].format('YYYY-MM-DD')
  let endRq = null == riqi.value[1] ? '' : riqi.value[1].format('YYYY-MM-DD')
  if ((startQj == '' && endQj == '') && riqi.value.length === 0) {
    message.error('请选择会计区间or日期期间!');
    return
  }
  if ((startQj != '' && endQj == '') || (startQj == '' && endQj != '')) {
    message.error('请完善会计区间');
    return
  } else if ((startQj != '' && endQj != '' && (startQj.substring(0, 4) != endQj.substring(0, 4)))) {
    message.error('暂不支持跨越年度会计区间查询');
    return
  } else if ((startRq != '' && endRq != '' && (startRq.substring(0, 4) != endRq.substring(0, 4)))) {
    message.error('暂不支持跨越年度日期区间查询');
    return
  }
  let pingS = modelList[defaultTabsKey.value].variable.voucherNumberStart
  let pingE = modelList[defaultTabsKey.value].variable.voucherNumberEnd
  if (pingS != '' || pingS != '') {
    if (pingS == '' || pingE == '') {
      message.error('请完善凭证编号区间条件!');
      return
    } else if (Number(pingE) < Number(pingS)) {
      message.error('凭证编号区间条件必须自小到大!');
      return
    }
  }
  let min = modelList[defaultTabsKey.value].variable.amountMin
  let max = modelList[defaultTabsKey.value].variable.amountMax
  if ((min != '' && max == '') || max != '' && min == '') {
    message.error('请完善本币金额区间条件!');
    return
  } else if (parseFloat(min) > parseFloat(max)) {
    message.error('本币金额区间条件必须自小到大!');
    return
  }
  let nMin = modelList[defaultTabsKey.value].variable.numberMin
  let nMax = modelList[defaultTabsKey.value].variable.numberMax
  if ((nMin != '' && nMax == '') || nMax != '' && nMin == '') {
    message.error('请完善数量区间条件!');
    return
  } else if (parseFloat(nMin) > parseFloat(nMax)) {
    message.error('数量条件必须自小到大!');
    return
  }

  let wbMin = modelList[defaultTabsKey.value].variable.wbAmountMin
  let wbMax = modelList[defaultTabsKey.value].variable.wbAmountMax
  if ((wbMin != '' && wbMax == '') || wbMax != '' && wbMin == '') {
    message.error('请完善外币金额区间条件!');
    return
  } else if (parseFloat(wbMin) > parseFloat(wbMax)) {
    message.error('外币金额区间条件必须自小到大!');
    return
  }

  modelList[defaultTabsKey.value].variable.periodStart = startQj
  modelList[defaultTabsKey.value].variable.periodEnd = endQj
  modelList[defaultTabsKey.value].variable.dateStart = startRq
  modelList[defaultTabsKey.value].variable.dateEnd = endRq
  // 存入自定义
  if (defaultTabsKey.value == '1' || defaultTabsKey.value == '3') {
    if ((!hasBlank(dbQueryJson.id)) && modelNoChange('1')) { // 存在个人时不同步

    } else {
      modelList['3'] = modelList[defaultTabsKey.value]
      // 更新个人
      modifyDbPersonData(modelList['3']);
    }
  }
  modelList[defaultTabsKey.value].openOne = formItems.value.openOne
  modelLoadIng.value = true
  initAuthCondition(currentDynamicTenant.value.split('-')[0] + '-' + currentDynamicTenant.value.split('-')[1], companyOperateStore.getAuthorizeList)
  emit('save', unref(modelList[defaultTabsKey.value]))
  //closeModal()
  return true
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}

// 查询

let radiovalue = ref(1);
const riqi: any = ref([]);

function radiochange(val) {
  kmList.value = [];
  timeselflg.value = val.target.value === 1;
  dateselflg.value = val.target.value === 2;
  if (val.target.value === 1) {
    riqi.value = '';
    strDate.value = maxPingzhengQj.value;
    endDate.value = maxPingzhengQj.value;
  } else {
    strDate.value = '';
    endDate.value = '';
  }
}

// 过滤设置
const transferHandleChange = (nextTargetKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
}
const transferHandleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
}
const transferHandleChange2 = (nextTargetKeys: string[]) => {
  targetKeys2.value = nextTargetKeys;
}
const transferHandleSelectChange2 = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys2.value = [...sourceSelectedKeys, ...targetSelectedKeys];
}

const [registerAssist, {openModal: openAssistPageM}] = useModal()

const openAssistPage = (key,value) => {
  openAssistPageM(true, {
    data: {'assistType': key,'oldValue':value,'dynamicTenant': currentDynamicTenant.value,'userList': userList.value}
  })
}


const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: currentDynamicTenant.value,
  owningMenuName: '凭证列表',
  owningPlan: '1',
  planPerson: userId,
  filterConditions: '',
  queryConditions: ''
})

/**
 * 针对与凭证查询条件清理无用参数
 */
const modifyDbPersonData = async (jsonData) => { // 异步更新后台最新记录
  let json = JSON.parse(JSON.stringify(jsonData))
  delete json['authority']
  delete json['constant']['thisAdInfo']
  json.variable = ObjTool.dels(json.variable, [])
  //dbQueryJson.owningPlan = json.constant.queryType
  dbQueryJson.filterConditions = JSON.stringify({'filter1':(targetKeys.value),'filter2': (targetKeys2.value)});
  dbQueryJson.queryConditions = JSON.stringify(json);
  modifyParameterValue(dbQueryJson).then(() => {
    message.success('查询参数后台同步成功！')
  }).catch(() => {
    message.warn('查询参数后台同步失败！')
  });
}

/**
 * 针对与凭证查询条件是否改变
 */
const modelNoChange = () => {
  let constant = modelList[defaultTabsKey.value].constant
  if (!hasBlank(dbQueryJson.queryConditions)) {
    let map = JSON.parse(dbQueryJson.queryConditions)
    let variableJSON = JSON.stringify(ObjTool.dels(modelList[defaultTabsKey.value].variable, []))
    let s = StrTool
    let flag = s.eq(constant.companyCode, map.constant.companyCode) && s.eq(constant.currency, map.constant.currency) && s.eq(constant.tenantId, map.constant.tenantId)
      && s.eq(variableJSON, JSON.stringify(map.variable))
    return flag;
  }
  return false;
}
/*辅助核算过滤框*/
const assistModify = (data) => {
  // 判断是赋值还是取消
  if (data.inputMap.titles.length === 0){
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = ''
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = []
  }else {
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = data.inputMap.titles
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = data.inputMap.values
  }
}

const getAssistNameByKey = (key,list) => {
  let arr = list.filter(item=>key == item.key)
  return arr.length>0?arr[0].title:'未知'
}

</script>
<style lang="less" scoped>
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
    /*> div:nth-of-type(2) {
      width: calc(100% - 200px);
      border-bottom: 1px #e6e3e3 solid;
      font-size: 18px;
      padding: 5px;

      > span {
        border-bottom: 4px #0960bd solid;
        padding: 6px 20px;
        color: #0960bd;
      }
    }*/
  }

  .open-content-up {
    position: relative;

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
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
      padding: 10px;

      li {
        margin: 10px 0;

        span {
          font-size: 14px;
          color: #747272;
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
      .ant-radio-input{
        border-color: slategrey;
      }
    }
    p:nth-of-type(2){
      margin-bottom: 0;
    }
  }
}

:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 170px;
    font-weight: bold;
  }
  .ant-tabs-tab-active {
    background-color: #65cbec !important;
    color: rgba(0, 0, 0, 0.85) !important;
  }

  .ant-tabs-tabpane-active {
    padding-left: 0 !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
  }
  .ant-tabs-tab:nth-of-type(2) {
    margin-top: 150px !important;
  }
}
</style>
<style  lang="less" scoped>
@import '/@/assets/styles/part-open.less';
</style>
