/* =========================================================
   Oficina dos Relógios — script
   JavaScript puro, sem dependências.
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURAÇÃO — edite aqui
   --------------------------------------------------------- */

// Número do WhatsApp: código do país (55) + DDD + número, só dígitos.
// TROQUE pelo número real da loja.
const WHATSAPP_NUMERO = '5511999999999';

// Mensagem padrão enviada quando o botão não define uma própria (data-msg).
const MENSAGEM_PADRAO = 'Olá! Vim pelo site da Oficina dos Relógios e gostaria de mais informações.';

// DEPOIMENTOS — ATENÇÃO: os textos abaixo são MODELOS de exemplo.
// Substitua pelas avaliações reais do Google Maps da loja
// (nome, nota de 1 a 5, texto e quando foi publicada).
const DEPOIMENTOS = [
  {
    nome: 'Cliente 1 (modelo)',
    nota: 5,
    texto: 'Levei um relógio que estava parado há anos e ficou funcionando perfeitamente. Atendimento muito atencioso e preço justo.',
    quando: 'há 2 semanas'
  },
  {
    nome: 'Cliente 2 (modelo)',
    nota: 5,
    texto: 'Troca de bateria feita na hora, enquanto eu esperava. Explicaram tudo com clareza. Recomendo!',
    quando: 'há 1 mês'
  },
  {
    nome: 'Cliente 3 (modelo)',
    nota: 5,
    texto: 'Ajustaram a pulseira de aço do meu relógio com muito capricho. Ficou perfeita no pulso.',
    quando: 'há 2 meses'
  },
  {
    nome: 'Cliente 4 (modelo)',
    nota: 5,
    texto: 'Fiz a revisão do meu automático e ele voltou marcando a hora certinha. Profissional de confiança.',
    quando: 'há 3 meses'
  },
  {
    nome: 'Cliente 5 (modelo)',
    nota: 5,
    texto: 'Consertaram o relógio de parede que era da minha avó. Valor sentimental enorme, tratado com todo cuidado.',
    quando: 'há 4 meses'
  },
  {
    nome: 'Cliente 6 (modelo)',
    nota: 5,
    texto: 'Orçamento rápido pelo WhatsApp e serviço entregue no prazo combinado. Voltarei sempre.',
    quando: 'há 5 meses'
  }
];

