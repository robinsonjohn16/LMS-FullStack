# LMS-Frontend


### Setup Instructions

1. Clone the Project

``````
  git clone https://github.com/ankitmishraindia/LMS-Frontend

``````

2. Move into the directory

``````
  cd LMS-Frontend

``````

3. Install Dependencies

``````
   npm install

``````
4. Run the Server

``````
  npm run dev

``````

### Tailwind Setup

[Tailwind Official instruction doc](https://tailwindcss.com/docs/installation)
1. Install Tailwindcss
``````
npm install -D tailwindcss
``````
2. Create tailwind configuration file
``````
npx tailwindcss init
``````
3. Add file extensions to tailwind config file in content property
``````
content: ["./src/**/*.{html,js,jsx,ts,tsx}"]
``````
4. Add tailwind directives at the top of the 'index.css' file
``````
@tailwind base;
@tailwind components;
@tailwind utilities;
``````

### Added Plugins and dependencies

``````
npm install @reduxjs/toolkit react-redux react-router-dom react-icons react-chartjs-2 chart.js daisyui axios react-hot-toast @tailwindcss/line-clamp
``````