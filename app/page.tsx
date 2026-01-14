import Image from 'next/image'
import React from 'react'
// import Appbar from '../components/Appbar'
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Redirect } from '@/components/Redirect'

function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-2">
      <Navbar />
      <Redirect />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}

export default Home
