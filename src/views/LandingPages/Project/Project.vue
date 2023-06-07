<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import NavbarDefault from '../../../examples/navbars/NavbarDefault.vue';


const projectId = ref(null);
const route = useRoute();
const projectData = ref([]);
const ProjectReviews = ref([]);
const commentData = ref({
    body: "",
});

const searchQuery = ref('');
const searchResultUsers = ref([]);

// Всё заменено на localStorage
const isAuthenticated = computed(() => !!localStorage.getItem('access_token'));
const userId = computed(() => localStorage.getItem('user_id'));
const loggedUserName = computed(() => localStorage.getItem('username'));
const token = computed(() => localStorage.getItem('access_token'));

const debugText = ref('Debug Text');  


onMounted(async() => {
    projectId.value = route.params.id;
    await getProject();
    await GetProjectReviews();
    await search();
});


const getProject = async () => {
    try {
        const projectDataRecieved = await axios.get(`http://somebodyhire.me/api/projects/${projectId.value}/`);
        projectData.value = projectDataRecieved.data;
    } catch (error) {
        console.error('There was an error fetching the project data', error);
    }
};

const GetProjectReviews = async () => {

    try {
        const ProjectReviewsRecieved = await axios.get(`http://somebodyhire.me/api/projects/${projectId.value}/reviews/`);
        ProjectReviews.value = ProjectReviewsRecieved.data;
    } catch (error) {
        console.error('There was an error fetching the project reviews', error);
}

}

const search = async () => {
    try {
        const usersResponse = await axios.get(`http://somebodyhire.me/api/search/profiles/?search_query=${searchQuery.value}`);
        searchResultUsers.value = usersResponse.data;
        // debugText.value = JSON.stringify(usersResponse.data); 
    } catch (error) {
        console.error('There was an error fetching the search results', error); 
    }
  };

  const findUsername = (id) => {
    const user = searchResultUsers.value.find((user) => user.id === id);
    return user.name;
  };

  const postComment = async () => {
    try {
        const headers = { 'Authorization': `Bearer ${token.value}` };
        const data = {
          body: commentData.value.body,
        }
        debugText.value = JSON.stringify(data);
        const response = await axios.post(`http://somebodyhire.me/api/projects/${projectId.value}/reviews/create/`, data, { headers });
        ProjectReviews.value.push(response.data);
        debugText.value = JSON.stringify(response.data);

    } catch (error) {
        console.error('There was an error posting the comment', error);
        debugText.value = JSON.stringify(error);
    }
  };





</script>


<template>
  <NavbarDefault />
    <div v-if="projectData" class="project-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <h1 class="subtitle" :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">{{ projectData.title }}</h1>
      <div v-if = "projectData.owner == userId" class="project-owner-note">
        <a :href="`/editproject/${projectData.id}`">Редактирование проекта</a>
      </div>
      <img class="project-image" :src="projectData.featured_image" alt="Featured image">
      <p class="project-description">{{ projectData.description }}</p>
      <a v-if="projectData.demo_link" class="project-link" target="_blank" :href="projectData.demo_link">Demo Link</a>
      <a v-if="projectData.source_link" class="project-link" target="_blank" :href="projectData.source_link">Source Link</a>


      <p  class="project-votes">Понравилось {{ projectData.likes }} пользователей</p>
      <p class="project-created">Created On: {{ new Date(projectData.created).toLocaleDateString() }}</p>

        <button v-if = "projectData.owner != userId"  class="button_like">
          Нравится
        </button>

        <button v-if = "projectData.owner != userId"  class="button_dislike">
          Не нравится
        </button>
      <p class="project-tags"> 
        <span v-for="(tag, index) in projectData.tags" :key="index" class="project-tag">
          {{ tag }}<span v-if="index < projectData.tags.length - 1">, </span>
        </span>
        </p>

      <p v-for = "(review, index) in ProjectReviews" :key="index" class="project-review">
        <p>От пользователя {{ findUsername(review.owner) }}  : </p>

        {{ review.body }}
      </p>

      <div v-if = "projectData.owner != userId" class="project-owner-note">
      <h3 :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">Feedback</h3>
      <!-- <p>
        {{ debugText  }}
      </p> -->
      <div class="feedback" :style="{fontWeight: '200',  fontFamily: 'monospace' }">
      <input name="username" readonly placeholder="Ваше имя" :value="loggedUserName" />
      <textarea name="comment" v-model="commentData.body" placeholder="Напишите комментарий"></textarea>
      <button class="button" @click="postComment">Отправить</button>
    </div>
      </div>
  </div>
</template> 


<style scoped>
.project-container {
  margin: 20px 450px;
  padding: 15px 5px;
  /*border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #3d913257;*/
  border-radius: 10px;
  align-items: center;
  text-align: center;
  width: 50%;
}
.feedback {
  margin: 10px 30px;
  padding: 10px 0;
  flex-direction: column;
  width: 100%;
}
input, textarea, select, option{
  border: 1px solid #3d913257;
  border-radius: 5px;
  border-radius: 10px;
  width: 60%;
  margin-bottom: 1%;
  padding: 1%;
  background-color: #3d91322d;
}

.project-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.project-subtitle {
  font-size: 18px;
  color: #555;
}

.project-owner-note {
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
}

.project-description {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.project-image {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.project-link{
  font-size: 16px;
  color: #337ab7;
  text-decoration: none;
  margin: 5%;
}

.project-votes, .project-vote-ratio, .project-created, .project-owner-id {
  font-size: 14px;
  color: #777;
}

.project-tags {
  font-size: 14px;
  color: #333;
}

.project-tag {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 2px 5px;
  margin: 2px;
}

h1,h2{
  /*font-family: 'PressStart2P';*/
  color:rgb(70, 104, 105);
}
p{
  font-family: 'SpaceMono' monospace;
}

button
{
  background-color: #3d9132;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 60%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-block;
}


button:hover{
  background-color: #6ac55e;
  color: rgb(61, 61, 61);
}

.button_like{
  background-color: #3d9132;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 60%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-block;
}

.button_dislike{
  background-color: #913d32;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 60%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-block;
}
</style>
  