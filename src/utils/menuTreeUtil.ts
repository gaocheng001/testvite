function iNode() {

}

function TreeHandle(items) {
  const list = items as [...{ id: number, parentMenu: number }]
  const parentIds = []
  return {
    getTreeNodeAT(id) {
      for (const forestNode of list) {
        if (forestNode.id == id) {
          return forestNode;
        }
      }
      return null
    },
    addParentMenu(item) {
      parentIds.push(item)
    },
    getRoot() {
      const roots = []
      for (const forestNode of list) {
        if (forestNode.parentMenu == 0 || parentIds.indexOf(forestNode.parentMenu) != -1) {
          roots.push(forestNode);
        }
      }
      return roots;
    }
  }
}


export const itemsToTreeData = (items) => {
  const forestNodeManager = TreeHandle(items)
  items.forEach((forestNode) => {
    if (forestNode.parentMenu != 0) {
      const node = forestNodeManager.getTreeNodeAT(forestNode.parentMenu);
      if (node != null) {
        // debugger
        if(node.children==null){
          node.children=[]
        }
        // const index=items.indexOf(forestNode)
        node.children.push(forestNode);
      } else {
        forestNodeManager.addParentMenu(forestNode.id);
      }
    }
  });
  return forestNodeManager.getRoot()
}

