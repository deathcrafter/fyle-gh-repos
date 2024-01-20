//#region JSDoc Types

/**
 * @typedef {Object} User
 * @property {string} login
 * @property {string} name
 * @property {string} bio
 * @property {string} avatar_url
 * @property {string} public_repos
 * @property {string} public_gists
 * @property {string} followers
 * @property {string} following
 * @property {string} html_url
 * @property {string} twitter_username
 */

/**
 * @typedef {Object} Repo
 * @property {string} id
 * @property {string} name
 * @property {string} full_name
 * @property {string} html_url
 * @property {string} description
 * @property {string[]} topics
 * @property {bool} fork
 * @property {number} stargazers_count
 * @property {number} watchers_count
 */

//#endregion

/**
 * @param {User} user
 * @returns {string}
 */
const userTemplate = ({
  login,
  name,
  bio,
  avatar_url,
  public_repos,
  public_gists,
  followers,
  following,
  html_url,
  twitter_username,
}) => `
    <section class="user" id="user-section">
        <div class="user-lhs">
          <img
            class="user-avatar"
            src="${avatar_url}"
            alt="user avatar"
          />
        </div>
        <div class="user-rhs">
          <div class="user-info">
            <h1 class="user-name">${name || login}</h1>
            ${bio ? `<p class="user-bio">${bio}</p>` : ""}
          </div>
          <p class="user-followers">
            <a class="user-count-link" href="${html_url}?tab=followers">${followers} followers</a> •
            <a class="user-count-link" href="${html_url}?tab=following">${following} following</a>
          </p>
          <p class="user-repos-gists">
            <a class="user-count-link" href="${html_url}?tab=repositories">${public_repos} repositories</a> •
            <a class="user-count-link" href="https://gist.github.com/${login}">${public_gists} gists</a>
          </p>
          <div class="user-icons">
            <a
              class="user-icon-link"
              href="${html_url}"
              title="GitHub • ${login}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-github"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                ></path>
              </svg>
            </a>
            <a
              class="user-icon-link"
              href="https://twitter.com/${twitter_username}"
              title="Twitter / X • ${twitter_username}"
              disabled="${!twitter_username}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-twitter"
              >
                <path
                  d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
        <div class="user-icons user-icons-vertical">
          <a
            class="user-icon-link"
            href="https://github.com/${login}"
            title="GitHub • ${login}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-github"
            >
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              ></path>
            </svg>
          </a>
          <a
            class="user-icon-link"
            href="https://twitter.com/${twitter_username}"
            title="Twitter / X • ${twitter_username}"
            disabled="${!twitter_username}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-twitter"
            >
              <path
                d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
              ></path>
            </svg>
          </a>
        </div>
      </section>
`;

const reposSectionTemplate = () => {
  return `
    <section class="repos" id="repos-section">
      <div id="repos-loader">
        <div class="loader-img-wrapper">
          <img src="./assets/img/loader.svg" alt="Loading..." />
        </div>
      </div>
    </section>
  `;
};

const noReposTemplate = () => `
<div class="repos-none" id="repos-none">
  <p>No repos found</p>
</div>
`;

const reposListTemplate = () => `
<div class="repos-list" id="repos-list">
</div>
<div id="repos-loader">
  <div class="loader-img-wrapper">
    <img src="./assets/img/loader.svg" alt="Loading..." />
  </div>
</div>
`;

/**
 * @param {Repo} repo
 */
const repoCardTemplate = ({
  id,
  name,
  full_name,
  html_url,
  description,
  topics,
  fork,
  stargazers_count,
  watchers_count,
}) => `
<div class="repo-card">
  <a class="repo-name" href="${html_url}" title="${full_name}">${name}</a>
  <p class="repo-desc">${
    description
      ? description
      : `<i style="opacity: 0.7">No description provided</i>`
  }</p>
  <div class="repo-topics">
  </div>
</div>
`;

/**
 * @param {{ statusCode: number, message: string }}
 */
const errorTemplate = ({ statusCode, message }) => `
  <div id="error" class="error">
    <h1 class="error-code">${statusCode}</h1>
    <p class="error-message">${message}</p>
  </div>
`;

export default {
  userTemplate,
  reposSectionTemplate,
  noReposTemplate,
  reposListTemplate,
  repoCardTemplate,
  errorTemplate,
};
