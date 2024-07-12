import {createRouter, createWebHistory} from 'vue-router';
import {ref} from 'vue';
import Search from "@/components/tailwind/Search.vue";
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
import Home from "@/components/tailwind/page/Home.vue";
import Test from "@/components/tailwind/Test.vue";
import Product from "@/components/tailwind/page/Product.vue";
import {useStore} from "@/store";
import InforMation from "@/components/tailwind/page/InforMation.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/test',
        name: 'test',
        component: Test,
    },
    {
        path: '/search/:keyword',
        name: 'Search',
        component: Search,
        props: {search: true}
    },
    {
        path: '/product/:productId',
        name: 'Product',
        component: Product,
        props: {description: true},
    },
    {
        path: '/PersonalCenter',
        name: 'PersonalCenter',
        component: PersonalCenter,
        children: [
            {
                path: "InforMation",
                name: "InforMation",
                component: InforMation, // 使用component代替components
            },
            {
                path: "address", // 注意：原始配置中地址组件没有指定path，这里我添加了一个示例path
                name: "Address", // 添加了一个name，因为每个路由最好有一个唯一的name
                component: Address, // 使用component代替components
            },
            {
                path: "star",
                name: "star",
                component: Star1, // 使用component代替components
            },
            {
                path: "ShoppingCart",
                name: "ShoppingCart",
                component: ShoppingCart, // 使用component代替components
            },
            {
                path: "History",
                name: "History",
                component: History, // 使用component代替components
            },
            {
                path: "MyComments",
                name: "MyComments",
                component: Evaluated, // 使用component代替components，并假设Evaluated是正确的组件名
            },
            {
                path: "MyOrders",
                name: "MyOrders",
                component: MyOrders, // 使用component代替components
            },
        ],
    },

    {
        path: '/purchase/:productId',
        name: 'purchase',
        component: Orders,
        props: {description: true}
    },
    {
        path: '/vendor/:name',
        name: 'vendor',
        component: Vendor,
        props: {description: true}
    },
    {
        path: '/ConfirmPay/:id',
        name: 'ConfirmPay',
        component: ConfirmPay,
        props: {description: true}
    },
    {
        path: '/Reviews/:id',
        name: 'Reviews',
        component: Reviews,
        props: {description: true}
    },
    {
        path: '/Reviews/:id',
        name: 'Reviews',
        component: Reviews,
        props: {description: true}
    },
    {
        path: '/forgotPassword',
        name: 'forgotPassword',
        component: ForgotPassword
    },
]

const router = createRouter({
    history: createWebHistory("/"),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (savedPosition) {
                    resolve(savedPosition);
                } else {
                    resolve({x: 0, y: 0});
                }
            }, 500); // 根据需要调整此延迟
        });
    }
});

// 创建一个响应式属性来表示是否正在切换路由
const isSwitchingRoute = ref(false)

router.beforeEach((to, from, next) => {
    const baseStore = useStore()

    const toDepth = routes.findIndex((v) => v.path === to.path)
    const fromDepth = routes.findIndex((v) => v.path === from.path)

    if (toDepth > fromDepth) {
        baseStore.direction = 'forward'
    } else {
        baseStore.direction = 'backward'
    }
    isSwitchingRoute.value = true
    next()
})

router.afterEach(() => {
    isSwitchingRoute.value = false
})


export {router, isSwitchingRoute, routes}
