# Magus AI Assistant

O **Magus AI Assistant** é uma aplicação fullstack inspirada em assistentes modernos de inteligência artificial.

O projeto foi desenvolvido com **Python + FastAPI** no backend e **React + Vite** no frontend, com comunicação entre as camadas por meio de uma **API REST**.

A proposta do projeto é demonstrar, de forma prática, conceitos importantes de desenvolvimento fullstack, integração entre frontend e backend, gerenciamento de estado, persistência local de dados e arquitetura organizada para portfólio.

---

## Funcionalidades

- Interface moderna inspirada em assistentes de IA
- Chat entre usuário e assistente virtual
- Backend em Python com FastAPI
- Frontend em React
- Comunicação via API REST
- Histórico de conversas
- Conversas completas salvas no navegador com localStorage
- Recuperação de conversas ao clicar no histórico
- Modo visual dark
- Estrutura organizada para evolução do projeto

---

## Tecnologias utilizadas

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### Frontend

- React
- Vite
- JavaScript
- Axios
- HTML
- CSS

### Outros recursos

- LocalStorage
- API REST
- Git e GitHub

---

## Estrutura do projeto

```text
magus-ai-assistant/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   └── chat_routes.py
│   │   └── services/
│   │       └── magus_service.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore