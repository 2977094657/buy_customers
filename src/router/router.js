import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/components/Top.vue';
import Main from '@/components/Main.vue';
import Banner from '@/components/Banner.vue';
import Search from "@/components/Search.vue";
import Description from '@/components/Description.vue';

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
    {
        path: '/product/:productId',
        name: 'Product',
        components: {
            top: Top,
            description: Description,
        },
        props: { description: true }
    }
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router;