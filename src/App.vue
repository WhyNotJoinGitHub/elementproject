<template>
  <div id="app">
    <el-button>999</el-button>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    data() {
      return {
        radio: "1",
        value1: new Date(2016, 9, 10, 18, 40),
        value2: new Date(2016, 9, 10, 18, 40)
      }
    },
    methods:{
      radioChange(e){
        console.log(e);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
