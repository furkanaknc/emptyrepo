<template>
    <div class="container">
      
      <div class="login-card mx-auto">
        <h1>LOGIN</h1>
        <form @submit.prevent="loginUser">
          <div class="form-group ">
            <label for="userName">Kullanıcı İsmi</label>
            <input id="userName" type="text" placeholder="Kullanıcı İsmi" name="userName" v-model="userName" class="login-input form-control">
          </div>
          <div class="form-group">
            <label for="password">Şifre</label>
            <input id="password" type="password" placeholder="şifre" name="password" v-model="password" class="login-input form-control">
          </div>
          <input type="submit" class="btn btn-primary rounded-pill" value="Login">
        </form>
        <br>
        <br>
        <br>
        <br>
      </div>
    </div>
  </template>
  <script>
  import { mapActions } from 'vuex';
  export default{
    data(){
      return{
        userName:"",
        password:""
      };
      
    },
    methods:{
      ...mapActions(['login']),
      loginUser(){
        
        let user ={
          userName:this.userName,
          password:this.password
        }
        this.login(user)
        .then(res=>{
          if(res.data.success){
            this.$router.push("/admin");
          }
        })
        .catch(err=>{
          console.log(err);
        })
      }
    },
  }
</script>

<style scoped>

.login-card{
  margin-top: 100px;
}
.login-card .form-group{
  margin-top: 15px;
}

.btn{
  width: 100px;
  margin-top: 10px;
}

@media only screen and (min-width:1233px) {
  .login-card{
    width: 50%;
  }
}

</style>