import { useContext } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { comments } from "../api/comments";
import { AuthContext } from "../providers/AuthGuard"

export const useComment = () => {
  const { token } = useContext(AuthContext);

  const useGetComment = (scenePostId) => {
    return useQuery({
      queryKey: [
        'comment',
        { scenePostId: scenePostId },
      ],
      queryFn: () =>
      comments.getComments(
        scenePostId
      ),
      staleTime: 30000000,
      cacheTime: 0,
    });
  };

  const useCreateComment = (scenePostId) => {
    const queryClient = useQueryClient();
    const queryKey = [
      'comment',
      { scenePostId: scenePostId },
    ];

    return useMutation(
      async (params) => {
        return await comments.createComments(
          params,
          scenePostId,
          token || ''
        );
      },
      {
        onSuccess: async (params) => {
          const previousData = await queryClient.getQueryData(queryKey);

          if (previousData) {
            queryClient.setQueriesData(queryKey, [
              ...previousData,
              params.data,
            ])
          }
        },
        onError: (err, _, context) => {
          queryClient.setQueryData(queryKey, context);

          console.warn(err);
        },
        onSettled: () => {
          queryClient.invalidateQueries(queryKey);
        },
      }
    );
  };

  const useDeleteComments = (scenePostId, commentId) => {
    const queryClient = useQueryClient();
    const queryKey = [
      'comment',
      { scenePostId: scenePostId },
    ];

    return useMutation(
      async () => {
        return await comments.deleteComments(
          commentId,
          token || ''
        );
      },
      {
        onError: (err, _, context) => {
          queryClient.setQueryData(queryKey, context);
          console.warn(err);
        },
        onSettled: () => {
          queryClient.invalidateQueries(queryKey);
        },
      }
    );
  };

  return { useGetComment, useCreateComment, useDeleteComments };
};
