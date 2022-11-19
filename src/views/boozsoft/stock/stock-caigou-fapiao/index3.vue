<template>
  <div class="app-container">
    <PrintSetting></PrintSetting>
    <div class="app-container-top" style="background-color: #c9c7c7;">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">

        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="router.push('/cg-dhList')">查询</Button>
          <!-- 审核后的 -->
          <span v-if="stockWareData.bcheck=='1'">
            <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
            <Button :disabled="ymPeriod" class="actod-btn"  @click="startEdit('edit')">变更</Button>
            <Popover placement="bottom">
              <template v-if="!ymPeriod" #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="setCGRKD_data">生成采购入库单</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="setCGTHD_data">生成采购退货单</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px">生成采购发票</Button>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">
                生单
              </Button>
            </Popover>
            <Button :disabled="ymPeriod" class="actod-btn" @click="startReview(true)">审核</Button>
            <Popover placement="bottom">
              <template #content>
                <Button v-if="!ymPeriod" style="width: 120px;margin-bottom: 2px">来源单据</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
            </Popover>
            <Popover placement="bottom">
              <template v-if="!ymPeriod" #content>
                <Button class="actod-btn" @click="startReview(false)">弃审</button><br/>
                <Button class="actod-btn" @click="startReview(false)">复制</button><br/>
                <Button class="actod-btn">导入</button><br/>
                <Button class="actod-btn">导出</button><br/>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">更多</Button>
            </Popover>
          </span>
          <!-- 未审核 -->
          <span v-else>
            <span v-if="status < 3">
            <Button class="actod-btn">参照</Button>
            <Button class="actod-btn" @click="saveData">保存</Button>
            <Button class="actod-btn" @click="giveUp">放弃</Button>
            <Button class="actod-btn" @click="tableDel">删行</Button>
            <Button class="actod-btn">复制</Button>
          </span>
            <span v-else>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
              <Button :disabled="ymPeriod" class="actod-btn">参照</Button>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('edit')">修改</Button>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startDel">删除</Button>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startReview(true)">审核</Button>
              <Popover placement="bottom">
                <template v-if="!ymPeriod" #content>
                  <Button style="width: 120px;margin-bottom: 2px">来源单据</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
              </Popover>
              <Popover placement="bottom">
                <template v-if="!ymPeriod" #content>
                  <Button class="actod-btn" @click="startReview(false)">弃审</button><br/>
                  <Button class="actod-btn" @click="startReview(false)">复制</button><br/>
                  <Button class="actod-btn">导入</button><br/>
                  <Button class="actod-btn">导出</button><br/>
                  <Button class="actod-btn">关闭</button><br/>
                  <Button class="actod-btn">打开</button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">更多</Button>
              </Popover>
            </span>
          </span>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two" :class="status != 3?'status-look':''">
        <div class="act-two-d-left">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="act-two-d-center">

        </div>
        <div class="act-two-d-right">
          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="存货编码或名称"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <Popconfirm
                  ok-text="保存"
                  cancel-text="关闭"
                  @confirm="confirm"
                  @cancel="cancel">
                  <template #icon><b>栏目设置</b><br></template>
                  <template #title>
                    <div style="width: 640px"><Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                                                     childrenColumnName="children" :pagination="false"
                                                     style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                      <template #checkBox="{ text, record }">
                        <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                      </template>
                      <template #widthInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <Input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                            <CheckOutlined class="editable-cell-icon-check"
                                           @click="save(record.key,record.min,record.max)"/>
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                            <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                          </div>
                        </div>
                      </template>
                      <template #nameInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <Input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                            <CheckOutlined class="editable-cell-icon-check"
                                           @click="saveName(record.key)"/>
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                          </div>
                        </div>
                      </template>
                      <template #alignRadio="{ text, record }">
                        <RadioGroup default-value="a" size="small" v-model:value="record.align"
                                    :disabled="record.align==''">
                          <RadioButton value="left">
                            左
                          </RadioButton>
                          <RadioButton value="center">
                            中
                          </RadioButton>
                          <RadioButton value="right">
                            右
                          </RadioButton>
                        </RadioGroup>
                      </template>
                    </Table>
                    </div>
                  </template>
                  <Button style="width: 120px;margin-bottom: 2px">表体栏目设置</Button>
                </Popconfirm>
                <br/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                      :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                      :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MIN'"/></span>
              </template>
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>

            </Popover>
            <Button @click="openPrintModal" class="acttdrd-btn">
              <PrinterFilled :style="{ fontSize: '14px' }"/>
            </Button>
            <PrintModal :getDataSource="getDataSource" :getColumns="getColumns" @register="registerPrintModal"></PrintModal>
            <Popover placement="bottom"><!-- v-if="status != 3" -->
              <template #content>
                <span class="group-btn-span-special2" @click="bdocumStyle = 0,findByBdocumStyle()"
                      :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;蓝字入库单&ensp;<CheckOutlined
                  v-if="titleValue===0"/></span><br/>
