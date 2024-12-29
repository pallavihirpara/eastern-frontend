import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/Login.vue';
import userComponent from '../components/userComponent.vue';
import UsersForm from '../components/user/Users.vue';
import UserAdd from '../components/user/UserAdd.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm,
  }, {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/users',
    name: 'Users',
    component: () => userComponent,
    children: [
      {
        path: '',
        name: 'UsersList',
        component: () => UsersForm
      },
      {
        path: 'add',
        name: 'AddUser',
        component: () => UserAdd
      },
      {
        path: 'edit/:id',
        name: 'editUser',
        component: () => UserAdd
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;