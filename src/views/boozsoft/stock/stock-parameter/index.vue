<template>
  <div class="app-financial-info" :style="{height: (windowHeight-130)+'px'}">
    <div class="a-container-head">
      <div class="a-c-head-title">
        <SettingOutlined style="font-size: 30px;color: #666666;float: left;margin: 0 .5%;"/>
        <h2>参数设置</h2>
        <div style="float: right;margin-top: -40px;" >
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
      </div>
      <div class="a-c-head-btns">
        <div class="ant-btn-group a-c-h-btns-group" style="min-width: 600px">
          <AccountPicker theme="three" @reloadTable="dynamicAdReload" style="width: 100%"/>
        </div>
      </div>
    </div>
    <div class="setting_box"></div>
    <div class="a-container-content">
      <a-tabs type="card" :tabBarGutter="0" v-model:activeKey="activeKey" tabPosition="left">
        <a-tab-pane key="1" :style="activeKey=='1'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}">
          <template #tab>
            <span style="line-height: 30px;display: flex;color: white;"><AppstoreOutlined style="font-size: 30px;color: #666666;background-color: white;"/>销售业务参数</span>
          </template>
          <div class="a-container-content-one">
            <div class="acco-btn">
              <a-button v-if="isEdit" type="primary" @click="handleBus('0')">编辑</a-button>
              <template v-if="!isEdit">
                <a-button @click="handleBus('1')">恢复系统设置</a-button>
                <a-button type="primary" @click="handleBus('2')">保存</a-button>
                <a-button @click="handleBus('3')">放弃</a-button>
              </template>
            </div>
            <a-checkbox-group v-model:value="dataModel.controlList" :disabled="isEdit" style="width: 100%;">
              <div class="acco-sideline">
                <span>业务控制</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="xsKzqxCust">
                        控制客户权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzqxDepot">
                        控制仓库权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzqxStock">
                        控制存货权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzqxStockClass">
                        控制存货分类权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzqxCustClass">
                        控制客户权限
                      </a-checkbox>
                    </a-col>
<!--                    <a-col :span="5">
                      <a-checkbox value="xsOutCloseOrder">
                        出库完成自动关闭订单
                      </a-checkbox>
                    </a-col>-->

                    <a-col :span="5">
                      <a-checkbox value="xsShXkd">
                        销货单审核生成出库单
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsThXhd">
                        销售退货必须参照销货单
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsByDd">
                        普通销售必有订单
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzxyCust">
                        控制客户信用
                      </a-checkbox>
                    </a-col>

                    <a-col :span="5">
                      <a-checkbox value="xsKzxyDept">
                        控制部门信用
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsKzxyUser">
                        控制业务员信用
                      </a-checkbox>
                    </a-col>
