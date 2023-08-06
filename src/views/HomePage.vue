<template>
  <div class="home">
    <login-from/>
  </div>
</template>

<script>

import LoginFrom from '../components/Login/LoginForm.vue';

export default {
  components: {
    LoginFrom
  }
}
</script>

<style lang="sass">

.home
  display: flex
  align-items: center
  justify-content: center

</style>