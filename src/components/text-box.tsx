'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { LoaderCircle, X } from 'lucide-react'
import { humanizeText } from '@/actions/humanize'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/actions/user'
import { cn } from '@/lib/utils'
import TextGeneratedBox from './text-generated-box'

const textSchema = z.object({
  text: z.string().min(32, 'Text must be at least 32 characters').max(1000, 'Text must be less than 1000 characters')
})

type Model = 'ChatGPT' | 'Claude';

export default function TextBox() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [selectedModel, setSelectedModel] = useState<Model>('ChatGPT');

  const [humanizedText, setHumanizedText] = useState<string | null>(null)

  const humanizedTextRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      text: ''
    }
  })

  const { watch, setValue } = form
  const text = watch('text')

  useEffect(() => {
    setCharCount(text.length)
    const words = text.trim().split(/\s+/)
    setWordCount(text.trim() === '' ? 0 : words.length)
  }, [text])

  useEffect(() => {
    if (humanizedText && humanizedTextRef.current) {
      setTimeout(() => {
        humanizedTextRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [humanizedText]);

  const handleClear = () => {
    setValue('text', '')
  }

  const onSubmit = async ({ text }: z.infer<typeof textSchema>) => {
    setIsLoading(true)

    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      toast({
        title: 'You need to be logged in to humanize text',
        description: 'Please login',
        variant: 'destructive'
      })
      router.push('/login')
    }

    try {
      const result = await humanizeText(text, selectedModel)
      setHumanizedText(result)
    } catch (error) {
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-2xl border-border/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-transparent/80 rounded-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2 rounded-full bg-muted/60 p-1 w-fit'>
              <Button size="sm" type='button' className='rounded-full' variant={selectedModel === 'ChatGPT' ? 'secondary' : 'ghost'} onClick={() => setSelectedModel('ChatGPT')}>ChatGPT</Button>
              <Button size="sm" type='button' className='rounded-full' variant={selectedModel === 'Claude' ? 'secondary' : 'ghost'} onClick={() => setSelectedModel('Claude')}>Claude</Button>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Enter your text here to humanize it..."
                        className="min-h-[250px] pr-10 bg-transparent text-base rounded-2xl"
                        {...field}
                      />
                      {text && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3"
                          onClick={handleClear}
                        >
                          <X className="size-4" />
                          <span className="sr-only">Clear text</span>
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={cn("mt-3 text-sm text-muted-foreground flex justify-end gap-4", charCount > 1000 ? 'text-red-500' : '')}>
              <span>{charCount} / 1000 Characters</span>
              <span>{wordCount} Words</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} className='h-12 w-48 flex items-center gap-2 text-lg' type="submit">
              {isLoading ? <><LoaderCircle className="animate-spin size-6" /><span>Humanizing...</span></> : 'Humanize'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {humanizedText && (
        <TextGeneratedBox humanizedText={humanizedText} humanizedTextRef={humanizedTextRef} />
      )}
    </Card>
  )
}
