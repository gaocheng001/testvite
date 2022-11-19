<template>
  <div class="nc-hrb">
<!--    <div class="nc-hrb-top">
      <div>
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t1.png" class="container-head-img">
        </a-popover>
        &lt;!&ndash;        <a-popover title="操作" placement="bottom" trigger="click">
                  <template #content>
                    <p>Content</p>
                    <p>Content</p>
                  </template>
                  <img src="/img/home/t2.png" class="container-head-img">
                </a-popover>&ndash;&gt;
        <a-popover title="" placement="bottom" trigger="click">
          <template #content>
            <p class="special_p">常用外币</p>
            <p class="special_p">外币汇率</p>
            <p class="special_p">编码规则</p>
            <p class="special_p">人员类别</p>
            <p class="special_p">客户分类</p>
            <p class="special_p">供应商分类</p>
            <p class="special_p">项目大类</p>
            <p class="special_p">项目分类</p>
            <p class="special_p">项目样式</p>
          </template>
          <img src="/img/home/t3.png" class="container-head-img">
        </a-popover>
        &lt;!&ndash;        <a-popover title="操作" placement="bottom" trigger="click">
                  <template #content>
                    <p>Content</p>
                    <p>Content</p>
                  </template>
                  <img src="/img/home/t4.png" class="container-head-img">
                </a-popover>
                <a-popover title="操作" placement="bottom" trigger="click">
                  <template #content>
                    <p>Content</p>
                    <p>Content</p>
                  </template>
                  <img src="/img/home/t5.png" class="container-head-img">
                </a-popover>&ndash;&gt;
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t6.png" class="container-head-img">
        </a-popover>
      </div>
    </div>-->
    <div class="nc-hrb-middle">
      <a-row type="flex">
        <a-col :span="3" @click="toPage('/two-depts/dept')">
          <div><img src="/img/nc/leave.png"
                    class="container-head-img"><span>部门</span></div>
          <div><span>50</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/two-users/department')">
          <div><img src="/img/nc/approve.png"
                    class="container-head-img"><span>人员</span></div>
          <div><span>49</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('three-custs/customer_info')">
          <div><img src="/img/nc/attendance.png"
                    class="container-head-img"><span>客户</span></div>
          <div><span>149</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/three-sups/supplier')">
          <div><img src="/img/nc/approve.png"
                    class="container-head-img"><span>供应商</span></div>
          <div><span>149</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/four-archives/project-acc')">
          <div><img src="/img/nc/attendance.png"
                    class="container-head-img"><span>项目</span></div>
          <div><span>75</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/one-archives/defined-record')">
          <div><img src="/img/nc/performance.png"
                    class="container-head-img"> <span>自定义项</span></div>
          <div><span>30</span></div>
        </a-col>

      </a-row>
    </div>
    <div class="nc-hrb-bottom">
      <a-row type="flex">
        <a-col :span="8" v-for="(item,index) in getCurrList()" @click="toPage(item.path)">
          <div>
            <div>
              <!--              <img v-bind:src="imgValue(index)">-->
              <AppstoreOutlined v-if="index == 0"/>
              <AccountBookOutlined v-else-if="index == 1"/>
              <AimOutlined v-else-if="index == 2"/>
              <BlockOutlined v-else-if="index == 3"/>
              <DollarCircleOutlined v-else-if="index == 4"/>
              <EuroOutlined v-else-if="index == 5"/>
              <GroupOutlined v-else-if="index == 6"/>
              <HddOutlined v-else-if="index == 7"/>
              <InsertRowBelowOutlined v-else-if="index == 8"/>
              <GatewayOutlined v-else-if="index == 9"/>
              <OneToOneOutlined v-else-if="index == 10"/>
              <ReconciliationOutlined v-else/>
            </div>
          </div>
          <div>
            <span>{{ item.title }}</span><br/>
            <span :title="item.legend">{{ item.legend }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  HomeFilled,
  AppstoreOutlined,
  AccountBookOutlined,
  AimOutlined,
  BlockOutlined,
  DollarCircleOutlined,
  EuroOutlined,
  GroupOutlined,
  HddOutlined,
  InsertRowBelowOutlined,
  GatewayOutlined,
  OneToOneOutlined,
  ReconciliationOutlined
} from '@ant-design/icons-vue';
import {
  Input as AInput, Select as ASelect, Popover as APopover, Button as AButton,
  Row as ARow, DatePicker as ADatePicker, Avatar, Checkbox as ACheckbox,
  Col as ACol, Steps, Rate
} from "ant-design-vue";
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import router from "/@/router";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const props = defineProps(['modelValue', 'dynamicTenantId', 'type'])
let platforms = ref([
  {
    title: '会计科目',
    legend: '根据会计制度确定对应会计科目及科目类型',
    path: '/five-common/setting-basis-info',
    type: 'ZZ'
  },
  {
    title: '会计期间',
    legend: '通过会计期间确定年度及财务核算的起始日期',
    path: '',
    type: 'ZZ'
  }, {
    title: '现金流量项目',
    legend: '设置现金流量项目和借贷方科目对应关系',
    path: '/five-finance/project-cash',
    type: 'ZZ'
  }, {
    title: '辅助核算定义',
    legend: '设置会计科目的辅助核算范围及内容',
    path: '/five-common/fuzhu-hesuan',
    type: 'ZZ'
  },
  {
    title: '档案编码规则',
    legend: '主数据基础档案如人员客户等的编码规则设置',
    path: '/one-setting/encoding_rules',
    type: 'ZZ'
  }, {
    title: '单据编码规则',
    legend: '进销存业务单据的编码生成规则设置',
    path: '/one-setting/encoding_rulesreport',
    type: 'ZZ'
  },
  {
    title: '计量单位',
    legend: '物料档案中所使用的计量单位管理与设置',
    path: '/seven-materiel/unit-mea',
    type: 'CH'
  },{
    title: '存货档案',
    legend: '进销存业务中物料档案的管理与设置',
    path: '/seven-materiel/stock_info',
    type: 'CH'
  },{
    title: '仓库',
    legend: '进进销存业务存储位置所使用的仓库档案管理与设置',
    path: '/seven-warehousing/stock_cangku',
    type: 'CH'
  },
  {
    title: '账户',
    legend: '销售及采购业务的收付款账户设置',
    path: '/one-archives/bank-account',
    type: 'CH'
  }, {
    title: '外币汇率',
    legend: '根据外汇汇率牌价实时更新汇率，外币核算使用',
    path: '/one-archives/exchange-rate',
    type: 'ZZ'
  },
  {
    title: '收发方式',
    legend: '首发存货所使用的出入库方法管理与设置',
    path: '/seven-current/stock_shou_zhi_type',
    type: 'CH'
  },
])
const toPage = (path) => {
  if (null != path && !hasBlank(props.dynamicTenantId))
    router.push({
      path: path
    });
}

