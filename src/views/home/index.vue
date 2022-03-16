<template>
  <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="jieshao">
        <h3>项目介绍：</h3>
        <p>
          一个基于 Vue.js 开发的一个 PC 端内容发布系统。今日头条、网易新闻、腾讯新闻之类的咨询阅读软件，一般这种资讯类应用都有一个后台，专门用来给创作者发布内容，本项目中所见的功能和按钮都可以正常使用。
        </p>
        <p>这是一个不太复杂的小项目，还有一个手机端仿今日头条的项目，也已部署在了我的小服务器上，可以浏览 <a href="http://www.changze.top/pro2/">www.changze.top/pro2/</a> 查看哦！</p>
        <h3>技术栈：</h3>
        <p>Vue.js</p>
        <p>Vue Router</p>
        <p>Vue Cli</p>
        <p>Axios</p>
        <p>Element 组件库</p>
        <p>Echarts 数据展示、json-bigint 数据处理、tiptap 富文本编辑器和 cropperjs 图像裁切等第三方插件</p>
      </div>
    </el-card>
</template>

<script>
export default {
  name: 'HomeIndex',
  components: {},
  props: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang='less'>
.jieshao{
  text-align: justify;
  text-indent: 2em;
}
</style>
