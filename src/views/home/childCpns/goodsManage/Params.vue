<template>
  <div class="CategoryParams">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectData"
            :options="shopCategory"
            :props="shopCategoryProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加参数</el-button>
          <el-table :data="manyTableData" border style="width: 100%">
            <template slot="empty">
              <img src="~assets/img/no-data.png" alt />
            </template>
            <el-table-column type="expand" width="80">
              <template v-slot="scop">
                <el-tag
                  v-for="(tag,index) in scop.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scop.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="tag-input"
                  v-if="scop.row.inputVisible"
                  v-model="scop.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scop.row)"
                  @blur="handleInputConfirm(scop.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scop">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scop.row.attr_id)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addParams">添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <template slot="empty">
              <img src="~assets/img/no-data.png" alt />
            </template>
            <el-table-column type="expand" width="80">
              <template v-slot="scop">
                <el-tag
                  v-for="(tag,index) in scop.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scop.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="tag-input"
                  v-if="scop.row.inputVisible"
                  v-model="scop.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scop.row)"
                  @blur="handleInputConfirm(scop.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scop.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scop">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scop.row.attr_id)"
                >编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性或添加参数弹窗 -->
    <el-dialog
      :title="this.halfTitle + addDialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addParamsFormClosed"
    >
      <el-form :model="addParamsForm" :rules="addRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
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
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      dialogVisible: false,
      addParamsForm: {
        attr_name: ""
      },
      addRules: {
        attr_name: [
          { required: true, message: "", trigger: "blur" },
          { min: 3, message: "最少3个字符", trigger: "blur" }
        ]
      },
      halfTitle: "",
      attrId: ""
    };
  },
  created() {
    this.getShopCategory();
  },
  methods: {
    //获取分类数据
    async getShopCategory() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败！");
      this.shopCategory = res.data;
    },

    //下拉框改变获取值
    handleChange() {
      this.getParamsList();
    },

    //tab切换
    handleClick() {
      this.getParamsList();
    },
    //获取参数列表
    async getParamsList() {
      if (this.selectData.length !== 3) return (this.selectData = []);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取分类参数失败！");
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName == "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //添加参数、属性弹窗展示
    addParams() {
      this.halfTitle = "添加";
      this.addRules.attr_name[0].message = "请输入" + this.addDialogTitle;
      this.dialogVisible = true;
    },
    //添加参数、属性弹窗关闭
    addParamsFormClosed() {
      this.halfTitle = "";
      this.$refs.addParamsFormRef.resetFields();
    },
    // 确认提交添加参数、属性弹窗
    submitForm() {
      if (this.halfTitle == "添加") {
        this.requestAddParams();
      } else {
        this.requestEditParams();
      }
    },
    //添加参数、属性的数据请求
    requestAddParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201)
          return this.$message.error(this.addDialogTitle + "添加失败！");
        this.$message.success(this.addDialogTitle + "添加成功！");
        this.dialogVisible = false;
        await this.getParamsList();
      });
    },
    //编辑参数、属性的数据请求
    requestEditParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.attrId}`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error(this.addDialogTitle + "编辑失败！");
        this.$message.success(this.addDialogTitle + "编辑成功！");
        this.dialogVisible = false;
        await this.getParamsList();
      });
    },
    //编辑参数、属性
    async editParams(id) {
      this.attrId = id;
      this.halfTitle = "编辑";
      this.addRules.attr_name[0].message = "请输入" + this.addDialogTitle;
      this.dialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败！");
      this.addParamsForm.attr_name = res.data.attr_name;
    },
    //点击tag展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加下拉参数
    handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrValues(row);
    },
    //删除参数
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrValues(row);
    },
    //保存 attr_vals 的操作
    async saveAttrValues(row) {
      this.$message.closeAll();
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改参数失败！");
      this.$message.success("修改参数成功！");
    }
  },
  computed: {
    isDisabled() {
      return this.selectData.length !== 3;
    },
    //获取分类 ID
    cateId() {
      if (this.selectData.length == 3) {
        return this.selectData[2];
      }
      return null;
    },
    //添加参数、属性的弹窗标题
    addDialogTitle() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
    //编辑参数、属性的弹窗标题
    editDialogTitle() {
      if (this.activeName == "many") {
        return "编辑参数";
      } else {
        return "编辑属性";
      }
    }
  }
};
</script>

<style scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.tag-input {
  width: 100px;
}
</style>
