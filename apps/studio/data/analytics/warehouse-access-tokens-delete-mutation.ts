import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { del, handleError } from 'data/fetchers'
import { toast } from 'sonner'
import type { ResponseError } from 'types'
import { analyticsKeys } from './keys'

export type DeleteAccessTokenArgs = {
  projectRef: string
  token: string
}
/**
 * This will be deprecated or rewritten in favor of the new project API keys
 */
export async function deleteWarehouseAccessToken({ projectRef, token }: DeleteAccessTokenArgs) {
  const { data, error } = await del(
    '/platform/projects/{ref}/analytics/warehouse/access-tokens/{token}',
    {
      params: { path: { ref: projectRef, token } } as any,
    }
  )

  if (error) handleError(error)
  return data
}

type DeleteAccessTokenData = Awaited<ReturnType<typeof deleteWarehouseAccessToken>>

export const useDeleteWarehouseAccessToken = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DeleteAccessTokenData, ResponseError, DeleteAccessTokenArgs>,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<DeleteAccessTokenData, ResponseError, DeleteAccessTokenArgs>(
    (vars) => deleteWarehouseAccessToken(vars),
    {
      async onSuccess(data, variables, context) {
        const { projectRef } = variables

        await queryClient.invalidateQueries(analyticsKeys.warehouseAccessTokens(projectRef))

        await onSuccess?.(data, variables, context)
      },
      async onError(data, variables, context) {
        if (onError === undefined) {
          toast.error(`Failed to delete access token: ${data.message}`)
        } else {
          onError(data, variables, context)
        }
      },
      ...options,
    }
  )
}
