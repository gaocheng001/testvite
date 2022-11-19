<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收收款单的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199);">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">

        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck!='1'">修改</Button>
<!--          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
          <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删行</Button>-->
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.id != null">删除</Button>
          <Popover placement="bottom" v-if="formItems.bcheck=='1'">
            <template #content>
              <span class="group-btn-span-special">&nbsp;生成退款单</span><br/>
              <span class="group-btn-span-special">&nbsp;生成记账凭证</span><br/>
            </template>
            <Button class="actod-btn">生单</Button>
          </Popover>
          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 && formItems.bcheck!='1' ">审核</button>
          <Button class="actod-btn" @click="startReview(false)" v-if="status == 3 && formItems.bcheck=='1' ">弃审</button>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;来源单据&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;下游单据&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">更多</Button>
          </Popover>
          <Button v-if="status != 3" class="actod-btn">导入</Button>
<!--          <PrintTest></PrintTest>-->
<!--          <Hello></Hello>-->
          <!--          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
                    <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>-->
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two" :class="status != 3?'status-look':''">
        <div class="act-two-d-left">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="act-two-d-center">

        </div>
        <div class="act-two-d-right">
<!--          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="存货编码或名称"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>-->
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
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
            <!-- v-if="status != 3" -->
<!--            <Popover placement="bottom">
              <template #content>
                <span class="group-btn-span-special2" @click="titleValue = 0"
                      :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;蓝字入库单&ensp;<CheckOutlined
                  v-if="titleValue===0"/></span><br/>
                <span class="group-btn-span-special2" @click="titleValue = 1"
                      :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字入库单&ensp;<CheckOutlined
                  v-if="titleValue===1"/></span>
                <br/>
                <span class="group-btn-span-special2" @click="titleValue = 2"
                      :style="titleValue===2?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字回冲单&ensp;<CheckOutlined
                  v-if="titleValue===2"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>-->
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
              <span style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
<!--            已审核、已核销、已开票-->
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>&nbsp;&nbsp;
            <span v-if="formItems.bcheck=='1'">
              <Tag color="volcano">已审核</Tag>
            </span>
            <span v-if="formItems.writeOffStatus=='1'">
              <Tag color="volcano">已核销</Tag>
            </span>
          </div>
          <span style="font-size: 28px;font-weight: bold;border-bottom:3px double #0096c7;" :style="{color: titleValue===0?'#0096c7':'red'}">
            {{ titleContents[titleValue] }}
          </span>
<!--          <span
            style="font-size: 18px;color: red;font-weight: bold;margin-left: 5%;display: inline-block"
            v-if="!hasBlank(formItems.verifyUsername)">已审核</span><span
          v-else>&emsp;&emsp;&emsp;</span>-->
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
<!--          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent"/>-->
          <label>收款日期：</label>
          <DatePicker v-model:value="formItems.ddate" @change="generateCode(formItems.ddate)" :disabled-date="disabledDate" :locale="localeCn" placeholder="变动日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.ccode" :disabled="true" style="width: 15%;"/>
          <label>业务类型：</label>
          <Select v-model:value="formItems.busStyle" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
            <SelectOption value="YSK">预收款</SelectOption>
            <SelectOption value="PTSK">普通收款</SelectOption>
          </Select>
          <label>结算客户：</label>
          <Select v-model:value="formItems.cvencode" @change="cvencodeChange()" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencode')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <br/>

          <label>收款部门：</label>
          <Select v-model:value="formItems.cdepcode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cdepcode')"/>
            </template>
            <SelectOption v-for="item in deptList" :value="item.id" >
              {{ item.deptName }}
            </SelectOption>
          </Select>
          <label>收款人：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
          <label>折扣金额：</label>
<!--          <InputNumber v-model:value="formItems.idiscount" style="width: 15%;"/>-->
          <span @mouseover="clickMoney=false" @mouseout="clickMoney=true">
            <Input v-if="clickMoney" :value="toThousandFilter(formItems.idiscount)" style="width: 15%;" />
            <InputNumber v-if="!clickMoney" v-model:value="formItems.idiscount" style="width: 15%;" />
          </span>
          <label>备注：</label>
          <Input v-model:value="formItems.cmemo" style="width: 15%;"/>
          <br/>

<!--          <label>币种：</label>
          <Select v-model:value="formItems.currency" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
          </Select>
          <label>汇率：</label>
          <InputNumber v-model:value="formItems.exRate" style="width: 15%;"/>
          <label>项目：</label>
          <Select v-model:value="formItems.itemCode" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
            <SelectOption v-for="item in projectList" :value="item.uniqueCode" >
              {{ item.projectCode }} - {{ item.projectName }}
            </SelectOption>
          </Select>
          <label>销售订单：</label>
          <Select v-model:value="formItems.xsddId" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
          </Select>-->
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <div>
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">收款明细</span>
          <div style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="tableAdd">增行</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel">删行</Button>
          </div>
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: formItems.busStyle=='PTSK'?80:350}"
          @register="registerTable"
          :dataSource="tableData"
        >
          <template #cunitid="{ record }">
            <template v-if="record.editOne">
<!--            <span v-if="record.cunitidFlag!='1'">{{record.cunitid}}<EditOutlined v-if="status == 1 || status == 2" @click="record.cunitidFlag='1'"/></span>
            <span v-if="record.cunitidFlag=='1'">-->
<!--              <Input v-model:value="record.cunitid" style="width: 85%;"/>-->
              <Select v-model:value="record.tempOne" style="width: 85%;"
                      @change="value=>handleChange(value,'one')"
                      @search="value=>handleSearch(value,'one')"
                      @keyup.enter="focusNext(record,'cunitid')">
                <template #suffixIcon><CaretDownOutlined/></template>
                <SelectOption v-for="item in settModesList" :value="item.settModesCode" >
                  {{ item.settModesName }}
                </SelectOption>
              </Select>
<!--            </span>-->
<!--              <CheckOutlined @click="saveRow(record,index);record.cunitidFlag='0'"/>-->
              <CheckOutlined @click="record.editOne = null;record.cunitid=record.tempOne;tableDataChange(record,'cunitid')"/>
            </template>
            <template v-else>
              <div @click="record.editOne = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{formatCunitid(record.cunitid)}}</span>
              </div>
            </template>
          </template>
          <template #cunitidF1="{ record }">
            <template v-if="record.editTwo">
              <Select v-model:value="record.tempTwo" style="width: 85%;"
                      @change="value=>handleChange(value,'two')"
                      @search="value=>handleSearch(value,'two')"
                      @keyup.enter="focusNext(record,'cunitidF1')">
                <template #suffixIcon><CaretDownOutlined/></template>
                <SelectOption v-for="item in bankAccountList" :value="item.ccode" >
                  {{ item.cname }}
                </SelectOption>
              </Select>
              <CheckOutlined @click="record.editTwo = null;record.cunitidF1=record.tempTwo;tableDataChange(record,'cunitidF1')"/>
            </template>
            <template v-else>
              <div @click="record.editTwo = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{formatCunitidF1(record.cunitidF1)}}</span>
              </div>
            </template>
          </template>
