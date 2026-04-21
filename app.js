let nextButton = document.getElementById("next");
let prevButton = document.getElementById("prev");
let backButton = document.getElementById("back");
let seeMoreButton = document.querySelectorAll(".seeMore");
let carousel = document.querySelector(".carousel");
let listHTML = document.querySelector(".carousel .list");

nextButton.onclick = function() {
    showSlider('next');
}
prevButton.onclick = function() {
    showSlider('prev');
}
let unAccepctClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';
    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll(".carousel .list .item");
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else {
        let positionLast = items.length - 1;
        listHTML.prepend(items[positionLast]);
        carousel.classList.add('prev');
    }
    
    clearTimeout(unAccepctClick);
    unAccepctClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000);
}

seeMoreButton.forEach(button => {
    button.onclick = function() {
        carousel.classList.add('showDetail');
    }
})
backButton.onclick = function() {
    carousel.classList.remove('showDetail');
}

/*-------------------------------------------------------------------------*/   
/*---------------------------------------*/
/*---------------------------------------*/

// Función para inicializar el canvas con las ondas
function initWaveCanvas() {
    const canvas = document.getElementById("myCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Ajustar dimensiones responsive
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6; // Proporción 5:3
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    let xstart = -400;
    let xend = 400;
    let step = 0.5;
    let time = 0;
    
    // Ajustar escala según el tamaño del canvas
    const scaleX = width / 800;
    const scaleY = height / 500;
    
    function drawSimplePlane() {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();
        ctx.restore();
    }

    function drawGraph() {
        ctx.clearRect(0, 0, width, height);
        drawSimplePlane();
        
        // Primera onda: Seno (azul)
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        let p1 = true;
        for (let x = xstart; x <= xend; x += step) {
            let y = Math.sin(x * 0.01 + time) * 100;
            let cx = centerX + (x * scaleX);
            let cy = centerY - (y * scaleY);
            if (p1) { 
                ctx.moveTo(cx, cy); 
                p1 = false; 
            } else { 
                ctx.lineTo(cx, cy); 
            }
        }
        ctx.stroke();
        
        // Segunda onda: Coseno (rojo)
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        let p2 = true;
        for (let x = xstart; x <= xend; x += step) {
            let y = Math.cos(x * 0.015 + time * 0.7) * 80;
            let cx = centerX + (x * scaleX);
            let cy = centerY - (y * scaleY);
            if (p2) { 
                ctx.moveTo(cx, cy); 
                p2 = false; 
            } else { 
                ctx.lineTo(cx, cy); 
            }
        }
        ctx.stroke();
        
        // Agregar leyenda
        ctx.font = '12px Poppins';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('sen(x)', width - 50, 30);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('cos(x)', width - 50, 50);
    }
    
    let animationId;

    function animate() {
        drawGraph();
        time += 0.08;
        animationId = requestAnimationFrame(animate);
    }
    
    // Detener animación cuando sea necesario
    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    return { animate, stopAnimation, resizeCanvas };
}
/*-------------------------------------------------------------------------------------------*/

// Modificar el evento "Ver más" en tu carrusel
// Modificar el evento "Ver más" en tu carrusel
document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButtons = document.querySelectorAll('.seeMore');
    let waveAnimation = null;
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar el contenedor del canvas dentro del mismo item
            const item = this.closest('.item');
            const img = item.querySelector('#originalImage');
            const waveCanvas = item.querySelector('#myCanvas');
            const barsCanvas = item.querySelector('#barsCanvas');
            
            // Ocultar imagen
            if (img) {
                img.style.display = 'none';
            }
            
            // Si es el primer item (con ondas)
            if (waveCanvas && !barsCanvas) {
                waveCanvas.style.display = 'block';
                
                // Iniciar la animación de ondas
                if (waveAnimation) {
                    waveAnimation.stopAnimation();
                }
                waveAnimation = initWaveCanvas();
                if (waveAnimation) {
                    waveAnimation.animate();
                }
            }
            
            // Si es el item de barras
            if (barsCanvas) {
                barsCanvas.style.display = 'block';
                iniciarAnimacionBarras();
            }
            
            // Activar el modo detalle del carrusel
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.add('showDetail');
            }
        });
    });
    
    // Botón para volver atrás (restaurar imagen)
    const backButton = document.getElementById('back');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.remove('showDetail');
            }
            
            // Restaurar todas las imágenes y ocultar canvases
            const allItems = document.querySelectorAll('.item');
            allItems.forEach(item => {
                const img = item.querySelector('#originalImage');
                const waveCanvas = item.querySelector('#myCanvas');
                const barsCanvas = item.querySelector('#barsCanvas');
                
                if (img) img.style.display = 'block';
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
            });
            
            // Detener animaciones
            if (waveAnimation) {
                waveAnimation.stopAnimation();
            }
            detenerAnimacionBarras();
        });
    }
});

