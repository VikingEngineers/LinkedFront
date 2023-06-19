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
const errorMessage = ref('');

//Это блок для работы с хранилищем сессии - больше не используем на этой странице
// const isAuthenticated = computed(() => !!sessionStorage.getItem('access_token')); 
// const userId = computed(() => sessionStorage.getItem('user_id'));
// const loggedUserName = computed(() => sessionStorage.getItem('username'));
// const isStaff = computed(() => sessionStorage.getItem('is_staff'));
// const token = computed(() => sessionStorage.getItem('token'));

//Тут мы попробуем использовать local storage потому что оно должно работать между вкладками
const isAuthenticatedLocal = computed(() => !!localStorage.getItem('access_token')); 
const userIdLocal = computed(() => localStorage.getItem('user_id'));
const loggedUserNameLocal = computed(() => localStorage.getItem('username'));
const isStaffLocal = computed(() => localStorage.getItem('is_staff'));
const tokenLocal = computed(() => localStorage.getItem('token'));

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Пожалуйста, введите имя пользователя и пароль";
  } else {
    const url = 'http://somebodyhire.me/api/token/';
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      username: username.value,
      password: password.value,
    };

    try {
      const response = await axios.post(url, body, { headers });
      sessionStorage.setItem('access_token', response.data.access); 
      sessionStorage.setItem('username', username.value); 
      sessionStorage.setItem('user_id', response.data.id); 
      sessionStorage.setItem('is_staff', response.data.is_staff); 
      sessionStorage.setItem('token', response.data.token);
      //Дублируем всё, потому что страницы будут переползать постепенно 
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('username', username.value);
      localStorage.setItem('user_id', response.data.id);
      localStorage.setItem('is_staff', response.data.is_staff);
      localStorage.setItem('token', response.data.token);

      location.reload(); // Refresh page
    } catch (error) {
      if (error.response) {
        errorMessage.value = "Неверный логин или пароль"; // 
      } else if (error.request) {
        errorMessage.value = "Нет ответа от сервера, пожалуйста попробуйте снова";
      } else {
        errorMessage.value = error.message;
      }
    }
  }
};

const logout = () => { 
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('username'); 
  sessionStorage.removeItem('user_id');
  sessionStorage.setItem('is_staff', false);
  sessionStorage.removeItem('token');
  //и тут тоже не забываем продублировать
  localStorage.removeItem('access_token');
  localStorage.removeItem('username'); 
  localStorage.removeItem('user_id');
  localStorage.setItem('is_staff', false);
  localStorage.removeItem('token');
  
  location.reload(); // Refresh page after logout
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
      errorMessage: '',
    };
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        this.errorMessage = "Пожалуйста, введите имя пользователя и пароль";
      } else {
        // Implement login logic here
        this.errorMessage = `Ошибка при входе, пожалуйста проверьте имя пользователя и пароль`;
      }
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
                    Вход
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <div>
                    <div v-if="isAuthenticatedLocal">
                        <p>Вы вошли в аккаунт {{ loggedUserNameLocal }}</p>
                        <p>
                          <a href="/ViewMyProfile">Перейти в профиль.</a>
                        </p>
                        <!-- Это должно быть видно только админам -->
                        <div v-if="isStaffLocal">
                            <p>
                            <a href="/admin/">Перейти в панель администратора.</a>
                            </p>
                          </div>
                        <button @click="logout">Выход</button>
                    </div>

                    <div v-else>
                        <!-- This will be displayed if the user is not authenticated -->
                        <p>Пожалуйста, введите логин и пароль</p>

                      <div>
                        <input v-model="username" type="text" placeholder="Имя пользователя" />
                      </div>

                      <div>
                        <input v-model="password" type="password" placeholder="Пароль" />
                      </div>


                    <div class="text-center">
                      <button
                        type="button"
                        
                        @click="login"
                                      >
                          Войти
                      </button>

                    </div>

                    <p class="mt-4 text-sm text-center">
                    Нет аккаунта?
                    <a
                      href="/register"
                      class="text-success text-gradient font-weight-bold"
                      >Зарегистрироваться</a
                    >
                  </p>
                  <p class="mt-4 text-sm text-center">
                   
                   <a
                     href="http://somebodyhire.me/reset_password/"
                     class="text-success text-gradient font-weight-bold"
                     >Забыли пароль?</a
                   >
                 </p>
                      
                    </div>


              <div v-if="errorMessage">
                      <p>{{ errorMessage }}</p>
              </div>
  </div>
                  



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
button{
  background-color: #4CAF50;
  border-radius: 5px;
  border: #4CAF50;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 50%;
  margin-bottom: 10px;
  padding: 3%;
}
button:hover{
  background-color: #4caf4f5d;
  border: #4CAF50;
  color: rgb(27, 27, 27);
}
</style>