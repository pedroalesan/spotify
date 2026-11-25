const contenedor = document.getElementById('contenedor-principal');
const navLinks = document.querySelectorAll('.nav-item[data-vista]');

// Elementos del reproductor
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerCover = document.getElementById('player-cover');
const timeTotal = document.getElementById('time-total');
const btnPlay = document.getElementById('btn-play');
const btnLike = document.getElementById('btn-like');
const progressFill = document.getElementById('progress-fill');

let isPlaying = false;
let progress = 25;
let intervalId = null;

// Cargar vistas desde src/contenido/
async function cargarVista(archivo) {
  try {
    const res = await fetch(`contenido/${archivo}`);
    if (!res.ok) throw new Error('No se pudo cargar la vista');
    contenedor.innerHTML = await res.text();
    inicializarEventosVista();
  } catch (err) {
    contenedor.innerHTML = `<p style="color:#f59b23">Error cargando ${archivo}. Asegúrate de abrirlo desde tu servidor Express.</p>`;
  }
}

// Eventos de navegación en el menú lateral
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(el => el.classList.remove('activo'));
    link.classList.add('activo');
    cargarVista(link.dataset.vista);
  });
});

// Simular reproducción al hacer clic en canciones o tarjetas
function reproducirPista(titulo, artista, duracion, gradiente = 'gradient-3') {
  playerTitle.textContent = titulo;
  playerArtist.textContent = artista;
  timeTotal.textContent = duracion || '3:30';
  playerCover.className = `album-art ${gradiente}`;
  
  progress = 0;
  progressFill.style.width = '0%';
  setEstadoPlay(true);
}

function setEstadoPlay(estado) {
  isPlaying = estado;
  btnPlay.textContent = isPlaying ? '⏸' : '▶';
  clearInterval(intervalId);

  if (isPlaying) {
    intervalId = setInterval(() => {
      progress = (progress + 1) % 100;
      progressFill.style.width = `${progress}%`;
    }, 500);
  }
}

btnPlay.addEventListener('click', () => setEstadoPlay(!isPlaying));

btnLike.addEventListener('click', () => {
  btnLike.classList.toggle('liked');
  btnLike.textContent = btnLike.classList.contains('liked') ? '♥' : '♡';
});

// Conectar eventos dinámicos dentro de cada vista inyectada
function inicializarEventosVista() {
  // Clic en filas de canciones, tarjetas rápidas o botones de artistas
  document.querySelectorAll('[data-song]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const { song, artist, duration, grad } = el.dataset;
      reproducirPista(song, artist, duration, grad);
    });
  });

  // Simulación local de envío de formularios (listo para cambiar por fetch POST a tu API)
  const formArtista = document.getElementById('form-artista');
  if (formArtista) {
    formArtista.addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = new FormData(formArtista);
      const nombre = datos.get('nombre');
      const genero = datos.get('genero');
      const pais = datos.get('pais') || 'Internacional';
      const iniciales = nombre.substring(0, 2).toUpperCase();

      const grid = document.getElementById('contenedor-artistas');
      grid.insertAdjacentHTML('afterbegin', `
        <div class="artist-card fade-in">
          <div class="artist-avatar gradient-4">${iniciales}</div>
          <h3>${nombre}</h3>
          <p>${genero} • ${pais}</p>
        </div>
      `);
      formArtista.reset();
    });
  }

  const formCancion = document.getElementById('form-cancion');
  if (formCancion) {
    formCancion.addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = new FormData(formCancion);
      const titulo = datos.get('titulo');
      const artista = datos.get('artista');
      const album = datos.get('album') || 'Sencillo';
      const duracion = datos.get('duracion');

      const tbody = document.getElementById('tabla-canciones-body');
      const num = tbody.children.length + 1;
      tbody.insertAdjacentHTML('beforeend', `
        <tr class="track-row fade-in" data-song="${titulo}" data-artist="${artista}" data-duration="${duracion}" data-grad="gradient-1">
          <td>${num}</td>
          <td>
            <div class="track-cell">
              <div class="mini-cover gradient-1">🎵</div>
              <div>
                <strong>${titulo}</strong>
                <span>${artista}</span>
              </div>
            </div>
          </td>
          <td>${album}</td>
          <td>${duracion}</td>
        </tr>
      `);
      formCancion.reset();
      inicializarEventosVista();
    });
  }
}

// Vista inicial por defecto
cargarVista('inicio.html');