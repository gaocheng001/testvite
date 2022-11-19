<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
        <div class="acb-head">
          <div class="acbgead-one">
            <div class="acbgead-one-triangle">
              <div></div>
              <div>
                <span style="color: white;font-size: 14px;">{{ isEdit=='0'?'新增':isEdit=='1'?'修改':'查看' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="container-head-title" style="padding-left: 50%;text-align: center;margin-top: -30px" :class="isEdit=='2'?'status-look':''">
          <b class="noneSpan">固定资产卡片</b>
          <div style="font-size: 14px;text-align: center;margin-top: 20px;">
          <span style="font-size: 14px;font-weight: bold;">
            卡片录入日期：<DatePicker v-model:value="formItems.cdate" :disabled="true" :locale="localeCn" placeholder="卡片录入日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
          </span>
          </div>
        </div>

        <div class="ant-btn-group" style="float: right;margin-top: -40px">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openAddSelect()"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            v-if="isEdit!='2'"
            @click="saveData()"
          ><span>保存</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            v-if="isEdit!='2'"
          ><span>放弃</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="isEdit='1'"
            v-if="isEdit=='2'"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>删除</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>复制</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear:both"/>

      <div style="margin-top: -60px;margin-left: 30px;">
        <div>
          <AccountPicker theme="one" readonly @reloadTable="dynamicAdReload"/>
        </div>
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: 10px;font-weight: bold;font-size: 24px;color:#666666;">
          <VerticalRightOutlined/>&nbsp;
          <LeftOutlined/>&nbsp;
          <RightOutlined/>&nbsp;
          <VerticalLeftOutlined/>&nbsp;

<!--          <span style="font-size: 14px;margin-left: 30px;" >管理类型：
            <Select v-model:value="cardMaster.manageCode" :disabled="true" style="width: 200px;">
              <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
            </Select>
          </span>-->
        </div>

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
            </template>
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
          <Popover class="ant-btn-default" placement="bottom">
            <Button>
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <template #content>
            </template>
          </Popover>
          <Button>
            <FilterFilled :style="{ fontSize: '14px' }" />
          </Button>
        </div>
      </div>
      <div style="clear:both"/>

      <div class="open-content-down" :style="{height: (windowHeight+60)+'px',marginTop: '0'}">
        <Tabs v-model:activeKey="activeKey" type="card">
          <TabPane key="1" tab="资产信息">
            <div class="down-tab-content" :style="{height: windowHeight+'px',marginTop: '5px',overflow:'auto'}" :class="isEdit=='2'?'status-look':''">
              <div class="acco-sideline">
                <span>基础信息</span>
                <div class="acco-sideline-content">
<!--                  <label>管理类型：</label>
                  <Select v-model:value="cardMaster.manageCode" :disabled="true" style="width: 15%;">
                    <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>-->
                  <label>系统编号：</label>
                  <Input v-model:value="cardMaster.sysId" :disabled="true" @blur="checkSysId()" placeholder="不允许重复" style="width: 15%;"/>
                  <span class="red_span">*</span>
                  <label>资产编码：</label>
                  <Input v-model:value="cardMaster.cardCode" @blur="checkCode()" placeholder="不允许重复" style="width: 15%;"/>
                  <span class="red_span">*</span>
                  <label>资产类别：</label>
                  <Select v-model:value="change.faClass" :disabled="true" style="width: 15%;">
                    <SelectOption v-for="item in assetTypeList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <label>使用状态：</label>
                  <Select v-model:value="change.useType" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in usageStatusList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <br/>

                  <label>资产名称：</label>
                  <Input v-model:value="cardMaster.faName" style="width: 15%;"/>
                  <span class="red_span">*</span>
                  <label>规格型号：</label>
                  <Input v-model:value="cardMaster.speciType" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>责任人：</label>
                  <Select v-model:value="change.zerenUser" :disabled="isEdit!='0'?true:false" style="width: 15%;"><!--来自于人员档案-->
                    <SelectOption v-for="item in psnList" :value="item.uniqueCode">{{item.psnCode}}-{{item.psnName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <label>增加方式：</label>
                  <Select v-model:value="cardMaster.addType" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in addCutList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>
<!--                  <label>使用状态：</label>
                  <Select v-model:value="change.useType" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in usageStatusList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>-->
                  <br/>

                  <label>购买日期：</label>
                  <DatePicker v-model:value="formItems.buyTime" @change="changeTime()" :disabled="isEdit!='0'?true:false" :disabled-date="disabledBuyDate" :locale="localeCn" placeholder="购买日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
                  <span class="red_span">*</span>
                  <label>入账日期：</label>
                  <DatePicker v-model:value="formItems.creatTime" @change="changeCreatTime()" :disabled="isEdit!='0'?true:false" :disabled-date="disabledDate" :locale="localeCn" placeholder="入账日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
                  <span class="red_span">*</span><!--到期日=入账+使用+计提-->
                  <label style="width: 12%;">使用年限（月数）：</label>
                  <InputNumber v-model:value="change.life" :disabled="isEdit!='0'?true:false" @blur="changeYuanzhi()" class="right" :precision="0" style="width: 11%;" :formatter="value => `${value}月`" :parser="value => value.replace('月', '')"/>
                  <span class="red_span">*</span>
                  <label style="width: 12%;">已计提年限（月数）：</label>
                  <InputNumber v-model:value="formItems.useLife" :readonly="true" class="right" :precision="0" style="width: 11%;" :formatter="value => `${value}月`" :parser="value => value.replace('月', '')"/>
                  <span class="red_span">*</span>
<!--                  <label>增加方式：</label>
                  <Select v-model:value="cardMaster.addType" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in addCutList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>-->
<!--                  <label>资产属性：</label>
                  <Select v-model:value="formItems.faAssets" style="width: 15%">
                    <SelectOption v-for="item in propertyList" :value="item.uniqueCustclass">{{item.peopertyName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>-->
                  <br/>

                  <label>数量：</label>
                  <InputNumber v-model:value="change.shuliang" :disabled="isEdit!='0'?true:false" :precision="0" style="width: 15%;"/>
                  <span class="red_span">*</span>
                  <label>计量单位：</label>
                  <Select v-model:value="cardMaster.unitId" style="width: 15%;">
                    <SelectOption v-for="item in unitList" :value="item.id">{{item.unitName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>
                  <label>存放位置：</label>
                  <Select v-model:value="change.addr" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in locationList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <label>经济用途：</label>
                  <Select v-model:value="cardMaster.jingjiyongtu" :disabled="isEdit!='0'?true:false" style="width: 15%;">
                    <SelectOption v-for="item in economyUseList" :value="item.id">{{item.bsName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <br/>

                  <label>部门：</label>
                  <Input v-model:value="formItems.deptList" :disabled="isEdit!='0'?true:false" @click="openAddDept()" style="width: 15%;"/>
<!--                  <Select v-model:value="formItems.deptUnique" :disabled="isEdit!='0'?true:false" v-if="cardMaster.zhejiuType=='1'" @change="changeDept()" style="width: 15%;">
                    <SelectOption v-for="item in deptList" :value="item.uniqueCode">{{item.deptCode}}-{{item.deptName}}</SelectOption>
                  </Select>-->
                  <span class="red_span"></span>
                  <label>项目：</label>
                  <Input v-model:value="formItems.projectList" :disabled="isEdit!='0'?true:false" @click="openAddProject()" style="width: 15%;"/>
<!--                  <Select v-model:value="formItems.projectUnique" :disabled="isEdit!='0'?true:false" v-if="cardMaster.zhejiuType!='1'" @change="changeProject()" style="width: 15%;">
                    <SelectOption v-for="item in projectList" :value="item.uniqueCode">{{item.projectCode}}-{{item.projectName}}</SelectOption>
                  </Select>-->
                  <span class="red_span"></span>
                  <label>资产组：</label>
                  <Select v-model:value="cardMaster.assetGroup" style="width: 15%;">
                    <SelectOption v-for="item in assetGroupList" :value="item.id">{{item.bsName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>
                  <label>使用人：</label>
                  <Select v-model:value="cardMaster.userId" style="width: 15%;">
                    <SelectOption v-for="item in psnList" :value="item.uniqueCode">{{item.psnCode}}-{{item.psnName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>
                </div>
              </div>

              <div class="acco-sideline">
                <span>价值信息</span>
                <div class="acco-sideline-content">
                  <label>资产原值：</label>
                  <InputNumber v-model:value="change.yuanzhi" :disabled="isEdit!='0'?true:false" @blur="changeYuanzhi()" class="right" :precision="5" style="width: 15%;"/><!--必须大于0-->
                  <span class="red_span">*</span>
                  <!-- 保存5位小数，显示2位小数 -->
                  <label>累计折旧：</label>
                  <InputNumber v-model:value="change.ljzhejiu" :disabled="isEdit!='0'?true:false" @blur="changeYuanzhi()" class="right" :precision="5" style="width: 15%;"/><!--必须大于等于0--><!--0.00-->
                  <span class="red_span">*</span>
                  <!-- 保存2位小数，显示2位 -->
                  <label>净残值率：</label>
                  <InputNumber v-model:value="change.jingcanzhilv" :disabled="isEdit!='0'?true:false" @blur="changeYuanzhi()" class="right" :precision="5" style="width: 15%;" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"/><!--必须大于等于0--><!--0.00-->
                  <span class="red_span">*</span>
                  <label>净残值：</label><!-- 不需要保存 -->
                  <InputNumber v-model:value="jingcanzhi" :disabled="isEdit!='0'?true:false" :readonly="true" :precision="5" class="right" style="width: 15%;"/><!--必须大于等于0--><!--0.00-->
                  <span class="red_span">*</span>
                  <br/>

                  <label>资产净值：</label><!-- 不需要保存 -->
                  <InputNumber v-model:value="zichanjingzhi" :disabled="isEdit!='0'?true:false" :readonly="true" :precision="5" class="right" style="width: 15%;"/><!--原值-累计折旧-->
                  <span class="red_span"></span>
                  <!-- 保存5位小数，显示5位小数 -->
                  <label>进项税率：</label>
                  <InputNumber v-model:value="change.jinxiangshuilv" :disabled="isEdit!='0'?true:false" class="right" :precision="5" @blur="changeYuanzhi()" style="width: 15%;" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"/><!--0.00--><!--0~90-->
                  <span class="red_span"></span>
                  <!-- 保存5位小数，显示2位小数 -->
                  <label>进项税额：</label>
                  <InputNumber v-model:value="change.jingxiangshui" :disabled="isEdit!='0'?true:false" class="right" :precision="5" :readonly="true" style="width: 15%;"/><!--(原值/(1+进项税率))*进项税率-->
                  <span class="red_span"></span>
                  <!-- 保存5位小数，显示2位小数 -->
                  <label>价税合计：</label>
                  <InputNumber v-model:value="formItems.jiashuiheji" :disabled="isEdit!='0'?true:false" class="right" :precision="5" @blur="changeJiashuiheji()" style="width: 15%;"/><!--原值-->
                  <span class="red_span"></span>
                  <br/>

                  <label>外币币种：</label>
                  <Input v-model:value="cardMaster.wbCurrency" :disabled="isEdit!='0'?true:false" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <!-- 保存5位小数，显示2位小数 -->
                  <label>外币原值：</label>
                  <InputNumber v-model:value="cardMaster.wbYuanzhi" :disabled="isEdit!='0'?true:false" class="right" :precision="5" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>币种单位：</label>
                  <Input v-model:value="cardMaster.wbUnit" :disabled="isEdit!='0'?true:false" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <!-- 保存5位小数，显示5位小数 -->
                  <label>外币汇率：</label>
                  <InputNumber v-model:value="cardMaster.wbHuilv" :disabled="isEdit!='0'?true:false" :precision="5" style="width: 15%;"/>
                  <span class="red_span"></span>
                </div>
              </div>

              <div class="acco-sideline">
                <span>折旧信息</span>
                <div class="acco-sideline-content">
                  <label>折旧方式：</label>
                  <Select v-model:value="change.zhejiuMethod" :disabled="isEdit!='0'?true:false" @change="changZhejiuMethod()" style="width: 15%;">
                    <SelectOption v-for="item in zhejiuMethodList" :value="item.id">{{item.zjName}}</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <label>计提方式：</label>
                  <Select v-model:value="change.jitiType" :disabled="isEdit!='0'?true:false" @change="changeTime()" style="width: 15%;">
                    <SelectOption value="1">增加次月开始计提</SelectOption>
                    <SelectOption value="0">增加当月开始计提</SelectOption>
                  </Select>
                  <span class="red_span">*</span>
                  <!-- 保存5位小数，显示2位小数 -->
                  <label>月折旧额：</label>
                  <InputNumber v-model:value="change.yuezhejiue" :disabled="isEdit!='0'?true:false" :readonly="true" class="right" :precision="5" style="width: 15%;"/><!--原值*月折旧率-->
                  <span class="red_span"></span>
                  <label>月折旧率：</label>
                  <InputNumber v-model:value="change.yuezhejiulv" :disabled="isEdit!='0'?true:false" :readonly="true" class="right" :precision="5" style="width: 15%;" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"/><!--(原值-累计折旧-净残值)/使用年限-->
                  <span class="red_span"></span>
                  <br/>

                  <!-- 保存5位小数，显示2位小数 -->
                  <label>本月计提折旧：</label><!-- 不需要保存 -->
                  <Input style="width: 15%" :disabled="isEdit!='0'?true:false" />
                  <span class="red_span"></span>
                  <label>对应计提科目：</label>
                  <Select v-model:value="cardMaster.jitikemu" @change="handleChange" show-search :filter-option="false" @search="handleSearch" style="width: 15%;"><!--所有末级科目-->
                    <SelectOption v-for="item in kemuCodeList" :value="item.ccode">{{item.ccode}}-{{item.ccodeName}}</SelectOption>
                  </Select>
                  <span class="red_span"></span>
                </div>
              </div>

              <div class="acco-sideline">
                <span>辅助信息</span>
                <div class="acco-sideline-content">
                  <label>自定义项1：</label>
                  <Input v-model:value="cardMaster.define1" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项2：</label>
                  <Input v-model:value="cardMaster.define2" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项3：</label>
                  <Input v-model:value="cardMaster.define3" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项4：</label>
                  <Input v-model:value="cardMaster.define4" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <br/>

                  <label>自定义项5：</label>
                  <Input v-model:value="cardMaster.define5" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项6：</label>
                  <Input v-model:value="cardMaster.define6" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项7：</label>
                  <Input v-model:value="cardMaster.define7" style="width: 15%;"/>
                  <span class="red_span"></span>
                  <label>自定义项8：</label>
                  <Input v-model:value="cardMaster.define8" style="width: 15%;"/>
                  <span class="red_span"></span>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane key="2" tab="机器设备">
            <div class="down-tab-content">
              机器设备
            </div>
          </TabPane>
          <TabPane key="3" tab="房屋及建筑">
            <div class="down-tab-content">
              房屋及建筑
            </div>
          </TabPane>
          <TabPane key="4" tab="附属设备">
            <div class="down-tab-content">
              附属设备
            </div>
          </TabPane>
          <TabPane key="5" tab="图片">
            <div class="down-tab-content">
              图片
            </div>
          </TabPane>
          <TabPane key="6" tab="附件">
            <div class="down-tab-content">
              附件
            </div>
          </TabPane>
          <TabPane key="7" tab="变动记录">
            <div class="down-tab-content">
              变动记录
            </div>
          </TabPane>
          <TabPane key="8" tab="维保记录">
            <div class="down-tab-content">
              维保记录
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <AddSelect
      @save="saveAddSelect"
      @register="registerAddSelectPage"
    />
    <AddDept
      @save="saveAddDept"
      @register="registerAddDeptPage"
    />
    <AddProject
      @save="saveAddProject"
      @register="registerAddProjectPage"
    />
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Popover,
  Tabs,
  DatePicker,
  Button,
  Popconfirm,
  Checkbox,
  Radio,
  Table,
  Drawer,
  message
} from "ant-design-vue";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
import {useModal} from '/@/components/Modal'
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled,
  CheckOutlined,
  EditOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import {onMounted, reactive, ref,provide} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
// import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import AddSelect from './popup/add-select.vue'
import AddDept from './popup/add-dept.vue'
import AddProject from './popup/add-project.vue'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStore} from "/@/store/modules/user";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findAllMJList,
  findByCardCode,
  findBySysId, findCardMasterByCardUnique, findChangeByCardUnique,
  findChangeDeptByCardUnique,
  findChangeProjectByCardUnique,
  findFaAddCutModeByFlagAndBend,
  findFaAssetTypeByFlagAndBend,
  findFaPropertyByFlag,
  findFaUsageStatusByFlagAndBend, findLocationByFlagAndBend, findMaxSysId,
  findUnitOfMeaByFlag, findZhejiuMethodByFlag,
  saveFaCardMaster,
  saveFaChange,
  saveFaChangeDeptList,
  saveFaChangeProjectList
} from "/@/api/fa/fa-card";
import { buildUUID } from '/@/utils/uuid';
import {findSettModesByFlag as findEconomyUseByFlag} from "/@/api/record/system/fa-economy-use";
import {findSettModesByFlag as findAssetGroupByFlag} from "/@/api/record/system/fa-asset-group";
import {psnFindByFlag} from "/@/api/psn/psn";
import {add, div, mul, pad, sub} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findAllProject} from "/@/api/record/system/project";
import {getDeptList} from "/@/api/record/system/dept";
import {useRoute} from "vue-router";
import moment from "moment";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";

const {
  createErrorModal
} = useMessage()

const {closeCurrent} = useTabs(router);

const windowHeight = (window.innerHeight - 300)

const activeKey: any = ref('1')
const year: any = ref('')
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const formItems: any = ref({})

const accountList:any = ref([])
const assetTypeList:any = ref([])
const addCutList:any = ref([])
const propertyList:any = ref([])
const unitList:any = ref([])
const economyUseList:any = ref([])
const assetGroupList:any = ref([])
const usageStatusList:any = ref([])
const psnList:any = ref([])
const zhejiuMethodList:any = ref([])
const locationList:any = ref([])
const deptList:any = ref([])
const projectList:any = ref([])
const kemuList:any = ref([])
const kemuCodeList:any = ref([])

const route = useRoute();
const routemsg = ref(route.query);
//0添加、1修改，2查看
const isEdit:any = ref("0")

onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.cardUnique)
  console.log(JSON.stringify(routemsg.value).length)*/
  if (JSON.stringify(routemsg.value).length === 2) {
    openAddSelectPage(true, {
      data: {
        openOne: '1'
      }
    })
  } else {
    dynamicTenantId.value = routemsg.value.dynamicTenantId
    defaultAdName.value = routemsg.value.defaultAdName
    year.value = routemsg.value.year
    isEdit.value = routemsg.value.isEdit
    await reloadList()
    cardMaster.value = await useRouteApi(findCardMasterByCardUnique, {schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    formItems.value.cdate = cardMaster.value.cdate
    formItems.value.buyTime = cardMaster.value.buyTime
    formItems.value.creatTime = cardMaster.value.creatTime
    formItems.value.sysId = cardMaster.value.sysId
    formItems.value.cardCode = cardMaster.value.cardCode
    change.value = await useRouteApi(findChangeByCardUnique, {schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    changeDeptList.value = await useRouteApi(findChangeDeptByCardUnique, {schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    changeProjectList.value = await useRouteApi(findChangeProjectByCardUnique, {schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    formItems.value.deptList=''
    formItems.value.projectList=''
    changeDeptList.value.forEach((item,index)=>{
      deptList.value.forEach(res=>{
        if (res.uniqueCode==item.deptUnique){
          if (index+1<changeDeptList.value.length) {
            formItems.value.deptList = formItems.value.deptList + res.deptName + ','
          } else {
            formItems.value.deptList = formItems.value.deptList + res.deptName
          }
        }
      })
    })
    changeProjectList.value.forEach((item,index)=>{
      projectList.value.forEach(res=>{
        if (res.uniqueCode==item.projectUnique){
          if (index+1<changeProjectList.value.length) {
            formItems.value.projectList = formItems.value.projectList + res.projectName + ','
          } else {
            formItems.value.projectList = formItems.value.projectList + res.projectName
          }
        }
      })
    })
    /*//单部门,多项目
    if (cardMaster.value.zhejiuType=='1'){
      if (changeDeptList.value.length>0) {
        formItems.value.deptUnique = changeDeptList.value[0].deptUnique
      }
      if (changeProjectList.value.length>0) {
        formItems.value.projectList = ''
        changeProjectList.value.forEach((item,index)=>{
          projectList.value.forEach(res=>{
            if (res.uniqueCode==item.projectUnique){
              if (index+1<changeProjectList.value.length) {
                formItems.value.projectList = formItems.value.projectList + res.projectName + ','
              } else {
                formItems.value.projectList = formItems.value.projectList + res.projectName
              }
            }
          })
        })
      }
    } else {//多部门,单项目
      if (changeDeptList.value.length>0) {
        formItems.value.deptList = ''
        changeDeptList.value.forEach((item,index)=>{
          deptList.value.forEach(res=>{
            if (res.uniqueCode==item.deptUnique){
              if (index+1<changeProjectList.value.length) {
                formItems.value.deptList = formItems.value.deptList + res.deptName + ','
              } else {
                formItems.value.deptList = formItems.value.deptList + res.deptName
              }
            }
          })
        })
      }
      if (changeProjectList.value.length>0) {
        formItems.value.projectUnique = changeProjectList.value[0].projectUnique
      }
    }*/
    changeYuanzhi()
    changeTime()
  }
})

//新增资产卡片弹框
const [registerAddSelectPage, {openModal: openAddSelectPage}] = useModal()
const openAddSelect = () => {
  openAddSelectPage(true, {
    data: {
      openOne: '0'
    }
  })
}
//新增资产卡片赋值
async function saveAddSelect(data){
  isEdit.value= '0'
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName
  year.value = data.year
  formItems.value = {}
  cardMaster.value = {}
  change.value = {}
  changeDeptList.value = {}
  changeProjectList.value = {}
  await reloadList()
  await fuzhi()
  cardMaster.value.manageCode = data.manageCode
  formItems.value.cdate = data.cdate
  formItems.value.buyTime = data.cdate
  formItems.value.creatTime = data.cdate
  change.value.faClass = data.faClass
  cardMaster.value.zhejiuType = data.zhejiuType
  assetTypeList.value.forEach(item=> {
    if (data.faClass==item.uniqueCode) {
      cardMaster.value.faAssets = item.assetAttId
      change.value.zhejiuMethod = item.depMethodId
      cardMaster.value.unitId = item.unitId
      if (item.netSalvage != null && item.netSalvage != '') {
        change.value.jingcanzhilv = item.netSalvage
      }
      if (item.inputTax != null && item.inputTax != '') {
        cardMaster.value.jinxiangshuilv = item.inputTax
      }
      if (item.serviceLife != null && item.serviceLife != '') {
        change.value.life = mul(item.serviceLife,12)
      }
    }
  })
  changeTime()
}

//加载下拉数据
async function reloadList(){
  accountList.value = await findFaAccountByAccId(defaultAdName.value)
  assetTypeList.value = await useRouteApi(findFaAssetTypeByFlagAndBend,{schemaName:dynamicTenantId})({})
  addCutList.value = await useRouteApi(findFaAddCutModeByFlagAndBend,{schemaName:dynamicTenantId})({})
  propertyList.value = await useRouteApi(findFaPropertyByFlag,{schemaName:dynamicTenantId})({})
  unitList.value = await useRouteApi(findUnitOfMeaByFlag,{schemaName:dynamicTenantId})({})
  const economyUses = await useRouteApi(findEconomyUseByFlag,{schemaName:dynamicTenantId})({})
  economyUseList.value = economyUses.items
  const assetGroups = await useRouteApi(findAssetGroupByFlag,{schemaName:dynamicTenantId})({})
  assetGroupList.value = assetGroups.items
  usageStatusList.value = await useRouteApi(findFaUsageStatusByFlagAndBend,{schemaName:dynamicTenantId})({})
  psnList.value = await useRouteApi(psnFindByFlag,{schemaName: dynamicTenantId})({})
  zhejiuMethodList.value = await useRouteApi(findZhejiuMethodByFlag,{schemaName: dynamicTenantId})({})
  locationList.value = await useRouteApi(findLocationByFlagAndBend,{schemaName: dynamicTenantId})({})
  const depts = await useRouteApi(getDeptList, {schemaName: dynamicTenantId})({})
  deptList.value = depts.items
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
  kemuList.value = await useRouteApi(findAllMJList,{schemaName: dynamicTenantId})({})
  kemuCodeList.value = kemuList.value
}

//搜索科目
function handleSearch(value) {
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value || item.ccodeName.indexOf(value) != -1
  })
  // debugger
  // console.log(sourceList.value)
}

function handleChange(value) {
  // console.log(value);
  cardMaster.value.jitikemu = value;
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value
  })
}

//给默认字段赋值
async function fuzhi(){
  //卡片唯一码
  cardMaster.value.cardUnique = buildUUID()
  cardMaster.value.cuserId = useUserStore().getUserInfo['realName']
  change.value.jinxiangshuilv = '0.00'
  change.value.shuliang = '1'
  change.value.ljzhejiu = '0.00'
  change.value.jingcanzhilv = '0.00'
  change.value.jitiType = '1'
  cardMaster.value.isYuanshi = '0'
  change.value.chaifen = '0'
  change.value.jiechu = '0'
  change.value.jianshao = '0'
  jingcanzhi.value='0.00'
  zichanjingzhi.value='0.00'
  const res:any = await getThisAdInfoData({'accId': defaultAdName.value})
  if (null != res) {
    cardMaster.value.uniqueCode = res.accId
    cardMaster.value.currencyCode = res.currency
  }

  const faCard = await useRouteApi(findMaxSysId,{schemaName:dynamicTenantId})({})
  // console.log(faCard.sysId)
  if (faCard!=null && faCard.sysId!=null && faCard.sysId!=''){
    cardMaster.value.sysId = pad(add(faCard.sysId,1),5)
  } else {
    cardMaster.value.sysId = '00001'
  }
  if (psnList.value.length>0){
    change.value.zerenUser = psnList.value[0].uniqueCode
  }
  if (assetTypeList.value.length>0){
    change.value.faClass = assetTypeList.value[0].uniqueCode
  }
  if (usageStatusList.value.length>0){
    change.value.useType = usageStatusList.value[0].uniqueCode
  }
  if (addCutList.value.length>0){
    cardMaster.value.addType = addCutList.value[0].uniqueCode
  }
  if (locationList.value.length>0){
    change.value.addr = locationList.value[0].uniqueCode
  }
  if (economyUseList.value.length>0){
    cardMaster.value.jingjiyongtu = economyUseList.value[0].id
  }
  if (zhejiuMethodList.value.length>0){
    change.value.zhejiuMethod = zhejiuMethodList.value[0].id
  }
}

//改变价税合计
const jingcanzhi:any = ref("")
const zichanjingzhi:any = ref("")
function changeJiashuiheji() {
  if (formItems.value.jiashuiheji!=null && formItems.value.jiashuiheji!='' && formItems.value.jiashuiheji!=0) {
    change.value.jinxiangshuilv = change.value.jinxiangshuilv==''?'0.00':change.value.jinxiangshuilv
    //进项税额 = (价税合计/(1+进项税率))*进项税率
    change.value.jingxiangshui = mul(div(formItems.value.jiashuiheji, add(1, div(change.value.jinxiangshuilv, 100))), div(change.value.jinxiangshuilv, 100)).toFixed(5)
    //原值=价税合计-进项税额
    change.value.yuanzhi = sub(formItems.value.jiashuiheji, change.value.jingxiangshui).toFixed(5)
  }
  changeYuanzhi()
}
//改变原值
function changeYuanzhi(){
  if (change.value.yuanzhi!=null && change.value.yuanzhi!='' && change.value.yuanzhi!=0){
    change.value.jinxiangshuilv = change.value.jinxiangshuilv==''?'0.00':change.value.jinxiangshuilv
    //进项税额 = 原值*进项税率
    change.value.jingxiangshui = mul(change.value.yuanzhi,div(change.value.jinxiangshuilv, 100)).toFixed(5)
    //价税合计=原值+进项税额
    formItems.value.jiashuiheji = add(change.value.yuanzhi,change.value.jingxiangshui).toFixed(5)
  }
  if (change.value.yuanzhi!=null && change.value.yuanzhi!='' && change.value.yuanzhi!=0){
    //净残值 = （原值-累计折旧）*净残值率
    jingcanzhi.value = mul(sub(change.value.yuanzhi,change.value.ljzhejiu), div(change.value.jingcanzhilv, 100)).toFixed(5)
    //资产净值 = 原值-累计折旧
    zichanjingzhi.value = sub(change.value.yuanzhi,change.value.ljzhejiu).toFixed(5)
    changZhejiuMethod()
  }
}
//改变折旧方法事件
function changZhejiuMethod(){
  if (change.value.yuanzhi!=null && change.value.yuanzhi!='' && change.value.yuanzhi!=0){
    if (change.value.life!=null && change.value.life!='' && change.value.life!=0) {
      zhejiuMethodList.value.forEach(item=> {
        //平均年限法
        if (item.id == change.value.zhejiuMethod) {
          if (item.zjName == '平均年限法') {
            //月折旧率 = （1-净残值率）/使用年限*100
            change.value.yuezhejiulv = mul(div(sub(1, div(change.value.jingcanzhilv, 100)), change.value.life), 100).toFixed(5)
            formItems.value.yuezhejiulv = mul(div(sub(1, div(change.value.jingcanzhilv, 100)), sub(change.value.life,formItems.value.useLife)), 100).toFixed(5)
            //月折旧额 = （原值-累计折旧）*月折旧率
            change.value.yuezhejiue = mul(sub(change.value.yuanzhi,change.value.ljzhejiu), div(formItems.value.yuezhejiulv, 100)).toFixed(5)
          }
          //不计提
          if (item.zjName == '不计提') {
            change.value.yuezhejiulv = ''
            change.value.yuezhejiue = ''
          }
        }
      })
    }
  }
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.cdate)) {
    let variable = formItems.value.cdate.substring(0, 7)
    let min = moment(variable.substring(0,7) + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};

const disabledBuyDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.creatTime)) {
    let max = moment(formItems.value.creatTime, 'YYYY-MM-DD')
    return current > max
  }
};
function changeCreatTime(){
  if (formItems.value.creatTime!=null && formItems.value.creatTime!=''){
    if (formItems.value.buyTime>formItems.value.creatTime){
      formItems.value.buyTime = formItems.value.creatTime
    }
  }
}
//计算已计提年限
function changeTime(){
  let useLife = 0
  if (formItems.value.buyTime!=null && formItems.value.buyTime!='' && formItems.value.creatTime!=null && formItems.value.creatTime!=''){
    if (change.value.jitiType=='1') {
      useLife = add(mul(sub(formItems.value.creatTime.substring(0, 4), formItems.value.buyTime.substring(0, 4)), 12), sub(formItems.value.creatTime.substring(5, 7), formItems.value.buyTime.substring(5, 7)))
    } else {
      useLife = add(add(mul(sub(formItems.value.creatTime.substring(0, 4), formItems.value.buyTime.substring(0, 4)), 12), sub(formItems.value.creatTime.substring(5, 7), formItems.value.buyTime.substring(5, 7))),1)
    }
    if (sub(change.value.life,useLife)>=0){
      formItems.value.useLife = useLife
    } else {
      formItems.value.useLife = change.value.life
    }
  }
  changZhejiuMethod()
}

//保存验证
function saveCheck(){
  if (formItems.value.cdate==null || formItems.value.cdate==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '卡片录入日期不能为空！'
    })
    return false
  }
  if (formItems.value.buyTime==null || formItems.value.buyTime==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '购买日期不能为空！'
    })
    return false
  }
  if (cardMaster.value.manageCode==null || cardMaster.manageCode==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '管理类型不能为空！'
    })
    return false
  }
  if (cardMaster.value.sysId==null || cardMaster.value.sysId==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '系统编号不能为空！'
    })
    return false
  }
  if (cardMaster.value.cardCode==null || cardMaster.value.cardCode==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产编码不能为空！'
    })
    return false
  }
  if (change.value.faClass==null || change.value.faClass==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产类别不能为空！'
    })
    return false
  }
  if (cardMaster.value.faName==null || cardMaster.value.faName==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产名称不能为空！'
    })
    return false
  }
  if (change.value.zerenUser==null || change.value.zerenUser==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '责任人不能为空！'
    })
    return false
  }
  if (change.value.useType==null || change.value.useType==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '使用状态不能为空！'
    })
    return false
  }
  if (formItems.value.creatTime==null || formItems.value.creatTime==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '入账日期不能为空！'
    })
    return false
  }
  if (change.value.life==null || change.value.life==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '使用年限（月份）不能为空！'
    })
    return false
  }
  if (change.value.shuliang==null || change.value.shuliang==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '数量不能为空！'
    })
    return false
  }
  if (change.value.addr==null || change.value.addr==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '存放位置不能为空！'
    })
    return false
  }
  if (cardMaster.value.jingjiyongtu==null || cardMaster.value.jingjiyongtu==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '经济用途不能为空！'
    })
    return false
  }
  if (change.value.yuanzhi==null || change.value.yuanzhi==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产原值不能为空！'
    })
    return false
  }
  if (change.value.ljzhejiu==null || change.value.ljzhejiu==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '累计折旧不能为空！'
    })
    return false
  }
  if (change.value.jingcanzhilv==null || change.value.jingcanzhilv==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '净残值率不能为空！'
    })
    return false
  }
  if (change.value.zhejiuMethod==null || change.value.zhejiuMethod==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '折旧方式不能为空！'
    })
    return false
  }
  if (change.value.jitiType==null || change.value.jitiType==""){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '计提方式不能为空！'
    })
    return false
  }
  return true
}

