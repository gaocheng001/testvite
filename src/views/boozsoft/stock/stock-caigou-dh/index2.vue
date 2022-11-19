<template>
  <div class="app-container">
    <PrintSetting v-if="showPrintSetting"></PrintSetting>
    <PrintModal @register="printModalRegister" :getDataSource="getDataSource" :getColumns="getColumns"></PrintModal>
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
          <Button class="actod-btn" @click="router.push('/cg-dhList')">查询</Button>
          <!-- 审核后的 -->
          <span v-if="stockWareData.bcheck=='1'">
            <Button v-if="status==3" :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
            <Popover placement="bottom" v-if="status==3">
              <template v-if="!ymPeriod" #content>
                <Button style="width: 88px;" :disabled="ymPeriod" class="actod-btn"  @click="biandong='1';startEdit('biangeng')">变更</Button><br>
                <Button style="width: 88px;margin-bottom: 2px" class="actod-btn" @click="openItems">变更清单</Button><br/>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">
                变更
              </Button>
            </Popover>
            <span v-if="status ==2">
              <Button class="actod-btn" @click="saveBiandong">保存</Button>
              <Button class="actod-btn" @click="giveUp">放弃</Button>
              <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
              <Button class="actod-btn" @click="tableDelBiandong">删行</Button>
            </span>
            <span v-else>
              <Popover placement="bottom">
              <template v-if="!ymPeriod" #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="setCGRKD_data">生成采购入库单</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="setCGTHD_data">生成采购退货单</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="setCGFP_data">生成采购发票</Button>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">
                生单
              </Button>
            </Popover>
              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
              <Popover placement="bottom">
                <template #content>
                  <Button v-if="!ymPeriod" style="width: 120px;margin-bottom: 2px" @click="sySourcePop">来源单据</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
              </Popover>
              <Button :disabled="ymPeriod" class="actod-btn" @click="copyFun">复制</Button>
            </span>
          </span>
          <!-- 未审核 -->
          <span v-else>
              <span v-if="status < 3">
                <Popover placement="bottom">
                  <template #content>
                    <Button class="actod-btn" @click="referData('CGDD')">采购订单</Button><br/>
                    <Button class="actod-btn" @click="referData('CGRKD')">采购入库单</Button>
                  </template>
                  <Button class="actod-btn">参照</Button>
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
              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
              <Popover placement="bottom">
                <template v-if="!ymPeriod" #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="sySourcePop">来源单据</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
              </Popover>
              <Button :disabled="ymPeriod" class="actod-btn" @click="copyFun">复制</Button>
            </span>
          </span>
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
                <SettingFilled  :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
          <div class="acttd-right-d-btns" v-else>
            <Button v-if="status<3" class="acttdrd-btn" @click="openCodePage()">
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
            <VerticalRightOutlined @click="contentSwitch('first','首页')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev','')" title="上页"/>&nbsp;
            <RightOutlined @click="contentSwitch('next','')" title="下页"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail','')" title="尾页"/>
            <span v-if="status=='3'">
              &nbsp;
              <Tag v-if="stockWareData.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.swsIsumRuku>0">
                已入库
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.swsIsumFapiao >0 ">
                已开票
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.swsIsumTuihuo >0 ">
                已退货
              </Tag>
             <Tag :color="'volcano'" v-if="!hasBlank(stockWareData.hxIsum)&&parseFloat(stockWareData.hxIsum)!=0">
                已核销
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.biandong=='1'">
                已变更
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.bworkable=='1'">
                已复核
              </Tag>
              <Tag :color="'volcano'" v-if="!hasBlank(stockWareData.hzhcNum)&&parseFloat(stockWareData.hzhcNum)!=0">
                红字回冲
              </Tag>
              <Tag :color="'volcano'" v-if="!hasBlank(stockWareData.isVoucher)&&stockWareData.isVoucher =='1' ">
                记账凭证
              </Tag>
              <Tag v-if="stockWareData.swsIsumJiesuan>0" :color="'volcano' ">
                已核算
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: '#0096c7'}">{{ titleContents[titleValue] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns" :accId="dynamicTenantId" :biandong="biandong" :newDateMsg="newDateMsg"
                       @open="openHeadSelectContent" @newDate="findByNewDateCode" :canzhao="canzhao" :sourceType="sourceType" :dynamicTenant="dynamicTenant" />
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
          <template #cwhcode="{ record }" >
            <template v-if="biandong=='0'&&record.editOne">
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
            <template v-if="!canzhao&&biandong=='0'&&record.editThree">
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
            <template v-if="!canzhao&&biandong=='0'&&record.editTwo">
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
            <template v-if="!canzhao&&biandong=='0'&&record.editEleven">
              <Select
                v-model:value="record.tempEleven"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
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
            <template v-if="!canzhao&&record.editCgUnitId">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @keyup.enter="focusNext(record,'cgUnitId')"
                @change="cgUnitIdChange(record)"
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
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'cnumber');"/>
              <CheckOutlined
                @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber')"/>
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
            <span class="a-table-font-arial">{{
                (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #icost="{ record }">
           <span class="a-table-font-arial">{{
               (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
             }}
             </span>
          </template>
          <!-- 税率-->
          <template #itaxrate="{ record }">
            <template v-if="biandong=='0'&&record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate"
                           class="itaxrate"
                           :min="0"
                           :max="100"
                           :formatter="value => `${value}%`"
                           :parser="value => value.replace('%', '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'itaxrate');"/>
              <CheckOutlined
                @click="record.editItaxrate = null;record.itaxrate=record.tempItaxrate;tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                <span class="a-table-font-arial" v-if="!hasBlank(record.itaxrate)">{{ parseFloat(record.itaxrate).toFixed(2) }}%</span>
              </div>
            </template>
          </template>
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="biandong=='0'&&record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :min="0"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null;record.taxprice=record.tempTaxprice;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTaxprice=record.taxprice,record.editTaxprice = true;">
                    <span class="a-table-font-arial">{{
                        (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <!-- 税额 -->
          <template #itaxprice="{ record }">
            <template v-if="status==2&&biandong=='0'&&record?.editItaxprice&&(hasBlank(stockWareData.hxIsum)||parseFloat(stockWareData.hxIsum)==0)">
              <InputNumber v-model:value="record.tempItaxprice" class="itaxprice"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'itaxprice')"/>
              <CheckOutlined @click="record.editItaxprice = null;record.itaxprice=record.tempItaxprice;tableDataChange(record,'itaxprice')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempItaxprice=record.itaxprice,record.editItaxprice = true;">
                    <span class="a-table-font-arial">{{
                        (record.itaxprice == null ? '' : parseFloat(record.itaxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <!-- 价税合计 -->
          <template #isum="{ record }">
            <template v-if="record?.editIsum">
              <InputNumber v-model:value="record.tempIsum" class="isum"
                           :min="0"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'isum')"/>
              <CheckOutlined
                @click="record.editIsum = null;record.isum=record.tempIsum;tableDataChange(record,'isum')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempIsum=record.isum,record.editIsum = true;">
          <span class="a-table-font-arial">{{
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3 || biandong=='1'" size="small" @change="isGiveChange(record)"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="biandong=='0'&&record?.editTwelve">
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
            <template v-if="biandong=='0'&&record?.editDpdate">
              <DatePicker v-model:value="record.tempDpdate" value-format="YYYY-MM-DD"
                          class="dpdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempDpdate && !b?focusNext(record,'dpdate'):null"/>
              <CheckOutlined @click="record.editDpdate = null;record.dpdate=record.tempDpdate;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'" @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
                <span class="a-table-font-arial">{{ record.dpdate }}</span>
              </div>
            </template>
          </template>
          <template #dvdate="{ record }">
            <template v-if="biandong=='0'&&record?.editFifteen">
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
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <Import @save="introduceData" @register="registerImportPage" />
    <Query  @query="loadPage" @register="registerQueryPage" />
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>
    <SySource @register="registerSySourcePage"/>
    <SySource @register="registerSySourcePage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <ChangeItems @register="registerItemsPage"/>
    <Lack @register="registerLackPage"/>
    <Refer @register="registerReferModalPage" @throwData="referThrowData"/>
    <BarCode @register="registerBarCodeModalPage" />

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
  Switch,
  Table,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Refer from "./popup/refer.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import SySource from './popup/sySource.vue';
import ChangeItems from './popup/changeItems.vue';
import DynamicForm from './component/DynamicForm.vue';
import BarCode from './popup/barCode.vue';
import Print from '/@/views/boozsoft/stock/stock-caigou-dh/popup/print.vue';
import Lack from '/@/views/boozsoft/stock/stock_balance/popup/lack.vue';
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {
  BarcodeOutlined,
  CheckOutlined,
  CopyOutlined,
  LeftOutlined,
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
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock-caigou-dh/component/DynamicForm";
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
  delRuKu, delStockWareHCD, delXyHCD,
  delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode,
  findBillByCondition,
  findBillCode,
  findByStockPeriodIsClose,
  findByStockWareRecentlySupMoney,
  findByWarSearch,
  findStockPeriodYmFlag,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveRuKu,
  verifySyCsourceByXyCode,
  xyCsourceSave, verifyDataState,
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
import {verifyStockRowXCL, verifyStockXCLList,} from "/@/api/record/stock/stock-currents";
import {
  deleteByStockWarehLineCode,
  findAllByCcodeAndBillStyle,
  findByStockWarehLinecode,
  getPYRKDAndNoBcheck1,
  getUnitRate,
  stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import {stockSupPriceFindBySupIdAndStockNum} from "/@/api/record/stock/stock_sup_price";
import {findByStockNum2, singleUnitOfMea} from "/@/api/record/stock/stock";
import {findByLikeEcName} from "/@/api/record/stock/shou-fa";
import PrintSetting from './print/settings/index.vue'
import PrintModal from './print/Modal/index.vue'
import {
  delStockJoinPojo,
  findAllByBianDongCcodeLike,
  getBianDongNewCcode,
  saveStockWarehousingPOJO,
  saveStockWarehousingsListPOJO
} from "/@/api/record/stock/stock-ruku-biandong";
import {
  findByIyearAndCcodeAndXyBillStyle,
  verifySyLineCodeExistXyData
} from "/@/api/record/stock/stock-xy-source";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {findByCvencode, saveBeginBalance} from "/@/api/record/system/arBeginBalance";
import {
  findWhxskd,
  saveStockXyCsource,
  saveWriteOff,
  saveYsyf
} from "/@/api/record/system/arApYsyf";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";

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
const route = useRoute();
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const [registerItemsPage, {openModal: openItemsSourcePage}] = useModal()
const [registerLackPage, {openModal: openLackPage}] = useModal()
const [registerReferModalPage, {openModal: openReferPage}] = useModal()

const windowHeight = (window.innerHeight - 300)
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
const summary = ref({})
const biandong = ref('0')
const dynamicTenantId = ref('')
const dynamicTenant:any = ref(null)
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['采购到货单', '采购到货单', '采购回冲单']
const titleValue = ref(0)
const formRowNum = ref(1)
const tempType =  ref('')
const bdocumStyle =  ref('0')
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGDHD'
})

const formItems: any = ref({})
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const userList = ref([])
const custList = ref([])
const operatorList = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const routeDataParams:any = route.query;
const stockWareData:any = ref('')
const ymPeriod:any = ref(false)
const visible3:any = ref(false)
// 是否更改过日期
const newDateMsg:any = ref('0')
// 任务
const taskInfo:any = ref('')
const sourceType:any = ref('')
const cmakerTime:any = ref('')
const canzhao =  ref(false)
const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
// 是否有变动操作
const biandongOper =  ref(false)
const referTaskList:any = ref([])
// 来源单据信息
const sourcetData:any = ref('')

async function findByNewDateCode(date) {
  newDateMsg.value=date.msg
  // 获取最新
  let code:any = await generateCode(date.data)
  formItems.value = {
    ccode: code,
  }
  formFuns.value.setFormValue({
    ccode: code,
  })
}

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
  console.log('当前时间：'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  searchData.value.year=obj.stockYear
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
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
const pageReload = async () => {
  status.value=3
  stockWareData.value=''
  await reloadList()

  if(routeDataParams.ccode!==undefined){
    if (!hasBlank(routeDataParams.co) && dynamicTenant.value?.coCode !=routeDataParams.co){
      accountPickerFuns.value.resetCoCode(routeDataParams.co)
      return false
    }
  }
  // 列表跳转过来
  if(routeDataParams.type=='cgdd'){
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    custList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']

    canzhao.value=true
    let data=JSON.parse(routeDataParams.json).data
    status.value = 1
    stockWareData.value=''
    formItems.value = {
      ddate: data.ddate,
      ccode: data.ccode,
      cvencode: data.cvencode,
      cvencodeJs: !hasBlank(data.cvencodeJs)?data.cvencodeJs:data.cvencode,
      cdepcode: data.cdepcode,
      cpersoncode: data.cpersoncode,
      cmemo: data.cmemo,
      rate: dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
    }
    formFuns.value.setFormValue({
      ddate: data.ddate,
      ccode: data.ccode,
      cvencode: data.cvencode,
      cvencodeJs: !hasBlank(data.cvencodeJs)?data.cvencodeJs:data.cvencode,
      cdepcode: data.cdepcode,
      cpersoncode: data.cpersoncode,
      cmemo: data.cmemo,
      rate: dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
    })
    // 获取来源单据信息
    sourcetData.value=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(data.sourceccode)
    let mx=JSON.parse(JSON.parse(routeDataParams.json).mx)
    for (let i =mx.length; i < 50; i++) {
      mx.push({})
    }
    setTableData(mx)
    tempTaskSave('新增')
  }else{
    if(!hasBlank(routeDataParams.ccode)){
      await contentSwitch('tail',routeDataParams.ccode)
    }else{
      await contentSwitch(formItems.value.id == null?'tail':'curr','')
    }
  }
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    custList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']
  })
}

async function findBySearch(val) {
  loadMark.value = true
  let bySearchData=await useRouteApi(findByWarSearch, {schemaName: dynamicTenantId})({billStyle: 'CGDHD',ccode:val})
  if(!hasBlank(bySearchData)){
    await contentSwitch('tail',bySearchData.ccode)
  }
  else{
    message.error('没有对应的单据！')
    loadMark.value = false
  }
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
    // 格式化 定金
    res.theDeposit = !hasBlank(res.theDeposit)?parseFloat(res.theDeposit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','):''
    formItems.value = JsonTool.parseProxy(res)
    cmakerTime.value=formItems.value.cmakerTime
    if(hasBlank(cmakerTime.value)){
      cmakerTime.value=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    }
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查询是否生成
      if(list.filter(a=>!hasBlank(a.sourcecode)).length>0){
        canzhao.value=true;
      }
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        list[i].canzhaoCnumber=0
        // 来源单据明细
        if(canzhao.value){
          let mx=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
          list[i].canzhaoCnumber=mx.baseQuantity
        }
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
      for (let i = len; i < (50 ); i++) {
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
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber+=parseFloat(e['cnumber'] || 0)
    icost+=parseFloat(e['icost'] || 0)
    isum+=parseFloat(e['isum'] || 0)
    itaxprice+=parseFloat(e['itaxprice'] || 0)
  }
  summary.value={
    cnumber: cnumber==0?null:parseFloat(cnumber).toFixed(2),
    icost: icost==0?null:toThousandFilter(icost),
    isum: isum==0?null:toThousandFilter(isum),
    itaxprice: itaxprice==0?null:toThousandFilter(itaxprice),
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
    },
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,slots: {customRender: 'bcheck1'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
    },{
      title: '采购单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
    },{
      title: '数量',
      dataIndex: 'cnumber',
      ellipsis: true,
      slots: {customRender: 'cnumber'},
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      slots: {customRender: 'itaxprice'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      slots: {customRender: 'dpdate'},
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '项目',
      dataIndex: 'citemcode',
      ellipsis: true,
    },{
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
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
  indexColumnProps:{ fixed:true },
  pagination: false
})

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value=[]
  tableSelectedRowObjs.value=[]

  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
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
  }
  else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}
const rowDelBianDongData:any=ref([])
async function tableDelBiandong() {
  if (tableSelectedRowKeys.value.length == 1){
    let list:any = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    let data=list.filter(it => it.key === tableSelectedRowKeys.value[0])[0]
    // 检验上游子表行唯一码是否存在下游
    let xyData=await useRouteApi(verifySyLineCodeExistXyData, { schemaName: dynamicTenantId })({billStyle:'CGDHD',xyIyear:data.iyear,sourcedetailId:data.lineCode})
    if(xyData>0){
      return message.error('已经生成下游表不能删除!!')
    }
    rowDelBianDongData.value.push(data)
    list.splice(selectIndex, 1)
    setTableData(list)
    tableSelectedRowKeys.value = []
  }
  else{
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '只能单行删除！'
    })
  }
}

const startEdit = async (type) => {
  summary.value={}
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账'})
  console.log('到货单判断：---是否有月末结账任务--'+JSON.stringify(jzMethod))
  if(!hasBlank(jzMethod)){
    status.value = 3
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  console.log('到货单判断：---当前业务日期期间是否结账--'+JSON.stringify(temp))
  if(temp>0){
    status.value = 3
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }

  let maxR = 50
  if (type === 'add') {
    canzhao.value=false
    status.value = 1
    stockWareData.value=''
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    formItems.value = {
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
      methodPay: 'QT',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
      methodPay: 'QT',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    tempTaskSave('新增')
  }
  else if(type=='edit'){
    if(formItems.value.ccode==undefined){return }
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      return message.error("单据已发生变化,请刷新当前单据！")
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = dLen; i < (maxR ); i++) {
      list.push({})
    }
    setTableData(list)
  }
  else if(type=='biangeng'){
    let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
      type: pageParameter.type,
      iyear: dynamicYear.value || '2022',
      action: 'curr',
      ccode: '',
      bdocumStyle: bdocumStyle.value,
      curr: formFuns.value.getFormValue()?.ccode || ''
    })
    if(!hasBlank(res.hxFlag)&&res.hxFlag!='0'){
      status.value = 3
     return message.error('当前单据已进行付款核销完成，不能进行变更操作，请手动删除对应核销记录后继续！')
    }else if(!hasBlank(res.hzhcNum)&&res.hzhcNum!='0'){
      status.value = 3
      return message.error('当前单据已进行过红字回冲，不能进行变更操作，请删除对应红字回冲单后继续！')
    }

    let xyPingZheng= await useRouteApi(findByIyearAndCcodeAndXyBillStyle, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,ccode:formItems.value.ccode,xyBillStyle:'PINGZHENG'})
    console.log('到货单判断：---下游表是否凭证--'+JSON.stringify(xyPingZheng))
    if(!hasBlank(xyPingZheng)){
      status.value = 3
      return message.error('当前单据已参照生成财务凭证，不能进行变更操作，请手动删除生成的财务凭证后继续！')
    }

    if(!hasBlank(stockWareData.hzhcNum)&&parseFloat(stockWareData.hzhcNum)!=0){
      status.value = 3
      return message.error('提示：当前单据已进行付款核销完成，不能进行变更操作，请删除对应核销记录后继续！')
    }
    if(stockWareData.bworkable=='1'){
      status.value = 3
      return message.error('提示：当前单据已进行过应付款复核，不能进行变更操作，请取消应收复核后继续！')
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'弃审,审核,变更',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('变更')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
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

async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购到货单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
  .then((a)=>{
    taskInfo.value=a
    console.log('任务='+JSON.stringify(a))
  })
}
async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'采购到货单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:dynamicAccId.value,
    optContent:'操作内容【采购到货单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
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
    loadMark.value=true
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+formItems.value.bcheck
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      loadMark.value=false


      return message.error("单据已发生变化,请刷新当前单据！")
    }

    // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
    if(!hasBlank(jzMethod)){
      loadMark.value=false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          loadMark.value=false
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
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
      temp2.cwhcode=tx.cwhcode
      temp2.batchId=tx.batchId
      temp2.dpdate=tx.dpdate
      temp2.dvdate=tx.dvdate
      temp2.baseQuantity=tx.baseQuantity
      temp2.lackBaseQuantity=''
      temp2.unitName=tx.unitList.filter(uni=>uni.value==tx.cgUnitId)[0]?.title
      verifylist.push(temp2)
    }
    // 可用量不足 不足 弹出框提示
    let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'keyong',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
    // 如果是负数强制转换成正数比较
    currData=currData.map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData.length>0){
      return  openLackPage(true,{data:currData,queryType:'keyong',dynamicTenantId:dynamicTenantId.value})
    }
    tempTaskSave('删除')

    createConfirm({
      iconType: 'warning',
      title: '采购到货单删除',
      content: '您确定要进行采购到货单删除吗!',
      onOk: async () => {
        let dataList = getDataSource().filter(it => !hasBlank(it.cwhcode))
        // 上游单据 && 是否生成的到货单
        if(canzhao.value){
          for (let i = 0; i < dataList.length; i++) {
            // 删除下游单据
            await useRouteApi(delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode, {schemaName: dynamicTenantId})({xyccode:formItems.value.ccode,xybillStyle:'CGDHD',billStyle:dataList[i].sourcetype,ccode:dataList[i].sourcecode})
            // 上游单据明细
            let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(dataList[i].sourcedetailId)
            if(!hasBlank(sourceData)){
              if(sourceData.billStyle=='CGDD' || sourceData.billStyle=='CGRKD'){
                // 修改累计到货数量
                sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)-parseFloat(dataList[i].baseQuantity)
              }else{
                // 修改累计到货数量
                sourceData.isumRuku=parseFloat(hasBlank(sourceData.isumRuku)?0:sourceData.isumRuku)-parseFloat(dataList[i].baseQuantity)
              }
              await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])
            }

            // 修改上游主表 累计入库完成状态
            let sourceMainData=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(dataList[i].sourcecode)
            if(!hasBlank(sourceMainData)){
              sourceMainData.daohuoStatus='0'
              await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(sourceMainData)
            }
          }
        }
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        // 删除变动记录
        await useRouteApi(delStockJoinPojo, {schemaName: dynamicTenantId})(formItems.value.ccode)
        tempTaskDel(taskInfo.value?.id)
        // 删除参照任务锁定表
        if(referTaskList.value.length>0){
          for (let i = 0; i < referTaskList.value.length; i++) {
            tempTaskDel(referTaskList.value[i].id)
          }
        }
        saveLogData('删除')
        message.success('删除成功！')
        formItems.value.czId = ''
        loadMark.value=false
        await contentSwitch('tail','')
      },
      onCancel: () => {
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

  // 任务
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
  if(!hasBlank(taskData)){
    for (let i = 0; i < taskData.length; i++) {
      // 任务不是当前操作员的
      if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        loadMark.value=false
        return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
      }
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
    }
  }
  if(b){
    let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(dynamicYear.value)
    console.log('到货单：--->盘点处理-->'+pd)
    if(pd>0){
      loadMark.value=false
      return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
    }
  }

  let qsText=''
  // 弃审
  if(!b){
    // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账'})
    if(!hasBlank(jzMethod)){
      loadMark.value=false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
    if(temp>0){
      loadMark.value=false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    let findByRukuData=await useRouteApi(verifySyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,ccode:formItems.value.ccode,billStyle:'CGDHD'})
    if(findByRukuData.length>0){
      loadMark.value=false
      message.error('已经生成下游单据,不能弃审！')
      return false;
    }

    if(!hasBlank(stockWareData.value.hxIsum)&&parseFloat(stockWareData.value.hxIsum)!=0){
      loadMark.value=false
      return message.error('当前单据已进行过应付核销，不能进行取消审核操作，请删除核销单据后继续！')
    }else if(!hasBlank(stockWareData.value.hzhcNum)&&parseFloat(stockWareData.value.hzhcNum)!=0){
      loadMark.value=false
      return message.error('当前单据已进行过红字回冲，不能进行取消审核操作，请手动删除红字回冲单据后继续！')
    }else if(stockWareData.value.bworkable=='1'){
      loadMark.value=false
      return message.error('当前单据已进行过应付款复核，不能进行取消审核操作，请取消单据复核后继续！')
    }

    // 判断是否有变更记录
    let biandongData=await useRouteApi(findAllByBianDongCcodeLike,{ schemaName: dynamicTenantId })(formItems.value.ccode)
    if(biandongData.length>0){
      qsText='当前单据有变更记录,弃审后将无法还原,'
    }
  }
  let list:any = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })
  let text=b?'审核':'弃审'
  let a:any = useUserStoreWidthOut().getUserInfo?.id
  loadMark.value=true
  tempTaskSave(b?'审核':'弃审')
  // 审核、弃审
  let bcheck=b?'1':'0'
  let bcheckTime=b?newDate.value:''
  let bcheckUser=b?a:''
  res.bcheck=bcheck
  res.biandong=!b?'0':res.biandong
  res.bcheckTime=bcheckTime
  res.bcheckUser=bcheckUser
  await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

  list.forEach(tx=>{
    tx.bcheck=bcheck
    tx.bcheckTime=bcheckTime
    tx.bcheckUser=bcheckUser
    tx.biandong=!b?'0':tx.biandong
  })
  await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)
  if(b){
    // ********************************** 应收审核自动核销 **********************************
    console.log('应付单必须进行复核='+dynamicTenant.value.target?.arCheckFlag)
    // 1、1是0否 应付单必须进行复核  勾选跳过
    if(hasBlank(dynamicTenant.value.target?.arCheckFlag)||dynamicTenant.value.target?.arCheckFlag!='1'){
      // 2、采购0到货单\1发票 确认应付款 并且 3、应付审核自动核销
      if(dynamicTenant.value.target?.apSourceFlag!=='1' && dynamicTenant.value.target?.apHexiaoAuto){
        let money = res.isum
        console.log(money)
        //查询期初收款单
        let qcList = await useRouteApi(findByCvencode,{schemaName: dynamicTenantId})({cvencode:res.cvencode,iyear:res.iyear})
        console.log('查询期初收款单='+qcList.length)
        let qcskdList = qcList.filter(item=>item.busStyle=='FKD')
        for (let j = 0; j < qcskdList.length; j++) {
          let qcskd = qcskdList[j]
          let whxIsum = sub(qcskd.ysIsumBenbi, qcskd.hxIsum == null ? 0 : qcskd.hxIsum)
          let hxMoney:any = 0
          if (money != 0) {
            if (qcskd.ysIsumBenbi > 0) {
              if (money >= whxIsum) {
                qcskd.hxIsum = qcskd.ysIsumBenbi
                qcskd.hxFlag = '1'
                hxMoney = whxIsum
                money = sub(money,whxIsum)
              } else {
                qcskd.hxIsum = add(qcskd.hxIsum,money)
                qcskd.hxFlag = '0'
                hxMoney = qcskd.hxIsum
                money = 0
              }
            } else {
              if (qcskd.isum < 0) {
                if (money <= whxIsum) {
                  qcskd.hxIsum = qcskd.ysIsumBenbi
                  qcskd.hxFlag = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  qcskd.hxIsum = add(qcskd.hxIsum,money)
                  qcskd.hxFlag = '0'
                  hxMoney = qcskd.hxIsum
                  money = 0
                }
              }
            }
            await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(qcskd)
            .then(data=>{
              console.log('【期初收款单】='+JSON.stringify(data))
            })
            //保存核销单
            let writeOff: any = {
              iyear: pageParameter.year,
              ccode: qcskd.ccode,
              ddate: qcskd.ddate,
              billStyle: 'FKD',
              hxStyle: res.billStyle,
              cvencode: res.cvencodeJs,
              hxCcode: res.ccode,
              hxIsum: res.isum,
              hxMoney: hxMoney,
              currency: qcskd.currency,
              exRate: qcskd.exRate,
              skdQichu: '1',
              hxUser: useUserStoreWidthOut().getUserInfo.id,
            }
            await useRouteApi(saveWriteOff, {schemaName: dynamicTenantId})(writeOff)
            .then(data=>{
              console.log('【期初收款单】保存核销单='+JSON.stringify(data))
            })
            //保存下游单据
            let stockXyCsource: any = {
              iyear: pageParameter.year,
              xyBillStyle: 'YUE',
              billStyle: res.billStyle,
              ccode: res.ccode,
              ccodeDate: res.ddate,
              xyccode: qcskd.ccode,
              xyccodeDate: qcskd.ddate,
            }
            await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
            .then(data=>{
              console.log('【期初收款单】保存下游单据='+JSON.stringify(data))
            })
          }
        }

        //查询收款单
        let ysyfList = await useRouteApi(findWhxskd,{schemaName: dynamicTenantId})({year:res.iyear,cvencode:res.cvencode})
        console.log('查询收款单='+ysyfList.length)
        for (let j = 0; j < ysyfList.length;j++) {
          let ysyf = ysyfList[j]
          let whxIsum = sub(ysyf.isum, ysyf.hxIsum)
          let hxMoney:any = 0
          if (money != 0) {
            if (money > 0) {
              if (ysyf.isum > 0) {
                if (money >= whxIsum) {
                  ysyf.hxIsum = ysyf.isum
                  ysyf.writeOffStatus = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  ysyf.hxIsum = add(ysyf.hxIsum,money)
                  ysyf.writeOffStatus = '0'
                  hxMoney = ysyf.hxIsum
                  money = 0
                }
              }
            } else {
              if (ysyf.isum < 0) {
                if (money <= whxIsum) {
                  ysyf.hxIsum = ysyf.isum
                  ysyf.writeOffStatus = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  ysyf.hxIsum = add(ysyf.hxIsum,money)
                  ysyf.writeOffStatus = '0'
                  hxMoney = ysyf.hxIsum
                  money = 0
                }
              }
            }
            await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
            //保存核销单
            let writeOff: any = {
              iyear: pageParameter.year,
              ccode: ysyf.ccode,
              ddate: ysyf.ddate,
              billStyle: 'FKD',
              hxStyle: res.billStyle,
              cvencode: res.cvencodeJs,
              hxCcode: res.ccode,
              hxIsum: res.isum,
              hxMoney: hxMoney,
              currency: ysyf.currency,
              exRate: ysyf.exRate,
              hxUser: useUserStoreWidthOut().getUserInfo.id,
            }
            await useRouteApi(saveWriteOff, {schemaName: dynamicTenantId})(writeOff)
            //保存下游单据
            let stockXyCsource: any = {
              iyear: pageParameter.year,
              xyBillStyle: 'FKD',
              billStyle: res.billStyle,
              ccode: res.ccode,
              ccodeDate: res.ddate,
              xyccode: ysyf.ccode,
              xyccodeDate: ysyf.ddate,
            }
            await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
          }
        }

        //修改采购到货单表
        res.hxIsum = sub(res.isum,money)
        if (money==0){
          res.hxFlag = '1'
        } else {
          res.hxFlag = '0'
        }
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

        //修改采购到货单子表
        let money1 = res.hxIsum
        for (let j = 0; j < list.length; j++) {
          let aa = list[j]
          if (!hasBlank(money1) && money1 != 0) {
            if (money1 > 0) {
              if (sub(aa.isum, aa.hxIsum) < money1) {
                aa.hxIsum = aa.isum
                money1 = sub(money1, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
                aa.hxFlag = '1'
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money1)
                money1 = 0
              }
            } else {
              if (sub(aa.isum, aa.hxIsum) > money1) {
                aa.hxIsum = aa.isum
                aa.hxFlag = '1'
                money1 = sub(money1, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money1)
                money1 = 0
              }
            }
            if (sub(aa.isum, aa.hxIsum) == 0) {
              aa.hxFlag = '1'
            } else {
              aa.hxFlag = '0'
            }
            aa.hzhcNum = add(aa.hzhcNum == null ? '0' : aa.hzhcNum, 1)
          }
          list[j] = aa
        }
        await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)
      }
    }
    //**********************************************************************************************************

    console.log('来源单据类型='+res.sourcetype+'---到货单审核生成入库单='+dynamicTenant.value.target?.cgShDhd)
    // 来源单据不是入库单
    if(res.sourcetype!=='CGRKD'&&dynamicTenant.value.target?.cgShDhd=='1'){
      createConfirm({
        iconType: 'warning',
        title: '提示',
        cancelText:'放弃',
        okText:'生成',
        content: '单据审核完成，是否继续生成对应采购入库单?',
        onOk: async () => {
          loadMark.value=false
          let tableList = getDataSource().filter(it => !hasBlank(it.cwhcode))
          // 到货单子表-修改本单据的 累计入库数量
          tableList.forEach(async (temp)=>{
            // 修改本单据的 累计入库数量
            temp.isumRuku=temp.baseQuantity
            temp.bcheck=bcheck
            temp.bcheckTime=bcheckTime
            temp.bcheckUser=bcheckUser
          })
          await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(tableList)

          let oldNum=formItems.value.ccode
          let oldBillStyle=formItems.value.billStyle
          let oldddate=formItems.value.ddate
          let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  useCompanyOperateStoreWidthOut().getLoginDate,prefix: "",key: '3-10'})
          // 生成入库单
          formItems.value.id=null
          formItems.value.ccode=newRuKuNum
          formItems.value.billStyle='CGRKD'
          formItems.value.bcheck='0'
          formItems.value.bcheckTime=''
          formItems.value.bcheckUser=''
          formItems.value.sourcetype=oldBillStyle
          formItems.value.sourcecode=oldNum
          formItems.value.bstyle='采购入库'
          formItems.value.cmakerTime=newDate.value
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
            temp.isumRuku='0'
            temp.priceZangu=temp.price
            temp.icostZangu=temp.icost

            temp.sourcetype='CGDHD'
            temp.sourcecode=oldNum
            temp.sourcedetailId=parentLineCode
            temp.sourcedate=oldddate
            temp.cmakerTime=newDate.value
          })
          await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(setRuKuList)
          // 添加下游表
          let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
          await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)

          pageParameter.type='CGDHD'
          await contentSwitch('curr','')
        },
        onCancel: async () => {
          loadMark.value=false
          pageParameter.type='CGDHD'
          await contentSwitch('curr','')
        }
      })
    }
    // 来源单据是入库单--生成红蓝
    else if((res.sourcetype=='CGRKD' || res.sourcetype=='QT')&&dynamicTenant.value.target?.cgShDhd=='1'){
      let sourcedate:any=String(Array.from(new Set(list.map(tx=>tx.sourcedate)))[0])
      sourcedate=sourcedate.substring(0,sourcedate.length-3).replaceAll('-','')

      let ddate:any=String(formItems.value.ddate)
      ddate=ddate.substring(0,ddate.length-3).replaceAll('-','')

      // kcEstimated=1单到回冲、2单到补差、3月初回冲
      // 回冲单
      if(dynamicTenant.value.target?.kcEstimated=='1'){
        // 小于到货单日期
        if(parseFloat(sourcedate)<parseFloat(ddate)){
          let sourcecodeList= Array.from(new Set(list.map(tx=>tx.sourcecode)))

          // 生成红蓝回冲单
          for (let i = 0; i < sourcecodeList.length; i++) {
            let sourcecode=sourcecodeList[i]
            // 获取来源主表单据
            let sourceData=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(sourcecode)
            sourceData.id=null
            sourceData.billStyle='HZHCD'
            sourceData.sourcetype=formItems.value.ccode
            await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(sourceData)
            // 添加红字下游表
            let hzxy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:formItems.value.ccode,xyBillStyle:'HZHCD',xyccode:sourceData.ccode}
            await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(hzxy)

            sourceData.billStyle='LZHCD'
            await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(sourceData)
            // 添加下游表
            let lzxy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:formItems.value.ccode,xyBillStyle:'LZHCD',xyccode:sourceData.ccode}
            await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(lzxy)
          }

          for (let i = 0; i < list.length; i++) {
            let sourceDataList=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
            list[i].isumJiesuan=parseFloat(list[i].baseQuantity)+parseFloat(list[i].isumJiesuan)

            // 1单到回冲：生成红蓝回冲单
            if(dynamicTenant.value.target?.kcEstimated=='1'){
              // 取到货单数量
              sourceDataList.id=null
              sourceDataList.sourcecode=formItems.value.ccode
              sourceDataList.sourcetype=formItems.value.billStyle
              sourceDataList.sourcedetailId=list[i].lineCode
              sourceDataList.cnumber=list[i].cnumber*-1
              sourceDataList.lineCode=randomString(30)
              sourceDataList.baseQuantity=list[i].baseQuantity*-1
              sourceDataList.icostZangu=sourceDataList.icostZangu*-1
              sourceDataList.subQuantity1=sourceDataList.subQuantity1*-1
              sourceDataList.subQuantity2=sourceDataList.subQuantity2*-1
              sourceDataList.isumDaohuo=sourceDataList.isumDaohuo*-1
              sourceDataList.isumFapiao=sourceDataList.isumFapiao*-1
              sourceDataList.isumFapiaoMoney=sourceDataList.isumFapiaoMoney*-1
              sourceDataList.isumJiesuan=sourceDataList.isumJiesuan*-1
              sourceDataList.isumRuku=sourceDataList.isumRuku*-1
              sourceDataList.isumTuiHuo=sourceDataList.isumTuiHuo*-1
              sourceDataList.billStyle='HZHCD'
              titleValue.value=1
              tableDataChange(sourceDataList,'price')
              await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})([sourceDataList])

              titleValue.value=0
              sourceDataList.sourcecode=formItems.value.ccode
              sourceDataList.sourcetype=formItems.value.billStyle
              sourceDataList.sourcedetailId=list[i].lineCode
              sourceDataList.price=list[i].price
              sourceDataList.lineCode=randomString(30)
              sourceDataList.cnumber=Math.abs(list[i].cnumber)
              sourceDataList.baseQuantity=Math.abs(list[i].baseQuantity)
              sourceDataList.icostZangu=Math.abs(sourceDataList.icostZangu)
              sourceDataList.subQuantity1=Math.abs(sourceDataList.subQuantity1)
              sourceDataList.subQuantity2=Math.abs(sourceDataList.subQuantity2)
              sourceDataList.isumDaohuo=Math.abs(sourceDataList.isumDaohuo)
              sourceDataList.isumFapiao=Math.abs(sourceDataList.isumFapiao)
              sourceDataList.isumFapiaoMoney=Math.abs(sourceDataList.isumFapiaoMoney)
              sourceDataList.isumJiesuan=Math.abs(sourceDataList.isumJiesuan)
              sourceDataList.isumRuku=Math.abs(sourceDataList.isumRuku)
              sourceDataList.isumTuiHuo=Math.abs(sourceDataList.isumTuiHuo)
              sourceDataList.billStyle='LZHCD'
              tableDataChange(sourceDataList,'price')
              await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})([sourceDataList])
            }
          }
          await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)
        }
        // 等于本月直接修改入库单价
        else{
          for (let i = 0; i < list.length; i++) {
            let sourceDataList2=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
            // 修改入库单价
            sourceDataList2.price=list[i].price
            sourceDataList2.icost=list[i].icost
            sourceDataList2.taxprice=list[i].taxprice
            sourceDataList2.isum=list[i].isum
            await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})([sourceDataList2])
          }
        }
      }
      else if(dynamicTenant.value.target?.kcEstimated=='2'){ // 2单到补差

      }else if(dynamicTenant.value.target?.kcEstimated=='3'){ // 3月初回冲

      }

      // ------------------------- 生成核算单 -------------------------
      // 结算单据新编码
      let jsNewNum=await useRouteApi(getNewStockJiesuanNum, {schemaName: dynamicTenantId})({})
      jsNewNum='JS-'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,7).replace("T"," ").replace("-","")+'-'+jsNewNum
      let jieSuanData:any={}
      jieSuanData.ccode=jsNewNum
      jieSuanData.cmaker=a
      jieSuanData.bdocumStyle=titleValue.value
      jieSuanData.iyear=formItems.value.iyear
      jieSuanData.cvencode=formItems.value.cvencode
      jieSuanData.cvencodeJs=formItems.value.cvencodeJs
      jieSuanData.cdepcode=formItems.value.cdepcode
      jieSuanData.cpersoncode=formItems.value.cpersoncode
      jieSuanData.ccodeRuku=formItems.value.ccode
      jieSuanData.ddate=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,10).replace("T"," ")
      // 增加 结算单主表
      await useRouteApi(saveJiesuanPojo, {schemaName: dynamicTenantId})(jieSuanData)
      // 添加下游表
      let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:formItems.value.ccode,ccodeDate:formItems.value.ddate,xyBillStyle:'CGJSD',xyccode:jsNewNum,xyccodeDate:formItems.value.ddate}
      await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
      // ------------------------- 生成核算单子表 -------------------------
      let jiesuansList:any=[]
      for (let i = 0; i < list.length; i++) {
        let sourceDataList2=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
        // 修改累计核算数量
        sourceDataList2.isumJiesuan=parseFloat(list[i].baseQuantity)+parseFloat(sourceDataList2.isumJiesuan)
        list[i].isumJiesuan=parseFloat(list[i].baseQuantity)+parseFloat(list[i].isumJiesuan)
        await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})([sourceDataList2])

        let jiesuans:any={}
        jiesuans.iyear=list[i].iyear
        jiesuans.lineCode=list[i].lineCode
        jiesuans.ddate=list[i].ddate
        jiesuans.ccode=jsNewNum
        jiesuans.ccodeRuku=sourceDataList2.ccode
        jiesuans.ccodeDaohuo=list[i].ccode
        jiesuans.cinvode=list[i].cinvode
        jiesuans.cgUnitId=JsonTool.parseObj(list[i].unitInfo.detail).filter(a=>a.isMain=='true')[0]?.id
        jiesuans.quantityRuku=list[i].baseQuantity

        jiesuans.priceJs= parseFloat(list[i].icost)/parseFloat(list[i].baseQuantity)
        let icostJs:any=parseFloat(list[i].baseQuantity)*parseFloat(jiesuans.priceJs)
        jiesuans.icostJs=parseFloat(icostJs).toFixed(4)

        jiesuans.priceZg=parseFloat(sourceDataList2.icost)/parseFloat(sourceDataList2.baseQuantity)
        let icostZg:any=parseFloat(sourceDataList2.baseQuantity)*parseFloat(jiesuans.priceZg)
        jiesuans.icostZg=parseFloat(icostZg).toFixed(4)

        jiesuans.ccodeLy=list[i].sourcetype
        jiesuans.quantityDaohuo=jiesuans.quantityRuku
        jiesuansList.push(jiesuans)
      }
      await useRouteApi(saveJiesuansPojo, {schemaName: dynamicTenantId})(jiesuansList)
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)
      // ------------------------- 生成核算单END -------------------------

      loadMark.value=false
      pageParameter.type='CGDHD'
      await contentSwitch('curr','')
    }
    else{
      loadMark.value=false
      pageParameter.type='CGDHD'
      await contentSwitch('curr','')
    }
    saveLogData('审核')
    tempTaskDel(taskInfo.value?.id)
  }
  else{
    loadMark.value=false
    for (let i = 0; i < list.length; i++) {
      await delJieSuanFun(list[i].ccode)
    }
    delXyHCDDFun()
    delStockWareHCDFun()
    saveLogData(text)
    tempTaskDel(taskInfo.value?.id)
    pageParameter.type='CGDHD'
    setTimeout(async ()=>{
      await contentSwitch('curr','')
    },300)
  }
}
// 删除红蓝回冲单
const delStockWareHCDFun = async () => {
  // 删除时减去累计核算数量
  let list:any = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  for (let i = 0; i < list.length; i++) {
    let sourceDataList2 = await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
    if(!hasBlank(sourceDataList2)){
      // 修改累计核算数量
      sourceDataList2.isumJiesuan =parseFloat(sourceDataList2.isumJiesuan)- parseFloat(list[i].baseQuantity)
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})([sourceDataList2])
    }
    list[i].isumJiesuan =parseFloat(list[i].isumJiesuan)- parseFloat(list[i].baseQuantity)
  }
  await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)

  let map={sourcecode:formItems.value.ccode}
  await useRouteApi(delStockWareHCD, {schemaName: dynamicTenantId})(map)
}
// 删除下游红蓝回冲单
const delXyHCDDFun = async () => {
  let map={ccode:formItems.value.ccode}
  await useRouteApi(delXyHCD, {schemaName: dynamicTenantId})(map)
}
// 删除核算单
const delJieSuanFun = async (ccode) => {
  await useRouteApi(deleteByCcodeDaohuo, {schemaName: dynamicTenantId})(ccode)
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
function sub(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (a * e - b * e) / e;
}
function add(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
const loadMark = ref(false)

//保存验证
function saveCheck(list) {
  let form:any = formFuns.value.getFormValue();

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
  if (form.isGive&&!hasBlank(form.taxprice)&&parseFloat(form.taxprice)!==0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '赠品不能有含税单价！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!存货编码和数量为必填项,请补充完整!'
    })
    return false
  } else{
    let taxprice= list.filter(it =>it.taxprice==null&&it.tempTaxprice==null)
    if(taxprice.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+taxprice.map(a=>a.cinvode)+'】含税单价不能为空！'
      })
      return false
    }
    let isum= list.filter(it =>it.tempIsum==null&&it.isum==null)
    if(isum.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+isum.map(a=>a.cinvode)+'】价税合计不能为空！'
      })
      return false
    }

    let temp= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && hasBlank(trim(it.batchId)))
    if(temp.length>0){
        createErrorModal({
          iconType: 'warning',
          title: '温馨提示',
          content: '存货编码【'+temp.map(a=>a.cinvode)+'】批号为必填项！'
        })
        return false
    }
    let temp2= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && it.cinvodeInfo?.stockIndateManage=='1' && hasBlank(it.dvdate) && hasBlank(it.dpdate))
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
async function  saveData() {
  if(hasBlank(formFuns.value.getFormValue().cvencode)||hasBlank(formFuns.value.getFormValue().cwhcode)){
    return message.error('表头供应商和仓库不能为空!!')
  }
  // 来源单据不为空
  if(!hasBlank(sourcetData.value)){
    let sourcetDate=sourcetData.value.ddate+" 00:00:00"
    // 是否早于来源单据日期
    if(dayjs(formFuns.value.getFormValue().ddate).isBefore(dayjs(sourcetDate))){
      return createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '单据日期不能大于来源单据日期!'
      })
    }
  }
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  if(status.value==1){
    formItems.value.ccode =  await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  }
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = "0"
  // 去除格式化
  formItems.value.theDeposit = !hasBlank(formItems.value.theDeposit)?formItems.value.theDeposit.replace(/\$\s?|(,*)/g, ''):''
  formItems.value.cmakerTime=!hasBlank(cmakerTime.value)?cmakerTime.value:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")

  getDataSource().forEach(a=>{
    if(hasBlank(a.cwhcode)&&!hasBlank(a.cinvode)){
      a.cwhcode=formItems.value.cwhcode
    }
  })

  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity))
  // 上游单据明细
  let symxList:any=[]

  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp'))))
    for (let i = 0; i < list.length; i++) {
      let o=list[i]
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      // o['isGive'] = o['isGive']||o['isGive']=='1'?'1':'0'
      // 含税单价、价税金额==0，强制 是 赠品
      if(parseFloat(o.taxprice)==0&&parseFloat(o.isum)==0){
        o['isGive'] = '1'
      }
      o['cwhcode1'] = o['cwhcode']
      if (o.cangkuDuli == '0'){
        let arr =  o['tempCangkuId']
        for (let j = 0; j < arr.split('\\').length; j++) {
          o[`cwhcode${j+1}`] = arr.split('\\')[j]
        }
      }
      // 有上游单据
      if(!hasBlank(o.sourcedetailId)){
        // 上游单据子表数据
        let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(o.sourcedetailId)
        // 参照并且是新增
        if(canzhao.value&&status.value==1){
          sourceData.isumDaohuo=hasBlank(sourceData.isumDaohuo)?o.baseQuantity:parseFloat(sourceData.isumDaohuo)+(parseFloat(o.baseQuantity))
        }else{
          // 一元二次方程
          sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)+(parseFloat(o.baseQuantity)-parseFloat(o.oldBaseQuantity))
        }
        symxList.push(sourceData)

        if(o.sourcetype=='CGRKD'){
          o.isumRuku=o.baseQuantity
        }
      }
    }
    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)

    // 在编辑状态下
    else if(status.value===2){
      // 被删除的行
      if(rowDelData.value.length>0){
        rowDelData.value.forEach(async (a)=>{
          let baseQuantity=a[0].baseQuantity
          // 有上游单据
          if(canzhao.value){
            // 减去对应的上游单据明细 累计到货数量
            let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(a[0].sourcedetailId)
            sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)-parseFloat(baseQuantity)
            await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])
          }
        })
      }
    }
    // 有上游单据
    if(canzhao.value){
      //上游单据主表
      Array.from(new Set(symxList.map(s=>s.ccode))).forEach(async (main)=>{
        // 修改上游主表信息
        let syMain=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(main)
        // 添加下游表
        if(canzhao.value&&status.value==1){
          let xy={iyear:dynamicYear.value,billStyle:syMain.billStyle,ccode:main,ccodeDate:syMain.ddate,xyBillStyle:'CGDHD',xyccode:formItems.value.ccode,xyccodeDate:formItems.value.ddate}
          await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
        }
      })
    }

    loadMark.value=true
    formItems.value.sourcetype=list[0].sourcetype
    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(symxList)
    tempTaskDel(taskInfo.value?.id)
    // 删除参照任务锁定表
    if(referTaskList.value.length>0){
      for (let i = 0; i < referTaskList.value.length; i++) {
        tempTaskDel(referTaskList.value[i].id)
      }
    }
    /************** 记录操作日志 ****************/
    saveLogData(status.value==1?'新增':'修改')
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    await contentSwitch('curr','')
    status.value = 3
  }
}
// 变动后保存
async function saveBiandong() {
  if(!biandongOper.value) pageReload();
  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    for (let i = 0; i < list.length; i++) {
      list[i].isGive=list[i].isGive||list[i].isGive=='1'?'1' : '0'
      list[i].isBatch=list[i].isBatch||list[i].isBatch=='1'?'1' : '0'
      // 上游单据明细
      let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(list[i].sourcedetailId)
      if(!hasBlank(list[i].sourcedetailId)&&list[i].sourcetype!=='CGRKD'){
        // 数量变小
        if(parseFloat(list[i].baseQuantity)<parseFloat(list[i].oldBaseQuantity)){
          // 在途到货减差额
          let cha:any=parseFloat(list[i].oldBaseQuantity)-parseFloat(list[i].baseQuantity)
          // 减去对应的上游单据明细 累计到货数量
          sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)-(parseFloat(cha))
          await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])
        }
        else{
          // 在途到货减差额
          let cha:any=parseFloat(list[i].baseQuantity)-parseFloat(list[i].oldBaseQuantity)
          // 加对应的上游单据明细 累计到货数量
          sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)+(parseFloat(cha))
          await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])
        }
      }
    }
    // 新编码
    let newccode=await useRouteApi(getBianDongNewCcode, {schemaName: dynamicTenantId})(formItems.value.ccode)

    formItems.value.biandong='1'
    // 变更前主数据
    await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(formItems.value.ccode)
    .then(async (a)=>{
        a.id=null
        a.ccode=a.ccode+'-'+newccode
        a.biandong='1'
        a.biandongUser=useUserStoreWidthOut().getUserInfo.id
        a.baindongDate=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
        a.theDeposit = !hasBlank(a.theDeposit)?a.theDeposit.replace(/\$\s?|(,*)/g, ''):''
        // to变更表
         await useRouteApi(saveStockWarehousingPOJO, {schemaName: dynamicTenantId})(a)
      })
    // 变更前子数据
    await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode,type:'CGDHD'})
    .then(async (a)=>{
        a.forEach(item=>{
          item.id=null
          item.ccode=item.ccode+'-'+newccode
          item.biandong='1'
          item.biandongUser=useUserStoreWidthOut().getUserInfo.id
          item.baindongDate=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
        })
        // to变更zi表
        await useRouteApi(saveStockWarehousingsListPOJO, {schemaName: dynamicTenantId})(a)
    })
    // 主数量合计
    formItems.value.squantity=sumArr(list.map(a=>a.baseQuantity))
    await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
    await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list)

    // 执行有删除行的
    if(rowDelBianDongData.value.length>0){
      rowDelBianDongData.value.forEach(async (a)=>{
        await useRouteApi(deleteByStockWarehLineCode, {schemaName: dynamicTenantId})(a.lineCode)
      })
    }
    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData('变更')
    /************** 记录操作日志 ****************/
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
    await contentSwitch('curr','')
  }
  if(!hasBlank(taskInfo.value)){
    tempTaskDel(taskInfo.value?.id)
  }
  // 删除参照任务锁定表
  if(referTaskList.value.length>0){
    for (let i = 0; i < referTaskList.value.length; i++) {
      tempTaskDel(referTaskList.value[i].id)
    }
  }
  calculateTotal()
  tableSelectedRowKeys.value = []
  status.value = 3
  biandong.value = '0'
  canzhao.value=false
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
    let variable:any = formItems.value.handleDate.substring(0, 7)
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
  timeout = setTimeout(fake, 100);
}

