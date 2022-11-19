<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <div>
          <span style="font-weight: bold;font-size: 20px">集团管理平台</span>
          <ul style="list-style: circle;margin: 2% 0 3%">
            <li>系统管理工作平台</li>
            <li>操作员及权限设置平台</li>
            <li>公司和账套管理平台</li>
            <li>集团账套主数据设置平台</li>
          </ul>
          <Button>操作手册</Button>
        </div>
        <div :style="bgStyle"></div>
      </div>
      <div class="nc-hrt-two nc-hrt-etc">
        <div>
          <UserOutlined style="font-size: 30px;margin-bottom: 5%;"/>
          <br/>
          <span>操作员及权限设置</span>
        </div>
        <span>
          管理操作员并设置权限
        </span>
        <ul style="list-style: disc;">
          <li>操作员增删改</li>
          <li>角色增删改</li>
          <li>操作员授权设置</li>
        </ul>
      </div>
      <div class="nc-hrt-three nc-hrt-etc">
        <div>
          <FileDoneOutlined style="font-size: 30px;margin-bottom: 5%;"/>
          <br/>
          <span>集团主数据管理</span>
        </div>
        <span>
          集团主数据统一管理
        </span>
        <ul style="list-style: disc;">
          <li>集团统一管理主数据</li>
          <li>新增主数据审批自动化</li>
          <li>集团档案更新动态同步</li>
        </ul>
      </div>
      <div class="nc-hrt-four nc-hrt-etc">
        <div>
          <MedicineBoxOutlined style="font-size: 30px;margin-bottom: 5%;"/>
          <br/>
          <span>新建账套</span>
        </div>
        <span>集团统一账套规则</span>
        <ul style="list-style: disc;">
          <li>统一编码规则</li>
          <li>统一主数据档案</li>
          <li>统会计科目</li>
        </ul>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div class="acttd-right-d-search">
        <Select class="acttdrd-search-select" :defaultValue="1">
          <SelectOption  :value="1">客户名称</SelectOption>
        </Select>
        <InputSearch
          class="acttdrd-search-input"
          placeholder=""
          enter-button=" 检索 "
          size="large"
        />
      </div>
    </div>
    <div class="nc-hr-temp">
      <HomeRightBottomTags/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {FileDoneOutlined,MedicineBoxOutlined,UserOutlined} from '@ant-design/icons-vue';
import {message, Row, Col,Button,Select,Input} from "ant-design-vue";
import {onMounted, reactive} from "vue";
import HomeRightBottomTags
  from "/@/views/dashboard/analysis/components/new/HomeRightBottom-Jt.vue";
import router from "/@/router";
import {usePlatformsStore} from "/@/store/modules/platforms";
const props=defineProps(['modelValue'])
const mark = usePlatformsStore().getCurrentPlatformId
const SelectOption =Select.Option;
const InputSearch =Input.Search;
const toPage = (path) => {
  if (null != path)
    router.push({
      path: ((mark == '1003'?'/system':'/origin') + path)
    });
}
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
const bgStyle='background-image: url(\''+new URL('/assets/images/homes/org1.png', import.meta.url).href+'\')'
</script>
<style lang="less" scoped>
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色
.nc-hr{
  .nc-hr-top{
    font-weight: bold;
    color: white;
    height: 200px;
    width: 100%;
    display: inline-flex;
    justify-content: space-between;

    div {
      border-radius: 3px;

      > .ant-btn {
        background-color: #ffcd36;
        color: black;
        font-weight: bold;
      }

      ul {
        padding-left: 8%;
        font-size: 12px;
        margin-bottom: 0;
      }
    }
    .nc-hrt-one {
      width: 55%;
      background-color: #4b6ae1;
      display: inline-flex;
      justify-content: space-between;

      div {
        height: 95%;
        margin: .5%;
      }

      div:nth-of-type(1) {
        width: 30%;
        margin-left: 4%;
        margin-top: 1.5%;
      }

      div:nth-of-type(2) {
        width: 30%;
        margin-right: 3%;
        //background-image: url(/@/assets/images/homes/org1.png);
        background-size: 80% 80%;
        background-repeat: no-repeat;
        background-position: 12px;
      }
    }

    .nc-hrt-two {
      background-color: #1ea639;
    }

    .nc-hrt-three {
      background-color: #0aa699;
    }

    .nc-hrt-four {
      background-color: #0a84ff;
    }
    .nc-hrt-etc{
      width: 14%;
      padding: 1.3% 2% 0;

      > div {
        height: 45%;
        text-align: center;
      }
    }
  }
  .nc-hr-middle{
    height: 80px;
    text-align: center;
    padding: 20px;
    .acttd-right-d-search {
      .acttdrd-search-select {
        width: 120px;

        :deep(.ant-select-selector) {
          border-color: @Global-Border-Color;
          border-radius: 2px 0 0 2px;
          height: 40px;
          .ant-select-selection-item{
            line-height: 38px;
            font-weight: bold;
          }

        }
      }

      .acttdrd-search-input {
        width: 300px;
        :deep(.ant-input){
          width: 300px;
          border-radius: 0 2px 2px 0;
          border-color: @Global-Border-Color;
          border-left: none;
        }

      }
    }
  }
  .nc-hr-temp{
  }
}
</style>
