<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199)">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" :readonly="status>1" :dataFun="accountPickerFuns" @reloadTable="dynamicAdReload"/></div>
      </div>
      <div></div>
      <div>
        <div>
            <Button class="actod-btn" @click="router.push('/kc-qtDepot-list')">查询</Button>
            <!-- 审核后的 -->
            <span v-if="stockWareData.bcheck=='1'">
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
              <Popover placement="bottom">
                <template #content>
                  <Button style="width: 120px;margin-bottom: 2px" >导入</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px">导出</Button><br/>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">
                  更多
                </Button>
              </Popover>
            </span>
            <!-- 未审核 -->
            <span v-else>
              <span v-if="status < 3">
                <Popover placement="bottom">
                  <template #content>
                    <Button style="width: 120px;margin-bottom: 2px" @click="openReferPop('JRJY')">借入借用单</Button><br/>
                    <Button style="width: 120px;margin-bottom: 2px">借入归还单</Button><br/>
                  </template>
                  <Button :disabled="ymPeriod" class="actod-btn">
                    参照
                  </Button>
                </Popover>
                <Button class="actod-btn" @click="saveData">保存</Button>
                <Button class="actod-btn" @click="giveUp">放弃</Button>
                <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
                <Button class="actod-btn" @click="tableDel">删行</Button>
              </span>
              <span v-else>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('edit')">修改</Button>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startDel">删除</Button>
                <Button :disabled="ymPeriod" class="actod-btn" v-if="formItems.bstyle=='其他入库'" @click="copyFun">复制</Button>
                <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
              </span>
            </span>
          <Popover placement="bottom">
            <template #content>
              <Button style="width: 120px;margin-bottom: 2px" @click="sySourcePop">来源单据</Button><br/>
