<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的消息</el-breadcrumb-item>
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
          label="发送人"
        />
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="mes"
          label="消息内容"
        />
        <el-table-column
          prop="time"
          align="center"
          label="时间"
        />
        <!-- <el-table-column
          prop="status"
          align="center"
          label="状态"
        >
          <template slot-scope="{row}">
            {{ row.status |statusFilter }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          width="250"
          align="center"
          fixed="right"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button v-if="row.status==0" type="text" size="small" @click="handleClick(row,1)">接受</el-button>
            <el-button v-if="row.status==0" type="text" size="small" @click="handleClick(row,0)">拒绝</el-button>
            <el-button v-if="row.status>0" type="text" size="small" @click="onView(row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="flex-row flex-he flex-vc mgt-10">
        <el-pagination
          background
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="20"
          layout=" prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { getMes } from '@/api/user'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  name: 'MessageCompt',
  filters: {
    statusFilter(key) {
      if (key === 0) {
        return '未审核'
      } else if (key === 1) {
        return '通过'
      } else if (key === 2) {
        return '拒绝'
      } else {
        return ''
      }
    }
  },
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
      getMes({ page: this.page, num: this.size }).then(res => {
        that.loading = false
        const { errCode, data, message } = res
        if (errCode !== 0) {
          that.$message.error(message)
        } else {
          const { mes, count } = data
          that.tableData = mes
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
