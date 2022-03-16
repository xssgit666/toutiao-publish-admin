<template>
  <div class='image-list'>
    <div class="action">
      <!-- 选择按钮 -->
      <el-radio-group
        v-model="collect"
        @change='loadImages()'
        size="small">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <!-- 上传按钮 -->
      <el-button
        v-if="isShowAdd"
        size='small'
        type="primary"
        plain
        @click="dialogUploadVisible = true"
      >上传素材</el-button>
    </div>

    <!-- 素材列表 -->
    <el-row class="images-row" :gutter="10">
      <el-col
        class="images-item"
        v-for="(image, index) in images"
        :key="index"
        @click.native="selected = index"
        :lg="{span:'4-8'}"
        :md="6"
        :sm="8"
        :xs="12">
        <!-- 图片 -->
        <el-image
          class="img-sty"
          :src='image.url'
          fit="cover"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <!-- 操作层1 -->
        <div class="act-bt-bg" v-if="isShowAction">
          <div class="act-bt">
            <el-button
              :type="image.is_collected ? 'danger' : 'success'"
              size="small"
              round
              :icon="image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              :loading='image.loading'
              @click="onCollect(image)"
            >{{image.is_collected ? '取消收藏' : '点击收藏'}}</el-button>
            <el-button
              style="margin:20px 0 0 0"
              type="primary"
              size="small"
              round
              icon="el-icon-delete"
              :loading='image.deLoading'
              @click="onDelete(image)"
            >删除素材</el-button>
          </div>
        </div>
        <!-- 操作层2 -->
        <div
          class="selected"
          v-if="isShowSelected && selected === index"
        >
          <img src="./selected.png" class="selected-img">
        </div>
      </el-col>
    </el-row>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size='pageSize'
      :current-page.sync="page"
      :disabled='pageLoading'
      @current-change='onPageChange'
    >
    </el-pagination>

    <!-- Dialog 对话框 -->
    <el-dialog
      title="上传素材"
      center
      append-to-body
      :visible.sync="dialogUploadVisible">
      <el-upload
        class="upload-demo"
        drag
        auto-upload
        accept=".jpg,.png"
        :show-file-list="false"
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        name='image'
        :headers="uploadHeaders"
        :on-success="uploaded"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">文件不要大于1M哦~</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  getImages,
  collectImage,
  deleteImage
} from '@/api/image'
export default {
  name: 'ImageList',
  components: {},
  // 使用对象的方式定义 prop，更严谨，功能更丰富，强烈建议在项目中使用
  // 使用数组声明 prop，不建议，不够严谨，而且功能也不够强大，仅适合 demo 演示
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示图片下方的操作（收藏和删除）
    isShowAction: {
      type: Boolean,
      default: true
    },
    // 是否展示选择
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 全部
      images: [], // 素材列表
      dialogUploadVisible: false, // 默认不显示
      uploadHeaders: {
        // element上传，不走axios拦截器，需要单独配置请求头信息token
        Authorization: `Bearer ${user.token}`
      },
      total: 0, // 总素材数
      pageSize: 10, // 每页请求的素材数量
      page: 1, // 页码
      pageLoading: false, // 控制页码禁用
      selected: null // 选中的索引
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  mounted () {},
  methods: {
    // 配置后页码加载有bug,须进行以下4步设置page并使用
    async loadImages (page = 1) { // 1.设置一个默认的参数,页码1
      this.pageLoading = true // 开启禁用
      this.page = page // 2.默认参数覆盖data里的page数,必不可省
      const { data } = await getImages({
        collect: this.collect,
        page, // 3.使用覆盖后的页码数请求数据
        per_page: this.pageSize
      })
      // 请求成功后手动给每个遍历项加一个loading属性，便于后续控制
      data.data.results.forEach(image => {
        image.loading = false // 收藏的
        image.deLoading = false // 删除的
      })
      // 请求回的数据更新到本地数据
      this.images = data.data.results
      this.total = data.data.total_count
      this.pageLoading = false // 关闭禁用
    },

    // 素材上传成功的回调
    uploaded () {
      this.dialogUploadVisible = false // 上传框消失
      this.$message({ // 消息提示
        message: '素材上传成功，已加入素材列表',
        type: 'success'
      })
      // 更新列表
      this.loadImages()
    },

    // 页码点击改变后的回调
    onPageChange (page) { // 4.获取页码并作为参数传递
      // 若不传则会使用上面的默认参数page=1，导致无法切换页码
      this.loadImages(page)
    },

    // 收藏素材
    async onCollect (image) {
      image.loading = true // 一点击就加载中
      await collectImage(image.id, !image.is_collected)
      image.is_collected = !image.is_collected // 更新视图
      image.loading = false // 加载完成恢复未加载

      // 更新页面的bug处理--未成功
      // const totalPage = Math.ceil((this.total) / this.pageSize)
      // this.page = this.page > totalPage ? totalPage : this.page
    },

    // 删除素材
    async onDelete (image) {
      image.deLoading = true // 一点击就加载中
      await deleteImage(image.id)
      image.deLoading = false // 加载完成恢复未加载
      this.loadImages(this.page) // 更新列表
    }
  }
}
</script>

