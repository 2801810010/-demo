<template>
  <div class="home">
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
import {clear} from '../utils/storage'
export default {
  methods:{
    signOut(){
      clear();
      setTimeout(()=>{
        this.$router.push("/login")
      },1000)
    }
  }
}
</script>

<style>

</style>