<!--                <span class="group-btn-span-special2" @click="bdocumStyle = 1,findByBdocumStyle()"-->
<!--                      :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white'}:''">-->
<!--                &nbsp;红字入库单&ensp;<CheckOutlined-->
<!--                  v-if="titleValue===1"/></span>-->
<!--                <br/>-->
                <span class="group-btn-span-special2" @click="titleValue = 2"
                      :style="titleValue===2?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字回冲单&ensp;<CheckOutlined
                  v-if="titleValue===2"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+70)+'px'}">
      <div class="acb-head">
        <div class="acbgead-one">
          <div class="acbgead-one-triangle">
            <div></div>
            <div>
              <span
                style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
            <VerticalRightOutlined @click="contentSwitch('first','')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev','')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next','')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail','')"/>
            <span v-if="status=='3'">
              &nbsp;
              <Tag v-if="stockWareData.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.bcheck === '1'&&parseFloat(stockWareData.squantity)-parseFloat(stockWareData.squantityLj)==0">
                已入库
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.hxFlag=='1'">
                已结清
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;"
                :style="{color: '#0096c7'}">{{
              titleContents[titleValue]
            }}</span>

        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent"/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(150 + (formRowNum*39))}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcode="{ record }">
            <template v-if="record.editOne">
              <Select
                v-model:value="record.tempOne"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
                :show-arrow="false"
                show-search
                style="width: 82%;"
                class="cwhcode"
                @keyup.enter="focusNext(record,'cwhcode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cwhcode')"/>
            </template>
            <template v-else>
              <div @click="record.tempOne=record.cwhcode,record.editOne = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span>{{ ckListOptions.filter(it => it.id == record.cwhcode).length>0?ckListOptions.filter(it => it.id == record.cwhcode)[0]?.ckName:record.cwhcodeText }}</span>
              </div>
            </template>
          </template>
          <template #bcheck1="{ record }">
            <template v-if="record.editThree">
              <Select
                v-model:value="record.tempThree"
                show-search
                class="bcheck1"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'three')"
                @keyup.enter="tempType='three';focusNext(record,'bcheck1')"
              ></Select>
              <SearchOutlined @click="tempType = 'three';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThree=record.bcheck1,record.editThree = true;">
                <span class="a-table-font-arial">{{ record?.bcheck1 }}</span>
              </div>
            </template>
          </template>
          <template #cinvode="{ record }">
            <template v-if="record.editTwo">
              <Select
                v-model:value="record.tempTwo"
                show-search
                class="cinvode"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @change="value=>handleChange(value,'one')"
                @search="value=>handleSearch(value,'one')"
                @keyup.enter="tempType='one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType = 'one';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">
                <span class="a-table-font-arial">{{ record?.cinvode }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeName="{ record }">
            <template v-if="record.editEleven">
              <Select
                v-model:value="record.tempEleven"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @change="value=>handleChange(value,'two')"
                @search="value=>handleSearch(value,'two')"
                @keyup.enter="tempType='two';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType = 'two';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">
                <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
              </div>
            </template>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{ record.cunitType == '1'?formatUniqueJiLiang(record.cunitid):record.cunitidText }}</span>
            </div>
          </template>
          <template #cunitidF1="{ record }">
            <div v-if="record.cunitType != '1'">
              <span>{{ record.cunitidF1 }}</span>
            </div>
          </template>
          <template #cunitidF2="{ record }">
            <div v-if="record.cunitType != '1'">
              <span>{{ record.cunitidF2 }}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <template v-if="record?.editSix">
              <InputNumber v-model:value="record.tempSix"
                           class="baseQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'baseQuantity');"/>
              <CheckOutlined
                @click="record.editSix = null;record.baseQuantity=record.tempSix;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSix=record.baseQuantity,record.editSix = true;">
                    <span class="a-table-font-arial">{{
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #subQuantity1="{ record }">
            <template v-if="record?.editSubQuantity1">
              <InputNumber v-model:value="record.tempSubQuantity1"
                           class="subQuantity1"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'subQuantity1');"/>
              <CheckOutlined
                @click="record.editSubQuantity1 = null;record.subQuantity1=record.tempSubQuantity1;tableDataChange(record,'subQuantity1')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSubQuantity1=record.subQuantity1,record.editSubQuantity1 = true;">
                    <span class="a-table-font-arial">{{
                        (record.subQuantity1 == null ? '' : parseFloat(record.subQuantity1).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #subQuantity2="{ record }">
            <template v-if="record?.editSubQuantity2">
              <InputNumber v-model:value="record.tempSubQuantity2"
                           class="subQuantity2"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'subQuantity2');"/>
              <CheckOutlined
                @click="record.editSubQuantity2 = null;record.subQuantity2=record.tempSubQuantity2;tableDataChange(record,'subQuantity1')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSubQuantity2=record.subQuantity2,record.editSubQuantity2 = true;">
                    <span class="a-table-font-arial">{{
                        (record.subQuantity2 == null ? '' : parseFloat(record.subQuantity2).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #price="{ record }">
            <template v-if="record?.editNine">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'price')"/>
              <CheckOutlined
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempNine=record.price,record.editNine = true;">
         <span class="a-table-font-arial">{{
             (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
           }}</span>
              </div>
            </template>
          </template>
          <template #icost="{ record }">
            <template v-if="record?.editTen">
              <InputNumber v-model:value="record.tempTen" class="icost"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'icost')"/>
              <CheckOutlined
                @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record,'icost')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTen=record.icost,record.editTen = true;">
          <span class="a-table-font-arial">{{
              (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <!-- 税率-->
          <template #itaxrate="{ record }">
            <template v-if="record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate" class="itaxrate"
                           :min="0"
                           :max="100"
                           style="width: 82%;"
                           @click="getColumnRate(record)"
                           @keyup.enter="focusNext(record,'itaxrate')"/>
              <CheckOutlined
                @click="record.editItaxrate = null;record.itaxrate=record.tempItaxrate;tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                <span class="a-table-font-arial">{{ record.itaxrate==0?'':record.itaxrate }}</span>
              </div>
            </template>
          </template>
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null;record.taxprice=record.tempTaxprice;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTaxprice=record.taxprice,record.editTaxprice = true;">
                    <span class="a-table-font-arial">{{
                        (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <!-- 税额 -->
          <template #itaxprice="{ record }">
            <span class="a-table-font-arial">{{
                (record.itaxprice == null ? '' : parseFloat(record.itaxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <!-- 价税合计 -->
          <template #isum="{ record }">
            <template v-if="record?.editIsum">
              <InputNumber v-model:value="record.tempIsum" class="isum"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'isum')"/>
              <CheckOutlined
                @click="record.editIsum = null;record.isum=record.tempIsum;tableDataChange(record,'isum')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempIsum=record.isum,record.editIsum = true;">
          <span class="a-table-font-arial">{{
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="record.price=0;record.icost=0"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve/* && record.isBatch*/">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId"
                     @keyup.enter="focusNext(record,'batchId')"/>
              <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwelve=record.batchId,record.editTwelve = true;">
                <span class="a-table-font-arial">{{ record.batchId }}</span>
              </div>
            </template>
          </template>
          <template #cmemo="{ record }">
            <template v-if="record?.editThirteen">
              <Input v-model:value="record.tempThirteen"
                     style="width: 82%;" class="cmemo"
                     @keyup.enter="focusNext(record,'cmemo')"/>
              <CheckOutlined @click="record.editThirteen = null;record.cmemo=record.tempThirteen;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThirteen=record.cmemo,record.editThirteen = true;">
                <span class="a-table-font-arial">{{ record.cmemo }}</span>
              </div>
            </template>
          </template>
          <template #dpdate="{ record }">
            <template v-if="record?.editDpdate">
              <DatePicker v-model:value="record.tempDpdate" value-format="YYYY-MM-DD"
                          class="dpdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempDpdate && !b?focusNext(record,'dpdate'):null"/>
              <CheckOutlined @click="record.editDpdate = null;record.dpdate=record.tempDpdate;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
                <span class="a-table-font-arial">{{ record.dpdate }}</span>
              </div>
            </template>
          </template>
          <template #dvdate="{ record }">
            <template v-if="record?.editFifteen">
              <DatePicker v-model:value="record.tempFifteen" value-format="YYYY-MM-DD"
                          class="dvdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempFifteen && !b?focusNext(record,'dvdate'):null"/>
              <CheckOutlined @click="record.editFifteen = null;record.dvdate=record.tempFifteen;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">
                <span class="a-table-font-arial">{{ record.dvdate }}</span>
              </div>
            </template>
          </template>
          <template #bcheck="{ record }">
            {{ formatUniqueOperator(record.bcheckUser)}}
          </template>
          <template #footer>
            <div class="nc-summary">
              <div>
                <span>合计</span>
              </div>
              <div>
                <span>主数量:</span>
                <span style="float: right">&ensp;{{ parseFloat(formItems?.squantity).toFixed(2) }}</span>
              </div>
              <div>
                <span>&emsp;数量1:</span>
                <span style="float: right">&ensp;{{ formItems?.squantity1>0?parseFloat(formItems?.squantity1).toFixed(2):null }}</span>
              </div>
              <div>
                <span>&emsp;数量2:</span>
                <span style="float: right">&ensp;{{ formItems?.squantity2>0?parseFloat(formItems?.squantity2).toFixed(2):null }}</span>
              </div>
              <div>
                <span>价税合计:</span>
                <span style="float: right">&ensp;{{ toThousandFilter(formItems?.isum) }}</span>
              </div>
              <div>
                <span>审核人:</span>
                <span style="float: right">&ensp; {{formItems?.bcheck == null?'': formatUniqueOperator(formItems?.bcheckUser)}}</span>
              </div>
            </div>
          </template>
        </BasicTable>
        <Import
          @save="introduceData"
          @register="registerImportPage"
        />
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>

    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>

    <a-modal v-model:visible="visible2" title="" :closable="false" :centered="true">
      <template #footer>
        <a-button key="submit" type="primary" @click="visible2=false" >确定</a-button>
      </template>
      <br>
      <p>&emsp;{{ modelText }}</p>
      <p>&emsp;{{ modelText1 }}</p>
      <p>&emsp;{{ modelText2 }}</p>
    </a-modal>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
  Modal as AModal,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import DynamicForm from './component/DynamicForm.vue';
import PrintTest from './print/index.vue';
import Hello from './hello/index.vue';
import {
  CheckOutlined,
  EditOutlined,
  LeftOutlined,
  PicLeftOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  PrinterFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, onMounted, reactive, ref, watch} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import PrintModal from './print/Modal/index.vue'
import {delChuZhi, findFaAssetInfoByCode, reviewChuZhi} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
/**********************栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {findDbLanMuList, saveLanMuList,} from '/@/api/record/system/accvoucher';
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {
  GenerateDynamicColumn
} from "/@/views/boozsoft/stock/stock-caigou-dh/component/DynamicForm";
// import SupperModalPop from "/@/views/boozsoft/system/supplier/popup/modalPop.vue";
// import DeptModalPop from "/@/views/boozsoft/system/department/popup/select-dept.vue";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
// import SelectPsn from "/@/views/boozsoft/system/department/popup/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  delRuKu,
  findBillByCondition,
  findBillCode,
  reviewRuKu,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveRuKu,
  xyCsourceSave,
  findByStockCurrLock,
  saveStockCurrentstockZTRK_Increase,
  verifyXyCsourceByXyCode,
  findByStockWareRecentlySupMoney,
  findStockWareByCcode, findStockPeriodYmFlag, findByCodeSetXyCodeBdocumStyle,
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import dayjs from "dayjs";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {company_executeSQL} from "/@/api/codekemu/codekemu";
import {
  getByStockBalanceTask, stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {
  delCGDHDverifyZTRKSum,
  subtractZTRKSum,
  findStockCurr, delCGDHDverifyBaseQuantity,
} from "/@/api/record/stock/stock-currents";
import {findByCkId} from "/@/api/record/stock/stock-cangku";
import {
  findAllByCcodeAndBillStyle,
  findByStockWarehId, stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import fa from "element-plus/packages/locale/lang/fa";
import {
  stockSupPriceFindBySupIdAndStockNum
} from "/@/api/record/stock/stock_sup_price";
import {findByStockNum, findByStockNum2} from "/@/api/record/stock/stock";
import {findByStockAccountId} from "/@/api/record/system/stock-account";
import PrintSetting from './print/settings/index.vue'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const route = useRoute();
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerPrintModal, {openModal: openPrintModal}] = useModal()
const windowHeight = (window.innerHeight - 300)
const dynamicTenantId = ref('')
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['采购到货单', '采购到货单', '采购回冲单']
const titleValue = ref(0)
const formRowNum = ref(1)
const tempType =  ref('')
const bdocumStyle =  ref('0')
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGDHD'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList = ref([])
const manyJiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const cardListOptions = ref([])
const assetsCardList = ref([])
const routeData:any = route.query;
const stockWareData:any = ref('')
const ymPeriod:any = ref(false)

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

/**
 * 获取表头税率
 * @param r
 */
function getColumnRate(r){
  if(hasBlank(r['tempItaxrate'])){
    r['tempItaxrate']=formFuns.value.getFormValue()?.rate
  }
}

const dynamicAdReload = async (obj) => {
  // 获取账套是否允许零出库
  let sql="select * from  _app_group_stock_account where id='"+obj.target.id+"'  "
  let stockAccount= await useRouteApi(company_executeSQL, {schemaName: obj.accountMode})(sql)
  if(stockAccount!==''){
    stockAccountObj.value = stockAccount[0]
  }
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear

  stockWareData.value=''
  await columnReload()
  await reloadList()
  resetDynamicColumnData()
}
// 获取单据信息
async function findStockWareByCcodeData(ccode) {
  stockWareData.value=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(ccode)
}
const dynamicFormModel = ref([])
const formFuns = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}

const pageReload = async () => {
  // 列表跳转过来
  if(routeData.ccode!==undefined){
    await contentSwitch('tail',routeData.ccode)
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr','')
  }
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
}

async function contentSwitch(action,ccode) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    bdocumStyle: bdocumStyle.value,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    findStockWareByCcodeData(res.ccode)
    countStockPeriodYmFlag(res.iyear,'1')
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        if(hasBlank(list[i].cwhcodeText)){
          list[i].cwhcodeText=await getCKName(list[i].cwhcode)
        }
      }
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }
    formItems.value.entryList = null
  } else {
    setTableData([])
    formFuns.value.setFormValue({})
    formItems.value={}
    message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '仓储位置',
      dataIndex: 'cwhcode',
      ellipsis: true,
      slots: {customRender: 'cwhcode'},
      width: 120
    },
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,
      width: 120,slots: {customRender: 'bcheck1'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
      width: 120
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
      width: 200
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
      width: 120
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
      width: 100
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
      width: 80,
    },
    {
      title: '计量1',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
      align: 'left',
      width: 100
    },{
      title: '数量1',
      dataIndex: 'subQuantity1',
      ellipsis: true,
      slots: {customRender: 'subQuantity1'},
      width: 80,
    },
    {
      title: '计量2',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitidF2'},
      width: 100
    },
    {
      title: '数量2',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
      width: 80,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
      width: 120,
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      slots: {customRender: 'itaxprice'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '折扣金额',
      dataIndex: 'idiscount',
      slots: {customRender: 'idiscount'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },{
      title: '累计入库数量',
      dataIndex: 'isumXiaohuo',
      slots: {customRender: 'isumXiaohuo'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },{
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      slots: {customRender: 'isumFapiao'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    // {
    //   title: '到货日期',
    //   dataIndex: 'arrivalDate',
    //   slots: {customRender: 'arrivalDate'},
    //   ellipsis: true,
    //   width: 120,
    //   align: 'right'
    // },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
      width: 150,
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      slots: {customRender: 'dpdate'},
      ellipsis: true,
      width: 150,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
      width: 150,
    },
    {
      title: '审核人',
      dataIndex: 'bcheck',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'bcheck'},
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '项目',
      dataIndex: 'citemcode',
      ellipsis: true,
      width: 120,
    },{
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'isGive'},
    },
  ]
}
// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    hideOnSinglePage: true,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },

})

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const openQpage = async () => {
  if (true) {
    openQueryPageM(true, {schemaName: dynamicTenantId.value})
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}

const tableAdd = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {cwhcode: formFuns.value.getFormValue().cwhcode})
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择插入行次！'
    })
  }
}
const rowDelData=ref([])
const tableDel = async () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    rowDelData.value.push(list.filter(it => it.key === tableSelectedRowKeys.value[0]))
    // 现存量
    let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})(rowDelData.value[0])
    let temp2=stockcurr.filter(a=>a.cwhcode==rowDelData.value[0][0].cwhcode&& a.invCode==rowDelData.value[0][0].cinvode && a.batchId==rowDelData.value[0][0].batchId && a.dpdate==rowDelData.value[0][0].dpdate && a.dvdate==rowDelData.value[0][0].dpdate)
    for (let j = 0; j < temp2.length; j++) {
      let keyong:any=parseFloat(temp2[j].baseQuantity)+parseFloat(temp2[j].ztrkQuantity)-parseFloat(temp2[j].ztckQuantity)
      let cha:any=parseFloat(temp2[j].ztrkQuantity)-parseFloat(rowDelData.value[0][0].baseQuantity)
      let cha2=parseFloat(keyong)-parseFloat(cha)
      if(parseFloat(rowDelData.value[0][0].baseQuantity)<parseFloat(temp2[j].ztrkQuantity)|| (cha2<0 || parseFloat(temp2[j].ztrkQuantity)<parseFloat(rowDelData.value[0][0].baseQuantity))){
        message.error('存货编码【'+rowDelData.value[0][0].cinvode+'】在途入库数量不足,不能修改')
        return false
      }
    }
    list.splice(selectIndex, 1)
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const startEdit = async (type) => {
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    stockWareData.value=''
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    formItems.value = {
      ddate: date,
      ccode: code,
      rate: stockAccountObj.value?.cg_rate,
      invoiceStyle: '1',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      rate: stockAccountObj.value?.cg_rate,
      invoiceStyle: '1',
    })
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
  }
  else {
    let rukuMainData=await useRouteApi(verifyXyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,code:formItems.value.ccode,xyCode:'CGRKD'})
    if(rukuMainData!=='' ){
      message.error('已经生成采购入库单【编码'+rukuMainData.xyccode+'】,不能变更！')
      return false;
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购发票',method:'修改'})
    if(taskData==''){
      tempTaskSave()
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购发票,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
    tempTaskDel()
  }

}
async function tempTaskDel() {
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'采购到货单',method:'修改'})
}
async function tempTaskSave() {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购到货单',method:'修改'})
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: "CGDHD",
    date: date,
    prefix: "",key: '3-1'
  })
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    if(formItems.value.bcheck=='1'){
      message.error('到货单已经审核，不能删除，请弃审单据后重试！')
      return false
    }
    createConfirm({
      iconType: 'warning',
      title: '采购到货单删除',
      content: '您确定要进行采购到货单删除吗!',
      onOk: async () => {
        let dataList = getDataSource().filter(it => !hasBlank(it.cwhcode))
        // 采购入库单审核后修改现存量（默认值1是，0或空否，保存即修改）
        // 默认 审核后修改
        // if(stockAccountObj.value?.kc_cgrk_check=='1'){
        // 不允许零出库
        if(hasBlank(stockAccountObj.value?.kc_is_lck) || stockAccountObj.value?.kc_is_lck=='0'){
          // 校验 是否【现存量+在途入库-在途出库-删除数量 > 删除数量】
          let verify=await useRouteApi(delCGDHDverifyZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(dataList)})
          if(verify!==''){
            message.error('存货编码【'+verify+'】,可用量不足，不能删除当前到货单，请增加该存货可用量后重试！')
            return false
          }
        }
        // 返回现存量ID 进行 在途入库数量相减
        let subtract=await useRouteApi(subtractZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(dataList)})
        for (let i = 0; i < subtract.length; i++) {
          let sql="update stock_currentstock set ztrk_quantity=ztrk_quantity-'"+parseFloat(subtract[i].number)+"' where id='"+subtract[i].id+"'  "
          await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql)
        }
        // }
        // else{
        //   // 校验 是否【现存量 < 删除数量】
        //   let verify=await useRouteApi(delCGDHDverifyBaseQuantity, {schemaName: dynamicTenantId})({list:JSON.stringify(dataList)})
        //   if(verify!==''){
        //     message.error('存货编码【'+verify+'】,现存量不足，不能删除当前到货单，请增加该存货现存量后重试！')
        //     return false
        //   }
        //   // 返回现存量ID 进行 现存量量相减
        //   let subtract=await useRouteApi(subtractZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(dataList)})
        //   for (let i = 0; i < subtract.length; i++) {
        //     let sql="update stock_currentstock set base_quantity=base_quantity-'"+parseFloat(subtract[i].number)+"' where id='"+subtract[i].id+"'  "
        //     await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql)
        //   }
        // }
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        message.success('删除成功！')
        formItems.value.czId = ''
        await contentSwitch('tail','')
      }
    });
  }
}

