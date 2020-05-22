<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary"
                 icon="el-icon-circle-plus-outline"
      >添加角色
      </el-button>
      <el-table
          :data="rolesList"
          border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom',index == 0 ? 'bdtop' : '','vcenter']"
                    v-for="(item1,index) in scope.row.children"
                    :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="deleteRoles(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[indey==0 ? '' : 'bdtop','vcenter']"
                        v-for="(item2,indey) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable
                            type="success"
                            @close="deleteRoles(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable
                            type="warning"
                            v-for="(item3,indez) in item2.children"
                            :key="item3.id"
                            @close="deleteRoles(scope.row,item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="角色描述">
        </el-table-column>
        <el-table-column
            label="操作"
            width="300">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: []
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取权限数据
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error("获取角色列表失败！")
        this.rolesList = res.data
      },

      //删除权限
      async deleteRoles(role, rightId) {
        this.$message.closeAll();
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (confirmResult !== "confirm") {
          return this.$message.info("取消了删除")
        }
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error("删除权限失败")
        this.$message.success("删除权限成功")
        console.log(role.children);

        //重新赋值
        role.children = res.data
      }
    }
  }
</script>

<style scoped>
  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
