import { createRouter, createWebHistory } from 'vue-router'

import LoginVue from '@/views/Login.vue'
import Layout from '@/views/Layout.vue';
import UserAvatar from '@/views/user/UserAvatar.vue';
import UserInfo from '@/views/user/UserInfo.vue';
import UserResetPassword from '@/views/user/UserResetPassword.vue';
import ArticleCategory from '@/views/article/ArticleCategory.vue';
import ArticleManage from '@/views/article/ArticleManage.vue';

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/article/category',
        children: [
        {path: '/user/avatar', component: UserAvatar },
        {path: '/user/info', component: UserInfo },
        {path: '/user/reset', component: UserResetPassword },
        {path: '/article/category', component: ArticleCategory },
        {path: '/article/manage', component: ArticleManage },]
    },
    {path: '/login',component: LoginVue}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router