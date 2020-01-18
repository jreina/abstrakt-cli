import github from "@octokit/rest";
import got from "got";
import { CollectionItem } from "../models/CollectionItem";

class GistRA<T extends CollectionItem> {
  github: github;
  GIST_JSON_EMPTY: {
    description: string;
    public: boolean;
    files: { "abstrakt.v2.json": { content: string } };
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
        "abstrakt.v2.json": {
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
  async load(gistId: string): Promise<Array<T>> {
    const gists = await this.github.gists.get({ gist_id: gistId });
    // @ts-ignore this is fucking stupid
    const file = gists.data.files["abstrakt.v2.json"];
    if (file.truncated) {
      const { body } = await got(file.raw_url);
      return JSON.parse(body);;
    }
    return JSON.parse(file.content);
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
  async update(content: Array<T>, gistId: string) {
    await this.github.gists.update({
      gist_id: gistId,
      files: {
        // @ts-ignore fix your fucking types
        "abstrakt.v2.json": {
          content: JSON.stringify(content)
        }
      }
    });
  }
}

export default GistRA;
