<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" @reloadTable="dynamicAdReload" :readonly="status != 3?'':'false'" :dataFun="accountPickerFuns"/></div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn" @click="router.push('/xs-dhList')">查询</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3" >新增</Button>
          <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck != '1'" >修改</Button>
          <Popover placement="bottom" v-if="status == 3 && formItems.bcheck == '1'">
            <template #content>
              <Button v-if="!ymPeriod" style="width: 120px;margin-bottom: 2px"  @click="startEdit('change')" >变更</Button><br/>
              <Button style="width: 120px;margin-bottom: 2px" v-if="formItems.biandong=='1'" @click="openItems">变更清单</Button>
            </template>
            <Button class="actod-btn">变更</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 1">
            <template #content>
              <Button @click="referData('XSDD')">销售订单</Button><br/>
              <Button @click="referData('XSCKD')">销售出库单</Button>
            </template>
            <Button class="actod-btn">参照</Button>
          </Popover>
          <Button class="actod-btn" @click="biandong?saveChanges():saveData()" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
          <Button class="actod-btn" @click="biandong?tableDelBiandong():tableDel()" v-if="status == 1 || status == 2">删行</Button>
          <Popover placement="bottom" v-if="status == 3 && formItems.bcheck == '1'" >
            <template #content>
              <Button @click="generate('ck')" >销售出库单</Button><br/>
              <Button @click="generate('th')" >销售退货单</Button><br/>
              <Button>销售发票</Button><br/>
            </template>
            <Button class="actod-btn">生单</Button>
          </Popover>
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.bcheck != '1'" >删除</Button>
          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 && formItems.bcheck != '1'">审核</Button>
          <Button class="actod-btn" @click="startReview(false)" v-if="status == 3 && formItems.bcheck == '1'">弃审</Button>
          <Popover placement="bottom" v-if="status == 3 ">
            <template #content>
              <Button style="width: 120px;margin-bottom: 2px" @click="lySourcePop">来源单据</Button><br/>
              <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
          <Popover placement="bottom">
            <template #content>
              <span class="group-btn-span-special" @click="startCopyBefore">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;关闭&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;打开&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn" v-if="status == 3">更多</Button>
          </Popover>
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-search" v-show="status == 3">
            <ReceiptSearch :default-data="searchData" :dynamic-tenant-id="dynamicTenantId" @toggle="toReceipt"/>
          </div>
          <div class="acttd-right-d-btns" v-show="status == 3">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
    
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openPrint">打印单据</Button>
                <br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="toPrintPage">模版设置</Button>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
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
          <div>
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
                <Tag :color="'volcano'" v-if="showTags.SH">已审核</Tag>
                <Tag :color="'volcano'" v-if="showTags.CK">已出库</Tag>
                <Tag :color="'volcano'" v-if="showTags.KP">已开票</Tag>
                <Tag :color="'volcano'" v-if="showTags.TH">已退货</Tag>
                <Tag :color="'volcano'" v-if="showTags.BG">已变更</Tag>
                <Tag :color="'volcano'" v-if="showTags.FH">已复核</Tag>
                <Tag :color="'volcano'" v-if="showTags.HX">已核销</Tag>
                <Tag :color="'volcano'" v-if="showTags.HZ">红字回冲</Tag>
              </span>
            </div>
          </div>
          <div>
            <span style="font-size: 22px;font-weight: bold;" :style="{color: titleValue===0?'#0096c7':'red'}">{{titleContents[titleValue] }}</span>
          </div>
          <div></div>
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
          :scroll="{ x: totalColumnWidth,y: windowHeight-(100 + (formRowNum*39))}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcode="{ record }">
            <template v-if="record.editOne &&　!biandong">
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
            <template v-if="record.editTwo　 &&　!biandong">
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
            <template v-if="record.editEleven　 &&　!biandong">
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
            <template v-if="record.editThree　&&　!biandong">
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
            <template v-if="record?.editQuantity">
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
                   @click="record.tempQuantity=record.quantity,record.editQuantity = true;">
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
            <template v-if="record?.editSix">
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
            <template v-if="record?.editNine　 &&　!biandong">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'price')"/>
              <CheckOutlined
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price')"/>
            </template>
            <template v-else>
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempNine=record.price,record.editNine = true;">-->
              <div>
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTen=record.icost,record.editTen = true;">-->
              <div>
          <span class="a-table-font-arial">{{
              (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="record?.editTaxprice　 &&　!biandong">
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
            <template v-if="record?.editItaxrate　 &&　!biandong">
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
                        (record.itaxrate == null ? '' : (parseFloat(record.itaxrate).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'%')
                      }}</span>
              </div>
            </template>
          </template>
          <!-- 税额 -->
          <template #itaxprice="{ record }">
            <template v-if="record?.editItaxprice　 &&　(!biandong && record.sourcecode==null)">
              <InputNumber v-model:value="record.tempItaxprice" class="itaxprice"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="record.editItaxprice = null,record.itaxprice=record.tempItaxprice,tableDataChange(record,'itaxprice')"/>
              <CheckOutlined
                @click="record.editItaxprice = null,record.itaxprice=record.tempItaxprice,tableDataChange(record,'itaxprice')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
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
                    @change="giveChange(record)"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve && record.isBatch　 &&　!biandong">
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
            <template v-if="record?.editThirteen　 &&　!biandong">
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
            <template v-if="record?.editFifteen　 &&　!biandong">
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
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>
    <LySource @register="registerlySourcePage"/>
    <ChangeItems @register="registerItemsPage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <BatchSelector @register="registerBatchSelectorPage" @throwData="modalData"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <Lack @register="registerLackPage" @modify="modelQuantity"/>
    <Refer @register="registerReferModalPage" @throwData="referThrowData"/>
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
import XySource from './popup/xySource.vue';
import LySource from './popup/lySource.vue';
import Lack from './popup/lack.vue';
import ChangeItems from './popup/changeItems.vue';
import DynamicForm from './component/DynamicForm.vue';
import Refer from './popup/referLast.vue';
import BarCode from './popup/barCode.vue';
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
  VerticalRightOutlined,CopyOutlined,VerticalAlignTopOutlined,VerticalAlignBottomOutlined,BarcodeOutlined
} from '@ant-design/icons-vue';
import { nextTick, provide, reactive, ref, unref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {DateTool, JsonTool, NumberTool, ObjTool, uuid} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
/**********************栏目设置**********************/
import { initDynamics} from "./data";
import {
  hasBlank,
} from "/@/api/task-api/tast-bus-api";
import {GenerateDynamicColumn,changeCust} from "./component/DynamicForm";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  changeBefore, copyReceipt,
  delRuKu,
  findBillByCondition,
  findBillCode,
  findBillLastDate,
  findbyStockSaleousingsCodeAndBillStyle,
  findReceiptList,
  generateCkd,
  generateThd, operateBeforeCheck,
  reviewRuKu,
  saveXhd,
  saveXhdChange,
  unAuditBefore,
} from "/@/api/record/stock/stock-xhd";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {checkMonth, findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import {findAll as findAllPrice} from "/@/api/record/stock/stock-price";
import {
  getByStockBalanceTask, stockBalanceTaskEditNewTime,
  stockBalanceTaskSave, stockTaskDelById
} from "/@/api/record/stock/stock_balance";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import Print from './popup/print.vue'
import {verifySyLineCodeExistXyData} from "/@/api/record/stock/stock-xy-source";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
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
const titleContents = ['销货单', '销货退货单']
const titleValue = ref(0)
const formRowNum = ref(1)
// 当前期间是否已经结账
const ymPeriod:any = ref(false)
const periodValue = ref('')
const textValue = ref('')
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'XHD'
})
const showTags = ref({SH: false, CK: false, KP: false, TH: false, BG: false, FH: false, HX: false, HZ: false})
const formItems: any = ref({})
const summaryModel: any = ref({})
const jiList = ref([])
const manyJiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const custList = ref([])
const userList = ref([])
const cardListOptions = ref([])
const receiptListOptions = ref([])
const assetsCardList = ref([])
const stockPriceList = ref([])
const searchList = ref([])
let num = 0
const tolerance = ref(0)
const dynamicAdReload = async (obj) => {
  num+=1
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  lanMuData.value.accId = dynamicAccId.value
  tolerance.value = (hasBlank(obj.target?.xsDhRc)?0:isNaN(obj.target?.xsDhRc)?0:parseFloat(obj.target?.xsDhRc))
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
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const route = useRoute();
const routeData:any = route.query;
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
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  stockPriceList.value = (await useRouteApi(findAllPrice, {schemaName: dynamicTenantId})({stockClass: '0'}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    custList.value = formFuns.value.getSelectMap()['cust']
    userList.value = formFuns.value.getSelectMap()['user']
  })
}

