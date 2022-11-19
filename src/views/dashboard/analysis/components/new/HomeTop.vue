<template>
  <div class="nc-ht">
<!--    <div v-for="(item,index) in functionalModules" :style="{backgroundColor: item.color}" >
      <img :src="'@/assets/images/dashboard/wokb/datashow4.png'" class="container-head-img">
      <span>{{item.title}}</span>
    </div>-->
    <Carousel arrows :dots="false">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 999">
          <LeftCircleOutlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <RightCircleOutlined />
        </div>
      </template>
      <div v-for="pageIndex in calculatePaging(0,'number')" :key="pageIndex">
        <div v-for="(item,index) in calculatePaging(pageIndex,'list')" :key="index" :style="{backgroundColor: item.color}" @click="goRouter(item.eventName)">
          <img :src="imgValue(item.imgPath)" class="container-head-img">
          <span>{{item.title}}</span>
        </div>
      </div>
    </Carousel>
  </div>
</template>
<script setup lang="ts">
import {LeftCircleOutlined,RightCircleOutlined} from '@ant-design/icons-vue';
import {message, Input as AInput,Carousel} from "ant-design-vue";
import {reactive, onMounted, unref} from "vue";
import {useModal} from "/@/components/Modal";
import router from "/@/router";
const props=defineProps(['modelValue'])
async function goRouter(path) {
  router.push(path/*{
    path: path,
   /!* query: {},*!/
  }*/);
}
const functionalModules = [
  {
    title: '集团',
    color: '#1c6ca1',
    imgPath: '1',
    eventName: '/system/institution-management/im-group',
  },
  {
    title: '组织',
    color: '#c25205',
    imgPath: '2',
    eventName: '/system/institution-management/im-organize',
  },
  {
    title: '公司',
    color: '#5f4a71',
    imgPath: '3',
    eventName: '/system/institution-management/im-unit',
  },
  {
    title: '操作员',
    color: '#1c6ca1',
    imgPath: '4',
    eventName: '/system/auth-management/opearManager',
  },{
    title: '角色管理',
    color: '#c25205',
    imgPath: '5',
    eventName: '/system/auth-management/sys-role',
  },
  {
    title: '密码策略',
    color: '#1c6ca1',
    imgPath: '1',
    eventName: '/system/auth-management/pwd-rule',
  },
  {
    title: '常用外币',
    color: '#5f4a71',
    imgPath: '2',
    eventName: '/system/deploy-management/UsedForeignCurrency',
  },
  {
    title: '外币汇率',
    color: '#1c6ca1',
    imgPath: '3',
    eventName: '',
  },
  {
    title: '结算方式',
    color: '#5f4a71',
    imgPath: '4',
    eventName: '/system/deploy-management/sett-modes',
  },
  {
    title: '权限设置',
    color: '#7cb305',
    imgPath: '5',
    eventName: '',
  },{
    title: '会计科目',
    color: '#2b3b4e',
    imgPath: '1',
    eventName: '/system/accountancy/findcode2',
  },{
    title: '账套列表',
    color: '#7cb305',
    imgPath: '2',
    eventName: '',
  },
  {
    title: '核算码',
    color: '#1c6ca1',
    imgPath: '3',
    eventName: '',
  },{
    title: '客商信息',
    color: '#c25205',
    imgPath: '4',
    eventName: '',
  },{
    title: '人员信息',
    color: '#5f4a71',
    imgPath: '5',
    eventName: '/system/user/groupPsn',
  },{
    title: '项目大类',
    color: '#2b3b4e',
    imgPath: '1',
    eventName: '/system/project/sys-project-category',
  },{
    title: '项目目录',
    color: '#7cb305',
    imgPath: '2',
    eventName: '/system/project/sys-project',
  },{
    title: '人员类别',
    color: '#1c6ca1',
    imgPath: '3',
    eventName: '/system/user/groupPsnType',
  },
]
const imgValue = (index) => {
  return  new URL('/img/home/datashow'+index+'.png', import.meta.url).href;
}
const calculatePaging =  (index,type)=>{
  let pno = index
  let totalPage = 0;//总页数
  let pageSize = 10;//每页显示行数
  let num = functionalModules.length;//表格所有行数(所有记录数)
  //总共分几页
  if(num/pageSize > parseInt(num/pageSize)){
    totalPage=parseInt(num/pageSize)+1;
  }else{
    totalPage=parseInt(num/pageSize);
  }
  if (type == 'number'){
    return totalPage
  }else {
    let currentPage = pno;//当前页数
    let startIndex = (currentPage - 1) * pageSize+1;//开始显示的行  31
    let endIndex = currentPage * pageSize;
    return  functionalModules.slice(startIndex-1,endIndex)
  }
}

</script>
<style lang="less" scoped>
   .nc-ht{

     .ant-carousel :deep(.slick-slide) {
       text-align: center;
       height: 120px;
       line-height: 120px;
       background: rgba(0,0,0,0.7);
       overflow: hidden;
       >div >div{
         display: inline-flex !important;
         justify-content: center;
         vertical-align: middle;
         >div {
           width: 100px;
           height: 100px;
           background-color: #861e1e;
           text-align: center;
           margin: 0 .5%;
           .container-head-img {
             width: 60px;
             margin: 10% 20% -50%;
           }
           span {
             color: white;
             font-weight: bold;
           }
         }

         div:hover {
           cursor: pointer;
           border: 2px #2b4bcb solid;
         }
       }
     }

     .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
       width: 25px;
       height: 25px;
       font-size: 25px;
       color: white;
       background-color: rgba(46, 76, 110, 0.11);
       opacity: .8;
     }
     .ant-carousel :deep(.custom-slick-arrow:before) {
       display: none;
     }
     .ant-carousel :deep(.custom-slick-arrow:hover) {
       opacity: 1;
       color: blue;
     }

     .ant-carousel :deep(.slick-slide h3) {
       color: #fff;
     }
   }
</style>
