'use client'

import { useEffect } from 'react'
import { initMocks } from '@/app/mockServiceWorker'

export function MSWProvider() {
  useEffect(() => {
    initMocks()
  }, [])

  return null
}