<!--              <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>-->
            </template>
            <Button v-if="status ==3" class="actod-btn">联查</Button>
          </Popover>
            <Button class="actod-btn actod-btn-last" @click="closeCurrent(),giveUp(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <ReceiptSearch v-if="status==3" :default-data="searchData" :dynamic-tenant-id="dynamicTenantId" @toggle="toReceipt"/>
          </div>
          <div class="acttd-right-d-btns" v-if="status==3">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openPrint2">打印单据</Button>
                <br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="toPrintPage">模版设置</Button>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom" v-model:visible="visible3">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnData" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
            <Popover placement="bottom"><!-- v-if="status != 3" -->
              <template #content>
                <span class="group-btn-span-special2" @click="titleValue = 0;contentSwitch('tail','')" :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;蓝字单据&ensp;<CheckOutlined v-if="titleValue===0"/></span>
                <br/>
                <span class="group-btn-span-special2" @click="titleValue = 1;contentSwitch('tail','')" :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字单据&ensp;<CheckOutlined v-if="titleValue===1"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
          <div class="acttd-right-d-btns" v-else>
            <Button v-if="status<3" class="acttdrd-btn" @click="pageReload()">
              <BarcodeOutlined :style="{ fontSize: '20px',display:'inline-flex' }"/>
            </Button>
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
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: titleValue==0?'#0096c7':'#c0392b'}">{{ titleContents[titleValue] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns" :accId="dynamicTenantId" @open="openHeadSelectContent" :dynamicTenant="dynamicTenant" :isEdit="isEdit" :zzcxFlag="zzcxFlag" :cwhcodeEdit="cwhcodeEdit"/>
        </div>
      </div>
      <div class="acb-centent">
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(100 + (formRowNum*39))}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcode="{ record }">
            <template v-if="record.editOne&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
            <template v-if="record.editThree&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
            <template v-if="record.editTwo&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
            <template v-if="record.editEleven&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
          <template #cgUnitId="{ record }" >
            <template v-if="record.editCgUnitId&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @keyup.enter="focusNext(record,'cgUnitId')"
                @change="cgUnitIdChange(record);verifyRowXCLData(record)"
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
            <template v-if="record?.editCnumber&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
              <InputNumber v-model:value="record.tempCnumber"
                           class="cnumber"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'cnumber');"/>
              <CheckOutlined
                @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber');verifyRowXCLData(record)"/>
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
            <template v-if="record?.editItaxrate&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
            {{ (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
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
            {{
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
              <span v-if="titleValue==0">
                <Input v-model:value="record.tempTwelve"
                       style="width: 82%;" class="batchId"
                       @keyup.enter="focusNext(record,'batchId')"/>
                <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;verifyRowXCLData(record)"/>
              </span>
              <!-- 红字入库单 或者 发票 立账 -->
              <span v-if="titleValue==1">
                <Input v-model:value="record.tempTwelve"
                       style="width: 82%;" class="batchId" readonly
                       @keyup.enter="openSelectContent(record,'batchId')"/>
                <FileSearchOutlined @click="openSelectContent(record,'batchId')"/>
              </span>
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
            <template v-if="record?.editDpdate&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
            <template v-if="record?.editFifteen&&stockWareData.bstyle!=='调拨入库'&&stockWareData.bstyle!=='转换入库'&&stockWareData.bstyle!=='盘盈入库'">
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
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summary[cell.dataIndex]?'':summary[cell.dataIndex]}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      </div>
    </div>
    <Import @save="introduceData" @register="registerImportPage" />
    <Query @query="loadPage" @register="registerQueryPage" />
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>
    <SySource @register="registerSySourcePage"/>
    <Lack @register="registerLackPage"/>
    <BatchSelector @register="registerBatchSelectorPage" @throwData="batchSelectorData"/>
    <Refer @register="registerReferPage" @throwData="referData"/>

  </div>
</template>

<script setup="props, {emit}" lang="ts">
import moment from "moment";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popover,
  Radio,
  Select,
  Switch, Table,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import SySource from './popup/sySource.vue';
import Refer from './popup/refer.vue';
import Print from '/@/views/boozsoft/stock/stock-caigou-rk/popup/print.vue';
import DynamicForm from './component/DynamicForm.vue';
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import Lack from '/@/views/boozsoft/stock/stock_balance/popup/lack.vue';
import {
  FileSearchOutlined,
  BarcodeOutlined,
  CheckOutlined,
  CopyOutlined,
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
  VerticalRightOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock_other_add/component/DynamicForm";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {
  findAll as findAllJiLang,
  findUnitAssociationList,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  delRuKu, delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode,
  findBillByCondition,
  findBillCode,
  findByStockPeriodIsClose,
  findByStockWareRecentlySupMoney, findByWarSearch,
  findStockPeriodYmFlag,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveRuKu, verifyDataState,
  verifyXyCsourceByXyCode, xyCsourceSave,
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import dayjs from "dayjs";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave,
  stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {verifyStockRowXCL, verifyStockXCLList} from "/@/api/record/stock/stock-currents";
import {stockSupPriceFindBySupIdAndStockNum} from "/@/api/record/stock/stock_sup_price";
import {
  findByStockNum2,
  findByStockSupplierPrice,
  singleUnitOfMea
} from "/@/api/record/stock/stock";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {findByLikeEcName} from "/@/api/record/stock/shou-fa";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_other_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import {findByTakingsAndCwhcodeAndCinvode} from "/@/api/record/stock/stock_taking";
import BatchSelector from "/@/views/boozsoft/stock/stock-caigou-rk/popup/BatchNumberSelector.vue";
import {getCkPrice} from "/@/api/record/stock/stock_cost";
import {findByStockXCL} from "/@/api/record/stock/stock-kc-xcl";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
import {
  findAllByCcodeAndBillStyle,
  getPYRKDAndNoBcheck1,
  stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import {
  findByStockBorrowCcode,
  findByStockBorrowTableCcode,
  findByStockBorrowTableLineCode,
  saveStockBorrowMxPojoList
} from "/@/api/record/stock/stock-borrow";
import {deleteByCcodeAndXyccode, stockXyBorrowSave} from "/@/api/record/stock/stock-borrow-xy";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const [registerLackPage, {openModal: openLackPage}] = useModal()

const route = useRoute();
const windowHeight = (window.innerHeight - 300)
const dynamicTenant:any = ref('')
const dynamicTenantId = ref('')
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['其他入库单', '其他入库单', '其他入库单']
const titleValue = ref(0)
const formRowNum = ref(1)
const tempType =  ref('')
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'QTRKD'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const userList = ref([])
const proList = ref([])
const custList = ref([])
const supList = ref([])
const operatorList = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const routeData:any = route.query;
const stockWareData:any = ref('')
const ymPeriod:any = ref(false)
const summary = ref({})
const routeDataObj:any = ref('')
// 任务
const taskInfo:any = ref('')
const isEdit =  ref(false)
const canzhao =  ref(false)
const cwhcodeEdit =  ref(false)
const referTaskList:any = ref([])
// 来源单据 是 组装拆卸单
const zzcxFlag=ref(false)


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

const visible3:any = ref(false)
// 1发票或0到货 立账
const apSourceFlag:any = ref('')
const dynamicAdReload = async (obj) => {
  console.log('当前时间：'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
  dynamicTenant.value = obj
  apSourceFlag.value = obj.target.apSourceFlag
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  searchData.value.year = obj.stockYear
  lanMuData.value.accId=obj.accountMode
  stockWareData.value=''
  visible3.value = true
  await columnReload()
  await reloadList()
  lanMuData.value.changeNumber+=1
}
// 获取单据信息
async function findStockWareByCcodeData(ccode) {
  stockWareData.value=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(ccode)
}
const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
// 跳转
const pageReload = async () => {
  stockWareData.value=''
  loadMark.value=true
  if(routeData.ccode!==undefined){
    if (!hasBlank(routeData.co) && dynamicTenant.value?.coCode !=routeData.co){
      accountPickerFuns.value.resetCoCode(routeData.co)
      return false
    }
  }

  if(routeData.type=='add'&&!hasBlank(routeData.ccode)){
    canzhao.value=true
    isEdit.value=true
    cwhcodeEdit.value=true
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    // 来源单据信息
    let tempRouteData=JsonTool.parseObj(routeData.ccode)
    routeDataObj.value=JsonTool.parseObj(routeData.ccode)

    let bstyle:any='借入入库'
    if(!hasBlank(tempRouteData?.adStyle)&&tempRouteData?.adStyle=='CX'){
      bstyle='拆卸入库'
      zzcxFlag.value=true
    }else if(!hasBlank(tempRouteData?.adStyle)&&tempRouteData?.adStyle=='ZZ'){
      bstyle='组装入库'
      zzcxFlag.value=true
    }

    status.value = 1
    stockWareData.value=''
    // 获取最新
    formItems.value = {
      ddate: useCompanyOperateStoreWidthOut().getLoginDate,
      ccode: code,
      bstyle: bstyle,
      cmemo: tempRouteData.cmemo,
      unitType: tempRouteData.unitType,
      unitValue: tempRouteData.unitValue,
      cdepcode: tempRouteData.cdepcode,
      cpersoncode: tempRouteData.cpersoncode,
    }
    formFuns.value.setFormValue({
      ddate: useCompanyOperateStoreWidthOut().getLoginDate,
      ccode: code,
      bstyle: bstyle,
      cmemo: tempRouteData.cmemo,
      unitType: tempRouteData.unitType,
      unitValue: tempRouteData.unitValue,
      cdepcode: tempRouteData.cdepcode,
      cpersoncode: tempRouteData.cpersoncode,
    })
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']

    let list = JsonTool.parseObj(tempRouteData.entryList).map(it => resetRow(it))
    // 查找级别档案名称
    for (let i = 0; i < list.length; i++) {
      findByUnitList(list[i])
      if(hasBlank(list[i].cwhcodeText)){
        list[i].cwhcodeText=await getCKName(list[i].cwhcode)
        list[i].feiyongMoney=tempRouteData.feiyongJe
      }
    }
    let len = list.length
    for (let i = 0; i < (50 - len); i++) { list.push({}) }
    setTimeout(()=>{
      setTableData(list)
      loadMark.value=false
    },300)
  }else if(routeData.type=='info'&&!hasBlank(routeData.ccode)){
    await contentSwitch('tail',routeData.ccode)
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr','')
  }
  calculateTotal()
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    supList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']
    custList.value = formFuns.value.getSelectMap()['cust']
    proList.value = formFuns.value.getSelectMap()['project']
  })
}
const cmakerTime=ref('')
async function contentSwitch(action,ccode) {
  stockWareData.value=''
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    bdocumStyle: titleValue.value,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    if(!hasBlank(res.sourcetype)){
      canzhao.value=true
    }

    findStockWareByCcodeData(res.ccode)
    countStockPeriodYmFlag(res.iyear,'1')
    formItems.value = JsonTool.parseProxy(res)
    cmakerTime.value=formItems.value.cmakerTime
    if(hasBlank(cmakerTime.value)){
      cmakerTime.value=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    }

    res.entryList = null
    formFuns.value.setFormValue(res)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        if(hasBlank(list[i].cwhcodeText)){
          list[i].cwhcodeText=await getCKName(list[i].cwhcode)
        }
        list[i].unitList=[]
        let stock=await useRouteApi(findByStockNum2, {schemaName: dynamicTenantId})(list[i].cinvode)
        // 查询计量明细
        let res:any =  manyJiList.value.filter(it=>it.id == stock?.stockMeasurementUnit)[0]
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
      for (let i = 0; i < (50 - len); i++) {
        list.push({})
      }
      setTableData(list)
      calculateTotal()
    }
    formItems.value.entryList = null
  } else {
    let list:any=[]
    for (let i = 0; i < 50; i++) {
      list.push({})
    }
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
    message.success('暂无数据！')
  }
  loadMark.value = false
  visible3.value = false
}
const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>!hasBlank(it.cinvode)))
  if (list.length == 0){
    summary.value = {}
    return false;
  }
  let cnumber = 0
  let icost = 0
  let isum = 0
  let itaxprice = 0
  let feiyongMoney = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber+=parseFloat(e['cnumber'] || 0)
    icost+=parseFloat(e['icost'] || 0)
    isum+=parseFloat(e['isum'] || 0)
    itaxprice+=parseFloat(e['itaxprice'] || 0)
    feiyongMoney+=parseFloat(e['feiyongMoney'] || 0)
  }
  summary.value={
    cnumber: cnumber==0?null:parseFloat(cnumber).toFixed(2),
    icost: icost==0?null:toThousandFilter(icost),
    isum: isum==0?null:toThousandFilter(isum),
    itaxprice: itaxprice==0?null:toThousandFilter(itaxprice),
    feiyongMoney: feiyongMoney==0?null:toThousandFilter(feiyongMoney),
  }
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
    },{
      title: '计量单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
      width: 120
    },{
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
      width: 100
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
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
    // {
    //   title: '费用分摊金额',
    //   dataIndex: 'feiyongMoney',
    //   slots: {customRender: 'feiyongMoney'},
    //   ellipsis: true,
    //   width: 120,
    //   align: 'right'
    // },
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
    }
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
  pagination: false,
})

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