const startReview = async (b) => {
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: '',
    bdocumStyle: '0',
    curr: ''
  })

  if(formItems.value.bcheck=='1'&&b){
    message.error('此单据已审核！')
    return false
  }

  // 弃审
  if(!b){
    let rukuMainData=await useRouteApi(verifyXyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,code:formItems.value.ccode,xyCode:'CGRKD'})
    if(rukuMainData!=='' ){
      message.error('已经生成采购入库单【编码'+rukuMainData.xyccode+'】,不能弃审！')
      return false;
    }
  }

  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id))  {
    // 审核、弃审
    let bcheck=b?'1':'0'
    let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
    let bcheckUser=b?a:''
    res.bcheck=bcheck
    res.bcheckTime=bcheckTime
    res.bcheckUser=bcheckUser
    await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)
    let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
    list.forEach(tx=>{
      tx.bcheck=bcheck
      tx.bcheckTime=bcheckTime
      tx.bcheckUser=bcheckUser
    })
    await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)

    let tableList = getDataSource().filter(it => !hasBlank(it.cwhcode))
    if(b){
      // 到货单审核生成入库单 1是
      if(stockAccountObj.value.cg_sh_dhd=='1'){
        // 修改本单据的 累计入库数量
        tableList.forEach(async (temp)=>{
          temp.isGive=temp.isGive?'1':'0'
          temp.isBatch=temp.isBatch?'1':'0'
          // 修改本单据的 累计入库数量
          temp.isumXiaohuo=temp.baseQuantity
          temp.bcheck=bcheck
          temp.bcheckTime=bcheckTime
          temp.bcheckUser=bcheckUser
        })
        await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(tableList)
        // 修改主表累计入库数量
        let isumXiaohuoSum=sumArr(tableList.map(a=>a.baseQuantity))
        let squantityLj=sumArr([parseFloat(hasBlank(res.squantityLj)?0:res.squantityLj),parseFloat(isumXiaohuoSum)])
        res.squantityLj=squantityLj
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

        let oldNum=formItems.value.ccode
        let oldddate=formItems.value.ddate
        let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  useCompanyOperateStoreWidthOut().getLoginDate,prefix: "",key: '3-10'})
        // 生成入库单
        formItems.value.id=null
        formItems.value.ccode=newRuKuNum
        formItems.value.billStyle='CGRKD'
        formItems.value.bcheck=''
        formItems.value.bcheckTime=''
        formItems.value.bcheckUser=''
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)

        let setRuKuList = getDataSource().filter(it => !hasBlank(it.cwhcode))
        // 生成入库单明细
        setRuKuList.forEach(async (temp)=>{
          let parentLineCode=temp.lineCode
          temp.id=null
          temp.billStyle='CGRKD'
          temp.ccode=newRuKuNum
          temp.lineCode=randomString(30)
          temp.bcheck='0'
          temp.bcheckTime=''
          temp.bcheckUser=''
          temp.isumXiaohuo=''
          temp.squantityLj='0'

          temp.sourcetype='CGDHD'
          temp.sourcecode=oldNum
          temp.sourcedetailId=parentLineCode
          temp.sourcedate=oldddate
        })
        await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(setRuKuList)
        // 添加下游表
        let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
        await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
      }
    }
    else if(!b&& stockAccountObj.value.cg_sh_dhd!=='1'){
      // 修改子表的 累计入库数量
      let tableList = getDataSource().filter(it => !hasBlank(it.cwhcode))
      tableList.forEach(async (temp)=>{
        temp.isGive=temp.isGive?'1':'0'
        temp.isBatch=temp.isBatch?'1':'0'
        // 修改本单据的 累计入库数量
        temp.isumXiaohuo=parseFloat(temp.isumXiaohuo)-parseFloat(temp.baseQuantity)
      })
      await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(tableList)

      // 修改主表累计入库数量
      let isumXiaohuoSum=sumArr(tableList.map(a=>a.baseQuantity))
      let squantityLj=sumSub([parseFloat(res.squantityLj),parseFloat(isumXiaohuoSum)])
      res.squantityLj=squantityLj
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)
    }
    message.success(`${b?'审核':'弃审'}成功！`)
    pageParameter.type='CGDHD'
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}
const sum = (...arr) => [].concat(...arr).reduce((acc, val) => Number(acc) + Number(val), 0);
// 随机数
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

