<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="article"
        :rules="rules"
        ref="pubForm"
        label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input
            class="title-w"
            v-model="article.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- lang="zh"必须要指定 -->
          <el-tiptap
            lang="zh"
            height="350"
            placeholder="请输入文章内容"
            v-model="article.content"
            :extensions="extensions"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <upload-cover
              v-for="(cover,index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"
            />
            <!-- 利用了v-model与子组件数据绑定的特性 -->
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, id) in channels"
              :key="id"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- button按钮须传函数值，否则会被赋予一个默认值，导致报错 -->
          <el-button
            type="primary"
            @click="onPublish(false)">
              {{$route.query.id ? '修改文章' : '发布文章'}}
          </el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover'
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updataArticle
} from '@/api/article'
// 安装element-tiptap一定要用cnpm
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: [],
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 文章封面
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片的地址
        },
        channel_id: null // 频道
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { // 自定义校验
            validatePass (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // uploadRequest是tiptap自带的图片上传实例，有形参file
          uploadRequest (file) {
            // 接口文档里的uploadImage请求体要求必须使用 FormData,所以先定义一个fd,里面要有image和file
            const fd = new FormData()
            fd.append('image', file)
            // axios 本身就是返回 Promise 对象
            return uploadImage(fd).then(res => {
              // 这个 return 是返回最后的结果
              return res.data.data.url
            })
          }
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels() // 用来加载文章的频道

    // 如果路由路径参数中有 id，则请求展示文章编辑的内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    // 获取文章频道
    async loadChannels () {
      const { data } = await getArticlesChannels()
      this.channels = data.data.channels
    },

    // 表单验证
    onPublish (draft) {
      this.$refs.pubForm.validate((valid) => {
        if (!valid) return
        this.publish(draft)
      })
    },
    // 发布文章
    async publish (draft) {
      const articleId = this.$route.query.id
      if (articleId) { // 如果是修改文章,articleId有值，则执行更新
        await updataArticle(articleId, this.article, draft)
        this.$message({
          message: `${draft ? '存入草稿' : '文章修改'}成功`,
          type: 'success'
        })
        // 跳转到内容管理页面
        this.$router.push('/article')
      } else { // 否则执行添加操作
        await addArticle(this.article, draft)
        this.$message({
          message: `${draft ? '存入草稿' : '文章发布'}成功`,
          type: 'success'
        })
        // 跳转到内容管理页面
        this.$router.push('/article')
      }
    },

    // 修改文章：加载文章内容
    async loadArticle () {
      const { data } = await getArticle(this.$route.query.id)
      this.article = data.data
    }
  }
}
</script>

<style scoped lang='less'>
.title-w{
  width: 400px;
}
</style>
