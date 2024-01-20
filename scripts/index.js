import GHCache from "./gh-api.js";
import templates from "./templates.js";
import {
  createElementFromString,
  updateLocationQuery,
  updateSearchParams,
} from "./helpers.js";

// #region JSDoc Types

/**
 * @typedef {import("./templates.js").User} User
 * @typedef {import("./templates.js").Repo} Repo
 */

//  #endregion

// #region Globals

const settings = {
  username: "",
  limit: 10,
  page: 1,
};

/**
 * @type {User | null}
 */
var currentUser = null;

// #endregion

// #region API Helpers

/**
 * @type {Map<string, GHCache>}
 */
const cacheMap = new Map();

async function fetchCache(uri) {
  if (cacheMap.has(uri)) {
    return cacheMap.get(uri).get();
  }
  const cache = new GHCache(uri);
  cacheMap.set(uri, cache);
  return cache.get();
}

/**
 *
 * @param {string} username
 * @returns {Promise<User>}
 */
async function getUser() {
  return fetchCache(`https://api.github.com/users/${settings.username}`);
}

/**
 * @param {string} username
 * @param {number} limit
 * @param {number} page
 * @returns {Promise<Repo[]>}
 */
async function getRepos() {
  const queryParams = `&per_page=${settings.limit}&page=${settings.page}`;
  return await fetchCache(
    `https://api.github.com/users/${settings.username}/repos?${queryParams}`
  );
}

// #endregion

// #region Query Selectors

const queryParams = () => new URLSearchParams(location.search);
const app = () => document.getElementById("app");
const loadingPage = () => app().querySelector("#loader");

const userSection = () => app().querySelector("#user-section");
const errorElement = () => app().querySelector("#error");

const reposSection = () => app().querySelector("#repos-section");
const reposLoading = () => app().querySelector("#repos-loader");
const reposNone = () => app().querySelector("#repos-none");
const reposPaginations = () => app().querySelector("#repo-pagination");
const reposList = () => reposSection().querySelector("#repos-list");

const queryForm = () => document.getElementById("query-form");
const queryUsername = () => queryForm().querySelector("input[name=username]");
const queryLimit = () => queryForm().querySelector("input[name=limit]");

// #endregion

// #region Rendering

function createPagination(totalPages) {
  const paginationElement = document.createElement("div");
  paginationElement.id = "repo-pagination";
  paginationElement.classList.add("pagination");

  for (let i = 0; i <= totalPages + 1; i++) {
    const button = document.createElement("button");

    button.className =
      "pagination-button" +
      (i == settings.page ? " active" : "") +
      (i === 0 ? " nav prev" : i === totalPages + 1 ? " nav next" : "");
    button.textContent = i === 0 ? "Prev" : i === totalPages + 1 ? "Next" : i;

    if (
      (settings.page == 1 && i === 0) ||
      (settings.page == totalPages && i === totalPages + 1)
    )
      button.style.display = "none";

    button.addEventListener("click", () => {
      settings.page =
        i === 0
          ? settings.page - 1
          : i === totalPages + 1
          ? settings.page + 1
          : i;
      updateLocationQuery(
        window,
        updateSearchParams(location.search, settings)
      );
      renderRepos();
    });

    paginationElement.appendChild(button);
  }

  return paginationElement;
}

async function renderUser() {
  if (userSection()) app().removeChild(userSection());
  if (errorElement()) app().removeChild(errorElement());
  if (reposSection()) app().removeChild(reposSection());

  loadingPage().style.display = "flex";

  const username = settings.username;
  let user;

  try {
    user = await getUser(username);
  } catch (error) {
    loadingPage().style.display = "none";
    const errorElement = createElementFromString(
      templates.errorTemplate({
        statusCode: error.status,
        message: (await error.details)?.message || error.message,
      })
    );

    app().appendChild(errorElement);
    return;
  }

  currentUser = user;

  const userElement = createElementFromString(templates.userTemplate(user));
  const reposElement = createElementFromString(
    templates.reposSectionTemplate()
  );

  app().appendChild(userElement);
  app().appendChild(reposElement);

  if (user.public_repos) renderRepos();
  else renderNoRepos();

  loadingPage().style.display = "none";
}

