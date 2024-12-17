import request from '@/utils/request'

export const addArticleService = (requestData) => {
    return request.post("/article",requestData)
}
export const updateArticleService = (requestData)=> {
    return request.put("/article",requestData)
}
export const articleDetailService = (requestData)=> {
    return request.get("/article",requestData)
}
export const deleteArticleService = (requestData)=> {
    return request.delete("/article?id="+requestData)
}
export const pageArticleService = (requestData)=> {    
    return request.get("/article",{params:{...requestData}})
}