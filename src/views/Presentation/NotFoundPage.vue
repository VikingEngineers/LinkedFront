<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import vueMkHeader from "@/assets/img/7.jpg";
import axios from 'axios';

//example components
import NavbarDefault from "../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../examples/footers/FooterDefault.vue";
import Header from "../../examples/Header.vue";

</script>

<template>
    <NavbarDefault />
    <h2> Oooopsy...YOU LOST!</h2>
    <h1>404</h1>
    <router-link to="/" class="logo" :style="{ fontSize: '20px', fontWeight: '500',  fontFamily: 'PressStart2P, sans-serif' }">На главную</router-link>
    <DefaultFooter />
</template>