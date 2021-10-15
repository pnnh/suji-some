import { StatusNotFound, StatusUnauthorized } from '@/services/models/status'
import React from 'react'
import InternalServerErrorPage from '@/views/exception/server-error'
import NotFoundPage from '@/views/exception/not-found'
import UnauthorizedPage from '@/views/exception/unauthorized'

export function renderExceptionPage (status: number) {
  switch (status) {
    case StatusUnauthorized:
      return <UnauthorizedPage />
    case StatusNotFound:
      return <NotFoundPage />
  }
  return <InternalServerErrorPage/>
}