<!--                    <a-col :span="5">
                      <a-checkbox value="xsOutFapiao">
                        允许超销货单生成发票
                      </a-checkbox>
                    </a-col>-->
                    <a-col :span="5">
                      <a-checkbox value="xsOutXhd">
                        允许超订单生成销货单
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>
<!--              <div class="acco-sideline">
                <span>可用量控制</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="24">
                      <a-checkbox value="xsSaveCheck">
                        销货单保存时修改在途出库量（不勾选审核时修改在途出库量）
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>-->
              <div class="acco-sideline">
                <span>价格策略</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="xsPriceCxkh">
                        促销、客户价格表优先
                      </a-checkbox>
                    </a-col>
                    <a-col :span="6">
                      <a-checkbox value="xsPriceZjyc">
                        若价格表未设置取最近一次售价
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="xsPriceZdsj">
                        最低售价控制密码
                      </a-checkbox>
                    </a-col>
                    <a-col :span="4">
                      <span class="special-span">密码：</span>
                      <a-input v-model:value="dataModel.basisMap.xsPriceZdsjPwd" style="border: none;border-bottom: 1px slategrey solid;width: 120px;background-color: white;" :disabled="isEdit || (dataModel.controlList?.indexOf('xsPriceZdsj') == -1)"/>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="acco-sideline">
                <span>数据精度</span>
                <div class="acco-sideline-content-one">
                  <div>
                    <span class="special-span">订单、销售单数量小数位（0~10位）：</span>
                    <a-input-number :min="0" :max="10" v-model:value="dataModel.basisMap.xsNumWs" :disabled="isEdit" style="width: 50px"/>
                  </div>
                  <div>
                    <span class="special-span">订单、销售单单价小数位（0~10位）：</span>
                    <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.xsPriceWs" :disabled="isEdit" style="width: 50px"/>
                  </div>
                  <div>
                    <span class="special-span">订单、销货单税率小数位（0~10位）：</span>
                    <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.xsRateWs" :disabled="isEdit" style="width: 50px"/>
                  </div>
                  <div>
                    <span class="special-span">默认销售税率：</span>
                    <a-input-number  :min="0" :max="99.99" v-model:value="dataModel.basisMap.xsRate" :disabled="isEdit" style="width: 60px"/>%
                  </div>
                  <div>
                    <span class="special-span">税额单行容差：</span>
                    <a-input-number  :min="0" :max="0.99" v-model:value="dataModel.basisMap.xsDhRc"
                                     :disabled="isEdit" style="width: 60px"/>
                  </div>
                  <div>
                    <span class="special-span">税额整单容差：</span>
                    <a-input-number :min="0" :max="0.99" v-model:value="dataModel.basisMap.xsZdRc"
                                    :disabled="isEdit" style="width: 60px"/>
                    <!--                  @blur="(e)=>limitScope(e,'xsZdRc')"-->
                  </div>
                </div>
              </div>
              <div class="acco-sideline">
                <span>单据权限</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="7">
                      <a-checkbox value="xsOperateCheck" :disabled="dataModel.controlList?.filter(it =>it == 'xsKzqxCust' || it == 'xsKzqxCustClass')?.length != 2">
                        只能查看并操作本人授权客户的销售单据
                      </a-checkbox>
                    </a-col>
                    <a-col :span="7">
                      <a-checkbox value="xsReviewCheck">
                        只能审核、弃审自己填制的销售业务单据
                      </a-checkbox>
                    </a-col>
                    <a-col :span="7">
                      <a-checkbox value="xsRemoveCheck">
                        只能修改、删除自己填制的销售业务单据
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-checkbox-group>
<!--            <div class="acco-sideline">
              <span>销售业务流程</span>
              <div class="acco-sideline-content-one">
                <div style="width: 100%!important;padding-left: 5%">
                  <span>销货单确定应收，审核后的销货单作为应收款依据，可以参照生成收款单、销售发票：</span>
                  <RadioGroup v-model:value="dataModel.basisMap.xsLiucheng" :disabled="isEdit">
                    <Radio :style="radioStyle" value="1"><span  class="special-span">业务与库独立管理， 先销售后出库:销售订单&#45;&#45;销货单&#45;&#45;销售出库单&#45;&#45;收款</span></Radio>
                    <Radio :style="radioStyle" value="2"><span  class="special-span">业务与仓库独立管理，先出库后销售:销售订单&#45;&#45;销售出库单&#45;&#45;销货单&#45;&#45;收款</span></Radio>
                    <Radio :style="radioStyle" value="3"><span  class="special-span">业务与仓库一并管理: 销售订单&#45;&#45;销货单&#45;&#45;收款单</span></Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>-->
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" :style="activeKey=='2'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}">
          <template #tab>
            <span style="line-height: 30px;display: flex;color: white;"><AppstoreOutlined style="font-size: 30px;color: #666666;background-color: white;"/>采购业务参数</span>
          </template>
          <div class="a-container-content-one">
            <div class="acco-btn">
              <a-button v-if="isEdit" type="primary" @click="handleBus('0')">编辑</a-button>
              <template v-if="!isEdit">
                <a-button @click="handleBus('1')">恢复系统设置</a-button>
                <a-button type="primary" @click="handleBus('2')">保存</a-button>
                <a-button @click="handleBus('3')">放弃</a-button>
              </template>
            </div>
            <a-checkbox-group v-model:value="dataModel.controlList" :disabled="isEdit" style="width: 100%;">
              <div class="acco-sideline">
                <span>业务控制</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="cgKzqxSup">
                        控制供应商权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgKzqxDepot">
                        控制仓库权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgKzqxStock">
                        控制存货权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgKzqxStockClass">
                        控制存货分类权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgKzqxSupClass">
                        控制供应商分类权限
                      </a-checkbox>
                    </a-col>
