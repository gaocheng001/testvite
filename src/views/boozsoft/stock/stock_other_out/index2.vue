<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" @reloadTable="dynamicAdReload" :readonly="status != 3?'':'false'"  :dataFun="accountPickerFuns"/></div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn" @click="router.push('/kc-xsDepot-list')">查询</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Popover placement="bottom">
            <template #content>
              <span class="group-btn-span-special">&nbsp;借入还回单&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;借出借用单&emsp;</span>
            </template>
            <Button class="actod-btn" v-if="status == 1 || status == 2">参照</Button>
          </Popover>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit('edit')"
                  v-if="status == 3 && formItems.bcheck != '1'">修改
          </Button>
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
          <Button class="actod-btn" v-if="status == 3 && formItems.bcheck == '1'">联查</Button>
          <Button class="actod-btn" v-if="status == 3" @click="startCopyBefore">复制</Button>
          <Popover placement="bottom">
            <template #content>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn" v-if="status == 3">更多</Button>
          </Popover>
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div >
          <div class="acttd-right-d-search"  v-show="status == 3">
            <ReceiptSearch  :default-data="searchData" :dynamic-tenant-id="dynamicTenantId" @toggle="toReceipt"/>
          </div>
          <div class="acttd-right-d-btns"  v-show="status == 3">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom" v-model:visible="visible">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
            <Popover placement="bottom">
              <template #content>
                <span class="group-btn-span-special2" @click="titleValue = 0;contentSwitch('tail')"
                      :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white',width:'170px'}:{width:'170px'}">
                &nbsp;蓝字单据&ensp;<CheckOutlined v-if="titleValue===0"/></span><br/>
                <span class="group-btn-span-special2" @click="titleValue = 1;contentSwitch('tail')"
                      :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white',width:'170px'}:{width:'170px'}">
                &nbsp;红字单据&ensp;<CheckOutlined v-if="titleValue===1"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
          <div class="acttd-right-d-btns" v-show="status == 1">
            <Button class="acttdrd-btn" @click="openCodePage">
              <BarcodeOutlined :style="{ fontSize: '14px' }"/>
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
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>
            <span v-if="status=='3'" class="anticon" style="margin-left: 1em">
              <Tag v-if="formItems.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="formItems.hxFlag=='1'">
                已核销
              </Tag>
              <Tag :color="'volcano'" v-if="false">
                已开票
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;"
                :style="{color: titleValue===0?'#0096c7':'red'}">{{
              titleContents[titleValue]
            }}</span>
          <span style="display: inline-block;width: 280px;"></span>
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
            <template v-if="record.editOne  &&　!biandong">
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
            <template v-if="record.editTwo  &&　!biandong">
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
                  @keyup.enter="chFocus = 'one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">
                <span class="a-table-font-arial">{{ record.cinvode }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeName="{ record }">
            <template v-if="record.editEleven  &&　!biandong">
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
            <template v-if="record.editThree  &&　!biandong">
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

          <template #xsUnitId="{ record }">
            <template v-if="record?.editCunit &&　!biandong">
              <Select v-model:value="record.tempCunit"
                      class="xsUnitId"
                      :options="record.unitList"
                      style="width: 82%;"
                      @keyup.enter="focusNext(record,'xsUnitId')"/>
              <CheckOutlined @click="record.editCunit = null;record.xsUnitId=record.tempCunit;tableDataChange(record,'xsUnitId')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'" @click="record.tempCunit=record.xsUnitId,record.oldXsUnitId=record.xsUnitId,record.editCunit = true;">
                <span>{{cunitFormat(record.unitList,record.xsUnitId)}}</span>
              </div>
            </template>
          </template>
          <template #quantity="{ record }">
            <template v-if="record?.editQuantity  &&　!biandong">
              <InputNumber v-model:value="record.tempQuantity"
                           class="quantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'quantity')"/>
              <CheckOutlined @click="record.editQuantity = null;record.quantity=record.tempQuantity;tableDataChange(record,'quantity')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempQuantity=record.quantity,record.beseOld=record.quantity,record.editQuantity = true;">
                    <span class="a-table-font-arial">{{
                        (record.quantity == null ? '' : parseFloat(record.quantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
            </div>
          </template>
          <template #cunitidF1="{ record }">
            <div v-if="record.cunitType != '1'">
              <span>{{cunitFormat(record.unitList,record.cunitidF1)}}</span>
            </div>
          </template>
          <template #cunitidF2="{ record }">
            <div v-if="record.cunitType != '1'">
              <span>{{cunitFormat(record.unitList,record.cunitidF2)}}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <template v-if="record?.editSix  &&　!biandong">
              <InputNumber v-model:value="record.tempSix"
                           class="baseQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="/*tableDataChange(record);*/focusNext(record,'baseQuantity')"/>
              <CheckOutlined
                @click="record.editSix = null;record.baseQuantity=record.tempSix;tableDataChange(record,'baseQuantity')"/>
            </template>
            <template v-else>

<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSix=record.baseQuantity,record.editSix = true;">-->
              <div>
                    <span class="a-table-font-arial">{{
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #subQuantity1="{ record }">
            <!--            <template v-if="record?.editSeven">
                          <InputNumber v-model:value="record.tempSeven" class="subQuantity1"
                                       :formatter="value => `${value}`.replace(/[^\d]/g, '')"
                                       style="width: 82%;"
                                       @keyup.enter="record.editSeven = null;record.subQuantity1=record.tempSeven;"/>
                          <CheckOutlined
                            @click="focusNext(record,'subQuantity1');"/>
                        </template>
                        <template v-else>
                          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                               @click="record.tempSeven=record.subQuantity1,record.editSeven = true;">
                                <span class="a-table-font-arial">{{
                                    (record.subQuantity1 == null ? '' : record.subQuantity1 + '').replace(/[^\d]/g, '')
                                  }}
                         </span>
                          </div>
                        </template>-->
            <span class="a-table-font-arial">{{
                (record.subQuantity1 == null || record.subQuantity1 == 0 ? '' : parseFloat(record.subQuantity1).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #subQuantity2="{ record }">
            <!--            <template v-if="record?.editEight">
                          <InputNumber v-model:value="record.tempEight" class="subQuantity2"
                                       :formatter="value => `${value}`.replace(/[^\d]/g, '')"
                                       style="width: 82%;"
                                       @keyup.enter="record.editEight = null;record.subQuantity2=record.tempEight;"/>
                          <CheckOutlined
                            @click="focusNext(record,'subQuantity2')"/>
                        </template>
                        <template v-else>
                          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                               @click="record.tempEight=record.subQuantity2,record.editEight = true;">
                               <span class="a-table-font-arial">{{
                                   (record.subQuantity2 == null ? '' : record.subQuantity2 + '').replace(/[^\d]/g, '')
                                 }}
                          </span>
                          </div>
                        </template>-->
            <span class="a-table-font-arial">{{
                (record.subQuantity2 == null || record.subQuantity2 == 0 ? '' : parseFloat(record.subQuantity2).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3 || biandong" size="small"
                    @change="record.price=0;record.icost=0"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve && record.isBatch　 &&　(!biandong && record.sourcecode==null)">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId" :readonly="titleValue == 0"
                     @keyup.enter="titleValue == 0?openSelectContent(record,'batchId'):focusNext(record,'batchId')">
                <template #suffix>
                  <FileSearchOutlined v-if="titleValue == 0" @click="openSelectContent(record,'batchId')"/>
                  <CheckOutlined v-else @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>
                </template>
              </Input>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwelve=record.batchId,record.editTwelve = true;">
                <span class="a-table-font-arial">{{ record.batchId }}</span>
              </div>
            </template>
          </template>
          <template #cmemo="{ record }">
            <template v-if="record?.editThirteen && !biandong">
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
            <template v-if="(!biandong && record.sourcecode==null)&&record?.editDpdate">
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
            <template v-if="record?.editFifteen　 &&　(!biandong && record.sourcecode==null)">
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
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
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
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <BatchSelector @register="registerBatchSelectorPage" @throwData="modalData"/>
    <Lack @register="registerLackPage" @modify="modelQuantity"/>
    <BarCode @register="registerBarCodeModalPage" />
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
import Query from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicHeadColumn.vue";
import BatchSelector from "/@/views/boozsoft/stock/stock_sales_add/component/BatchNumberSelector.vue";
import Import from "./popup/import.vue";
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
  VerticalRightOutlined,CopyOutlined,BarcodeOutlined
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
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
/**********************栏目设置**********************/
import {initDynamics} from "./data";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicForm";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";

import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
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
  saveCkdQt,
  unAuditBefore,
  reviewXsdd,
  reviewCkd,
  findbyStockSaleousingsCodeAndBillStyle,
  copyReceipt,
  operateBeforeCheck,
} from "/@/api/record/stock/stock-xhd";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import { findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import {findAll as findAllPrice} from "/@/api/record/stock/stock-price";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave, stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {getCkPriceList} from "/@/api/record/stock/stock_cost";
import dayjs from "dayjs";
import {findAvailability} from "/@/api/record/stock/stock-currents";
import Lack from '/@/views/boozsoft/stock/stock_sales_add/popup/lack.vue';
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {defaultRows} from "./component/DynamicForm";
import BarCode from "/@/views/boozsoft/stock/stock_sales_add/popup/barCode.vue";
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
const windowHeight = (window.innerHeight - 300)
const dynamicTenantId = ref('')
const dynamicTenant = ref(null)
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['其他出库单','其他出库单']
const titleValue = ref(0)
const formRowNum = ref(1)
const ymPeriod:any = ref(false)
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'QTCKD'
})
const summaryModel = ref({})
const formItems: any = ref({})
const jiList = ref([])
const manyJiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const cardListOptions = ref([])
const assetsCardList = ref([])
const stockPriceList = ref([])
const searchList = ref([])

let num = 0
const dynamicAdReload = async (obj) => {
  num+=1
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  lanMuData.value.accId = dynamicAccId.value
  let year = (useCompanyOperateStoreWidthOut().getLoginDate?.substring(0,4));
  dynamicYear.value = year || obj.stockYear
  searchData.value.year = year || obj.stockYear
  if (num != 2){
    await columnReload()
    await reloadList()
    lanMuData.value.changeNumber+=1
  }else {
    visible.value = true
    setTimeout(()=>
        visible.value = false
      ,100)
  }
}
const dynamicFormModel = ref([])
const formFuns = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value,router.currentRoute?.value?.meta?.title,defaultRows()) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const route = useRoute();

const routeData:any = route.query;
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
let markLen = 0
const pageReload = async () => {
  if(routeData.type!==undefined){
    if (!hasBlank(routeData.co) && dynamicTenant.value?.coCode !=routeData.co){
      accountPickerFuns.value.resetCoCode(routeData.co)
      return false
    }
    if (markLen!=0){
      await contentSwitch('curr')
      return false
    }
    if(routeData.type=='add'){
      await startEdit('add')
    }else if(routeData.type=='edit'){
      await contentSwitch('curr')
      await startEdit('edit')
    }else{
      await contentSwitch('curr')
    }
    markLen++
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
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
  })
}

async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: route.query?.ccode != null?route.query.ccode:( formFuns.value.getFormValue()?.ccode || ''),  bdocum: titleValue.value,
  })
  if (null != res) {
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }else {
      let list = []
      for (let i = 0; i < (25); i++) {
        list.push({})
      }
      setTableData(list)
    }
    pageParameter.searchConditon.value = ''
    searchList.value = []
    formItems.value.entryList = null
  } else {
    message.success('暂无数据！')
    formItems.value = {}
    formFuns.value.setFormValue({})
    let list = []
    for (let i = 0; i < (25); i++) {
      list.push({})
    }
    setTableData(list)
  }
  calculateTotal()
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
    },  {
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cinvodeBarcode'},
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
      dataIndex: 'xsUnitId',
      ellipsis: true,
      slots: {customRender: 'xsUnitId'},
    },{
      title: '数量',
      dataIndex: 'quantity',
      slots: {customRender: 'quantity'},
      ellipsis: true,
    },{
      title: '现存量',
      dataIndex: 'availability',
      ellipsis: true,
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
      title: '计量一',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
      align: 'left',
      width: 80
    },{
      title: '数量一',
      dataIndex: 'subQuantity1',
      ellipsis: true,
      slots: {customRender: 'subQuantity1'},
      width: 80,
    },
    {
      title: '计量二',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitidF2'},
      width: 80
    },
    {
      title: '数量二',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
      width: 80,
    }, {
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
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'isGive'},
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      ellipsis: true,
      width: 150, slots: {customRender: 'dpdate'}
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
  indexColumnProps:{fixed: true},
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
async function checkBusDate(date) {
  let dates = date.split('-')
  let list = await findStockPeriodInfoByYm({code:dynamicTenant.value.target.id,date: date})
  formItems.value.ddate = date
  if (list.length == 0){
    createWarningModal({title: "温馨提示",content: '当年度暂未创建，不能新增其他出库单，请先创建该年度'})
    return false;
  }else {
    if (list.filter(it=>it.istock == '1').length == list.length){
      createWarningModal({title: "温馨提示",content: '当年度已经全部结账，不能新增其他出库单，请切换公司代码或年度'})
      return false;
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 本年月结账
      // 得到当年最后一张销售出库单日期
      let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenantId})({year: dates[0],type:"XHD"}))
      formItems.value.ddate = n
    }
  }
  return true;
}
const startEdit = async (type) => {
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      formItems.value.ccode = await generateCode(busDate) // 生成编码
      formFuns.value.setFormValue({
        ddate: formItems.value.ddate,
        ccode: formItems.value.ccode,
        bstyle: '其他出库'
      })
    }
    showAvailability(true)
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
  } else {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'其他出库单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      // 任务不是当前操作员的
      if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[0].username+'正在修改销售出库单,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
      }
    }
    if (markLen != 0 && await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;
    status.value = 2
    // 以下单据只能修改 单价与金额
    biandong.value = ['调拨出库','盘亏出库','形态转换出库'].indexOf(formFuns.value.getFormValue()['bstyle'])!=-1
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }

}

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date,
    key: '3-11',
    prefix:'QT'
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
    if (await checkPeriod())return false;
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销售出库单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      if ( await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;
      tempTaskSave('删除')
      createConfirm({
        iconType: 'warning',
        title: '其他出库单删除',
        content: '您确定要进行其他出库单删除吗!',
        onOk: async () => {
          // 删除前校验
          if (['调拨出库','盘亏出库','形态转换出库','组装出库','拆卸出库'].indexOf(formItems.value.bstyle)!=-1) {
            createWarningModal({title: '温馨提示', content: '当前单据由来源“'+formFuns.value.getSelectMap()['method'].filter(it=>it.value==formItems.value.bstyle)[0]?.label+'”单据关联生成，不能直接删除单据，弃审来源单据时将自动删除！'})
          } else {
            if (formItems.value?.bdocumStyle=='1' ){
              let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
              if (!await stockCheck(JsonTool.parseProxy(list)))return false;
            }
            await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
            message.success('删除成功！')
            tempTaskDel()
            writeLog('删除',formItems.value,null)
            formItems.value.id = ''
            await contentSwitch('tail')
          }
        }
      });
    }else{
      // 任务不是当前操作员的
      if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[0].username+'正在修改销售出库单,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
      }
    }


  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    if ((b && !hasBlank(formItems.value.bcheckUser)) || (!b && hasBlank(formItems.value.bcheckUser))){
      createWarningModal({title: '温馨提示',content: '请勿重复操作！'})
    }else {
      let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'其他出库单',method:'修改,审核,弃审,删除',recordNum:formItems.value.ccode})
      if(taskData==''){
        tempTaskSave(b?'审核':'弃审')
      }else{
        // 任务不是当前操作员的
        if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[0].username+'正在操作销售出库单,不能同时进行操作！' });
        }else{
          await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
        }
      }
      if ( await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;

      let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
      if (!b){ // 弃审红字 校验现存量
        if (formItems.value?.bdocumStyle=='1' && (!await stockCheck(JsonTool.parseProxy(list))))return false;
      }else {
        // 审核时校验现存量
        if (dynamicTenant.value?.target?.kcXsckCheck!='1' && (!await stockCheck(JsonTool.parseProxy(list))))return false;
      }
      let isAuto =  dynamicTenant.value.target.xsShXkd == '1'
      let res = await useRouteApi(reviewCkd, {schemaName: dynamicTenantId})({
        id: formItems.value.id,
        keys:  [],//tableSelectedRowObjs.value.filter(it=>null != it?.lineCode).map(it=>it.lineCode),
        userId: a,
        type: b,
        auto: false // 是否自动生成销售出库单
      })
      message.success(`${b?'审核':'弃审'}成功！`)
      writeLog(`${b?'审核':'弃审'}`,null,`操作内容【${b ? '审核' : '弃审'}其他出库单】,` + '其他出库单号【' + formItems.value.ccode + '】,单据日期【' + formItems.value.ddate + '】')
      await pageReload()
     /* if (b && isAuto && res != null){
        message.success(`正在准备跳转查看销售出库单。。。`)
        // 获取下游单号 打开出库单查看
        let query = {}
        query['ccode'] = res.xyccode
        query['bdate'] = res.xyccodeDate
        // 去销货单页面
        setTimeout(()=>{
          router.push({
            path:'/kc-xsDepot',
            query: query,
          });
        },2000)
      }*/
    }
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

