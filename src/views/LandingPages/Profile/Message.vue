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

        <div class="tabs">
          <div id="content-1">
            <div v-for = "message in messageData" :key="message.id" class="one_inbox" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          
              <p :style="{ fontSize: '14px'}">От: {{ findUsername(message.sender) }}</p>
              <p :style="{ fontSize: '14px'}">Кому: {{ findUsername(message.recipient) }} </p>
              <p :style="{ fontSize: '14px'}">Тема: {{ message.subject }}</p>
              <p :style="{ fontSize: '14px'}">Сообщение: {{ message.body }}</p>
            </div>
    
          </div>
          <div id="content-2">
            <div v-for = "message in messageData" :key="message.id" class="one_inbox" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          
              <p :style="{ fontSize: '14px'}">От: {{ findUsername(message.sender) }}</p>
              <p :style="{ fontSize: '14px'}">Кому: {{ findUsername(message.recipient) }} </p>
              <p :style="{ fontSize: '14px'}">Тема: {{ message.subject }}</p>
              <p :style="{ fontSize: '14px'}">Сообщение: {{ message.body }}</p>
            </div>
          </div>
    
          <div class="tabs__links">
            <a href="#content-1">Входящие</a>
            <a href="#content-2">Исходящие</a>
          </div>
        </div>

<!--         <div v-for = "message in messageData" :key="message.id" class="one_inbox" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          
          <p :style="{ fontSize: '12px'}">От: {{ findUsername(message.sender) }}</p>
          <p :style="{ fontSize: '12px'}">Кому: {{ findUsername(message.recipient) }} </p>
          <p :style="{ fontSize: '12px'}">Тема: {{ message.subject }}</p>
          <p :style="{ fontSize: '12px'}">Сообщение: {{ message.body }}</p>
        </div> -->


      
    </div>
    <DefaultFooter />
  </template> 



<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs__links {
  display: flex;
  flex-direction: row;
  order: 0;
  white-space: nowrap;
  margin-bottom: 15px;
  background-color: #fff;
  border: 1px solid #e3f2fd;
  box-shadow: 0 2px 4px 0 #e3f2fd;
}

.tabs__links>a {
  display: inline-block;
  text-decoration: none;
  color: #1976d2;
  padding: 6px 10px;
  text-align: center;
}

.tabs__links>a:hover {
  background-color: rgba(227, 242, 253, 0.3);
}

.tabs>#content-1:target~.tabs__links>a[href="#content-1"],
.tabs>#content-2:target~.tabs__links>a[href="#content-2"],
.tabs>#content-3:target~.tabs__links>a[href="#content-3"] {
  background-color: #bbdefb;
  cursor: default;
}

.tabs>div:not(.tabs__links) {
  display: none;
  order: 1;
  flex-grow: 1;
}

@media (min-width: 576px) {
  .tabs {
    flex-direction: row;
  }

  .tabs__links {
    flex-direction: column;
    border: none;
    box-shadow: none;
  }

  .tabs__links>a {
    border: 1px solid #e3f2fd;
    box-shadow: 0 2px 4px 0 #e3f2fd;
    margin-bottom: 8px;
  }

  .tabs__links>a:last-child {
    margin-bottom: 0;
  }

  .tabs>div:not(.tabs__links) {
    padding-left: 15px;
  }
}

.tabs>div:target {
  display: block;
}


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