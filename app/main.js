let livros = [];
const endpointDaAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';
getBuscarLivrosDaAPI();
const elementoParaInserirLivros = document.getElementById('livros');
const elementoComValorTotalDosLivros = document.getElementById('valor_total_livros_disponiveis');

async function getBuscarLivrosDaAPI() {
    const res = await fetch(endpointDaAPI);
    livros = await res.json();
    livros = aplicarDesconto(livros);
    exibirOsLivrosNaTela(livrosComDesconto);
}

function exibirOsLivrosNaTela(listaDeLivros) {
  elementoComValorTotalDosLivros.innerHTML = '';
  elementoParaInserirLivros.innerHTML = '';
  listaDeLivros.forEach(livro => {
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel';
        elementoParaInserirLivros.innerHTML += `
        <div class="livro">
        <img class="${disponibilidade}" src="${livro.imagem}"
          alt="${livro.alt}" />
        <h2 class="livro__titulo">
          ${livro.titulo}
        </h2>
        <p class="livro__descricao">${livro.autor}</p>
        <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
        <div class="tags">
          <span class="tag">${livro.categoria}</span>
        </div>
        </div>
        `;
    });
}

function aplicarDesconto(livros) {
    const desconto = 0.3;
    livrosComDesconto = livros.map(livro => {
        return {...livro, preco: livro.preco - (livro.preco * desconto)};
    })
    return livrosComDesconto;
}

const botoes = document.querySelectorAll('.btn');
botoes.forEach(btn => btn.addEventListener('click', filtrarLivros));

function filtrarLivros() {
    const elementoBtn = document.getElementById(this.id).value;
    let livrosFiltrados;
    if(elementoBtn == 'disponivel') {
        livrosFiltrados = livros.filter((livro) => livro.quantidade > 0);
    } else {
      livrosFiltrados = livros.filter((livro) => livro.categoria == elementoBtn);
    }
    exibirOsLivrosNaTela(livrosFiltrados);
    if (elementoBtn == 'disponivel') {
        exibirValorTotalDeLivros(livrosFiltrados);
      }
}

let btnOrdenarPorPreco = document.getElementById('btnOrdenarPorPreco');
btnOrdenarPorPreco.addEventListener('click', ordenarLivros);

function ordenarLivros() {
  let livroOrdenado = livros.sort((a, b) => a.preco - b.preco);
  exibirOsLivrosNaTela(livroOrdenado);
}

  function exibirValorTotalDeLivros(livros) {
    let valorTotal = livros.reduce((acc, livro) => acc + livro.preco, 0);
    elementoComValorTotalDosLivros.innerHTML = `
      <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal.toFixed(2)}</span></p>
      </div>
    `;
  }