const loadMark = ref(false)

//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库时间不能为空！'
    })
    return false
  }
  if (hasBlank(form.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '供应商不能为空！'
    })
    return false
  }
  if (hasBlank(form.rate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '税率不能为空！'
    })
    return false
  }
  if (hasBlank(form.cwhcode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '仓库不能为空！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  } else{
    let temp= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && hasBlank(it.tempTwelve))
    if(temp.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+temp.map(a=>a.cinvode)+'】批号为必填项！'
      })
      return false
    }
    let temp2= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && it.cinvodeInfo?.stockIndateManage=='1' && hasBlank(it.tempFifteen) && hasBlank(it.tempDpdate))
    if(temp2.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+temp2.map(a=>a.cinvode)+'】失效日期为必填项！'
      })
      return false
    }
  }
  return true
}

const visible2 = ref(false);
const modelLoading = ref(true);
const modelText = ref('');
const modelText1 = ref('');
const modelText2 = ref('');

//数据保存
async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  if(status.value==1){
    formItems.value.ccode =  await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  }
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = "0"
  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    list.forEach((o, i) => {  //转化
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'

      o['cwhcode1'] = o['cwhcode']
      if (o.cangkuDuli == '0'){
        let arr =  o['tempCangkuId']
        for (let j = 0; j < arr.split('\\').length; j++) {
          o[`cwhcode${j+1}`] = arr.split('\\')[j]
        }
      }
      // 可用量是否包含采购在途量和销售在途量（默认值1是，0或空否）
      o['kcKylCg'] = stockAccountObj.value.kc_kyl_cg
    })
    let temp= await useRouteApi(findByStockCurrLock, {schemaName: dynamicTenantId})({iyear:dynamicYear.value,list:JSON.stringify(list)})
    if(temp[0]['revision']=='1'){
      visible2.value=true
      modelText.value=temp[0]['text']+''
      modelText1.value='现存量已被操作员【'+temp[0]['lockCreatedUserName']+'】锁定'
      modelText2.value='请稍后...'
      return false;
    }else if(temp[0]['revision']=='0'){
      await editStockCurrentRevison({id:temp[0].stockCurrentsId,revision:'1',lockUserId:useUserStoreWidthOut().getUserInfo.id,lockUserDate:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")})
    }

    visible2.value=false
    modelText.value=''
    modelText1.value=''
    modelText2.value=''
    formItems.value.entryList = JsonTool.json(list)
    console.log(stockAccountObj.value.kc_cgrk_check)

    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)
    // kc_cgrk_check：==0 判断现存量够不够。==1 判断在途入库够不够
    else if(status.value===2 && stockAccountObj.value.kc_cgrk_check=='0'){
      // 修改判断==== 增加：直接加差值。减少：现存量差值。
      // 被删除的行
      if(rowDelData.value.length>0){
        rowDelData.value.forEach(async (a)=>{
          let baseQuantity=a[0].baseQuantity
          // 减去现存量
          let sql2="update stock_currentstock set base_quantity=base_quantity-'"+parseFloat(baseQuantity)+"' where iyear='"+a[0].iyear+"' and inv_code='"+a[0].cinvode+"' and cwhcode='"+a[0].cwhcode+"' "
          await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql2)
        })
      }
    }
    else if(status.value===2 && stockAccountObj.value.kc_cgrk_check=='1'){
      // 修改判断==== 增加：直接加差值。减少：现存量+在途入-在途出-差值。
      // 被删除的行
      if(rowDelData.value.length>0){
        rowDelData.value.forEach(async (a)=>{
          let baseQuantity=a[0].baseQuantity
          // 减去入库单数量
          let sql2="update stock_currentstock set ztrk_quantity=ztrk_quantity-'"+parseFloat(baseQuantity)+"' where iyear='"+a[0].iyear+"' and inv_code='"+a[0].cinvode+"' and cwhcode='"+a[0].cwhcode+"' "
          await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql2)
        })
      }
      for (let i = 0; i < list.length; i++) {
        if(list[i].id!==undefined){
          let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})(list)
          let temp2=stockcurr.filter(a=>a.cwhcode==list[i].cwhcode&& a.invCode==list[i].cinvode && a.batchId==list[i].batchId && a.dpdate==list[i].dpdate && a.dvdate==list[i].dpdate)
          for (let j = 0; j < temp2.length; j++) {
            let keyong:any=parseFloat(temp2[j].baseQuantity)+parseFloat(temp2[j].ztrkQuantity)-parseFloat(temp2[j].ztckQuantity)
            let cha:any=parseFloat(temp2[j].ztrkQuantity)-parseFloat(list[i].baseQuantity)
            let cha2=parseFloat(keyong)-parseFloat(cha)
            if(parseFloat(list[i].baseQuantity)<parseFloat(temp2[j].ztrkQuantity)&& (cha2<0 || parseFloat(temp2[j].ztrkQuantity)<parseFloat(list[i].baseQuantity))){
              message.error('存货编码【'+list[i].cinvode+'】在途入库数量不足,不能修改')
              editStockCurrentRevison({id:temp[0].stockCurrentsId,revision:'0',lockUserId:'',lockUserDate:''})
              return false
            }
          }
        }
      }
    }
    // 增加在途入库数量
    let map={list:JSON.stringify(list),status:status.value,kcCgrkCheck:stockAccountObj.value.kc_cgrk_check}
    await useRouteApi(saveStockCurrentstockZTRK_Increase, {schemaName: dynamicTenantId})(map)
    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    editStockCurrentRevison({id:temp[0].stockCurrentsId,revision:'0',lockUserId:'',lockUserDate:''})
    message.success('保存成功！')
    await pageReload()
    status.value = 3
  }
}
async function editStockCurrentRevison(map) {
  if(!hasBlank(map.id)){
    await useRouteApi(updateStockCurrentRevision,{schemaName: dynamicTenantId})(map)
  }
}
async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('first','')
  } else if (status.value == 2) {
    tempTaskDel()
    await contentSwitch('curr','')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
}