const mark = usePlatformsStore().getCurrentPlatformId
const visible = ref(false);
const windowWidth = (window.innerWidth - (70))
const totalColumnWidth = ref(0)
const dynamicColumnData = ref({value:[]})
const tableRef:any = ref(null)
const lanMuData = ref({
  accId: dynamicTenantId.value,
  menuName: '采购到货单123新增',
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
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [printModalRegister, {openModal: openpPintModalPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerSySourcePage, {openModal: openSySourcePage}] = useModal()
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
  let o:any = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  record.isumRuku = record.isumRuku
  record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName

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
  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo:any =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo) {
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1') {
        r['cwhcode'] = h.cwhcode
        r['cwhcodeText'] = cangkuInfo.ckName
      }
    }
  }
  r.itaxrate=isNaN(r.itaxrate)?0:r.itaxrate
  switch (c) {
    case 'cgUnitId':
      if(!hasBlank(r.cgUnitId)) biandongOper.value=true
      break;
    case 'cnumber':
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'itaxrate')
      }
      else{
        slChange0(r)
      }
      // 获取供应商价格表
      findBySupPrice(r)
      if(!hasBlank(r.cnumber)) biandongOper.value=true

      if(biandong.value=='1'){
        // 获取可用量
        let verifyKeyong= await useRouteApi(verifyStockRowXCL, {schemaName: dynamicTenantId})({queryType:'keyong',cinvode:r.cinvode,cwhcode:r.cwhcode,batchId:r.batchId,dpdate:r.dpdate,dvdate:r.dvdate,iyear:dynamicYear.value,rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck})
        console.log('数量='+r.cnumber)
        console.log('原数量='+r.oldCnumber)
        console.log('累计入库='+r.isumRuku)
        console.log('获取可用量='+verifyKeyong)
        console.log(r)
        // 没有上游单据
        if(hasBlank(r.sourcedetailId)){
          // 检查变动后到货单主数量是否大于等于累计入库数量
          if(parseFloat(r.baseQuantity)<parseFloat(hasBlank(r.isumRuku)?'0':r.isumRuku)){
            r.cnumber=null
            r.baseQuantity=null
            return message.error('到货单已生成下游采购入库单据，到货单数量不能小于下游入库单数量，请重新输入变动数量！')
          }
          // 检查变动后到货单主数量是否大于等于累计开票数量
          else if(parseFloat(r.baseQuantity)<parseFloat(hasBlank(r.isumFapiao)?'0':r.isumFapiao)){
            r.cnumber=null
            r.baseQuantity=null
            return message.error('到货单已生成下游采购发票单据，到货单数量不能小于下游发票数量，请重新输入变动数量！')
          }
          // 检查变动后到货价税合计是否大于等于累计核销金额
          else if(parseFloat(r.isum)<parseFloat(hasBlank(r.hxIsum)?'0':r.hxIsum)){
            r.cnumber=null
            r.isum=null
            r.baseQuantity=null
            return message.error('到货单已完成部分付款核销，到货单价税合计不能小于已付款核销金额，请重新输入价税合计！')
          }

          // 若到货数量变小，请检查变动差额是否大于等于可用量
          if(verifyKeyong.length>0){
            let baseQuantity=parseFloat(r.baseQuantity)
            let oldBaseQuantity=parseFloat(hasBlank(r.oldBaseQuantity)?'0':r.oldBaseQuantity)
            // 小于
            if(parseFloat(r.cnumber)<parseFloat(hasBlank(r.oldBaseQuantity)?'0':r.oldBaseQuantity)){
              let cha=oldBaseQuantity-baseQuantity
              let keyong=verifyKeyong[0]?.keyong
              console.log('变更后差值:'+cha)
              console.log('可用量:'+keyong)
              if(cha<keyong){
                r.cnumber=null
                r.baseQuantity=null
                return message.error('到货单数量变动后减少，致当前存货可用量不足，请重新输入变动数量！')
              }
            }
          }
        }
        else if(!hasBlank(r.sourcedetailId)){
          // 上游单据子表数据
          let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(r.sourcedetailId)
          console.log('变更前主数量:'+r.baseQuantity)
          console.log('变更后主数量:'+r.oldBaseQuantity)

          // 到货单数量变大
          if(parseFloat(r.baseQuantity)>parseFloat(r.oldBaseQuantity)){
            let cha:any=parseFloat(r.baseQuantity)-parseFloat(r.oldBaseQuantity)
            console.log('数量变大后差值:'+cha)
            console.log('上游来源单据数量:'+sourceData.baseQuantity+'--来源单据累计到货数量-->'+sourceData.isumDaohuo+'--差额->'+(parseFloat(sourceData.baseQuantity)-parseFloat(sourceData.isumDaohuo)))
            // 到货单主数量变更差额是否小于等于上游来源单据数量-累计到货数量
            if(parseFloat(cha)>(parseFloat(sourceData.baseQuantity)-parseFloat(sourceData.isumDaohuo))){
              r.cnumber=null
              r.baseQuantity=null
              return message.error('到货单变动数量不能大于来源单据累计到货数量，请重新输入变动数量!')
            }
          }
        }
      }
      else{
        // 是参照，数量小于参照单据数量
        if(canzhao.value&&r.cnumber>r.canzhaoCnumber){
          console.log('到货单：--->数量是否小于等于参照单据-->cnumber-->'+r.cnumber+'===canzhaoCnumber--->'+r.canzhaoCnumber)
          r.cnumber=null
          r.tempCnumber=r.cnumber
          message.error('修改数量必须小于等于参照单据!')
        }
        // 不是参照，数量小于原数量,检查可用量
        if(!canzhao.value&&r.cnumber<r.oldCnumber){
          console.log('到货单：--->数量是否小于等于原数量-->'+r.cnumber,r.oldCnumber)
          let verifylist:any=[]
          let temp2:any={}
          temp2.iyear=r.iyear
          temp2.stockNum=r.cinvode
          temp2.stockName=r.cinvodeName
          temp2.stockGgxh=r.bcheck1
          temp2.cwhcode=r.cwhcodeText
          temp2.batchId=r.batchId
          temp2.dpdate=r.dpdate
          temp2.dvdate=r.dvdate
          temp2.baseQuantity=r.baseQuantity
          temp2.lackBaseQuantity=''
          temp2.unitName=r.unitList.filter(uni=>uni.value==r.cgUnitId)[0]?.title
          verifylist.push(temp2)

          let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'keyong',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
          // 如果是负数强制转换成正数比较;可用量不能等于0
          currData=currData.map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
          if(currData.length>0){
            return openLackPage(true,{data:currData,queryType:'keyong',dynamicTenantId:dynamicTenantId.value})
          }
        }
      }
      break;
    case 'dvdate':
      if (r.cinvodeInfo?.stockIndateManage == '1'){
        r.dpdate = formatTimer(dayjs(formatTimer(r.dvdate), dateFormat).subtract(parseInt(r.cinvodeInfo?.stockIndateDuration), 'day').add(1, 'day'))
        r.tempDpdate=r.dpdate
      }
      break;
    case 'dpdate':
      if (r.cinvodeInfo?.stockIndateManage == '1'){
        r.dvdate = formatTimer(dayjs(formatTimer(r.dpdate), dateFormat).add(parseInt(r.cinvodeInfo?.stockIndateDuration), 'day').subtract(1, 'day'))
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
    case 'itaxrate':// 税率 【itaxprice 税额】
      if(!hasBlank(r.cnumber)){
        let str=''
       if(!hasBlank(r.taxprice)){
          str='taxprice'
        }else if(!hasBlank(r.isum)){
          str='isum'
        }
        tableDataChange(r,str)
      }
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.cnumber)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = hasBlank(r.taxprice)?0:parseFloat(r.taxprice).toFixed(10)
        r.isum = parseFloat(String(n * d )).toFixed(4)
        r.tempIsum = r.isum

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额=价税合计÷税率
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):0
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.cnumber)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = hasBlank(r.isum)?0:parseFloat(r.isum).toFixed(4)

        r.taxprice = d/n>0?parseFloat(String(d/n) ).toFixed(10) + '':0
        r.tempTaxprice = r.taxprice

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):0
      }
      break;
    case 'itaxprice':
      // 获取旧数据
      let oldData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(r.lineCode)
      console.log('税额1='+parseFloat(oldData.itaxprice))
      console.log('税额2='+parseFloat(r.itaxprice))
      console.log('税额单行容差='+dynamicTenant.value.target?.cgDhRc)
      if(!hasBlank(dynamicTenant.value.target?.cgDhRc)&&parseFloat(dynamicTenant.value.target?.cgDhRc)!=0&&Math.abs(parseFloat(oldData.itaxprice)-parseFloat(r.itaxprice))>parseFloat(dynamicTenant.value.target?.cgDhRc)){
        r.itaxprice=oldData.itaxprice
        r.tempItaxprice=r.itaxprice
        r.icost=oldData.icost
        r.tempTen =r.icost
        return message.error('税额单行容差不能超过【'+dynamicTenant.value.target?.cgDhRc+'】')
      }
      r.icost=r.isum-r.itaxprice
      r.tempTen=r.icost
      break;
    case 'price':
      if (!hasBlank(r.cnumber) && !hasBlank(r.price)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        if (titleValue.value == 0 && n < 0) n = 0 - Math.abs(n)
        let d:any = parseFloat(r.price).toFixed(10)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        if (titleValue.value == 0 && d < 0) d = Math.abs(d)

        r.icost = titleValue.value == 0?parseFloat(String(n * d)).toFixed(4) + '':parseFloat(String(n * d)).toFixed(4)*-1
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
  }
  calculateTotal()
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
  if(record.unitList.length>0&&!canzhao.value){
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
    if(canzhao.value){
      // 参照入库单，重新计算单价
      tableDataChange(r,'price')
    }else{
      tableDataChange(r,'taxprice')
    }
  }
}
const chChange = async (record) => {
  findByUnitList(record)
  record.baseQuantity=null
  record.subQuantity1=null
  await findByPrice(record)
}
const {proxy}:any = getCurrentInstance()

