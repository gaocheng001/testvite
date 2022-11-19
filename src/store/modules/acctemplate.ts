import { defineStore } from 'pinia'
import { store } from '/@/store'

export const useAccvoucherTemplateStore = defineStore({
  id: 'acctemplate',
  state: (): any => ({
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        defaultHidden: true,
        ellipsis: true
      },
      {
        title: '科目模板名称',
        dataIndex: 'tname',
        ellipsis: true,
        slots: { customRender: 'Atname' }
      },
      {
        title: '科目级次',
        dataIndex: 'tjici',
        ellipsis: true
      },
      {
        title: '科目类型',
        dataIndex: 'styleName',
        ellipsis: true
      },
      {
        title: '类别',
        dataIndex: 'ttype',
        ellipsis: true
      }
    ]
  }),
  getters: {
    getColumns():any {
      return this.columns
    }
  }
})

// Need to be used outside the setup
export function useAccvoucherTemplateStoreWidthOut() {
  return useAccvoucherTemplateStore(store)
}
