<template>
  <div class="app-container">
    <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
    <!--   <div><textarea>红字回冲单的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>
          <AccountPicker theme="three" :readonly="status==3" @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div></div>
      <div style="margin-right:10px;">
        <div>
          <Button class="actod-btn" @click="" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
<!--          <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck!='1'">修改</Button>-->
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
<!--          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 && formItems.bcheck!='1' ">审核</button>
          <Button class="actod-btn" @click="startReview(false)" v-if="status == 3 && formItems.bcheck=='1' ">弃审</button>-->
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
<!--              <span class="group-btn-span-special">&nbsp;来源单据&emsp;&emsp;</span><br/>-->
              <span class="group-btn-span-special">&nbsp;下游单据&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
<!--          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">更多</Button>
          </Popover>-->
<!--          <Button v-if="status != 3" class="actod-btn">导入</Button>-->
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div :class="status != 3?'status-look':''">
          <!--          <div class="acttd-right-d-search">
                      <InputSearch
                        class="acttdrd-search-input"
                        placeholder="存货编码或名称"
                        style="border-left:1px solid #c9c9c9;"
                        @search="pageSearch"
                        v-model:value="pageParameter.searchConditon.value"
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
          <span style="font-size: 28px;font-weight: bold;border-bottom:3px double red;" :style="{color: titleValue===0?'#0096c7':'red'}">
            {{ titleContents[titleValue] }}
          </span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <label>单据日期：</label>
          <DatePicker v-model:value="formItems.ddate" @change="generateCode(formItems.ddate)" :disabled-date="disabledDate" :locale="localeCn" placeholder="变动日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.ccode" :disabled="true" style="width: 15%;"/>
          <label>单据类型：</label>
          <Select v-model:value="formItems.busStyle" @change="cvencodeChange()" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
            <SelectOption value="SKD">收款单</SelectOption>
            <SelectOption value="YSD">应收单</SelectOption>
          </Select>
          <label>客户：</label>
          <Select v-model:value="formItems.cvencode" @change="cvencodeChange()" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencode')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <br/>

          <label>业务部门：</label>
          <Select v-model:value="formItems.cdepcode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cdepcode')"/>
            </template>
            <SelectOption v-for="item in deptList" :value="item.id" >
              {{ item.deptName }}
            </SelectOption>
          </Select>
          <label>业务员：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