// Configuración del gráfico de barras dinámicas
const NUM_BARRAS = 5;
const MAX_ALTURA = 250;
let barsInterval = null;

function generarValorAleatorio() {
    return Math.floor(Math.random() * 91) + 10; // 10 a 100
}

function crearBarras() {
    const container = document.getElementById('barsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < NUM_BARRAS; i++) {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.id = `bar-${i}`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = `Barra ${i + 1}`;
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.id = `value-${i}`;
        
        barItem.appendChild(bar);
        barItem.appendChild(label);
        barItem.appendChild(value);
        container.appendChild(barItem);
    }
}

function actualizarBarras() {
    for (let i = 0; i < NUM_BARRAS; i++) {
        const valor = generarValorAleatorio();
        const altura = (valor / 100) * MAX_ALTURA;
        
        const bar = document.getElementById(`bar-${i}`);
        const valueSpan = document.getElementById(`value-${i}`);
        
        if (bar && valueSpan) {
            bar.style.height = `${altura}px`;
            valueSpan.textContent = `${valor}%`;
        }
    }
}

function iniciarGraficoBarras() {
    crearBarras();
    actualizarBarras();
    
    // Limpiar intervalo anterior si existe
    if (barsInterval) {
        clearInterval(barsInterval);
    }
    
    barsInterval = setInterval(actualizarBarras, 1000);
}

function detenerGraficoBarras() {
    if (barsInterval) {
        clearInterval(barsInterval);
        barsInterval = null;
    }
}

// Modificar la función de inicialización del DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButtons = document.querySelectorAll('.seeMore');
    let waveAnimation = null;
    
    // Iniciar el gráfico de barras automáticamente cuando el DOM esté listo
    iniciarGraficoBarras();
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar el contenedor del canvas dentro del mismo item
            const item = this.closest('.item');
            const img = item.querySelector('#originalImage');
            const canvas = item.querySelector('#myCanvas');
            const barsContainer = item.querySelector('#barsCanvasContainer');
            
            // Si es el item de barras
            if (barsContainer) {
                // Reiniciar el gráfico de barras cuando se abre
                detenerGraficoBarras();
                iniciarGraficoBarras();
            }
            
            // Ocultar imagen y mostrar canvas (para el primer item)
            if (img && canvas) {
                img.style.display = 'none';
                canvas.style.display = 'block';
                
                // Iniciar la animación de ondas
                if (waveAnimation) {
                    waveAnimation.stopAnimation();
                }
                waveAnimation = initWaveCanvas();
                if (waveAnimation) {
                    waveAnimation.animate();
                }
            }
            
            // También activar el modo detalle del carrusel
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.add('showDetail');
            }
        });
    });
    
    // Botón para volver atrás (restaurar imagen)
    const backButton = document.getElementById('back');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.remove('showDetail');
            }
            
            // Restaurar imagen y ocultar canvas
            const img = document.querySelector('#originalImage');
            const canvas = document.querySelector('#myCanvas');
            if (img && canvas) {
                img.style.display = 'block';
                canvas.style.display = 'none';
            }
            
            // Detener animación de ondas
            if (waveAnimation) {
                waveAnimation.stopAnimation();
            }
            
            // Asegurar que el gráfico de barras siga funcionando
            if (!barsInterval) {
                iniciarGraficoBarras();
            }
        });
    }
    
    // Limpiar intervalo cuando la página se cierre
    window.addEventListener('beforeunload', function() {
        detenerGraficoBarras();
    });
});

