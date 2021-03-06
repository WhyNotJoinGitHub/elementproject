<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     icon="el-icon-circle-plus-outline"
                     @click="addUsers"
          >添加用户
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border>
        <template slot="empty">
           <img src="~assets/img/no-data.png" alt="">
        </template>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteUserInfo(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户弹窗-->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClose"
    >
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmAddUsers">确 定</el-button>
			</span>
    </el-dialog>

    <!--编辑用户弹窗-->
    <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
    >
      <el-form :model="editUserFrom"
               :rules="addFormRules"
               ref="editFormRef"
               label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditUserInfo">确 定</el-button>
			</span>
    </el-dialog>

    <!--分配角色弹窗-->
    <el-dialog
        title="分配角色"
        :visible.sync="setRolesDialogVisible"
        width="50%"
        @close="setRolesClose"
    >
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <div>
        分配新角色：
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
              v-for="item in userRolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button @click="setRolesDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmSetRoles">确 定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data() {
      //验证邮箱
      var checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }

      //验证手机
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[34578]\d{9}$$/
        if (!value) {
          return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
          // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
          // 所以在前面加了一个+实现隐式转换
          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在3到10个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在6到15个字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ]
        },
        editUserFrom: {},
        setRolesDialogVisible: false,
        userInfo: {},
        userRolesList: [],
        selectRoleId: ''
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      //获取管理员列表数据
      async getUserList() {
        const {data: res} = await this.$http.get('/users', {params: this.queryInfo});
        if (res.meta.status !== 200) return this.$message.error("获取管理员列表失败！")
        this.userList = res.data.users;
        this.total = res.data.total;
      },

      //每页条数改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },

      //当前页改变
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum;
        this.getUserList();
      },

      //更新用户状态
      async switchChange(status) {
        this.$message.closeAll();
        const {data: res} = await this.$http.put(`users/${status.id}/state/${status.mg_state}`)
        if (res.meta.status !== 200) {
          status.mg_state = !status.mg_state
          return this.$message.error("修改用户状态失败！")
        }
        return this.$message.success("修改用户状态成功！")
      },

      //搜索按钮
      searchData() {
        this.queryInfo.pagenum = 1;
        this.getUserList()
      },

      //增加用户弹框
      addUsers() {
        this.dialogVisible = true
      },

      //增加用户弹框关闭，重置表单
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      },

      //点击按钮，新增用户
      confirmAddUsers() {
        this.$message.closeAll();
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('users', this.addForm)
          console.log(res);
          if (res.meta.status !== 201) return this.$message.error('新增用户失败')
          this.$message.success('新增用户成功')
          //关闭弹窗
          this.dialogVisible = false
          await this.getUserList();
        })
      },

      //编辑用户信息
      async editUserInfo(id) {
        const {data: res} = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return this.$message.error("查询用户信息失败！")
        this.editUserFrom = res.data
        this.editDialogVisible = true
      },

      //修改用户弹框关闭，重置表单
      editDialogClose() {
        this.$refs.editFormRef.resetFields();
      },

      //提交修改后的用户信息
      submitEditUserInfo() {
        this.$message.closeAll();
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('users/' + this.editUserFrom.id, {
            email: this.editUserFrom.email,
            mobile: this.editUserFrom.mobile
          })
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('修改用户信息失败！')
          //关闭弹窗
          this.editDialogVisible = false;
          //刷新数据
          await this.getUserList()
          //提示修改成功
          this.$message.success('修改用户信息成功！')
        })
      },

      //点击按钮删除用户信息
      async deleteUserInfo(id) {
        this.$message.closeAll();
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (confirmResult !== "confirm") {
          return this.$message.info("取消了删除")
        }
        const {data: res} = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error("删除用户失败")
        this.$message.success("删除用户成功")

        //回到第一页
        this.queryInfo.pagenum = 1;
        //刷新数据
        await this.getUserList()
      },

      //分配角色弹窗显示
      async setRoles(role) {
        this.setRolesDialogVisible = true
        this.userInfo = role
        const {data: res} = await this.$http.get('roles')
        this.userRolesList = res.data
      },

      //确认分配角色
      async confirmSetRoles() {
        if (!this.selectRoleId) return this.$message.error('请选择一个新角色')
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectRoleId})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getUserList()
        this.selectRoleId = ''
        this.setRolesDialogVisible = false
      },

      //分配角色弹窗关闭
      setRolesClose() {
        this.selectRoleId = ''
        this.userRolesList = []
      }
    }
  }
</script>

<style scoped>

</style>
