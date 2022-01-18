/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'

// 通过这个request实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/'
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // 任何所有请求会经过这里
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 当这里 return config 之后请求在会真正的发出去
    return config
  }, function (error) {
    // 请求失败，会经过这里
    return Promise.reject(error)
  }
)
// 响应拦截器

// 导出请求方法
export default request
