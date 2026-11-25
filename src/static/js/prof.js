document.addEventListener("DOMContentLoaded", async function() {
    const token = sessionStorage.getItem("access_token");
    const mensagem = document.getElementById("mensagemProf");

    if (!token || sessionStorage.getItem("role") !== "professor") {
        mensagem.textContent = "Não tens autorização para aceder a esta página.";
        return;
    }

    try {
        const resposta = await fetch("/api/prof", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            mensagem.textContent = "Sessão inválida ou sem permissões.";
            return;
        }

        document.getElementById("conteudoProf").style.display = "block";

    } catch (erro) {
        mensagem.textContent = "Não foi possível contactar o servidor.";
    }
});