<!--          <template #cunitidF1="{ record }">
            <span v-if="record.cunitidF1Flag!='1'">{{record.cunitidF1}}<EditOutlined v-if="status == 1 || status == 2" @click="record.cunitidF1Flag='1'"/></span>
            <span v-if="record.cunitidF1Flag=='1'"><Input v-model:value="record.cunitidF1" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.cunitidF1Flag='0'"/>
            </span>
          </template>-->
          <template #isum="{ record }">
            <template v-if="record.editThree">
              <InputNumber v-model:value="record.tempThree" style="width: 85%;" @keyup.enter="focusNext(record,'isum')"/>
              <CheckOutlined @click="record.editThree = null;record.isum=record.tempThree;tableDataChange(record,'isum')"/>
            </template>
            <template v-else>
              <div @click="record.editThree = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{toThousandFilter(record.isum)}}</span>
              </div>
            </template>
          </template>
<!--          <template #isum="{ record }">
            <span v-if="record.isumFlag!='1'">{{record.isum}}<EditOutlined v-if="status == 1 || status == 2" @click="record.isumFlag='1'"/></span>
            <span v-if="record.isumFlag=='1'"><InputNumber v-model:value="record.isum" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.isumFlag='0'"/>
            </span>
          </template>-->
          <template #pjType="{ record }">
            <template v-if="record.editFour">
              <Select v-model:value="record.tempFour" style="width: 85%;"
                      @change="value=>handleChange(value,'four')"
                      @search="value=>handleSearch(value,'four')"
                      @keyup.enter="focusNext(record,'pjType')">
                <template #suffixIcon><CaretDownOutlined/></template>
                <SelectOption value="ZZZP">转账支票</SelectOption>
                <SelectOption value="CDHP">承兑汇票</SelectOption>
              </Select>
              <CheckOutlined @click="record.editFour = null;record.pjType=record.tempFour;tableDataChange(record,'pjType')"/>
            </template>
            <template v-else>
              <div @click="record.editFour = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial" v-if="record.pjType=='ZZZP'">转账支票</span>
                <span class="a-table-font-arial" v-if="record.pjType=='CDHP'">承兑汇票</span>
              </div>
            </template>
          </template>
<!--          <template #pjType="{ record }">
            <span v-if="record.pjTypeFlag!='1'">
              <span v-if="record.pjType=='ZZZP'">转账支票</span>
              <span v-if="record.pjType=='CDHP'">承兑汇票</span>
              <EditOutlined v-if="status == 1 || status == 2" @click="record.pjTypeFlag='1'"/></span>
            <span v-if="record.pjTypeFlag=='1'">
              <Select v-model:value="record.pjType" style="width: 85%;">
                <template #suffixIcon><CaretDownOutlined/></template>
                <SelectOption value="ZZZP">转账支票</SelectOption>
                <SelectOption value="CDHP">承兑汇票</SelectOption>
              </Select>
              <CheckOutlined @click="saveRow(record,index);record.pjTypeFlag='0'"/>
            </span>
          </template>-->
          <template #pjCode="{ record }">
            <template v-if="record.editFive">
              <InputNumber v-model:value="record.tempFive" style="width: 85%;" @keyup.enter="focusNext(record,'pjCode')"/>
              <CheckOutlined @click="record.editFive = null;record.pjCode=record.tempFive;tableDataChange(record,'pjCode')"/>
            </template>
            <template v-else>
              <div @click="record.editFive = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{record.pjCode}}</span>
              </div>
            </template>
          </template>
<!--          <template #pjCode="{ record }">
            <span v-if="record.pjCodeFlag!='1'">{{record.pjCode}}<EditOutlined v-if="status == 1 || status == 2" @click="record.pjCodeFlag='1'"/></span>
            <span v-if="record.pjCodeFlag=='1'"><Input v-model:value="record.pjCode" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.pjCodeFlag='0'"/>
            </span>
          </template>-->
          <template #pjDate="{ record }">
            <template v-if="record.editSix">
              <DatePicker v-model:value="record.tempSix" style="width: 85%;" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                          @openChange="(b)=>null!=record.tempSix && !b?focusNext(record,'pjDate'):null"/>
              <CheckOutlined @click="record.editSix = null;record.pjDate=record.tempSix;tableDataChange(record,'pjDate')"/>
            </template>
            <template v-else>
              <div @click="record.editSix = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{record.pjDate}}</span>
              </div>
            </template>
          </template>
<!--          <template #pjDate="{ record }">
            <span v-if="record.pjDateFlag!='1'">{{record.pjDate}}<EditOutlined v-if="status == 1 || status == 2" @click="record.pjDateFlag='1'"/></span>
            <span v-if="record.pjDateFlag=='1'">
              <DatePicker v-model:value="record.pjDate" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.pjDateFlag='0'"/>
            </span>
          </template>-->
          <template #pjDhDate="{ record }">
            <template v-if="record.editSeven">
              <DatePicker v-model:value="record.tempSeven" style="width: 85%;" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                          @openChange="(b)=>null!=record.tempSeven && !b?focusNext(record,'pjDhDate'):null"/>
              <CheckOutlined @click="record.editSeven = null;record.pjDhDate=record.tempSeven;tableDataChange(record,'pjDhDate')"/>
            </template>
            <template v-else>
              <div @click="record.editSeven = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{record.pjDhDate}}</span>
              </div>
            </template>
          </template>
<!--          <template #pjDhDate="{ record }">
            <span v-if="record.pjDhDateFlag!='1'">{{record.pjDhDate}}<EditOutlined v-if="status == 1 || status == 2" @click="record.pjDhDateFlag='1'"/></span>
            <span v-if="record.pjDhDateFlag=='1'">
              <DatePicker v-model:value="record.pjDhDate" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.pjDhDateFlag='0'"/>
            </span>
          </template>-->
          <template #cmemo="{ record }">
            <template v-if="record.editEight">
              <Input v-model:value="record.tempEight" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'cmemo')"/>
              <CheckOutlined @click="record.editEight = null;record.cmemo=record.tempEight;tableDataChange(record,'cmemo')"/>
            </template>
            <template v-else>
              <div @click="record.editEight = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{record.cmemo}}</span>
              </div>
            </template>
          </template>
