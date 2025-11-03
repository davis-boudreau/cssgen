
export const copyToClipboard = (text: string, message: string = 'Copied to clipboard!') => {
  navigator.clipboard.writeText(text).then(() => {
    // You can add a toast notification here if desired
    console.log(message);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

export const updateGoogleFontsLink = (baseFont: string, headingFont: string) => {
    const linkElement = document.getElementById('google-fonts-link') as HTMLLinkElement | null;
    if (linkElement) {
        const baseFontFamily = baseFont.replace(/\s/g, '+');
        const headingFontFamily = headingFont.replace(/\s/g, '+');
        const href = `https://fonts.googleapis.com/css2?family=${baseFontFamily}:wght@400;700&family=${headingFontFamily}:wght@700&display=swap`;
        if (linkElement.href !== href) {
            linkElement.href = href;
        }
    }
};
