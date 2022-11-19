<template>
  <Wangeditor v-on:getWangEditorValue=getWangEditorValue ></Wangeditor>
</template>

<script lang="ts" setup>
import {
  PropType,
  ref,
  watch,
  reactive,
  toRefs,
  provide,
  inject,
  onBeforeMount,// 在组件挂载之前执行的函数
  onMounted,
  onBeforeUpdate,// 在组件修改之前执行的函数
  onUpdated,
  onBeforeUnmount,// 在组件卸载之前执行的函数
  onUnmounted,
  nextTick
} from "vue";
//导入代码高亮文件
import hljs from 'highlight.js'

// 引入axios钩子
import axios from "/@/hooks/axios.ts";

import { useRouter, useRoute } from "vue-router";
import {CustomizeWangeditor as Wangeditor} from "/@/components/CustomizeWangeditor";

// api 接口文件
import { putComment, getArticleDetail } from "/@/api/pc/articleDetail.ts";
// 实例化路由
const router = useRouter();
// 路由参数
const route = useRoute();
/**
 * @name: 声明data
 * @author: camellia
 * @email: guanchao_gc@qq.com
 * @date: 2021-01-18
 */
const data = reactive({
  // 评论内容
  comment_content: '',
});

/**
 * @name: 获取wangeditor数据
 * @author: camellia
 * @email: guanchao_gc@qq.com
 * @date: 2021-01-19
 */
const getWangEditorValue = (str:string) => {
  data.comment_content = str;
}
</script>
