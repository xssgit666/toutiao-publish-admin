<template>
  <!-- 启用router模式会在激活导航时以 index 作为 path 进行路由跳转。:default-active="$route.path"可解决刷新不对应bug -->
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <img v-if="!isCollapse" class="title-pic" src="./title.png" alt="">
    <img v-if="isCollapse" class="title-pic2" src="./title2.png" alt="">
    <el-menu-item index="/">
      <i class="iconfont icon-shouye"></i>
      <span slot="title">项目首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont icon-liebiao"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icon-image"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont icon-publish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont icon-comment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont icon-fans"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="iconfont icon-shezhi"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['isCollapse'],
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
.title-pic{
    margin: 30px 25px 10px;
}
.title-pic2{
    margin: 30px 12px 10px;
}
.el-menu-item i{
    margin-right: 10px;
    padding-left: 5px;
}
</style>
