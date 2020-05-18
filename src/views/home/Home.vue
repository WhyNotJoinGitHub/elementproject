<template>
  <el-container class="home-container">
    <el-header>
      <span>电商管理后台系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px' :'200px'">
        <div class="toggle-btn" @click="toggleCollapse">
          <i class="el-icon-s-operation"></i>
        </div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activePath"
        >
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id"
          >
            <template slot="title">
              <i :class="iconFonts[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item.path"
                          v-for="item in item.children"
                          :key="item.id"
                          @click="saveNavStatus(item.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menuList: [],
        iconFonts: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-s-tools',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-data'
        },
        isCollapse: false,
        activePath: ''
      }
    },
    created() {
      this.getMenuList()
      this.activePath = sessionStorage.getItem('activePath')
    },
    methods: {
      //退出登录
      logout() {
        sessionStorage.clear();
        this.$router.replace('/login')
      },
      //获取左侧列表数据
      getMenuList() {
        this.$http.get('menus').then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.menuList = res.data.data
        })
      },
      //左侧折叠切换
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //保存左侧链接激活状态
      saveNavStatus(activePath) {
        sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style scoped lang="scss">
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 16px;
  }

  .el-aside {
    background-color: #333744;

    .toggle-btn {
      background-color: #4a5064;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .el-menu {
    border-right: 0;
  }

  .el-submenu__title {
    color: #fff;
  }
</style>
