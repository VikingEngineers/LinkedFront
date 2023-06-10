<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));

const profileData = ref([]);
const skillsData = ref([]);


const getProfile = async () => {
    const profileDataRecieved = await axios.get(`http://somebodyhire.me/api/profile/${userId.value}/`);
    profileData.value = processProfileData(profileDataRecieved.data);
};

const getSkills = async () => {
    const skillsDataRecieved = await axios.get(`http://somebodyhire.me/api/profile/${userId.value}/skills/`);
    skillsData.value = skillsDataRecieved.data;
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

onMounted(async() => {
    await getProfile();
    await getSkills();
});


</script>


<template>
    <NavbarDefault />
    <div v-if="isAuthenticated">
    <div  class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="profile-container1">
        <img :src="profileData.profile_image" alt="Profile Image">
        <p :style="{ fontSize: '24px'}">{{ profileData.email }}</p>
        <div class="social-link" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          <a :href="`${profileData.social_github}`" target="_blank" >GitHub</a>
          <a :href="`${profileData.social_twitter}`" target="_blank" >Twitter</a>
          <a :href="`${profileData.social_vk}`" target="_blank" >VK</a>
          <a :href="`${profileData.social_youtube}`" target="_blank" >YouTube</a>
          <a :href="`${profileData.social_website}`" target="_blank" >Мой сайт</a>
          <a href="/not-found" target="_blank" >404</a>
          <a :href="`/editmyprofile`" >Редактировать профиль</a>
        </div>
      </div>

      <div class="profile-container2">
        <h2 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif', marginBottom:'3%' }">Мой профиль</h2>
        <!-- <h2 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">{{ profileData.username }}</h2> -->
        
        <p :style="{ fontSize: '20px'}">Местоположение: {{ profileData.location }}</p>
        <p :style="{ fontSize: '20px'}">Краткое описание: {{ profileData.short_intro }}</p>
        <p :style="{ fontSize: '20px'}">Биография: {{ profileData.bio }}</p>
        <p :style="{ fontSize: '20px'}">Навыки: </p>
        <p v-for = "skill in skillsData" :key="skill.id" :style="{fontSize: '16px'}">{{ skill.name }} ({{ skill.description }})</p>
        <p :style="{fontSize: '20px'}">Проекты:</p>
      <p v-for = "project in projectsData" :key="project.id" :style="{fontSize: '16px'}">{{ project.title }} ({{ project.description }})</p>
        
      </div>
      
      </div>
      <div class="podval" :style="{fontWeight: '900',  fontFamily: 'monospace' }">Екатерина Кузнецова, Ирина Комарова. 2023 . Использованы материалы Creative Tim.</div>
    </div>
      <div v-else :style="{ marginBottom:'25vw', textAlign:'center'}">
        <h1 :style="{ fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif', paddingTop:'10vw',paddingBottom:'20vw'}">Вы не авторизованы</h1>
        <DefaultFooter />
      </div>
      
  </template> 



<style scoped>
.profile-container {
  width: 90%;
  padding: 20px;
  margin: 50px;
  height: 120%;
 /*border-radius: 10px;
  align-items: center;
  text-align: center;
  box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);
  */
}
.podval {
  height: 50px;
  margin-top: 50%;
  text-align: center;
	width: 100%;
	
}
.profile-container1 {
  width: 45%;
float: left;
flex-direction: column;
text-align: center;
  }
.profile-container2 {
    width: 55%;
float: right;
flex-direction: column;
    }
.social-link {
  /*margin-left: 5%;
  width: 100%;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  text-align: center;*/
  margin-left: 25%;
  margin-bottom: 5%;
  width: 50%;
  flex-direction: column;
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
  width: auto;
  height: 20vw;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 2px solid #4ea852e0;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
}

h1,h2{
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
  font-weight: 800;
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