<!--          <label>折扣金额：</label>
          <span @mouseover="clickMoney=false" @mouseout="clickMoney=true">
            <Input v-if="clickMoney" :value="toThousandFilter(formItems.idiscount)" style="width: 15%;" />
            <InputNumber v-if="!clickMoney" v-model:value="formItems.idiscount" style="width: 15%;" />
          </span>-->

          <label>备注：</label>
          <Input v-model:value="formItems.cmemo" style="width: 15%;"/>
          <br/>
        </div>
      </div>
      <div v-show="formItems.busStyle=='SKD'" class="acb-centent">
        <div>
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">蓝字</span>
          <div v-if="status != 3" style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="tableAdd">增行</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel">删行</Button>
          </div>
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: totalColumnWidth,y: 160}"
            @register="registerTable"
            :dataSource="tableData"
          >
            <template #billStyle="{ record }">{{formatBillStyle(record.sourcetype)}}</template>
            <template #isum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
            </template>
            <template #whxIsum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.whxIsum)}}</span>
            </template>
            <template #cvencode="{ record }">{{formatCvencode(record.cvencode)}}</template>
            <template #cvencodeJs="{ record }">{{formatCvencode(record.cvencodeJs)}}</template>
            <template #cmakerId="{ record }">{{formatCpersoncode(record.cmakerId)}}</template>
            <template #cdepcode="{ record }">{{formatCdepcode(record.cdepcode)}}</template>
            <template #hxStyle="{ record }">
              <span v-if="record.hxStyle=='SKD'">收款单</span>
              <span v-if="record.hxStyle=='FKD'">付款单</span>
            </template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" style="width: 85%;" @blur="checkMoney(record,index,'hxMoney')" @keyup.enter="focusNext(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>
            <template #ljhxIsum="{ record }">{{toThousandFilter(record.ljhxIsum)}}</template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width: 23%;">
                  <span>合计</span>
                </div>
                <div style="width: 19%;">
                  <span>收款金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>未结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(wjsIsum) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>本次结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(bcjsIsum) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>累计结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(ljjsIsum) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(wjsIsum) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(bcjsIsum) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(ljjsIsum) }}</TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
        <div style="margin-top: 10px;">
          <span style="font-size: 18px;font-weight: bold;color: red;">红字</span>
          <div v-if="status != 3" style="float: right;">
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
            :scroll="{ x: totalColumnWidth,y: 160}"
            @register="registerTable1"
            :dataSource="tableData1"
          >
            <template #billStyle="{ record }">{{formatBillStyle(record.sourcetype)}}</template>
            <template #isum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
            </template>
            <template #whxIsum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.whxIsum)}}</span>
            </template>
            <template #cvencode="{ record }">{{formatCvencode(record.cvencode)}}</template>
            <template #cvencodeJs="{ record }">{{formatCvencode(record.cvencodeJs)}}</template>
            <template #cmakerId="{ record }">{{formatCpersoncode(record.cmakerId)}}</template>
            <template #cdepcode="{ record }">{{formatCdepcode(record.cdepcode)}}</template>
            <template #hxStyle="{ record }">
              <span v-if="record.hxStyle=='SKD'">收款单</span>
              <span v-if="record.hxStyle=='FKD'">付款单</span>
            </template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" style="width: 85%;" @blur="checkMoney1(record,index,'hxMoney')" @keyup.enter="focusNext1(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>
            <template #ljhxIsum="{ record }">{{toThousandFilter(record.ljhxIsum)}}</template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width: 23%;">
                  <span>合计</span>
                </div>
                <div style="width: 19%;">
                  <span>收款金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum1) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>未结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(wjsIsum1) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>本次结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(bcjsIsum1) }}</span>
                </div>
                <div style="width: 19%;">
                  <span>累计结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(ljjsIsum1) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum1) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(wjsIsum1) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(bcjsIsum1) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(ljjsIsum1) }}</TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
      </div>
      <div v-show="formItems.busStyle=='YSD'" class="acb-centent">
        <div>
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">蓝字</span>
          <div v-if="status != 3" style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="tableAdd">增行</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel2">删行</Button>
          </div>
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys2, onChange: onSelectChange2 }"
            :scroll="{ x: totalColumnWidth,y: 160}"
            @register="registerTable2"
            :dataSource="tableData2"
          >
            <template #hxStyle="{ record }">
              <span>{{formatHxStyle(record.sourcetype)}}</span>
            </template>
            <template #ddate="{ record }">
              <span>{{record.ddate}}</span>
            </template>
            <template #hxCcode="{ record }">
              <span>{{record.hxCcode}}</span>
            </template>
            <template #cvencode="{ record }">
              <span>{{formatCvencode(record.cvencode)}}</span>
            </template>
            <template #isum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
            </template>
            <template #whxIsum="{ record }">
              <span>{{toThousandFilter(record.whxIsum)}}</span>
            </template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" style="width: 85%;" @blur="checkMoney2(record,index,'hxMoney')" @keyup.enter="focusNext2(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>
            <template #cmemo="{ record }">
              <span>{{record.cmemo}}</span>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width:39%;">
                  <span>合计</span>
                </div>
                <div>
                  <span>应收金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum2) }}</span>
                </div>
                <div>
                  <span>未结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxIsum2) }}</span>
                </div>
                <div>
                  <span>本次结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxMoney2) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum2) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxIsum2) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxMoney2) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="10" :align="'center'"></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
        <div style="margin-top: 10px;">
          <span style="font-size: 18px;font-weight: bold;color: red;">红字</span>
          <div v-if="status != 3" style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="countFentan1">分摊</Button>
            <Button class="ant-btn-sm actod-btn" @click="openSelectXhd">选单</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel3">删单</Button>
          </div>
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys3, onChange: onSelectChange3 }"
            :scroll="{ x: totalColumnWidth,y: 160}"
            @register="registerTable3"
            :dataSource="tableData3"
          >
            <template #hxStyle="{ record }">
              <span>{{formatHxStyle(record.sourcetype)}}</span>
            </template>
            <template #ddate="{ record }">
              <span>{{record.ddate}}</span>
            </template>
            <template #hxCcode="{ record }">
              <span>{{record.hxCcode}}</span>
            </template>
            <template #cvencode="{ record }">
              <span>{{formatCvencode(record.cvencode)}}</span>
            </template>
            <template #isum="{ record }">
              <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
            </template>
            <template #whxIsum="{ record }">
              <span>{{toThousandFilter(record.whxIsum)}}</span>
            </template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" style="width: 85%;" @blur="checkMoney3(record,index,'hxMoney')" @keyup.enter="focusNext3(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>
            <template #cmemo="{ record }">
              <span>{{record.cmemo}}</span>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width:39%;">
                  <span>合计</span>
                </div>
                <div>
                  <span>应收金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum3) }}</span>
                </div>
                <div>
                  <span>未结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxIsum3) }}</span>
                </div>
                <div>
                  <span>本次结算金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxMoney3) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum3) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxIsum3) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxMoney3) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="10" :align="'center'"></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
    <SelectXhd
      @save="saveSelectXhd"
      @register="registerSelectXhdPage"
    />
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
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
  CaretDownOutlined,CopyOutlined
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
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  deleteArApYsyfById, deleteArApYsyfsByCcode, deleteArApYsyfsById,
  findArApWriteOffByCcode, findArApYsyfByCcode,
  findArApYsyfsByCcode,
  findByTypeList, findWhxskd, saveSaleousing, saveStockXyCsource,
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
import {
 add,
 pad,
 sub,
 toThousandFilter
} from "../YingShouKuanQiChuYuE/calculation";
import {getSysBankAccountByStatus} from "/@/api/record/system/sys-bank-account";
import {findBySkWhxXhd} from "/@/api/record/system/hexiao";
import moment from "moment";
import {
  deleteArApHzhcdById,
  deleteArApHzhcdsByCcode,
  findArApHzhcdList,
  findArApHzhcdsByCcode,
  findBukongCcode, findHzhcdsByCcode,
  saveArApHzhcd, saveArApHzhcdsList
} from "/@/api/record/system/ArApHzhcd";

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
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['红字回冲单', '红字回冲单', '红字回冲单']
const titleValue = ref(1)
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
const arHexiaoAuto:any = ref()
const arSourceFlag:any = ref()
const arCheckFlag:any = ref()
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  // dynamicYear.value = obj.stockYear
  dynamicYear.value = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]

  const res = await findByStockAccId(obj.accId)
  arHexiaoAuto.value = res.arHexiaoAuto
  arSourceFlag.value = res.arSourceFlag
  arCheckFlag.value = res.arCheckFlag

  await reloadList()
  await pageReload()
}

const tableData:any = ref([]);
const tableData1:any = ref([]);
const tableData2:any = ref([]);
const tableData3:any = ref([]);

