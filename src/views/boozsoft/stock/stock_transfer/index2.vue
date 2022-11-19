<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199)">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" @reloadTable="dynamicAdReload" :readonly="status>1"/></div>
      </div>
      <div></div>
      <div>
        <div>
            <Button class="actod-btn" @click="router.push('/kc-dbd-list')">查询</Button>
            <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
            <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck != '1'">修改</Button>
            <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
            <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
            <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
            <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删行</Button>
            <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.bcheck != '1'">
              删除
            </Button>
            <Button class="actod-btn" @click="startReview(true)"
                    v-if="status == 3 && formItems.bcheck != '1'">审核
            </button>
            <Button class="actod-btn" @click="startReview(false)"
                    v-if="status == 3 && formItems.bcheck == '1'">弃审
            </button>
            <Popover  placement="bottom">
            <template #content>
              <Button class="group-btn-span-special2" style="width: 180px;margin-bottom: 2px"  @click="gotoPy()">其他入库单（调拨入库）</Button><br/>
              <Button class="group-btn-span-special2" style="width: 180px;margin-bottom: 2px" @click="gotoPk">其他出库单（调拨出库）</Button>
            </template>
            <Button
              class="actod-btn"
              v-if="status == 3 && formItems.bcheck == '1'"
              ant-click-animating-without-extra-node="false"
            ><span>联查</span></Button></Popover>
            <Button v-if="status ==  3" class="actod-btn"  @click="exportExcelNow()">导出</Button>
            <Button class="actod-btn actod-btn-last"
                    ant-click-animating-without-extra-node="false"
                    v-if="status ==  3"
                    @click="openPrint()">打印
            </Button>
            <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="存货编码或名称"
              style="border-left:1px solid #c9c9c9;"
              @search="pageSearch"
              v-model:value="pageParameter.searchConditon.value"
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
                  placement="leftTop"
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
              <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
              <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
              <RightOutlined @click="contentSwitch('next')"/>&nbsp;
              <VerticalLeftOutlined @click="contentSwitch('tail')"/>
              <span v-if="status=='3'" class="anticon" style="margin-left: 1em">
              <Tag v-if="formItems.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="formItems.bcheck === '1'">
                已出库
              </Tag>
              <Tag :color="'volcano'" v-if="formItems.bcheck === '1'">
                已入库
              </Tag>
            </span>
            </div>
            <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: titleValue==0?'#0096c7':'#c0392b'}">{{ titleContents[titleValue] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent"/>
        </div>
      </div>

      <div class="acb-centent">
        <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(115)}"
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
                <span>{{ record.cwhcodeText }}</span>
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
                  @keyup.enter="chFocus = 'one';tempType='one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType='one';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">
                <span class="a-table-font-arial">{{ record.cinvode }}</span>
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
                  @keyup.enter="chFocus = 'two';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">
                <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeBarcode="{ record }">
            <template v-if="record.editThree">
              <Select
                  v-model:value="record.tempThree"
                  show-search
                  style="width: 82%;"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  :options="cardListOptions"
                  @change="value=>handleChange(value,'three')"
                  @search="value=>handleSearch(value,'three')"
                  @keyup.enter="chFocus = 'three';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThree=record.cinvodeBarcode,record.editThree = true;">
                <span class="a-table-font-arial">{{ record?.cinvodeBarcode }}</span>
              </div>
            </template>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #price="{ record }">
            <template v-if="record?.editNine">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
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
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                  @click="record.editTaxprice = null,record.taxprice=record.tempTaxprice,tableDataChange(record,'taxprice')"/>
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
          <!-- 税率-->
          <template #itaxrate="{ record }">
            <template v-if="record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate" class="itaxrate"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'itaxrate')"/>
              <CheckOutlined
                  @click="record.editItaxrate = null,record.itaxrate=record.tempItaxrate,tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                    <span class="a-table-font-arial">{{
                        (record.itaxrate == null ? '' : parseFloat(record.itaxrate*100).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve && record.isBatch">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId" readonly
                     @keyup.enter="openSelectContent(record,'batchId')">
                <template #suffix>
                  <FileSearchOutlined @click="openSelectContent(record,'batchId')"/>
                </template>
              </Input>
              <!--         focusNext(record,'batchId')     <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>-->
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
          <template #dvdate="{ record }">
            <template v-if="record?.editFifteen">
              <DatePicker v-model:value="record.tempFifteen" value-format="YYYY-MM-DD"
                          class="dvdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempFifteen && !b?focusNext(record,'dvdate'):null"/>
              <CheckOutlined @click="record.editFifteen = null;record.dvdate=record.tempFifteen;"/>
            </template>
            <template v-else>
              <!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                                 @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">-->
              <div>
                <span class="a-table-font-arial">{{ record.dvdate }}</span>
              </div>
            </template>
          </template>
          <template #bcheck="{ record }">
            {{ formatUniqueOperator(record.bcheckUser)}}
          </template>

          <template #cgUnitId="{ record }" >
            <template v-if="record.editCgUnitId">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @keyup.enter="focusNext(record,'cgUnitId')"
                @change="cgUnitIdChange(record);verifyRowXCL(record)"
              >
                <SelectOption v-for="tem in record.unitList" :value="tem.value">
                  {{ tem.title }}
                </SelectOption>
              </Select>
              <CheckOutlined @click="record.editCgUnitId = null;record.cgUnitId=record.tempCgUnitId;tableDataChange(record,'cgUnitId')"/>
            </template>
            <template v-else>
              <div @click="record.tempCgUnitId=record.cgUnitId,record.editCgUnitId = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span>{{ hasBlank(record.unitList)?null:record.unitList.filter(it => it.value == record.cgUnitId)[0]?.title}}</span>
              </div>
            </template>
          </template>
          <template #cnumber="{ record }">
            <template v-if="record?.editCnumber">
              <InputNumber v-model:value="record.tempCnumber"
                           class="cnumber"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'cnumber');"/>
              <CheckOutlined @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber');"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempCnumber=record.cnumber,record.editCnumber = true;">
                    <span class="a-table-font-arial">{{
                        (record.cnumber == null ? '' : parseFloat(record.cnumber).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #xcl="{ record }">
            <span class="a-table-font-arial">{{
                (record.xcl == null ? '' : parseFloat(record.xcl).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}</span>
          </template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summary[cell.dataIndex]?'':summary[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
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
    <XySource @register="registerXySourcePage"/>
    <LySource @register="registerlySourcePage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <BatchSelector @register="registerBatchSelectorPage" @throwData="modalData"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
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
  Tag
} from "ant-design-vue";
import Query from "./popup/query.vue";
import BatchSelector from "/@/views/boozsoft/stock/stock_transfer/popup/BatchNumberSelector.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import LySource from './popup/lySource.vue';
import Print from "./popup/print.vue";
import DynamicForm from './component/DynamicForm.vue';
import {
  CheckOutlined,
  EditOutlined,
  FileSearchOutlined,
  LeftOutlined,
  PicLeftOutlined,
  PrinterOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,CopyOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool, uuid} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute,} from "vue-router";
/**********************栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {findDbLanMuList, saveLanMuList,} from '/@/api/record/system/accvoucher';
import {
  askTask,
  compareTime,
  findByFunctionModule,
  hasBlank,
  offsetToStr
} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "./component/DynamicForm";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_transfer/popup/stockInfoModalPop.vue";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  batchSelectorList,
  delBefore,
  delRuKu,
  findBillByCondition,
  findBillCode,
  findBillLastDate,
  reviewRuKu,
  saveXhd,
  unAuditBefore, findByXyCcode, auditCheck, audit,auditBack,getDataInfo
} from "/@/api/record/stock/stock-dbd";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import {findAll as findAllPrice} from "/@/api/record/stock/stock-price";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave, stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {findByTakingChCodes} from "/@/api/record/stock/stock_taking";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
const paginationNumber = ref(0)
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent,closeToFullPaths} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const windowHeight = (window.innerHeight - 300)
const dynamicTenantId = ref('')
const dynamicTenant = ref(null)
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['调拨单', '调拨单']
const titleValue = ref(0)
const formRowNum = ref(1)
const ymPeriod:any = ref(false)
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'DBD'
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
const stockPriceList = ref([])
const searchList = ref([])
const dynamicAdReload = async (obj) => {
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accountMode.split('-')[0] + '-' + obj.accountMode.split('-')[1]
  dynamicYear.value = obj.stockYear
  pageParameter.companyName = obj.companyName

  await columnReload()
  await reloadList()
  resetDynamicColumnData()
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
const route = useRoute();
const routeData:any = route.query;

const pageReload = async () => {
  console.log('跳转='+JSON.stringify(routeData))
  // 列表跳转过来
  if(routeData.type=='add'){
    startEdit('add')
    //重置
    routeData.type = ''
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr')
  }
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  //  ckListOptions.value = (await useRouteApi(cangKuAll, {schemaName: dynamicTenantId})({ckIsDuli: '1'}))?.items
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  stockPriceList.value = (await useRouteApi(findAllPrice, {schemaName: dynamicTenantId})({stockClass: '0'}))
}

async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    res.xsRate = dynamicTenant.value.target.xsRate || 0
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        list[i].canzhaoCnumber=0
        list[i].unitList=[]
        let stock=await useRouteApi(findByStockNum2, {schemaName: dynamicTenantId})(list[i].cinvode)
        // 查询计量明细
        let res:any =  manyJiList.value.filter(it=>it.id == stock?.stockMeasurementUnit)[0]
        console.log("contentSwitch:"+res)
        if (res != null){
          let list2 = JsonTool.parseObj(res.detail) || []
          list2=list2.filter(jl=>!hasBlank(jl.unitName))
          list[i].unitList.push({conversionRate:list2[0]?.conversionRate,title:list2[0]?.unitName,value:list2[0]?.id,ggxh:stock?.stockGgxh,txm:stock?.stockBarcode})
          if(list2.length==2){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
          }
          if(list2.length==3){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
            list[i].unitList.push({conversionRate:list2[2]?.conversionRate,title:list2[2]?.unitName,value:list2[2]?.id,ggxh:stock?.stockUnitGgxh2,txm:stock?.stockUnitBarcode2})
          }
          let data=list[i].unitList.filter(a=>a.value==list[i].cgUnitId)[0]
          list[i].bcheck1=data?.txm
          list[i].cinvodeType=data?.ggxh
        }
        else{
          list[i].unitList=jiList.value.filter(a=>a.id==list[i].cgUnitId).map(it=>{it.conversionRate=it.conversionRate;it.title=it.unitName;it.value=it.id;it.ggxh=stock?.stockGgxh;it.txm=stock?.stockBarcode;return it;})
        }
      }

      let len = list.length
      for (let i = len; i < 50; i++) {
        list.push({})
      }
      setTableData(list)
    }
    calculateTotal()
    pageParameter.searchConditon.value = ''
    searchList.value = []
    formItems.value.entryList = null

  } else {
    let arr = []
    for (let i = 0; i < 50; i++) {
      arr.push({})
    }
    setTableData(arr)
    //message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
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
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cinvodeBarcode'},
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
      width: 120
    },
    {
      title: '计量单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
      width: 120
    },
    {
      title: '现存量',
      dataIndex: 'xcl',
      slots: {customRender: 'xcl'},
      ellipsis: true,
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'cnumber',
      ellipsis: true,
      slots: {customRender: 'cnumber'},
      width: 120
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
      width: 80
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
      width: 80,
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
      width: 150,
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
      title: '生产日期',
      dataIndex: 'dpdate',
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
  indexColumnProps:{ fixed:true },
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
const tableDel = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
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

async function saveLogData(optAction,ccode) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'调拨单',
    uniqueCode:ccode,
    optAction:optAction,
    accId:dynamicTenantId.value,
    optContent:'操作内容【调拨单】,单据编号【'+ccode+'】',
  }
  await saveLog(logmap)
}

async function checkBusDate(date) {
  let dates = date.split('-')
  let list = await findStockPeriodInfoByYm({code:dynamicTenant.value.target.id,date: date})
  formItems.value.ddate = date
  if (list.length == 0){
    createWarningModal({title: "温馨提示",content: '当年度暂未创建，不能新增调拨单，请先创建该年度'})
    return false;
  }else {
    if (list.filter(it=>it.istock == '1').length == list.length){
      createWarningModal({title: "温馨提示",content: '当年度已经全部结账，不能新增调拨单，请切换公司代码或年度'})
      return false;
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 本年月结账
      // 得到当年最后一张调拨单日期
      let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenantId})({year: dates[0],type:"DBD"}))
      formItems.value.ddate = n
    }
  }
  return true;
}
const startEdit = async (type) => {
  let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
  //  1 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
  console.log('入库单操作：1--->日期是否已结账-->'+temp)
  if(temp>0){
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }
  //  2 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
  console.log('入库单操作：2--->结账操作-->'+jzMethod)
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  //  3 盘点处理
  let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(dynamicYear.value)
  console.log('入库单操作：3--->盘点处理-->'+pd)
  if(pd>0){
    return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
  }
  showAvailability(true)
  let maxR = 50
  if (type === 'add') {
    status.value = 1
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      formItems.value.ccode = await generateCode(busDate) // 生成编码
      formItems.value.xsRate = dynamicTenant.value.target.xsRate || 0 // 获取账套汇率
      formFuns.value.setFormValue({
        ddate: formItems.value.ddate,
        ccode: formItems.value.ccode,
        xsRate:  formItems.value.xsRate
      })
    }

    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'调拨单',method:'新增',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('新增')
    }
  } else {
    //验证数据完整性
    let d = await checkData(formFuns.value.getFormValue().ccode)
    if(!d){
      message.error("数据异常请刷新页面后操作！")
      return
    }
    if(d.bcheck == '1'){
      message.error("提示：当前单据已经审核，不能修改，请弃审单据后重试！！！")
      return
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'调拨单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'调拨单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }

    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = dLen; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
  }

}

async function checkData(ccode) {
  let d = await useRouteApi(getDataInfo, {schemaName: dynamicTenantId})(ccode)
  return d
}

const showAvailability = (b) => {
  if (titleValue.value == 0)
    setColumns(getColumns().map(it=>{if (it.dataIndex == 'xcl')it.ifShow = b;return it;}))
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date,
    key: '3-15'
  })
}
// 任务
const taskInfo:any = ref('')
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'调拨单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
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
    compState.loading = true
    if (formItems.value.bcheck == '1') {
      compState.loading = false
      return message.error('提示：当前入库单已经审核，不能删除，请弃审单据后重试！！')
    }
    // 有无 整理现存量 任务
    let xclTaskData = await useRouteApi(getByStockBalanceTask, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      name: '整理现存量',
      method: '整理现存量'
    })
    if (!hasBlank(xclTaskData)) {
      compState.loading = false
      return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
    }
    // 结账操作
    let jzMethod = await useRouteApi(getByStockBalanceTask, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      name: '月末结账',
      method: '月末结账'
    })
    if (!hasBlank(jzMethod)) {
      compState.loading = false
      return message.error('提示：操作员' + jzMethod.caozuoName + '正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    // 任务
    let taskData = await useRouteApi(getByStockBalanceTask, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      name: '调拨单',
      method: '修改,审核,删除',
      recordNum: formItems.value.ccode
    })
    if (!hasBlank(taskData)) {
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if (taskData[i]?.caozuoUnique !== useUserStoreWidthOut().getUserInfo.id) {
          compState.loading = false
          return createWarningModal({content: taskData[i]?.username + '正在' + taskData[i]?.method + '调拨单,不能同时进行操作！'});
        }
        await useRouteApi(stockBalanceTaskEditNewTime, {schemaName: dynamicTenantId})(taskData[i]?.id)
      }
    }
    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '调拨单删除',
      content: '您确定要进行调拨单删除吗!',
      onOk: async () => {
        // 删除前校验
        if (formItems.value.isGenerate) {
          compState.loading = false
          createWarningModal({title: '温馨提示', content: '当前单据已经生成出库单不能进行删除操作！'})
        } else {
          await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
          tempTaskDel(taskInfo.value?.id)
          saveLogData('删除',formItems.value.ccode)
          message.success('删除成功！')
          formItems.value.id = ''
          compState.loading = false
          await contentSwitch('tail')
        }
      }
    });
  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    //验证数据完整性
    let d = await checkData(formFuns.value.getFormValue().ccode)
    if(!d){
      message.error("数据异常请刷新页面后操作！")
      return
    }
    //校验
    compState.loading = true
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      compState.loading = false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      compState.loading = false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }

    //  3 盘点处理
    let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(dynamicYear.value)
    console.log('入库单操作：3--->盘点处理-->'+pd)
    if(pd>0){
      return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
    }

    let a = useUserStoreWidthOut().getUserInfo.id
    if(b==true){
      if(d.bcheck === '1'){
        message.error("已审核请勿重复审核，请刷新页面后操作！")
        return
      }
      //校验现存量
      let b = await useRouteApi(auditCheck,{schemaName: dynamicTenantId})({
        ccode: formFuns.value.getFormValue().ccode,
        rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
        ckBcheck:dynamicTenant.value.target?.kcXsckCheck,
        flg:'XCL',
        type:'sh',
      })
      if(!b){
        compState.loading = false
        return message.error('现存量不足不能审核！！！')
      }

      //校验可用量
      let kyl = await useRouteApi(auditCheck,{schemaName: dynamicTenantId})({
        ccode: formFuns.value.getFormValue().ccode,
        rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
        ckBcheck:dynamicTenant.value.target?.kcXsckCheck,
        flg:'KYL',
        type:'sh',
      })
      if(!kyl){
        compState.loading = false
        return message.error('可用量不足不能审核！！！')
      }

      await useRouteApi(audit,{schemaName: dynamicTenantId})({
        ccode:  formFuns.value.getFormValue().ccode,
        userId: a,
        type: true,
      })
      formItems.value.bcheck = '1'

    }else{
      if(d.bcheck != '1'){
        message.error("未审核不能弃审，请刷新页面后操作！")
        return
      }
      //校验现存量
      let b = await useRouteApi(auditCheck,{schemaName: dynamicTenantId})({
        ccode: formFuns.value.getFormValue().ccode,
        rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
        ckBcheck:dynamicTenant.value.target?.kcXsckCheck,
        flg:'XCL',
        type:'qs',
      })
      if(!b){
        compState.loading = false
        return message.error('现存量不足不能审核！！！')
      }
      //校验可用量
      let kyl = await useRouteApi(auditCheck,{schemaName: dynamicTenantId})({
        ccode: formFuns.value.getFormValue().ccode,
        rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
        ckBcheck:dynamicTenant.value.target?.kcXsckCheck,
        flg:'KYL',
        type:'qs',
      })
      if(!kyl){
        compState.loading = false
        return message.error('可用量不足不能审核！！！')
      }

      await useRouteApi(auditBack,{schemaName: dynamicTenantId})({
        ccode:  formFuns.value.getFormValue().ccode,
        userId: a,
        type: true,
      })
      formItems.value.bcheck = '0'
    }
    compState.loading = false
    message.success("操作成功")
  }
}

function codeToName(arr) {
  let names = {'XSCKD':'销售出库单'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}

const loadMark = ref(false)

//存货校验
async function stockCheck(list,model) {
  let err = ''
  // 任务校验
  let res = await useRouteApi(findByFunctionModule, {schemaName: dynamicTenantId})({iyear: model.ddate.split('-')[0]})
  let checkMenu = ['整理现存量']
  for (let i = 0; i < res.length; i++) {
    let item = res[i]
    if (checkMenu.indexOf(item.functionModule) != -1 && item.state == '1')
      /*if (item.time != '' && !compareTime(offsetToStr(item.time))) */
      err = '系统正在进行现存量整理操作，不能进行单据新增处理，请销后再试！'
  }
  // 盘点存货校验
  if ('' == err){
   let res = await useRouteApi(findByTakingChCodes, {schemaName: dynamicTenantId})({/*iyear: model.ddate.split('-')[0]*/})
    if (!hasBlank(res)){
      let ds = [...new Set(list.map(it=>it.cinvode))].filter(s=>res.indexOf(s) != -1)
      if (ds.length >0)err ='存货编码【'+ds.join()+'】正在盘点中，不能进行单据处理，请销后再试!'
    }
  }
  if ('' == err){   // 现存量校验
    let checkParm = {xsOutXhd:dynamicTenant.value.target.xsOutXhd == '1',b09: true,isOut:titleValue.value == 1}
    let set = [...new Set(list.map(it=>it.cinvode))]
    let dbs =( await useRouteApi(batchSelectorList, {schemaName: dynamicTenantId})({year: model.ddate.split('-')[0],codes: set})) || []
    for (const s of set) {
      let tStock =  assetsCardList.value.filter(it=>it.stockNum == s)[0]
      let tList = list.filter(it=>it.cinvode == s)
      let tNum = 0;tList.map(it=> tNum+=parseFloat(it.baseQuantity))
      let kNum = 0; // 可用量
      if (checkParm.xsOutXhd){ // 是否允许超量
        // 是否批次管理
        /*if (tStock["stockPropertyBatch"] == '1'){
          let eList = dbs.filter(r=>{
            let it =  tList.filter(it2=>it2.batchId == r.batchId)[0]
            if (r == null) return true;
            return  parseFloat((checkParm.b09?(((parseFloat(r['baseQuantity'])+parseFloat(r['ztrkQuantity']))-parseFloat(r['ztckQuantity'])).toFixed(2))
              :(parseFloat(r['baseQuantity'])-parseFloat(r['ztckQuantity'])).toFixed(2))) < parseFloat(it.baseQuantity)
          })
          eList.map(r=>err+=`行次【${tList.filter(it2=>it2.batchId == r.batchId)[0].lineId}】存货编码【${s}】存货现存量不足,现存量主数量【${r.baseQuantity}】,差额主数量【${Math.abs(tList.filter(it2=>it2.batchId == r.batchId)[0].baseQuantity-r.baseQuantity)}】;`)
        }*/
      }else {
        if (!checkParm.isOut){ // 如果退货单跳过
          if (tStock["stockPropertyBatch"] == '1'){
            let eList = dbs.filter(r=>{
              let it =  tList.filter(it2=>it2.batchId == r.batchId)[0]
              if (r == null) return true;
              if (it == null) return false;
              return  parseFloat((checkParm.b09?(((parseFloat(r['baseQuantity'])+parseFloat(r['ztrkQuantity']))-parseFloat(r['ztckQuantity'])).toFixed(2))
                :(parseFloat(r['baseQuantity'])-parseFloat(r['ztckQuantity'])).toFixed(2))) < parseFloat(it.baseQuantity)
            })
            eList.map(r=>err+=`行次【${tList.filter(it2=>it2.batchId == r.batchId)[0].lineId}】存货编码【${s}】存货现存量不足,现存量主数量【${r.baseQuantity}】,差额主数量【${Math.abs(tList.filter(it2=>it2.batchId == r.batchId)[0].baseQuantity-r.baseQuantity)}】;`)
          }else {
            dbs.filter(it=>it.invCode == s).map(r=> (kNum+= parseFloat(checkParm.b09?(((parseFloat(r['baseQuantity'])+parseFloat(r['ztrkQuantity']))-parseFloat(r['ztckQuantity'])).toFixed(2))
              :(parseFloat(r['baseQuantity'])-parseFloat(r['ztckQuantity'])).toFixed(2))))
            // 可用量 > 消单数量
            if (kNum < tNum)
              err+=`行次【${tList[0].lineId}】存货编码【${s}】存货现存量不足,现存量主数量【${dbs[0].baseQuantity}】,差额主数量【${Math.abs(tNum-dbs[0].baseQuantity)}】;`
          }
        }
      }
    }
  }

  if (err != ''){
    createWarningModal({title: '温馨提示', content: err})
    return  false;
  }
  return true;
}
//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '调拨单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '调拨日期不能为空！'
    })
    return false
  }


  if (hasBlank(form.cwhcode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '调出仓库不能为空！'
    })
    return false
  }
  if (hasBlank(form.cwhcoderk)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '调入仓库不能为空！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  }
  return true
}

