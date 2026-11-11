
// PRODUTOS DO CARRINHO

let carrinho = JSON.parse(
    localStorage.getItem("carrinhoREVESTE")
) || [];


// SALVAR CARRINHO

function salvarCarrinho() {

    localStorage.setItem(
        "carrinhoREVESTE",
        JSON.stringify(carrinho)
    );

    atualizarCarrinho();
}


// ADICIONAR PRODUTO

function adicionarCarrinho(nome) {

    let produto = carrinho.find(item => item.nome === nome);

    if (produto) {

        produto.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            quantidade: 1
        });

    }

    salvarCarrinho();

    abrirCarrinho();
}


// ABRIR CARRINHO

function abrirCarrinho() {

    document.getElementById("cart-panel")
        .classList.add("active");

    document.getElementById("cart-overlay")
        .classList.add("active");

}


// FECHAR CARRINHO

function fecharCarrinho() {

    document.getElementById("cart-panel")
        .classList.remove("active");

    document.getElementById("cart-overlay")
        .classList.remove("active");

}


// AUMENTAR OU DIMINUIR QUANTIDADE

function alterarQuantidade(nome, valor) {

    let produto = carrinho.find(item => item.nome === nome);

    if (!produto) return;

    produto.quantidade += valor;

    if (produto.quantidade <= 0) {

        carrinho = carrinho.filter(
            item => item.nome !== nome
        );

    }

    salvarCarrinho();
}


// REMOVER PRODUTO

function removerProduto(nome) {

    carrinho = carrinho.filter(
        item => item.nome !== nome
    );

    salvarCarrinho();
}


// ATUALIZAR VISUAL DO CARRINHO

function atualizarCarrinho() {

    let container = document.getElementById("cart-items");

    let contador = document.getElementById("cart-count");

    let total = document.getElementById("cart-total");

    let quantidadeTotal = carrinho.reduce(
        (soma, item) => soma + item.quantidade,
        0
    );

    contador.textContent = quantidadeTotal;

    if (carrinho.length === 0) {

        container.innerHTML = `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
        `;

        total.textContent = "Total: A combinar";

        return;
    }

    container.innerHTML = "";

    carrinho.forEach(item => {

        container.innerHTML += `

            <div class="cart-item">

                <div>

                    <h3>${item.nome}</h3>

                    <p>Preço a combinar</p>

                    <div class="quantity-controls">

                        <button onclick="alterarQuantidade('${item.nome}', -1)">
                            -
                        </button>

                        <span>${item.quantidade}</span>

                        <button onclick="alterarQuantidade('${item.nome}', 1)">
                            +
                        </button>

                    </div>

                </div>

                <button class="remove-item"
                    onclick="removerProduto('${item.nome}')">
                    Remover
                </button>

            </div>

        `;

    });

    total.textContent = "Total: A combinar";
}


// FINALIZAR PEDIDO PELO WHATSAPP


// ABRIR CHECKOUT

function abrirCheckout() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    fecharCarrinho();

    atualizarResumoCheckout();

    document.getElementById("checkout-overlay")
        .classList.add("active");
}


// FECHAR CHECKOUT

function fecharCheckout() {

    document.getElementById("checkout-overlay")
        .classList.remove("active");

}


// ATUALIZAR RESUMO DO PEDIDO

function atualizarResumoCheckout() {

    const resumo = document.getElementById(
        "checkout-summary-items"
    );

    resumo.innerHTML = "";

    carrinho.forEach(item => {

        const linha = document.createElement("div");

        linha.className = "summary-item";

        const nome = document.createElement("span");
        nome.textContent = item.nome;

        const quantidade = document.createElement("strong");
        quantidade.textContent = `${item.quantidade} un.`;

        linha.appendChild(nome);
        linha.appendChild(quantidade);

        resumo.appendChild(linha);

    });

}


// CONFIRMAR PEDIDO

document.getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            fecharCheckout();
            return;
        }

        const pedido = {

            cliente: {
                nome: document.getElementById("cliente-nome").value,
                telefone: document.getElementById("cliente-telefone").value
            },

            endereco: {
                cep: document.getElementById("cliente-cep").value,
                rua: document.getElementById("cliente-rua").value,
                numero: document.getElementById("cliente-numero").value,
                complemento: document.getElementById("cliente-complemento").value,
                bairro: document.getElementById("cliente-bairro").value,
                cidade: document.getElementById("cliente-cidade").value,
                estado: document.getElementById("cliente-estado").value
            },

            pagamento: document.getElementById("forma-pagamento").value,

            produtos: [...carrinho],

            data: new Date().toISOString()

        };

        // Neste estágio, o pedido fica registrado
        // somente nesta sessão do navegador.

        console.log("Pedido REVESTE:", pedido);

        // LIMPAR CARRINHO

        carrinho = [];

        salvarCarrinho();

        // LIMPAR FORMULÁRIO

        document.getElementById("checkout-form").reset();

        // FECHAR CHECKOUT

        fecharCheckout();

        // EXIBIR MENSAGEM DE SUCESSO

        document.getElementById("success-overlay")
            .classList.add("active");

    });


// VOLTAR PARA A LOJA

function voltarParaLoja() {

    document.getElementById("success-overlay")
        .classList.remove("active");

    window.location.href = "produtos.html";

}

// CARREGAR CARRINHO AO ABRIR A PÁGINA

atualizarCarrinho();
