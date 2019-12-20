const commander = require('commander');
/**
 * @param {{ [key: string]: ((prog: commander) => void) }} mappings
 * @param {{ [key: string]: boolean }} subject
 * @param {(() => void)} def
 */
module.exports = (mappings, subject, def) => {
    const activeKey = Object.keys(mappings).find(key => subject[key]);
    if(activeKey) mappings[activeKey](subject[activeKey]);
    else def();
}
