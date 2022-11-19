import axios from "axios";
import {message} from "ant-design-vue";
import {getToken} from "/@/utils/auth";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";


export function uploadFile(action, file,uploading) {
  const formData = new FormData();
  formData.append('file', file as any);
  uploading.value = true;

  // You can use any AJAX library you like
  axios( {
    url:action,
    method: 'post',
    headers:{
      'Authorization':getToken(),
      datasource: JSON.stringify({
        databaseName: '',
        schemaName: useCompanyOperateStoreWidthOut().getSchemaName,
      }),
    },
    data: formData,
  })
    .then(() => {
      uploading.value = false;
      message.success('upload successfully.');
    })
    .catch(() => {
      uploading.value = false;
      message.error('upload failed.');
    })

}
