import { getAllEvents, getEvent } from '../events'

describe('events API layer', () => {
  describe('getAllEvents', () => {
    it('returns all events', async () => {
      const events = await getAllEvents()
      expect(events).toHaveLength(2)
      expect(events[0]).toHaveProperty('slug')
      expect(events[0]).toHaveProperty('title')
      expect(events[0]).toHaveProperty('products')
    })

    it('simulates async behavior', async () => {
      const start = Date.now()
      await getAllEvents()
      expect(Date.now() - start).toBeGreaterThanOrEqual(100)
    })
  })

  describe('getEvent', () => {
    it('returns event by slug', async () => {
      const event = await getEvent('black-friday')
      expect(event).not.toBeNull()
      expect(event?.title).toBe('Black Friday')
      expect(event?.products).toHaveLength(4)
    })

    it('returns null for non-existent slug', async () => {
      const event = await getEvent('non-existent')
      expect(event).toBeNull()
    })

    it('returns correct event data structure', async () => {
      const event = await getEvent('cyber-monday')
      expect(event).toMatchObject({
        slug: 'cyber-monday',
        title: 'Cyber Monday',
        description: expect.any(String),
        expiresAt: expect.any(String),
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            image: expect.any(String),
          }),
        ]),
      })
    })
  })
})
