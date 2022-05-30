let express = require('express');
const { getToWatch, formattedSeenSpooks} = require("./syllabus");
let app = express();

async function syllabusSite() {

// set the view engine to ejs
    app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index/unwatched page
    app.get('/', async function (req, res) {
        let spooks = await getToWatch();

        res.render('pages/index', {
            spooks: await spooks,
        });
    });

// watched page
    app.get('/seen', async function (req, res) {
        let spooks = await formattedSeenSpooks();

        res.render('pages/seen', {
            spooks: await spooks,
        });
    });

    app.listen(8080);
    console.log('Server is listening on port 8080');

}

module.exports = {
    syllabusSite
}