//保存主表
const cardMaster: any = ref({})
async function saveCardMaster() {
  cardMaster.value.cdate = formItems.value.cdate
  cardMaster.value.creatTime = formItems.value.creatTime
  cardMaster.value.buyTime = formItems.value.buyTime
  cardMaster.value.life = change.value.life
  cardMaster.value.jitiType = change.value.jitiType
  cardMaster.value = await useRouteApi(saveFaCardMaster, {schemaName: dynamicTenantId})(cardMaster.value)
  formItems.value.sysId = cardMaster.value.sysId
  formItems.value.cardCode = cardMaster.value.cardCode
}

//保存变动表
const change: any = ref({})
async function saveChange() {
  change.value.uniqueCode = cardMaster.value.uniqueCode
  change.value.manageCode = cardMaster.value.manageCode
  change.value.cardUnique = cardMaster.value.cardUnique
  change.value.cdate = formItems.value.creatTime
  change.value.cuserId = cardMaster.value.cuserId
  change.value.iyear = formItems.value.creatTime.substring(0,4)
  change.value.imonth = formItems.value.creatTime.substring(5,7)
  change.value.buyTime = formItems.value.buyTime
  change.value = await useRouteApi(saveFaChange, {schemaName: dynamicTenantId})(change.value)
}

//选择单部门
const changeDeptList:any = ref([])
function changeDept(){
  changeDeptList.value = []
  const changeDept:any = {}
  if (formItems.value.deptUnique!=null && formItems.value.deptUnique!='') {
    changeDept.uniqueCode = cardMaster.value.uniqueCode
    changeDept.manageCode = cardMaster.value.manageCode
    changeDept.cardUnique = cardMaster.value.cardUnique
    changeDept.deptUnique = formItems.value.deptUnique
    changeDept.proportion = '100'
    changeDept.cdate = formItems.value.creatTime
    changeDept.cuserId = cardMaster.value.cuserId
    changeDept.iyear = formItems.value.creatTime
    changeDept.imonth = formItems.value.creatTime
    changeDeptList.value.push(changeDept)
  }
}
//新增资产卡片部门弹框
const [registerAddDeptPage, {openModal: openAddDeptPage}] = useModal()
const openAddDept = () => {
  openAddDeptPage(true, {
    data: {
      deptList:deptList.value,
      changeDeptList: changeDeptList.value
    }
  })
}
//部门列表
async function saveAddDept(data){
  changeDeptList.value = []
  formItems.value.deptList = ''
  data.forEach((item,index)=>{
    const changeDept:any = {}
    changeDept.uniqueCode = cardMaster.value.uniqueCode
    changeDept.manageCode = cardMaster.value.manageCode
    changeDept.cardUnique = cardMaster.value.cardUnique
    changeDept.deptUnique = item.deptUnique
    changeDept.proportion = item.proportion
    changeDept.cdate = formItems.value.creatTime
    changeDept.cuserId = cardMaster.value.cuserId
    changeDept.iyear = formItems.value.creatTime.substring(0,4)
    changeDept.imonth = formItems.value.creatTime.substring(5,7)
    changeDeptList.value.push(changeDept)
    deptList.value.forEach(res=>{
      if (res.uniqueCode==item.deptUnique){
        if (index+1<data.length) {
          formItems.value.deptList = formItems.value.deptList + res.deptName + ','
        } else {
          formItems.value.deptList = formItems.value.deptList + res.deptName
        }
      }
    })
  })
}
//保存部门
async function saveDept(){
  if (changeDeptList.value.length>0) {
    changeDeptList.value = await useRouteApi(saveFaChangeDeptList, {schemaName: dynamicTenantId})(changeDeptList.value)
  }
}

