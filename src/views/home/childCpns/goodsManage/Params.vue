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
              :options="shopCategory"
              :props="shopCategoryProps"
              @change="handleChange"
              clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        shopCategory: [],
        selectData: [],
        shopCategoryProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        },
        activeName: 'many'
      }
    },
    created() {
      this.getShopCategory()
    },
    methods: {
      //获取分类数据
      async getShopCategory() {
        const {data: res} = await this.$http.get('categories')
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
        this.shopCategory = res.data
      },

      //下拉框改变获取值
      handleChange() {
        if (this.selectData.length < 3) return this.selectData = []
      },

      //获取参数列表
      getParamsList(){

      },
      //tab切换
      handleClick(tab, event) {

      }

    },
    computed: {
      isDisabled() {
        return this.selectData.length !== 3
      },
      //获取分类 ID
      cateId() {
        if (this.selectData.length == 3) {
          return this.selectData[2]
        }
        return null
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin: 15px 0;
  }
</style>
