# fyle-gh-repos
A website that shows GitHub user info and lists thier repositiories.

## Implemented
List of features implemented

- Getting user info using username
- Getting repos
- Repos pagination
- Limited per_page limit to 100
- Loading and error indicators

Extras:

- Cache for GitHub API (GitHub API limits requests based on IP Address). [ref](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#primary-rate-limit-for-unauthenticated-users)
- Correcting query limits (page, limit)
- Disabling Twitter button if unavailable

## Could Have Been Implemented
A list of features that could have been implemented had I had more time (or used React or any other SPA framework).

- Repository sorting based on `created`, `updated`, `pushed`, `full_name`. [ref](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
- User search. [ref](https://docs.github.com/en/search-github/searching-on-github/searching-users)
- Repo search. (was optional). [ref](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
- Show user social/links. [ref](https://docs.github.com/en/rest/users/social-accounts?apiVersion=2022-11-28#list-social-accounts-for-a-user)
- Max lines in descriptions and topics with expandable sections. (required use of external libs)
