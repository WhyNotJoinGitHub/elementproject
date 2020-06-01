<template>
  <div class="CategoryParams">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          show-icon
          :closable="false">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              v-model="selectData"
              :options="paramsList"
              :props="paramsListProps"
              @change="handleChange"
              clearable></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        paramsList: [],
        selectData: [],
        paramsListProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        }
      }
    },
    created() {
      this.getParamsList()
    },
    methods: {
      //获取分类数据
      async getParamsList() {
        const {data: res} = await this.$http.get('categories')
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
        this.paramsList = res.data
      },

      //下拉框改变获取值
      handleChange() {
        if (this.selectData.length < 3) return this.selectData = []
        console.log(this.selectData);
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin: 15px 0;
  }
</style>
