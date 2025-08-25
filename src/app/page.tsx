import { auth } from '@/auth'
import Container from '@/components/container'
import TextBox from '@/components/text-box'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Home = async () => {

  const session = await auth();

  return (
    <main className='w-full pt-32 pb-12'>
      <Container className='flex-1 flex flex-col items-center text-center space-y-8 py-20'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none'>AI Human Text</h1>
          <p className='mx-auto max-w-3xl text-muted-foreground md:text-xl dark:text-gray-400'>
            Convert AI-generated text into natural, human-like content. Achieve a 100% human score and improve your content.
          </p>
        </div>
        {!session && (
          <Link href='/login'>
            <Button size={'lg'} className='h-12 w-full max-w-56 text-lg'>
              Get Started for Free
            </Button>
          </Link>
        )}
      </Container>
      <Container className='max-w-5xl'>
        <TextBox />
      </Container>
    </main>
  )
}

export default Home