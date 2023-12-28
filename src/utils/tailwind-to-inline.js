import { tailwindToCSS } from 'tw-to-css';

const { twi } = tailwindToCSS({
  config: {
    theme: {
      extend: {
        colors: {
          primary: '#42389D',
          accent: {
            100: '#eeeefd',
            200: '#dedcfb',
            300: '#cdcbf9',
            400: '#bcb9f7',
            500: '#aca8f6',
            600: '#9b96f4',
            700: '#8a85f2',
            800: '#7973f0',
            900: '#6962ee',
            DEFAULT: '#5850EC',
          },
        },
      },
    },
  },
});

function convertTailwindToInlineStyle(json) {
  // Handle element nodes
  if (json.type === 'element' || json.type === 'block') {
    console.log(json.type);
    // Set class names
    if (json.className) {
      console.log(json.type);
      // Convert classes to inline CSS
      const styleInline = twi(json.className);
      json.inlineStyle = styleInline;
    }

    // Process children
    if (json.children) {
      json.children.forEach((childJson) => {
        convertTailwindToInlineStyle(childJson);
      });
    }
  }

  return json;
}

export { convertTailwindToInlineStyle };
