class Square {
  constructor(row, column) {
    this._row = row;
    this._column = column;
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

  get row() {
    return this._row;
  }

  get column() {
    return this._column;
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

  checkRow() {
    const siblings = this.siblings.find((sibling) => sibling.row === this.row);
    return siblings.every((sibling) => sibling.checkRow());
  }

  checkColumn() {
    const siblings = this.siblings.find((sibling) => sibling.column === this.column);
    return siblings.every((sibling) => sibling.checkColumn());
  }

  clear() {
    this._tenant = null;
  }
}

export default Square;
