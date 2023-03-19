import { setCssVar, QVueGlobals } from 'quasar';
function rgbColorToHex(color: string) {
  const values = color.split(',');
  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);

  const hex = '#' + rgbToHex(r, g, b);
  return hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return valueToHex(r) + valueToHex(g) + valueToHex(b);
}

function valueToHex(c: number): string {
  let hexValue = c.toString(16);
  //prefix with 0 if needed
  if (hexValue.length === 1) {
    hexValue = '0' + hexValue;
  }
  return hexValue;
}

async function updateTheme($q: QVueGlobals, theme?: any) {
  if (theme) {
  } else {
    theme = ((await $q.bex.send('theme-get')) as any).data;
  }
  setCssVar('primary', rgbColorToHex(theme.mainHeader));
  setCssVar('secondary', rgbColorToHex(theme.foreground));
  setCssVar('accent', rgbColorToHex(theme.text));
}

export { updateTheme };