function codeToName(arr) {
  let names = {'XSCKD':'销售出库单'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}

const loadMark = ref(false)
const biandong = ref(false)
async function availability(mode,list){
  let checks=[];if (dynamicTenant.value?.target?.kcCgrkCheck == '1')checks.push('cg');if (dynamicTenant.value?.target?.kcXsckCheck == '1')checks.push('xs');
  let parameters =  [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
  parameters.forEach((str,index)=>{str+=index})
  return (await useRouteApi(findAvailability, {schemaName: dynamicTenantId})({year: formItems.value.ddate.substring(0,4),mode: (mode || 'all'),checks: JsonTool.json(checks),parameters: JsonTool.json(parameters)})) || []
}

async function stockCheck(list) {
  let err = ''
  let icList = []
  let t = formItems.value?.id == null?'新增':'修改'
  try {
    let checkParm = {xsOutXhd:dynamicTenant.value.target.xsOutXhd == '11',isOut:titleValue.value == 1}
    let setParm = [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
    let numbers = await availability('xcl',list)
    for (let s of setParm) {
      let parms = s.split('=')
      let tStock =  assetsCardList.value.filter(it=>it.stockNum == parms[1])[0]
      let isB =tStock["stockPropertyBatch"] == '1'
      let tList = list.filter(it=>it.cwhcode1 == parms[0] &&  it.cinvode ==  parms[1] && (isB?(it.batchId ==  parms[2] && it.dpdate ==  parms[3] && it.dvdate ==  parms[4]):true))
      let tNum = 0;tList.map(it=> tNum+=parseFloat(it.baseQuantity))
      let kNum = 0; // 可用量
      if (checkParm.xsOutXhd){ // 是否允许超量

      }else {
        if (!checkParm.isOut){ // 如果退货单跳过
          let r = numbers.filter(it=> Object.keys(it).indexOf(s) != -1 )[0][s]
          if (tStock["stockPropertyBatch"] == '1'){
            if (r == null || parseFloat(r) < tNum){
              let lj = 0
              tList.map(it2=>{
                let z = {baseQuantity:0}
                if (r != null){ // 当前现存量不存在
                  let bn = (parseFloat(r) -lj) < 0?0: (parseFloat(r) -lj)
                  z.baseQuantity =it2?.xsUnitId == it2?.cunitId?bn: bn / parseFloat((it2?.unitList[it2?.unitList.findIndex(it => it.id == it2?.xsUnitId)]?.conversionRate))
                }
                let ce = z?.baseQuantity-parseFloat(it2.quantity)
                err+=`仓储位置【${it2.cwhcodeText}】下存货编码【${it2.cinvode}】的存货${tList.length>1?'多行合计总':''}可用量不足,可用量数量【${z.baseQuantity}】,差额数量【${Math.abs(ce>0?0:ce)}】;`
                icList.push({lineId:it2?.lineId,
                  stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(it2?.unitList,it2?.xsUnitId),baseQuantity:parseFloat(it2.quantity).toFixed(2),lackBaseQuantity:Math.abs(ce>0?0:ce).toFixed(2),batchId:it2.batchId
                })
                lj+=parseFloat(it2.baseQuantity)
              })
            }
          }else {
            kNum = parseFloat(r)
            // 可用量 > 消单数量
            if (kNum < tNum){
              let c = parseFloat((tList[0]?.unitList[tList[0]?.unitList.findIndex(it => it.id == tList[0]?.xsUnitId)]?.conversionRate))
              let rn = tList[0]?.xsUnitId == tList[0]?.cunitId?kNum: kNum / c
              let cn = tList[0]?.xsUnitId == tList[0]?.cunitId?tNum: tNum / c
              err+=`仓储位置【${tList[0].cwhcodeText}】下存货编码【${parms[1]}】的存货${tList.length>1?'多行合计总':''}可用量不足,可用量数量【${rn}】,差额数量【${Math.abs(rn-cn)}】;`
              icList.push({lineId:tList[0]?.lineId,
                stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(tList[0].unitList,tList[0].xsUnitId),baseQuantity:cn.toFixed(2),lackBaseQuantity:Math.abs(rn-cn).toFixed(2),batchId:tList[0].batchId
              })
            }
          }
        }
      }
    }
  }catch (e) {
    err = '检查现存量时发生异常！'
  }
  if (err != ''){
    // createWarningModal({title: '温馨提示', content: err})
    writeLog(t,formItems.value,`操作内容【${t}其他出库单】,` + `${t}失败,现存量不足！详情:`+err)
    openLackPage(true,{data:icList,mode:'xcl'})
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
      content: '销货单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '销货日期不能为空！'
    })
    return false
  }
    if (hasBlank(form.unitType) || hasBlank(form.unitValue)) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '单位类型与业务单位不能不能为空！'
      })
      return false
    }
