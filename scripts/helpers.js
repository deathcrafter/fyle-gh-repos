/**
 * Create an element from a string
 * @param {string} str
 * @param {"text/html" | "text/xml"} type
 */
export function createElementFromString(str, type = "text/html") {
  const document = new DOMParser().parseFromString(str, type);
  const element = document.querySelector("body").firstElementChild;
  return element.cloneNode(true);
}

/**
 * Updates existing query string
 * @param {string | string[][] | Record<string, string> | URLSearchParams} oldQuery The old query string
 * @param {string | string[][] | Record<string, string> | URLSearchParams} newQuery The new query parameters
 * @param {boolean} removeNonExistent Remove params that don't exist in newParams
 */
export function updateSearchParams(
  oldQuery,
  newQuery,
  removeNonExistent = false
) {
  const oldParams = new URLSearchParams(oldQuery);
  const newParams = new URLSearchParams(newQuery);

  for (const [key, value] of newParams) {
    oldParams.set(key, value);
  }

  if (removeNonExistent) {
    for (const [key] of oldParams) {
      if (!newParams.has(key)) {
        oldParams.delete(key);
      }
    }
  }

  return oldParams.toString();
}

/**
 * Update the location query without a full reload
 * @param {Window} window
 * @param {string} queryString
 */
export function updateLocationQuery(window, queryString) {
  const location = window.location;
  window.history.pushState(
    {},
    "",
    `${location.pathname}?${queryString}${location.hash}`
  );
}
