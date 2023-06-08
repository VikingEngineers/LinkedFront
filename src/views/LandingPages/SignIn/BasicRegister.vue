<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import axios from 'axios';
import { computed } from "vue";

// example components
import NavbarDefault from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

const username = ref('');
const password = ref('');
const email = ref(''); // Add email
const errorMessage = ref('');

const isAuthenticated = computed(() => !!localStorage.getItem('access_token')); // Заменено на localStorage

const errorTranslations = {
  "A user with that username already exists.": "Такой пользователь существует",
  "A user with this email already exists!": "Пользователь с таким адресом электронной почты уже существует!",
  "Enter a valid email address.": "Введите действительный адрес электронной почты.",
  "This password is too short. It must contain at least 8 characters.": "Этот пароль слишком короткий. Он должен содержать не менее 8 символов.",
  "The password is too similar to the username.": "Пароль слишком похож на имя пользователя.",
  "This password is too common." : "Этот пароль слишком распространен.",
  "This password is entirely numeric." : "Этот пароль полностью числовой.",

};


const getErrorMessage = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data.username) {
      return errorTranslations[error.response.data.username[0]] || error.response.data.username[0];
    } else if (error.response.data.email) {
      return errorTranslations[error.response.data.email[0]] || error.response.data.email[0];
    } else if (error.response.data.password) {
      return errorTranslations[error.response.data.password[0]] || error.response.data.password[0];
    } else {
      return JSON.stringify(error.response.data);
    }
  } else if (error.request) {
    // The request was made but no response was received
    return "Ошибка связи с сервером. Пожалуйста, попробуйте снова";
  } else {
    // Something happened in setting up the request that triggered an error
    return `Ошибка: ${error.message}`;
  }
}


// New register function
const register = async () => {
  if (!username.value || !password.value || !email.value) {
    errorMessage.value = "Пожалуйста, заполните все поля.";
  } else {
    const url = 'http://somebodyhire.me/api/register/';
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      username: username.value,
      password: password.value,
      email: email.value, 
      is_staff: false
    };

    try {
      const response = await axios.post(url, body, { headers });
      errorMessage.value = `Регистрация прошла успешно! Добро пожаловать, ${response.data.username}!`; 
      localStorage.setItem('token', response.data.token); 
      router.push({ name: 'Presentation' }); // Redirect to the home page
    } 
    catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
  }
};

onMounted(() => {
  setMaterialInput();
});
</script>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      errorMessage: '',
    };
  },
  methods: {
    register() {
      this.username = username.value;
      this.password = password.value;
      this.email = email.value;
      register();
    },
  },
};
</script>


<template>
    <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                  Регистрация
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <div>
                    <div>
                        <!-- This will be displayed if the user is not authenticated -->
                        <p>Пожалуйста, зарегистрируйтесь</p>
                        <p>Пароль должен быть не менее 8 символов, и не быть похожим на имя пользователя или адрес почты</p>
                    



                      <div>
                        <input v-model="username" type="text" placeholder="Имя пользователя" />
                      </div>

                      <div>
                        <input v-model="email" type="email" placeholder="Email" />
                      </div>


                      <div>
                        <input v-model="password" type="password" placeholder="Пароль" />
                      </div>


                    <div class="text-center">
                      <button
  type="button"
  class="btn bg-gradient-dark w-100 my-4 mb-2"
  @click="register"
>
  Зарегистрироваться
</button>

                    </div>
                      
                    </div>


              <div v-if="errorMessage">
                      <p>{{ errorMessage }}</p>
              </div>
  </div>
                  

                  <p class="mt-4 text-sm text-center">
                    Уже есть аккаунт?
                    <a
                      href="/pages/landing-pages/basic"
                      class="text-success text-gradient font-weight-bold"
                      >Войти</a
                    >
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Header>
</template>

<style scoped>

input {
  width: 100%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #4CAF50; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}

</style>