const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.id)
  console.log(JSON.stringify(routemsg.value).length)*/
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicAccId.value = routemsg.value.defaultAdName
  dynamicYear.value = routemsg.value.year
  //新增
  if (routemsg.value.isEdit == '1') {
    status.value = routemsg.value.isEdit
    formItems.value.id = null
    await startEdit('add')
  } else if (routemsg.value.isEdit == '2' || routemsg.value.isEdit == '3') {
    status.value = routemsg.value.isEdit
    formItems.value.id = routemsg.value.id
    // await contentSwitch('curr')
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
const skdList:any = ref([])
async function cvencodeChange(){
  await balanceTaskDel()
  tableData.value = []
  tableData1.value = []
  tableData2.value = []
  tableData3.value = []
  skdList.value = []
  saleousingList.value = []
  if (formItems.value.cvencode!=''&&formItems.value.cvencode!=null){
    if(formItems.value.busStyle=='SKD') {
      const res = await useRouteApi(findWhxskd,{schemaName: dynamicTenantId})({year:dynamicYear.value,cvencode:formItems.value.cvencode})
      skdList.value = res
      for (let i = 0; i < skdList.value.length; i++) {
        let item = skdList.value[i]
        let danju = item.bdocumStyle!='1'?'收款单':'退款单'
        let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:danju,method:'修改,删除,审核,弃审',recordNum:item.ccode})
        if(taskData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:'ar'})
        } else {
          // 任务不是当前操作员的
          if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            await unCvencode()
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:'ar'})
          }
        }
      }
      tableData.value = res.filter(item => item.bdocumStyle != '1').map(item => {
        item.sourcecode = item.ccode
        item.sourcedate = item.ddate
        item.sourcetype = item.billStyle
        item.whxIsum = sub(item.isum,item.hxIsum==null?'0':item.hxIsum)
        // item.hxMoney = item.whxIsum
        // item.tempOne = item.whxIsum
        item.ljhxIsum = add(item.hxIsum==null?'0':item.hxIsum,item.hxMoney)
        return item
      })
      if (tableData.value.length < 10) {
        let num = 10 - tableData.value.length
        for (let i = 0; i < num; i++) {
          tableData.value.push({})
        }
      }
      setTableData(tableData.value)
      tableData1.value = res.filter(item => item.bdocumStyle == '1').map(item => {
        item.sourcecode = item.ccode
        item.sourcedate = item.ddate
        item.sourcetype = item.billStyle
        item.whxIsum = sub(item.isum,item.hxIsum==null?'0':item.hxIsum)
        // item.hxMoney = item.whxIsum
        // item.tempOne = item.whxIsum
        item.ljhxIsum = add(item.hxIsum==null?'0':item.hxIsum,item.hxMoney)
        return item
      })
      if (tableData1.value.length < 10) {
        let num = 10 - tableData1.value.length
        for (let i = 0; i < num; i++) {
          tableData1.value.push({})
        }
      }
      setTableData1(tableData1.value)
    } else {
      const saleList = await useRouteApi(findBySkWhxXhd, {schemaName: dynamicTenantId})({
        year: dynamicYear.value,
        cvencode: formItems.value.cvencode
      })
      if (arSourceFlag.value=='1') {
        saleousingList.value = saleList.filter(item => item.busStyle !='XHD' && item.busStyle !='QCXHD' && item.bworkable=='1')
      } else {
        if(arCheckFlag=='1'){
          saleousingList.value = saleList.filter(item => item.busStyle !='XSFP' && item.busStyle !='QCXSFP' && item.bworkable=='1')
        } else {
          saleousingList.value = saleList.filter(item => item.busStyle !='XSFP' && item.busStyle !='QCXSFP')
        }
      }
      for (let i = 0; i < saleousingList.value.length; i++) {
        let item = saleousingList.value[i]
        let danju = formatHxStyle(item.billStyle)
        let model = item.billStyle=='YSD'?'ar':'stock'
        let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:danju,method:'修改,删除,审核,弃审',recordNum:item.ccode})
        if(taskData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:model})
        } else {
          // 任务不是当前操作员的
          if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            await unCvencode()
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:model})
          }
        }
      }
      tableData2.value = saleousingList.value.filter(item=>item.bdocumStyle != '1' && item.isum!=0).map(item => {
        item.sourcecode = item.ccode
        item.sourcedate = item.ddate
        item.hxStyle = item.billStyle
        item.sourcetype = item.billStyle
        if (item.hxIsum != null && item.hxIsum != '') {
          item.whxIsum = sub(item.isum, item.hxIsum)
        } else {
          item.whxIsum = item.isum
        }
        // item.hxMoney = item.whxIsum
        // item.tempOne = item.whxIsum
        return item
      })
      if (tableData2.value.length < 10) {
        let num = 10 - tableData2.value.length
        for (let i = 0; i < num; i++) {
          tableData2.value.push({})
        }
      }
      setTableData2(tableData2.value)
      tableData3.value = saleousingList.value.filter(item=>item.bdocumStyle == '1' && item.isum!=0).map(item => {
        item.sourcecode = item.ccode
        item.sourcedate = item.ddate
        item.hxStyle = item.billStyle
        item.sourcetype = item.billStyle
        if (item.hxIsum != null && item.hxIsum != '') {
          item.whxIsum = sub(item.isum, item.hxIsum)
        } else {
          item.whxIsum = item.isum
        }
        // item.hxMoney = item.whxIsum
        // item.tempOne = item.whxIsum
        return item
      })
      if (tableData3.value.length < 10) {
        let num = 10 - tableData3.value.length
        for (let i = 0; i < num; i++) {
          tableData3.value.push({})
        }
      }
      setTableData3(tableData3.value)
    }
    await countTable()
  } else {
    tableData.value = []
    for (let i = 0; i < 10; i++) {
      tableData.value.push({})
    }
    tableData1.value = []
    for (let i = 0; i < 10; i++) {
      tableData1.value.push({})
    }
    tableData2.value = []
    for (let i = 0; i < 10; i++) {
      tableData2.value.push({})
    }
    tableData3.value = []
    for (let i = 0; i < 10; i++) {
      tableData3.value.push({})
    }
    setTableData(tableData.value)
    setTableData1(tableData1.value)
    setTableData2(tableData2.value)
    setTableData3(tableData3.value)
  }
}
//清空客户
async function unCvencode(){
  await balanceTaskDel()
  formItems.value.cvencode = ''
  skdList.value = []
  saleousingList.value = []
  tableData.value = []
  for (let i = 0; i < 10; i++) {
    tableData.value.push({})
  }
  tableData1.value = []
  for (let i = 0; i < 10; i++) {
    tableData1.value.push({})
  }
  tableData2.value = []
  for (let i = 0; i < 10; i++) {
    tableData2.value.push({})
  }
  tableData3.value = []
  for (let i = 0; i < 10; i++) {
    tableData3.value.push({})
  }
  setTableData(tableData.value)
  setTableData1(tableData1.value)
  setTableData2(tableData2.value)
  setTableData3(tableData3.value)
}