const loadPage = (e) => {
  columnReload()
}
async function importEntry() {
  openImportPageM(true, {
    query: {
      code: pageParameter.managementCode,
      expirationDate: formItems.value.endDate,
      condition: {choose: formItems.value.pdMethod, values: formItems.value.pdRange}
    },
    schemaName: dynamicTenantId.value
  })
}

function introduceData(list) {
  if (list.length > 0) {
    let tables = getDataSource()
    let existeds = tables.map(it => it.assetsCode)
    list.forEach(it => {
      if (existeds.indexOf(it.assetsCode) != -1) {
        tables[tables.findIndex(it2 => it2.assetsCode == it.assetsCode)].realityAmount = it.realityAmount
      } else {
        tables.push(it)
      }
    })
    setTableData(tables)
  }
}




function formatUniqueJiLiang(uniqueCodeUser) {
  let str = uniqueCodeUser
  jiList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.unitName
      }
    }
  )
  return str || ''
}

function formatUniqueOperator(uniqueCodeUser) {
  let str = uniqueCodeUser
  operatorList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.realName
      }
    }
  )
  return str || ''
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};


const rowDataGrab = async (rowObj, type: string) => {
  let arr = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
  if (arr.length > 0 && rowObj['assetsUniqueCode'] != arr[0].assetsUniqueCode) {
    rowObj['assetsUniqueCode'] = arr[0].assetsUniqueCode
    rowObj['sysId'] = arr[0].sysId
    rowObj['assetsCode'] = arr[0].assetsCode
    rowObj['assetsName'] = arr[0].assetsName
    // 初始化其他参数
    let res = await useRouteApi(findFaAssetInfoByCode, {schemaName: dynamicTenantId})({code: arr[0].assetsUniqueCode}) || []
    if (null != res && res.length > 0) {
      rowObj['speciType'] = res[0].speciType
      rowObj['bookAmount'] = res[0].bookAmount
      rowObj['measureUnit'] = res[0].measureUnit
      rowObj['yuanzhi'] = res[0].yuanzhi
      rowObj['jtBy'] = res[0].jtBy
      rowObj['zjLj'] = res[0].zjLj
      rowObj['jingzhi'] = res[0].jingzhi
    }
    cardListOptions.value = []
  }
}

const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList = getDataSource()
    await fetch(val, type, filterList, (d: any[]) => (cardListOptions.value = d));
  }
};
const handleChange = async (val: string, type: string) => {
  // await fetch(val, type,(d: any[]) => (cardListOptions.value = d));
  // 赋值
};

let timeout: any;
let currentValue = '';

async function fetch(value: string, type: string, filterList: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  async function fake() {
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':type == 'two'?'stockName':'stockBarcode']?.indexOf(value) !=-1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' :type == 'two'? 'stockName':'stockBarcode'],
        label: type !== 'three'?(r['stockNum'] + ' ' + r['stockName']):(r['stockBarcode']),
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}

const mark = usePlatformsStore().getCurrentPlatformId
const searchConditonList = ref([])
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '采购到货单',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.accId = getCurrentAccountName(false)
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns()
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  // dynamicColumnData.value = []
  // dynamicColumnData.value = dynamicColumnDataCopy
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item != null && item2 != null &&  item?.key === item2.key && item?.name == item2?.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = dynamicAccId.value
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList.filter(it=>it != null)))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    pageReload()
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
  })
}

function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}

const openSetting = () => {
  openQueryPageM(true, {schemaName: dynamicTenantId.value})
}
/*栏目设置end*/
const formEtcData = ref({
  makerMan: '',
  auditMan: '',
})
const thisEditObj = ref(null)
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()

const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const openSelectContent = (o, type) => {
  thisEditObj.value = o
  thisEditType.value = type
  switch (type) {
    case 'cinvode':
      openStockInfoModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
  }
}
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cvencode2':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;

  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['cinvodeInfo'] = o[0]
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      // if (thisEditObj.value['cangkuDuli'] == '0') {
      thisEditObj.value['tempOne'] = o[0].id
      thisEditObj.value['tempCangkuId'] = o[0].cangkuId
      thisEditObj.value['cwhcodeInfo'] = o[0]
      thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      thisEditObj.value['cangkuDuli'] = o[0].cangkuFlag

      // } else {
      //   thisEditObj.value['tempOne'] = o[0].id
      //   thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      // }
    }
    focusNext(thisEditObj.value,thisEditType.value)
    // thisEditObj.value = null
  } else {
    let e:any = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    if(thisEditType.value == 'cvencode'){
      let cvencodeJslist=dynamicFormModel.value.filter(a=>a.field=='cvencodeJs')[0].list.filter(a=>a.uniqueCode==o[0]?.uniqueCodeCcus)
      e['cvencodeJs']=hasBlank(o[0]?.uniqueCodeCcus)?e['cvencode']:cvencodeJslist[0]?.id
    }
    formFuns.value.setFormValue(e)
  }
}
const assemblyName = (arr) => {
  let text = ''
  for (let i = 0; i < arr.length; i++) {

  }
  text = ckListOptions.value.filter(it=>it.id == arr[0])[0]?.ckName
  return text
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0)
        record.cunitidText = list[0].unitName + `[${list[0].conversionRate}]`
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
// 时间格式化
function formatTimer(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d;
}
const dateFormat = 'YYYY-MM-DD';

