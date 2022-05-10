const Spook = require("../classes/spooks");

exports.initSyllabus = function () {
    let syllabus = [];
    syllabus.push(new Spook("Nosferatu",1922));
    syllabus.push(new Spook("Invasion of the Body Snatchers",1956));
    syllabus.push(new Spook("Night of the Living Dead",1968));
    syllabus.push(new Spook("The Fog",1968));
    syllabus.push(new Spook("Hellbound: Hellraiser II",1988));
    return syllabus;
}