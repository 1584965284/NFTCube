<template>
  <div class="app-wrapper">
    <Navbar />
    <app-main />
    <Footbar />
  </div>
</template>

<script>
import { AppMain, Navbar, Footbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Footbar
  },
  mixins: [ResizeMixin],
  computed: {

  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
.app-wrapper{
  padding: 0px;
  margin: 0px;
}
</style>