const tableDataChange =  async (r,c) => {
  // 判断主数量是否小于0
  if(c=='baseQuantity' || c=='taxprice'){
    if(parseFloat(r.tempSix)<0){
      message.error('主数量必须大于0')
      r.tempSix=null
      r.baseQuantity=null
    }
  }
  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo) {
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1') {
        r['cwhcode'] = h.cwhcode
        r['cwhcodeText'] = cangkuInfo.ckName
      }
    }
  }
  r.itaxrate=isNaN(r.itaxrate)?null:r.itaxrate
  switch (c) {
    case 'dvdate':
      let stockInfo=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(r.cinvode)
      r['cinvodeInfo'] = stockInfo
      if (r.cinvodeInfo.stockIndateManage == '1'){
        r.dpdate = formatTimer(dayjs(formatTimer(r.dvdate), dateFormat).subtract(parseInt(r.cinvodeInfo.stockIndateDuration), 'day').add(1, 'day'))
        r.tempDpdate=r.dpdate
      }
      break;
    case 'dpdate':
      let stockInfo2=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(r.cinvode)
      r['cinvodeInfo'] = stockInfo2
      if (r.cinvodeInfo.stockIndateManage == '1'){
        r.dvdate = formatTimer(dayjs(formatTimer(r.dpdate), dateFormat).add(parseInt(r.cinvodeInfo.stockIndateDuration), 'day').subtract(1, 'day'))
        r.tempFifteen=r.dvdate
      }
      break;
    case 'bcheck1':
      if(r.bcheck1!==undefined){
        chChange(r)
      }
      break;
    case 'cinvode':
      if (r.cinvodeName == null) r.cinvodeName = r.tempEleven
      if (r.bcheck1 == null ) r.bcheck1 = r.tempThree
      chChange(r)
      break;
    case 'baseQuantity':
      slChange(r)
      break;
    case 'subQuantity1':
      slChange1(r)
      break;
    case 'subQuantity2':
      slChange2(r)
      break;
    case 'price':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.price)) {
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.price).toFixed(10)
        r.icost = parseFloat(n * d).toFixed(4) + ''
        r.tempTen = r.icost
        r.baseQuantity = n + ''
        r.price = d + ''

        // 含税单价
        let itaxrate=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(r.price*itaxrate).toFixed(2):null
        r.tempTaxprice=r.price*itaxrate>0?parseFloat(r.price*itaxrate).toFixed(2):null
        // 价税合计
        r.isum=parseFloat(r.icost*itaxrate).toFixed(4)
        r.tempIsum=parseFloat(r.icost*itaxrate).toFixed(4)
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(r.isum-r.icost).toFixed(4):null
      }
      slChange(r)
      break;
    case 'icost':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.baseQuantity = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = parseFloat(d / n).toFixed(10) + ''

        // 含税单价
        let itaxrate=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(r.price*itaxrate).toFixed(10):null
        r.tempTaxprice=r.price*itaxrate>0?parseFloat(r.price*itaxrate).toFixed(10):null
        // 价税合计
        r.isum=parseFloat(r.icost*itaxrate).toFixed(4)
        r.tempIsum=parseFloat(r.icost*itaxrate).toFixed(4)
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(r.isum-r.icost).toFixed(4):null
      }
      break;// 无税金额
    case 'itaxrate':// 税率 【itaxprice 税额】
      if(!hasBlank(r.baseQuantity) && !hasBlank(r.itaxrate)){
        let str=''
        if(!hasBlank(r.price)){
          str='price'
        }else if(!hasBlank(r.icost)){
          str='icost'
        }else if(!hasBlank(r.taxprice)){
          str='taxprice'
        }else if(!hasBlank(r.isum)){
          str='isum'
        }
        tableDataChange(r,str)
      }
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.isum = parseFloat(n * d ).toFixed(4) + ''
        r.tempIsum = r.isum

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(r.isum/itaxrate).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(r.icost/n).toFixed(10)
        r.price =r.tempNine
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(r.isum-r.icost).toFixed(4):null
      }
      slChange(r)
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.isum)) { //反算 单价
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.isum).toFixed(4)

        r.taxprice = d/n>0?parseFloat(d/n ).toFixed(10) + '':null
        r.tempTaxprice = r.taxprice

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(r.isum/itaxrate).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(r.icost/n).toFixed(10)
        r.price =r.tempNine
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(r.isum-r.icost).toFixed(4):null
      }
      break;
  }
}

const slChange = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1=0
      let conversionRate2=0
      if(list.length==2){
        conversionRate1=list[1].conversionRate
      }else if(list.length==3){
        conversionRate1=list[1].conversionRate
        conversionRate2=list[2].conversionRate
      }
      let one:any =  parseFloat((n/parseFloat(conversionRate1))).toFixed(10)
      let two:any =  parseFloat((n/parseFloat(conversionRate2))).toFixed(10)
      if (isnum){ //取整数}
        r.baseQuantity = isNaN(n)?null:NumberTool.toCeil(n,2)+''
        r.subQuantity1 = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subQuantity2 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
        r.tempSubQuantity1 = r.subQuantity1
        r.tempSubQuantity2 = r.subQuantity2
      }else {
        r.subQuantity1 = isNaN(one)?null:one+''
        r.subQuantity2 = isNaN(two)?null:two+''
        r.tempSubQuantity1 = r.subQuantity1
        r.tempSubQuantity2 = r.subQuantity2
      }
    }else {
      r.subQuantity1 = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
      r.tempSubQuantity1 = r.subQuantity1
      r.tempSubQuantity2 = r.subQuantity2
    }
  }
}
const slChange1 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n:any = parseFloat(r.subQuantity1).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1=0
      let conversionRate2=0
      if(list.length==2){
        conversionRate1=list[1].conversionRate
      }else if(list.length==3){
        conversionRate1=list[1].conversionRate
        conversionRate2=list[2].conversionRate
      }
      let one:any =  parseFloat((n*parseFloat(conversionRate1))).toFixed(10)
      let two:any =  parseFloat((one/parseFloat(conversionRate2))).toFixed(10)
      if (isnum){ //取整数}
        r.subQuantity1 = isNaN(n)?null:NumberTool.toCeil(n,2)+''
        r.baseQuantity = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subQuantity2 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
        r.tempSix=r.baseQuantity
        r.tempSubQuantity2=r.subQuantity2
      }else {
        r.baseQuantity = isNaN(one)?null:one+''
        r.subQuantity2 = isNaN(two)?null:two+''
        r.tempSix=r.baseQuantity
        r.tempSubQuantity2=r.subQuantity2
      }
    }else {
      r.baseQuantity = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
      r.tempSix=r.baseQuantity
      r.tempSubQuantity2=r.subQuantity2
    }
  }
}
const slChange2 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n:any = parseFloat(r.subQuantity2).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1=0
      let conversionRate2=0
      if(list.length==2){
        conversionRate1=list[1].conversionRate
      }else if(list.length==3){
        conversionRate1=list[1].conversionRate
        conversionRate2=list[2].conversionRate
      }
      let one:any =  parseFloat((n*parseFloat(conversionRate1))).toFixed(10)
      let two:any =  parseFloat((one/parseFloat(conversionRate2))).toFixed(10)
      if (isnum){ //取整数}
        r.subQuantity2 = isNaN(n)?null:NumberTool.toCeil(n,2)+''
        r.baseQuantity = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subQuantity1 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
        r.tempSix=r.baseQuantity
        r.tempSubQuantity1=r.subQuantity1
      }else {
        r.baseQuantity = isNaN(one)?null:one+''
        r.subQuantity1 = isNaN(one)?null:two+''
        r.tempSix=r.baseQuantity
        r.tempSubQuantity1=r.subQuantity1
      }
    }else {
      r.baseQuantity = "0.0000000000"
      r.subQuantity1 = "0.0000000000"
      r.tempSix=r.baseQuantity
      r.tempSubQuantity1=r.subQuantity1
    }
  }
}
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.cinvodeInfo = o
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  record.isIndate = o?.stockIndateManage == '1' // 有效期必须输入
  if (o?.stockMeasurementType == '多计量' && !hasBlank(record.cunitid) &&  record?.unitInfo == null){
    let res =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0){
        record.cunitidText = list[0].unitName +`[${list[0].conversionRate}]`
        if (list.length > 1){
          record.cunitidF1 = list[1].unitName +`[${list[1].conversionRate}]`
          if (list.length > 2)
            record.cunitidF2 = list[2].unitName +`[${list[2].conversionRate}]`
        }
      }
    }
  }
}

