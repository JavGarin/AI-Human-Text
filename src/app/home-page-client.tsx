'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import Container from '@/components/container'
import TextBox from '@/components/text-box'
import { IAuth } from '@/types/user'

interface HomePageClientProps {
  session: IAuth | null
}

const HomePageClient = ({ session }: HomePageClientProps) => {

  return (
    <main className='w-full pt-32 pb-16 bg-hero'>
      <Container className='flex-1 flex flex-col items-center text-center space-y-8 py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='space-y-4'
        >
          <h1 className='text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none'>
            Humanize Your AI Content
          </h1>
          <p className='mx-auto max-w-4xl text-muted-foreground md:text-xl'>
            Transform AI-generated text into natural, human-like content. Get a 100% human score and improve your SEO.
          </p>
        </motion.div>
        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href='/login'>
              <Button className='h-12 w-full max-w-56 text-lg'>
                Get Started for Free
              </Button>
            </Link>
          </motion.div>
        )}
      </Container>
      <Container className='max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TextBox />
        </motion.div>
      </Container>
    </main>
  )
}

export default HomePageClient