/*  if (hasBlank(form.cvencode) || hasBlank(form.cvencodeJs)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '销售客户与结算客户不能为空！'
    })
    return false
  }*/

  if (hasBlank(form.cwhcode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '仓库不能为空！'
    })
    return false
  }

  if (list.length == 0 || list.filter(it=>it.isBatch && hasBlank(it.batchId)).length > 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、单价和金额为必填项,存货为批次管理,批号为必选项请补充完整!'
    })
    return false
  }
  return true
}

const modelText = ref('');
const modelText1 = ref('');
const modelText2 = ref('');
//数据保存
async function saveData() {
  let id = (status.value == 1?null:formItems.value.id)
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    if (formItems.value.unitType=='cust' || formItems.value.unitType=='supplier'){
      formItems.value.cvencode = formItems.value.unitValue
      formItems.value.cvencodeJs = formItems.value.unitValue
    }
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
    let checks = list.filter(it=>it?.checkLyNumber) // 存在来源的修改数量
    if(checks.length > 0){
      // 销售主数量变更差额是否大于来源单据数量与累计销货数量的差额
      let lyList = await useRouteApi(findbyStockSaleousingsCodeAndBillStyle, {schemaName: dynamicTenantId})({code: checks[0].sourcecode,billStyle:checks[0].sourcetype})
      let rowArr = []
      for (let i = 0; i < checks.length; i++) {
        let c = checks[i];
        let r = lyList.filter(it=>c.sourcedetailId == it.lineCode)[0]
        if (null== r || ((parseFloat(c.baseQuantityOld)-parseFloat(c.baseQuantity)) > (parseFloat(r.baseQuantity) - parseFloat(r.isumChuku || '0'))))rowArr.push((i+1)+'')
      }
      if (rowArr.length > 0)
        return createWarningModal({title: "温馨提示",content: `系统检测到序号【${rowArr.join()}】行数量不能大于参照的来源单据借出借用单数量，请检查后重试！`})
    }
    // 保存时校验现存量
    if (dynamicTenant.value?.target?.kcXsckCheck=='1' && (!await stockCheck(JsonTool.parseProxy(list))))return false;
    formItems.value.entryList = JsonTool.json(merge(list))
    if (formItems.value?.id == null){
      formItems.value.ccode = await generateCode(formItems.value.ddate)
      showAvailability(false)
    }
    await useRouteApi(saveCkdQt, {schemaName: dynamicTenantId})(formItems.value)
    message.success('保存成功！')
    tempTaskDel()
    writeLog(formItems.value?.id == null?'新增':'修改',formItems.value,null)
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

async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('tail')
    showAvailability(false)
  } else if (status.value == 2) {
    await contentSwitch('curr')
    tempTaskDel()
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
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)

