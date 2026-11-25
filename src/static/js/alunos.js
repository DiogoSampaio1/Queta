document.addEventListener("DOMContentLoaded", async function() {
    const listaAlunos = document.getElementById("listaAlunos");
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoAlunos");
    const token = sessionStorage.getItem("access_token");

    if (!token) {
        window.location.replace("/login-page");
        return;
    }

    try {
        const resposta = await fetch("/api/alunos", {
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
            throw new Error(dados.message || "Erro ao obter alunos.");
        }

        conteudo.style.display = "block";

        if (dados.alunos.length === 0) {
            listaAlunos.innerHTML = "<tr><td colspan='5'>Não existem alunos registados.</td></tr>";
            return;
        }

        listaAlunos.innerHTML = "";

        dados.alunos.forEach(function(aluno) {
            const linha = document.createElement("tr");

            [aluno.aluno_id, aluno.numero_aluno, aluno.nome_proprio, aluno.apelido, aluno.email || ""].forEach(function(valor) {
                const coluna = document.createElement("td");
                coluna.textContent = valor;
                linha.appendChild(coluna);
            });

            listaAlunos.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        mensagem.textContent = "Não foi possível carregar os alunos.";
    }
});
