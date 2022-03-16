/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
// axios()
// axios.get()
// axios.post()

// Axios会在内部使用JSON.parse把后端返回的数据转为JavaScript数据对象，当数字过大时会转换错误，所以不要让axios使用JSON.parse来转换这个数据，而是使用json-biginit来做转换处理。
import JSONbig from 'json-bigint'

// 响应器处理会跳转登录页，所以引入路由
import router from '@/router'

// 非组件模块加载使用 element 的 message 提示组件
import { Message } from 'element-ui'

// 通过这个request实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/', // 请求的基础路径
  // axios提供了一个 API：transformResponse来定义后端返回的原始数据的处理,参数data就是后端返回的原始数据（未经处理的JSON格式字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (error) {
      // 如果转换失败了，把数据原封不动的直接返回
      return data
    }
  }]
  // 注意：后续使用返回的此数据时须toString()
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
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  // 任何超出 2xx 的响应码都会进入这里
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }

  return Promise.reject(error)
})
// 导出请求方法
export default request
