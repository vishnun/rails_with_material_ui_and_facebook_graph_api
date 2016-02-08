class FacebooksController < ApplicationController

  before_action :authenticate_user

  def index
    @albums = current_user.facebook.albums({fields: 'link, name, id'})
  end

  def album
    @photos = FbGraph2::Album.new(album_params[:id]).photos({access_token: current_user.oauth_token, fields: 'id, name, source'})
  end

  def album_params
    params.permit(:id)
  end

  private
  def authenticate_user
    unless current_user
      redirect_to facebook_login_path
    end
  end

end
