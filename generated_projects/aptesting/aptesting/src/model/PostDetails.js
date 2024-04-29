
export default class Postdetails {

    constructor() {

        this._body = '';

        this._id = '';

        this._title = '';

        this._userId = '';

    }

    get body() {

        return this._body;

    }

    set body(value) {

        if (typeof value !== 'string') {

            throw new TypeError('body must be of type string');

        }

        this._body = value;

    }

    get id() {

        return this._id;

    }

    set id(value) {

        if (typeof value !== 'number') {

            throw new TypeError('id must be of type number');

        }

        this._id = value;

    }

    get title() {

        return this._title;

    }

    set title(value) {

        if (typeof value !== 'string') {

            throw new TypeError('title must be of type string');

        }

        this._title = value;

    }

    get userId() {

        return this._userId;

    }

    set userId(value) {

        if (typeof value !== 'number') {

            throw new TypeError('userId must be of type number');

        }

        this._userId = value;

    }

    }
