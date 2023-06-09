import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import SignInBasicView from "../views/LandingPages/SignIn/BasicView.vue";
import Project from "../views/LandingPages/Project/Project.vue";
import Profile from "../views/LandingPages/Profile/Profile.vue";
import TopSecretProject from "../views/LandingPages/Project/TopSecretProject.vue";
import BasicRegister from "../views/LandingPages/SignIn/BasicRegister.vue";
import ForgotPassword from "../views/LandingPages/SignIn/ForgotPassword.vue";
import Projects from "../views/LandingPages/Project/AllProjects.vue";
import Profiles from "../views/LandingPages/Profile/AllProfiles.vue";
import ViewMyProfile from "../views/LandingPages/Profile/AdmireProfile.vue";
import EditMyProfile from "../views/LandingPages/Profile/EditProfile.vue";
import CreateProject from "../views/LandingPages/Project/AddProject.vue";
import EditProject from "../views/LandingPages/Project/EditProject.vue";
import MyProjects from "../views/LandingPages/Project/MyProjects.vue";
import Message from "../views/LandingPages/Profile/Message.vue";
import FormMessage from "../views/LandingPages/Profile/FormMessage.vue";
import MessageTo from "../views/LandingPages/Profile/MessageTo.vue";
import OpenMessage from "../views/LandingPages/Profile/OpenMessage.vue";
import OneMessage from "../views/LandingPages/Profile/OneMessage.vue";
import NotFoundPage from "../views/Presentation/NotFoundPage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },

    {
      path: '/project/:id',
      name: 'project',
      component: Project
    },

    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },

    {
      path: '/myprojects',
      name: 'myprojects',
      component: MyProjects
    },

    {
      path: '/CreateProject',
      name: 'createproject',
      component: CreateProject
    },
    
    {
      path: '/EditProject/:id',
      name: 'editproject',
      component: EditProject
    },

    {
      path: '/TopSecret',
      name: 'topsecretproject',
      component: TopSecretProject
    },

    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile
    },

    {
      path: '/ViewMyProfile',
      name: 'viewmyprofile',
      component: ViewMyProfile
    },

    {
      path: '/EditMyProfile',
      name: 'editmyprofile',
      component: EditMyProfile
    },

    {
      path: '/profiles',
      name: 'profiles',
      component: Profiles
    },

    {
      path: "/register",
      name: "register",
      component: BasicRegister,
    },

    {
      path: "/forgot",
      name: "forgot",
      component: ForgotPassword,
    },

    {
      path: "/pages/landing-pages/basic",
      name: "signin-basic",
      component: SignInBasicView,
    },
    {
      path: "/messages",
      name: "messages",
      component: Message,
    },
    {
      path: "/send-message",
      name: "send-message",
      component: FormMessage,
    }, 
    {
      path: "/message-to/:id",
      name: "message-to",
      component: MessageTo,
    },
    {
      path: "/open-message/",
      name: "open-message",
      component: OpenMessage,
    },
    {
      path: "/message/:id",
      name: "onemessage",
      component: OneMessage,

    },
    {
      path: "/not-found",
      name: "not-found",
      component: NotFoundPage,
    }, 
    {
      path:'/:catchAll(.*)', 
      redirect: '/not-found'
    }
  ],
});

export default router;
