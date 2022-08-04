import app from './app';

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listen on port ${process.env.PORT}`);
});
