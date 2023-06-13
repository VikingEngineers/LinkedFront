<script setup>
import axios from 'axios';
import { onMounted, ref , computed} from "vue";
import { useRoute } from "vue-router";
import NavbarDefault from '../../../examples/navbars/NavbarDefault.vue';
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

const profileId = ref(null);
const route = useRoute();
const profileData = ref([]);
const skillsData = ref([]);


const searchQuery = ref('');
const searchResultProjects = ref([]);
const searchResultUsers = ref([]);

const getProfile = async () => {
    const profileDataRecieved = await axios.get(`http://somebodyhire.me/api/profile/${profileId.value}/`);
    profileData.value = processProfileData(profileDataRecieved.data);

};

const getSkills = async () => {
    const skillsDataRecieved = await axios.get(`http://somebodyhire.me/api/profile/${profileId.value}/skills/`);
    skillsData.value = skillsDataRecieved.data;
};

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

const filteredProjects = computed(() => {
  return searchResultProjects.value.filter(project => project.owner == profileId.value);
});

onMounted(() => {
  search();
});

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
  }


onMounted(async() => {
    profileId.value = route.params.id;
    await getProfile();
    await getSkills();
    await getProjects();
});

</script>


<template>
  <NavbarDefault />
  <div class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
    <div class="profile-container1">
      <img :src="profileData.profile_image" alt="Profile Image">
      <p :style="{fontSize: '18px', marginLeft:'5%'}">{{ profileData.email }}</p>
      <!-- <button >Отправить сообщение</button> -->
      <div class="social-link" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
        <a :href="`${profileData.social_github}`" target="_blank" >GitHub</a>
        <a :href="`${profileData.social_twitter}`" target="_blank" >Twitter</a>
        <a :href="`${profileData.social_vk}`" target="_blank" >VK</a>
        <a :href="`${profileData.social_youtube}`" target="_blank" >YouTube</a>
        <a :href="`${profileData.social_website}`" target="_blank" >Мой сайт</a>
        <router-link :style="{fontSize: '10px'}"
                  :to="{ name: 'message-to', params: { id: route.params.id } }"
                  class="btn_link"
                  >
                  Отправить сообщение
                  </router-link>
      </div>
      
    </div>

      <div class="profile-container2">
      <h1 :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">Профиль пользователя {{ profileData.username }}</h1>
      <P :style="{fontSize: '20px'}">Имя: {{ profileData.name }}</P>
      <p :style="{fontSize: '20px'}">Местоположение: {{ profileData.location }}</p>
      <p :style="{fontSize: '20px'}">Краткое описание: {{ profileData.short_intro }}</p>
      <p :style="{fontSize: '20px'}">Биография: {{ profileData.bio }}</p>
      <p :style="{fontSize: '20px', fontFamily: 'PressStart2P, sans-serif'}">Навыки:</p>
      <p v-for = "skill in skillsData" :key="skill.id" :style="{fontWeight: '900', fontSize: '16px'}">{{ skill.name }} ({{ skill.description }})</p>
      <p :style="{fontSize: '20px', fontFamily: 'PressStart2P, sans-serif'}">Проекты:</p>
      <!-- <p  v-for="project in filteredProjects" :key="project.id" :style="{fontSize: '16px'}">{{ project.title }} ({{ project.description }})</p> -->
      

      <div class="result-grid" :style="{ fontWeight: '600',  fontFamily: 'monospace', flexWrap:'wrap' }" >
        <div :style="{ height:'auto', width:'15vw', flexDirection:'column', alignItems:'center' }" class="result-card" v-for="project in filteredProjects" :key="project.id" >
         <div class="project-title"> <h3 :style="{ fontWeight: '700',  fontSize:'18px', fontFamily: 'PressStart2P, sans-serif' }">{{ project.title }}</h3></div>
         <img :style="{ height:'auto', width:'10vw' }" :src="project.featured_image" alt="Featured image">
            <a :href="`/project/${project.id}`" :style="{ cursor:'pointer', padding:'10px', marginBottom:'5%', backgroundColor:'#4EA852',fontFamily:'monospace', fontSize:'18px', color:'white', borderRadius:'5px'}">Посмотреть</a>
        </div>
      </div>

      </div>
  </div>
  <div class="podval" :style="{fontWeight: '500',  fontFamily: 'monospace' }">Екатерина Кузнецова, Ирина Комарова. 2023 . Использованы материалы Creative Tim.</div>
  
</template> 

<style scoped>

.result-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  padding-left: 7%;
}

.result-card {
  display: flex;
  flex-direction: column;
  /*background-color: #3d913248;*/
  padding: 5px 10px 20px 5px;
  margin: 10px 20px ;
  border-radius: 5px;
  border: 2px solid #4ea85280;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  /*align-items: center;
  position:relative;
  padding-bottom:10%;*/
  text-align: center;
}

.project-title{
  padding-bottom: 25px;
  padding-top: 15px;
}

@media screen and (max-width: 992px) {
  .result-grid {
    padding-right:80px;
  }
  .result-card {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .project-image {
    width: 5vw;
    height: auto;
    margin-bottom: 20px;
  }
  
}

@media screen and (max-width: 600px) {
  .result-grid {
    padding-right:80px;
  }
  .result-card {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .project-image {
    width: 5vw;
    height: auto;
    margin-bottom: 20px;
  }
  
}
.profile-container {
width: 90%;
margin: 50px;
display: flex;
/*padding: 15px 25px;
margin: 5% 25%;
padding: 20px 50px;
box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);
background-color: #ffffff57;
border-radius: 10px;*/
margin-bottom: 5vw;
}
.podval {
  text-align: center;
  bottom: 0;
  width: 100%;
  height: 10px;
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
  margin-left: 25%;
  margin-bottom: 5%;
  width: 50%;
  flex-direction: column;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  }
.social-link a{
  margin: 3% ;
  border-radius: 5px;
  border: 2px solid #4ea852e0;
  width: 20vw;
  padding: 1%;
  }
    
.profile-container p{
 margin-left: 10%;
  }
/*.centr-container{
  text-align: center;
}
.centr-container p{
  margin-left: -0.5%;
  margin-bottom: 5%;
  font-weight: 700;
}*/
.profile-container img {
width: auto;
height: 20vw;
border-radius: 5px;
border: 2px solid #4ea852e0;
box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
/*object-fit: cover;*/
margin-bottom: 20px;
}

h1,h2{
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
  font-weight: 800;
  text-align: center;
  margin-bottom: 5%;
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
  width: 30vw;
  margin-top: 10px;
  margin-left: 30px;
  text-align: center;
}
</style>