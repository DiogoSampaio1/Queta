document.addEventListener("DOMContentLoaded", async function() {
    const listaTurmas = document.getElementById("listaTurmas");
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoTurmas");
    const token = sessionStorage.getItem("access_token");

    if (!token) {
        window.location.replace("/login-page");
        return;
    }

    try {
        const resposta = await fetch("/api/turmas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (resposta.status === 401 || resposta.status === 422) {
            sessionStorage.clear();
            window.location.replace("/login-page");
            return;
        }

        if (!resposta.ok) {
            throw new Error(dados.message || "Erro ao obter as turmas.");
        }

        conteudo.style.display = "block";

        const turmasAtivas = dados.turmas.filter(turma => turma.ativa);

        if (turmasAtivas.length === 0) {
            listaTurmas.innerHTML = "<tr><td colspan='6'>Não existem turmas ativas registadas.</td></tr>";
            return;
        }

        turmasAtivas.forEach(function(turma) {
            const linha = document.createElement("tr");

            const valores = [
                turma.codigo,
                turma.ano_letivo,
                turma.limite_alunos
            ];

            valores.forEach(function(valor) {
                const coluna = document.createElement("td");
                coluna.textContent = valor;
                linha.appendChild(coluna);
            });

            listaTurmas.appendChild(linha);
        });

    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar as turmas.";
    }
});