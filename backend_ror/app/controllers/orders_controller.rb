class OrdersController < ApplicationController
  before_action :set_order, only: %i[show update]

  # GET /orders
  # GET /orders?status=Pending
  def index
    @orders = if params[:status].present?
                Order.where(status: params[:status]).order(created_at: :desc)
              else
                Order.all.order(created_at: :desc)
              end

    render json: { success: true, data: @orders }
  end

  # GET /orders/:id
  def show
    render json: { success: true, data: @order }
  end

  # POST /orders
  def create
    @order = Order.new(order_params)

    if @order.save
      render json: { success: true, data: @order }, status: :created
    else
      render json: { success: false, errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /orders/:id
  def update
    if @order.update(order_params)
      render json: { success: true, data: @order }
    else
      render json: { success: false, errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, error: "Order not found" }, status: :not_found
  end

  def order_params
    params.permit(:customer, :status, :total, :items)
  end
end