const tableRef = ref(null)
const dynamicColumnModel = ref({value:[]})
const lanMuData = ref({
  'accId': 'postgres',
  'menuName': '其他出库单新增',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,changeNumber:0
})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
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
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}

const openSetting = () => {
  openQueryPageM(true, {schemaName: dynamicTenantId.value,title: router.currentRoute?.value?.meta?.title,rows: defaultRows()})
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


const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerBatchSelectorPage, {openModal: opneBatchSelectorPage}] = useModal();
const [registerLackPage, { openModal: openLackPage }] = useModal();
const [registerBarCodeModalPage, {openModal: openBarCodePageM}] = useModal()
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
      if (hasBlank(o?.cwhcode) || hasBlank(o?.cinvode) || hasBlank(o?.quantity)){
        createWarningModal({title: "温馨提示",content: '仓储位置、存货与数量不能为空，请先完善数据后再进行操作！'})
      }else if( hasBlank(o?.availability) || o?.availability == 0){
        createWarningModal({title: "温馨提示",content: '当前存货现存量不足，请补充后再进行操作！'})
      }else {
        opneBatchSelectorPage(true, {
          tenant: dynamicTenant.value,
          row: o,list: ckListOptions.value,mode: 'xcl'
        })
      }
      break;
  }
}
const {openCustomModal,openDeptModal,openPsnModal} =  useNcModals()
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  if (status.value == 3) return false
  switch (type) {
    case 'cvencode':
      openCustomModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cdepcode':
      openDeptModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cpersoncode':
    case 'deliveryUser':
      openPsnModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;

  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
      focusNext(thisEditObj.value,thisEditType.value)

    } else if (thisEditType.value == 'batchId') {
      if (o.length == 1) {
        thisEditObj.value['tempTwelve'] = o[0].batchId
        getCurrPrice(thisEditObj.value)
        thisEditObj.value['dpdate'] = o[0].dpdate
        thisEditObj.value['dvdate'] = o[0].dvdate
        thisEditObj.value['cwhcode'] = o[0].cwhcode
        thisEditObj.value['cwhcodeText'] = ckListOptions.value.filter(it => it.id == o[0].cwhcode)[0]?.ckName
        thisEditObj.value['quantity'] = o[0].outQuantity
        tableDataChange(thisEditObj.value,'quantity')
        focusNext(thisEditObj.value,thisEditType.value)
      } else {
        let arr = []
        const temp = ObjTool.dels(JsonTool.parseProxy(thisEditObj.value), ['key','editTwelve'])
        o.forEach((v)=>{
          let t = JsonTool.parseProxy(temp)
          t.key = uuid().replaceAll(/\-/g,'')
          t['batchId'] = v.batchId
          getCurrPrice(t)
          t['dpdate'] = v.dpdate
          t['dvdate'] = v.dvdate
          t['cwhcode'] = v.cwhcode
          t['cwhcodeText'] = ckListOptions.value.filter(it => it.id == v.cwhcode)[0]?.ckName
          // 调整数量
          t['quantity'] = v.outQuantity
          tableDataChange(t, 'quantity')
          arr.push(t)
        })
        let tables = getDataSource()
        let index = tables.findIndex(it => it.key == thisEditObj.value['key'])
        tables.splice(index, 1, ...arr)
        setTableData(tables)
      }
    }else {
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
const modelQuantity = (o) => {
  let tables = getDataSource()
  for (let it of o) {
    let d = tables.filter(it2 => it2.lineId == it.lineId)[0]
    if (null == d)return false
    let index =  tables.findIndex(it2 => it2.lineId == it.lineId)
    d.quantity = it.quantity
    tableDataChange(d,'quantity')
    tables.splice(index, 1, d)
  }
  setTableData(tables)
  message.info('已按照所选条件进行数量修改！')
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  record['baseOld'] = record.quantity
  record['baseQuantityOld'] = record.baseQuantity
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  if (record.cwhcode.indexOf("\\") != -1) {
    record.cangkuDuli = "0"
    // 找到
    let arr = record.cwhcode.split("\\")
    record.cwhcodeInfo = {cangkuName: assemblyName(arr)}
    record.cwhcodeText = record.cwhcodeInfo?.cangkuName
  } else {
    record.cangkuDuli = "1"
    record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName
  }

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh='';it.barcode ='';return it;})
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
      record.unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=o?.stockGgxh;it.barcode =o?.stockBarcode;return it;})
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
const tableDataChange =  (r,c) => {
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
    case 'cwhcode':
      let cangkuInfo = ckListOptions.value.filter(it => it.id == r.cwhcode)[0]
      if (null != cangkuInfo) {
        if (cangkuInfo.ckIsDuli == '1') {
          r['cwhcodeText'] = cangkuInfo.ckName
        }
      }
      getXclNumber(r)
      break;
    case 'cinvode':
      if (chFocus.value == 'two') r.cinvodeName = r.tempEleven
      if (chFocus.value == 'three') r.cinvodeBarcode = r.tempThree
      chChange(r)
      break;
    case 'xsUnitId':
    case 'quantity':
      let index = r.unitList.findIndex(it=>it.id==r.xsUnitId)
      if (! hasBlank(r.quantity))
      r.quantity = (parseFloat(r.quantity)>0?(parseFloat(r.quantity)*(titleValue.value==1?-1:1)):parseFloat(r.quantity)).toFixed(10)
      if (c == 'xsUnitId' && index!=-1){
        r.cinvodeType = r.unitList[index]?.ggxh // 规格型号
        r.cinvodeBarcode = r.unitList[index]?.barcode // 条形码
        if (!hasBlank(r.quantity) && !hasBlank(r.price)){// 切换单价
          let oldIndex =  r.unitList.findIndex(it=>it.id==r.oldXsUnitId)
          let t = parseFloat(r.price)
          if (oldIndex == 0){
            t = t*parseFloat(r.unitList[index]?.conversionRate)
          }else if(oldIndex == 1){
            t = index == 0?(t/parseFloat(r.unitList[oldIndex]?.conversionRate)):(t*(parseFloat(r.unitList[index]?.conversionRate) / parseFloat(r.unitList[oldIndex]?.conversionRate)))
          }else if(oldIndex == 2){
            t = t/(parseFloat(r.unitList[oldIndex]?.conversionRate) / parseFloat(r.unitList[index]?.conversionRate))
          }
          r.price = t
        }
        r.availability = r.availabilityB==0?0:getUnitNumberOrPrice(r,r.availabilityB,2)
      }
      if (c == 'xsUnitId' || hasBlank(r.quantity))  break;
      if (c == 'quantity' && r.sourcetype == 'JCJYD' && ( parseFloat(r.quantity) != parseFloat(r.baseOld))){
          // 来源单据（借用的）的其他出库单，数量不能超过数量与累计出库数量的差额
        c.checkLyNumber = true
      }
      slChangeNew(r)
      break;
    case 'price':
      if (!hasBlank(r.quantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.quantity)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = Math.abs(parseFloat(r.price))
        r.icost = (n * d).toFixed(4)
        r.tempTen = r.icost
        r.price = d.toFixed(4)
      }
      break;
    case 'icost':
      if (!hasBlank(r.quantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.quantity)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
/*        r.isum = ( d*(1+parseFloat((r.itaxrate/100)))).toFixed(10) + ''
        r.taxprice = ((r.price * (1+n))*parseFloat((r.itaxrate/100))).toFixed(10) + ''
        r.itaxprice = (d*parseFloat((r.itaxrate/100))).toFixed(4) + ''*/
        // 得到税额
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price)
        let d = parseFloat(r.icost)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.icost = d.toFixed(4)
/*        r.taxprice = ( n*(1+parseFloat((r.itaxrate/100)))).toFixed(10) + ''
        r.isum = ( d*(1+parseFloat((r.itaxrate/100)))).toFixed(10) + ''
        r.itaxprice = ( d*(parseFloat((r.itaxrate/100)))).toFixed(4) + ''*/
        r.tempTen = d + ''
        r.quantity = (d / n).toFixed(10) + ''
        slChangeNew(r)
      }
      break;