<!--                    <a-col :span="5">
                      <a-checkbox value="cgInputCloseOrder">
                        入库完成自动关闭订单
                      </a-checkbox>
                    </a-col>-->

                    <a-col :span="5">
                      <a-checkbox value="cgShDhd">
                        到货单审核生成入库单
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgThDhd">
                        采购退货必须参照采购到货单
                      </a-checkbox>
                    </a-col>
<!--                    <a-col :span="5">
                      <a-checkbox value="cgOutFapiao">
                        允许超到货单生成发票
                      </a-checkbox>
                    </a-col>-->
                    <a-col :span="5">
                      <a-checkbox value="cgOutDhd">
                        允许超订单生成到货单
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>
<!--              <div class="acco-sideline">-->
<!--                <span>可用量控制</span>-->
<!--                <div  class="acco-sideline-content-two">-->
<!--                  <a-row>-->
<!--                    <a-col :span="24">-->
<!--                      <a-checkbox value="cgSaveCheck">-->
<!--                        到货单保存时修改在途入库量-->
<!--                      </a-checkbox>-->
<!--                    </a-col>-->
<!--                  </a-row>-->
<!--                </div>-->
<!--              </div>-->
              <div class="acco-sideline">
                <span>价格策略</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="cgPriceIsRate">
                        供应商价格表含税
                      </a-checkbox>
                    </a-col>
                    <a-col :span="6">
                      <a-checkbox value="cgPriceZjyc">
                        若价格表未设置取最近一次售价
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="cgPriceZgjj">
                        最高进价控制密码
                      </a-checkbox>
                    </a-col>
                    <a-col :span="4">
                      <span class="special-span">密码：</span>
                      <a-input v-model:value="dataModel.basisMap.cgPriceZdsjPwd" style="border: none;border-bottom: 1px slategrey solid;width: 120px;background-color: white;" :disabled="isEdit || (dataModel.controlList.indexOf('cgPriceZdsj') == -1)"/>
                    </a-col>
                  </a-row>

                </div>
              </div>
              <div class="acco-sideline">
                <span>数据精度</span>
                <div class="acco-sideline-content-one">
                  <div>
                    <span class="special-span">订单、到货单数量小数位（0~10位）：</span>
                    <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.cgNumWs" :disabled="isEdit" style="width: 45px"/>
                  </div>
                  <div>
                    <span class="special-span">订单、到货单单价小数位（0~10位）：</span>
                    <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.cgPriceWs" :disabled="isEdit" style="width: 45px"/>
                  </div>
                  <div>
                    <span class="special-span">订单、到货单税率小数位（0~10位）：</span>
                    <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.cgRateWs" :disabled="isEdit" style="width: 45px"/>
                  </div>
                  <div>
                    <span class="special-span">默认采购税率：</span>
                    <a-input-number  :min="0" :max="99.99" v-model:value="dataModel.basisMap.cgRate" :disabled="isEdit" style="width: 60px"/>%
                  </div>
                  <div>
                    <span class="special-span">税额单行容差：</span>
                    <a-input v-model:value="dataModel.basisMap.cgDhRc" @blur="(e)=>limitScope(e,'cgDhRc')"
                             :disabled="isEdit" style="width: 60px"/>
                  </div>
                  <div>
                    <span class="special-span">税额整单容差：</span>
                    <a-input v-model:value="dataModel.basisMap.cgZdRc" @blur="(e)=>limitScope(e,'cgZdRc')"
                             :disabled="isEdit" style="width: 60px"/>
                  </div>
                </div>
              </div>
              <div class="acco-sideline">
                <span>单据权限</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="7">
                      <a-checkbox value="cgOperateCheck" :disabled="dataModel.controlList?.filter(it =>it == 'cgKzqxSup' || it == 'cgKzqxSupClass')?.length != 2">
                        只能查看并操作本人填制的采购业务单据
                      </a-checkbox>
                    </a-col>
                    <a-col :span="7">
                      <a-checkbox value="cgReviewCheck">
                        只能弃审核、审自己填制的采购业务单据
                      </a-checkbox>
                    </a-col>
                    <a-col :span="7">
                      <a-checkbox value="cgRemoveCheck">
                        只能修改、删除自己填制的采购业务单据
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-checkbox-group>

