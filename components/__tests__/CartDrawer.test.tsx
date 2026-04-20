import { render, screen, fireEvent, act } from '@testing-library/react'
import CartDrawer from '../CartDrawer'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mockItems = [
  {
    product: { id: 1, name: 'Laptop', price: 1000, image: 'https://picsum.photos/seed/laptop/400/300' },
    quantity: 2,
    country: 'us',
  },
]

const mockStore = {
  items: mockItems,
  totalItems: 2,
  increment: jest.fn(),
  decrement: jest.fn(),
  removeItem: jest.fn(),
}

jest.mock('@/lib/store/cartStore', () => ({
  useCartStore: () => mockStore,
}))

describe('CartDrawer', () => {
  it('renders the FAB badge when cart has items', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument()
  })

  it('shows item count on the badge', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    const badge = screen.getByRole('button', { name: /open cart/i })
    expect(badge).toHaveTextContent('2 items')
  })

  it('shows total price on the badge', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    const badge = screen.getByRole('button', { name: /open cart/i })
    expect(badge).toHaveTextContent('$2,000.00')
  })

  it('opens the drawer when badge is clicked', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }))
    expect(screen.getByRole('heading', { name: /cart/i })).toBeInTheDocument()
  })

  it('shows product name in drawer', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }))
    expect(screen.getByText('Laptop')).toBeInTheDocument()
  })

  it('closes drawer when close button is clicked', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }))
    fireEvent.click(screen.getByRole('button', { name: /close cart/i }))
    expect(screen.queryByRole('heading', { name: /^cart$/i })).not.toBeInTheDocument()
  })

  it('hides badge when drawer is open', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }))
    expect(screen.queryByRole('button', { name: /open cart/i })).not.toBeInTheDocument()
  })

  it('shows badge again when drawer is closed', async () => {
    await act(async () => {
      render(<CartDrawer />)
    })
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }))
    fireEvent.click(screen.getByRole('button', { name: /close cart/i }))
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument()
  })
})