function renderNoRepos() {
  if (reposNone()) reposSection().removeChild(reposNone());
  if (reposList()) reposSection().removeChild(reposList());
  if (reposPaginations()) reposSection().removeChild(reposPaginations());

  const noReposElement = createElementFromString(templates.noReposTemplate());

  reposLoading().style.display = "none";

  reposSection().appendChild(noReposElement);
}

async function renderRepos() {
  if (reposNone()) reposSection().removeChild(reposNone());
  if (reposList()) reposSection().removeChild(reposList());
  if (reposPaginations()) reposSection().removeChild(reposPaginations());

  reposLoading().style.display = "flex";

  const max_page = Math.ceil(currentUser.public_repos / settings.limit);

  if (settings.page < 1 || settings.page > max_page) {
    settings.page =
      settings.page < 1
        ? 1
        : settings.page > max_page
        ? max_page
        : settings.page;
    updateLocationQuery(window, updateSearchParams(location.search, settings));
  }

  const repos = await getRepos(
    settings.username,
    settings.limit,
    settings.page
  );

  const repoList = createElementFromString(templates.reposListTemplate());

  repos.forEach((repo) => {
    const repoElement = createElementFromString(
      templates.repoCardTemplate(repo)
    );
    const repoTopics = repoElement.querySelector(".repo-topics");

    repo.topics.forEach((topic) => {
      const topicElement = document.createElement("a");
      topicElement.classList.add("repo-topic");
      topicElement.href = `https://github.com/topics/${topic}`;
      topicElement.textContent = topic;
      repoTopics.appendChild(topicElement);
    });

    repoList.appendChild(repoElement);
  });

  reposSection().appendChild(createPagination(max_page));
  reposSection().appendChild(repoList);
  reposLoading().style.display = "none";
}

async function renderWelcome() {
  queryForm().querySelector("input[name=username]").focus();
  loadingPage().style.display = "none";

  const welcomeElement = createElementFromString(
    templates.errorTemplate({
      statusCode: "GitHub User Viewer",
      message: "Enter username of the GitHub user you want the info about.",
    })
  );

  app().appendChild(welcomeElement);
}

// #endregion

// #region Query Handlers

function handleQuery() {
  const username = queryParams().get("username");
  const limit = queryParams().get("limit");
  const page = queryParams().get("page");

  if (username) {
    settings.username = username;
    queryUsername().value = settings.username;
  }

  if (limit) {
    settings.limit = parseInt(limit);
    settings.limit = isNaN(settings.limit)
      ? 10
      : settings.limit < 0
      ? 1
      : settings.limit > 100
      ? 100
      : settings.limit;
    queryLimit().value = settings.limit;
  }

  if (page) {
    settings.page = parseInt(page);
  }
}

/**
 * @param {SubmitEvent}
 */
function handleQuerySubmit(event) {
  event.preventDefault();

  const oldSettings = { ...settings };

  const username = queryUsername().value;
  if (!username) {
    return alert("Please enter an username");
  }

  let limit = parseInt(queryLimit().value);
  limit = isNaN(limit) ? 10 : limit < 0 ? 1 : limit > 100 ? 100 : limit;

  settings.limit = limit;

  if (oldSettings.username.toLowerCase() !== username.toLowerCase()) {
    settings.username = username;
    settings.page = 1;
    renderUser();
  } else if (oldSettings.limit !== settings.limit) {
    renderRepos();
  }

  updateLocationQuery(window, updateSearchParams(location.search, settings));
}

// #endregion

document.addEventListener("DOMContentLoaded", () => {
  queryForm().addEventListener("submit", handleQuerySubmit);
  // queryUsername().addEventListener("focus", (e) => e.target.select());
  handleQuery();

  if (settings.username) {
    renderUser();
  } else {
    renderWelcome();
  }
});
