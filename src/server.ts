import * as express from 'express';
import * as path from 'path';

const PORT = 3080;
const app = express();
const dist_path = path.join(__dirname, '../dist');

app.use('*', (req, res, next) => {
  res.header('X-powered-by', 'Blood, sweat, and tears');
  next();
});

app.use(express.static(dist_path));

app.get('*', (req, res) => {
  res.sendFile(dist_path + '/index.html');
});

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
