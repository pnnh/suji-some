import {StatusNotFound, StatusUnauthorized} from '@/services/models/status'
import React from 'react'
import InternalServerErrorPage from '@/pages/exception/server-error'
import NotFoundPage from '@/pages/exception/not-found'
import UnauthorizedPage from '@/pages/exception/unauthorized'

export function renderExceptionPage (status: number) {
  switch (status) {
    case StatusUnauthorized:
      return <UnauthorizedPage/>
    case StatusNotFound:
      return <NotFoundPage/>
  }
  return <InternalServerErrorPage/>
}
