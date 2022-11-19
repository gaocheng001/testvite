<template>
  <div>
    <div class="customize-cc">
      <span>同步修改单据数量</span>
      <ul>
         <li suo="XSCKD"><Checkbox v-model:checked="checkedModel['ck']" disabled /><span>销售出库单</span></li>
         <li suo="JHZXD"><Checkbox v-model:checked="checkedModel['jh']" /><span>拣货装箱单</span></li>
         <li suo="WLSHD"><Checkbox v-model:checked="checkedModel['wl']" /><span>物流送货单</span></li>
<!--         <li suo="XHD"><Checkbox v-model:checked="checkedModel['xh']" /><span>销货单</span> </li>-->
       </ul>
      <span>提示：同步单据后数量将发生变化，请重新打印同步单据！</span>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {Checkbox} from 'ant-design-vue';
const checkedModel = ref({
  'ck': true,
  'jh': false,
  'wl': false,
  'xh': false
})
</script>
<style lang="less" scoped="scoped">
.customize-cc {
  display: inline-block;
  text-align: left;
  width: 100%;
  ul{
    margin:  10%;
    li{
      margin: 5px;
      :deep(.ant-checkbox-wrapper){
        .ant-checkbox,ant-checkbox-disabled{
          border: 1px solid black;
        }
      }
      >span{
        margin-left: 10%;
        color: black;
        font-weight: bold;
      }
    }
  }
  >span:nth-of-type(1){
    font-size: 16px;
     font-weight: bold;
     color: black;
    margin: 32%;
  }
  >span:nth-of-type(2){
    color: darkgoldenrod;
  }
}
</style>
