document.addEventListener("DOMContentLoaded", async function() {
    const token = sessionStorage.getItem("access_token");
    const mensagem = document.getElementById("mensagemAdmin");

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

        if (!resposta.ok) {
            mensagem.textContent = "Sessão inválida ou sem permissões.";
            return;
        }

        document.getElementById("conteudoAdmin").style.display = "block";

    } catch (erro) {
        mensagem.textContent = "Não foi possível contactar o servidor.";
    }
});
