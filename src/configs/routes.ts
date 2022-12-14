const ROUTES = {
  PUBLIC_ROUTES: new Set([
    'api/account/login.post',
    'api/account/register.post',
    'api/account/loginGoogle.post',
    'logger/[id].get',
    'api/mongodb/user/[id].get',
  ]),
};

export default ROUTES;
