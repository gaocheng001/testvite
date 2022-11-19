<template>
    <li :class="{selectLi:selected}" class="sider_item icon-color" style="padding:12px 10px;font-size: 16px">
     <span class="this_ico"> <component :is="thisIcon"/></span>
<!--      <svg v-else t="1618986547278" style="    width: 18px;-->
<!--                        height: 18px;-->
<!--                        margin-left: -3px;" class="icon" viewBox="0 0 1024 1024" version="1.1"-->
<!--           xmlns="http://www.w3.org/2000/svg"-->
<!--           p-id="2021" width="200" height="200">-->
<!--        <path-->
<!--          d="M769.848889 881.550222H242.716444C114.631111 887.182222 6.058667 790.755556 0.284444 666.083556c-5.831111-124.643556 93.297778-230.286222 221.383112-235.946667-0.341333-151.466667 120.234667-277.191111 275.541333-287.288889 155.306667-10.069333 291.982222 98.929778 312.32 249.116444 130.901333 19.626667 224.113778 134.200889 213.703111 262.684445-10.410667 128.512-120.888889 227.470222-253.354667 226.901333z m-496.355556-82.090666h496.355556c60.273778 0 115.968-31.288889 146.090667-82.062223a160.341333 160.341333 0 0 0 0-164.152889c-30.151111-50.801778-85.816889-82.090667-146.090667-82.062222-11.178667 0-21.902222-4.323556-29.809778-12.032a40.476444 40.476444 0 0 1-12.373333-29.013333c0-113.322667-94.378667-205.198222-210.830222-205.198222-116.451556 0-210.858667 91.875556-210.858667 205.198222v8.618667c99.697778 27.648 168.504889 116.195556 168.675555 217.088 0 14.648889-8.021333 28.216889-21.077333 35.555555a43.178667 43.178667 0 0 1-42.183111 0 40.846222 40.846222 0 0 1-21.048889-35.555555c0-79.160889-65.848889-143.416889-147.2-143.644445-81.521778 0-147.598222 64.312889-147.598222 143.644445 0 79.303111 66.076444 143.644444 147.598222 143.644444h16.440889c4.608-0.768 9.329778-0.768 13.937778 0z"-->
<!--          p-id="2022"></path>-->
<!--      </svg>-->
      <span style="margin-left: 25px;"><slot></slot></span>
      <CompressOutlined v-if="props.isOutLink && !props.isTargetBlank" style="    position: absolute;
    right: 0;" />
<!--      <img src="../../../../../../assets/svg/system_option/inlink.svg" v-if="props.isOutLink && !props.isTargetBlank" class="inLinkImg"/>-->
      <img src="../../../../../../assets/svg/system_option/outlink.svg" v-if="props.isOutLink && props.isTargetBlank" class="outLinkImg"/>
    </li>
</template>
<script setup>
import {computed} from 'vue'
const props=defineProps(['isCloud','isOutLink','isTargetBlank','selected','icon'])
const selected=computed(()=>props.selected)
const thisIcon=computed(()=>props.icon)

import {
  CompressOutlined,
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined, EllipsisOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled, EditOutlined, SortAscendingOutlined, CheckOutlined, SortDescendingOutlined
} from '@ant-design/icons-vue';

</script>
<style scoped>
.inLinkImg{
  display:inline-block;margin-left:5px;opacity:0.7;width: 13px; display: block; color: black;
}
.outLinkImg{
  display:inline-block;margin-left:10px;opacity:0.7;width: 12px; display: block; color: black;
}
li {
  padding: 10px 16px;
  text-align: left;
  display: flex;
  height: auto;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 20px;
  transition: none;
  cursor: pointer;
  border-radius: 4px;
}

.selectLi {
  background-color: rgba(27, 154, 238, 0.1);
}

.sider_item:hover{
background:white;
  color:black;
}
</style>
<style scoped>
.selectLi .this_ico{
  color:white !important;
}
.icon-color .this_ico{
  color:#929191
}
.icon-color:hover .this_ico{
  color:black !important;
}
</style>
