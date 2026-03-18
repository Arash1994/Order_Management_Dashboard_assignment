class Order < ApplicationRecord
  validates :customer, presence: true
  validates :total, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: %w[Pending Completed], message: "must be Pending or Completed" }

  attribute :items, :json, default: []

  before_validation :set_defaults

  private

  def set_defaults
    self.status ||= "Pending"
  end
end