const {proxy} = getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 判断主数量是否小于0
  if(c=='baseQuantity'){
    if(parseFloat(r.tempSix)<0){
      message.error('主数量必须大于0')
      r.tempSix=null
    }
  }
  // 得到当前临时标记
  if(c=='bcheck1'){
    c=r.tempThree==undefined?'bcheck1':'cinvode'
  }
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 获取供应商价格表
  findBySupPrice(r)
  // 查找下一个
  let list = getDataSource();
  let filters = ['isGive','cinvodeType','cunitid','cinvodeName','cunitidF1','cunitidF2','itaxprice']
  // 要求填批号才填写
  if (!r.isBatch)filters.push('batchId')
  if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
  // 单计量跳过计量1、2
  if (r.cunitType=='1')filters.push('subQuantity1'),filters.push('subQuantity2');
  let cols = getColumns().filter(it=>it.title!='序号'&&it.title!='审核人' &&  filters.indexOf(it.dataIndex) == -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(nextC, false)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
      getColumnRate(r)
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      setTableData(list)
    }
    nextTick(() => {
      let doms = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
      if (null != doms) doms.focus()
    })
  }
}
const getNextMark = (c,b) => {
  let model = {cwhcode:'One',bcheck1:'Three',cinvode:'Two',baseQuantity:'Six',subQuantity1:'SubQuantity1',subQuantity2:'SubQuantity2',price:'Nine',icost:'Ten',taxprice:'Taxprice',itaxrate:'Itaxrate',isum:'Isum',batchId:'Twelve',dpdate:'Dpdate',dvdate:'Fifteen',cmemo:'Thirteen'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

async function findBySupPrice(data) {
  let cinvode=data.cinvode
  let cvencodeJs=formFuns.value.getFormValue().cvencodeJs
  let supPrice=await useRouteApi(stockSupPriceFindBySupIdAndStockNum, {schemaName: dynamicTenantId})({supId:cvencodeJs,stockNum:cinvode})
  let memberprice=supPrice!==''?supPrice.memberprice:null

  if(supPrice!==''){
    // 供应商价格表含税（默认值1是，0或空否）
    if(stockAccountObj.value.cg_price_is_rate=='1'){
      memberprice=memberprice
    }
    else{
      if(data['tempItaxrate']==0){
        memberprice=data['tempNine']
      }else{
        memberprice=memberprice*(data['tempItaxrate']/100)
      }
    }
  }
  else{
    // 若价格表未设置取最近一次进价（默认值1是，0或空否）
    if(stockAccountObj.value.cg_price_zjyc=='1'){
      let temp= await useRouteApi(findByStockWareRecentlySupMoney, {schemaName: dynamicTenantId})({supId:formFuns.value.getFormValue().cvencode})
      memberprice=temp==''?null:temp
    }
  }
  data['tempNine']=hasBlank(data['tempNine'])?memberprice:data['tempNine']
  data['tempTaxprice']=hasBlank(data['tempTaxprice'])?memberprice:data['tempTaxprice']
}

// 判断是否有结账月
async function countStockPeriodYmFlag(year,flags) {
  let temp=await findStockPeriodYmFlag(year,flags)
  ymPeriod.value=temp>0?true:false
}

// 查看下游数据
function xySourcePop() {
  openXySourcePage(true, {
    database: dynamicTenantId.value,
  })
}

// 生成采购入库单
async function setCGRKD_data() {
  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  useCompanyOperateStoreWidthOut().getLoginDate,prefix: "",key: '3-10'})

  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: '',
    bdocumStyle: '0',
    curr: ''
  })
  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let list2 = JsonTool.parseObj(res.entryList).map(it => resetRow(it))

  // 生成入库单明细
  let listarr=[]
  list.forEach(async (temp)=>{
    temp.isGive=temp.isGive?'1':'0'
    temp.isBatch=temp.isBatch?'1':'0'

    let parentLineCode=temp.lineCode
    let baseQuantity:any=parseFloat(temp.baseQuantity)-parseFloat(temp.isumXiaohuo)
    let n:any = parseFloat(baseQuantity).toFixed(10)
    if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
    let d:any = parseFloat(temp.taxprice).toFixed(10)
    temp.isum = parseFloat(n * d ).toFixed(4) + ''
    temp.tempIsum = temp.isum

    let itaxrate:any=hasBlank(temp.itaxrate)?1:1+(temp.itaxrate/100)
    // 无税金额
    temp.tempTen =parseFloat(temp.isum/itaxrate).toFixed(4)
    temp.icost =temp.tempTen
    // 无税单价
    temp.tempNine =parseFloat(temp.icost/n).toFixed(10)
    temp.price =temp.tempNine
    // 税额
    temp.itaxprice=temp.isum-temp.icost>0?parseFloat(temp.isum-temp.icost).toFixed(4):null

    temp.id=null
    temp.baseQuantity=baseQuantity
    temp.billStyle='CGRKD'
    temp.ccode=newRuKuNum
    temp.lineCode=randomString(30)
    temp.bcheck='0'
    temp.bcheckTime=''
    temp.bcheckUser=''
    temp.isumXiaohuo=''
    temp.squantityLj='0'
    temp.sourcetype='CGDHD'
    temp.sourcecode=oldNum
    temp.sourcedetailId=parentLineCode
    temp.sourcedate=oldddate

    if(baseQuantity>0){
      listarr.push(temp)
    }
  })
  if(listarr.length==0){
    message.error('累计入库数量不足，无法生成采购入库单')
    return false;
  }

  list2.forEach(async (temp)=>{
    let baseQuantity:any=parseFloat(temp.baseQuantity)-parseFloat(temp.isumXiaohuo)
    if(baseQuantity>0){
      temp.isGive=temp.isGive?'1':'0'
      temp.isBatch=temp.isBatch?'1':'0'
      temp.tempBaseQuantity=baseQuantity
      // 修改本单据的 累计入库数量
      temp.isumXiaohuo=parseFloat(temp.isumXiaohuo)+parseFloat(baseQuantity)
    }else{
      temp.tempBaseQuantity=0
    }
  })
  // 修改主表的累计入库数量
  let isumXiaohuoSum=sumArr(list2.map(a=>a.tempBaseQuantity))
  res.squantityLj=hasBlank(res.squantityLj)?isumXiaohuoSum:parseFloat(res.squantityLj)+parseFloat(isumXiaohuoSum)
  await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)
  // 修改本单据子表的 累计入库数量
  await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list2)

  // 生成入库单
  formItems.value.id=null
  formItems.value.ccode=newRuKuNum
  formItems.value.billStyle='CGRKD'
  formItems.value.bcheck=''
  formItems.value.bcheckTime=''
  formItems.value.bcheckUser=''
  formItems.value.isum=sumArr(listarr.map(a=>a.isum))
  formItems.value.icost=sumArr(listarr.map(a=>a.icost))
  formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
  formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))
  await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
  await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(listarr)
  // 添加下游表
  let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
  await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
  await contentSwitch('curr','')
  message.success(`生成采购入库单成功！`)
  // 跳转入库单页面
  router.push('/kc-cgDepot')
}
function sumArr(arr) {
  return arr.reduce(function(prev, curr, idx, arr){
    return prev + curr;
  });
}
function sumSub(arr) {
  return arr.reduce(function(prev, curr, idx, arr){
    return prev - curr;
  });
}
// 生成退货单
async function setCGTHD_data() {
  // 判断上游是否生成红字
  let countRedXy=await useRouteApi(findByCodeSetXyCodeBdocumStyle, {schemaName: dynamicTenantId})({syCode:formItems.value.ccode,billStyle:'CGDHD'})
  if(countRedXy>0){
    message.error(`此单据已经生成红字到货单,不可重复操作！`)
    return
  }
  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGDHD",date:  useCompanyOperateStoreWidthOut().getLoginDate,prefix: "",key: '3-1'})
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: '',
    bdocumStyle: '0',
    curr: ''
  })
  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  // 生成退货单明细
  let listarr=[]
  list.forEach(async (temp)=>{
    temp.isGive=temp.isGive?'1':'0'
    temp.isBatch=temp.isBatch?'1':'0'

    let parentLineCode=temp.lineCode
    let baseQuantity:any=parseFloat(temp.baseQuantity)*-1
    let n:any = parseFloat(baseQuantity).toFixed(10)
    if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
    let d:any = parseFloat(temp.taxprice).toFixed(10)
    temp.isum = parseFloat(n * d ).toFixed(4) + ''
    temp.tempIsum = temp.isum

    let itaxrate:any=hasBlank(temp.itaxrate)?1:1+(temp.itaxrate/100)
    // 无税金额
    temp.tempTen =parseFloat(temp.isum/itaxrate).toFixed(4)
    temp.icost =temp.tempTen
    // 无税单价
    temp.tempNine =parseFloat(temp.icost/n).toFixed(10)
    temp.price =temp.tempNine
    // 税额
    temp.itaxprice=temp.isum-temp.icost>0?parseFloat(temp.isum-temp.icost).toFixed(4):null

    temp.id=null
    temp.baseQuantity=baseQuantity
    temp.bdocumStyle='1'
    temp.billStyle='CGDHD'
    temp.ccode=newRuKuNum
    temp.lineCode=randomString(30)
    temp.bcheck='0'
    temp.bcheckTime=''
    temp.bcheckUser=''
    temp.sourcetype='CGDHD'
    temp.sourcecode=oldNum
    temp.sourcedetailId=parentLineCode
    temp.sourcedate=oldddate
    listarr.push(temp)

    // kc_cgrk_check：==0 判断现存量够不够。==1 判断在途入库够不够
    if(stockAccountObj.value.kc_cgrk_check=='0'){
      // 减去现存量
      let sql2="update stock_currentstock set base_quantity=base_quantity-'"+parseFloat(baseQuantity)*-1+"' where iyear='"+temp.iyear+"' and inv_code='"+temp.cinvode+"' and cwhcode='"+temp.cwhcode+"' "
      await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql2)
    }else{
      // 减去入库单数量
      let sql2="update stock_currentstock set ztrk_quantity=ztrk_quantity-'"+parseFloat(baseQuantity)*-1+"' where iyear='"+temp.iyear+"' and inv_code='"+temp.cinvode+"' and cwhcode='"+temp.cwhcode+"' "
      await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql2)
    }
  })

  // 生成入库单
  formItems.value.id=null
  formItems.value.ccode=newRuKuNum
  formItems.value.billStyle='CGDHD'
  formItems.value.bdocumStyle='1'
  formItems.value.bcheck=''
  formItems.value.bcheckTime=''
  formItems.value.bcheckUser=''
  formItems.value.squantityLj=res.squantityLj*-1
  formItems.value.icost=sumArr(listarr.map(a=>a.icost))
  formItems.value.isum=sumArr(listarr.map(a=>a.isum))
  formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
  formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))
  await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
  await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(listarr)
  // 添加下游表
  let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGDHD',xyccode:newRuKuNum,xyccodeDate:oldddate}
  await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
  await contentSwitch('curr','')
  message.success(`生成采购退货单成功！`)
  // 跳转入库单页面
  router.push('/cg-return')
}