//选择单项目
const changeProjectList:any = ref([])
function changeProject(){
  changeProjectList.value = []
  const changeProject:any = {}
  if (formItems.value.projectUnique!=null && formItems.value.projectUnique!='') {
    changeProject.uniqueCode = cardMaster.value.uniqueCode
    changeProject.manageCode = cardMaster.value.manageCode
    changeProject.cardUnique = cardMaster.value.cardUnique
    changeProject.projectUnique = formItems.value.projectUnique
    changeProject.proportion = '100'
    changeProject.cdate = formItems.value.creatTime
    changeProject.cuserId = cardMaster.value.cuserId
    changeProject.iyear = formItems.value.creatTime.substring(0,4)
    changeProject.imonth = formItems.value.creatTime.substring(5,7)
    changeProjectList.value.push(changeProject)
  }
}
//新增资产卡片项目弹框
const [registerAddProjectPage, {openModal: openAddProjectPage}] = useModal()
const openAddProject = () => {
  openAddProjectPage(true, {
    data: {
      projectList:projectList.value,
      changeProjectList: changeProjectList.value
    }
  })
}
//项目列表
async function saveAddProject(data){
  changeProjectList.value = []
  formItems.value.projectList = ''
  data.forEach((item,index)=>{
    const changeProject:any = {}
    changeProject.uniqueCode = cardMaster.value.uniqueCode
    changeProject.manageCode = cardMaster.value.manageCode
    changeProject.cardUnique = cardMaster.value.cardUnique
    changeProject.projectUnique = item.projectUnique
    changeProject.proportion = item.proportion
    changeProject.cdate = formItems.value.creatTime
    changeProject.cuserId = cardMaster.value.cuserId
    changeProject.iyear = formItems.value.creatTime.substring(0,4)
    changeProject.imonth = formItems.value.creatTime.substring(5,7)
    changeProjectList.value.push(changeProject)
    projectList.value.forEach(res=>{
      if (res.uniqueCode==item.projectUnique){
        if (index+1<data.length) {
          formItems.value.projectList = formItems.value.projectList + res.projectName + ','
        } else {
          formItems.value.projectList = formItems.value.projectList + res.projectName
        }
      }
    })
  })
}
//保存项目
async function saveProject(){
  if (changeProjectList.value.length>0) {
    changeProjectList.value = await useRouteApi(saveFaChangeProjectList, {schemaName: dynamicTenantId})(changeProjectList.value)
  }
}