async function findBySearch(val) {
  loadMark.value = true
  let bySearchData=await useRouteApi(findByWarSearch, {schemaName: dynamicTenantId})({billStyle: 'QTRKD',ccode:val})
  if(!hasBlank(bySearchData)){
    await contentSwitch('tail',bySearchData.ccode)
  }
  else{
    message.error('没有对应的单据！')
    loadMark.value = false
  }
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
const rowDelData:any=ref([])
const tableDel = async () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list:any = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])

    // 修改状态下删除行
    if(status.value==2){
      rowDelData.value.push(list.filter(it => it.key === tableSelectedRowKeys.value[0]))
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

function setNewColunm() {
  let c:any=getColumns()
  if(titleValue.value==1){
    // 入库保存修改现存量：0可用量  1查现存量
    console.log('入库保存修改现存量：0可用量  1查现存量=='+dynamicTenant.value.target?.kcCgrkCheck)
    if(dynamicTenant.value.target?.kcCgrkCheck=='1'){
      if(c.filter(col=>col.title=='现存量').length==0){
        c.splice(c.map(a=>a.dataIndex).indexOf('cnumber'),0,{dataIndex: "showNumber",ifShow: true,key: "showNumber",pkey: undefined,title: "现存量",width: 100})
      }
    }else{
      if(c.filter(col=>col.title=='可用量').length==0){
        c.splice(c.map(a=>a.dataIndex).indexOf('cnumber'),0,{dataIndex: "showNumber",ifShow: true,key: "showNumber",pkey: undefined,title: "可用量",width: 100})
      }
    }
    setColumns(c)
  }else{
    let newA = JSON.parse(JSON.stringify(CrudApi.columns))
    newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
    setColumns(newA)
    initTableWidth(newA)
  }
}
const startEdit = async (type) => {
  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      message.error('单据日期已结账！')
    },1000)
  }

  let maxR = 50
  if (type === 'add') {
    // 修改列
    setNewColunm()
    isEdit.value=false
    status.value = 1
    stockWareData.value=''
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    formItems.value = {
      ddate: useCompanyOperateStoreWidthOut().getLoginDate,
      ccode: code,
      bstyle: '其他入库',
    }
    formFuns.value.setFormValue({
      ddate: useCompanyOperateStoreWidthOut().getLoginDate,
      ccode: code,
      bstyle: '其他入库',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    tempTaskSave('新增')
    setTableData(list)
  }
  else {
    if(formItems.value.ccode==undefined){return }
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      return message.error("单据已发生变化,请刷新当前单据！")
    }

    loadMark.value=true
    isEdit.value=stockWareData.value.bstyle=='其他入库'?false:true
    if(stockWareData.value.bstyle=='组装入库'||stockWareData.value.bstyle=='拆卸入库'){
      zzcxFlag.value=true
    }
    let rukuMainData=await useRouteApi(verifyXyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,code:formItems.value.ccode,xyCode:'QTRKD'})
    if(rukuMainData!=='' ){
      message.error('已经生成采购入库单【编码'+rukuMainData.xyccode+'】,不能变更！')
      return false;
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'其他入库单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'其他入库单,不能同时进行操作！' });
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
    loadMark.value=false
  }

}
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'其他入库单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: "QTRKD",
    date: date,
    prefix: "",key: '3-13'
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
    loadMark.value=true
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      loadMark.value=false
      return message.error("单据已发生变化,请刷新当前单据！")
    }

    if(stockWareData.value.bstyle=='调拨入库'||stockWareData.value.bstyle=='转换入库'||stockWareData.value.bstyle=='盘盈入库'){
      loadMark.value=false
      message.error('当前单据由关联单据生成,不能直接删除单据，弃审来源单据时将自动删除！')
      return false
    }
    if(formItems.value.bcheck=='1'){
      loadMark.value=false
      message.error('其他入库单已经审核，不能删除，请弃审单据后重试！')
      return false
    }
    // 有无 整理现存量 任务
    let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
    if(!hasBlank(xclTaskData)){
      loadMark.value=false
      return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
    }
    // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
    if(!hasBlank(jzMethod)){
      loadMark.value=false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }

    let dataList = getDataSource().filter(it => !hasBlank(it.cwhcode))
    let verifylist:any=[]
    for (let i = 0; i < dataList.length; i++) {
      let tx=dataList[i]
      let temp2:any={}
      temp2.iyear=tx.iyear
      temp2.stockNum=tx.cinvode
      temp2.stockName=tx.cinvodeName
      temp2.stockGgxh=tx.bcheck1
      temp2.cwhcode=tx.stockCangkuId
      temp2.batchId=tx.batchNumber
      temp2.dpdate=tx.dpdate
      temp2.dvdate=tx.dvdate
      temp2.baseQuantity=tx.baseQuantity
      temp2.lackBaseQuantity=''
      temp2.unitName=tx.unitList.filter(uni=>uni.value==tx.cgUnitId)[0]?.title
      verifylist.push(temp2)
    }

    // 只有蓝字单据判断现存量
    if(titleValue.value==0&&formItems.value.bstyle=='其他入库'){
      // 现存量不足 不足 弹出框提示
      let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
      // 如果是负数强制转换成正数比较
      currData=currData.filter(c=>Math.abs(parseFloat(c.lackBaseQuantity))<0)
      if(currData.length>0){
        loadMark.value=false
        return  openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:dynamicTenantId.value})
      }
    }


    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '其他入库单删除',
      content: '您确定要进行其他入库单删除吗!',
      onOk: async () => {
        for (let i = 0; i < dataList.length; i++) {
          if(formItems.value.bstyle=='借入入库'){
            let sourceTableData=await useRouteApi(findByStockBorrowTableLineCode,{ schemaName: dynamicTenantId })({linCode:dataList[i].sourcedetailId})
            sourceTableData.rukuSum=parseFloat(sourceTableData.rukuSum)-parseFloat(dataList[i].baseQuantity)
            await useRouteApi(saveStockBorrowMxPojoList,{ schemaName: dynamicTenantId })([sourceTableData])
            // 下游表
            await useRouteApi(deleteByCcodeAndXyccode,{ schemaName: dynamicTenantId })({ccode:dataList[i].sourcecode,xyccode:formItems.value.ccode})
          }else{
            // 下游表
            await useRouteApi(delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode, {schemaName: dynamicTenantId})({xyccode:formItems.value.ccode,xybillStyle:'QTRKD',billStyle:dataList[i].sourcetype,ccode:dataList[i].sourcecode})
          }
        }
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        tempTaskDel(taskInfo.value?.id)
        saveLogData('删除')
        message.success('删除成功！')
        formItems.value.czId = ''
        loadMark.value=false
        await contentSwitch('tail','')
      }
      ,onCancel: () => {
        loadMark.value=false
        tempTaskDel(taskInfo.value?.id)
        return false
      }
    });
  }
}

