

## Assessment: Both Features Already Exist

After reviewing the codebase, both requested features are already fully implemented:

### 1. Add to Bag — Already wired up
`src/components/product/ProductInfo.tsx` already:
- Imports and uses `useCart` hook (`addToCart`)
- Checks if user is authenticated before adding
- Redirects to `/auth` with a toast if not signed in
- Shows loading state ("Adding...") during the operation
- Resets quantity after successful add

### 2. Account Icon in Header — Already present
`src/components/header/Navigation.tsx` already:
- Shows a `User` icon in the header toolbar
- Opens a dropdown on click
- For guests: shows "Sign In" and "Create Account" links to `/auth`
- For authenticated users: shows email and a "Sign Out" button

### Recommendation

No code changes are needed. These features were implemented in a previous iteration. You can test them by:
1. Visiting a product page and clicking "Add to Bag" (you'll be prompted to sign in)
2. Clicking the user icon in the top-right of the header to see auth options

If something isn't working as expected, let me know what specific issue you're seeing and I can investigate further.

