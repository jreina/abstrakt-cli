import github from "@octokit/rest";
import got from "got";

class GistRA {
  github: github;
  GIST_JSON_EMPTY: {
    description: string;
    public: boolean;
    files: { "leftshift.txt": { content: string } };
  };
  /**
   *
   */
  constructor(token: string) {
    this.github = new github({ auth: `token ${token}` });
    this.GIST_JSON_EMPTY = {
      description: "Esotrakt Entries",
      public: false,
      files: {
        "leftshift.txt": {
          content: "0::" + new Date().getTime()
        }
      }
    };
  }
  /**
   *
   * @param {string} gistId
   * @returns {Array<{category: string, time: Date, subject: string, id: number}>}
   */
  async load(gistId: string): Promise<Array<string>> {
    const gists = await this.github.gists.get({ gist_id: gistId });
    // @ts-ignore this is fucking stupid
    const file = gists.data.files["leftshift.txt"];
    if (file.truncated) {
      const { body } = await got(file.raw_url);
      return body.split("\n");
    }
    return file.content.split("\n");
  }

  /**
   * @returns The ID of the newly created gist.
   */
  async create(): Promise<string> {
    const gist = await this.github.gists.create(this.GIST_JSON_EMPTY);
    const id = gist.data.id;
    return id;
  }

  /**
   *
   */
  async update(content: Array<string>, gistId: string) {
    return this.github.gists.update({
      gist_id: gistId,
      files: {
        // @ts-ignore fix your fucking types
        "leftshift.txt": {
          content: content.join("\n")
        }
      }
    });
  }
}

export default GistRA;
