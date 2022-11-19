<template>
  <div class="nc-hrb-bottom">
    <a-row type="flex">
      <a-col :span="11">
        <div>
          <span>&emsp;任务及协作</span>
          <div>
            <a-button type="text"  danger><StarTwoTone /></a-button>
            <a-button type="text"  danger><FullscreenOutlined /></a-button>
            <a-button type="text"  danger><CloseOutlined /></a-button>
          </div>
        </div>
        <div>
          <span>任务及协作内容</span>🠑🠓<span>发送人</span>🠑🠓<span>发送时间</span>🠑🠓<span>优先级</span>🠑🠓<span>状态</span>
        </div>
        <div>
          <ul>
            <li>
              <a-tooltip color="pink">
                <template #title>老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。</template>
                老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。
              </a-tooltip>&ensp;
              <span>张三</span>&ensp;
              <span>2020-01-01</span>&ensp;
              <span>高</span>
              <span>已处理</span>
            </li>
            <li>
              <a-tooltip color="pink">
                <template #title>老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。</template>
                老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。
              </a-tooltip>&ensp;
              <span>张三</span>&ensp;
              <span>2020-01-01</span>&ensp;
              <span>高</span>
              <span>已处理</span>
            </li>
            <li>
              <a-tooltip color="pink">
                <template #title>老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。</template>
                老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。
              </a-tooltip>&ensp;
              <span>张三</span>&ensp;
              <span>2020-01-01</span>&ensp;
              <span>高</span>
              <span>已处理</span>
            </li>
            <li>
              <a-tooltip color="pink">
                <template #title>老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。</template>
                老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。
              </a-tooltip>&ensp;
              <span>张三</span>&ensp;
              <span>2020-01-01</span>&ensp;
              <span>高</span>
              <span>已处理</span>
            </li>

          </ul>
        </div>
      </a-col>
      <a-col :span="11">
        <div>
          <span>&emsp;消息及通知</span>
          <div>
            <a-button type="text"  @click="goMessage" danger><FullscreenOutlined /></a-button>
            <a-button type="text"  danger><CloseOutlined /></a-button>
          </div>
        </div>
        <div>
          <span>任务及公告</span><span>发送人</span><span>发送时间</span><span>优先级</span><span>状态</span>
        </div>
        <div>
          <ul>
            <li v-for="item in messagelist" key="item.id" >
              <a-tooltip color="pink">
                {{item.content}}
              </a-tooltip>&ensp;
              <span>{{item.username}}</span>&ensp;
              <span>{{formatTime(item.sendTime)}}</span>&ensp;
              <span>
                <span v-if="item.weights === '1'&& item.ifrag != '1'" style="background-color: rebeccapurple;height: 6px;"> {{'\u00a0'}}</span>
                <span v-else-if="item.weights === '2'&& item.ifrag != '1'" style="background-color: rebeccapurple;width: 75%;height: 6px"> {{'\u00a0'}}</span>
                <span v-else-if="item.weights === '3'&& item.ifrag != '1'" style="background-color: rebeccapurple;width: 50%;height: 6px"> {{'\u00a0'}}</span>
                <span v-else-if="item.weights === '1' && item.ifrag === '1'" style="background-color: green;height: 6px"> {{'\u00a0'}}</span>
                <span v-else-if="item.weights === '2' && item.ifrag === '1'" style="background-color: green;width: 75%;height: 6px"> {{'\u00a0'}}</span>
                <span v-else-if="item.weights === '3' && item.ifrag === '1'" style="background-color: green;width: 50%;height: 6px"> {{'\u00a0'}}</span>
                <span v-else="record.weights === '4' && record.ifrag === '1'" style="background-color: green;width: 25%;height: 6px"> {{'\u00a0'}}</span>
              </span>
              <span>{{formatIfrag(item.ifrag)}}</span>
            </li>

<!--          <li>
              <a-tooltip color="pink">
                <template #title>老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。</template>
                老胡今天与中国驻阿富汗的王愚大使取得了联系老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。老胡今天与中国驻阿富汗的王愚大使取得了联系，通过他了解了使馆的基本情况。
              </a-tooltip>&ensp;
              <span>张三</span>&ensp;
              <span>2020-01-01</span>&ensp;
              <span>高</span>
              <span>已处理</span>
            </li>
-->
          </ul>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {StarTwoTone, FullscreenOutlined,CloseOutlined,MoreOutlined,SoundFilled,ClockCircleFilled} from '@ant-design/icons-vue';
import {
  message,
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Tooltip as ATooltip,
  Row as ARow,
  Col as ACol,
} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import { findAllIndex } from "/@/api/record/message/data";
import { useRoute, useRouter } from 'vue-router';
import moment from "moment";

const route = useRoute();
const router = useRouter();
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const messagelist = ref([])
onMounted( async()=>{
  //查询我的消息
  const  data = await findAllIndex({
    user:  useUserStoreWidthOut().getUserInfo.id
  })
  messagelist.value = data;
})

const goMessage = (val)=> {
  router.push({
    path: '/cashiers/ab-xjll/message-list',
  });
}
const formatIfrag = (val)=>{
  let str
  if(val === '1'){
    str = '已读'
  }else if(val === '0'){
    str = '未读'
  }else{
    str = '隐藏'
  }
  return str;
}
const formatWeights = (val)=>{
  let str
  if(val === '1'){
    str = '重要紧急'
  }else if(val === '2'){
    str = '重要不紧急'
  }else if(val === '3'){
    str = '紧急不重要'
  }else{
    str = '一般'
  }
  return str;
}
const formatTime = (val)=>{
  return moment(val).format('YYYY-MM-DD')
}
</script>
<style lang="less" scoped>
.nc-hrb-bottom{
  margin-top: 1%;
  :deep(.ant-row) {
    .ant-col {
      height: 200px;
      background-color: white;
      margin: 0 1% 1%;
      border-radius: 4px;
      flex: 0 0 48%;
      max-width: 48%;
      > div:nth-of-type(1){
        display: flex;
        justify-content: space-between;
        background-color: #e8e8e8;
        span{
          padding: 5px;
          font-weight: bold;
          color: #5a6e8b;
          font-size: 18px;
        }
      }
      > div:nth-of-type(2){
        >span{
          display: inline-block;
          width: calc((65% - 40px) / 4);
          font-weight: bold;
          color: #5a6e8b;
          text-align: center;
        }
        >span:nth-of-type(1){
          width: 35%;
          text-align: left;
        }
      }
      > div:nth-of-type(3){
        ul{
          li{
            line-height: 32px;
            border-bottom: 2px #d1d2d3 solid;
        /*    span:nth-of-type(1){
              color: yellowgreen;
              padding: 5px 10px;
            }*/
            span{
              width: calc((65% - 40px) / 4);
              display: inline-flex;
              justify-content: center;
            }
            span:nth-of-type(1){
              text-align: left;
              width: 35%;
              justify-content: unset;
              verflow: hidden !important;//超过指定的宽度和高度也隐藏
              overflow:hidden;//超过指定的宽度和高度也隐藏 同时也隐藏子元素
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            span:last-of-type{
              color: #5a6e8b;
              font-weight: bold;
            }
          }
          li:nth-of-type(4){
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
