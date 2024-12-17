<script setup>
import { addCategoryService, deleteCategoryService, getCategoryService, updateCategoryService } from '@/apis/category';
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue'

//文章分类数据列表
const categorys = ref([])

//控制添加分类弹窗
const dialogVisible = ref(false)

const dialogTitle = ref('')

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})

//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}
const categoryList = async () => {
    const result = await getCategoryService()
    categorys.value = result.data
}
const clearDialog = () => {
    Object.keys(categoryModel.value).forEach(key => {
        categoryModel.value[key] = ''
    })
}
const addCategory = async () => {
    const response = await addCategoryService(categoryModel.value)
    dialogVisible.value = false
    clearDialog()
    if (response) {
        categoryList()
        ElMessage.success('添加成功')
    }
}
const updateCategory = async () => {
    const result = await updateCategoryService(categoryModel.value)
    dialogVisible.value = false
    clearDialog()
    if (result) {
        categoryList()
        ElMessage.success('修改成功')
    }
}
const editDialog = (data) => {
    dialogVisible.value = true;
    dialogTitle.value = '编辑文章分类'
    categoryModel.value.categoryAlias = data.categoryAlias
    categoryModel.value.categoryName = data.categoryName
    categoryModel.value.id = data.id
}
const deleteCategory = async (data) => {
    const result = await deleteCategoryService(data.id)
    // dialogVisible.value = false
    clearDialog()
    if (result) {
        categoryList()
        ElMessage.success('删除成功')
    }
}
const open = (data) => {
    ElMessageBox.confirm(
        '你确定要删除此文章分类吗?  (此操作将导致添加该分类的文章被删除)',
        '确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deleteCategory(data)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除操作被取消',
            })
        })
}
onMounted(() => {
    categoryList()
})
</script>
<template>
    <el-card class="page-container">

        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true, dialogTitle = '添加文章分类'">添加分类</el-button>
                </div>
            </div>
        </template>

        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="分类id" width="100" prop="id"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="editDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="open(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false; clearDialog()">取消</el-button>
                    <el-button type="primary" @click="dialogTitle === '添加文章分类' ? addCategory() : updateCategory()"> 确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>