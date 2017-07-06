var payment_app = {
    payment : {
      mobile_operator: '',
      mobile_num:'',
      mobile_sum:'',
      payment_system:'',
      card_num:'',
      card_exp_date:'',
      card_cvv:''
    },
    init : function(){

      $('#mobile_num').mask('000 00 00');
      $('#mobile_sum').mask('00000');

      this.fill_mobile_operator();
      this.bind_packages_to_mobile_sum();
      this.fill_payment_system();

      //first_stage
      $('#first_stage_finish').click(function(){

        if (this.check_first_stage()){
            this.payment.mobile_operator = $('#mobile_operator').html();
            this.payment.mobile_num = $('#mobile_num').val();
            this.payment.payment_system = $('input[name="payment_system"]:checked').val();
            this.payment.mobile_sum = $('#mobile_sum').val();

            this.show_second_stage();
        }
     }.bind(this));
   },

    fill_payment_system: function(){
      $.getJSON('/fill_images', function(data){
              $('#privat_img').attr('src',data.privat);
              $('#portmone_img').attr('src',data.portmone);
              $('#easy_pay_img').attr('src',data.easypay);
      	});
    },
    fill_mobile_operator: function(){
      $.getJSON('/fill_mobile_operator', function(data){
        $.each(data.mobile_operator, function(i,item){
              $('#mobile_operator_list').append($('<li>').html(item));
            });
          $('#mobile_operator_list > li').on({
                click: function(){
                    $('#mobile_operator').html($(this).html());
                    $('#mobile_operator_list').hide();
                  }
              });
       });
       $('#mobile_operator').click(function(event){
           $('#mobile_operator_list').toggle();
       });
    },
    bind_packages_to_mobile_sum: function(){
      $('#payment_mobile_sum').click(function(event){
        $('#mobile_sum').css('outline','none').css('color', '');
          $('#mobile_sum').val(event.target.value);
        });
      $('#mobile_sum').focus(function(){
        $('#mobile_sum').css('outline','none');
      });
      $('#mobile_num').focus(function(){
        $('#mobile_num').css('outline','none');
      });
    },
    check_first_stage: function(){

      if($('#mobile_num').val() === '' || $('#mobile_num').val().replace(/\s/g,'').length < 7) {
        $('#mobile_num').css('outline',  '2px solid red');
        return false;
      }
      if($('#mobile_sum').val() === '') {
        $('#mobile_sum').css('outline',  '2px solid red');
        return false;
      }
      return true;
    },
    show_second_stage: function(){
      var app = this;
      $.ajax({
          url:'/second_stage',
          dataType:'html',
          success: function(data){
              $('#payment_container').html(data);

              $('#card_num').mask('0000 0000 0000 0000');
              $('#cvv').mask('000');

              app.fill_exp_month();
              app.fill_exp_year();
              $('#second_stage_finish').click(function(){
                  if (app.check_second_stage()){
                      app.payment.card_num = $('#card_num').val();
                      app.payment.card_cvv = $('#cvv').val();
                      app.payment.card_exp_date = $('#exp_month option:selected').text().concat('/').concat($('#exp_year option:selected').text());
                      app.made_payment(app.payment);
                  }
              });
            }
        });
    },
    fill_exp_month:function(){
      $.getJSON('/fill_exp_month', function(data){
        $.each(data.exp_month, function(i,item){
              $('#exp_month').append($('<option>').html(item));
            });
        });
    },

    fill_exp_year:function(){
      $.getJSON('/fill_exp_year', function(data){
        $.each(data.exp_year, function(i,item){
              $('#exp_year').append($('<option>').html(item));
            });
        });
    },
    check_second_stage: function(){

      $('#card_num').focus(function(){
        $('#card_num').css('outline','none');
      });

      $('#cvv').focus(function(){
        $('#cvv').css('outline','none');
      });

      $('#exp_month').focus(function(){
        $('#exp_month').css('outline','none');
      });

      $('#exp_year').focus(function(){
        $('#exp_year').css('outline','none');
      });

      let card_num = $('#card_num').val().replace(/\s/g,'');
      if($('#card_num').val() === '' || card_num.length < 16) {
        $('#card_num').css('outline',  '2px solid red');
        return false;
      }
      if($('#cvv').val() === '' || $('#cvv').val().length < 3) {
        $('#cvv').css('outline',  '2px solid red');
        return false;
      }
      if (!(this.check_credit_card_num(card_num))){
          $('#card_num').css('outline',  '2px solid red');
          console.log('Invalid card number');
          return false;
      }

      if (!(this.check_exp_date())){
        $('#exp_month').css('outline',  '2px solid red');
        $('#exp_year').css('outline',  '2px solid red');
        return false;
      }
      return true;
    },
    check_credit_card_num: function(card_num){
      console.log('4561261212345467');
      let sum_arr = [];
      for (let i = 0; i < card_num.length; i++) {
        if(i%2 == 0){
          let number = card_num[i]*2;
          sum_arr.push(number > 9 ? number-9 : number);
        }
        else{
          sum_arr.push(parseInt(card_num[i]));
        }
      }
      let sum = sum_arr.reduce(function(a,b){return a+b});
      console.log(sum);
      return !(sum%10);
    },

    check_exp_date: function(){

      let today = new Date();

      let exp_month = $('#exp_month option:selected').text();
      let exp_year = $('#exp_year option:selected').text();

      let exp_date = new Date();
      exp_date.setFullYear(exp_year,exp_month-1);

      if (today.getTime() > exp_date.getTime()){
        return false;
      }
      return true;
    },

    made_payment(payment){
        $.ajax({
            url:'/payment',
            data:{ payment_data: payment},
            success: function(data){
                console.log(data);
              //  $('#payment_container').html(data);
            }
       });
  }
};

payment_app.init();
