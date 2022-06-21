<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的机构</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="pdtb-20 pdlr-8">
      <div class="mgt-3 pd-10" style="border:1px solid #ccc;">
        <div class="flex-row flex-hvc mgb-20 header hgt-180 " :style="{backgroundImage: 'url('+`${baseUrl}${bgUrl}`+')',backgroundSize:'cover'}">
          <!-- 背景 -->
          <el-upload
            ref="upload2"
            class="upload-demo"
            action="#"
            :limit="1"
            :show-file-list="false"
            :auto-upload="true"
            :before-upload="beforeAvatarUpload2"
            :on-exceed="handleExceed"
          >
            <el-button type="text" class="edit-bg">更换背景</el-button>
          </el-upload>
          <!-- 头像 -->
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :auto-upload="true"
            :limit="1"
          >
            <img :src="`${baseUrl}${imageUrl}`" class="avatar">
          </el-upload>
          <!-- <h5 class="header-txt">更换头像</h5> -->
        </div>
        <!-- 表单数据 -->
        <el-form ref="dataForm" :model="temp" label-position="top" :rules="rules">
          <el-row type="flex" justify="start" align="middle" style="margin-top:8px">
            <el-col :span="12">
              <el-form-item label="机构名称" prop="username">
                <el-input v-model="temp.username" :disabled="true" clearable maxlength="100" placeholder="请输入机构名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="middle" style="margin-top:10px">
            <el-col :span="24">
              <el-form-item label="机构介绍" prop="description">
                <el-input v-model="temp.description" :clearable="true" show-word-limit maxlength="200" type="textarea" :rows="3" placeholder="请输入机构描述" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 保存 -->
          <el-row type="flex" justify="start" align="middle" class="mgtb-20">
            <el-col :span="24" class="flex-row flex-he flex-vc">
              <el-button type="primary" :loading="loading" class="btn-common" @click.stop="onSubmit">保 存</el-button>
            </el-col>

          </el-row>
        </el-form>

      </div>
      <div class="mgt-20 pd-10" style="border:1px solid #ccc;">
        <el-row type="flex" justify="pace-between" :gutter="10">
          <el-col :span="12">
            <el-input v-model="newLabel" :clearable="true" maxlength="50" placeholder="输入新标签" class="wdt-400" />
            <el-button type="primary" :loading="loading" class="mgl-30 btn-common" @click="addLabel">添加标签</el-button>
          </el-col>
          <el-col :span="12" class="flex-row flex-he flex-hv">
            <el-input-number v-model="ratio" :precision="2" :step="0.01" :max="0.85" /><span class="flex-row flex-hvc" />
            <el-button type="primary" :loading="loading" class="mgl-30 btn-common" style="width:150px;" @click="onSetRate">设置抽成比例</el-button>
          </el-col>
        </el-row>
        <!-- <div class="flex-row flex-fs flex-vc">

        </div> -->

        <div class="mgt-10 flex-row flex-fs flex-vc flex-wrap pd-5 hgt-50 txt-overflow-y">
          <el-tag
            v-for="tag in Tags"
            :key="tag.name"
            :type="tag.type"
            class="mg-5"
            closable
            @close="onClosed(tag)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { changeAgencyInfo, getAgencyInfo,
  createLabel, getLabels, deleLabel,
  getRatio, setRatio, uploadHeader, uploadBackground } from '@/api/group'
