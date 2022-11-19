import * as localforage from "localforage";

let connect=null
export async function useDbCacheStore(){
  if(connect==null){
    connect=await localforage.setDriver(localforage.WEBSQL)
  }
  return localforage
}