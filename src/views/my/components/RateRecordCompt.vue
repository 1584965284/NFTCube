<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看抽成记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="pdtb-20 pdlr-8">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        max-height="550px"
        style="width: 100%"
      >
        <el-table-column
          fixed
          align="center"
          prop="date"
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          label="来源名称"
        />
        <el-table-column
          align="center"
          prop="num"
          label="金额"
        />
        <el-table-column
          prop="time"
          align="center"
          label="时间"
        />
      </el-table>
      <div class="flex-row flex-he flex-vc mgt-10">
        <!--  -->
        <el-pagination
          background
          :current-page.sync="page"
          layout="prev, pager, next"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { drawTable } from '@/api/group'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  name: 'MessageCompt',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
      page: 1,
      size: 10

    }
  },
  computed: {
    ...mapGetters(['account', 'userLevel'])
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取用户列表
    getList() {
      const that = this
      drawTable({ page: this.page }).then(res => {
        that.loading = false
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          const { draw, count } = data
          that.tableData = draw
          that.tableData.forEach(e => {
            e.time = parseTime(new Date(e.time).getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
          })
          that.total = count
        }
      }).catch(err => {
        that.$message.error(err)
        that.loading = false
      })
    },
    handleSizeChange(size) {
      console.log('handleSizeChange', size)
      this.size = size
      this.getList()
    },
    handleCurrentChange(page) {
      console.log('handleCurrentChange', page)
      this.page = page
      this.getList()
    },
    /**
     * 更新用户信息
     */
    async handleClick(row, status) {

    },
    // 查看艺术家
    onView({ address }) {

    }
  }

}
</script>

<style lang="scss" scoped>
#ctx{
  width: 100%;
  padding: 10px;
  margin: 0px 0px 0px 0px;
  height: 500px;
}
#ctx ::v-deep .el-card__body{
  padding: 0px !important;

}
.btn-common{
  color: #fff;
  background: #0E7AC3;
  width: 120px;
  font-size: 16px;
  font-weight: 600;
  border-radius:10px ;
}
</style>
