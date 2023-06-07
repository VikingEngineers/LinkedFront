<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import NavbarDefault from '../../../examples/navbars/NavbarDefault.vue';

const profileId = ref(null);
const route = useRoute();
const profileData = ref([]);

onMounted(async() => {
    profileId.value = route.params.id;
    await getProfile();
});


const getProfile = async () => {
    const profileDataRecieved = await axios.get(`http://somebodyhire.me/api/profile/${profileId.value}/`);
    profileData.value = processProfileData(profileDataRecieved.data);

};
const processProfileData = (data) => {
    return {
        ...data,
        name: data.name || '🤷 No Name Provided',
        location: data.location || '🌍 No Location Provided',
        short_intro: data.short_intro || '📝 No Short Intro Provided',
        bio: data.bio || '📘 No Bio Provided',
        profile_image: data.profile_image || '📷 No Image Provided',
        social_github: data.social_github || '👨‍💻 No Github Provided',
        social_twitter: data.social_twitter || '🐦 No Twitter Provided',
        social_vk: data.social_vk || '🔵 No VK Provided',
        social_youtube: data.social_youtube || '▶️ No YouTube Provided',
        social_website: data.social_website || '🌐 No Website Provided',
    };
};


</script>


<template>
  <NavbarDefault />
  <div class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
    <div class="centr-container">
    <h1 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">Профиль пользователя {{ profileData.username }}</h1>
      <img :src="profileData.profile_image" alt="Profile Image">
      <p :style="{fontSize: '18px'}">{{ profileData.email }}</p>
    </div>
      <P :style="{fontSize: '18px'}">Имя: {{ profileData.name }}</P>
      <p :style="{fontSize: '18px'}">Местоположение: {{ profileData.location }}</p>
      <p :style="{fontSize: '18px'}">Краткое описание: {{ profileData.short_intro }}</p>
      <p :style="{fontSize: '18px'}">Биография: {{ profileData.bio }}</p>
      <!--<p>Ссылка на изображение: {{ profileData.profile_image }}</p>-->
      <p :style="{fontSize: '18px'}">GitHub: {{ profileData.social_github }}</p>
      <p :style="{fontSize: '18px'}">Twitter: {{ profileData.social_twitter }}</p>
      <p :style="{fontSize: '18px'}">VK: {{ profileData.social_vk }}</p>
      <p :style="{fontSize: '18px'}">YouTube: {{ profileData.social_youtube }}</p>
      <p :style="{fontSize: '18px'}">Мой сайт: {{ profileData.social_website }}</p>
      <button >Отправить сообщение</button>
      <RouterLink :style="{fontSize: '20px'}"
                  :to="{ name: 'send-message' }"
                  class="dropdown-item border-radius-md"
                  >
                  Отправить сообщение
                </RouterLink>
  </div>
</template> 

<style scoped>
.profile-container {
width: 50%;
margin: 5% 25%;
padding: 20px 50px;
box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);
background-color: #ffffff57;
border-radius: 10px;
}
.profile-container p{
 margin-left: 10%;
  }
.centr-container{
  text-align: center;
}
.centr-container p{
  margin-left: -0.5%;
  margin-bottom: 5%;
  font-weight: 700;
}
.profile-container img {
width: 150px;
height: 150px;
border-radius: 50%;
/*object-fit: cover;*/
margin-bottom: 20px;
}

h1,h2{
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
  font-weight: 800;
  text-align: center;
}

button{
 /* background-color: #3d9132;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 50%;
  margin-bottom: 10px;
  margin-left: 25%;*/
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
    width: 40%;
    margin-top: 20px;
    text-align: center;
    margin-left: 10%;
}
button:hover{
  background-color: #6ac55e;
  color: rgb(61, 61, 61);
}
</style>