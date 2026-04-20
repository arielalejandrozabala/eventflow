import { render, screen } from '@testing-library/react'
import Navbar from '../shared/Navbar'

describe('Navbar', () => {
  it('renders EventFlow brand', () => {
    render(<Navbar />)
    expect(screen.getByText('EventFlow')).toBeInTheDocument()
  })

  it('brand links to home', () => {
    render(<Navbar />)
    const link = screen.getByText('EventFlow').closest('a')
    expect(link).toHaveAttribute('href', '/')
  })

  it('does not show country when not provided', () => {
    render(<Navbar />)
    expect(screen.queryByText(/your shop/i)).not.toBeInTheDocument()
  })

  it('shows country pill for US', () => {
    render(<Navbar country="us" />)
    expect(screen.getByText(/your shop/i)).toBeInTheDocument()
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
  })

  it('shows country pill for Argentina', () => {
    render(<Navbar country="ar" />)
    expect(screen.getByText(/your shop/i)).toBeInTheDocument()
    expect(screen.getByText('Argentina')).toBeInTheDocument()
    expect(screen.getByText('🇦🇷')).toBeInTheDocument()
  })

  it('shows country pill for Brazil', () => {
    render(<Navbar country="br" />)
    expect(screen.getByText(/your shop/i)).toBeInTheDocument()
    expect(screen.getByText('Brazil')).toBeInTheDocument()
    expect(screen.getByText('🇧🇷')).toBeInTheDocument()
  })
})
