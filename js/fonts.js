const head = document.getElementsByTagName('head')[0];

// Adiciona a fonte Roboto
const robotoFontLink = document.createElement('link');
robotoFontLink.rel = 'stylesheet';
robotoFontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap';
head.appendChild(robotoFontLink);

const DosisFonte = document.createElement('link');
DosisFonte.rel = 'stylesheet';
DosisFonte.href = 'https://fonts.googleapis.com/css2?family=Dosis&display=swap';
head.appendChild(DosisFonte);

// Adiciona a fonte Dancing Script
const dancingScriptFontLink = document.createElement('link');
dancingScriptFontLink.rel = 'stylesheet';
dancingScriptFontLink.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap';
head.appendChild(dancingScriptFontLink);

// Adiciona a fonte Bebas Neue
const bebasNeueFontLink = document.createElement('link');
bebasNeueFontLink.rel = 'stylesheet';
bebasNeueFontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap';
head.appendChild(bebasNeueFontLink);