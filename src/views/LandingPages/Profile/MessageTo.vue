<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";



const userId = computed(() => localStorage.getItem('user_id'));
const token = computed(() => localStorage.getItem('token'));
const isAuthenticated = computed(() => !!token.value);

const recipientId = ref('');
const debugText = ref('');
const searchResultUsers = ref([]);

const messageData = ref({
    sender: userId.value, 
    recipient: "",
    name: "",
    email: "",
    subject: "",
    body: "",
});

const router = useRouter();
const route = useRoute();



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
            recipient: recipientId.value,
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

const search = async () => {
    try {
        const usersResponse = await axios.get(`http://somebodyhire.me/api/profiles/`);
        searchResultUsers.value = usersResponse.data;
        // debugText.value = JSON.stringify(searchResultUsers.value); 
    } catch (error) {
        console.error('There was an error fetching the search results', error); 
    }
  };

const findUsername = (id) => {
    const user = searchResultUsers.value.find((user) => user.id == id);
    return user ? user.username : '';
};

const cancelCreate = () => {
    router.push('/send-message');
};

onMounted(async() => {
    recipientId.value = route.params.id;
    await search();
});
</script>


<template>
    <NavbarDefault />
    <div v-if="isAuthenticated"
     class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <h3 :style="{ fontWeight: '800',  fontFamily: 'PressStart2P, sans-serif' }">Сообщение {{ findUsername(recipientId ) }} от {{ findUsername(userId) }} </h3>
        <input v-model="messageData.subject" placeholder="Введите тему сообщения">
        <textarea v-model="messageData.body" placeholder="Напишите текст сообщения"></textarea>
        <div class="btn-container">
        <button @click="sendMessage" class="btn-submit">ОТПРАВИТЬ</button>
        <button @click="cancelCreate" class="btn-cancel">ОТМЕНИТЬ</button>
      </div>
    </div>
    <div v-else>
      <h1>Для отправки сообщения необходимо авторизоваться</h1>
    </div>
    <div class="podval"><DefaultFooter /></div>
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
.podval {
  position: absolute;
	left: 0;
	margin-top: 30%;
	width: 100%;
	height: 40px;
}
.profile-container input, .profile-container textarea {
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
  .text-container {
    width: 70%;
    margin: 5% 15%;
  }
}

@media screen and (max-width: 600px) {
  .profile-container {
    width: 90%;
  }
  .text-container {
    width: 70%;
    margin: 5% 15%;
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
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
  font-weight: 800;
  text-align: center;
  margin-bottom: 3%;
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