<template>
  <div>
    <el-card class="box-card">
      <!-- 顶部栏 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 图片列表 -->
      <image-list />

    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'
export default {
  name: 'ImageIndex',
  components: {
    ImageList
  },
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

</style>
