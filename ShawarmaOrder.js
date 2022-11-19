const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING:   Symbol("welcoming"),
  Items: Symbol("Items"),
  SIZE:   Symbol("size"),
  TOPPINGS:   Symbol("toppings"),
  DRINKS:  Symbol("drinks"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sItems ="";
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.Icost = 0;
        this.scost = 0;
        this.Tcost = 0;
        this.Dcost=0;
        this.Total=0;
        this.subTotal=0;
        this.Tax=0;
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
          case OrderState.WELCOMING:
            this.stateCur = OrderState.Items;
            aReturn.push("Welcome to Pawan Tea Point");
            aReturn.push("select your item?");
            aReturn.push('grilledcheesemelt ');
            aReturn.push('Muttonwrap ');
            aReturn.push('Vegwrap ');
            break;
            case OrderState.Items:
                this.sItems=sInput;
                if(sInput.toLowerCase()!="grilledcheesemelt" && sInput.toLowerCase()!="muttonwrap"&& sInput.toLowerCase()!="vegwrap" ){
                    this.stateCur=OrderState.Items;
                    aReturn.push("Please Enter a Valid Option")
                }
                else if(sInput.toLowerCase()=="grilledcheesemelt"){
                    this.Icost=8;
                    this.stateCur = OrderState.SIZE
                    aReturn.push("select your size");
                    aReturn.push("Large");
                    aReturn.push("regular");
                }
                else if(sInput.toLowerCase()=="muttonwrap"){
                    this.Icost=9;
                    this.stateCur = OrderState.SIZE
                    aReturn.push("select your size");
                    aReturn.push("Large");
                    aReturn.push("regular");
                }
                else if(sInput.toLowerCase()=="vegwrap"){
                    this.Icost=7;
                    this.stateCur = OrderState.SIZE
                    aReturn.push("select your size");
                    aReturn.push("Large");
                    aReturn.push("regular");
                }
                break;
              case OrderState.SIZE:
                  this.sSize = sInput;
                  if(sInput.toLowerCase()!="large" && sInput.toLowerCase()!="regular"){
                      this.stateCur=OrderState.SIZE;
                      aReturn.push("Please Enter a Valid Option")
                  }
                  else if(sInput.toLowerCase()=="large"){
                      this.scost=12;
                      this.stateCur = OrderState.TOPPINGS
                      aReturn.push("What toppings would you like?");
                      aReturn.push("crispyonion");
                      aReturn.push("olives");
                  }
                  else if(sInput.toLowerCase()=="regular"){
                      this.scost=10;
                      this.stateCur = OrderState.TOPPINGS
                      aReturn.push("What toppings would you like?");
                      aReturn.push("crispyonion");
                      aReturn.push("olives");
                  }
                  
                  break;
              case OrderState.TOPPINGS:
                    this.sToppings = sInput;
                    if(sInput.toLowerCase()!="crispyonion" && sInput.toLowerCase()!="olives"){
                        this.stateCur=OrderState.TOPPINGS;
                        aReturn.push("Please Enter a Valid Option") 
                    }
                    if(sInput.toLowerCase()=="crispyonion"){
                        this.Tcost=4;
                        this.stateCur = OrderState.DRINKS
                        aReturn.push("Would you like milkshake with that?");
                        aReturn.push("Yes or no")
                    }
                    if(sInput.toLowerCase()=="olives"){
                        aReturn.push("Would you like milkshake with that?");
                        aReturn.push("Yes or no")
                        this.Tcost=1;
                        this.stateCur = OrderState.DRINKS;
                    }
                    break;
                case OrderState.DRINKS:
                      this.isDone(true);
                      if(sInput!="no"){
                          this.Dcost=5;
                          this.sDrinks = sInput;
                      }
                      aReturn.push("Thank-you for your order of");
                      this.subTotal=this.Icost+this.Tcost+this.scost+this.Dcost;
                      this.Tax=this.subTotal*0.13;
                      this.Total=this.Tax+this.subTotal;
                      aReturn.push(`${this.sSize} ${this.sItems} with ${this.sToppings}`);
                      aReturn.push(`Sub Total=$ ${this.subTotal}`)
                      aReturn.push(`Tax=$ ${this.Tax}`)
                      aReturn.push(`Total=$ ${this.Total}`)
                if(this.sDrinks){
                    aReturn.push(this.sDrinks);
                }
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                this.stateCur = OrderState.PAYMENT;
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.Total = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'AULk_O_SA2chtfX00CHggkWW3l1mBdwV62oW0AYZKaLnew27yUifJ5rSvB6B8ej2NyUt4lXkAXDj0WV0'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you  for your ${this.sItems} order of $${this.Total}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.Total}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}