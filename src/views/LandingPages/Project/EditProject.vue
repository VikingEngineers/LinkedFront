<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';

const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));
const token = computed(() => localStorage.getItem('token'));

const projectData = ref([]);
const router = useRouter();
const debugText = ref('');
const projectId = ref(null);
const route = useRoute();
const selectedImage = ref(null);
const recievedTags = ref([]);
const updatedTags = ref([]);
const allTags = ref([]);
const newTag = ref('');


axios.interceptors.request.use((request) => {
//   debugText.value += '\n\nRequest:\n' + JSON.stringify(request, null, 2);
  return request;
});

axios.interceptors.response.use((response) => {
//   debugText.value += '\n\nResponse:\n' + JSON.stringify(response, null, 2);
  return response;
}, (error) => {
//   debugText.value += '\n\nResponse Error:\n' + JSON.stringify(error.toJSON(), null, 2);
  return Promise.reject(error);
});

const getProject = async () => {
    try {
        const projectDataRecieved = await axios.get(`https://somebodyhire.me/api/projects/${projectId.value}/`);
        projectData.value = projectDataRecieved.data;
        recievedTags.value = projectData.value.tags;
        updatedTags.value = projectData.value.tags; 
    } catch (error) {
        console.error('There was an error fetching the project data', error);
    }
};


const onFileChange = (event) => {
    selectedImage.value = event.target.files[0];
    // debugText.value = `Selected image: ${selectedImage.value.name}`;
};

const updateProject = async () => {
    try {
        const tokenValue = token.value;
        const headers = { 
            'Authorization': `Bearer ${tokenValue}`,
            'Content-Type': 'multipart/form-data',
            "X-CSRFToken": "{{ csrf_token }}"
        };

        const formData = new FormData();

        formData.append('title', projectData.value.title);
        formData.append('description', projectData.value.description);
        formData.append('demo_link', projectData.value.demo_link);
        formData.append('source_link', projectData.value.source_link);
                


        if (selectedImage.value) {
                formData.append('featured_image', selectedImage.value);
        };
        if (updatedTags.value) {
            updatedTags.value.forEach(tag => {
            formData.append('tags', tag);
        });
        }



        
        const response = await axios.patch(`https://somebodyhire.me/api/projects/${projectId.value}/`, formData, { headers });
        debugText.value = `Form data: ${JSON.stringify(formData, null, 2)}`;
        router.push(`/project/${response.data.id}`);


    }

    
    catch (error) {
        // debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
        console.error(error);
    }
};

const deleteProject = async () => {
    try {
        const tokenValue = token.value;
        const headers = { 
            'Authorization': `Bearer ${tokenValue}`,
            'Content-Type': 'multipart/form-data',
            "X-CSRFToken": "{{ csrf_token }}"
        };


        const response = await axios.delete(`https://somebodyhire.me/api/projects/${projectId.value}/`, { headers });
        router.push('/myprojects');


    }

    
    catch (error) {
        debugText.value = `Error: ${JSON.stringify(error, null, 2)}`;
        console.error(error);
    }
};

const cancelUpdate = () => {
    router.push('/myprojects');
};

const cancelDelete = () => {
    location.reload();
};

const getTags = async () => {
  try {
    const tagsResponse = await axios.get(`https://somebodyhire.me/api/tags/`);
    allTags.value = tagsResponse.data;
  } catch (error) {
    console.error('There was an error fetching the tags', error);
  }
};

  const findTag = (id) => {
    const tag = allTags.value.find((tag) => tag.id === id);
    return tag.name;
  };

  const addTag = () => {
  if (newTag.value) {
    if (!updatedTags.value.includes(newTag.value)) {
      updatedTags.value.push(newTag.value);
    } else {
      console.warn("This tag is already in the list");
    }
  }
};

const deleteTag = (id) => {
  updatedTags.value = updatedTags.value.filter(tagId => tagId !== id);
};
    

onMounted(async() => {
    projectId.value = route.params.id;
    await getProject();
    await getTags();
});


