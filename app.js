import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js';

const STORAGE = 'triade-demo-products';
const CART = 'triade-demo-cart';
const AUTH = 'triade-demo-auth';

const defaults = [
  {
    id: 't1',
    name: 'Camiseta Concreto',
    category: 'Camisetas',
    price: 119.9,
    description: 'Malha pesada, modelagem ampla e estampa frontal minimalista.',
    sizes: ['P', 'M', 'G', 'GG'],
    stock: 12,
    featured: true,
    tone1: '#b9b4ac',
    tone2: '#585652',
    image: ''
  },
  {
    id: 't2',
    name: 'Moletom Ruído',
    category: 'Moletons',
    price: 249.9,
    description: 'Moletom canguru encorpado para dias de cidade fria.',
    sizes: ['M', 'G', 'GG'],
    stock: 7,
    featured: true,
    tone1: '#262523',
    tone2: '#77736c',
    image: ''
  },
  {
    id: 't3',
    name: 'Cargo Eclipse',
    category: 'Calças',
    price: 229.9,
    description: 'Cargo de corte reto, bolsos funcionais e ajuste na barra.',
    sizes: ['38', '40', '42', '44'],
    stock: 5,
    featured: false,
    tone1: '#6f725f',
    tone2: '#272822',
    image: ''
  },
  {
    id: 't4',
    name: 'Boné Arquivo',
    category: 'Acessórios',
    price: 89.9,
    description: 'Boné de seis painéis com bordado tonal da Triade.',
    sizes: ['Único'],
    stock: 15,
    featured: true,
    tone1: '#242424',
    tone2: '#aaa49b',
    image: ''
  },
  {
    id: 't5',
    name: 'Camiseta Sombra',
    category: 'Camisetas',
    price: 109.9,
    description: 'Algodão premium com caimento seco e assinatura nas costas.',
    sizes: ['P', 'M', 'G', 'GG'],
    stock: 9,
    featured: false,
    tone1: '#1d1e20',
    tone2: '#72777d',
    image: ''
  },
  {
    id: 't6',
    name: 'Moletom Linha',
    category: 'Moletons',
    price: 259.9,
    description: 'Capuz estruturado, acabamento escovado e corte oversized.',
    sizes: ['M', 'G', 'GG'],
    stock: 4,
    featured: false,
    tone1: '#b5ad9e',
    tone2: '#4b4945',
    image: ''
  }
];

let products =
  JSON.parse(localStorage.getItem(STORAGE) || 'null') || defaults;

let cart =
  JSON.parse(localStorage.getItem(CART) || '[]');

let filter = 'Todos';
let query = '';
let chosenSize = '';

const $ = s => document.querySelector(s);

const money = n =>
  n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m])
  );

function save() {
  localStorage.setItem(STORAGE, JSON.stringify(products));
  localStorage.setItem(CART, JSON.stringify(cart));
}

function open(el) {
  $('#overlay').classList.add('show');
  el.classList.add('show');
}

function close() {
  document
    .querySelectorAll('.show')
    .forEach(x => x.classList.remove('show'));
}

function toast(msg) {
  const t = $('#toast');

  t.textContent = msg;
  t.classList.add('show');

  setTimeout(() => {
    t.classList.remove('show');
  }, 2600);
}

function art(p, cls = 'product-image') {
  return `
    <div
      class="${cls}"
      style="--tone1:${esc(p.tone1 || '#aaa')};
             --tone2:${esc(p.tone2 || '#333')}"
    >
      ${
        p.image
          ? `<img
              src="${esc(p.image)}"
              alt="${esc(p.name)}"
              onerror="this.remove()"
            >`
          : ''
      }
    </div>
  `;
}

