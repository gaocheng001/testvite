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
      <a-row type="flex">
        <a-col :span="8">
          <div class="col-top">
              <span>资金状况</span>
          </div>
          <div class="col-bottom">
            <div><img src="/img/home/datashow3.png"
                      class="container-head-img"><span>库存现金</span><span class="digital-font-arial">￥ 7,559.00</span></div>
            <div><img src="/img/home/datashow1.png"
                      class="container-head-img"><span>银行存款</span><span class="digital-font-arial">￥ 755,975,597,559.00</span></div>
            <div><img src="/img/home/datashow2.png"
                      class="container-head-img"><span>承兑汇票</span><span class="digital-font-arial">￥ 7,559.00</span></div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="col-top" >
            <span>银行未达账</span>
            <a-select placeholder="" style="width: 40%;min-width: 150px;border-radius: 4px;float: right" :default-value="1">
              <a-select-option key="0" :value="1">中国建设银行</a-select-option>
            </a-select>
          </div>
          <div class="col-bottom">
            <ul class="col-bottom-ul">
              <li>
                <span>银行已收企业未收:</span><span class="digital-font-arial">17,941,313,212.00元</span>
              </li>
              <li>
                <span>银行已付企业未付:</span><span class="digital-font-arial">17,941,313,212.00元</span>
              </li>
              <li>
                <span style="margin-right: 6em">余额:</span><span class="digital-font-arial" >17,941,313,212.00元</span>
              </li>
            </ul>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="col-top" >
            <span>承兑汇票情况</span>
          </div>
          <div class="col-bottom">
            <ul class="col-bottom-ul">
              <li>
                <span style="margin-right: 3em">已到期金额:</span><span class="digital-font-arial" >17,941,313,212.00元</span>
              </li>
              <li>
                <span style="margin-right: 3em">未到期金额:</span><span class="digital-font-arial" >17,941,313,212.00元</span>
              </li>
              <li>
                <span>三十天内到期金额:</span><span class="digital-font-arial">17,941,313,212.00元</span>
              </li>
            </ul>
          </div>
        </a-col>
      </a-row>
    </div>
<!--    <div class="nc-hrb-middle1">
      <div class="nc-hrbm-one">
      <span style="font-size: 22px;font-weight: bold;display: block;padding: .5% 2%">
        资金情况表
      </span>
        <a-row type="flex">
          <a-col :span="3">
            <div><img src="/img/home/datashow3.png"
                      class="container-head-img"></div>
            <div><span>现金</span><br/><span>￥ 75.59.00</span></div>
          </a-col>
          <a-col :span="3">
            <div><img src="/img/home/datashow1.png"
                      class="container-head-img"></div>
            <div><span>银行</span><br/><span>￥ 75.59.00</span></div>
          </a-col>
          <a-col :span="3">
            <div><img src="/img/home/datashow2.png"
                      class="container-head-img"></div>
            <div><span>承兑汇票</span><br/><span>￥ 75.59.00</span></div>
          </a-col>
        </a-row>
      </div>
      <div class="nc-hrbm-two">
        <div>
          <span>银行：</span><a-select placeholder="" style="width: 40%;min-width: 150px;border-radius: 4px" :default-value="1">
          <a-select-option key="0" :value="1">中国建设银行</a-select-option>
        </a-select>
          &emsp;&emsp;<span>截止：</span><a-select placeholder="" style="width: 20%;min-width: 120px;border-radius: 4px" :default-value="1">
          <a-select-option key="0" :value="1">2021-12-31</a-select-option>
        </a-select>
        </div>
        <div>
          <br/>
          <span>银行已收企业未收</span><span class="moeny-span">17,941,313,212.00元</span><br/>
          <span>银行已付企业未付</span><span class="moeny-span">17,941,313,212.00元</span>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script setup lang="ts">
import {StarTwoTone, FullscreenOutlined,CloseOutlined,MoreOutlined,SoundFilled,ClockCircleFilled,SearchOutlined,ArrowDownOutlined,ArrowUpOutlined,PlusOutlined} from '@ant-design/icons-vue';
import {
  message,
  Input as AInput,
  Select as ASelect,
  Button as AButton,
  Popover as APopover,
  Tooltip as ATooltip,
  Row as ARow,
  Col as ACol
} from "ant-design-vue";
import {onMounted, reactive} from "vue";
import {useModal} from "/@/components/Modal";
import HomeRightBottomTaskAndMsg from "/@/views/dashboard/analysis/components/new/HomeRightBottomTaskAndMsg.vue";
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option

const props=defineProps(['modelValue'])

</script>
<style lang="less" scoped>
.nc-hrb {
  height: calc(100% - 300px);
  .nc-hrb-top {
      div{
        height: 120px;
        width: 100%;
        margin: .5% 0 .2%;
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
    min-height: 250px;
    :deep(.ant-row) {
      .ant-col {
        text-align: center;
        height: 250px;
        background-color: white;
        margin: 0 .5% 1%;
        border-radius: 4px;
        padding: 1%;
        flex: 0 0 32%;
        max-width: 32%;
        .col-top{
          padding-bottom: 5px;
          text-align: left;
          font-size: 20px;
          font-weight: bold;
          border-bottom: 1px solid #d2cfcf;
          .ant-select-selector{
            background-color: #f1f1f1;
            border-color: #d2cfcf;
            text-align: center;
          }
        }
        .col-bottom{
          >div{
            display: flex;
            padding: 5px 10px 0;
            .container-head-img {
              width: 60px;
              height: 60px;
              -webkit-user-drag: none;
            }
            span:nth-of-type(1){
              font-size: 18px;
              min-width: 110px;
              padding: 2.5% 0 2.5% 2%;
            }
            span:nth-of-type(2){
              font-size: 14px;
              padding: 2.5% 0%;
              display: inline-block;
              width: calc(100% - 180px);
              text-align: right;
            }
          }
          .col-bottom-ul{
            li{
              margin: 5% 0;
              text-align: left;
              span:nth-of-type(1){
                font-size: 18px;
                padding: 2.5% 0 2.5% 2%;
              }
              span:nth-of-type(2){
                font-size: 14px;
                display: inline-block;
                width: calc(100% - 160px);
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
}
</style>
