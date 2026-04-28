import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [conversaAtualId, setConversaAtualId] = useState(null);
  const [mensagemCopiada, setMensagemCopiada] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [statusApi, setStatusApi] = useState({
    status: "offline",
    mode: "Verificando...",
    model: "",
  });

  const [historico, setHistorico] = useState(() => {
    const historicoSalvo = localStorage.getItem("magus_historico");

    if (historicoSalvo) {
      try {
        return JSON.parse(historicoSalvo);
      } catch (error) {
        return [];
      }
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("magus_historico", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    async function buscarStatusApi() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/status");
        setStatusApi(response.data);
      } catch (error) {
        setStatusApi({
          status: "offline",
          mode: "Backend offline",
          model: "",
        });
      }
    }

    buscarStatusApi();
  }, []);

  function gerarHorarioAtual() {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function enviarMensagem() {
    if (!mensagem.trim() || carregando) return;

    const textoUsuario = mensagem.trim();

    const novaMensagemUsuario = {
      tipo: "usuario",
      texto: textoUsuario,
      horario: gerarHorarioAtual(),
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
                mensagens: [
                  ...(conversa.mensagens || []),
                  novaMensagemUsuario,
                ],
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
        horario: gerarHorarioAtual(),
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
        horario: gerarHorarioAtual(),
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
    if (event.key === "Enter" && !event.shiftKey) {
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

  async function copiarMensagem(texto, index) {
    try {
      await navigator.clipboard.writeText(texto);
      setMensagemCopiada(index);

      setTimeout(() => {
        setMensagemCopiada(null);
      }, 1800);
    } catch (error) {
      alert("Não foi possível copiar a mensagem.");
    }
  }

  function limparConversaAtual() {
    setMensagens([]);
    setMensagem("");
    setConversaAtualId(null);
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

        <button type="button" className="new-chat" onClick={novaConversa}>
          + Nova conversa
        </button>

        <div className="sidebar-section">
          <p>Modelos disponíveis</p>
          <button type="button" className="model active">
            Magus IA
          </button>
          <button type="button" className="model">
            ChatGPT Plus
          </button>
          <button type="button" className="model">
            Gemini
          </button>
          <button type="button" className="model">
            Claude
          </button>
          <button type="button" className="model">
            Modo Simulado
          </button>
        </div>

        <div className="sidebar-section history">
          <div className="history-header">
            <p>Histórico</p>

            {historico.length > 0 && (
              <button type="button" onClick={limparHistorico}>
                Limpar
              </button>
            )}
          </div>

          {historico.length === 0 ? (
            <span>Nenhuma conversa salva ainda.</span>
          ) : (
            <div className="history-list">
              {historico.map((item) => (
                <button
                  type="button"
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

          <div className="topbar-actions">
            {mensagens.length > 0 && (
              <button
                type="button"
                className="clear-chat-btn"
                onClick={limparConversaAtual}
              >
                Limpar conversa
              </button>
            )}

            <div
              className={`status ${
                statusApi.status === "online" ? "online" : "offline"
              }`}
            >
              <span></span>
              {statusApi.status === "online"
                ? `Online · ${statusApi.mode}${
                    statusApi.model ? ` · ${statusApi.model}` : ""
                  }`
                : statusApi.mode}
            </div>
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
                <button
                  type="button"
                  onClick={() => setMensagem("Explique o que é RPA")}
                >
                  Explique o que é RPA
                </button>

                <button
                  type="button"
                  onClick={() => setMensagem("Explique o que é uma API REST")}
                >
                  Explique o que é uma API REST
                </button>

                <button
                  type="button"
                  onClick={() => setMensagem("Fale sobre Python")}
                >
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
                <div className="message-header">
                  <span>{msg.tipo === "usuario" ? "Você" : "Magus"}</span>

                  {msg.horario && <small>{msg.horario}</small>}
                </div>

                <p>{msg.texto}</p>

                {msg.tipo === "magus" && (
                  <div className="message-actions">
                    <button
                      type="button"
                      onClick={() => copiarMensagem(msg.texto, index)}
                    >
                      {mensagemCopiada === index
                        ? "Copiado"
                        : "Copiar resposta"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {carregando && (
            <div className="message magus">
              <div className="avatar">M</div>

              <div className="bubble">
                <div className="message-header">
                  <span>Magus</span>
                </div>

                <p className="typing">
                 Magus está pensando
                <span className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
                </span>
                </p>
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

            <button
              type="button"
              onClick={enviarMensagem}
              disabled={carregando}
            >
              {carregando ? "Enviando..." : "Enviar"}
            </button>
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