module.exports = function (source) {
    if (this.cacheable) this.cacheable();

    console.log("loader over");
    this.callback(null, source)
};