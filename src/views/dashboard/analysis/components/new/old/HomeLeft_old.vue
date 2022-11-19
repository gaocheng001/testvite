<template>
  <div style="  background-color: #b4c8e3;">
    <div class="nc-hl-top">
      <div class="nc-hlt-div">
        <div class="nc-hltd-top">
          <div class="top-left">
            <img src="/img/nc/53.png" style="height: 60px;width: 60px;" draggable="false"/>
          </div>
          <div class="top-right">
            <span>{{ nameAndRole.realName }}</span><br/>
            <span>{{ nameAndRole.roleName }}</span>
          </div>
        </div>
        <div class="nc-hltd-bottom">
          <ul>
            <li @click="openWindow(1)">
              <UserOutlined/>
              <span>个人参数</span></li>
            <li @click="openWindow(2)">
              <LockOutlined/>
              <span>修改密码</span></li>
            <li @click="openWindow(3)">
              <MobileOutlined/>
              <span>操作日志</span>
            </li>
            <!--            <li>
                          <DeleteOutlined/>
                          <span>清除缓存</span></li>-->
          </ul>
        </div>
      </div>
    </div>
    <div class="nc-hl-bottom">
      <div class="nc-hl-bottom-div">
        <div class="nc-hlb-title">
          <span>消息与通知</span>
          <span @click="goMessage">更多</span>
        </div>
        <div class="nc-hlb-content">
          <ul class="nc-hlbc-ul">
            <li class="nc-hlbc-li" v-for="item in messagelist" key="item.id">
              <ul>
                <li><p>{{ item.content }}</p></li>
                <li>
                  <FieldTimeOutlined/>
                  <span style="margin-left: 1em;">{{ formatTime(item.sendTime) }}</span> <span
                  style="float: right;margin-left: 1em;">{{ item.username }}</span>
                  <ManOutlined style="float: right"/>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="nc-hl-bottom-div">
        <div class="nc-hlb-title">
          <span>任务及协作</span>
          <span @click="goTask">更多</span>
        </div>
        <div class="nc-hlb-content">
          <ul class="nc-hlbc-ul">
            <li class="nc-hlbc-li" v-for="item in taskList" key="item.id">
              <ul>
                <li><p>{{ item.content }}</p></li>
                <li>
                  <FieldTimeOutlined/>
                  <span style="margin-left: 1em;">{{ formatTime(item.sendTime) }}</span> <span
                  style="float: right;margin-left: 1em;">{{ item.username }}</span>
                  <ManOutlined style="float: right"/>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <HomeWindow @register="registerHomeWindowPage"/>
  </div>
</template>
<script setup lang="ts">
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  ManOutlined
} from '@ant-design/icons-vue';
import {onMounted, provide, ref} from "vue";
import {findAllIndex} from "/@/api/record/message/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import router from "/@/router";
import moment from "moment";
import {findAllIndex as findAllIndexTask} from "/@/api/record/sys-task/data";
const props = defineProps(['modelValue'])
const nameAndRole = ref({realName: '会计', roleName: '无'})
provide('nameAndRole',nameAndRole)
const messagelist = ref([])
const taskList = ref([])
onMounted(async () => {
  //查询我的消息
  const data = await findAllIndex({
    user: useUserStoreWidthOut().getUserInfo.id
  })
  messagelist.value = (data.filter(item => item.ifrag == '0')).slice(-2)
  const data1 = await findAllIndexTask({
    user: useUserStoreWidthOut().getUserInfo.id
  })
  taskList.value = (data1.filter(item => item.ifrag == '0')).slice(-2)
})
const goMessage = () => {
  router.push('/zhongZhang/cashiers/ab-xjll/message-list');
}
const goTask = () => {
  router.push('/zhongZhang/cashiers/ab-xjll/task-list');
}
const formatTime = (val) => {
  return moment(val).format('YYYY-MM-DD')
}
/*信息弹框*/
import HomeWindow from "/@/views/dashboard/analysis/components/new/HomeWindow.vue";
import {useModal} from "/@/components/Modal";
import {findAllById} from "/@/api/caozuoyuan/caozuoyuan";
const [registerHomeWindowPage, {openModal: openHomeWindowFun}] = useModal()
const openWindow = (index) => {
  openHomeWindowFun(true, {index: index})
}
</script>
<style lang="less" scoped>
.nc-hl-top {
  height: 255px;
  padding: 0 2% 0;

  .nc-hlt-div {
    border-radius: 10px;
    height: 100%;
    width: auto;
    background-color: white;

    .nc-hltd-top {
      height: 100px;
      width: auto;

      .top-left {
        display: inline-block;
        width: 100px;
        height: 100px;
        padding: 8%;
      }

      .top-right {
        display: inline-block;
        float: right;
        height: 100px;
        width: calc(100% - 100px);
        text-align: left;
        padding: 10% 2%;

        span:nth-of-type(1) {
          font-size: 18px;
          font-weight: bold;
          color: black;
        }

        span:nth-of-type(2) {
          color: #757575;
        }
      }
    }

    .nc-hltd-bottom {
      height: 150px;
      width: auto;

      ul {
        li {
          line-height: calc(150px / 3);
          height: calc(150px / 3);
          font-size: 16px;
          color: #757575;
          text-align: center;
          border-bottom: 1px solid #d2cfcf;

          span:nth-of-type(1) {
            margin: 1em 0 1em 1em;
            float: left;
          }
        }

        li:nth-of-type(1) {
          border-top: 1px solid #d2cfcf;
        }

        li:nth-of-type(3) {
          border-bottom: none;
        }

        li:hover {
          background-color: #f1f1f1;
          border-left: 3px solid #035cc4;
          color: black;
          cursor: pointer;
        }
      }
    }
  }
}

.nc-hl-bottom {
  height: cala(100% - 255px);

  .nc-hl-bottom-div {
    margin-top: 5%;
    padding: 0 2%;

    .nc-hlb-title {
      height: 30px;
      line-height: 30px;
      width: auto;
      background-color: #1e9378;
      color: white;
      text-align: left;
      padding-left: 1em;
      font-size: 16px;
      position: relative;

      span:nth-of-type(2) {
        font-size: 12px;
        position: absolute;
        right: 5px;
      }

      span:nth-of-type(2):hover {
        cursor: pointer;
        color: black;
      }
    }

    .nc-hlb-content {
      .nc-hlbc-ul {
        margin-bottom: 0.2%;
        background-color: #f1f1f1;

        .nc-hlbc-li {
          height: 70px;
          width: auto;
          margin: 2px 0;
          border-left: 3px solid green;

          ul {
            background-color: white;

            li {
              width: auto;
              font-size: 12px;
              padding: 8px 5px;
            }

            li:nth-of-type(1) {
              height: 50px;

              p {
                text-indent: 2em;
                height: 35px;
                overflow-y: hidden; /*超出部分隐藏*/
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }

            li:nth-of-type(2) {
              padding: 0 5px;
              height: 20px;
              color: slategrey;
            }
          }
        }

        .nc-hlbc-li:hover {
          border-left-color: orange;
          cursor: pointer;
        }
      }
    }
  }
}

</style>