// Función para dibujar el gráfico de barras en canvas (reemplazar las funciones anteriores)
function dibujarGraficoBarrasEnCanvas() {
    const canvas = document.getElementById('barsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Ajustar dimensiones responsive
    function resizeBarsCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6; // Misma proporción que las ondas
    }
    
    resizeBarsCanvas();
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Configuración del gráfico
    const NUM_BARRAS = 5;
    const MARGEN = 60;
    const ESPACIO_ENTRE_BARRAS = 15;
    const ANCHO_BARRA = (width - MARGEN * 2 - (ESPACIO_ENTRE_BARRAS * (NUM_BARRAS - 1))) / NUM_BARRAS;
    const MAX_ALTURA_BARRA = height - 100;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar fondo
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar título
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Gráfico de Barras Dinámico', width / 2, 30);
    
    ctx.font = '12px Poppins';
    ctx.fillStyle = '#666';
    ctx.fillText('Actualización automática cada segundo', width / 2, 50);
    
    // Generar y dibujar barras
    for (let i = 0; i < NUM_BARRAS; i++) {
        const valor = generarValorAleatorio();
        const altura = (valor / 100) * MAX_ALTURA_BARRA;
        const x = MARGEN + i * (ANCHO_BARRA + ESPACIO_ENTRE_BARRAS);
        const y = height - 50 - altura;
        
        // Dibujar barra con gradiente
        const gradiente = ctx.createLinearGradient(x, y, x, y + altura);
        gradiente.addColorStop(0, '#4CAF50');
        gradiente.addColorStop(1, '#45a049');
        
        ctx.fillStyle = gradiente;
        ctx.fillRect(x, y, ANCHO_BARRA, altura);
        
        // Dibujar borde
        ctx.strokeStyle = '#388E3C';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, ANCHO_BARRA, altura);
        
        // Dibujar valor encima
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(`${valor}%`, x + ANCHO_BARRA / 2, y - 5);
        
        // Dibujar etiqueta debajo
        ctx.fillStyle = '#555';
        ctx.font = '10px Poppins';
        ctx.fillText(`Barra ${i + 1}`, x + ANCHO_BARRA / 2, height - 25);
    }
    
    // Dibujar línea base
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.moveTo(MARGEN - 10, height - 50);
    ctx.lineTo(width - MARGEN + 10, height - 50);
    ctx.stroke();
    
    // Dibujar eje Y
    ctx.beginPath();
    ctx.moveTo(MARGEN - 10, 60);
    ctx.lineTo(MARGEN - 10, height - 50);
    ctx.stroke();
    
    // Dibujar marcas del eje Y
    for (let i = 0; i <= 100; i += 20) {
        const y = height - 50 - (i / 100) * MAX_ALTURA_BARRA;
        ctx.fillStyle = '#888';
        ctx.font = '10px Poppins';
        ctx.textAlign = 'right';
        ctx.fillText(`${i}%`, MARGEN - 15, y + 3);
        
        ctx.beginPath();
        ctx.strokeStyle = '#ddd';
        ctx.moveTo(MARGEN - 7, y);
        ctx.lineTo(MARGEN, y);
        ctx.stroke();
    }
}

// Variables para la animación de barras
let barsAnimationId = null;

function iniciarAnimacionBarras() {
    dibujarGraficoBarrasEnCanvas();
    barsAnimationId = setInterval(dibujarGraficoBarrasEnCanvas, 1000);
}

function detenerAnimacionBarras() {
    if (barsAnimationId) {
        clearInterval(barsAnimationId);
        barsAnimationId = null;
    }
}

// ==================== GRÁFICO DE PUNTOS DINÁMICOS ====================

let puntosInterval = null;
let puntos = [];

