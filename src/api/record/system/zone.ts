import { defHttp } from '/@/utils/http/axios'

enum Api {
  findAllProvince = '/sys/zone/findAllProvince',
  findByCity = '/sys/zone/findByCity',
  findByDistrict = '/sys/zone/findByDistrict',
}

export async function findAllProvince() {
  return defHttp.request(
    {
      url: Api.findAllProvince,
      method: 'GET'
    }
  )
}

export async function findByCity(province) {
  return defHttp.request(
    {
      url: Api.findByCity + '?province=' + province,
      method: 'POST',
    }
  )
}

export async function findByDistrict(province, city) {
  return defHttp.request(
    {
      url: Api.findByDistrict + '?province=' + province + '&city=' + city,
      method: 'POST',
    }
  )
}
export async function findByZoneId(id) {
  return defHttp.request(
    {
      url: '/sys/zone/findByZoneId?id=' + id,
      method: 'POST',
    }
  )
}
