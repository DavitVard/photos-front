import Cookies from "js-cookie";

const isAuth = () => {
  return Cookies.get('vuex')
    ? JSON.parse(Cookies.get('vuex')).auth.check
    : false;
}

export const auth = (to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!isAuth()) {
      next({name: 'login'});
    } else {
      next();
    }
  } else {
    next();
  }
};

export const guest = (to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    if (isAuth()) {
      next(from);
    } else {
      next();
    }
  } else {
    next();
  }
};