function iniciarPuntosDinamicos() {
    const canvas = document.getElementById('pointsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const NUM_PUNTOS = 5;
    const RADIO = 8;
    
    // Función para redimensionar el canvas
    function resizePointsCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6;
    }
    
    resizePointsCanvas();
    
    // Inicializar puntos si no existen
    if (puntos.length === 0) {
        for (let i = 0; i < NUM_PUNTOS; i++) {
            puntos.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                color: `hsl(${Math.random() * 360}, 70%, 55%)`
            });
        }
    }
    
    function dibujarPuntos() {
        // Actualizar dimensiones del canvas
        resizePointsCanvas();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo con gradiente
        const gradienteFondo = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradienteFondo.addColorStop(0, '#f8f9fa');
        gradienteFondo.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradienteFondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar título
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 16px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('🎯 Puntos Dinámicos', canvas.width / 2, 30);
        
        ctx.font = '11px Poppins';
        ctx.fillStyle = '#666';
        ctx.fillText('Movimiento aleatorio cada segundo', canvas.width / 2, 50);
        
        // Dibujar cuadrícula de fondo
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        
        // Líneas verticales
        for (let x = 50; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 70);
            ctx.lineTo(x, canvas.height - 20);
            ctx.stroke();
        }
        
        // Líneas horizontales
        for (let y = 80; y < canvas.height - 20; y += 50) {
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(canvas.width - 20, y);
            ctx.stroke();
        }
        
        // Dibujar puntos
        for (let i = 0; i < puntos.length; i++) {
            // Sombra para los puntos
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 5;
            
            ctx.beginPath();
            ctx.arc(puntos[i].x, puntos[i].y, RADIO, 0, Math.PI * 2);
            ctx.fillStyle = puntos[i].color;
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Sombra para el texto
            ctx.shadowBlur = 0;
            
            // Número del punto
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Poppins';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, puntos[i].x, puntos[i].y);
            
            // Etiqueta del punto
            ctx.fillStyle = '#333';
            ctx.font = '10px Poppins';
            ctx.textBaseline = 'top';
            ctx.fillText(`Punto ${i + 1}`, puntos[i].x - 15, puntos[i].y + RADIO + 2);
        }
        
        // Leyenda
        const leyendaX = canvas.width - 100;
        const leyendaY = 70;
        
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 10px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText('Leyenda:', leyendaX, leyendaY);
        
        for (let i = 0; i < puntos.length; i++) {
            const y = leyendaY + 18 + (i * 16);
            
            // Cuadro de color
            ctx.fillStyle = puntos[i].color;
            ctx.fillRect(leyendaX, y - 6, 10, 10);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(leyendaX, y - 6, 10, 10);
            
            // Texto
            ctx.fillStyle = '#555';
            ctx.font = '9px Poppins';
            ctx.fillText(`Punto ${i + 1}`, leyendaX + 15, y);
        }
    }
    
    function moverPuntos() {
        resizePointsCanvas();
        
        for (let i = 0; i < puntos.length; i++) {
            // Movimiento aleatorio
            let nuevoX = puntos[i].x + (Math.random() - 0.5) * 60;
            let nuevoY = puntos[i].y + (Math.random() - 0.5) * 60;
            
            // Limitar dentro del canvas
            nuevoX = Math.max(RADIO + 10, Math.min(canvas.width - RADIO - 10, nuevoX));
            nuevoY = Math.max(RADIO + 40, Math.min(canvas.height - RADIO - 30, nuevoY));
            
            puntos[i].x = nuevoX;
            puntos[i].y = nuevoY;
        }
        dibujarPuntos();
    }
    
    // Dibujar inicial
    dibujarPuntos();
    
    // Limpiar intervalo anterior
    if (puntosInterval) {
        clearInterval(puntosInterval);
    }
    
    // Iniciar movimiento
    puntosInterval = setInterval(moverPuntos, 1000);
}

function detenerPuntosDinamicos() {
    if (puntosInterval) {
        clearInterval(puntosInterval);
        puntosInterval = null;
    }
}

// ==================== ACTUALIZAR EVENTOS DEL CARRUSEL ====================