const isGiveChange = (r) => {
  if (r.isGive){
    r.tempNine=0;
    r.tempTen=0;
    r.tempTaxprice=0;
    r.tempIsum=0;
    r.price=r.tempNine
    r.icost=r.tempTen
    r.taxprice=r.tempTaxprice
    r.isum=r.tempIsum
    tableDataChange(r,'taxprice')

    // 重新计算合计行
    setTimeout(()=>{
      calculateTotal()
    },200)
  }else {
    message.info('请完善单价！')
  }
}
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
  // 查找下一个
  let list = getDataSource();
  let filters:any = ['bcheck1','isGive','cinvodeType','cinvodeName','cunitid','cunitidF1','cunitidF2','baseQuantity','subQuantity1', 'subQuantity2','price','icost']
  // 要求填批号才填写
  if (!r.isBatch)filters.push('batchId')
  if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
  if(status.value==1){ filters.push('itaxprice') }
  // 单计量跳过计量1、2
  // if (r.cunitType=='1')filters.push('subQuantity1'),filters.push('subQuantity2');
  let cols:any = getColumns().filter(it=>it?.title!='序号' &&  filters.indexOf(it?.dataIndex) == -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0]?.dataIndex // 获取下一个列位置

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
  let model = {cnumber:'Cnumber',cgUnitId:'CgUnitId',cwhcode:'One',cinvode:'Two',taxprice:'Taxprice',itaxrate:'Itaxrate',isum:'Isum',batchId:'Twelve',dpdate:'Dpdate',dvdate:'Fifteen',cmemo:'Thirteen',itaxprice:'Itaxprice'}
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
  let memberprice=supPrice!==''?supPrice.memberprice:0

  if(supPrice!==''){
    // 供应商价格表含税（默认值1是，0或空否）
    if(dynamicTenant.value.target.cgPriceIsRate=='1'){
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
    if(dynamicTenant.value.target.cgPriceZjyc=='1'){
      let temp= await useRouteApi(findByStockWareRecentlySupMoney, {schemaName: dynamicTenantId})({supId:formFuns.value.getFormValue().cvencode})
      memberprice=temp==''?0:temp
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

// 查看来源数据
function sySourcePop() {
  if(formItems.value.ccode==undefined){
    return message.error(`没有来源数据！`)
  }
  openSySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}
// 查看下游数据
function xySourcePop() {
  if(formItems.value.ccode==undefined){
    return message.error(`没有下游数据！`)
  }
  openXySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}

// 生成采购入库单
async function setCGRKD_data() {
  loadMark.value=true
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:ddate.split('-')[0],month:ddate.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      loadMark.value=false
      return message.error('当前单据业务期间已经结账，不能进行生单操作，请取消期间结账后继续！！')
    },1000)
  }

  // 有无 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'生单'})
  if(!hasBlank(xclTaskData)){
    loadMark.value=false
    return message.error('当前单据正在被'+xclTaskData.caozuoName+'操作员进行'+xclTaskData.method+'业务处理，任务互斥，请销后再试！')
  }

  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  ddate,prefix: "",key: '3-10'})

  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })

  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let list2:any =JsonTool.parseObj(res.entryList).map(it => resetRow(it))

  if(res.sourcetype=='CGRKD'){
    loadMark.value=false
    return message.error('当前到货单为参照采购入库单生成，不能进行采购入库单循环生单操作！')
  }

  createConfirm({
    iconType: 'warning',
    title: '生成采购入库单',
    content: '您确定要生成采购入库单吗!',
    onOk: async () => {
      // 生成入库单明细
      let listarr:any=[]
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})

        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumRuku)?0:oldData[0]?.isumRuku))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='CGRKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.isumDaohuo=temp.baseQuantity
        temp.isumJiesuan='0'
        temp.sourcetype='CGDHD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.baccFlag=dynamicTenant.value.target.apSourceFlag
        temp.baccUser=dynamicTenant.value.target.apSourceFlag=='1'?useUserStoreWidthOut().getUserInfo?.id:''
        temp.baccDate=dynamicTenant.value.target.apSourceFlag=='1'?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
        temp.priceZangu=temp.price
        temp.icostZangu=temp.icost
        temp.cmakerTime=newDate.value
        if(baseQuantity>0){
          listarr.push(temp)
        }
      }
      if(listarr.length==0){
        message.error('数量不足，无法生成采购入库单')
        return false;
      }
      list2.forEach(async (temp)=>{
        let data=listarr.filter(a=>a.cinvode==temp.cinvode&&(hasBlank(a.batchId)?'':a.batchId)==(hasBlank(temp.batchId)?'':temp.batchId)&& (hasBlank(a.dpdate)?'':a.dpdate)==(hasBlank(temp.dpdate)?'':temp.dpdate)&&(hasBlank(a.dvdate)?'':a.dvdate)==(hasBlank(temp.dvdate)?'':temp.dvdate))
        temp.tempBaseQuantity=parseFloat(hasBlank(data[0]?.baseQuantity)?0:data[0]?.baseQuantity)
        temp.isumRuku=parseFloat(hasBlank(temp.isumRuku)?0:temp.isumRuku)+parseFloat(hasBlank(data[0]?.baseQuantity)?0:data[0]?.baseQuantity)
      })
      // 修改本单据子表的 累计入库数量
      await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list2)

      // 生成入库单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGRKD'
      formItems.value.bcheck='0'
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.sourcetype='CGDHD'
      formItems.value.sourcecode=oldNum
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))
      // formItems.value.jiesuanStatus=dynamicTenant.value.target.apSourceFlag
      formItems.value.cmakerTime=newDate.value
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(listarr)
      // 添加下游表
      let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
      await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
      await contentSwitch('curr','')
      message.success(`生成采购入库单成功！`)
      loadMark.value=false
      // 跳转入库单页面
      router.push({name:'CaigouRk',params:{type:'info',ccode:newRuKuNum}})
    }
  })
}
// 生成退货单
async function setCGTHD_data() {
  loadMark.value=true
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:ddate.split('-')[0],month:ddate.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      loadMark.value=false
      return message.error('当前单据业务期间已经结账，不能进行变更操作，请取消期间结账后继续！！')
    },1000)
  }

  // 有无 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'生单'})
  if(!hasBlank(xclTaskData)){
    loadMark.value=false
    return message.error('当前单据正在被'+xclTaskData.caozuoName+'操作员进行'+xclTaskData.method+'业务处理，任务互斥，请销后再试！')
  }

  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGDHD",date:  ddate,prefix: "",key: '3-1'})
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })
  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))

  let verifylist:any=[]
  for (let i = 0; i < list.length; i++) {
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
  // 可用量不足 弹出框提示
  let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'keyong',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:titleValue.value,iyear:dynamicYear.value})
  // 如果是负数强制转换成正数比较;可用量不能等于0
  currData=currData.map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
  console.log('弃审判断可用量：'+currData)
  if(currData.length>0){
    loadMark.value=false
    return  openLackPage(true,{data:currData,queryType:'keyong',dynamicTenantId:dynamicTenantId.value})
  }

  createConfirm({
    iconType: 'warning',
    title: '生成采购退货单',
    content: '您确定要生成采购退货单吗!',
    onOk: async () => {
      // 生成入库单明细
      let listarr:any=[]
      titleValue.value=1
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})
        let cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumTuiHuo)?0:oldData[0]?.isumTuiHuo))/parseFloat(unitRate?.conversionRate)
        temp.cnumber=parseFloat(cnumber)*-1
        temp.tempCnumber=temp.cnumber

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='CGDHD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.sourcetype='CGDHD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.cmakerTime=newDate.value
        if(cnumber!=0){
          listarr.push(temp)
        }
      }
      if(listarr.length==0){ return message.error('数量不足，无法生成采购退货单') }
      titleValue.value=0
      res.id=null
      res.sourcetype='CGDHD'
      res.sourcecode=oldNum
      formItems.value.cmakerTime=newDate.value
      res.entryList = JsonTool.json(listarr)
      loadMark.value=false
      // 跳转入库单页面
      router.push({path:'cg-return',query:{type:'add',ccode:JSON.stringify(res)}})
    }
  })
}
// 生成采购发票
const setCGFP_data = () => {
  loadMark.value=true
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }
  createConfirm({
    iconType: 'warning',
    title: '生成采购发票',
    content: '您确定要生成采购发票吗？',
    onOk: async () => {
      let oldNum=formItems.value.ccode
      let oldddate=formItems.value.ddate
      let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGFP",date:  ddate,prefix: "",key: '3-2'})
      let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
        type: pageParameter.type,
        iyear: dynamicYear.value || '2022',
        action: 'tail',
        ccode: formItems.value.ccode,
        bdocumStyle: '0',
        curr: ''
      })

      // 生成入库单明细
      let listarr:any=[]
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})

        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumFapiao)?0:oldData[0]?.isumFapiao))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity
        // 计算主计量....
        slChange0(temp)
        findByUnitList(temp)
        temp.id=null
        temp.isGive=false
        temp.isBatch=false
        temp.bdocumStyle='0'
        temp.billStyle='CGFP'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.key=temp.lineCode
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumTuiHuo='0'
        temp.isumDaohuo='0'
        temp.isumRuku='0'
        temp.isumFapiao='0'
        temp.isumFapiaoMoney='0'
        temp.isumJiesuan='0'
        temp.hxIsum='0'
        temp.sourcetype='CGDHD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        // 规格型号、条形码
        // temp.cinvodeType=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.ggxh
        // temp.bcheck1=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.barcode

        // 存货信息
        let stockInfo2=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(temp.cinvode)
        temp.cinvodeInfo = stockInfo2

        if(baseQuantity>0){
          listarr.push(temp)
        }
      }

      if(listarr.length==0){
        message.error('数量不足，无法生成采购发票')
        return false;
      }

      // 生成入库单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGFP'
      formItems.value.bcheck='0'
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.sourcetype=oldNum
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))

      message.success(`跳转采购发票页签！`)
      let dataArr={
        data:formItems.value,
        mx:JSON.stringify(listarr)
      }
      loadMark.value=false
      // 跳转入库单页面
      router.push({path:'cg-bill',query:{type:'cgdd',json:JSON.stringify(dataArr)}})
    }
  })
}

