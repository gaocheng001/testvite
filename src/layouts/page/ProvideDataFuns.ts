import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {ref} from "vue";
import router from "/@/router";

const temp = {}
window.viewProvider = temp


export function useCurrentPageDatasourcePickerState() {
    const updated = router.currentRoute

    function getCurrentFullPath() {
        return updated.value.fullPath
    }

    function setCurrentPageDatasourcePickerState(state) {
        temp[getCurrentFullPath()] = state
    }

    function getCurrentPageDatasourcePickerState() {
        if (temp[getCurrentFullPath()] == null) {
            setCurrentPageDatasourcePickerState(ref(getStateParams()))
        }
        return temp[getCurrentFullPath()]
    }

    function usePageRouterApi(fun) {
        return useRouteApi(fun, {
            schemaName: getCurrentPageDatasourcePickerState().value.params.accountMode
        })
    }

    function getStateParams() {
        return {
            params: {},
            datasource: {},
            datasourceLock: 0,
            usePageRouterApi,
            resetParams(e) {
                getCurrentPageDatasourcePickerState().value.params = e
            },
            getParams() {
                return getCurrentPageDatasourcePickerState().value.params
            }
        }
    }


    return {getCurrentPageDatasourcePickerState, usePageRouterApi}
}
