export  function useNcModals() {
  return window?.$wujie.props.NcModals
  // function openDeptModal(){
  //   return new Promise((r, j) => {
  //     let isReturn = false
  //     let data = 0
  //     window?.$wujie.bus.$emit("openModal", function (id) {
  //       isReturn = true
  //       data = 111111
  //       return 'aabcc'
  //     });
  //     if (isReturn) {
  //       r(data)
  //     }
  //   })
  // }
  // return {
  //   openDeptModal
  // }

}
