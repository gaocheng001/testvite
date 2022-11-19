import router from '/@/router';
import {defineStore} from 'pinia'
import {store} from '/@/store'
import {computed} from "vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

export const useBoozSoftStore = defineStore({
  id: 'useBoozSoftStore',
  state: (): any => ({
    /**
     * 用户信息
     */
    userInfo:computed(()=>useUserStoreWidthOut().getUserInfo),
    /**
     * 账套信息
     */
    currentDataPicker:null,
    accountSettingInfo:computed(()=>useCompanyOperateStoreWidthOut().getCurrentAccountSettingInfo),

    dataInfo:{
      '基础信息':[
        // basisMap
        { name:'会计准则',label:'accStandard'},
        { name:'科目级次',label:'ccodeLevel',option:'4-2-2-2-'},
        { name:'本位币',label:'currency'},                           // 4 可以用的上
        { name:'纳税性质',label:''},
      ],
      '制单控制':[
        // zhiDanList
        { name:'制单序时控制',label:''},    // 1 凭证日期>=最后一张凭证编号,编号>最后一张凭证编号
        { name:'资金及往来赤字控制',label:''}, // 1,提示或禁止,后台查询本期..负数..
        { name:'现金流量必录',label:''},    // 1
        { name:'结算方式必录',label:''},  // 1
        { name:'往来单位票据号必录',label:''},   // 1 单据保存时检查,银行科目,票据号必录
        { name:'可以使用应收受控科目',label:''},   // 1 是否受控,不显示某几个科目
        { name:'可以使用应付受控科目',label:''},  // 1是否受控,不显示某几个科目
        { name:'单价允许为空',label:''},        // 单价允许为空
        { name:'数量为零允许保存',label:''},    // 数量
        { name:'借贷不平保存为暂存凭证',label:''}, // 2 不要
        { name:'外币汇率为空允许保存',label:''},  // 2
        { name:'允许跨公司制单',label:''},
      ],
      '凭证编号':[
        // pingZhenNumberList
        { name:'凭证自动补断号',label:''},   // 1 不允许修改凭证编号
        { name:'手工编码',label:''},      // 1 允许修改凭证编号,也可以自动编码
        { name:'凭证号按月份统一编号排序',label:''}, // 1
        { name:'凭证号按年度统一编号排序',label:''}, // 1
      ],
      '凭证控制':[        // 2 填制凭证没关系
        // pingZhenControlList
        { name:'制单与审核允许同一人',label:''},    // 1 审核,判断是否可以与制单同一人
        { name:'审核与取消审核须为同一人',label:''},
        { name:'出纳签字取消须为同一人',label:''},
        { name:'主管签字取消须为同一人',label:''},
        { name:'出纳凭证必须出纳签字',label:''},
        { name:'凭证必须经由主管签字',label:''},
        { name:'凭证必须审核后记账',label:''},
        { name:'允许修改业务系统凭证',label:''},  // 3 待做 查看页是否可以修改
      ],
      '系统设置':[
        // settingList
        // 0: "ibook"
        // 1: "icheckOut"
        { name:'允许删除作废凭证',label:''},    // 3 待做 查看凭证,不能删除作废..
        { name:'允许取消结账',label:''},       // 3 待做 查看凭证,不能删除作废..
        { name:'按凭证类别控制操作',label:''},  // 去凭证类别找授权表,没控制不找授权表
        { name:'按会计科目范围控制操作',label:''}, // 按照科目范围找科目,没控制不找范围
      ],
      '日期控制':[ //默认按业务日期,制单日期永远(系统日期:服务器日期
        // dateMap
        { name:'新增凭证日期规则',label:'',option:['业务日期 系统日期 手动添加']},    // 系统日期:服务器端日期  ,手动添加 2 先不用
        { name:'出纳签字日期规则',label:'',option:['业务日期 系统日期']},
        { name:'审核凭证日期规则',label:'',option:['业务日期 系统日期']},
        { name:'主管签字日期规则',label:'',option:['业务日期 系统日期']},
        { name:'凭证记账日期规则',label:'',option:['业务日期 系统日期']},
        { name:'往来核销日期规则',label:'',option:['业务日期 系统日期']},
      ]
    }
    // console.log(AppProviderLang.value.getAccountSettingInfo)
    // console.warn(sdsa)

  }),
  getters: {
    getUserInfo(){
      return this.userInfo;
    },
    getAccountSettingInfo(){
      return this.accountSettingInfo
    },
    getCurrentDataPicker(){
      return this.currentDataPicker;
    }
  },
  actions: {
    setCurrentDataPicker(currentDataPicker){
      this.currentDataPicker=currentDataPicker
    }
  }
})

// Need to be used outside the setup
export function useBoozSoftStoreWidthOut() {
  return useBoozSoftStore(store)
}
