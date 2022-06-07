import Albums from "@/pages/Albums";
import Photos from "@/pages/Photos";
import Login from "@/pages/auth/Login";
import AppBar from "@/components/AppBar";
import Welcome from "@/components/Welcome";
import Register from "@/pages/auth/Register";

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome
  },
  {
    name: 'login',
    path: '/login',
    meta: {guest: true},
    component: Login
  },
  {
    name: 'register',
    path: '/register',
    meta: {guest: true},
    component: Register
  },
  {
    name: 'albums',
    path: '/albums',
    meta: {auth: true},
    components: {
      appbar: AppBar,
      default: Albums
    }
  },
  {
    name: 'albums.photos',
    path: '/albums/:albumId(\\d+)/photos',
    meta: {auth: true},
    props: {
      appbar: false,
      default: route => ({ albumId: parseInt(route.params.albumId) })
    },
    components: {
      appbar: AppBar,
      default: Photos
    },
  }
];

export default routes;
