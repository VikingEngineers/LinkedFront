<script setup>
import { onMounted, onUnmounted } from "vue";
import axios from 'axios';
import { ref } from "vue";
import NavbarDefault from "../../../examples/navbars/NavbarDefault.vue";


const searchQuery = ref('');
const searchResultProjects = ref([]);
const searchResultUsers = ref([]);

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


onMounted(() => {
  search();
});

</script>


<template>
<NavbarDefault />

    <!-- <h2 class="result-header">Найдено людей: {{ searchResultUsers.length}} </h2> -->
    <div class="result-grid" :style="{ fontWeight: '900',  fontFamily: 'monospace' }">
      <div class="result-card" v-for="user in searchResultUsers" :key="user.id">
        <h3 :style="{ fontWeight: '900',  fontFamily: 'monospace' }" class="profile-name" >{{ user.username }}</h3>
        <img class="profile-image" :src="user.profile_image" alt="Featured image">
        <p>{{ user.email }}</p>
        <div class="btn_link-container">
        <a class="btn_link" :href="`/profile/${user.id}`">Открыть</a>
        <a class="btn_link" :href="`/profile/${user.id}`">Написать</a>
      </div>
      </div>
    </div>


    <DefaultFooter />
  </template>

<style scoped>
.searchBar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.searchInput {
  /* Makes the search input take up the maximum available width */
  flex-grow: 1;
  /* Adds some padding inside the input field */
  padding: 10px;
  /* Adds some margin to the right side of the input field */
  margin-right: 10px;
  /* Increased the font size a bit */
  font-size: 16px;
}

.searchButton {
  /* Adds some padding inside the button */
  padding: 10px 20px;
  /* Changes the font size */
  font-size: 16px;
  /* Changes the background color of the button */
  background-color: #3d9132;
  /* Changes the color of the text inside the button */
  color: white;
  /* Makes the border corners rounded */
  border-radius: 4px;
  /* Removes the default button border */
  border: none;
  /* Changes the cursor to a hand pointer when hovering over the button */
  cursor: pointer;
}

.searchButton:hover {
  /* Changes the background color of the button when hovering over it */
  background-color: #25581e;
}
.result-header {
  color: #fff;
  background-color:#3d9132;
  padding: 10px;
  text-align: center;
  margin-top: 25px;
  margin-left: 10%;
  width: 80%;
border-radius: 15px;
}

.result-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content:left;
  padding-left: 5%;
}

.result-card {
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
  .result-card {
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
  .result-card {
    width: calc(100% / 2 - 20px);
    padding-bottom:20%;
    margin: 10px 10px;
  }
  .searchButton{
    width: 20%;
  }
}

.profile-name{
  padding-bottom: 15px;
}
h3{
  color:rgb(87, 87, 87);
}
a{
  background-color: #3d9132;
  border-radius: 10px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  width: 50%;
  margin-bottom: 10px;
}
a:hover{
  background-color: #6ac55e;
  color: rgb(61, 61, 61);
}
p{
  font-weight: 500;
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


@media screen and (max-width: 600px) {
  .result-card {
    width: 100%;
  }
}

</style>