async function contentSwitch(action) {
  loadMark.value = true
  await flushPeriod()
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: route.query?.ccode != null?route.query.ccode:( formFuns.value.getFormValue()?.ccode || ''),
    bdocum: '0',
  })
  let ckNumber = 0;
  let thNumber = 0;
  let kpNumber = 0;
  if (null != res) {
    res.xsRate = (dynamicTenant.value.target.xsRate || 0)
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      list.forEach((obj,index)=>{
        ckNumber+=parseFloat(obj.isumChuku || '0')
        thNumber+=parseFloat(obj.isumTuiHuo || '0')
        kpNumber+=parseFloat(obj.isumFapiao || '0')
      })
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
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
  showTags.value.SH = formItems.value.bcheck == '1'
  showTags.value.BG = formItems.value.biandong == '1'
  showTags.value.FH = formItems.value.bworkable == '1'
  showTags.value.HX = formItems.value.hxIsum != null && !isNaN(formItems.value.hxIsum) &&parseFloat(formItems.value.hxIsum)  != 0
  showTags.value.HZ = formItems.value.hzhcNum != null && !isNaN(formItems.value.hzhcNum) && parseFloat(formItems.value.hzhcNum) != 0
  showTags.value.CK = ckNumber != 0
  showTags.value.TH = thNumber != 0
  showTags.value.KP = kpNumber != 0
  loadMark.value = false
}
const flushPeriod = async() => {
  let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
  if ( periodValue.value != busDate?.substring(0,7)){
    periodValue.value = busDate.substring(0,7)
    // 获取当前期间是否已经结账
    ymPeriod.value =  (await useRouteApi(checkMonth, {schemaName: dynamicTenantId})({
      id: dynamicTenant.value.target.id,
      date: periodValue.value
    }))
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
    },{
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      ellipsis: true,
      slots: {customRender: 'cinvodeBarcode'},
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
    },
    {
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
      title: '可用量',
      dataIndex: 'availability',
      ellipsis: true,
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      slots: {customRender: 'cunitid'},
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
    },
    {
      title: '计量一',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
    },{
      title: '数量一',
      dataIndex: 'subQuantity1',
      ellipsis: true,
      slots: {customRender: 'subQuantity1'},
    },
    {
      title: '计量二',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      slots: {customRender: 'cunitidF2'},
    },
    {
      title: '数量二',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
    }, {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
    },  {
      title: '税率',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
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
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      slots: {customRender: 'itaxprice'},
      ellipsis: true,
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
    },
    {
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
      slots: {customRender: 'isGive'},
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
    },
    {
      title: '审核人',
      dataIndex: 'bcheck',
      ellipsis: true,
      slots: {customRender: 'bcheck'},
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
    createWarningModal({title: "温馨提示",content: '当年度暂未创建，不能新增销货单，请先创建该年度'})
    return false;
  }else {
    if (list.filter(it=>it.istock == '1').length == list.length){
      createWarningModal({title: "温馨提示",content: '当年度已经全部结账，不能新增销货单，请切换公司代码或年度'})
      return false;
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 本年月结账
      // 得到当年最后一张销货单日期
      let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenantId})({year: dates[0],type:"XHD"}))
      formItems.value.ddate = n
    }
  }
  return true;
}
const biandong = ref(false)
const xclList = ref([])
const startEdit = async (type) => {
  if (await checkPeriod())return false;
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      formItems.value.ccode = await generateCode(busDate) // 生成编码
      formItems.value.xsRate = (dynamicTenant.value.target.xsRate || 0) // 获取账套汇率
      formFuns.value.setFormValue({
        ddate: formItems.value.ddate,
        ccode: formItems.value.ccode,
        xsRate:  formItems.value.xsRate,
        payDate: formItems.value.ddate,invoiceStyle:'zyfp'
      })
    }
    showAvailability(true)
    summaryModel.value = {}
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    tempTaskSave('新增')
  }
  else if(type === 'change'){
    if(showTags.value.FH)
       return createWarningModal({title: '温馨提示',content: '当前单据已进行过应收款复核，不能进行变更操作，请取消单据复核后继续！'})
    let che = await useRouteApi(changeBefore, {schemaName: dynamicTenantId})({
      code: formItems.value.ccode,
      style: 'XHD',
      id: dynamicTenant.value.target.id
    })
    if (null == che  || che.type != '0'){
      switch (che.type) {
        case '1':
          createWarningModal({title: '温馨提示',content: '系统年月【'+che.codes+'】已结账，不能进行变更操作，请取消期间结账后继续！'})
          break;
        case '2':
          createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已生成参照生成【'+codeToName(che.codeType)+'】单据，不能进行变更操作，请删除生成的财务凭证后继续！'})
          break;
        case '3':
          createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过应收核销，不能进行变更操作，请删除对应核销记录后继续！'})
          break;
        case '4':
          createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过红字回冲，不能进行变更操作，请删除对应红字回冲单后继续！'})
          break;
      }
      return false;
    }else {
      // 任务
      let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销货单',method:'变更,弃审',recordNum:formItems.value.ccode})
      if(taskData==''){
        tempTaskSave('变更')
      }else{
        // 任务不是当前操作员的
        if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[0].username+'正在变更销货单,不能同时进行操作！' });
        }else{
          await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
        }
      }

      biandong.value = true
      status.value = 2
      let list = getDataSource()
      // 获取现存量
      xclList.value = (await availability('all',list.filter(it=>!hasBlank(it.cwhcode) && !hasBlank(it.cinvode)))) || []
      let dLen = list.length
      for (let i = 0; i < (maxR - dLen); i++) {
        list.push({})
      }
      setTableData(list)
    }
  }
  else {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      // 任务不是当前操作员的
      if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[0].username+'正在修改销货单,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
      }
    }
    if (markLen != 0 && await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }
}
const showAvailability = (b) => {
  setColumns(getColumns().map(it=>{if (it.dataIndex == 'availability')it.ifShow = b;return it;}))
}
/**
 * 检查当前账套业务期间 是否已经结账 或者 是否正在结账
 */