const visible2 = ref(false);
const modelText = ref('');
const modelText1 = ref('');
const modelText2 = ref('');
//数据保存
async function saveData() {
  //验证数据完整性
  let d = await checkData(formFuns.value.getFormValue().ccode)
  if(d){
    if(d.bcheck == '1'){
      message.error("提示：当前单据已经审核，不能修改，请弃审单据后重试！！！")
      return
    }
  }
  compState.loading = true
  let id = (status.value == 1?null:formItems.value.id)
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    let delKyes = Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp') )
    delKyes.push(...['cwhcodeInfo','unitInfo'])
    list.forEach((o, i) => {  //转化
      o = ObjTool.dels(o,delKyes)
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'
      if (o.cangkuDuli == '1'){
        o['cwhcode1'] = o['cwhcode']
      }else if (o.cangkuDuli == '0'){
        let arr =  o['cwhcode'].split("\\")
        for (let j = 0; j < arr.length; j++) {
          o[`cwhcode${j+1}`] = arr[j]
        }
      }
    })
    if (!(await stockCheck(list,formItems.value))) {
      return false
    }
    formItems.value.entryList = JsonTool.json(merge(list))
    if (formItems.value?.id == null){
      formItems.value.ccode = await generateCode(formItems.value.ddate)
      showAvailability(false)
    }
    showAvailability(false)
    await useRouteApi(saveXhd, {schemaName: dynamicTenantId})(formItems.value)
    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData(status.value==1?'新增':'修改',formItems.value.ccode)
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    compState.loading = false
    routeData.type = ''
    await pageReload()
    status.value = 3
  }
}

