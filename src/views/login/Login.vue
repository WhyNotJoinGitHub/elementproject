<template>
  <div class="login">
    <div class="login-container">
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    prefix-icon="el-icon-user-solid"
                    placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    prefix-icon="el-icon-lock"
                    type="password"
                    placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="loginBtn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$message.closeAll();
        this.$refs.loginFormRef.validate(async (valid) => {
          if (!valid) return;
          //数据的解构赋值
          const {data: result} = await this.$http.post("login", this.loginForm)
          if (result.meta.status!==200) return this.$message({
            type:'error',
            message:'账号或密码错误，登录失败！',
            duration:'3000'
          })
          this.$message.success("登录成功！")
          sessionStorage.setItem("token",result.data.token)
          await this.$router.replace('/home')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    background: url("~assets/img/login/loginBanner.png") no-repeat top;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .login-container {
    width: 360px;
    height: 300px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .loginBtn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
