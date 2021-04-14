import Vue from 'vue'
import VueRouter from 'vue-router'
import {
    getHomeRouteForLoggedInUser,
    getUserData,
    isUserLoggedIn
} from "../../../../full-version/frontend/src/auth/utils";
import {canNavigate} from "../../../../full-version/frontend/src/libs/acl/routeProtection";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return {x: 0, y: 0}
    },
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/Home.vue'),
            meta: {
                pageTitle: 'داشبورد',
                breadcrumb: [
                    {
                        text: 'داشبورد',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/articles',
            name: 'articles',
            component: () => import('@/views/articles/index.vue'),
            meta: {
                pageTitle: 'تمام مقالات',
                breadcrumb: [
                    {
                        text: 'مقالات - همه مقالات',
                        active: true,
                    },
                ],
            },
        },
        {
            path: '/articles/create',
            name: 'articles-create',
            component: () => import('@/views/articles/create.vue'),
            meta: {
                pageTitle: 'تمام مقالات',
                breadcrumb: [
                    {
                        text: 'مقالات - همه مقالات',
                        active: true,
                    },
                ],
            },
        },
        // {
        //     path: '/categories',
        //     name: 'categories',
        //     component: () => import('@/views/categories/index.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        // {
        //     path: '/categories/create',
        //     name: 'categories-create',
        //     component: () => import('@/views/categories/create.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        // {
        //     path: '/tags',
        //     name: 'tags',
        //     component: () => import('@/views/tags/index.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        // {
        //     path: '/tags/create',
        //     name: 'tags-create',
        //     component: () => import('@/views/tags/create.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        // {
        //     path: '/products',
        //     name: 'products',
        //     component: () => import('@/views/products/index.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        // {
        //     path: '/products/create',
        //     name: 'products-create',
        //     component: () => import('@/views/products/create.vue'),
        //     meta: {
        //         pageTitle: 'تمام مقالات',
        //         breadcrumb: [
        //             {
        //                 text: 'مقالات - همه مقالات',
        //                 active: true,
        //             },
        //         ],
        //     },
        // },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: {
                layout: 'full',
            },
        },
        {
            path: '/error-404',
            name: 'error-404',
            component: () => import('@/views/error/Error404.vue'),
            meta: {
                layout: 'full',
            },
        },
        {
            path: '*',
            redirect: 'error-404',
        },
    ],
})

// router.beforeEach((to, _, next) => {
//     const isLoggedIn = isUserLoggedIn()
//
//     if (!canNavigate(to)) {
//         // Redirect to login if not logged in
//         if (!isLoggedIn) return next({name: 'auth-login'})
//
//         // If logged in => not authorized
//         return next({name: 'misc-not-authorized'})
//     }
//
//     // Redirect if logged in
//     if (to.meta.redirectIfLoggedIn && isLoggedIn) {
//         const userData = getUserData()
//         next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
//     }
//
//     return next()
// })

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = 'none'
    }
})

export default router
