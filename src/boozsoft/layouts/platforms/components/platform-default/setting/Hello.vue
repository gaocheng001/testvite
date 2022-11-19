<template>
  <div>
    <Tabs :defaultActiveKey="activeUser">
      <TabPane v-for="a in abc" :key="a.id">
        <template #tab>
          <span @click="switchUser2(a.id)">{{a.name}}</span>
        </template>
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup>
import {ref}from 'vue';
import {Tabs} from 'ant-design-vue';
import {useSsoStoreWidthOut} from '/@/store/modules/sso';
import {getUsersModel} from '/@/../mock-api/_datatable/tokenResource_data/tokenResource_data';
import {useUserStoreWidthOut} from '/@/store/modules/user';
const activeUser=ref(useUserStoreWidthOut().getUserInfo.id)

const abc=ref(getUsersModel.map(item=>item.user))
const TabPane=Tabs.TabPane
function switchUser2(id){
  useSsoStoreWidthOut().mockSwitchUser(id)
}
</script>