//数据保存
async function saveData(){
  if (!saveCheck()){
    return false
  }
  if(isEdit.value=='0') {
    //保存主表
    await saveCardMaster();
    //保存变动表
    await saveChange();
    //保存部门
    await saveDept()
    //保存项目
    await saveProject()
    isEdit.value = '2'
    message.success('保存成功！')
  } else {
    //保存主表
    await saveCardMaster();
    //保存变动表
    await saveChange();
  }
  // formItems.value= {}
  // formItems.value.sysId=''
  // formItems.value.cardCode=''
  await fuzhi()
}

//验证系统编号是否重复
async function checkSysId(){
  if (cardMaster.value.sysId==null || cardMaster.value.sysId== '' || cardMaster.value.sysId==formItems.value.sysId) {
    return true
  }
  const res = await useRouteApi(findBySysId,{schemaName:dynamicTenantId})(cardMaster.value.sysId)
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '系统编号已存在，请重新输入！'
    })
    cardMaster.value.sysId = ''
    return false
  }
}

//验证资产编码是否重复
async function checkCode(){
  if (cardMaster.value.cardCode==null || cardMaster.value.cardCode== '' || cardMaster.value.cardCode==formItems.value.cardCode) {
    return true
  }
  const res = await useRouteApi(findByCardCode,{schemaName:dynamicTenantId})(cardMaster.value.cardCode)
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产编码已存在，请重新输入！'
    })
    cardMaster.value.cardCode = ''
    return false
  }
}

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  year.value = obj.year
  cardMaster.value.manageCode = obj.managementCode
  // await reloadList()
}

