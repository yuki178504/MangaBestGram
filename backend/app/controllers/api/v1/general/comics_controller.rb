class Api::V1::General::ComicsController < SecuredController

  def index
    comics = Comic.all
    render_json = General::ComicSerializer.new(comics).serializable_hash.to_json
    render json: render_json
  end
end
