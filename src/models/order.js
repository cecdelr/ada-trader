import Backbone from 'backbone';
import Quote from 'models/quote';

const Order = Backbone.Model.extend({
  defaults:{
    symbol: 'UNDEF',
    targetPrice: 0.00
    //buy: true or false
    //quote: assigned at render in OrderListView
  },

  validate(attributes){
    const errors = {};

    if (attributes.targetPrice <= 0.00) {
      errors['targetPrice'] = ['Invalid target price.'];
    }

    if (attributes.symbol === 'UNDEF' || attributes.symbol === undefined){
      errors['symbol'] = ['Symbol is undefined.'];
    }

    if (attributes.quote === undefined){
      errors['quote'] = ['Order has to have an associated quote.'];
    }

    if (attributes.buy === undefined){
      errors['buy'] = ["Order has to know whether it's buying/selling a quote."]
    }

    // attribute type validations

    if(typeof attributes.targetPrice !== 'number') {
      errors['targetPrice'] = ["order's targetPrice is not of type Number"];
    }

    if(typeof attributes.symbol !== 'string') {
      errors['symbol'] = ["order's symbol is not of type String"];
    }

    if(typeof attributes.buy !== 'boolean') {
      errors['buy'] = ["order's buy is not of type Boolean"];
    }

    if(!attributes.quote instanceof Quote) {
      errors['quote'] = ["order's quote is not an instance of Quote"];
    }

    // "check current price of quote" validations
    if(attributes.quote !== undefined &&
       attributes.buy === true &&
       attributes.targetPrice >= attributes.quote.get('price')) {
      errors['targetPrice'] = ['Price must be lower than market price'];
    }

    if(attributes.quote !== undefined &&
       attributes.buy === false &&
       attributes.targetPrice <= attributes.quote.get('price')){
      errors['targetPrice'] = ['Price must be higher than market price'];
    }

    if ( Object.keys(errors).length > 0 ) {
      return errors;
    } else {
      return false;
    }

  },

  quotePriceCheck(){
    const quote = this.get('quote');
    if(this.get('buy') === true && (this.get('targetPrice') > quote.get('price'))){
      this.destroy();
      quote.buy();
    } else if(this.get('buy') === false && (this.get('targetPrice') < quote.get('price'))){
      this.destroy();
      quote.sell();
    }
  }


});

export default Order;
