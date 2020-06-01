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
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCategory(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategory(scope.row.cat_id)">删除
          </el-button>
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
        width="50%"
        @close="addCategoryDialogClosed">
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
    <el-button type="primary" @click="confirmAddCategory">确 定</el-button>
  </span>
    </el-dialog>

    <!--编辑分类-->
    <el-dialog
        title="编辑分类"
        :visible.sync="editCategoryDialogVisible"
        width="50%"
        @close="editCategoryDialogClosed">
      <el-form ref="editCategoryFormRef"
               :model="editCategoryForm"
               :rules="editCategoryFormRules"
               label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmEditCategory(editCategoryForm.cat_id)">确 定</el-button>
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
          cat_pid: 0,
          cat_name: '',
          cat_level: 0
        },
        addCategoryFormRules: {
          cat_name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
          ],
        },
        ParentsCategoryList: [],
        selectCategory: [],
        ParentsCategoryProps: {
          expandTrigger: 'hover',
          checkStrictly: true,
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        editCategoryDialogVisible: false,
        editCategoryForm: {
          "cat_id": '',
          "cat_name": '',
        },
        editCategoryFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
          ],
        },
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
      //分类弹窗关闭事件
      addCategoryDialogClosed() {
        this.$refs.addCategoryFormRef.resetFields();
        this.selectCategory = []
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      },
      //获取添加分类的数据
      async getParentsCategoryList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
        this.ParentsCategoryList = res.data
      },

      //下拉菜单获取值
      handleChange() {
        // console.log(this.selectCategory);
        console.log(this.selectCategory);
        if (this.selectCategory.length > 0) {
          this.addCategoryForm.cat_pid = this.selectCategory[this.selectCategory.length - 1]
          this.addCategoryForm.cat_level = this.selectCategory.length
        } else {
          this.addCategoryForm.cat_pid = 0
          this.addCategoryForm.cat_level = 0
        }
      },
      //确定添加分类事件
      confirmAddCategory() {
        this.$refs.addCategoryFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('categories', this.addCategoryForm)
          if (res.meta.status == !201) return this.$message.error('添加分类失败!')
          this.$message.success('添加分类成功!')
          await this.getCategoryList()
          this.$refs.addCategoryFormRef.resetFields();
          this.addCategoryDialogVisible = false
        })
      },
      //编辑分类弹层关闭
      editCategoryDialogClosed() {
        this.$refs.editCategoryFormRef.resetFields()
        this.editCategoryForm.cat_name = ''
        this.editCategoryForm.cat_id = ''
      },
      //编辑分类
      async editCategory(id) {
        const {data: res} = await this.$http.get('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
        this.editCategoryForm.cat_name = res.data.cat_name
        this.editCategoryForm.cat_id = res.data.cat_id
        this.editCategoryDialogVisible = true
      },
      //提交编辑分类
      async confirmEditCategory(id) {
        this.$refs.editCategoryFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('categories/' + id, {cat_name: this.editCategoryForm.cat_name})
          if (res.meta.status !== 200) return this.$message.error('更新分类失败！')
          this.$message.success('更新分类成功！')
          await this.getCategoryList();
          this.editCategoryDialogVisible = false
        })
      },
      //删除分类
      async deleteCategory(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        console.log(confirm);
        if (confirmResult !== 'confirm') return this.$message.info('取消删除分类！')
        const {data: res} = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
        this.$message.success('删除分类成功！')
        await this.getCategoryList()
      }
    }
  }
</script>

<style scoped>

</style>