/*    case 'taxprice':// 含税单价
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.isum = (n * d ).toFixed(4) + ''
        r.baseQuantity = n + ''
        r.taxprice = d + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat(r.itaxrate))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat(r.itaxrate)
      }
      slChange(r,c)
      break;
    case 'itaxrate':// 税率 【itaxprice 税额】
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.icost = (parseFloat(r.isum)/(1+parseFloat(r.itaxrate))).toFixed(10)
        r.price = (parseFloat(r.icost)/n).toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat(r.itaxrate)
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.isum)) { //反算 单价
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.isum).toFixed(4)
        r.baseQuantity = n + ''
        r.isum = d + ''
        r.taxprice = (d/n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat(r.itaxrate))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat(r.itaxrate)
      } else if (!hasBlank(r.taxprice) && !hasBlank(r.isum)) { //反算 数量
        let n:any = parseFloat(r.taxprice).toFixed(10)
        let d:any = parseFloat(r.isum).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.taxprice = n + ''
        r.isum = d + ''
        r.baseQuantity = (d / n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat(r.itaxrate))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat(r.itaxrate)
        slChange(r,c)
      }
      break;*/
    case 'dvdate':
      let stockO = assetsCardList.value.filter(it =>(it.stockNum == r.cinvode))[0]
      if (!hasBlank(r.cinvode) && null != stockO && stockO.stockIndateManage == '1'){
        r.dpdate = formatTimer(dayjs(formatTimer(r.dvdate), dateFormat).subtract(parseInt(stockO.stockIndateDuration), 'day').add(1, 'day'))
        r.tempDpdate=r.dpdate
      }
      break;
    case 'dpdate':
      let stock = assetsCardList.value.filter(it =>(it.stockNum == r.cinvode))[0]
      if (!hasBlank(r.cinvode) && null != stock && stock.stockIndateManage == '1'){
        r.dvdate = formatTimer(dayjs(formatTimer(r.dpdate), dateFormat).add(parseInt(stock.stockIndateDuration), 'day').subtract(1, 'day'))
        r.tempFifteen=r.dvdate
      }
      break;
  }
  return r;
}