function sumArr(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}
function sumSub(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) - parseFloat(curr);
  });
}
function openPrint(){
  openpPintModalPage(true, {schemaName: dynamicTenantId.value})
}

const showPrintSetting = ref(false)
function openPrintSetting(){
  showPrintSetting.value = true
}

async function findByBdocumStyle() {
  contentSwitch('tail','')
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
      year: '',mark:  router.currentRoute?.value?.fullPath.replace('/',''),
      pageName:'采购到货单'
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
    etc.cvencode = getCustName(etc.cvencode)
    etc.cvencodeJs =  getCustName(etc.cvencodeJs)
    etc.cwhcode = ckListOptions.value.filter(it => it.id == etc.cwhcode)[0]?.ckName
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(formFuns.value.getSelectMap()['dept']?.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.cpersoncode = hasBlank(etc.cpersoncode)?'':getUserName(etc.cpersoncode)
    etc.bcheckUser = etc.bcheck == null?'': formatUniqueOperator(etc?.bcheckUser)
    etc.cmaker = formatUniqueOperator(etc?.cmaker)
    dataArr.forEach((item,index)=>{
      item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):ckListOptions.value.filter(it => it.id == item.cwhcode)[0]?.ckName
      item['cgUnitId'] = cunitFormat(item.unitList,item.cgUnitId)
      item['cnumber'] =  parseFloat(item.cnumber).toFixed(2)
      item['cunitid'] = cunitFormat(item.unitList,item.cunitid)
      item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
      item['taxprice'] =  parseFloat(item.taxprice).toFixed(2)
      item['isum'] = parseFloat(item.isum).toFixed(2)
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
const getCustName = (v) => {
  return setString((custList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getUserName = (v) => {
  return (userList.value.filter(it => it.value == v)[0]?.label || '')
}
//js切割字符串
function setString(str, len) {
  if(hasBlank(str)) return
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
    }
    tableDataChange(record,'cnumber')
  }  else{
    tableDataChange(record,'taxprice')
  }
}

async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  slChange0(record)
}

/*变更专区*/
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}


const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
  })
}