<!--          <template #cmemo="{ record }">
            <span v-if="record.cmemoFlag!='1'">{{record.cmemo}}<EditOutlined v-if="status == 1 || status == 2" @click="record.cmemoFlag='1'"/></span>
            <span v-if="record.cmemoFlag=='1'"><Input v-model:value="record.cmemo" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.cmemoFlag='0'"/>
            </span>
          </template>-->

          <template #footer>
            <div class="nc-summary">
              <div style="width:24%;">
                <span>合计</span>
              </div>
              <div style="width:25%;">
                <span>收款金额:</span>
                <span>&ensp;{{ toThousandFilter(isum) }}</span>
              </div>
              <div style="width:25%;">
                <span>制单人：</span>
                <span>&nbsp;</span>
              </div>
              <div style="width:25%;">
                <span>审核人：</span>
                <span>&nbsp;</span>
              </div>
<!--              <div>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
              </div>-->
            </div>
          </template>
        </BasicTable>
        </div>
        <div style="margin-top: 10px;" v-show="formItems.busStyle=='PTSK'">
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">核销明细</span>
          <div style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="countFentan">分摊</Button>
            <Button class="ant-btn-sm actod-btn" @click="openSelectXhd">选单</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel1">删单</Button>
          </div>
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1 }"
          :scroll="{ x: totalColumnWidth,y: 220}"
          @register="registerTable1"
          :dataSource="tableData1"
        >
          <template #hxStyle="{ record }">
            <span>{{formatHxStyle(record.hxStyle)}}</span>
<!--            <span>{{formatHxStyle(record.hxStyle)}}<EditOutlined v-if="status == 1 || status == 2" @click="record.hxStyleFlag='1'"/></span>
            <span v-if="record.hxStyleFlag=='1'"><Input v-model:value="record.hxStyle" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.hxStyleFlag='0'"/>
            </span>-->
          </template>
          <template #ddate="{ record }">
            <span>{{record.ddate}}</span>
<!--            <span v-if="record.ddateFlag!='1'">{{record.ddate}}<EditOutlined v-if="status == 1 || status == 2" @click="record.ddateFlag='1'"/></span>
            <span v-if="record.ddateFlag=='1'">
              <DatePicker v-model:value="record.ddate" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.ddateFlag='0'"/>
            </span>-->
          </template>
          <template #hxCcode="{ record }">
            <span>{{record.hxCcode}}</span>
<!--            <span v-if="record.hxCcodeFlag!='1'">{{record.hxCcode}}<EditOutlined v-if="status == 1 || status == 2" @click="record.hxCcodeFlag='1'"/></span>
            <span v-if="record.hxCcodeFlag=='1'"><InputNumber v-model:value="record.hxCcode" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.hxCcodeFlag='0'"/>
            </span>-->
          </template>
          <template #cvencode="{ record }">
            <span>{{formatCvencode(record.cvencode)}}</span>
<!--            <span v-if="record.cvencodeFlag!='1'">{{formatCvencode(record.cvencode)}}<EditOutlined v-if="status == 1 || status == 2" @click="record.cvencodeFlag='1'"/></span>
            <span v-if="record.cvencodeFlag=='1'"><Input v-model:value="record.cvencode" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.cvencodeFlag='0'"/>
            </span>-->
          </template>
          <template #isum="{ record }">
            <span>{{toThousandFilter(record.isum)}}</span>
<!--            <span v-if="record.isumFlag!='1'">{{record.isum}}<EditOutlined v-if="status == 1 || status == 2" @click="record.isumFlag='1'"/></span>
            <span v-if="record.isumFlag=='1'"><Input v-model:value="record.isum" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.isumFlag='0'"/>
            </span>-->
          </template>
          <template #whxIsum="{ record }">
            <span>{{toThousandFilter(record.whxIsum)}}</span>
<!--            <span v-if="record.hxIsumFlag!='1'">{{record.hxIsum}}<EditOutlined v-if="status == 1 || status == 2" @click="record.hxIsumFlag='1'"/></span>
            <span v-if="record.hxIsumFlag=='1'"><Input v-model:value="record.hxIsum" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.hxIsumFlag='0'"/>
            </span>-->
          </template>
          <template #hxMoney="{ record,index }">
            <template v-if="record.editOne">
              <InputNumber v-model:value="record.tempOne" style="width: 85%;" @blur="checkMoney(record,index,'hxMoney')" @keyup.enter="focusNext1(record,'hxMoney')"/>
              <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
            </template>
            <template v-else>
              <div @click="record.editOne = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
              </div>
            </template>
          </template>
<!--          <template #hxMoney="{ record }">
            <span v-if="record.hxMoneyFlag!='1'">{{toThousandFilter(record.hxMoney)}}<EditOutlined v-if="status == 1 || status == 2" @click="record.hxMoneyFlag='1'"/></span>
            <span v-if="record.hxMoneyFlag=='1'"><Input v-model:value="record.hxMoney" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.hxMoneyFlag='0'"/>
            </span>
          </template>-->
          <template #idiscount="{ record,index }">
            <template v-if="record.editTwo">
              <InputNumber v-model:value="record.tempTwo" style="width: 85%;" @blur="checkMoney(record,index,'idiscount')" @keyup.enter="focusNext1(record,'idiscount')"/>
              <CheckOutlined @click="record.editTwo = null;record.idiscount=record.tempTwo;tableDataChange(record,'idiscount')"/>
            </template>
            <template v-else>
              <div @click="record.editTwo = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{toThousandFilter(record.idiscount)}}</span>
              </div>
            </template>
          </template>
<!--          <template #idiscount="{ record }">
            <span v-if="record.idiscountFlag!='1'">{{toThousandFilter(record.idiscount)}}<EditOutlined v-if="status == 1 || status == 2" @click="record.idiscountFlag='1'"/></span>
            <span v-if="record.idiscountFlag=='1'"><Input v-model:value="record.idiscount" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.idiscountFlag='0'"/>
            </span>
          </template>-->
          <template #cmemo="{ record }">
            <span>{{record.cmemo}}</span>
