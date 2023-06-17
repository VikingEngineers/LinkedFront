<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavbarDefault from '../../../examples/navbars/NavbarDefault.vue';
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";


const projectId = ref(null);
const route = useRoute();
const router = useRouter();
const projectData = ref([]);
const ProjectReviews = ref([]);
const allTags = ref([]);
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
const isLiked = ref(false);


onMounted(async() => {
    projectId.value = route.params.id;
    await getProject();
    await GetProjectReviews();
    await search();
    await getTags();
    checkIfLiked();
    
       
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

  const getTags = async () => {
  try {
    const tagsResponse = await axios.get(`http://somebodyhire.me/api/tags/`);
    allTags.value = tagsResponse.data;
  } catch (error) {
    console.error('There was an error fetching the tags', error);
  }
};

  const findTag = (id) => {
    const tag = allTags.value.find((tag) => tag.id === id);
    return tag.name;
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

  const postLike = async () => {
    try {
        const headers = { 'Authorization': `Bearer ${token.value}` };
        const response = await axios.patch (`http://somebodyhire.me/api/projects/${projectId.value}/like/`, {}, { headers });
        location.reload();
    } catch (error) {
        console.error('There was an error posting the like', error);
    } 
  };

  const checkIfLiked = () => {
    for (let i = 0; i < projectData.value.likes.length; i++) {
        if (projectData.value.likes[i] == userId.value) {
            isLiked.value = true;
        }
    }
};
  
 
</script>


<template>
  <NavbarDefault />
  <div >
    <div class="project-container" :style="{fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="project-container1" v-if="projectData" >
        
        <a v-if="projectData.demo_link" class="project-link" target="_blank" :href="projectData.demo_link">Demo Live</a>
        <a v-if="projectData.source_link" class="project-link" target="_blank" :href="projectData.source_link">Source Code</a>

        <p v-if="projectData && projectData.likes" class="project-votes">Количество лайков: {{ projectData.likes.length }}</p>
        <div v-if = "projectData.owner == userId" class="project-owner-note">
          <a class="btn_link" :href="`/editproject/${projectData.id}`">Редактирование проекта</a>
        </div>
      <div class="btn_link-container">
        <button v-if = "projectData.owner != userId && !isLiked" class="button_like" @click="postLike" > Нравится </button>
        <button v-if = "projectData.owner != userId && isLiked"  class="button_dislike" @click="postLike" > Не нравится </button>

      <p> Тэги проекта:</p>
      <div v-if="allTags != []" class="project-tags"> 
          <span v-for="(tag, index) in projectData.tags" :key="index" class="project-tag">
            {{ findTag(11) }}<span v-if="index < projectData.tags.length - 1">, </span>
          </span>
          </div>


      </div>
      
      </div>
        <div class="project-container2" v-if="projectData" >
          <h1 class="subtitle" :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif',fontSize:'26px' }">{{ projectData.title }}</h1>
          <img class="project-image" :src="projectData.featured_image" alt="Featured image">
          <p class="project-created">Created On: {{ new Date(projectData.created).toLocaleDateString() }}</p>
          
            <p class="project-description">{{ projectData.description }}</p>
            <div v-if="isAuthenticated">
            <div v-if = "projectData.owner != userId" class="project-owner-note">
                
                <!-- <p>
                  {{ debugText  }}
                </p> -->
                <div class="feedback" :style="{fontWeight: '200',  fontFamily: 'monospace' }">
                <input name="username" readonly placeholder="Ваше имя" :value="loggedUserName" />
                <textarea name="comment" v-model="commentData.body" placeholder="Напишите комментарий"></textarea>
                <button class="btn-link" @click="postComment">Отправить</button>
                
              </div>
            </div>
          </div>
            <h3 :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">Feedback</h3>
                <p v-for = "(review, index) in ProjectReviews" :key="index" >
                  <p class="project-review">{{ findUsername(review.owner) }}  :  {{ review.body }}</p>
                </p>
          </div>
        

    </div>
    <div class="podval"><DefaultFooter /></div>
  </div>
 
</template> 


<style scoped>
.project-container {
  margin: 20px 50px;
  padding: 15px 25px;
  /*border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #3d913257;
  border-radius: 10px;
  align-items: center;
  text-align: center;*/
  width: 90%;
}
.podval {
  position: absolute;
	left: 0;
	margin-top: 60%;
	width: 100%;
	height: 80px;
}
@media screen and (max-width: 992px) {
  .podval {
   
    margin-top: 110%;
   
  }
}

@media screen and (max-width: 800px) {
  .podval {

    margin-top: 130%;

  }
}
.project-container1 {
  width: 30%;
float: left;

}
.project-container2 {
  width: 70%;
float: right;

}
.feedback {
  margin: 10px 0px;
  padding: 10px 0;
  flex-direction: column;
  width: 100%;
}
input, textarea{
  border: 1px solid #3d913257;
  border-radius: 5px;
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

.project-review {
  font-size: 20px;
  color: #555;
  border-radius: 5px;
  border: 1px solid #4EA852;
  width: 60%;
  padding-left: 1%;
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
  width: 60%;
}

.project-image {
  width: 40%;
  height: auto;
  margin-bottom: 20px;
}

.project-link{
  font-size: 20px;
  color:rgb(70, 104, 105);
  text-decoration: none;
  padding-right: 5%;
}

.project-votes, .project-vote-ratio, .project-created, .project-owner-id {
  font-size: 18px;
  color: #777;
  margin-top: 2%;
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
  width: 30%;
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
  border: none;
}


button:hover{
  background-color: rgb(206, 206, 206);
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
  width: 70%;
  margin-top: 10px;
  text-align: center;
}
.button_like{
  background-color: #4EA852;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 51%;
  margin-bottom: 10px;
  display: inline-block;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  /* Changes the cursor to a hand pointer when hovering over the button */
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.button_dislike{
  background-color: #913d32;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 51%;
  margin-bottom: 10px;
  display: inline-block;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  /* Changes the cursor to a hand pointer when hovering over the button */
  cursor: pointer;
  margin-top: 5px;
  text-align: center;
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
  width: 70%;
  margin-top: 10px;
  text-align: center;
}
</style>
  