</script>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style lang='less' scoped></style>
<style scoped lang="less">
.app-container {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
  .acb-head {
    .acbgead-one {
      text-align: center;
      height: 60px;
      line-height: 60px;
      margin-top: -10px;
      margin-left: -5px;

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

:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input) {
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

:deep(.ant-input-affix-wrapper){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  .ant-input {
    border: none !important;
  }
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

:deep(.open-content-down) {
  margin-top: 5%;
  background-color: #ffffff;

  .ant-tabs-tab {
    font-weight: bold !important;
    font-size: 13px !important;
  }

  .ant-tabs-tab-active::before {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    border-top: 2px solid transparent;
    border-radius: 2px 2px 0 0;
    transition: all 0.3s;
    content: '';
    pointer-events: none;
    background-color: rgb(1, 143, 251);
    font-weight: bold;
    font-size: 13px;
  }

  .acco-sideline{
    position: relative;
    border: 1px #acabab solid;
    width: 95%;
    margin: 10px 2% 20px;

    > span{
      position: absolute;
      top: -12px;
      left: 50px;
      background: white;
      padding: 0 15px;
      font-size: 14px;
      font-weight: bold;
    }
    .ant-checkbox-inner,.ant-radio-inner{
      border-color: #4c4c4c !important;
    }
    .acco-sideline-content{
      margin: 20px;
      label {
        text-align: left;
        width: 8%;
        display: inline-block;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 2em;
        color: #535353;
        font-size: 13px;
        font-weight: bold;
      }
      > div{
        width: 45%;
        display: inline-block;
        .ant-select-selector{
          border:none;
          border-bottom: 1px rgb(191, 191, 191) solid;
          font-size: 14px;
          font-weight: bold;
        }
        .ant-select-disabled  .ant-select-selector{
          background: white;
          color: black;
          font-size: 14px;
          font-weight: bold;
        }
        .against-input-mark{
          border:none;
          border-bottom: 1px slategrey solid;
          background-color: white;
          color: black;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}

</style>
