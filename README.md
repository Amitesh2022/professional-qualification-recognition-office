# Professional Qualification Recognition Office

## One-sentence benefit

Move regulated professionals through secure, faster cross-border qualification recognition.

## Live demo

[Watch the workflow](docs/demo.webm).

## Screenshots

![Professional qualification recognition dashboard](docs/screenshot.png)

## Main features

- Search and sort recognition cases by profession, country, owner or status.
- Create validated recognition cases with accountable authorities and priorities.
- Advance work through draft, review and approved states.
- Show loading, empty, error and success feedback.
- Use operational and purpose routes responsively.

## Technology used

React, TypeScript, TanStack Query, Wouter, Vite, Spring Boot and Java 21.

## Installation instructions

Install Node.js 22 and Java 21. Run `npm install`, start `cd backend && mvn spring-boot:run`, then run `npm run dev`.

## Commercial licensing/contact

Commercial licensing and integration support are available through the repository contact options.

## Business problem and users

Doctors, nurses, engineers, teachers and other regulated professionals need faster, secure recognition across Member States.

## Key workflows

Find a qualification, create a recognition case, assign an authority, advance review and confirm the API result.

## React framework highlights

TanStack Query manages server state, Wouter provides routes and typed forms perform real API writes.

## Java backend highlights

Spring Boot exposes validated list, search, create and update APIs, clear errors, health status and service tests.

## Architecture and state flow

React calls `/api/items`; Java validates requests, applies transitions and returns updated records.

## Accessibility and responsive behaviour

Semantic landmarks, labelled controls, visible focus states and responsive layouts support keyboard and multiple screen sizes.

## Verification commands

Run `npm test`, `npm run lint`, `npm run build`, `cd backend && mvn test` and `cd backend && mvn package`.

## Structure

`src` contains the frontend, `backend` contains Java and `docs` contains inspected media.

## Tradeoffs

In-memory records simplify local use; production needs credential trust lists, persistence and national recognition integrations.

## Roadmap

Add diploma signatures, compensation measures, statutory clocks, multilingual forms and authority acknowledgements.
