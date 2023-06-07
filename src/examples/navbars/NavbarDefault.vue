<script setup>
import { RouterLink } from "vue-router";
import { ref, watch, computed } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";

// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

const isAuthenticated = computed(() => !!localStorage.getItem('access_token')); // Заменено на локальную, осторожно

const props = defineProps({
  
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
});

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>

<template>
<nav>
    <div class="nav-wrapper-new">
        <router-link to="/" class="logo" :style="{ fontSize: '20px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">LinkedMin</router-link>
      <div class="nav-links" :style="{ fontSize: '18px', fontWeight: '900',  fontFamily: 'monospace' }">
        <div class="nav-item" @click="usersOpen = !usersOpen">
          Пользователи
          <div class="dropdown" v-if="usersOpen">
            <RouterLink
                  :to="{ name: 'profiles' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Все пользователи</span>
                </RouterLink>
            <a v-if="isAuthenticated" class="dropdown-item border-radius-md" href="/profiles">Мои контакты</a>
          </div>
        </div>

        <div class="nav-item" @click="projectsOpen = !projectsOpen">
          Проекты
          <div class="dropdown" v-if="projectsOpen">
           <RouterLink
                        :to="{ name: 'projects' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Все проекты</span>
                      </RouterLink>
          
          <div v-if="isAuthenticated" class="position-relative">

            <RouterLink
                        :to="{ name: 'myprojects' }"
                        class="dropdown-item border-radius-md">
                          <span>Мои проекты</span>
            </RouterLink>

            <RouterLink
                        :to="{ name: 'createproject' }"
                        class="dropdown-item border-radius-md">
                        <span>Добавить проект</span>
              </RouterLink>
          </div>
        </div>
        </div>


        <div v-if="isAuthenticated" class="nav-item" @click="myMenuOpen = !myMenuOpen">
          Профиль
          <div class="dropdown" v-if="myMenuOpen"> 
                <RouterLink
                  :to="{ name: 'viewmyprofile' }"
                  class="dropdown-item border-radius-md"
                >
                Мой профиль
                </RouterLink>

                <RouterLink
                  :to="{ name: 'editmyprofile' }"
                  class="dropdown-item border-radius-md"
                  >
                Редактировать мой профиль
                </RouterLink> 
                <RouterLink
                  :to="{ name: 'messages' }"
                  class="dropdown-item border-radius-md"
                  >
                Мои сообщения
                </RouterLink>    
        </div>
      </div>  

        <div class="nav-item">
          <div v-if="isAuthenticated">
              <router-link to="/pages/landing-pages/basic">
                  <button class="btn">Выход</button>
              </router-link>
          </div>
          <div v-else>
              <router-link to="/pages/landing-pages/basic">
                    <button class="btn" :style="{ fontSize: '16px', fontWeight: '900',  fontFamily: 'monospace' }">Вход/регистрация</button>
              </router-link>  
          </div>
          </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      usersOpen: false,
      projectsOpen: false,
      myMenuOpen: false,
    };
  },
};
</script>


<style scoped>
.nav-wrapper-new {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1%;
  padding: 0.5rem 2rem;
  background-color: #ffffffa6;
  /*border: 2px solid #4EA852;*/
  border-radius: 5px;
  width: 100%;
}

.logo {
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 900;
  font-size: 200%;
  color: #4EA852;
}

.nav-links {
  gap: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:#002B24;
  font-weight: 700;
  font-family:'Roboto';
  margin-left: 3%;
}

.nav-item {
  position: relative;
  cursor: pointer;
}

.btn{
  border: 2px;
  background-color: #4EA852;
  color: aliceblue;
  margin-top: 10px;
}
.btn:hover{
  border: 2px solid #4EA852;
  background-color: #002B24;
  color: #4EA852;
  margin-top: 10px;
}

.dropdown {
  display: none;
  position: relative;
  top: 100%;
  left: 0;
  background-color: #ffffffa6;
  padding: 1rem;
  border-radius: 5px;
}

.nav-item:hover .dropdown {
  display: block;
}

@media (max-width: 1024px) {
  .nav-wrapper-new {
    display: flex; /* Включаем режим Flexbox. */
    flex-direction: row; /* Держим элементы в строке */
    justify-content: space-between; /* Распределяем элементы внутри шапки */
    flex-wrap: wrap; /* Разрешаем перенос элементов на новую строку */
  }

  .nav-links {
    flex-direction: row;
    gap: 1rem;
  }
  .dropdown {
    position: relative;
    top: auto;
  }
}
</style>