import { mapGetters } from 'vuex'
export default {
  name: 'UserInfoCompt',
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
      temp: {
        username: '',
        description: ''
      },
      loading: false,
      rules: {
        username: { required: false, message: `请输入机构名称`, trigger: 'blur' },
        description: { required: true, message: `请输入个机构介绍`, trigger: 'blur' }
      },
      baseUrl: '',
      imageUrl: '',
      bgUrl: '',
      newLabel: '',
      ratio: 0,
      Tags: []

    }
  },
  computed: {
    ...mapGetters(['agency', 'account'])
  },
  created() {
    this.baseUrl = process.env.VUE_APP_DAOMAIN
    getAgencyInfo({ name: this.agency }).then(res => {
      const { errCode, data, message } = res
      const { name, description, avatar, background } = data.res
      if (errCode === 0) {
        this.temp.username = name
        this.temp.description = description
        this.imageUrl = avatar
        this.bgUrl = background
      } else {
        this.$message.error(message)
      }
    })
    this.getTagLabels()
    this.getRate()
  },
  methods: {
    // 保存
    /**
     * 更新用户信息
     */
    async onSubmit() {
      const that = this
      const valid = await this.$refs.dataForm.validate().catch(_ => false)
      if (valid) {
        this.loading = true
        const { description } = that.temp
        changeAgencyInfo({ description }).then(res => {
          this.loading = false
          const { errCode, data, message } = res
          if (errCode !== 0) {
            that.$message.error(message)
          } else {
            that.$message.success(message)
          }
        }).catch(err => {
          that.$message.error(err)
          that.loading = false
        })
      } else {
        that.$message.error('数据验证失败！')
      }
    },
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res, file)
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log('beforeAvatarUpload', file)
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/png 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      const that = this
      const formData = new FormData()
      formData.append('file', file)
      uploadHeader(formData).then(res => {
        const { errCode, message, data } = res
        if (errCode === 0) {
          const { url } = data
          that.imageUrl = url
        } else {
          this.$message.error(message)
        }
        that.$refs.upload.clearFiles()
      }).catch(_ => {
        that.$refs.upload.clearFiles()
      })

      return false
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 上传背景图
    beforeAvatarUpload2(file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/png 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        return false
      }
      const that = this
      const formData = new FormData()
      formData.append('file', file)
      uploadBackground(formData).then(res => {
        const { errCode, message, data } = res
        if (errCode === 0) {
          const { url } = data
          that.bgUrl = url
        } else {
          this.$message.error(message)
        }
        that.$refs.upload2.clearFiles()
      }).catch(_ => {
        that.$refs.upload2.clearFiles()
      })

      return false
    },
    // 设置抽成比例
    onSetRate() {
      if (this.ratio) {
        setRatio({ ratio: this.ratio }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            this.$message.success(message)
            this.getRate()
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    // 查询抽成抽成比例
    getRate() {
      getRatio().then(res => {
        const { errCode, data, message } = res
        if (errCode === 0) {
          const { ratio } = data
          this.ratio = ratio
        } else {
          this.$message.error(message)
        }
      })
    },
    // 查询标签
    getTagLabels() {
      getLabels().then(res => {
        const { errCode, data, message } = res
        if (errCode === 0) {
          const { labels } = data
          this.Tags = labels.map(e => {
            return { id: 1, name: e.name, type: e.hot ? 'danger' : 'info' }
          })
        } else {
          this.$message.error(message)
        }
      })
    },
    // 添加标签
    addLabel() {
      if (this.newLabel) {
        createLabel({ name: this.newLabel }).then(res => {
          const { errCode, message } = res
          if (errCode === 0) {
            this.$message.success(message)
            this.getTagLabels()
            this.newLabel = ''
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    // 删除label
    onClosed({ name }) {
      deleLabel({ name }).then(res => {
        const { errCode, message } = res
        if (errCode === 0) {
          this.$message.success(message)
          this.getTagLabels()
        } else {
          this.$message.error(message)
        }
      })
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

.avatar-uploader ::v-deep .el-upload {
    border: 1px solid #d9d9d9;
    border-radius:50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 0px;
    margin: 0px;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }
  .header{
    position: relative;
    border: 1px solid #ccc;
    &:hover .edit-bg{
      visibility:visible;
    }
  }
  .header-txt{
    position: absolute;
    width: 70px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    bottom: -6px;
    color: #fff;
    opacity: 0;
    background: #8c939d;
    &:hover{
      opacity: 0.7;
      cursor: pointer;
    }

  }
  .edit-bg{
    position: absolute;
    right: 10px;
    visibility: hidden;
  }
</style>
