<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";

const token = computed(() => localStorage.getItem('token'));

const messageData = ref([]);
const debugText = ref('');
const searchResultUsers = ref([]);

// // Axios request and response interceptors
// axios.interceptors.request.use((request) => {
//   //debugText.value += '\n\nRequest:\n' + JSON.stringify(request, null, 2);
//   return request;
// });

// axios.interceptors.response.use((response) => {
//   // debugText.value += '\n\nResponse:\n' + JSON.stringify(response, null, 2);
//   return response;
// }, (error) => {
//   // debugText.value += '\n\nResponse Error:\n' + JSON.stringify(error.toJSON(), null, 2);
//   return Promise.reject(error);
// });



const getMessages = async () => {
    try { 
      const tokenValue = token.value;
    const headers = { 
      'Authorization': `Bearer ${tokenValue}`,
    };

      const messagesResponse = await axios.get(`http://somebodyhire.me/api/messages/`, { headers });
      messageData.value = messagesResponse.data;
      // debugText.value = JSON.stringify(messagesResponse.data);
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
    return user.name;
  };


onMounted(async() => {
    await search();
    await getMessages();

});


</script>


<template>
    <NavbarDefault />
    <p >{{ debugText }}</p>
    <div class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <h2 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif', marginBottom:'5%' }">Мои сообщения</h2>
      <RouterLink :style="{fontFamily: 'PressStart2P, sans-serif', fontSize: '14px'}"
                  :to="{ name: 'send-message' }"
                  class="btn_link"
                  >
                  Написать сообщение
                </RouterLink> 
        <p :style="{ fontSize: '24px'}">{{ messageData.email }}</p>

        <div v-for = "message in messageData" :key="message.id" class="one_inbox" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          
          <p :style="{ fontSize: '12px'}">От: {{ findUsername(message.sender) }}</p>
          <p :style="{ fontSize: '12px'}">Кому: {{ findUsername(message.recipient) }} </p>
          <p :style="{ fontSize: '12px'}">Тема: {{ message.subject }}</p>
          <p :style="{ fontSize: '12px'}">Сообщение: {{ message.body }}</p>
        </div>


        
        <!-- <div class="one_inbox" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          
          <a class="spantext2" :href="`${messageData.sender}`" target="_blank" >Sender {{ messageData.sender }}</a>
           <a class="spantext2" :href="`${messageData.name}`" target="_blank" >Name {{ messageData.name }}</a>
          <a class="spantext2" :href="`${messageData.email}`" target="_blank" >Email {{ messageData.email }}</a> 
          <a class="spantext2" :href="`${messageData.subject}`" target="_blank" >Subject{{ messageData.subject }}</a>
          <a class="spantext2" :href="`${messageData.body}`" target="_blank" >Body{{ messageData.body}}</a>
          <a class="spantext2" :href="`${messageData.created}`" target="_blank" >Created{{ messageData.created }}</a>
        </div>

        <div class='container_content'>
            <div class="inbox">
              <h3 class="send">New Messages</h3>
              {/*<h4 class="spantext1">Who?</h4>
              <h4 class="spantext1" >What?</h4>
        <h4 class="spantext1">When?</h4>*/}
              <div class="one_inbox">
              <a class="spantext2" href="{% url 'message' message.id %}">message.name</a>
              <a class="spantext2" href="{% url 'message' message.id %}">message.subject</a>
              <a class="spantext2" href="{% url 'message' message.id %}">message.created</a>
                </div>
            </div>
            </div> -->
 <!--        <div class="text-container">
        <p :style="{ fontSize: '24px'}">Местоположение: {{ profileData.location }}</p>
        <p :style="{ fontSize: '24px'}">Краткое описание: {{ profileData.short_intro }}</p>
        <p :style="{ fontSize: '24px'}">Биография: {{ profileData.bio }}</p>
        <a :href="`/editmyprofile`" class="btn_link">Редактировать профиль</a>
      </div> -->
    </div>
    <DefaultFooter />
  </template> 



<style scoped>
/*.inbox{
    text-align: center;
    padding-top: 5%; 
    margin-top: 5%;
    margin-left: 18%;
      width: 1200px;
      height: 700px;
      background: #616161; 
      border-radius: 10px;
      box-shadow: 5px 20px 50px #000;
    justify-content:space-between;
  }
  .inboxtext{
    text-decoration: none;
    font-size: larger;
    color: #282828;  
    border-width: 5%;
    border-color: #66FCF1;
    border-style:solid;
  }
  .spantext1{
    width: 30%;
  
    display:inline-block;
    text-decoration: none;
    font-size: larger;
    color:#999999;
  }*/
  .btn_link {
    /* Adds some padding inside the button */
    padding: 10px;
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
    text-align: center;
  }
  .spantext2{
    width: 30%;
  
    display:inline-block;
    text-decoration: none;
    font-size: larger;
    color:#1b191957;
  }
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
    width: 50%;
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
}
p{
  font-family: 'SpaceMono' monospace;
  font-weight: 500;
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