function openItems() {
  if (hasBlank(formItems.value.ccode) || formItems.value.biandong != '1'){
    message.info('暂未发现任何单据！')
  }else {
    openItemsSourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'CGDHD',datas: {ck:ckListOptions.value,oper:operatorList.value}
    })
  }
}

function referData(type) {
  sourceType.value=type
  if(type=='CGDD'){
    if(hasBlank(formFuns.value.getFormValue().cvencode)){
      return message.error('请选择供应商！')
    }
  }else{
    if(hasBlank(formFuns.value.getFormValue().cvencode)){
      return message.error('请选择供应商！')
    }
    if(hasBlank(formFuns.value.getFormValue().cwhcode)){
      return message.error('请选择仓库！')
    }
  }
  openReferPage(true, {
    dynamicTenantId:dynamicTenantId.value,
    dynamicAccId:dynamicAccId.value,
    cwhcode:formFuns.value.getFormValue().cwhcode,
    cvencode:formFuns.value.getFormValue().cvencode,
    iyear:formFuns.value.getFormValue().ddate.split('-')[0],
    titleValue:titleValue.value,
    ddate:formFuns.value.getFormValue().ddate,
    referType:type
  })
}
// 参照回调 明细list
async function referThrowData(data) {
  referTaskList.value=data.taskList
  tempType.value='one'
  canzhao.value=true
  for (let i = 0; i < data.list.length; i++) {
    let b=data.list[i]
    findByUnitList(b)
    let o:any = assetsCardList.value.filter(it => (it.stockNum == b.cinvode))[0]
    b.cinvodeInfo = o
    b.tempCnumber=b.cnumber
    b.isumRuku='0'
    b.isumDaohuo='0'
    b.itaxrate=formFuns.value.getFormValue().rate
    slChange0(b)
  }
  for (let i = data.list.length; i < 50; i++) {
    data.list.push({})
  }
  loadMark.value=true
  setTimeout(()=>{
    setTableData(data.list)
    loadMark.value=false
  },800)
}

