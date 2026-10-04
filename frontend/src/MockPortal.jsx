import { useEffect, useRef, useState } from 'react'

const initialQueue = [
  { id: 'UNI-P012', patient: 'Helena Martins', age: 68, priority: 'Prioritária', service: 'Clínica médica', professional: 'Dra. Marina Alves', room: 'Consultório 03', status: 'Próximo', arrival: '09:18', reason: 'Retorno e avaliação de exames' },
  { id: 'UNI-N034', patient: 'Rafael Souza', age: 31, priority: 'Normal', service: 'Clínica médica', professional: 'Dr. Lucas Lima', room: 'Consultório 01', status: 'Aguardando', arrival: '09:22', reason: 'Consulta agendada' },
  { id: 'UNI-P013', patient: 'Maria das Dores', age: 74, priority: 'Prioritária', service: 'Cardiologia', professional: 'Dra. Ana Bezerra', room: 'Consultório 05', status: 'Aguardando', arrival: '09:27', reason: 'Avaliação cardiológica' },
  { id: 'UNI-N035', patient: 'João Pedro', age: 24, priority: 'Normal', service: 'Coleta laboratorial', professional: 'Equipe de coleta', room: 'Sala 02', status: 'Aguardando', arrival: '09:31', reason: 'Coleta de exames' },
]

const patientTicket = { id: 'UNI-P011', patient: 'Ana Clara Lima', priority: 'Prioritária', service: 'Clínica médica', professional: 'Dra. Marina Alves', room: 'Consultório 03', status: 'Aguardando', arrival: '09:12', position: 2, estimate: '12 min', reason: 'Consulta de retorno' }

const statusStyle = {
  Próximo: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  Aguardando: 'border-blue-300/25 bg-blue-300/10 text-blue-100',
  Chamado: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
}

