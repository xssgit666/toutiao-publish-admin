<template>
  <div>
      <div class="upload-cover" @click="showCoverSelect">
        <!-- 图片选框 -->
        <div class="cover-wrap">
            <el-image
                class="cover-image"
                ref="cover-image"
                :src="value">
                <div slot="error" class="image-slot">
                    <img class="cover-pic" src="./upload.png" alt="">
                </div>
            </el-image>
        </div>

        <!-- 弹框 -->
        <el-dialog
            title="选择封面"
            center
            :visible.sync="dialogVisible"
            append-to-body>
            <el-tabs
              v-model="activeName"
              type="card"
            >
                <el-tab-pane label="素材库" name="first">
                    <image-list
                        :is-show-add="false"
                        :is-show-action="false"
                        is-show-selected
                        ref="image-list"
                    />
                </el-tab-pane>
                <el-tab-pane label="上传图片" name="second">
                    <el-upload
                        class="upload-demo"
                        drag
                        auto-upload
                        accept=".jpg,.png"
                        :show-file-list="true"
                        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                        name='image'
                        :headers="uploadHeaders"
                        :on-success="uploaded"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">文件不要大于1M哦~</div>
                    </el-upload>
                </el-tab-pane>
            </el-tabs>
            <span
              v-if="activeName !== 'second'"
              slot="footer"
              class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onConfirm">确 定</el-button>
            </span>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import ImageList from '@/views/image/components/image-list'
export default {
  name: 'UploadImage',
  components: {
    ImageList
  },
  props: ['value'],
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      dialogVisible: false, // 控制弹框
      activeName: 'first', // 默认显示第一栏
      uploadHeaders: {
        // element上传，不走axios拦截器，需要单独配置请求头信息token
        Authorization: `Bearer ${user.token}`
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 展示选择封面的弹窗
    showCoverSelect () {
      this.dialogVisible = true
    },
    // 素材上传成功的回调
    uploaded (res) { // on-success钩子函数可接收返回值
      this.$emit('input', res.data.url) // 发给父组件
      this.$message({ // 消息提示
        message: '素材上传成功，已加入素材列表',
        type: 'success'
      })
      this.dialogVisible = false // 上传框消失
    },
    // 选择素材后点击确定的回调
    onConfirm () {
      // 一种组件通信方式：父组件可以直接访问子组件中的数据
      const imageList = this.$refs['image-list']
      const selected = imageList.selected
      if (selected === null) {
        this.$message({
          message: '请选择封面图片',
          type: 'warning'
        })
        return
      }
      // 给父组件发送最新的数据
      this.$emit('input', imageList.images[selected].url)
      // 关闭弹框
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
// 封面列表的样式
.upload-cover{
  float: left;
  margin-right: 10px;
  .cover-wrap {
    width: 120px;
    height: 120px;
    border: 1px dashed #ddd;
    .cover-image {
      height: 120px;
      width: 100%;
      .cover-pic{
        width: 100%;
        height: 100%;
      }
    }
  }
}
// 弹框内样式
.upload-demo{
  text-align: center;
  margin: 50px 0;
}

// 控制子组件样式。可以用 /deep/
@media only screen and (min-width: 1600px) {
/deep/.el-row{
    padding: 20px 0 0;
  }
}
</style>
