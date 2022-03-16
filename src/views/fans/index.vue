<template>
  <div class='fans-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs
        type="border-card"
        class="fans-div"
        value="粉丝画像"
      >
        <!-- 粉丝列表 -->
        <el-tab-pane label="粉丝列表" name="粉丝列表">
          <el-row :gutter="10">
            <el-col
              :xs="8"
              :sm="6"
              :md="4"
              :lg="3"
              class="fans-pic"
              v-for='(fan,index) in fans'
              :key='index'>
              <el-image
                class="pic2"
                style="height: 80px;width: 80px"
                :src="fan.photo"
                fit="cover"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <p class="fansName">{{fan.name}}</p>
            </el-col>
          </el-row>
          <!-- 分页器 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size='pageSize'
            :current-page.sync="page"
            :disabled='pageLoading'
            @current-change='onPageChange'
          >
          </el-pagination>
        </el-tab-pane>
        <!-- 粉丝画像 -->
        <el-tab-pane label="粉丝画像" name="粉丝画像">
          <div
            style="width: 500px;height:300px;margin:0 auto"
            ref="main"
          ></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFansList } from '@/api/fans'
import * as echarts from 'echarts'
export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      fans: [], // 粉丝列表
      totalCount: 0, // 粉丝数量
      pageSize: 20, // 每页大小
      page: 1, // 当前页码
      pageLoading: true // 页码显示加载
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getFans()
  },
  mounted () {
    var myChart = echarts.init(this.$refs.main)
    var option = {
      tooltip: {},
      xAxis: {
        data: ['18-24', '25-31', '32-38', '39-45', '45-51', '52-56']
      },
      yAxis: {},
      series: [
        {
          name: '男',
          type: 'bar',
          data: [9, 10, 26, 18, 10, 30]
        },
        {
          name: '女',
          type: 'bar',
          data: [5, 20, 36, 10, 15, 20]
        }
      ]
    }
    myChart.setOption(option)
  },
  methods: {
    async getFans () {
      this.pageLoading = true // 一旦开始加载即不可在点击
      const { data } = await getFansList({
        page: this.page,
        per_page: this.pageSize
      })
      const { results, total_count: totalCount } = data.data
      this.fans = results
      this.totalCount = totalCount
      this.pageLoading = false // 加载完成后解除不可点击
    },
    onPageChange () {
      this.getFans()
    }
  }
}
</script>

<style scoped lang='less'>
.fans-div{
  box-shadow: none;
  border-bottom: none;
  border-left: none;
  border-right: none;
}
.fans-pic{
  height: 180px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  border: 1px dashed #ddd;
  .pic2{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-bottom: 10px;
    overflow: hidden;
    border: 1px solid #DCDFE6;
    background-color: #f5f7fa;
    .el-icon-picture-outline{
      display: block;
      font-size: 25px;
      color: #909399;
    }
  }
  .fansName{
    font-size: 14px;
    margin: 0;
  }
}
.el-pagination{
  text-align: center;
}
</style>
