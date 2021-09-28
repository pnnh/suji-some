import { SFEditor } from '@/components/editor/nodes/node'
import { articlePost, articlePut } from '@/services/article'
import { ApiUrl } from '@/utils/config'

export function onCreate (editorValue: SFEditor, title: string, description: string, keywords: string) {
  const postData = {
    title: title,
    body: JSON.stringify(editorValue),
    description,
    keywords
  }
  console.debug('postData', postData)
  articlePost(postData).then((out) => {
    console.debug('articlePost', out)
    if (out) {
      window.location.href = ApiUrl.article.read + out.pk
    }
  })
}

export function onEdit (pk: string, editorValue: SFEditor, title: string, description: string, keywords: string) {
  const postData = {
    title: title,
    body: JSON.stringify(editorValue),
    description,
    keywords
  }
  console.debug('postData', postData)
  articlePut(pk, postData).then((out) => {
    console.debug('articlePut', out)
    if (out) {
      window.location.href = ApiUrl.article.read + out.pk
    }
  })
}
