import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/components/Top.vue';
import Main from '@/components/Main.vue';
import Banner from '@/components/Banner.vue';
import Search from "@/components/Search.vue";
import Description from '@/components/Description.vue';
import ProductComments from "@/components/ProductComments.vue";
import PersonalCenter from "@/components/PersonalCenter.vue";

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
            productComments:ProductComments
        },
        props: { description: true }
    },
    {
        path: '/PersonalCenter',
        name: 'PersonalCenter',
        components: {
            top: Top,
            personalCenter: PersonalCenter,
        },
    }
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router;
