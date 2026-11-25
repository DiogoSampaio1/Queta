document.addEventListener("DOMContentLoaded", async function() {
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoTurmas");
    const lista = document.getElementById("listaTurmas");
    const formulario = document.getElementById("gerirTurmaForm");
    const token = sessionStorage.getItem("access_token");

    let turmas = [];
    let turmaSelecionada = null;

    if (!token || sessionStorage.getItem("role") !== "admin") {
        mensagem.textContent = "Não tens autorização para aceder a esta página.";
        return;
    }

    async function carregarTurmas() {
        const resposta = await fetch("/api/turmas", {
            headers: {"Authorization": `Bearer ${token}`}
        });

        const dados = await resposta.json();

        if (resposta.status === 401 || resposta.status === 422) {
            sessionStorage.clear();
            window.location.replace("/login-page");
            return;
        }

        if (!resposta.ok) {
            throw new Error(dados.message);
        }

        turmas = dados.turmas;
        lista.innerHTML = "";

        turmas.forEach(function(turma) {
            const linha = document.createElement("tr");

            [turma.codigo, turma.ano_letivo, turma.limite_alunos,
             turma.ativa ? "Ativa" : "Inativa"].forEach(function(valor) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            const celulaAcao = document.createElement("td");
            const botao = document.createElement("button");

            botao.textContent = "Editar";
            botao.addEventListener("click", function() {
                editarTurma(turma);
            });

            celulaAcao.appendChild(botao);
            linha.appendChild(celulaAcao);
            lista.appendChild(linha);
        });

        mensagem.textContent = turmas.length === 0
            ? "Não existem turmas registadas."
            : "";
    }

    function editarTurma(turma) {
        turmaSelecionada = turma.turma_id;

        document.getElementById("codigo").value = turma.codigo;
        document.getElementById("ano_letivo").value = turma.ano_letivo;
        document.getElementById("limite_alunos").value = turma.limite_alunos;
        document.getElementById("ativa").checked = Boolean(turma.ativa);

        formulario.style.display = "block";
        mensagem.textContent = "";

        formulario.scrollIntoView({behavior: "smooth"});
    }

    document.getElementById("cancelarEdicao").addEventListener("click", function() {
        formulario.style.display = "none";
        turmaSelecionada = null;
    });

    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();

        const turma = {
            codigo: document.getElementById("codigo").value.trim(),
            ano_letivo: document.getElementById("ano_letivo").value.trim(),
            limite_alunos: Number(document.getElementById("limite_alunos").value),
            ativa: document.getElementById("ativa").checked
        };

        try {
            const resposta = await fetch(`/api/turmas/${turmaSelecionada}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(turma)
            });

            const dados = await resposta.json();

            if (resposta.status === 401 || resposta.status === 422) {
                sessionStorage.clear();
                window.location.replace("/login-page");
                return;
            }

            mensagem.textContent = dados.message || "Erro ao atualizar turma.";

            if (resposta.ok) {
                formulario.style.display = "none";
                turmaSelecionada = null;
                await carregarTurmas();
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível contactar o servidor.";
        }
    });

    try {
        const verificacao = await fetch("/api/admin", {
            headers: {"Authorization": `Bearer ${token}`}
        });

        if (verificacao.status === 401 || verificacao.status === 422) {
            sessionStorage.clear();
            window.location.replace("/login-page");
            return;
        }

        if (!verificacao.ok) {
            mensagem.textContent = "Apenas administradores podem aceder.";
            return;
        }

        conteudo.style.display = "block";
        await carregarTurmas();

    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar as turmas.";
    }
});