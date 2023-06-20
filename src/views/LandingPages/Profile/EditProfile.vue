<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import { useRouter, useRoute } from "vue-router";

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));
const token = computed(() => localStorage.getItem('token'));

const profileId = ref(null);
const profileData = ref([]);
const skillsData = ref([]);
const router = useRouter();
const route = useRoute();
const debugText = ref('');
const selectedImage = ref(null);
const newSkillData = ref({
    name: '',
    description: ''
});


const getProfile = async () => {
    const profileDataRecieved = await axios.get(`https://somebodyhire.me/api/profile/${userId.value}/`);
    profileData.value = processProfileData(profileDataRecieved.data);
};

const getSkills = async () => {
    const skillsDataRecieved = await axios.get(`https://somebodyhire.me/api/profile/${userId.value}/skills/`);
    skillsData.value = skillsDataRecieved.data;
};

const processProfileData = (data) => {
    return {
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        location: data.location || '',
        short_intro: data.short_intro || '',
        bio: data.bio || '',
        social_github: data.social_github || '',
        social_twitter: data.social_twitter || '',
        social_vk: data.social_vk || '',
        social_youtube: data.social_youtube || '',
        social_website: data.social_website || '',
        profile_image: data.profile_image || '',
    };
};

// Эти функции нужны для отображения отладочных сообщений
axios.interceptors.request.use((request) => {
  if (request.data instanceof FormData) {
    const formData = request.data;
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        debugText.value += `\nFile being sent: ${value.name}, size: ${value.size} bytes`;
      } else {
        debugText.value += `\n${key}: ${value}`;
      }
    }
  } else {
    debugText.value += '\n\nRequest:\n' + JSON.stringify(request, null, 2);
  }
  return request;
});

axios.interceptors.response.use((response) => {
  debugText.value += '\n\nResponse:\n' + JSON.stringify(response, null, 2);
  return response;
}, (error) => {
  debugText.value += '\n\nResponse Error:\n' + JSON.stringify(error.toJSON(), null, 2);
  return Promise.reject(error);
});

const onFileChange = (event) => {
    selectedImage.value = event.target.files[0];
    debugText.value = `Selected image: ${selectedImage.value.name}`;
};

const updateProfile = async () => {
  try {
    const tokenValue = token.value;
    const headers = { 
      'Authorization': `Bearer ${tokenValue}`,
      'Content-Type': 'multipart/form-data'
    };

    // Create a new FormData object
    const formData = new FormData();

    formData.append('name', profileData.value.name);
    formData.append('email', profileData.value.email);
    formData.append('username', profileData.value.username);
    formData.append('location', profileData.value.location);
    formData.append('short_intro', profileData.value.short_intro);
    formData.append('bio', profileData.value.bio);
    formData.append('social_github', profileData.value.social_github);
    formData.append('social_twitter', profileData.value.social_twitter);
    formData.append('social_vk', profileData.value.social_vk);
    formData.append('social_youtube', profileData.value.social_youtube);
    formData.append('social_website', profileData.value.social_website);

    if (selectedImage.value) {
      formData.append('profile_image', selectedImage.value);
    };

    await axios.patch(`https://somebodyhire.me/api/profile/${userId.value}/`, formData, { headers });
    router.push('/ViewMyProfile');
  } catch (error) {
    debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
    console.error(error);
  }
};

const addSkill = async () => {
    try {
        const tokenValue = token.value;
        const headers = { 
            'Authorization': `Bearer ${tokenValue}`,
            'Content-Type': 'application/json'
        };
        const skillData = {
            name: newSkillData.value.name,
            description: newSkillData.value.description
        };
        if (skillData.name === '') {
            alert('Введите название навыка');
            return;
        }
        if (skillData.description === '') {
            alert('Введите описание навыка');
            return;
        }
        await axios.post(`https://somebodyhire.me/api/skills/create/`, skillData, { headers });
        await getSkills();
        newSkillData.value.name = '';
        newSkillData.value.description = '';
        location.reload();
    } catch (error) {
        console.error(error);
    }
};
const cancelUpdate = () => {
    router.push('/ViewMyProfile');
};

