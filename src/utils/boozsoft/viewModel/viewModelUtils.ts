import {
  defineRecrodData,
  useNcAudit,
  useNcLogger,
  useNcTask
} from "/@/utils/boozsoft/record/recordUtils";
import {inject} from "vue";


 function useViewModelRef(data) {
  const viewProvider = inject('viewProvider')
  return viewProvider.useViewModel(defineRecrodData(data))
}

export function useViewModel({name}) {
  const {ncLogger} = useNcLogger({recordName: name})
  const {ncTask} = useNcTask({recordName: name})
  const {ncAudit} = useNcAudit({recordName: name})

  return {
    ncLogger,
    ncTask,
    ncAudit,
    useViewModelRef
  }
}