async function balanceTaskDel() {
  for (let i = 0; i < skdList.value.length; i++) {
    let item = skdList.value[i]
    let danju = item.bdocumStyle != '1' ? '收款单' : '退款单'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
  for (let i = 0; i < saleousingList.value.length; i++) {
    let item = saleousingList.value[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = item.sourcetype == 'YSD' ? 'ar' : 'stock'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
}

const num = ref(0)
const hzhcdsList:any = ref([])
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findArApHzhcdList,{schemaName: dynamicTenantId})({billStyle:'SKD',iyear:dynamicYear.value})
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
    hzhcdsList.value = await useRouteApi(findHzhcdsByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle,busStyle:formItems.value.busStyle})
    if(formItems.value.busStyle=='SKD') {
      tableData.value = hzhcdsList.value.filter(item => item.bdocumStyle != '1').map(item => {
        item.whxIsum = sub(item.isum, item.ydhxIsum)
        item.hxMoney = item.hxIsum
        item.ljhxIsum = item.ydhxIsum
        return item
      })
      if (tableData.value.length < 10) {
        let num = 10 - tableData.value.length
        for (let i = 0; i < num; i++) {
          tableData.value.push({})
        }
      }
      tableData1.value = hzhcdsList.value.filter(item => item.bdocumStyle == '1').map(item => {
        item.whxIsum = sub(item.isum, item.ydhxIsum)
        item.hxMoney = item.hxIsum
        item.ljhxIsum = item.ydhxIsum
        return item
      })
      if (tableData1.value.length < 10) {
        let num = 10 - tableData1.value.length
        for (let i = 0; i < num; i++) {
          tableData1.value.push({})
        }
      }
      setTableData(tableData.value)
      setTableData1(tableData1.value)
    } else {
      tableData2.value = hzhcdsList.value.filter(item => item.bdocumStyle != '1').map(item => {
        item.whxIsum = sub(item.isum, item.ydhxIsum)
        item.hxMoney = item.hxIsum
        item.ljhxIsum = item.ydhxIsum
        return item
      })
      if (tableData2.value.length < 10) {
        let num = 10 - tableData2.value.length
        for (let i = 0; i < num; i++) {
          tableData2.value.push({})
        }
      }
      tableData3.value = hzhcdsList.value.filter(item => item.bdocumStyle == '1').map(item => {
        item.whxIsum = sub(item.isum, item.ydhxIsum)
        item.hxMoney = item.hxIsum
        item.ljhxIsum = item.ydhxIsum
        return item
      })
      if (tableData3.value.length < 10) {
        let num = 10 - tableData3.value.length
        for (let i = 0; i < num; i++) {
          tableData3.value.push({})
        }
      }
      setTableData2(tableData2.value)
      setTableData3(tableData3.value)
    }
    await countTable()
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
      title: '单据日期',
      dataIndex: 'sourcedate',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编码',
      dataIndex: 'sourcecode',
      width: 120,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '部门',
      dataIndex: 'cdepcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cdepcode'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '收款金额',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '未结算金额',
      dataIndex: 'whxIsum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'whxIsum'}
    },
    {
      title: '本次结算金额',
      dataIndex: 'hxMoney',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'hxMoney'}
    },
    {
      title: '累计结算金额',
      dataIndex: 'ljhxIsum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'ljhxIsum'}
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
      dataIndex: 'sourcetype',
      ellipsis: true,
      slots: {customRender: 'hxStyle'},
      width: 150
    },
    {
      title: '单据日期',
      dataIndex: 'sourcedate',
      ellipsis: true,
      slots: {customRender: 'sourcedate'},
      width: 150
    },
    {
      title: '单据编号',
      dataIndex: 'sourcecode',
      ellipsis: true,
      slots: {customRender: 'sourcecode'},
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
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
      width: 200,
    }
  ]
}
// 这是示例组件
const [registerTable2, {
  reload:reload2,
  getDataSource:getDataSource2,
  setTableData:setTableData2,
  setPagination:setPagination2,
  getPaginationRef:getPaginationRef2,
  getColumns:getColumns2,
  setColumns:setColumns2
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

// 这是示例组件
const [registerTable3, {
  reload:reload3,
  getDataSource:getDataSource3,
  setTableData:setTableData3,
  setPagination:setPagination3,
  getPaginationRef:getPaginationRef3,
  getColumns:getColumns3,
  setColumns:setColumns3
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
  } else if (hxStyle=='YSD'){
    str = '应收单'
  } else if (hxStyle=='SKD'){
    str = '收款单'
  } else if (hxStyle=='XSFP'){
    str = '销售发票'
  } else if (hxStyle=='XHD'){
    str = '销货单'
  } else if (hxStyle=='PTSK'){
    str = '普通收款'
  } else if (hxStyle=='YSK'){
    str = '预收款'
  } else if (hxStyle=='XSFP'){
    str = '销售发票'
  } else if (hxStyle=='QCXHD'){
    str = '期初销货单'
  } else if (hxStyle=='QCXSFP'){
    str = '期初销售发票'
  }
  return str
}

function formatBillStyle(billStyle){
  let str = billStyle
  //XHD销货单、PLXHD批量销货单、XSCKD销售出库单、QTCKD其他出库单、DBCKD调拨出库单、XTZHCKD形态转换出库单、JYJCD借用借出单
  if (billStyle=='XHD'){
    str = '销货单'
  } else if (billStyle=='PLXHD'){
    str = '批量销货单'
  } else if (billStyle=='XSCKD'){
    str = '销售出库单'
  } else if (billStyle=='QTCKD'){
    str = '其他出库单'
  } else if (billStyle=='DBCKD'){
    str = '调拨出库单'
  } else if (billStyle=='XTZHCKD'){
    str = '形态转换出库单'
  } else if (billStyle=='JYJCD'){
    str = '借用借出单'
  } else if (billStyle=='XSFP'){
    str = '销售发票'
  } else if (billStyle=='QCXHD'){
    str = '期初销货单'
  } else if (billStyle=='QCXSFP'){
    str = '期初销售发票'
  }
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

function formatCpersoncode(cpersoncode){
  let str = cpersoncode
  psnList.value.forEach(item=>{
    if(item.id == cpersoncode){
      str = item.psnName
    }
  })
  return str
}

function formatCdepcode(cdepcode){
  let str = cdepcode
  deptList.value.forEach(item=>{
    if(item.id == cdepcode){
      str = item.deptName
    }
  })
  return str
}

function checkMoney(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  let sum = add(num2,num3)
  if (num1-sum<0 && num2<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
  }
  record.ljhxIsum = add(record.hxIsum==null?'0':record.hxIsum,record.hxMoney==null?'0':record.hxMoney)
  tableData.value[index] = record
}

function checkMoney1(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  let sum = add(num2,num3)
  if (num1-sum>0 && num2<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
  }
  record.ljhxIsum = add(record.hxIsum==null?'0':record.hxIsum,record.hxMoney==null?'0':record.hxMoney)
  tableData1.value[index] = record
}

function checkMoney2(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  let sum = add(num2,num3)
  if (num1-sum<0 && num2>0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
  }
  record.ljhxIsum = add(record.hxIsum==null?'0':record.hxIsum,record.hxMoney==null?'0':record.hxMoney)
  tableData2.value[index] = record
}

function checkMoney3(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  let sum = add(num2,num3)
  if (num1-sum>0 && num2<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
  }
  record.ljhxIsum = add(record.hxIsum==null?'0':record.hxIsum,record.hxMoney==null?'0':record.hxMoney)
  tableData3.value[index] = record
}

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  for (let i = 0; i < getDataSource().length; i++) {
    let item = getDataSource()[i]
    if(k.indexOf(item.key)!=-1){
      if(hasBlank(item.hxMoney) || item.hxMoney==0) {
        item.hxMoney = item.whxIsum
        item.tempOne = item.hxMoney
      }
    } else {
      item.hxMoney = null
      item.tempOne = null
    }
  }
  countTable()
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const tableSelectedRowKeys1:any = ref([])
const tableSelectedRowObjs1:any = ref([])
const onSelectChange1 = (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
  for (let i = 0; i < getDataSource1().length; i++) {
    let item = getDataSource1()[i]
    if(k.indexOf(item.key)!=-1){
    } else {
      item.hxMoney = null
      item.tempOne = null
    }
  }
}

const tableSelectedRowKeys2:any = ref([])
const tableSelectedRowObjs2:any = ref([])
const onSelectChange2 = (k, o) => {
  for (let i = 0; i < getDataSource2().length; i++) {
    let item = getDataSource2()[i]
    if(k.indexOf(item.key)!=-1){
      if(hasBlank(item.hxMoney) || item.hxMoney==0) {
        item.hxMoney = item.whxIsum
        item.tempOne = item.hxMoney
      }
    } else {
      item.hxMoney = null
      item.tempOne = null
    }
  }
  countTable()
  tableSelectedRowKeys2.value = k
  tableSelectedRowObjs2.value = o
}

const tableSelectedRowKeys3:any = ref([])
const tableSelectedRowObjs3:any = ref([])
const onSelectChange3 = (k, o) => {
  for (let i = 0; i < getDataSource3().length; i++) {
    let item = getDataSource3()[i]
    if(k.indexOf(item.key)!=-1){
    } else {
      item.hxMoney = null
      item.tempOne = null
    }
  }
  countTable()
  tableSelectedRowKeys3.value = k
  tableSelectedRowObjs3.value = o
}

const tableAdd = () => {
  tableData.value.push({})
  setTableData(tableData.value)
  tableSelectedRowKeys.value = []
}

const tableDel = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < tableSelectedRowObjs.value.length; i++) {
      let item = tableSelectedRowObjs.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData.value = list
    setTableData(list)
    tableSelectedRowKeys.value = []
    countTable()
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
    for (let i = 0; i < tableSelectedRowObjs1.value.length; i++) {
      let item = tableSelectedRowObjs1.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData1.value = list
    setTableData1(list)
    tableSelectedRowKeys1.value = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const tableDel2 = () => {
  if (tableSelectedRowKeys2.value.length > 0) {
    let list = getDataSource2()
    for (let i = 0; i < tableSelectedRowObjs2.value.length; i++) {
      let item = tableSelectedRowObjs2.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData2.value = list
    setTableData2(list)
    tableSelectedRowKeys2.value = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const tableDel3 = () => {
  if (tableSelectedRowKeys3.value.length > 0) {
    let list = getDataSource3()
    for (let i = 0; i < tableSelectedRowObjs3.value.length; i++) {
      let item = tableSelectedRowObjs3.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData3.value = list
    setTableData3(list)
    tableSelectedRowKeys3.value = []
    countTable()
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
    let date:any = useCompanyOperateStoreWidthOut().getLoginDate
    dynamicYear.value = date.split('-')[0]
    // 获取最新
    let code = await generateCode(date)
    formItems.value = {
      ddate: date,
      ccode: code,
      busStyle: 'SKD',
      billStyle: 'SKD'
    }
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    tableData1.value = list
    tableData2.value = list
    tableData3.value = list
    setTableData(tableData.value)
    setTableData1(tableData1.value)
    setTableData2(tableData2.value)
    setTableData3(tableData3.value)
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
  dynamicYear.value = yy
  // let yy = formItems.value.ddate.substring(0,4)
  // let mm = formItems.value.ddate.substring(5,7)
  let str = 'HC-' + yy + mm + '-'
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
        title: '红字回冲单删除',
        content: '您确定要进行红字回冲单删除吗!',
        onOk: async () => {
          let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'红字回冲单',method:'修改,删除,审核,弃审',recordNum:formItems.value.ccode})
          if(taskData.length==0){
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'红字回冲单',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
          } else {
            // 任务不是当前操作员的
            if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
              return createWarningModal({ content: taskData[0]?.username+'正在删除红字回冲单,不能同时进行操作！' });
            }else{
              await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'红字回冲单',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
            }
          }
          const list = await useRouteApi(findArApHzhcdsByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle})
          if (formItems.value.busStyle=='SKD') {
            for (let j = 0; j < list.length; j++) {
              let item1 = list[j]
              const res = await useRouteApi(findArApYsyfByCcode,{schemaName: dynamicTenantId})(item1.sourcecode)
              if(res.length>0) {
                let ysyf = res[0]
                ysyf.hxIsum = sub(ysyf.hxIsum == null ? '' : ysyf.hxIsum, item1.hxIsum == null ? '' : item1.hxIsum)
                ysyf.busStyle = 'PTSK'
                if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
                  ysyf.writeOffStatus = '1'
                } else {
                  ysyf.writeOffStatus = '0'
                }
                if (ysyf.hzhcNum>0) {
                  ysyf.hzhcNum = sub(ysyf.hzhcNum, 1)
                }
                await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
              }
            }
          } else {
            for (let j = 0; j < list.length; j++) {
              let item1 = list[j]
              const saleousing = await useRouteApi(findSaleousingByCcode,{schemaName: dynamicTenantId})({ccode:item1.sourcecode,billStyle:item1.sourceType})
              if (saleousing.hzhcNum>0) {
                saleousing.hzhcNum = sub(saleousing.hzhcNum, 1)
              }
              saleousing.hxFlag = '0'
              saleousing.hxIsum = sub(saleousing.hxIsum, item1.hxIsum == null ? '' : item1.hxIsum)
              await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
              const sales = await useRouteApi(findSaleousingsByCcode,{schemaName: dynamicTenantId})({ccode:saleousing.ccode,billStyle:saleousing.billStyle})
              let salesList:any = []
              let money = item1.hxIsum
              for (let j = 0; j < sales.length; j++) {
                const aa = sales[sales.length - 1 - j]
                if (!hasBlank(money) && money != 0) {
                  if (money > 0) {
                    if (aa.hxIsum < money) {
                      aa.hxIsum = '0'
                      aa.hxFlag = '0'
                      money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                    } else {
                      aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                      aa.hxFlag = '0'
                      money = 0
                    }
                  } else {
                    if (aa.hxIsum > money) {
                      aa.hxIsum = '0'
                      aa.hxFlag = '0'
                      money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                    } else {
                      aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                      aa.hxFlag = '0'
                      money = 0
                    }
                  }
                  salesList.push(aa)
                }
              }
              await useRouteApi(saveSaleousingsList,{schemaName: dynamicTenantId})(salesList)
            }
          }
          await useRouteApi(deleteArApHzhcdById,{schemaName: dynamicTenantId})(formItems.value.id)
          await useRouteApi(deleteArApHzhcdsByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle})
          if (formItems.value.busStyle=='SKD'){}
          //删除任务锁定
          await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'红字回冲单',method:'删除',recordNum:formItems.value.ccode})
          message.success('删除成功！')
          await contentSwitch('tail')
        }
      });
    }
  }
}