async function checkPeriod(){
  if (ymPeriod.value){
    createWarningModal({title: "温馨提示",content: '当前业务日期期间已经结账，请重新选择单据日期！'})
    return true;
  }
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账',recordNum:''})
  if (!hasBlank(taskData)){
    createWarningModal({title: '温馨提示',content: '操作员'+taskData[0].username+'正在对当前账套进行月末结账处理，不能进行对单据业务操作，请销后再试！'})
    return  true;
  }
  return false
}

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date,
    key: '3-6'
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
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      if ( await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;
      tempTaskSave('删除')
      createConfirm({
        iconType: 'warning',
        title: '销货单删除',
        content: '您确定要进行销货单删除吗!',
        onOk: async () => {
          // 删除前校验
          if (formItems.value.chukuStatus == '1' || formItems.value.tuihuoStatus  == '1') {
            createWarningModal({title: '温馨提示', content: `当前单据已经生成${formItems.value.chukuStatus == '1'?'销售出库单':'销售退货单'}不能进行删除操作！`})
            tempTaskDel()
          }else {
            await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
            message.success('删除成功！')
            writeLog('删除',formItems.value,null)
            tempTaskDel()

            formItems.value.id = ''
            await contentSwitch('tail')
          }
        },onCancel: () => {
            tempTaskDel()
          return false
        }
      });
    }else{
      // 任务不是当前操作员的
      if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[0].username+'正在删除销货单,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
      }
    }
  }
}

const startReview = async (b) => {
  if (await checkPeriod())return false;
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    if ((b && !hasBlank(formItems.value.bcheckUser)) || (!b && hasBlank(formItems.value.bcheckUser))){
      createWarningModal({title: '温馨提示',content: '请勿重复操作！'})
    }else if(!b && formItems.value?.bworkable=='1'){
      createWarningModal({title: '温馨提示',content: '当前单据已经完成财务复核，不能进行弃审操作！'})
    } else {
      let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销货单',method:'修改,审核,弃审,变更,删除',recordNum:formItems.value.ccode})
      let taskData2= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收自动核销',method:'核销'})
      if(taskData=='' && taskData2 == ''){
        tempTaskSave(b?'审核':'弃审')
      }else{
        // 任务不是当前操作员的
        if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: '当前单据正在被操作员'+taskData[0].username+'正在进行'+taskData[0].method+'操作，任务互斥，请销后再试！' });
        }else if(taskData2 != ''){
          return createWarningModal({ content: '当前单据正在被操作员'+taskData2[0].username+'正在进行应收自动核销操作，任务互斥，请销后再试！' });
        }else{
          await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0].id)
        }
      }
      if (await operateBefore([{ccode: formItems.value.ccode,bcheck:formItems.value.bcheck}]))return false;
      let isAuto =  dynamicTenant.value.target.xsShXkd == '1'
      if (!b){ // 弃审前 检查
        let che = await useRouteApi(unAuditBefore, {schemaName: dynamicTenantId})({
          codes: [formItems.value.ccode],
          style: 'XHD',
          id: dynamicTenant.value.target.id
        })
        if (null == che  || che.type != '0'){
          switch (che.type) {
            case '1':
              createWarningModal({title: '温馨提示',content: '系统年月【'+che.codes+'】已结账，不能，不能进行取消审核操作，请取消月末结账后继续！'})
              break;
            case '2':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已生成下游【'+codeToName(che.codeType)+'】单据，不能进行取消审核操作，请删除下游单据后继续！'})
              break;
            case '3':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过应收核销，不能进行取消审核操作，请删除核销单据后继续！'})
              break;
            case '4':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过红字回冲，不能进行取消审核操作，请删除红字回冲单据后继续！'})
              break;
            case '5':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照出库，不能进行取消审核操作，请删除参照生成的出库单据后继续！'})
              break;
            case '6':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照退货，不能进行取消审核操作，请删除参照生成的退货单据后继续！'})
              break;
            case '7':
              createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照开发票，不能进行取消审核操作，请删除参照生成的发票单据后继续！'})
              break;
          }
          tempTaskDel()
          return false;
        }
      }else if (b && isAuto){
          //当前仓库当前年度是否存在未审核盘点单  操作员XXX正在对当前仓库进行盘点处理，不能进行审核销货单操作，生成销售出库单会影响盘点数量，请销后再试！
        let taskData2= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'盘点单',method:'盘点',recordNum:formItems.value.cwhcode})
        if(taskData2!='') {
          tempTaskDel()
          return createWarningModal({ content: '操作员'+taskData2[0].username+'正在对当前仓库进行盘点处理，不能进行审核销货单操作，生成销售出库单会影响盘点数量，请销后再试！' });
        }
        let nly = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.xsUnitId) && !hasBlank(it.quantity)  && !hasBlank(it.itaxrate+'') &&  !hasBlank(it.taxprice + '')&& !hasBlank(it.isum + ''))
        if(!await stockXclCheck(JsonTool.parseProxy(nly))){
          tempTaskDel()
          return createWarningModal({ content: '现存量不足，请检查存货现存量后再试！' });;
        }
      }
      if (b && isAuto){
        isAuto = false
        await new Promise((resolve, reject) => {
          createConfirm({
            iconType: 'warning',
            title: '提示',
            cancelText:'放弃',
            okText:'生成',
            content: '检查到已勾选业务参数“销货单审核生成出库单”，是否继续生成销售出库单?',
            onOk:  () => {
              resolve(true)
            },onCancel: () => {
              reject()
            }
          })
        }).then(res=>{isAuto = true}).catch(()=>{isAuto =  false});
      }
      let res = await useRouteApi(reviewRuKu, {schemaName: dynamicTenantId})({
        id: formItems.value.id,
        keys:  [],//tableSelectedRowObjs.value.filter(it=>null != it?.lineCode).map(it=>it.lineCode),
        userId: a,
        type: b,
        rkBcheck: dynamicTenant.value?.target?.kcCgrkCheck,
        ckBcheck:  dynamicTenant.value?.target?.kcXsckCheck,
        auto: isAuto // 是否自动生成销售出库单
      })
      message.success(`${b?'审核':'弃审'}成功！`)
      await pageReload()
      tempTaskDel()
      writeLog(`${b?'审核':'弃审'}`,null,`操作内容【${b ? '审核' : '弃审'}销货单】,` + '销货单号【' + formItems.value.ccode + '】,单据日期【' + formItems.value.ddate + '】')
      if (b && isAuto && formItems.value.sourcecode == null && res != null){
        message.success(`正在准备跳转查看销售出库单。。。`)
        // 获取下游单号 打开出库单查看
        let query = {}
        query['ccode'] = res.xyccode
        query['bdate'] = res.xyccodeDate
        query['type'] = 'show'
        // 去销货单页面
        setTimeout(()=>{
          router.push({
            path:'/kc-xsDepot',
            query: query,
          });
        },2000)
      }
    }
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

function codeToName(arr) {
  let names = {'XHD':'退货单','XSCKD':'销售出库单','CWPZ':'财务凭证'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}

const loadMark = ref(false)
async function availability(mode,list){
  let checks=[];if (dynamicTenant.value?.target?.kcCgrkCheck == '1')checks.push('cg');if (dynamicTenant.value?.target?.kcXsckCheck == '1')checks.push('xs');
  let parameters =  [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
  parameters.forEach((str,index)=>{str+=index})
  return (await useRouteApi(findAvailability, {schemaName: dynamicTenantId})({year: formItems.value.ddate.substring(0,4),mode: (mode || 'all'),checks: JsonTool.json(checks),parameters: JsonTool.json(parameters)})) || []
}
//存货校验
async function stockCheck(list,model) {
  let err = ''
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
   err ='系统正在进行现存量整理操作，不能进行单据处理，请销后再试！'
  }
  let ic = false
  let icList = []
  // 变更时 或 新增参照出库单时 或 修改 校验可用量
  if ('' == err && !biandong.value && ((!(status.value == 1 &&  !hasBlank(list[0].sourcecode) && list[0].sourcetype == 'XSCKD'))) || (status.value == 2)){
    ic = true
    let checkParm = {xsOutXhd:dynamicTenant.value.target.xsOutXhd == '11',isOut:titleValue.value == 1}
    let setParm = [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
     let numbers = await availability('all',list)
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
                   stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(it2?.unitList,it2?.xsUnitId),baseQuantity:it2.quantity,lackBaseQuantity:Math.abs(ce>0?0:ce),batchId:it2.batchId
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
                 stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(tList[0].unitList,tList[0].xsUnitId),baseQuantity:cn,lackBaseQuantity:Math.abs(rn-cn),batchId:tList[0].batchId
               })
             }
           }
         }
       }
     }
   }
  if (err != ''){
    if (!ic) createWarningModal({title: '温馨提示', content: err})
    if (ic) writeLog('新增',formItems.value,`操作内容【新增销货单】,` + '新增失败,可用量不足！详情:'+err)
    if(ic)openLackPage(true,{data:icList})
    return  false;
  }
  return true;
}

