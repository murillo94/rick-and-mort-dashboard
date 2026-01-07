## Rick & Morty Dashboard

A **Next.js dashboard** that consumes a public **GraphQL API** to display and search paginated data using an **infinitely scrolling table** and a **pie chart**.

---

## Starting the Application

> This project uses **[pnpm](https://pnpm.io/installation#prerequisites)**, so make sure it’s installed. If not, install it using one of the commands below:
>
> * `npm install -g pnpm@latest-10`
> * `brew install pnpm` (macOS)

1. Install dependencies:

   ```bash
   pnpm install
   ```
2. Start the dev server:

   ```bash
   pnpm dev
   ```
3. Open **[http://localhost:3000](http://localhost:3000)** in your browser to test the app.


## Running test

This project use [vitest](https://vitest.dev/) to build unit and integration tests, to start the tests you can run:

  ```bash
   pnpm test
   ```

---

## Introduction

### Pages Implemented

1. **Home (List)**
2. **Reports**
3. **Character Detail**

### Features by Page

* **Home:**
  Users can search characters by name. Clicking a row navigates to the **Character Detail** page, where full character information is displayed.

* **Reports:**
  Displays aggregated information about **species** and **locations** using a **pie chart** visualization.

* **Character Detail:**
  Shows full details for the selected character, including name, gender, life status, episodes, and more.

P.S.: All filters are managed via **URL search parameters**, making them easy to share. This approach relies more on the browser than internal component state, giving the application a more **native and predictable** feel.

---

## Architecture

```text
├── public                          # static assets
├── src                             # source files
    ├── (dashboard)                 # routes/screens
    ├── data-access                 # GraphQL queries, Zod schema validation, API/services/server logic
    ├── lib                         # Apollo Client setup
    ├── ui                          # primitive UI components
    ├── utils                       # shared helpers
```

To improve readability and maintainability, the project follows **DDD (Domain-Driven Design)** principles, keeping domain logic as close as possible to where it's used.

---

## Component Structure

* **`ui/` folder:**
  Contains primitive, reusable components (dumb/presentational components). These are meant to be composed into higher level components and reused across the application.

* **`_components/` folder:**
  Follows Next.js conventions and contains components with logic and data fetching. These are typically tied closely to a specific page and are not intended to be globally reusable.

---

## Design Decisions

I built everything from scratch—from primitive components to full pages without copying code from external templates. The goal was to keep the interface **clean and focused**, showing only relevant information with **solid colors** and minimal distractions.

---

## Relevant Technologies

* [Next.js](https://nextjs.org/)
* [Apollo GraphQL](https://www.apollographql.com/)
* [nuqs](https://nuqs.dev/)
* [Zod](https://zod.dev/)
* [Tailwind CSS](https://tailwindcss.com/)