const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

console.log('env : '+process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
    console.log('loading dotenv config');
    require('dotenv').config({path:'./.env'});
};

require('./utils/connectdb');

require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authentificate');

const userRoutes = require('./routes/userRoutes');

//configuration du serveur
const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// on ajout les domaines autorisés pour le cors
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') :[];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));


app.use(passport.initialize());


app.use('/users', userRoutes);

//simple route pour vérifier que le serveur est bien démarré
app.get('/', (req, res) => {
    res.send({status: 'succcess', message: 'Welcome on auth server'});
});

//demarrage du serveur
const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(`Server is running on port ${port}`);
});
