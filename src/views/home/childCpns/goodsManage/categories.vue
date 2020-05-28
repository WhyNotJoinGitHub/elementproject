<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary"
                 icon="el-icon-circle-plus-outline"
                 @click="addCategory">添加分类
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
          :columns="columns"
          :show-row-hover="false"
      >
        <template v-slot:useful="scope">
          <i class="el-icon-success" style="color:#409eff;font-size:18px" v-if="scope.row.cat_deleted==false"></i>
          <i class="el-icon-error" style="color:#f00;font-size:18px" v-else></i>
        </template>
        <template v-slot:level="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template v-slot:operate="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5,10, 20, 30]"
          :page-size="parameter.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <!--添加分类-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCategoryDialogVisible"
        width="50%">
      <el-form ref="addCategoryFormRef"
               :model="addCategoryForm"
               :rules="addCategoryFormRules"
               label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
              v-model="selectCategory"
              :options="ParentsCategoryList"
              :props="ParentsCategoryProps"
              clearable
              @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategoryDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
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
            label: "分类名称",
            prop: "cat_name"
          },
          {
            label: "是否有效",
            prop: "cat_id",
            type: "template",
            template: "useful"
          },
          {
            label: "等级",
            prop: "cat_level",
            type: "template",
            template: "level"
          },
          {
            label: "操作",
            minWidth: "200px",
            type: "template",
            template: "operate"
          }
        ],
        parameter: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        loading: true,
        total: 0,
        addCategoryDialogVisible: false,
        addCategoryForm: {
          cat_pid: '',
          cat_name: '',
          cat_level: ''
        },
        addCategoryFormRules: {
          cat_name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
          ],
        },
        ParentsCategoryList: [],
        selectCategory:'',
        ParentsCategoryProps:{
          expandTrigger:'hover',
          checkStrictly:true,
          value:'cat_id',
          label:'cat_name',
          children:'children'
        }
      }
    },
    created() {
      this.getCategoryList();
    },
    methods: {
      //获取分类数据
      async getCategoryList() {
        const {data: res} = await this.$http.get("categories", {
          params: this.parameter
        });
        if (res.meta.status !== 200) {
          this.$message.error("获取商品分类失败！");
          return (this.loading = false);
        }
        this.categoryList = res.data.result;
        this.total = res.data.total;
        this.loading = false;
      },

      //改变页码
      handleSizeChange(value) {
        this.parameter.pagesize = value;
        this.getCategoryList();
      },

      //当前页码
      handleCurrentChange(value) {
        this.parameter.pagenum = value;
        this.getCategoryList();
      },

      //添加分类
      addCategory() {
        this.getParentsCategoryList()
        this.addCategoryDialogVisible = true
      },
      //获取添加分类的数据
      async getParentsCategoryList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
        this.ParentsCategoryList = res.data
      },

      //下拉菜单获取值
      handleChange() {
        console.log(this.selectCategory);
      }
    }
  }
</script>

<style scoped>

</style>
