import { getAllEvents, getEvent } from '../events'
import { eventCache } from '../../cache/eventCache'

beforeEach(() => {
  // Clear cache between tests to avoid cross-test contamination
  eventCache.invalidate('all_events')
  eventCache.invalidate('event_black-friday')
  eventCache.invalidate('event_cyber-monday')
})

describe('events API layer', () => {
  describe('getAllEvents', () => {
    it('returns all events', async () => {
      const events = await getAllEvents()
      expect(events).toHaveLength(2)
      expect(events[0]).toHaveProperty('slug')
      expect(events[0]).toHaveProperty('title')
      expect(events[0]).toHaveProperty('products')
    })

    it('simulates async behavior on first call', async () => {
      const start = Date.now()
      await getAllEvents()
      expect(Date.now() - start).toBeGreaterThanOrEqual(100)
    })

    it('returns cached result on second call without latency', async () => {
      await getAllEvents()
      const start = Date.now()
      await getAllEvents()
      expect(Date.now() - start).toBeLessThan(50)
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

    it('returns cached result on second call without latency', async () => {
      await getEvent('black-friday')
      const start = Date.now()
      await getEvent('black-friday')
      expect(Date.now() - start).toBeLessThan(50)
    })
  })

  describe('error handling', () => {
    it('getAllEvents throws with descriptive message on failure', async () => {
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('DB connection failed')
      })
      await expect(getAllEvents()).rejects.toThrow('Failed to fetch events')
    })

    it('getEvent throws with slug in message on failure', async () => {
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('DB connection failed')
      })
      await expect(getEvent('black-friday')).rejects.toThrow(
        'Failed to fetch event: black-friday'
      )
    })

    it('getEvent error includes original cause', async () => {
      const cause = new Error('DB connection failed')
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw cause
      })
      try {
        await getEvent('black-friday')
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error & { cause: unknown }).cause).toBe(cause)
      }
    })
  })
})
