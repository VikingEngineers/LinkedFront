<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import vueMkHeader from "@/assets/img/7.jpg";
import axios from 'axios';

//example components
import NavbarDefault from "../..//examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../examples/footers/FooterDefault.vue";
import Header from "../../examples/Header.vue";


const searchQuery = ref('');
const searchResultProjects = ref([]);
const searchResultUsers = ref([]);
const searchButtonIsPressed = ref(false);
const allTags = ref([]);

//Тут мы попробуем использовать local storage потому что оно должно работать между вкладками
const isAuthenticatedLocal = computed(() => !!localStorage.getItem('access_token')); 
const userIdLocal = computed(() => localStorage.getItem('user_id'));
const loggedUserNameLocal = computed(() => localStorage.getItem('username'));
const isStaffLocal = computed(() => localStorage.getItem('is_staff'));
const tokenLocal = computed(() => localStorage.getItem('token'));

const search = async () => {
  try {
    const projectsResponse = await axios.get(`https://somebodyhire.me/api/search/projects/?search_query=${searchQuery.value}`);
    searchResultProjects.value = projectsResponse.data;

    const usersResponse = await axios.get(`https://somebodyhire.me/api/search/profiles/?search_query=${searchQuery.value}`);
    searchResultUsers.value = usersResponse.data;
    searchButtonIsPressed.value = true;
  } catch (error) {
    console.error('There was an error fetching the search results', error);
  }
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


onMounted(async() => {
    await search();
    await getTags();      
});

</script>

<script>
import PresentationCounter from "./Sections/PresentationCounter.vue";

export default {
    data() {
        return {
            projects: [],
        };
    },
    async created() {
        try {
            const response = await axios.get("https://somebodyhire.me/api/projects/");
            this.projects = response.data;
        }
        catch (error) {
            console.error("There was an error fetching the projects", error);
        }
    },
    components: { PresentationCounter }
};
</script>



<template>
  <!-- <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div> -->
  <Header>
    <div
      class="page-header min-vh-50"
      :style="`background-image: url(${vueMkHeader})`"
      loading="lazy"
    >
    <div class="container">
      <NavbarDefault :sticky="true" />
      <div class="place-for-text">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">

            <div v-if="isAuthenticatedLocal">
                <h2
                class="text-white pt-3 mt-n5 me-2"
                :style="{ display: 'inline-block ', fontFamily: 'PressStart2P, sans-serif' }"
                > 
                Привет, {{ loggedUserNameLocal }}!</h2>
                <p class="lead text-white px-5 mt-3" :style="{ fontSize: '27px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">
                  В поисках чего-то интересного?
                  </p>
            </div>

              <div v-else>
                <!-- <h1
                class="text-white pt-3 mt-n5 me-2"
                :style="{ display: 'inline-block ', fontFamily: 'PressStart2P, sans-serif'  }">LinkedMin</h1> -->
                <p class="lead text-white px-5 mt-3" :style="{ fontSize: '27px', fontWeight: '900',  fontFamily: 'PressStart2P, sans-serif' }">
                  Показывай себя и свои проекты.  
                   Находи вдохновение, коллег и новые знания.
                </p>
              </div>

         
        </div>
        </div>
      </div>

            <div class="searchBar">
                <input :style="{ fontWeight: '900',  fontFamily: 'monospace' }" class="searchInput" type="text" v-model="searchQuery" @keyup.enter="search" placeholder="Поиск по проектам и людям" />
                <button :style="{ fontWeight: '900',  fontFamily: 'monospace', fontSize:'20px' }" class="searchButton" type="submit" @click="search">GO!</button>
             </div>

  </div>
  
</div>

</Header>
<PresentationCounter />
<div v-if="searchResultProjects.length > 0 || searchResultUsers.length > 0">
    <h2 class="result-header" :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif', fontSize:'24px' }">Найдено проектов: {{ searchResultProjects.length}} </h2>
    <div class="result-grid" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="result-card-project" v-for="project in searchResultProjects" :key="project.id">
        <h3 :style="{ fontWeight: '700',  fontFamily: 'monospace', fontSize:'24px', marginBottom:'15px', marginTop:'25px' }">{{ project.title }}</h3>
        <img class="project-image" :src="project.featured_image" alt="Featured image">
        <div class="tags-container" v-if="project.tags.length > 0 ">

        <span :style="{ padding:'15px 5px'}" class="tag" v-for="tag in project.tags" :key="tag.id">[{{ findTag(tag) }}] </span>
       </div>

        <div class="btn_link-container">
        <a :href="`project/${project.id}`" class="btn_link">Посмотреть</a>
      </div>
      </div>
    </div>
<h2 class="result-header" :style="{ fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif', fontSize:'24px' }">Найдено профилей: {{ searchResultUsers.length}} </h2>
    <div class="result-grid" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="result-card-profile" v-for="user in searchResultUsers" :key="user.id">
        <h3 :style="{ fontWeight: '900',  fontFamily: 'monospace', fontSize:'24px', marginBottom:'15px', marginTop:'25px'}">{{ user.username }}</h3>
        <img class="profile-image" :src="user.profile_image" alt="Featured image">
        <p :style="{ padding:'5px'}">{{ user.short_intro }}</p> 
        
        
        
        <!-- краткое описание -->

        <!--<div v-if="user.skill.length > 0 ">
          <div class="tags-container">
          <div class="tags" v-for="user in searchResultUsers" :key="user.skill">
            <p>{{ user.skill }}</p>  скиллы пользователя 
          </div>
        </div>
      </div>-->
        
        <div class="btn_link-container">

        <a :href="`/profile/${user.id}`" class="btn_link">Открыть</a>
        <a :href="`/message-to/${user.id}`" class="btn_link">Написать</a>

      </div>
    </div>
    </div>
  </div>
  <div v-else>
    <div v-if = "searchQuery.length > 0 && searchButtonIsPressed === true" >
      <h2 class="result-header">Увы и ах! Такого нет (</h2>
    </div>
  </div>

  <DefaultFooter />
</template>


<style scoped>
.project-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.project-card-new {
  /*flex-basis: calc(33.33% - 1em);  1em is for margin */
  /*margin: 0.5em;
  padding: 1em;*/
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  box-sizing: border-box;
  border-color: #4EA852;
}
.place-for-text{
  padding-top: 10%;
}
.searchBar {
  display: flex;
  margin-top: 3%;
  padding-bottom: 10%;
  justify-content: center;
  align-items: center;
}
@media (max-width: 1024px) {
  .searchBar {
    margin-top: 1%;
    margin-bottom: 5%;
    padding-bottom: 5%;
  }
}
.searchInput {
  /* Makes the search input take up the maximum available width */
  flex-grow: 1;
  /* Adds some padding inside the input field */
  padding: 10px;
  /* Adds some margin to the right side of the input field */
  margin-right: 10px;
  margin-top: 20px;
  /* Increased the font size a bit */
  font-size: 16px;
  border-radius: 1%;

  border: 2px solid #4EA852;
  border-radius: 5px;
  outline: none;
  background: #ffffffa6;
  color: #002B24;
}

.searchButton {
  /* Adds some padding inside the button */
  padding: 10px 20px;
  /* Changes the font size */
  font-size: 16px;
  /* Changes the background color of the button */
  background-color: #4EA852;
  /* Changes the color of the text inside the button */
  color: rgb(255, 255, 255);
  /* Makes the border corners rounded */
  border-radius: 4px;
  /* Removes the default button border */
  border: none;
  /* Changes the cursor to a hand pointer when hovering over the button */
  cursor: pointer;
  width: 10%;
  margin-top: 20px;
  
}

.searchButton:hover {
  /* Changes the background color of the button when hovering over it */
  background-color: #002B24;
  border: 2px solid #4EA852;
  color: rgb(228, 228, 228);
}
.result-header {
  color: #002B24;
  /*background-color:#002B24;*/
  padding: 20px;
  text-align:center;
  margin-top: 25px;
  margin-bottom: 25px;
  margin-left: 10%;
  width: 80%;
  border-radius: 15px;
}

.result-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  padding-left:120px;
}

.result-card-project {
  display: flex;
  flex-direction: column;
  /*background-color: #3d913248;*/
  padding: 0.5vw;
  margin: 10px 20px;
  border-radius: 10px;
  border: 2px solid #4ea85280;
  width: calc(90% / 3 - 20px);
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  align-items: center;
  position:relative;
  padding-bottom:10%;
  text-align: center;
}
.result-card-profile {
  display: flex;
  flex-direction: column;
  /*background-color: #3d913248;*/
  padding: 5px;
  margin: 10px 20px;
  border-radius: 10px;
  border: 2px solid #4ea85280;
  width: calc(90% / 4 - 20px);
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  align-items: center;
  position:relative;
  padding-bottom:10%;
  text-align: center;
}
@media screen and (max-width: 992px) {
  .result-grid {
    padding-right:80px;
  }
  .result-card-project {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .result-card-profile {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .searchButton{
    width: 20%;
  }
}

@media screen and (max-width: 600px) {
  .result-grid {
    padding-right:80px;
  }
  .result-card-project {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .result-card-profile {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .searchButton{
    width: 20%;
  }
}

.project-image {
  /*width: 70%;
  height: 70%;*/
  height: 10vw;
  margin-bottom: 20px;
  margin-top: 20px;
}
.profile-image {
  width: auto;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 2px solid #4ea852e0;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
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
.btn_link-container{
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  position:absolute;
  bottom:0;
  margin-top: 5%;
  margin-bottom: 5%;
}

.tags-container{
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tags{
  border: 2px solid #4EA852;
  color: rgb(228, 228, 228);
  margin: 2%;
}
</style>