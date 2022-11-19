import {usePlatformsStore} from "/@/store/modules/platforms";
import {useMultipleTabStore} from "/@/store/modules/multipleTab";
import {store as defaultStore} from '/@/store/index'
import {createPinia} from "pinia";
export function abcasdsadsa(){
  const platformStore=usePlatformsStore(defaultStore)

  const platformId=platformStore.getCurrentPlatformId
  const store=window.platformData.storeList.value.filter(item=>item.id==platformId)[0]?.store
  let  tabStore
  if(store){

    tabStore = useMultipleTabStore(store());
  }else{
    tabStore = useMultipleTabStore(createPinia());
  }
  return tabStore
}


export function getCurrentTabStore(){
  return abcasdsadsa()
}
