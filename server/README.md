# Server

Express API structured for clean separation (config, models, controllers, services, routes, middleware, utils, validators, jobs).

Dev:

```powershell
cd server
npm install
npm run dev
```

### Migration helper

A one‑time check ensures all existing users have an `isActive` flag. You can run it manually or via the npm script:

```powershell
npm run migrate     # clones comprehensive-fix.js behaviour
```

The same migration also runs automatically each time the server connects to MongoDB, logging how many documents were adjusted.

### Running tests

Basic auth controller unit tests are provided using Jest and Supertest. Install dev dependencies and run:

```powershell
npm run test          # also generates coverage report
```

Mocks are used so no real database is required. Feel free to expand with integration tests.