function Status({ value }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle[value]}`}>{value}</span>
}

export function LoginModal({ onClose, onLogin }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const escape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [onClose])

  function submit(event) {
    event.preventDefault()
    const normalized = user.trim().toLowerCase()
    if (normalized === 'colaborador' && password === 'colaborador') return onLogin('collaborator')
    if (normalized === 'paciente' && password === 'paciente') return onLogin('patient')
    setError('Dados incorretos. Use uma das contas de demonstração abaixo.')
    requestAnimationFrame(() => dialogRef.current?.focus())
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="login-title" tabIndex="-1" className="glass-dark w-full max-w-md rounded-[2rem] p-6 text-white sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Acesso demonstrativo</p><h2 id="login-title" className="mt-3 text-3xl font-black tracking-[-.04em]">Entrar no UniNassauCare</h2></div>
          <button type="button" onClick={onClose} className="button-secondary min-h-11 rounded-full px-4 text-sm font-bold text-white/70">Fechar</button>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
          <label htmlFor="login-user" className="block text-sm font-bold">Usuário</label>
          <input id="login-user" autoFocus autoComplete="username" value={user} onChange={(event) => { setUser(event.target.value); setError('') }} className="-mt-3 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 outline-none focus:border-red-400" required />
          <label htmlFor="login-password" className="block text-sm font-bold">Senha</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} className="-mt-3 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 outline-none focus:border-red-400" required />
          <button type="submit" className="button-primary min-h-12 w-full rounded-full bg-[#d71920] px-6 font-black">Entrar</button>
        </form>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
          <p><strong className="text-white">Paciente:</strong> paciente / paciente</p>
          <p><strong className="text-white">Colaborador:</strong> colaborador / colaborador</p>
        </div>
      </section>
    </div>
  )
}

function PatientPortal({ onLogout, theme, onToggleTheme }) {
  return <PortalShell subtitle="Portal do paciente" onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme}>
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <section className="queue-card-3d glass-dark rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Sua senha</p><h1 className="mt-3 font-mono text-5xl font-black tracking-[-.06em] sm:text-7xl">{patientTicket.id}</h1></div><Status value={patientTicket.status} /></div>
        <div className="my-8 h-px bg-white/10" />
        <div className="grid gap-5 sm:grid-cols-3"><Metric label="Posição na fila" value={`${patientTicket.position}ª`} /><Metric label="Previsão" value={patientTicket.estimate} /><Metric label="Tipo" value={patientTicket.priority} /></div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="font-black">Aguarde a chamada no painel</p><p className="mt-2 leading-7 text-white/65">Dirija-se ao {patientTicket.room} quando sua senha for anunciada.</p></div>
      </section>
      <section className="glass-dark rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Detalhes do atendimento</p>
        <dl className="mt-6 space-y-5"><Detail label="Paciente" value={patientTicket.patient} /><Detail label="Serviço" value={patientTicket.service} /><Detail label="Profissional" value={patientTicket.professional} /><Detail label="Motivo informado" value={patientTicket.reason} /><Detail label="Chegada" value={patientTicket.arrival} /></dl>
      </section>
    </div>
  </PortalShell>
}

function CollaboratorPortal({ onLogout, theme, onToggleTheme }) {
  const [queue, setQueue] = useState(initialQueue)
  const [view, setView] = useState('queue')
  const [selectedId, setSelectedId] = useState(initialQueue[0].id)
  const [notice, setNotice] = useState('')
  const selected = queue.find((item) => item.id === selectedId) || queue[0]

  function callNext() {
    setQueue((current) => current.map((item) => item.id === selected.id ? { ...item, status: 'Chamado' } : item))
    setNotice(`${selected.id} chamado para ${selected.room}.`)
  }

  function register(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const priority = data.get('priority')
    const count = queue.filter((item) => item.priority === priority).length + 36
    const created = { id: `UNI-${priority === 'Prioritária' ? 'P' : 'N'}${String(count).padStart(3, '0')}`, patient: data.get('patient'), age: data.get('age'), priority, service: data.get('service'), professional: data.get('professional'), room: data.get('room'), reason: data.get('reason'), status: 'Aguardando', arrival: 'Agora' }
    setQueue((current) => [...current, created])
    setSelectedId(created.id)
    setNotice(`${created.id} cadastrado na fila ${priority.toLowerCase()}.`)
    setView('queue')
    event.currentTarget.reset()
  }

  const priorityCount = queue.filter((item) => item.priority === 'Prioritária' && item.status !== 'Chamado').length
  const normalCount = queue.filter((item) => item.priority === 'Normal' && item.status !== 'Chamado').length

  if (view === 'display') return <TicketDisplay queue={queue} current={selected} onClose={() => setView('queue')} theme={theme} onToggleTheme={onToggleTheme} />

  return <PortalShell subtitle="Área do colaborador" onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme}>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Central de atendimento</p><h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">Gestão da fila</h1></div>
      <div className="flex flex-wrap rounded-3xl border border-white/10 bg-white/5 p-1" aria-label="Seções do portal"><Tab active={view === 'queue'} onClick={() => setView('queue')}>Fila atual</Tab><Tab active={view === 'register'} onClick={() => setView('register')}>Novo atendimento</Tab><Tab active={false} onClick={() => setView('display')}>Exibição de senhas</Tab></div>
    </div>
    {notice && <p aria-live="polite" className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-sm font-bold text-emerald-100">{notice}</p>}
    {view === 'queue' ? <>
      <div className="mt-7 grid gap-4 sm:grid-cols-3"><MetricCard label="Fila prioritária" value={priorityCount} helper="aguardando" accent="text-amber-200" /><MetricCard label="Fila normal" value={normalCount} helper="aguardando" accent="text-blue-200" /><MetricCard label="Atendidos hoje" value="18" helper="até 09:40" accent="text-emerald-200" /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[.92fr_1.08fr]">
        <section className="glass-dark overflow-hidden rounded-[2rem]" aria-label="Fila de pacientes"><div className="border-b border-white/10 px-5 py-4"><h2 className="font-black">Próximos na fila</h2></div><div className="divide-y divide-white/10">{queue.map((item) => <button key={item.id} type="button" aria-pressed={item.id === selected.id} onClick={() => setSelectedId(item.id)} className={`w-full px-5 py-5 text-left transition hover:bg-white/[.07] ${item.id === selected.id ? 'bg-white/10' : ''}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-sm font-black text-red-300">{item.id}</span><Status value={item.status} /></div><p className="mt-3 font-bold">{item.patient}</p><div className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-white/50"><span>{item.service}</span><span>{item.priority}</span></div></button>)}</div></section>
        <section className="queue-card-3d glass-dark rounded-[2rem] p-6 sm:p-8" aria-label={`Detalhes da senha ${selected.id}`}>
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Próximo a ser chamado</p><h2 className="mt-3 font-mono text-4xl font-black sm:text-6xl">{selected.id}</h2></div><Status value={selected.status} /></div>
          <dl className="mt-8 grid gap-5 border-y border-white/10 py-7 sm:grid-cols-2"><Detail label="Paciente" value={`${selected.patient}, ${selected.age} anos`} /><Detail label="Classificação" value={selected.priority} /><Detail label="Atendimento" value={selected.service} /><Detail label="Profissional" value={selected.professional} /><Detail label="Destino" value={selected.room} /><Detail label="Chegada" value={selected.arrival} /></dl>
          <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-white/45">Motivo informado</p><p className="mt-2 leading-7 text-white/75">{selected.reason}</p></div>
          <button type="button" onClick={callNext} disabled={selected.status === 'Chamado'} className="button-primary mt-7 min-h-12 w-full rounded-full bg-[#d71920] px-6 font-black disabled:cursor-not-allowed disabled:opacity-40">{selected.status === 'Chamado' ? 'Paciente chamado' : 'Chamar próximo paciente'}</button>
        </section>
      </div>
    </> : <RegisterForm onSubmit={register} />}
  </PortalShell>
}

