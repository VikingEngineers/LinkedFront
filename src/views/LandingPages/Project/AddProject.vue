<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import { useRouter } from "vue-router";

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));
const token = computed(() => localStorage.getItem('token'));

const projectData = ref({
    title: "",
    description: "",
    featured_image: "",
    demo_link: null,
    source_link: null,
    owner: userId.value,
});

const router = useRouter();
const selectedImage = ref(null);
const debugText = ref('');

// Axios request and response interceptors
axios.interceptors.request.use((request) => {
  debugText.value += '\n\nRequest:\n' + JSON.stringify(request, null, 2);
  return request;
});

axios.interceptors.response.use((response) => {
  debugText.value += '\n\nResponse:\n' + JSON.stringify(response, null, 2);
  return response;
}, (error) => {
  debugText.value += '\n\nResponse Error:\n' + JSON.stringify(error.toJSON(), null, 2);
  return Promise.reject(error);
});

const createProject = async () => {
    try {
        const headers = { 'Authorization': `Bearer ${token.value}` };
        const data = new FormData();
        data.append('title', projectData.value.title);
        data.append('description', projectData.value.description);
        data.append('demo_link', projectData.value.demo_link);
        data.append('source_link', projectData.value.source_link);
        data.append('owner', userId.value);


        if (selectedImage.value) {
            data.append('featured_image', selectedImage.value);
        }
        const response = await axios.post('http://somebodyhire.me/api/projects/create/', data, { headers });
        router.push(`/project/${response.data.id}`);
    } catch (error) {
        debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
        console.error(error);
    }
};

const cancelCreate = () => {
    router.push('/projects');
};
const onFileChange = (event) => {
    selectedImage.value = event.target.files[0];
    debugText.value = `Selected image: ${selectedImage.value.name}`;
};


</script>

<template>
    <NavbarDefault />
    <div v-if="isAuthenticated">
    <div class="profile-container" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <h1 :style="{ fontWeight: '300',  fontFamily: 'PressStart2P, sans-serif', fontSize:'32px', marginBottom:'3%' }">Создание проекта для {{ loggedUserName }}</h1>
        <!-- <textarea readonly v-model="debugText"></textarea> -->
        <input type="text" v-model="projectData.title" placeholder="Добавьте название проекта">
        <input type="text" v-model="projectData.description" placeholder="Добавьте описание проекта">
        <input type="file" accept="image/*" @change="onFileChange" placeholder="Выберите изображение">
        <textarea v-model="projectData.demo_link" placeholder="Ссылка на демонстрацию проекта"></textarea>
        <textarea v-model="projectData.source_link" placeholder="Ссылка на исходный код"></textarea>
        <div class="btn_link-container">
          <button @click="createProject" class="btn-submit">Создать проект</button>
        <button @click="cancelCreate" class="btn-cancel">Отменить</button>
        </div>
    </div>
  </div>
  <div v-else>
    <div :style="{ marginBottom:'25vw', textAlign:'center'}">
      <h1 :style="{ fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif', paddingTop:'10vw'}">Вы не авторизованы!</h1>
    </div>
    </div>
    <DefaultFooter />
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin: 5% auto;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
}

.profile-container img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}


.profile-container input, .profile-container textarea {
  width: 100%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
  font-size: 18px;
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
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
}
.btn-submit:hover {
  color: #5f5e5e;
  background-color: #4caf4f7a;
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