<!--            <div class="acco-sideline">-->
<!--              <span>采购业务流程</span>-->
<!--              <div class="acco-sideline-content-one">-->
<!--                <div style="width: 100%!important;padding-left: 5%">-->
<!--                  <span>到货单确定应付款，审核后的到货单作为应付款依据，可以参照生成付款单、采购发票：</span>-->
<!--                  <RadioGroup v-model:value="dataModel.basisMap.cgLiucheng" :disabled="isEdit">-->
<!--                    <Radio :style="radioStyle" value="1"><span  class="special-span">业务与仓库独立管理， 先到货后入库:采购到货单&#45;&#45;采购入库单&#45;&#45;采购发票&#45;&#45;付款单</span></Radio>-->
<!--                    <Radio :style="radioStyle" value="2"><span  class="special-span">业务与仓库独立管理，先入库后到货:采购入库&#45;&#45;采购到货单&#45;&#45;采购发票&#45;&#45;付款单</span></Radio>-->
<!--                    <Radio :style="radioStyle" value="3"><span  class="special-span">业务与仓库一并管理: 采购到货单&#45;&#45;采购发票&#45;&#45;付款单</span></Radio>-->
<!--                  </RadioGroup>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" :style="activeKey=='3'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}">
          <template #tab>
            <span style="line-height: 30px;display: flex;color: white;"><AppstoreOutlined style="font-size: 30px;color: #666666;background-color: white;"/>库存业务参数</span>
          </template>
          <div class="a-container-content-one">
            <div class="acco-btn">
              <a-button v-if="isEdit" type="primary" @click="handleBus('0')">编辑</a-button>
              <template v-if="!isEdit">
                <a-button @click="handleBus('1')">恢复系统设置</a-button>
                <a-button type="primary" @click="handleBus('2')">保存</a-button>
                <a-button @click="handleBus('3')">放弃</a-button>
              </template>
            </div>
            <a-checkbox-group v-model:value="dataModel.controlList" :disabled="isEdit" style="width: 100%;">
              <div class="acco-sideline">
                <span>业务控制</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="kcKzqxDepot">
                        控制仓库权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="kcKzqxStock">
                        控制存货权限
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="kcKzkcHighBottom">
                        最高最低库存控制
                      </a-checkbox>
                    </a-col>
                    <a-col :span="5">
                      <a-checkbox value="kcKzgzAvailability">
                        出库跟踪入库控制可用量
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="acco-sideline">
                <span>成本核算模式</span>
                <div class="acco-sideline-content-one">
                  <div style="width: 100%!important;padding-left: 5%">
                    <RadioGroup v-model:value="dataModel.basisMap.kcCostAccounting" :disabled="isEdit" style="width: 100%;">
<!--
                      <Radio :style="radioStyle2" value="1"><span  class="special-span">按仓库核算</span></Radio>
