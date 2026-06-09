# 🌹 Floating Letters & Rose Garden

**Projeto 1 — Letras Flutuantes e Jardim de Rosas com p5.js**
Unidade curricular: Edições Multimédia Interativas · LEM 3 · ISTEC Porto · 2025/2026

---

## Descrição

Experiência visual e sonora interativa construída com p5.js. O utilizador fala para o microfone e as letras reconhecidas surgem a flutuar no ecrã; ao clicar ou arrastar no canvas, rosas aparecem animadas. O projeto explora a interseção entre entrada de voz, física de partículas e arte generativa.

## Demo

🔗 [vero279.github.io/FloatingLetters](https://vero279.github.io/FloatingLetters/)

## Funcionalidades

- 🎤 **Microfone** — as palavras faladas são convertidas em letras flutuantes no canvas
- 🌹 **Rosas** — clicar ou arrastar no canvas cria rosas animadas
- ⬇ **Drop Letters** — faz cair todas as letras e rosas com física de gravidade
- 🧹 **Clear All** — limpa o canvas removendo letras e rosas
- Física de partículas com colisões e movimento autónomo

## Tecnologias

| Tecnologia | Função |
|---|---|
| p5.js | Motor gráfico, animação e física de partículas |
| p5.sound | Captura e processamento de áudio do microfone |
| Web Speech API | Reconhecimento de voz no browser |
| HTML5 | Estrutura da página |
| CSS3 | Estilização da interface |

## Estrutura do Repositório

```
FloatingLetters/
├── index.html        # Estrutura da aplicação
├── sketch.js         # Lógica principal — letras, rosas e interações
├── p5.js             # Biblioteca p5.js (local)
├── p5.sound.min.js   # Biblioteca p5.sound (local)
├── style.css         # Estilos
└── README.md
```

## Como Executar Localmente

```bash
git clone https://github.com/Vero279/FloatingLetters.git
cd FloatingLetters
# Abrir index.html num servidor local (ex: Live Server no VS Code)
```

> **Nota:** O acesso ao microfone requer HTTPS ou `localhost`. A Web Speech API tem suporte nativo no Chrome/Edge; noutros browsers pode não funcionar.

## Autora

**Verónica Couto** · veronica.couto.2022279@my.istec.pt