// 复制
const copyFun = async () => {
  // loadMark.value=true
  status.value = 2
  stockWareData.value=''

  // 获取最新
  let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  formFuns.value.setFormValue({
    id:null,
    ddate: useCompanyOperateStoreWidthOut().getLoginDate,
    ccode: code,
    cvencode: formItems.value.cvencode,
    cvencodeJs: formItems.value.cvencodeJs,
    cvencodeContact: formItems.value.cvencodeContact,
    invoiceStyle: formItems.value.invoiceStyle,
    methodPay: formItems.value.methodPay,
    payDate: formItems.value.payDate,
    theDeposit: formItems.value.theDeposit,
    rate: formItems.value.rate,
    cdepcode: formItems.value.cdepcode,
    cpersoncode: formItems.value.cpersoncode,
    cmemo: formItems.value.cmemo,
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

// 条形码弹框
const [registerBarCodeModalPage, {openModal: openBarCodePageM}] = useModal()
const openCodePage = () => {
  openBarCodePageM(true, {
    dynamicTenant:dynamicTenant.value,
  })
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
  await formFuns.value.setFormValue({ccode: v })
  nextTick(async ()=>contentSwitch('tail',v))
}
/********** 单据搜索 *********/
import { onBeforeRouteLeave } from 'vue-router'
import {
  deleteByCcodeDaohuo,
  delJiesuansByCcodeRuku,
  getNewStockJiesuanNum,
  saveJiesuanPojo,
  saveJiesuansPojo
} from "/@/api/record/stock/stock-jiesuan";
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

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;
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
