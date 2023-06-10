<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const isAuthenticated = computed(() => !!localStorage.getItem('token'));

const token = computed(() => localStorage.getItem('token'));

const messageData = ref([]);
const replyData = ref([]);
const debugText = ref('');

const searchResultUsers = ref([]);
const route = useRoute();
const router = useRouter();

const userId = computed(() => localStorage.getItem('user_id'));
const messageId = ref('');
const senderName = '';

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));

const getOneMessage = async () => {
  try { 
    const tokenValue = token.value; 
    const headers = { 
      'Authorization': `Bearer ${tokenValue}`,
    };
    const messageResponse = await axios.get(`http://somebodyhire.me/api/messages/${messageId.value}/`, { headers });
    messageData.value = messageResponse.data;
    debugText.value = JSON.stringify(messageResponse.data);
  } catch (error) {
    console.error('There was an error fetching the messages', error);
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
  const user = searchResultUsers.value.find((user) => user.id === id);
  return user ? user.name : "Кого-то";
};


  const sendMessage = async () => {
    try {
        const headers = { 'Authorization': `Bearer ${token.value}` };
        const data = {
            sender: userId.value,
            recipient: messageData.value.sender,
            name: messageData.value.name,
            email: messageData.value.email,
            subject: replyData.value.subject,
            body: replyData.value.body,
            /* owner: userId.value */
        };
        const response = await axios.post('http://somebodyhire.me/api/messages/create/', data, { headers });
        router.push('/messages#content-2');
    } catch (error) {
        debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
        console.error(error);
    }
};




  const cancelCreate = () => {
    router.push('/messages#content-1');
  };

onMounted(async() => {
    messageId.value = route.params.id;
    await getOneMessage();
    await search();
    replyData.value.subject = "Re: " + messageData.value.subject;


    
     

});


</script>


<template>
  <NavbarDefault />

  <div v-if="isAuthenticated" class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
    <h3 v-if = "messageData" :style="{ fontWeight: '800',  fontFamily: 'PressStart2P, sans-serif' }">Сообщение от {{ findUsername(messageData.sender) }}</h3>
    <!-- <p>{{ debugText }}</p> -->
      <input v-model="messageData.subject" readonly placeholder="Тема сообщения">
      <textarea v-model="messageData.body" readonly placeholder="Текст сообщения"></textarea>


    <h3 :style="{ fontWeight: '800',  fontFamily: 'PressStart2P, sans-serif' }">Ответить</h3>
      <input v-model="replyData.subject" placeholder="Введите тему сообщения">
      <textarea v-model="replyData.body" placeholder="Напишите текст сообщения"></textarea>
      <div class="btn-container">
      <button @click="sendMessage" class="btn-submit">ОТПРАВИТЬ</button>
      <button @click="cancelCreate" class="btn-cancel">ОТМЕНИТЬ</button>
    </div>
  </div>

  <div v-else class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
    <h3>Вы должны войти в систему для просмотра и ответа на сообщения</h3>
    </div>

  <DefaultFooter />
</template> 



<style scoped>
  .one_inbox {
    border-radius: 5px;
    border:2px solid #272424;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-top: 25px;
    margin-bottom: 15px;
    margin-left: 10%;
    margin-right: 10%;
    box-sizing: border-box;
    width: 60%;
  }
  
  .profile-container {
  width: 80%;
  height: auto;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);
  margin: 5% auto;
  background-color: #ffffff57;
  border-radius: 10px;
  align-items: center;
  text-align: center;
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

}

h1,h2{
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
  font-weight: 800;
  text-align: center;
}
p{
  font-family: 'SpaceMono' monospace;
  font-weight: 500;
}
/*button{
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
}*/
.profile-container input, .profile-container textarea {
  width: 70%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #2ca33c; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}
.btn-submit {
  background-color: #4CAF50;
}
.btn-submit:hover {
  background-color: #4caf4f6b;
  color: #535151;
}
.btn-cancel {
  background-color: #f44336;
}
.btn-cancel:hover  {
  background-color: #f4433659;
  color: #535151;
}
.btn-submit,.btn-cancel{
  color: #fff;
  width: 10%;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  font-family: monospace;
  font-weight: 700;
}

</style>