</script>

<template>
    <NavbarDefault />
    <div>

        <div v-if="!isAuthenticated">
            <h1>Вы не авторизованы</h1>
        </div>
        <div v-else class="profile-container">
            <div v-if = "userId == projectData.owner">
        <h2 :style="{ fontSize: '26px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif', marginBottom:'40px', marginTop:'40px' }">Редактирование проекта</h2>

       

        
        <img class="project-image" :src="projectData.featured_image" alt="Featured image">
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Выберите новое изображение проекта:</p>
        <input type="file" accept="image/*" @change="onFileChange">

        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Название проекта:</p>
        <input type="text" v-model="projectData.title" placeholder="Title">
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Описание проекта:</p>
        <input type="text" v-model="projectData.description" placeholder="Description">
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Ссылка на демонстрацию проекта</p>
        <textarea v-model="projectData.demo_link" placeholder="Demo link"></textarea>
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Ссылка на исходный код проекта</p>    
        <textarea v-model="projectData.source_link" placeholder="Source code link"></textarea>

         <!-- Окно с результатами обмена для отладки 
        <textarea readonly v-model="debugText"></textarea> -->
       

        <div>
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace' }">Добавленные теги:</p>
        <div v-for="tag in updatedTags">
            <p :style="{fontWeight: '500',  fontSize:'16px', fontFamily: 'PressStart2P, sans-serif' }">{{ findTag(tag) }}</p>
            <button @click="deleteTag(tag)" class="btn-delete">Удалить</button>
        </div>
        <p :style="{fontWeight: '700',  fontSize:'18px', fontFamily: 'monospace'}">Добавить новый тег: </p>
        <select v-model="newTag">
            <option v-for="tag in allTags" :value="tag.id">{{ tag.name }}</option>
        </select>
        <button @click="addTag" class="btn-add">Добавить</button>
        
        </div>
        


        <div>
        <button @click="updateProject" class="btn-submit">Сохранить</button>
        <button @click="cancelUpdate" class="btn-cancel">Отмена</button>
        <!-- <button @click="deleteProject" class="btn-cancel">Удалить</button> -->
        <a href="#okno" class="btn-cancel">Удалить</a>      
          
        </div> 
        <div id="okno">
            Вы действительно хотите удалить проект?
        <button @click="deleteProject" class="btn-cancel">Удалить</button>
        <button @click="cancelDelete" class="btn-submit">Отмена</button>
          </div>
    </div>

        </div>
    </div>
    <DefaultFooter />
</template>


<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
}

.profile-container img {
  width: auto;
  height: 30vw;
  border-radius: 5px;
  object-fit: cover;
  margin-bottom: 20px;
}
#okno {
    z-index: 101;
    top: 0;
    background: #fcfbfa;
    text-align: center;
    overflow: hidden; 
    -webkit-box-shadow: 0 0 5px black;
    -moz-box-shadow:    0 0 5px black;
    box-shadow:         0 0 5px black;
    width: 30%;
    height: 15%;
    text-align: center;
    padding: 15px;
    border: 3px solid #4CAF50;
    border-radius: 10px;
    color: #4CAF50;
    display: none;
     }
#okno:target {display: block;}

.profile-container input, .profile-container textarea {
  width: 100%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px; /* Add rounded corners */

}
.profile-container select {
  width: 50%; /* Make inputs and textareas take up the full width of the container */
  padding: 10px; /* Add some padding */
  margin-bottom: 15px; /* Add some margin */
  box-sizing: border-box; /* Ensure padding doesn't affect final dimensions */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
}

/* Style for smaller screens */
@media (max-width: 768px) {
  .profile-container {
    width: 95%;
  }
}
.profile-container option{
font-size: 16px;
font-family: monospace;
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
.btn-add {
  color: #fff;
  background-color: #4CAF50;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
  margin-bottom: 50px;
}

.btn-delete {
  color: #fff;
  background-color: #f44336;
  border: none;
  padding: 10px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>