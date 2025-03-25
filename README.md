# Wetter3

Wetter3 is a mobile frontend build on top of [https://www.wetter3.de](https://www.wetter3.de).

Wetter3 is a weather chart application built with Vue 3, Ionic, and Capacitor. It provides an interactive way to view weather data, including zooming, panning, and selecting different map types.

## Features

- **Interactive Weather Charts**: View and interact with weather charts.
- **Zoom and Pan**: Easily zoom in/out and pan across charts.
- **Date Navigation**: Navigate weather data by selecting specific dates.
- **Responsive Design**: Optimized for both mobile and desktop devices.
- **Dark Mode Support**: Automatically adapts to system theme settings.

### Install dependencies:
```
npm install
```

### Start the development server:
```
npm run dev
```

### Run tests using the following command:
```
npm run test:unit
```

## Deploy to web
### Deploy the contents of the dist/ directory to your hosting provider.
```
npm run build
npm run deploy
```

## Build Android/iOS
### Sync the web assets to the native platform.
```
npx cap sync
```

### Open the Native Project
```
npx cap open android
npx cap open ios
```

## License
This project is licensed under the MIT License.

## Acknowledgments
Built with Vue 3, Ionic Framework, and Capacitor.
Weather data sourced from Wetter3.
This project was partially built using GitHub Copilot to assist with code generation and documentation.

## Contributing
