interface IRols {
  [key: string]: string[];
}

const rols: IRols = {
  ADMIN: ['api/user/[id].all'],
  USER: [],
};

export default rols;
