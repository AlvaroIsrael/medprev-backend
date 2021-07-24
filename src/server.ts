import app from './app';

const getPort = (url: string | undefined): string => {
  const port = url === undefined ? [] : url.split(':');
  const portExist = port.length > 0;
  return portExist ? port[port.length] : '3333';
};

const port = getPort(process.env.APP_API_URL);

app.listen(port, () => {
  console.log(`🔥 Server running on port ${port} ! 🔥`);
});
