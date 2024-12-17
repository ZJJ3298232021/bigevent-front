<script setup>
import { addArticleService, deleteArticleService, pageArticleService, updateArticleService } from '@/apis/article';
import { getCategoryService } from '@/apis/category';
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { onMounted, ref } from 'vue'

import { Plus } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token';
import { ElMessage, ElMessageBox } from 'element-plus';
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

//文章分类数据模型
const categorys = ref([])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

const symbol = ref('')


//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articlePage()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articlePage()
}
const articleCategory = async () => {
    let result = await getCategoryService()
    categorys.value = result.data
}
const articlePage = async () => {
    let result = await pageArticleService({ pageNum: pageNum.value, pageSize: pageSize.value, categoryId: categoryId.value, state: state.value })

    articles.value = result.data ? result.data.items : {}
    total.value = result.data ? result.data.total : {}
    articles.value.forEach((item, index) => {
        for (let i = 0; i < categorys.value.length; i++) {

            if (categorys.value[i].id === item.categoryId) {

                articles.value[index].categoryName = categorys.value[i].categoryName
            }

        }
    })
}

const deleteArticle = async (id) => {
    let result = await deleteArticleService(id)
    if (result) {
        articlePage()
        ElMessage({
            type: 'success',
            message: '已删除此文章',
        })
    }
}
const open = (row) => {
    ElMessageBox.confirm(
        '你确定要删除这篇文章吗？',
        '提示',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
        .then(() => {
            deleteArticle(row.id)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除操作',
            })
        })
}

const resetRule = () => {
    categoryId.value = ''
    state.value = ''
}
const userToken = useTokenStore()
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data
}
const addArticle = async (state) => {
    articleModel.value.state = state
    const result = await addArticleService(articleModel.value)
    if (result) {
        visibleDrawer.value = false
        resetModel()
        ElMessage.success('添加文章成功')
        articlePage()
    }

}
const resetModel = () => {
    articleModel.value = {
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    }
}
const update = async()=> {    
    const result = await updateArticleService(articleModel.value)
    if(result) {
        articlePage()
        visibleDrawer.value=false
        ElMessage.success('更新完成')
        resetModel()
    }
}
const editArticle = async (row) => {    
    symbol.value = 'update'
    visibleDrawer.value = true
    articleModel.value = {...row}
}
onMounted(() => {
    articleCategory()
    articlePage()
})
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true; symbol = 'add'">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" class="selectBox">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" class="selectBox">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articlePage">搜索</el-button>
                <el-button @click="resetRule">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="editArticle(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="open(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
        <!-- 添加文章表单 -->
        <el-form :model="articleModel" label-width="100px">
            <el-form-item label="文章标题">
                <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="articleModel.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">

                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                    name="file" :headers="{ 'Authorization': userToken.token }" :on-success="uploadSuccess">
                    <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor"><quill-editor theme="snow" v-model:content="articleModel.content"
                        contentType="html">
                    </quill-editor></div>
            </el-form-item>
            <el-form-item v-if="symbol === 'add'">
                <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
            </el-form-item>
            <el-form-item v-else>
                <el-button type="primary" @click="update">完成编辑</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
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

    .selectBox {
        width: 100px;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>