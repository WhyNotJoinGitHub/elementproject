<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary"
                 icon="el-icon-circle-plus-outline">添加分类
      </el-button>
      <zk-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          ref="table"
          index-text="序号"
          show-index
          :data="categoryList"
          :selection-type="false"
          :expand-type="false"
          :columns="columns">
        <template v-slot:useful="scope">
          {{scope.row.cat_deleted}}
        </template>
        <template v-slot:operate="scope">
          <el-button type="primary" size="mini" plain v-if="scope.row.cat_level == 0">一级</el-button>
          <el-button type="success" size="mini" plain v-else-if="scope.row.cat_level == 1">二级</el-button>
          <el-button type="warning" size="mini" plain v-else>三级</el-button>
        </template>
      </zk-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30]"
          :page-size="parameter.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "categories",
    data() {
      return {
        categoryList: [],
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_id',
            type: 'template',
            template: 'useful',
          },
          {
            label: '等级',
            prop: 'cat_level',
            type: 'template',
            template: 'operate',
          },
          {
            label: '操作',
            minWidth: '200px',
          },
        ],
        parameter: {
          type: 3,
          pagenum: 1,
          pagesize: 10
        },
        loading: true,
        total: 0
      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      //获取分类数据
      async getCategoryList() {
        const {data: res} = await this.$http.get('categories', {params: this.parameter})
        if (res.meta.status !== 200) {
          this.$message.error("获取商品分类失败！")
          return this.loading = false
        }
        this.categoryList = res.data.result
        this.total = res.data.total
        this.loading = false
      },

      //改变页码
      handleSizeChange(value) {
        this.parameter.pagesize = value
        this.getCategoryList()
      },

      //当前页码
      handleCurrentChange(value) {
        this.parameter.pagenum = value
        this.getCategoryList()
      }
    }
  }
</script>

<style scoped>

</style>
