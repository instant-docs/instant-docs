```typescript
function MyComponent() {
    const counter = use(0);
    
    // Subscribe to state changes
    counter.subscribe((value) => {
        console.log('Count changed to:', value);
    });
    
    return <div>Count: {counter.get()}</div>;
}
```

```bash
bun create carats
npx create carats
pnpm create carats
yarn create carats
```