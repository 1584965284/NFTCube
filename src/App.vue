<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
::-webkit-scrollbar-thumb { //滑块部分
  border-radius: 5px;
  background-color: #C1CDCD;
}
::-webkit-scrollbar-track { //轨道部分
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #ededed;
  border-radius: 5px;

}
</style>
