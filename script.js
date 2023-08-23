// Lista para armazenar os produtos em estoque
let estoque = [];
let produtoEditando = null;

// Função para adicionar ou editar um produto no estoque
function adicionarProduto(event) {
    event.preventDefault();

    // Capturar os valores do formulário
    let nome = document.getElementById('nome').value;
    let quantidade = parseInt(document.getElementById('quantidade').value);
    let precoCompra = parseFloat(document.getElementById('precoCompra').value);
    let precoVenda = parseFloat(document.getElementById('precoVenda').value);

    // Calcular o lucro do produto
    let lucro = (precoVenda - precoCompra) * quantidade;

    if (produtoEditando === null) {
        // Adicionar o produto à lista de estoque
        let produto = {
            id: Date.now(), // Usamos a data atual como identificador único temporário
            nome: nome,
            quantidade: quantidade,
            precoCompra: precoCompra,
            precoVenda: precoVenda,
            lucro: lucro
        };
        estoque.push(produto);
    } else {
        // Atualizar o produto existente no estoque
        produtoEditando.nome = nome;
        produtoEditando.quantidade = quantidade;
        produtoEditando.precoCompra = precoCompra;
        produtoEditando.precoVenda = precoVenda;
        produtoEditando.lucro = lucro;

        // Limpar a variável de edição
        produtoEditando = null;
    }

    // Limpar o formulário
    document.getElementById('formProduto').reset();

    // Atualizar a tabela do estoque
    atualizarTabelaEstoque();

    // Atualizar a análise de custos e lucros
    atualizarAnalise();

    // Gerar o gráfico de vendas
    gerarGraficoVendas();
}

// Função para remover um produto do estoque
function removerProduto(id) {
    estoque = estoque.filter(produto => produto.id !== id);

    // Atualizar a tabela do estoque
    atualizarTabelaEstoque();

    // Atualizar a análise de custos e lucros
    atualizarAnalise();

    // Gerar o gráfico de vendas
    gerarGraficoVendas();
}

// Função para editar um produto do estoque
function editarProduto(id) {
    produtoEditando = estoque.find(produto => produto.id === id);

    // Preencher o formulário com os dados do produto a ser editado
    document.getElementById('produtoId').value = produtoEditando.id;
    document.getElementById('nome').value = produtoEditando.nome;
    document.getElementById('quantidade').value = produtoEditando.quantidade;
    document.getElementById('precoCompra').value = produtoEditando.precoCompra.toFixed(2);
    document.getElementById('precoVenda').value = produtoEditando.precoVenda.toFixed(2);
}

// Função para atualizar a tabela do estoque
function atualizarTabelaEstoque() {
    let tabela = document.getElementById('tabelaEstoque');
    tabela.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço de Compra</th>
            <th>Preço de Venda</th>
            <th>Lucro</th>
            <th>Ações</th>
        </tr>
    `;

    estoque.forEach(produto => {
        let row = tabela.insertRow();
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.precoCompra.toFixed(2)}</td>
            <td>R$ ${produto.precoVenda.toFixed(2)}</td>
            <td>R$ ${produto.lucro.toFixed(2)}</td>
            <td>
                <button onclick="editarProduto(${produto.id})">Editar</button>
                <button onclick="removerProduto(${produto.id})">Remover</button>
            </td>
        `;
    });
}

// Função para atualizar a análise de custos e lucros
function atualizarAnalise() {
    let totalCustos = 0;
    let totalVendas = 0;

    estoque.forEach(produto => {
        totalCustos += produto.precoCompra * produto.quantidade;
        totalVendas += produto.precoVenda * produto.quantidade;
    });

    let lucroBruto = totalVendas - totalCustos;

    document.getElementById('totalCustos').textContent = totalCustos.toFixed(2);
    document.getElementById('totalVendas').textContent = totalVendas.toFixed(2);
    document.getElementById('lucroBruto').textContent = lucroBruto.toFixed(2);
}

// Função para gerar o gráfico de vendas
function gerarGraficoVendas() {
    let produtos = estoque.map(produto => produto.nome);
    let vendas = estoque.map(produto => produto.quantidade * (produto.precoVenda - produto.precoCompra));

    new Chart(document.getElementById('meuGrafico'), {
        type: 'bar',
        data: {
            labels: produtos,
            datasets: [{
                label: 'Lucro por Produto',
                backgroundColor: '#007BFF',
                borderColor: '#007BFF',
                data: vendas
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Adicionar evento de submit ao formulário
document.getElementById('formProduto').addEventListener('submit', adicionarProduto);

// Atualizar a tabela do estoque e a análise ao carregar a página
atualizarTabelaEstoque();
atualizarAnalise();
gerarGraficoVendas();
