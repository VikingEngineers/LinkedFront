<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));
const token = computed(() => localStorage.getItem('token'));

const messageData = ref({
    sender: userId.value, 
    recipient: "",
    name: "",
    email: "",
    subject: "",
    body: "",
});

const router = useRouter();

const debugText = ref('');

// Axios request and response interceptors
axios.interceptors.request.use((request) => {
  debugText.value += '\n\nRequest:\n' + JSON.stringify(request, null, 2);
  return request;
});

axios.interceptors.response.use((response) => {
  debugText.value += '\n\nResponse:\n' + JSON.stringify(response, null, 2);
  return response;
}, (error) => {
  debugText.value += '\n\nResponse Error:\n' + JSON.stringify(error.toJSON(), null, 2);
  return Promise.reject(error);
});

const sendMessage = async () => {
    try {
        const headers = { 'Authorization': `Bearer ${token.value}` };
        const data = {
            sender: userId.value,
            recipient: messageData.value.recipient,
            name: messageData.value.name,
            email: messageData.value.email,
            subject: messageData.value.subject,
            body: messageData.value.body,
            /* owner: userId.value */
        };
        const response = await axios.post('http://somebodyhire.me/api/messages/create/', data, { headers });
        router.push('/messages');
    } catch (error) {
        debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
        console.error(error);
    }
};

const cancelCreate = () => {
    router.push('/send-message');
};


const searchQuery = ref('');
const searchResultProjects = ref([]);
const searchResultUsers = ref([]);

const search = async () => {
  try {
    const projectsResponse = await axios.get(`http://somebodyhire.me/api/search/projects/?search_query=${searchQuery.value}`);
    searchResultProjects.value = projectsResponse.data;

    const usersResponse = await axios.get(`http://somebodyhire.me/api/search/profiles/?search_query=${searchQuery.value}`);
    searchResultUsers.value = usersResponse.data;
  } catch (error) {
    console.error('There was an error fetching the search results', error);
  }
};


onMounted(() => {
  search();
});
</script>


<template>
    <NavbarDefault />
    <div class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <h1 :style="{ fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">Здесь можно отправить сообщение</h1>
        <textarea readonly v-model="debugText"></textarea>
       <!--  <input type="text" v-model="messageData.sender" placeholder="Title"> -->
        <!-- <input type="text" v-model="messageData.recipient" placeholder="Кому отправить сообщение?"> -->
        <!-- <textarea v-model="messageData.name" placeholder="Link to featured image"></textarea> -->
        <!-- <textarea v-model="messageData.email" placeholder="В"></textarea> -->
        <select>
          <option v-for="user in searchResultUsers" :key="user.id" >{{ user.username }}</option>
        </select>
        <input v-model="messageData.subject" placeholder="Введите тему сообщения">
        <textarea v-model="messageData.body" placeholder="Напишите текст сообщения"></textarea>
      <div class="btn-container">
        <button @click="sendMessage" class="btn-link">ОТПРАВИТЬ</button>
        <button @click="cancelCreate" class="btn-link">ОТМЕНИТЬ</button>
      </div>
    </div>

<!--     <div class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <h2 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">{{ profileData.username }}</h2>
        <img :src="profileData.profile_image" alt="Profile Image">
        <p :style="{ fontSize: '24px'}">{{ profileData.email }}</p>
        <div class="social-link" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          <a :href="`${profileData.social_github}`" target="_blank" >GitHub</a>
          <a :href="`${profileData.social_twitter}`" target="_blank" >Twitter</a>
          <a :href="`${profileData.social_vk}`" target="_blank" >VK</a>
          <a :href="`${profileData.social_youtube}`" target="_blank" >YouTube</a>
          <a :href="`${profileData.social_website}`" target="_blank" >Мой сайт</a>
        </div>
        <div class="text-container">
        <p :style="{ fontSize: '24px'}">Местоположение: {{ profileData.location }}</p>
        <p :style="{ fontSize: '24px'}">Краткое описание: {{ profileData.short_intro }}</p>
        <p :style="{ fontSize: '24px'}">Биография: {{ profileData.bio }}</p>
        <a :href="`/editmyprofile`" class="btn_link">Редактировать профиль</a>
      </div>
    </div> -->
    <DefaultFooter />
  </template> 



<style scoped>
.profile-container {
  width: 50%;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);
  margin: 5% auto;
  background-color: #ffffff57;
  border-radius: 10px;
  align-items: center;
  text-align: center;
  flex-direction: column;
  display: flex;
  flex-wrap: wrap;
}
.profile-container input, .profile-container textarea, .profile-container select, .profile-container option {
  width: 100%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #2ca33c; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}

@media screen and (max-width: 992px) {
  .profile-container {
    width: 90%;
  }

}

@media screen and (max-width: 600px) {
  .profile-container {
    width: 90%;
  }

}
.profile-container img {
  width: 250px;
  height: 245px;
  margin-bottom: 20px;
  border-radius: 50%;
  border: 2px solid #4ea852e0;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
}

h1,h2{
  color:rgb(70, 104, 105);
  text-align: center;
  margin-bottom: 3%;
  font-size: 26px;
}
.btn-container{
  flex-direction: row;
  width: 100%;
}
button{
  background-color: #4CAF50;
  border-radius: 5px;
  border: #4CAF50;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 15%;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 1%;
}
button:hover{
  background-color: #4caf4f5d;
  border: #4CAF50;
  color: rgb(27, 27, 27);
}


</style>