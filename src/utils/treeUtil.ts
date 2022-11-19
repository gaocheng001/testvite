function iNode() {

}

function TreeHandle(items) {
  const list = items as [...{ id: number, parentId: number }]
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
    addParentId(item) {
      parentIds.push(item)
    },
    getRoot() {
      const roots = []
      for (const forestNode of list) {
        if (forestNode.parentId == 0 || parentIds.indexOf(forestNode.parentId) != -1) {
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
    if (forestNode.parentId != 0) {
      const node = forestNodeManager.getTreeNodeAT(forestNode.parentId);
      if (node != null) {
        // debugger
        if(node.children==null){
          node.children=[]
        }
        // const index=items.indexOf(forestNode)
        node.children.push(forestNode);
      } else {
        forestNodeManager.addParentId(forestNode.id);
      }
    }
  });
  return forestNodeManager.getRoot()
}

