/**
 [Class Purpose]
 Author: Amy M.
 Version: 2022.XX.XX
 **/

module.exports = class Spook {
    constructor(title, year) {
        this._year = year;
        this._title = title;
    }

    get title() {
        return this._title;
    }

    get year() {
        return this._year;
    }
}
