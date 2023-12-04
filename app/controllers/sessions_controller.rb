class SessionsController < ApplicationController
    def new
    end
  
    def create
      user = User.find_by(email: params[:session][:email].downcase)
      if user && user.authenticate(params[:session][:password])
        # Log in the user and redirect to their profile or dashboard
        # For simplicity, let's just redirect to the root path for now
        redirect_to root_path
      else
        flash.now[:danger] = 'Invalid email/password combination'
        render 'new'
      end
    end
  
    def destroy
      # Log out the user (implement this based on your authentication method)
      # For simplicity, let's just redirect to the root path for now
      redirect_to root_path
    end
  end
  