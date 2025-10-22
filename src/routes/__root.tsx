import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'sonner'

import Header from '../components/Header'
import Footer from '../components/Footer'

import ClerkProvider from '../integrations/clerk/provider'
import { Web3Provider } from '../providers/Web3Provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Aureve - Decentralized NFT Marketplace',
      },
      {
        name: 'description',
        content: 'Buy, sell, and trade digital assets on the blockchain. Discover unique NFTs from creators worldwide.',
      },
      {
        name: 'theme-color',
        content: '#a855f7',
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'Aureve - Decentralized NFT Marketplace',
      },
      {
        property: 'og:description',
        content: 'Buy, sell, and trade digital assets on the blockchain. Discover unique NFTs from creators worldwide.',
      },
      {
        property: 'og:site_name',
        content: 'Aureve',
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Aureve - Decentralized NFT Marketplace',
      },
      {
        name: 'twitter:description',
        content: 'Buy, sell, and trade digital assets on the blockchain. Discover unique NFTs from creators worldwide.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.svg',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <Web3Provider>
          <ClerkProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster 
              // position="top-right"
              richColors
              closeButton
              theme="dark"
            />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </ClerkProvider>
        </Web3Provider>
        <Scripts />
      </body>
    </html>
  )
}