// Modificar el evento "Ver más" para incluir los tres gráficos
document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButtons = document.querySelectorAll('.seeMore');
    let waveAnimation = null;
    let barsAnimationInterval = null;
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = this.closest('.item');
            const img = item.querySelector('#originalImage');
            const waveCanvas = item.querySelector('#myCanvas');
            const barsCanvas = item.querySelector('#barsCanvas');
            const pointsCanvas = item.querySelector('#pointsCanvas');
            
            // Ocultar imagen
            if (img) {
                img.style.display = 'none';
            }
            
            // Primer item - Gráfico de ondas
            if (waveCanvas && waveCanvas.id === 'myCanvas') {
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                waveCanvas.style.display = 'block';
                
                if (waveAnimation) {
                    waveAnimation.stopAnimation();
                }
                waveAnimation = initWaveCanvas();
                if (waveAnimation) {
                    waveAnimation.animate();
                }
            }
            
            // Segundo item - Gráfico de barras
            if (barsCanvas && barsCanvas.id === 'barsCanvas') {
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                barsCanvas.style.display = 'block';
                
                if (barsAnimationInterval) {
                    clearInterval(barsAnimationInterval);
                }
                iniciarGraficoBarras();
            }
            
            // Tercer item - Gráfico de puntos
            if (pointsCanvas && pointsCanvas.id === 'pointsCanvas') {
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
                pointsCanvas.style.display = 'block';
                
                iniciarPuntosDinamicos();
            }
            
            // Activar modo detalle
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.add('showDetail');
            }
        });
    });
    
    // Botón "Hacia Atrás"
    const backButton = document.getElementById('back');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.remove('showDetail');
            }
            
            // Restaurar todas las imágenes y ocultar canvases
            const allItems = document.querySelectorAll('.item');
            allItems.forEach(item => {
                const img = item.querySelector('#originalImage');
                const waveCanvas = item.querySelector('#myCanvas');
                const barsCanvas = item.querySelector('#barsCanvas');
                const pointsCanvas = item.querySelector('#pointsCanvas');
                
                if (img) img.style.display = 'block';
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
            });
            
            // Detener todas las animaciones
            if (waveAnimation) {
                waveAnimation.stopAnimation();
            }
            if (barsAnimationInterval) {
                clearInterval(barsAnimationInterval);
                barsAnimationInterval = null;
            }
            detenerPuntosDinamicos();
        });
    }
    
    // Limpiar intervalos al cerrar
    window.addEventListener('beforeunload', function() {
        if (barsAnimationInterval) {
            clearInterval(barsAnimationInterval);
        }
        detenerPuntosDinamicos();
    });
});

// ==================== GRÁFICO DE COSENO DINÁMICO ====================

let cosInterval = null;
let fase = 0;

