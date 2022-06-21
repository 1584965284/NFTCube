<template>
  <div :class="{'show':show}" class="header-search">

    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索"
      style="background:#006E7B;"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="(item,index) in options" :key="index" :value="item" :label="item.name" />
    </el-select>
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { searchByKeyWords } from '@/api/market'
export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: true,
      fuse: undefined
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {

    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
  },
  methods: {
    click() {
      // this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change({ type, address, tokenId }) {
      if (type === 1) {
        this.$router.replace({ path: '/buy', query: { tokenId }})
      } else {
        this.$router.replace({ path: '/my/intro', query: { address }})
      }
      this.$nextTick(() => {
        this.search = ''
        this.options = []
        // this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    querySearch(query) {
      const that = this
      if (query !== '') {
        searchByKeyWords({ name: query }).then(res => {
          const { errCode, data } = res
          if (errCode === 0) {
            const { nfts, aritists } = data
            const result1 = nfts.map(e => {
              const { name, tokenId, address } = e
              return { name, address, tokenId, type: 1 }
            })
            const result2 = aritists.map(e => {
              const { username: name, address } = e
              return { name, address, type: 2 }
            })
            that.options = [...result1, ...result2]
            console.log(that.options)
          }
        }).catch(e => {
          console.log(e)
        })
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      background: #006E7B;
      color: #fff!important;
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