const dateFormat = 'YYYY-MM-DD';
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
const slChangeNew = (r) => {
  if (r.cunitType == '1') { // 单计量
    r.baseQuantity = r.quantity
    r.subQuantity1 = "0.0000000000"
    r.subQuantity2 = "0.0000000000"
  } else { //多计量
    let n = parseFloat(r.quantity)
    let index = r.unitList.findIndex(it => it.id == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      r.subQuantity1 = n.toFixed(10)
      r.baseQuantity = parseFloat((n * parseFloat(r.unitList[1].conversionRate))).toFixed(10)
      if (r.unitList.length > 2) r.subQuantity2 = parseFloat(n * (parseFloat(r.unitList[1].conversionRate)) / (parseFloat(r.unitList[2].conversionRate))).toFixed(10)
    } else if (index == 2 && r.unitList.length > 2) {
      r.subQuantity2 = n.toFixed(10)
      r.baseQuantity = parseFloat(((n * parseFloat(r.unitList[2].conversionRate)) / parseFloat(r.unitList[0].conversionRate))).toFixed(10)
      r.subQuantity1 = parseFloat(((n * parseFloat(r.unitList[2].conversionRate)) / parseFloat(r.unitList[1].conversionRate))).toFixed(10)
    } else {
      r.baseQuantity = n.toFixed(10)
      r.subQuantity1 = parseFloat((n / parseFloat(r.unitList[1].conversionRate))).toFixed(10)
      if (r.unitList.length > 2) r.subQuantity2 = parseFloat((n / parseFloat(r.unitList[2].conversionRate))).toFixed(10)
    }
  }
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

const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (chFocus.value == 'one' && (it.stockNum == record.cinvode)) || (chFocus.value == 'two' && it.stockName == record.cinvodeName)
      || (chFocus.value == 'three' && it.stockBarcode == record.cinvodeBarcode))[0]
  if (o == null) return false
  record.cinvodeName = o?.stockName
  // record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
  // 存货对应仓库 console.log(o?.stockCangku)
  // 得到单价
  let p = stockPriceList.value.filter(it => it.stockNum == o?.stockNum)[0]
  let k = formFuns.value.getFormValue()?.cvencodeGrade
  // if (null != p && null != k) record.price = parseFloat(p[k]).toFixed(10)
  // 计量类型
  record.cunitType = o.stockMeasurementType == '单计量' ? '1' : '0'
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  if (record.cunitType == '0' && !hasBlank(o?.stockMeasurementUnit) && record?.unitInfo == null) {
    let res = manyJiList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh='';it.barcode ='';return it;})
      if (list.length > 0) {
        record.xsUnitId = (o?.stockMarketUnit?o?.stockMarketUnit: list.filter(it=>it.isMain == 'true')[0]?.id)
        record.cunitid = list[0].id
        record.unitList[0].ggxh = o?.stockGgxh
        record.unitList[0].barcode = o?.stockBarcode
        if (list.length > 1) {
          record.cunitidF1 = list[1].id
          record.unitList[1].ggxh = o?.stockUnitGgxh1
          record.unitList[1].barcode = o?.stockUnitBarcode1
          if (list.length > 2){
            record.unitList[2].ggxh = o?.stockUnitGgxh2
            record.unitList[2].barcode = o?.stockUnitBarcode2
            record.cunitidF2 = list[2].id
          }
        }
      }
    }
  }else if (record.cunitType == '1' &&  !hasBlank(o?.stockMeasurementUnit)){
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=o?.stockGgxh;it.barcode =o?.stockBarcode;return it;})
      record.xsUnitId = record.unitList[0].value
      record.cunitid = record.unitList[0].value
    }
  }
  getXclNumber(record)
  if ( !record.isBatch)
    getCurrPrice(record)
}
const getXclNumber = (record) => {
  if (titleValue.value == 0 &&  !hasBlank(record?.cwhcode) && !hasBlank(record?.cinvode)){
    record.cwhcode1 = record?.cwhcode.split('\\')[0]
    availability('xcl',[record]).then(res=>{
      let v = res[0][Object.keys(res[0])[0]]
      record.availabilityB = v
      record.availability = v==0?0:getUnitNumberOrPrice(record,v,2)
    })
  }
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
    let index = r.unitList.findIndex(it => it.id == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      c = i==2? (z / parseFloat(r.unitList[1].conversionRate)):(z * parseFloat(r.unitList[1].conversionRate))
    } else if (index == 2 && r.unitList.length > 2) {
      c = i==2? (z / parseFloat(r.unitList[2].conversionRate)):(z * parseFloat(r.unitList[2].conversionRate))
    }
    return c.toFixed(i)
  }
}
const showAvailability = (b) => {
  if (titleValue.value == 0)
    setColumns(getColumns().map(it=>{if (it.dataIndex == 'availability')it.ifShow = b;return it;}))
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
    }
  })
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
const {proxy} = getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark(c, false)
  Object.keys(r).map(i => {
    if (i.startsWith('edit')) r[i] = null
  })
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r, c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['isGive', 'bcheck', 'cinvodeType','availability', 'cunitid', 'cinvodeName','cinvodeBarcode', 'cunitidF1', 'cunitidF2', 'baseQuantity','subQuantity1', 'subQuantity2', 'dvdate', 'dpdate', 'itaxprice','itaxrate']
  if (!r.isBatch) filters.push('batchId') //要求填批号才填写
  if (titleValue.value == 1) filters = filters.filter(k=> k!='dvdate' && k!='dpdate')
  // if (false) filters.push('price') //参数控制单价不准输入
  let cols = getColumns().filter(it => it.title != '序号' && filters.indexOf(it.dataIndex) == -1 && it.ifShow)
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
    let doms = nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model = {
    cwhcode: 'One',
    'cinvode': 'Two',
    baseQuantity: 'Six',
    batchId: 'Twelve',
    price: 'Nine',
    icost: 'Ten',dvdate:'Fifteen',dpdate: 'Dpdate',
    cmemo: 'Thirteen', taxprice: 'Taxprice', itaxrate: 'Itaxrate', isum: 'Isum',xsUnitId:'Cunit',quantity:'Quantity'
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
  for (let i = 0; i < (25 - len); i++) {
    newList.push({})
  }
  setTableData(newList)
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

const cunitFormat = (list,id,k) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.id == id)[0]
  return  null == it?id:it.label
}
async function writeLog(action, a, content) {
  /************** 记录操作日志 ****************/
  if (action == '修改') {
    let old = getDataSource().filter(it => it.id == a.id)[0]
    // let keys = (Object.keys(old)).filter(k => old[k] != a[k] && k != 'key')
    let text = `操作内容【${action}其他出库单】,` + '其他出库单号【' + a.ccode + '】,单据日期【' + a.ddate + '】,'
    /* for (let i = 0; i < keys.length; i++) {
       const k = keys[i];
       let t = CrudApi.columns.filter(t => t.dataIndex == k)[0]?.title
       text += `${t}【${transformText(k, old[k])},${transformText(k, a[k])}】;`
     }*/
    content = text.substring(0, text.length - 1)
  }
  let map = {
    loginTime: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule: 'stock',
    optFunction: '其他出库单',
    optRange: '2',
    uniqueCode: '',
    optAction: action,    accId:dynamicAccId.value,
    optContent: content || `操作内容【${action}其他出库单】,` + '其他出库单号【' + a.ccode + '】,单据日期【' + a.ddate + '】',
  }
  await saveLog(map)
}
const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>it.cvencode!=null && it.quantity!=null))
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num = 0
  let numz = 0
  let num1 = 0
  let num2 = 0
  let wsum = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['quantity'] || 0)
    numz+=parseFloat(e['baseQuantity'] || 0)
    num1+=parseFloat(e['subQuantity1'] || 0)
    num2+=parseFloat(e['subQuantity2'] || 0)
    wsum+=parseFloat(e['icost'] || 0)
  }
  summaryModel.value={
    quantity: num,
    baseQuantity: numz,
    subQuantity1: num1,
    subQuantity2: num2,
    icost: wsum,
  }
}

