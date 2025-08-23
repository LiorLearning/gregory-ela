## AsherE - Local dev

Prereqs: Node.js 18 or newer.

1) Copy environment template and add your key:

```bash
cp .env.example .env
# edit .env and set OPENAI_API_KEY
```

2) Install dependencies and start client + server in parallel:

```bash
npm install
npm run dev
```

- Client: `http://localhost:5173`
- API server: `http://localhost:8787`

3) Build client:

```bash
npm run build
npm run preview
```


testing