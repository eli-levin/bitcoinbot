/////////////////////////
// ActionEventRegistry.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

function ActionEventRegistry(actions){
    this.registry = {};
    this.actions  = actions;
    
    this.actions.forEach(act => {this.registry[act] = void 0;});
};


ActionEventRegistry.prototype.registerHandler = (action, handler) => {

};