function merge(list) {
  // 将客户+仓库+存货+批号+生失日期相同的数据合并
  // list.map(it=>it.cvencode+'-'+it.cinvode+'-'+)
  return list
}

async function editStockCurrentRevison(map) {
  if(!hasBlank(map.id)){
    await useRouteApi(updateStockCurrentRevision,{schemaName: dynamicTenantId})(map)
  }
}
const referTaskList:any = ref([])
async function giveUp() {
  formFuns.value.setFormValue({})
  setTableData([])
  if (status.value == 1) {
    await contentSwitch('first')
    showAvailability(false)
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
  //删除新增修改的锁定
  if(!hasBlank(taskInfo.value)){ tempTaskDel(taskInfo.value?.id) }
  // 删除参照任务锁定表
  if(referTaskList.value.length>0){
    for (let i = 0; i < referTaskList.value.length; i++) {
      tempTaskDel(referTaskList.value[i].id)
    }
  }
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


const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
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
    /*let qData = {
      date: formFuns.value.getFormValue().ddate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findCunHuoListByCondition, {schemaName: dynamicTenantId})(qData) || []*/
    let k = type == 'one' ? 'stockNum' : type == 'three' ? 'stockBarcode' : 'stockName'
    let res = assetsCardList.value.filter(it => null != it[k] && it[k].indexOf(value) != -1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : type == 'three' ? 'stockBarcode' : 'stockName'],
        label: type == 'three' ? r['stockBarcode'] : (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}

const chFocus = ref('one')
const mark = usePlatformsStore().getCurrentPlatformId
const searchConditonList = ref([])
const visible = ref(false);
const windowWidth = (window.innerWidth - (70))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef = ref(null)
const lanMuData = {
  'accId': 'postgres',
  'menuName': '调拨单新增',
  'type': '列表',
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
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value.filter(it=>it != null)))
      }
    }
  });
  // 重新获取数据
  reloadColumns()
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
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

