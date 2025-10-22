# 🎨 Aureve - Decentralized NFT Marketplace

<div align="center">

![Aureve Logo](https://via.placeholder.com/150?text=Aureve)

**Create, Trade & Own Digital Assets Across Multiple Blockchains**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-orange.svg)](https://soliditylang.org/)
[![LayerZero](https://img.shields.io/badge/LayerZero-V2-purple.svg)](https://layerzero.network/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

Aureve is a **next-generation NFT marketplace** that enables creators to tokenize and trade digital assets (images, videos, audio, documents) with true ownership and cross-chain capabilities.

### Why Aureve?

- 🔓 **Zero Upfront Costs**: Lazy minting - only pay gas when NFT is purchased
- 🌐 **Cross-Chain Swaps**: Bridge assets across 34+ networks via LayerZero
- 💰 **Creator-First**: 1% platform fee, rest goes to creator + royalties
- 🔒 **Fully Decentralized**: Wallet-only auth, IPFS storage, on-chain ownership
- ⚡ **Multi-Chain**: Ethereum, Arbitrum, Monad (more coming soon)
- 🎁 **Unlimited Editions**: ERC-1155 for affordable, accessible NFTs

---

## ✨ Features

### 🎨 NFT Marketplace
- **Browse & Discover**: Explore curated collections of digital assets
- **Search & Filter**: Find exactly what you're looking for
- **Creator Profiles**: Follow your favorite artists
- **Gated Content**: Full-resolution access only for NFT owners

### 🚀 Upload & Mint
- **Drag & Drop Upload**: Simple, intuitive interface
- **Auto-Processing**: Automatic preview generation for all media types
- **IPFS Storage**: Decentralized, permanent storage via Pinata
- **Lazy Minting**: Create NFTs without upfront gas costs
- **Royalty Settings**: Set custom royalty percentages (ERC-2981)

### 🔄 Cross-Chain Swap
- **34+ Networks Supported**: Powered by LayerZero V2
- **Zero Platform Fees**: Only pay network gas costs
- **Fast Bridging**: Average 5-10 minute completion
- **Secure**: Decentralized, non-custodial transfers
- **Active Networks**: Ethereum Sepolia, Arbitrum Sepolia, Monad Testnet
- **Coming Soon**: Ethereum, Arbitrum, Base, Optimism, Polygon, and more

### 💎 Smart Contracts
- **ERC-1155**: Efficient unlimited edition NFTs
- **ERC-2981**: Automatic royalty enforcement
- **Audited Code**: Professional security standards
- **Multi-Chain**: Deploy to any EVM-compatible chain

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.19+ or v22.12+
- **Bun**: Latest version ([install](https://bun.sh))
- **MetaMask**: Browser wallet extension
- **Supabase Account**: For database
- **Pinata Account**: For IPFS storage

### Installation

```bash
# Clone the repository
git clone https://github.com/afistapratama12/aureve-nft.git
cd aureve-nft

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

# Setup database (run SQL in Supabase dashboard)
# See: supabase/migrations/001_initial_schema.sql

# Deploy smart contract
cd contract
bun install
bun run deploy:arbitrum  # Or deploy:ethereum, deploy:monad
cd ..

# Start development server
bun dev
```

Visit `http://localhost:3000` 🎉

---

## 📁 Project Structure

```
aureve/
├── contract/                 # Smart contracts
│   ├── contracts/
│   │   └── DigitalAssetNFT.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── test/
│       └── DigitalAssetNFT.test.js
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── WalletConnect.tsx
│   │   └── NetworkSwitcher.tsx
│   ├── routes/              # Pages
│   │   ├── index.tsx        # Homepage
│   │   ├── marketplace.tsx  # Browse NFTs
│   │   ├── swap.tsx         # Cross-chain swap
│   │   ├── upload.tsx       # Create NFT
│   │   └── profile.tsx      # User profile
│   ├── services/
│   │   ├── api/             # Server functions
│   │   ├── blockchain/      # Web3 integration
│   │   ├── storage/         # IPFS/Pinata
│   │   └── assetProcessing/ # Media processing
│   ├── hooks/               # React hooks
│   └── stores/              # State management
├── supabase/
│   └── migrations/          # Database schema
├── LAYERZERO_NETWORKS.md    # All supported networks
├── SWAP_GUIDE.md            # Swap feature guide
└── SETUP.md                 # Detailed setup guide
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Blockchain
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_CONTRACT_ADDRESS_ARBITRUM=0x...
VITE_CONTRACT_ADDRESS_ETHEREUM=0x...
VITE_CONTRACT_ADDRESS_MONAD=0x...

# Storage
VITE_PINATA_API_KEY=your_pinata_jwt
VITE_PINATA_GATEWAY_DOMAIN=your_gateway.mypinata.cloud

# Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Server (for EIP-712 signing)
SERVER_PRIVATE_KEY=0x...
```

See [`.env.example`](./.env.example) for complete list.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/start) (React + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Web3
- **Wallet**: [wagmi](https://wagmi.sh/) + [Web3Modal](https://web3modal.com/)
- **Library**: [ethers.js v6](https://docs.ethers.org/v6/) + [viem](https://viem.sh/)
- **Cross-Chain**: [LayerZero V2](https://docs.layerzero.network/)

### Backend
- **API**: TanStack Start server functions
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage**: [Pinata](https://pinata.cloud/) (IPFS)
- **Processing**: [Sharp](https://sharp.pixelplumbing.com/) (images), FFmpeg (video/audio)

### Blockchain
- **Development**: [Hardhat](https://hardhat.org/)
- **Language**: [Solidity 0.8.28](https://soliditylang.org/)
- **Standards**: ERC-1155, ERC-2981
- **Networks**: Ethereum Sepolia, Arbitrum Sepolia, Monad Testnet

---

## 📚 Documentation

- **[Setup Guide](./SETUP.md)**: Complete setup and deployment instructions
- **[Swap Guide](./SWAP_GUIDE.md)**: How to use cross-chain swap feature
- **[LayerZero Networks](./LAYERZERO_NETWORKS.md)**: All 34+ supported networks
- **[Project Summary](./PROJECT_SUMMARY.md)**: Technical overview
- **[Pinata Setup](./PINATA_SETUP.md)**: IPFS storage configuration
- **[Contract Deployment](./contract/DEPLOYMENT.md)**: Smart contract deployment guide

---

## 🧪 Testing

### Smart Contracts

```bash
cd contract

# Compile contracts
bun run compile

# Run tests
bun run test

# Test coverage
bun run coverage

# Local deployment (for testing)
bun run deploy:local
```

### Frontend

```bash
# Run all tests
bun test

# Run with UI
bun test --ui

# Watch mode
bun test --watch
```

---

## 🚀 Deployment

### Smart Contracts

```bash
cd contract

# Deploy to Arbitrum Sepolia (testnet)
bun run deploy:arbitrum

# Deploy to Ethereum Sepolia (testnet)
bun run deploy:ethereum

# Deploy to Monad Testnet
bun run deploy:monad

# Verify contract on Etherscan
bun run verify:arbitrum
```

### Frontend

```bash
# Build for production
bun run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Completed)
- ✅ Core NFT marketplace
- ✅ Lazy minting with ERC-1155
- ✅ IPFS storage via Pinata
- ✅ Multi-chain support (3 testnets)
- ✅ Swap UI with 34 networks
- ✅ Homepage with NFT carousel
- ✅ User profiles

### 🔄 Phase 2: LayerZero Integration (Q1 2026)
- ⏳ LayerZero V2 SDK integration
- ⏳ Cross-chain swap contracts
- ⏳ Real-time fee estimation
- ⏳ Transaction tracking
- ⏳ Mainnet deployment (5 chains)

### 📅 Phase 3: Feature Expansion (Q2 2026)
- 📅 NFT bridging across chains
- 📅 Advanced marketplace filters
- 📅 Auction functionality
- 📅 Bulk upload
- 📅 Creator analytics
- 📅 20+ mainnet networks

### 📅 Phase 4: Enterprise (Q3 2026)
- 📅 API for developers
- 📅 White-label solution
- 📅 Advanced royalty splits
- 📅 Institutional features
- 📅 Mobile apps (iOS/Android)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Testing**: Minimum 80% coverage
- **Commits**: Conventional commits format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[LayerZero](https://layerzero.network/)**: Omnichain infrastructure
- **[OpenZeppelin](https://openzeppelin.com/)**: Secure smart contract libraries
- **[shadcn/ui](https://ui.shadcn.com/)**: Beautiful UI components
- **[TanStack](https://tanstack.com/)**: Powerful React tools
- **[Pinata](https://pinata.cloud/)**: IPFS storage
- **[Supabase](https://supabase.com/)**: Backend infrastructure

---

## 📞 Support

- **Documentation**: [See docs folder](./docs)
- **Discord**: [Join our community](#)
- **Twitter**: [@AureveNFT](#)
- **Email**: support@aureve.io

---

## 🔗 Links

- **Website**: [aureve.io](#)
- **GitHub**: [github.com/afistapratama12/aureve-nft](https://github.com/afistapratama12/aureve-nft)
- **Demo**: [demo.aureve.io](#)
- **Docs**: [docs.aureve.io](#)

---

<div align="center">

**Built with ❤️ by the Aureve Team**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/afistapratama12/aureve-nft/issues) • [Request Feature](https://github.com/afistapratama12/aureve-nft/issues)

</div>

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
