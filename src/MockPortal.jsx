import { useEffect, useRef, useState } from 'react'

const ticketsByRole = {
  collaborator: [
    { id: 'NC-2481', title: 'Erro ao acessar o ambiente virtual', student: 'Larissa Gomes', area: 'Vida acadêmica', status: 'Novo', updated: 'Hoje, 09:42', messages: [['Larissa Gomes', 'Não consigo acessar o ambiente virtual. Depois do login, a página volta para o início.']] },
    { id: 'NC-2476', title: 'Dúvida sobre bolsa e mensalidade', student: 'Carlos Henrique', area: 'Financeiro', status: 'Em análise', updated: 'Hoje, 08:15', messages: [['Carlos Henrique', 'Minha bolsa aparece no portal, mas não foi aplicada na mensalidade deste mês.'], ['Equipe NassauCare', 'Recebemos sua solicitação e estamos validando o lançamento.']] },
    { id: 'NC-2469', title: 'Declaração de vínculo', student: 'Bianca Melo', area: 'Documentos', status: 'Aguardando aluno', updated: 'Ontem, 14:03', messages: [['Bianca Melo', 'Preciso de uma declaração atualizada para apresentar no estágio.'], ['Equipe NassauCare', 'Você precisa da versão digital ou deseja retirar uma via presencialmente?']] },
  ],
  student: [
    { id: 'NC-2455', title: 'Ajuste de disciplina na grade', area: 'Vida acadêmica', status: 'Em análise', updated: 'Hoje, 10:08', messages: [['Você', 'A disciplina de Projeto Integrador não apareceu na minha grade.'], ['Equipe NassauCare', 'Estamos conferindo sua matriz curricular com a coordenação.']] },
    { id: 'NC-2410', title: 'Segunda via de boleto', area: 'Financeiro', status: 'Resolvido', updated: '18 set, 15:30', messages: [['Você', 'Preciso da segunda via atualizada do boleto.'], ['Equipe NassauCare', 'O boleto já está disponível no Portal do Aluno.']] },
    { id: 'NC-2388', title: 'Emissão de histórico parcial', area: 'Documentos', status: 'Resolvido', updated: '10 set, 11:20', messages: [['Você', 'Gostaria de solicitar meu histórico parcial.'], ['Equipe NassauCare', 'Documento emitido e enviado para seu e-mail.']] },
  ],
}

const badge = {
  Novo: 'border-red-400/25 bg-red-400/10 text-red-300',
  'Em análise': 'border-amber-300/25 bg-amber-300/10 text-amber-200',
  'Aguardando aluno': 'border-blue-300/25 bg-blue-300/10 text-blue-200',
  Resolvido: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  Respondido: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
}

