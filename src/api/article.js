/**
 * 文章请求模块
 */
import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // body参数使用 data 设置
    // query参数使用 params 设置
    // headers参数使用 headers 设置
    params
  })
}

// 获取文章频道
export const getArticlesChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的写的路径参数需要在 url 中传递
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 发布文章
export const addArticle = (data, draft) => {
  // 假如有默认属性draft，默认属性 draft = false 不能放到形参的第一个，应放到最后一个
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

// 获取指定文章内容
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 修改文章
export const updataArticle = (articleId, data, draft) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否存为草稿（true 为草稿）
    },
    data
  })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    // Query参数使用 params 设置
    params: {
      article_id: articleId // 对象的属性名不受代码规范限制
    },
    // body参数使用 data 设置
    data: {
      allow_comment: allowComment
    }
  })
}
