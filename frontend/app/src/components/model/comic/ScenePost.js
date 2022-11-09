import { useScenePost } from '../../../hooks/useScenePost';
import ReactLoading from "react-loading";
import { Link, useParams } from 'react-router-dom';
import scenePost from '../../../css/model/comic/scenePost.module.css';
import { AiFillHome } from "react-icons/ai";
import noimage from "../../../image/default.png";

const ScenePost = () => {
  const { comic_id, comic_title } = useParams();
  const { useGetScenePost } = useScenePost();

  const { data: scene_posts, isLoading } = useGetScenePost(comic_id);

  if(isLoading) return <ReactLoading type="spin" color='blue' />
  console.log(scene_posts)

  return (
    <div className={scenePost.wrapper}>
      <div className={scenePost["top-list"]}>
        <div className={scenePost.title}>
          <span className={scenePost.home}>
            <Link to='/' className={scenePost["home-link"]}><span className={scenePost["react-icons"]}><AiFillHome /></span>ホーム</Link>
          </span>
          <span>
            <Link to='/mypage' className={scenePost["home-link"]}><span>/ マイページ</span></Link>
          </span>
          <span className={scenePost["comic-title"]}>
            / { comic_title }のシーン一覧
          </span>
        </div>
      </div>
      <button className={scenePost.link}>
        <Link to={`/comic/${comic_id}/${comic_title}/scene_post_new`} >新規のシーンを投稿する</Link>
      </button>
      <div className={scenePost["main-content"]}>
        {scene_posts?.map((scene_post) => (
          <div key={scene_post.id} className={scenePost.content}>
            <div className={scenePost["innner-content"]}>
              <div className={scenePost["outer-image"]}>
                <img className={scenePost.image} src={ scene_post.scene_image.url } alt='画像' onError={(e) => e.target.src = noimage} />
              </div>
              <div className={scenePost.list}>
                <p className={scenePost["list-title"]}>【{ scene_post.scene_title }】</p>
                <p className={scenePost["list-genre"]}>【{ scene_post.scene_content }】</p>
              </div>
              <div className={scenePost["link-list"]}>
                <Link to={`/scene_post/${comic_title}/${scene_post.id}`} className={scenePost["link-show"]} >シーンを見る</Link>
                <Link to={`/scene_post/${comic_id}/${scene_post.id}/scene_post_edit`} className={scenePost["link-edit"]} >編集する</Link>
              </div>
            </div>
          </div>
          ))}
      </div>
    </div>
  );
};

export default ScenePost;
