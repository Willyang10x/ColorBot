const seletorCor = document.getElementById("seletorCor");
const areaPaleta = document.getElementById("paleta");
const toast = document.getElementById("toast");

seletorCor.addEventListener("input", () => {
  gerarPaleta(seletorCor.value);
});

function gerarPaleta(hex) {
  areaPaleta.innerHTML = "";

  const hsl = converterHexParaHSL(hex);
  const variacoes = [
    { nome: "Original", h: hsl.h, s: hsl.s, l: hsl.l },
    { nome: "Luz Clara", h: hsl.h, s: hsl.s, l: Math.min(hsl.l + 15, 95) },
    { nome: "Suave", h: hsl.h, s: Math.max(hsl.s - 20, 10), l: Math.min(hsl.l + 30, 90) },
    { nome: "Profundo", h: hsl.h, s: hsl.s, l: Math.max(hsl.l - 20, 5) },
    { nome: "Contraste", h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
    { nome: "Vibrante", h: (hsl.h + 30) % 360, s: Math.min(hsl.s + 20, 100), l: hsl.l }
  ];

  variacoes.forEach((cor, index) => {
    const hexCor = converterHSLParaHex(cor.h, cor.s, cor.l);
    const corTexto = getContrastYIQ(hexCor);
    
    const caixa = document.createElement("div");
    caixa.className = "caixa-cor";
    caixa.style.backgroundColor = hexCor;
    caixa.style.color = corTexto;
    caixa.style.animationDelay = `${index * 0.05}s`;

    caixa.innerHTML = `
      <strong>${cor.nome}</strong>
      <span>${hexCor.toUpperCase()}</span>
      <button onclick="copiarHEX('${hexCor}')">Copiar</button>
    `;
    areaPaleta.appendChild(caixa);
  });
}

function getContrastYIQ(hexcolor){
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#1e293b' : '#ffffff';
}

function copiarHEX(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    toast.innerText = `Cor ${texto.toUpperCase()} copiada!`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });
}

function converterHexParaHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min;
  let h = 0, s = 0, l = (max + min) / 2;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / delta + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / delta + 2; break;
      case b: h = (r - g) / delta + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

function converterHSLParaHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  r = Math.round((r + m) * 255).toString(16).padStart(2, "0");
  g = Math.round((g + m) * 255).toString(16).padStart(2, "0");
  b = Math.round((b + m) * 255).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

gerarPaleta(seletorCor.value);