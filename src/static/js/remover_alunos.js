document.addEventListener("DOMContentLoaded", async function() {

    const formulario = document.getElementById("removerAlunoForm");
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoRemover");
    const token = sessionStorage.getItem("access_token");

    const numeroAluno = document.getElementById("numero_aluno");

    const infoAluno = document.getElementById("infoAluno");
    const nomeAluno = document.getElementById("nomeAluno");
    const estadoAtual = document.getElementById("estadoAtual");
    const roleAtual = document.getElementById("roleAtual");

    const estado = document.getElementById("estado");
    const novaRole = document.getElementById("novaRole");

    let alunoSelecionado = null;
    let timeoutPesquisa = null;

    if (!token || sessionStorage.getItem("role") !== "admin") {
        mensagem.textContent = "Não tens autorização para aceder a esta página.";
        return;
    }

    try {

        const resposta = await fetch("/api/admin", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (resposta.status === 401 || resposta.status === 422) {
            sessionStorage.clear();
            window.location.replace("/login-page");
            return;
        }

        if (!resposta.ok) {
            mensagem.textContent = "Apenas administradores podem aceder.";
            return;
        }

        if (!formulario || !conteudo) {
            mensagem.textContent = "Erro ao carregar o formulário.";
            return;
        }

        conteudo.style.display = "block";

    } catch (erro) {
        mensagem.textContent = "Não foi possível verificar as permissões.";
        return;
    }

    function limparInformacao() {

        alunoSelecionado = null;

        infoAluno.style.display = "none";

        novaRole.disabled = true;
        novaRole.value = "";

        nomeAluno.textContent = "";
        estadoAtual.textContent = "";
        roleAtual.textContent = "";

        estado.value = "";
    }

    numeroAluno.addEventListener("input", function() {

        clearTimeout(timeoutPesquisa);
        limparInformacao();

        mensagem.textContent = "";

        const numero = numeroAluno.value.trim();

        if (!numero) {
            return;
        }

        timeoutPesquisa = setTimeout(async function() {

            try {

                const resposta = await fetch(
                    `/api/alunos/role/${encodeURIComponent(numero)}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (resposta.status === 401 || resposta.status === 422) {
                    sessionStorage.clear();
                    window.location.replace("/login-page");
                    return;
                }

                const dados = await resposta.json();

                if (!resposta.ok) {
                    mensagem.textContent = dados.message || "Aluno não encontrado.";
                    limparInformacao();
                    return;
                }

                alunoSelecionado = dados;

                nomeAluno.textContent = dados.nome;
                estadoAtual.textContent = dados.estado;
                roleAtual.textContent = dados.role;

                infoAluno.style.display = "block";

                if (dados.role === "admin") {

                    novaRole.disabled = true;
                    novaRole.value = "";

                    mensagem.textContent =
                        "Este utilizador é administrador. A sua role não pode ser alterada.";

                } else {

                    novaRole.disabled = false;
                    novaRole.value = dados.role;

                    mensagem.textContent = "";
                }

            } catch (erro) {

                mensagem.textContent = "Não foi possível contactar o servidor.";
                limparInformacao();

            }

        }, 400);

    });

    formulario.addEventListener("submit", async function(event) {

        event.preventDefault();

        if (!alunoSelecionado) {
            mensagem.textContent = "Procura primeiro um aluno válido.";
            return;
        }

        let roleEscolhida = novaRole.value || null;

        if (alunoSelecionado.role === "admin") {
            roleEscolhida = null;
        }

        const aluno = {
            numero_aluno: numeroAluno.value.trim(),
            estado: estado.value,
            observacoes: document.getElementById("observacoes").value,
            role: roleEscolhida
        };

        try {

            const resposta = await fetch("/api/alunos/estado", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(aluno)
            });

            const dados = await resposta.json();

            if (resposta.status === 401 || resposta.status === 422) {
                sessionStorage.clear();
                window.location.replace("/login-page");
                return;
            }

            mensagem.textContent = dados.message || "Erro ao alterar os dados.";

            if (resposta.ok) {

                alunoSelecionado.estado = aluno.estado;

                if (roleEscolhida !== null) {
                    alunoSelecionado.role = roleEscolhida;
                    roleAtual.textContent = roleEscolhida;
                }

                estadoAtual.textContent = aluno.estado;

                formulario.reset();
                limparInformacao();
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível contactar o servidor.";
        }

    });

});