<template>
  <BasicModal
    destroyOnClose
    title="仓库级别档案"
    v-bind="$attrs"
    width="800px"
    @cancel="handleClose()"
    @ok="handleOk()"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <ul>
      <li> <AccountPicker theme="three" @reloadTable="dynamicAdReload" /><br /> </li>
      <li style="margin-left: 5px">
        <span>仓库信息：</span>
        <a-select v-model:value="cangkuValue" style="width: 600px" @change="scangkuChange">
          <a-select-option v-for="d in cangkuList" :value="d.id+'##'+d.ckNum">
            {{ d.ckNum }}-{{ d.ckName }}
          </a-select-option>
        </a-select>
      </li>
      <li style="margin-left: 5px" v-for="a in cangkuLevelList">
        <br />
        <span>{{ a.title }}：</span>
        <a-select
          v-model:value="a.value"
          style="width: 600px"
          @change="select123(a.levelOrder, a.value)"
        >
          <a-select-option v-for="d in a.list" :value="d.value">
            {{ d.title }}
          </a-select-option>
        </a-select>
      </li>
    </ul>

    <a-modal
      v-model:visible="visibleModel"
      title="初始化默认数据"
      @ok="modelOk"
      @cancel="handleClose"
      okText="确定"
      cancelText="关闭"
    >
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;默认
      <a-input-number
        v-model:value="visibleValue"
        :min="10"
        :max="10"
        style="width: 100px"
      />条数据(最大10条) <br /><br />
    </a-modal>
  </BasicModal>
</template>

<script lang="ts" setup="props, { content }">
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  DatePicker as ADatePicker,
  InputNumber as AInputNumber,
  Modal as AModal,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs,
} from 'ant-design-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from '/@/router';
import {useRouteApi} from '/@/utils/boozsoft/datasource/datasourceUtil';
import {getCurrentAccountName} from '/@/api/task-api/tast-bus-api';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-DATA.vue";
import {useMessage} from '/@/hooks/web/useMessage';
import {findAll as cangkuFindAll} from '/@/api/record/stock/stock-cangku';
import {
  findByIdLevel as cangkuLevelfindById,
  findByOneLevel,
} from '/@/api/record/stock/stock-cangku-level';
import {
  findAllByCangkuIdAndCangkuLevelIdAndCangkuLevelOrder,
  findAllByParentId,
  findByStockRecordId,
  saveRecord,
} from '/@/api/record/stock/stock-cangku-level-record';
/******************* 弹框加载中 **************************/
import {Loading} from '/@/components/Loading';
import {findDataBase} from '/@/api/record/system/account';

const { closeCurrent } = useTabs(router);
  const ARangePicker = ADatePicker.RangePicker;
  const ASelectOption = ASelect.Option;
  const ARadioGroup = ARadio.Group;
  const ARadioButton = ARadio.Button;
  const ATabPane = ATabs.TabPane;
  const emit = defineEmits([]);

  const visibleModel: any = ref(false);
  const visibleValue: any = ref(10);

  const cangkuLevelId: any = ref('');
  const cangkuLevelOrder: any = ref('');
  const cangkuLevelName: any = ref('');
  const parentId: any = ref('0');

  const cangkuValue: any = ref('');
  const cangkuList: any = ref([]);
  const cangkuLevelList: any = ref([]);

  const database = ref(getCurrentAccountName(false));
  const databaseTrue = ref(getCurrentAccountName(true));
  const { createConfirm, createWarningModal, createMessage } = useMessage();
  const [register, { closeModal, setModalProps }] = useModalInner((data) => {
    setModalProps({ minHeight: 400 });
    visibleModel.value=false
    cangkuValue.value=''
    cangkuLevelList.value=[]
  });

