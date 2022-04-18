Rails.application.routes.draw do
  root 'application#index'

  namespace :v1 do
    post "/auth/login", to: "auth#login"
    get "/exchange/settings", to: "exchange#settings"
    post "/exchange/createtx", to: "exchange#createtx"
    get "/exchange/getscript", to: "exchange#getscript"

    get "/transactions", to: "transactions#index"
    get "/statistics", to: "transactions#statistics"
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
