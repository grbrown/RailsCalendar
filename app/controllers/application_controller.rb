class ApplicationController < ActionController::Base
    helper_method :current_user

    private
    def current_user
        logger.debug("#{session[:user_id]}")
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    before_action :authenticate_user!

    private
  
    def authenticate_user!
      unless current_user
        flash[:alert] = 'You must be logged in to access this page.'
        redirect_to login_path, alert: 'You must be logged in to access this page.'
      end
    end
end
