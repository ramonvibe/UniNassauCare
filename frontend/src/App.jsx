import { useEffect, useRef, useState } from 'react'
import { LoginModal, TicketPortal } from './MockPortal'

const supportAreas = [
  ['01', 'Vida acadêmica', 'Matrícula, disciplinas, notas e calendário em um só lugar.'],
  ['02', 'Financeiro', 'Mensalidades, bolsas, acordos e outras dúvidas financeiras.'],
  ['03', 'Documentos', 'Declarações, diplomas, certificados e solicitações acadêmicas.'],
]

const steps = [
  ['Conte o que precisa', 'Descreva sua dúvida de forma simples.'],
  ['Acompanhe de perto', 'Veja cada atualização do atendimento.'],
  ['Receba sua resposta', 'Nossa equipe orienta você até a solução.'],
]

const heroSubtitle = 'Suporte Humanizado para o estudante.'

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function TypewriterText() {
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [text, setText] = useState(reducedMotion ? heroSubtitle : '')
  const [showCursor, setShowCursor] = useState(!reducedMotion)

  useEffect(() => {
    if (reducedMotion) return undefined

    let interval
    let hideCursor
    const start = window.setTimeout(() => {
      let index = 0
      interval = window.setInterval(() => {
        index += 1
        setText(heroSubtitle.slice(0, index))

        if (index === heroSubtitle.length) {
          window.clearInterval(interval)
          hideCursor = window.setTimeout(() => setShowCursor(false), 1100)
        }
      }, 48)
    }, 850)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
      window.clearTimeout(hideCursor)
    }
  }, [reducedMotion])

  return (
    <span aria-label={heroSubtitle}>
      <span aria-hidden="true">
        {text}
        <span className={`typing-cursor ${showCursor ? '' : 'typing-cursor-hidden'}`} />
      </span>
    </span>
  )
}

