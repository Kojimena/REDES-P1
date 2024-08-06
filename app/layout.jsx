"use client"
import "@/styles/globals.css"
import { XmppProvider } from '@/contexts/xmppContext'



const RootLayout = ({children}) => {
  return (
    <html lang="es">
        <head>
        </head>
        <body>
            <main className='app'>
              <XmppProvider>
                  {children}
              </XmppProvider>
            </main>
        </body>
    </html>
  )
}

export default RootLayout