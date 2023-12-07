class Api::V1::EventsController < ApplicationController
    before_action :set_event, only: [:show, :update, :destroy]
    before_action :authenticate_user!

  # GET /api/v1/events
  def index
    @events = Event.where(user_id: current_user[:id])
    render json: @events
  end

  # GET /api/v1/events/1
  def show
    render json: @event
  end

  # POST /api/v1/events
  def create
    logger.debug("userid#{current_user[:id]}")
    #event_params[:user_id] = current_user[:id]
    logger.debug("params #{event_params}")
    @event = Event.new(title: event_params[:title], start: event_params[:start], end: event_params[:end], user_id: current_user[:id])

    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/events/1
  def update
    if @event.update(event_params)
      render json: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/events/1
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(:title, :start, :end)
  end
end