<!--            <span v-if="record.cmemoFlag!='1'">{{record.cmemo}}<EditOutlined v-if="status == 1 || status == 2" @click="record.cmemoFlag='1'"/></span>
            <span v-if="record.cmemoFlag=='1'"><Input v-model:value="record.cmemo" style="width: 85%;"/>
              <CheckOutlined @click="saveRow(record,index);record.cmemoFlag='0'"/>
            </span>-->
          </template>

          <template #footer>
            <div class="nc-summary">
              <div>
                <span>合计</span>
              </div>
              <div>
                <span>单据金额:</span>
                <span>&ensp;{{ toThousandFilter(isum1) }}</span>
              </div>
              <div>
                <span>未核销金额:</span>
                <span>&ensp;{{ toThousandFilter(hxIsum) }}</span>
              </div>
              <div>
                <span>本次核销金额:</span>
                <span>&ensp;{{ toThousandFilter(hxMoney) }}</span>
              </div>
              <div>
                <span>折扣金额:</span>
                <span>&ensp;{{ toThousandFilter(idiscount) }}</span>
              </div>
            </div>
          </template>
        </BasicTable>
        </div>
        <Import
          @save="introduceData"
          @register="registerImportPage"
        />
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />

        <SelectXhd
          @save="saveSelectXhd"
          @register="registerSelectXhdPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>

    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
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
import Import from "./popup/import.vue";
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
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  CaretDownOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {delChuZhi, findFaAssetInfoByCode, reviewChuZhi} from "/@/api/fa/fa-assets-minus";

import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
//import {
//  GenerateDynamicColumn
//} from "/@/views/boozsoft/stock/shou-kuan-dan-add/component/DynamicForm";
const GenerateDynamicColumn=null
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
//import StockCangKuModalPop
//  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
const StockCangKuModalPop=null
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
//import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
const StockInfiModalPop=null
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
  saveRuKu
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import moment from "moment";
import {
  deleteArApYsyfById, deleteArApYsyfsByCcode,
  findArApWriteOffByCcode,
  findArApYsyfsByCcode,
  findBukongCcode, findByTypeList, saveSaleousing, saveStockXyCsource,
  saveWriteOffList,
  saveYsyf,
  saveYsyfsList
} from "/@/api/record/system/arApYsyf";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {findAll} from "/@/api/record/costomer_data/customer";
import {buildUUID} from "/@/utils/uuid";
import {findAllProject} from "/@/api/record/system/project";
import {findSettModesByFlag} from "/@/api/record/system/sett-modes";
//import {
//  add,
//  pad,
//  sub,
//  toThousandFilter
//} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
const   add=null
const  pad=null
const  sub=null
const  toThousandFilter=null
import {getSysBankAccountByStatus} from "/@/api/record/system/sys-bank-account";
import {findBySkWhxXhd} from "/@/api/record/system/hexiao";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['收款单', '收款单', '收款单']
const titleValue = ref(0)
const formRowNum = ref(1)

const clickMoney = ref(true)

const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'SKD'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const operatorList:any = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const arApYsyfList:any = ref([])
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  await columnReload()
  await reloadList()
  await pageReload()
}

const tableData:any = ref([]);
const tableData1:any = ref([]);

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
const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.id)
  console.log(JSON.stringify(routemsg.value).length)*/
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicAccId.value = routemsg.value.defaultAdName
  dynamicYear.value = routemsg.value.year
  status.value = routemsg.value.isEdit
  //新增
  if (JSON.stringify(routemsg.value).length === 2) {
    formItems.value.id = null
    await startEdit('add')
  } else {
    formItems.value.id = routemsg.value.id
    await contentSwitch('curr')
  }
})

const pageReload = async () => {
  await contentSwitch(formItems.value.id == null?'tail':'curr')
}

const parameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag:'1',
  database: dynamicTenantId.value,
  accId: dynamicAccId.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass:'',
  searchConditon: {
    requirement: 'custName',
    value: '',
  },
})

const psnList:any = ref([])
const deptList:any = ref([])
const customerList:any = ref([])
const projectList:any = ref([])
const settModesList:any = ref([])
const bankAccountList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res.items
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
  const res1 = await useRouteApi(findSettModesByFlag,{schemaName: dynamicTenantId})({})
  settModesList.value = res1.items
  bankAccountList.value = await useRouteApi(getSysBankAccountByStatus,{schemaName: dynamicTenantId})({})

  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  //  ckListOptions.value = (await useRouteApi(cangKuAll, {schemaName: dynamicTenantId})({ckIsDuli: '1'}))?.items
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
}

const saleousingList:any = ref([])
async function cvencodeChange(){
  tableData1.value = []
  if (formItems.value.cvencode!=''&&formItems.value.cvencode!=null){
    saleousingList.value = await useRouteApi(findBySkWhxXhd,{schemaName: dynamicTenantId})({year:dynamicYear.value,cvencode:formItems.value.cvencode})
    tableData1.value = saleousingList.value.map(item=>{
      item.hxStyle = item.billStyle
      item.hxCcode = item.ccode
      if (item.hxIsum!=null && item.hxIsum !='') {
        item.whxIsum = sub(item.isum, item.hxIsum)
      } else {
        item.whxIsum = item.isum
      }
      return item
    })
  } else {
    tableData1.value = []
  }
}

