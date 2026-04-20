import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'
import { Product } from '@/lib/types/event'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mockAddItem = jest.fn()
const mockIncrement = jest.fn()
const mockDecrement = jest.fn()
const mockRemoveItem = jest.fn()

jest.mock('@/lib/store/cartStore', () => ({
  useCartStore: () => ({
    items: [],
    totalItems: 0,
    addItem: mockAddItem,
    increment: mockIncrement,
    decrement: mockDecrement,
    removeItem: mockRemoveItem,
  }),
}))

const mockProduct: Product = {
  id: 1,
  name: 'Laptop Acer Core i5',
  price: 1000,
  image: 'https://picsum.photos/seed/laptop/400/300',
}

describe('ProductCard', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} country="us" />)
    expect(screen.getByText('Laptop Acer Core i5')).toBeInTheDocument()
  })

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} country="us" />)
    expect(screen.getByAltText('Laptop Acer Core i5')).toBeInTheDocument()
  })

  it('formats price for US', () => {
    render(<ProductCard product={mockProduct} country="us" />)
    expect(screen.getByText('$1,000.00')).toBeInTheDocument()
  })

  it('formats price for Argentina', () => {
    render(<ProductCard product={mockProduct} country="ar" />)
    expect(screen.getByText(/ARS/)).toBeInTheDocument()
  })

  it('formats price for Brazil', () => {
    render(<ProductCard product={mockProduct} country="br" />)
    expect(screen.getByText(/R\$/)).toBeInTheDocument()
  })

  it('calls addItem when Add to cart is clicked', () => {
    render(<ProductCard product={mockProduct} country="us" />)
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 'us')
  })
})
