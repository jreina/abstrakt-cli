import GistInfoRA from '../data/GistInfoRA';
export default class GistInfoManager {
    save(gistId: string) {
        GistInfoRA.save(gistId);
    }
}