/*async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: formFuns.value.getFormValue()?.ccode || ''
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
      tableData.value = list
      setTableData(list)
    }
    formItems.value.entryList = null
  } else {
    message.success('暂无数据！')
  }
  loadMark.value = false
}*/
const num = ref(0)
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findByTypeList,{schemaName: dynamicTenantId})({type:'SKD',year:dynamicYear.value})
  arApYsyfList.value = res.filter(item => item.bdocumStyle!='1')
  if(arApYsyfList.value.length>0){
    if (action=='first'){
      num.value = 0
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[0])
    } else if (action=='prev'){
      num.value = num.value==0?0:num.value-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='next'){
      num.value = num.value==arApYsyfList.value.length-1?arApYsyfList.value.length-1:num.value+1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='tail') {
      num.value = arApYsyfList.value.length-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else {
      for (let i = 0; i < arApYsyfList.value.length; i++) {
        const item = arApYsyfList.value[i]
        if (routemsg.value.id == item.id){
          num.value = i
        }
      }
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    }
    tableData.value = await useRouteApi(findArApYsyfsByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
    if (tableData.value.length<10) {
      let num = 10 - tableData.value.length
      for (let i = 0; i < num; i++) {
        tableData.value.push({})
      }
    }
    const res = await useRouteApi(findArApWriteOffByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
    tableData1.value = res.map(item=>{
      item.isum = item.hxIsum
      item.whxIsum = sub(item.isum,item.hxMoney)
      return item
    })
    if (tableData1.value.length<10) {
      let num = 10 - tableData1.value.length
      for (let i = 0; i < num; i++) {
        tableData1.value.push({})
      }
    }
    countTable()
  } else {
    await startEdit('add')
    message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status:any = ref(3)

const CrudApi = {
  columns: [
    {
      title: '收款方式',
      dataIndex: 'cunitid',
      ellipsis: true,
      slots: {customRender: 'cunitid'},
      width: 200
    },
    {
      title: '收款账号',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
      width: 200
    },
    {
      title: '收款金额',
      dataIndex: 'isum',
      ellipsis: true,
      align: 'right',
      slots: {customRender: 'isum'},
      width: 150
    },
    {
      title: '票据类型',
      dataIndex: 'pjType',
      ellipsis: true,
      slots: {customRender: 'pjType'},
      width: 150
    },
    {
      title: '票据编号',
      dataIndex: 'pjCode',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'pjCode'},
      width: 150
    },
    {
      title: '票据日期',
      dataIndex: 'pjDate',
      slots: {customRender: 'pjDate'},
      ellipsis: true,
      width: 150,
    },
    {
      title: '兑换日期',
      dataIndex: 'pjDhDate',
      ellipsis: true,
      slots: {customRender: 'pjDhDate'},
      align: 'left',
      width: 150
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
      width: 200,
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
  pagination: {
    pageSize: 50,
    hideOnSinglePage: true,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },

})

const CrudApi1 = {
  columns: [
    {
      title: '单据类型',
      dataIndex: 'hxStyle',
      ellipsis: true,
      slots: {customRender: 'hxStyle'},
      width: 150
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      ellipsis: true,
      slots: {customRender: 'ddate'},
      width: 150
    },
    {
      title: '单据编号',
      dataIndex: 'hxCcode',
      ellipsis: true,
      slots: {customRender: 'hxCcode'},
      width: 200
    },
    {
      title: '结算客户',
      dataIndex: 'cvencode',
      ellipsis: true,
      slots: {customRender: 'cvencode'},
      width: 200
    },
    {
      title: '单据金额',
      dataIndex: 'isum',
      ellipsis: true,
      align: 'right',
      slots: {customRender: 'isum'},
      width: 150
    },{
      title: '未核销金额',
      dataIndex: 'whxIsum',
      slots: {customRender: 'whxIsum'},
      align: 'right',
      ellipsis: true,
      width: 150,
    },
    {
      title: '本次核销金额',
      dataIndex: 'hxMoney',
      ellipsis: true,
      slots: {customRender: 'hxMoney'},
      align: 'right',
      width: 150
    },
    {
      title: '折扣金额',
      dataIndex: 'idiscount',
      ellipsis: true,
      slots: {customRender: 'idiscount'},
      align: 'right',
      width: 150
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
      width: 200,
    }
  ]
}
// 这是示例组件
const [registerTable1, {
  reload:reload1,
  getDataSource:getDataSource1,
  setTableData:setTableData1,
  setPagination:setPagination1,
  getPaginationRef:getPaginationRef1,
  getColumns:getColumns1,
  setColumns:setColumns1
}] = useTable({
  columns: CrudApi1.columns,
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

function formatCunitid(cunitid) {
  let str = cunitid
  settModesList.value.forEach(item=>{
    if(cunitid==item.settModesCode){
      str = item.settModesName
    }
  })
  return str
}

function formatCunitidF1(cunitidF1) {
  let str = ''
  bankAccountList.value.forEach(item=>{
    if (cunitidF1==item.ccode){
      str = item.cname
    }
  })
  return str
}

function formatCvencode(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custName
    }
  })
  return str
}

function formatHxStyle(hxStyle){
  let str = hxStyle
  //XHD销货单、PLXHD批量销货单、XSCKD销售出库单、QTCKD其他出库单、DBCKD调拨出库单、XTZHCKD形态转换出库单、JYJCD借用借出单
  if (hxStyle=='XHD'){
    str = '销货单'
  } else if (hxStyle=='PLXHD'){
    str = '批量销货单'
  } else if (hxStyle=='XSCKD'){
    str = '销售出库单'
  } else if (hxStyle=='QTCKD'){
    str = '其他出库单'
  } else if (hxStyle=='DBCKD'){
    str = '调拨出库单'
  } else if (hxStyle=='XTZHCKD'){
    str = '形态转换出库单'
  } else if (hxStyle=='JYJCD'){
    str = '借用借出单'
  }
  return str
}

function checkMoney(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  if(record.tempTwo!=null && record.tempTwo!='') {
    num3 = record.tempTwo
  }
  let sum = add(num2,num3)
  if (num1-sum<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
    if (str=='idiscount'){
      record.tempTwo = ''
      record.idiscount = ''
    }
  }
  tableData1.value[index] = record
}

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const tableSelectedRowKeys1:any = ref([])
const tableSelectedRowObjs1:any = ref([])
const onSelectChange1 = (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
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
  tableData.value.push({})
  setTableData(tableData.value)
  tableSelectedRowKeys.value = []
  /*if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {cwhcode: formFuns.value.getFormValue().cwhcode})
    tableData.value = list
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择插入行次！'
    })
  }*/
}
const tableDel = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < tableSelectedRowKeys.value.length; i++) {
      let item = tableSelectedRowKeys.value[i]
      let selectIndex = list.findIndex(it => it.key === item)
      list.splice(selectIndex, 1)
    }
    tableData.value = list
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

const tableDel1 = () => {
  if (tableSelectedRowKeys1.value.length > 0) {
    let list = getDataSource1()
    for (let i = 0; i < tableSelectedRowKeys1.value.length; i++) {
      let item = tableSelectedRowKeys1.value[i]
      let selectIndex = list.findIndex(it => it.key === item)
      list.splice(selectIndex, 1)
    }
    tableData1.value = list
    setTableData1(list)
    tableSelectedRowKeys1.value = []
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
    formItems.value.id=null
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode(date)
    formItems.value = {
      ddate: date,
      ccode: code,
      busStyle: 'YSK',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      busStyle: 'YSK',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
    tableData1.value = []
    // setTableData1(list)
  } else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
  }

}

async function generateCode(date) {
  let code=''
  //日期(年月)
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  if(date!=null && date!='') {
    yy = date.substring(0, 4)
    mm = date.substring(5, 7)
  }
  // let yy = formItems.value.ddate.substring(0,4)
  // let mm = formItems.value.ddate.substring(5,7)
  let str = 'SK-' + yy + mm + '-'
  const ysyf = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})({
    num:4,
    sum:14,
    qzNum:10,
    qianzhui:str,
    billStyle: pageParameter.type
  })
  if (ysyf.ccode != null && ysyf.ccode != ''){
    code = str + pad(ysyf.ccode, 4)
  } else {
    code = str + '0001'
  }
  formItems.value.ccode = code
  return code
  /*return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date
  })*/
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    if (formItems.value.bcheck=='1') {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '记录已有核销记录，操作无效！'
      })
    } else {
      createConfirm({
        iconType: 'warning',
        title: '收款单删除',
        content: '您确定要进行收款单删除吗!',
        onOk: async () => {
          // await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
          await useRouteApi(deleteArApYsyfById,{schemaName: dynamicTenantId})(formItems.value.id)
          await useRouteApi(deleteArApYsyfsByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
          message.success('删除成功！')
          // formItems.value.czId = ''
          await contentSwitch('tail')
        }
      });
    }
  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    if (b==true){
      // console.log('审核')
      let dateTime = new_Date()
      formItems.value.bcheck = '1'
      formItems.value.bcheckTime = dateTime
      formItems.value.bcheckUser = useUserStore().getUserInfo['name']
      await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(formItems.value)
      const ysyfsList = await useRouteApi(findArApYsyfsByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
      ysyfsList.map(ysyfs=>{
        ysyfs.bcheck = '1'
        ysyfs.bcheckTime = dateTime
        ysyfs.bcheckUser = useUserStore().getUserInfo['name']
        return ysyfs
      })
      await useRouteApi(saveYsyfsList,{schemaName: dynamicTenantId})(ysyfsList)
    } else {
      // console.log('取消审核')
      if (formItems.value.writeOffStatus=='1' || formItems.value.hxIsum>0) {
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '记录已有核销记录，操作无效！'
        })
      } else {
        formItems.value.bcheck = '0'
        formItems.value.bcheckTime = ''
        formItems.value.bcheckUser = ''
        await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(formItems.value)
        const ysyfsList = await useRouteApi(findArApYsyfsByCcode, {schemaName: dynamicTenantId})(formItems.value.ccode)
        ysyfsList.map(ysyfs => {
          ysyfs.bcheck = '0'
          ysyfs.bcheckTime = ''
          ysyfs.bcheckUser = ''
          return ysyfs
        })
        await useRouteApi(saveYsyfsList, {schemaName: dynamicTenantId})(ysyfsList)
      }
    }
    message.success(`${b?'审核':'弃审'}成功！`)
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)

