import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Route, Switch } from 'wouter'
import './App.css'
import './forms.css'

type QualificationCase = { id: number; title: string; owner: string; status: 'Draft' | 'Review' | 'Approved'; priority: 'Low' | 'Medium' | 'High' }
const api = '/api/items'

async function readEvidence(): Promise<QualificationCase[]> {
  const response = await fetch(api)
  if (!response.ok) throw new Error('The qualification recognition service is unavailable.')
  return response.json()
}

async function createEvidence(item: Omit<QualificationCase, 'id'>): Promise<QualificationCase> {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
  if (!response.ok) throw new Error('The recognition case could not be saved.')
  return response.json()
}

async function advanceEvidence(item: QualificationCase): Promise<QualificationCase> {
  const status = item.status === 'Draft' ? 'Review' : 'Approved'
  const response = await fetch(`${api}/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, status }) })
  if (!response.ok) throw new Error('The recognition case could not be updated.')
  return response.json()
}

function Register() {
  const cache = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { data = [], isPending, error } = useQuery({ queryKey: ['evidence'], queryFn: readEvidence })
  const save = useMutation({ mutationFn: createEvidence, onSuccess: () => { cache.invalidateQueries({ queryKey: ['evidence'] }); setOpen(false) } })
  const advance = useMutation({ mutationFn: advanceEvidence, onSuccess: () => cache.invalidateQueries({ queryKey: ['evidence'] }) })
  const visible = data.filter((item) => `${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title))
  const approved = data.filter((item) => item.status === 'Approved').length
  const high = data.filter((item) => item.priority === 'High').length

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    save.mutate({ title: String(values.get('title')), owner: String(values.get('owner')), status: 'Draft', priority: String(values.get('priority')) as QualificationCase['priority'] })
  }

  return <main>
    <header className="hero"><div><span className="eyebrow">Turn professional qualifications into trusted digital credentials across Europe</span><h1>Professional Qualification Recognition Office</h1><p>Coordinate digital applications for doctors, nurses, engineers, teachers and other regulated professionals.</p></div><button className="primary" onClick={() => setOpen(!open)}>{open ? 'Close form' : 'Add recognition case'}</button></header>
    <section className="metrics" aria-label="professional qualification summary"><article><span>Cases tracked</span><strong>{isPending ? '…' : data.length}</strong><small>Cross-border view</small></article><article><span>Recognised</span><strong>{approved}</strong><small>Decision issued</small></article><article><span>High priority</span><strong>{high}</strong><small>Workforce shortage</small></article></section>
    {open && <form className="panel form" onSubmit={submit}><h2>Add a recognition case</h2><label>Profession or qualification<input required name="title" minLength={4} placeholder="Example: physiotherapist diploma recognition" /></label><label>Responsible authority or employer<input required name="owner" minLength={3} placeholder="Example: Belgian Health Professions Office" /></label><label>Priority<select name="priority"><option>High</option><option>Medium</option><option>Low</option></select></label><button className="primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save recognition case'}</button>{save.error && <p role="alert">{save.error.message}</p>}</form>}
    <section className="panel"><div className="panel-title"><h2>Qualification recognition pipeline</h2><span>{error ? 'Connection problem' : 'Live API data'}</span></div><label className="search">Find a recognition case<input aria-label="Find a recognition case" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by profession, country, owner or status" /></label>{error && <p role="alert">{error.message}</p>}{!isPending && !error && visible.length === 0 && <p>No recognition cases match this view.</p>}{visible.map((item) => <div className="row" key={item.id}><span className={`dot ${item.status === 'Approved' ? '' : 'degraded'}`} /><div><b>{item.title}</b><small>{item.owner} · {item.status}</small></div><strong>{item.priority}</strong>{item.status !== 'Approved' && <button className="secondary" disabled={advance.isPending} onClick={() => advance.mutate(item)}>Move to {item.status === 'Draft' ? 'review' : 'recognised'}</button>}</div>)}</section>
  </main>
}

function About() { return <main><header className="hero"><div><span className="eyebrow">Why it matters</span><h1>Qualified professionals should not wait a year to work in another Member State</h1></div></header><section className="panel prose"><h2>From digital diploma to a secure recognition decision</h2><p>Teams can see the profession, competent authority, evidence status and remaining decision steps.</p></section></main> }

export default function App() { return <div className="shell"><nav><b>SkillsPassportEU<span>/recognition office</span></b><div><Link href="/">Recognition cases</Link><Link href="/about">Purpose</Link></div></nav><Switch><Route path="/" component={Register} /><Route path="/about" component={About} /></Switch></div> }
