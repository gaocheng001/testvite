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
        <a-col :span="3">
          <div><img src="/img/home/g01.png"
                    class="container-head-img"></div>
          <div><span>土地建设</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g02.png"
                    class="container-head-img"></div>
          <div><span>专用设备</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g03.png"
                    class="container-head-img"></div>
          <div><span>通用设备</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g04.png"
                    class="container-head-img"></div>
          <div><span>家具、用具、装具及动植物</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g05.png"
                    class="container-head-img"></div>
          <div><span>图书、档案</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g06.png"
                    class="container-head-img"></div>
          <div><span>文物和陈列品</span></div>
        </a-col>
        <a-col :span="3">
          <div><img src="/img/home/g07.png"
                    class="container-head-img"></div>
          <div><span>低值易耗品</span></div>
        </a-col>
<!--        <a-col :span="3">
          <div><img src="/img/home/gd8.png"
                    class="container-head-img"></div>
          <div><span>编辑分类</span></div>
        </a-col>-->
      </a-row>
      <div class="nc-hrbb-div">
        <span>固定资产数量：<span>1586个</span></span>
        <span>原值：<span>190,000.00元</span></span>
        <span>累计折旧：<span>57,000.00元</span></span>
        <span>到期数量：<span>15个</span></span>
      </div>
    </div>
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
    :deep(.ant-row) {
      justify-content: center;
      .ant-col {
        text-align: center;
        height: 150px;
        background-color: white;
        margin: 1% 0 1px;
        padding: .5% 0px;
      /*  flex: 0 0 12%;
        max-width: 12%;*/
        div{
          .container-head-img {
            width: 80px;
            height: 80px;
            display: inline-flex;
            -webkit-user-drag: none;
            cursor: pointer;
            transform:scale(1.02,1.02);
          }
          font-weight: bold;
          margin: 5% 0;
        }
      }
    }
    .nc-hrbb-div{
      margin-left: 6%;
      width: 88%;
      display: flex;
      height: 30px;
      justify-content: space-around;
      background-color: white;
      >span{
        font-size: 18px;
        color: #545454;
        font-weight: bold;
        padding: 2px 0;
        >span{
          display: inline-block;
          color: #5a6e8b;
          margin-left: 20px;
        }
      }
    }
  }

  .nc-hrb-bottom{
    :deep(.ant-row) {
      .ant-col {
        height: 200px;
        background-color: white;
        margin: 0 1% 1%;
        border-radius: 4px;
        flex: 0 0 48%;
        max-width: 48%;
        div:nth-of-type(1){
          display: flex;
          justify-content: space-between;
          background-color: #e8e8e8;
          span{
            padding: 5px;
            font-weight: bold;
          }
        }
        div:nth-of-type(2){
          ul{
            li{
              line-height: 32px;
              border-bottom: 2px #d1d2d3 solid;
              span:nth-of-type(1){
                color: yellowgreen;
                padding: 5px 10px;
              }
              span:nth-of-type(2){
                width: 82%;
                display: inline-flex;
                verflow: hidden;//超过指定的宽度和高度也隐藏
                overflow:hidden;//超过指定的宽度和高度也隐藏 同时也隐藏子元素
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              span:nth-of-type(3){
                color: blue;
              }

            }
            li:nth-of-type(5){
              border-bottom: none;
            }
          }
        }
      }
    }

  }
}
</style>
