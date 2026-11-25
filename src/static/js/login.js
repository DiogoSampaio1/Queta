document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const numero_aluno = document.getElementById("numero_aluno").value;
    const passphrase = document.getElementById("passphrase").value;

    const mensagem = document.getElementById("mensagem");

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                numero_aluno: numero_aluno,
                passphrase: passphrase
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            sessionStorage.setItem("access_token", dados.access_token);
            sessionStorage.setItem("aluno_id", dados.aluno_id);
            sessionStorage.setItem("numero_aluno", dados.numero_aluno);
            sessionStorage.setItem("role", dados.role);

            window.location.href = "/";
        } else {
            mensagem.textContent = dados.message || "Erro ao iniciar sessão.";
        }

    } catch (erro) {
        mensagem.textContent = "Não foi possível contactar o servidor.";
        console.error(erro);
    }
});