/* --------------------------------------------------------- */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp ---------- */
  function linkWhats(msg) {
    return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg || MENSAGEM_PADRAO);
  }
  $$('[data-whatsapp]').forEach(function (el) {
    el.href = linkWhats(el.getAttribute('data-msg'));
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Ano no rodapé ---------- */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Header e menu ---------- */
  const header = $('.header');
  const toggle = $('.menu-toggle');
  const nav = $('#menu');

  function aoRolar() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  function setMenu(aberto) {
    toggle.setAttribute('aria-expanded', String(aberto));
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', aberto);
    header.classList.toggle('menu-open', aberto);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Link ativo no menu ---------- */
  const links = $$('.nav__link');
  if ('IntersectionObserver' in window) {
    const obsSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      const alvo = $(l.getAttribute('href'));
      if (alvo) obsSecao.observe(alvo);
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduzMovimento) {
    const obsReveal = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { obsReveal.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contadores ---------- */
  function animaContador(el) {
    const alvo = parseInt(el.getAttribute('data-count'), 10);
    const pre = el.getAttribute('data-prefix') || '';
    const suf = el.getAttribute('data-suffix') || '';
    const fmt = function (n) { return pre + n.toLocaleString('pt-BR') + suf; };
    if (reduzMovimento) { el.textContent = fmt(alvo); return; }
    const dur = 1600;
    const ini = performance.now();
    (function passo(t) {
      const p = Math.min((t - ini) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(alvo * eased));
      if (p < 1) requestAnimationFrame(passo);
    })(ini);
  }
  const contadores = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const obsCont = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { animaContador(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (c) { obsCont.observe(c); });
  } else {
    contadores.forEach(animaContador);
  }

  /* ---------- Depoimentos: renderização ---------- */
  const track = $('#slider-track');
  const dotsBox = $('#slider-dots');

  function escapa(txt) {
    const d = document.createElement('div');
    d.textContent = String(txt);
    return d.innerHTML;
  }
  function estrelas(n) {
    n = Math.max(0, Math.min(5, Math.round(n)));
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  }

  if (track && DEPOIMENTOS.length) {
    track.innerHTML = DEPOIMENTOS.map(function (d, i) {
      const inicial = escapa(d.nome.trim().charAt(0).toUpperCase());
      return (
        '<article class="review" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' de ' + DEPOIMENTOS.length + '">' +
          '<div class="review__stars" aria-label="Nota ' + d.nota + ' de 5">' + estrelas(d.nota) + '</div>' +
          '<p class="review__text">' + escapa(d.texto) + '</p>' +
          '<div class="review__author">' +
            '<span class="review__avatar" aria-hidden="true">' + inicial + '</span>' +
            '<div><span class="review__name">' + escapa(d.nome) + '</span>' +
            '<span class="review__meta">' + escapa(d.quando || '') + '</span></div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    // Média das notas
    const media = DEPOIMENTOS.reduce(function (s, d) { return s + Number(d.nota || 0); }, 0) / DEPOIMENTOS.length;
    const scoreNum = $('#score-num');
    if (scoreNum) scoreNum.textContent = media.toFixed(1).replace('.', ',');
  }

  /* ---------- Depoimentos: carrossel ---------- */
  const slides = track ? $$('.review', track) : [];
  let paginaAtual = 0;
  let autoplay = null;

  function porPagina() {
    if (!slides.length) return 1;
    const largura = slides[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(track.clientWidth / largura));
  }
  function totalPaginas() { return Math.max(1, Math.ceil(slides.length / porPagina())); }

  function montaDots() {
    const total = totalPaginas();
    dotsBox.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.className = 'slider__dot';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Ir para o grupo ' + (i + 1));
      b.addEventListener('click', function () { irPara(i); reiniciaAutoplay(); });
      dotsBox.appendChild(b);
    }
    atualizaDots();
  }
  function atualizaDots() {
    $$('.slider__dot', dotsBox).forEach(function (d, i) {
      d.setAttribute('aria-selected', String(i === paginaAtual));
    });
  }
  function irPara(pagina) {
    const total = totalPaginas();
    paginaAtual = (pagina + total) % total;
    const idx = Math.min(paginaAtual * porPagina(), slides.length - 1);
    track.scrollTo({ left: slides[idx].offsetLeft - slides[0].offsetLeft, behavior: reduzMovimento ? 'auto' : 'smooth' });
    atualizaDots();
  }

  function iniciaAutoplay() {
    if (reduzMovimento || autoplay) return;
    autoplay = setInterval(function () { irPara(paginaAtual + 1); }, 6000);
  }
  function paraAutoplay() { clearInterval(autoplay); autoplay = null; }
  function reiniciaAutoplay() { paraAutoplay(); iniciaAutoplay(); }

  if (slides.length) {
    $('.slider__btn--prev').addEventListener('click', function () { irPara(paginaAtual - 1); reiniciaAutoplay(); });
    $('.slider__btn--next').addEventListener('click', function () { irPara(paginaAtual + 1); reiniciaAutoplay(); });

    // Sincroniza os pontos quando o usuário arrasta (swipe)
    let tempoScroll;
    track.addEventListener('scroll', function () {
      clearTimeout(tempoScroll);
      tempoScroll = setTimeout(function () {
        const largura = slides[0].getBoundingClientRect().width + 20;
        const idx = Math.round(track.scrollLeft / largura);
        const fimDoTrilho = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        paginaAtual = fimDoTrilho ? totalPaginas() - 1 : Math.floor(idx / porPagina());
        atualizaDots();
      }, 100);
    }, { passive: true });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { irPara(paginaAtual + 1); reiniciaAutoplay(); }
      if (e.key === 'ArrowLeft') { irPara(paginaAtual - 1); reiniciaAutoplay(); }
    });

    const slider = $('.slider');
    slider.addEventListener('mouseenter', paraAutoplay);
    slider.addEventListener('mouseleave', iniciaAutoplay);
    slider.addEventListener('touchstart', paraAutoplay, { passive: true });
    slider.addEventListener('focusin', paraAutoplay);

    let tempoResize;
    window.addEventListener('resize', function () {
      clearTimeout(tempoResize);
      tempoResize = setTimeout(function () { paginaAtual = 0; montaDots(); irPara(0); }, 200);
    });

    montaDots();

    // Só roda o autoplay quando a seção estiver visível
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en[0].isIntersecting ? iniciaAutoplay() : paraAutoplay();
      }, { threshold: 0.3 }).observe(slider);
    }
  }

  /* ---------- Galeria: lightbox ---------- */
  const itens = $$('.gallery__item');
  const lb = $('#lightbox');
  const lbImg = lb ? $('.lightbox__img', lb) : null;
  let lbIndex = 0;
  let ultimoFoco = null;

  function mostraImagem(i) {
    lbIndex = (i + itens.length) % itens.length;
    const item = itens[lbIndex];
    const thumb = $('img', item);
    lbImg.src = item.getAttribute('data-full') || thumb.src;
    lbImg.alt = thumb.alt;
  }
  function abreLightbox(i) {
    ultimoFoco = document.activeElement;
    mostraImagem(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lightbox__close', lb).focus();
  }
  function fechaLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }

  if (lb && itens.length) {
    itens.forEach(function (it, i) { it.addEventListener('click', function () { abreLightbox(i); }); });
    $('.lightbox__close', lb).addEventListener('click', fechaLightbox);
    $('.lightbox__nav--prev', lb).addEventListener('click', function () { mostraImagem(lbIndex - 1); });
    $('.lightbox__nav--next', lb).addEventListener('click', function () { mostraImagem(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fechaLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') fechaLightbox();
      if (e.key === 'ArrowRight') mostraImagem(lbIndex + 1);
      if (e.key === 'ArrowLeft') mostraImagem(lbIndex - 1);
    });
  }
})();
