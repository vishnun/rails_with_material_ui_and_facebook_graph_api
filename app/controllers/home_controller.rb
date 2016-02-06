class HomeController < ApplicationController
  def index
    @facebook_id = ENV['FACEBOOK_KEY']
  end
end