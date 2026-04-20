import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

describe('Hero', () => {
  const defaultProps = {
    title: 'Black Friday Sale',
    subtitle: 'Massive discounts on all products',
    imageUrl: 'https://example.com/hero.jpg',
  }

  it('renders title and subtitle', () => {
    render(<Hero {...defaultProps} />)
    expect(screen.getByText('Black Friday Sale')).toBeInTheDocument()
    expect(screen.getByText('Massive discounts on all products')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<Hero {...defaultProps} badge="Up to 25% off" />)
    expect(screen.getByText('Up to 25% off')).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<Hero {...defaultProps} />)
    expect(screen.queryByText(/off/i)).not.toBeInTheDocument()
  })

  it('renders image with correct src', () => {
    render(<Hero {...defaultProps} />)
    const img = document.querySelector('img')
    expect(img).toHaveAttribute('src', 'https://example.com/hero.jpg')
  })
})