<style scoped lang='less'>
// 顶部按钮样式
.action{
  display: flex;
  justify-content: space-between;
}

// 弹框内样式
.upload-demo{
  text-align: center;
  margin: 100px 0;
}

// 以下都是素材列表的样式
.images-row{
  margin-bottom: 10px;
  .images-item{
    position: relative;
    margin-bottom: 10px;
    .img-sty{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #f5f7fa;
      .el-icon-picture-outline{
        display: block;
        font-size: 30px;
        color: #909399;
      }
    }
    .act-bt-bg{
      display: none;
      .act-bt{
        display: flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
        height: 180px;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        border-radius: 8px;
        overflow: hidden;
        bottom: 0;
        left: 5px;
        right: 5px;
      }
    }
  }
  .images-item:hover .act-bt-bg{
    display: block;
  }
}
// 素材列表自适应媒体查询
@media only screen and (min-width: 768px) {
  .el-row{
    padding: 20px 0 0;
  }
  .el-col-sm-4-8 {
    width: 20%;
  }
  .el-col-sm-offset-4-8 {
    margin-left: 20%;
  }
  .el-col-sm-pull-4-8 {
    position: relative;
    right: 20%;
  }
  .el-col-sm-push-4-8 {
    position: relative;
    left: 20%;
  }
}
@media only screen and (min-width: 992px) {
  .el-col-md-4-8 {
    width: 20%;
  }
  .el-col-md-offset-4-8 {
    margin-left: 20%;
  }
  .el-col-md-pull-4-8 {
    position: relative;
    right: 20%;
  }
  .el-col-md-push-4-8 {
    position: relative;
    left: 20%;
  }
}
@media only screen and (min-width: 1200px) {
  .el-col-lg-4-8 {
    width: 20%;
  }
  .el-col-lg-offset-4-8 {
    margin-left: 20%;
  }
  .el-col-lg-pull-4-8 {
    position: relative;
    right: 20%;
  }
  .el-col-lg-push-4-8 {
    position: relative;
    left: 20%;
  }
}
@media only screen and (min-width: 1600px) {
.el-row{
    padding: 20px 200px 0;
  }
}
@media only screen and (min-width: 1920px) {
  .el-col-xl-4-8 {
    width: 20%;
  }
  .el-col-xl-offset-4-8 {
    margin-left: 20%;
  }
  .el-col-xl-pull-4-8 {
    position: relative;
    right: 20%;
  }
  .el-col-xl-push-4-8 {
    position: relative;
    left: 20%;
  }
}

// 分页器样式
.el-pagination{
  text-align: center;
}

// 操作2的样式
.selected{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 8px;
  overflow: hidden;
  bottom: 0;
  left: 5px;
  right: 5px;
  .selected-img{
    width: 50px;
  }
}
</style>
