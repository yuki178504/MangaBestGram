import { useContext } from "react";
import { scenePost } from "../api/scenePost";
import { AuthContext } from "../providers/AuthGuard"
import { useQuery, useQueryClient, useMutation } from 'react-query';


export const useScenePost = () => {
  const { token } = useContext(AuthContext);

  //投稿したシーンの一覧を取得
  const useGetScenePost = (comicId) => {
    return useQuery({
      queryKey: [
        'scene_post',
        { comicId: comicId },
      ],
      queryFn: () =>
        scenePost.getScenePost(
          comicId,
          token || ''
        ),
      staleTime: 30000000,
      cacheTime: 30000000,
    });
  };

  //シーンの新規投稿
  const useCreateScenePost = (comicId) => {
    const queryClient = useQueryClient();
    const queryKey = [
      'scene_post',
      { comicId: comicId },
    ];

    return useMutation(
      async (params) => {
        return await scenePost.createScenePost(
          params,
          comicId,
          token || ''
        );
      },
      {
        onSuccess: async (params) => {
          const previousData = await queryClient.getQueryData(queryKey);

          if (previousData) {
            queryClient.setQueryData(queryKey, [
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

  //シーンの詳細
  const useShowScenePost = (scenePostId) => {
    return useQuery({
      queryKey: [
        'scene_post_show',
        { scenePostId: scenePostId },
      ],
      queryFn: () =>
      scenePost.showScenePost(
        scenePostId,
        token || '',
      ),
      enabled: !!scenePostId,
      staleTime: 30000000,
      cacheTime: 0,
    });
  };

  return { useGetScenePost, useCreateScenePost, useShowScenePost };
};
