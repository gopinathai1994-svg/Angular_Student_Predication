# Angular Dashboard

This project was created with Angular CLI 22.1.8 using standalone components and Angular Router.

## 1. Install Angular CLI

This workspace uses the latest stable Angular CLI release that was available when the project was created:

```bash
npm install -g @angular/cli@22.1.8
```

The project also keeps Angular CLI as a local development dependency in `package.json`, so you can run Angular commands through npm scripts or `npx ng`.

## 2. Create the Project

The app was generated with routing and standalone components enabled:

```bash
npx -p @angular/cli@22.1.8 ng new angular-dashboard --standalone --routing --style=css --skip-git --package-manager=npm
```

Important options:

- `--standalone` creates a modern Angular app without NgModules.
- `--routing` creates the router setup.
- `--style=css` keeps styling beginner-friendly.
- `--skip-git` avoids creating a nested Git repository.

## 3. Standalone Component Setup

The app starts in `src/main.ts`:

```ts
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

There is no `AppModule`. Instead, Angular bootstraps the standalone root component directly.

The root component imports the router directives it uses:

```ts
@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
```

The dashboard is also a standalone component:

```ts
@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
```

## 4. Router Configuration

The router is configured in `src/app/app.config.ts`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
```

Routes live in `src/app/app.routes.ts`:

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
];
```

The empty route uses `pathMatch: 'full'`, so Angular redirects only when the whole URL path is empty.

## 5. Run the App

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

The empty URL redirects to:

```text
http://localhost:4200/dashboard
```

## 6. Build and Test

Build the app:

```bash
npm run build
```

Run unit tests once:

```bash
npm test -- --watch=false
```

## 7. Angular Material, Bootstrap, and jQuery

The UI packages were installed with:

```bash
npm install @angular/material @angular/cdk @angular/animations bootstrap jquery
npm install --save-dev @types/jquery
```

Global styles and scripts are configured in `angular.json`:

```json
"styles": [
  "node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
],
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

Angular Material animations are enabled in `src/app/app.config.ts`:

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideAnimationsAsync(),
  provideRouter(routes)
]
```

`MatPaginator` is used directly by the standalone Dashboard component in `src/app/dashboard/dashboard.ts`:

```ts
@Component({
  imports: [MatPaginatorModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
```

Because Material, Bootstrap, and jQuery all add global assets, the production initial bundle budget was raised in `angular.json`:

```json
"maximumWarning": "1.5MB",
"maximumError": "2MB"
```
