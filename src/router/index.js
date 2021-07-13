import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Chat from '@/components/Chat.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters.getUser) next({ name: 'Login' })
  else next()
})

export default router
