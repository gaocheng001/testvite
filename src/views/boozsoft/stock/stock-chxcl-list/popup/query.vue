<template>
  <BasicModal
    width="850px"
    class="spaceLogo"
    v-bind="$attrs"
    title="入库单查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    @visible-change="openOrClose"
    @register="register"
    :loading="modelLoadIng"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 34px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;存货现存量查询</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 70px;top: 20px;background:#ffffff">
        <FileSearchOutlined style="font-size: 70px;color: #e7e7e7;"/>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up">
        <div class="ocup-position">
          <PicLeftOutlined/>
          显示模式
        </div>
        <div class="ocup-position">
          <PicLeftOutlined/>
          个人方案
        </div>
        <Assist
          @modify="assistModify"
          @register="registerAssist"
        />
        <ModalAllPop @throwData="modalAllData" @register="registerCodeAllPopPage"/>
        <a-tabs type="card" v-model:activeKey="defaultTabsKey" @change="tabsChange"
                tabPosition="left">
          <a-tab-pane key="1" tab="汇总模式">
            <ul>
              <li>
                <AccountPicker theme="three" @reloadTable="codeChange"/>
              </li>
              <li>
                <div class="special-border-div">
                  <span>日期条件</span>
                  <div>
                    <div class="sbd-left">
                      <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                        <p>
                          <a-radio value="1"></a-radio>
                          <span>会计期间：</span>
                          <a-select
                            v-model:value="strDate"
                            show-search
                            :disabled="dateselflg"
                            style="width: 94px;"
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
                            style="width: 94px"
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
                          <a-radio value="2"></a-radio>
                          <span>制单日期：</span>
                          <a-range-picker
                            v-model:value="riqi"
                            style="width: 224px;"
                            :disabled="timeselflg"
                            @change="timechange"
                          />
                        </p>
                      </a-radio-group>
                    </div>
                    <div class="sbd-right">
                      <a-radio-group size="small" :disabled="radiovalue=='2'" @change="checkChange">
                        <a-radio-button value="1">上月</a-radio-button>
                        <a-radio-button value="2">本月</a-radio-button>
                        <a-radio-button value="3">本季</a-radio-button>
                        <a-radio-button value="4">本年</a-radio-button>
                      </a-radio-group>
                      <a-radio-group size="small" :disabled="radiovalue=='1'" @change="checkChange">
                        <a-radio-button value="5">今天</a-radio-button>
                        <a-radio-button value="6">昨天</a-radio-button>
                        <a-radio-button value="7">前天</a-radio-button>
                        <a-radio-button value="8">月末</a-radio-button>
                      </a-radio-group>
                    </div>

                  </div>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">入库单号：</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">仓库：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">收发方式：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">审核状态：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                  </a-select>
                </div>
              </li>
              <li>
                <span class="right_span">供应商名称：</span>
                <a-select
                  :allowClear="true"
                  show-searchplaceholder=""
                  style="width: 480px"
                >
                </a-select>
                <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货档案：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货分类：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务员：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务部门：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="2" tab="明细模式">
            <ul>
              <li>
                <AccountPicker theme="three" @reloadTable="codeChange"/>
              </li>
              <li>
                <div class="special-border-div">
                  <span>日期条件</span>
                  <div>
                    <div class="sbd-left">
                      <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                        <p>
                          <a-radio value="1"></a-radio>
                          <span>会计期间：</span>
                          <a-select
                            v-model:value="strDate"
                            show-search
                            :disabled="dateselflg"
                            style="width: 94px;"
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
                            style="width: 94px"
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
                          <a-radio value="2"></a-radio>
                          <span>制单日期：</span>
                          <a-range-picker
                            v-model:value="riqi"
                            style="width: 224px;"
                            :disabled="timeselflg"
                            @change="timechange"
                          />
                        </p>
                      </a-radio-group>
                    </div>
                    <div class="sbd-right">
                      <a-radio-group size="small" :disabled="radiovalue=='2'" @change="checkChange">
                        <a-radio-button value="1">上月</a-radio-button>
                        <a-radio-button value="2">本月</a-radio-button>
                        <a-radio-button value="3">本季</a-radio-button>
                        <a-radio-button value="4">本年</a-radio-button>
                      </a-radio-group>
                      <a-radio-group size="small" :disabled="radiovalue=='1'" @change="checkChange">
                        <a-radio-button value="5">今天</a-radio-button>
                        <a-radio-button value="6">昨天</a-radio-button>
                        <a-radio-button value="7">前天</a-radio-button>
                        <a-radio-button value="8">月末</a-radio-button>
                      </a-radio-group>
                    </div>

                  </div>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">入库单号：</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">仓库：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">收发方式：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">审核状态：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                  </a-select>
                </div>
              </li>
              <li>
                <span class="right_span">供应商名称：</span>
                <a-select
                  :allowClear="true"
                  show-searchplaceholder=""
                  style="width: 480px"
                >
                </a-select>
                <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货档案：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货分类：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务员：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务部门：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
            </ul>
          </a-tab-pane>

          <a-tab-pane key="3" tab="个人汇总模式">
            <ul>
              <li>
                <AccountPicker theme="three" @reloadTable="codeChange"/>
              </li>
              <li>
                <div class="special-border-div">
                  <span>日期条件</span>
                  <div>
                    <div class="sbd-left">
                      <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                        <p>
                          <a-radio value="1"></a-radio>
                          <span>会计期间：</span>
                          <a-select
                            v-model:value="strDate"
                            show-search
                            :disabled="dateselflg"
                            style="width: 94px;"
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
                            style="width: 94px"
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
                          <a-radio value="2"></a-radio>
                          <span>制单日期：</span>
                          <a-range-picker
                            v-model:value="riqi"
                            style="width: 224px;"
                            :disabled="timeselflg"
                            @change="timechange"
                          />
                        </p>
                      </a-radio-group>
                    </div>
                    <div class="sbd-right">
                      <a-radio-group size="small" :disabled="radiovalue=='2'" @change="checkChange">
                        <a-radio-button value="1">上月</a-radio-button>
                        <a-radio-button value="2">本月</a-radio-button>
                        <a-radio-button value="3">本季</a-radio-button>
                        <a-radio-button value="4">本年</a-radio-button>
                      </a-radio-group>
                      <a-radio-group size="small" :disabled="radiovalue=='1'" @change="checkChange">
                        <a-radio-button value="5">今天</a-radio-button>
                        <a-radio-button value="6">昨天</a-radio-button>
                        <a-radio-button value="7">前天</a-radio-button>
                        <a-radio-button value="8">月末</a-radio-button>
                      </a-radio-group>
                    </div>

                  </div>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">入库单号：</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">仓库：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">收发方式：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">审核状态：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                  </a-select>
                </div>
              </li>
              <li>
                <span class="right_span">供应商名称：</span>
                <a-select
                  :allowClear="true"
                  show-searchplaceholder=""
                  style="width: 480px"
                >
                </a-select>
                <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货档案：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货分类：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务员：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务部门：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="4" tab="个人明细模式">
            <ul>
              <li>
                <AccountPicker theme="three" @reloadTable="codeChange"/>
              </li>
              <li>
                <div class="special-border-div">
                  <span>日期条件</span>
                  <div>
                    <div class="sbd-left">
                      <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                        <p>
                          <a-radio value="1"></a-radio>
                          <span>会计期间：</span>
                          <a-select
                            v-model:value="strDate"
                            show-search
                            :disabled="dateselflg"
                            style="width: 94px;"
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
                            style="width: 94px"
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
                          <a-radio value="2"></a-radio>
                          <span>制单日期：</span>
                          <a-range-picker
                            v-model:value="riqi"
                            style="width: 224px;"
                            :disabled="timeselflg"
                            @change="timechange"
                          />
                        </p>
                      </a-radio-group>
                    </div>
                    <div class="sbd-right">
                      <a-radio-group size="small" :disabled="radiovalue=='2'" @change="checkChange">
                        <a-radio-button value="1">上月</a-radio-button>
                        <a-radio-button value="2">本月</a-radio-button>
                        <a-radio-button value="3">本季</a-radio-button>
                        <a-radio-button value="4">本年</a-radio-button>
                      </a-radio-group>
                      <a-radio-group size="small" :disabled="radiovalue=='1'" @change="checkChange">
                        <a-radio-button value="5">今天</a-radio-button>
                        <a-radio-button value="6">昨天</a-radio-button>
                        <a-radio-button value="7">前天</a-radio-button>
                        <a-radio-button value="8">月末</a-radio-button>
                      </a-radio-group>
                    </div>

                  </div>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">入库单号：</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">仓库：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">收发方式：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">审核状态：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                  </a-select>
                </div>
              </li>
              <li>
                <span class="right_span">供应商名称：</span>
                <a-select
                  :allowClear="true"
                  show-searchplaceholder=""
                  style="width: 480px"
                >
                </a-select>
                <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货档案：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货分类：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
              </li>
              <li>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务员：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">业务部门：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px"
                  >
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;"/>
                </div>
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
            <a-button>过滤条件</a-button>
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
import {
  PlusSquareOutlined,
  FileSearchOutlined,
  SearchOutlined,
  PicLeftOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';
import {
  findCodeKmByPeriod,
  findMaxPingZhengQiJian, findAllAuthPeriodListByUserAndCode
} from '/@/api/record/generalLedger/data';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  currentAccountTypes,
  currentCyDatas,
  filterAccListByAuth, findVoucherTypeAuthorList
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
import ModalAllPop from './modalAllPop.vue';
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import {findAllFuzhuHesuanList} from "/@/api/record/system/fuzhu-hesuan";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
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
const quarterList: any = ref([])
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

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const ishaveRjz = ref<boolean>(true)
const isShowQjlh = ref<boolean>(false)
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

let count = 0
const codeChange = async (value) => {
  ++count
  if (count == 2) return false; // 防止重复打开
  // 赋值默认参数
  dbQueryJson.accountId = value.accId;
  defaultModel.constant.companyCode = value.coCode
  defaultModel.constant.tenantId = value.accountMode
  modelLoadIng.value = true
  // 获取个人查询习惯
  accAuthList.value = companyOperateStore.allAuthorizeAccountList.filter(it=>it.ztStyle.indexOf('ZZ')!=-1) || []//filterAccListByAuth(companyOperateStore.getAccountList || [], companyOperateStore.getAuthorizeList || [])
  let dbQueryData = await findParameterValue(dbQueryJson)
  if (null != dbQueryData) { // 存在
    if (defaultTabsKey.value != '2') defaultTabsKey.value = '3'
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
  // 初始化基础参数
  modelList[defaultTabsKey.value].constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  await reLifeQueryParameter(currentDynamicTenant.value)
  modelLoadIng.value = false
}

const reLifeQueryParameter = async (dynamicTenant) => {
  if (hasBlank(dynamicTenant)) return false;
  // 加载DB所有会计期间与季报数据
  let allList = await findAllAuthPeriodListByUserAndCode({
    accId: dbQueryJson.accountId,
    code: defaultModel.constant.companyCode,
    user: userId
  });
  dateList.value = allList.filter(it => it.beiyong1 == null)
  quarterList.value = allList.filter(it => it.beiyong1 == '1')
  if (dateList.value.length > 0) {
    const busDates = busDate.split('-');
    // 查看当前业务日期与期间列表年度是否匹配
    let blist = dateList.value.filter(it => it.iyear == busDates[0])
    if (blist.length > 0) { // 存在与业务日期相匹配的年度 使用业务期间 反之使用最大年度期间
      let busQj = blist.filter(it => it.dateStart.startsWith(busDates[1]))[0]['value']
      maxPingzhengQj.value = busQj
      strDate.value = busQj
      endDate.value = busQj
    } else {
      // 获取最大凭证期间
      const qijian = (await useRouteApi(findMaxPingZhengQiJian, {schemaName: dynamicTenant})({})) || '';
      if (hasBlank(qijian)) {
        maxPingzhengQj.value = ''
        strDate.value = dateList.value[0].value
        endDate.value = dateList.value[dateList.value.length - 1].value
      } else {
        maxPingzhengQj.value = qijian.substring(0, 4) + '-' + qijian.substring(4, 6)
        strDate.value = maxPingzhengQj.value
        endDate.value = maxPingzhengQj.value
      }
    }
    // 获取当前所选年度科目
    await reLifeKmList(currentDynamicTenant.value, '1')
    // 获取 币种 类别 人员 辅助核算
    await reLifeEtcList(currentDynamicTenant.value)
  } else {
    await pointMessage({title: '温馨提示', content: '请先进行账套年度授权后再进行查询操作！', delay: true})
    modelList[defaultTabsKey.value].constant.companyCode = ''
    currentDynamicTenant.value = ''
    strDate.value = ''
    endDate.value = ''
  }
}

async function reLifeKmList(dynamicTenant, sameYear) {
  if (hasBlank(dynamicTenant)) return
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
  kmList.value = await useRouteApi(findCodeKmByPeriod, {schemaName: dynamicTenant})({
    strDate: strDate.value,
    endDate: endDate.value,
    accId: tenantName,
    userId: userId,
    sameYear: sameYear
  });
}

async function reLifeEtcList(dynamicTenant) {
  // 获取币种信息
  await useRouteApi(currentCyDatas, {schemaName: dynamicTenant})({accId: dbQueryJson.accountId}).then(res1 => {
    bzList.value = res1.items //.filter(item => item.foreignCode.indexOf(thisAccObj.currency) == -1)
  });
  // 人员
  await useRouteApi(psnFindByFlag, {schemaName: dynamicTenant})({}).then(res => {
    userList.value = res
  })
  // 凭证类别
   await useRouteApi(findVoucherTypeAuthorList, {schemaName: dynamicTenant})({
    userId: userId,
    tenantId: dynamicTenant
  }).then(res => {
    if(res == null || res.length == 0){
      createWarningModal({title: '温馨提示', content: '操作员未分配凭证类别操作权限，不能进行凭证相关操作！'});
      setTimeout(()=> handleClose(),3000)
    }else {
      typesList.value = res
    }
  })
  // 初始化存在的自定义辅助核算
  let fzL = await useRouteApi(findAllFuzhuHesuanList, {schemaName: dynamicTenant})({}) || []
  if (fzL.length > 0) {
    startRendering.value = true // 开始加载辅助项
    fzL.forEach(item => filterDatas2.push({key: 'cdfine' + item.cdfine, title: item.cname}))
  }
}

const oldStrYear = ref('')

async function handleChangeStrDate() {
  endDate.value = strDate.value
  if (defaultTabsKey.value != '2') { // 年度发生变化
    let theY = strDate.value.split('-')[0]
    if (!hasBlank(oldStrYear.value) && oldStrYear.value != theY) await reLifeKmList(currentDynamicTenant.value, '1')
    oldStrYear.value = theY
  }
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
    await reLifeKmList(currentDynamicTenant.value, '1')
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
    if (!hasBlank(strDate.value) && !hasBlank(endDate.value)) {
      if (strDate.value.split('-')[0] != endDate.value.split('-')[0]) await reLifeKmList(currentDynamicTenant.value, '0')
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
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    currency: '',
    tenantId: '',
    companyCode: '',
    queryType: '1',
    showType: '2',
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
    accounting: {},
    assists: {}
  }
}
const modelList = reactive({
  '1': {
    constant: {
      currency: '',
      tenantId: '',
      thisAdInfo: {},
      queryType: '1',
      showType: '2',
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
      accounting: {},
      assists: {},
    }
  },
  '2': {
    constant: {
      currency: '',
      tenantId: '',
      thisAdInfo: {},
      queryType: '1',
      showType: '2',
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
      accounting: {},
      assists: {},
    }
  },
  '3': {
    constant: {
      currency: '',
      tenantId: '',
      queryType: '2',
      showType: '2',
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
      accounting: {},
      assists: {},
    }
  },
  '4': {}
})

const openOrClose = (visible: boolean) => {
  // 初始化选中
  if (visible && null != formItems.value.openOne && Object.keys(modelList['3']).length != 0) {
    //默认赋值
    defaultTabsKey.value = '1'
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
  if ((value == '1' || value == '3' || value == '2') && modelList[defaultTabsKey.value].constant.companyCode == '') {
    modelList[defaultTabsKey.value].constant.companyCode = defaultModel.constant.companyCode
    modelList[defaultTabsKey.value].constant.tenantId = defaultModel.constant.tenantId
  }
}

function initAuthCondition(adName, authList) {
  // 获取当前选中的年度
  modelList[defaultTabsKey.value].constant.thisAdInfo = authList.filter(item => item.accId === adName)[0]
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
/*  if (obj.ccodeAll != '1') modelList[defaultTabsKey.value].authority.codes = JSON.parse(obj.codeListJson)
  if (obj.ccodeAll != '1') modelList[defaultTabsKey.value].authority.types = JSON.parse(obj.voucherTypeJson)*/
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
  } else if (ifCrossYear.value != '2' && (startQj != '' && endQj != '' && (startQj.substring(0, 4) != endQj.substring(0, 4)))) {
    message.error('暂不支持跨越年度会计区间查询');
    return
  } else if (ifCrossYear.value != '2' && (startRq != '' && endRq != '' && (startRq.substring(0, 4) != endRq.substring(0, 4)))) {
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
  initAuthCondition(currentDynamicTenant.value.split('-')[0] + '-' + currentDynamicTenant.value.split('-')[1], accAuthList.value)
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

let radiovalue = ref('1');
const riqi: any = ref([]);

function radiochange(val) {
  kmList.value = [];
  timeselflg.value = val.target.value === '1';
  dateselflg.value = val.target.value === '2';
  if (val.target.value === '1') {
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

const openAssistPage = (key, value) => {
  openAssistPageM(true, {
    data: {
      'assistType': key,
      'oldValue': value,
      'dynamicTenant': currentDynamicTenant.value,
      'userList': userList.value
    }
  })
}


const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: '',
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
  dbQueryJson.filterConditions = JSON.stringify({
    'filter1': (targetKeys.value),
    'filter2': (targetKeys2.value)
  });
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
  if (data.inputMap.titles.length === 0) {
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = ''
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = []
  } else {
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = data.inputMap.titles
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = data.inputMap.values
  }
}

const getAssistNameByKey = (key, list) => {
  let arr = list.filter(item => key == item.key)
  return arr.length > 0 ? arr[0].title : '未知'
}


import dayjs from "dayjs";

const checkChange = (e) => {
  let v = e.target.value
  let dates = strDate.value.split('-')
  switch (v) {
    case '1':
      let the = parseInt(dates[1])
      if (the != 1) {
        strDate.value = dates[0] + '-' + (((the - 1) > 9) ? `${(the - 1)}` : `0${(the - 1)}`)
        endDate.value = strDate.value
      } else {
        message.info('暂无上月！')
      }
      break
    case '2':
      strDate.value = dates[0] + '-' + busDate.split('-')[1]
      endDate.value = strDate.value
      break
    case '3':
      let qList = quarterList.value.filter(it => it.iyear == dates[0])
      if (qList.length > 0) { // 存在季报
        let arr = qList.filter(it => {
          let min = moment(it.iyear + '-' + it.dateStart, 'YYYY-MM-DD')
          let max = moment(it.iyear + '-' + it.dateEnd, 'YYYY-MM-DD')
          let the = moment(strDate.value + '-01', 'YYYY-MM-DD')
          return min <= the && the <= max
        })
        strDate.value = arr[0].iyear + '-' + arr[0].dateStart.substring(0, 2)
        endDate.value = arr[0].iyear + '-' + arr[0].dateEnd.substring(0, 2)
      } else {
        let min = '01'
        let max = '03'
        let v = dates[1]
        switch (v) {
           case '04':case '05':case '06':
            min = '04'
            max = '06'
            break
          case '07' :case '08' :case '09':
            min = '07'
            max = '09'
            break
          case '10' :case '11' :case '12':
            min = '10'
            max = '12'
            break
        }
        strDate.value = dates[0] + '-' + min
        endDate.value = dates[0] + '-' + max
      }
      break
    case '4':
      let list = dateList.value.filter(it => it.iyear == dates[0])
      strDate.value = list[0].value
      endDate.value = list[list.length - 1].value
      break
    case '5':
      let d = dayjs(busDate, 'YYYY-MM-DD')
      riqi.value = [d, d]
      break
    case '6':
      let yday = dayjs(busDate, 'YYYY-MM-DD').add(-1, 'day')
      riqi.value = [yday, yday]
      break
    case '7':
      let yday1 = dayjs(busDate, 'YYYY-MM-DD').add(-2, 'day')
      riqi.value = [yday1, yday1]
      break
    case '8':
      let yday2 = dayjs(busDate, 'YYYY-MM-DD').endOf('month')
      riqi.value = [yday2, yday2]
      break
  }
}
/*******会计科目弹框********/
const [registerCodeAllPopPage, {openModal: openCodeAllPopPage}] = useModal();
const modalAllData = (data) => {
  console.log(data)
}

function generateAnnualInterval() {
  let arr = []
  if (hasBlank(strDate.value)) {
    arr = [riqi.value[0].format('YYYY-MM-DD'), riqi.value[1].format('YYYY-MM-DD')]
  } else if (!hasBlank(strDate.value)) {
    arr = [strDate.value, endDate.value]
  }
  if (arr.length == 0) return [];
  let start = parseInt(arr[0].substring(0, 4))
  let end = parseInt(arr[1].substring(0, 4))
  let list = []
  while (start <= end) {
    list.push(start)
    start++
  }
  return list
}

const openKemu = () => {
  let years = generateAnnualInterval()
  if (years.length != 0)
    openCodeAllPopPage(true, {
      database: currentDynamicTenant.value,
      accId: dbQueryJson.accountId,
      iyearList: years,
    });
}
/*******会计科目弹框********/

</script>
<style lang="less" scoped>
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
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
    top: 15px;

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
      padding: 10px;

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

      li:not(:nth-of-type(2)) {
        padding-left: 5%;
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
  }

  label:not(.ant-radio-button-wrapper) {
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

  :deep(.ant-picker-range) {
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
    margin: 20px 1%;

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
}

:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 170px;
    font-weight: bold;
    display: inline-block;
  }

  .ant-tabs-tab-active {
    color: #65cbec !important;
  }

  .ant-tabs-tabpane-active {
    padding-left: 0 !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
  }

  .ant-tabs-tab:nth-of-type(3) {
    margin-top: 110px !important;
  }
}
</style>