const loadMark = ref(false)

//行赋值
function saveRow(row,index){
  tableData1.value[index] = row
  countTable()
}

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
  if(formItems.value.busStyle=='SKD') {
    if (bcjsIsum.value <= 0) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '本次结算金额必须大于0！'
      })
      return false
    }
    if (add(bcjsIsum.value, bcjsIsum1.value) != 0) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '回冲单据结算金额中蓝字金额和红字金额必须相等！'
      })
      return false
    }
  } else {
    if (hxMoney2.value <= 0) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '本次结算金额必须大于0！'
      })
      return false
    }
    if (add(hxMoney2.value, hxMoney3.value) != 0) {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '回冲单据结算金额中蓝字金额和红字金额必须相等！'
      })
      return false
    }
  }
  //保存主表
  let hzhcd:any = {}
  hzhcd.iyear = dynamicYear.value
  hzhcd.ccode = formItems.value.ccode
  hzhcd.cmaker = useUserStoreWidthOut().getUserInfo.id
  hzhcd.billStyle = 'SKD'
  hzhcd.ddate = formItems.value.ddate
  hzhcd.busStyle = formItems.value.busStyle
  hzhcd.cvencode = formItems.value.cvencode
  hzhcd.cdepcode = formItems.value.cdepcode
  hzhcd.cpersoncode = formItems.value.cpersoncode
  hzhcd.currency = formItems.value.currency
  hzhcd.writeOffStatus = formItems.value.writeOffStatus
  hzhcd.cmemo = formItems.value.cmemo
  hzhcd.idiscount = formItems.value.idiscount
  if (formItems.value.busStyle=='SKD') {
    hzhcd.isum = isum.value
    hzhcd.hxIsum = bcjsIsum.value
  } else {
    hzhcd.isum = isum2.value
    hzhcd.hxIsum = hxMoney2.value
  }
  hzhcd.hxIdiscount = formItems.value.hxIdiscount
  hzhcd.citemcode = formItems.value.citemcode
  hzhcd.citemClass = formItems.value.citemClass
  await useRouteApi(saveArApHzhcd,{schemaName: dynamicTenantId})(hzhcd)
  //保存子表
  let list:any = []
  if(formItems.value.busStyle=='SKD') {
    for (let i = 0; i < getDataSource().length; i++) {
      const item = getDataSource()[i]
      if (!hasBlank(item.hxMoney) && item.hxMoney!=0) {
        let hzhcds: any = {}
        hzhcds.iyear = dynamicYear.value
        hzhcds.ccode = formItems.value.ccode
        hzhcds.ddate = formItems.value.ddate
        hzhcds.lineCode = item.lineCode
        hzhcds.lineId = i+1
        hzhcds.bdocumStyle = '0'
        hzhcds.billStyle = formItems.value.billStyle
        hzhcds.busStyle = formItems.value.busStyle
        hzhcds.cvencode = item.cvencode
        hzhcds.citemcode = item.citemcode
        hzhcds.cunitid = item.cunitid
        hzhcds.cunitidF1 = item.cunitidF1
        hzhcds.citemClass = item.citemClass
        hzhcds.itaxCode = item.itaxCode
        hzhcds.itaxrate = item.itaxrate
        hzhcds.idiscount = item.idiscount
        hzhcds.isumYb = item.isumYb
        hzhcds.isum = item.isum
        hzhcds.hxIsum = item.hxMoney
        hzhcds.writeOffStatus = item.writeOffStatus
        hzhcds.cmemo = item.cmemo
        hzhcds.sourcetype = item.sourcetype
        hzhcds.sourcecode = item.sourcecode
        hzhcds.sourcedetailId = item.sourcedetailId
        hzhcds.sourcedate = item.sourcedate
        hzhcds.pjCode = item.pjCode
        hzhcds.pjDate = item.pjDate
        hzhcds.pjType = item.pjType
        hzhcds.pjDhDate = item.pjDhDate
        hzhcds.cdepcode = item.cdepcode
        hzhcds.cpersoncode = item.cpersoncode
        list.push(hzhcds)
      }
    }
    for (let i = 0; i < getDataSource1().length; i++) {
      const item = getDataSource1()[i]
      if (!hasBlank(item.hxMoney) && item.hxMoney!=0) {
        let hzhcds: any = {}
        hzhcds.iyear = dynamicYear.value
        hzhcds.ccode = formItems.value.ccode
        hzhcds.ddate = formItems.value.ddate
        hzhcds.lineCode = item.lineCode
        hzhcds.lineId = i+1
        hzhcds.bdocumStyle = '1'
        hzhcds.billStyle = formItems.value.billStyle
        hzhcds.busStyle = formItems.value.busStyle
        hzhcds.cvencode = item.cvencode
        hzhcds.citemcode = item.citemcode
        hzhcds.cunitid = item.cunitid
        hzhcds.cunitidF1 = item.cunitidF1
        hzhcds.citemClass = item.citemClass
        hzhcds.itaxCode = item.itaxCode
        hzhcds.itaxrate = item.itaxrate
        hzhcds.idiscount = item.idiscount
        hzhcds.isumYb = item.isumYb
        hzhcds.isum = item.isum
        hzhcds.hxIsum = item.hxMoney
        hzhcds.writeOffStatus = item.writeOffStatus
        hzhcds.cmemo = item.cmemo
        hzhcds.sourcetype = item.sourcetype
        hzhcds.sourcecode = item.sourcecode
        hzhcds.sourcedetailId = item.sourcedetailId
        hzhcds.sourcedate = item.sourcedate
        hzhcds.pjCode = item.pjCode
        hzhcds.pjDate = item.pjDate
        hzhcds.pjType = item.pjType
        hzhcds.pjDhDate = item.pjDhDate
        hzhcds.cdepcode = item.cdepcode
        hzhcds.cpersoncode = item.cpersoncode
        list.push(hzhcds)
      }
    }
  } else {
    for (let i = 0; i < getDataSource2().length; i++) {
      const item = getDataSource2()[i]
      if (!hasBlank(item.hxMoney) && item.hxMoney!=0) {
        let hzhcds: any = {}
        hzhcds.iyear = dynamicYear.value
        hzhcds.ccode = formItems.value.ccode
        hzhcds.ddate = formItems.value.ddate
        hzhcds.lineCode = item.lineCode
        hzhcds.lineId = i+1
        hzhcds.bdocumStyle = '0'
        hzhcds.billStyle = formItems.value.billStyle
        hzhcds.busStyle = formItems.value.busStyle
        hzhcds.cvencode = item.cvencode
        hzhcds.citemcode = item.citemcode
        hzhcds.cunitid = item.cunitid
        hzhcds.cunitidF1 = item.cunitidF1
        hzhcds.citemClass = item.citemClass
        hzhcds.itaxCode = item.itaxCode
        hzhcds.itaxrate = item.itaxrate
        hzhcds.idiscount = item.idiscount
        hzhcds.isumYb = item.isumYb
        hzhcds.isum = item.isum
        hzhcds.hxIsum = item.hxMoney
        hzhcds.writeOffStatus = item.writeOffStatus
        hzhcds.cmemo = item.cmemo
        hzhcds.sourcetype = item.sourcetype
        hzhcds.sourcecode = item.sourcecode
        hzhcds.sourcedetailId = item.sourcedetailId
        hzhcds.sourcedate = item.sourcedate
        hzhcds.pjCode = item.pjCode
        hzhcds.pjDate = item.pjDate
        hzhcds.pjType = item.pjType
        hzhcds.pjDhDate = item.pjDhDate
        hzhcds.cdepcode = item.cdepcode
        hzhcds.cpersoncode = item.cpersoncode
        list.push(hzhcds)
      }
    }
    for (let i = 0; i < getDataSource3().length; i++) {
      const item = getDataSource3()[i]
      if (!hasBlank(item.hxMoney) && item.hxMoney!=0) {
        let hzhcds: any = {}
        hzhcds.iyear = dynamicYear.value
        hzhcds.ccode = formItems.value.ccode
        hzhcds.ddate = formItems.value.ddate
        hzhcds.lineCode = item.lineCode
        hzhcds.lineId = i+1
        hzhcds.bdocumStyle = '1'
        hzhcds.billStyle = formItems.value.billStyle
        hzhcds.busStyle = formItems.value.busStyle
        hzhcds.cvencode = item.cvencode
        hzhcds.citemcode = item.citemcode
        hzhcds.cunitid = item.cunitid
        hzhcds.cunitidF1 = item.cunitidF1
        hzhcds.citemClass = item.citemClass
        hzhcds.itaxCode = item.itaxCode
        hzhcds.itaxrate = item.itaxrate
        hzhcds.idiscount = item.idiscount
        hzhcds.isumYb = item.isumYb
        hzhcds.isum = item.isum
        hzhcds.hxIsum = item.hxMoney
        hzhcds.writeOffStatus = item.writeOffStatus
        hzhcds.cmemo = item.cmemo
        hzhcds.sourcetype = item.sourcetype
        hzhcds.sourcecode = item.sourcecode
        hzhcds.sourcedetailId = item.sourcedetailId
        hzhcds.sourcedate = item.sourcedate
        hzhcds.pjCode = item.pjCode
        hzhcds.pjDate = item.pjDate
        hzhcds.pjType = item.pjType
        hzhcds.pjDhDate = item.pjDhDate
        hzhcds.cdepcode = item.cdepcode
        hzhcds.cpersoncode = item.cpersoncode
        list.push(hzhcds)
      }
    }
  }
  await useRouteApi(saveArApHzhcdsList,{schemaName: dynamicTenantId})(list)
  if (formItems.value.busStyle=='SKD'){
    //修改收款单
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      item.hxMoney = item.hxIsum
      const res = await useRouteApi(findArApYsyfByCcode,{schemaName: dynamicTenantId})(item.sourcecode)
      if(res.length>0){
        if(!hasBlank(item.hxMoney) && item.hxMoney!=0) {
          let ysyf = res[0]
          ysyf.hxIsum = add(ysyf.hxIsum == null ? '0' : ysyf.hxIsum, item.hxMoney)
          ysyf.busStyle = 'PTSK'
          if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
            ysyf.writeOffStatus = '1'
          } else {
            ysyf.writeOffStatus = '0'
          }
          ysyf.hzhcNum = add(ysyf.hzhcNum == null ? '0' : ysyf.hzhcNum, 1)
          await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
        }
      }
    }
  } else {
    //修改应收单或销货单
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      item.hxMoney = item.hxIsum
      if(!hasBlank(item.hxMoney) && item.hxMoney!=0) {
        const saleousing = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({ccode:item.sourcecode,billStyle:item.sourceType})
        saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, item.hxMoney)
        if (sub(saleousing.isum, saleousing.hxIsum) == 0) {
          saleousing.hxFlag = '1'
        } else {
          saleousing.hxFlag = '0'
        }
        saleousing.hzhcNum = add(saleousing.hzhcNum == null ? '0' : saleousing.hzhcNum, 1)
        await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
        //修改应收单或销货单子表
        const sales = await useRouteApi(findSaleousingsByCcode, {schemaName: dynamicTenantId})({
          ccode: saleousing.ccode,
          billStyle: saleousing.billStyle
        })
        let money = item.hxIsum
        let salesList: any = []
        for (let j = 0; j < sales.length; j++) {
          let aa = sales[j]
          if (!hasBlank(money) && money != 0) {
            if (money > 0) {
              if (sub(aa.isum, aa.hxIsum) < money) {
                aa.hxIsum = aa.isum
                money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
                aa.hxFlag = '1'
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                money = 0
              }
            } else {
              if (sub(aa.isum, aa.hxIsum) > money) {
                aa.hxIsum = aa.isum
                aa.hxFlag = '1'
                money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                money = 0
              }
            }
            if (sub(aa.isum, aa.hxIsum) == 0) {
              aa.hxFlag = '1'
            } else {
              aa.hxFlag = '0'
            }
            aa.hzhcNum = add(aa.hzhcNum == null ? '0' : aa.hzhcNum, 1)
            salesList.push(aa)
          }
        }
        await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(salesList)
      }
    }
  }
  await balanceTaskDel()
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
  await balanceTaskDel()
  if (status.value == 1) {
    // await contentSwitch('first')
    await contentSwitch('tail')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
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

/*栏目设置end*/
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

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
const wjsIsum:any = ref('0')
const bcjsIsum:any = ref('0')
const ljjsIsum:any = ref('0')
const isum1:any = ref('0')
const wjsIsum1:any = ref('0')
const bcjsIsum1:any = ref('0')
const ljjsIsum1:any = ref('0')
const isum2:any = ref('0')
const hxIsum2:any = ref('0')
const hxMoney2:any = ref('0')
const isum3:any = ref('0')
const hxIsum3:any = ref('0')
const hxMoney3:any = ref('0')
//计算收款明细和结算明细
function countTable(){
  isum.value = 0
  wjsIsum.value = 0
  bcjsIsum.value = 0
  ljjsIsum.value = 0
  getDataSource().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      wjsIsum.value = add(wjsIsum.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      bcjsIsum.value = add(bcjsIsum.value,item.hxMoney)
    }
    if (item.ljhxIsum!=null && item.ljhxIsum!=''){
      ljjsIsum.value = add(ljjsIsum.value,item.ljhxIsum)
    }
  })
  isum1.value = 0
  wjsIsum1.value = 0
  bcjsIsum1.value = 0
  ljjsIsum1.value = 0
  getDataSource1().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum1.value = add(isum1.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      wjsIsum1.value = add(wjsIsum1.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      bcjsIsum1.value = add(bcjsIsum1.value,item.hxMoney)
    }
    if (item.ljhxIsum!=null && item.ljhxIsum!=''){
      ljjsIsum1.value = add(ljjsIsum1.value,item.ljhxIsum)
    }
  })
  isum2.value = 0
  hxIsum2.value = 0
  hxMoney2.value = 0
  getDataSource2().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum2.value = add(isum2.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      hxIsum2.value = add(hxIsum2.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      hxMoney2.value = add(hxMoney2.value,item.hxMoney)
    }
  })
  isum3.value = 0
  hxIsum3.value = 0
  hxMoney3.value = 0
  getDataSource3().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum3.value = add(isum3.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      hxIsum3.value = add(hxIsum3.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      hxMoney3.value = add(hxMoney3.value,item.hxMoney)
    }
  })
}
//分摊核销
function countFentan(){
  if (tableSelectedRowObjs1.value.length>0) {
    tableData1.value = getDataSource1()
    tableData1.value.forEach(item => {
      item.hxMoney = null
      return item
    })
    countTable()
    tableSelectedRowObjs1.value.forEach(item => {
      if (item.ddate != null && item.ddate != '') {
        if (item.whxIsum != null && item.whxIsum != '') {
          item.hxMoney = '0'
          let whxIsum = item.whxIsum
          if (sub(-bcjsIsum.value, bcjsIsum1.value) < whxIsum) {
            item.hxMoney = whxIsum
          } else {
            item.hxMoney = sub(-bcjsIsum.value, bcjsIsum1.value)
          }
          item.tempOne = item.hxMoney
        }
      } else {
        item.hxMoney = ''
      }
      countTable()
      return item
    })
    setTableData1(tableData1.value)
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择需要分摊的数据！'
    })
  }
}

