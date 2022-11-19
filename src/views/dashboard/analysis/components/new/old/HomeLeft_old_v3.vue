<template>
  <div style="  background-color: #b4c8e3;">
    <div class="nc-hl-top">
      <div class="nc-hlt-div">
        <div class="nc-hltd-top">
          <span>功能模块</span><br/>
          <span>工作台</span>
          <span>working platform</span>
        </div>
        <div class="nc-hltd-bottom">
          <div class="bottom-div-one">
            <div class="bottom-top">
              <span>{{ nameAndRole.realName }}</span><br/>
            </div>
            <div class="bottom-left">
              <img src="/img/nc/53.png" style="height: 40px;width: 40px;" draggable="false"/>
            </div>
            <div class="bottom-center">
              <span>{{ nameAndRole.roleName }}</span><br/>
              <span :title="nameAndRole.mail">{{
                  nameAndRole.mail == null ? '' : nameAndRole.mail.length > 18 ? `${nameAndRole.mail.substring(0, 18)}...` : nameAndRole.mail
                }}</span>
            </div>
            <div class="bottom-right">
              <span @click="openWindow(1)">设置</span><br/>
              <Button @click="openWindow(1)" size="small"
                      style="color: white;background-color: orange">
                <RightOutlined/>
              </Button>
            </div>
          </div>
          <div class="bottom-div-two">
            <Popover v-model:visible="visible" placement="bottomLeft" trigger="contextmenu">
              <InputSearch placeholder="快速菜单搜索" enter-button @search="onSearch"/>
              <template #content>
                <SearchMenuView @jump="toPage" :data="dataList"/>
              </template>
            </Popover>
          </div>
          <div class="bottom-div-three">
            <span>最新操作记录:</span>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="nc-hl-middle">
      <Calendar v-model:value="currentDate" :locale="localeCn" :fullscreen="false"
                @panelChange="onPanelChange">
        <template #headerRender="{ value: current, type, onChange, onTypeChange }">
          <div style="padding: 5px 10px;text-align: center;">
            <div
              style="width: 100%;height: 50px;background-color: #2b4bcb;border-radius: 4px;color: white;font-weight: bold;margin-bottom: 5px">
              <span style="font-size: 16px;">会计日历</span><br/>
              <span>{{
                  `${current.month() + 1}月${current.date()}日  星期${['日', '一', '二', '三', '四', '五', '六'][current.day()]}`
                }}</span>
            </div>
            <LeftOutlined @click="onChange(current.month(parseInt(current.month()-1, 10)))"/>
            <Select
              size="small"
              style="margin-left: 1em;"
              :bordered="false"
              :dropdown-match-select-width="false"
              :value="String(current.year())"
              @change="
                  newYear => {
                    onChange(current.year(newYear));
                  }
                "
            >
              <template #suffixIcon></template>
              <SelectOption
                v-for="val in getYears(current)"
                :key="String(val)"
                class="year-item"
              >
                {{ val }}年
              </SelectOption>
            </Select>
            <Select
              size="small"
              style="margin-right: 1em;"
              :bordered="false"
              :dropdown-match-select-width="false"
              :value="String(current.month())"
              @change="
                  selectedMonth => {
                    onChange(current.month(parseInt(selectedMonth, 10)));
                  }
                "
            >
              <template #suffixIcon></template>
              <SelectOption
                v-for="(val, index) in getMonths(current)"
                :key="String(index)"
                class="month-item"
              >
                {{ val }}
              </SelectOption>
            </Select>
            <RightOutlined @click="onChange(current.month(parseInt(current.month()+1, 10)))"/>
          </div>
        </template>
      </Calendar>
    </div>
    <!--    <div class="nc-hl-bottom">
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
        </div>-->
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
  ManOutlined, RightOutlined, LeftOutlined,
} from '@ant-design/icons-vue';
import {Button, Input, Calendar, Select, Popover, message} from "ant-design-vue";

const InputSearch = Input.Search;
const SelectOption = Select.Option;
import {onMounted, provide, reactive, ref} from "vue";
import moment from 'moment';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
import SearchMenuView
  from "/@/views/dashboard/analysis/components/new/etc-components/SearchMenuView.vue";
/*日期框中午单独*/
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findAllIndex} from "/@/api/record/message/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import router from "/@/router";
import {findAllIndex as findAllIndexTask} from "/@/api/record/sys-task/data";

