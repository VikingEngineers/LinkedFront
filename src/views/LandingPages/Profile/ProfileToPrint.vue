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
    const profileDataRecieved = await axios.get(`https://somebodyhire.me/api/profile/${profileId.value}/`);
    profileData.value = processProfileData(profileDataRecieved.data);

};

const getSkills = async () => {
    const skillsDataRecieved = await axios.get(`https://somebodyhire.me/api/profile/${profileId.value}/skills/`);
    skillsData.value = skillsDataRecieved.data;
};

const search = async () => {
  try {
    const projectsResponse = await axios.get(`https://somebodyhire.me/api/search/projects/?search_query=${searchQuery.value}`);
    searchResultProjects.value = projectsResponse.data;

    const usersResponse = await axios.get(`https://somebodyhire.me/api/search/profiles/?search_query=${searchQuery.value}`);
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
    <div class="profile-container" :style="{ marginBottom:'5vw', fontFamily:'Geneva', fontSize:'24px'}">
      <div class="top-div-1">
        <img class="grayscale" :style="{ height:'200px', width:'auto'}" :src="profileData.profile_image" alt="Profile Image">
      </div>
      <div class="top-div-2">
        <h1 :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'30px'}">{{ profileData.name }}</h1>
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}">Email: {{ profileData.email }}</p>       
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}" v-if="profileData.social_github !== 'No Github Provided'">{{ profileData.social_github }}</p>
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}" >Местоположение: {{ profileData.location }}</p>
        
      </div>
      <div class="bottom-div">
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}">О себе: {{ profileData.short_intro }}</p>
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}">Биография: {{ profileData.bio }}</p>
        Навыки:
        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}"  v-for = "skill in skillsData" >{{ skill.name }}: {{ skill.description }}</p>
        <!-- user profile details -->
        
        

        Проекты: 

        <p :style="{ marginBottom:'1vw', fontFamily:'Geneva', fontSize:'20px'}" v-for = "project in filteredProjects" >{{ project.title }}: {{ project.description }}</p>
      </div>
       
      </div>
      

    <div class="footer" >Портфолио с сайта somebodyhire.me</div>
  </template> 
  
  <style scoped>
  @media print {
    /* layout */
   /* .profile-container {
      width: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
    }*/
    .top-div-1 {
      margin-top: 5%;
      margin-bottom: 5%;
      width: 50%;
      height: 200px;
      float: left; /* выравнивание элемента влево */
    }
    .top-div-2 {
      margin-top: 5%;
      margin-bottom: 5%;
      width: 50%;
      height: 200px;
      float: right; /* выравнивание элемента вправо */
    }
    
    .bottom-div {
      width: 100%;
      height: 500px;
      clear: both; /* отмена выравнивания для поднятия элемента на следующую строку */
    }
   /* .profile-section1 {
      width: 50%;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    }
    .profile-section2 {
      width: 50%;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      float: right;
    }*/
    /* colors */
    body, p, h1, h2, h3, a, div {
      color: #000;
    }
    .footer {
      color: #666;
    }
    
    /* images */
    img.grayscale {
      filter: grayscale(100%);
    }
    
    /* fonts */
    h1 {
      font-size: 20px;
      font-weight: 500;
    }
    p {
      font-size: 12px;
      font-weight: 400;
    }
    
    /* footer */
    .footer {
      text-align: center;
      width: 100%;
      height: 10px;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
  }
  </style>
  