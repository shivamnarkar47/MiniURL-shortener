import { getRecentUrls, shortenUrl, type ShortenResponse } from "@/api/urlShortner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useUrlShortener = () => {
  const queryClient = useQueryClient()

  const shortenMutation = useMutation({
    mutationFn:shortenUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['recent-urls']})
    }
  })

  const recentUrlsQuery = useQuery<ShortenResponse[]>({
    queryKey:['recent-urls'],
    queryFn: getRecentUrls
  })


  return {
    shortenMutation,
    recentUrlsQuery
  }
}
