<template>
  <div>
    <a class="ant-dropdown-link" @click.prevent>
      <img src="/@/assets/images/tx.png" class="anticon anticon-down" style="vertical-align: -4px;width: 18px;height: 18px;"/>
      <span style="color: white;font-weight: bold;font-size: 12px;margin: 0 5px;color: black">{{realName}}</span>
    </a>
  </div>
</template>
<script setup lang="ts">
import {Dropdown, Menu} from "ant-design-vue";
const MenuItem = Menu.Item;
import {useUserStore} from "/@/store/modules/user";
const realName = useUserStore().getUserInfo.realName
</script>
