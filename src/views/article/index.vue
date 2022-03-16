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
            <!-- el-radio 默认把 :label 作为文本和选中之后的 value 值 -->
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
          <!-- button 按钮的 click 事件有个默认参数，当没有指定参数的时候，它会默认传递一个没用的数据 -->
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
      <!--
        Table 表格组件
        1、把需要展示的数组列表数据绑定给 table 组件的 data 属性
          注意：不用去 v-for 遍历，它自己会遍历
        2、设计表格列 el-table-column
          width 可以设定表格列的宽度
          label 可以设定列的标题
          prop  用来设定要渲染的列表项数据字段，只能展示文本

        3、表格列默认只能渲染普通文本，如果需要展示其它内容，例如放个按钮啊、放个图片啊，那就需要自定义表格列模板了：https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban
       -->
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
          <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
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
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template 里面 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-edit"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <!-- 任何格式的和字符串相加都会自动转为字符串格式，故而不用加toString -->
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
      // 结构赋值时，加:xxx, xxx即为赋值后的新命名
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
        // 下面的.toString()是在转换JSONbig返回的数据
        deleteArticle(articleId.toString()).then(() => {
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
  border-radius: 8px;
  border: 1px solid #DCDFE6;
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
