let express = require('express');
const { getToWatch, formattedSeenSpooks } = require("./syllabus");
let app = express();
let port = 3000;

async function syllabusSite() {

    app.set('view engine', 'ejs');

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

    app.listen(3000);
    //console.log(`Server is listening on port ${port}`);

}

module.exports = {
    syllabusSite
}