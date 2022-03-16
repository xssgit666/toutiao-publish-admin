import Vue from 'vue'
import VueRouter from 'vue-router'
// 在 VueCLI 创建的项目中 @ 表示 src 目录
// 它是 src 目录的路径别名
// 好处：它不受当前文件路径影响
// 注意：@ 就是 src 路径，后面别忘了写那个斜杠
// 使用建议：如果加载的资源路径就在当前目录下，那就正常写
//          如果需要进行父级路径查找的都使用 @

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',有一个默认子路由，这个名字没有意义，故而注释
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // path 为空，会作为默认子路由渲染
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article')
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/views/publish')
      },
      {
        path: '/image',
        name: 'image',
        component: () => import('@/views/image')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings')
      },
      {
        path: '/fans',
        name: 'fans',
        component: () => import('@/views/fans')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// beforeEach 是全局前置守卫，任何页面的访问都要经过这里
// to：要去的路由信息，from：来自哪里的路由信息，next：放行方法（/放行路径）
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 判断是不是去登录页
  if (to.path !== '/login') {
    if (user) {
      // user有意义，说明已登录，则放行
      next()
    } else {
      // user无意义，说明未登录，截住，去登录页
      next('/login')
    }
  } else {
    // 如果是去登录页，直接放行，去登录页
    next()
  }
})

export default router
