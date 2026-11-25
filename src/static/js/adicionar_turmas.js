document.addEventListener("DOMContentLoaded", async function() {
    const formulario = document.getElementById("adicionarTurmaForm");
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoTurmas");
    const token = sessionStorage.getItem("access_token");

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

        conteudo.style.display = "block";

    } catch (erro) {
        mensagem.textContent = "Não foi possível verificar as permissões.";
        return;
    }

    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();

        const turma = {
            codigo: document.getElementById("Nome").value.trim(),
            ano_letivo: document.getElementById("ano_letivo").value.trim(),
            curso_id: document.getElementById("curso_id").value || null,
            limite_alunos: Number(document.getElementById("limite_alunos").value),
            ativa: document.getElementById("ativa").checked
        };

        try {
            const resposta = await fetch("/api/turmas", {
                method: "POST",
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

            mensagem.textContent = dados.message || "Erro ao adicionar turma.";

            if (resposta.ok) {
                formulario.reset();
            }

        } catch (erro) {
            mensagem.textContent = "Não foi possível contactar o servidor.";
        }
    });
});
