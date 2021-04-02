<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>


<style lang="scss">
@import "./assets/css/global.scss";
* {
  margin: 0;
  padding: 0;
}
input,
button{
  border: 0;
  outline: none;
}
@media only screen and (max-width: 540px) {
  .login,
  .login_box {
    width: 100%;
    height: 100%;
  }
 .el-aside{
    width: 150px !important;
  }
}

@media only screen and (min-width: 540px) {
  .login {
    min-width: 540px;
    height: 100%;
    margin: 0 auto;
    .login_box {
      width: 540px;
    }
  }
}

</style>