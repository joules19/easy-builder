# Build Quality Checklist

This document outlines steps to prevent TypeScript build errors and maintain code quality in the EasyBuilder project.

## Pre-Commit Checklist

### 1. TypeScript Validation
- [ ] Run `npm run build` locally before pushing
- [ ] Fix all TypeScript errors (no `// @ts-ignore` unless absolutely necessary)
- [ ] Ensure proper type imports from `@/types/database`
- [ ] Use proper Supabase types for database operations

### 2. Common Type Issues to Avoid

#### Supabase Query Types
```typescript
// ❌ Wrong - causes 'never' type errors
const { data } = await supabase.from('products').update(obj)

// ✅ Correct - with proper typing
const updateData: Database['public']['Tables']['products']['Update'] = { /* ... */ }
const { data } = await supabase.from('products').update(updateData)
```

#### Error Handling
```typescript
// ❌ Wrong - 'error' is unknown type
catch (error) {
  console.log(error.message)
}

// ✅ Correct - type assertion
catch (error) {
  console.log((error as Error)?.message || 'Unknown error')
}
```

#### Array/Object Property Access
```typescript
// ❌ Wrong - property access on potentially undefined
items.forEach(item => item.id)

// ✅ Correct - type assertion or optional chaining
items?.forEach((item: any) => item.id)
```

### 3. ESLint Rules Management
- Keep `.eslintrc.json` simple and focused
- Disable problematic rules that don't add value:
  - `react/no-unescaped-entities`
  - `react-hooks/exhaustive-deps` (when deps are intentionally omitted)
  - `@next/next/no-img-element` (when using regular img tags)

### 4. Import Validation
- [ ] Verify all imports exist before using
- [ ] Check lucide-react exports (use `GripVertical` not `DragIndicator`)
- [ ] Ensure UI component imports are correct

### 5. Database Type Consistency
- [ ] Import proper types from `@/types/database`
- [ ] Use type assertions for complex Supabase operations
- [ ] Test database operations with proper RLS policies

## Development Workflow

### Before Making Changes
1. Pull latest changes
2. Run `npm install` to ensure dependencies are up to date
3. Run `npm run build` to ensure current state builds

### During Development
1. Use TypeScript strict mode settings
2. Add type annotations for complex operations
3. Test component props and state types
4. Validate Supabase query responses

### Before Committing
1. **MANDATORY**: Run `npm run build` 
2. Fix any TypeScript errors
3. Test changed functionality
4. Update this checklist if new patterns emerge

## Automated Checks (Recommended)

### Pre-commit Hook Setup
Add to `.husky/pre-commit` or similar:
```bash
#!/bin/sh
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix TypeScript errors before committing."
  exit 1
fi
echo "✅ Build successful"
```

### GitHub Actions (CI/CD)
Ensure build step in deployment pipeline:
```yaml
- name: Build application
  run: npm run build
```

## Common Fixes Reference

### 1. Supabase Update/Insert Errors
```typescript
// Add type assertion
// @ts-ignore - Supabase TypeScript issue with update/insert method
.update(data)
```

### 2. Component State Updates
```typescript
// Add explicit type for state setters
setState((prev: any) => ({ ...prev, newValue }))
```

### 3. API Response Handling
```typescript
// Type assertion for API responses
const response = await fetch('/api/endpoint')
const data = (await response.json()) as ExpectedType
```

### 4. Lucide React Icons
Common correct imports:
- `GripVertical` (not `DragIndicator`)
- `Image as ImageIcon` (to avoid conflicts)
- `X` (for close buttons)

## Emergency Fixes

If build is broken and needs immediate fix:

1. **Quick Type Assertion**: Add `as any` to problematic expressions
2. **Skip Type Check**: Use `// @ts-ignore` with comment explaining why
3. **Disable ESLint Rule**: Add `// eslint-disable-next-line rule-name`

Remember: These are temporary solutions. Always come back to properly type things.

## Monitoring

- Set up build notifications for production deployments
- Monitor for new TypeScript errors in CI/CD pipeline
- Regular dependency updates with build validation

## Notes

- This checklist was created after resolving major TypeScript build issues
- Update this document when new patterns or solutions are discovered
- Share knowledge of type issues and solutions with the team

---

**Last Updated**: October 30, 2024  
**Next Review**: When major dependencies are updated or new developers join