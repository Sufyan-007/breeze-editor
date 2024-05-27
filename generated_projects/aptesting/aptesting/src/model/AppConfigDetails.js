
export default class Appconfigdetails {

    constructor() {

        this._author = '';

        this._defaultComponent = '';

        this._dependencies = '';

        this._description = '';

        this._name = '';

        this._path = '';

    }

    get author() {

        return this._author;

    }

    set author(value) {

        if (typeof value !== 'string') {

            throw new TypeError('author must be of type string');

        }

        this._author = value;

    }

    get defaultComponent() {

        return this._defaultComponent;

    }

    set defaultComponent(value) {

        if (typeof value !== 'string') {

            throw new TypeError('defaultComponent must be of type string');

        }

        this._defaultComponent = value;

    }

    get dependencies() {

        return this._dependencies;

    }

    set dependencies(value) {

        if (typeof value !== 'object') {

            throw new TypeError('dependencies must be of type object');

        }

        this._dependencies = value;

    }

    get description() {

        return this._description;

    }

    set description(value) {

        if (typeof value !== 'string') {

            throw new TypeError('description must be of type string');

        }

        this._description = value;

    }

    get name() {

        return this._name;

    }

    set name(value) {

        if (typeof value !== 'string') {

            throw new TypeError('name must be of type string');

        }

        this._name = value;

    }

    get path() {

        return this._path;

    }

    set path(value) {

        if (typeof value !== 'string') {

            throw new TypeError('path must be of type string');

        }

        this._path = value;

    }

    }