function FloatingLogo() {
  const logoRef = useRef(null)
  const frameRef = useRef(0)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  function move(event) {
    if (reducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2

    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      if (!logoRef.current) return
      logoRef.current.style.transitionDuration = '120ms'
      logoRef.current.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 28px) rotateX(${-y * 12}deg) rotateY(${x * 16}deg)`
    })
  }

  function reset() {
    cancelAnimationFrame(frameRef.current)
    if (!logoRef.current) return
    logoRef.current.style.transitionDuration = '560ms'
    logoRef.current.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div className="floating-logo-stage mx-auto grid aspect-square w-44 select-none place-items-center sm:w-60 lg:w-72" onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
      <div className="floating-logo-idle">
        <img ref={logoRef} src="/assets/uninassau-removebg-preview.png" alt="" className="floating-logo w-full select-none" draggable="false" />
      </div>
    </div>
  )
}

function MeshBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = canvas.parentElement
    const transition = shell.querySelector('.mesh-transition')
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return
    canvas.classList.add('mesh-webgl')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 }
    let width = 0
    let height = 0
    let frame = 0
    let vertexCount = 0
    let transitionStart = 0.82
    let transitionDepth = 0.18

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, `
      attribute vec2 aPosition;
      uniform vec2 uResolution;
      uniform vec2 uPointer;
      uniform float uStrength;
      varying vec2 vPosition;

      void main() {
        vec2 point = aPosition * uResolution;
        vec2 delta = point - uPointer;
        float distanceFromPointer = length(delta);
        float radius = min(uResolution.x, uResolution.y) * 0.078;
        float center = exp(-(distanceFromPointer * distanceFromPointer) / (2.0 * pow(radius * 0.52, 2.0)));
        float ring = exp(-pow(distanceFromPointer - radius, 2.0) / (2.0 * pow(radius * 0.26, 2.0)));
        float depth = (-165.0 * center + 105.0 * ring) * uStrength;
        float perspective = 700.0 / (700.0 - depth);
        vec2 warped = uPointer + delta * perspective;
        vec2 clip = warped / uResolution * 2.0 - 1.0;

        vPosition = aPosition;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      }
    `)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      uniform float uTransitionStart;
      uniform float uTransitionDepth;
      varying vec2 vPosition;

      void main() {
        float beyondBlack = smoothstep(uTransitionStart + uTransitionDepth * 0.35, uTransitionStart + uTransitionDepth * 0.72, vPosition.y);
        float fade = 1.0 - smoothstep(uTransitionStart + uTransitionDepth * 0.58, uTransitionStart + uTransitionDepth * 0.98, vPosition.y);
        float opacity = mix(0.055, 0.14, beyondBlack) * fade;
        gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
      }
    `)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution')
    const pointerLocation = gl.getUniformLocation(program, 'uPointer')
    const strengthLocation = gl.getUniformLocation(program, 'uStrength')
    const gridTransitionStartLocation = gl.getUniformLocation(program, 'uTransitionStart')
    const gridTransitionDepthLocation = gl.getUniformLocation(program, 'uTransitionDepth')

    const backgroundVertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(backgroundVertexShader, `
      attribute vec2 aPosition;
      varying vec2 vUv;

      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `)
    gl.compileShader(backgroundVertexShader)

    const backgroundFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(backgroundFragmentShader, `
      precision mediump float;
      uniform float uTransitionStart;
      uniform float uTransitionDepth;
      varying vec2 vUv;

      void main() {
        float yFromTop = 1.0 - vUv.y;
        float alpha = 1.0 - smoothstep(uTransitionStart, uTransitionStart + uTransitionDepth * 0.72, yFromTop);
        gl_FragColor = vec4(0.051, 0.051, 0.059, alpha);
      }
    `)
    gl.compileShader(backgroundFragmentShader)

    const backgroundProgram = gl.createProgram()
    gl.attachShader(backgroundProgram, backgroundVertexShader)
    gl.attachShader(backgroundProgram, backgroundFragmentShader)
    gl.linkProgram(backgroundProgram)

    const backgroundBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const backgroundPositionLocation = gl.getAttribLocation(backgroundProgram, 'aPosition')
    const backgroundTransitionStartLocation = gl.getUniformLocation(backgroundProgram, 'uTransitionStart')
    const backgroundTransitionDepthLocation = gl.getUniformLocation(backgroundProgram, 'uTransitionDepth')

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    function createGrid() {
      const vertices = []
      const spacing = 54
      const resolution = 12

      for (let x = -spacing; x <= width + spacing; x += spacing) {
        for (let y = -resolution; y < height + resolution; y += resolution) {
          vertices.push(x / width, y / height, x / width, (y + resolution) / height)
        }
      }

      for (let y = -spacing; y <= height + spacing; y += spacing) {
        for (let x = -resolution; x < width + resolution; x += resolution) {
          vertices.push(x / width, y / height, (x + resolution) / width, y / height)
        }
      }

      vertexCount = vertices.length / 2
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    }

    function draw() {
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(backgroundProgram)
      gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBuffer)
      gl.enableVertexAttribArray(backgroundPositionLocation)
      gl.vertexAttribPointer(backgroundPositionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform1f(backgroundTransitionStartLocation, transitionStart)
      gl.uniform1f(backgroundTransitionDepthLocation, transitionDepth)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resolutionLocation, width, height)
      gl.uniform2f(pointerLocation, pointer.x, pointer.y)
      gl.uniform1f(strengthLocation, pointer.strength)
      gl.uniform1f(gridTransitionStartLocation, transitionStart)
      gl.uniform1f(gridTransitionDepthLocation, transitionDepth)
      gl.drawArrays(gl.LINES, 0, vertexCount)
    }

    function animate() {
      pointer.x += (pointer.targetX - pointer.x) * 0.14
      pointer.y += (pointer.targetY - pointer.y) * 0.14
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.12
      draw()

      const moving = Math.abs(pointer.targetX - pointer.x) + Math.abs(pointer.targetY - pointer.y) > 0.2
      const changing = Math.abs(pointer.targetStrength - pointer.strength) > 0.005
      frame = moving || changing ? requestAnimationFrame(animate) : 0
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(animate)
    }

    function resize() {
      const bounds = shell.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
      const transitionBounds = transition.getBoundingClientRect()
      transitionStart = (transitionBounds.top - bounds.top) / height
      transitionDepth = transitionBounds.height / height

      if (!pointer.x) {
        pointer.x = pointer.targetX = width * 0.72
        pointer.y = pointer.targetY = height * 0.42
      }
      createGrid()
      draw()
    }

    function move(event) {
      if (reducedMotion) return
      const bounds = shell.getBoundingClientRect()
      pointer.targetX = event.clientX - bounds.left
      pointer.targetY = event.clientY - bounds.top
      pointer.targetStrength = 1
      requestDraw()
    }

    function leave() {
      pointer.targetStrength = 0
      requestDraw()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(shell)
    shell.addEventListener('pointermove', move)
    shell.addEventListener('pointerleave', leave)
    resize()

    return () => {
      cancelAnimationFrame(frame)
      canvas.classList.remove('mesh-webgl')
      observer.disconnect()
      shell.removeEventListener('pointermove', move)
      shell.removeEventListener('pointerleave', leave)
      gl.deleteBuffer(buffer)
      gl.deleteBuffer(backgroundBuffer)
      gl.deleteProgram(program)
      gl.deleteProgram(backgroundProgram)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteShader(backgroundVertexShader)
      gl.deleteShader(backgroundFragmentShader)
    }
  }, [])

  return <canvas ref={canvasRef} className="mesh-canvas" aria-hidden="true" />
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (session) return undefined
    const elements = [...document.querySelectorAll('[data-reveal]')]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.2, rootMargin: '0px 0px -20% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [session])

  if (session) return <TicketPortal role={session} onLogout={() => setSession(null)} />

  return (
    <div className="min-h-screen overflow-hidden bg-[#0d0d0f] text-white">
      <div className="mesh-shell relative">
      <MeshBackground />
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/assets/uninassau-removebg-preview.png" alt="" className="size-11 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,.3)]" />
          <div>
            <p className="text-base font-black leading-none tracking-[-.03em]">NassauCare</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[.22em] text-neutral-500">Uninassau</p>
          </div>
        </div>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-sm font-semibold text-neutral-400 md:flex">
          <a href="#como-funciona" className="py-3 transition hover:-translate-y-1 hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none">Como funciona</a>
          <a href="#atendimentos" className="py-3 transition hover:-translate-y-1 hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none">Atendimentos</a>
          <a href="#beneficios" className="py-3 transition hover:-translate-y-1 hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none">Benefícios</a>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" className="hidden min-h-11 rounded-full border border-white/20 bg-white px-5 text-sm font-bold text-neutral-900 shadow-sm transition hover:-translate-y-0.5 sm:inline-flex sm:items-center">Portal do aluno</button>
          <button type="button" aria-disabled="true" title="Disponível em breve" className="hidden min-h-11 cursor-not-allowed rounded-full border border-white/15 px-5 text-sm font-bold text-white/55 sm:inline-flex sm:items-center">Cadastro</button>
          <button type="button" onClick={() => setLoginOpen(true)} className="min-h-11 rounded-full bg-[#d71920] px-5 text-sm font-black text-white shadow-[0_12px_30px_rgba(215,25,32,.2)] transition hover:-translate-y-0.5 hover:bg-[#eb2027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400">Login</button>
        </div>
      </header>

        <section className="relative z-10 mx-auto grid min-h-[calc(112.5svh-6rem)] max-w-7xl items-center gap-12 px-6 pb-[10svh] pt-[6svh] lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-white/5 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-red-300 shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-[#d71920] shadow-[0_0_0_5px_rgba(215,25,32,.12)]" />
              Central de suporte ao estudante
            </div>

            <h1 className="hero-brand-enter max-w-3xl text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-[.78] tracking-[-.085em] text-[#d71920]">
              Nassau<span className="text-white">Care</span>
            </h1>

            <h2 className="relative mt-10 max-w-2xl text-3xl font-bold leading-tight tracking-[-.035em] sm:text-5xl">
              <span className="invisible block" aria-hidden="true">{heroSubtitle}</span>
              <span className="absolute inset-0"><TypewriterText /></span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-400">
              Um canal simples e acolhedor para tirar dúvidas, acompanhar solicitações e encontrar o apoio que você precisa durante sua jornada acadêmica.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" className="flex items-center gap-8 rounded-full bg-[#d71920] px-6 py-4 font-bold text-white shadow-[0_16px_40px_rgba(215,25,32,.25)] transition hover:-translate-y-1">
                Buscar atendimento <ArrowIcon />
              </button>
              <button type="button" className="rounded-full border border-white/15 bg-white/5 px-6 py-4 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
                Saiba como funciona
              </button>
            </div>
          </div>

          <div className="hero-visual relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:aspect-square" aria-hidden="true">
            <div className="absolute left-[12%] top-[9%] size-72 rounded-full bg-[#d71920]/15 blur-3xl" />
            <img src="/assets/uninassau-removebg-preview.png" alt="" className="crest-hero absolute right-[2%] top-[-5%] z-[1] w-[36%]" />
            <div className="ticket-card ticket-card-back glass-dark absolute inset-x-[13%] top-[13%] h-[68%] rounded-[2rem] p-7 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[.2em] text-white/50">Atendimento</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Em andamento</span>
              </div>
            </div>

            <div className="ticket-card glass-dark absolute inset-x-[6%] top-[25%] h-[70%] rounded-[2rem] p-7 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-[#d71920]">NassauCare</p>
                  <p className="mt-2 text-sm font-semibold text-white/45">Solicitação #2408</p>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/10 p-1.5">
                  <img src="/assets/uninassau-removebg-preview.png" alt="" className="size-full object-contain" />
                </div>
              </div>
              <div className="mt-9 h-px bg-white/10" />
              <p className="mt-7 text-sm font-medium text-white/45">Olá, estudante.</p>
              <p className="mt-2 max-w-sm text-2xl font-extrabold leading-tight tracking-[-.03em]">Estamos cuidando da sua solicitação.</p>
              <div className="mt-8 flex gap-2">
                <span className="h-2 flex-1 rounded-full bg-[#d71920]" />
                <span className="h-2 flex-1 rounded-full bg-[#d71920]" />
                <span className="h-2 flex-1 rounded-full bg-white/15" />
              </div>
              <div className="mt-5 flex items-center justify-between text-xs font-bold text-white/45">
                <span>Recebido</span><span>Em análise</span><span>Resolvido</span>
              </div>
            </div>

            <div className="float-note glass-dark absolute bottom-3 right-0 rounded-2xl p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-white/45">Próximo passo</p>
              <p className="mt-1 font-extrabold">Acompanhar solicitação</p>
            </div>
          </div>
        </section>
        <section className="photo-section relative w-full overflow-hidden bg-[#141414] text-[#171717]">
          <img
            src="/assets/pexels-tima-miroshnichenko-5439455.jpg"
            alt="Estudante recebendo atendimento individualizado."
            width="5445"
            height="3630"
            loading="lazy"
            className="absolute inset-0 z-0 size-full object-cover object-[68%_center] md:object-center"
          />
          <div id="beneficios" className="mesh-transition relative z-20 flex h-[58svh] scroll-mt-6 items-end px-6 pb-[6svh] lg:px-10">
            <div data-reveal className="glass-dark benefits-glass mx-auto grid w-full max-w-7xl divide-y divide-white/10 overflow-hidden rounded-[2rem] text-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {['Atendimento centralizado', 'Histórico organizado', 'Comunicação mais humana'].map((item, index) => (
                <div key={item} className="flex items-center gap-4 px-6 py-7 sm:px-7">
                  <span className="text-xs font-black text-red-300">0{index + 1}</span>
                  <p className="font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="atendimentos" className="relative z-20 mx-auto max-w-7xl scroll-mt-6 px-6 py-28 lg:px-10">
            <div data-reveal className="photo-copy grid gap-10 text-white lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#d71920]">Estamos com você</p>
                <h2 className="mt-5 max-w-md text-4xl font-black leading-[1.05] tracking-[-.05em] sm:text-6xl">
                  Ajuda para cada momento da sua jornada.
                </h2>
              </div>
              <p className="max-w-xl self-end text-lg leading-8 text-white/80 lg:justify-self-end">
                Do primeiro acesso à conclusão do curso, o NassauCare conecta você à equipe certa para tornar cada etapa mais simples.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {supportAreas.map(([number, title, description], index) => (
                <article
                  key={title}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 45}ms` }}
                  className="glass-dark benefits-glass support-card lift-card group rounded-[2rem] p-7 text-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-300">{number}</span>
                    <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 transition group-hover:bg-[#d71920] group-hover:text-white"><ArrowIcon /></span>
                  </div>
                  <h3 className="mt-20 text-2xl font-black tracking-[-.03em]">{title}</h3>
                  <p className="mt-3 leading-7 text-white/65">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <main>
        <section id="como-funciona" className="scroll-mt-6 bg-[#191919] px-6 py-28 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[.2em] text-red-400">Simples do início ao fim</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-.05em] sm:text-6xl">Como funciona</h2>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-3">
              {steps.map(([title, description], index) => (
                <article
                  key={title}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 45}ms` }}
                  className="glass-dark p-8"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-[#d71920] text-sm font-black">{index + 1}</span>
                  <h3 className="mt-16 text-2xl font-black">{title}</h3>
                  <p className="mt-3 max-w-xs leading-7 text-white/65">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f6f5f2] px-6 py-24 text-[#171717] lg:px-10">
          <div data-reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#d71920] px-7 py-16 text-white sm:px-14 lg:py-20">
            <div className="cta-ring absolute -right-24 -top-32 size-96 rounded-full border-[55px] border-white/10" aria-hidden="true" />
            <div className="relative grid items-center gap-10 lg:grid-cols-3">
              <div className="max-w-3xl lg:col-span-2">
                <p className="text-xs font-black uppercase tracking-[.2em] text-white/70">NassauCare</p>
                <h2 className="mt-5 text-4xl font-black leading-none tracking-[-.055em] sm:text-6xl">Sua dúvida merece atenção. Sua jornada também.</h2>
                <button type="button" className="mt-9 rounded-full bg-white px-6 py-4 font-black text-[#b51117] shadow-xl">
                  Acessar central de suporte
                </button>
              </div>
              <FloatingLogo />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-none flex-col gap-6 border-t border-neutral-200 bg-[#f6f5f2] px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        <p><strong className="text-neutral-900">NassauCare</strong> · UNINASSAU</p>
        <p>Suporte feito para acompanhar você.</p>
      </footer>

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onLogin={(role) => {
            setSession(role)
            setLoginOpen(false)
            window.scrollTo(0, 0)
          }}
        />
      )}

    </div>
  )
}

export default App