const loadingRef = ref(false);
  const compState = reactive({
    absolute: false,
    loading: false,
    tip: '加载中...',
  });
  function openCompFullLoading() {
    openLoading(false);
  }
  function openLoading(absolute: boolean) {
    compState.absolute = absolute;
    compState.loading = true;
  }
  /*******************END**************************/

  // 仓库信息触发
  async function scangkuChange() {
    cangkuLevelList.value = [];
    let ckId=cangkuValue.value.split('##')[0]
    let temp = cangkuList.value.filter((v) => v.id === ckId);
    // 仓库级次
    let item = await cangkuLevelfindById(temp[0].ckLevel);
    let lastName = item[item.length - 1].level; // 末级
    // 仓库信息
    let ckObj=cangkuList.value.filter(v=>v.id===ckId)

    for (let i = 0; i < item.length; i++) {
      cangkuLevelId.value = item[i].id;
      cangkuLevelOrder.value = item[i].levelOrder;
      cangkuLevelName.value = item[i].level;

      cangkuLevelList.value.push({
        title: item[i].level,
        value: '全部',
        ckNum:ckObj[0].ckNum,
        ckName:ckObj[0].ckName,
        cangkuId: ckId,
        levelId: item[i].id,
        levelOrder: item[i].levelOrder,
        list: [{ title: '全部', value: '全部' }],
      });

      // 一级一级显示
      let test: any = await useRouteApi(findAllByCangkuIdAndCangkuLevelIdAndCangkuLevelOrder, {
        schemaName: databaseTrue,
      })({
        cangkuId: ckId,
        cangkuLevelId: item[i].id,
        levelOrder: item[i].levelOrder,
      });
      // 2级
      if (item[i].levelOrder == 2 && test.length == 0) {
        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[i].level + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      // 2级 初始化过了
      if (item[i].levelOrder == 2 && test.length > 0) {
        // 名称不等于末级名称
        if (lastName !== item[i].level) {
          let default1 = test[0].id;
          cangkuLevelList.value.forEach((v) => {
            v.value = default1;
            test.forEach((vv) => {
              v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
            });
          });
        }
      }

      if (i !== 0) {
        // 查询下级
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
          cangkuLevelList.value[i - 1].value,
        );
        if (test123.length > 0) {
          let default1 = test123[0].id;
          cangkuLevelList.value.forEach((v, index) => {
            if (index == i) {
              v.value = default1;
              test123.forEach((vv) => {
                v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
              });
            }
          });
        }
      }
      // 最后一个 永远是全部
      if (i + 1 === item.length) {
        let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
        if (lastObj.value !== '全部') {
          cangkuLevelList.value.forEach((v, index) => {
            if (index == i) {
              v.value = '全部';
              v.list = [{ title: '全部', value: '全部' }];
            }
          });
        }
      }
    }
  }

  async function select123(levelOrder, value) {
    if(value==='全部'){
      cangkuLevelList.value.splice(levelOrder-1,cangkuLevelList.value.length)
    }else{
      // 2级触发
      if (levelOrder === 2) {
        if(cangkuLevelList.value.length==1){scangkuChange()}

        // 查找下级
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(value);
        if (test123.length > 0) {
          let default1 = test123[0].id;
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = default1;
              test123.forEach((vv) => {
                v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
              });
            }
          });
        } else {
          cangkuLevelList.value.forEach((v, index) => {
            if (index !== 0) {
              v.value = '全部';
              v.list = [{ title: '全部', value: '全部' }];
            }
          });
        }
      }
      // 3级触发
      if (levelOrder === 3) {
        let ckId=cangkuValue.value.split('##')[0]
        let temp = cangkuList.value.filter((v) => v.id === ckId);
        // 仓库级次
        let item = await cangkuLevelfindById(temp[0].ckLevel);
        for (let i = cangkuLevelList.value.length; i < item.length; i++) {
          cangkuLevelId.value = item[i].id;
          cangkuLevelOrder.value = item[i].levelOrder;
          cangkuLevelName.value = item[i].level;

          cangkuLevelList.value.push({
            title: item[i].level,
            value: '全部',
            cangkuId: ckId,
            levelId: item[i].id,
            levelOrder: item[i].levelOrder,
            list: [{ title: '全部', value: '全部' }],
          });


          if (i !== 0) {
            setTimeout(async ()=>{
              // 查询下级
              let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
                cangkuLevelList.value[i - 1].value,
              );
              if (test123.length > 0) {
                let default1 = test123[0].id;
                cangkuLevelList.value.forEach((v, index) => {
                  if (index == i) {
                    v.value = default1;
                    test123.forEach((vv) => {
                      v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
                    });
                  }
                });
              }
            },200)
          }
          // 最后一个 永远是全部
          if (i + 1 === item.length) {
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == i) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        }

        // 查找下级
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(value);
        if (test123.length > 0) {
          let default1 = test123[0].id;
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = default1;
              test123.forEach((vv) => {
                v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
              });
            }
          });
          // 4级
          if (cangkuLevelList.value.length == 3) {
            // 最后一个
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == levelOrder - 1) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        } else {
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = '全部';
              v.list = [{ title: '全部', value: '全部' }];
            }else if(index >= levelOrder){
              cangkuLevelList.value.splice(index)
            }
          });
        }
      }
      // 4级触发
      if (levelOrder === 4) {

        let ckId=cangkuValue.value.split('##')[0]
        let temp = cangkuList.value.filter((v) => v.id === ckId);
        // 仓库级次
        let item = await cangkuLevelfindById(temp[0].ckLevel);
        for (let i = cangkuLevelList.value.length; i < item.length; i++) {
          cangkuLevelId.value = item[i].id;
          cangkuLevelOrder.value = item[i].levelOrder;
          cangkuLevelName.value = item[i].level;

          cangkuLevelList.value.push({
            title: item[i].level,
            value: '全部',
            cangkuId: ckId,
            levelId: item[i].id,
            levelOrder: item[i].levelOrder,
            list: [{ title: '全部', value: '全部' }],
          });

          if (i !== 0) {
            setTimeout(async ()=>{
              // 查询下级
              let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
                cangkuLevelList.value[i - 1].value,
              );
              if (test123.length > 0) {
                let default1 = test123[0].id;
                cangkuLevelList.value.forEach((v, index) => {
                  if (index == i) {
                    v.value = default1;
                    test123.forEach((vv) => {
                      v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
                    });
                  }
                });
              }
            },200)
          }
          // 最后一个 永远是全部
          if (i + 1 === item.length) {
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == i) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        }

        // 查找下级
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(value);
        if (test123.length > 0) {
          let default1 = test123[0].id;
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = default1;
              test123.forEach((vv) => {
                v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
              });
            }
          });
          // 5级
          if (cangkuLevelList.value.length == 4) {
            // 最后一个
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == levelOrder - 1) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        } else {
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = '全部';
              v.list = [{ title: '全部', value: '全部' }];
            }else if(index >= levelOrder){
              cangkuLevelList.value.splice(index)
            }
          });
        }
      }
      // 5级触发
      if (levelOrder === 5) {

        let ckId=cangkuValue.value.split('##')[0]
        let temp = cangkuList.value.filter((v) => v.id === ckId);
        // 仓库级次
        let item = await cangkuLevelfindById(temp[0].ckLevel);
        for (let i = cangkuLevelList.value.length; i < item.length; i++) {
          cangkuLevelId.value = item[i].id;
          cangkuLevelOrder.value = item[i].levelOrder;
          cangkuLevelName.value = item[i].level;

          cangkuLevelList.value.push({
            title: item[i].level,
            value: '全部',
            cangkuId: ckId,
            levelId: item[i].id,
            levelOrder: item[i].levelOrder,
            list: [{ title: '全部', value: '全部' }],
          });

          if (i !== 0) {
            setTimeout(async ()=>{
              // 查询下级
              let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
                cangkuLevelList.value[i - 1].value,
              );
              if (test123.length > 0) {
                let default1 = test123[0].id;
                cangkuLevelList.value.forEach((v, index) => {
                  if (index == i) {
                    v.value = default1;
                    test123.forEach((vv) => {
                      v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
                    });
                  }
                });
              }
            },200)
          }
          // 最后一个 永远是全部
          if (i + 1 === item.length) {
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == i) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        }

        // 查找下级
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(value);
        if (test123.length > 0) {
          let default1 = test123[0].id;
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = default1;
              test123.forEach((vv) => {
                v.list.push({ title: vv.parentLevelNum + '-' + vv.recordName, value: vv.id,num:vv.sysNum,name:vv.recordName,parentLevelNum:vv.parentLevelNum});
              });
            }
          });
          // 6级
          if (cangkuLevelList.value.length == 5) {
            // 最后一个
            let lastObj = cangkuLevelList.value[cangkuLevelList.value.length - 1];
            if (lastObj.value !== '全部') {
              cangkuLevelList.value.forEach((v, index) => {
                if (index == levelOrder - 1) {
                  v.value = '全部';
                  v.list = [{ title: '全部', value: '全部' }];
                }
              });
            }
          }
        } else {
          cangkuLevelList.value.forEach((v, index) => {
            if (index == levelOrder - 1) {
              v.value = '全部';
              v.list = [{ title: '全部', value: '全部' }];
            }else if(index >= levelOrder){
              cangkuLevelList.value.splice(index)
            }
          });
        }
      }
    }
  }

  async function handleOk() {
    let item = cangkuLevelList.value;

    // 2级
    if (item.length == 1) {  emit('save', item);closeModal();return }
    // 3级
    if (item.length == 2) {
      parentId.value = item[0].value;
      if (item[1].value === '全部') {
        let test = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
          item[0].value,
        );
        if (test.length == 0) {
          // item[1].title  数组中最后一个
          cangkuLevelName.value = item[1].title;
          createConfirm({
            iconType: 'warning',
            title: '提示',
            content: '是否初始化' + item[1].title + ',默认数据!',
            onOk: async () => {
              visibleModel.value = true;
            },
            onCancel: async () => {
              await handleClose();
            },
          });
          return;
        }
      }
    }
    // 4级
    if (item.length == 3) {
      // 3级没有初始化数据
      if (item[1].value === '全部') {
        parentId.value = item[0].value;
        cangkuLevelName.value = item[1].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[1].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      // 值判断末级有无初始化数据
      if (item[2].value === '全部') {
        parentId.value = item[1].value;
        cangkuLevelName.value = item[2].title;

        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
          parentId.value,
        );
        if(test123.length==0){
          createConfirm({
            iconType: 'warning',
            title: '提示',
            content: '是否初始化' + item[2].title + ',默认数据!',
            onOk: async () => {
              visibleModel.value = true;
            },
            onCancel: async () => {
              await handleClose();
            },
          });
          return;
        }
      }

    }
    // 5级
    if (item.length == 4) {
      // 没有初始化数据
      if (item[1].value === '全部') {
        parentId.value = item[0].value;
        cangkuLevelName.value = item[1].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[1].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      if (item[2].value === '全部') {
        parentId.value = item[1].value;
        cangkuLevelName.value = item[2].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[2].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      if (item[3].value === '全部') {
        parentId.value = item[2].value;
        cangkuLevelName.value = item[3].title;

        // 查询上级是否已经初始化数据  仓库ID、级别级次、上级ID
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
          parentId.value,
        );
        if (test123.length == 0) {
          createConfirm({
            iconType: 'warning',
            title: '提示',
            content: '是否初始化' + item[3].title + ',默认数据!',
            onOk: async () => {
              visibleModel.value = true;
            },
            onCancel: async () => {
              await handleClose();
            },
          });
          return;
        }
      }
    }
    // 6级
    if (item.length == 5) {
      // 没有初始化数据
      if (item[1].value === '全部') {
        parentId.value = item[0].value;
        cangkuLevelName.value = item[1].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[1].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      if (item[2].value === '全部') {
        parentId.value = item[1].value;
        cangkuLevelName.value = item[2].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[2].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      if (item[3].value === '全部') {
        parentId.value = item[2].value;
        cangkuLevelName.value = item[3].title;

        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '是否初始化' + item[3].title + ',默认数据!',
          onOk: async () => {
            visibleModel.value = true;
          },
          onCancel: async () => {
            await handleClose();
          },
        });
        return;
      }
      if (item[4].value === '全部') {
        parentId.value = item[3].value;
        cangkuLevelName.value = item[4].title;

        // 查询上级是否已经初始化数据  仓库ID、级别级次、上级ID
        let test123 = await useRouteApi(findAllByParentId, { schemaName: databaseTrue })(
          parentId.value,
        );
        if (test123.length === 0) {
          createConfirm({
            iconType: 'warning',
            title: '提示',
            content: '是否初始化' + item[4].title + ',默认数据!',
            onOk: async () => {
              visibleModel.value = true;
            },
            onCancel: async () => {
              await handleClose();
            },
          });
          return;
        }
      }
    }

    emit('save', unref(cangkuLevelList.value));
    closeModal();
  }

  async function modelOk() {
    let item = cangkuLevelList.value;
    // 2
    if(item.length==1){
      cangkuLevelOrder.value='2'
    }else if(item.length==2){   // 3
      if(item[1].value==='全部'){
        cangkuLevelOrder.value='3'
      }
    }else if(item.length==3){   // 4
      if(item[1].value==='全部'){
        cangkuLevelOrder.value='3'
      }else if(item[2].value==='全部'){
        cangkuLevelOrder.value='4'
      }
    }else if(item.length==4){   // 5
      if(item[1].value==='全部'){
        cangkuLevelOrder.value='3'
      }else if(item[2].value==='全部'){
        cangkuLevelOrder.value='4'
      }else if(item[3].value==='全部'){
        cangkuLevelOrder.value='5'
      }
    }else if(item.length==5){   // 6
      if(item[1].value==='全部'){
        cangkuLevelOrder.value='3'
      }else if(item[2].value==='全部'){
        cangkuLevelOrder.value='4'
      }else if(item[3].value==='全部'){
        cangkuLevelOrder.value='5'
      }else if(item[4].value==='全部'){
        cangkuLevelOrder.value='6'
      }
    }

    let list: any = [];
    // 2级
    if(cangkuLevelList.value.length==1){
      for (let i = 0; i < visibleValue.value; i++) {
        list.push({
          accId: databaseTrue.value,
          cangkuId: cangkuValue.value.split('##')[0],
          cangkuLevelId: cangkuLevelId.value,
          cangkuLevelOrder: cangkuLevelOrder.value,
          sysNum: i + 1,
          recordName: cangkuLevelName.value+(i + 1),
          recordDefault: '0',
          recordFlag: '1',
          parentId: parentId.value,
          recordBend: parentId.value!=='0'?'1':'0',
          parentLevelNum: cangkuValue.value.split('##')[1]+'-'+(i+1),
        });
      }
    }
    // 其他级次
    else{
      // 查找上级信息，获取递归级次编码
      let findByid = await useRouteApi(findByStockRecordId, { schemaName: databaseTrue })(parentId.value);
      for (let i = 0; i < visibleValue.value; i++) {
        list.push({
          accId: databaseTrue.value,
          cangkuId: cangkuValue.value.split('##')[0],
          cangkuLevelId: cangkuLevelId.value,
          cangkuLevelOrder: cangkuLevelOrder.value,
          sysNum: i + 1,
          recordName: cangkuLevelName.value+(i + 1),
          recordDefault: '0',
          recordFlag: '1',
          recordBend: parentId.value!=='0'?'1':'0',
          parentId: parentId.value,
          parentLevelNum: findByid.parentLevelNum+'-'+(i + 1),
        });
      }
    }
    await useRouteApi(saveRecord, { schemaName: databaseTrue })(unref(list)).then((a) => {
      createConfirm({
        iconType: 'warning',
        title: '提示',
        content: '初始化数据完成,请重新查询！',
        onOk: async () => {
          await handleClose();
        },
        onCancel: async () => {
          await handleClose();
        },
      });
    });
  }

  async function handleClose() {
    closeModal();
    // await closeCurrent();
    // router.push('/one/home/welcome');
    // return true;
  }
  async function dynamicAdReload(data) {
    await findDataBase(data.accId, +data.year).then((item) => {
      database.value = item.accountId;
      databaseTrue.value = item.accountMode;
    });
    // 仓库信息
    let map = {
      page: 1,
      size: null,
      searchConditon: {
        requirement: '',
        value: '',
      },
    };
    let temp = await useRouteApi(cangkuFindAll, { schemaName: databaseTrue })(map);
    console.log(temp)
    // 查询一级
    let oneLevel = await findByOneLevel();
    cangkuList.value = temp.items.filter(
      (v) => v.ckLevel !== null && v.ckLevel !== '' && v.ckLevel !== oneLevel.id,
    );
  }
</script>