const startReview = async (b) => {
  loadMark.value=true
  // 执行操作前判断单据是否存在
  let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
  if(hasBlank(msg)){
    loadMark.value=false
    return message.error("单据已发生变化,请刷新当前单据！")
  }
  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    loadMark.value=false
    return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    loadMark.value=false
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }

  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: titleValue.value,
    curr: ''
  })

  // 判断盘点单
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  let verifylist:any=[]
  for (let i = 0; i < list.length; i++) {
    let t=list[i]
    let temp=await useRouteApi(getPYRKDAndNoBcheck1, {schemaName: dynamicTenantId})(t.iyear)
    if(temp.length>0){
      loadMark.value=false
      message.error('存货盘点锁定中，不能审核或弃审当前单据，请确认盘点业务结束后再试！')
      return false
    }

    let temp2:any={}
    temp2.iyear=list[i].iyear
    temp2.stockNum=list[i].cinvode
    temp2.stockName=list[i].cinvodeName
    temp2.stockGgxh=list[i].bcheck1
    temp2.cwhcode=list[i].cwhcode
    temp2.batchId=list[i].batchId
    temp2.dpdate=list[i].dpdate
    temp2.dvdate=list[i].dvdate
    temp2.baseQuantity=list[i].baseQuantity
    temp2.lackBaseQuantity=''
    temp2.unitName=list[i].unitList.filter(uni=>uni.value==list[i].cgUnitId)[0]?.title
    verifylist.push(temp2)
  }

  // 红字或者 弃审
  if(titleValue.value==1&&b){
    // 现存量不足 弹出框提示
    let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
    // 如果是负数强制转换成正数比较
    currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData.length>0){
      return openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:dynamicTenantId.value})
    }
  }
  else if(formItems.value.bstyle=='其他入库单' && !b){
    // 现存量不足 弹出框提示
    let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
    // 如果是负数强制转换成正数比较
    currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData.length>0){
      return openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:dynamicTenantId.value})
    }
  }


  tempTaskSave('审核')
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
    tempTaskDel(taskInfo.value?.id)
    saveLogData('审核')
    message.success(`${b?'审核':'弃审'}成功！`)
    pageParameter.type='QTRKD'
    loadMark.value=false
    await contentSwitch('curr','')
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
  // 组装拆卸单生成 走下边判断
  if(routeDataObj.value.unitValue=='组装拆卸单生成'){
    let cinvodeArr=list.map(tx=>tx.cinvode)
    for (let i = 0; i < cinvodeArr.length; i++) {
      let cnumberTotal=sumArr(list.filter(tx=>tx.cinvode==cinvodeArr[i]).map(tx=>tx.cnumber))
      let resouceCnumberTotal=sumArr(JSON.parse(routeDataObj.value.oldlist).filter(tx=>tx.cinvode==cinvodeArr[i]).map(tx=>tx.cnumber))
      if(parseFloat(cnumberTotal)!==parseFloat(resouceCnumberTotal)){
        createErrorModal({
          iconType: 'warning',
          title: '温馨提示',
          content: '存货【'+cinvodeArr[i]+'】总数量与来源单据总数量不相等,不能保存！'
        })
        return false
      }
    }
  }

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据时间不能为空！'
    })
    return false
  }
  if (hasBlank(form.unitType)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据类型不能为空！'
    })
    return false
  }
  if (hasBlank(trim(form.unitValue))) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '业务单位不能为空！'
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
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和无税金额为必填项,请补充完整!'
    })
    return false
  }
  else{
    let price= list.filter(it =>it.tempNine==null&&it.price==null)
    if(price.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+price.map(a=>a.cinvode)+'】无税单价不能为空！'
      })
      return false
    }
    let icost= list.filter(it =>it.tempTen==null&&it.icost==null)
    if(icost.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+icost.map(a=>a.cinvode)+'】无税金额不能为空！'
      })
      return false
    }
    let temp= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && (hasBlank(trim(it.tempTwelve))&&hasBlank(trim(it.batchId))))
    if(temp.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+temp.map(a=>a.cinvode)+'】批号为必填项！'
      })
      return false
    }
    let temp2= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && it.cinvodeInfo?.stockIndateManage=='1' && (hasBlank(it.tempFifteen)&&hasBlank(it.dvdate)) && (hasBlank(it.tempDpdate)&&hasBlank(it.dpdate)))
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
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  formItems.value.cmakerTime=!hasBlank(cmakerTime.value)?cmakerTime.value:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")

  getDataSource().forEach(a=>{
    if(hasBlank(a.cwhcode)&&!hasBlank(a.cinvode)){
      a.cwhcode=formItems.value.cwhcode
    }
  })

  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity))
  // let verifylist:any=[]
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    for (let i = 0; i < list.length; i++) {
      let o=list[i]
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''

      o['cwhcode1'] = o['cwhcode']
      if (o.cangkuDuli == '0'){
        let arr =  o['tempCangkuId']
        for (let j = 0; j < arr.split('\\').length; j++) {
          o[`cwhcode${j+1}`] = arr.split('\\')[j]
        }
      }
    }
    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null){
      formItems.value.ccode = await generateCode(formItems.value.ddate)
    }

    if(formItems.value.bstyle=='借入入库'){
      for (let i = 0; i < list.length; i++) {
        if(!hasBlank(list[i].sourcecode)){
          // 查询来源 主表
          let sourceData=await useRouteApi(findByStockBorrowTableCcode, {schemaName: dynamicTenantId})({ccode:list[i].sourcecode})
          // 查询来源 子表
          let sourceListData=await useRouteApi(findByStockBorrowCcode, {schemaName: dynamicTenantId})({ccode:list[i].sourcecode})

          let baseQuantitySum=list.filter(t=>t.cinvode==list[i].cinvode).map(tx=>parseFloat(tx.baseQuantity)).reduce((n,m)=>n+m)||0
          let resouceBaseQuantitySum=sourceListData.filter(t=>t.cinvode==list[i].cinvode).map(tx=>(tx.baseQuantity))
          let resouceRukuSum=sourceListData.filter(t=>t.cinvode==list[i].cinvode).map(tx=>(tx.rukuSum))
          let resouceResidueBaseQuantity=parseFloat(resouceBaseQuantitySum)-parseFloat(resouceRukuSum)
          if(parseFloat(baseQuantitySum)>parseFloat(resouceResidueBaseQuantity)){
            return message.error('表体数量不能超过来源单据数量与累计入库数量的差额')
          }

          let sourceFeiyongJe=sourceData.feiyongJe
          let icostSum=list.filter(t=>t.cinvode==list[i].cinvode).map(tx=>parseFloat(tx.icost)).reduce((n,m)=>n+m)||0
          if(parseFloat(sourceFeiyongJe)!=parseFloat(icostSum)){
            return message.error('无税金额总计 必须等于 来源单据费用分摊金额')
          }
        }

        let sourceTableData=await useRouteApi(findByStockBorrowTableLineCode,{ schemaName: dynamicTenantId })({linCode:list[i].sourcedetailId})
        if(status.value==1){
          sourceTableData.rukuSum=parseFloat(sourceTableData.rukuSum)+parseFloat(list[i].baseQuantity)
        }else{
          // 一元二次方程
          sourceTableData.rukuSum=parseFloat(sourceTableData.rukuSum)+(parseFloat(list[i].baseQuantity)-parseFloat(hasBlank(list[i].oldBaseQuantity)?0:list[i].oldBaseQuantity))
        }
        // 修改来源单据的子表 累计入库数量
        await useRouteApi(saveStockBorrowMxPojoList, {schemaName: dynamicTenantId})([sourceTableData])

        //只有新增状态，添加下游表
        if(status.value==1){
          // 添加下游表
          let xy={iyear:dynamicYear.value,billStyle:'JRJY',ccode:sourceTableData.ccode,xyBillStyle:'QTRKD',xyccode:formItems.value.ccode}
          await useRouteApi(stockXyBorrowSave, {schemaName: dynamicTenantId})(xy)
        }
      }
    }
    else if(formItems.value.bstyle=='拆卸入库' || formItems.value.bstyle=='组装入库'){
      // 添加下游表
      let xy={iyear:dynamicYear.value,billStyle:'ZZCXD',ccode:routeDataObj.value.ccode,ccodeDate:formItems.value.ddate,xyccodeDate:formItems.value.ddate,xyBillStyle:'QTRKD',xyccode:formItems.value.ccode}
      await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
    }

    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData(status.value==1?'新增':'修改')
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    await contentSwitch('tail',formItems.value.ccode)
    status.value = 3
  }
}
async function editStockCurrentRevison(map) {
  if(!hasBlank(map.id)){
    await useRouteApi(updateStockCurrentRevision,{schemaName: dynamicTenantId})(map)
  }
}
async function giveUp() {
  // 删除指定栏目
  setColumns(getColumns().filter(a=>{return a.dataIndex!='showNumber'} ))

  if (status.value == 1) {
    await contentSwitch('first','')
  } else if (status.value == 2) {
    await contentSwitch('curr','')
  }
  if(!hasBlank(taskInfo.value)){ tempTaskDel(taskInfo.value?.id) }
  // 删除参照任务锁定表
  if(referTaskList.value.length>0){
    for (let i = 0; i < referTaskList.value.length; i++) {
      tempTaskDel(referTaskList.value[i].id)
    }
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
  let arr:any = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
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
    let data:any = []
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
const visible = ref(false);
const windowWidth = (window.innerWidth - (70))
const totalColumnWidth = ref(0)
const dynamicColumnData = ref({value:[]})
const editableData = reactive({});
const tableRef:any = ref(null)
const lanMuData = ref({
  accId: 'postgres',
  menuName: '其他入库单',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  pageReload()
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
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
const [registerSySourcePage, {openModal: openSySourcePage}] = useModal()
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerBatchSelectorPage, {openModal: opneBatchSelectorPage}] = useModal();
const [registerReferPage, {openModal: openReferPage}] = useModal();

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
    case 'batchId':
      o.quantity=Math.abs(o.cnumber)
      o.unitId=o.cgUnitId

      opneBatchSelectorPage(true, {
        database: dynamicTenant.value,
        row: o,
        list: ckListOptions.value,
        kcCgrkCheck:hasBlank(dynamicTenant.value.target?.kcCgrkCheck)?'0':dynamicTenant.value.target?.kcCgrkCheck,
        rkBcheck:hasBlank(dynamicTenant.value.target?.kcCgrkCheck)?'0':dynamicTenant.value.target?.kcCgrkCheck,
        ckBcheck:hasBlank(dynamicTenant.value.target?.kcXsckCheck)?'0':dynamicTenant.value.target?.kcXsckCheck,
        bdocumStyle:titleValue.value,
        iyear:dynamicYear.value
      })
      break;
  }
}

const {openDeptModal,openPsnModal} =  useNcModals()
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
      openDeptModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cpersoncode':
      openPsnModal(dynamicTenant.value).then(res=>modalData(res))
      break;

  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['cinvodeInfo'] = o[0]
      thisEditObj.value['tempTwo'] = o[0].stockNum
      thisEditObj.value['tempEleven'] = o[0].stockName
      thisEditObj.value['bcheck1'] = o[0].stockBarcode
    } else {
      thisEditObj.value['tempOne'] = o[0].id
      thisEditObj.value['tempCangkuId'] = o[0].cangkuId
      thisEditObj.value['cwhcodeInfo'] = o[0]
      thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      thisEditObj.value['cangkuDuli'] = o[0].cangkuFlag
    }
    focusNext(thisEditObj.value,thisEditType.value)
  } else {
    let e:any = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    if(thisEditType.value == 'cvencode'){
      let cvencodeJslist=dynamicFormModel.value.filter(a=>a.field=='cvencodeJs')[0].list.filter(a=>a.uniqueCode==o[0]?.uniqueCodeCcus)
      e['cvencodeJs']=hasBlank(o[0]?.uniqueCodeCcus)?e['cvencode']:cvencodeJslist[0]?.id
    }else if(thisEditType.value=='cdepcode'){
      e['cdepcode']=o.uniqueCode
    }else if(thisEditType.value=='cpersoncode'){
      e['cpersoncode']=o.id
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
  if (record.cunitType == '0'){ //
    let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
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
    let res:any = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh=o?.stockGgxh;it.txm =o?.stockBarcode;return it;})
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
  calculateTotal()
  if(hasBlank(formFuns.value.getFormValue().cwhcode)){
    return message.error('表头仓库不能为空!!')
  }
  // 蓝字
  if(titleValue.value==0&&parseFloat(r.cnumber)<0){
    r.tempCnumber=Math.abs(r.cnumber)
    r.cnumber= r.tempCnumber
  }
  if(titleValue.value != 0 && c=='cnumber' ){
    r.tempCnumber=parseFloat(r.tempCnumber) > 0?0 - (Math.abs(parseFloat(r.tempCnumber))):r.tempCnumber
    r.cnumber=r.tempCnumber
  }else if(titleValue.value != 0 && c=='icost' ){
    r.tempTen=parseFloat(r.tempTen) > 0?0 - (Math.abs(parseFloat(r.tempTen))):r.tempTen
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
  r.itaxrate=isNaN(r.itaxrate)?null:r.itaxrate
  switch (c) {
    case 'cnumber':
      if (titleValue.value != 0 && parseFloat(r.cnumber) > 0) r.cnumber = 0 - (Math.abs(r.cnumber))
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'price')
      }
      else{
        slChange0(r)
      }
      break;
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
    case 'price':
      if (!hasBlank(r.cnumber) && !hasBlank(r.price)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        if (titleValue.value == 0 && n < 0) n = 0 - Math.abs(n)
        let d:any = parseFloat(r.price).toFixed(10)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        if (titleValue.value == 0 && d < 0) d = Math.abs(d)
        r.icost = parseFloat(String(n * d)).toFixed(4) + ''
        r.tempTen = r.icost
        r.price = Math.abs(d)

        // 含税单价
        let itaxrate=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        r.tempTaxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        // 价税合计
        r.isum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        r.tempIsum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;
    case 'icost':
      if (!hasBlank(r.cnumber) && !hasBlank(r.tempTen)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        if (titleValue.value == 0 && n < 0) n = Math.abs(n)
        let d:any = parseFloat(r.tempTen).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        if (titleValue.value == 0 && d < 0) d = Math.abs(d)
        r.icost = d
        r.tempTen =r.icost

        let price:any= parseFloat(String(d / parseFloat(n))).toFixed(10)
        r.price =Math.abs(price)
        r.tempNine=r.price
        // 含税单价
        let itaxrate=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        r.tempTaxprice=r.taxprice
        // 价税合计
        r.isum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        r.tempIsum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;// 无税金额
    case 'feiyongMoney':
      let n:any = hasBlank(r.feiyongMoney)?0:parseFloat(r.feiyongMoney).toFixed(10)
      if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
      if (titleValue.value == 0 && n < 0) n = Math.abs(n)
      r.feiyongMoney = n
      r.tempFeiyongMoney =r.feiyongMoney
      break;
    case 'itaxrate':// 税率 【itaxprice 税额】
      if(!hasBlank(r.cnumber) && !hasBlank(r.itaxrate)){
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
  }
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
  }
  else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: dynamicTenantId})('')
    if(djl.length>0){
      let djlData=djl.filter(a=>a.id==o?.stockMeasurementUnit)[0]
      record.unitList.push({title:djlData?.unitName,value:djlData?.id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
      record.tempCgUnitId=djlData?.id
      record.cgUnitId=record.tempCgUnitId
    }
  }
  if(record.unitList.length>0&&!isEdit.value){
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
}
const slChange0 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    list=list.filter(jl=>!hasBlank(jl.unitName))
    if (list.length > 0){
      let conversionRate=list.filter(a=>a.id==r.cgUnitId)[0]?.conversionRate
      r.baseQuantity=parseFloat(r.cnumber)*parseFloat(conversionRate)
      r.tempSix=r.baseQuantity

      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r?.unitInfo?.unitType == '2')
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
const chChange = async (record) => {
  findByUnitList(record)
  record.baseQuantity=null
  record.subQuantity1=null
  // 校验现存量
  verifyRowXCLData(record)
  await findByPrice(record)
}

const outBefore = () => {
  if (status.value != 3){
    createConfirm({
      iconType: 'warning',
      title: '编辑中',
      content: '当前正在处于编辑,退出编辑将丢失,您确定要继续进行吗？',
      onOk: async () => {
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
const {proxy} :any= getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  async (r, c) => {
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
    let filters:any = ['bcheck1','isGive','cinvodeType','cinvodeName','itaxprice','baseQuantity','cunitid','showNumber']
    // 要求填批号才填写
    if (!r.isBatch)filters.push('batchId')
    if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
    // 单计量跳过计量1、2
    // if (r.cunitType=='1')filters.push('subQuantity1'),filters.push('subQuantity2');
    let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1&& it.ifShow)
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
        r[`temp${nextMark}`] = r[`${nextC}`];
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
      let doms:any = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
      if (null != doms) doms.focus()
    })
  }
}
const getNextMark = (c,b) => {
  let model = {cnumber:'Cnumber',cgUnitId:'CgUnitId',cwhcode:'One',cinvode:'Two',price:'Nine',icost:'Ten',feiyongMoney:'FeiyongMoney',batchId:'Twelve',dpdate:'Dpdate',dvdate:'Fifteen',cmemo:'Thirteen',baseQuantity: 'Six'}
  return model[c]
}

async function findBySupPrice(data) {
  let cinvode=data.cinvode
  let cvencodeJs=formFuns.value.getFormValue().cvencodeJs
  let supPrice=await useRouteApi(stockSupPriceFindBySupIdAndStockNum, {schemaName: dynamicTenantId})({supId:cvencodeJs,stockNum:cinvode})
  let memberprice=supPrice!==''?supPrice.memberprice:null

  if(supPrice!==''){
    // 供应商价格表含税（默认值1是，0或空否）
    if(stockAccountObj.value.cgPriceIsRate=='1'){
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
    if(stockAccountObj.value.cgPriceZjyc=='1'){
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
    ccode:formItems.value.ccode
  })
}
// 查看上游数据
function sySourcePop() {
  openSySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}
function sumArr(arr) {
  return arr.reduce(function(prev, curr, idx, arr){
    return prev + curr;
  });
}
function openPrint2() {
  if (hasBlank(formItems.value.id)){
    message.info('暂未发现可打印单据！')
    return false;
  }
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '',
      mark:  router.currentRoute?.value?.fullPath.replace('/',''),
      pageName:'其他入库单'
    }
  })
}
const loadPrint = (obj) => {
  const dataArr = JsonTool.parseProxy(getDataSource().filter(it=>it.cinvode!=null))
  loadMark.value = true
  let etc = JsonTool.parseProxy(formItems.value)
  if (dataArr.length == 0) {
    loadMark.value = false
    return false;
  }else { // 数据处理
    etc.unitValue =etc.unitType=='etc'?etc.unitValue:etc.unitType=='cust'?getCustName(etc.unitValue):etc.unitType=='suplier'?getSupName(etc.unitValue):etc.unitType=='user'?getUserName(etc.unitValue):etc.unitType=='project'?getProName(etc.unitValue):''
    etc.unitType = getUnitType(etc.unitType)
    etc.cwhcode = ckListOptions.value.filter(it => it.id == etc.cwhcode)[0]?.ckName
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(formFuns.value.getSelectMap()['dept']?.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.cpersoncode = hasBlank(etc.cpersoncode)?'':getUserName(etc.cpersoncode)
    etc.cwhcodeUser = hasBlank(etc.cwhcodeUser)?'':getUserName(etc.cwhcodeUser)
    etc.bcheckUser = etc.bcheck == null?'': formatUniqueOperator(etc?.bcheckUser)
    etc.cmaker = formatUniqueOperator(etc?.cmaker)
    dataArr.forEach((item,index)=>{
      item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):ckListOptions.value.filter(it => it.id == item.cwhcode)[0]?.ckName
      item['cgUnitId'] = cunitFormat(item.unitList,item.cgUnitId)
      item['cnumber'] =  parseFloat(item.cnumber).toFixed(2)
      item['cunitid'] = cunitFormat(item.unitList,item.cunitid)
      item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
      item['price'] =  parseFloat(item.price).toFixed(2)
      item['icost'] = parseFloat(item.icost).toFixed(2)
      item['isGive'] = item['isGive']?'是':'否'
    })
  }
  let type = obj.template
  let maxRowLen = obj.rowNumber
  let dateModel = dataModelBuildingTwoData(dataArr,etc,maxRowLen,obj.list)
  let {fx, size, fun} = getPrintStencilParameter(type,obj.list)
  useNewPrint({data: [fx,  'mm', size,false]}, (doc) => {
    loadMark.value = false
    dateModel.forEach((printObj,index)=>{
      fun(doc, printObj, maxRowLen)
      if (index < (dateModel.length-1)) doc.addPage()
    })
  })
}

