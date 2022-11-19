import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";

function getAcountPickerInfoKey(currentPlatformId) {
  return currentPlatformId + '-accountPickerInfo'
}

function getGlobalAcountPickerInfoKey() {
  return 'global-accountPickerInfo'
}

export function useAccountPickerCache() {
  return {
    get() {
      const currentPlatform = usePlatformsStoreWidthOut().getCurrentPlatform
      let accountPickerInfoStr = window.localStorage.getItem(getAcountPickerInfoKey(currentPlatform.id))
      if (accountPickerInfoStr == null) {
        if (currentPlatform.name != 'NC桌面') {
          accountPickerInfoStr = window.localStorage.getItem(getGlobalAcountPickerInfoKey())
          this.set(JSON.parse(accountPickerInfoStr))
        } else {
          return null
        }
      }

      const accountPickerInfo = JSON.parse(accountPickerInfoStr)
      return accountPickerInfo
    },
    set(accountPickerInfo) {
      const currentPlatform = usePlatformsStoreWidthOut().getCurrentPlatform
      if (currentPlatform.name == 'NC桌面') {
        window.localStorage.setItem(getGlobalAcountPickerInfoKey(), JSON.stringify(accountPickerInfo))
      }
      window.localStorage.setItem(getAcountPickerInfoKey(currentPlatform.id), JSON.stringify(accountPickerInfo))
    },
    setGlobalAccountPicker(accountPickerInfo) {
      const currentPlatform = usePlatformsStoreWidthOut().getCurrentPlatform
      return window.localStorage.setItem(getAcountPickerInfoKey(currentPlatform.id), JSON.stringify(accountPickerInfo))
    },
    closeAllAccountPickerInfo(){
      console.log('清理缓存')
      let keys = ['global','undefined','20006','1003','1006','20007','20008','20009','200010','1014','20001','1007','20017','20017','10133100','10133200','10133300','10133400','1099']
      keys.map(k=>window.localStorage.removeItem(k+"-accountPickerInfo"))
    }
  }
}

