document.addEventListener("DOMContentLoaded", async function () {

    const token = sessionStorage.getItem("access_token");
    const role = sessionStorage.getItem("role");

    let turmaId = null;

    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudo");

    const selecionarTurma = document.getElementById("selecionarTurma");

    const infoTurma = document.getElementById("infoTurma");
    const secaoAdicionar = document.getElementById("secaoAdicionar");
    const secaoAlunos = document.getElementById("secaoAlunos");

    const codigoTurma = document.getElementById("codigoTurma");
    const cursoTurma = document.getElementById("cursoTurma");
    const anoLetivo = document.getElementById("anoLetivo");
    const estadoTurma = document.getElementById("estadoTurma");

    const totalAlunos = document.getElementById("totalAlunos");
    const limiteAlunos = document.getElementById("limiteAlunos");

    const formulario = document.getElementById("formAdicionarAluno");
    const numeroAluno = document.getElementById("numeroAluno");
    const listaAlunos = document.getElementById("listaAlunos");

    if (!token || !["admin", "professor"].includes(role)) {
        mensagem.textContent = "Não tens autorização para aceder a esta página.";
        return;
    }

    conteudo.style.display = "block";

    function mostrarMensagem(texto, tipo = "") {
        mensagem.textContent = texto;
        mensagem.className = tipo;
    }

    function verificarSessao(resposta) {
        if (resposta.status === 401 || resposta.status === 422) {
            sessionStorage.clear();
            window.location.replace("/login-page");
            return true;
        }

        return false;
    }

    function esconderGestaoTurma() {
        infoTurma.style.display = "none";
        secaoAdicionar.style.display = "none";
        secaoAlunos.style.display = "none";
    }

    async function carregarTurma(id) {

        esconderGestaoTurma();
        mostrarMensagem("");
        listaAlunos.replaceChildren();

        try {

            const resposta = await fetch(
                `/api/turmas/${id}/alunos`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (verificarSessao(resposta)) return;

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarMensagem(
                    dados.message || "Não foi possível carregar a turma.",
                    "erro"
                );
                return;
            }

            const turma = dados.turma;

            codigoTurma.textContent =
                `${turma.codigo} — ${turma.ano_letivo}`;

            cursoTurma.textContent =
                turma.curso_nome || "Sem curso associado";

            anoLetivo.textContent = turma.ano_letivo;

            estadoTurma.textContent =
                turma.ativa ? "Ativa" : "Inativa";

            totalAlunos.textContent = dados.total_alunos;
            limiteAlunos.textContent = turma.limite_alunos;

            infoTurma.style.display = "block";
            secaoAlunos.style.display = "block";

            mostrarAlunos(dados.alunos);

            const turmaCheia =
                dados.total_alunos >= turma.limite_alunos;

            if (turma.ativa) {
                secaoAdicionar.style.display = "block";
            } else {
                secaoAdicionar.style.display = "block";
                mostrarMensagem("Esta turma está inativa.", "erro");
            }

            numeroAluno.disabled = !turma.ativa || turmaCheia;

            formulario.querySelector("button").disabled =
                !turma.ativa || turmaCheia;

            if (turmaCheia) {
                mostrarMensagem(
                    "Esta turma já atingiu o limite de alunos.",
                    "erro"
                );
            }

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Não foi possível contactar o servidor.",
                "erro"
            );
        }
    }

    function mostrarAlunos(alunos) {

        listaAlunos.replaceChildren();

        if (alunos.length === 0) {

            const texto = document.createElement("p");
            texto.textContent = "Esta turma ainda não tem alunos.";

            listaAlunos.appendChild(texto);

            return;
        }

        alunos.forEach(function (aluno) {

            const elemento = document.createElement("div");
            elemento.className = "aluno";

            const dadosAluno = document.createElement("div");
            dadosAluno.className = "dados-aluno";

            const nome = document.createElement("strong");
            nome.textContent =
                `${aluno.nome_proprio} ${aluno.apelido}`;

            const numero = document.createElement("span");
            numero.className = "secundario";
            numero.textContent = aluno.numero_aluno;

            dadosAluno.appendChild(nome);
            dadosAluno.appendChild(numero);

            if (aluno.email) {

                const email = document.createElement("span");
                email.className = "secundario";
                email.textContent = aluno.email;

                dadosAluno.appendChild(email);
            }

            const botao = document.createElement("button");
            botao.textContent = "Retirar";
            botao.className = "remover";

            botao.addEventListener("click", function () {
                removerAluno(aluno.aluno_id, nome.textContent);
            });

            elemento.appendChild(dadosAluno);
            elemento.appendChild(botao);

            listaAlunos.appendChild(elemento);
        });
    }

    selecionarTurma.addEventListener("change", async function () {

        turmaId = selecionarTurma.value;

        if (!turmaId) {
            esconderGestaoTurma();
            mostrarMensagem("");
            return;
        }

        await carregarTurma(turmaId);
    });

    formulario.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!turmaId) {
            mostrarMensagem("Seleciona primeiro uma turma.", "erro");
            return;
        }

        const numero = numeroAluno.value.trim();

        if (!numero) {
            mostrarMensagem("Introduz um número de aluno.", "erro");
            return;
        }

        try {

            const resposta = await fetch(
                `/api/turmas/${turmaId}/alunos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        numero_aluno: numero
                    })
                }
            );

            if (verificarSessao(resposta)) return;

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarMensagem(
                    dados.message || "Não foi possível adicionar o aluno.",
                    "erro"
                );
                return;
            }

            mostrarMensagem(
                dados.message || "Aluno adicionado com sucesso.",
                "sucesso"
            );

            formulario.reset();

            await carregarTurma(turmaId);

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Não foi possível contactar o servidor.",
                "erro"
            );
        }
    });

    async function removerAluno(alunoId, nomeAluno) {

        if (!confirm(
            `Tens a certeza de que queres retirar ${nomeAluno} desta turma?`
        )) {
            return;
        }

        try {

            const resposta = await fetch(
                `/api/turmas/${turmaId}/alunos/${alunoId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (verificarSessao(resposta)) return;

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarMensagem(
                    dados.message || "Não foi possível retirar o aluno.",
                    "erro"
                );
                return;
            }

            mostrarMensagem(
                dados.message || "Aluno retirado da turma com sucesso.",
                "sucesso"
            );

            await carregarTurma(turmaId);

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Não foi possível contactar o servidor.",
                "erro"
            );
        }
    }

});