async function stockXclCheck(list) {
  let err = ''
  let icList = []
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
    // openLackPage(true,{data:icList,mode:'xcl'})
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
  if (hasBlank(form.cvencode) || hasBlank(form.cvencodeJs)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '销售客户与结算客户不能为空！'
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
  if (list.length == 0 || list.filter(it=>it.isBatch && hasBlank(it.batchId)).length > 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表内容至少存在一条，且仓储位置、存货编码和计量单位为必选项;数量、含税单价和价税合计为必填项;该存货为批次管理时,批号为必选项!'
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
  formItems.value.bdocumStyle =  "0"  // 制单人
  formItems.value.cmemo =  hasBlank(formItems.value.cmemo)?"":formItems.value.cmemo  // 制单人
  formItems.value.deliveryUser =  hasBlank(formItems.value.deliveryUser)?"":formItems.value.deliveryUser  // 制单人
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.xsUnitId) && !hasBlank(it.quantity)  && !hasBlank(it.itaxrate+'') &&  !hasBlank(it.taxprice + '')&& !hasBlank(it.isum + ''))
  if (saveCheck(list)) {
    let delKyes = Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp') )
    delKyes.push(...['cwhcodeInfo','unitInfo'])
    list.forEach((o, i) => {  //转化
      o = ObjTool.dels(o,delKyes)
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = (o['isGive'] || o['isGive'] == 'true') ? '1' : '0'
      if (o.cangkuDuli == '1'){
        o['cwhcode1'] = o['cwhcode']
      }else if (o.cangkuDuli == '0'){
        let arr =  o['cwhcode'].split("\\")
        for (let j = 0; j < arr.length; j++) {
          o[`cwhcode${j+1}`] = arr[j]
        }
      }
    })
    if (!(await stockCheck(list,formItems.value))) return false
    formItems.value.entryList = JsonTool.json(merge(list))
    if (formItems.value?.id == null){
      formItems.value.ccode = await generateCode(formItems.value.ddate)
      showAvailability(false)
    }
    await useRouteApi(saveXhd, {schemaName: dynamicTenantId})(formItems.value)
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

/************ 日志 *************/
async function writeLog(action, a, content) {
  /************** 记录操作日志 ****************/
  if (action == '修改') {
    let old = getDataSource().filter(it => it.id == a.id)[0]
    let keys = (Object.keys(old)).filter(k => old[k] != a[k] && k != 'key')
    let text = `操作内容【${action}销货单】,` + '销货单号【' + a.ccode + '】,单据日期【' + a.ddate + '】,'
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
    optFunction: '销货单',
    optRange: '2',
    uniqueCode: '',
    optAction: action,    accId:dynamicAccId.value,
    optContent: content || `操作内容【${action}销货单】,` + '销货单号【' + a.ccode + '】,单据日期【' + a.ddate + '】',
  }
  await saveLog(map)
}


async function giveUp() {
  formFuns.value.setFormValue({})
  setTableData([])
  if (status.value == 1) {
    await contentSwitch('tail')
    showAvailability(false)
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
    tempTaskDel()
  tableSelectedRowKeys.value = []
  rowDelBianDongData.value = []
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
    let filterList = [] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
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
const tableRef = ref(null)
const dynamicBtn = ref(null)
const visible = ref(false)
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)

const dynamicColumnModel = ref({value:[]})
const lanMuData = ref({
  accId: 'postgres',
  menuName: '销货单新增',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  pageReload()
}


function initTableWidth(thisCs) {
  let total = 60 // 序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
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
  openQueryPageM(true, {schemaName: dynamicTenantId.value,title: router.currentRoute?.value?.meta?.title})
}
/*栏目设置end*/

const thisEditObj = ref(null)
const thisEditType = ref('')
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
const [registerlySourcePage, {openModal: openLySourcePage}] = useModal()
const [registerItemsPage, {openModal: openItemsSourcePage}] = useModal()
const [registerLackPage, { openModal: openLackPage }] = useModal();
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
      if (hasBlank(o?.cwhcode) || hasBlank(o?.cinvode) || hasBlank(o?.quantity)){
        createWarningModal({title: "温馨提示",content: '仓储位置、存货与数量不能为空，请先完善数据后再进行操作！'})
      }else if( hasBlank(o?.availability) || o?.availability == 0){
        createWarningModal({title: "温馨提示",content: '当前存货可用量不足，请补充后再进行操作！'})
      }else {
        opneBatchSelectorPage(true, {
          tenant: dynamicTenant.value,
          row: o, list: ckListOptions.value, mode: 'all'
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
    }
    else if (thisEditType.value == 'batchId') {
      if (o.length == 1) {
        thisEditObj.value['tempTwelve'] = o[0].batchId
        thisEditObj.value['dpdate'] = o[0].dpdate
        thisEditObj.value['dvdate'] = o[0].dvdate
        thisEditObj.value['cwhcode'] = o[0].cwhcode
        thisEditObj.value['cwhcodeText'] = ckListOptions.value.filter(it => it.id == o[0].cwhcode)[0]?.ckName
        thisEditObj.value['quantity'] = o[0].outQuantity
        // thisEditObj.value['availability'] = o[0].availability
        tableDataChange(thisEditObj.value,'quantity')
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
          t['cwhcode'] = v.cwhcode
          t['cwhcodeText'] = ckListOptions.value.filter(it => it.id == v.cwhcode)[0]?.ckName
          // 调整数量
          t['quantity'] = v.outQuantity
          // t['availability'] = v.availability
          tableDataChange(t, 'quantity')
          arr.push(t)
        })
        let tables = getDataSource()
        let index = tables.findIndex(it => it.key == thisEditObj.value['key'])
        tables.splice(index, 1, ...arr)
        setTableData(tables)
      }
    } else {
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
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : (thisEditType.value == 'cdepcode' || thisEditType.value == 'deliveryUser') ? o.uniqueCode : o.id
    if (thisEditType.value == 'cvencode') e = changeCust(o[0].id,custList.value,e)
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
  message.info('已按照可用量进行数量修改！')
}

const resetRow = (record) => {
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode)[0]
  record['key'] = record.lineCode
  record['baseOld'] = record.quantity
  record['baseZOld'] = record.baseQuantity
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  if (!hasBlank(record.cwhcode)){
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
  }
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
      getKylNumber(r)
      break;
    case 'cinvode':
      if (chFocus.value == 'two') r.cinvodeName = r.tempEleven
      if (chFocus.value == 'three') r.cinvodeBarcode = r.tempThree
      chChange(r)
      break;
    case 'xsUnitId':
    case 'quantity':
      let index = r.unitList.findIndex(it=>it.id==r.xsUnitId)
      if (c == 'xsUnitId' && index!=-1){
        r.cinvodeType = r.unitList[index]?.ggxh // 规格型号
        r.cinvodeBarcode = r.unitList[index]?.barcode // 条形码
        if (!hasBlank(r.quantity) && !hasBlank(r.taxprice)){// 切换单价
          let oldIndex =  r.unitList.findIndex(it=>it.id==r.oldXsUnitId)
          let t = parseFloat(r.taxprice)
          let b = parseFloat(r.quantity)
          if (oldIndex == 0){
            t = t*parseFloat(r.unitList[index]?.conversionRate)
            b =  index == 1?r.subQuantity1:r.subQuantity2
          }else if(oldIndex == 1){
            t = index == 0?(t/parseFloat(r.unitList[oldIndex]?.conversionRate)):(t*(parseFloat(r.unitList[index]?.conversionRate) / parseFloat(r.unitList[oldIndex]?.conversionRate)))
            b =  index == 0?r.baseQuantity:r.subQuantity2
          }else if(oldIndex == 2){
            t = t/(parseFloat(r.unitList[oldIndex]?.conversionRate) / parseFloat(r.unitList[index]?.conversionRate))
            b =  index == 0?r.baseQuantity:r.subQuantity1
          }
          r.taxprice = t
          // r.quantity = b
        }
        r.availability = r.availabilityB==0?0:getUnitNumber(r,r.availabilityB)
      }
      if (c == 'xsUnitId' && hasBlank(r.quantity))  break;
      slChangeNew(r)
      // 变更 或 新增参照销售订单时 数量范围限制
      if ((biandong.value && !checkBasequantity(r)) || (status.value == 1 &&  !hasBlank(r.sourcecode) && r.sourcetype == 'XSDD')){
        r.quantity = r.baseOld
        slChangeNew(r)
        break;
      }else{
        if (!hasBlank(r.taxprice))
          tableDataChange(r,'taxprice')
      }
      // 非变更 或 新增参照销货单时 使用销售单价
      if ((!biandong.value || (status.value == 1 &&  !hasBlank(r.sourcecode) && r.sourcetype == 'XSCKD') ) && r.defaultPrice != null){ // 当存在默认价格时
        let p = 0
        if (index == 1){
          p = parseFloat(r.defaultPrice) * parseFloat(r.unitList[1].conversionRate)
        }else if (index == 2){
          p = parseFloat(r.defaultPrice) * parseFloat(r.unitList[2].conversionRate)
        }else {
          p = parseFloat(r.defaultPrice)
        }
        r.taxprice = p.toFixed(10)
        tableDataChange(r,'taxprice')
      }
      break;
    // case 'baseQuantity':
    case 'price':
      if (!hasBlank(r.quantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.quantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(10)
        r.icost = (n * d).toFixed(4) + ''
        r.tempTen = r.icost
        r.isum = ( (n * d)*(1+parseFloat((r.itaxrate/100)))).toFixed(4) + ''
        r.price = d + ''
        r.taxprice = (d*(1+parseFloat((r.itaxrate/100)))).toFixed(10) + ''
        r.itaxprice = ((d*parseFloat((r.itaxrate/100))) * n).toFixed(4) + ''
      }
      break;
    case 'icost':
      if (!hasBlank(r.quantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.quantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat((r.itaxrate/100)))).toFixed(4) + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
        r.taxprice = ((r.price * (1+n))*parseFloat((r.itaxrate/100))).toFixed(10) + ''
        r.itaxprice = (d*parseFloat((r.itaxrate/100))).toFixed(4) + ''
        // 得到税额
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(10)
        let d = parseFloat(r.icost).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.taxprice = ( n*(1+parseFloat((r.itaxrate/100)))).toFixed(10) + ''
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat((r.itaxrate/100)))).toFixed(4) + ''
        r.itaxprice = ( d*(parseFloat((r.itaxrate/100)))).toFixed(4) + ''
        r.tempTen = d + ''
        r.quantity = (d / n).toFixed(10) + ''
        slChangeNew(r)
      }
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.quantity) && !hasBlank(r.taxprice+'')) {
        let n:any = parseFloat(r.quantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = Math.abs(parseFloat(r.taxprice)).toFixed(10)
        r.isum = (n * d ).toFixed(4) + ''
        r.taxprice = d + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(4)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat((r.itaxrate/100))
      }
      break;
    case 'itaxrate':// 税率 【itaxprice 税额】
      if (!hasBlank(r.quantity) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.quantity).toFixed(10)
        let d:any = parseFloat(r.taxprice).toFixed(4)
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(4)
        r.price = (parseFloat(r.icost)/n).toFixed(4)
        r.itaxprice = (parseFloat(r.icost)*parseFloat((r.itaxrate/100))).toFixed(4) + ''
      }
      break;
    case 'itaxprice':// 税额
      if ( !hasBlank(r.itaxprice) && !hasBlank(r.isum) && !hasBlank(r.itaxrate)) {
        let icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(4)
        let o:any = parseFloat((parseFloat(icost)*parseFloat((r.itaxrate/100))).toFixed(4))
        let n:any = parseFloat(r.itaxprice)
        let ce = parseFloat(parseFloat(o - n).toFixed(2))
        if (Math.abs(ce) > tolerance.value){
          r.itaxprice = o.toFixed(4)
          r.icost = icost
          message.warn('超出系统单行容差！')
        }else {
          r.icost = (parseFloat(r.icost)+ce).toFixed(4)
        }
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.quantity) && !hasBlank(r.isum)) { //反算 单价
        let n:any = parseFloat(r.quantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.isum).toFixed(4)
        r.isum = d + ''
        r.taxprice = (d/n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(4)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = (parseFloat(r.icost)*parseFloat((r.itaxrate/100)) ).toFixed(4)
      } else if (!hasBlank(r.taxprice) && !hasBlank(r.isum)) { //反算 数量
        let n:any = parseFloat(r.taxprice).toFixed(10)
        let d:any = parseFloat(r.isum).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.taxprice = n + ''
        r.isum = d + ''
        r.quantity = (d / n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(4)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = (parseFloat(r.icost)*parseFloat((r.itaxrate/100))).toFixed(4)
        slChangeNew(r)
      }
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
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (chFocus.value == 'one' && (it.stockNum == record.cinvode)) || (chFocus.value == 'two' && it.stockName == record.cinvodeName)
    || (chFocus.value == 'three' && it.stockBarcode == record.cinvodeBarcode))[0]
  if (o == null) return false
  refresh(record)
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
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

  getKylNumber(record)
  // 获取价格
  getCurrStockPrice(record)
}