function TicketDisplay({ queue, current, onClose, theme, onToggleTheme }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const upcoming = queue.filter((item) => item.id !== current.id && item.status !== 'Chamado').slice(0, 4)
  const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)
  const date = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(now)

  return <main className={`tv-display theme-${theme} relative min-h-dvh overflow-hidden text-white`}>
    <div className="tv-orbit tv-orbit-one" aria-hidden="true"><span /><span /><span /></div>
    <div className="tv-orbit tv-orbit-two" aria-hidden="true"><span /><span /></div>
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-[1600px] flex-col px-6 py-6 sm:px-10 lg:px-16 lg:py-10">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/15 pb-6">
        <div className="flex items-center gap-4"><img src="/assets/uninassau-removebg-preview.png" alt="" className="size-14 object-contain sm:size-16" /><div><p className="text-xl font-black sm:text-2xl">UniNassauCare</p><p className="mt-1 text-sm text-white/60">Painel de chamadas</p></div></div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button type="button" onClick={onClose} className="button-secondary min-h-11 rounded-full px-5 text-sm font-bold">Voltar à gestão</button>
          <div className="ml-2 text-right" aria-live="off"><time className="font-mono text-3xl font-black tabular-nums sm:text-5xl" dateTime={now.toISOString()}>{time}</time><p className="mt-1 text-sm capitalize text-white/60">{date}</p></div>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.35fr_.65fr] lg:py-12">
        <article className="tv-current surface-glass queue-card-3d rounded-[2.5rem] p-8 text-center sm:p-12 lg:p-16">
          <p className="text-sm font-black uppercase tracking-[.32em] text-red-300 sm:text-base">Senha chamada</p>
          <h1 className="mt-8 font-mono text-[clamp(4.5rem,12vw,11rem)] font-black leading-none tracking-[-.07em]">{current.id}</h1>
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-[#d71920] px-7 py-7 text-white shadow-[0_24px_70px_rgba(215,25,32,.35)]">
            <p className="text-lg font-bold uppercase tracking-[.15em] text-white/70">Dirija-se para</p>
            <p className="mt-3 text-3xl font-black sm:text-5xl">{current.room}</p>
          </div>
          <p className="mt-8 text-xl font-semibold text-white/70 sm:text-2xl">{current.service}</p>
        </article>

        <aside className="surface-glass rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[.22em] text-white/55">Próximas senhas</p>
          <div className="mt-5 divide-y divide-white/10">
            {upcoming.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-5"><div><p className="font-mono text-2xl font-black sm:text-3xl">{item.id}</p><p className="mt-1 text-sm text-white/55">{item.service}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-bold ${item.priority === 'Prioritária' ? 'border-amber-300/30 bg-amber-300/10 text-amber-100' : 'border-blue-300/25 bg-blue-300/10 text-blue-100'}`}>{item.priority}</span></div>)}
          </div>
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-white/60">Observe o painel e aguarde sua senha. Em caso de dúvida, procure a recepção.</p>
        </aside>
      </section>
    </div>
  </main>
}

function RegisterForm({ onSubmit }) {
  return <form onSubmit={onSubmit} className="glass-dark mt-7 rounded-[2rem] p-6 sm:p-8">
    <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Cadastro demonstrativo</p><h2 className="mt-3 text-3xl font-black">Novo atendimento</h2><p className="mt-3 text-white/55">Inclua apenas informações administrativas necessárias para organizar a fila.</p></div>
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Field label="Nome do paciente" name="patient" required /><Field label="Idade" name="age" type="number" min="0" max="120" required /><Select label="Classificação" name="priority" options={['Normal', 'Prioritária']} /><Select label="Tipo de atendimento" name="service" options={['Clínica médica', 'Cardiologia', 'Coleta laboratorial', 'Pediatria', 'Ortopedia']} /><Field label="Profissional responsável" name="professional" required /><Field label="Sala ou consultório" name="room" required /><div className="sm:col-span-2 lg:col-span-3"><Field label="Motivo informado" name="reason" required /></div></div>
    <div className="mt-7 flex justify-end"><button type="submit" className="button-primary min-h-12 rounded-full bg-[#d71920] px-7 font-black">Cadastrar e incluir na fila</button></div>
  </form>
}

function PortalShell({ subtitle, onLogout, theme, onToggleTheme, children }) {
  return <div className={`ticket-portal theme-${theme} min-h-screen text-white`}><header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0f]/85 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 lg:px-10"><div className="flex items-center gap-3"><img src="/assets/uninassau-removebg-preview.png" alt="" className="size-10 object-contain" /><div><p className="font-black">UniNassauCare</p><p className="text-xs text-white/50">{subtitle}</p></div></div><div className="flex gap-2"><ThemeToggle theme={theme} onToggle={onToggleTheme} /><button type="button" onClick={onLogout} className="button-secondary min-h-11 rounded-full px-5 text-sm font-bold">Sair</button></div></div></header><main className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">{children}</main></div>
}

