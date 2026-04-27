def gerar_resposta_magus(mensagem: str) -> str:
    mensagem_lower = mensagem.lower().strip()

    if not mensagem_lower:
        return "Digite uma pergunta para que eu possa te ajudar."

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
            "e o backend responde com os dados em formato JSON. Essa arquitetura é muito usada em aplicações "
            "modernas porque separa a interface do usuário da regra de negócio."
        )

    if "react" in mensagem_lower:
        return (
            "React é uma biblioteca JavaScript usada para criar interfaces modernas e interativas. "
            "No projeto Magus, o React é responsável pela tela do assistente, pelo gerenciamento das mensagens, "
            "pelo histórico de conversas e pela comunicação com o backend através de requisições HTTP."
        )

    if "fastapi" in mensagem_lower:
        return (
            "FastAPI é um framework Python para criação de APIs modernas, rápidas e bem estruturadas. "
            "Ele gera automaticamente a documentação da API, facilita a validação dos dados com Pydantic "
            "e é uma excelente escolha para projetos fullstack, automações e integrações com inteligência artificial."
        )

    if "inteligência artificial" in mensagem_lower or "inteligencia artificial" in mensagem_lower or " ia " in f" {mensagem_lower} ":
        return (
            "Inteligência artificial é uma área da tecnologia que permite criar sistemas capazes de interpretar, "
            "gerar respostas, analisar informações e auxiliar na tomada de decisão. "
            "No projeto Magus, a IA será integrada ao backend para transformar o assistente em uma aplicação "
            "mais dinâmica e próxima de uma solução real de mercado."
        )

    if "portfólio" in mensagem_lower or "portfolio" in mensagem_lower:
        return (
            "Um bom projeto de portfólio precisa mostrar mais do que uma tela bonita. "
            "Ele deve demonstrar organização de código, integração entre frontend e backend, consumo de API, "
            "persistência de dados, boa experiência de usuário e documentação clara no GitHub. "
            "O projeto Magus é uma ótima base para isso."
        )

    if "magus" in mensagem_lower:
        return (
            "Eu sou o Magus, um assistente virtual desenvolvido como projeto fullstack. "
            "Minha estrutura utiliza React no frontend e Python com FastAPI no backend. "
            "Meu objetivo é demonstrar integração via API REST, gerenciamento de estado, histórico de conversas "
            "e futuramente integração com inteligência artificial real."
        )

    return (
        "Eu sou o Magus, seu assistente virtual fullstack. "
        "Ainda estou em evolução, mas já consigo responder sobre RPA, Python, React, FastAPI, APIs REST, "
        "inteligência artificial e portfólio de tecnologia."
    )