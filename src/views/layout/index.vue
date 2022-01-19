<template>
  <el-container class='layout-container'>
    <el-aside class="aside" width="auto">
      <AppAside
        :isCollapse='isCollapse'
        class="aside-menu"
      ></AppAside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">
          <i @click="isCollapse = !isCollapse" :class="{
            'pic' : true,
            'el-icon-s-fold' : isCollapse,
            'el-icon-s-unfold' : !isCollapse
          }"></i>
          <span class="big">新闻后台管理系统</span>
        </div>
        <el-dropdown class="avatar-warp">
          <div class="avatar-warp">
            <img class="avatar" :src="user.photo">
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/settings')">个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: [],
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onLogout () {
      // 直接从element复制函数体使用
      this.$confirm('确认退出登录吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确认后的执行函数
        window.localStorage.removeItem('user') // 移除登录信息
        this.$router.push('/login') // 跳转至登录页
        this.$message({
          type: 'success',
          message: '已退出!'
        })
      }).catch(() => {
        // 点击取消后的执行函数
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.layout-container{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .aside {
    background-color: #D3DCE6;
    .aside-menu{
      height: 100%;
    }
  }
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .header-title{
      display: flex;
      align-items: center;
      .pic{
        margin-right: 10px;
        font-size: 26px;
      }
      .big{
        font-size: 18px;
        font-weight: bolder;
      }
    }
  }
  .main{
    background-color: #e9eef3;
  }
  .avatar-warp{
    display: flex;
    align-items: center;
    .avatar{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
