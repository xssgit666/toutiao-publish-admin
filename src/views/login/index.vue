<template>
  <div class="login-container">
    <div class="login-wrap">
        <div class="login-img">
            <img src="./logo_index.png" alt="">
        </div>
        <el-form ref="login-form" :model="user" :rules="rules">
            <el-form-item prop="mobile">
                <el-input
                  v-model="user.mobile"
                  placeholder="请输入手机号"
                ></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input
                  v-model="user.code"
                  placeholder="请输入验证码"
                ></el-input>
            </el-form-item>
            <el-form-item prop="agree">
              <el-checkbox
                v-model="user.agree"
              >我已阅读并同意用户协议和隐私条款</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button
                  class="login-btn"
                  type="primary"
                  :loading="loginLoading"
                  @click="onLogin"
                >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
// 加载请求模块
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: [],
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: true // 是否同意协议的选中状态
      },
      rules: {
        mobile: [
          { required: true, message: '请输入您的账号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请您同意协议后再登录'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      loginLoading: false // 登录的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 表单验证
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loginIn()
      })
    },
    async loginIn () {
      // 开启登陆中 loading...
      this.loginLoading = true
      // 验证通过，提交登录
      try {
        await login(this.user)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false
      } catch (err) {
        console.log('登陆失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        // 关闭 loading
        this.loginLoading = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.login-container{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(./login_bg.jpg) no-repeat;
    background-size: cover;
    display: flex;
    justify-content:center;
    align-items: center;
    .login-wrap{
        width: 400px;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 50px 28px;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
        .login-img{
            text-align: center;
            margin-bottom: 30px;
        }
        .login-btn{
            width: 100%;
        }
    }
}
</style>
