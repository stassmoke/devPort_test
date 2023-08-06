<template>
  <div class="login">
    <!-- Correct
    login - Samantha
    phone - 1-463-123-4447 -->
      <div class="login-form">
        <div class="login-form__wrapper__title">
          <h5 class="login-form__title">description</h5>
        </div>
        <div class="login-form__content">
          <p class="login-form__description">
            description
          </p>
          <div class="login-form__wrapper__input">
            <input
            :class="[isValidUsername ? '' : 'invalid', 'login-form__name', 'login-form__input']"
            type="text" 
            placeholder="Username"
            v-model="userName"
            @input="validateUsername"
            required
          >
            <div 
              v-if="!isValidUsername"
              class="login-form__input__invalid"
              >
                Only words
            </div>
          </div>
          <div class="login-form__wrapper__input">
            <input 
            :class="[isValidPhoneNumber ? '' : 'invalid', 'login-form__phone', 'login-form__input']"
            type="text" 
            placeholder="Phone Number"
            v-model="userPhone"
            @input="validatePhoneNumber"
            required
          >
            <div
              v-if="!isValidPhoneNumber"
              class="login-form__input__invalid"
            >
              Only numbers and symbols '+', '-', '.'
            </div>
          </div>

          <div v-if="!isFoundUser" class="login-form__error">
            user incorrect
          </div>
          
          <button 
            class="login-form__submit btn" 
            :disabled="!validateForm"
            @click="validateUser()"
          >
            Register
          </button>
        </div>
      </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'login-form',
  data() {
    return {
      userName: '',
      userPhone: '',
      isValidUsername: true,
      isValidPhoneNumber: true,
      loading: false,
      isFoundUser: true,
    }
  },
  methods: {
    async validateUser() {
      this.loading = true

      await axios.get('https://jsonplaceholder.typicode.com/users')
      .then(({data: users}) => {
        this.searchRelevant(users)
      })
      .catch((err) => console.log(err, 'get users err'))
      .finally(() => {
        this.loading = false
      })
    },
    searchRelevant(users) {
      const foundUser = users.find((user) => user.username === this.userName && user.phone === this.userPhone);

      console.log(foundUser, 'search')
      if (foundUser) {
        this.$router.push({path: `${foundUser.id}`})
        return
      }
      this.isFoundUser = false
    },
    validateUsername() {
      const regex = /^[a-zA-Z\s]+$/;
      this.isValidUsername =  regex.test(this.userName || !'');
    },
    validatePhoneNumber() {
      const regex = /^[0-9+.\-]*$/
      this.isValidPhoneNumber = regex.test(this.userPhone);
    },
  },
  computed: {
    validateForm() {
      return (this.userName.length > 0 && this.userPhone.length > 0) && (this.isValidUsername && this.isValidPhoneNumber)
    }
  }
}
</script>

<style lang="sass">
@import '@/assets/styles/_variables.sass'

.login
  width: 100%
  max-width: 44.7rem
  background-color: $lightGrey
  border-radius: 5px
  overflow: hidden

  &-form
    &__wrapper__title
      text-align: center
      background-color: $textGreyLight

    &__title
      color: $textGreyDarkTitle
      font-size: 1.7rem
      font-weight: 300
      margin: 0
      padding: 1.5rem 0

    &__content
      padding: 1.3rem 2.3rem 3rem 2.5rem

    &__description
      color: $textGreyDarkTitle
      font-size: 1.5rem
      font-weight: 300

    &__wrapper__input
      width: 100%

    &__input
      width: 100%

      &__invalid
        color: red
        font-size: 1.1rem
        margin-top: 1rem

    &__name
      margin-bottom: 2rem

    &__submit
      margin-top: 2.5rem
      width: 100%

    &__error
      color: red
      padding-top: 2rem
      font-size: 1.5rem



</style>