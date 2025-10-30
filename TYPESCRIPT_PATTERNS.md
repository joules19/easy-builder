# TypeScript Patterns & Best Practices

Common TypeScript patterns used in this project to avoid build errors.

## Database Operations

### Supabase Query Types

```typescript
// Import database types
import { Database } from '@/types/database'

// For updates - use explicit typing
const updateData: Database['public']['Tables']['products']['Update'] = {
  status: 'active',
  updated_at: new Date().toISOString()
}

const { data, error } = await supabase
  .from('products')
  .update(updateData)
  .eq('id', productId)

// For inserts
const insertData: Database['public']['Tables']['products']['Insert'] = {
  vendor_id: vendorId,
  name: productName,
  // ... other fields
}

// When types conflict - use @ts-ignore with comment
const { data, error } = await supabase
  .from('products')
  // @ts-ignore - Supabase TypeScript issue with update method
  .update({ status: selectedAction })
  .eq('id', productId)
```

### Query Result Handling

```typescript
// Type assertion for query results
const { data } = await supabase.from('products').select('*')
const productId = (data as any)?.id

// For arrays with known structure
const products = (data as Product[]) || []

// For complex nested data
const productWithImages = (data as any)?.[0]?.product_images
```

## Error Handling

### Catch Block Types

```typescript
try {
  // ... operation
} catch (error) {
  // Type assertion for error handling
  console.error('Error:', error)
  toast.error(`Failed: ${(error as Error)?.message || 'Unknown error'}`)
}

// Alternative with unknown type
catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown error:', error)
  }
}
```

## Component Props & State

### State Setters with Complex Types

```typescript
// Explicit typing for state setters
const [items, setItems] = useState<Item[]>([])

// For callback functions with complex state
setItems((prev: Item[]) => {
  return prev.map(item => ({ ...item, updated: true }))
})

// For object state updates
const [formData, setFormData] = useState<Record<string, any>>({})

setFormData((prev: any) => ({
  ...prev,
  [field]: value
}))
```

### Component Props

```typescript
interface ComponentProps {
  // Required props
  id: string
  title: string
  
  // Optional props
  description?: string
  
  // Function props
  onSave: (data: any) => void
  
  // Complex object props
  config?: Record<string, any>
}

// With default props
const MyComponent: React.FC<ComponentProps> = ({
  id,
  title,
  description = '',
  onSave,
  config = {}
}) => {
  // Component implementation
}
```

## Array & Object Operations

### Array Methods with Type Safety

```typescript
// Map with type assertion
const processedItems = items?.map((item: any) => ({
  id: item.id,
  name: item.name
})) || []

// Filter with type guards
const activeItems = items?.filter((item): item is ActiveItem => 
  item.status === 'active'
) || []

// Reduce with explicit accumulator type
const grouped = items?.reduce((acc: Record<string, Item[]>, item: any) => {
  const key = item.category
  acc[key] = acc[key] || []
  acc[key].push(item)
  return acc
}, {}) || {}
```

### Object Property Access

```typescript
// Safe property access
const value = (obj as any)?.[dynamicKey]

// With default values
const title = (product as any)?.title || 'Untitled'

// For nested properties
const imageUrl = (product as any)?.images?.[0]?.url

// Type assertion for known structures
const typedObject = obj as { id: string; name: string }
```

## API & External Data

### Fetch Response Handling

```typescript
// Type assertion for API responses
const response = await fetch('/api/endpoint')
const data = (await response.json()) as ExpectedType

// With error handling
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const data = (await response.json()) as ExpectedType
  return data
} catch (error) {
  console.error('API Error:', (error as Error).message)
  throw error
}
```

### FormData Handling

```typescript
// FormData with type safety
const formData = new FormData()
formData.append('file', file)
formData.append('metadata', JSON.stringify(metadata as any))

// Reading FormData
const file = formData.get('file') as File
const metadata = JSON.parse(formData.get('metadata') as string)
```

## UI Component Patterns

### Event Handlers

```typescript
// Input change handlers
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData((prev: any) => ({ ...prev, [name]: value }))
}

// Select change handlers (for custom components)
const handleSelectChange = (value: string) => {
  setSelectedValue(value)
}

// Form submit handlers
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  // ... form handling
}
```

### Ref Usage

```typescript
// useRef with type
const inputRef = useRef<HTMLInputElement>(null)

// Accessing ref value
const value = inputRef.current?.value

// For component refs
const modalRef = useRef<ModalHandle>(null)
```

## Utility Functions

### Type Guards

```typescript
// Type guard functions
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function hasProperty<T>(obj: T, prop: string): obj is T & Record<string, any> {
  return obj !== null && typeof obj === 'object' && prop in obj
}

// Usage
if (isString(userInput)) {
  // userInput is now typed as string
  console.log(userInput.toLowerCase())
}
```

### Generic Functions

```typescript
// Generic utility functions
function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current?.[key] === undefined) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current as T
}

// Usage
const userName = safeGet(user, 'profile.name', 'Anonymous')
```

## When to Use @ts-ignore

Use `@ts-ignore` sparingly and always with a comment:

```typescript
// @ts-ignore - Supabase TypeScript issue with nested relations
const productWithCategories = await supabase
  .from('products')
  .select('*, categories(*)')

// @ts-ignore - Third-party library type definition issue
const chart = new ChartLibrary(config)

// @ts-ignore - Complex type intersection that TypeScript can't infer
const mergedData = { ...complexObject1, ...complexObject2 }
```

## Testing Patterns

```typescript
// Mock functions with proper typing
const mockFunction = jest.fn() as jest.MockedFunction<typeof originalFunction>

// Type assertion in tests
const component = render(<MyComponent />)
const button = component.getByRole('button') as HTMLButtonElement

// Mock API responses
const mockResponse = {
  data: [{ id: '1', name: 'Test' }]
} as ApiResponse<Item[]>
```

---

These patterns help maintain type safety while avoiding build errors. When in doubt, prefer explicit typing over `any`, but use `any` when necessary to keep the build working.