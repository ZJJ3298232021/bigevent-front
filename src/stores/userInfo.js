import { defineStore } from "pinia";
import { ref } from "vue";
export const useUserInfoStore = defineStore('userInfo',()=> {
    const info = ref({})
    const setInfo = (newInfo)=> {
        info.value = newInfo
    }
    const clearInfo = ()=> {
        info.value={}
    }
    return {info,setInfo,clearInfo}
},{persist:true})