const getKylNumber = (record) => {
  if (!hasBlank(record?.cwhcode) && !hasBlank(record?.cinvode)){
    record.cwhcode1 = record?.cwhcode.split('\\')[0]
    availability('all',[record]).then(res=>{
      let v = res[0][Object.keys(res[0])[0]]
      record.availabilityB = v
      record.availability = v==0?0:getUnitNumber(record,v)
    })
  }
}
// 得到 促销价格 》客户价格 》销售价格
const getCurrStockPrice = async (record) => {
  let d = formFuns.value.getFormValue()?.ddate.substring(0,10)
  let c = formFuns.value.getFormValue()?.cvencode
  let k = formFuns.value.getFormValue()?.cvencodeGrade
  let price = (await useRouteApi(findPromotionPrice, {schemaName: dynamicTenantId})({date: d,cust: c,stock:record.cinvode}))
  if (null == price ||  0 == price){
     price = (await useRouteApi(findCustAndStockPrice, {schemaName: dynamicTenantId})({cust: c,stock:record.cinvode}))
     if (null == price ||  0 == price){
      let p = stockPriceList.value.filter(it => it.stockNum == record.cinvode)[0]
      if (null != p && null != k && null != p[k] && '0' !=  p[k]) price = parseFloat(p[k])
     }
  }
  record.defaultPrice = price;
}

