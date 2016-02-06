class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(auth_hash)
    session[:user_id] = user.id
    redirect_to root_url
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

  protected

  def auth_hash
    params['omniauth.auth'] = env['omniauth.auth']
    (params.require('omniauth.auth').permit!).to_hash.with_indifferent_access
  end
end