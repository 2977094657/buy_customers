import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/components/Top.vue';
import Main from '@/components/Main.vue';
import Banner from '@/components/Banner.vue';
import Search from "@/components/Search.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        components: {
            top: Top,
            banner: Banner,
            main: Main,
        }
    },
    {
        path: '/search/:keyword',
        name: 'Search',
        components: {
            top: Top,
            search: Search,
        },
        props: { search: true }
    },
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router;