const refresh = (record) => {
  record.unitList = []
  record.unitInfo = null
  record.xsUnitId = ''
  record.cunitid = ''
  record.cunitidF1 = ''
  record.cunitidF2 = ''
  record.baseQuantity = '0.0000000000'
  record.subQuantity1 = '0.0000000000'
  record.subQuantity2 = '0.0000000000'
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
        tempTaskDel()
      },
      onCancel: async () => {

      }
    });
  } else {
    closeCurrent()
  }
}
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
  let filters = ['isGive', 'bcheck', 'cinvodeType', 'cunitid', 'cinvodeName','cinvodeBarcode', 'cunitidF1', 'cunitidF2', 'baseQuantity','subQuantity1', 'subQuantity2', 'dvdate', 'dpdate', 'itaxprice','availability','price','icost']
  if (!r.isBatch) filters.push('batchId') //要求填批号才填写
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
    icost: 'Ten',/*dvdate:'Fifteen',*/
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

const pageSearchOld = async (v) => {
  if (searchList.value.length == 0) searchList.value = getDataSource().filter(it => it.key != null && it.ccode != null);
  let newList = hasBlank(v) ? searchList.value : searchList.value.filter(it => it.cinvode.indexOf(v) != -1 || it.cinvodeName.indexOf(v) != -1)
  let len = newList.length
  for (let i = 0; i < (25 - len); i++) {
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
      database: dynamicTenantId.value, type: 'XHD',code: formItems.value.ccode,datas: {ck:ckListOptions.value},isRed: false,schemaCode: dynamicTenant.value?.coCode
    })
  }
}
// 查看下游数据
function lySourcePop() {
  if (hasBlank(formItems.value.ccode)){
    message.info('暂未发现任何单据！')
  }else {
    openLySourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'XHD',datas: {ck:ckListOptions.value,ji:jiList.value,many:manyJiList.value}
      ,schemaCode: dynamicTenant.value?.coCode
    })
  }
}
function openItems() {
  if (hasBlank(formItems.value.ccode) || formItems.value.biandong != '1'){
    message.info('暂未发现任何单据！')
  }else {
    openItemsSourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'XHD',datas: {ck:ckListOptions.value,oper:operatorList.value}
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
const giveChange = (r) => {
  if (r.isGive){
    r.price=0;
    r.taxprice=0;
    tableDataChange(r,'taxprice')
  }else {
    message.info('请完善单价！')
  }
}

/*打印专区*/
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const openPrint = () => {
  if (hasBlank(formItems.value.id)){
    message.info('暂未发现可打印单据！')
    return false;
  }
  openPrintPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      mark: router.currentRoute?.value?.fullPath.replace('/',''),
      name: router.currentRoute?.value.meta.title
  })
}
//js切割字符串
const getCustName = (v) => {
  return setString((custList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getUserName = (v) => {
  return (userList.value.filter(it => it.value == v)[0]?.label || '')
}

const getInvoiceName = (v) => {
  return [{value:'zyfp',label:'专用发票'},{value:'ptfp',label:'普通发票'},{value:'nfcpfp',label:'农副产品发票'},{value:'sj',label: '收据'}].filter(it => it.value == v)[0]?.label || ''
}
function setString(str, len) {
  if (str == null) return  ''
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

import {getPrintStencilParameter} from "./popup/ts/printTemplate";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {findAvailability} from "/@/api/record/stock/stock-currents";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {findPromotionPrice} from "/@/api/record/stock/stock_promote_price";
import {findCustAndStockPrice} from "/@/api/record/stock/stock_cust_price";

const loadPrint =  (obj) => {
  const dataArr = JsonTool.parseProxy(getDataSource().filter(it=>it.cvencode!=null))
  let etc = JsonTool.parseProxy(formItems.value)
  if (dataArr.length == 0) {
    return false;
  }else { // 数据处理
    etc.cvencode = getCustName(etc.cvencode)
    etc.cvencodeJs =  getCustName(etc.cvencodeJs)
    etc.cwhcode = ckListOptions.value.filter(it => it.id == etc.cwhcode)[0]?.ckName
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(formFuns.value.getSelectMap()['dept']?.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.cpersoncode = hasBlank(etc.cpersoncode)?'':getUserName(etc.cpersoncode)
    etc.sgspperson = hasBlank(etc.sgspperson)?'':getUserName(etc.sgspperson)
    etc.deliveryUser = hasBlank(etc.deliveryUser)?'':getUserName(etc.deliveryUser)
    etc.invoiceStyle = hasBlank(etc.invoiceStyle)?'':getInvoiceName(etc.invoiceStyle)
    etc.bcheckUser = etc.bcheck == null?'': formatUniqueOperator(etc?.bcheckUser)
    etc.cmaker = formatUniqueOperator(etc?.cmaker)
    dataArr.forEach((item,index)=>{
      item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):ckListOptions.value.filter(it => it.id == item.cwhcode)[0]?.ckName
      item['xsUnitId'] = cunitFormat(item.unitList,item.xsUnitId)
      item['quantity'] =  parseFloat(item.quantity).toFixed(2)
      item['cunitid'] = cunitFormat(item.unitList,item.cunitid)
      item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
      item['itaxrate'] =  parseFloat(item.itaxrate).toFixed(2)
      item['price'] =  parseFloat(item.price).toFixed(2)
      item['icost'] = parseFloat(item.icost).toFixed(2)
      item['taxprice'] =  parseFloat(item.taxprice).toFixed(2)
      item['isum'] = parseFloat(item.isum).toFixed(2)
      item['itaxprice'] = parseFloat(item.itaxprice).toFixed(2)
      item['isGive'] = item['isGive']?'是':'否'
    })
  }
  let type = obj.template
  let maxRowLen = obj.rowNumber
  let dateModel = dataModelBuildingTwoData(dataArr,etc,maxRowLen,obj.list)
  let {fx, size, fun} = getPrintStencilParameter(type,obj.list)
  useNewPrint({data: [fx,  'mm', size,false]}, (doc) => {
     dateModel.forEach((printObj,index)=>{
       fun(doc, printObj, maxRowLen)
       if (index < (dateModel.length-1)) doc.addPage()
     })
   })
}

const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
  })
}
/*打印专区*/
/*生单专区*/
/**
 * 根据主数量得到数量
 * @param r
 */
const getNumber = (r) => {
  if (r.xsUnitId == r.cunitid){
    return r.baseQuantity
  }else {
    let z = parseFloat(r.baseQuantity)
    let c = z
    let index = r.unitList.findIndex(it => it.id == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      c = z / parseFloat(r.unitList[1].conversionRate)
    } else if (index == 2 && r.unitList.length > 2) {
      c = z / parseFloat(r.unitList[2].conversionRate)
    }
    return c.toFixed(10)
  }
}
/**
 * 根据主数量得到数量
 * @param r
 */
const getUnitNumber = (r,z) => {
  if (r.xsUnitId == r.cunitid){
    return z
  }else {
    let c = z
    let index = r.unitList.findIndex(it => it.id == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      c = z / parseFloat(r.unitList[1].conversionRate)
    } else if (index == 2 && r.unitList.length > 2) {
      c = z / parseFloat(r.unitList[2].conversionRate)
    }
    return c.toFixed(2)
  }
}

const generate = async (t) => {
  if ( ymPeriod.value){
    createWarningModal({title: "温馨提示",content: '当前单据业务期间已经结账，不能进行生单操作，请取消期间结账后继续!'})
    return ;
  }
  // 有无 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'销货单',method:'生单'})
  if(xclTaskData==''){
    tempTaskSave('生单')
  }else{
    // 任务不是当前操作员的
    if(xclTaskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
      return createWarningModal({ content: '当前单据正在被'+xclTaskData[0].username+'操作员进行'+xclTaskData[0].method+'业务处理，任务互斥，请销后再试！' });
    }else{
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(xclTaskData[0].id)
    }
  }
  let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
  let genDate = busDate
  if (new Date(Date.parse(busDate)) < new Date(Date.parse(formItems.value.ddate)))genDate = formItems.value.ddate
  /* let d = .substring(0,7)
  if (d != busDate.substring(0,7))genDate = d+'-'+DateTool().getLastDay(d.substring(0,4),d.substring(5,7))*/
  const data = JsonTool.parseProxy(getDataSource().filter(it=>it.cvencode!=null))
  let entry = JsonTool.parseProxy(formItems.value)
  entry.id = null
  entry.ddate = genDate
  entry.bcheck = ''
  entry.bcheckTime = ''
  entry.bcheckUser = ''
  entry.cdepcode = entry.cdepcode?entry.cdepcode:''
  entry.cpersoncode = entry.cpersoncode?entry.cpersoncode:''
  entry.cmemo = entry.cmemo?entry.cmemo:''
  entry.deliveryUser = entry.deliveryUser?entry.deliveryUser:''
  let n = 0
  let b = 0
  data.map(it=>b+=parseFloat(it.baseQuantity || '0'))
  if (t=='ck'){
    data.map(it=>n+=parseFloat(it.isumChuku || '0'))
    if (formItems.value.chukuStatus == '1'){
      createWarningModal({title: "温馨提示",content: '当前销货单已经全部生成销售出库单，不能进行销售出库单重复生单操作！'})
      tempTaskDel()
      return;
    }
    if (data.filter(it=>it.sourcetype == 'XSCKD').length > 0){
      createWarningModal({title: "温馨提示",content: '当前销货单为参照销售出库单生成，不能进行销售出库单循环生单操作！'})
      tempTaskDel()
      return;
    }
    entry.ccode = await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
      type: "XSCKD",
      date: genDate,
      key: '3-11'
    })
    entry.billStyle = "XSCKD"
    entry.bdocumStyle = "0"
    entry.sourcecode = formItems.value.ccode
    entry.sourcedate = formItems.value.ddate
    entry.sourcetype = 'XHD'
    entry.rkBcheck= dynamicTenant.value?.target?.kcCgrkCheck;
    entry.ckBcheck=  dynamicTenant.value?.target?.kcXsckCheck;
    // 销货单
    let list = data.map(it=>{
      it.id = null
      it.bcheck = null
      it.bcheckTime = null
      it.bcheckUser = null
      it.bcheckUser = null
      it.ccode = entry.ccode
      it.ddate = entry.ddate
      it.billStyle = entry.billStyle
      it.baseQuantity = (parseFloat(it.baseQuantity || 0)-parseFloat(it.isumChuku || 0)).toFixed(10)
      it.quantity = getNumber(it)
      slChangeNew(it) // 更改数量
      it.isumChuku = 0
      it.sourcecode = formItems.value.ccode
      it.sourcedetailId = it.lineCode //补充来源单
      it.sourcedate = formItems.value.ddate
      it.sourcetype = 'XHD'
      it.lineCode = it['key']
      it.isGive=it['isGive'] ? '1' : '0'
      // 清除辅助数据
      it.cwhcodeInfo = null
      it.unitList = null
      it.unitInfo = null
      it.cwhcodeText = null
      return it;
    }).filter(it=>parseFloat(it.baseQuantity) != 0)
    entry.entryList = JsonTool.json(list)

    if (list.length == 0){
      createWarningModal({title: "温馨提示",content: '当前销货单已经全部生成销售出库单，不能进行销售出库单重复生单操作！'})
      tempTaskDel()
    }else {
      createConfirm({
        iconType: 'warning',
        title: '生成销售出库单',
        content: '您确定要生成销售出库单吗!',
        onOk: async () =>{
          await useRouteApi(generateCkd, {schemaName: dynamicTenantId})(entry)
          message.success('生单成功！')
          pageReload()
          tempTaskDel()
        },
        onCancel:async () =>{
          pageReload()
          tempTaskDel()
        }
      })
    }
  }else if(t=='th'){
    if (formItems.value.tuihuoStatus == '1'){
      createWarningModal({title: "温馨提示",content: '当前销货单已经全部生成销售出库单，不能进行销售出库单重复生单操作！'})
      tempTaskDel()
      return;
    }
    // 查看退货数量
    data.map(it=>n+=parseFloat(it.isumTuiHuo || '0'))
    if (n>=b){
      createWarningModal({title: "温馨提示",content: '当前销货单已经全部完成退货，不能再次进行退货操作！'})
      tempTaskDel()
      return;
    }
    entry.ccode = await generateCode(genDate)
    entry.bdocumStyle = "1"
    entry.sourcecode = formItems.value.ccode
    entry.sourcedate = formItems.value.ddate
    entry.sourcetype = 'XHD'
    let list = data.map(it=>{
      it.id = null
      it.bcheck = null
      it.bcheckTime = null
      it.bcheckUser = null
      it.bcheckUser = null
      it.bcheckUser = null
      it.ccode = entry.ccode
      it.ddate = entry.ddate
      it.baseQuantity = (Math.abs(parseFloat(it.baseQuantity || 0)-parseFloat(it.isumTuiHuo || 0)) *-1).toFixed(10)
      it.quantity = getNumber(it)
      slChangeNew(it) // 更改数量
      tableDataChange(it,'taxprice') // 计算金额
      it.isumTuiHuo = 0
      it.sourcecode = formItems.value.ccode
      it.sourcedetailId = it.lineCode //补充来源单
      it.sourcedate = formItems.value.ddate
      it.sourcetype = 'XHD'
      it.lineCode = it['key']
      it.isGive=it['isGive'] ? '1' : '0'
      // 清除辅助数据
      it.cwhcodeInfo = null
      it.unitList = null
      it.unitInfo = null
      it.cwhcodeText = null
      return it;
    })
    entry.entryList = JsonTool.json(list)
    if (list.length == 0){
      createWarningModal({title: "温馨提示",content: '当前销货单已经全部生成销售出库单，不能进行销售出库单重复生单操作！'})
      tempTaskDel()
    }else {
      createConfirm({
        iconType: 'warning',
        title: '生成销售退货单',
        content: '您确定要生成销售退货单吗!',
        onOk: async () =>{
          await useRouteApi(generateThd, {schemaName: dynamicTenantId})(entry)
          message.success('生成成功！')
          // 跳页面编辑
          pageReload()
          tempTaskDel()
        },  onCancel:async () =>{
          pageReload()
          tempTaskDel()
        }
      })
    }
  }else {

  }
}
/*生单专区*/
/*变更专区*/
const checkBasequantity =  (r) => {
  let b = parseFloat(r.baseQuantity || 0)
  if (b < (parseFloat(r.isumChuku || 0))){
    createWarningModal({title: "温馨提示",content: '变更后数量不能小于下游单据累计参照出库数量！'})
    return false;
  }
  if (b < (parseFloat(r.isumTuiHuo || 0))){
    createWarningModal({title: "温馨提示",content: '变更后数量不能小于下游单据累计参照退货数量！'})
    return false;
  }
  if (b < (parseFloat(r.isumFapiao || 0))){
    createWarningModal({title: "温馨提示",content: '变更后数量不能小于下游单据累计参照开票数量！'})
    return false;
  }
  let s = r.cwhcode1+'='+r.cinvode+'='+r.batchId+'='+r.dpdate+'='+r.dvdate
  let k = xclList.value.filter(it=> Object.keys(it).indexOf(s) != -1 )[0][s]
  let c = b - parseFloat(r.baseZOld) //旧的主数量
  if (c > 0 && c > k){ // 变大
    createWarningModal({title: "温馨提示",content: '存货可用量不足，不能进行数量变更操作，请检查后重试！'})
    return false;
  }else if (c > 0 && !hasBlank(r.sourcecode)){
    r.checkLyNumber = true
  }
  return true
}
const rowDelBianDongData:any=ref([])
async function tableDelBiandong() {
  if (tableSelectedRowKeys.value.length == 1){
    let list:any = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    let data=list.filter(it => it.key === tableSelectedRowKeys.value[0])[0]
    // 检验上游子表行唯一码是否存在下游
    let xyData=await useRouteApi(verifySyLineCodeExistXyData, { schemaName: dynamicTenantId })({billStyle:'XHD',xyIyear:data.iyear,sourcedetailId:data.lineCode})
    if(xyData>0)
      return createWarningModal({title: "温馨提示",content: '已经生成下游表不能删除!'})
    rowDelBianDongData.value.push(data)
    list.splice(selectIndex, 1)
    setTableData(list)
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
  else{
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '只能单行删除！'
    })
  }
}
const saveChanges = async () => {
  let list = getDataSource().filter(it=>!hasBlank(it.cinvode))
  let delkeys = list.length==0?[]:Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp'))
  delkeys.push(...['cwhcodeInfo','unitInfo','cwhcodeInfo','unitList','cwhcodeText'])
  list = list.map(it=>ObjTool.dels(it,delkeys))
  let checks = list.filter(it=>it?.checkLyNumber)
  if(checks.length > 0){
    // 销售主数量变更差额是否大于来源单据数量与累计销货数量的差额
     let lyList = await useRouteApi(findbyStockSaleousingsCodeAndBillStyle, {schemaName: dynamicTenantId})({code: checks[0].sourcecode,billStyle:checks[0].sourcetype})
    let rowArr = []
    for (let i = 0; i < checks.length; i++) {
      let c = checks[i];
      let r = lyList.filter(it=>c.sourcedetailId == it.lineCode)[0]
      if (null== r || ((parseFloat(c.baseQuantity)-parseFloat(c.baseZOld)) > (parseFloat(r.baseQuantity) - parseFloat(r.isumXiaohuo || '0'))))rowArr.push((i+1)+'')
    }
    if (rowArr.length > 0)
    return createWarningModal({title: "温馨提示",content: `系统检测到序号【${rowArr.join()}】行变更数量大于来源单据可参照数量，不能进行数量变更操作，请检查后重试！`})
  }
  let data = {
    changeId: useUserStoreWidthOut().getUserInfo.id,
    entity: JsonTool.json(formItems.value),
    dels: JsonTool.json(rowDelBianDongData.value.map(it=>it.lineCode)),
    entityList: JsonTool.json(list)
  }
  await useRouteApi(saveXhdChange, {schemaName: dynamicTenantId})(data)
  message.success('保存成功！')
  biandong.value = false
  await pageReload()
  status.value = 3
  tempTaskDel()
  writeLog('变更',formItems.value,null)
}
/*变更专区*/
const cunitFormat = (list,id,k) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.id == id)[0]
  return  null == it?id:it.label
}
const taskIds = ref([])
async function tempTaskDel() {
  if(!hasBlank(taskIds.value)){
    taskIds.value.filter(id=>useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
      .then((a)=>{taskIds.value=taskIds.value.filter(s=>s != id)}))
  }
}

