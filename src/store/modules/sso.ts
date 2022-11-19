import {commitMockToken} from '/@/api/sys/user';
import {store} from '/@/store';
import {useUserStoreWidthOut} from '/@/store/modules/user';
import {getAuthCache, setAuthCache} from '/@/utils/auth';
import {isBoozSoftDevUser} from '/@/utils/env';
import axios from 'axios';
import {defineStore} from 'pinia';
import {onMounted} from 'vue';
import {useUser} from '/@/../mock-api/_datatable/tokenResource_data/tokenResource_data';

const VITE_SERVER_PATH = import.meta.env.VITE_SERVER_PATH;
const VITE_REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const redirect_uri=VITE_REDIRECT_URL
const getToken = async ({code}: any): any => {

  return await axios({
    url: VITE_SERVER_PATH + '/resources/getToken?code=' + code+'&redirect_uri='+redirect_uri,
    method: 'get'
  }).catch(res => {

    if (res.response.status == 400) {
      window.location.href = '/#/login';
    }
  });
};

export const useSsoStore = defineStore({
  id: 'sso',
  state: (): any => ({}),
  getters: {},
  actions: {
    redirectCode() {
      debugger
      const client_id = 'booz-oauth2-oidc-uniqueid';
      const response_type = 'code';
      const path = VITE_SERVER_PATH + `/sso/oauth2/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
      window.location.href = path;

    },
    getCode() {
      // const paramsStr=new URL(window.location.href).search
      if (!(window.location.href.indexOf('?code=') > 0)) {
        this.redirectCode();
        return
      }
      const code = window.location.href.split('code=')[1].split('#/')[0];
      history.pushState(null, '', '/#/');
      return code;
    },
    async mockSwitchUser(id){
      useUserStoreWidthOut().setToken(useUser(id).token);
      setAuthCache('platforms',null)
      await commitMockToken({token:useUser(id).token})
      await useUserStoreWidthOut().loadUserState()
     setTimeout(async()=>{
       window.location.reload()
     },50)
    },
    async goGetToken() {
      debugger
      if (isBoozSoftDevUser()) {
        function guid() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        // const token='mock token'
        const token=guid()
        await commitMockToken({token})
        return token
      }
      const code = useSsoStoreWidthOut().getCode();
      const {access_token} = (await getToken({code})).data;
      return access_token;
    }

  }

});

// Need to be used outside the setup
export function useSsoStoreWidthOut() {
  return useSsoStore(store);
}
