<template>
  <div class='article-container'>
    <!-- 上半部分 -->
    <el-card class="box-card bt">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单部分 -->
      <el-form size="mini" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="(channel,index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="search">
          <el-button
            type="primary"
            :loading="loading"
            @click="loadArticles(1)"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 下半部分 -->
    <el-card class="box-card">
      <!-- 顶部数据介绍 -->
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{totalCount}} 条结果：</span>
      </div>
      <!-- 数据表格 -->
      <el-table
        class="bt"
        v-loading="loading"
        :header-cell-style="{textAlign: 'center'}"
        :cell-style="{ textAlign: 'center' }"
        :data="articles"
        size="mini"
        height="400"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="封面">
          <template slot-scope="scope">
            <el-image
              class="cover"
              :src="scope.row.cover.images[0]"
              fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change='onCurrentChange'
        :current-page.sync="page"
        :disabled='loading'
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticlesChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: [],
  data () {
    return {
      articles: [], // 文章列表
      articleStatus: [
        { text: '草稿', type: 'info' }, // index为0
        { text: '待审核', type: '' }, // index为1
        { text: '审核通过', type: 'success' }, // index为2
        { text: '审核失败', type: 'warning' }, // index为3
        { text: '已删除', type: 'danger' } // index为4
      ],
      totalCount: 0, // 文章总数
      status: null, // axios不会发送值为null、undefined类型的数据
      channels: [], // 频道列表
      channelId: null, // 频道id
      rangeDate: null, // 筛选的范围日期
      loading: false, // 表格加载中
      page: 1 // 当前页码，通过:current-page.sync绑定到分页器，目的是做到删除了那一页的数据更新哪一页，有些类似v-model
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
    this.loadArticlesChannels()
  },
  mounted () {},
  methods: {
    async loadArticles (page = 1) {
      this.loading = true // 表格开启加载中

      const { data } = await getArticles({
        page,
        per_page: 10,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      })
      const { results, total_count: totalCount } = data.data
      this.articles = results
      this.totalCount = totalCount

      this.loading = false // 表格开启加载中
    },

    onCurrentChange (page) {
      this.loadArticles(page)
    },

    async loadArticlesChannels () {
      const { data } = await getArticlesChannels()
      this.channels = data.data.channels
    },

    onDeleteArticle (articleId) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId).then(() => {
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.search{
  margin-bottom: 0;
}
.cover{
  width: 70px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #F5F7FA;
  .el-icon-picture-outline{
    font-size: 20px;
    display: block;
  }
}
.el-table td.el-table__cell div{
  margin: 0 auto;
}
.el-pagination{
  text-align: center;
}
.bt{
  margin-bottom: 20px;
}
</style>
