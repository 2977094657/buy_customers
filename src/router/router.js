import { createRouter, createWebHistory } from 'vue-router';
import Top from '@/components/tailwind/Top.vue';
import Main from '@/components/tailwind/Main.vue';
import Banner from '@/components/tailwind/Banner.vue';
import Search from "@/components/tailwind/Search.vue";
import Description from '@/components/tailwind/Description.vue';
import PersonalCenter from "@/components/tailwind/PersonalCenter.vue";
import Orders from "@/components/tailwind/Orders.vue";
import Vendor from "@/components/tailwind/Vendor.vue";
import Star1 from "@/components/tailwind/Star.vue";
import Address from "@/components/tailwind/Address.vue";
import PersonalInformation from "@/components/tailwind/PersonalInformation.vue";
import ShoppingCart from "@/components/tailwind/ShoppingCart.vue";
import History from "@/components/tailwind/History.vue";
import MyOrders from "@/components/tailwind/MyOrders.vue";
import ConfirmPay from "@/components/tailwind/ConfirmPay.vue";
import Evaluated from "@/components/tailwind/Evaluated.vue";
import Reviews from "@/components/tailwind/Reviews.vue";
import ForgotPassword from "@/components/tailwind/ForgotPassword.vue";

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
    },
    {
        path: '/PersonalCenter',
        name: 'PersonalCenter',
        components: {
            personalCenter: PersonalCenter
        },
        children:[
            {
                path: "InforMation",
                name: "InforMation",
                components: {
                    personalInformation: PersonalInformation,
                    address: Address
                }
            },
            {
                path: "star",
                name: "star",
                components: {
                    star: Star1,
                }
            },
            {
                path: "ShoppingCart",
                name: "ShoppingCart",
                components: {
                    ShoppingCart: ShoppingCart,
                }
            },
            {
                path: "History",
                name: "History",
                components: {
                    History: History,
                }
            },
            {
                path: "MyComments",
                name: "MyComments",
                components: {
                    MyComments: Evaluated,
                }
            },
            {
                path: "MyOrders",
                name: "MyOrders",
                components: {
                    MyOrders: MyOrders,
                }
            },
        ],
    },
    {
        path: '/purchase/:productId',
        name: 'purchase',
        components: {
            top: Top,
            orders: Orders,
        },
        props: { description: true }
    },
    {
        path: '/vendor/:name',
        name: 'vendor',
        components: {
            top: Top,
            vendor: Vendor,
        },
        props: { description: true }
    },
    {
        path: '/ConfirmPay/:id',
        name: 'ConfirmPay',
        components: {
            top: Top,
            ConfirmPay: ConfirmPay,
        },
        props: { description: true }
    },
    {
        path: '/Reviews/:id',
        name: 'Reviews',
        components: {
            top: Top,
            Reviews: Reviews,
        },
        props: { description: true }
    },
    {
        path: '/Reviews/:id',
        name: 'Reviews',
        components: {
            top: Top,
            Reviews: Reviews,
        },
        props: { description: true }
    },
    {
        path: '/forgotPassword',
        name: 'forgotPassword',
        components: {
            forgotPassword:ForgotPassword
        },
    },
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router;
