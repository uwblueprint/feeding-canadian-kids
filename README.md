# Feeding Canadian Kids

[Feeding Canadian Kids](https://feedingcanadiankids.org) is the only Canadian federal registered charity working to fill the dinner-gap, providing healthy meals to hungry children for a good night’s sleep, nourished body and brighter future. The organization needs assistance to bring volunteers who navigate to their website to sign up for delivering food to schools. A formalized process is needed to make the experience smoother for the volunteers and increase sign ups. They also need one place to have the volunteers submit documents to be screened to ensure safety of the children.

Please see our [Notion workspace](https://www.notion.so/uwblueprintexecs/Dev-e3112e78136f49b4b042e9a0d9df9723) for more information and technical details!

## Stack

**Backend Language:** Python (with Flask)<br>
**Backend API:** GraphQL<br>
**Database:** MongoDB<br>
**Frontend Language:** Typescript (with React)<br>

## Table of Contents

- 👷 [Getting Started](#getting-started)
  - ✔️ [Prerequisites](#prerequisites)
  - ⚙️ [Set up](#set-up)
- 🚀 [Creating a Release](#creating-a-release)
- 🧰 [Useful Commands](#useful-commands)
  - ℹ️ [Get Names & Statuses of Running Containers](#get-names--statuses-of-running-containers)
  - ✨ [Linting & Formatting](#linting--formatting)
  - 🧪 [Running Tests](#running-tests)
- 🌳 [Version Control Guide](#version-control-guide)
  - 🌿 [Branching](#branching)
  - 🔒 [Commits](#commits)

---

## Getting Started

### Prerequisites

- Install Docker Desktop ([MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)) and ensure that it is running
<!-- - Ask a member of the Internal Tools team to be added to our Firebase and MongoDB Atlas projects
- Set up Vault client for secret management, see instructions [here](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e) -->

### Set up

1. Clone this repository and `cd` into the project folder

```bash
git clone https://github.com/uwblueprint/feeding-canadian-kids.git
cd feeding-canadian-kids
```

<!-- 2. Pull secrets from Vault (Skip this step for now)
```bash
vault kv get -format=json kv/fck | python update_secret_files.py -->

2. Create a .env file in the root of this repo, and in the frontend folder. (Ask the PL for the file contents)

3. Run `npm install` in the root, and also run `cd frontend && npm install`

````
3. Run the application
```bash
docker-compose up --build
````

The backend runs at http://localhost:5000 and the frontend runs at http://localhost:3000.

## Useful Commands

### Get Names & Statuses of Running Containers

```bash
docker ps
```

### Linting & Formatting

Backend:

```bash
docker compose up backend # Run in a separate terminal first
docker exec -it fck_backend /bin/bash -c "black . && flake8 ." # Run in a separate terminal after the first command
```

Frontend:

```bash
# linting & formatting warnings only
docker compose up frontend # Run in a separate terminal first
docker exec -it fck_frontend /bin/bash -c "yarn lint" # Run in a separate terminal after the first command

# linting with fix & formatting
docker compose up frontend # Run in a separate terminal first
docker exec -it fck_frontend /bin/bash -c "yarn fix" # Run in a separate terminal after the first command
```

You can also use the Makefiles if you have `make` installed:

```bash
# lint backend
make belint
# OR
cd backend
make lint

# lint frontend
make felint
# OR
cd frontend
make lint

```

### Running Tests

Backend:

```bash
docker compose up backend # Run in a separate terminal first
docker exec -it fck_backend /bin/bash -c "pip install -r requirements.txt && python -m pytest" # Run in a separate terminal after the first command
```

Frontend:

```bash
docker compose up frontend # Run in a separate terminal first
docker exec -it fck_frontend /bin/bash -c "yarn test" # Run in a separate terminal after the first command
```

You can also use the Makefiles if you have `make` installed:

```bash
# test backend
make betest
# OR
cd backend
make test

# test frontend
make fetest
# OR
cd frontend
make test
```

## Version Control Guide

### Branching

- Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your GitHub username or usernames. The branch name should be in kebab case and it should be short and descriptive (e.g. `jfdoming-a4bello/readme-update` for two usernames `jfdoming` and `a4bello`).
- To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase

# if there are conflicts, resolve them and then:
git add .
git rebase --continue

# force push to remote feature branch
git push -f
```

### Commits

- Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
- Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"

# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup

# force push to remote feature branch
git push -f
```

- Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>. The first word should be capitalized. E.g. "Create user REST endpoints", not "Created user REST endpoints"
- PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---

1: From Git's own [guidelines](https://github.com/git/git/blob/311531c9de557d25ac087c1637818bd2aad6eb3a/Documentation/SubmittingPatches#L139-L145)
