# TRÍADE — Streetwear demo

Loja estática e responsiva para a Triade. Inclui busto 3D interativo, catálogo com busca e filtros, produto, carrinho, checkout demonstrativo e catálogo administrativo persistido no `localStorage`.

## Rodar localmente

Não há etapa de instalação. Abra um servidor estático na pasta do projeto. Por exemplo, se você tiver Node.js:

```bash
npx serve .
```

Ou use a extensão Live Server no VS Code. Acesse o endereço indicado pelo servidor.

## Administração demo

- Usuário: `triadeofc.adm.com`
- Senha: `sitetriadeofc`

**Importante:** a autenticação foi criada apenas para a demonstração e é armazenada no navegador. Não é segura e deve ser substituída por autenticação de servidor antes de publicar uma loja real.

## Dados e imagens

Peças e carrinho são persistidos por navegador com `localStorage`. Na área Admin é possível cadastrar URL de imagem, tamanhos, estoque, preço, descrição e destaque. Para zerar a demo, limpe os dados do site no navegador.

O arquivo 3D está em `public/triade-bust.glb` e é carregado via Three.js por CDN.

Os números de Bruno e Lucas já estão configurados em `index.html`. Como o número do Vitor não foi fornecido, o botão dele abre o WhatsApp com a mensagem pronta; substitua o link por `https://wa.me/55SEUNUMERO` quando ele estiver disponível.

## Publicação gratuita

1. Crie um repositório no GitHub e envie estes arquivos.
2. Importe o repositório no [Netlify](https://www.netlify.com/) ou [Vercel](https://vercel.com/).
3. Como é um site estático, não configure comando de build; publique a pasta raiz.

Para uma loja real, migre produtos, pedidos, login e imagens para um back-end seguro (por exemplo, Supabase ou Firebase), mantenha segredos fora do front-end e integre um provedor de pagamentos.
