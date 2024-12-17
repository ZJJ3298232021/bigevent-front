import request from '@/utils/request'

export const userRegisterService = (requestData) => {
    const params = new URLSearchParams(requestData)    
    return request.post("/user/register",params.toString())
}
export const userLoginService = (loginData)=> {
    const params = new URLSearchParams(loginData)    
    return request.post("/user/login",params.toString())
}
export const userDetailService = ()=> {
    return request.get("/user/userInfo")
}