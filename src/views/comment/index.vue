<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="评论状态">
        <template slot-scope="scope">
          {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled='scope.row.statusDisabled'
            @change="onStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size='pageSize'
      :current-page.sync="page"
      :disabled='pageLoading'
      @current-change='onPageChange'
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: [],
  data () {
    return {
      articles: [], // 文章列表
      totalCount: 0, // 文章总数
      pageSize: 10, // 每页10条
      page: 1, // 页码
      loading: false, // 表格加载中
      pageLoading: false // 页码点击禁用
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    // 获取文章列表
    async loadArticles () {
      this.loading = true // 表格开启加载中
      this.pageLoading = true // 开启页码禁用

      const { data } = await getArticles({
        response_type: 'comment',
        page: this.page,
        per_page: this.pageSize
      })
      // 追加禁用属性
      data.data.results.forEach(article => {
        article.statusDisabled = false
      })
      this.articles = data.data.results
      this.totalCount = data.data.total_count

      this.loading = false // 表格开启加载中
      this.pageLoading = false // 关闭页码禁用
    },

    // 点击开关修改评论状态
    async onStatusChange (article) {
      article.statusDisabled = true // 禁用打开
      await updateCommentStatus(article.id.toString(), article.comment_status)
      article.statusDisabled = false // 禁用关闭
    },

    // 页码点击改变后的回调
    onPageChange () {
      this.loadArticles()
    }
  }
}
</script>

<style scoped lang='less'>
// 分页器样式
.el-pagination{
  text-align: center;
  margin-top: 20px;
}
</style>