const props = defineProps(['modelValue'])
const nameAndRole = ref({realName: '张会计', roleName: '会计', mail: '123@qq.com'})
provide('nameAndRole', nameAndRole)
const messagelist = ref([])
const taskList = ref([])
const currentDate = ref<Dayjs>();
const mark = usePlatformsStore().getCurrentPlatformId
const thePlatformList = ref([])
onMounted(async () => {
  //查询我的消息

  /*const data = await findAllIndex({
    user: useUserStoreWidthOut().getUserInfo.id
  })
  messagelist.value = (data.filter(item => item.ifrag == '0')).slice(-2)
  const data1 = await findAllIndexTask({
    user: useUserStoreWidthOut().getUserInfo.id
  })
  taskList.value = (data1.filter(item => item.ifrag == '0')).slice(-2)*/
  thePlatformList.value = (await getAllPlatform() || []).filter(it => it.platformId == mark && ['根目录', '首页', '工作台'].indexOf(it.name) == -1)
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
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {getAllPlatform} from "/@/api/sys/menu";

const [registerHomeWindowPage, {openModal: openHomeWindowFun}] = useModal()
const openWindow = (index) => {
  openHomeWindowFun(true, {index: index})
}
const onPanelChange = (value, mode: string) => {
  console.log(value, mode);
};
const getMonths = (value: Dayjs) => {
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(localeData.monthsShort(value.month(i)));
  }
  return months;
};

const getYears = (value: Dayjs) => {
  const year = value.year();
  const years = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    years.push(i);
  }
  return years;
};

// 主页搜索
const visible = ref(false)

const dataList = ref([{id: '1', code: '001', name: '中国组'},
  {id: '2', code: '002', name: '美国组'},
  {id: '3', code: '003', name: '英国组'},
  {id: '4', code: '004', name: '法国组'},
  {id: '5', code: '005', name: '俄罗斯组'},
])
const onSearch = async (v) => {
  if (hasBlank(v)) {
    message.info('输入内容不能为空白！')
  } else {
    let res = queryMenuByCondition(v)
    if (null == res || res.length == 0) {
      message.info(`暂未发现与之相关菜单！`)
      dataList.value = []
    } else if (res.length > 1) {
      visible.value = true
      dataList.value = res.map(it => ({id: it.id, name: it.name}))
    } else {
      toPage(res[0].id)
    }
  }
}

function getRouterPath(id) {
  let m = thePlatformList.value.filter(it => it.id == id)[0]
  if (m.parentId == 0) {
    return m.path;
  } else {
    return getRouterPath(m.parentId) + '/' + m.path;
  }
}

const queryMenuByCondition = (v) => {
  return thePlatformList.value.filter(it => (it.component || '').toUpperCase() != 'LAYOUT' && it.name.indexOf(v) != -1)
}

const toPage = async (e) => {
  visible.value = false
  let path = getRouterPath(e)
  if (!hasBlank(path)) router.push({path: path});
}
</script>
<style lang="less" scoped>
.nc-hl-top {
  height: 355px;
  padding: 0 2% 0;

  .nc-hlt-div {
    border-radius: 2px;
    height: 100%;
    width: auto;
    background-color: white;

    .nc-hltd-top {
      height: 140px;
      width: auto;
      background-color: #2b4bcb;
      color: white;
      font-weight: bold;
      padding: 5px;

      > span:nth-of-type(2) {
        display: block;
        font-size: 30px;
        display: block;
        font-size: 30px;
        margin: 2% 30%;
      }

      > span:nth-of-type(3) {
        margin: 0 25%;
      }
    }

    .nc-hltd-bottom {
      height: 150px;
      width: auto;
      position: relative;

      .bottom-div-one {
        position: absolute;
        background-color: white;
        height: 110px;
        top: -20px;
        margin: 0 5%;
        width: 90%;
        box-shadow: 0px 0px 5px 2px #afafb0;
        border-radius: 5px;

        .bottom-top {
          height: 50px;
          line-height: 50px;

          > span {
            font-size: 16px;
            font-weight: bold;
            color: black;
            margin: 0 10%;
          }
        }

        .bottom-left {
          display: inline-block;
          width: 52px;
          height: 42px;
          padding: 2%;
        }

        .bottom-center {
          display: inline-block;
          width: calc(100% - 52px - 40px);

          > span {
            color: #757575;
          }

          span:nth-of-type(1) {
            font-size: 14px;
            font-weight: bold;
          }

          span:nth-of-type(2) {
            font-size: 12px;
          }
        }

        .bottom-right {
          display: inline-block;
          padding: 0% 2%;
          width: 40px;

          > span {
            font-weight: bold;
            color: #1e9378;
            cursor: pointer;
          }

          > span:hover {
            color: #00bb00;
          }
        }
      }

      .bottom-div-two {
        position: absolute;
        top: 100px;
        width: 90%;
        margin: 0 5%;
        box-shadow: 0px 0px 5px 2px #afafb0;
        border-radius: 5px;

        :deep(.ant-input-search) {
          .ant-input::placeholder {
            color: black;
            font-weight: bold;
          }

          .ant-btn {
            background-color: orange;
            border-color: orange;
          }
        }
      }

      .bottom-div-three {
        position: absolute;
        top: 140px;
        width: 96%;
        margin: 0 2%;
        border-radius: 5px;
        height: 66px;
        box-shadow: 0px 0px 5px 2px #afafb0;
        padding: 5px;
        font-weight: bold;
        color: #757575;

        > span {
          font-size: 12px;
        }
      }
    }
  }
}

.nc-hl-middle {
  margin: 2%;
  background-color: white;
  border-radius: 2px;
  position: relative;
  pointer-events: none;
}

.nc-hl-middle:after { // 遮住不让点击
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  background: transparent;
}

.nc-hl-bottom {
  height: cala(100% - 355px -200px);

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