const summaryShow = ref({
  showOne: true,
  showTwo: true
})

const reloadColumns = () => {
  /* let a = []
   a = getColumns()*/
  // let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  // newA.push(last)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
  summaryShow.value.showOne = newA.filter(it=>it.dataIndex == 'subQuantity1' && it.ifShow).length > 0
  summaryShow.value.showTwo = newA.filter(it=>it.dataIndex == 'subQuantity2' && it.ifShow).length > 0
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
const [registerlySourcePage, {openModal: openLySourcePage}] = useModal()

const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerBatchSelectorPage, {openModal: opneBatchSelectorPage}] = useModal();
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
      let data = formFuns.value.getFormValue()
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
        ckIsDuli: null != o ? o['cangkuDuli'] : null,
        entity: null != o ? ckListOptions.value.filter(it => it.id == data.cwhcode)[0] : null
      })
      break;
    case 'batchId':
      if (hasBlank(o?.cwhcode) || hasBlank(o?.cinvode) || hasBlank(o?.cnumber)){
        createWarningModal({title: "温馨提示",content: '仓储位置、存货与数量不能为空，请先完善数据后再进行操作！'})
      }else {
        o.quantity = o.cnumber
        o.xsUnitId = o.cgUnitId
        opneBatchSelectorPage(true, {
          tenant: dynamicTenant.value,
          row: o, list: ckListOptions.value, mode: 'xcl'
        })
      }
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
      thisEditObj.value['tempTwo'] = o[0].stockNum
      thisEditObj.value['cinvodeInfo'] = o[0]
      thisEditObj.value['xcl'] = o[0].xcl
      focusNext(thisEditObj.value,thisEditType.value)

    } else if (thisEditType.value == 'batchId') {
      if (o.length == 1) {
        thisEditObj.value['tempTwelve'] = o[0].batchId
        thisEditObj.value['dpdate'] = o[0].dpdate
        thisEditObj.value['dvdate'] = o[0].dvdate
        thisEditObj.value['tempCnumber'] = o[0].outQuantity
        getCurrPrice(thisEditObj.value)
        focusNext(thisEditObj.value,thisEditType.value)
      } else {
        let arr = []
        const temp = ObjTool.dels(JsonTool.parseProxy(thisEditObj.value), ['key','editTwelve'])
        o.forEach((v)=>{
          let t = JsonTool.parseProxy(temp)
          t.key = uuid().replaceAll(/\-/g,'')
          t['batchId'] = v.batchId
          t['dpdate'] = v.dpdate
          t['dvdate'] = v.dvdate
          // 调整数量
          t['baseQuantity'] = v.outQuantity
          getCurrPrice(t)
          arr.push(tableDataChange(t, 'baseQuantity'))
        })
        let tables = getDataSource()
        let index = tables.findIndex(it => it.key == thisEditObj.value['key'])
        tables.splice(index, 1, ...arr)
        setTableData(tables)
      }
``    } else {
      if (thisEditObj.value['cangkuDuli'] == '0') {
        thisEditObj.value['tempOne'] = o[0].cangkuId
        thisEditObj.value['cwhcodeInfo'] = o[0]
        thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      } else {
        thisEditObj.value['tempOne'] = o[0].id
        thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      }
      focusNext(thisEditObj.value,thisEditType.value)
    }
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }
}

