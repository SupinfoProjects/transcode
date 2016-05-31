/**
 * @param quantity
 * @constructor
 */
Credits = function (quantity) {
    this.price = 1;
    this.tax = {
        enabled: true,
        value: 1.2
    };
    this.quantity = quantity;
    this.total = this.price * this.quantity;
};

Credits.prototype.setTaxes     = Offer.prototype.setTaxes;
Credits.prototype.resetTotal   = Offer.prototype.resetTotal;
Credits.prototype.getTotal     = Offer.prototype.getTotal;
Credits.prototype.getCents     = Offer.prototype.getCents;

Credits.prototype.setReductions = function () {
    return this;
};