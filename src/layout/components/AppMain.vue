<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive>
        <router-view :key="key" />
      </keep-alive> -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      ctxHeight: 550
    }
  },
  computed: {
    key() {
      console.log(this.$route.path)
      return this.$route.path
    }
  }
  // created() {
  //   window.onresize = () => {
  //     this.$nextTick(() => {
  //       this.ctxHeight = document.body.clientHeight
  //     })
  //   }
  // },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.ctxHeight = document.body.clientHeight
  //   })
  // }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  padding-top: 60px;
  min-height: calc(100vh - 250px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
