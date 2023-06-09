<!-- Шаблон для страницы, содержимое которой видно только зарегистрированным пользователям -->

<script setup>

import { computed } from "vue";

// example components
import NavbarDefault from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import Header from "@/examples/Header.vue";


const isAuthenticated = computed(() => !!localStorage.getItem('access_token')); // Computed property to check if the user is authenticated

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
                  Забыли пароль?
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <div>
                    <div>
                        <!-- This will be displayed if the user is not authenticated -->
                        <p>Пожалуйста, введите адрес электронной почты</p>               
                      <div>
                        <input v-model="email" type="email" placeholder="Email" />
                      </div>

                    <div class="text-center">
                      <button   type="button"   @click="register" >   Отправить </button>

                    </div>
                      
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
 <!--  <DefaultFooter /> -->
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