function getCurrList() {
  let list = []
  /*if (hasBlank(props.type) /!*|| props.type.indexOf('ZZ') != -1*!/) {
    list = platforms.value.filter(it => it.type == 'ZZ')
  } else {
    let arr = props.type.split(',')
    list = platforms.value.filter(it => arr.indexOf(it.type) != -1)
  }*/
  list = platforms.value
  return list;
}
</script>
<style lang="less" scoped>
.nc-hrb {
  height: calc(100% - 290px);
  .nc-hrb-top {
    div {
      height: 120px;
      width: 100%;
      margin: .5%;
      padding: 1.2%;
      text-align: center;

      .container-head-img {
        width: 80px;
        height: 80px;
        display: inline-flex;
        margin: 0 1%;
        -webkit-user-drag: none;
      }

      .container-head-img:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 2px #9daad4;
        transform: scale(1.02, 1.02)
      }



    }
  }

  .nc-hrb-middle {
    margin-top: 1.5%;
    :deep(.ant-row) {
      .ant-col {
        text-align: center;
        height: 140px;
        background-color: white;
        margin: 0 1% 1%;
        border-radius: 4px;
        padding: 1.5% 0px;
        border-top: 3px solid slateblue;
        flex: 0 0 14.6%;
        max-width: 14.6%;

        div {
          .container-head-img {
            width: 40px;
            height: 40px;
            display: inline-flex;
            -webkit-user-drag: none;
          }

          font-size: 24px;
          font-weight: bold;
          margin: 5% 0;

          > span {
            margin-left: 1em;
          }
        }

        div:nth-of-type(3) {
          color: blue;
        }
      }

      .ant-col:hover {
        cursor: pointer;
        border: 1px solid #146dc1;
        border-top: 3px solid #146dc1;
      }
    }
  }

  /* .nc-hrb-middle {
     height: 120px;
     width: auto;
     display: flex;
     :deep(.ant-select-selector),:deep(.ant-input){
       border-top: none;
       border-left: none;
       border-right: none;
       border-bottom: 1px solid #262626;
       pointer-events: none;
       text-align: center;
     }
     :deep(.ant-select-arrow){
               display: none;
     }
     .nc-hrbm-left,.nc-hrbm-right{
       width: 48%;
       height: auto;
       margin: 0 1%;
     }
     .nc-hrbm-left{
       .acco-sideline{
         position: relative;
         margin: 10px 1% 20px;
         background-color: white;
         border-radius: 15px;

         > span{
           position: absolute;
           top: -12px;
           left: 50px;
           font-weight: bold;
           color: black;
           background: white;
           padding: 0 5px;
         }
         .acco-sideline-content-one{
           padding: 10px;
           > div{
             width: 48%;
             display: inline-block;
             padding: 10px 15px;
             >span{
               color: #525151;
             }
           }
         }
         .acco-sideline-content-two{
           width: 100%;
           padding: 20px 25px;
           .top-div{
             text-align: center;
             >span{
               color: #525151;
             }
           }
           .ant-row{
             pointer-events: none;
             margin-top: 1%;
             .ant-col{
               margin: 8px 0;
               .ant-checkbox-wrapper-disabled{
                 > span{
                   color: black;
                 }
               }
             }
           }
         }
         .acco-sideline-content-there{
           width: 100%;
           margin: 20px 50px;
           ul{
             li{
               padding: 5px 0;
               .ant-radio-group{
                 width: 80%;
                 .ant-radio-wrapper{
                   margin: 0 8%;
                 }
                 .ant-radio-wrapper-disabled{
                   > span{
                     color: black;
                   }
                 }
               }
             }
           }
         }
       }
     }
     .nc-hrbm-right{
       .acct-up{
         position: relative;
         margin: 10px 1% 20px;
         padding: 10px;
         background-color: white;
         border-radius: 15px;

         > span{
           position: absolute;
           top: -12px;
           left: 50px;
           font-size: 15px;
           color: black;
           font-weight: bold;
           background: white;
           padding: 0 5px;
         }
         > div{
           margin: 15px;
           color: black;
           :deep(.ant-table-tbody),:deep(.ant-table-thead){
             th{
               padding: 4px 8px !important;
             }
             td{
               padding: 0 8px !important;
             }
           }
         }
         .acctd-span{
           margin: 0 10px;
         }
       }
     }
   }*/

  .nc-hrb-bottom {
    height: calc(100% - 35px);
    overflow-y: auto;

    :deep(.ant-row) {
      .ant-col {
        flex: 0 0 32%;
        max-width: 32%;
        height: 80px;
        background-color: #f1f1f1;
        margin: .5%;
        color: #8c8c8c;
        /*     border-radius: 4px;
             border: 1px solid #807f7f;*/

        div {
          height: 100%;
          display: inline-block;
        }

        div:nth-of-type(1) {
          width: 60px;
          padding: 6px;

          > div {
            font-size: 30px;
            width: 65px;
            height: 65px;
            padding: 10px;
            /*  .container-head-img {
                width: 56px;
                height: 52px;
                -webkit-user-drag: none;
              }*/
          }

        }

        div:nth-of-type(2) {
          width: calc(100% - 60px);
          font-weight: bold;
          float: right;
          font-size: 16px;

          span:nth-of-type(1) {
            margin: 1% 2%;
            font-size: 18px;
            padding: 5px;
            display: inline-block;
          }

          span:nth-of-type(2) {
            margin-left: 3%;
            display: block;
            width: calc(100% - 30px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: break-word;
            word-break: break-all;
          }
        }
      }

      .ant-col:hover {
        cursor: pointer;
        border: 2px solid #146dc1;
        color: #146dc1;
      }
    }
  }
}

  .special_p{
    margin-bottom: 0px;
    padding: 4px 5px;
  }
  .special_p:hover{
    background-color: #0096c7;
    color: #f1f1f1;
    font-weight: bold;
  }
</style>
