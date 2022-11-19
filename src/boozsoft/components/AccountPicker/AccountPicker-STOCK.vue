<template>
  <div class="account-picker" :style="props.theme=='one' || props.theme=='three'?{maxWidth:'764px'}:{width:'420px'}">
    <AccountPickerThemeThree v-if="props.theme=='three'" v-bind="$attrs">
      <template v-slot:default="{fun,info}">
        <div>
          <span class="ap-title">账套代码：</span>
          <span v-if="props.readonly==''" class="ap-text">{{ info.coCode }}</span>
          <span v-else :ref="fun.one"></span>
          <span class="ap-title">账套名称：</span>
          <span :ref="fun.two"/>
        </div>
      </template>
    </AccountPickerThemeThree>
    <AccountPickerThemeThree v-if="props.theme=='two'" v-bind="$attrs">
      <template v-slot:default="{fun,info}">
          <div>
            <span class="ap-title">账套代码：</span>
            <span v-if="props.readonly==''" class="ap-text">{{ info.coCode }}</span>
            <span v-else :ref="fun.one"></span>
            <span class="ap-title">账套名称：</span>
            <span :ref="fun.two"/>
            <div style="margin-top:10px;font-size: 14px;">
              <span class="ap-title">年度：</span>
              <span class="ap-text" v-if="props.readonly==''">{{ info.managementYear }}</span>
              <span v-else :ref="fun.four"></span>
            </div>
        </div>
      </template>
    </AccountPickerThemeThree>
    <AccountPickerThemeThree v-else-if="props.theme=='one'" v-bind="$attrs">
      <template v-slot:default="{fun,info}">
        <div>
            <span class="ap-title">账套代码：</span>
            <span v-if="props.readonly==''" class="ap-text">{{ info.coCode }}</span>
            <span v-else :ref="fun.one"></span>
            <span class="ap-title">账套名称：</span>
            <span :ref="fun.two"/>
            <span class="ap-title">年度：</span>
            <span class="ap-text" v-if="props.readonly==''">{{ info.managementYear }}</span>
            <span v-else :ref="fun.four"></span>
          </div>
      </template>
    </AccountPickerThemeThree>
    <AccountPickerThemeThree v-else v-bind="$attrs">
      <template v-slot:default="{fun,info}">
        <slot :fun="fun" :info="info"></slot>
      </template>
    </AccountPickerThemeThree>
  </div>
</template>
<script setup>
import AccountPickerThemeThree from "/@/boozsoft/components/AccountPicker/components/AccountPickerThemeThree.vue";

const props = defineProps(['theme', 'readonly'])
</script>
<style lang="less" scoped>
.account-picker {
  text-align: left;
  font-size: 14px;
  line-height: 32px;
  .ap-title {
    font-weight: bold;
    color: #666666;
    margin-left: 1em;
  }

  .ap-text {
    background-color: white;
    padding: 7px 10px;
    border-radius: 5px;
    font-weight: bold;
    color: black;

  }
}
</style>
