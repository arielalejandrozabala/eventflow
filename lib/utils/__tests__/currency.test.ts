import { formatPrice } from '../currency'

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    const result = formatPrice(1000, 'us')
    expect(result).toBe('$1,000.00')
  })

  it('formats ARS correctly', () => {
    const result = formatPrice(1000, 'ar')
    expect(result).toContain('ARS')
    expect(result).toContain('1,000')
  })

  it('formats BRL correctly', () => {
    const result = formatPrice(1000, 'br')
    expect(result).toContain('1,000')
  })

  it('defaults to USD for unknown country', () => {
    const result = formatPrice(1000, 'unknown')
    expect(result).toBe('$1,000.00')
  })

  it('handles decimal prices', () => {
    const result = formatPrice(99.99, 'us')
    expect(result).toBe('$99.99')
  })

  it('handles zero price', () => {
    const result = formatPrice(0, 'us')
    expect(result).toBe('$0.00')
  })
})
