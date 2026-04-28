import os
import re
from dotenv import load_dotenv

load_dotenv()


SYSTEM_PROMPT = """
Você é o Magus, um assistente virtual inteligente criado por Uluan Alves.

Seu objetivo é responder de forma clara, profissional, útil e agradável para o usuário.

Você deve ajudar com tecnologia, programação, RPA, Python, React, FastAPI,
APIs REST, portfólio, carreira em tecnologia, metodologias ágeis e dúvidas gerais.

Regras de resposta:
- Responda sempre em português do Brasil.
- Use uma linguagem clara, objetiva e profissional.
- Não use Markdown.
- Não use emojis.
- Não use símbolos como **, ###, ``` ou formatação pesada.
- Não use caracteres especiais estranhos ou símbolos decorativos.
- Não misture idiomas sem necessidade.
- Revise a resposta antes de finalizar.
- Escreva como se estivesse conversando dentro de um sistema de chat profissional.
- Prefira respostas com parágrafos curtos.
- Quando precisar listar informações, use tópicos simples com hífen.
- Use no máximo 4 ou 5 tópicos por resposta.
- Não escreva respostas muito longas, a menos que o usuário peça detalhes.
- Comece com uma explicação direta.
- Quando o assunto for técnico, explique de forma simples e prática.
- Quando o usuário pedir texto profissional, entregue em tom claro e bem formatado.
- Se não souber algo, seja honesto.
- Nunca exponha chaves de API, tokens ou dados sigilosos.
- Por padrão, responda em até 2 parágrafos curtos e no máximo 4 tópicos.
- Só aprofunde a resposta se o usuário pedir detalhes.
""".strip()

def limpar_resposta(texto: str) -> str:
    if not texto:
        return "Não consegui gerar uma resposta no momento."

    # Remove formatações indesejadas
    texto = texto.replace("**", "")
    texto = texto.replace("###", "")
    texto = texto.replace("```", "")
    texto = texto.replace("•", "-")

    # Remove caracteres quebrados ou estranhos
    texto = texto.replace("�", "")
    texto = texto.replace("□", "")
    texto = texto.replace("▯", "")
    texto = texto.replace("�", "")

    # Remove caracteres de controle invisíveis
    texto = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", texto)

    # Remove sequências muito estranhas de símbolos
    texto = re.sub(r"[^\S\r\n]+", " ", texto)

    # Corrige excesso de quebras de linha
    texto = re.sub(r"\n{3,}", "\n\n", texto)

    # Remove espaços antes de pontuação
    texto = re.sub(r"\s+([,.!?;:])", r"\1", texto)

    return texto.strip()


def gerar_resposta_magus(mensagem: str) -> str:
    mensagem = (mensagem or "").strip()

    if not mensagem:
        return "Digite uma pergunta para que eu possa te ajudar."

    provider = os.getenv("MAGUS_AI_PROVIDER", "mock").lower()

    if provider == "openai":
        return gerar_resposta_openai(mensagem)

    return limpar_resposta(gerar_resposta_mock(mensagem))


def gerar_resposta_openai(mensagem: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("MAGUS_MODEL", "gpt-5.5-mini")

    if not api_key:
        return (
            "O modo de IA real está ativado, mas a variável OPENAI_API_KEY "
            "não foi configurada no arquivo .env."
        )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model=model,
            input=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": mensagem,
                },
            ],
        )

        return limpar_resposta(response.output_text)

    except Exception as erro:
        return (
            "Não consegui gerar uma resposta com a IA real no momento. "
            f"Detalhe técnico: {str(erro)}"
        )


def gerar_resposta_mock(mensagem: str) -> str:
    mensagem_lower = mensagem.lower().strip()

    if "rpa" in mensagem_lower or "automação" in mensagem_lower or "automacao" in mensagem_lower:
        return (
            "RPA significa Automação Robótica de Processos. "
            "É uma tecnologia utilizada para automatizar tarefas repetitivas, "
            "como preenchimento de sistemas, leitura de planilhas, envio de e-mails, "
            "consultas em portais e integração entre sistemas. "
            "Na prática, o RPA ajuda a reduzir retrabalho, diminuir erros manuais "
            "e aumentar a produtividade das equipes."
        )

    if "python" in mensagem_lower:
        return (
            "Python é uma linguagem de programação simples, poderosa e muito usada no mercado. "
            "Ela é aplicada em automação, desenvolvimento web, análise de dados, inteligência artificial "
            "e criação de APIs. No projeto Magus, Python está sendo usado no backend com FastAPI "
            "para receber as mensagens do frontend e retornar respostas ao usuário."
        )

    if "api rest" in mensagem_lower or "api" in mensagem_lower:
        return (
            "API REST é uma forma de comunicação entre sistemas usando o protocolo HTTP. "
            "No projeto Magus, o frontend em React envia uma requisição POST para o backend em Python, "
            "e o backend responde com dados em formato JSON. Essa arquitetura separa a interface "
            "do usuário da regra de negócio."
        )

    if "react" in mensagem_lower:
        return (
            "React é uma biblioteca JavaScript usada para criar interfaces modernas e interativas. "
            "No projeto Magus, o React é responsável pela tela do assistente, pelo gerenciamento "
            "das mensagens, pelo histórico de conversas e pela comunicação com o backend."
        )

    if "fastapi" in mensagem_lower:
        return (
            "FastAPI é um framework Python para criação de APIs modernas, rápidas e bem estruturadas. "
            "Ele gera automaticamente a documentação da API, facilita a validação dos dados com Pydantic "
            "e é uma ótima escolha para projetos fullstack e integrações com inteligência artificial."
        )

    if (
        "inteligência artificial" in mensagem_lower
        or "inteligencia artificial" in mensagem_lower
        or " ia " in f" {mensagem_lower} "
    ):
        return (
            "Inteligência artificial é uma área da tecnologia que permite criar sistemas capazes de interpretar, "
            "gerar respostas, analisar informações e auxiliar na tomada de decisão. "
            "No projeto Magus, a IA foi estruturada para poder ser conectada a um provedor real por meio do backend."
        )

    if "portfólio" in mensagem_lower or "portfolio" in mensagem_lower:
        return (
            "Um bom projeto de portfólio precisa demonstrar organização de código, integração entre frontend "
            "e backend, consumo de API, persistência de dados, boa experiência de usuário e documentação clara. "
            "O projeto Magus mostra todos esses pontos."
        )

    if "magus" in mensagem_lower:
        return (
            "Eu sou o Magus, um assistente virtual desenvolvido como projeto fullstack. "
            "Minha estrutura utiliza React no frontend e Python com FastAPI no backend. "
            "Fui preparado para funcionar em modo simulado ou conectado a uma IA real por meio de API."
        )

    return (
        "Eu sou o Magus, seu assistente virtual fullstack. "
        "Estou preparado para responder em modo simulado e também para ser conectado a uma IA real. "
        "Posso ajudar com RPA, Python, React, FastAPI, APIs REST, inteligência artificial e portfólio."
    )