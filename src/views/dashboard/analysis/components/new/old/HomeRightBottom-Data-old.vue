<template>
  <div class="nc-hrb">
    <div class="nc-hrb-top">
      <div>
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t1.png" class="container-head-img">
        </a-popover>
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t2.png" class="container-head-img">
        </a-popover>
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t3.png" class="container-head-img">
        </a-popover>
        <a-popover title="操作" placement="bottom" trigger="click">
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
        </a-popover>
        <a-popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t6.png" class="container-head-img">
        </a-popover>
      </div>
    </div>
    <div class="nc-hrb-middle">
      <div class="nc-hrbm-left">
        <div class="acco-sideline">
<!--          <span>基础信息</span>-->
          <div class="acco-sideline-content-one">
            <div>
              <span>会计准则：</span>
              <a-input :value="props.modelValue.thisAdInfo.basisMap.accStandard " style="width: 62%" />
            </div>
            <div>
              <span>科目级次：</span>
              <a-input :value="props.modelValue.thisAdInfo.basisMap.ccodeLevel " style="width: 62%" />
            </div>
            <div>
              <span>凭证类别：</span>
              <a-input :value="props.modelValue.thisAdInfo.basisMap.typeClass " style="width: 62%" />
            </div>
            <div>
              <span>本位币：&emsp;</span>
              <a-input :value="props.modelValue.thisAdInfo.basisMap.currency " style="width: 62%" />
            </div>
          </div>
        </div>
        <div class="acco-sideline">
            <div  class="acco-sideline-content-two">
            <div class="top-div">
              <span>凭证编号长度：</span><a-input :value="props.modelValue.thisAdInfo.currentEntity.accvouchDec" style="width: 10%;"/>
              <span style="margin-left: 2em;">汇率小数位：</span><a-input style="width: 10%;margin-right: 2em;"  :value="props.modelValue.thisAdInfo.currentEntity.rateDec"/>
              <span>单价小数位：</span><a-input :value="props.modelValue.thisAdInfo.currentEntity.unitPriceDec" style="width: 10%"/>
            </div>
            <a-checkbox-group :value="props.modelValue.thisAdInfo.zhiDanList " >
              <a-row>
                <a-col :span="12">
                  <a-checkbox value="ichronological">
                    制单序时控制
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="ideficit">
                    资金及往来赤字控制
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="icashFlow">
                    现金流量必录
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="isettlement">
                    结算方式必录
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="ibill">
                    往来单位票据号必录
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="iar">
                    可以使用应收受控科目
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="iap">
                    可以使用应付受控科目
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="price">
                    单价允许为空
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="inum">
                    数量为零允许保存
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="isave">
                    借贷不平保存为暂存凭证
                  </a-checkbox>
                </a-col>
<!--                <a-col :span="12">
                  <a-checkbox value="iexchange">
                    外币汇率为空允许保存
                  </a-checkbox>
                </a-col>
                <a-col :span="12">
                  <a-checkbox value="ifreecorp">
                    允许跨公司制单
                  </a-checkbox>
                </a-col>-->
              </a-row>
            </a-checkbox-group>
          </div>
        </div>
      </div>
      <div class="nc-hrbm-right">
        <div class="acct-up">
<!--          <span>会计期间</span>-->
          <div>
              <span class="acctd-span">会计期间：</span><a-input :value="props.modelValue.thisAdInfo.currentEntity.yearStartDate+'-'+props.modelValue.thisAdInfo.currentEntity.yearEndDate" style="width: 180px;margin: 0px 15px 5px 5px;"/>
            <span class="acctd-span">启用期间：</span><a-input   :value="props.modelValue.thisAdInfo.currentEntity.startPeriod" style="width: 65px;margin: 0px 15px 10px 5px;"/>
            <span class="acctd-span">期间数量：</span><a-input   :value="props.modelValue.thisAdInfo.currentEntity.periodNum" style="width: 50px;"/>
            <a-table size="small" bordered :data-source="props.modelValue.thisQjList" :columns="initQjColumns(1)" :pagination="false" style="min-height: 280px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {SearchOutlined} from '@ant-design/icons-vue';
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Row as ARow,
  Col as ACol,
  Checkbox as ACheckbox,Table as ATable
} from "ant-design-vue";
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {initBasisTabAccoutData} from "/@/api/record/system/financial-settings";
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const props=defineProps(['modelValue'])

const initQjColumns = (type)=>{
  let flag = type == '1'?true:false
  return [
    {
      title: flag?'会计期间':'季度区间',
      key: 'iperiodNum',
      dataIndex: 'iperiodNum',
      align: 'center',
      width: '20%',
    },
    {
      title: '开始日期',
      key: 'dateStart',
      dataIndex: 'dateStart',
      align: 'center',
      slots: { customRender: 'dateStart' },
    },{
      title: '结束日期',
      key: 'dateEnd',
      dataIndex: 'dateEnd',
      align: 'center',
      slots: { customRender: 'dateEnd' },
    },
  ]
}
const currentCateCode = computed(() => props.modelValue.thisQjList)
watch(
   () => currentCateCode,
  async (visible) => {
    debugger
    nextTick(() => {
     /* emit('visible-change', visible);
      instance && drawerInstance.emitVisible?.(visible, instance.uid);*/
    });
  }
);
</script>
<style lang="less" scoped>
.nc-hrb {
  height: calc(100% - 290px);
  .nc-hrb-top {
      div{
        height: 120px;
        width: 100%;
        margin: .5%;
        padding: 1.2%;
        text-align: center;
        .container-head-img{
          width: 80px;
          height: 80px;
          display: inline-flex;
          margin: 0 1%;
          -webkit-user-drag: none;
        }
        .container-head-img:hover{
          cursor: pointer;
          box-shadow: 0 0 10px 2px #9daad4;
          transform:scale(1.02,1.02)
        }
      }
  }

  .nc-hrb-middle {
    height: calc(100% - 120px);
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
  }
}
</style>
