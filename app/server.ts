import express from 'express';
import path from 'path';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const isDevelopmentEnv = process.env.NODE_ENV === 'dev';

app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'errors')
]);

app.use(
  '/static',
  express.static('static', {
    ...(!isDevelopmentEnv && {
      setHeaders(res) {
        res.set(
          'Cache-Control',
          'max-age=86400, no-cache="Set-Cookie", public'
        );
      }
    })
  })
);

router.get('/', async (req, res) => {
  return res.render('index');
});

app.use('/', router);

(() => {
  app.listen(port);
  console.log(`API up and running on port ${port}`);
})();