async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'销货单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskIds.value.push(a.id)
    })
}
/*** 参照 ***/
const [registerReferModalPage, {openModal: openReferPage}] = useModal()
const [registerBarCodeModalPage, {openModal: openBarCodePageM}] = useModal()
function referData(t) {
  if(formFuns.value.getFormValue().cvencode==undefined){
    return message.error('请选择销售客户！')
  }

  openReferPage(true, {
    dynamicTenant:dynamicTenant.value,
    cvencode:formFuns.value.getFormValue().cvencode,
    type: t,
  })
}

const referThrowData = async (data) => {
  if (data.length > 0){
    // 锁任务
    await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:data[0].sourcetype=='XSDD'?'销售订单':'销售出库单',method:data[0].sourcetype=='XSDD'?'变更':'审核',recordNum:data[0].sourcecode,caozuoModule:'stock'})
      .then((a)=>{taskIds.value.push(a.id)})
    setTableData(data)
      let k = formFuns.value.getFormValue()?.cvencodeGrade
    getDataSource().forEach( (b)=>{
      b = resetRow(b)
      // 得到存货单价
     if (b.sourcetype == 'XSCKD')
       getCurrStockPrice(b)
       // 默认数量 不能大于该数量
       b.baseOld = b.quantity
      // 重新计算金额
      tableDataChange(b,'quantity')
      // 仓库 与存货不等于null 时 获取可用量
      // getKylNumber(b)
    })
    let list=getDataSource()
    for (let i = 0; i < 25-list.length; i++) {
      list.push({})
    }
    setTableData(list)
  }
}


