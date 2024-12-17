import request from '@/utils/request'

export const getCategoryService = () => {
    return request.get("/category")
}
export const addCategoryService = (data)=> {
    console.log(data);
    
    return request.post("/category",data)
}
export const updateCategoryService = (data)=> {
    console.log("update");
    
    return request.put("/category",data)
}
export const deleteCategoryService = (id)=> {
    return request.delete('/category',{params: {id}})
}