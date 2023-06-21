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
    <div class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="profile-section">
        <img class="grayscale" :src="profileData.profile_image" alt="Profile Image">
        <h1 :style="{fontSize: '24px', fontWeight: '700',  fontFamily: 'monospace' }">{{ profileData.name }}</h1>
        <p :style="{fontSize: '18px', marginLeft:'5%'}">{{ profileData.email }}</p>
        <div class="social-link" :style="{ fontSize: '12px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
          <!-- social links -->
           
          <p v-if="profileData.social_github !== '👨‍💻 No Github Provided'">
            {{ profileData.social_github }}
        </p>
        </div>
      </div>
  
      <div class="profile-section">
        Навыки:
        <p v-for = "skill in skillsData" :style="{fontSize: '12px', fontWeight: '400',  fontFamily: 'monospace' }">{{ skill.name }}: {{ skill.description }}</p>
        <!-- user profile details -->
        
        <p :style="{fontSize: '12px', fontWeight: '400',  fontFamily: 'monospace' }">Мнстоположение: {{ profileData.location }}</p>
        <p :style="{fontSize: '12px', fontWeight: '400',  fontFamily: 'monospace' }">О себе: {{ profileData.short_intro }}</p>
        <p :style="{fontSize: '12px', fontWeight: '400',  fontFamily: 'monospace' }">Биография: {{ profileData.bio }}</p>
        


      </div>
    </div>
    <div class="footer" :style="{fontWeight: '500',  fontFamily: 'monospace' }">Портфолио с сайта somebodyhire.me</div>
  </template> 
  
  <style scoped>
  @media print {
    /* layout */
    .profile-container {
      width: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .profile-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
    }
    
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
      font-size: 24px;
      font-weight: 700;
    }
    p {
      font-size: 12px;
      font-weight: 400;
    }
    
    /* footer */
    .footer {
      text-align: center;
      bottom: 0;
      width: 100%;
      height: 10px;
    }
  }
  </style>
  