function countFentan1(){
  if (tableSelectedRowObjs3.value.length>0) {
    tableData3.value = getDataSource3()
    tableData3.value.forEach(item => {
      item.hxMoney = null
      return item
    })
    countTable()
    tableSelectedRowObjs3.value.forEach(item => {
      if (item.ddate != null && item.ddate != '') {
        if (item.whxIsum != null && item.whxIsum != '') {
          item.hxMoney = '0'
          let whxIsum = item.whxIsum
          if (sub(-hxMoney2.value, hxMoney3.value) < whxIsum) {
            item.hxMoney = whxIsum
          } else {
            item.hxMoney = sub(-hxMoney2.value, hxMoney3.value)
          }
          item.tempOne = item.hxMoney
        }
      } else {
        item.hxMoney = ''
      }
      countTable()
      return item
    })
    setTableData3(tableData3.value)
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择需要分摊的数据！'
    })
  }
}

const tableDataChange =  (r,c) => {
  countTable()
}

const outBefore = () => {
  balanceTaskDel()
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
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
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
      tableData.value = list
      setTableData(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext1 =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark1(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource1();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns1().filter((it:any)=>it.title!='序号')
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
    let doms:any = nextC == 'hxMoney' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark1 = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext2 =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark2(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource2();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns2().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData2.value = list
    setTableData2(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark3(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark3(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData2.value = list
      setTableData2(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark2 = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext3 =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark3(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource3();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns3().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData3.value = list
    setTableData3(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark3(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark3(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData3.value = list
      setTableData3(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark3 = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

import SelectXhd from './popup/select-xhd.vue'
import {
  findSaleousingByCcode,
  findSaleousingsByCcode,
  saveSaleousingsList
} from "/@/api/record/system/ysd";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {findByStockAccId} from "/@/api/record/system/stock-account";
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

:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

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
        font-size: 13px;
        font-weight: bold;
        margin: 0;
        padding: 5px;
        width: 100%;
        background-color: #cccccc;
        border:none !important;

        > div {
          display: inline-block;
          background-color: #d8d8d8;
          padding: 5px;
        }
        > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5),> div:nth-of-type(6){
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
          text-align: right;
        }
        > div:nth-of-type(3) {
          width: 20%;
          text-align: right;
          margin: 0 1px;
        }
        > div:nth-of-type(4) {
          width: 20%;
          margin: 0 1px;
          text-align: right;
        }
        > div:nth-of-type(5) {
          width: 20%;
          text-align: right;
          margin: 0 1px;
        }
        > div:nth-of-type(6) {
          width: 20%;
          text-align: right;
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
@import './global-menu-index.less';
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