//行赋值
function saveRow(row,index){
  tableData1.value[index] = row
  countTable()
}

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
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  }/* else if ((list.filter(it => hasBlank(it.cunitid) || hasBlank(it.baseQuantity) || hasBlank(it.icost + '') || hasBlank(it.price + ''))).length > 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表内容:仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整,且必须存在一条！'
    })
    return false
  }*/
  return true
}

//数据保存
/*async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    list.forEach((o, i) => {  //转化
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'
      o['cwhcode1'] = ckListOptions.value.filter(it => it.id == o['cwhcode'])[0]?.ckName || '默认仓库'
    })
    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)
    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    message.success('保存成功！')
    await pageReload()
    status.value = 3
  }
}*/
//只有预收款才能审核，普通收款直接审核核销
//收款金额为0时强制为预收款，审核时核销状态改为完成
async function saveData() {
  if (hasBlank(formItems.value.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据日期不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.busStyle)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '业务类型不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '结算客户不能为空！'
    })
    return false
  }
  /*if (formItems.value.busStyle == 'PTSK' && isum.value-hxMoney.value!=0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '收款金额和核销金额必须相同！'
    })
    return false
  }*/
  if (isum.value<=0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '收款金额必须大于0！'
    })
    return false
  }
  if (formItems.value.busStyle == 'PTSK') {
    if(isum.value-hxMoney.value<0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '核销金额不能大于收款金额！'
      })
      return false
    }
    let num1 = 0
    if (formItems.value.idiscount!=null && formItems.value.idiscount!=''){
      num1=formItems.value.idiscount
    }
    let num2 = 0
    if (idiscount.value!=null && idiscount.value!=''){
      num2=formItems.value.idiscount
    }
    if (num1 - num2 != 0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '折扣金额和核销明细的折扣金额必须相同！'
      })
      return false
    }
    let b = 0
    if (getDataSource1().length > 0) {
      for (let i = 0; i < getDataSource1().length; i++) {
        const item = getDataSource1()[i]
        if (!hasBlank(item.hxMoney)) {
          b++
        }
      }
    }
    if (b == 0) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '核销明细至少有一条！'
      })
      return false
    }
  }
  let a=0
  if (getDataSource().length>0){
    for (let i = 0; i < getDataSource().length; i++) {
      const item = getDataSource()[i]
      if (!hasBlank(item.cunitid)) {
        a++
      }
    }
  }
  if(a==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '收款明细至少有一条！'
    })
    return false
  }
  let dateTime = new_Date()
  //保存收款单主表
  let ysyf:any = {}
  if (formItems.value.id!=null && formItems.value.id!=''){
    ysyf.id = formItems.value.id
  }
  ysyf.iyear = dynamicYear.value
  ysyf.ccode = formItems.value.ccode
  ysyf.cmaker = useUserStoreWidthOut().getUserInfo.id
  ysyf.billStyle = 'SKD'
  ysyf.bdocumStyle = '0'
  ysyf.ddate = formItems.value.ddate
  ysyf.busStyle = formItems.value.busStyle
  ysyf.cvencode = formItems.value.cvencode
  ysyf.cdepcode = formItems.value.cdepcode
  ysyf.cpersoncode = formItems.value.cpersoncode
  ysyf.currency = formItems.value.currency
  ysyf.exRate = formItems.value.exRate
  // ysyf.bcheck = '0'
  // ysyf.bcheckTime = formItems.value.bcheckTime
  // ysyf.bcheckUser = formItems.value.bcheckUser
  // ysyf.writeOffStatus = formItems.value.writeOffStatus
  ysyf.cmemo = formItems.value.cmemo
  ysyf.idiscount = formItems.value.idiscount
  ysyf.isum = isum.value
  ysyf.citemcode = formItems.value.citemcode
  ysyf.citemClass = formItems.value.citemClass
  ysyf.xsddId = formItems.value.xsddId
  ysyf.xhdId = formItems.value.xhdId
  ysyf.hxIsum = hxMoney.value
  ysyf.hxIdiscount = idiscount.value
  if (formItems.value.busStyle == 'PTSK') {
    ysyf.bcheck = '1'
    ysyf.bcheckTime = dateTime
    ysyf.bcheckUser = useUserStoreWidthOut().getUserInfo.id
    ysyf.writeOffStatus = '0'
    if(isum.value-hxMoney.value==0){
      ysyf.writeOffStatus = '1'
    }
  } else {
    ysyf.bcheck = '0'
    ysyf.bcheckTime = null
    ysyf.bcheckUser = null
    ysyf.writeOffStatus = '0'
  }
  await useRouteApi(saveYsyf,{schemaName: dynamicTenantId})(ysyf)
  let list:any = []
  //保存收款单子表
  for (let i = 0; i < getDataSource().length; i++) {
    const item = getDataSource()[i]
    if(!hasBlank(item.cunitid)) {
      let ysyfs: any = {}
      ysyfs.id = item.id
      ysyfs.iyear = dynamicYear.value
      ysyfs.ccode = formItems.value.ccode
      ysyfs.ddate = formItems.value.ddate
      ysyfs.lineCode = buildUUID()
      ysyfs.lineId = i+1
      ysyfs.billStyle = 'SKD'
      ysyfs.busStyle = formItems.value.busStyle
      ysyfs.cvencode = formItems.value.cvencode
      ysyfs.citemcode = formItems.value.citemcode
      ysyfs.cmaker = useUserStoreWidthOut().getUserInfo.id
      ysyfs.cunitid = item.cunitid
      ysyfs.cunitidF1 = item.cunitidF1
      ysyfs.citemClass = formItems.value.citemClass
      ysyfs.itaxCode = formItems.value.currency
      ysyfs.itaxrate = formItems.value.exRate
      ysyfs.idiscount = item.idiscount
      ysyfs.isumYb = item.isumYb
      ysyfs.isum = item.isum
      // ysyfs.writeOffStatus = '0'
      ysyfs.cmemo = item.cmemo
      ysyfs.sourcetype = item.sourcetype
      ysyfs.sourcecode = item.sourcecode
      ysyfs.sourcedetailId = item.sourcedetailId
      ysyfs.sourcedate = item.sourcedate
      // ysyfs.bcheck = '0'
      // ysyfs.bcheckTime = item.bcheckTime
      // ysyfs.bcheckUser = item.bcheckUser
      ysyfs.pjCode = item.pjCode
      ysyfs.pjDate = item.pjDate
      ysyfs.pjType = item.pjType
      ysyfs.pjDhDate = item.pjDhDate
      if (formItems.value.busStyle == 'PTSK') {
        ysyfs.bcheck = '1'
        ysyfs.bcheckTime = item.bcheckTime
        ysyfs.bcheckUser = item.bcheckUser
        ysyfs.writeOffStatus = '1'
      } else {
        ysyfs.bcheck = '0'
        ysyfs.bcheckTime = item.bcheckTime
        ysyfs.bcheckUser = item.bcheckUser
        ysyfs.writeOffStatus = '0'
      }
      list.push(ysyfs)
    }
  }
  await useRouteApi(saveYsyfsList,{schemaName: dynamicTenantId})(list)
  //保存核销单
  if (formItems.value.busStyle == 'PTSK') {
    let list1: any = []
    for (let i = 0; i < getDataSource1().length; i++) {
      const item = getDataSource1()[i]
      let writeOff: any = {}
      if (item.hxMoney != null && item.hxMoney != '') {
        writeOff.id = item.id
        writeOff.iyear = dynamicYear.value
        writeOff.ccode = formItems.value.ccode
        writeOff.ddate = formItems.value.ddate
        writeOff.billStyle = 'SKD'
        writeOff.hxStyle = item.hxStyle
        writeOff.cvencode = item.cvencode
        writeOff.hxCcode = item.hxCcode
        writeOff.hxIsum = item.isum
        writeOff.hxMoney = item.hxMoney
        writeOff.idiscount = item.idiscount
        writeOff.citemcode = item.citemcode
        writeOff.citemClass = item.citemClass
        writeOff.currency = formItems.value.currency
        writeOff.exRate = formItems.value.exRate
        list1.push(writeOff)
        //保存下游单据
        let stockXyCsource: any = {}
        stockXyCsource.iyear = dynamicYear.value
        stockXyCsource.xyBillStyle = 'SKD'
        stockXyCsource.billStyle = item.hxStyle
        stockXyCsource.ccode = item.hxCcode
        stockXyCsource.ccodeDate = item.ddate
        stockXyCsource.xyccode = formItems.value.ccode
        stockXyCsource.xyccodeDate = formItems.value.ddate
        await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
        //保存销货单
        const item1 = saleousingList.value.filter(a=>a.ccode==item.hxCcode)
        // debugger
        let saleousing = item1[0]
        if (item.idiscount!=null && item.idiscount!='') {
          saleousing.hxIsum = add(saleousing.hxIsum==null?'0':saleousing.hxIsum, add(item.hxMoney==null?'0':item.hxMoney, item.idiscount))
        } else {
          saleousing.hxIsum = add(saleousing.hxIsum==null?'0':saleousing.hxIsum, item.hxMoney==null?'0':item.hxMoney)
        }
        if (saleousing.hxIsum-saleousing.isum==0){
          saleousing.hxFlag = '1'
        }
        await useRouteApi(saveSaleousing,{schemaName: dynamicTenantId})(saleousing)
      }
    }
    await useRouteApi(saveWriteOffList, {schemaName: dynamicTenantId})(list1)
  }
  message.success('保存成功！')
  await pageReload()
  status.value = 3
}

