import * as express from 'express';
import * as path from 'path';

const PORT = 3080;
const app = express();

app.use('*', (req, res, next) => {
  res.header("X-powered-by", "Blood, sweat, and tears");
  next();
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '..', 'dist', 'index.html'));
});

app.get('*', function(req, res){
    res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});