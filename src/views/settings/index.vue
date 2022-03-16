<template>
  <div class='settings-container'>
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span='15'>
          <!-- 表单 -->
          <el-form
            :model="user"
            :rules="rules"
            ref="pubForm"
            label-width="80px"
            class="demo-ruleForm"
          >
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="user.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro" placeholder="请填写介绍"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email" placeholder="请填写邮箱"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading='updateProfileLoading'
                @click="onUpdateUser"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span='4'>
          <label for="file">
            <div class="touxiang">
              <el-avatar
                shape="circle"
                :size="100"
                fit="cover"
                :src="user.photo"
              ></el-avatar>
              <p>点击修改头像</p>
              <p class="tip">只能上传jpg/png文件，且不超过1M</p>
            </div>
          </label>
          <input
            id="file"
            type="file"
            ref="file"
            hidden
            @change="onFileChange"
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 弹出层 -->
    <el-dialog
      title="裁切头像"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
      :visible.sync="dialogVisible"
      center>
      <!-- 裁切的图片必须包裹在一个块元素里 -->
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading="updatePhotoLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'SettingsIndex',
  components: {},
  props: [],
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确格式的邮箱', trigger: 'blur' }
        ]
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片的url地址
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 弹框中确定按钮的loading状态
      updateProfileLoading: false // 保存按钮的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    // 加载用户信息
    async loadUser () {
      const { data } = await getUserProfile()
      this.user = data.data
    },

    // 点击选择头像的回调
    onFileChange () {
      // 下面的两步可以得到预览图片的路径
      const file = this.$refs.file // 1
      const blobData = window.URL.createObjectURL(file.files[0]) // 2

      // 把得到的路径赋给previewImage
      this.previewImage = blobData

      // 展示弹出层
      this.dialogVisible = true

      // 解决相同文件不触发change事件问题
      this.$refs.file.value = ''
    },

    // 当弹框打开后的回调 => 调裁切插件裁切图片
    // 注意：安装cropperjs插件也须用cnpm才行，否则容易报错
    onDialogOpened () {
      const image = this.$refs['preview-image'] // 获取dom节点
      // 初始化裁切器，为了后续销毁实例，先定义一个cropper
      this.cropper = new Cropper(image, {
        viewMode: 1, // 定义裁剪器的视图模式
        dragMode: 'none', // 定义裁剪器的拖动模式
        aspectRatio: 1, // 定义裁剪框的固定纵横比
        cropBoxResizable: false // 启用通过拖动来调整裁剪框的大小
      })
    },

    // 对话框关闭的回调
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      this.cropper.destroy()
    },

    // 更新头像
    onUpdatePhoto () {
      // 让确定按钮开始 loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData() // 必须上传 FormData 对象
        fd.append('photo', file) // 此file即为裁切文件
        // 发送请求更新用户头像
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 直接把裁切结果的文件URL.createObjectURL转为本地url预览
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭确定按钮的 loading
          this.updatePhotoLoading = false
          // 提示上传成功
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 更新顶部登录用户的信息
          this.$bus.$emit('update-user', this.user)
        })
      })
    },

    // 保存：1.表单验证
    onUpdateUser () {
      this.$refs.pubForm.validate((valid) => {
        if (!valid) return
        this.onUpdate()
      })
    },
    // 保存：2.提交更新
    async onUpdate () {
      this.updateProfileLoading = true // 开启按钮loading状态
      const { name, intro, email } = this.user // 解构出属性
      // 发送更新的请求
      await updateUserProfile({
        name,
        intro,
        email
      })
      this.$message({ // 消息提示
        type: 'success',
        message: '保存成功'
      })
      this.updateProfileLoading = false // 关闭按钮loading状态

      // 发布通知，更新头部当前登录用户的信息
      this.$bus.$emit('update-user', this.user)
    }
  }
}
</script>

<style scoped lang='less'>
.touxiang{
  text-align: center;
  cursor: pointer;
  p{
    margin: 0;
    font-size: 14px;
    color: #1989fa
  }
  .tip{
    font-size: 12px;
    color: #909399;
  }
}
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 400px;
  }
}
</style>