//获取当年月日
function new_Date() {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  // console.log(dateTime)
  return dateTime
}

async function giveUp() {
  if (status.value == 1) {
    // await contentSwitch('first')
    await contentSwitch('tail')
  } else if (status.value == 2) {
    await contentSwitch('curr')
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
    tableData.value = list
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
  // debugger
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
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':'stockName'].indexOf(value) !=-1)
    let data:any = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : 'stockName'],
        label: (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }

  timeout = setTimeout(fake, 300);
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
  console.log(thisEditObj.value)
  console.log(thisEditType.value)
  if (thisEditType.value=='cvencode'){
    formItems.value.cvencode = o[0].id
    cvencodeChange()
  }
  if (thisEditType.value=='cdepcode'){
    formItems.value.cdepcode = o.id
  }
  if (thisEditType.value=='cpersoncode'){
    formItems.value.cpersoncode = o.id
  }
  /*if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      thisEditObj.value['tempOne'] = o[0].id
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }*/
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
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

const isum:any = ref('0')
const isum1:any = ref('0')
const hxIsum:any = ref('0')
const hxMoney:any = ref('0')
const idiscount:any = ref('0')
//计算收款明细和核销明细
function countTable(){
  isum.value = 0
  getDataSource().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
    }
  })
  isum1.value = 0
  hxIsum.value = 0
  hxMoney.value = 0
  idiscount.value = 0
  getDataSource1().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum1.value = add(isum1.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      hxIsum.value = add(hxIsum.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      hxMoney.value = add(hxMoney.value,item.hxMoney)
    }
    if (item.idiscount!=null && item.idiscount!=''){
      idiscount.value = add(idiscount.value,item.idiscount)
    }
  })
  // formItems.value.idiscount = idiscount.value
}
//分摊核销
function countFentan(){
  tableData1.value = getDataSource1()
  tableData1.value.forEach(item=>{
    item.hxMoney = '0'
    return item
  })
  countTable()
  tableData1.value.forEach(item=>{
    if (item.whxIsum!=null && item.whxIsum!='') {
      item.hxMoney = '0'
      let whxIsum = 0
      if (item.idiscount!=null && item.idiscount != ''){
        whxIsum = sub(item.whxIsum,item.idiscount)
      } else {
        whxIsum = item.whxIsum
      }
      if (sub(isum.value, hxMoney.value) > whxIsum) {
        item.hxMoney = whxIsum
      } else {
        item.hxMoney = sub(isum.value, hxMoney.value)
      }
      item.tempOne = item.hxMoney
    }
    countTable()
    return item
  })
  setTableData1(tableData1.value)
}