/********** 单据搜索 *********/
const searchData = ref({
  year: '',
  type: pageParameter.type,
  qValue: '',
  style: titleValue.value+'',
  model: 'XS',
})
const toReceipt = async (v) => {
  await formFuns.value.setFormValue({ccode: v })
  nextTick(async ()=>contentSwitch('curr'))
}
/********** 单据搜索 *********/

/********** 复制业务 *********/
const startCopyBefore = async () => {
  if (hasBlank(formItems.value?.id)) return createWarningModal({title: "温馨提示",content: `暂无可进行复制操作的单据，请刷新后重试！`})
  createConfirm({
    iconType: 'warning',
    title: '复制单据',
    content: '您确定要复制生成新单据吗!',
    onOk: async () =>{
      // 复制校验可用量
      let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
      if (dynamicTenant.value?.target?.kcXsckCheck=='1' && (!await stockCheck(JsonTool.parseProxy(list))))return false;
      let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
      let newCode = generateCode(busDate)
      await useRouteApi(copyReceipt, {schemaName: dynamicTenantId})({code: formItems.value.ccode,date: busDate,newCode:newCode})
      message.success('复制成功！')
      // 跳页面编辑
      pageReload()
    },  onCancel:async () =>{
      pageReload()
    }
  })
}
/********** 复制业务 *********/
/*** 条形码 ***/
const openCodePage = () => {
  openBarCodePageM(true, {
    dynamicTenant:dynamicTenant.value,
  })
}
/*** 条形码 ***/
const operateBefore = async (rows) => {
  // 检查操作单据是否正常
  let  code = await useRouteApi(operateBeforeCheck, {schemaName: dynamicTenantId})({parm: JsonTool.json([...new Set(rows.map(it => it.ccode+'=='+(it.bcheck=='1'?'1':'0')))])})
  if (code != 0){
    createWarningModal({title: '温馨提示', content: `单据已发生变化，请刷新当前单据！`})
    if (code == 1){
      formItems.value.ccode = {}
      formFuns.value.setFormValue({})
    }
    return true
  }
  return false
}
const taskIds = ref([])
async function tempTaskDel() {
  if(!hasBlank(taskIds.value)){
    taskIds.value.filter(id=>useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
      .then((a)=>{taskIds.value=taskIds.value.filter(s=>s != id)}))
  }
}

