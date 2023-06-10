<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

const token = computed(() => localStorage.getItem('token'));

const messageData = ref([]);
const debugText = ref('');
const searchResultUsers = ref([]);

const userId = computed(() => localStorage.getItem('user_id'));

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
      //debugText.value = JSON.stringify(messagesResponse.data);
    } catch (error) {
      console.error('There was an error fetching the messages', error);
    }
  };

  const search = async () => {
    try {
        const usersResponse = await axios.get(`http://somebodyhire.me/api/profiles/`);
        searchResultUsers.value = usersResponse.data;
        //debugText.value = JSON.stringify(searchResultUsers.value); 
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
   
       
        <div class="tabs">
          <input type="radio" name="tab-btn" id="tab-btn-1" value="" checked>
          <label for="tab-btn-1">Входящие</label>
          <input type="radio" name="tab-btn" id="tab-btn-2" value="">
          <label for="tab-btn-2">Исходящие</label>
      
          <div id="content-1">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Отправитель</th>
                    <th>Тема</th>
                    <th>Текст</th>
                  </tr>
                </thead>
                <tbody v-for = "message in messageData"  :key="message.id" :style="{ fontFamily: 'monospace' }">
                  <tr v-if="message.recipient == userId"  :key="message.id">
                    <td data-label="Отправитель"><a :href="`/profile/${ message.sender }`">{{ findUsername(message.sender) }}</a></td>
                    <td data-label="Тема"><a :href="`/message/${ message.id }`">{{ message.subject }}</a></td>
                    <td data-label="Текст"><a :href="`/message/${ message.id }`">{{ message.body }}</a></td>
                  </tr>
                  
                </tbody>
            </table>
            </div>
          </div>
          <div id="content-2">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    
                     <th>Получатель</th> 
                    <th>Тема</th>
                    <th>Текст</th>
                  </tr>
                </thead>
                <tbody v-for = "message in messageData"  :key="message.id" :style="{ fontFamily: 'monospace' }">
                  <tr v-if="message.sender == userId"  :key="message.id">
                    <td data-label="Получатель"><a :href="`/profile/${ message.recipient }`">{{ findUsername(message.recipient) }} </a></td>
                    <td data-label="Тема"><a :href="`/message/${ message.id }`">{{ message.subject }}</a></td>
                    <td data-label="Текст"><a :href="`/message/${ message.id }`">{{ message.body }}</a></td>
                  </tr>
                  
                </tbody>
            </table>
            </div>
          </div>
        </div>
    </div>
    <div class="podval"><DefaultFooter /></div>
  </template> 



<style scoped>
.tabs {
  max-width: 100%;
}

.tabs>input[type="radio"] {
  display: none;
}

.tabs>input[type="radio"]:checked+label {
  background-color: #4EA852;
  color: aliceblue;
  font-family: monospace;
  font-size: 20px;
}

.tabs>div {
  /* скрыть контент по умолчанию */
  display: none;
  padding: 10px 15px;
}

/* отобразить контент, связанный с вабранной радиокнопкой (input type="radio") */
#tab-btn-1:checked~#content-1,
#tab-btn-2:checked~#content-2,
#tab-btn-3:checked~#content-3 {
  display: block;
}

.tabs>label {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: #eee;
  border: 1px solid transparent;
  padding: 2px 8px;
  font-size: 16px;
  line-height: 1.5;
  border-radius: 4px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  margin-left: 6px;
  cursor: pointer;
  margin-bottom: 10px;

  color: #4EA852;
  font-family: monospace;
  font-size: 20px;
}

.tabs>label:first-of-type {
  margin-left: 0;
}
#content-1,#content-2{
  align-items: center;
  text-align: center;
  padding-left: 20%;
}


.podval {
  position: absolute;
	left: 0;
	margin-top: 40%;
	width: 100%;
	height: 40px;
}


.table-wrap {
  text-align: center;
  display: inline-block;
  padding: 0,5vw;
  margin-left: -25%;
  color: #4EA852;
}

table {
  border: 1px solid #ccc;
  width: 100%;
  margin:0;
  padding:0;
  border-collapse: collapse;
  border-spacing: 0;
  
}

table tr {
  border: 1px solid #ddd;
  padding: 5px;
  
}

table th, table td {
  padding: 15px 75px 15px 15px;
  text-align: left;
  border-right: 1px solid #ddd;
  
}

table th {
  color: #fff;
  background-color: rgb(70, 104, 105);
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: PressStart2P, sans-serif;
}


@media screen and (max-width: 600px) {
table {
  border: 0;
}
table thead {
  display: none;
}
table tr {
  margin-bottom: 10px;
  display: block;
  border-bottom: 2px solid #ddd;
}
table td {
  display: block;
  text-align: right;
  font-size: 13px;
  border-bottom: 1px dotted #ccc;
  border-right: 1px solid transparent;
}
table td:last-child {
  border-bottom: 0;
}
table td:before {
  content: attr(data-label);
  float: left;
  text-transform: uppercase;
  font-weight: bold;
}
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
    width: 60%;
  }
  
  .profile-container {
  width: 60%;
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