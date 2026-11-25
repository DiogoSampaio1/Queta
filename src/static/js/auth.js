const token = sessionStorage.getItem("access_token");
const aluno_id = sessionStorage.getItem("aluno_id");
const numero_aluno = sessionStorage.getItem("numero_aluno");
const role = sessionStorage.getItem("role");

const authInfo = document.getElementById("authInfo");

if (authInfo) {

    if (token) {

        authInfo.innerHTML = `
            <h3>Informações da Sessão</h3>

            <p><strong>Estado:</strong> Sessão iniciada</p>
            <p><strong>Número de aluno:</strong> ${numero_aluno}</p>
            <p><strong>ID:</strong> ${aluno_id}</p>
            <p><strong>Tipo de utilizador:</strong> ${role}</p>

            <br>

            <button onclick="logout()">Terminar Sessão</button>
        `;

    } else {

        authInfo.innerHTML = `
            <h3>Informações da Sessão</h3>
            <p>Não tens nenhuma sessão iniciada.</p>
            <a href="/login-page">Iniciar Sessão</a>
        `;

    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "/";
}
