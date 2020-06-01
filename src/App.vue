<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss">
  /*修改滚动条样式*/
  div::-webkit-scrollbar{
    width:5px;
    height:5px;
  }
  div::-webkit-scrollbar-track{
    background: transparent;
    border-radius:2px;
  }
  div::-webkit-scrollbar-thumb{
    background: #bfbfbf;
    border-radius:10px;
  }
  div::-webkit-scrollbar-thumb:hover{
    background: rgba(0,0,0,.6);
  }
  div::-webkit-scrollbar-corner{
    background: #179a16;
  }
</style>
