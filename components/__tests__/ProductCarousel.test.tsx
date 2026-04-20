import { render, screen, fireEvent } from '@testing-library/react'
import ProductCarousel from '../ProductCarousel'
import { Product } from '@/lib/types/event'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mockStore = {
  items: [],
  totalItems: 0,
  addItem: jest.fn(),
  increment: jest.fn(),
  decrement: jest.fn(),
  removeItem: jest.fn(),
}

jest.mock('@/lib/store/cartStore', () => ({
  useCartStore: () => mockStore,
}))

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 1000, image: 'https://picsum.photos/seed/laptop/400/300' },
  { id: 2, name: 'Phone', price: 500, image: 'https://picsum.photos/seed/phone/400/300' },
  { id: 3, name: 'Tablet', price: 300, image: 'https://picsum.photos/seed/tablet/400/300' },
]

describe('ProductCarousel', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders all products', () => {
    render(<ProductCarousel products={mockProducts} country="us" />)
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Tablet')).toBeInTheDocument()
  })

  it('renders scroll left button', () => {
    render(<ProductCarousel products={mockProducts} country="us" />)
    expect(screen.getByRole('button', { name: /scroll left/i })).toBeInTheDocument()
  })

  it('renders scroll right button', () => {
    render(<ProductCarousel products={mockProducts} country="us" />)
    expect(screen.getByRole('button', { name: /scroll right/i })).toBeInTheDocument()
  })

  it('scroll buttons are present', () => {
    render(<ProductCarousel products={mockProducts} country="us" />)
    expect(screen.getByRole('button', { name: /scroll left/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /scroll right/i })).toBeInTheDocument()
  })

  it('clicking scroll buttons does not throw error', () => {
    const { container } = render(<ProductCarousel products={mockProducts} country="us" />)
    const scrollContainer = container.querySelector('[class*="overflow-x-auto"]')
    
    // Mock scrollBy since jsdom doesn't implement it
    if (scrollContainer) {
      scrollContainer.scrollBy = jest.fn()
    }
    
    const leftButton = screen.getByRole('button', { name: /scroll left/i })
    const rightButton = screen.getByRole('button', { name: /scroll right/i })
    
    expect(() => fireEvent.click(leftButton)).not.toThrow()
    expect(() => fireEvent.click(rightButton)).not.toThrow()
  })

  it('renders ProductCard for each product', () => {
    render(<ProductCarousel products={mockProducts} country="us" />)
    // Each product should have an "Add to cart" button
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    expect(addButtons).toHaveLength(3)
  })
})