function Status({ value }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badge[value]}`}>{value}</span>
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
    if (normalized === 'aluno' && password === 'aluno') return onLogin('student')
    setError('Usuário ou senha incorretos. Use uma das contas de demonstração.')
    requestAnimationFrame(() => dialogRef.current?.focus())
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="login-title" tabIndex="-1" className="glass-dark w-full max-w-md rounded-[2rem] p-6 text-white sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Acesso demonstrativo</p><h2 id="login-title" className="mt-3 text-3xl font-black tracking-[-.04em]">Entrar no NassauCare</h2></div>
          <button type="button" onClick={onClose} className="min-h-11 rounded-full border border-white/15 px-4 text-sm font-bold text-white/70 hover:bg-white/10">Fechar</button>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          <label className="block text-sm font-bold">Usuário<input autoFocus autoComplete="username" value={user} onChange={(event) => { setUser(event.target.value); setError('') }} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 font-normal outline-none focus:border-red-400" required /></label>
          <label className="block text-sm font-bold">Senha<input type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/30 px-4 font-normal outline-none focus:border-red-400" required /></label>
          <button type="submit" className="min-h-12 w-full rounded-full bg-[#d71920] px-6 font-black hover:bg-[#eb2027]">Entrar</button>
        </form>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/65">
          <p><strong className="text-white">Colaborador:</strong> colaborador / colaborador</p>
          <p><strong className="text-white">Aluno:</strong> aluno / aluno</p>
        </div>
      </section>
    </div>
  )
}

export function TicketPortal({ role, onLogout }) {
  const collaborator = role === 'collaborator'
  const [tickets, setTickets] = useState(() => ticketsByRole[role])
  const [selectedId, setSelectedId] = useState(() => tickets[0].id)
  const [reply, setReply] = useState('')
  const selected = tickets.find((ticket) => ticket.id === selectedId)

  function answer(event) {
    event.preventDefault()
    if (!reply.trim()) return
    setTickets((current) => current.map((ticket) => ticket.id === selected.id ? { ...ticket, status: 'Respondido', updated: 'Agora', messages: [...ticket.messages, ['Equipe NassauCare', reply.trim()]] } : ticket))
    setReply('')
  }

  return (
    <div className="ticket-portal min-h-screen text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0f]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3"><img src="/assets/uninassau-removebg-preview.png" alt="" className="size-10 object-contain" /><div><p className="font-black">NassauCare</p><p className="text-xs text-white/45">{collaborator ? 'Área do colaborador' : 'Portal do estudante'}</p></div></div>
          <button type="button" onClick={onLogout} className="min-h-11 rounded-full border border-white/15 px-5 text-sm font-bold hover:bg-white/10">Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <p className="text-xs font-black uppercase tracking-[.2em] text-red-300">{collaborator ? 'Fila de atendimento' : 'Seu atendimento'}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">{collaborator ? 'Chamados recentes' : 'Meus chamados'}</h1>
        <p className="mt-3 text-sm text-white/50">Ambiente demonstrativo. Alterações duram somente nesta sessão.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
          <section className="glass-dark overflow-hidden rounded-[2rem]" aria-label="Lista de chamados">
            <div className="divide-y divide-white/10">
              {tickets.map((ticket) => (
                <button key={ticket.id} type="button" aria-pressed={ticket.id === selected.id} onClick={() => setSelectedId(ticket.id)} className={`w-full px-5 py-5 text-left transition hover:bg-white/[.07] ${ticket.id === selected.id ? 'bg-white/10' : ''}`}>
                  <div className="flex justify-between gap-3"><span className="text-xs font-black text-red-300">{ticket.id}</span><span className="text-xs text-white/40">{ticket.updated}</span></div>
                  <h2 className="mt-3 font-bold">{ticket.title}</h2>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-white/45">{collaborator ? ticket.student : ticket.area}</span><Status value={ticket.status} /></div>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-dark rounded-[2rem] p-5 sm:p-7" aria-label={`Detalhes do chamado ${selected.id}`}>
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
              <div><p className="text-xs font-black text-red-300">{selected.id} · {selected.area}</p><h2 className="mt-3 text-2xl font-black">{selected.title}</h2>{collaborator && <p className="mt-2 text-sm text-white/45">Solicitante: {selected.student}</p>}</div>
              <div><Status value={selected.status} /></div>
            </div>
            <div className="space-y-4 py-6">
              {selected.messages.map(([author, text], index) => <article key={`${selected.id}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-5"><h3 className="text-sm font-black">{author}</h3><p className="mt-3 leading-7 text-white/70">{text}</p></article>)}
            </div>
            {collaborator && <form onSubmit={answer} className="border-t border-white/10 pt-6"><label htmlFor="reply" className="text-sm font-black">Responder ao estudante</label><textarea id="reply" rows="4" value={reply} onChange={(event) => setReply(event.target.value)} className="mt-3 w-full resize-y rounded-2xl border border-white/15 bg-black/25 p-4 outline-none focus:border-red-400" placeholder="Escreva uma orientação clara..." /><div className="mt-4 flex justify-end"><button type="submit" disabled={!reply.trim()} className="min-h-12 rounded-full bg-[#d71920] px-6 font-black disabled:cursor-not-allowed disabled:opacity-40">Enviar resposta</button></div></form>}
          </section>
        </div>
      </main>
    </div>
  )
}
