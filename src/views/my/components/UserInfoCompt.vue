<template>
  <div class="app-container" :style="{width:width,height:height}">
    <div class="wdtp-100 box-border pd-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>个性化设置</el-breadcrumb-item>
        <el-breadcrumb-item>基本资料</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="ctx" class="pdtb-20 pdlr-8">
      <div class="flex-row flex-hvc mgb-30">
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
          <img v-if="avatar" :src="`${baseUrl}${avatar}`" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
      <!-- 表单数据 -->
      <el-form ref="dataForm" :model="temp" label-position="top" :rules="rules">
        <el-row type="flex" justify="start" align="middle" style="margin-top:10px">
          <el-col :span="12">
            <el-form-item label="我的昵称" prop="username">
              <el-input v-model="temp.username" clearable maxlength="100" placeholder="请输入我得昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" align="middle" style="margin-top:10px">
          <el-col :span="12">
            <el-form-item label="我的性别" prop="sex">
              <el-select v-model="temp.sex" placeholder="请选择性别" clearable class="wdtp-100">
                <el-option
                  label="男"
                  value="男"
                />
                <el-option
                  label="女"
                  value="女"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" align="middle" style="margin-top:10px">
          <el-col :span="24">
            <el-form-item label="我的个性签名" prop="description">
              <el-input v-model="temp.description" :clearable="true" show-word-limit maxlength="200" type="textarea" :rows="3" placeholder="请输入我的个性签名" />
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
  </div>
</template>

<script>
import { changeUserInfo, uploadHeader } from '@/api/user'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
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
        description: '',
        sex: '男'
      },
      loading: false,
      rules: {
        username: { required: true, message: `请输入昵称`, trigger: 'blur' },
        sex: { required: false, message: `输入选择性别`, trigger: 'blur' },
        description: { required: true, message: `请输入个性签名`, trigger: 'blur' }
      },
      baseUrl: ''

    }
  },
  computed: {
    ...mapGetters(['avatar', 'name', 'account', 'isConnect', 'introduce', 'isBind', 'loginState', 'sex'])
  },
  created() {
    this.temp.username = this.name
    this.temp.description = this.introduce
    this.temp.sex = this.sex || '男'
    this.baseUrl = process.env.VUE_APP_DAOMAIN
  },
  methods: {
    ...mapMutations({ setName: 'user/SET_NAME', setDescription: 'user/SET_INTRODUCE', setSex: 'user/SET_SEX', setAvatar: 'user/SET_AVATAR' }),
    // 保存
    /**
     * 更新用户信息
     */
    async onSubmit() {
      const that = this
      const valid = await this.$refs.dataForm.validate().catch(_ => false)
      if (valid) {
        this.loading = true
        const { username, description, sex } = that.temp
        changeUserInfo({ username, description, sex }).then(res => {
          this.loading = false
          const { errCode, data, message } = res
          if (errCode !== 0) {
            that.$message.error(message)
          } else {
            const { username, description, sex } = data
            that.setName(username)
            that.setSex(sex)
            that.setDescription(description)

            that.$message.success('基本信息修改成功！')
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
        console.log('avatar-changeUserInfo', res)
        const { errCode, message, data } = res
        if (errCode === 0) {
          const { url } = data
          that.setAvatar(url)
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
</style>
