class House {
  constructor(position) {
    this._position = position;
    this._tenant = null;
    // this._siblings = {
    //   topLeft: null,
    //   top: null,
    //   topRight: null,
    //   left: null,
    //   right: null,
    //   bottomLeft: null,
    //   bottom: null,
    //   bottomRight,
    // };
    this._siblings = [];
  }

  get position() {
    return this._position;
  }

  get tenant() {
    return this._tenant;
  }

  get siblings() {
    return this._siblings;
  }

  isEmpty() {
    return !!this._tenant;
  }

  setSiblings(siblings) {
    // Object.entries(siblings).forEach(([key], index) => {
    //   this._siblings[key] = siblings[index];
    // });
    this._siblings = siblings;
  }

  setTenant(tenant) {
    if (!this.isEmpty()) throw Error('Not Empty');
    this._tenant = tenant;
  }

  clear() {
    this._tenant = null;
  }
}

export default House;