-->
                      <Radio :style="radioStyle2" value="2"><span  class="special-span">按存货核算</span></Radio>
                      <Radio :style="radioStyle2" value="3"><span  class="special-span">按仓库+存货核算</span></Radio>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <div class="acco-sideline">
                <span>暂估方式</span>
                <div class="acco-sideline-content-one">
                  <div style="width: 100%!important;padding-left: 5%">
                    <RadioGroup v-model:value="dataModel.basisMap.kcEstimated" :disabled="isEdit" style="width: 100%;">
                      <Radio :style="radioStyle2" value="1"><span  class="special-span">单到回冲</span></Radio>
                      <Radio :style="radioStyle2" value="2"><span  class="special-span">单到补差</span></Radio>
                      <Radio :style="radioStyle2" value="3"><span  class="special-span">月初回冲</span></Radio>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <div class="acco-sideline">
                <span>现存量控制</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="5">
                      <a-checkbox value="kcIsLck">
                        允许零出库（大于现存量出库）
                      </a-checkbox>
                    </a-col>
                    <a-col :span="6">
                      <a-checkbox value="kcCgrkSaveCheck">
                        存货最高出库数量控制
                      </a-checkbox>
                    </a-col>
                    <!--                    <a-col :span="6">
                                          <a-checkbox value="kcCgrkSaveCheck">
                                            采购到货单保存时修改在途入库量
                                          </a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                          <a-checkbox value="kcXsckSaveCheck">
                                            销货单保存时修改在途出库量
                                          </a-checkbox>
                                        </a-col>-->
                  </a-row>
                </div>
              </div>
              <div class="acco-sideline">
                <span>现存量节点</span>
                <div  class="acco-sideline-content-two">
                  <a-row>
                    <a-col :span="8">
                      <a-checkbox value="kcCgrkCheck">
                        入库单据保存时修改现存量（默认审核后）
                      </a-checkbox>
                    </a-col>
                    <a-col :span="8">
                      <a-checkbox value="kcXsckCheck">
                        出库单据保存时修改现存量（默认审核后）
                      </a-checkbox>
                    </a-col>
                    <!--                    <a-col :span="5">
                                          <a-checkbox value="kcCgrkCheck">
                                            采购入库单审核后修改现存量
                                          </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">
                                          <a-checkbox value="kcXsckCheck">
                                            销售出库单审核后修改现存量
                                          </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">
                                          <a-checkbox value="kcQtcrkCheck">
                                            其他出入库单审核后修改现存量
                                          </a-checkbox>
                                        </a-col>
                                        <a-col :span="5">
                                          <a-checkbox value="kcJcjrCheck">
                                            借入借出单审核后修改现存量
                                          </a-checkbox>
                                        </a-col>-->
                  </a-row>

                </div>
              </div>
            </a-checkbox-group>
            <div class="acco-sideline">
              <span>数据精度</span>
              <div class="acco-sideline-content-one">
                <div>
                  <span class="special-span">数量小数位（0~10位）：</span>
                  <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.kcNumWs" :disabled="isEdit" style="width: 45px"/>
                </div>
                <div>
                  <span class="special-span">单价小数位（0~10位）：</span>
                  <a-input-number  :min="0" :max="10" v-model:value="dataModel.basisMap.kcPriceWs" :disabled="isEdit" style="width: 45px"/>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  Button as AButton,
  Checkbox as ACheckbox,
  Col as ACol,
  DatePicker as ADatePicker,
  Input as AInput,
  InputNumber as AInputNumber,
  Radio as ARadio,
  Radio,
  Row as ARow,
  Select as ASelect,
  Tabs as ATabs,
  Tree as ATree
} from "ant-design-vue"
import router from "/@/router";
import {reactive, ref, watch} from "vue";
import {AppstoreOutlined, SettingOutlined} from '@ant-design/icons-vue'
import {
  compareTime,
  findByFunctionModule,
  markAnomaly,
  offsetToStr
} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {findOption, getCurrDefaultModel, saveOption} from "/@/api/record/stock/stock-option";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const ATabPane = ATabs.TabPane
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const ARadioGroup = ARadio.Group
const ATreeNode = ATree.TreeNode
const AMonthPicker = ADatePicker.MonthPicker
const RadioGroup = Radio.Group

const windowHeight = (window.innerHeight)
const {
  createErrorModal, createWarningModal, createConfirm
} = useMessage()

