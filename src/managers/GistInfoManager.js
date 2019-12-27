const GistInfoRA = require('../data/GistInfoRA');
module.exports = class GistInfoManager {
    save(gistId) {
        GistInfoRA.save(gistId);
    }
}