onMounted(async() => {
    await getProfile();
    await getSkills();
});
</script>

<template>
    <NavbarDefault />
    <div v-if="isAuthenticated" class="profile-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="profile-container1">


         <img class="project-image" :src="profileData.profile_image" alt="Profile image">
        <p>Выберите новое изображение профиля</p>
        <input type="file" accept="image/*" @change="onFileChange">
        <p>Добавить навык</p>
        <div class="skills">
          <input type="text" v-model="newSkillData.name" placeholder="Название">
          <input type="text" v-model="newSkillData.description" placeholder="Описание">
          <button @click="addSkill" class="btn-submit">Добавить</button>
        </div>
        <p :style="{fontSize: '18px'}">Навыки:</p>
        <p v-for = "skill in skillsData" :key="skill.id" :style="{fontSize: '16px'}">{{ skill.name }} ({{ skill.description }})</p>
        
      </div>

      <div class="profile-container2">
        <h1 :style="{ fontSize: '18px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">Редактируем профиль: {{ loggedUserName }}</h1>
        <!-- 
          <p>Отладочный текст</p>
          <textarea readonly v-model="debugText"></textarea>-->
          <p>Псевдоним</p> 
          <input type="text" v-model="profileData.username" placeholder="Имя пользователя">
          <p>Адрес электронной почты</p>
          <input type="email" v-model="profileData.email" placeholder="Email">
          <p>Настоящее имя </p>
          <input type="text" v-model="profileData.name" placeholder="Полное имя">
          <p>Краткая биография</p>
          <input type="text" v-model="profileData.short_intro" placeholder="Краткое описание">
          <p>Местоположение</p>
          <input type="text" v-model="profileData.location" placeholder="Местоположение">
          <p>Биография </p>
          <textarea v-model="profileData.bio" placeholder="Подробное описание"></textarea>
          <p>Ссылка на GitHub</p>
          <textarea v-model="profileData.social_github" placeholder="GitHub"></textarea>
          <p>Ссылка на Twitter</p>
          <textarea v-model="profileData.social_twitter" placeholder="Twitter"></textarea>
          <p>Ссылка на ВКонтакте</p>
          <textarea v-model="profileData.social_vk" placeholder="ВКонтакте"></textarea>
          <p>Ссылка на YouTube</p>
          <textarea v-model="profileData.social_youtube" placeholder="YouTube"></textarea>
          <p>Ссылка на сайт</p>
          <textarea v-model="profileData.social_website" placeholder="Сайт"></textarea>  
          <p></p>

          <button @click="updateProfile" class="btn-submit">Сохранить</button>
          <button @click="cancelUpdate" class="btn-cancel">Отменить</button>
        
        
          <div class="podval1"><DefaultFooter /></div>
      </div>
      
      </div>


    <div v-else>
      <h1>Вы не авторизованы</h1>
      <div class="podval2"><DefaultFooter /></div>
    </div>
    
</template>


<style scoped>
.profile-container {
  /*display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 10px 0px rgba(6, 104, 14, 0.281);*/
  width: 80%;
  height: auto;
  margin: 5% 10%;
  padding: 20px;
}

.podval1 {
  margin-left: -70%;
	width: 150%;
  margin-top: 10%;
}
.podval2 {
  margin-top: 80%;
	width: 100%;

}
.skills button{
  width: 35%;
}
.profile-container1 {
  width: 45%;
float: left;
flex-direction: column;
text-align: center;
height: auto;
  }
.profile-container2 {
    width: 55%;
float: right;
flex-direction: column;
height: auto;
    }
.profile-container img {
  width: 50%;
  height: auto;
  border-radius: 5px;
  object-fit: cover;
  margin-bottom: 20px;
}


.profile-container input, .profile-container textarea {
  width: 70%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #2ca33c; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}

/* Style for smaller screens */
@media (max-width: 768px) {
  .profile-container {
    width: 95%;
  }
}


.btn-submit {
    color: #fff;
    background-color: #4CAF50;
    border: none;
    padding: 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
}

.btn-cancel {
    color: #fff;
    background-color: #f44336;
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
}
</style>