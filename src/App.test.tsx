// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('professional qualification recognition office', () => {
  it('loads recognition cases from the Java API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, title: 'Romanian physiotherapist recognition', owner: 'Belgian Health Professions Office', status: 'Review', priority: 'High' }],
    }))
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(<QueryClientProvider client={client}><App /></QueryClientProvider>)
    expect(await screen.findByText('Romanian physiotherapist recognition')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Professional Qualification Recognition Office' })).toBeTruthy()
  })
})
