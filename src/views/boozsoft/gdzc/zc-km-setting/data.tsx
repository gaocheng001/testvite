import { TreeItem } from '/@/components/Tree/index'

export const keMuTreeData: TreeItem[] = [
  {
    title: '01 销售',
    key: '0-0',
    slots: {
      icon: 'smile',
    },
  },
  {
    title: '02 采购',
    key: '1-1',
    slots: {
      icon: 'smile',
    },
  },
  {
    title: '03 存货核算',
    key: '2-2',
    slots: {
      icon: 'smile',
    },
    /*children: [
      { title: 'leaf', key: '2-2-0',slots: {
          icon: 'smile',
        },},
      { title: 'leaf', key: '2-2-1',slots: {
          icon: 'smile',
        }, }
    ]*/
  }
]
