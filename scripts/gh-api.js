class ResponseError extends Error {
  /**
   * @param {Response} response
   * @returns {ResponseError}
   */
  constructor(response) {
    super(response.statusText);
    this.status = response.status;
    this.name = "ResponseError";
    this.details = response.json();
  }
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 * @throws {ResponseError}
 */
function fetchWithError(url) {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new ResponseError(res);
    }
    return res.json();
  });
}

class GHCache {
  /**
   * @param {string} url
   * @param {number} cache_minutes (Default: 2)
   * @returns {GHCache}
   * @throws {Error}
   * @throws {ResponseError}
   */
  constructor(url, cache_minutes = 2) {
    if (!url) {
      throw new Error("url is required");
    }

    this._key = url;
    this._cache_minutes = cache_minutes;

    const lsData = localStorage.getItem(this._key);

    try {
      const cache = JSON.parse(lsData);
      if (
        cache.data &&
        new Date() - new Date(cache.created) < 1000 * 60 * cache_minutes
      ) {
        this.data = new Promise((resolve) => resolve(cache.data));
        this.created = new Date(cache.created);
      } else {
        this.data = fetchWithError(url);
        this.created = new Date();
      }
    } catch {
      this.data = fetchWithError(url);
      this.created = new Date();
    }
  }

  get() {
    if (new Date() - this.created > 1000 * 60 * this._cache_minutes) {
      this.data = fetch(this._key).then((res) => res.json());
      this.created = new Date();
    }
    return this.data;
  }

  set(value) {
    this.data = value;
    this.cache = { data: value, created: new Date() };
    localStorage.setItem(
      this.repo
        ? `gh-cache-${this.username}-${this.repo}`
        : `gh-cache-${this.username}`,
      JSON.stringify(this.cache)
    );
  }

  clear() {
    this.data = null;
    this.created = null;
    localStorage.removeItem(this._key);
  }
}

export default GHCache;
