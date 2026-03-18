Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Orders API
  get    "orders",      to: "orders#index"
  post   "orders",      to: "orders#create"
  get    "orders/:id",  to: "orders#show"
  patch  "orders/:id",  to: "orders#update"
  put    "orders/:id",  to: "orders#update"
end