function iniciarCosenoDinamico() {
    const canvas = document.getElementById('cosCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Función para redimensionar el canvas
    function resizeCosCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6;
    }
    
    resizeCosCanvas();
    
    // Configuración del gráfico
    const MARGEN = { top: 40, right: 30, bottom: 40, left: 50 };
    
    function getDimensiones() {
        const ANCHO_GRAFICO = canvas.width - MARGEN.left - MARGEN.right;
        const ALTO_GRAFICO = canvas.height - MARGEN.top - MARGEN.bottom;
        return { ANCHO_GRAFICO, ALTO_GRAFICO };
    }
    
    // Rango de valores
    const X_MIN = -Math.PI;
    const X_MAX = 2 * Math.PI;
    const Y_MIN = -1.2;
    const Y_MAX = 1.2;
    
    function mapearX(x) {
        const { ANCHO_GRAFICO } = getDimensiones();
        return MARGEN.left + ((x - X_MIN) / (X_MAX - X_MIN)) * ANCHO_GRAFICO;
    }
    
    function mapearY(y) {
        const { ALTO_GRAFICO } = getDimensiones();
        return MARGEN.top + ALTO_GRAFICO - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * ALTO_GRAFICO;
    }
    
    function dibujarEjes() {
        // Eje X
        ctx.beginPath();
        ctx.moveTo(MARGEN.left, mapearY(0));
        ctx.lineTo(canvas.width - MARGEN.right, mapearY(0));
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eje Y
        ctx.beginPath();
        ctx.moveTo(mapearX(0), MARGEN.top);
        ctx.lineTo(mapearX(0), canvas.height - MARGEN.bottom);
        ctx.stroke();
        
        // Flechas del eje X
        ctx.beginPath();
        ctx.moveTo(canvas.width - MARGEN.right - 5, mapearY(0) - 3);
        ctx.lineTo(canvas.width - MARGEN.right, mapearY(0));
        ctx.lineTo(canvas.width - MARGEN.right - 5, mapearY(0) + 3);
        ctx.stroke();
        
        // Flechas del eje Y
        ctx.beginPath();
        ctx.moveTo(mapearX(0) - 3, MARGEN.top + 5);
        ctx.lineTo(mapearX(0), MARGEN.top);
        ctx.lineTo(mapearX(0) + 3, MARGEN.top + 5);
        ctx.stroke();
        
        // Etiquetas
        ctx.fillStyle = '#666';
        ctx.font = '12px Poppins';
        ctx.fillText('x', canvas.width - MARGEN.right + 5, mapearY(0));
        ctx.fillText('y', mapearX(0) + 5, MARGEN.top - 5);
        
        // Marcas del eje X
        const marcasX = [-Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI];
        const etiquetasX = ['-π', '-π/2', '0', 'π/2', 'π', '3π/2', '2π'];
        
        for (let i = 0; i < marcasX.length; i++) {
            const x = marcasX[i];
            const px = mapearX(x);
            if (px >= MARGEN.left && px <= canvas.width - MARGEN.right) {
                ctx.beginPath();
                ctx.moveTo(px, mapearY(0) - 3);
                ctx.lineTo(px, mapearY(0) + 3);
                ctx.stroke();
                
                ctx.fillStyle = '#666';
                ctx.font = '10px Poppins';
                ctx.textAlign = 'center';
                ctx.fillText(etiquetasX[i], px, mapearY(0) + 15);
            }
        }
        
        // Marcas del eje Y
        const marcasY = [-1, -0.5, 0, 0.5, 1];
        for (let i = 0; i < marcasY.length; i++) {
            const y = marcasY[i];
            const py = mapearY(y);
            if (py >= MARGEN.top && py <= canvas.height - MARGEN.bottom) {
                ctx.beginPath();
                ctx.moveTo(mapearX(0) - 3, py);
                ctx.lineTo(mapearX(0) + 3, py);
                ctx.stroke();
                
                ctx.fillStyle = '#666';
                ctx.font = '10px Poppins';
                ctx.textAlign = 'right';
                ctx.fillText(y.toString(), mapearX(0) - 8, py + 3);
            }
        }
    }
    
    function dibujarCurva() {
        // Redimensionar y limpiar
        resizeCosCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo con gradiente
        const gradienteFondo = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradienteFondo.addColorStop(0, '#f8f9fa');
        gradienteFondo.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradienteFondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Título
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 16px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('📐 Función Coseno Dinámica', canvas.width / 2, 25);
        
        ctx.font = '11px Poppins';
        ctx.fillStyle = '#666';
        ctx.fillText('y = cos(x + φ) | φ (fase) = ' + fase.toFixed(2) + ' rad', canvas.width / 2, 45);
        
        dibujarEjes();
        
        // Dibujar curva
        ctx.beginPath();
        let primero = true;
        
        for (let x = X_MIN; x <= X_MAX; x += 0.05) {
            const y = Math.cos(x + fase);
            const px = mapearX(x);
            const py = mapearY(y);
            
            if (px >= MARGEN.left && px <= canvas.width - MARGEN.right) {
                if (primero) {
                    ctx.moveTo(px, py);
                    primero = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Sombra para la curva
        ctx.beginPath();
        primero = true;
        for (let x = X_MIN; x <= X_MAX; x += 0.05) {
            const y = Math.cos(x + fase);
            const px = mapearX(x);
            const py = mapearY(y);
            
            if (px >= MARGEN.left && px <= canvas.width - MARGEN.right) {
                if (primero) {
                    ctx.moveTo(px, py);
                    primero = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }
        ctx.shadowColor = 'rgba(231, 76, 60, 0.3)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
        
        // Mostrar valor actual de fase
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(`Fase actual: ${fase.toFixed(2)} rad`, MARGEN.left, canvas.height - 15);
    }
    
    function actualizar() {
        fase += 0.1;
        if (fase > Math.PI * 2) fase -= Math.PI * 2;
        dibujarCurva();
    }
    
    // Dibujar inicial
    dibujarCurva();
    
    // Limpiar intervalo anterior
    if (cosInterval) {
        clearInterval(cosInterval);
    }
    
    // Iniciar animación
    cosInterval = setInterval(actualizar, 100);
}

function detenerCosenoDinamico() {
    if (cosInterval) {
        clearInterval(cosInterval);
        cosInterval = null;
    }
}

// ==================== ACTUALIZAR EVENTOS DEL CARRUSEL ====================

// Modificar el evento "Ver más" para incluir todos los gráficos
document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButtons = document.querySelectorAll('.seeMore');
    let waveAnimation = null;
    let barsAnimationInterval = null;
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = this.closest('.item');
            const img = item.querySelector('#originalImage');
            const waveCanvas = item.querySelector('#myCanvas');
            const barsCanvas = item.querySelector('#barsCanvas');
            const pointsCanvas = item.querySelector('#pointsCanvas');
            const cosCanvas = item.querySelector('#cosCanvas');
            
            // Ocultar imagen
            if (img) {
                img.style.display = 'none';
            }
            
            // Primer item - Gráfico de ondas (seno y coseno)
            if (waveCanvas && waveCanvas.id === 'myCanvas') {
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                if (cosCanvas) cosCanvas.style.display = 'none';
                waveCanvas.style.display = 'block';
                
                if (waveAnimation) {
                    waveAnimation.stopAnimation();
                }
                waveAnimation = initWaveCanvas();
                if (waveAnimation) {
                    waveAnimation.animate();
                }
            }
            
            // Segundo item - Gráfico de barras
            if (barsCanvas && barsCanvas.id === 'barsCanvas') {
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                if (cosCanvas) cosCanvas.style.display = 'none';
                barsCanvas.style.display = 'block';
                
                if (barsAnimationInterval) {
                    clearInterval(barsAnimationInterval);
                }
                iniciarGraficoBarras();
            }
            
            // Tercer item - Gráfico de puntos
            if (pointsCanvas && pointsCanvas.id === 'pointsCanvas') {
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (cosCanvas) cosCanvas.style.display = 'none';
                pointsCanvas.style.display = 'block';
                
                iniciarPuntosDinamicos();
            }
            
            // Cuarto item - Gráfico de coseno dinámico
            if (cosCanvas && cosCanvas.id === 'cosCanvas') {
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                cosCanvas.style.display = 'block';
                
                iniciarCosenoDinamico();
            }
            
            // Activar modo detalle
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.add('showDetail');
            }
        });
    });
    
    // Botón "Hacia Atrás"
    const backButton = document.getElementById('back');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const carousel = document.querySelector('.carousel');
            if (carousel) {
                carousel.classList.remove('showDetail');
            }
            
            // Restaurar todas las imágenes y ocultar canvases
            const allItems = document.querySelectorAll('.item');
            allItems.forEach(item => {
                const img = item.querySelector('#originalImage');
                const waveCanvas = item.querySelector('#myCanvas');
                const barsCanvas = item.querySelector('#barsCanvas');
                const pointsCanvas = item.querySelector('#pointsCanvas');
                const cosCanvas = item.querySelector('#cosCanvas');
                
                if (img) img.style.display = 'block';
                if (waveCanvas) waveCanvas.style.display = 'none';
                if (barsCanvas) barsCanvas.style.display = 'none';
                if (pointsCanvas) pointsCanvas.style.display = 'none';
                if (cosCanvas) cosCanvas.style.display = 'none';
            });
            
            // Detener todas las animaciones
            if (waveAnimation) {
                waveAnimation.stopAnimation();
            }
            if (barsAnimationInterval) {
                clearInterval(barsAnimationInterval);
                barsAnimationInterval = null;
            }
            detenerPuntosDinamicos();
            detenerCosenoDinamico();
        });
    }
    
    // Limpiar intervalos al cerrar
    window.addEventListener('beforeunload', function() {
        if (barsAnimationInterval) {
            clearInterval(barsAnimationInterval);
        }
        detenerPuntosDinamicos();
        detenerCosenoDinamico();
    });
});