function Metric({ label, value }) { return <div><p className="text-xs font-bold uppercase tracking-[.12em] text-white/45">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div> }
function MetricCard({ label, value, helper, accent }) { return <article className="glass-dark rounded-3xl p-6"><p className="text-sm font-bold text-white/55">{label}</p><p className={`mt-3 text-4xl font-black ${accent}`}>{value}</p><p className="mt-1 text-xs text-white/40">{helper}</p></article> }
function Detail({ label, value }) { return <div><dt className="text-xs font-bold uppercase tracking-[.12em] text-white/45">{label}</dt><dd className="mt-2 font-semibold text-white/90">{value}</dd></div> }
function Tab({ active, onClick, children }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`button-tab min-h-11 rounded-full px-5 text-sm font-bold ${active ? 'is-active bg-white text-neutral-950' : 'text-white/65 hover:text-white'}`}>{children}</button> }
function ThemeToggle({ theme, onToggle }) { return <button type="button" aria-pressed={theme === 'light'} onClick={onToggle} className="theme-toggle button-secondary min-h-11 rounded-full px-4 text-sm font-bold">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</button> }
function Field({ label, name, type = 'text', ...props }) { return <label className="block text-sm font-bold">{label}<input name={name} type={type} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 font-normal outline-none focus:border-red-400" {...props} /></label> }
function Select({ label, name, options }) { return <label className="block text-sm font-bold">{label}<select name={name} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#161619] px-4 font-normal outline-none focus:border-red-400">{options.map((option) => <option key={option}>{option}</option>)}</select></label> }

export function TicketPortal({ role, onLogout, theme, onToggleTheme }) {
  return role === 'collaborator' ? <CollaboratorPortal onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} /> : <PatientPortal onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
}