async function findByBdocumStyle() {
  contentSwitch('tail','')
}
</script>
<style lang="less" scoped="scoped">
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色
.app-container {
  padding: 10px;
  background-color: #b4c8e3;
  margin: 0;

  .app-container-top {
    background-color: #f1f1f1;
    border-radius: 5px 5px 0 0;
    padding: 10px;

    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }

    .app-container-top-one {
      line-height: 40px;

      .act-one-d-img {
        width: 42px;
      }

      .act-one-d-left {

      }

      .act-one-d-title {
        .acto-d-title-span {
          color: @Global-Comm-BcOrText-Color;
          font-weight: bold;
          font-size: 24px;
        }
      }

      .act-one-d-btn-group {
        text-align: right;

        .actod-btn {
          color: @Global-Comm-BcOrText-Color;
          font-size: 14px;
          border-color: @Global-Border-Color;
          border-right: none;
        }

        .actod-btn-last {
          border-right: 1px solid @Global-Border-Color;
        }

        .actod-btn:hover {
          background-color: @Global-Comm-BcOrText-Color;
          color: white;
        }
      }
    }

    .app-container-top-two {
      font-size: 14px;
      line-height: 32px;

      .act-two-d-left {

      }

      .act-two-d-center {
        .acttdrd-search-select {
          width: 120px;

          :deep(.ant-select-selector) {
            border-color: @Global-Border-Color;
            border-radius: 2px 0 0 2px;
          }
        }
      }

      .act-two-d-right {
        display: inline-flex;
        justify-content: space-between;

        .acttd-right-d-search {
          .acttdrd-search-select {
            width: 120px;

            :deep(.ant-select-selector) {
              border-color: @Global-Border-Color;
              border-radius: 2px 0 0 2px;
            }
          }

          .acttdrd-search-input {
            width: 180px;
            border-radius: 0 2px 2px 0;
            border-color: @Global-Border-Color;
            border-left: none;
          }
        }

        .acttd-right-d-btns {
          margin-left: 10px;

          .acttdrd-btn {
            border-color: @Global-Border-Color;
            margin-left: 2px;
          }
        }
      }
    }
  }

  .app-container-bottom {
    background-color: white;

    .acb-head {
      .acbgead-one {
        text-align: center;
        height: 60px;
        line-height: 60px;

        .acbgead-one-triangle {
          > div:nth-of-type(1) {
            width: 0px;
            height: 0px;
            border-top: 60px solid #5141d7;
            border-right: 70px solid transparent;
            position: absolute;
          }

          > div:nth-of-type(2) {
            width: max-content;
            color: #fff;
            transform: rotate(-45deg) translateY(-2px) translateX(10px);
            position: absolute;
          }
        }

        .acbgead-one-changes {
          > span {
            cursor: pointer;
          }

          > span:hover {
            color: black;
          }
        }

        > div:nth-of-type(2) {
          display: inline-block;
          float: left;
          margin-left: 4%;
          font-weight: bold;
          font-size: 24px;
          color: #666666;
        }
      }

      .acbgead-two {
        margin: 0 5rem;
      }
    }

    .acb-centent {
      margin: 0 4%;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;

        > div {
          display: inline-block;
          background-color: #d8d8d8;
          padding: 5px;
        }
        > div:nth-of-type(1) {
          width: 39%;
          text-align: center;
        }

        > div:nth-of-type(2) {
          width: 10%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(3) {
          width: 10%;
          text-align: left;
          margin: 0 1px;
        }
        > div:nth-of-type(4) {
          width: 10%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(5) {
          width: 17%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(6) {
          width: 13%;
          margin: 0 1px;
          text-align: left;
        }
      }
    }


  }

  .status-look {
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.lanmu-table{
  :deep(.ant-table-content){
    .ant-table-thead{
      tr{
        th{
          padding: 5px 8px !important;
          text-align: center !important;
        }
      }
    }
    .ant-table-tbody{
      tr{
        td{
          padding:0 5px !important;
          font-size: 12px !important;
          .ant-radio-button-wrapper{
            font-size: 12px;
          }
        }
      }

    }
  }
}
.suspended-div {
  width: 100%;
  height: 22px;

  .anticon-form {
    float: right;
    line-height: 22px;
    display: none;
  }
}
.suspended-div:hover {
  cursor: text;
  background-color: #e4e7e7;
  .anticon-form {
    display: block;
  }
}
</style>
<style lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
</style>
