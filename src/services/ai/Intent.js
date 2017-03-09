/////////////////////////
// Intent.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

//
// Representation of action taken by AI on some data.
//
function Intent(action, data){
    this.action = action;
    this.data = data;
};

//
// Getters
//
Intent.prototype.getAction = () => {
    return this.action;
};

Intent.prototype.getData = () => {
    return this.data;
};