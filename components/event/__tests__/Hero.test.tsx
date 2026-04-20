import { render, screen } from '@testing-library/react'
import Hero from '../event/Hero'

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

  it('applies background image', () => {
    const { container } = render(<Hero {...defaultProps} />)
    const heroDiv = container.querySelector('[role="banner"]')
    expect(heroDiv).toHaveStyle({ backgroundImage: 'url(https://example.com/hero.jpg)' })
  })
})