function renderProducts() {
  const list = products.filter(
    p =>
      (filter === 'Todos' || p.category === filter) &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  $('#productGrid').innerHTML =
    list
      .map(
        p => `
        <article
          class="product-card"
          data-product="${p.id}"
        >
          ${
            p.featured
              ? '<span class="badge">DESTAQUE</span>'
              : ''
          }

          ${art(p)}

          <div class="product-info">
            <div>
              <b>${esc(p.name)}</b>
              <br>
              <span>${esc(p.category)}</span>
            </div>

            <b>${money(p.price)}</b>
          </div>
        </article>
      `
      )
      .join('') ||
    '<p>Nenhuma peça encontrada. Tente outra busca.</p>';

  document
    .querySelectorAll('[data-product]')
    .forEach(
      x =>
        (x.onclick = () =>
          productModal(x.dataset.product))
    );
}

function productModal(id) {
  const p = products.find(x => x.id === id);

  chosenSize = p.sizes[0];

  $('#productModalContent').innerHTML = `
    <div class="product-detail">

      ${art(p, 'product-detail-img')}

      <div class="product-detail-copy">

        <p class="eyebrow">
          ${esc(p.category)}
          / estoque: ${p.stock}
        </p>

        <h2>${esc(p.name).toUpperCase()}</h2>

        <strong class="price">
          ${money(p.price)}
        </strong>

        <p>${esc(p.description)}</p>

        <span class="eyebrow">
          Escolha o tamanho
        </span>

        <div
          class="size-list"
          id="sizeList"
        >
          ${p.sizes
            .map(
              (s, i) => `
                <button
                  class="${i === 0 ? 'active' : ''}"
                  data-size="${esc(s)}"
                >
                  ${esc(s)}
                </button>
              `
            )
            .join('')}
        </div>

        <button
          class="primary"
          id="addCart"
        >
          Adicionar ao bag
          <span>+</span>
        </button>

      </div>
    </div>
  `;

  $('#sizeList').onclick = e => {
    if (e.target.dataset.size) {
      chosenSize = e.target.dataset.size;

      [
        ...e.currentTarget.children
      ].forEach(x =>
        x.classList.toggle(
          'active',
          x === e.target
        )
      );
    }
  };

  $('#addCart').onclick = () => {
    cart.push({
      id: p.id,
      size: chosenSize
    });

    save();
    renderCart();
    close();

    toast('Peça adicionada ao bag.');
  };

  open($('#productModal'));
}

function renderCart() {
  const items = cart
    .map((x, i) => ({
      ...x,
      p: products.find(p => p.id === x.id)
    }))
    .filter(x => x.p);

  const total = items.reduce(
    (s, x) => s + x.p.price,
    0
  );

  $('#cartCount').textContent = items.length;

  $('#cartCountWide').textContent =
    `(${items.length})`;

  $('#cartTotal').textContent = money(total);

  $('#cartItems').innerHTML =
    items.length
      ? items
          .map(
            (x, i) => `
              <div class="cart-item">

                ${art(x.p, 'cart-thumb')}

                <div>
                  <b>${esc(x.p.name)}</b>

                  <p>
                    TAM. ${esc(x.size)}
                    · ${money(x.p.price)}
                  </p>
                </div>

                <button
                  data-remove="${i}"
                  aria-label="Remover"
                >
                  ×
                </button>

              </div>
            `
          )
          .join('')
      : '<p class="eyebrow">Seu bag está vazio.</p>';

  document
    .querySelectorAll('[data-remove]')
    .forEach(
      b =>
        (b.onclick = () => {
          cart.splice(+b.dataset.remove, 1);
          save();
          renderCart();
        })
    );
}

function isAuth() {
  return localStorage.getItem(AUTH) === 'true';
}

function admin() {
  const root = $('#adminContent');

  if (!isAuth()) {
    root.innerHTML = `
      <div class="admin">

        <p class="eyebrow">
          Área administrativa
        </p>

        <h2>
          GESTÃO<br>
          TRÍADE.
        </h2>

        <p class="admin-note">
          Ambiente de demonstração:
          este login usa localStorage
          e não é seguro para uso em produção.
        </p>

        <form id="loginForm">

          <label>
            Usuário
            <input required name="user">
          </label>

          <label>
            Senha
            <input
              required
              type="password"
              name="pass"
            >
          </label>

          <button class="primary">
            Entrar
            <span>→</span>
          </button>

        </form>

      </div>
    `;

    $('#loginForm').onsubmit = e => {
      e.preventDefault();

      const d = new FormData(e.target);

      if (
        d.get('user') === 'triadeofc.adm.com' &&
        d.get('pass') === 'sitetriadeofc'
      ) {
        localStorage.setItem(AUTH, 'true');
        admin();
      } else {
        toast('Credenciais não reconhecidas.');
      }
    };

    open($('#adminModal'));
    return;
  }

  root.innerHTML = `
    <div class="admin">

      <p class="eyebrow">
        Área administrativa
      </p>

      <h2>CATÁLOGO.</h2>

      <p class="admin-note">
        Dados desta demo ficam somente neste navegador.
        Autenticação demonstrativa — não use em produção.
      </p>

      <form id="productForm">

        <input type="hidden" name="id">

        <label>
          Nome
          <input
            required
            name="name"
            placeholder="Nome da peça"
          >
        </label>

        <label>
          Categoria
          <select name="category">
            <option>Camisetas</option>
            <option>Moletons</option>
            <option>Calças</option>
            <option>Acessórios</option>
          </select>
        </label>

        <label>
          Preço (R$)
          <input
            required
            name="price"
            type="number"
            step="0.01"
          >
        </label>

        <label>
          Descrição
          <textarea
            required
            name="description"
          ></textarea>
        </label>

        <label>
          Imagem (URL opcional)
          <input
            name="image"
            placeholder="https://..."
          >
        </label>

        <label>
          Tamanhos
          <input
            required
            name="sizes"
            value="P, M, G, GG"
          >
        </label>

        <label>
          Estoque
          <input
            required
            name="stock"
            type="number"
            min="0"
            value="0"
          >
        </label>

        <label class="radio">
          <input
            name="featured"
            type="checkbox"
          >
          Destaque na loja
        </label>

        <button class="primary">
          Salvar peça
          <span>→</span>
        </button>

      </form>

      <div class="admin-products">

        ${products
          .map(
            p => `
              <div class="admin-product">

                <span>
                  ${esc(p.name)}
                  · ${money(p.price)}
                </span>

                <span class="admin-action">

                  <button
                    class="small-btn"
                    data-edit="${p.id}"
                  >
                    Editar
                  </button>

                  <button
                    class="small-btn"
                    data-delete="${p.id}"
                  >
                    Excluir
                  </button>

                </span>

              </div>
            `
          )
          .join('')}

      </div>

    </div>
  `;

  $('#productForm').onsubmit = e => {
    e.preventDefault();

    const d = Object.fromEntries(
      new FormData(e.target)
    );

    const item = {
      id: d.id || `p${Date.now()}`,
      name: d.name,
      category: d.category,
      price: +d.price,
      description: d.description,
      image: d.image,
      sizes: d.sizes
        .split(',')
        .map(x => x.trim())
        .filter(Boolean),
      stock: +d.stock,
      featured: d.featured === 'on',
      tone1: '#a9a59d',
      tone2: '#373633'
    };

    const i = products.findIndex(
      p => p.id === item.id
    );

    i < 0
      ? products.unshift(item)
      : (products[i] = item);

    save();
    renderProducts();
    admin();

    toast(
      i < 0
        ? 'Peça cadastrada.'
        : 'Peça atualizada.'
    );
  };

  document
    .querySelectorAll('[data-edit]')
    .forEach(
      b =>
        (b.onclick = () => {
          const p = products.find(
            x => x.id === b.dataset.edit
          );

          const f = $('#productForm');

          Object.entries({
            ...p,
            sizes: p.sizes.join(', ')
          }).forEach(([k, v]) => {
            if (f.elements[k]) {
              if (
                f.elements[k].type === 'checkbox'
              ) {
                f.elements[k].checked = v;
              } else {
                f.elements[k].value = v;
              }
            }
          });

          f.scrollIntoView({
            behavior: 'smooth'
          });
        })
    );

  document
    .querySelectorAll('[data-delete]')
    .forEach(
      b =>
        (b.onclick = () => {
          if (
            confirm(
              'Remover esta peça da vitrine?'
            )
          ) {
            products = products.filter(
              x => x.id !== b.dataset.delete
            );

            save();
            renderProducts();
            admin();

            toast('Peça removida.');
          }
        })
    );

  open($('#adminModal'));
}

$('#filterRow').onclick = e => {
  if (e.target.dataset.filter) {
    filter = e.target.dataset.filter;

    [
      ...e.currentTarget.children
    ].forEach(b =>
      b.classList.toggle(
        'active',
        b === e.target
      )
    );

    renderProducts();
  }
};

$('#searchInput').oninput = e => {
  query = e.target.value;
  renderProducts();
};

$('#cartTrigger').onclick = () => {
  renderCart();
  open($('#cartDrawer'));
};

$('#adminTrigger').onclick = admin;

$('#overlay').onclick = close;

document
  .querySelectorAll('[data-close]')
  .forEach(b => (b.onclick = close));

$('#checkoutTrigger').onclick = () => {
  if (!cart.length) {
    return toast(
      'Adicione uma peça antes de continuar.'
    );
  }

  close();
  open($('#checkoutModal'));
};

$('#checkoutForm').onsubmit = e => {
  e.preventDefault();

  cart = [];

  save();
  renderCart();
  close();

  toast(
    'Pedido registrado! A Triade falará com você.'
  );
};

document.addEventListener(
  'mousemove',
  e => {
    const d = $('.cursor-dot');

    if (!d) return;

    d.style.left = e.clientX + 'px';
    d.style.top = e.clientY + 'px';
  }
);


/* =========================================================
   TRÍADE — EXPERIÊNCIA 3D
   ========================================================= */
function init3D() {
  const holder = document.querySelector('#modelCanvas');

  if (!holder) return;

  const fallback = holder.querySelector('.model-fallback');
  const loading = holder.querySelector('.model-loading');

  let scene;
  let camera;
  let renderer;
  let model = null;

  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  let targetRotationY = 0;
  let targetRotationX = 0;

  let currentRotationY = 0;
  let currentRotationX = 0;

  let zoom = 5.8;
  let targetZoom = 5.8;

  let lastInteraction = performance.now();

  try {
    const width = Math.max(holder.clientWidth, 1);
    const height = Math.max(holder.clientHeight, 1);

    /* =========================
       SCENE
    ========================= */

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x11100f);

    /* =========================
       CAMERA
    ========================= */

    camera = new THREE.PerspectiveCamera(
      30,
      width / height,
      0.1,
      100
    );

    /*
      POSIÇÃO DA CÂMERA

      X negativo  → desloca o enquadramento
      Y           → altura da câmera
      Z           → distância

      O busto aparece maior quando diminuímos Z.
    */

    camera.position.set(
      -0.9,
      1.35,
      zoom
    );

    camera.lookAt(
      0.35,
      -0.45,
      0
    );

    /* =========================
       RENDERER
    ========================= */

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      width,
      height
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    holder.innerHTML = '';

    holder.appendChild(
      renderer.domElement
    );

    /* =========================
       LIGHTING
    ========================= */

    const ambientLight =
      new THREE.HemisphereLight(
        0xffffff,
        0x191512,
        2.2
      );

    scene.add(ambientLight);

    const keyLight =
      new THREE.DirectionalLight(
        0xfff3df,
        4.0
      );

    keyLight.position.set(
      -3,
      6,
      5
    );

    scene.add(keyLight);

    const fillLight =
      new THREE.DirectionalLight(
        0xd8d0c2,
        1.8
      );

    fillLight.position.set(
      5,
      2,
      3
    );

    scene.add(fillLight);

    const rimLight =
      new THREE.DirectionalLight(
        0xffffff,
        2.5
      );

    rimLight.position.set(
      2,
      5,
      -5
    );

    scene.add(rimLight);

    /* =========================
       GLTF
    ========================= */

    const loader =
      new GLTFLoader();

    loader.load(
      './public/triade-bust.glb',

      gltf => {

        model = gltf.scene;

        /*
          Primeiro centralizamos o modelo
          usando o bounding box.

          NÃO remova isso.
          Ele é necessário para fazer
          o posicionamento funcionar
          de forma previsível.
        */

        const box =
          new THREE.Box3()
            .setFromObject(model);

        const size =
          box.getSize(
            new THREE.Vector3()
          );

        const center =
          box.getCenter(
            new THREE.Vector3()
          );

        model.position.sub(
          center
        );

        /* =========================
           ESCALA
        ========================= */

        const maxDimension =
          Math.max(
            size.x,
            size.y,
            size.z
          );

        if (maxDimension > 0) {

          model.scale.setScalar(
            3.8 / maxDimension
          );

        }

        /*
          POSIÇÃO DO BUSTO

          X positivo = direita
          X negativo = esquerda

          Y positivo = sobe
          Y negativo = desce

          Aqui deixamos o busto
          grande e mais baixo.
        */

        model.position.x = 1.65;

        model.position.y = -2.85;

        model.position.z = 0;

        /*
          Pequena rotação inicial
          para mostrar o busto
          em uma posição mais interessante.
        */

        model.rotation.y = -0.18;

        model.rotation.x = 0;

        scene.add(model);

        if (fallback) {
          fallback.style.display = 'none';
        }

        if (loading) {
          loading.style.display = 'none';
        }

      },

      xhr => {

        if (loading) {

          if (xhr.total) {

            const progress =
              (xhr.loaded / xhr.total) * 100;

            loading.textContent =
              `CARREGANDO ${Math.round(progress)}%`;

          } else {

            loading.textContent =
              'CARREGANDO OBJETO...';

          }

        }

      },

      error => {

        console.error(
          'Erro ao carregar o modelo 3D:',
          error
        );

        if (loading) {
          loading.textContent =
            'ERRO AO CARREGAR OBJETO';
        }

        if (fallback) {
          fallback.style.display = 'block';
        }

      }
    );

    /* =========================
       MOUSE — ARRASTAR
    ========================= */

    holder.addEventListener(
      'pointerdown',
      event => {

        isDragging = true;

        previousX = event.clientX;
        previousY = event.clientY;

        lastInteraction =
          performance.now();

        holder.setPointerCapture(
          event.pointerId
        );

      }
    );

    holder.addEventListener(
      'pointermove',
      event => {

        if (!isDragging || !model) {
          return;
        }

        const deltaX =
          event.clientX - previousX;

        const deltaY =
          event.clientY - previousY;

        previousX = event.clientX;
        previousY = event.clientY;

        /*
          Sensibilidade da rotação.
        */

        targetRotationY +=
          deltaX * 0.008;

        targetRotationX +=
          deltaY * 0.003;

        /*
          Limita a inclinação vertical.
        */

        targetRotationX =
          Math.max(
            -0.35,
            Math.min(
              0.35,
              targetRotationX
            )
          );

        lastInteraction =
          performance.now();

      }
    );

    holder.addEventListener(
      'pointerup',
      event => {

        isDragging = false;

        try {
          holder.releasePointerCapture(
            event.pointerId
          );
        } catch (e) {}

        lastInteraction =
          performance.now();

      }
    );

    holder.addEventListener(
      'pointercancel',
      () => {

        isDragging = false;

      }
    );

    /* =========================
       WHEEL — ZOOM
    ========================= */

    holder.addEventListener(
      'wheel',
      event => {

        event.preventDefault();

        targetZoom +=
          event.deltaY * 0.003;

        targetZoom =
          Math.max(
            3.8,
            Math.min(
              8.5,
              targetZoom
            )
          );

        lastInteraction =
          performance.now();

      },
      {
        passive: false
      }
    );

    /* =========================
       RESIZE
    ========================= */

    function resize() {

      const newWidth =
        Math.max(
          holder.clientWidth,
          1
        );

      const newHeight =
        Math.max(
          holder.clientHeight,
          1
        );

      camera.aspect =
        newWidth / newHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        newWidth,
        newHeight
      );

    }

    window.addEventListener(
      'resize',
      resize
    );

    /* =========================
       ANIMAÇÃO
    ========================= */

    let previousTime =
      performance.now();

    function animate(time) {

      requestAnimationFrame(
        animate
      );

      const delta =
        Math.min(
          (time - previousTime) / 1000,
          0.05
        );

      previousTime = time;

      if (model) {

        /*
          AUTO ROTATION

          O busto só gira sozinho
          quando o usuário não está
          interagindo.
        */

        const idleTime =
          time - lastInteraction;

        if (
          !isDragging &&
          idleTime > 1200
        ) {

          targetRotationY +=
            delta * 0.18;

        }

        /*
          Suavização da rotação.
        */

        currentRotationY +=
          (
            targetRotationY -
            currentRotationY
          ) * 0.08;

        currentRotationX +=
          (
            targetRotationX -
            currentRotationX
          ) * 0.08;

        model.rotation.y =
          currentRotationY;

        model.rotation.x =
          currentRotationX;

      }

      /*
        Zoom suave.
      */

      zoom +=
        (
          targetZoom -
          zoom
        ) * 0.08;

      camera.position.z =
        zoom;

      camera.lookAt(
        0.35,
        -0.45,
        0
      );

      renderer.render(
        scene,
        camera
      );

    }

    animate(
      performance.now()
    );

  } catch (error) {

    console.error(
      'Erro ao inicializar o 3D:',
      error
    );

    if (fallback) {
      fallback.style.display =
        'block';
    }

  }
}


/* =================================
   INICIALIZAÇÃO
================================= */

if (
  document.readyState === 'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    init3D
  );

} else {

  init3D();

}