const tableDataChange =  (r,c) => {
  // let h = formFuns.value.getFormValue();
  // if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)) r.cwhcode = h.cwhcode
  /*switch (c) {
    case 'cunitid':
      if (r.cunitid == null)
      break
    case 'cinvode':
      if (r.cinvode == null) r.cinvodeName = r.tempEleven
      if (r.cinvode !=null || r.cinvodeName != null) chChange(r)
      break;
    case 'baseQuantity':
    case 'price':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.price)) {
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.price).toFixed(10)
        r.icost = (n * d).toFixed(4) + ''
        r.tempTen = r.icost
        r.baseQuantity = n + ''
        r.price = d + ''
      }
      slChange(r,c)
      break;
    case 'icost':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.icost)) { //反算 单价
        let n:any = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.icost).toFixed(4)
        r.baseQuantity = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n:any = parseFloat(r.price).toFixed(10)
        let d:any = parseFloat(r.icost).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.baseQuantity = (d / n).toFixed(10) + ''
        slChange(r,c)
      }
      break;
  }*/
  countTable()
}

const slChange = (r,c) => {
  if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list:any = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum:any  = (r.unitInfo.unitType == '2')
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
    }
  }
}
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (it.stockNum == record.cinvode) || (it.stockName == record.cinvodeName))[0]
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  if (o.stockMeasurementType == '多计量' && !hasBlank(record.cunitid) &&  record?.unitInfo == null){
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
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  // debugger
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['cunitid','cunitidF1','isum','pjType','pjCode','pjDate','pjDhDate','cmemo']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter(it=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData.value = list
      setTableData(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'cunitid' || nextC == 'cunitidF1' || nextC == 'isum' || nextC == 'pjType' || nextC == 'pjCode' || nextC == 'pjDate' || nextC == 'pjDhDate' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {cunitid:'One',cunitidF1:'Two',isum:'Three',pjType:'Four',pjCode:'Five',pjDate:'Six',pjDhDate:'Seven',cmemo:'Eight'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

const focusNext1 =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark1(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource1();
  let filters = ['hxMoney','idiscount']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns1().filter(it=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData1.value = list
    setTableData1(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark1(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark1(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData1.value = list
      setTableData1(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' || nextC == 'idiscount' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark1 = (c,b) => {
  let model:any = {hxMoney:'One',idiscount:'Two'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

import SelectXhd from './popup/select-xhd.vue'
const [registerSelectXhdPage, { openModal: openSelectXhdPage }] = useModal()
const openSelectXhd = () => {
  if(formItems.value.cvencode!=null && formItems.value.cvencode!='') {
    openSelectXhdPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      year: dynamicYear.value,
      cvencode: formItems.value.cvencode,
      list: getDataSource1()
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先选择客户！'
    })
  }
}
async function saveSelectXhd(data){
  // console.log(data)
  tableData1.value = getDataSource1()
  data.map(item=>{
    item.hxStyle = item.billStyle
    item.hxCcode = item.ccode
    if (item.hxIsum!=null && item.hxIsum !='') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    return item
  })
  tableData1.value.push(...data)
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

    .actod-btn {
      color: @Global-Comm-BcOrText-Color;
      font-size: 14px;
      border-color: @Global-Border-Color;
      //border-right: none;
    }

    .actod-btn-last {
      border-right: 1px solid @Global-Border-Color;
    }

    .actod-btn:hover {
      background-color: @Global-Comm-BcOrText-Color;
      color: white;
    }

    :deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input),:deep(.ant-select) {
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      width: 100%;
      font-size: 14px;
      font-weight: bold;
    }
    :deep(.ant-input-number){
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      width: 100%;
      min-width: 0;

      .ant-input-number-handler-wrap{
        display:none;
      }
      input{
        font-size: 14px;
        font-weight: bold;
        font-family: Arial !important;
      }
    }
    :deep(.right) input{
      text-align:right;
    }

    :deep(.ant-picker){
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      input {
        font-size: 14px;
        font-weight: bold;
      }
    }

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
        margin: 0 5rem 10px;

        label {
          text-align: left;
          width: 10%;
          display: inline-block;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 2em;
          color: #535353;
          font-size: 13px;
          font-weight: bold;
        }

        :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
          border: none;
          background-color: white;
          color: black;

          .ant-picker-input {
            > input {
              color: black;
            }
          }
        }

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
        > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5){
                                   >span:nth-of-type(1){
                                     margin-left: 10%;
                                     float: left;
                                   }
                                 }
        > div:nth-of-type(1) {
          width: 19%;
          text-align: center;
        }

        > div:nth-of-type(2) {
          width: 20%;
          margin: 0 1px;
          text-align: center;
        }
        > div:nth-of-type(3) {
          width: 20%;
          text-align: right;
          margin: 0 1px;
        }
        > div:nth-of-type(4) {
          width: 20%;
          margin: 0 1px;
          text-align: center;
        }
        > div:nth-of-type(5) {
          width: 20%;
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

.ant-table.ant-table-bordered > .ant-table-summary {
  border: 1px solid #f0f0f0;
  border-top: 0;
}

 .vben-basic-table .ant-table-summary {
   padding: 0;
 }

 .ant-table-summary {
   border-radius: 0 0 2px 2px;
 }

 .ant-table-summary {
   padding: 16px 16px;
   color: rgba(0, 0, 0, 0.85);
   background: #fafafa;
 }

</style>
<style lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
</style>
