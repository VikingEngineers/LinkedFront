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
    <div class="nav-wrapper">
      <div class="logo">
        <router-link to="/">LinkedMin</router-link>
      </div>
      <div class="nav-links">
        <div class="nav-item" @click="usersOpen = !usersOpen">
          Пользователи
          <div class="dropdown" v-if="usersOpen">
            <RouterLink
                  :to="{ name: 'profiles' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Все пользователи</span>
                </RouterLink>
            <p>
            <a v-if="isAuthenticated" href="/profiles">Мои контакты</a>
            </p>
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
                        class="dropdown-item border-radius-md"
                                                >
                          <span>Мои проекты</span>
            </RouterLink>

            <RouterLink
                        :to="{ name: 'createproject' }"
                        class="dropdown-item border-radius-md"
                          >
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

        
        
        
        </div>
      </div>  

        <div class="nav-item">

          <div v-if="isAuthenticated">
              <router-link to="/pages/landing-pages/basic">
                  <button>Выход</button>
              </router-link>

          </div>
          <div v-else>
              <router-link to="/pages/landing-pages/basic">
                    <button>Вход/регистрация</button>
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
.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
}

.logo {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  position: relative;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
}

.nav-item:hover .dropdown {
  display: block;
}

@media (max-width: 600px) {
  .nav-wrapper {
    flex-direction: column;
  }

  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }

  .dropdown {
    position: relative;
    top: auto;
  }
}
</style>