async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'其他出库单',method:method,recordNum:formItems.value.ccode})
    .then((a)=>{
      taskIds.value.push(a.id)
    })
}
/**
 * 检查当前账套业务期间 是否已经结账 或者 是否正在结账
 */
async function checkPeriod(){
  if (ymPeriod.value){
    createWarningModal({title: "温馨提示",content: '当前业务期间已结账，不能进行新增单据操作！'})
    return true;
  }
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账',recordNum:''})
  if (!hasBlank(taskData)){
    createWarningModal({title: '温馨提示',content: '操作员'+taskData.caozuoUnique+'正在对当前账套进行月末结账处理，不能进行对单据业务操作，请销后再试！'})
    return  true;
  }
  taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'盘点单',method:'盘点',recordNum:formItems.value.cwhcode})
  if(taskData!=''){
    createWarningModal({ content:`操作员${ taskData[0].username}正在对当前仓库进行盘点处理，不能进行单据新增操作，请销后再试！` });
    return true
  }
  return false
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
    background-color: @Global-Comm-BcOrText-Color !important;
    border-radius: 5px 5px 0 0;
    padding: 10px;
    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
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
      margin: 5px 4% 0;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;

        > div {
          background-color: #d8d8d8;
          padding: 5px;
          width: 15%;
          margin: 0 1px;
          display: inline-flex;
          justify-content: space-between;
        }
        > div:nth-of-type(1) {
          width: 24%;
          display: inline-block;
          text-align: center;
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
    width: 40%;text-align: right;
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
