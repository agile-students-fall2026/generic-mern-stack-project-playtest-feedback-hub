# Playtest Feedback Hub

## Project Description

Playtest Feedback Hub is a mobile web application designed to help game developers, game designers, and software developers collect and organize feedback during playtesting.

Feedback often arrives through multiple channels, such as Discord messages, screenshots, and verbal comments. Manually organizing this information can be time-consuming and makes it difficult to track recurring issues and prioritize improvements.

Playtest Feedback Hub aims to provide a centralized platform where playtesters can submit feedback and developers can easily review, categorize, and manage it.

## Product Vision Statement

For game developers, game designers, and software developers who need to collect feedback while testing their products, Playtest Feedback Hub is a mobile-friendly feedback management platform that centralizes and organizes playtest feedback in one place. Unlike manually collecting feedback from scattered messages, screenshots, and conversations, our product aims to make feedback easier to access, understand, and act upon.

## Core Team

The following people are responsible for designing and developing Playtest Feedback Hub.

- [Leo Chen](https://github.com/Lappass)
- [Uwa Igbinedion](https://github.com/uwa00)
- [Anthony Kim](https://github.com/CrystalCM4)
- [Guyu Sun](https://github.com/GoodrainCN)
- [Ben Zaslavsky](https://github.com/benzaslavsky)

## Project History

Playtest Feedback Hub originated from the challenges developers face when collecting feedback during game development. Feedback can become scattered across communication platforms, screenshots, and verbal conversations, making it difficult to organize and use effectively.

Our team developed the idea of creating a centralized, mobile-friendly application that streamlines feedback collection and management. The project is being developed as part of a collaborative software engineering project.

## Key Features

Planned features include:

- a mobile-friendly interface for submitting feedback.
- centralized storage for playtest feedback.
- feedback categorization, such as bugs, gameplay, art, and audio.
- support for screenshots or other relevant attachments, if implemented.
- tools for developers to review and organize submissions.

Features are subject to change as development progresses.

## Getting Started

The Sprint 1 front end uses React, React Router, and Vite. Install Node.js 22.12 or newer (Node.js 24 is recommended), then run:

```sh
cd front-end
npm install
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173.

The front end gets its data from the Express.js back end, so start it too. In a second terminal, run:

```sh
cd back-end
npm install
npm run dev
```

The server runs at http://localhost:3000. Check it with http://localhost:3000/api/health. Vite forwards every `/api` request from the front end to this server. No database or credentials are needed yet.

## Building and Testing

From `front-end`, run `npm run build` to verify a production build. Run `npm run preview` to preview that build locally.

From `back-end`, run `npm test` to run the mocha and chai unit tests. Run `npm run coverage` to see code coverage with c8.

## Contributing

We welcome contributions from team members and other authorized contributors.

Before contributing, please read our [Contributing Guidelines](./CONTRIBUTING.md) for information about team norms, Git workflow, development setup, and Pull Request procedures.

## Additional Documentation

- [Contributing Guidelines](./CONTRIBUTING.md) — Rules and procedures for contributing to the project.

Additional documentation will be linked here as it becomes available.

## Accounts (Sprint 2)

Open `/signup` and enter an email and matching passwords (8–128 characters).
The form posts JSON to `POST /api/auth/register`, shows validation or duplicate-email
errors, and displays a sign-in link after a successful registration.

The endpoint returns `{user: {id, email}}` with status 201. Email addresses are
trimmed and normalized to lowercase; duplicate registrations return 409, invalid
credentials return 400, and non-JSON requests return 415. Passwords use salted
scrypt hashes. After registration, clients can sign in with the same credentials.

Send JSON `{email, password}` to `POST /api/auth/login` to start a 24-hour
session. The response returns `{user: {id, email}}` and sets an HttpOnly,
SameSite=Strict cookie. In production mode, the cookie requires HTTPS.
`GET /api/auth/me` returns the current account or 401 when the session is missing
or expired.

Accounts and sessions are stored in memory and cleared when the backend restarts.
Persistent storage and production hardening are follow-up work.

Run `npm test` in `back-end` for the account and existing API tests, and
`npm run build` in `front-end` to check the UI build. To review manually, register a
new email, verify the success message, then repeat with the same email and confirm
the duplicate-account error. Also check mismatched passwords.
