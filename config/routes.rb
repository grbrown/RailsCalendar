Rails.application.routes.draw do
  get 'calendar', to:'calendar#index'
  resources :people
  resources :posts
  resources :sessions
  resources :users, only: [:new, :create]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'users/new'
  get 'users/create'
  get "up" => "rails/health#show", as: :rails_health_check
  root 'welcome#index'
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  get 'logout', to: 'sessions#destroy'
  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      resources :events
    end
  end
end