const getCurrPrice = async (record) => {
  useRouteApi(getCkPriceList,{schemaName: dynamicTenantId})({
    stockCostAccRo:JSON.stringify([{
      stockNum :record.cinvode,
      stockCangku :record.cwhcode,
      batchId: record?.batchId || record?.tempTwelve,
    }]),
    ddate :formItems.value.ddate,
    year :dynamicYear.value,
    rkBcheck: dynamicTenant.value?.target?.kcCgrkCheck,
    ckBcheck:  dynamicTenant.value?.target?.kcXsckCheck,
  }).then(res=>{
    if (null != res && res.length > 0){
      record.price = getUnitNumberOrPrice(record,res[0].price,4)
      record.tempNine =  record.price
      //计算无税金额
      record.icost = (record.price * record.cnumber).toFixed(4)
    }
  })
}
/**
 * 根据主数量得到数量
 * @param r
 */
const getUnitNumberOrPrice = (r,z,i) => {
  if (r.xsUnitId == r.cunitid){
    return z
  }else {
    let c = z
    let index = r.unitList.findIndex(it => it.value == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      c = i==2? (z / parseFloat(r.unitList[1].conversionRate)):(z * parseFloat(r.unitList[1].conversionRate))
    } else if (index == 2 && r.unitList.length > 2) {
      c = i==2? (z / parseFloat(r.unitList[2].conversionRate)):(z * parseFloat(r.unitList[2].conversionRate))
    }
    return c.toFixed(i)
  }
}
const resetRow = (record) => {
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode)[0]
  record['key'] = record.lineCode
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh='';it.txm ='';return it;})
      if (list.length > 0) {
        record.unitList[0].ggxh = o?.stockGgxh
        record.unitList[0].barcode = o?.stockBarcode
        if (list.length > 1) {
          record.unitList[1].ggxh = o?.stockUnitGgxh1
          record.unitList[1].barcode = o?.stockUnitBarcode1
          if (list.length > 2){
            record.unitList[2].ggxh = o?.stockUnitGgxh2
            record.unitList[2].barcode = o?.stockUnitBarcode2
          }
        }
      }
    }
  }else {
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh=o?.stockGgxh;it.txm =o?.stockBarcode;return it;})
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
const assemblyName = (arr) => {
  let text = ''
  for (let i = 0; i < arr.length; i++) {

  }
  text = ckListOptions.value.filter(it=>it.id == arr[0])[0]?.ckName
  return text
}
const tempType =  ref('')
const tableDataChange =  (r,c) => {

  if(titleValue.value != 0 && c=='cnumber' ){
    r.tempCnumber=parseFloat(r.tempCnumber) > 0?0 - (Math.abs(parseFloat(r.tempCnumber))):r.tempCnumber
    r.cnumber=r.tempCnumber
  }else if(titleValue.value != 0 && c=='icost' ){
    r.tempTen=parseFloat(r.tempTen) > 0?0 - (Math.abs(parseFloat(r.tempTen))):Math.abs(r.tempTen)
    r.icost=r.tempNine
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
  if (hasBlank(r.itaxrate) && !hasBlank(h.xsRate)){
    r.itaxrate = parseFloat(h.xsRate).toFixed(4)
  }else {
    r.itaxrate = parseFloat(r.itaxrate || 0 ).toFixed(4)
  }
  switch (c) {
    case 'batchId':
      slChange0(r)
      break;
    case 'cwhcode':
      let cangkuInfo = ckListOptions.value.filter(it => it.id == r.cwhcode)[0]
      if (null != cangkuInfo) {
        if (cangkuInfo.ckIsDuli == '1') {
          r['cwhcodeText'] = cangkuInfo.ckName
        }
      }
      break;
    case 'cinvode':
      if (chFocus.value == 'two') r.cinvodeName = r.tempEleven
      if (chFocus.value == 'three') r.cinvodeBarcode = r.tempThree
      chChange(r)
      break;
    case 'baseQuantity':
    case 'price':
      if (!hasBlank(r.cnumber) && !hasBlank(r.price)) {
        let n = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(10)
        r.icost = (n * d).toFixed(4) + ''
        r.tempTen = r.icost
      }
      slChange(r,c)
      break;
    case 'icost':
      if (!hasBlank(r.cnumber) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(10)
        let d = parseFloat(r.icost).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.tempTen = d + ''
        r.cnumber = (d / n).toFixed(10) + ''
        slChange(r, c)
      }
      break;
    case 'cnumber':
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo?.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'price')
      }
      else{
        slChange0(r)
      }
      //重置批号 无税单价 无税金额 生产日期 失效日期
      r.batchId = ''
      r.dpdate = ''
      r.dvdate = ''
      r.price = '0'
      r.Nine = '0'
      r.icost = '0'
      r.tempTen = '0'
      break;
  }
  return r;
}
const slChange = (r,c) => {
  if (r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let one =  parseFloat((n/parseFloat(list[1].conversionRate))).toFixed(10)
      let two =  null != list[2]?parseFloat((n/parseFloat(list[2].conversionRate))).toFixed(10):0
      if (isnum){ //取整数}
        r.baseQuantity = NumberTool.toCeil(n,2)+''
        r.subQuantity1 = NumberTool.toCeil(one,2)+''
        r.subQuantity2 = NumberTool.toCeil(two,2)+''
      }else {
        r.subQuantity1 = one+''
        r.subQuantity2 = two+''
      }
    }else {
      r.subQuantity1 = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
    }
  }else {
    r.subQuantity1 = "0.0000000000"
    r.subQuantity2 = "0.0000000000"
  }
}
const slChange0 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    list=list.filter(jl=>!hasBlank(jl.unitName))
    if (list.length > 0){
      let conversionRate=list.filter(a=>a.id==r.cgUnitId)[0]?.conversionRate
      r.baseQuantity=parseFloat(r.tempCnumber)*parseFloat(conversionRate)
      r.tempSix=r.baseQuantity
      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1:any=0
      let conversionRate2:any=0
      if(list.length==2){
        conversionRate1=list[1]?.conversionRate
      }else if(list.length==3){
        conversionRate1=list[1]?.conversionRate
        conversionRate2=list[2]?.conversionRate
      }
      let one:any =  parseFloat(String(n/parseFloat(conversionRate1))).toFixed(10)
      let two:any =  list.length==3?parseFloat(String(n/parseFloat(conversionRate2))).toFixed(10):null
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
    }
    else{
      r.baseQuantity = "0.0000000000"
      r.subQuantity1 = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
      r.tempSix = r.subQuantity1
      r.tempSubQuantity2 = r.subQuantity2
      r.tempSubQuantity2 = r.baseQuantity
    }
    tableDataChange(r,'taxprice')
  }
}
const chChange = (record) => {
  findByUnitList(record)
  // 校验现存量
  verifyRowXCLData(record)

}
const findByUnitList = async (record) => {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.unitList=[]
  record.cinvodeInfo = o
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockUnitId // 主计量
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  record.isIndate = o?.stockIndateManage == '1' // 有效期必须输入
  if (o?.stockMeasurementType == '多计量' && !hasBlank(o?.stockMeasurementUnit)){
    let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        if(!hasBlank(o?.stockUnitName)){
          let conversionRate= list.filter(j=>j.unitName==o?.stockUnitName)[0]?.conversionRate
          record.unitList=[{title:o?.stockUnitName,value:o?.stockUnitId,ggxh:o?.stockGgxh,txm:o?.stockBarcode,conversionRate:conversionRate}]
        }
        else{
          // 可能是之前的存货档案,也可能是导入进来的
          let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
          if (res != null){
            let list = JsonTool.parseObj(res.detail) || []
            list=list.filter(jl=>!hasBlank(jl.unitName))
            for (let i = 0; i < list.length; i++) {
              if(i==0){
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
              }else{
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:'',txm:''})
              }
            }
            record.cgUnitId=record.unitList[0].value
            record.tempCgUnitId=record.cgUnitId
          }
        }
        if (list.length ==2) {
          record.cunitidF1 = list[1].id
          record.rate1 = list[1].conversionRate
          if (!hasBlank(o?.stockUnitName1)) {
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
          }
        } else if (list.length ==3){
          record.cunitidF1 = list[1].id
          record.cunitidF2 = list[2].id
          record.rate1 = list[1]?.conversionRate
          record.rate2 = list[2]?.conversionRate
          if(!hasBlank(o?.stockUnitName2)){
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
            record.unitList.push({title:o?.stockUnitName2,value:o?.stockUnitId2,ggxh:o?.stockUnitGgxh2,txm:o?.stockUnitBarcode2,conversionRate:list[2].conversionRate})
          }
        }
      }
    }
  }else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: dynamicTenantId})('')
    if(djl.length>0){
      let djlData=djl.filter(a=>a.id==o?.stockMeasurementUnit)[0]
      record.unitList.push({title:djlData?.unitName,value:djlData?.id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
      record.tempCgUnitId=djlData?.id
      record.cgUnitId=record.tempCgUnitId
    }
  }

  if(record.unitList.length>0){
    // 存货档案中采购单位
    if(hasBlank(record.cinvodeInfo.stockPurchaseUnit)){
      record.cgUnitId=record.unitList[0].value
    } else{
      let data=record.unitList.filter(a=>a.value==record.cinvodeInfo.stockPurchaseUnit)[0]
      record.cinvodeType = data?.ggxh // 规格型号
      record.bcheck1 = data?.txm // 条形码
      record.cgUnitId=record.cinvodeInfo.stockPurchaseUnit
    }
    record.tempCgUnitId=record.cgUnitId
  }
  if (!record.isBatch) getCurrPrice(record)
}
const outBefore = () => {
  if (status.value != 3){
    createConfirm({
      iconType: 'warning',
      title: '编辑中',
      content: '当前正在处于编辑,退出编辑将丢失,您确定要继续进行吗？',
      onOk: async () => {
        if(!hasBlank(taskInfo.value)){ tempTaskDel(taskInfo.value?.id) }
        // 删除参照任务锁定表
        if(referTaskList.value.length>0){
          for (let i = 0; i < referTaskList.value.length; i++) {
            tempTaskDel(referTaskList.value[i].id)
          }
        }
        // 调整数据库 列参数
        closeCurrent()
      },
      onCancel: async () => {

      }
    });
  } else {
    closeCurrent()
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
  //
  if(hasBlank(formFuns.value.getFormValue().cwhcode)||hasBlank(formFuns.value.getFormValue().cwhcoderk)){
    return message.error('调入调出仓库不能为空!!')
  }
  if(formFuns.value.getFormValue().cwhcode == formFuns.value.getFormValue().cwhcoderk){
    return message.error('调入调出仓库不能相同!!')
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

  // 查找下一个
  let list = getDataSource();
  let filters = ['isGive', 'bcheck', 'cinvodeType', 'cunitid', 'xcl','baseQuantity','cinvodeName','cinvodeBarcode', 'dvdate', 'dpdate', 'itaxprice','availability','price','icost']
  // 要求填批号才填写
  if (!r.isBatch)filters.push('batchId')
  if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
  let cols:any = getColumns().filter(it=>it?.title!='序号' &&  filters.indexOf(it?.dataIndex) == -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC:any = cols[0]?.dataIndex // 获取下一个列位置
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
      r[`temp${nextMark}`] = r[`${nextC}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`temp${nextMark}`] = list[index][`${nextC}`];
      setTableData(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model = {
    cnumber:'Cnumber',
    cgUnitId:'CgUnitId',
    cwhcode:'One',
    cinvode:'Two',
    price:'Nine',
    icost:'Ten',
    batchId:'Twelve',
    dpdate:'Dpdate',
    dvdate:'Fifteen',
    cmemo:'Thirteen',
    baseQuantity: 'Six'
  }
  if (b) {
    // 获取下一个
    let keys = Object.keys(model)
    return model[keys[keys.findIndex(k => k == c) + 1]]
  } else {
    return model[c]
  }
}
const pageSearch = async (v) => {
  if (searchList.value.length == 0) searchList.value = getDataSource().filter(it => it.key != null && it.ccode != null);
  let newList = hasBlank(v) ? searchList.value : searchList.value.filter(it => it.cinvode.indexOf(v) != -1 || it.cinvodeName.indexOf(v) != -1)
  let len = newList.length
  for (let i = len; i < 50; i++) {
    newList.push({})
  }
  setTableData(newList)
}
// 查看下游数据
function xySourcePop() {
  if (hasBlank(formItems.value.ccode)){
    message.info('暂未发现任何单据！')
  }else {
    openXySourcePage(true, {
      database: dynamicTenantId.value, type: 'DBD',code: formItems.value.ccode,datas: {ck:ckListOptions.value,ji:jiList.value,many:manyJiList.value}
    })
  }
}
// 查看下游数据
function lySourcePop() {
  if (hasBlank(formItems.value.ccode)){
     message.info('暂未发现任何单据！')
  }else {
    openLySourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'DBD',datas: {ck:ckListOptions.value,ji:jiList.value,many:manyJiList.value}
    })
  }
}
function formatData(data:any){
  let str = ""
  if(data != null){
    // 千分位保留2位小数
    var source = String(data).split("."); //按小数点分成2部分
    source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
    str = source.join("." );//再将小数部分合并进来
  }
  return str;
}

const exportExcelNow = async () => {
  const data = JSON.parse(JSON.stringify(getDataSource()))
  const columns = getColumns().filter(a=>a.ifShow == true)
  columns.splice(0,1);
  //筛选条件
  const title = [
    "单号: "+ formItems.value.ccode  +"   调拨日期："+formItems.value.ddate +"   调出仓库："+  formItems.value.cwhcode +"   调入仓库："+  formItems.value.cwhcoderk   +"  状态：已审核 ",
  ]

  for (let i = 0; i < 6; i++) {
    title.push('')
  }

  //根据columns 格式化导出excel数据
  const multiHeader = [[],[]]
  const keys = []
  const merges = []
  const cellStyle = [
    {
      cell: 'A1',
      font: {
        sz: 16,
        color: { rgb: "000000" },
        bold: true,
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      },
    },
    {
      cell: 'A2',
      font: {
        sz: 12,
        color: { rgb: "000000" },
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      },
    },
  ]
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let flg = 0;
  columns.forEach((v,index)=>{
    multiHeader[0].push(v.title)
    multiHeader[1].push('')
    keys.push(v.dataIndex)
    //合并上下单元格
    merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
    flg = flg + 1
  })

  //数量金额格式化调整
  let fdata = data.filter(v=> v.id != null)
  fdata.forEach(v=>{

    v.cunitidF1 = formatCunitid(v.rate1,v.fnames1)
    v.cunitidF2 = formatCunitid(v.rate2,v.fnames2)
    v.baseQuantity = v.bq != null ? money(v.bq) : money(v.baseQuantity)
    v.subQuantity1 = v.sq1 != null ? money(v.sq1) : money(v.subQuantity1)
    v.subQuantity2 = v.sq2 != null ? money(v.sq2) : money(v.subQuantity2)
    v.quantityUk = money(v.quantityPd - v.bq)
    v.quantityUk1 = money(v.subPandian1 - v.sq1)
    v.quantityUk2 = money(v.subPandian2 - v.sq2)
    v.quantityPd = money(v.quantityPd)
    v.subPandian1 = money(v.subPandian1)
    v.subPandian2 = money(v.subPandian2)
    v.cunitid = v.cunitidText
    v.batchId = v.batchId != null ? v.batchId : " "
    v.dpdate = v.dpdate != null ? v.dpdate : " "
    v.dvdate = v.dvdate != null ? v.dvdate : " "
    v.cmemo = v.cmemo != null ? v.cmemo : " "
    v.bcheck = v.bcheck != null ? v.bcheck : " "

  })
  //样式靠右列
  let rightrow=[]
  //样式靠左列
  let leftrow=[]
  rightrow=['C','D','F']
  const sheet =[
    {
      title: '调拨单',
      tHeader: title,
      multiHeader: multiHeader,
      table: fdata,
      keys: keys,
      merges: merges,
      sheetName: formItems.value.ccode,
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  let name = pageParameter.companyName
  exportExcel(sheet, 'xlsx',name+'-调拨单')
}
const formatUnit = (record) => {
  let str = " "
  if(record.cunitidType === '单计量'){
    str = record.cunitname
  }else{
    str = record.cunitnames
  }
  return str
}
const formatCunitid = (a,b) => {
  if(!a){
    return ''
  }
  return (a || '') +'*'+ (b || '')
}
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '2022',
    }
  })
}
import { Loading } from '/@/components/Loading';
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {Table as ATable} from "ant-design-vue/lib/components";
import {findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";
import {findByStockWarehLinecode, getPYRKDAndNoBcheck1} from "/@/api/record/system/stock-wareh";
import {verifyStockRowXCL, verifyStockXCLList} from "/@/api/record/stock/stock-currents";
import {findByStockNum2, singleUnitOfMea} from "/@/api/record/stock/stock";
import {getCkPriceList} from "/@/api/record/stock/stock_cost";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {findByStockAccId} from "/@/api/record/system/stock-account";
import {auditCheckBcheck} from "/@/api/record/stock/stock-xtzhd";

const loadingRef = ref(false);
const compState = reactive({
  absolute: false,
  loading: false,
  tip: '加载中...',
});
function openCompFullLoading() {
  openLoading(false);
}
function openLoading(absolute: boolean) {
  compState.absolute = absolute;
  compState.loading = true;
}
const userName = useUserStoreWidthOut().getUserInfo.username

const loadPrint = (obj) => {
  loadMark.value = true
  const data = getDataSource().filter(a=>!hasBlank(a.ccode))
  let printUser = ''
  let bcheck = ''
  let buname=hasBlank(formItems.value.buname)?'':formItems.value.buname
  if(obj.printUser){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  if(obj.bcheck){
    bcheck = '审核人：' + buname
  }

  let cmemo=hasBlank(formItems.value.cmemo)?'':formItems.value.cmemo

  let baseQuantity:any=0
  let subQuantity1:any=0
  let subQuantity2:any=0
  let price:any=0
  let icost:any=0

  let printList:any=[]
  data.forEach((item,index)=>{
    baseQuantity+=parseFloat(item.baseQuantity)
    subQuantity1+=parseFloat(item.subQuantity1)
    subQuantity2+=parseFloat(item.subQuantity2)
    price+=parseFloat(item.price)
    icost+=parseFloat(item.icost)

    let item1 = {}
    item1[0] = index+1
    item1[1] = setString(item.ccode,10 )
    item1[2] = setString(item.cwhcodeText,10 )
    item1[3] = setString(item.cinvodeName,10)

    item1[5] = toThousandFilter(item.baseQuantity)
    item1[4] = item.cinvodeType
    item1[5] = item.cunitidText
    item1[6] = toThousandFilter(item.baseQuantity)
    item1[6] = item.batchId

    item1[7] = toThousandFilter(item.price)
    item1[8] = toThousandFilter(item.icost)
    item1[9] = item.batchId
    item1[10] = item.dpdate
    item1[11] = item.dvdate
    item1[12] = item.bcheck
    item1[13] = item.cmemo
    printList.push(item1)
  })

  for (let i=0; i<printList.length%25; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    item1[3] = ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    item1[8] = ''
    item1[9] = ''
    item1[10] = ''
    item1[11] = ''
    item1[12] = ''
    item1[13] = ''
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/25)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['', '', '', '', '', '调拨单', '', '', '', '', '','',''],
        ['单据编号：'+formItems.value.ccode, '', '', '',  '单据日期：'+formItems.value.ddate, '', '', '','调出仓库：'+'', '', '',''+'调入仓库：'],
        ['业务部门：'+formItems.value.cwhcodeName, '', '', '',  '','','','业务员','','','','','备注：'+setString(cmemo,21)],
        ['序号', '存货编码', '存货名称', '规格型号', '主计量', '主数量', '批号','无税单价','无税金额','生产日期','失效日期','审核人','备注']],
      body: printList,
      styles: tableStyle(),
      margin: {
        left: 15,
        top: 20,
      },
      addPageContent: (data) => {
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        data.doc.setFontSize(9)
        data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          printUser,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          bcheck,
          data.cursor.x/2-25,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          data.cursor.x - 50,
          data.cursor.y + 3,
          0
        );
      },
      didParseCell(data) {
        data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 9
        data.cell.styles.lineColor = [150, 150, 150]

        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 5) {
            data.cell.colSpan = 4
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 8) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 13) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          }
        }
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 8) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 13) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          }
        }

        if (data.section == 'head' && data.row.index == 3) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [230, 230, 230]
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body'){
          if (data.row.index%2==1) {
            data.cell.styles.fillColor = [240,240,240]
          }
        }
      },
      columnStyles: {
        0: {maxHeight: 10,cellWidth: 25, halign: 'center'},
        1: {cellWidth: 55, halign: 'left'},
        2: {cellWidth: 55, halign: 'left'},
        3: {cellWidth: 60, halign: 'left'},
        4: {cellWidth: 40, halign: 'left'},
        5: {cellWidth: 35, halign: 'center'},
        6: {cellWidth: 45, halign: 'right'},
        7: {cellWidth: 40, halign: 'left'},
        8: {cellWidth: 40, halign: 'right'},
        9: {cellWidth: 40, halign: 'left'},
        10: {cellWidth: 55, halign: 'center'},
        11: {cellWidth: 55, halign: 'center'},
        12: {cellWidth: 45, halign: 'center'},
        13: {cellWidth: 50, halign: 'left'},
      }
    })
  })
}
//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = "";
  if(str){
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        strlen += 2;
      } else {
        strlen += 1.2;
      }
      s += str.charAt(i);
      if (strlen >= len) {
        return s+"...";
      }
    }
  }
  return s;
}
// 金额格式化
function money(val: any) {
  if (val == null) {
    val = '';
    return val;
  }
  if (isNaN(val)) {
    val = '';
    return val;
  }
  if (val == '0.00') {
    val = '';
    return val;
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    val = '0';
  }
  let fs = val.indexOf('-') != -1
  const sign = val === (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '') + (fs ? '-' : '') + val + '.' + cents;
}
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const summary = ref({})
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>!hasBlank(it.cinvode)))
  if (list.length == 0){
    summary.value = {}
    return false;
  }
  let squantity = 0
  let squantity1 = 0
  let squantity2 = 0
  let icost = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    squantity+=parseFloat(e['squantity'] || 0)
    squantity1+=parseFloat(e['squantity1'] || 0)
    squantity2+=parseFloat(e['squantity2'] || 0)
    icost+=parseFloat(e['icost'] || 0)
    //isum+=parseFloat(e['bcheckUser'] || 0)
  }
  summary.value={
    subQuantity: squantity,
    subQuantity1: squantity1,
    subQuantity2: squantity2,
    icost: icost,
  }
}

async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  //重置批号 无税单价 无税金额 生产日期 失效日期
  record.batchId = ''
  record.dpdate = ''
  record.dvdate = ''
  record.price = '0'
  record.Nine = '0'
  record.icost = '0'
  record.tempTen = '0'
  slChange0(record)
}

// 按行校验存货现存量
async function verifyRowXCLData(r) {
  // 入库保存修改现存量：0可用量  1查现存量 dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong'
  await useRouteApi(verifyStockRowXCL, {schemaName: dynamicTenantId})({
    queryType:'xcl',
    cinvode:r.cinvode,
    cwhcode:r.cwhcode,
    batchId:r.batchId,
    dpdate:'',
    dvdate:'',
    iyear:dynamicYear.value,
    rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
    ckBcheck:dynamicTenant.value.target?.kcXsckCheck})
    .then((t)=>{
      let conversionRate= r.unitList.filter(j=>j.value==r.cgUnitId)[0]?.conversionRate
      r.xcl=parseFloat(t/conversionRate).toFixed(2)
    })
}

async function verifyRowXCL(r) {
  // 入库保存修改现存量：0可用量  1查现存量 dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong'
  await useRouteApi(verifyStockRowXCL, {schemaName: dynamicTenantId})({
    queryType:'xcl',
    cinvode:r.cinvode,
    cwhcode:r.cwhcode,
    iyear:dynamicYear.value,
    rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
    ckBcheck:dynamicTenant.value.target?.kcXsckCheck})
    .then((t)=>{
      let conversionRate= r.unitList.filter(j=>j.value==r.cgUnitId)[0]?.conversionRate
      r.xcl=parseFloat(t/conversionRate).toFixed(2)
    })
}

// 按行校验存货现存量
async function verifyRowKylData(r) {
  // 入库保存修改现存量：0可用量  1查现存量 dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong'
  await useRouteApi(verifyStockRowXCL, {schemaName: dynamicTenantId})({
    queryType:'keyong',
    cinvode:r.cinvode,
    cwhcode:r.cwhcode,
    batchId:r.batchId,
    dpdate:'',
    dvdate:'',
    iyear:dynamicYear.value,
    rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
    ckBcheck:dynamicTenant.value.target?.kcXsckCheck})
    .then((t)=>{
      let conversionRate= r.unitList.filter(j=>j.value==r.cgUnitId)[0]?.conversionRate
      r.xcl=parseFloat(t/conversionRate).toFixed(2)
    })
}

const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}

const databaseCo=ref('')
const gotoPy = async () => {
  //验证数据完整性
  let d = await checkData(formFuns.value.getFormValue().ccode)
  if(!d){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(d.bcheck != '1'){
    message.error("未审核不能进行联查，请刷新页面后重试！")
    return
  }
  let dataBaseInfo=await findByStockAccId(dynamicTenantId.value.substring(0,dynamicTenantId.value.length-5))
  databaseCo.value=dataBaseInfo?.coCode
  await closeToFullPaths('/kc-transfer')
  await useRouteApi(findByXyCcode, {schemaName: dynamicTenantId})({ccode:formFuns.value.getFormValue().ccode,year: '2022',type:'QTRKD'})
    .then((t)=>{
      //获取下游表的信息
      setTimeout(()=>{
        router.push({path: 'kc-qtDepot',query: {type:'info',ccode:t,co: databaseCo.value}});
      },1000)
    })
}

const gotoPk = async () => {
  //验证数据完整性
  let d = await checkData(formFuns.value.getFormValue().ccode)
  if(!d){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(d.bcheck != '1'){
    message.error("未审核不能进行联查，请刷新页面后重试！")
    return
  }
  let dataBaseInfo=await findByStockAccId(dynamicTenantId.value.substring(0,dynamicTenantId.value.length-5))
  databaseCo.value=dataBaseInfo?.coCode
  await closeToFullPaths('/kc-transfer')
  await useRouteApi(findByXyCcode, {schemaName: dynamicTenantId})({ccode:formFuns.value.getFormValue().ccode,year: '2022',type:'QTCKD'})
    .then((t)=>{
      //获取下游表的信息
      setTimeout(()=>{
        router.push({path: 'kc-out-qtDepot',query: {type:'info',ccode:t,co: databaseCo.value}});
      },1000)
    })
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
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 100%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    display: block;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){

      width: calc( 100% - 64px);display: inline-block;
      :deep(.account-picker){
        .ap-title,.thisNameSpan{
          color: white !important;
        }
      }
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 43%;text-align: right;
    display: block;
    >div:nth-of-type(1){
      .actod-btn {
        color: @Global-Comm-BcOrText-Color;
        font-size: 14px;
        margin: 0 1px 0 0;
      }

      .actod-btn-last {
        border-right: 1px solid @Global-Border-Color;
      }

      .actod-btn:hover {
        background-color: @Global-Comm-BcOrText-Color;
        color: white;
        font-weight: bold;
        border: 1px solid white;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
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
          color: @Global-Comm-BcOrText-Color;
          margin-left: 2px;
        }
        .acttdrd-btn:hover{
          border-color: #ffffff;
          color: #ffffff;
          background-color: @Global-Comm-BcOrText-Color;
        }
      }
    }
  }
}
</style>
