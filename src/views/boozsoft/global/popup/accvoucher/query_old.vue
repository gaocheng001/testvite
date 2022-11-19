<template>
  <BasicModal
    width="1000px"
    class="spaceLogo"
    v-bind="$attrs"
    title="凭证查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="modelLoadIng"
    @visible-change="openOrClose"
    @register="register"
  >
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-title">
        <div>
          系统方案
        </div>
        <div>
          <span>
          查询条件
          </span>
        </div>
      </div>
      <div class="open-content-up">
        <div class="ocup-position">
          个人方案
        </div>
        <AccountInfo
          @modify="modify"
          @register="registerInfo"
        />
        <a-tabs type="card" v-model:activeKey="defaultTabsKey" @change="tabsChange"
                tabPosition="left" style="height: 430px">
          <a-tab-pane key="1" tab="标准模式">
            <ul>
              <li>
                <span>公司代码：</span>
                <a-input v-model:value="modelList['1'].constant.companyCode"
                         @keyup.enter="codeChange(modelList['1'].constant.companyCode)"
                         placeholder="" style="width: 80px">
                  <template #suffix>
                    <SearchOutlined @click="openSelection"/>
                  </template>
                </a-input>
                <span style="color: red;font-size: 18px;">⋆</span>
                <span>&emsp;&emsp;&emsp;&emsp;公司简称：<span
                  style="color: blue">&emsp;&emsp;&emsp;&emsp;{{
                    showThisCodeToName(modelList['1'].constant.companyCode)
                  }}</span></span>
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <a-radio :value="1">
                      <!--                      期&emsp;&emsp;间：-->
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 227px;margin-left: 42px;"
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
                      style="width: 227px"
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
                    <!--                    日&emsp;&emsp;期：-->
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 496px;    margin-left: 42px;"
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li><span>凭证类别：</span>
                <a-select
                  v-model:value="modelList['1'].variable.voucherType"
                  placeholder=""
                  style="width: 200px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
                &emsp;&emsp;<span class="right_span">凭证摘要：</span>
                <a-input v-model:value="modelList['1'].variable.summary" :allowClear="true"
                         placeholder="摘要" style="width: 200px"/>
              </li>
              <li><span>凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['1'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                </a-select>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('subjectNumber') != -1">
                  <span>科目编码：</span>
                  <a-select
                    :allowClear="true"
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
                    style="width: 200px"
                    v-model:value="modelList['1'].variable.direction"
                  >
                    <a-select-option value="jf">借方</a-select-option>
                    <a-select-option value="df">贷方</a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('number') != -1"><span>数量：&emsp;&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.numberMin" :allowClear="true"
                         placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.numberMax" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li v-if="targetKeys.indexOf('amount') != -1"><span>本币金额：</span>
                <a-input v-model:value="modelList['1'].variable.amountMin" :allowClear="true"
                         placeholder="最小金额" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.amountMax" :allowClear="true"
                         placeholder="最大金额" style="width: 227px"/>
              </li>
              <li><span>外币币种：</span>
                <a-select style="width: 160px" v-model:value="modelList['1'].constant.currency"
                          :allowClear="true">
                  <a-select-option v-for="d in bzList" :key="d.id" :value="d.foreignName">
                    {{ d.foreignName }}
                  </a-select-option>
                </a-select>
                <template v-if="targetKeys.indexOf('wbAmount') != -1">
                  &emsp;&emsp;<span class="right_span">外币金额：</span>
                  <a-input v-model:value="modelList['1'].variable.wbAmountMin" :allowClear="true"
                           placeholder="最小金额" style="width: 100px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input v-model:value="modelList['1'].variable.wbAmountMax" :allowClear="true"
                           placeholder="最大金额" style="width: 100px"/>
                </template>

              </li>
              <li>
                <template v-if="targetKeys.indexOf('reviewStatus') != -1">
                  <span>审核状态：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['1'].variable.reviewStatus"
                    placeholder="未审核/已审核/待审核"
                    style="width: 200px"
                  >
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
                    style="width: 200px"
                    v-model:value="modelList['1'].variable.bookStatus"
                  >
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
                    v-model:value="modelList['1'].variable.checkMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  <span>出纳：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
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
                  &emsp;&emsp;<span class="right_span">主管：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['1'].variable.reviewMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('bookMan') != -1">
                <span>记账人：&emsp;</span>
                <a-select
                  :allowClear="true"
                  placeholder=""
                  style="width: 200px"
                  v-model:value="modelList['1'].variable.bookMan"
                >
                  <a-select-option v-for="(item,index) in userList" :key="index"
                                   :value="item.psnName">{{ item.psnName }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <a-button>✚添加辅助核算条件</a-button>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane :disabled="!whetherGroup" key="2" tab="集团模式">

            <ul>
              <li>
                <span>核算单位：</span>
                <a-select
                  mode="multiple"
                  v-model:value="modelList['2'].constant.accIds"
                  style="width: 80%"
                  placeholder="可多选"
                  option-label-prop="label"
                >
                  <a-select-option :key="index" :value="item.accId" :label="item.accNameCn" v-for="(item,index) in accAuthList.filter(ite=>ite.independent != '1')">
                    {{item.accNameCn}}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <a-radio :value="1">
                      <!--                      期&emsp;&emsp;间：-->
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 227px;margin-left: 42px;"
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
                      style="width: 227px"
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
                    <!--                    日&emsp;&emsp;期：-->
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 496px;    margin-left: 42px;"
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['2'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['2'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li><span>凭证类别：</span>
                <a-select
                  v-model:value="modelList['2'].variable.voucherType"
                  placeholder=""
                  style="width: 200px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
                &emsp;&emsp;<span class="right_span">凭证摘要：</span>
                <a-input v-model:value="modelList['2'].variable.summary" :allowClear="true"
                         placeholder="摘要" style="width: 200px"/>
              </li>
              <li><span>凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['2'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                </a-select>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('subjectNumber') != -1">
                  <span>科目编码：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['2'].variable.subjectNumber"
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
                    style="width: 200px"
                    v-model:value="modelList['2'].variable.direction"
                  >
                    <a-select-option value="jf">借方</a-select-option>
                    <a-select-option value="df">贷方</a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('number') != -1"><span>数量：&emsp;&emsp;</span>
                <a-input v-model:value="modelList['2'].variable.numberMin" :allowClear="true"
                         placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['2'].variable.numberMax" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li v-if="targetKeys.indexOf('amount') != -1"><span>本币金额：</span>
                <a-input v-model:value="modelList['2'].variable.amountMin" :allowClear="true"
                         placeholder="最小金额" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['2'].variable.amountMax" :allowClear="true"
                         placeholder="最大金额" style="width: 227px"/>
              </li>
              <li><span>外币币种：</span>
                <a-select style="width: 160px" v-model:value="modelList['2'].constant.currency"
                          :allowClear="true">
                  <a-select-option v-for="d in bzList" :key="d.id" :value="d.foreignName">
                    {{ d.foreignName }}
                  </a-select-option>
                </a-select>
                <template v-if="targetKeys.indexOf('wbAmount') != -1">
                  &emsp;&emsp;<span class="right_span">外币金额：</span>
                  <a-input v-model:value="modelList['2'].variable.wbAmountMin" :allowClear="true"
                           placeholder="最小金额" style="width: 100px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input v-model:value="modelList['2'].variable.wbAmountMax" :allowClear="true"
                           placeholder="最大金额" style="width: 100px"/>
                </template>

              </li>
              <li>
                <template v-if="targetKeys.indexOf('reviewStatus') != -1">
                  <span>审核状态：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['2'].variable.reviewStatus"
                    placeholder="未审核/已审核/待审核"
                    style="width: 200px"
                  >
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
                    style="width: 200px"
                    v-model:value="modelList['2'].variable.bookStatus"
                  >
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
                    v-model:value="modelList['2'].variable.preparedMan"
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
                    v-model:value="modelList['2'].variable.checkMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  <span>出纳：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
                    placeholder=""
                    style="width: 200px"
                    v-model:value="modelList['2'].variable.cashierMan"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-if="targetKeys.indexOf('reviewMan') != -1">
                  &emsp;&emsp;<span class="right_span">主管：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['2'].variable.reviewMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('bookMan') != -1">
                <span>记账人：&emsp;</span>
                <a-select
                  :allowClear="true"
                  placeholder=""
                  style="width: 200px"
                  v-model:value="modelList['2'].variable.bookMan"
                >
                  <a-select-option v-for="(item,index) in userList" :key="index"
                                   :value="item.psnName">{{ item.psnName }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <a-button>✚添加辅助核算条件</a-button>
              </li>
            </ul>


          </a-tab-pane>
          <a-tab-pane key="3" tab="个人标准模式">
            <ul>
              <li>
                <span>公司代码：</span>
                <a-input v-model:value="modelList['3'].constant.companyCode"
                         @keyup.enter="codeChange(modelList['3'].constant.companyCode)"
                         placeholder="" style="width: 80px">
                  <template #suffix>
                    <SearchOutlined @click="openSelection"/>
                  </template>
                </a-input>
                <span style="color: red;font-size: 18px;">⋆</span>
                <span>&emsp;&emsp;&emsp;&emsp;公司简称：&emsp;&emsp;&emsp;&emsp;<span
                  style="color: blue">{{
                    showThisCodeToName(modelList['3'].constant.companyCode)
                  }}</span></span>
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <a-radio :value="1">
                      <!--                      期&emsp;&emsp;间：-->
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 227px;margin-left: 42px;"
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
                      style="width: 227px"
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
                    <!--                    日&emsp;&emsp;期：-->
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 496px;    margin-left: 42px;"
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li><span>凭证类别：</span>
                <a-select
                  v-model:value="modelList['3'].variable.voucherType"
                  placeholder=""
                  style="width: 200px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
                &emsp;&emsp;<span class="right_span">凭证摘要：</span>
                <a-input v-model:value="modelList['3'].variable.summary" :allowClear="true"
                         placeholder="摘要" style="width: 200px"/>
              </li>
              <li><span>凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['3'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                </a-select>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('subjectNumber') != -1">
                  <span>科目编码：</span>
                  <a-select
                    :allowClear="true"
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
                    style="width: 200px"
                    v-model:value="modelList['3'].variable.direction"
                  >
                    <a-select-option value="jf">借方</a-select-option>
                    <a-select-option value="df">贷方</a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('number') != -1"><span>数量：&emsp;&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.numberMin" :allowClear="true"
                         placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.numberMax" :allowClear="true"
                         placeholder="" style="width: 227px"/>
              </li>
              <li v-if="targetKeys.indexOf('amount') != -1"><span>本币金额：</span>
                <a-input v-model:value="modelList['3'].variable.amountMin" :allowClear="true"
                         placeholder="最小金额" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.amountMax" :allowClear="true"
                         placeholder="最大金额" style="width: 227px"/>
              </li>
              <li><span>外币币种：</span>
                <a-select style="width: 160px" v-model:value="modelList['3'].constant.currency"
                          :allowClear="true">
                  <a-select-option v-for="d in bzList" :key="d.id" :value="d.foreignName">
                    {{ d.foreignName }}
                  </a-select-option>
                </a-select>
                <template v-if="targetKeys.indexOf('wbAmount') != -1">
                  &emsp;&emsp;<span class="right_span">外币金额：</span>
                  <a-input v-model:value="modelList['3'].variable.wbAmountMin" :allowClear="true"
                           placeholder="最小金额" style="width: 100px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input v-model:value="modelList['3'].variable.wbAmountMax" :allowClear="true"
                           placeholder="最大金额" style="width: 100px"/>
                </template>

              </li>
              <li>
                <template v-if="targetKeys.indexOf('reviewStatus') != -1">
                  <span>审核状态：</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['3'].variable.reviewStatus"
                    placeholder="未审核/已审核/待审核"
                    style="width: 200px"
                  >
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
                    style="width: 200px"
                    v-model:value="modelList['3'].variable.bookStatus"
                  >
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
                    v-model:value="modelList['3'].variable.checkMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li>
                <template v-if="targetKeys.indexOf('checkMan') != -1">
                  <span>出纳：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
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
                  &emsp;&emsp;<span class="right_span">主管：&emsp;&emsp;</span>
                  <a-select
                    :allowClear="true"
                    v-model:value="modelList['3'].variable.reviewMan"
                    placeholder=""
                    style="width: 200px"
                  >
                    <a-select-option v-for="(item,index) in userList" :key="index"
                                     :value="item.psnName">{{ item.psnName }}
                    </a-select-option>
                  </a-select>
                </template>
              </li>
              <li v-if="targetKeys.indexOf('bookMan') != -1">
                <span>记账人：&emsp;</span>
                <a-select
                  :allowClear="true"
                  placeholder=""
                  style="width: 200px"
                  v-model:value="modelList['3'].variable.bookMan"
                >
                  <a-select-option v-for="(item,index) in userList" :key="index"
                                   :value="item.psnName">{{ item.psnName }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <a-button>✚添加辅助核算条件</a-button>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane :disabled="!whetherGroup" key="4" tab="个人集团模式">
            <!--
                                        <span>核算单位：</span>
                                        <a-select
                                          mode="multiple"
                                          style="width: 80%"
                                          placeholder="可多选"
                                          option-label-prop="label"
                                        >
                                          <a-select-option value="湖北万亚" label="湖北万亚">
                                            湖北万亚
                                          </a-select-option>
                                          <a-select-option value="北京希格" label="北京希格">
                                            北京希格
                                          </a-select-option>
                                        </a-select>
                  -->
          </a-tab-pane>
        </a-tabs>
      </div>

    </div>

    <template #footer>
      <div style="height: 35px">
        <div style="float: left">
          <a-popconfirm
            ok-text="确定"
            cancel-text="放弃"
            @confirm="confirm"
            @cancel="cancel"
          >
            <template #icon><b>过滤条件设置</b><br></template>
            <template #title>
              <br/>
              <a-transfer
                :data-source="filterDatas"
                :titles="['待选条件', '已选条件']"
                :selected-keys="selectedKeys"
                :target-keys="targetKeys"
                :render="item => item.title"
                :showSelectAll="false"
                @change="transferHandleChange"
                @selectChange="transferHandleSelectChange"
              />
            </template>
            <a-button type="primary">过滤条件</a-button>
          </a-popconfirm>
        </div>
        <div style="float: right">
          <a-button @click="handleClose">放弃</a-button>
          <a-button @click="handleOk" type="primary">确定</a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref, reactive, onMounted, watch, computed} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {PageWrapper} from '/@/components/Page'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  Table as ATable,
  Popconfirm as APopconfirm,
  Tabs as ATabs, message, Transfer as ATransfer
} from "ant-design-vue"
import {SearchOutlined} from '@ant-design/icons-vue'
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {Moment} from 'moment';
import {
  findPeriodByAccontId,
  findCodeKmByPeriod, findMaxPingZhengQiJian
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
  getCurrentAccountName,
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {psnFindByFlag} from "/@/api/psn/psn";
import AccountInfo from "/@/views/boozsoft/global/popup/accvoucher/AccountInfo.vue";
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
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
const userId = userStore.getUserInfo.id
//查询条件
// 已授权账套列表
const accAuthList = ref([])
// 账套授权信息
const userAuthMap = ref([])

const defaultAdName = getCurrentAccountName(false)
const tempCode = ref(defaultAdName)
const defaultYear = getCurrentAccountName(true).split('-')[2]
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
    title: `出纳`
  }, {
    key: 'reviewMan',
    title: `主管`
  }, {
    key: 'bookMan',
    title: `记账人`
  }
]
onMounted(async () => {
  // 获取所有账套信息 并过滤已授权的账套
  let accList = await getAdInfoDatas()
  // 获取当前用户的权限根据用户信息汇率
  userAuthMap.value = await getAllAccAuths({'userId': userId})
  accAuthList.value = filterAccListByAuth(accList, userAuthMap.value)
  if (accAuthList.value.length != 0) {
    let codes = getAdObjInfoByCoCode(defaultAdName, 'accId')
    if (codes != null) {
      defaultModel.constant.companyCode = codes.coCode
    }
    // 第一查询数据库是否存在 存在使用数据库 反之
    let dbQueryData = await findParameterValue(dbQueryJson)
    if (null != dbQueryData) {
      defaultTabsKey.value = '3'
      dbQueryJson.id = dbQueryData.id
      dbQueryJson.queryConditions = dbQueryData.queryConditions
      dbQueryJson.filterConditions = dbQueryData.filterConditions
      if (!hasBlank(dbQueryData.filterConditions)) targetKeys.value = JSON.parse(dbQueryData.filterConditions)
      if (!hasBlank(dbQueryData.queryConditions)) {
        let queryMap = JSON.parse(dbQueryData.queryConditions)
        modelList["3"].constant = queryMap.constant
        modelList["3"].variable = queryMap.variable
        currentDynamicTenant.value = getAdObjInfoByCoCode(queryMap.constant.companyCode, 'coCode').accId + '-' + defaultYear
      }
    } else {
      currentDynamicTenant.value = getCurrentAccountName(true)
      modelList[defaultTabsKey.value].constant = defaultModel.constant
    }
    reLifeQueryParameter(currentDynamicTenant.value)
  } else {
    await pointMessage({
      title: '温馨提示',
      content: '请联系管理员获取相关账套权限！',
      delay: true,
      onOk: async () => handleClose()
    })
  }
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
      if (a > 0) {
        closeModal()
      } else {
        createWarningModal({title: '温馨提示', content: '暂无任何查询结果！'});
      }
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
  dateList.value = await findPeriodByAccontId(tenantName);
  if (dateList.value.length > 0) {
    const qijian = await useRouteApi(findMaxPingZhengQiJian, {schemaName: dynamicTenant})({}) || '';
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
    // 是否集团
    let thisAccObj = getAdObjInfoByCoCode(tenantName, 'accId')
    tempCode.value = thisAccObj.coCode
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
    tempCode.value = ''
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

const codeChange = async (value) => {
  if (hasBlank(value) || tempCode.value == value) return
  let arr = accAuthList.value.filter(item => item.coCode === value)
  if (arr.length == 0) {
    message.warn('代码不存在停止切换！')
    modelList[defaultTabsKey.value].constant.companyCode = ''
  } else if (arr.length > 0) {
    let newName = arr[0].accId
    // 查看是否存在 查询参数
    dbQueryJson.accountId = newName;
    let dbQueryData = await findParameterValue(dbQueryJson)
    if (null != dbQueryData) { // 存在
      defaultTabsKey.value = '3'
      dbQueryJson.id = dbQueryData.id
      dbQueryJson.queryConditions = dbQueryData.queryConditions
      dbQueryJson.filterConditions = dbQueryData.filterConditions
      if (!hasBlank(dbQueryData.filterConditions)) targetKeys.value = JSON.parse(dbQueryData.filterConditions)
      if (!hasBlank(dbQueryData.queryConditions)) {
        let queryMap = JSON.parse(dbQueryData.queryConditions)
        modelList["3"].constant = queryMap.constant
        modelList["3"].variable = queryMap.variable
      }
    } else {
      // 清除条件
      modelList[defaultTabsKey.value].constant = defaultModel.constant
      modelList[defaultTabsKey.value].constant.companyCode = value
      modelList[defaultTabsKey.value].variable = defaultModel.variable
      dbQueryJson.id = null
    }
    currentDynamicTenant.value = newName + '-' + defaultYear
    reLifeQueryParameter(currentDynamicTenant.value)
  }
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
    // 会计科目
    await reLifeKmList(currentDynamicTenant.value)
    timeselflg.value = true;
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
    currency: '',tenantId: '',
    companyCode: '',
    queryType: '1',
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
  }
}
const modelList = reactive({
  '1': {
        constant: {
    currency: '',tenantId: '',
    companyCode: '',
    queryType: '1',
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
      /*  billNumberStart: '',
        billNumberEnd: '',*/
      preparedMan: '',
      checkMan: '',
      cashierMan: '',
      reviewMan: '',
      bookMan: '',
    }
  },
  '2': {
    constant: {
      currency: '',
      thisAdInfo: {},
      queryType: '0',
      accIds: []
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
    }
  },
  '3': {
    constant: {
      currency: '',
      queryType: '2',
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
  } else if (modelList[defaultTabsKey.value].constant.queryType == '0' && hasBlank(modelList[defaultTabsKey.value].constant.accIds)) {
    message.error('至少选择一家核算单位!');
    return
  } else if (dateList.value.length === 0) {
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
  }else if (defaultTabsKey.value == '2' || defaultTabsKey.value == '4'){
    if ((!hasBlank(dbQueryJson.id)) && modelNoChange('0')) { // 存在个人时不同步

    } else {
      modelList['4'] = modelList[defaultTabsKey.value]
      // 更新个人
     // modifyDbPersonData(modelList['4']);
    }
  }
  modelList[defaultTabsKey.value].openOne = formItems.value.openOne
  modelList[defaultTabsKey.value].accAuthList = accAuthList.value
  modelList[defaultTabsKey.value].userAuthMap = userAuthMap.value
  modelLoadIng.value = true
  initAuthCondition(currentDynamicTenant.value.split('-')[0] + '-' + currentDynamicTenant.value.split('-')[1], userAuthMap.value)
  emit('save', unref(modelList[defaultTabsKey.value]))
  //closeModal()
  return true
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/home/welcome')
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

const [registerInfo, {openModal: openInfoPageM}] = useModal()
const openSelection = () => {
  openInfoPageM(true, {
    data: {accAuthList: accAuthList.value}
  })
}

const modify = (code) => {
  if (modelList[defaultTabsKey.value].constant.companyCode != code) {
    modelList[defaultTabsKey.value].constant.companyCode = code
    codeChange(code)
  }
}
const showThisCodeToName = (code) => {
  let s = ''
  let arr = accAuthList.value.filter(item => item.coCode == code)
  if (arr.length > 0) s = arr[0].accNameCn
  return s
}
const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: defaultAdName,
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
  dbQueryJson.filterConditions = JSON.stringify(targetKeys.value);
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
const modelNoChange = (type) => {
  let constant = modelList[defaultTabsKey.value].constant
  if (!hasBlank(dbQueryJson.queryConditions)) {
    let map = JSON.parse(dbQueryJson.queryConditions)
    let variableJSON = JSON.stringify(ObjTool.dels(modelList[defaultTabsKey.value].variable, []))
    let s = StrTool
    let flag =  type == '1'?(s.eq(constant.companyCode, map.constant.companyCode)):(s.eq(JSON.stringify(constant.accIds), map.constant.accIds||''))
    flag = flag && s.eq(constant.currency, map.constant.currency)
      && s.eq(variableJSON, JSON.stringify(map.variable))
    return flag;
  }
  return false;
}
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector), :deep(.ant-input-affix-wrapper) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
}

.nc-open-content {
  position: relative;

  .open-content-foot {
    display: block;
    position: fixed;
    margin-top: 43px;
  }

  .ant-tabs-tabpane-active {
    overflow-y: auto;
    height: 430px;
  }

  input {
    width: 35%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
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
    }
  }
}


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

  > div:nth-of-type(2) {
    width: calc(100% - 200px);
    border-bottom: 1px #e6e3e3 solid;
    font-size: 18px;
    padding: 5px;

    > span {
      border-bottom: 4px #0960bd solid;
      padding: 6px 20px;
      color: #0960bd;
    }
  }
}

.open-content-up {
  position: relative;

  .ocup-position {
    position: absolute;
    left: 0;
    bottom: 100px;
    width: 200px;
    background-color: #efeeee;
    color: black;
    font-size: 20px;
    text-align: center;
    padding: 5px 10px;
  }

  ul {
    padding: 20px 40px;

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

:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 200px;
    font-weight: bold;
    padding-right: 40px !important;
    margin-bottom: 0px !important;
  }

  .ant-tabs-tab-active {
    background-color: #0960bd !important;
    color: white !important;
  }

  .ant-tabs-tab:nth-of-type(3) {
    margin-top: 250px;
  }
}

</style>
