const sfTheme = './src/theme.ts'

module.exports = {
  content: [
    './src/**/*.{html,svelte}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",

    // Using glob patterns results in infinite loop
    './public/index.html',
    './public/cairo.html',
    './public/embed.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...sfTheme
    }
  }
};