const { closeCurrent } =useTabs();
const activeKey= ref('1')
const database = ref('')
const databaseCn = ref('')
const databaseCode = ref('')
/************************************基础选项************************************/
const isEdit = ref(true)
const dataModel = reactive({basisMap:{},controlList:[]})
const dataModelCopy = reactive({basisMap:{},controlList:[]})
const dynamicAdReload = async (obj) => {
  database.value = obj.accountMode
  databaseCn.value = obj.accId
  databaseCode.value = obj.coCode
  pageReload()
}
const pageReload = ()=>{
  useRouteApi(findOption,{schemaName: database})({type: activeKey.value,code: databaseCode.value}).then(res=>{
    resetModel(res)
  }).catch(error => {
    console.log('error', error)
  })
}
// 监听切换
watch(() => activeKey.value, async() => {
  if (activeKey.value == '4') {
  }else{
    pageReload()
  }
});

const resetModel = (res) => {
  let data = JsonTool.parseProxy(getCurrDefaultModel(activeKey.value))
  dataModel.basisMap =res.basisMap || data.basisMap
  dataModel.controlList = res.controlList ||data.controlList
  dataModelCopy.basisMap = res.basisMap ||data.basisMap
  dataModelCopy.controlList = res.controlList || data.controlList
}

const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});
const radioStyle2= reactive({
  height: '30px',
  lineHeight: '30px',
  width: '22%'
});
const handleBus = (bus)=>{
  if(bus == '0'){
    isEdit.value=false
  }else if (bus == '1'){ //恢复系统
    let def = getCurrDefaultModel(activeKey.value)
    dataModel.basisMap = def.basisMap
    dataModel.controlList = def.controlList
  }else if(bus == '2'){
    isEdit.value=true
    useRouteApi(saveOption,{schemaName: database})({modifyModel: JSON.stringify(dataModel),type: activeKey.value,code: databaseCode.value}).then(res=>{
      console.log('保存成功!')
      pageReload()
    }).catch(error => {
      console.log('error', error)
    })
  }else{ // 放弃修改
    dataModel.basisMap = dataModelCopy.basisMap
    dataModel.controlList = dataModelCopy.controlList
    isEdit.value=true
  }
}

const beforeShow = () => {
  // 进页面是否存在查看选项权限  你无此功能的查看权限，请申请管理员授权后再进行操作。
  // 进选项页面点击编辑是否存在权限   你无此功能的编辑权限，请申请管理员授权后再进行操作。
  // 校验是否 被锁定
  let msg = '';
  // 终止for循环，使用break
  findByFunctionModule(2021).then(res=>{
    let checkMenu = ['月末结账','凭证记账','凭证主管签字','审核凭证','出纳凭证签字','凭证的增加修改整理','转账生成']
    for (let i = 0; i < res.length; i++) {
      if (checkMenu.indexOf(res[i].functionModule) != -1 && res[i].state == '1'){
        // 校验时间
        if (res[i].time != '' && !compareTime(offsetToStr(res[i].time))){ // 超时
          msg = '提示：系统冲突！操作员【' +
            res[i].caozuoUnique +
            '】正在进行'+res[i].functionModule+'操作!不能继续进行财务选项编辑操作，请销后再试，或联系财务主管清理该记账任务!'
          return false;
        }else {
          // 标记异常
          markAnomaly(res[i].id,res[i].iyear);
        }
      }
    }
    if (msg != ''){
      createWarningModal({title: '模板导入检测',content: msg })
      return false
    }else {
      return  true;
    }
  })
  return false;
}

const limitScope = (e,key) => {
  // 0~1
  let a = e.target.value
  a = parseFloat(a.replaceAll(/[^\d.]/gi, ''))
  if (a >= 1) {
    a = 0.99
  } else if (a <= 0) {
    a = 0.01
  }
  dataModel.basisMap[key] = a
}
</script>
<style scoped="scoped" lang="less">
@import '/@/assets/styles/financial-info-menu.less';
.acco-sideline-content-one{
  padding: 10px;
  > div{
    width: 33% !important;
    display: inline-block !important;;
    padding: 10px 30px !important;
  }
}
:deep(.ant-checkbox-wrapper){
  >span:nth-of-type(2){
    font-weight: bold;
    color: black;
    font-size: 13px;
  }
}
.special-span{
  font-weight: bold;
  color: black;
  font-size: 13px;
}
</style>
