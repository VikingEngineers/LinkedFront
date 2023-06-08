<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";



const userId = computed(() => localStorage.getItem('user_id'));
const token = computed(() => localStorage.getItem('token'));

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
    <div class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <h3>Сообщение {{ findUsername(recipientId ) }} от {{ findUsername(userId) }} </h3>
        <input v-model="messageData.subject" placeholder="Введите тему сообщения">
        <textarea v-model="messageData.body" placeholder="Напишите текст сообщения"></textarea>
        <button @click="sendMessage" class="btn-submit">SUBMIT</button>
        <button @click="cancelCreate" class="btn-cancel">CANCEL</button>
    </div>
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

.profile-container input, .profile-container textarea {
  width: 100%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #2ca33c; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}
.text-container {
  width: 90%;
  margin-left: 9%;
  background-color: #ffffff57;
  border-radius: 10px;
  text-align: left;
  margin-bottom: 30px;
}
.social-link {
  margin-left: 5%;
  width: 100%;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  }
.social-link a{
margin: 3% 4%;
border-radius: 5px;
border: 2px solid #4ea852e0;
padding: 7px;
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

button{
  background-color: #3d9132;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 50%;
  margin-bottom: 10px;
}
button:hover{
  background-color: #6ac55e;
  color: rgb(61, 61, 61);
}
.btn_link {
  /* Adds some padding inside the button */
  padding: 10px 20px;
  /* Changes the font size */
  font-size: 16px;
  /* Changes the background color of the button */
  background-color: #4EA852;
  /* Changes the color of the text inside the button */
  color: rgb(255, 255, 255);
  /* Makes the border corners rounded */
  border-radius: 5px;
  /* Removes the default button border */
  border: none;
  /* Changes the cursor to a hand pointer when hovering over the button */
  cursor: pointer;
  width: 70%;
  margin-top: 20px;
  text-align: center;
}

</style>