/*** 参照 ***/
/*** 条形码 ***/
const openCodePage = () => {
  openBarCodePageM(true, {
    dynamicTenant:dynamicTenant.value,
  })
}
/*** 条形码 ***/


/*** 合计 ***/
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
  let sum = 0
  let se = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['quantity'] || 0)
    numz+=parseFloat(e['baseQuantity'] || 0)
    num1+=parseFloat(e['subQuantity1'] || 0)
    num2+=parseFloat(e['subQuantity2'] || 0)
    wsum+=parseFloat(e['icost'] || 0)
    sum+=parseFloat(e['isum'] || 0)
    se+=parseFloat(e['itaxprice'] || 0)
  }
  summaryModel.value={
    quantity: num,
    baseQuantity: numz,
    subQuantity1: num1,
    subQuantity2: num2,
    icost: wsum,isum: sum,itaxprice:se
  }
}
/*** 合计 ***/

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
      let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.xsUnitId) && !hasBlank(it.quantity)  && !hasBlank(it.itaxrate+'') &&  !hasBlank(it.taxprice + '')&& !hasBlank(it.isum + ''))
      if (!(await stockCheck(list,formItems.value))) return false
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
    /*    background-image: url(/@/assets/images/homes/bg-pattern2.png);
        background-repeat: no-repeat;
        background-position: center;*/
  }

  .app-container-bottom {
    background-color: white;

    .acb-head {
      .acbgead-one {
        text-align: center;
        height: 60px;
        line-height: 60px;
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
        >div:nth-of-type(1){width: 45%;text-align: left;
        }
        >div:nth-of-type(2){width: 10%;}
        >div:nth-of-type(3){width: 45%;}

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
          font-weight: bold;
          font-size: 24px;
          color: #666666;
          margin-left: 10%;
          > span {
            cursor: pointer;
          }
          > span:hover {
            color: black;
          }
        }
      }

      .acbgead-two {
        margin: 0 5rem;
      }
    }

    .acb-centent {
      margin: 5px 4% 0;
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
    >div:nth-of-type(1){
      color: @Global-Comm-BcOrText-Color;
      font-weight: bold;
      font-size: 24px;
    }
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
