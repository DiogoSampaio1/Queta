document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("adicionarAlunoForm");
    const mensagem = document.getElementById("mensagem");

    formulario.addEventListener("submit", async function(event) {
        event.preventDefault();

        const token = sessionStorage.getItem("access_token");
        const role = sessionStorage.getItem("role");

        if (!token || role !== "admin") {
            mensagem.textContent = "Não tens autorização para adicionar alunos.";
            return;
        }

        const aluno = {
            numero_aluno: document.getElementById("numero_aluno").value,
            nome_proprio: document.getElementById("nome_proprio").value,
            apelido: document.getElementById("apelido").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            morada: document.getElementById("morada").value,
            codigo_postal: document.getElementById("codigo_postal").value,
            localidade: document.getElementById("localidade").value,
            passphrase: document.getElementById("passphrase").value
        };

        try {

            const resposta = await fetch("/api/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(aluno)
            });

            const dados = await resposta.json();

            if (resposta.status === 401 || resposta.status === 422) {
                mensagem.textContent = "Sessão inválida ou expirada. Inicia sessão novamente.";
                sessionStorage.clear();
                return;
            }

            if (resposta.status === 403) {
                mensagem.textContent = "Apenas administradores podem adicionar alunos.";
                return;
            }

            if (!resposta.ok) {
                mensagem.textContent = dados.message || "Erro ao adicionar aluno.";
                return;
            }

            mensagem.textContent = dados.message;
            formulario.reset();

        } catch (erro) {
            console.error(erro);
            mensagem.textContent = "Não foi possível contactar o servidor.";
        }

    });

});