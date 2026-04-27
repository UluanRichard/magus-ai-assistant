import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
const [mensagem, setMensagem] = useState("");
const [mensagens, setMensagens] = useState([]);
const [conversaAtualId, setConversaAtualId] = useState(null);

const [historico, setHistorico] = useState(() => {
  const historicoSalvo = localStorage.getItem("magus_historico");

  if (historicoSalvo) {
    return JSON.parse(historicoSalvo);
  }

  return [];
});

const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    localStorage.setItem("magus_historico", JSON.stringify(historico));
  }, [historico]);

  async function enviarMensagem() {
  if (!mensagem.trim()) return;

  const textoUsuario = mensagem;

  const novaMensagemUsuario = {
    tipo: "usuario",
    texto: textoUsuario,
  };

  let idDaConversa = conversaAtualId;

  if (!idDaConversa) {
    idDaConversa = Date.now();
    setConversaAtualId(idDaConversa);

    setHistorico((atual) => [
      {
        id: idDaConversa,
        titulo:
          textoUsuario.length > 28
            ? textoUsuario.substring(0, 28) + "..."
            : textoUsuario,
        mensagens: [novaMensagemUsuario],
      },
      ...atual,
    ]);
  } else {
    setHistorico((atual) =>
      atual.map((conversa) =>
        conversa.id === idDaConversa
          ? {
              ...conversa,
              mensagens: [...(conversa.mensagens || []), novaMensagemUsuario],
            }
          : conversa
      )
    );
  }

  setMensagens((atual) => [...atual, novaMensagemUsuario]);
  setMensagem("");
  setCarregando(true);

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/chat", {
      message: textoUsuario,
    });

    const respostaMagus = {
      tipo: "magus",
      texto: response.data.answer,
    };

    setMensagens((atual) => [...atual, respostaMagus]);

    setHistorico((atual) =>
      atual.map((conversa) =>
        conversa.id === idDaConversa
          ? {
              ...conversa,
              mensagens: [...(conversa.mensagens || []), respostaMagus],
            }
          : conversa
      )
    );
  } catch (error) {
    const respostaErro = {
      tipo: "magus",
      texto:
        "Não consegui me conectar ao backend. Verifique se a API está rodando na porta 8000.",
    };

    setMensagens((atual) => [...atual, respostaErro]);

    setHistorico((atual) =>
      atual.map((conversa) =>
        conversa.id === idDaConversa
          ? {
              ...conversa,
              mensagens: [...(conversa.mensagens || []), respostaErro],
            }
          : conversa
      )
    );
  } finally {
    setCarregando(false);
  }
}

  function enviarComEnter(event) {
    if (event.key === "Enter") {
      enviarMensagem();
    }
  }

  function novaConversa() {
  setMensagens([]);
  setMensagem("");
  setConversaAtualId(null);
}

function limparHistorico() {
  setHistorico([]);
  setMensagens([]);
  setMensagem("");
  setConversaAtualId(null);
  localStorage.removeItem("magus_historico");
}

function abrirConversa(conversa) {
  setConversaAtualId(conversa.id);
  setMensagens(Array.isArray(conversa.mensagens) ? conversa.mensagens : []);
  setMensagem("");
}

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>
          <div>
            <h1>Magus</h1>
            <span>AI Assistant</span>
          </div>
        </div>

        <button className="new-chat" onClick={novaConversa}>
          + Nova conversa
        </button>

        <div className="sidebar-section">
          <p>Modelos disponíveis</p>
          <button className="model active">Magus IA</button>
          <button className="model">ChatGPT Plus</button>
          <button className="model">Gemini</button>
          <button className="model">Claude</button>
          <button className="model">Modo Simulado</button>
        </div>

        <div className="sidebar-section history">
          <div className="history-header">
            <p>Histórico</p>

            {historico.length > 0 && (
              <button onClick={limparHistorico}>Limpar</button>
            )}
          </div>

          {historico.length === 0 ? (
            <span>Nenhuma conversa salva ainda.</span>
          ) : (
            <div className="history-list">
              {historico.map((item) => (
  <button
    key={item.id}
    className={`history-item ${
      conversaAtualId === item.id ? "active-history" : ""
    }`}
    onClick={() => abrirConversa(item)}
  >
    {item.titulo}
  </button>
))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <span>Fullstack Project</span>
          <strong>Python + React</strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>Magus AI Assistant</h2>
            <p>Assistente virtual fullstack com Python e React</p>
          </div>

          <div className="status">
            <span></span>
            Online
          </div>
        </header>

        <section className="hero">
          {mensagens.length === 0 && (
            <>
              <div className="hero-badge">MAGUS</div>
              <h3>O que posso fazer por você?</h3>
              <p>
                Faça uma pergunta para testar a comunicação entre React e
                FastAPI.
              </p>

              <div className="suggestions">
                <button onClick={() => setMensagem("Explique o que é RPA")}>
                  Explique o que é RPA
                </button>

                <button
                  onClick={() => setMensagem("Explique o que é uma API REST")}
                >
                  Explique o que é uma API REST
                </button>

                <button onClick={() => setMensagem("Fale sobre Python")}>
                  Fale sobre Python
                </button>
              </div>
            </>
          )}
        </section>

        <section className="messages">
          {mensagens.map((msg, index) => (
            <div key={index} className={`message ${msg.tipo}`}>
              <div className="avatar">{msg.tipo === "usuario" ? "U" : "M"}</div>

              <div className="bubble">
                <span>{msg.tipo === "usuario" ? "Você" : "Magus"}</span>
                <p>{msg.texto}</p>
              </div>
            </div>
          ))}

          {carregando && (
            <div className="message magus">
              <div className="avatar">M</div>
              <div className="bubble">
                <span>Magus</span>
                <p>Estou pensando...</p>
              </div>
            </div>
          )}
        </section>

        <section className="input-wrapper">
          <div className="input-box">
            <input
              type="text"
              placeholder="Digite sua pergunta aqui..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={enviarComEnter}
            />

            <button onClick={enviarMensagem}>Enviar</button>
          </div>

          <small>
            Projeto criado para portfólio com integração frontend/backend via
            REST.
          </small>
        </section>
      </main>
    </div>
  );
}

export default App;