const getUnitType = (v) => {
  return v=='etc'?'其他':v=='cust'?'客户':v=='supplier'?'供应商':v=='user'?'员工':v=='project'?'项目':'';
}
const getProName = (v) => {
  return setString((proList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getSupName = (v) => {
  return setString((supList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getCustName = (v) => {
  return setString((custList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getUserName = (v) => {
  return (userList.value.filter(it => it.value == v)[0]?.label || '')
}
//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = "";
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
  return s;
}

async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  let conversionRate=JsonTool.parseObj(record.unitInfo.detail).filter(tx=>tx.id==record.cgUnitId)[0].conversionRate
  record.baseQuantity=record.cnumber*conversionRate
}
// 算出单价
async function findByPrice(record) {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.cinvodeInfo = o
  if (record.cinvodeInfo?.stockMeasurementType == '多计量' && !hasBlank(record.cunitid)){
    let res:any =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        record.cunitid = list[0].id
        if (list.length > 1){
          record.cunitidF1 = list[1].id
          if (list.length > 2)
            record.cunitidF2 = list[2].id
        }
      }
      await setByPrice(record)
    }
    tableDataChange(record,'cnumber')
  }
  else{
    // 获取对应供应商价格表【采购价格表】
    if(!hasBlank(record.cinvodeInfo.stockSupplier)){
      let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
      if(data.length>0){
        let money:any=0
        switch (data[0].supPriceLevel) {
          case '协议价':
            money=data[0].memberprice
            break
          case '零售价':
            money=data[0].regularPrice
            break
          case '最低价':
            money=data[0].minPrice
            break
          case '最高价':
            money=data[0].maxPrice
            break
          case '一级采购价':
            money=data[0].invscost1
            break
          case '二级采购价':
            money=data[0].invscost2
            break
          case '三级采购价':
            money=data[0].invscost3
            break
          case '四级采购价':
            money=data[0].invscost4
            break
          case '五级采购价':
            money=data[0].invscost5
            break
          case '六级采购价':
            money=data[0].invscost6
            break
          case '七级采购价':
            money=data[0].invscost7
            break
          case '八级采购价':
            money=data[0].invscost8
            break
        }

        if(money>0){
          record.tempNine=parseFloat(money).toFixed(2)
          record.price=record.tempNine

          record.baseQuantity=record.cnumber
        }
      }
    }
    tableDataChange(record,'taxprice')
  }
}
async function setByPrice(record){
  // 获取对应供应商价格表【采购价格表】
  if(!hasBlank(record.cinvodeInfo.stockSupplier)){
    let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
    if(data.length>0){
      let money:any=0
      switch (data[0].supPriceLevel) {
        case '协议价':
          money=data[0].memberprice
          break
        case '零售价':
          money=data[0].regularPrice
          break
        case '最低价':
          money=data[0].minPrice
          break
        case '最高价':
          money=data[0].maxPrice
          break
        case '一级采购价':
          money=data[0].invscost1
          break
        case '二级采购价':
          money=data[0].invscost2
          break
        case '三级采购价':
          money=data[0].invscost3
          break
        case '四级采购价':
          money=data[0].invscost4
          break
        case '五级采购价':
          money=data[0].invscost5
          break
        case '六级采购价':
          money=data[0].invscost6
          break
        case '七级采购价':
          money=data[0].invscost7
          break
        case '八级采购价':
          money=data[0].invscost8
          break
      }

      let list:any =  duoJlMxList.value.filter(a=>a.id==record.cgUnitId)
      let conversionRate:any= list[0].conversionRate
      let price:any=parseFloat(conversionRate)*parseFloat(money)
      if(price>0){
        record.tempNine=parseFloat(price).toFixed(10)
        record.price=record.tempNine
      }
    }
  }
}
// 修改状态下 并且 修改 计量单位 触发
async function editUnitType(record) {
  let oldCgUnitId=record.cgUnitId
  createConfirm({
    iconType: 'warning',
    title: '提示',
    content: '计量单位发生改变,数量和单价将重新计算,确定继续吗？',
    onOk: async () => {
      record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
      record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
      record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value

      if(record.cunitid==record.cgUnitId){
        record.cnumber=record.baseQuantity
        record.tempCnumber=record.cnumber
      }else if(!hasBlank(record.cunitidF1) && record.cunitidF1==record.cgUnitId){
        record.cnumber=record.subQuantity1
        record.tempCnumber=record.cnumber
      }else if(!hasBlank(record.cunitidF2) && record.cunitidF2==record.cgUnitId){
        record.cnumber=record.subQuantity2
        record.tempCnumber=record.cnumber
      }

      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
      record.cinvodeInfo = o
      await findByCgUnitIdSetByPrice(record)
      calculateTotal()
    },onCancel: () => {
      record.tempCgUnitId=oldCgUnitId
    }
  })
}
async function findByCgUnitIdSetByPrice(record){
  // 获取对应供应商价格表【采购价格表】
  if(!hasBlank(record.cinvodeInfo?.stockSupplier)){
    let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
    let money:any=0
    if(data.length>0){
      switch (data[0].supPriceLevel) {
        case '协议价':
          money=data[0].memberprice
          break
        case '零售价':
          money=data[0].regularPrice
          break
        case '最低价':
          money=data[0].minPrice
          break
        case '最高价':
          money=data[0].maxPrice
          break
        case '一级采购价':
          money=data[0].invscost1
          break
        case '二级采购价':
          money=data[0].invscost2
          break
        case '三级采购价':
          money=data[0].invscost3
          break
        case '四级采购价':
          money=data[0].invscost4
          break
        case '五级采购价':
          money=data[0].invscost5
          break
        case '六级采购价':
          money=data[0].invscost6
          break
        case '七级采购价':
          money=data[0].invscost7
          break
        case '八级采购价':
          money=data[0].invscost8
          break
      }
    }
    let price:any=parseFloat(record.isum)/parseFloat(record.cnumber)
    if(price>0){
      record.tempNine=parseFloat(price).toFixed(10)
      record.price=record.tempNine
    }
  }
}
/*变更专区*/
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}
const isGiveChange = (r) => {
  if (r.isGive){
    r.price=0;
    r.taxprice=0;
    tableDataChange(r,'price')
  }else {
    message.info('请完善单价！')
  }
}

async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optRange:'1',
    optModule:'stock',
    optFunction:'其他入库单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:dynamicAccId.value,
    optContent:'操作内容【其他入库单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
}

const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
  })
}
// 按行校验存货现存量
async function verifyRowXCLData(r) {
  if(titleValue.value==1){
    // 入库保存修改现存量：0可用量  1查现存量 dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong'
    await useRouteApi(verifyStockRowXCL, {schemaName: dynamicTenantId})({queryType:dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong',cinvode:r.cinvode,cwhcode:r.cwhcode,batchId:r.batchId,dpdate:r.dpdate,dvdate:r.dpdate,iyear:dynamicYear.value,rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck})
      .then((t)=>{
        let conversionRate= r.unitList.filter(j=>j.value==r.cgUnitId)[0]?.conversionRate
        r.showNumber=parseFloat(t/conversionRate).toFixed(2)
        // oldShowNumber 是红字 选择批次弹框回调携带参数
        if(!hasBlank(r.oldShowNumber)){
          r.showNumber=r.oldShowNumber
        }
      })
  }
}
// 批次弹框回调
function batchSelectorData(data) {
  loadMark.value=true
  data.forEach(b=>{
    chChange(b)
    tableDataChange(b,'price')
    slChange0(b)
  })

  data.map(a=>{a.baseQuantity=parseFloat(a.baseQuantity)*-1;a.tempSix=a.tempSix*-1;a.cnumber=a.cnumber*-1;return a;})
  setTimeout(()=>{
    for (let i = data.length; i < 50; i++) {
      data.push({})
    }
    setTableData(data)
    loadMark.value=false
  },500)
}

async function openReferPop(type) {
  openReferPage(true, {
    dynamicTenantId:dynamicTenantId.value,
    iyear:dynamicYear.value,
    ddate:formFuns.value.getFormValue().ddate,
    referType:type
  })
}

async function referData(data) {
  referTaskList.value=data.taskList
  routeDataObj.value=data.clounmData[0]
  routeDataObj.value.entryList=JsonTool.json(data.list)

  tempType.value='one'
  isEdit.value=true
  cwhcodeEdit.value=true
  loadMark.value=true

  // 获取最新
  let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  formItems.value = {
    ddate: useCompanyOperateStoreWidthOut().getLoginDate,
    ccode: code,
    bstyle: '借入入库',
    unitType: data.clounmData[0].unitType,
    unitValue: data.clounmData[0].unitValue,
  }
  formFuns.value.setFormValue({
    ddate: useCompanyOperateStoreWidthOut().getLoginDate,
    ccode: code,
    bstyle: '借入入库',
    unitType: data.clounmData[0].unitType,
    unitValue: data.clounmData[0].unitValue,
  })

  for (let i = 0; i < data.list.length; i++) {
    let b=data.list[i]
    findByUnitList(b)
    let o:any = assetsCardList.value.filter(it => (it.stockNum == b.cinvode))[0]
    b.cinvodeInfo = o
    b.tempCnumber=b.cnumber
    b.isumRuku='0'
    slChange0(b)
  }
  for (let i = data.list.length; i < 50; i++) {
    data.list.push({})
  }
  setTimeout(()=>{
    setTableData(data.list)
    loadMark.value=false
  },500)
}

// 复制
const copyFun = async () => {
  // loadMark.value=true
  status.value = 2
  stockWareData.value=''

  // 获取最新
  let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  console.log(code)
  formFuns.value.setFormValue({
    id:null,
    ddate: useCompanyOperateStoreWidthOut().getLoginDate,
    ccode: code,
    bstyle: '其他入库',
    unitType: formItems.value.unitType,
    unitValue: formItems.value.unitValue,
    cwhcode: formItems.value.cwhcode,
    cpersoncode: formItems.value.cpersoncode,
    cdepcode: formItems.value.cdepcode,
    cmemo: formItems.value.cmemo
  })
  let list = getDataSource().map(t=>{t.id=null;t.ccode=code;t.sourcecode=null;t.sourcetype=null;t.sourcedetailId=null;t.sourcedate=null;
    t.isumJiesuan=0;t.isumFapiao=0;t.isumRuku=0;t.hxIsum=0;t.isumDaohuo=0;t.isumTuiHuo=0;t.isumFapiaoMoney=0;t.lineCode=randomString(30);return t;})
  let dLen = list.length
  for (let i = dLen; i < 50; i++) {
    list.push({})
  }
  setTableData(list)
  loadMark.value=false
}
/********** 单据搜索 *********/
const showSearch=ref(false)
const searchData = ref({
  year: '',
  type: pageParameter.type,
  qValue: '',
  style: '0',
  model: 'CG',
})
const toReceipt = async (v) => {
  nextTick(async ()=>contentSwitch('tail',v))
}
/********** 单据搜索 *********/

import { onBeforeRouteLeave } from 'vue-router'
// 监听路由离开
onBeforeRouteLeave(giveUp)
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
