const ROUTES = {
  PUBLIC_ROUTES: new Set([
    'api/auth/login.post',
    'api/auth/register.post',
    'api/auth/loginGoogle.post',
    'logger/[id].get',
    'api/mongodb/user/[id].get',
  ]),
};

export default ROUTES;
